import { NextResponse } from 'next/server'
import pool from '../../../lib/mysql'
import mysql2 from 'mysql2'

function safeNumber(v: any) {
  if (v === '' || v === undefined || v === null) return null
  const n = Number(v)
  if (Number.isNaN(n)) throw new Error('Invalid number')
  return n
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const action = body.action

    if (action === 'latest') {
      const n = safeNumber(body.n) ?? 10
      const query = `
        SELECT * FROM attack
        ORDER BY StartTimestamp DESC
        LIMIT ?
      `
      const executed = mysql2.format(query, [n])
      const [rows] = await pool.execute(query, [n])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'packets_by_attack') {
      const attackId = safeNumber(body.attackId)
      if (!attackId) return NextResponse.json({ message: 'AttackID required' }, { status: 400 })
      const query = `
        SELECT p.* FROM packet p
        INNER JOIN attack_packet ap ON p.PacketID = ap.PacketID
        WHERE ap.AttackID = ?
        ORDER BY p.Timestamp ASC
      `
      const executed = mysql2.format(query, [attackId])
      const [rows] = await pool.execute(query, [attackId])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'flows_by_attack') {
      const attackId = safeNumber(body.attackId)
      if (!attackId) return NextResponse.json({ message: 'AttackID required' }, { status: 400 })
      const query = `
        SELECT DISTINCT f.* FROM flow f
        INNER JOIN packet p ON f.FlowID = p.FlowID
        INNER JOIN attack_packet ap ON p.PacketID = ap.PacketID
        WHERE ap.AttackID = ?
        ORDER BY f.FlowStartTime ASC
      `
      const executed = mysql2.format(query, [attackId])
      const [rows] = await pool.execute(query, [attackId])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'modifications_by_attack') {
      const attackId = safeNumber(body.attackId)
      if (!attackId) return NextResponse.json({ message: 'AttackID required' }, { status: 400 })
      const query = `
        SELECT am.*, p.PacketID, p.FlowID FROM attack_modification am
        INNER JOIN attack_packet ap ON am.PacketID = ap.PacketID
        INNER JOIN packet p ON am.PacketID = p.PacketID
        WHERE ap.AttackID = ?
        ORDER BY p.Timestamp ASC
      `
      const executed = mysql2.format(query, [attackId])
      const [rows] = await pool.execute(query, [attackId])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'group_by_field') {
      const n = safeNumber(body.n) ?? 10
      const query = `
        SELECT am.ModifiedField, COUNT(*) as occurrences
        FROM attack_modification am
        GROUP BY am.ModifiedField
        ORDER BY occurrences DESC
        LIMIT ?
      `
      const executed = mysql2.format(query, [n])
      const [rows] = await pool.execute(query, [n])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'attacks_by_vuln') {
      const vulnId = safeNumber(body.vulnId)
      if (!vulnId) return NextResponse.json({ message: 'VulnerabilityID required' }, { status: 400 })
      const query = `
        SELECT a.* FROM attack a
        INNER JOIN attack_vulnerability av ON a.AttackID = av.AttackID
        WHERE av.VulnerabilityID = ?
        ORDER BY a.StartTimestamp DESC
      `
      const executed = mysql2.format(query, [vulnId])
      const [rows] = await pool.execute(query, [vulnId])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'count_modified') {
      const attackId = safeNumber(body.attackId)
      if (!attackId) return NextResponse.json({ message: 'AttackID required' }, { status: 400 })
      const query = `
        SELECT COUNT(DISTINCT am.PacketID) as modified_count
        FROM attack_modification am
        INNER JOIN attack_packet ap ON am.PacketID = ap.PacketID
        WHERE ap.AttackID = ?
      `
      const executed = mysql2.format(query, [attackId])
      const [rows] = await pool.execute(query, [attackId])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'forensic_report') {
      const attackId = safeNumber(body.attackId)
      if (!attackId) return NextResponse.json({ message: 'AttackID required' }, { status: 400 })
      const query = `
        SELECT ap.AttackID, p.*, am.ModifiedField, am.OriginalValue, am.ModiifedValue
        FROM attack_packet ap
        INNER JOIN packet p ON ap.PacketID = p.PacketID
        LEFT JOIN attack_modification am ON p.PacketID = am.PacketID
        WHERE ap.AttackID = ?
        ORDER BY p.Timestamp ASC
      `
      const executed = mysql2.format(query, [attackId])
      const [rows] = await pool.execute(query, [attackId])
      return NextResponse.json({ executed, rows })
    }

    return NextResponse.json({ message: 'Unknown action' }, { status: 400 })
  } catch (err: any) {
    console.error('Attack API error:', err)
    return NextResponse.json({ message: err.message || 'Error' }, { status: 500 })
  }
}

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

    if (action === 'top_by_packets') {
      const n = safeNumber(body.n) ?? 10
      const query = `
        SELECT f.*, COUNT(p.PacketID) as packet_count
        FROM flow f
        LEFT JOIN packet p ON f.FlowID = p.FlowID
        GROUP BY f.FlowID
        ORDER BY packet_count DESC
        LIMIT ?
      `
      const executed = mysql2.format(query, [n])
      const [rows] = await pool.execute(query, [n])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'packets_by_flow') {
      const flowId = safeNumber(body.flowId)
      if (!flowId) return NextResponse.json({ message: 'FlowID required' }, { status: 400 })
      const query = `
        SELECT * FROM packet
        WHERE FlowID = ?
        ORDER BY Timestamp ASC
      `
      const executed = mysql2.format(query, [flowId])
      const [rows] = await pool.execute(query, [flowId])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'with_modifications') {
      const query = `
        SELECT DISTINCT f.* FROM flow f
        INNER JOIN packet p ON f.FlowID = p.FlowID
        INNER JOIN attack_modification am ON p.PacketID = am.PacketID
        ORDER BY f.FlowID
      `
      const executed = mysql2.format(query, [])
      const [rows] = await pool.execute(query, [])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'by_label') {
      let label = (body.label || 'covert').toString()
      if (label === 'normal') label = 'normal'
      const query = `
        SELECT * FROM flow
        WHERE Label = ?
        ORDER BY FlowStartTime DESC
      `
      const executed = mysql2.format(query, [label])
      const [rows] = await pool.execute(query, [label])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'modified_fields') {
      const flowId = safeNumber(body.flowId)
      if (!flowId) return NextResponse.json({ message: 'FlowID required' }, { status: 400 })
      const query = `
        SELECT am.ModifiedField, COUNT(*) as occurrences
        FROM attack_modification am
        INNER JOIN packet p ON am.PacketID = p.PacketID
        WHERE p.FlowID = ?
        GROUP BY am.ModifiedField
        ORDER BY occurrences DESC
      `
      const executed = mysql2.format(query, [flowId])
      const [rows] = await pool.execute(query, [flowId])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'during_attack') {
      const attackId = safeNumber(body.attackId)
      if (!attackId) return NextResponse.json({ message: 'AttackID required' }, { status: 400 })
      const query = `
        SELECT DISTINCT f.* FROM flow f
        INNER JOIN packet p ON f.FlowID = p.FlowID
        INNER JOIN attack_packet ap ON p.PacketID = ap.PacketID
        INNER JOIN attack a ON ap.AttackID = a.AttackID
        WHERE a.AttackID = ?
        AND f.FlowStartTime >= a.StartTimestamp
        AND f.FlowEndTime <= a.EndTimestamp
        ORDER BY f.FlowStartTime ASC
      `
      const executed = mysql2.format(query, [attackId])
      const [rows] = await pool.execute(query, [attackId])
      return NextResponse.json({ executed, rows })
    }

    return NextResponse.json({ message: 'Unknown action' }, { status: 400 })
  } catch (err: any) {
    console.error('Flow API error:', err)
    return NextResponse.json({ message: err.message || 'Error' }, { status: 500 })
  }
}

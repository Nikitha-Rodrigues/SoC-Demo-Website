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

    if (action === 'by_id') {
      const packetId = safeNumber(body.packetId)
      if (!packetId) return NextResponse.json({ message: 'PacketID required' }, { status: 400 })
      const query = `
        SELECT p.*, am.ModifiedField, am.OriginalValue, am.ModiifedValue, ap.AttackID
        FROM packet p
        LEFT JOIN attack_modification am ON p.PacketID = am.PacketID
        LEFT JOIN attack_packet ap ON p.PacketID = ap.PacketID
        WHERE p.PacketID = ?
      `
      const executed = mysql2.format(query, [packetId])
      const [rows] = await pool.execute(query, [packetId])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'covert') {
      const limit = safeNumber(body.limit) ?? 1000
      const offset = safeNumber(body.offset) ?? 0
      const query = `
        SELECT * FROM packet
        WHERE label = 'covert'
        ORDER BY Timestamp ASC
        LIMIT ${limit}
        OFFSET ${offset}
      `
      const executed = mysql2.format(query, [limit, offset])
      const [rows] = await pool.execute(query, [limit, offset])
      return NextResponse.json({ executed, rows })
    }

    if (action === 'by_protocol') {
      const protocol = (body.protocol || 'TCP').toString()
      if (protocol === 'ALL') {
        const query = `
          SELECT Protocol, COUNT(*) as PacketCount
          FROM packet
          GROUP BY Protocol
          ORDER BY PacketCount DESC
        `
        const executed = mysql2.format(query)
        const [rows] = await pool.execute(query)
        return NextResponse.json({ executed, rows })
      } else {
        const limit = safeNumber(body.limit) ?? 1000
        const offset = safeNumber(body.offset) ?? 0
        let query = `
          SELECT * FROM packet
          WHERE Protocol = '${protocol}'
          ORDER BY Timestamp ASC
        `
        query += `\nLIMIT ${limit} OFFSET ${offset}`
        const executed = mysql2.format(query, [protocol, limit, offset])
        const [rows] = await pool.execute(query, [protocol, limit, offset])
        return NextResponse.json({ executed, rows })
      }
    }

    if (action === 'by_flow') {
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

    if (action === 'modified') {
      const limit = safeNumber(body.limit) ?? 1000
      const offset = safeNumber(body.offset) ?? 0
      const query = `
        SELECT DISTINCT p.* FROM packet p
        INNER JOIN attack_modification am ON p.PacketID = am.PacketID
        ORDER BY p.Timestamp DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `
      const executed = mysql2.format(query, [limit, offset])
      const [rows] = await pool.execute(query, [limit, offset])
      return NextResponse.json({ executed, rows })
    }

    return NextResponse.json({ message: 'Unknown action' }, { status: 400 })
  } catch (err: any) {
    console.error('Packet API error:', err)
    return NextResponse.json({ message: err.message || 'Error' }, { status: 500 })
  }
}

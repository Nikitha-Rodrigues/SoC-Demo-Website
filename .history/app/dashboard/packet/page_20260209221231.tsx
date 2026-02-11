"use client"
import { useState } from 'react'
import NumberInput from '../../../components/NumberInput'
import Select from '../../../components/Select'
import DataTable from '../../../components/DataTable'

const queries = [
  { name: 'Get Packet Details by ID', key: 'by_id' },
  { name: 'Show Covert Packets', key: 'covert' },
  { name: 'Packet Count by Protocol', key: 'by_protocol' },
  { name: 'Packets by FlowID', key: 'by_flow' },
  { name: 'Show Modified Packets', key: 'modified' }
]

export default function PacketPage(){
  const [selected, setSelected] = useState('by_id')
  const [packetId, setPacketId] = useState<number | ''>('')
  const [flowId, setFlowId] = useState<number | ''>('')
  const [protocol, setProtocol] = useState('TCP')
  const [output, setOutput] = useState<any>(null)
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState<number | ''>(1000)
  const [offset, setOffset] = useState<number | ''>(0)
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/packet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: selected, packetId, flowId, protocol, limit, offset, showAll })
      })
      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch (e) {
        setQuery('Non-JSON response from server:\n' + text.slice(0, 2000))
        setOutput(null)
        setLoading(false)
        return
      }

      if (!res.ok) {
        setQuery(data?.executed || '')
        setOutput([])
        alert('Server error: ' + (data?.message || res.status))
      } else {
        setQuery(data?.executed || '')
        setOutput(data?.rows || [])
      }
    } catch (err) {
      alert('Error: ' + (err as any).message)
    }
    setLoading(false)
  }

  const reset = () => {
    setPacketId('')
    setFlowId('')
    setProtocol('TCP')
    setLimit(1000)
    setOffset(0)
    setShowAll(false)
    setOutput(null)
    setQuery('')
  }

  return (
    <div className="space-y-8">
      <h1 className="font-playfair text-3xl">Packet Analysis</h1>

      <div className="bg-section rounded-xl p-6">
        <label className="text-subtext text-sm uppercase tracking-wide">Select Query</label>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {queries.map(q => (
            <button
              key={q.key}
              onClick={() => { setSelected(q.key); setOutput(null); setQuery('') }}
              className={`px-3 py-2 rounded text-sm transition ${
                selected === q.key
                  ? 'bg-accent text-light'
                  : 'bg-[#071913] text-subtext hover:bg-accent/20'
              }`}
            >
              {q.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-section rounded-xl p-6 space-y-4">
        {selected === 'by_id' && (
          <NumberInput label="PacketID" value={packetId} onChange={v => setPacketId(v)} />
        )}

        {selected === 'by_protocol' && (
          <div className="space-y-2">
            <Select label="Protocol" value={protocol} onChange={setProtocol} options={["TCP","UDP","ALL"]} />
            {protocol !== 'ALL' && (
              <div className="flex gap-3">
                <NumberInput label="Limit" value={limit} onChange={v=>setLimit(v)} />
                <NumberInput label="Offset" value={offset} onChange={v=>setOffset(v)} />
                <label className="flex items-end text-subtext">
                  <input className="mr-2" type="checkbox" checked={showAll} onChange={e=>setShowAll(e.target.checked)} />
                  Show all
                </label>
              </div>
            )}
          </div>
        )}

        {selected === 'modified' && (
          <div className="space-y-2">
            <NumberInput label="FlowID" value={flowId} onChange={v => setFlowId(v)} />
            <div className="flex gap-3">
              <NumberInput label="Limit" value={limit} onChange={v=>setLimit(v)} />
              <NumberInput label="Offset" value={offset} onChange={v=>setOffset(v)} />
              <label className="flex items-end text-subtext">
                <input className="mr-2" type="checkbox" checked={showAll} onChange={e=>setShowAll(e.target.checked)} />
                Show all
              </label>
            </div>
          </div>
        )}

        {selected === 'by_flow' && (
          <NumberInput label="FlowID" value={flowId} onChange={v => setFlowId(v)} />
        )}

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-2 bg-accent rounded-xl text-light hover:brightness-110 disabled:opacity-50 transition"
          >
            {loading ? 'Executing...' : 'Execute Query'}
          </button>
          <button onClick={reset} className="px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition">
            Reset
          </button>
        </div>
      </div>

      {query && (
        <div>
          <div className="text-subtext text-sm uppercase tracking-wide mb-2">Executed SQL</div>
          <pre className="bg-[#081514] p-4 rounded-xl max-h-40 overflow-auto text-xs border border-white/5">
            {query}
          </pre>
        </div>
      )}

      {output && (
        <div>
          <div className="text-subtext text-sm uppercase tracking-wide mb-2">Results ({output.length})</div>
          <div className="max-h-[70vh] overflow-auto rounded-xl border border-white/5">
            <DataTable data={output} />
          </div>
        </div>
      )}
    </div>
  )
}

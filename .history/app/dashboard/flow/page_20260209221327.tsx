"use client"
import { useState } from 'react'
import NumberInput from '../../../components/NumberInput'
import Select from '../../../components/Select'
import DataTable from '../../../components/DataTable'

const queries = [
  { name: 'Top Flows by Packet Count', key: 'top_by_packets' },
  { name: 'Packets in FlowID', key: 'packets_by_flow' },
  { name: 'Filter by Label (Covert/Normal)', key: 'by_label' },
  { name: 'Fields Modified in Flow', key: 'modified_fields' }
]

export default function FlowPage(){
  const [selected, setSelected] = useState('top_by_packets')
  const [topN, setTopN] = useState<number | ''>(10)
  const [flowId, setFlowId] = useState<number | ''>('')
  const [label, setLabel] = useState('covert')
  const [attackId, setAttackId] = useState<number | ''>('')
  const [output, setOutput] = useState<any>(null)
  const [queryStr, setQueryStr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: selected, n: topN, flowId, label, attackId })
      })
      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch (e) {
        setQueryStr('Non-JSON response from server:\n' + text.slice(0, 2000))
        setOutput(null)
        setLoading(false)
        return
      }

      if (!res.ok) {
        setQueryStr(data?.executed || '')
        setOutput([])
        alert('Server error: ' + (data?.message || res.status))
      } else {
        setQueryStr(data?.executed || '')
        setOutput(data?.rows || [])
      }
    } catch (err) {
      alert('Error: ' + (err as any).message)
    }
    setLoading(false)
  }

  const reset = () => {
    setTopN(10)
    setFlowId('')
    setLabel('covert')
    setAttackId('')
    setOutput(null)
    setQueryStr('')
  }

  return (
    <div className="space-y-8">
      <h1 className="font-playfair text-3xl">Flow Analysis</h1>

      <div className="bg-section rounded-xl p-6">
        <label className="text-subtext text-sm uppercase tracking-wide">Select Query</label>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {queries.map(q => (
            <button
              key={q.key}
              onClick={() => { setSelected(q.key); setOutput(null); setQueryStr('') }}
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
        {selected === 'top_by_packets' && (
          <NumberInput label="Limit (Top N)" value={topN} onChange={v => setTopN(v)} />
        )}

        {selected === 'packets_by_flow' && (
          <NumberInput label="FlowID" value={flowId} onChange={v => setFlowId(v)} />
        )}

        {selected === 'by_label' && (
          <Select label="Label" value={label} onChange={setLabel} options={['covert', 'normal']} />
        )}

        {selected === 'modified_fields' && (
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

      {queryStr && (
        <div>
          <div className="text-subtext text-sm uppercase tracking-wide mb-2">Executed SQL</div>
          <pre className="bg-[#081514] p-4 rounded-xl max-h-40 overflow-auto text-xs border border-white/5">
            {queryStr}
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

"use client"
import { useState } from 'react'
import DataTable from '../../components/DataTable'
import NumberInput from '../../components/NumberInput'
import Select from '../../components/Select'

const queries = [
  { name: 'Show Latest N Attacks', key: 'latest' },
  { name: 'Get Packet List by AttackID', key: 'packets_by_attack' },
  { name: 'Show Flows Impacted by Attack', key: 'flows_by_attack' },
  { name: 'Display Field Modifications', key: 'modifications_by_attack' },
  { name: 'Group Attacks by Modified Field', key: 'group_by_field' },
  { name: 'Attacks Exploiting Vulnerability', key: 'attacks_by_vuln' },
  { name: 'Count Modified Packets in Attack', key: 'count_modified' },
  { name: 'Generate Forensic Report', key: 'forensic_report' }
]

export default function AttackPage() {
  const [selected, setSelected] = useState('latest')
  const [n, setN] = useState<number | ''>(10)
  const [attackId, setAttackId] = useState<number | ''>('')
  const [vulnId, setVulnId] = useState<number | ''>('')
  const [groupField, setGroupField] = useState('Seq')
  const [output, setOutput] = useState<any>(null)
  const [queryStr, setQueryStr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: selected, n, attackId, vulnId, groupField })
      })
      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch (e) {
        // Non-JSON response (probably an HTML error page)
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
    setOutput(null)
    setQueryStr('')
    setN(10)
    setAttackId('')
    setVulnId('')
    setGroupField('Seq')
  }

  return (
    <div className="space-y-8">
      <h1 className="font-playfair text-3xl">Attack Investigation & Correlation</h1>

      {/* Query Selection */}
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

      {/* Input Fields */}
      <div className="bg-section rounded-xl p-6 space-y-4">
        {['latest', 'group_by_field'].includes(selected) && (
          <NumberInput label="Limit (N)" value={n} onChange={v => setN(v)} />
        )}

        {['packets_by_attack', 'flows_by_attack', 'modifications_by_attack', 'count_modified', 'forensic_report'].includes(selected) && (
          <NumberInput label="AttackID" value={attackId} onChange={v => setAttackId(v)} />
        )}

        {selected === 'attacks_by_vuln' && (
          <NumberInput label="VulnerabilityID" value={vulnId} onChange={v => setVulnId(v)} />
        )}

        {selected === 'group_by_field' && (
          <Select
            label="Group by Field"
            value={groupField}
            onChange={setGroupField}
            options={['Seq', 'Window', 'Ack', 'IPID', 'TTL', 'IAT', 'UDPLength']}
          />
        )}

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-2 bg-accent rounded-xl text-light hover:brightness-110 disabled:opacity-50 transition"
          >
            {loading ? 'Executing...' : 'Execute Query'}
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Output */}
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

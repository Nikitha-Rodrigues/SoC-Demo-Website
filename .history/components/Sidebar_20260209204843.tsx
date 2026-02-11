"use client"
import { usePathname } from 'next/navigation'

export default function Sidebar(){
  const pathname = usePathname()
  const section = pathname.split('/dashboard/')[1]?.split('/')[0] || 'attack'

  const attackOptions = [
    'Show Latest N Attacks',
    'Get Packet List by AttackID',
    'Show Flows Impacted by Attack',
    'Display Field Modifications',
    'Group Attacks by Modified Field',
    'Attacks Exploiting Vulnerability',
    'Count Modified Packets in Attack',
    'Generate Forensic Report'
  ]

  const packetOptions = [
    'Get Packet Details by ID',
    'Show Covert Packets',
    'Packet Count by Protocol',
    'Packets by FlowID',
    'Show Modified Packets'
  ]

  const flowOptions = [
    'Top Flows by Packet Count',
    'Packets in FlowID',
    'Flows with Modified Packets',
    'Filter by Label (Covert/Non-benign)',
    'Flows During Attack Timeframe'
  ]

  const options = section === 'attack' ? attackOptions : section === 'packet' ? packetOptions : flowOptions

  return (
    <div className="space-y-6">
      <div>
        <div className="text-subtext text-xs uppercase tracking-wide mb-4">Query Options</div>
        <div className="space-y-1">
          {options.map((opt, idx) => (
            <button
              key={idx}
              className="w-full text-left px-3 py-2 rounded hover:bg-accent/20 text-sm text-light transition"
              onClick={() => document.querySelector(`[data-option="${opt}"]`)?.scrollIntoView({ behavior: 'smooth' })}
            >
              {idx + 1}. {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

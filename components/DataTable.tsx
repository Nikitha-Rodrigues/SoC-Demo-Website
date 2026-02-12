export default function DataTable({ data }: { data: any }){
  if (!data || !Array.isArray(data) || data.length === 0) return <div className="text-subtext">No results</div>
  const headers = Object.keys(data[0] || {})
  return (
    <div className="rounded-lg border border-white/5 overflow-auto bg-[#06110f] p-2">
      <table className="min-w-full table-auto text-sm">
        <thead>
          <tr className="text-subtext text-left">
            {headers.map(h => <th key={h} className="px-3 py-2">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, idx:number) => (
            <tr key={idx} className="hover:bg-white/2 transition">
              {headers.map(h => <td key={h} className="px-3 py-2 align-top">{String(row[h])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

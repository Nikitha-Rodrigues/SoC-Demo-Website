export default function Select({label, value, onChange, options}:{label:string, value:string, onChange:(v:string)=>void, options:string[]}){
  return (
    <div>
      <label className="text-subtext">{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-[#071913] text-light">
        {options.map(o=> <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

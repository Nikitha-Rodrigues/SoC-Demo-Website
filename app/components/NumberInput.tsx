export default function NumberInput({label, value, onChange}:{label:string, value:number | '', onChange:(v:number|'')=>void}){
  return (
    <div>
      <label className="text-subtext">{label}</label>
      <input type="number" value={value as any} onChange={e=>{
        const v = e.target.value
        if (v === '') return onChange('')
        const n = Number(v)
        if (Number.isNaN(n)) return
        onChange(n)
      }} className="w-full mt-1 p-3 rounded-lg bg-[#071913] text-light appearance-none" />
    </div>
  )
}

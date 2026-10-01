export default function MonthNav({y,m,set}:{y:number;m:number;set:(y:number,m:number)=>void}){
  const t=new Date(),go=(d:number)=>{const n=new Date(y,m+d,1);set(n.getFullYear(),n.getMonth())}
  const b='rounded-xl bg-white px-2 py-1 text-sm font-bold'
  return <div className="flex flex-wrap items-center gap-1">
    <button aria-label="Previous month" className={b} onClick={()=>go(-1)}>‹</button>
    <select aria-label="Month" value={m} onChange={e=>set(y,+e.target.value)} className={b}>{Array.from({length:12},(_,i)=><option key={i} value={i}>{new Date(2000,i,1).toLocaleDateString([],{month:'long'})}</option>)}</select>
    <select aria-label="Year" value={y} onChange={e=>set(+e.target.value,m)} className={b}>{Array.from({length:21},(_,i)=>t.getFullYear()-10+i).map(v=><option key={v}>{v}</option>)}</select>
    <button aria-label="Next month" className={b} onClick={()=>go(1)}>›</button>
    <button className={b} onClick={()=>set(t.getFullYear(),t.getMonth())}>Today</button>
  </div>
}

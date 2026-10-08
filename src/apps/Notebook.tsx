import {useState} from 'react'
import Todo from './Todo'
import {useLocalStorage} from '../hooks/useLocalStorage'
type Note={id:number;body:string;color:string;pin:boolean;cr:number;mod:number}
const COL=['#fff0b8','#ffd4dc','#d9d0f5','#cfe9f7','#d3ecd2']
function Notes(){
  const [ns,setNs]=useLocalStorage<Note[]>('scd-notes',[]),[q,setQ]=useState(''),[id,setId]=useState<number|null>(null)
  const cur=ns.find(n=>n.id===id)
  const upd=(p:Partial<Note>)=>setNs(s=>s.map(n=>n.id===id?{...n,...p,mod:Date.now()}:n))
  const add=()=>{const n:Note={id:Date.now(),body:'',color:COL[ns.length%5],pin:false,cr:Date.now(),mod:Date.now()};setNs(s=>[n,...s]);setId(n.id)}
  const list=ns.filter(n=>n.body.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>+b.pin-+a.pin||b.mod-a.mod)
  const flip=(li:number)=>{const L=cur!.body.split('\n');L[li]=(L[li].startsWith('[x] ')?'[ ] ':'[x] ')+L[li].slice(4);upd({body:L.join('\n')})}
  const b='rounded-xl bg-white/90 px-2 py-1 text-xs font-bold'
  return <div className="grid gap-2 p-3 sm:grid-cols-[150px_1fr]">
    <div className="space-y-1"><div className="flex gap-1"><input value={q} onChange={e=>setQ(e.target.value)} aria-label="Search notes" placeholder="Search…" className="min-w-0 flex-1 rounded-xl bg-white/90 p-1 text-sm"/><button aria-label="New note" onClick={add} className={b}>＋</button></div>
      <ul className="max-h-40 space-y-1 overflow-auto sm:max-h-none">{list.map(n=><li key={n.id}><button onClick={()=>setId(n.id)} aria-current={n.id===id} style={{background:n.color}} className={`w-full truncate rounded-xl p-2 text-left text-xs font-bold ${n.id===id?'ring-2 ring-[#b9a3e3]':''}`}>{n.pin&&'📌 '}{n.body.split('\n')[0]||'Untitled'}</button></li>)}</ul></div>
    {cur?<div className="relative rounded-2xl p-3 pt-5 shadow" style={{background:cur.color}}>
      <i className="absolute -top-2 left-6 h-4 w-20 rotate-[-3deg] bg-[repeating-linear-gradient(45deg,#fff8,#fff8_4px,#b9a3e388_4px,#b9a3e388_8px)]"/><span className="absolute right-3 top-1" aria-hidden>🌸</span>
      <div className="mb-1 flex flex-wrap items-center gap-1">{COL.map(c=><button key={c} aria-label={`Colour ${c}`} onClick={()=>upd({color:c})} className="h-5 w-5 rounded-full border border-black/20" style={{background:c}}/>)}
        <button className={b} aria-pressed={cur.pin} onClick={()=>upd({pin:!cur.pin})}>📌 Pin</button><button className={b} onClick={()=>upd({body:cur.body+(cur.body&&!cur.body.endsWith('\n')?'\n':'')+'[ ] '})}>☑ Item</button>
        <button className={b} onClick={()=>{setNs(s=>s.filter(n=>n.id!==id));setId(null)}}>Delete</button></div>
      <textarea value={cur.body} maxLength={2000} onChange={e=>upd({body:e.target.value})} aria-label="Note text" rows={7} className="w-full resize-none bg-transparent text-sm leading-[28px] outline-none" style={{backgroundImage:'repeating-linear-gradient(transparent,transparent 27px,#d9a8b8 28px)'}}/>
      {cur.body.split('\n').map((l,li)=>/^\[[ x]\] /.test(l)&&<label key={li} className="flex gap-2 text-sm"><input type="checkbox" checked={l[1]==='x'} onChange={()=>flip(li)}/>{l.slice(4)}</label>)}
      <p className="mt-1 text-[11px] opacity-70">{cur.body.length}/2000 · created {new Date(cur.cr).toLocaleDateString()} · edited {new Date(cur.mod).toLocaleString()}</p></div>
    :<div className="grid place-items-center rounded-2xl bg-white/60 p-4 text-center text-sm font-bold">
<img src="/cat/sleeping-cat.png/>
 
<p>
Shhh, Mochi is napping on the notebook. 💤
<br />
Tap ＋ to write a note.
</p>
</div>
)}
</div>
}
export default function Notebook(){
  const [t,setT]=useState<'notes'|'todo'>('notes')
  return <div><div role="tablist" className="flex gap-1 px-3 pt-3">{(['notes','todo'] as const).map(v=><button key={v} role="tab" aria-selected={t===v} onClick={()=>setT(v)} className={`rounded-full px-3 py-1 text-sm font-bold ${t===v?'bg-pink-300':'bg-white/80'}`}>{v==='notes'?'Notes':'To-do'}</button>)}</div>{t==='notes'?<Notes/>:<Todo/>}</div>
}

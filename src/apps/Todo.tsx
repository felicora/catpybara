import {useState} from 'react'
import {useLocalStorage} from '../hooks/useLocalStorage'
type Task={id:number;t:string;done:boolean}
export default function Todo(){
  const [ts,setTs]=useLocalStorage<Task[]>('scd-todo',[]),[v,setV]=useState('')
  const add=(e:React.FormEvent)=>{e.preventDefault();if(!v.trim())return;setTs(s=>[...s,{id:Date.now(),t:v.trim(),done:false}]);setV('')}
  const mv=(i:number,d:number)=>setTs(s=>{const c=[...s],j=i+d;if(j<0||j>=c.length)return s;[c[i],c[j]]=[c[j],c[i]];return c})
  const left=ts.filter(t=>!t.done).length,btn='rounded-lg bg-white px-1.5 text-xs'
  return <div className="space-y-2 p-3">
    <form onSubmit={add} className="flex gap-2"><input value={v} onChange={e=>setV(e.target.value)} aria-label="New task" placeholder="Add a task…" className="min-w-0 flex-1 rounded-xl bg-white/90 p-2 text-sm"/><button className="rounded-xl bg-pink-200 px-3 text-sm font-bold">Add</button></form>
    {ts.length>0&&left===0&&<p role="status" className="animate-bounce rounded-2xl bg-yellow-100 p-2 text-center text-sm font-black">🐱🎉 All done! Nap time.</p>}
    <ul className="space-y-1">{ts.map((t,i)=><li key={t.id} className="flex items-center gap-2 rounded-xl bg-white/80 p-2 text-sm">
      <input type="checkbox" checked={t.done} aria-label={`Complete ${t.t}`} onChange={()=>setTs(s=>s.map(x=>x.id===t.id?{...x,done:!x.done}:x))} className="h-4 w-4 accent-pink-400"/>
      <span className={`flex-1 ${t.done?'line-through opacity-50':''}`}>{t.t}</span>
      <button aria-label="Move up" className={btn} onClick={()=>mv(i,-1)}>↑</button><button aria-label="Move down" className={btn} onClick={()=>mv(i,1)}>↓</button>
      <button aria-label={`Delete ${t.t}`} className={btn} onClick={()=>setTs(s=>s.filter(x=>x.id!==t.id))}>✕</button></li>)}</ul>
    <p className="text-xs font-bold opacity-70">{left} task{left===1?'':'s'} remaining</p>
  </div>
}

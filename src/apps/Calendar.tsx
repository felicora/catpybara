import {useState} from 'react'
import {useLocalStorage} from '../hooks/useLocalStorage'
import MonthNav from '../components/MonthNav'
import {dkey,monthGrid,weekdays} from '../utils/date'
export default function Calendar(){
  const t=new Date()
  const [[y,m],setYM]=useState([t.getFullYear(),t.getMonth()])
  const [notes,setNotes]=useLocalStorage<Record<string,string>>('scd-cal',{})
  const [sel,setSel]=useState(dkey(t)),[txt,setTxt]=useState(notes[dkey(t)]??'')
  const pick=(k:string)=>{setSel(k);setTxt(notes[k]??'')}
  const save=()=>setNotes(n=>{const c={...n};if(txt.trim())c[sel]=txt.trim();else delete c[sel];return c})
  const del=()=>{setNotes(n=>{const c={...n};delete c[sel];return c});setTxt('')}
  return <div className="space-y-2 p-3">
    <MonthNav y={y} m={m} set={(a,b)=>setYM([a,b])}/>
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {weekdays().map(w=><b key={w}>{w}</b>)}
      {monthGrid(y,m).map((d,i)=>{if(!d)return <span key={i}/>
        const k=dkey(d)
        return <button key={k} onClick={()=>pick(k)} aria-pressed={k===sel} aria-label={`${k}${notes[k]?', has a note':''}`} className={`relative aspect-square rounded-xl text-sm font-bold ${k===dkey(t)?'bg-pink-300':'bg-white/80'} ${k===sel?'ring-2 ring-[#b9a3e3]':''}`}>
          {d.getDate()}{notes[k]&&<i className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#9b7bd6]"/>}</button>})}
    </div>
    <label className="block text-xs font-bold">Note for {sel}
      <textarea value={txt} onChange={e=>setTxt(e.target.value)} rows={3} maxLength={300} className="mt-1 w-full rounded-xl bg-white/90 p-2 text-sm font-normal"/></label>
    <div className="flex gap-2 text-sm font-bold"><button onClick={save} className="rounded-xl bg-pink-200 px-3 py-1">Save note</button>{notes[sel]&&<button onClick={del} className="rounded-xl bg-white px-3 py-1">Delete</button>}</div>
  </div>
}

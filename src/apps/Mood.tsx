import {useState} from 'react'
import {createPortal} from 'react-dom'
import {motion} from 'framer-motion'
import {useLocalStorage} from '../hooks/useLocalStorage'
import MonthNav from '../components/MonthNav'
import {dkey,monthGrid,weekdays} from '../utils/date'
type Entry={mood:string;note:string}
const MOODS=[
  {id:'wonderful',label:'Wonderful',c:'#ffd166',eye:'M11 19q3-4 6 0M23 19q3-4 6 0',mouth:'M15 25q5 6 10 0z'},
  {id:'happy',label:'Happy',c:'#ffb3c7',eye:'dot',mouth:'M16 25q4 4 8 0'},
  {id:'calm',label:'Calm',c:'#a8d8b9',eye:'M11 19q3 3 6 0M23 19q3 3 6 0',mouth:'M17 26q3 2 6 0'},
  {id:'tired',label:'Tired',c:'#cdb8ef',eye:'M11 20h6M23 20h6',mouth:'M17 27h6'},
  {id:'sad',label:'Sad',c:'#a9cdf0',eye:'dot',mouth:'M16 28q4-4 8 0'},
  {id:'stressed',label:'Stressed',c:'#f7a48b',eye:'dot',mouth:'M14 27q2-3 4 0t4 0t4 0'}]
const SCORE:Record<string,number>={wonderful:5,happy:4,calm:3,tired:2,sad:1,stressed:1}
const label=(id?:string)=>MOODS.find(m=>m.id===id)?.label??'–'
function CatFace({id,size=32}:{id:string;size?:number}){
  const m=MOODS.find(x=>x.id===id)!
  return <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden><path d="M8 14 9 3l9 6zM32 14 31 3l-9 6z" fill={m.c}/><circle cx="20" cy="22" r="14" fill={m.c}/>
    {m.eye==='dot'?<><circle cx="14" cy="20" r={id==='stressed'?2.8:1.8} fill="#4a3228"/><circle cx="26" cy="20" r={id==='stressed'?2.8:1.8} fill="#4a3228"/></>:<path d={m.eye} stroke="#4a3228" strokeWidth="2" fill="none" strokeLinecap="round"/>}
    <path d={m.mouth} stroke="#4a3228" strokeWidth="2" fill={id==='wonderful'?'#f7a8c0':'none'} strokeLinecap="round"/></svg>
}
export default function Mood(){
  const t=new Date()
  const [[y,m],setYM]=useState([t.getFullYear(),t.getMonth()])
  const [es,setEs]=useLocalStorage<Record<string,Entry>>('scd-mood',{})
  const [sel,setSel]=useState(dkey(t)),[mood,setMood]=useState(es[dkey(t)]?.mood??''),[note,setNote]=useState(es[dkey(t)]?.note??'')
  const [tab,setTab]=useState<'week'|'month'|'year'>('week')
  const pick=(k:string)=>{setSel(k);setMood(es[k]?.mood??'');setNote(es[k]?.note??'')}
  const [fly,setFly]=useState<{x:number;y:number;dx:number;dy:number;mood:string}|null>(null)
  /** Save, then arc the chosen cat face from the button to its calendar day. */
  const save=(e:React.MouseEvent)=>{setEs(s=>({...s,[sel]:{mood,note}}))
    const to=document.querySelector(`[data-k="${sel}"]`)?.getBoundingClientRect(),from=e.currentTarget.getBoundingClientRect()
    if(to&&!matchMedia('(prefers-reduced-motion:reduce)').matches)setFly({x:from.x,y:from.y,dx:to.x-from.x,dy:to.y-from.y,mood})}
  const week=dkey(new Date(t.getFullYear(),t.getMonth(),t.getDate()-6))
  const list=Object.entries(es).filter(([k])=>tab==='week'?k>=week&&k<=dkey(t):k.startsWith(tab==='month'?`${y}-${String(m+1).padStart(2,'0')}`:`${y}`))
  const cnt:Record<string,number>={};list.forEach(([,e])=>{cnt[e.mood]=(cnt[e.mood]??0)+1})
  const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0]?.[0]
  const best=[...list].sort((a,b)=>SCORE[b[1].mood]-SCORE[a[1].mood]||(a[0]<b[0]?1:-1))[0]?.[0]
  let streak=0;const d=new Date(t);if(!es[dkey(d)])d.setDate(d.getDate()-1);while(es[dkey(d)]){streak++;d.setDate(d.getDate()-1)}
  return <div className="space-y-2 p-3">
    <MonthNav y={y} m={m} set={(a,b)=>setYM([a,b])}/>
    <div className="grid grid-cols-7 gap-1 text-center text-xs">{weekdays().map(w=><b key={w}>{w}</b>)}
      {monthGrid(y,m).map((dt,i)=>{if(!dt)return <span key={i}/>;const k=dkey(dt),e=es[k]
        return <button key={k} data-k={k} onClick={()=>pick(k)} aria-pressed={k===sel} aria-label={`${k}${e?`, ${label(e.mood)}`:''}`} className={`grid aspect-square place-items-center rounded-xl bg-white/80 text-[11px] font-bold ${k===sel?'ring-2 ring-[#b9a3e3]':''}`}>{e?<CatFace id={e.mood} size={22}/>:dt.getDate()}</button>})}</div>
    <p className="text-xs font-black">How was {sel}?</p>
    <div className="grid grid-cols-3 gap-1">{MOODS.map(o=><button key={o.id} aria-pressed={mood===o.id} onClick={()=>setMood(o.id)} style={{background:o.c}} className={`flex items-center gap-1 rounded-xl p-1 text-xs font-bold ${mood===o.id?'ring-2 ring-[#4a3228]':''}`}><CatFace id={o.id} size={24}/>{o.label}</button>)}</div>
    <input value={note} maxLength={120} onChange={e=>setNote(e.target.value)} aria-label="Short note" placeholder="Optional short note" className="w-full rounded-xl bg-white/90 p-2 text-sm"/>
    <div className="flex gap-2 text-sm font-bold"><button disabled={!mood} onClick={save} className="rounded-xl bg-pink-200 px-3 py-1 disabled:opacity-40">Save mood</button>
      {es[sel]&&<button className="rounded-xl bg-white px-3 py-1" onClick={()=>{setEs(s=>{const c={...s};delete c[sel];return c});setMood('');setNote('')}}>Delete</button>}</div>
    <div className="rounded-2xl bg-white/70 p-2 text-xs"><div role="tablist" className="mb-1 flex gap-1">{(['week','month','year'] as const).map(v=><button key={v} role="tab" aria-selected={tab===v} onClick={()=>setTab(v)} className={`rounded-lg px-2 py-0.5 font-bold ${tab===v?'bg-pink-200':''}`}>{v[0].toUpperCase()+v.slice(1)}</button>)}</div>
      {list.length?<p>Tracked days: <b>{list.length}</b> · Most common: <b>{label(top)}</b> · Best day: <b>{best}</b> · Streak: <b>{streak}</b> 🐾</p>:<p>Nothing logged here yet. Every day you add brings a little sparkle ✨</p>}</div>
    {fly&&createPortal(<motion.div className="pointer-events-none fixed z-[100000]" style={{left:fly.x,top:fly.y}} initial={{x:0,y:0}} animate={{x:[0,fly.dx/2,fly.dx],y:[0,Math.min(0,fly.dy)-90,fly.dy],scale:[1,1.8,.7],rotate:[0,180,360]}} transition={{duration:.9,ease:'easeInOut'}} onAnimationComplete={()=>setFly(null)}><CatFace id={fly.mood} size={40}/></motion.div>,document.body)}
  </div>
}

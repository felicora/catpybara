import {useEffect,useRef,useState} from 'react'
import {AnimatePresence,motion} from 'framer-motion'
import {CalendarDays,Globe,Settings2} from 'lucide-react'
import WorldClock from '../apps/WorldClock'
import CalendarApp from '../apps/Calendar'
import SettingsApp from '../apps/Settings'
const P=[{id:'clock',l:'World clock',i:<Globe size={15}/>,C:WorldClock},{id:'cal',l:'Calendar',i:<CalendarDays size={15}/>,C:CalendarApp},{id:'set',l:'Settings',i:<Settings2 size={16}/>,C:SettingsApp}]
/** Corner pills that drop down the clock, calendar and settings panels. */
export default function TopBar(){
  const [open,setOpen]=useState<string|null>(null),[n,setN]=useState(new Date()),ref=useRef<HTMLElement>(null)
  useEffect(()=>{const t=setInterval(()=>setN(new Date()),1000)
    const d=(e:PointerEvent)=>{if(!ref.current?.contains(e.target as Node))setOpen(null)},k=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(null)}
    addEventListener('pointerdown',d);addEventListener('keydown',k)
    return()=>{clearInterval(t);removeEventListener('pointerdown',d);removeEventListener('keydown',k)}},[])
  const pill='glass pointer-events-auto flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-black'
  const cur=P.find(p=>p.id===open)
  return <header ref={ref} data-top className="pointer-events-none fixed inset-x-0 top-0 z-[50000] flex items-start justify-end p-2.5">
    <div className="flex gap-1.5">{P.map(p=><button key={p.id} aria-label={p.l} aria-expanded={open===p.id} onClick={()=>setOpen(o=>o===p.id?null:p.id)} className={pill}>{p.i}
      {p.id==='clock'&&n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}{p.id==='cal'&&<span className="hidden sm:inline">{n.toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}</span>}</button>)}</div>
    <AnimatePresence>{cur&&<motion.div key={cur.id} role="region" aria-label={cur.l} initial={{opacity:0,scale:.95,y:-8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.95}} style={{transformOrigin:'top right'}}
      className="glass pointer-events-auto fixed right-2.5 top-14 max-h-[calc(100vh-160px)] w-[min(94vw,390px)] overflow-auto rounded-3xl"><cur.C/></motion.div>}</AnimatePresence>
  </header>
}

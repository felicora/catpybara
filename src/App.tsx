import {useEffect,useRef,useState,type ComponentType} from 'react'
import {AnimatePresence,motion} from 'framer-motion'
import AppIcon from './components/AppIcon'
import Boot from './components/Boot'
import Pet from './apps/Pet'
import AvatarCreator from './apps/AvatarCreator'
import Stickers from './apps/Stickers'
import MusicWidget from './components/MusicWidget'
import Terminal from './apps/Terminal'
import WorldClock from './apps/WorldClock'
import FiveInARow from './apps/FiveInARow'
import CalendarApp from './apps/Calendar'
import MusicApp from './apps/Music'
import PhotoBooth from './apps/PhotoBooth'
import Mood from './apps/Mood'
import Notebook from './apps/Notebook'
import Todo from './apps/Todo'
import SettingsApp from './apps/Settings'
import {useLocalStorage} from './hooks/useLocalStorage'
import {Petals,Scene} from './Scene'

type AppDef={id:string;title:string;tint:string;w:number;h:number;C:ComponentType}
const APPS:AppDef[]=[
  {id:'clock',title:'World Clock',tint:'#cfe6f7',w:400,h:440,C:WorldClock},
  {id:'game',title:'Five in a Row',tint:'#f9c9d9',w:460,h:560,C:FiveInARow},
  {id:'cal',title:'Calendar',tint:'#fde2b8',w:380,h:520,C:CalendarApp},
  {id:'music',title:'Music',tint:'#d9d0f5',w:340,h:480,C:MusicApp},
  {id:'photo',title:'Photo Booth',tint:'#cfeede',w:460,h:580,C:PhotoBooth},
  {id:'mood',title:'Mood Tracker',tint:'#ffd4dc',w:420,h:600,C:Mood},
  {id:'notes',title:'Notebook',tint:'#fff0b8',w:500,h:460,C:Notebook},
  {id:'todo',title:'To-do',tint:'#d3ecd2',w:340,h:420,C:Todo},
  {id:'settings',title:'Settings',tint:'#dfe3ea',w:340,h:400,C:SettingsApp},
  {id:'pet',title:'Cat Pet',tint:'#ffe0c2',w:340,h:460,C:Pet},
  {id:'term',title:'Terminal',tint:'#e5dff5',w:420,h:340,C:Terminal},
  {id:'avatar',title:'Avatar',tint:'#ffd9e8',w:440,h:620,C:AvatarCreator},
  {id:'stickers',title:'Stickers',tint:'#e2f0d6',w:480,h:620,C:Stickers}]
type WS={x:number;y:number;z:number;min:boolean;max:boolean}
type Actions={focus:()=>void;close:()=>void;min:()=>void;max:()=>void;move:(x:number,y:number)=>void}

/** Icons fill two columns per side, wrapping into extra columns on short screens. */
const pos=(i:number,n:number)=>{const h=Math.ceil(n/2),r=Math.max(3,Math.floor((innerHeight-150)/88)),k=i<h?i:i-h;return {position:'fixed' as const,top:64+(k%r)*88,[i<h?'left':'right']:12+Math.floor(k/r)*92}}
const blip=()=>{if(localStorage.getItem('scd-sound')==='false')return;try{const c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.frequency.value=660;g.gain.value=.04;o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.08)}catch{/* no audio */}}
const isTouch=()=>matchMedia('(pointer:coarse)').matches

function Win({a,s,mobile,on}:{a:AppDef;s:WS;mobile:boolean;on:Actions}){
  const style=mobile?{left:0,top:0,right:0,bottom:64,zIndex:s.z}
    :s.max?{left:8,top:52,width:'calc(100vw - 16px)',height:'calc(100vh - 110px)',zIndex:s.z}
    :{left:s.x,top:s.y,width:Math.min(a.w,innerWidth-16),height:Math.min(a.h,innerHeight-100),zIndex:s.z}
  const drag=(e:React.PointerEvent)=>{
    if(mobile||s.max)return
    const w=Math.min(a.w,innerWidth-16),ox=e.clientX-s.x,oy=e.clientY-s.y
    const mv=(ev:PointerEvent)=>on.move(Math.min(innerWidth-80,Math.max(80-w,ev.clientX-ox)),Math.min(innerHeight-90,Math.max(0,ev.clientY-oy)))
    const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up)}
    addEventListener('pointermove',mv);addEventListener('pointerup',up)
  }
  const dot=(label:string,color:string,fn:()=>void)=><button aria-label={label} title={label} onPointerDown={e=>e.stopPropagation()} onClick={fn} className="h-4 w-4 rounded-full border border-black/10" style={{background:color}}/>
  return <motion.div role="dialog" aria-label={a.title} aria-hidden={s.min} onPointerDownCapture={on.focus}
    initial={{scale:.85,opacity:0,y:20}} animate={{scale:1,opacity:s.min?0:1,y:s.min?40:0}} exit={{scale:.85,opacity:0}}
    className="glass fixed flex flex-col overflow-hidden rounded-3xl" style={{...style,position:'fixed',pointerEvents:s.min?'none':'auto'}}>
    <div onPointerDown={drag} className="flex touch-none items-center gap-2 bg-pink-100/80 px-3 py-2 select-none sm:cursor-grab">
      {dot('Close','#ff8fa3',on.close)}{dot('Minimize','#ffd27a',on.min)}{dot('Maximize or restore','#9ed8a6',on.max)}
      <span className="flex-1 text-center text-sm font-black">{a.title}</span><span className="w-12"/>
    </div>
    <div className="min-h-0 flex-1 overflow-auto"><a.C/></div>
  </motion.div>
}

function Top(){
  const [n,setN]=useState(new Date())
  useEffect(()=>{const t=setInterval(()=>setN(new Date()),1000);return()=>clearInterval(t)},[])
  return <div className="glass fixed left-1/2 top-3 z-[5] -translate-x-1/2 rounded-full px-4 py-1 text-center text-sm font-black">
    {n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} <span className="font-semibold opacity-70">· {n.toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}</span></div>
}

export default function Desktop(){
  const [ws,setWs]=useState<Record<string,WS>>({})
  const top=useRef(10),mem=useRef<Record<string,{x:number;y:number}>>({})
  const [mobile,setMobile]=useState(innerWidth<640)
  useEffect(()=>{const f=()=>setMobile(innerWidth<640);addEventListener('resize',f);return()=>removeEventListener('resize',f)},[])
  const [burst,setBurst]=useState(0)
  const [booted,setBooted]=useState(()=>{try{return sessionStorage.getItem('scd-booted')==='1'||matchMedia('(prefers-reduced-motion:reduce)').matches}catch{return false}})
  const done=()=>{try{sessionStorage.setItem('scd-booted','1')}catch{/* private mode */};setBooted(true)}
  const [petalsOn]=useLocalStorage('scd-petals',true),[reduce]=useLocalStorage('scd-reduce',false)
  useEffect(()=>{document.documentElement.dataset.reduce=String(reduce)},[reduce])
  useEffect(()=>{const f=()=>{mem.current={};setWs(s=>Object.fromEntries(Object.entries(s).map(([id,w],n)=>{const a=APPS.find(x=>x.id===id)!;return [id,{...w,max:false,x:Math.max(8,(innerWidth-a.w)/2+n*28),y:Math.max(60,(innerHeight-a.h)/2-20+n*28)}]})))};addEventListener('scd-reset',f);return()=>removeEventListener('scd-reset',f)},[])
  const patch=(id:string,p:Partial<WS>)=>setWs(s=>s[id]?{...s,[id]:{...s[id],...p}}:s)
  const focus=(id:string)=>setWs(s=>s[id]?{...s,[id]:{...s[id],z:++top.current,min:false}}:s)
  const open=(a:AppDef)=>{blip();setWs(s=>{const n=Object.keys(s).length
    const p=mem.current[a.id]??{x:Math.max(8,(innerWidth-a.w)/2+n*28),y:Math.max(60,(innerHeight-a.h)/2-20+n*28)}
    return {...s,[a.id]:{...(s[a.id]??{...p,max:false}),z:++top.current,min:false}}})}
  const close=(id:string)=>setWs(s=>{mem.current[id]={x:s[id].x,y:s[id].y};const {[id]:_,...rest}=s;return rest})
  const active=Object.entries(ws).filter(([,w])=>!w.min).sort((x,y)=>y[1].z-x[1].z)[0]?.[0]
  const openIds=APPS.filter(a=>ws[a.id])
  useEffect(()=>{const o=(e:Event)=>{const a=APPS.find(x=>x.id===(e as CustomEvent).detail);if(a)open(a)};const b=()=>{setBurst(1);setTimeout(()=>setBurst(0),9000)}
    addEventListener('scd-open',o);addEventListener('scd-burst',b);return()=>{removeEventListener('scd-open',o);removeEventListener('scd-burst',b)}},[])
  return <div className="fixed inset-0 overflow-hidden">
    <AnimatePresence>{!booted&&<Boot key="boot" onDone={done}/>}</AnimatePresence><Scene/>{petalsOn&&<Petals n={mobile?10:26}/>}{burst>0&&<Petals key={burst} n={22}/>}{!mobile&&innerHeight>=700&&<MusicWidget/>}<Top/>
    <nav aria-label="Desktop shortcuts" className="fixed inset-x-2 top-14 z-[5] grid grid-cols-4 gap-2 sm:contents">
      {APPS.map((a,i)=><button key={a.id} style={mobile?undefined:pos(i,APPS.length)} title={`Open ${a.title}`} aria-label={`Open ${a.title}`} onClick={()=>isTouch()&&open(a)} onDoubleClick={()=>open(a)} onKeyDown={e=>e.key==='Enter'&&open(a)} className="group flex w-20 justify-self-center flex-col items-center gap-1 rounded-2xl p-1 text-xs font-black">
        <span className="transition drop-shadow-md group-hover:-translate-y-1.5"><AppIcon id={a.id} tint={a.tint} size={56}/></span>
        <span className="rounded-full bg-white/60 px-2">{a.title}</span></button>)}
    </nav>
    <AnimatePresence>{openIds.map(a=><Win key={a.id} a={a} s={ws[a.id]} mobile={mobile} on={{
      focus:()=>focus(a.id),close:()=>close(a.id),min:()=>patch(a.id,{min:true}),max:()=>patch(a.id,{max:!ws[a.id].max}),move:(x,y)=>patch(a.id,{x,y})}}/>)}</AnimatePresence>
    <div className="glass fixed bottom-2 left-1/2 z-[99999] flex h-14 -translate-x-1/2 items-center gap-2 rounded-full px-3">
      {openIds.length===0&&<span className="px-2 text-xs font-bold">{mobile?'Tap':'Double-click'} an icon to open it ✿</span>}
      {openIds.map(a=><button key={a.id} aria-label={`${a.title}${ws[a.id].min?' (minimized)':''}`} title={a.title} onClick={()=>focus(a.id)} className="relative grid h-10 w-10 place-items-center rounded-xl transition hover:-translate-y-1" style={{outline:active===a.id?'2px solid #e58aa8':'none'}}>
        <AppIcon id={a.id} tint={a.tint} size={34}/>{!ws[a.id].min&&<i className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-pink-400"/>}</button>)}
    </div>
  </div>
}

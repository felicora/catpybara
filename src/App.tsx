import {useEffect,useRef,useState,type ComponentType,type CSSProperties} from 'react'
import {AnimatePresence,motion} from 'framer-motion'
import AppIcon from './components/AppIcon'
import Boot from './components/Boot'
import TopBar from './components/TopBar'
import Decor from './components/Decor'
import Companion from './components/Companion'
import WallPicker from './components/WallPicker'
import MusicWidget from './components/MusicWidget'
import {WALLS} from './data/wallpapers'
import {Petals} from './Scene'
import {useLocalStorage} from './hooks/useLocalStorage'
import FiveInARow from './apps/FiveInARow'
import MusicApp from './apps/Music'
import PhotoBooth from './apps/PhotoBooth'
import Mood from './apps/Mood'
import Notebook from './apps/Notebook'
import Pet from './apps/Pet'
import Terminal from './apps/Terminal'
import AvatarCreator from './apps/AvatarCreator'
import Stickers from './apps/Stickers'

type AppDef={id:string;title:string;tint:string;w:number;h:number;C:ComponentType;icon?:string;dock?:boolean}
// World clock, calendar and settings live in the top-right corner (TopBar); To-do lives inside Notebook.
const APPS:AppDef[]=[
  {id:'game',title:'Five in a Row',tint:'#f9c9d9',w:460,h:560,C:FiveInARow,icon:'/icons/game.png',dock:true},
  {id:'mood',title:'Mood Tracker',tint:'#ffd4dc',w:420,h:600,C:Mood,icon:'/icons/mood.png',dock:true},
  {id:'photo',title:'Photo Booth',tint:'#cfeede',w:460,h:580,C:PhotoBooth,icon:'/icons/photo.png',dock:true},
  {id:'term',title:'Terminal',tint:'#e5dff5',w:420,h:340,C:Terminal,icon:'/icons/term.png',dock:true},
  {id:'stickers',title:'Stickers',tint:'#e2f0d6',w:480,h:620,C:Stickers,icon:'/icons/stickers.png',dock:true},
  {id:'avatar',title:'Avatar',tint:'#ffd9e8',w:440,h:620,C:AvatarCreator,icon:'/icons/avatar.png',dock:true},
  {id:'notes',title:'Notebook',tint:'#fff0b8',w:500,h:480,C:Notebook,icon:'/icons/notes.png',dock:true},
  {id:'music',title:'Music',tint:'#d9d0f5',w:340,h:480,C:MusicApp,icon:'/icons/music.png',dock:true},
  {id:'pet',title:'Cat Pet',tint:'#ffe0c2',w:420,h:500,C:Pet,icon:'/icons/pet.png',dock:true}]
type WS={x:number;y:number;z:number;min:boolean;max:boolean}
type Actions={focus:()=>void;close:()=>void;min:()=>void;max:()=>void;move:(x:number,y:number)=>void}
const blip=()=>{if(localStorage.getItem('scd-sound')==='false')return;try{const c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.frequency.value=660;g.gain.value=.04;o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.08)}catch{/* no audio */}}
const spot=(a:AppDef,n:number)=>({x:Math.max(8,(innerWidth-a.w)/2+n*28),y:Math.max(64,(innerHeight-a.h)/2-30+n*28)})
const NOMENU='[role=dialog],[data-top],[data-dock],[data-menu]'

function Win({a,s,mobile,on}:{a:AppDef;s:WS;mobile:boolean;on:Actions}){
  const w=Math.min(a.w,innerWidth-16)
  const style=mobile?{left:0,top:0,right:0,bottom:76,zIndex:s.z}
    :s.max?{left:8,top:56,width:'calc(100vw - 16px)',height:'calc(100vh - 160px)',zIndex:s.z}
    :{left:s.x,top:s.y,width:w,height:Math.min(a.h,innerHeight-160),zIndex:s.z}
  const drag=(e:React.PointerEvent)=>{
    if(mobile||s.max)return
    const ox=e.clientX-s.x,oy=e.clientY-s.y
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

export default function Desktop(){
  const [ws,setWs]=useState<Record<string,WS>>({})
  const top=useRef(10),mem=useRef<Record<string,{x:number;y:number}>>({}),hold=useRef(0)
  const [mobile,setMobile]=useState(innerWidth<640),[burst,setBurst]=useState(0),[menu,setMenu]=useState<{x:number;y:number}|null>(null)
  const [wall]=useLocalStorage('scd-wall','fuji'),[petalsOn]=useLocalStorage('scd-petals',true),[reduce]=useLocalStorage('scd-reduce',false)
  const [booted,setBooted]=useState(()=>{try{return sessionStorage.getItem('scd-booted')==='1'||matchMedia('(prefers-reduced-motion:reduce)').matches}catch{return false}})
  const done=()=>{try{sessionStorage.setItem('scd-booted','1')}catch{/* private mode */};setBooted(true)}
  const W=WALLS.find(w=>w.id===wall)??WALLS[0]
  useEffect(()=>{const f=()=>setMobile(innerWidth<640);addEventListener('resize',f);return()=>removeEventListener('resize',f)},[])
  useEffect(()=>{document.documentElement.dataset.reduce=String(reduce)},[reduce])
  useEffect(()=>{const f=()=>{mem.current={};setWs(s=>Object.fromEntries(Object.entries(s).map(([id,w],n)=>[id,{...w,max:false,...spot(APPS.find(x=>x.id===id)!,n)}])))}
    addEventListener('scd-reset',f);return()=>removeEventListener('scd-reset',f)},[])
  useEffect(()=>{if(!menu)return
    const d=(e:PointerEvent)=>{if(!(e.target as HTMLElement).closest('[data-menu]'))setMenu(null)},k=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(null)}
    addEventListener('pointerdown',d);addEventListener('keydown',k);return()=>{removeEventListener('pointerdown',d);removeEventListener('keydown',k)}},[menu])
  const patch=(id:string,p:Partial<WS>)=>setWs(s=>s[id]?{...s,[id]:{...s[id],...p}}:s)
  const focus=(id:string)=>setWs(s=>s[id]?{...s,[id]:{...s[id],z:++top.current,min:false}}:s)
  const open=(a:AppDef)=>{blip();setWs(s=>({...s,[a.id]:{...(s[a.id]??{...(mem.current[a.id]??spot(a,Object.keys(s).length)),max:false}),z:++top.current,min:false}}))}
  const close=(id:string)=>setWs(s=>{mem.current[id]={x:s[id].x,y:s[id].y};const {[id]:_,...rest}=s;return rest})
  const openIds=APPS.filter(a=>ws[a.id])
  useEffect(()=>{const o=(e:Event)=>{const a=APPS.find(x=>x.id===(e as CustomEvent).detail);if(a)open(a)};const b=()=>{setBurst(1);setTimeout(()=>setBurst(0),9000)}
    addEventListener('scd-open',o);addEventListener('scd-burst',b);return()=>{removeEventListener('scd-open',o);removeEventListener('scd-burst',b)}},[])
  return <div className="fixed inset-0 overflow-hidden" style={{'--px':0,'--py':0} as CSSProperties}
    onPointerMove={e=>{const s=e.currentTarget.style;s.setProperty('--px',String(e.clientX/innerWidth*2-1));s.setProperty('--py',String(e.clientY/innerHeight*2-1))}}
    onContextMenu={e=>{if((e.target as HTMLElement).closest(NOMENU))return;e.preventDefault();setMenu({x:e.clientX,y:e.clientY})}}
    onPointerDown={e=>{if(e.pointerType==='touch'&&!(e.target as HTMLElement).closest(`${NOMENU},button`)){const x=e.clientX,y=e.clientY;hold.current=window.setTimeout(()=>setMenu({x,y}),650)}}}
    onPointerUp={()=>clearTimeout(hold.current)} onPointerCancel={()=>clearTimeout(hold.current)}>
    <AnimatePresence>{!booted&&<Boot key="boot" onDone={done}/>}</AnimatePresence>
    <div aria-hidden className="absolute -inset-8" style={{transform:'translate(calc(var(--px)*-10px),calc(var(--py)*-6px))'}}>
      <motion.div key={W.id} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.7}} className="h-full w-full bg-cover bg-center" style={{backgroundColor:'#fde9ef',backgroundImage:`url(${W.src})`}}/></div>
    <Decor/>
    {petalsOn&&<Petals n={mobile?10:26}/>}{burst>0&&<Petals key={burst} n={22}/>}
    <Companion mobile={mobile}/><TopBar/>
    <AnimatePresence>{openIds.map(a=><Win key={a.id} a={a} s={ws[a.id]} mobile={mobile} on={{
      focus:()=>focus(a.id),close:()=>close(a.id),min:()=>patch(a.id,{min:true}),max:()=>patch(a.id,{max:!ws[a.id].max}),move:(x,y)=>patch(a.id,{x,y})}}/>)}</AnimatePresence>
    <nav data-dock aria-label="Dock" className="glass fixed bottom-3 left-1/2 z-[99999] flex -translate-x-1/2 items-end gap-1 rounded-[28px] px-2.5 py-2 sm:gap-1.5" style={{'--s':'clamp(30px,9.2vw,58px)'} as CSSProperties}>
      {APPS.filter(a=>a.dock).map(a=><button key={a.id} data-l={a.title} aria-label={`${a.title}${ws[a.id]?' (open)':''}`} onClick={()=>open(a)} className="dk relative [&_svg]:h-full [&_svg]:w-full" style={{width:'var(--s)',height:'var(--s)'}}>
        {a.icon?<img src={a.icon} alt="" draggable={false} className="h-full w-full object-contain drop-shadow-md"/>:<AppIcon id={a.id} tint={a.tint} size={58}/>}
        {ws[a.id]&&<i className="absolute -bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pink-400"/>}</button>)}</nav>
    {!mobile&&innerWidth>=1000&&innerHeight>=700&&<MusicWidget/>}
    {menu&&<div data-menu role="menu" className="glass fixed z-[100001] w-60 rounded-2xl p-3" style={{left:Math.min(menu.x,innerWidth-250),top:Math.min(menu.y,innerHeight-290)}}>
      <p className="mb-2 text-sm font-black">🌸 Change wallpaper</p><WallPicker onPick={()=>setMenu(null)}/>
      <button className="mt-2 w-full rounded-xl bg-pink-200 p-1.5 text-sm font-bold" onClick={()=>{dispatchEvent(new Event('scd-reset'));setMenu(null)}}>Reset windows</button></div>}
  </div>
}

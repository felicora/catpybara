import {useEffect,useRef,useState} from 'react'
import {motion} from 'framer-motion'
type Mode='walk'|'sit'|'smile'|'jump'|'chase'|'rest'|'sleep'
const rand=(a:number,b:number)=>a+Math.random()*(b-a)
const K='#4a3228',F='#f6f1ea',T='#b9b4b8',O='rgba(0,0,0,.14)'
function Sprite({mode,face}:{mode:Mode;face:number}){
  const st={stroke:K,strokeWidth:2,fill:'none',strokeLinecap:'round' as const}
  const eyes=mode==='sleep'?<path d="M74 37q4 4 8 0M87 37q4 4 8 0" {...st}/>:mode==='smile'||mode==='rest'?<path d="M74 37q4-5 8 0M87 37q4-5 8 0" {...st}/>
    :<><circle cx="78" cy="36" r="3.4" fill={K}/><circle cx="91" cy="36" r="3.4" fill={K}/><circle cx="79" cy="35" r="1.1" fill="#fff"/><circle cx="92" cy="35" r="1.1" fill="#fff"/></>
  const leg=(x:number,b?:boolean)=><rect className={`leg${b?' b':''}`} x={x} y="56" width="9" height="20" rx="4.5" fill="#e9e3dc" stroke={O}/>
  return <div style={{transform:`scaleX(${face})`}}><svg viewBox="0 0 110 80" width="100%" className={`cat ${mode}`} role="img" aria-label="Your cat companion">
    <g className="tail"><path d="M24 48Q2 44 8 20" stroke={F} strokeWidth="9" fill="none" strokeLinecap="round"/><path d="M8 28Q6 24 8 20" stroke={T} strokeWidth="9" fill="none" strokeLinecap="round"/></g>
    {leg(30,true)}{leg(42)}<ellipse className="body" cx="54" cy="46" rx="32" ry="18" fill={F} stroke={O}/><path d="M32 36q12-8 26-3" stroke={T} strokeWidth="6" strokeLinecap="round" fill="none" opacity=".8"/>{leg(62)}{leg(74,true)}
    <g className="head"><path d="M70 28 72 8 86 21zM99 28 97 8 83 21z" fill={F} stroke={O}/><path d="M73 24 74 14 81 21zM96 24 95 14 88 21z" fill="#f7b6c6"/><circle cx="85" cy="37" r="18" fill={F} stroke={O}/><path d="M79 21q6-4 12 0" stroke={T} strokeWidth="4" strokeLinecap="round" fill="none"/>{eyes}
      <circle cx="73" cy="44" r="4" fill="#f7a8c0" opacity=".5"/><circle cx="97" cy="44" r="4" fill="#f7a8c0" opacity=".5"/><path d="M83 42h5l-2.5 3z" fill="#f08aa6"/><path d="M85.5 45q-3 4-6 1M85.5 45q3 4 6 1" {...st} strokeWidth="1.5"/></g></svg></div>
}
/** The roaming cat: a small state machine (wander, smile, jump from the tree, chase petals, sit by the dock, rest, sleep). */
export default function Companion({mobile}:{mobile:boolean}){
  const S=mobile?84:116,gy=()=>innerHeight-(mobile?96:112)-S
  const [p,setP]=useState(()=>({x:innerWidth*.3,y:gy()})),[dur,setDur]=useState(0),[mode,setMode]=useState<Mode>('sit'),[face,setFace]=useState(1),[say,setSay]=useState('')
  const [bait,setBait]=useState<{x:number;y:number}|null>(null),at=useRef(p),snd=useRef<HTMLAudioElement|null>(null)
  useEffect(()=>{
    if(matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.dataset.reduce==='true')return
    let dead=false
    const sl=(s:number)=>new Promise(r=>setTimeout(r,s*1000))
    const go=async(x:number,y:number,m:Mode='walk',v=120)=>{const t=Math.max(.3,Math.hypot(x-at.current.x,y-at.current.y)/v)
      setFace(x>=at.current.x?1:-1);setMode(m);setDur(t);setP({x,y});at.current={x,y};await sl(t)}
    ;(async()=>{while(!dead){
      const W=innerWidth,g=gy(),r=Math.random()
      if(r<.22)await go(rand(40,W-S-40),g)
      else if(r<.36){setMode('smile');setSay('♡');await sl(2.4);setSay('')}
      else if(r<.5){setDur(0);at.current={x:W*.12,y:g-innerHeight*.3};setP(at.current);setMode('sit');await sl(1.2);await go(W*.12+rand(30,120),g,'jump',220)}
      else if(r<.64){const b={x:rand(60,W-S-60),y:g};setBait(b);await go(b.x,g,'chase',360);setBait(null);setMode('smile');await sl(1.2)}
      else if(r<.77){await go(mobile?rand(20,W-S-20):Math.max(8,W/2-290-S),g);setMode('sit');await sl(4)}
      else if(r<.89){await go(W*.16,g);setMode('rest');await sl(5)}
      else{await go(W*.14,g);setMode('sleep');await sl(8)}}})()
    return()=>{dead=true}},[mobile])
  const poke=()=>{if(localStorage.getItem('scd-sound')!=='false'){snd.current??=new Audio('/audio/meow.mp3');snd.current.currentTime=0;snd.current.play().catch(()=>{})}
    setMode('smile');setSay('meow~');setTimeout(()=>setSay(''),1600)}
  return <div className="pointer-events-none fixed inset-0 z-[4]">
    {bait&&<motion.span className="absolute left-0 top-0 text-xl" initial={{x:bait.x+S/2,y:bait.y-260,opacity:0}} animate={{x:bait.x+S/2,y:bait.y+S*.7,opacity:1}} transition={{duration:1.4}}>🌸</motion.span>}
    <motion.div className="absolute left-0 top-0" animate={{x:p.x,y:p.y}} transition={{duration:dur,ease:mode==='jump'?'easeIn':'linear'}}>
      <button onClick={poke} aria-label="Pet the cat" className="pointer-events-auto relative block cursor-pointer" style={{width:S}}><Sprite mode={mode} face={face}/>
        {say&&<span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2 text-xs font-bold shadow">{say}</span>}
        {mode==='sleep'&&<span className="zzz absolute -top-4 right-0 font-black text-white drop-shadow">Z z z</span>}</button></motion.div></div>
}

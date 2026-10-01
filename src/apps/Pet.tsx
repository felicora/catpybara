import {useEffect,useState} from 'react'
import {motion} from 'framer-motion'
import {useLocalStorage} from '../hooks/useLocalStorage'
type S={food:number;joy:number;t:number}
type Act='idle'|'eat'|'play'|'nap'
const cl=(n:number)=>Math.max(0,Math.min(100,n))
const R=(x:number,y:number,w:number,h:number,c:string)=><rect x={x} y={y} width={w} height={h} fill={c}/>
const F='#ffd9b3',D='#4a3228',P='#f7a8c0',W='#fff'
/** Mochi drifts toward hungry/bored as real time passes (per minute), even while the page is closed. */
export default function Pet(){
  const [s,setS]=useLocalStorage<S>('scd-pet',{food:70,joy:70,t:Date.now()}),[act,setAct]=useState<Act>('idle')
  useEffect(()=>{const decay=()=>setS(p=>{const m=(Date.now()-p.t)/60000;return {food:cl(p.food-m),joy:cl(p.joy-m*.7),t:Date.now()}});decay();const i=setInterval(decay,30000);return()=>clearInterval(i)},[])
  const go=(a:Exclude<Act,'idle'>)=>{setAct(a);setS(p=>({...p,food:cl(p.food+(a==='eat'?25:a==='play'?-5:0)),joy:cl(p.joy+(a==='play'?20:a==='nap'?8:0))}));setTimeout(()=>setAct('idle'),2500)}
  const sleepy=act==='nap'||(act==='idle'&&s.joy<30),happy=act==='eat'||act==='play'
  const eye=(x:number)=><g>{sleepy?R(x,5,2,1,D):happy?<>{R(x,5,1,1,D)}{R(x+1,4,1,1,D)}{R(x+2,5,1,1,D)}</>:R(x,4,1,2,D)}</g>
  const msg=s.food<30?'Mochi would love a snack 🐟':s.joy<30?'Mochi is ready to play 🧶':'Mochi is purring 💕'
  const bar=(l:string,v:number,c:string)=><div className="text-xs font-bold">{l}<div role="progressbar" aria-label={l} aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} className="h-3 overflow-hidden rounded-full bg-white"><div className="h-full transition-all" style={{width:`${v}%`,background:c}}/></div></div>
  const b='rounded-xl bg-pink-200 px-3 py-2 text-sm font-bold'
  return <div className="space-y-3 p-3 text-center">
    <div className="relative mx-auto grid h-44 place-items-center rounded-3xl bg-[linear-gradient(#fde9ef,#e9f5e4)]">
      <motion.div key={act} animate={{y:act==='play'?[0,-22,0,-22,0]:[0,-2,0]}} transition={{duration:act==='play'?1.2:2,repeat:act==='play'?1:Infinity}}>
        <svg viewBox="0 0 16 14" width="150" shapeRendering="crispEdges" className="drop-shadow-md" role="img" aria-label="Mochi the pixel cat">
          {R(13,9,1,1,F)}{R(14,7,1,3,F)}{R(3,7,10,6,F)}{R(3,2,10,6,F)}{R(3,0,2,2,F)}{R(11,0,2,2,F)}{R(4,1,1,1,P)}{R(11,1,1,1,P)}
          {eye(4)}{eye(10)}{R(7,6,2,1,P)}{act==='eat'&&R(7,7,2,1,D)}{R(5,9,6,2,W)}{R(3,12,3,1,W)}{R(10,12,3,1,W)}</svg></motion.div>
      {act!=='idle'&&<span className="absolute right-10 top-4 animate-bounce text-2xl" aria-hidden>{act==='eat'?'🐟':act==='play'?'🧶':'💤'}</span>}</div>
    <p role="status" className="text-sm font-black">{msg}</p>
    {bar('Fullness',s.food,'#f9b26a')}{bar('Joy',s.joy,'#f58fb0')}
    <div className="flex justify-center gap-2"><button className={b} onClick={()=>go('eat')}>🐟 Feed</button><button className={b} onClick={()=>go('play')}>🧶 Play</button><button className={b} onClick={()=>go('nap')}>💤 Nap</button></div>
  </div>
}

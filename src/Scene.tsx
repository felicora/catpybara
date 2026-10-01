import {useMemo,useState} from 'react'
import {useLocalStorage} from './hooks/useLocalStorage'
export function Petals({n}:{n:number}){
  const p=useMemo(()=>Array.from({length:n},()=>({l:Math.random()*100,s:8+Math.random()*10,d:9+Math.random()*9,y:-Math.random()*16})),[n])
  return <>{p.map((q,i)=><i key={i} className="petal" style={{left:`${q.l}%`,width:q.s,height:q.s,animationDuration:`${q.d}s`,animationDelay:`${q.y}s`}}/>)}</>
}
const SKY:Record<string,string[]>={day:['#bfe3f5','#fde9ef'],sunset:['#f8b9a5','#fde4d6'],night:['#3b3a66','#9c86c4']}
const sky=(wp:string)=>{const h=new Date().getHours();return SKY[wp==='auto'?(h<6||h>=20?'night':h<9||h>=17?'sunset':'day'):wp]}
export function Scene(){
  const [wp]=useLocalStorage('scd-wp','auto'),[a,b]=sky(wp)
  const [awake,setAwake]=useState(false)
  const [say,setSay]=useState(false)
  return <div className="absolute inset-0" style={{background:`linear-gradient(${a},${b})`}}>
    {a===SKY.night[0]&&Array.from({length:30},(_,i)=><i key={i} className="absolute h-1 w-1 rounded-full bg-white" style={{left:`${i*37%100}%`,top:`${i*53%45}%`,opacity:.4+(i%5)/10}}/>)}
    <div className="absolute left-[12%] top-[14%] h-10 w-32 rounded-full bg-white/70 blur-[2px]"/><div className="absolute left-[55%] top-[24%] h-8 w-24 rounded-full bg-white/60 blur-[2px]"/>
    <svg viewBox="0 0 400 520" className="pointer-events-none absolute bottom-0 right-0 h-[82%] w-auto" aria-hidden>
      <path d="M190 520C195 400 180 330 150 250M195 400C230 330 270 290 330 230M185 330C150 300 100 290 60 240" stroke="#7a5a48" strokeWidth="22" strokeLinecap="round" fill="none"/>
      {[[150,230,70],[320,220,65],[60,230,55],[230,150,80],[120,140,60],[300,130,55]].map(([x,y,r],i)=><g key={i}><circle cx={x} cy={y} r={r} fill="#f9c6d6" opacity=".85"/><circle cx={x-r/3} cy={y-r/4} r={r/2} fill="#fde0ea" opacity=".9"/></g>)}
    </svg>
    <div className="absolute bottom-0 h-16 w-full bg-[#cfe6c8]"/>
    <button aria-label="Wake the sleeping cat" onClick={()=>{setAwake(true);setTimeout(()=>setAwake(false),1800)}} className="absolute bottom-14 left-[6%] z-[2] sm:bottom-16">
      <svg width="150" viewBox="0 0 120 70"><path d="M100 52q16-4 12-22" stroke="#e8b48a" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <ellipse cx="62" cy="52" rx="48" ry="18" fill="#ffe3c8" stroke="#c9a48c"/><circle cx="28" cy="42" r="20" fill="#ffe3c8" stroke="#c9a48c"/><path d="M12 30l2-18 14 10zM32 22l14-10 2 18z" fill="#ffe3c8" stroke="#c9a48c"/>
        {awake?<><circle cx="21" cy="42" r="2.5" fill="#4a3228"/><circle cx="35" cy="42" r="2.5" fill="#4a3228"/></>:<path d="M17 43q4 4 8 0M31 43q4 4 8 0" stroke="#4a3228" strokeWidth="2" fill="none"/>}
        <text x="58" y="14" fontSize="12" fill="#fff" opacity={awake?0:.9}>z z</text></svg>
    </button>
    <button aria-label="Pet the wandering cat" onClick={()=>{setSay(true);setTimeout(()=>setSay(false),1600)}} className="walker absolute bottom-20 z-[2]" style={{animation:'walk 45s linear infinite',animationPlayState:say?'paused':'running'}}>
      {say&&<span className="absolute -top-6 left-2 rounded-full bg-white px-2 text-xs font-bold">meow~</span>}
      <svg width="64" height="52" viewBox="0 0 64 52"><path d="M44 40q16-2 14-20" stroke="#e8b48a" strokeWidth="5" fill="none" strokeLinecap="round"/><ellipse cx="28" cy="36" rx="20" ry="11" fill="#ffd9b3"/><circle cx="14" cy="24" r="11" fill="#ffd9b3"/><path d="M5 17l2-12 8 7zM17 12l8-7 2 12z" fill="#ffd9b3"/><circle cx="11" cy="24" r="1.6" fill="#4a3228"/><circle cx="18" cy="24" r="1.6" fill="#4a3228"/></svg>
    </button>
  </div>
}

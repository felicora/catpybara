import {useEffect,useState} from 'react'
import {useLocalStorage} from '../hooks/useLocalStorage'
import {ZONES,info} from '../utils/time'
export default function WorldClock(){
  const [now,setNow]=useState(new Date())
  const [h12,setH12]=useLocalStorage('scd-h12',false)
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[])
  return <div className="space-y-3 p-3">
    <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={h12} onChange={e=>setH12(e.target.checked)}/> 12-hour time</label>
    {ZONES.map(z=>{const i=info(now,z.tz,h12)
      return <section key={z.tz} aria-label={z.city} className="flex items-center gap-3 rounded-3xl border-2 border-white p-3 shadow" style={{background:i.day?'#fff3cf':'#d9d3f3'}}>
        <svg width="56" height="56" viewBox="0 0 56 56" aria-label={i.day?'Daytime':'Night'}>
          {i.day?<><circle cx="28" cy="28" r="12" fill="#ffc94d"/><g stroke="#ffc94d" strokeWidth="3" strokeLinecap="round">{[0,45,90,135,180,225,270,315].map(a=><line key={a} x1="28" y1="8" x2="28" y2="12" transform={`rotate(${a} 28 28)`}/>)}</g></>
          :<><path d="M38 38A16 16 0 1 1 26 10 13 13 0 0 0 38 38Z" fill="#fff6c8"/><circle cx="44" cy="14" r="2" fill="#fff"/><circle cx="12" cy="44" r="1.5" fill="#fff"/></>}
        </svg>
        <div className="min-w-0 flex-1"><div className="font-black">{z.city} <span className="text-xs font-semibold opacity-70">{z.country}</span></div>
          <div className="text-2xl font-black tabular-nums" role="timer">{i.time}</div>
          <div className="text-xs opacity-80">{i.date} · {i.off} · {i.diff===0?'same as you':`${i.diff>0?'+':''}${i.diff}h vs you`}</div></div>
      </section>})}
  </div>
}

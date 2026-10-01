import {useEffect,useState} from 'react'
import {TRACKS,player,usePlayer} from '../player'
import {ListMusic,Pause,Play,Repeat,Shuffle,SkipBack,SkipForward,Volume2,VolumeX} from 'lucide-react'
import {useLocalStorage} from '../hooks/useLocalStorage'
const fmt=(s:number)=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
export const Art=({c}:{c:string})=><svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden><rect width="64" height="64" fill={c}/>{[0,72,144,216,288].map(a=><ellipse key={a} cx="32" cy="20" rx="7" ry="11" fill="#fff" opacity=".85" transform={`rotate(${a} 32 32)`}/>)}<circle cx="32" cy="32" r="5" fill="#f7a8c0"/></svg>
export default function Music(){
  const {i,pl,cur,dur,err,loop,sh}=usePlayer()
  const [vol,setVol]=useLocalStorage('scd-vol',.7),[mute,setMute]=useState(false),[list,setList]=useState(false)
  useEffect(()=>{player.audio.volume=vol;player.audio.muted=mute},[vol,mute])
  const {toggle,go,next}=player
  const ib='grid h-9 w-9 place-items-center rounded-full bg-white/80'
  return <div className="space-y-2 p-3">
    <div className="flex items-center gap-3"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow"><Art c={TRACKS[i].c}/></div>
      <div className="min-w-0"><p className="truncate font-black">{TRACKS[i].t}</p><div className="flex h-5 items-end gap-0.5" aria-hidden>{[0,.2,.4,.1].map(d=><i key={d} className="bar" style={{animationDelay:`${d}s`,animationPlayState:pl?'running':'paused'}}/>)}</div></div></div>
    {err&&<p role="alert" className="rounded-xl bg-yellow-100 p-2 text-xs font-bold">{err}</p>}
    <input type="range" aria-label="Seek" min={0} max={dur||1} step={.1} value={cur} onChange={e=>{player.seek(+e.target.value)}} className="w-full accent-pink-400"/>
    <div className="flex justify-between text-xs font-bold"><span>{fmt(cur)}</span><span>{fmt(dur||0)}</span></div>
    <div className="flex items-center justify-center gap-2">
      <button aria-label="Shuffle" aria-pressed={sh} className={`${ib} ${sh?'ring-2 ring-pink-400':''}`} onClick={player.shuffle}><Shuffle size={16}/></button>
      <button aria-label="Previous track" className={ib} onClick={()=>next(-1)}><SkipBack size={16}/></button>
      <button aria-label={pl?'Pause':'Play'} className={`${ib} !h-12 !w-12 !bg-pink-300`} onClick={toggle}>{pl?<Pause/>:<Play/>}</button>
      <button aria-label="Next track" className={ib} onClick={()=>next()}><SkipForward size={16}/></button>
      <button aria-label="Loop track" aria-pressed={loop} className={`${ib} ${loop?'ring-2 ring-pink-400':''}`} onClick={()=>player.setLoop(!loop)}><Repeat size={16}/></button></div>
    <div className="flex items-center gap-2"><button aria-label={mute?'Unmute':'Mute'} className={ib} onClick={()=>setMute(!mute)}>{mute||vol===0?<VolumeX size={16}/>:<Volume2 size={16}/>}</button>
      <input type="range" aria-label="Volume" min={0} max={1} step={.05} value={vol} onChange={e=>setVol(+e.target.value)} className="flex-1 accent-pink-400"/>
      <button aria-label="Toggle playlist" aria-expanded={list} className={ib} onClick={()=>setList(!list)}><ListMusic size={16}/></button></div>
    {list&&<ul className="space-y-1">{TRACKS.map((t,n)=><li key={t.src}><button onClick={()=>go(n)} aria-current={n===i} className={`flex w-full items-center gap-2 rounded-xl p-1 text-left text-sm font-bold ${n===i?'bg-pink-100':'bg-white/60'}`}><span className="h-8 w-8 overflow-hidden rounded-lg"><Art c={t.c}/></span>{t.t}</button></li>)}</ul>}
  </div>
}

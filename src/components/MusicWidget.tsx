import {Pause,Play,SkipForward} from 'lucide-react'
import {TRACKS,player,usePlayer} from '../player'
import {Art} from '../apps/Music'
export default function MusicWidget(){
  const {i,pl,err}=usePlayer()
  return <section aria-label="Music widget" className="glass fixed bottom-20 right-3 z-[5] flex w-60 items-center gap-2 rounded-2xl p-2">
    <button aria-label="Open music player" onClick={()=>dispatchEvent(new CustomEvent('scd-open',{detail:'music'}))} className="h-12 w-12 shrink-0 overflow-hidden rounded-xl"><Art c={TRACKS[i].c}/></button>
    <div className="min-w-0 flex-1"><p className="truncate text-xs font-black">{TRACKS[i].t}</p>
      <div className="flex h-4 items-end gap-0.5" aria-hidden>{[0,.2,.4].map(d=><i key={d} className="bar" style={{animationDelay:`${d}s`,animationPlayState:pl?'running':'paused'}}/>)}</div>
      {err&&<p className="truncate text-[10px]">{err}</p>}</div>
    <button aria-label={pl?'Pause':'Play'} onClick={player.toggle} className="grid h-9 w-9 place-items-center rounded-full bg-pink-300">{pl?<Pause size={16}/>:<Play size={16}/>}</button>
    <button aria-label="Next track" onClick={()=>player.next()} className="grid h-8 w-8 place-items-center rounded-full bg-white/80"><SkipForward size={14}/></button></section>
}

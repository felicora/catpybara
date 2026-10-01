import {useLocalStorage} from '../hooks/useLocalStorage'
import {WALLS} from '../data/wallpapers'
export default function WallPicker({onPick}:{onPick?:()=>void}){
  const [w,setW]=useLocalStorage('scd-wall','fuji')
  return <div role="radiogroup" aria-label="Wallpaper" className="grid grid-cols-2 gap-2">{WALLS.map(x=>
    <button key={x.id} role="radio" aria-checked={w===x.id} onClick={()=>{setW(x.id);onPick?.()}} className={`overflow-hidden rounded-xl border-2 bg-white text-[11px] font-bold ${w===x.id?'border-pink-400':'border-white'}`}>
      <img src={x.thumb} alt="" className="aspect-video w-full object-cover"/>{x.name}</button>)}</div>
}

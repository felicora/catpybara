import {useLocalStorage} from '../hooks/useLocalStorage'
import WallPicker from '../components/WallPicker'
export default function Settings(){
  const [petals,setPetals]=useLocalStorage('scd-petals',true),[sound,setSound]=useLocalStorage('scd-sound',true)
  const [h12,setH12]=useLocalStorage('scd-h12',false),[reduce,setReduce]=useLocalStorage('scd-reduce',false)
  const row=(l:string,v:boolean,f:(b:boolean)=>void)=><label className="flex items-center justify-between rounded-2xl bg-white/70 p-3 text-sm font-bold">{l}<input type="checkbox" checked={v} onChange={e=>f(e.target.checked)} className="h-5 w-5 accent-pink-400"/></label>
  const btn='w-full rounded-2xl bg-pink-200 p-2 text-sm font-bold'
  return <div className="space-y-2 p-3">
    {row('Falling petals',petals,setPetals)}{row('Interface sounds',sound,setSound)}{row('12-hour clock',h12,setH12)}{row('Reduce motion',reduce,setReduce)}
    <div className="rounded-2xl bg-white/70 p-3 text-sm font-bold">Wallpaper<div className="mt-2"><WallPicker/></div></div>
    <button className={btn} onClick={()=>dispatchEvent(new Event('scd-reset'))}>Reset window positions</button>
    <button className={btn} onClick={()=>{if(confirm('Clear all saved notes, moods, scores and settings?')){Object.keys(localStorage).filter(k=>k.startsWith('scd-')).forEach(k=>localStorage.removeItem(k));location.reload()}}}>Clear saved data</button>
  </div>
}

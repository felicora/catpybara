import {useLocalStorage} from '../hooks/useLocalStorage'
export default function CatPicker(){
  const [c,setC]=useLocalStorage('scd-cat','cat')
  return <div role="radiogroup" aria-label="Cat companion" className="grid grid-cols-2 gap-1.5">{[['cat','🐱 Cat'],['space','🚀 Space Cat']].map(([id,l])=>
    <button key={id} role="radio" aria-checked={c===id} onClick={()=>setC(id)} className={`rounded-xl border-2 bg-white p-1.5 text-xs font-bold ${c===id?'border-pink-400':'border-white'}`}>{l}</button>)}</div>
}

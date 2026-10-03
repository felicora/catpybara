import {useLocalStorage} from '../hooks/useLocalStorage'
/** The roaming pet is off until you pick one. */
export default function CatPicker(){
  const [c,setC]=useLocalStorage('scd-cat','off')
  return <div role="radiogroup" aria-label="Pet cat" className="grid grid-cols-3 gap-1.5">{[['off','Off'],['spotted','🐱 Spotted Cat'],['space','🚀 Space Cat']].map(([id,l])=>
    <button key={id} role="radio" aria-checked={c===id} onClick={()=>setC(id)} className={`rounded-xl border-2 bg-white p-1.5 text-xs font-bold ${c===id?'border-pink-400':'border-white'}`}>{l}</button>)}</div>
}

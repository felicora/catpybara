import {useEffect,useRef,useState} from 'react'
const IDS=['game','music','photo','mood','notes','pet','term','avatar','stickers']
export default function Terminal(){
  const [lines,setLines]=useState(['Sakura Cat Terminal 🐾','Type "help" to begin.']),[v,setV]=useState('')
  const end=useRef<HTMLDivElement>(null)
  useEffect(()=>{end.current?.scrollIntoView({block:'nearest'})},[lines])
  const run=(e:React.FormEvent)=>{e.preventDefault()
    const [c,...a]=v.trim().toLowerCase().split(/\s+/);let out:string[]=[]
    if(c==='help')out=['help · meow · date · sakura · apps · open <app> · clear']
    else if(c==='meow')out=['meow~ 🐱']
    else if(c==='date')out=[new Date().toLocaleString()]
    else if(c==='apps')out=[IDS.join(' · ')]
    else if(c==='sakura'){dispatchEvent(new Event('scd-burst'));out=['🌸 petals!']}
    else if(c==='open'){if(IDS.includes(a[0])){dispatchEvent(new CustomEvent('scd-open',{detail:a[0]}));out=[`opening ${a[0]}…`]}else out=['unknown app. Try "apps".']}
    else if(c==='clear'){setLines([]);setV('');return}
    else if(c)out=[`no such command: ${c}. Try "help".`]
    setLines(l=>[...l,`🐾 ${v}`,...out]);setV('')}
  return <div className="flex h-full flex-col bg-[#3b2a26] p-3 font-mono text-sm text-[#ffe9ef]">
    <div role="log" className="min-h-0 flex-1 overflow-auto">{lines.map((l,i)=><p key={i}>{l}</p>)}<div ref={end}/></div>
    <form onSubmit={run} className="flex gap-2 pt-2"><span aria-hidden>🐾</span><input autoFocus value={v} onChange={e=>setV(e.target.value)} aria-label="Command" className="min-w-0 flex-1 bg-transparent outline-none" spellCheck={false}/></form></div>
}

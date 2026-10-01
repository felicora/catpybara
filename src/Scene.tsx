import {useMemo} from 'react'
export function Petals({n}:{n:number}){
  const p=useMemo(()=>Array.from({length:n},()=>({l:Math.random()*100,s:8+Math.random()*10,d:9+Math.random()*9,y:-Math.random()*16})),[n])
  return <>{p.map((q,i)=><i key={i} className="petal" style={{left:`${q.l}%`,width:q.s,height:q.s,animationDuration:`${q.d}s`,animationDelay:`${q.y}s`}}/>)}</>
}

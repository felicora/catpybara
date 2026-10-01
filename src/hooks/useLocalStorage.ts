import {useCallback,useEffect,useState} from 'react'
/** localStorage-backed state that also syncs across components using the same key. */
export function useLocalStorage<T>(key:string,init:T){
  const read=()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s) as T:init}catch{return init}}
  const [v,setV]=useState<T>(read)
  useEffect(()=>{const f=(e:Event)=>{if((e as CustomEvent).detail===key)setV(read())};addEventListener('scd-ls',f);return()=>removeEventListener('scd-ls',f)},[key])
  const set=useCallback((x:T|((p:T)=>T))=>setV(p=>{
    const n=typeof x==='function'?(x as (p:T)=>T)(p):x
    try{localStorage.setItem(key,JSON.stringify(n));queueMicrotask(()=>dispatchEvent(new CustomEvent('scd-ls',{detail:key})))}catch{/* storage full/blocked */}
    return n}),[key])
  return [v,set] as const
}

import {useEffect,useState} from 'react'
import {motion} from 'framer-motion'
const STEPS=['Warming the teapot…','Sweeping up petals…','Waking the cats…','Ready!']
/** Short boot sequence shown once per session; tap anywhere to skip. */
export default function Boot({onDone}:{onDone:()=>void}){
  const [n,setN]=useState(0)
  useEffect(()=>{const t=setInterval(()=>setN(x=>x+1),550);return()=>clearInterval(t)},[])
  useEffect(()=>{if(n>=4)onDone()},[n,onDone])
  return <motion.button aria-label="Skip startup" onClick={onDone} exit={{opacity:0,scale:1.05}} transition={{duration:.4}} className="fixed inset-0 z-[100000] grid place-items-center bg-[#fde9ef]">
    <span className="block w-64 text-center">
      <svg viewBox="0 0 64 56" width="96" className="mx-auto" aria-hidden><path d="M8 22 10 4l14 10zM56 22 54 4 40 14z" fill="#ffd9b3"/><circle cx="32" cy="32" r="22" fill="#ffd9b3"/><path d="M20 30q3 3 6 0M38 30q3 3 6 0" stroke="#4a3228" strokeWidth="2.5" fill="none" strokeLinecap="round"/><circle cx="32" cy="38" r="2" fill="#f7a8c0"/><circle cx="18" cy="38" r="4" fill="#f7a8c0" opacity=".5"/><circle cx="46" cy="38" r="4" fill="#f7a8c0" opacity=".5"/></svg>
      <span className="mt-2 block text-xl font-black">Sakura Cat Desktop</span>
      <span className="block h-6 text-sm font-bold" role="status">{STEPS[Math.min(n,3)]}</span>
      <span className="mx-auto mt-1 block h-3 w-full overflow-hidden rounded-full bg-white shadow-inner"><span className="block h-full rounded-full bg-pink-300 transition-all duration-500" style={{width:`${Math.min(n,4)*25}%`}}/></span>
      <span className="mt-2 block h-5 text-sm" aria-hidden>{'🐾'.repeat(Math.min(n,4))}</span>
      <span className="text-xs opacity-60">Tap to skip</span></span></motion.button>
}

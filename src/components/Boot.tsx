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
      <span className="relative mx-auto block h-[72px] w-full" aria-hidden><img src="/cat/spotted.webp" alt="" draggable={false} className="absolute bottom-0 h-[72px] w-[126px] transition-all duration-500" style={{left:`calc((100% - 126px) * ${Math.min(n,4)/4})`,transform:'scaleX(-1)'}}/></span>
      <span className="mt-2 block text-xl font-black">Sakura Cat Desktop</span>
      <span className="block h-6 text-sm font-bold" role="status">{STEPS[Math.min(n,3)]}</span>
      <span className="mx-auto mt-1 block h-3 w-full overflow-hidden rounded-full bg-white shadow-inner"><span className="block h-full rounded-full bg-pink-300 transition-all duration-500" style={{width:`${Math.min(n,4)*25}%`}}/></span>
      <span className="mt-2 block h-5 text-sm" aria-hidden>{'🐾'.repeat(Math.min(n,4))}</span>
      <span className="text-xs opacity-60">Tap to skip</span></span></motion.button>
}

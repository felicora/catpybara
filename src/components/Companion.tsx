import {useEffect,useRef,useState} from 'react'
import {motion} from 'framer-motion'
import Lottie,{type LottieRefCurrentProps} from 'lottie-react'
import {useLocalStorage} from '../hooks/useLocalStorage'
type Mode='walk'|'sit'|'smile'|'jump'|'chase'|'rest'|'sleep'
const rand=(a:number,b:number)=>a+Math.random()*(b-a)
// flip: set to -1 if a cat walks backwards. still: pause the animation whenever the cat is standing.
const CATS:Record<string,{src:string;flip:number;still:boolean}>={cat:{src:'/cat/cat.json',flip:1,still:true},space:{src:'/cat/space-cat.json',flip:1,still:false}}
/** The roaming cat: a small state machine (wander, smile, jump from the tree, chase petals, sit by the dock, rest, sleep). */
export default function Companion({mobile}:{mobile:boolean}){
  const [pick]=useLocalStorage('scd-cat','cat'),C=CATS[pick]??CATS.cat,S=mobile?96:140,[ratio,setRatio]=useState(1.4),hRef=useRef(S/1.4),gy=()=>innerHeight-(mobile?96:112)-hRef.current
  hRef.current=S/ratio
  const [data,setData]=useState<{w:number;h:number}|null>(null),[ready,setReady]=useState(0),lot=useRef<LottieRefCurrentProps>(null),box=useRef<HTMLDivElement>(null)
  const [p,setP]=useState(()=>({x:innerWidth*.3,y:gy()})),[dur,setDur]=useState(0),[mode,setMode]=useState<Mode>('sit'),[face,setFace]=useState(1),[say,setSay]=useState('')
  const [bait,setBait]=useState<{x:number;y:number}|null>(null),at=useRef(p),snd=useRef<HTMLAudioElement|null>(null)
  useEffect(()=>{
    if(matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.dataset.reduce==='true')return
    let dead=false
    const sl=(s:number)=>new Promise(r=>setTimeout(r,s*1000))
    const go=async(x:number,y:number,m:Mode='walk',v=120)=>{const t=Math.max(.3,Math.hypot(x-at.current.x,y-at.current.y)/v)
      setFace(x>=at.current.x?1:-1);setMode(m);setDur(t);setP({x,y});at.current={x,y};await sl(t)}
    ;(async()=>{while(!dead){
      const W=innerWidth,g=gy(),r=Math.random()
      if(r<.22)await go(rand(40,W-S-40),g)
      else if(r<.36){setMode('smile');setSay('♡');await sl(2.4);setSay('')}
      else if(r<.5){setDur(0);at.current={x:W*.12,y:g-innerHeight*.3};setP(at.current);setMode('sit');await sl(1.2);await go(W*.12+rand(30,120),g,'jump',220)}
      else if(r<.64){const b={x:rand(60,W-S-60),y:g};setBait(b);await go(b.x,g,'chase',360);setBait(null);setMode('smile');await sl(1.2)}
      else if(r<.77){await go(mobile?rand(20,W-S-20):Math.max(8,W/2-335-S),g);setMode('sit');await sl(4)}
      else if(r<.89){await go(W*.16,g);setMode('rest');await sl(5)}
      else{await go(W*.14,g);setMode('sleep');await sl(8)}}})()
    return()=>{dead=true}},[mobile])
  useEffect(()=>{setData(null);let ok=true
    fetch(C.src).then(r=>r.json()).then(d=>{if(ok){setRatio(d.w/d.h);setData(d)}}).catch(()=>{});return()=>{ok=false}},[C.src])
  /* Crop the Lottie canvas to the cat: union of every visible path over sampled frames, ignoring full-canvas backgrounds. */
  useEffect(()=>{if(!data)return
    const t=setTimeout(()=>{const a=lot.current?.animationItem,svg=box.current?.querySelector('svg');if(!a||!svg)return
      const R=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal,s=Math.min(R.width/vb.width,R.height/vb.height),ox=(R.width-vb.width*s)/2,oy=(R.height-vb.height*s)/2
      let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9
      for(let i=0;i<10;i++){a.goToAndStop(Math.floor(a.totalFrames*i/10),true)
        svg.querySelectorAll('path').forEach(p=>{const r=p.getBoundingClientRect();if(!r.width||!r.height||(r.width>R.width*.8&&r.height>R.height*.8))return
          x0=Math.min(x0,r.left);y0=Math.min(y0,r.top);x1=Math.max(x1,r.right);y1=Math.max(y1,r.bottom)})}
      if(x1>x0){const pad=6,nw=(x1-x0)/s+pad*2,nh=(y1-y0)/s+pad*2
        svg.setAttribute('viewBox',`${(x0-R.left-ox)/s+vb.x-pad} ${(y0-R.top-oy)/s+vb.y-pad} ${nw} ${nh}`);setRatio(nw/nh)}
      a.goToAndPlay(0,true);setReady(n=>n+1)},350)
    return()=>clearTimeout(t)},[data])
  // The walking cat only animates while it moves; the Space Cat floats all the time.
  useEffect(()=>{const a=lot.current;if(!a)return;const moving=mode==='walk'||mode==='chase'||mode==='jump'
    if(!C.still||moving){a.setSpeed(mode==='chase'?1.7:1);a.play()}else a.pause()},[mode,data,ready,C.still])
  const poke=()=>{if(localStorage.getItem('scd-sound')!=='false'){snd.current??=new Audio('/audio/meow.mp3');snd.current.currentTime=0;snd.current.play().catch(()=>{})}
    setMode('smile');setSay('meow~');setTimeout(()=>setSay(''),1600)}
  return <div className="pointer-events-none fixed inset-0 z-[4]">
    {bait&&<motion.span className="absolute left-0 top-0 text-xl" initial={{x:bait.x+S/2,y:bait.y-260,opacity:0}} animate={{x:bait.x+S/2,y:bait.y+S*.7,opacity:1}} transition={{duration:1.4}}>🌸</motion.span>}
    <motion.div className="absolute left-0 top-0" animate={{x:p.x,y:p.y}} transition={{duration:dur,ease:mode==='jump'?'easeIn':'linear'}}>
      <button onClick={poke} aria-label="Pet the cat" className="pointer-events-auto relative block cursor-pointer" style={{width:S}}><div ref={box} style={{width:S,height:S/ratio,transform:`scaleX(${face*C.flip})`}}>{data&&<Lottie key={C.src} lottieRef={lot} animationData={data} loop style={{width:'100%',height:'100%'}}/>}</div>
        {say&&<span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2 text-xs font-bold shadow">{say}</span>}
        {mode==='sleep'&&<span className="zzz absolute -top-4 right-0 font-black text-white drop-shadow">Z z z</span>}</button></motion.div></div>
}

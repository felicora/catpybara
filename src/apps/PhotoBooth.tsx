import {useEffect,useRef,useState} from 'react'
const FILTERS:[string,string][]=[['None','none'],['Sakura pink','sepia(.3) saturate(1.4) hue-rotate(300deg) brightness(1.08)'],['Retro film','sepia(.6) contrast(1.1) saturate(.8)'],['Dreamy','blur(.6px) brightness(1.12) saturate(1.2)'],['Black & white','grayscale(1)'],['Vibrant pop','saturate(1.9) contrast(1.15)'],['Soft lavender','sepia(.25) hue-rotate(230deg) saturate(1.1) brightness(1.06)']]
const OVERLAYS=['Cat ears','Cat whiskers','Sakura petals','Paw frame','Polaroid frame']
function overlay(x:CanvasRenderingContext2D,w:number,h:number,o:string){
  x.save()
  if(o==='Cat ears'){x.fillStyle='#f7a8c0';x.strokeStyle='#4a3228';x.lineWidth=4
    for(const s of [-1,1]){const cx=w/2+s*w*.2;x.beginPath();x.moveTo(cx-w*.08,h*.2);x.lineTo(cx+s*w*.04,h*.03);x.lineTo(cx+w*.08,h*.2);x.closePath();x.fill();x.stroke()}}
  if(o==='Cat whiskers'){x.strokeStyle='#fff';x.lineWidth=3
    for(const s of [-1,1])for(const k of [-1,0,1]){x.beginPath();x.moveTo(w/2+s*w*.12,h*.6+k*12);x.lineTo(w/2+s*w*.42,h*.6+k*30);x.stroke()}}
  if(o==='Sakura petals'){x.fillStyle='#f9b9cd';for(let i=0;i<14;i++){x.beginPath();x.ellipse((i*137%100)/100*w,(i*71%100)/100*h,12,7,i,0,7);x.fill()}}
  if(o==='Paw frame'){x.strokeStyle='#f7a8c0';x.lineWidth=w*.03;x.strokeRect(0,0,w,h);x.font=`${w*.05}px serif`
    for(let i=0;i<=8;i++){x.fillText('🐾',i*w/8-w*.025,w*.045);x.fillText('🐾',i*w/8-w*.025,h-w*.01)}}
  if(o==='Polaroid frame'){x.fillStyle='#fff';x.fillRect(0,0,w,h*.04);x.fillRect(0,0,w*.04,h);x.fillRect(w*.96,0,w*.04,h);x.fillRect(0,h*.8,w,h*.2)}
  x.restore()
}
export default function PhotoBooth(){
  const vid=useRef<HTMLVideoElement>(null),cv=useRef<HTMLCanvasElement>(null),stream=useRef<MediaStream|null>(null)
  const [on,setOn]=useState(false),[err,setErr]=useState(''),[fi,setFi]=useState(0),[ov,setOv]=useState<string[]>([])
  const [count,setCount]=useState(0),[photos,setPhotos]=useState<string[]>([]),[sel,setSel]=useState<number|null>(null)
  const stop=()=>{stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;if(vid.current)vid.current.srcObject=null;setOn(false)}
  useEffect(()=>()=>{stream.current?.getTracks().forEach(t=>t.stop())},[])
  const start=async()=>{setErr('')
    try{if(!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported')
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}});stream.current=s
      vid.current!.srcObject=s;await vid.current!.play();setOn(true);setSel(null)}
    catch(e){const n=(e as Error).name
      setErr(n==='NotAllowedError'||n==='SecurityError'?'Camera permission was denied. Allow camera access in your browser’s site settings, then press Open camera again.'
        :n==='NotFoundError'?'No camera was found on this device.':'The camera isn’t available here. Try a secure connection (https or localhost).')}}
  // Preview and capture share one canvas, so what you see is exactly what you save.
  useEffect(()=>{if(!on)return;let raf=0
    const loop=()=>{const v=vid.current!,c=cv.current!
      if(v.videoWidth){if(c.width!==v.videoWidth){c.width=v.videoWidth;c.height=v.videoHeight}
        const x=c.getContext('2d')!;x.save();x.filter=FILTERS[fi][1];x.translate(c.width,0);x.scale(-1,1);x.drawImage(v,0,0);x.restore()
        ov.forEach(o=>overlay(x,c.width,c.height,o))}
      raf=requestAnimationFrame(loop)}
    loop();return()=>cancelAnimationFrame(raf)},[on,fi,ov])
  const snap=()=>{let n=3;setCount(n);const t=setInterval(()=>{n--;if(n>0)setCount(n);else{clearInterval(t);setCount(0);setPhotos(p=>[cv.current!.toDataURL('image/png'),...p]);setSel(0)}},1000)}
  const b='rounded-xl bg-pink-200 px-3 py-1 text-sm font-bold disabled:opacity-40'
  return <div className="space-y-2 p-3">
    <video ref={vid} playsInline muted className="absolute h-px w-px opacity-0"/>
    {err&&<p role="alert" className="rounded-xl bg-yellow-100 p-2 text-sm font-bold">{err}</p>}
    <div className="relative overflow-hidden rounded-2xl bg-black/10">
      {sel!==null?<img src={photos[sel]} alt="Captured photo" className="w-full"/>:<canvas ref={cv} className={`w-full ${on?'':'hidden'}`}/>}
      {!on&&sel===null&&<p className="grid aspect-video place-items-center text-sm font-bold">📷 The camera is off</p>}
      {count>0&&<span className="absolute inset-0 grid place-items-center text-7xl font-black text-white drop-shadow" aria-live="assertive">{count}</span>}</div>
    <div className="flex flex-wrap gap-2">
      {on?<button className={b} onClick={stop}>Stop camera</button>:<button className={b} onClick={start}>Open camera</button>}
      <button className={b} disabled={!on||count>0||sel!==null} onClick={snap}>Take photo</button>
      {sel!==null&&<><button className={b} onClick={()=>setSel(null)}>Retake</button><a className={b} href={photos[sel]} download={`sakura-cat-${Date.now()}.png`}>Download</a>
        <button className={b} onClick={()=>{setPhotos(p=>p.filter((_,i)=>i!==sel));setSel(null)}}>Delete</button></>}</div>
    <select aria-label="Filter" value={fi} onChange={e=>setFi(+e.target.value)} className="rounded-xl bg-white p-1 text-sm">{FILTERS.map(([n],i)=><option key={n} value={i}>{n}</option>)}</select>
    <div className="flex flex-wrap gap-1">{OVERLAYS.map(o=><button key={o} aria-pressed={ov.includes(o)} onClick={()=>setOv(s=>s.includes(o)?s.filter(x=>x!==o):[...s,o])} className={`rounded-full px-2 py-0.5 text-xs font-bold ${ov.includes(o)?'bg-pink-300':'bg-white/80'}`}>{o}</button>)}</div>
    {photos.length>0&&<div className="flex gap-1 overflow-x-auto">{photos.map((p,i)=><button key={i} aria-label={`Open photo ${photos.length-i}`} onClick={()=>setSel(i)} className="shrink-0"><img src={p} alt="" className="h-14 rounded-lg"/></button>)}</div>}
  </div>
}

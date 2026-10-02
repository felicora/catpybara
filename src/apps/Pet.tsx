import {useEffect,useState} from 'react'
import {useLocalStorage} from '../hooks/useLocalStorage'
import {DEV} from '../data/petDevice'
type S={food:number;joy:number;energy:number;t:number}
type Act='idle'|'eat'|'play'|'nap'
type Face='happy'|'hungry'|'tired'|'bored'|'eat'|'chew'|'play'|'nap'
type Rc=[number,number,number,number,string]
const cl=(n:number)=>Math.max(0,Math.min(100,n))
const K='#3b2b27',RD='#e8707f',INK='#3f6b52',GR='#b3a396',CREAM='#fbf3e4',PINK='#f4a7b6'
/* ---- Sprite: a 24x22 pixel cat generated from shapes, outlined automatically ---- */
const GW=24,GH=22
const tri=(x:number,y:number,[a,b,c]:number[][])=>{const s=(p:number[],q:number[],r:number[])=>(p[0]-r[0])*(q[1]-r[1])-(q[0]-r[0])*(p[1]-r[1]),p=[x+.5,y+.5],d=[s(p,a,b),s(p,b,c),s(p,c,a)];return !(d.some(v=>v<0)&&d.some(v=>v>0))}
const ell=(x:number,y:number,cx:number,cy:number,rx:number,ry:number)=>((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1
const EAR=[[[1.5,7],[2.5,.5],[9,4]],[[22.5,7],[21.5,.5],[15,4]]],INNER=[[[3,6],[3.6,2.6],[6.4,4.6]],[[21,6],[20.4,2.6],[17.6,4.6]]]
const TAIL=[[19,18],[20,18],[21,17],[21,16],[21,15],[20,14]]
const STRIPE=[[10,3],[10,4],[12,2],[12,3],[12,4],[14,3],[14,4],[2,9],[3,9],[2,11],[3,11],[20,9],[21,9],[20,11],[21,11],[8,16],[9,16],[14,16],[15,16],[9,18],[14,18]]
const has=(l:number[][],x:number,y:number)=>l.some(([a,b])=>a===x&&b===y)
const head=(x:number,y:number)=>ell(x,y,11.5,9.2,10.6,6.6)
const solid=(x:number,y:number)=>x>=0&&y>=0&&x<GW&&y<GH&&(head(x,y)||EAR.some(t=>tri(x,y,t))||ell(x,y,11.5,17,7,5)||has(TAIL,x,y))
const SPR:[string,string][]=(()=>{const by:Record<string,string>={};const add=(c:string,x:number,y:number)=>{by[c]=(by[c]??'')+`M${x+1} ${y+1}h1v1h-1z`}
  for(let y=-1;y<=GH;y++)for(let x=-1;x<=GW;x++){
    if(solid(x,y))add(has(TAIL,x,y)||has(STRIPE,x,y)?GR:!head(x,y)&&INNER.some(t=>tri(x,y,t))?PINK:CREAM,x,y)
    else if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>solid(x+dx,y+dy)))add('#5b463b',x,y)}
  return Object.entries(by)})()
/* ---- Expressions ---- */
const EYE:Record<string,Rc[]>={open:[[6,8,2,2,K],[16,8,2,2,K]],happy:[[5,9,1,1,K],[6,8,2,1,K],[8,9,1,1,K],[15,9,1,1,K],[16,8,2,1,K],[18,9,1,1,K]],closed:[[5,9,4,1,K],[15,9,4,1,K]],tired:[[5,8,4,1,K],[6,9,2,1,K],[15,8,4,1,K],[16,9,2,1,K]]}
const MOUTH:Record<string,Rc[]>={smile:[[10,12,1,1,K],[11,13,2,1,K],[13,12,1,1,K]],frown:[[10,13,1,1,K],[11,12,2,1,K],[13,13,1,1,K]],flat:[[10,12,4,1,K]],open:[[10,12,4,2,K],[11,13,2,1,RD]],tiny:[[11,12,2,1,K]]}
const FACE:Record<Face,[string,string]>={happy:['open','smile'],hungry:['open','frown'],tired:['tired','flat'],bored:['open','flat'],eat:['happy','open'],chew:['happy','smile'],play:['happy','open'],nap:['closed','tiny']}
/* ---- LCD glyphs ---- */
const bits=(rows:string[],x0:number,y0:number)=>rows.flatMap((r,y)=>[...r].map((c,x)=>c==='X'?`M${x0+x} ${y0+y}h1v1h-1z`:'')).join('')
const HEART=['.XX.XX.','XXXXXXX','XXXXXXX','.XXXXX.','..XXX..','...X...'],STAR=['...X...','...X...','XXXXXXX','.XXXXX.','..XXX..','.XX.XX.','.X...X.'],FORK=['X.X.X','X.X.X','XXXXX','.XXX.','..X..','..X..','..X..']
const Z=['XXXX','..X.','.X..','XXXX'],FISH=['..XXX..X','XXXXXXXX','..XXX..X'],YARN=['.XXX.','XXXXX','XXXXX','XXXXX','.XXX.'],FLOWER=['.X.','XXX','.X.']
const beep=(f:number[])=>{if(localStorage.getItem('scd-sound')==='false')return;try{const c=new AudioContext();f.forEach((hz,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=hz;g.gain.value=.04;o.connect(g).connect(c.destination);o.start(c.currentTime+i*.09);o.stop(c.currentTime+i*.09+.08)});setTimeout(()=>c.close(),700)}catch{/* no audio */}}
const SOUND={eat:[660,880,990],play:[523,659,784,1046],nap:[440,330,262]}
const MSG:Record<Face,string>={happy:'Mochi is purring 💕',hungry:'Mochi is hungry. A snack, please? 🐟',tired:'Mochi is sleepy 💤',bored:'Mochi wants to play 🧶',eat:'Nom nom nom! 🐟',chew:'Nom nom nom! 🐟',play:'Wheee! 🧶',nap:'Shh… napping 💤'}
/** Tamagotchi-style cat: needs drift down with real time; the left button feeds, the middle plays, the right naps. */
export default function Pet(){
  const [s,setS]=useLocalStorage<S>('scd-pet2',{food:70,joy:70,energy:80,t:Date.now()}),[act,setAct]=useState<Act>('idle'),[chew,setChew]=useState(false)
  useEffect(()=>{const decay=()=>setS(p=>{const m=(Date.now()-p.t)/60000;return {food:cl(p.food-m),joy:cl(p.joy-m*.7),energy:cl(p.energy-m*.5),t:Date.now()}});decay();const i=setInterval(decay,30000);return()=>clearInterval(i)},[])
  useEffect(()=>{if(act!=='eat')return;const i=setInterval(()=>setChew(c=>!c),300);return()=>clearInterval(i)},[act])
  const go=(a:Exclude<Act,'idle'>)=>{if(act!=='idle')return;setAct(a);beep(SOUND[a])
    setS(p=>({...p,food:cl(p.food+(a==='eat'?25:a==='play'?-6:0)),joy:cl(p.joy+(a==='eat'?3:a==='play'?20:6)),energy:cl(p.energy+(a==='nap'?40:a==='play'?-10:0))}))
    setTimeout(()=>setAct('idle'),a==='nap'?4500:2800)}
  const face:Face=act==='eat'?(chew?'chew':'eat'):act==='idle'?(s.food<25?'hungry':s.energy<25?'tired':s.joy<30?'bored':'happy'):act
  const [eye,mouth]=FACE[face],rects=[[3,10,2,2,'#f8b9b2'],[19,10,2,2,'#f8b9b2'],[11,10,2,1,PINK],...EYE[eye],...MOUTH[mouth]] as Rc[]
  const stat=(x:number,v:number,g:string[],y:number)=><g key={x}><path className={v<25?'pblink':''} d={bits(g,x,3)} fill={INK}/>{[0,1,2,3].map(i=><rect key={i} x={x+i*3} y={y} width="2" height="2" fill={INK} opacity={i<Math.ceil(v/25)?1:.22}/>)}</g>
  const mv=act==='play'?'phop':act==='nap'?'pnap':'pbob'
  return <div className="p-2 text-center">
    <div className="relative mx-auto w-full max-w-[460px]" style={{aspectRatio:`${DEV.w}/${DEV.h}`}}>
      <img src="/icons/pet-device.webp" alt="" draggable={false} className="absolute inset-0 h-full w-full select-none"/>
      <svg viewBox={`0 0 52 ${DEV.vbH}`} role="img" aria-label={`Mochi the cat. ${MSG[face]}`} className="absolute" style={{left:`${DEV.L}%`,top:`${DEV.T}%`,width:`${DEV.LW}%`,height:`${DEV.LH}%`,imageRendering:'pixelated'}} shapeRendering="crispEdges">
        {stat(5,s.food,FORK,12)}{stat(22,s.joy,HEART,12)}{stat(39,s.energy,STAR,12)}
        <path d="M3 41h46v1H3z" fill={INK} opacity=".35"/>
        {[4,45].map(x=><g key={x}><path d={bits(FLOWER,x-1,36)} fill="#f08aa6"/><path d={`M${x} 37h1v1h-1zM${x} 39h1v2h-1z`} fill="#f7c948"/></g>)}
        <g transform="translate(13 16)"><g className={mv}>
          {SPR.map(([c,d])=><path key={c} d={d} fill={c}/>)}
          <g transform="translate(1 1)">{rects.map(([x,y,w,h,c],i)=><rect key={i} x={x} y={y} width={w} height={h} fill={c}/>)}</g></g></g>
        {act==='eat'&&<path className="pfish" d={bits(FISH,0,0)} fill="#6aa7d6"/>}
        {act==='play'&&<path className="pyarn" d={bits(YARN,0,0)} fill="#f08aa6"/>}
        {(act==='eat'||act==='play')&&<g transform="translate(37 12)"><path className="pz" d={bits(HEART,0,0)} fill="#f08aa6"/></g>}
        {act==='nap'&&[[33,14,0],[37,10,.6],[41,6,1.2]].map(([x,y,d])=><g key={x} transform={`translate(${x} ${y})`}><path className="pz" d={bits(Z,0,0)} fill={INK} style={{animationDelay:`${d}s`}}/></g>)}
      </svg>
      {DEV.btn.map(([x,y,l,a])=><button key={l} aria-label={l} title={l} onClick={()=>go(a as Exclude<Act,'idle'>)} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition active:scale-90" style={{left:`${x}%`,top:`${y}%`,width:`${DEV.r}%`,aspectRatio:'1'}}/>)}
    </div>
    <p role="status" className="mt-1 text-sm font-black">{MSG[face]}</p>
    <p className="text-xs opacity-70">Left button feeds · middle plays · right naps</p>
  </div>
}

import {useState} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {useLocalStorage} from '../hooks/useLocalStorage'
import {save,svgImg} from '../utils/png'
const OPT:Record<string,string[]>={shape:['Round','Tall','Wide'],fur:['Cream','Grey','Charcoal','Snow','Ginger','Lavender'],eyeShape:['Round','Sleepy','Sparkle','Happy'],eyeColor:['Brown','Green','Blue','Amber','Violet'],mouth:['Smile','Open','Cat mouth','Calm','Oh'],clothes:['None','Sweater','Kimono','Overalls','Scarf'],hat:['None','Beret','Party','Top hat'],glasses:['None','Round','Square','Shades'],bow:['None','Pink','Lavender','Yellow'],sakura:['None','Ear flower','Petals','Crown'],bg:['Blush','Sky','Sage','Lavender','Cream','Butter'],pattern:['None','Dots','Stripes','Petals']}
const LABEL:Record<string,string>={shape:'Face shape',fur:'Fur color',eyeShape:'Eye shape',eyeColor:'Eye color',mouth:'Expression',clothes:'Clothes',hat:'Hat',glasses:'Glasses',bow:'Bow',sakura:'Sakura',bg:'Background',pattern:'Pattern'}
const FUR=['#ffd9b3','#d9d4cf','#6b5b5b','#ffffff','#f0a66b','#cdb8ef'],EYE=['#6b4a3a','#5fae7a','#5b9bd5','#d99a2b','#8a6bd1'],BOW=['','#f58fb0','#b9a3e3','#ffd166'],BG=['#fde0e8','#d6ecfa','#dcefd9','#e6dcf7','#fff3df','#fff0b8'],CLO=['','#f9b9cd','#b9a3e3','#9ec9ec','#ff8fa3'],INK='#4a3228'
export type Cfg=Record<string,number>
const DEF:Cfg=Object.fromEntries(Object.keys(OPT).map(k=>[k,0]))
const Fl=(x:number,y:number,r:number)=><g>{[0,72,144,216,288].map(a=><ellipse key={a} cx={x} cy={y-r} rx={r*.6} ry={r} fill="#f9c6d6" stroke="rgba(0,0,0,.1)" transform={`rotate(${a} ${x} ${y})`}/>)}<circle cx={x} cy={y} r={r*.35} fill="#f7c948"/></g>
/** Layers, back to front: background, body+clothes, ears, head, cheeks, eyes, nose, mouth, glasses, hat, bow, sakura. */
export function AvatarSvg({c}:{c:Cfg}){
  const [rx,ry]=[[60,54],[52,62],[70,48]][c.shape],fur=FUR[c.fur],top=100-ry,st={stroke:INK,strokeWidth:3,fill:'none',strokeLinecap:'round' as const}
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="Your cat avatar">
    <defs><pattern id="pt" width="24" height="24" patternUnits="userSpaceOnUse">{[null,<circle cx="12" cy="12" r="3" fill="#fff" opacity=".7"/>,<rect width="10" height="24" fill="#fff" opacity=".5"/>,<ellipse cx="12" cy="12" rx="3" ry="6" fill="#f7a8c0" opacity=".5"/>][c.pattern]}</pattern></defs>
    <rect width="200" height="200" fill={BG[c.bg]}/>{c.pattern>0&&<rect width="200" height="200" fill="url(#pt)"/>}
    <path d="M36 200q0-58 64-58t64 58z" fill={c.clothes?CLO[c.clothes]:fur}/>
    {c.clothes===2&&<rect x="76" y="170" width="48" height="14" fill="#ff8fa3"/>}{c.clothes===3&&<path d="M80 150v50M120 150v50" stroke="#6fa8d6" strokeWidth="8"/>}{c.clothes===4&&<ellipse cx="100" cy="152" rx="34" ry="9" fill="#ff8fa3"/>}
    <path d={`M${100-rx*.85} ${top+22} ${100-rx*.6} ${top-14} ${100-rx*.15} ${top+6}zM${100+rx*.85} ${top+22} ${100+rx*.6} ${top-14} ${100+rx*.15} ${top+6}z`} fill={fur}/>
    <ellipse cx="100" cy="100" rx={rx} ry={ry} fill={fur}/>
    <circle cx="64" cy="116" r="9" fill="#f7a8c0" opacity=".45"/><circle cx="136" cy="116" r="9" fill="#f7a8c0" opacity=".45"/>
    {[-22,22].map(d=>{const X=100+d;return <g key={d}>{[<circle cx={X} cy="100" r="7" fill={EYE[c.eyeColor]}/>,<path d={`M${X-8} 101q8 7 16 0`} {...st}/>,<><ellipse cx={X} cy="100" rx="7" ry="9" fill={EYE[c.eyeColor]}/><circle cx={X+2} cy="96" r="2.5" fill="#fff"/></>,<path d={`M${X-8} 103q8-9 16 0`} {...st}/>][c.eyeShape]}</g>})}
    <path d="M96 110h8l-4 5z" fill="#f7a8c0"/>
    {[<path d="M92 119q8 8 16 0" {...st}/>,<path d="M92 119q8 12 16 0z" fill="#ff8fa3" stroke={INK} strokeWidth="2"/>,<path d="M88 120q6 6 12 0q6 6 12 0" {...st}/>,<path d="M94 122h12" {...st}/>,<ellipse cx="100" cy="123" rx="4" ry="5" fill="#ff8fa3" stroke={INK} strokeWidth="2"/>][c.mouth]}
    {[null,<g {...st}><circle cx="78" cy="100" r="15"/><circle cx="122" cy="100" r="15"/><path d="M93 98h14"/></g>,<g {...st}><rect x="62" y="88" width="30" height="24" rx="4"/><rect x="108" y="88" width="30" height="24" rx="4"/><path d="M92 98h16"/></g>,<g fill={INK} opacity=".88"><rect x="62" y="88" width="32" height="20" rx="6"/><rect x="106" y="88" width="32" height="20" rx="6"/><rect x="92" y="92" width="16" height="4"/></g>][c.glasses]}
    {[null,<g><ellipse cx="100" cy={top+6} rx="40" ry="14" fill="#f58fb0"/><circle cx="100" cy={top-8} r="4" fill="#f58fb0"/></g>,<g><path d={`M72 ${top+8} 100 ${top-40} 128 ${top+8}z`} fill="#b9a3e3"/><circle cx="100" cy={top-40} r="5" fill="#ffd166"/></g>,<g fill={INK}><rect x="74" y={top-34} width="52" height="38"/><rect x="62" y={top+2} width="76" height="8" rx="3"/><rect x="74" y={top-4} width="52" height="6" fill="#f58fb0"/></g>][c.hat]}
    {c.bow>0&&<g transform={`translate(${100+rx*.62} ${top+20})`} fill={BOW[c.bow]} stroke="rgba(0,0,0,.15)"><path d="M0 0-16-10v20zM0 0 16-10v20z"/><circle r="5"/></g>}
    {[null,Fl(100-rx*.6,top+14,9),<g>{[[30,40],[170,70],[24,120],[176,140]].map(([x,y])=><ellipse key={x} cx={x} cy={y} rx="5" ry="8" fill="#f9c6d6" transform={`rotate(${x} ${x} ${y})`}/>)}</g>,<g>{Fl(76,top+6,6)}{Fl(100,top+1,6)}{Fl(124,top+6,6)}</g>][c.sakura]}
  </svg>
}
export default function AvatarCreator(){
  const [saved,setSaved]=useLocalStorage<Cfg|null>('scd-avatar',null)
  const [c,setC]=useState<Cfg>({...DEF,...saved}),[hist,setHist]=useState<Cfg[]>([]),[msg,setMsg]=useState('')
  const apply=(n:Cfg)=>{setHist(h=>[...h,c]);setC(n);setMsg('')}
  const rand=()=>apply(Object.fromEntries(Object.entries(OPT).map(([k,v])=>[k,Math.floor(Math.random()*v.length)])))
  const undo=()=>{setC(hist[hist.length-1]);setHist(h=>h.slice(0,-1))}
  const dl=async()=>{const i=await svgImg(renderToStaticMarkup(<AvatarSvg c={c}/>)),cv=document.createElement('canvas');cv.width=cv.height=600;cv.getContext('2d')!.drawImage(i,0,0,600,600);save(cv.toDataURL('image/png'),'sakura-cat-avatar.png')}
  const b='rounded-xl bg-pink-200 px-3 py-1 text-sm font-bold disabled:opacity-40'
  return <div className="space-y-2 p-3">
    <div className="mx-auto w-[min(60vw,220px)] overflow-hidden rounded-3xl shadow [&_svg]:h-auto [&_svg]:w-full"><AvatarSvg c={c}/></div>
    <div className="flex flex-wrap justify-center gap-1"><button className={b} onClick={rand}>Randomize</button><button className={b} disabled={!hist.length} onClick={undo}>Undo</button><button className={b} onClick={()=>apply(DEF)}>Reset</button>
      <button className={b} onClick={()=>{setSaved(c);setMsg('Saved ✿')}}>Save</button><button className={b} onClick={dl}>Download PNG</button></div>
    <p role="status" className="h-4 text-center text-xs font-bold">{msg}</p>
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">{Object.entries(OPT).map(([k,v])=><label key={k} className="text-xs font-bold">{LABEL[k]}
      <select value={c[k]} onChange={e=>apply({...c,[k]:+e.target.value})} className="w-full rounded-xl bg-white p-1 font-normal">{v.map((n,i)=><option key={n} value={i}>{n}</option>)}</select></label>)}</div>
  </div>
}

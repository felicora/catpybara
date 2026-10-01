import {useRef,useState,type ReactNode} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {useLocalStorage} from '../hooks/useLocalStorage'
import {save,svgImg} from '../utils/png'
type Sticker={id:string;n:string;c:string;d:ReactNode}
type Item={k:number;sid:string;x:number;y:number;s:number}
const K='#4a3228',L={stroke:K,strokeWidth:2,fill:'none',strokeLinecap:'round' as const}
const FACE:Record<string,ReactNode>={
  smile:<><circle cx="25" cy="33" r="2" fill={K}/><circle cx="39" cy="33" r="2" fill={K}/><path d="M28 40q4 4 8 0" {...L}/></>,
  sleep:<path d="M22 33q3 3 6 0M36 33q3 3 6 0M30 41q2 2 4 0" {...L}/>,
  wink:<><circle cx="25" cy="33" r="2" fill={K}/><path d="M36 33q3-3 6 0M28 40q4 4 8 0" {...L}/></>,
  happy:<path d="M22 34q3-4 6 0M36 34q3-4 6 0M28 40q4 5 8 0" {...L}/>,
  shock:<><circle cx="25" cy="33" r="3.5" fill={K}/><circle cx="39" cy="33" r="3.5" fill={K}/><ellipse cx="32" cy="42" rx="3" ry="4" fill={K}/></>,
  cry:<><circle cx="25" cy="33" r="2" fill={K}/><circle cx="39" cy="33" r="2" fill={K}/><path d="M25 36v7M39 36v7" stroke="#8ec5f0" strokeWidth="2.5" strokeLinecap="round"/><path d="M28 44q4-4 8 0" {...L}/></>,
  cool:<><rect x="19" y="29" width="12" height="7" rx="2" fill={K}/><rect x="33" y="29" width="12" height="7" rx="2" fill={K}/><path d="M28 41q4 4 8 0" {...L}/></>,
  sus:<path d="M21 32h8M35 32h8M28 41h8" {...L} strokeWidth="2.5"/>}
const cat=(f:string,k:string,x?:ReactNode)=><><path d="M12 28 14 8l14 10zM52 28 50 8 36 18z" fill={f} stroke="rgba(0,0,0,.15)"/><circle cx="32" cy="34" r="20" fill={f} stroke="rgba(0,0,0,.15)"/><circle cx="19" cy="40" r="3.5" fill="#f7a8c0" opacity=".5"/><circle cx="45" cy="40" r="3.5" fill="#f7a8c0" opacity=".5"/>{FACE[k]}{x}</>
const fl=(c:string)=><>{[0,72,144,216,288].map(a=><ellipse key={a} cx="32" cy="18" rx="8" ry="13" fill={c} stroke="rgba(0,0,0,.1)" transform={`rotate(${a} 32 32)`}/>)}<circle cx="32" cy="32" r="5" fill="#f7c948"/></>
const badge=(t:string,c:string)=><><rect x="5" y="14" width="54" height="36" rx="16" fill={c} stroke="rgba(0,0,0,.12)"/><text x="32" y="38" textAnchor="middle" fontSize="17" fontWeight="900" fill={K}>{t}</text></>
const fish=<><ellipse cx="28" cy="32" rx="18" ry="11" fill="#9ec9ec"/><path d="M44 32 58 20v24z" fill="#9ec9ec"/><circle cx="20" cy="29" r="2" fill={K}/></>
const rays=(a:number[],c:string)=>a.map(r=><path key={r} d="M32 8v6" stroke={c} strokeWidth="4" strokeLinecap="round" transform={`rotate(${r} 32 32)`}/>)
const mk=(c:string,a:[string,ReactNode][]):Sticker[]=>a.map(([n,d],i)=>({id:`${c}${i}`,n,c,d}))
export const STICKERS:Sticker[]=[
  ...mk('Cats',[['Tabby',cat('#ffd9b3','smile')],['Sleepy grey',cat('#d9d4cf','sleep')],['Night cat',cat('#6b5b5b','wink')],['Snow cat',cat('#fff','happy')],['Ginger',cat('#f0a66b','shock')],['Lavender cat',cat('#cdb8ef','cry')],['Cool cat',cat('#ffe3c8','cool')],['Cloud cat',cat('#e8f1fb','smile')]]),
  ...mk('Sakura',[['Pink blossom',fl('#f9c6d6')],['White blossom',fl('#fff')],['Lavender blossom',fl('#d9cdf5')],['Deep blossom',fl('#f58fb0')],['Branch',<><path d="M6 56q26-6 50-38" stroke="#7a5a48" strokeWidth="3" fill="none"/>{[[20,46],[34,36],[48,24]].map(([x,y])=><circle key={x} cx={x} cy={y} r="8" fill="#f9c6d6"/>)}</>]]),
  ...mk('Food',[['Onigiri',<><path d="M32 10 54 50H10z" fill="#fff" stroke="#e5d5cc" strokeWidth="2" strokeLinejoin="round"/><rect x="24" y="38" width="16" height="12" fill="#3b4a3c"/></>],['Dango',<><path d="M32 6v52" stroke="#c9a48c" strokeWidth="3"/><circle cx="32" cy="18" r="9" fill="#f9b9cd"/><circle cx="32" cy="34" r="9" fill="#fff" stroke="#eee"/><circle cx="32" cy="50" r="9" fill="#b8e0b0"/></>],['Fish',fish],['Tea cup',<><path d="M12 26h34v8q0 16-17 16T12 34z" fill="#fff" stroke="#c9a48c" strokeWidth="2"/><path d="M46 30q12 2 0 14" stroke="#c9a48c" strokeWidth="3" fill="none"/><path d="M24 16q-3-4 0-8M34 16q-3-4 0-8" stroke="#c9a48c" strokeWidth="2" fill="none"/></>],['Mochi',<><ellipse cx="32" cy="40" rx="22" ry="16" fill="#fff" stroke="#eee"/><path d="M24 36q2 3 4 0M36 36q2 3 4 0" {...L}/></>],['Strawberry',<><path d="M32 54C12 40 14 20 32 20s20 20 0 34z" fill="#ff6f8f"/><path d="M22 18q10-8 20 0l-10 4z" fill="#6bbf8a"/></>]]),
  ...mk('Reactions',[['Yay',badge('yay!','#ffe08a')],['Zzz',badge('zzz','#d9d0f5')],['Okay',badge('ok!','#c9ecd3')],['Huh',badge('?!','#ffd4dc')],['Meow',badge('meow','#cfe6f7')],['Thanks',badge('thx','#ffe3c8')]]),
  ...mk('Seasonal',[['Snowflake',<>{rays([0,60,120,180,240,300],'#9ec9ec')}</>],['Maple leaf',<><path d="M32 8C52 20 52 44 32 56 12 44 12 20 32 8z" fill="#f2a65a"/><path d="M32 14v42" stroke="#c77b34" strokeWidth="2"/></>],['Sun',<><circle cx="32" cy="32" r="12" fill="#ffc94d"/>{rays([0,45,90,135,180,225,270,315],'#ffc94d')}</>],['Umbrella',<><path d="M6 32a26 26 0 0 1 52 0z" fill="#f7a8c0"/><path d="M32 32v18q0 7 7 7" {...L} strokeWidth="3"/></>]]),
  ...mk('Cozy',[['Mug',<><rect x="12" y="22" width="32" height="30" rx="7" fill="#ffd4dc" stroke="#e7b7c6" strokeWidth="2"/><path d="M44 28q12 0 0 14" stroke="#e7b7c6" strokeWidth="5" fill="none"/></>],['Candle',<><rect x="22" y="26" width="20" height="30" rx="4" fill="#fff3d6" stroke="#eadbb8"/><path d="M32 8q8 10 0 16-8-6 0-16z" fill="#ffb347"/></>],['Book',<><rect x="10" y="12" width="44" height="42" rx="4" fill="#b9a3e3"/><rect x="16" y="12" width="38" height="38" rx="3" fill="#fff"/><path d="M22 24h26M22 32h26" stroke="#e7b7c6" strokeWidth="2"/></>],['Yarn',<><circle cx="32" cy="34" r="20" fill="#f58fb0"/><path d="M16 30q16 8 32-2M14 40q18 10 36 0" stroke="#fff" strokeWidth="2" fill="none"/></>]]),
  ...mk('Funny',[['Fish hat',cat('#ffd9b3','smile',<g transform="translate(16 -6) scale(.5)">{fish}</g>)],['Loaf',<><ellipse cx="32" cy="40" rx="25" ry="15" fill="#ffd9b3"/><path d="M18 30l2-10 8 6zM46 30l-2-10-8 6z" fill="#ffd9b3"/><path d="M22 36h6M36 36h6M30 42h4" {...L} strokeWidth="2.5"/></>],['Suspicious',cat('#e9e4dc','sus')],['Bonk',cat('#6b5b5b','shock',<path d="M50 6l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="#ffc94d"/>)]])]
const byId=(id:string)=>STICKERS.find(s=>s.id===id)!
const Stk=({s,size}:{s:Sticker;size:number|string})=><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} role="img" aria-label={s.n}>{s.d}</svg>
const TABS=['All','Favorites',...new Set(STICKERS.map(s=>s.c))]
const cl=(n:number)=>Math.max(0,Math.min(1,n))
export default function Stickers(){
  const [tab,setTab]=useState('All'),[q,setQ]=useState(''),[prev,setPrev]=useState<Sticker|null>(null),[selB,setSelB]=useState<number|null>(null)
  const [favs,setFavs]=useLocalStorage<string[]>('scd-stk-fav',[]),[board,setBoard]=useLocalStorage<Item[]>('scd-stk-board',[])
  const bd=useRef<HTMLDivElement>(null)
  const list=STICKERS.filter(s=>(tab==='All'||(tab==='Favorites'?favs.includes(s.id):s.c===tab))&&s.n.toLowerCase().includes(q.toLowerCase()))
  const add=(sid:string,x=.5,y=.5)=>{const k=Date.now();setBoard(b=>[...b,{k,sid,x,y,s:.2}]);setSelB(k)}
  const upd=(k:number,p:Partial<Item>)=>setBoard(b=>b.map(i=>i.k===k?{...i,...p}:i))
  const down=(e:React.PointerEvent,it:Item)=>{setSelB(it.k);const r=bd.current!.getBoundingClientRect()
    const mv=(ev:PointerEvent)=>upd(it.k,{x:cl((ev.clientX-r.left)/r.width),y:cl((ev.clientY-r.top)/r.height)})
    const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)}
  const key=(e:React.KeyboardEvent,it:Item)=>{const d=({ArrowLeft:[-.02,0],ArrowRight:[.02,0],ArrowUp:[0,-.02],ArrowDown:[0,.02]} as Record<string,number[]>)[e.key];if(d){e.preventDefault();upd(it.k,{x:cl(it.x+d[0]),y:cl(it.y+d[1])})}}
  const fav=(id:string)=>setFavs(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id])
  const dl=async()=>{const W=800,H=600,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d')!;x.fillStyle='#fff8ee';x.fillRect(0,0,W,H)
    for(const it of board){const w=it.s*W;x.drawImage(await svgImg(renderToStaticMarkup(<Stk s={byId(it.sid)} size={256}/>)),it.x*W-w/2,it.y*H-w/2,w,w)}
    save(cv.toDataURL('image/png'),'sticker-board.png')}
  const sel=board.find(i=>i.k===selB),b='rounded-xl bg-pink-200 px-3 py-1 text-sm font-bold disabled:opacity-40'
  return <div className="space-y-2 p-3">
    <input value={q} onChange={e=>setQ(e.target.value)} aria-label="Search stickers" placeholder="Search stickers…" className="w-full rounded-xl bg-white/90 p-2 text-sm"/>
    <div className="flex flex-wrap gap-1">{TABS.map(t=><button key={t} aria-pressed={tab===t} onClick={()=>setTab(t)} className={`rounded-full px-2 py-0.5 text-xs font-bold ${tab===t?'bg-pink-300':'bg-white/80'}`}>{t}</button>)}</div>
    <ul className="grid max-h-44 grid-cols-4 gap-1 overflow-auto sm:grid-cols-6">{list.map(s=><li key={s.id}><button draggable onDragStart={e=>e.dataTransfer.setData('text/plain',s.id)} onClick={()=>setPrev(s)} aria-label={`${s.n} sticker`} className="relative w-full rounded-xl bg-white/70 p-1"><Stk s={s} size="100%"/>{favs.includes(s.id)&&<span className="absolute right-0.5 top-0 text-xs" aria-hidden>★</span>}</button></li>)}
      {!list.length&&<li className="col-span-full text-sm">No stickers match yet.</li>}</ul>
    {prev&&<div role="dialog" aria-label="Sticker preview" className="rounded-2xl bg-white p-3 text-center shadow"><div className="mx-auto w-32"><Stk s={prev} size="100%"/></div><p className="font-black">{prev.n}</p>
      <div className="flex justify-center gap-2 pt-1"><button className={b} onClick={()=>fav(prev.id)}>{favs.includes(prev.id)?'★ Unfavorite':'☆ Favorite'}</button><button className={b} onClick={()=>add(prev.id)}>Add to board</button><button className={b} onClick={()=>setPrev(null)}>Close</button></div></div>}
    <div ref={bd} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(!STICKERS.some(s=>s.id===id))return;const r=e.currentTarget.getBoundingClientRect();add(id,cl((e.clientX-r.left)/r.width),cl((e.clientY-r.top)/r.height))}}
      className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#fff8ee] shadow-inner" style={{backgroundImage:'radial-gradient(#e9cfd8 1px,transparent 1px)',backgroundSize:'16px 16px'}}>
      {!board.length&&<p className="absolute inset-0 grid place-items-center p-4 text-center text-sm font-bold opacity-60">Drag stickers here, or open one and press “Add to board”.</p>}
      {board.map(it=><button key={it.k} aria-label={`${byId(it.sid).n} on board. Arrow keys move it.`} onPointerDown={e=>down(e,it)} onFocus={()=>setSelB(it.k)} onKeyDown={e=>key(e,it)}
        className={`absolute touch-none select-none ${it.k===selB?'outline-2 outline-dashed outline-[#b9a3e3]':''}`} style={{left:`${it.x*100}%`,top:`${it.y*100}%`,width:`${it.s*100}%`,transform:'translate(-50%,-50%)'}}><Stk s={byId(it.sid)} size="100%"/></button>)}</div>
    <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
      {sel&&<><label>Size <input type="range" min=".08" max=".5" step=".01" value={sel.s} onChange={e=>upd(sel.k,{s:+e.target.value})} className="accent-pink-400"/></label><button className={b} onClick={()=>{setBoard(x=>x.filter(i=>i.k!==sel.k));setSelB(null)}}>Remove</button></>}
      <button className={b} disabled={!board.length} onClick={()=>{setBoard([]);setSelB(null)}}>Clear board</button><button className={b} disabled={!board.length} onClick={dl}>Download PNG</button></div>
  </div>
}

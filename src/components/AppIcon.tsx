import type {ReactNode} from 'react'
// Original icon set: every app is a cat-eared tile with its own small glyph.
const G:Record<string,ReactNode>={
  clock:<><circle cx="32" cy="38" r="14" fill="#fff"/><path d="M32 29v9l6 4" stroke="#4a3228" strokeWidth="3" fill="none" strokeLinecap="round"/></>,
  game:<><circle cx="24" cy="38" r="8" fill="#fff"/><circle cx="41" cy="38" r="8" fill="#f7a8c0"/><circle cx="24" cy="39" r="2.5" fill="#4a3228"/><path d="M41 34l2 4-2 4-2-4z" fill="#fff"/></>,
  cal:<><rect x="17" y="27" width="30" height="24" rx="4" fill="#fff"/><path d="M17 33h30" stroke="#f7a8c0" strokeWidth="7"/><circle cx="26" cy="43" r="2" fill="#4a3228"/><circle cx="33" cy="43" r="2" fill="#4a3228"/><circle cx="40" cy="43" r="2" fill="#f7a8c0"/></>,
  music:<><path d="M27 46V30l14-4v16" stroke="#4a3228" strokeWidth="3" fill="none"/><circle cx="24" cy="46" r="4" fill="#4a3228"/><circle cx="38" cy="42" r="4" fill="#4a3228"/></>,
  photo:<><rect x="15" y="29" width="34" height="22" rx="5" fill="#fff"/><circle cx="32" cy="40" r="7" fill="#b9e3d0" stroke="#4a3228" strokeWidth="2.5"/></>,
  mood:<><circle cx="32" cy="39" r="14" fill="#fff"/><circle cx="27" cy="37" r="2" fill="#4a3228"/><circle cx="37" cy="37" r="2" fill="#4a3228"/><path d="M27 43q5 5 10 0" stroke="#4a3228" strokeWidth="2.5" fill="none" strokeLinecap="round"/></>,
  notes:<><rect x="19" y="29" width="26" height="24" rx="3" fill="#fff"/><path d="M24 37h16M24 43h16M24 48h9" stroke="#e7b7c6" strokeWidth="2.5"/><rect x="26" y="26" width="12" height="5" fill="#b9a3e3" opacity=".85"/></>,
  todo:<><rect x="19" y="29" width="26" height="24" rx="5" fill="#fff"/><path d="M25 41l4 4 9-10" stroke="#6bbf8a" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
  settings:<><ellipse cx="32" cy="46" rx="9" ry="6" fill="#f7a8c0"/>{[[21,39],[28,33],[36,33],[43,39]].map(([x,y])=><circle key={x} cx={x} cy={y} r="3.5" fill="#f7a8c0"/>)}</>,
  pet:<path d="M32 52C17 42 19 29 27 30q5 1 5 5 0-4 5-5c8-1 10 12-5 22z" fill="#ff8fa3"/>,
  avatar:<><circle cx="32" cy="41" r="12" fill="#fff"/><path d="M22 35 24 26l7 4zM42 35 40 26 33 30z" fill="#fff"/><circle cx="28" cy="41" r="1.8" fill="#4a3228"/><circle cx="36" cy="41" r="1.8" fill="#4a3228"/><path d="M44 29l7-4v9z" fill="#f58fb0"/></>,
  stickers:<>{[0,72,144,216,288].map(a=><ellipse key={a} cx="32" cy="37" rx="5" ry="8" fill="#fff" transform={`rotate(${a} 32 44)`}/>)}<circle cx="32" cy="44" r="3" fill="#f7c948"/></>,
  term:<><rect x="16" y="29" width="32" height="22" rx="4" fill="#4a3228"/><path d="M22 36l5 4-5 4M30 45h9" stroke="#ffd4dc" strokeWidth="2.5" fill="none" strokeLinecap="round"/></>}
export default function AppIcon({id,tint,size=56}:{id:string;tint:string;size?:number}){
  return <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
    <path d="M10 24 12 6l14 9zM54 24 52 6 38 15z" fill={tint} stroke="rgba(0,0,0,.2)" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="6" y="12" width="52" height="46" rx="16" fill={tint} stroke="rgba(0,0,0,.2)" strokeWidth="1.5"/>
    <ellipse cx="32" cy="19" rx="18" ry="4" fill="#fff" opacity=".4"/>
    <circle cx="23" cy="23" r="2" fill="#4a3228"/><circle cx="41" cy="23" r="2" fill="#4a3228"/>
    <g transform="translate(0 4)">{G[id]}</g></svg>
}

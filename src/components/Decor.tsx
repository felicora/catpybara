const L=(x:number,y:number)=>({transform:`translate(calc(var(--px)*${x}px),calc(var(--py)*${y}px))`})
const petals=(c:string,r:number)=>[0,72,144,216,288].map(a=><ellipse key={a} cx="12" cy={12-r} rx={r*.6} ry={r} fill={c} transform={`rotate(${a} 12 12)`}/>)
const Bf=({c,s}:{c:string;s:React.CSSProperties})=><svg viewBox="0 0 30 24" width="30" className="bf" style={s}><path className="wl" d="M15 12C6 0 0 6 4 13c2 4 8 3 11-1z" fill={c}/><path className="wr" d="M15 12C24 0 30 6 26 13c-2 4-8 3-11-1z" fill={c}/><path d="M15 6v12" stroke="#4a3228" strokeWidth="1.5" strokeLinecap="round"/></svg>
const Bird=({s}:{s:React.CSSProperties})=><svg viewBox="0 0 24 12" width="26" className="bird" style={s}><path d="M1 8Q6 0 12 7Q18 0 23 8" stroke="#4a3228" fill="none" strokeWidth="1.6" strokeLinecap="round"/></svg>
const Paw=({x,r,d}:{x:number;r:number;d:number})=><svg viewBox="0 0 20 20" width="18" className="paw" style={{left:`${x}%`,bottom:`${96+(x%3)*14}px`,transform:`rotate(${r}deg)`,animationDelay:`${d}s`}}><ellipse cx="10" cy="13" rx="5" ry="4" fill="#f0a6b8"/>{[[3,7],[7,3],[13,3],[17,7]].map(([a,b])=><circle key={a} cx={a} cy={b} r="2" fill="#f0a6b8"/>)}</svg>
/** Ambient scenery in three parallax layers; purely decorative. */
export default function Decor(){
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
    <div className="absolute inset-0" style={L(-18,-8)}>
      {[[180,6,150,0],[260,13,190,-60],[140,22,230,-120]].map(([w,t,d,dl])=><i key={w} className="cloud" style={{width:w,height:w/4,top:`${t}%`,animationDuration:`${d}s`,animationDelay:`${dl}s`}}/>)}
      <Bird s={{top:'9%',animationDuration:'52s',animationDelay:'-10s'}}/><Bird s={{top:'17%',animationDuration:'70s',animationDelay:'-38s'}}/></div>
    <div className="absolute inset-0" style={L(10,5)}>
      <Bf c="#f9a8c9" s={{left:'12%',top:'52%',animationDuration:'30s'}}/><Bf c="#c9b8f0" s={{left:'46%',top:'40%',animationDuration:'38s',animationDelay:'-12s'}}/>
      {Array.from({length:14},(_,i)=><i key={i} className="spk" style={{left:`${(i*37)%97}%`,top:`${(i*53)%68}%`,fontSize:8+(i%4)*3,animationDelay:`${i*.37}s`}}>✦</i>)}</div>
    <div className="absolute inset-0" style={L(26,12)}>
      {[[2,'#f9c6d6',34],[5,'#fff',26],[8,'#d9cdf5',30],[89,'#d9cdf5',28],[93,'#f9c6d6',36],[96,'#fff',26]].map(([x,c,h])=><svg key={x} viewBox="0 0 24 40" className="absolute bottom-0" style={{left:`${x}%`,height:Number(h)+14}}><path d="M12 14v26" stroke="#7fb58a" strokeWidth="2"/><path d="M12 30q8-2 9-8-7 0-9 8z" fill="#9fcf9f"/><g>{petals(String(c),6)}<circle cx="12" cy="12" r="2.4" fill="#f7c948"/></g></svg>)}
      <svg viewBox="0 0 40 64" width="64" className="absolute bottom-24 left-4 hidden md:block"><path d="M4 18 20 4l16 14z" fill="#8d8a8f"/><rect x="9" y="18" width="22" height="20" fill="#a9a6ab"/><rect className="glow" x="13" y="22" width="14" height="12" rx="2" fill="#ffd98a"/><rect x="6" y="38" width="28" height="5" fill="#8d8a8f"/><rect x="15" y="43" width="10" height="14" fill="#a9a6ab"/><rect x="8" y="57" width="24" height="6" rx="2" fill="#8d8a8f"/></svg>
      <svg viewBox="0 0 70 56" width="84" className="absolute bottom-24 left-24 hidden md:block"><ellipse cx="35" cy="50" rx="30" ry="5" fill="#8b6a55" opacity=".3"/><path d="M12 22h38v10q0 14-19 14T12 32z" fill="#fff" stroke="#e5cfc4" strokeWidth="2"/><ellipse cx="31" cy="22" rx="19" ry="4" fill="#cfe3a8"/><path d="M50 26q14 0 0 14" stroke="#e5cfc4" strokeWidth="4" fill="none"/><path className="steam" d="M22 12q-4-5 0-10M32 12q-4-5 0-10M42 12q-4-5 0-10" stroke="#fff" strokeWidth="2" fill="none"/><circle cx="24" cy="32" r="3" fill="#f9c6d6"/></svg>
      {[[22,-20,0],[27,12,1.5],[32,-8,3],[63,15,4.5],[68,-12,6],[73,10,7.5]].map(([x,r,d])=><Paw key={x} x={x} r={r} d={d}/>)}
      <figure className="absolute left-5 top-16 hidden w-36 -rotate-3 bg-white p-2 pb-1 shadow-xl lg:block"><i className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-2 bg-pink-200/80"/>
        <video src="/cat/peek.mp4" autoPlay loop muted playsInline className="aspect-[4/3] w-full object-cover"/><figcaption className="py-1 text-center text-xs font-black">peek-a-boo 🌸</figcaption></figure></div>
  </div>
}

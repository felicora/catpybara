import {useEffect,useState} from 'react'
import {useLocalStorage} from '../hooks/useLocalStorage'
import {Petals} from '../Scene'
const N=15,DIRS=[[1,0],[0,1],[1,1],[1,-1]]
const at=(b:number[],r:number,c:number)=>r>=0&&r<N&&c>=0&&c<N?b[r*N+c]:-1
/** Length of the line through (r,c) if p played there, and how many ends are open. */
function run(b:number[],r:number,c:number,p:number,[dr,dc]:number[]){
  let n=1,o=0
  for(const s of [1,-1]){let y=r+dr*s,x=c+dc*s;while(at(b,y,x)===p){n++;y+=dr*s;x+=dc*s};if(at(b,y,x)===0)o++}
  return [n,o]
}
const won=(b:number[],r:number,c:number,p:number)=>DIRS.some(d=>run(b,r,c,p,d)[0]>=5)
const val=(b:number[],r:number,c:number,p:number)=>DIRS.reduce((s,d)=>{const [n,o]=run(b,r,c,p,d)
  return s+(n>=5?1e6:n===4?[0,1e4,1e5][o]:n===3?[0,100,1e3][o]:n===2?[0,10,100][o]:1)},0)
const DEF=[.5,.9,1.1],NOISE=[30,2,1]
function pick(b:number[],lvl:number){
  let best=-1,bs=-Infinity
  b.forEach((v,i)=>{if(v)return;const r=Math.floor(i/N),c=i%N
    const s=val(b,r,c,2)+val(b,r,c,1)*DEF[lvl]+Math.random()*NOISE[lvl]-Math.hypot(r-7,c-7)*.1
    if(s>bs){bs=s;best=i}})
  return best
}
export default function FiveInARow(){
  const [board,setBoard]=useState<number[]>(()=>Array(N*N).fill(0))
  const [turn,setTurn]=useState(1)
  const [winner,setWinner]=useState(0) // 1|2 = player, 3 = draw
  const [mode,setMode]=useState<'pc'|'pvp'>('pc')
  const [lvl,setLvl]=useLocalStorage('scd-gomoku-lvl',1)
  const [score,setScore]=useLocalStorage('scd-gomoku-score',{1:0,2:0,d:0})
  const reset=()=>{setBoard(Array(N*N).fill(0));setTurn(1);setWinner(0)}
  const play=(i:number)=>{
    if(board[i]||winner)return
    const b=[...board];b[i]=turn
    setBoard(b)
    if(won(b,Math.floor(i/N),i%N,turn)){setWinner(turn);setScore(s=>({...s,[turn]:s[turn as 1|2]+1}))}
    else if(b.every(Boolean)){setWinner(3);setScore(s=>({...s,d:s.d+1}))}
    else setTurn(3-turn)
  }
  useEffect(()=>{
    if(mode!=='pc'||turn!==2||winner)return
    const t=setTimeout(()=>play(pick(board,lvl)),350);return()=>clearTimeout(t)
  })
  const name=(p:number)=>p===1?'🐾 Paw':'🌸 Sakura'
  return <div className="space-y-2 p-3">
    {winner>0&&winner<3&&<Petals n={18}/>}
    <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
      <select aria-label="Mode" value={mode} onChange={e=>{setMode(e.target.value as 'pc'|'pvp');reset()}} className="rounded-xl bg-white p-1"><option value="pc">vs Computer</option><option value="pvp">2 players</option></select>
      {mode==='pc'&&<select aria-label="Difficulty" value={lvl} onChange={e=>setLvl(+e.target.value)} className="rounded-xl bg-white p-1"><option value={0}>Easy</option><option value={1}>Normal</option><option value={2}>Hard</option></select>}
      <button onClick={reset} className="rounded-xl bg-pink-200 px-3 py-1">New game</button>
    </div>
    <p role="status" className="text-sm font-black">{winner===3?'Draw! Everyone gets a treat 🍡':winner?`${name(winner)} wins! 🎉`:`Turn: ${name(turn)}`}
      <span className="ml-2 text-xs font-semibold opacity-70">🐾 {score[1]} · 🌸 {score[2]} · draws {score.d}</span></p>
    <div className="mx-auto grid w-[min(100%,440px)] grid-cols-[repeat(15,minmax(0,1fr))] gap-px rounded-2xl bg-[#d9a8b8] p-1 shadow-inner">
      {board.map((v,i)=><button key={i} onClick={()=>play(i)} aria-label={`Row ${Math.floor(i/N)+1}, column ${i%N+1}${v?`, ${name(v)}`:''}`}
        className="aspect-square bg-[#fff4e4] text-[clamp(9px,2.6vw,17px)] leading-none hover:bg-pink-100">{v===1?'🐾':v===2?'🌸':''}</button>)}
    </div>
  </div>
}

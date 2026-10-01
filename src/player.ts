import {useSyncExternalStore} from 'react'
// Placeholder paths: put royalty-free MP3s with these names in public/audio/ (see public/audio/README.md).
export const TRACKS=[{t:'Sakura Morning',c:'#f9c9d9',src:'/audio/sakura-morning.mp3'},{t:'Rainy Cat Café',c:'#cfe6f7',src:'/audio/rainy-cat-cafe.mp3'},{t:'Tokyo Night Walk',c:'#b9a8e6',src:'/audio/tokyo-night-walk.mp3'},{t:'Cozy Study Session',c:'#ffe3a8',src:'/audio/cozy-study-session.mp3'},{t:'Dreamy Spring Afternoon',c:'#cdeccf',src:'/audio/dreamy-spring-afternoon.mp3'}]
type St={i:number;pl:boolean;cur:number;dur:number;err:string;loop:boolean;sh:boolean}
/** One shared audio element so the desktop widget and the Music window always agree. */
let st:St={i:0,pl:false,cur:0,dur:0,err:'',loop:false,sh:false}
const subs=new Set<()=>void>(),audio=new Audio(TRACKS[0].src)
const set=(p:Partial<St>)=>{st={...st,...p};subs.forEach(f=>f())}
try{audio.volume=JSON.parse(localStorage.getItem('scd-vol')??'.7')}catch{/* keep default */}
const miss=()=>`Add an MP3 at public${TRACKS[st.i].src}`
const play=()=>audio.play().then(()=>set({pl:true,err:''})).catch(()=>set({pl:false,err:miss()}))
audio.ontimeupdate=()=>set({cur:audio.currentTime});audio.onloadedmetadata=()=>set({dur:audio.duration})
audio.onerror=()=>set({pl:false,err:miss()});audio.onended=()=>player.next()
export const player={audio,
  toggle:()=>{if(st.pl){audio.pause();set({pl:false})}else play()},
  go:(n:number)=>{const was=st.pl;audio.src=TRACKS[n].src;set({i:n,cur:0,dur:0,err:''});if(was)play()},
  next:(d=1)=>player.go(st.sh&&d>0?(st.i+1+Math.floor(Math.random()*(TRACKS.length-1)))%TRACKS.length:(st.i+d+TRACKS.length)%TRACKS.length),
  seek:(t:number)=>{audio.currentTime=t},shuffle:()=>set({sh:!st.sh}),setLoop:(l:boolean)=>{audio.loop=l;set({loop:l})}}
export const usePlayer=()=>useSyncExternalStore(f=>{subs.add(f);return()=>{subs.delete(f)}},()=>st)

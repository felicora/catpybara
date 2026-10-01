export const dkey=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
/** Monday-first month grid: leading nulls pad the first week. */
export function monthGrid(y:number,m:number){
  const lead=(new Date(y,m,1).getDay()+6)%7
  return [...Array<null>(lead).fill(null),...Array.from({length:new Date(y,m+1,0).getDate()},(_,i)=>new Date(y,m,i+1))]
}
export const weekdays=()=>Array.from({length:7},(_,i)=>new Date(2024,0,1+i).toLocaleDateString([],{weekday:'short'}))

export const ZONES=[
  {city:'Oslo',country:'Norway',tz:'Europe/Oslo'},
  {city:'Kuala Lumpur',country:'Malaysia',tz:'Asia/Kuala_Lumpur'},
  {city:'New York',country:'United States',tz:'America/New_York'}]
/** Minutes east of UTC, read from Intl at the given instant so DST is automatic (nothing hard-coded). */
export function offset(d:Date,tz:string){
  const n=new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'shortOffset'}).formatToParts(d).find(p=>p.type==='timeZoneName')?.value??'GMT'
  const m=/GMT([+-])(\d+)(?::(\d+))?/.exec(n)
  return m?(m[1]==='-'?-1:1)*(+m[2]*60+ +(m[3]??0)):0
}
export const fmtOffset=(m:number)=>`UTC${m<0?'-':'+'}${Math.floor(Math.abs(m)/60)}${Math.abs(m)%60?':'+String(Math.abs(m)%60).padStart(2,'0'):''}`
export function info(d:Date,tz:string,h12:boolean){
  const f=(o:Intl.DateTimeFormatOptions)=>new Intl.DateTimeFormat('en-GB',{timeZone:tz,...o})
  const time=f({hour:'2-digit',minute:'2-digit',second:'2-digit',...(h12?{hour12:true}:{hourCycle:'h23'})}).format(d)
  const date=f({weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(d)
  const hour=+f({hour:'numeric',hourCycle:'h23'}).format(d)
  const off=offset(d,tz)
  return {time,date,day:hour>=6&&hour<19,off:fmtOffset(off),diff:(off+d.getTimezoneOffset())/60}
}

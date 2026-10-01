export const svgImg=(m:string)=>new Promise<HTMLImageElement>((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(m)})
export const save=(url:string,name:string)=>{const a=document.createElement('a');a.href=url;a.download=name;a.click()}

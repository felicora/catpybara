export type Wall={id:string;name:string;src:string;thumb:string;pos?:string;video?:string}
const w=(id:string,name:string,extra:Partial<Wall>={}):Wall=>({id,name,src:`/wallpapers/${id}.webp`,thumb:`/wallpapers/${id}-t.webp`,...extra})
export const WALLS:Wall[]=[w('fuji','Fuji Kitten'),w('branch','Branch Kitten'),w('nap','Sunny Nap'),w('onsen','Onsen Capybara'),w('stairs','Sakura Stairs'),
  w('live','Live: Sakura Grove',{video:'/wallpapers/live.mp4'}),w('beach','Beach Ride'),w('lily','Lily Pad'),w('path','Mountain Path',{pos:'center 62%'}),
  w('cpicnic','Blossom Picnic'),w('consen','Hot Spring'),w('cboat','Rowboat Lake'),w('cautumn','Autumn Cuddle'),w('cpicnic2','Picnic Nap'),w('csnow','Snowy Onsen'),w('cbeach','Beach Day'),w('cmaple','Maple Hill'),w('csnowman','Snowman Capy'),w('csanta','Santa Capy')]

export const vehicleKinds={car:'Otomobil',motorcycle:'Motosiklet',van:'Kamyonet'};
export const bodyStyles={other:'Belirtilmedi',sedan:'Sedan',suv:'SUV',hatchback:'Hatchback',wagon:'Station wagon'};
export const maintenanceKinds={periodic:'Periyodik bakım',oil:'Motor yağı',oil_filter:'Yağ filtresi',air_filter:'Hava filtresi',summer_tyre:'Yazlık lastik',winter_tyre:'Kışlık lastik',other:'Diğer bakım'};
const days=(a,b)=>(new Date(a+'T12:00:00Z')-new Date(b+'T12:00:00Z'))/86400000;
export function vehicleProgress(record,vehicle,today){
 if(!record||record.date>today)return {value:null,text:record?'Başlangıç tarihi bekleniyor':'Kayıt yok',level:'info'};
 const ratios=[],parts=[];
 if(record.type==='maintenance'){
  if(record.next_date&&record.next_date>record.date){ratios.push(days(today,record.date)/days(record.next_date,record.date));parts.push(days(record.next_date,today)>=0?`${days(record.next_date,today)} gün kaldı`:`${-days(record.next_date,today)} gün geçti`)}
  if(record.next_km>record.km){ratios.push(Math.max(0,vehicle.km-record.km)/(record.next_km-record.km));parts.push(vehicle.km<=record.next_km?`${(record.next_km-vehicle.km).toLocaleString('tr-TR')} km kaldı`:`${(vehicle.km-record.next_km).toLocaleString('tr-TR')} km aşıldı`)}
 }else if(record.end_date&&record.end_date>record.date){ratios.push(days(today,record.date)/days(record.end_date,record.date));const left=days(record.end_date,today);parts.push(left>=0?`${left} gün kaldı`:`${-left} gün geçti`);if(['insurance','casco'].includes(record.type)&&left>=0){const start=new Date(record.date+'T12:00:00Z'),now=new Date(today+'T12:00:00Z');const months=(now.getUTCFullYear()-start.getUTCFullYear())*12+now.getUTCMonth()-start.getUTCMonth()-(now.getUTCDate()<start.getUTCDate()?1:0)+1;parts.unshift(`${months}. ayındasınız`)}}
 const ratio=ratios.length?Math.max(...ratios):null;
 return {value:ratio===null?null:Math.round(Math.max(0,Math.min(1,ratio))*100),text:parts.join(' · ')||'Değişim aralığı tanımlanmadı',level:ratio===null?'info':ratio>=1?'danger':ratio>=.8?'warning':'info'};
}

let csrf = '';
export async function api(action, body, params = {}, signal) {
  const response = await fetch(`${import.meta.env.BASE_URL}api/index.php?action=${encodeURIComponent(action)}&${new URLSearchParams(params)}`, {
    signal, method: body ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store',
    headers: body ? {'Content-Type':'application/json','X-CSRF-Token':csrf} : {},
    ...(body ? {body:JSON.stringify(body)} : {}),
  });
  let result;
  try {result = await response.json();} catch {throw new Error('Sunucudan geçerli yanıt alınamadı. PHP kurulumunu kontrol edin.');}
  if(!response.ok) {const error=new Error(result.error||'İşlem tamamlanamadı.');error.status=response.status;error.upgradeRequired=result.upgradeRequired;throw error;}
  if(result.csrf) csrf=result.csrf;
  return result;
}

export function requestId(){return typeof crypto.randomUUID==='function'?crypto.randomUUID():'10000000-1000-4000-8000-100000000000'.replace(/[018]/g,c=>(Number(c)^(crypto.getRandomValues(new Uint8Array(1))[0]&(15>>(Number(c)/4)))).toString(16));}

export async function uploadBackup(file) {
 const form=new FormData();form.append('backup',file);
 const response=await fetch(`${import.meta.env.BASE_URL}api/index.php?action=backup_upload`,{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'X-CSRF-Token':csrf},body:form});
 let result;try{result=await response.json()}catch{throw new Error('Dosya yüklenemedi. Hosting yükleme sınırını kontrol edin.')}
 if(!response.ok)throw new Error(result.error||'Yedek yüklenemedi.');return result;
}
export async function downloadBackup(id) {
 const response=await fetch(`${import.meta.env.BASE_URL}api/index.php?action=backup_download&id=${encodeURIComponent(id)}`,{credentials:'same-origin',cache:'no-store'});
 if(!response.ok){let result;try{result=await response.json()}catch{/* Optional browser storage/response parsing may be unavailable. */}throw new Error(result?.error||'Yedek indirilemedi.')}
 const url=URL.createObjectURL(await response.blob()),a=document.createElement('a');a.href=url;a.download=`finans-yedek-${id}.jsonl`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

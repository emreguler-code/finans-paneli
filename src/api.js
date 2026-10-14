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

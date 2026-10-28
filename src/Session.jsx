import { useState, useEffect } from 'react';
import {ChartNoAxesCombined, LockKeyhole} from 'lucide-react';
import {api} from './api';
import {NavigationProvider} from './Navigation';
import {App} from './App';
import {SearchStateProvider} from './SearchState';
import {useViewport} from './ui';
export function Session() {
 useViewport();
 const [upgrade,setUpgrade]=useState(false);
 const [session,setSession]=useState(null),[data,setData]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function load(){setError('');try{const s=await api('session');setSession(s);if(s.user)setData(await api('state'));else setData(null);}catch(e){setError(e.message);setUpgrade(Boolean(e.upgradeRequired));}}
 useEffect(()=>{load();},[]);
 async function submit(e){e.preventDefault();if(busy)return;setBusy(true);setError('');try{const values=Object.fromEntries(new FormData(e.currentTarget));await api(session.setupRequired?'setup':'login',values);await load();}catch(e){setError(e.message);}finally{setBusy(false);}}
 async function logout(){try{await api('logout',{});history.replaceState(null,'',location.pathname+location.search+'#/ozet');setData(null);await load();}catch(e){setError(e.message);}}
 if(upgrade&&session?.user)return <div className="auth-shell"><section className="panel auth-panel"><h1>Güncelleme hazır</h1><p className="muted">{error}</p>{session.user.role==='admin'?<a className="primary-button" href="update.php">Güncelleme ekranını aç</a>:<p>Yöneticinizin güncellemeyi tamamlamasını bekleyin.</p>}<button className="text-button" onClick={()=>{setUpgrade(false);load()}}>Yeniden kontrol et</button></section></div>;
 if(data&&session?.user)return <SearchStateProvider><NavigationProvider><App initialData={data} onLogout={logout}/></NavigationProvider></SearchStateProvider>;
 return <LoginPanel session={session} error={error} busy={busy} submit={submit} load={load}/>;
}
export function LoginPanel({session,error='',busy=false,submit,load}) {
 return <div className="auth-shell"><section className="panel auth-panel"><div className="brand"><span className="brand-mark"><ChartNoAxesCombined size={21}/></span><span>finans<span className="brand-period">.</span></span></div><h1>{session?.setupRequired?'İlk kurulum':session?'Çalışma alanına giriş':'Çalışma alanı yükleniyor'}</h1><p className="muted">{session?.setupRequired?'Veritabanına bağlanıldı. Yönetici hesabını oluştur.':'Hesaplarını ve kayıtlarını güvenle takip et.'}</p>{error&&<p className="form-error" role="alert">{error}</p>}{session?<form onSubmit={submit}>{session.setupRequired&&<label>Kurulum anahtarı<input type="password" name="token" required autoComplete="off"/></label>}<label>Kullanıcı adı<input name="username" required maxLength={80} autoComplete="username"/></label><label>Parola<input type="password" name="password" required minLength={session.setupRequired?12:1} maxLength={72} autoComplete={session.setupRequired?'new-password':'current-password'}/></label><button className="primary-button wide" disabled={busy}><LockKeyhole size={16}/>{busy?'İşleniyor…':session.setupRequired?'Hesabı oluştur':'Giriş yap'}</button></form>:error&&<button className="secondary-button" onClick={load}>Yeniden dene</button>}</section></div>;
}
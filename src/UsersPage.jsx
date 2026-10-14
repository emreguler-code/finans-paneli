
import {Pencil} from 'lucide-react';
import {roleName} from './ui';
export function UsersPage({data,open}) {return <section className="panel">{data.users.map(u=><div className="finance-due" key={u.id}><div><strong>{u.short_name}</strong><p>{u.username} · {roleName[u.role]}{!Number(u.active)?' · Pasif':''}</p></div><button className="secondary-button icon-only" aria-label="Düzenle" title="Düzenle" onClick={()=>open({entity:'user',item:u})}><Pencil size={16}/></button></div>)}</section>;}

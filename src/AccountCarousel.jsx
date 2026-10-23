import useEmblaCarousel from 'embla-carousel-react';
import { useRef, useState, useLayoutEffect, useEffect, useCallback } from 'react';
import {ChevronLeft, ChevronRight, Wallet, Info, Pencil} from 'lucide-react';
import {BankMark, ProgramMark, bankName} from './BankCards';
import {fmt, tone, can} from './ui';
import {isKmh, kmhUsage, hasMaturity} from './account-utils.mjs';
import {dateLabel} from './DatePicker';
import {limitSegments} from './operations.mjs';
export function AccountFace({item:a,isCard,actions}){
 const limit=isCard?limitSegments(a):null;const kmh=isKmh(a)?kmhUsage(a):null;
 return <section className={'panel account-face '+(isCard?'credit-face':'bank-face')}><header><div><p>{bankName(a.bank_code)||a.bank||a.type||'Kredi kartı'}</p><h2>{a.name}{!a.active?' · Arşiv':''}</h2>{isCard?<><div className="card-mask">**** **** **** {a.last_four||'••••'}</div><p>{a.holder||'Kart sahibi belirtilmedi'}</p></>:<>{a.iban&&<p className="account-iban">{a.iban}</p>}<p>{a.holder||'Hesap sahibi belirtilmedi'}</p></>}</div><div className="face-mark">{isCard?<><BankMark code={a.bank_code}/><ProgramMark code={a.program_code}/></>:a.type==='Kasa'?<Wallet size={26}/>:<BankMark code={a.bank_code}/>}</div></header>{actions&&<div className="account-card-actions">{actions}</div>}
 {isCard?<div className="card-limit-area"><div className="limit-total"><span>Toplam limit</span><strong>{fmt(a.limit_cents)} TL</strong></div><div className="limit-bar" aria-label={`Kalan ekstre borcu ${fmt(limit.statement)}, dönem ve taksitler ${fmt(limit.period)}, kullanılabilir ${fmt(limit.available)} TL`}>{limit.widths.map((w,i)=><span key={i} className={['statement','period','available'][i]} style={{width:w+'%'}}/>)}</div><div className="limit-legend">{[['Ekstre borcu',limit.statement,'statement'],['Dönem içi',limit.period,'period'],['Kullanılabilir',limit.available,'available']].map(([label,n,k])=><div key={label} title={k==='period'?'Dönem içi ve gelecek taksitlerin toplam limit kullanımı':label}><span><i className={k}/>{label}</span><strong>{fmt(n)} TL</strong></div>)}</div></div>:kmh?<div className="kmh-card-body"><div className="limit-total"><span>KMH limiti</span><strong>{fmt(kmh.limit)} TL</strong></div><div className="limit-bar" aria-label={`Kullanılan limit ${fmt(kmh.used)}, kullanılabilir ${fmt(kmh.available)} TL`}><span className="period" style={{width:kmh.percent+'%'}}/><span className="available" style={{width:(100-kmh.percent)+'%'}}/></div><div className="kmh-totals"><div><span>Kullanılan</span><strong>{fmt(kmh.used)} TL</strong></div><div><span>Kullanılabilir</span><strong>{fmt(kmh.available)} TL</strong></div></div></div>:<div className="account-face-balance"><span>Hesap bakiyesi</span><div className={tone(a.balance_cents)}>{fmt(a.balance_cents)} <small>TL</small></div></div>}
 <footer>{isCard?<><span>Hesap kesim<strong>{dateLabel(a.statement_date)}</strong></span><span>Son ödeme<strong>{dateLabel(a.due)}</strong></span></>:<><span>Hesap türü<strong title={a.type}>{isKmh(a)?'KMH':a.type}</strong></span>{hasMaturity(a)&&<span>Vade sonu<strong>{dateLabel(a.maturity_date)}</strong></span>}</>}</footer></section>;
}
export function AccountCarousel({items,selected,onSelect,isCard,data,open}){
 const idx=Math.max(0,items.findIndex(a=>a.id===selected)),active=items[idx];
 const selectedRef=useRef(selected),onSelectRef=useRef(onSelect);selectedRef.current=selected;onSelectRef.current=onSelect;
 const itemsRef=useRef(items);itemsRef.current=items;
 const [emblaRef,embla]=useEmblaCarousel({loop:items.length>2,align:'center',containScroll:false,startIndex:idx,watchDrag:(_api,event)=>!event.target.closest('button,a,input,select'),duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:25});
 const viewport=useRef(null),[settled,setSettled]=useState(idx);
 const setViewport=useCallback(node=>{viewport.current=node;emblaRef(node)},[emblaRef]);
 useEffect(()=>{
  if(!embla)return;
  const settle=()=>{const index=embla.selectedScrollSnap();setSettled(index);const item=itemsRef.current[index];if(item&&item.id!==selectedRef.current)onSelectRef.current(item.id)};
  const reInit=()=>{const index=Math.max(0,itemsRef.current.findIndex(item=>item.id===selectedRef.current));embla.scrollTo(index,true);setSettled(index)};
  embla.on('settle',settle);embla.on('reInit',reInit);
  return()=>{embla.off('settle',settle);embla.off('reInit',reInit)};
 },[embla]);
 useEffect(()=>{if(embla&&idx!==embla.selectedScrollSnap())embla.scrollTo(idx,true);setSettled(idx)},[embla,selected,idx,items.length]);
 useLayoutEffect(()=>{
  const frame=viewport.current,card=frame?.querySelector('.carousel-active .account-face');if(!card)return;
  const resize=()=>frame.style.setProperty('--active-card-height',Math.ceil(card.getBoundingClientRect().height)+12+'px');
  const observer=new ResizeObserver(resize);observer.observe(card);resize();return()=>observer.disconnect();
 },[active?.id,isCard,items.length]);
 function step(n){if(!embla||items.length<2)return;const target=(embla.selectedScrollSnap()+n+items.length)%items.length;embla.scrollTo(target)}
 if(!active)return <p className="empty">Hesap bulunamadı.</p>;
 return <div className={"carousel-area "+(!isCard?"compact-bank-carousel":"")}><div className="account-carousel" role="region" aria-label={isCard?'Kredi kartları':'Hesaplar'} onKeyDown={e=>{if(e.target===e.currentTarget&&e.key==='ArrowRight')step(1);if(e.target===e.currentTarget&&e.key==='ArrowLeft')step(-1)}} tabIndex={0}>
 <div ref={setViewport} className="carousel-viewport"><div className="carousel-track">{items.map((item,index)=><div key={item.id} className={'carousel-slide '+(index===idx?'carousel-active':'carousel-neighbor')} aria-hidden={index!==idx} inert={index!==idx?true:undefined}><AccountFace item={item} isCard={isCard} actions={index===idx&&<><button className="icon-button" title="Hesap bilgileri" aria-label="Hesap bilgileri" onClick={()=>open({entity:isCard?'card':'account',mode:'view',item})}><Info size={18}/></button>{can(data.user,'edit')&&<button className="icon-button" title="Hesabı düzenle" aria-label="Hesabı düzenle" onClick={()=>open({entity:isCard?'card':'account',item})}><Pencil size={18}/></button>}</>}/></div>)}</div></div>
 <button className="carousel-arrow previous" disabled={items.length<2} aria-label="Önceki hesap" onClick={()=>step(-1)}><ChevronLeft size={16}/></button><button className="carousel-arrow next" disabled={items.length<2} aria-label="Sonraki hesap" onClick={()=>step(1)}><ChevronRight size={16}/></button></div><div className="carousel-caption"><span aria-live="polite">{settled+1} / {items.length} · {active.name}</span></div></div>;
}

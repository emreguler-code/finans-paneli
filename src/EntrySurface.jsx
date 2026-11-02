import {Children,Fragment,cloneElement,isValidElement,useEffect,useLayoutEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {X,SlidersHorizontal} from 'lucide-react';
import {Sheet} from './ui';
import {PageHeading} from './PageLayout';
import {useNavigation} from './Navigation';
function flat(children){return Children.toArray(children).flatMap(node=>isValidElement(node)&&node.type===Fragment?flat(node.props.children):[node])}
function Columns({children,page,preview}){
 const nodes=flat(children),main=[],side=[],helpers=[];const [more,setMore]=useState(false);
 for(const node of nodes){if(!page&&isValidElement(node)&&node.props.className==='entry-effect')side.push(node);else if(isValidElement(node)&&(node.props.optional||node.props.region==='aside'||node.type==='details'))side.push(node);else if(isValidElement(node)&&['entry-effect','cari-error','cari-hint'].some(c=>node.props.className?.split(' ').includes(c)))helpers.push(node);else main.push(node)}
 if(page)side.sort((a,b)=>Number(a.props?.title==='Mevcut borçla başlat')-Number(b.props?.title==='Mevcut borçla başlat'));
 return page?<div className="entry-columns"><div className="panel entry-main">{main}{helpers}</div><aside className="entry-aside">{preview&&<section className="panel entry-preview">{preview}</section>}{side.length>0&&<div className="panel entry-secondary">{side}</div>}</aside></div>:<><div className="dock-primary">{main}{side.length>0&&<div className="dock-more-field"><span>Diğer</span><button type="button" className="list-icon dock-more" aria-label="Diğer seçenekler" title="Diğer seçenekler" aria-expanded={more} onClick={()=>setMore(!more)}><SlidersHorizontal size={18}/></button></div>}{helpers}</div>{side.length>0&&<details className="dock-options" open={more} onToggle={e=>setMore(e.currentTarget.open)}><summary>Diğer seçenekler</summary>{side}</details>}</>;
}
export function EntrySurface({title,onClose,children,busy=false,variant='dock',preview}){
 const ref=useRef(null),base=useRef(null),close=useRef(null);const [discard,setDiscard]=useState(false),pending=useRef(null),busyRef=useRef(busy);busyRef.current=busy;const id=useId(),nav=useNavigation();
 const fingerprint=()=>JSON.stringify([...ref.current?.querySelectorAll('form input,form select,form textarea')||[]].filter(n=>n.type!=='hidden'||n.hasAttribute('data-draft-value')).map(n=>[n.name,n.type,n.type==='checkbox'?n.checked:n.value]));
 function request(action=onClose){if(busy)return;if(base.current!==null&&fingerprint()!==base.current){pending.current=action;setDiscard(true)}else action()}
 close.current=request;
 useLayoutEffect(()=>{if(variant==='modal')return;const previous=document.activeElement;base.current=fingerprint();ref.current?.querySelector('form select,form input:not([type=hidden]):not([aria-hidden=true]),form .date-trigger')?.focus({preventScroll:true});const key=e=>{const confirm=ref.current?.querySelector('.discard-confirm');if(confirm&&e.key==='Tab'){const buttons=[...confirm.querySelectorAll('button')];if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1)?.focus()}else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0]?.focus()}return}if(confirm&&e.key==='Escape'){e.preventDefault();setDiscard(false);return}if(e.key==='Escape'&&!e.target.closest?.('[data-floating-panel]')){e.preventDefault();close.current()}};const unload=e=>{if(base.current!==null&&fingerprint()!==base.current){e.preventDefault();e.returnValue=''}};document.addEventListener('keydown',key);window.addEventListener('beforeunload',unload);const block=action=>close.current(action);block.needsGuard=()=>busyRef.current||(base.current!==null&&fingerprint()!==base.current);const unblock=nav?.setBlocker?.(block);return()=>{unblock?.();document.removeEventListener('keydown',key);window.removeEventListener('beforeunload',unload);previous?.focus?.({preventScroll:true})}},[variant]);
 useEffect(()=>{if(discard)ref.current?.querySelector('.discard-confirm button')?.focus()},[discard]);
 useEffect(()=>{if(variant!=='dock')return;const element=ref.current,root=document.documentElement;const resize=()=>{const main=document.querySelector('.main-content');if(!main)return;const r=main.getBoundingClientRect(),s=getComputedStyle(main);element.style.left=(r.left+parseFloat(s.paddingLeft))+'px';element.style.width=(r.width-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight))+'px';root.style.setProperty('--composer-height',element.getBoundingClientRect().height+'px')};const observer=new ResizeObserver(resize);observer.observe(element);const main=document.querySelector('.main-content');if(main)observer.observe(main);root.classList.add('composer-open');resize();window.addEventListener('resize',resize);return()=>{observer.disconnect();window.removeEventListener('resize',resize);root.classList.remove('composer-open');root.style.removeProperty('--composer-height')}},[variant]);
 if(variant==='modal')return <Sheet {...{title,onClose,busy}}>{children}</Sheet>;
 const page=variant==='page';
 const form=isValidElement(children)?cloneElement(children,{id,className:(children.props.className||'')+' surface-form'},Children.map(children.props.children,node=>{
 if(!isValidElement(node))return node;
 if(!page&&node.props.className==='sheet-footer')return cloneElement(node,{},<>{node.props.children}<button type="button" className="list-icon" aria-label="Paneli kapat" title="Kapat" disabled={busy||discard} onClick={()=>request()}><X size={18}/></button></>);
 if(node.props.className!=='sheet-scroll')return node;
 const content=flat(node.props.children).flatMap(n=>isValidElement(n)&&n.type==='fieldset'&&n.props.className==='tracking-fields'?flat(n.props.children):[n]);
 return cloneElement(node,{},<Columns {...{page,preview}}>{content}</Columns>);
 })):children;
 const content=<section ref={ref} data-entry="true" role={page?'region':'dialog'} aria-modal={page?undefined:'false'} aria-label={title} className={'entry-surface '+(page?'entry-page finance-page':'entry-dock')}>
 {page?<PageHeading title={title} subtitle="Temel bilgileri girin, ayrıntıları ihtiyaç oldukça tamamlayın." back={()=>request()} backLabel="Geri dön" actions={<><button type="button" className="secondary-button" disabled={busy||discard} onClick={()=>request()}>Vazgeç</button><button type="submit" form={id} className="primary-button" disabled={busy||discard}>{busy?'Kaydediliyor…':'Kaydet'}</button></>}/>:null}
 <div inert={discard||busy||undefined} className="surface-body" onClickCapture={e=>{if(e.target.closest('.sheet-footer button[type="button"]')?.textContent==='Vazgeç'){e.preventDefault();e.stopPropagation();request()}}}>{form}</div>
 {discard&&<div className="discard-confirm" role="alertdialog" aria-label="Kaydedilmemiş değişiklikler"><strong>Değişiklikler kaydedilmedi</strong><p>Devam ederseniz girdiğiniz bilgiler silinir.</p><button type="button" className="primary-button" onClick={()=>setDiscard(false)}>Düzenlemeye dön</button><button type="button" className="secondary-button" onClick={()=>{base.current=fingerprint();setDiscard(false);const action=pending.current||onClose;nav?.clearBlocker?.();action()}}>Değişikliklerden vazgeç</button></div>}
 </section>;
 return createPortal(content,document.getElementById(page?'entry-page-root':'entry-dock-root')||document.body);
}

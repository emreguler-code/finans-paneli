import {Children,cloneElement,isValidElement,useEffect,useLayoutEffect,useRef,useState,useSyncExternalStore} from 'react';
import {Menu,PanelLeftClose,PanelLeftOpen,EyeOff} from 'lucide-react';
import {FloatingPanel} from './FloatingPanel';
const preferenceKey='finans.sidebar.preference';
export function useMediaQuery(query){return useSyncExternalStore(callback=>{const m=matchMedia(query);m.addEventListener('change',callback);return()=>m.removeEventListener('change',callback)},()=>matchMedia(query).matches,()=>false)}
export function useShellLayout(){
 const mobile=useMediaQuery('(max-width:760px)'),narrow=useMediaQuery('(max-width:1280px)');
 const [preference,setPreference]=useState(()=>{try{const value=localStorage.getItem(preferenceKey);return ['full','compact','hidden'].includes(value)?value:'full'}catch{return 'full'}}),[open,setOpen]=useState(false);
 const mode=mobile?(open?'drawer':'hidden'):preference==='hidden'?'hidden':preference==='compact'||narrow?'compact':'full';
 useEffect(()=>setOpen(false),[mobile]);
 function choose(value){if(!['full','compact','hidden'].includes(value))return;setPreference(value);try{localStorage.setItem(preferenceKey,value)}catch{}if(mobile)setOpen(value!=='hidden')}
 return {mobile,preference,mode,open,setOpen,choose};
}
export function AppShell({layout,children}){
 const ref=useRef(null);
 useEffect(()=>{if(layout.mode!=='drawer')return;const panel=ref.current?.querySelector('.sidebar'),prior=document.activeElement;panel?.querySelector('button')?.focus({preventScroll:true});const key=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();layout.setOpen(false)}if(e.key==='Tab'){const buttons=[...panel.querySelectorAll('button,a[href]')].filter(el=>el.getClientRects().length&&!el.disabled);if(!buttons.length)return;if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0].focus()}}};document.addEventListener('keydown',key,true);return()=>{document.removeEventListener('keydown',key,true);prior?.focus({preventScroll:true})}},[layout.mode]);
 return <div ref={ref} className={'app layout-shell '+(layout.mode==='compact'?'compact':'')} data-sidebar={layout.mode} data-theme="sade-netlik">{layout.mode==='drawer'&&<button className="shell-nav-backdrop" aria-label="Menüyü kapat" onClick={()=>layout.setOpen(false)}/>} {children}</div>;
}
export function MainShell({children,blocked}){
 const ref=useRef(null);
 useLayoutEffect(()=>{const root=ref.current,main=root.querySelector('.main-content');const measure=()=>root.style.setProperty('--shell-scrollbar-width',Math.max(0,main.offsetWidth-main.clientWidth)+'px');const observer=new ResizeObserver(measure);observer.observe(main);measure();return()=>observer.disconnect()},[]);
 return <div ref={ref} className="main-shell" inert={blocked||undefined}>{children}</div>;
}
export const HeaderRegion=({children})=><header className="topbar" data-region="2"><div className="topbar-inner">{children}</div></header>;
export const ShellContent=({children})=><main className="main-content" data-region="3" tabIndex={-1} id="main-content"><div className="content-frame"><div id="page-filter-host"/>{children}</div></main>;
export const ComposerHost=()=> <div id="entry-dock-root" data-region="9"/>;
export function ContentColumns({children,className=''}){return <div className={'workspace-columns '+className}>{Children.map(children,(child,i)=>isValidElement(child)?cloneElement(child,{'data-region':i===0?'6':'7'}):child)}</div>}
export const PageFooter=({children})=><footer data-region="8" className="page-footer">{children}</footer>;
export function SidebarControls({layout}){
 const [menu,setMenu]=useState(false),button=useRef(null);
 const label=layout.mobile?(layout.open?'Menüyü kapat':'Menüyü aç'):layout.mode==='hidden'?'Menüyü aç':'Menü görünümü';
 return <><a className="skip-content" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById('main-content')?.focus()}}>İçeriğe geç</a><button ref={button} className="list-icon shell-menu-button" aria-label={label} title={label} aria-expanded={layout.mobile?layout.open:menu} onClick={()=>{if(layout.mobile)layout.setOpen(!layout.open);else if(layout.mode==='hidden')layout.choose('full');else setMenu(!menu)}}>{layout.mode==='hidden'||layout.mobile?<Menu size={20}/>:<PanelLeftClose size={20}/>}</button>{menu&&!layout.mobile&&<FloatingPanel anchor={button.current} title="Menü görünümü" width={260} onClose={()=>setMenu(false)}><div className="shell-menu-options">{[['full','Tam menü',PanelLeftOpen],['compact','Kompakt menü',PanelLeftClose],['hidden','Menüyü gizle',EyeOff]].map(([value,label,Icon])=><button key={value} type="button" aria-pressed={layout.preference===value} onClick={()=>{layout.choose(value);setMenu(false)}}><Icon size={18}/>{label}</button>)}</div></FloatingPanel>}</>;
}
// Navigation and list restoration share the single scroll owner.
export const contentScroll=()=>document.querySelector('.main-content');
export function scrollContent(top=0){const el=contentScroll();if(el)el.scrollTo({top,behavior:'instant'});else window.scrollTo(0,top)}

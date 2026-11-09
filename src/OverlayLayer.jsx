import {useId,useLayoutEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
const inertLocks=new WeakMap();let scrollLocks=0,priorOverflow='';
export function isolateBackground(elements){
 if(scrollLocks++===0){priorOverflow=document.body.style.overflow;document.body.style.overflow='hidden'}
 for(const el of elements){const lock=inertLocks.get(el)||{count:0,initial:el.inert};lock.count++;inertLocks.set(el,lock);el.inert=true}
 return()=>{for(const el of elements){const lock=inertLocks.get(el);if(lock&&--lock.count===0){if(el.isConnected)el.inert=lock.initial;inertLocks.delete(el)}}if(--scrollLocks===0)document.body.style.overflow=priorOverflow};
}
// App-independent layer: never clipped by a table, drawer or composer overflow.
export function DiscardConfirmation({onContinue,onDiscard}){
 const ref=useRef(null),heading=useId(),description=useId(),callbacks=useRef({onContinue,onDiscard});callbacks.current={onContinue,onDiscard};
 useLayoutEffect(()=>{const prior=document.activeElement;const release=isolateBackground([...document.querySelectorAll('.app,.drawer-layer')]);ref.current?.querySelector('button')?.focus({preventScroll:true});const key=e=>{if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();callbacks.current.onContinue()}if(e.key==='Tab'){const buttons=[...ref.current.querySelectorAll('button:not(:disabled)')];if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1)?.focus()}else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0]?.focus()}}};document.addEventListener('keydown',key,true);return()=>{document.removeEventListener('keydown',key,true);release();requestAnimationFrame(()=>{if(prior?.isConnected)prior.focus({preventScroll:true})})}},[]);
 return createPortal(<div className="overlay-layer discard-layer" data-overlay-layer="confirmation"><button type="button" className="overlay-shade" aria-label="Onayı kapat, düzenlemeye dön" tabIndex={-1} onClick={onContinue}/><section ref={ref} role="alertdialog" aria-modal="true" aria-labelledby={heading} aria-describedby={description} className="discard-confirm"><h2 id={heading}>Değişiklikler kaydedilmedi</h2><p id={description}>Çıkarsanız girdiğiniz bilgiler kaybolacak.</p><div className="confirmation-actions"><button type="button" className="primary-button" onClick={onContinue}>Düzenlemeye dön</button><button type="button" className="secondary-button danger-text" onClick={onDiscard}>Değişikliklerden vazgeç</button></div></section></div>,document.body);
}

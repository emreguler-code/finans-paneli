import {Children,cloneElement,isValidElement,useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Search, SlidersHorizontal, FilterX, ArrowDownUp, Download, X} from 'lucide-react';
import {Sheet} from './ui';

// Stage controlled filter fields without running their page setters until Apply.
function fieldsIn(node,fields=[],path='f',label=''){
 Children.forEach(node,(child,index)=>{
  if(!isValidElement(child))return;
  const key=path+'.'+index,p=child.props;
  const text=child.type==='label'?Children.toArray(p.children).filter(x=>typeof x==='string').join('').trim():label;
  if(p.onChange&&('value'in p||'checked'in p||p.range)){
   const range=Boolean(p.range),check='checked'in p;
   const value=range?{from:p.from||'',to:p.to||''}:check?p.checked:p.value;
   const options=child.type==='select'?Children.toArray(p.children).flatMap(x=>isValidElement(x)&&x.type==='option'?[{value:x.props.value??x.props.children,label:x.props.children}]:[]):[];
   fields.push({key,child,label:text||p.label||'Filtre',value,range,check,options,
    change:value=>p.onChange(range?value:{target:{value,checked:value}}),
    empty:range?{from:'',to:''}:check?false:options.some(x=>x.value==='Tümü')?'Tümü':options.some(x=>x.value==='all')?'all':options[0]?.value??''});
  }else fieldsIn(p.children,fields,key,text);
 });return fields;
}
function renderFields(node,fields,draft,setDraft,path='f'){
 return Children.map(node,(child,index)=>{
  if(!isValidElement(child))return child;
  const key=path+'.'+index,field=fields.find(f=>f.key===key);
  if(field){const value=key in draft?draft[key]:field.value;return cloneElement(child,{...(field.range?value:field.check?{checked:value}:{value}),onChange:event=>setDraft(d=>({...d,[key]:field.range?event:field.check?event.target.checked:event.target.value}))})}
  return cloneElement(child,{},renderFields(child.props.children,fields,draft,setDraft,key));
 });
}
const active=f=>f.range?Boolean(f.value.from||f.value.to):f.check?f.value:!['','all','Tümü',String(f.empty)].includes(String(f.value));
const valueLabel=f=>f.range?[f.value.from,f.value.to].filter(Boolean).join(' – '):f.check?'':f.options.find(x=>String(x.value)===String(f.value))?.label||f.value;
export function ListTools({query,setQuery,placeholder='Hareketlerde ara',filters,setFilters,reset,sort,setSort,sortOptions=[],csv,children,resultCount,scopeControl,searchEnabled=true}){
 const [sorting,setSorting]=useState(false),[host,setHost]=useState(null),[text,setText]=useState(query),[draft,setDraft]=useState({}),[error,setError]=useState('');
 const input=useRef(null),fields=fieldsIn(children),applied=fields.filter(active);
 useEffect(()=>{setHost(document.getElementById('page-search-host'))},[]);
 useEffect(()=>setText(query),[query]);
 function close(){setFilters(false);setDraft({});setError('');input.current?.focus()}
 function apply(event){event?.preventDefault();
  for(const f of fields){const value=draft[f.key]??f.value;if(f.range&&value.from&&value.to&&value.from>value.to){setError('Başlangıç tarihi bitiş tarihinden sonra olamaz.');return}}
  fields.forEach(f=>{if(f.key in draft)f.change(draft[f.key])});setQuery(text.trim());close();
 }
 function clear(){reset();setText('');close()}
 const search=<div className="page-search" onKeyDown={e=>{if(e.key==='Escape'&&!e.target.closest('[role=dialog]')){e.stopPropagation();setText(query);close()}else if(e.key==='Enter'&&filters&&!e.target.closest('button,select,[role=dialog]'))apply(e)}}>
  <form className="page-search-row" role="search" onSubmit={apply}>
   <label className="cari-search"><Search size={18}/><input ref={input} id="search" aria-label={placeholder} placeholder={placeholder} value={text} onChange={e=>setText(e.target.value)}/></label>
   <button type="button" className={'list-icon '+(filters||applied.length?'active':'')} aria-label="Filtrele" title="Filtrele" aria-expanded={filters} aria-controls="page-search-filters" onClick={()=>{if(filters)close();else{setDraft({});setError('');setFilters(true)}}}><SlidersHorizontal size={18}/>{applied.length>0&&<span className="filter-count">{applied.length}</span>}</button>
   <button className="primary-button search-submit" type="submit">Ara</button>
  </form>
  {(query||applied.length>0)&&<div className="search-chips">{query&&<button type="button" onClick={()=>{setQuery('');setText('')}}>Arama: {query}<X size={14}/></button>}{applied.map(f=><button type="button" key={f.key} onClick={()=>f.change(f.empty)}>{f.label}{valueLabel(f)?': '+valueLabel(f):''}<X size={14}/></button>)}<button type="button" className="text-button" onClick={clear}>Temizle</button></div>}
  {filters&&<div id="page-search-filters" className="search-filter-panel"><div className="finance-filters shared-filters">{scopeControl}{renderFields(children,fields,draft,setDraft)}</div>{error&&<p role="alert" className="cari-error">{error}</p>}<div className="search-filter-actions"><button type="button" className="secondary-button" onClick={()=>{setText(query);close()}}>Vazgeç</button><button type="button" className="secondary-button" onClick={clear}>Temizle</button><button type="button" className="primary-button" onClick={apply}>Ara</button></div></div>}
  <span className="sr-only" role="status" aria-live="polite">{resultCount===undefined?'':resultCount+' sonuç'}</span>
 </div>;
 return <>{searchEnabled&&(host?createPortal(search,host):search)}<div className="cari-toolbar common-toolbar content-tools"><div className="cari-toolbar-actions"><button className="list-icon" aria-label="Filtreleri sıfırla" title="Filtreleri sıfırla" onClick={clear}><FilterX size={18}/></button>{sortOptions.length>0&&<div className="sort-container"><button className={'list-icon '+(sorting?'active':'')} aria-label="Sırala" title="Sırala" aria-expanded={sorting} onClick={()=>setSorting(!sorting)}><ArrowDownUp size={18}/></button>{sorting&&<Sheet title="Sıralama" onClose={()=>setSorting(false)}><div className="sheet-scroll sort-options">{sortOptions.map(([value,label])=><button key={value} aria-pressed={sort===value} onClick={()=>{setSort(value);setSorting(false)}}>{label}</button>)}</div></Sheet>}</div>}{csv&&<button className="list-icon" aria-label="CSV indir" title="CSV indir" onClick={csv}><Download size={18}/></button>}</div></div></>;
}

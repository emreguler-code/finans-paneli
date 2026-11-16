import {useMediaQuery} from './AppShell';
import {Children,cloneElement,isValidElement,useEffect,useLayoutEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Search, SlidersHorizontal, ArrowDownUp, Download, RotateCcw, X} from 'lucide-react';
import {FloatingPanel} from './FloatingPanel';
import {usePresence} from './Motion';

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
   fields.push({key,child,defaultRange:p.defaultRange,label:text||p.label||'Filtre',value,range,check,options,
    change:value=>p.onChange(range?value:{target:{value,checked:value}}),
    empty:range?{from:'',to:''}:p['data-filter-default']!==undefined?p['data-filter-default']:check?(p['data-filter-default']??false):options.some(x=>x.value==='Tümü')?'Tümü':options.some(x=>x.value==='all')?'all':options[0]?.value??''});
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
const active=f=>f.range?Boolean(f.value.from||f.value.to)&&!(f.defaultRange&&f.value.from===f.defaultRange.from&&f.value.to===f.defaultRange.to):f.check?f.value!==f.empty:!['','all','Tümü',String(f.empty)].includes(String(f.value));
const valueLabel=f=>f.range?[f.value.from,f.value.to].filter(Boolean).join(' – '):f.check?(f.value?'Evet':'Hayır'):f.options.find(x=>String(x.value)===String(f.value))?.label||f.value;
export function ListTools({query,setQuery,placeholder='Hareketlerde ara',filters=false,setFilters=()=>{},reset,sort,setSort,sortOptions=[],csv,children,resultCount,scopeControl,searchEnabled=true,showActions=true,showFilters=true,onSearchSubmit,onSearchKeyDown,onSearchText,suggestions,activeSuggestion,hideQueryChip=false,searchFeedback,onFiltersApplied,placement='header'}){
 const inline=placement==='inline';
 const mobile=useMediaQuery('(max-width:760px)');
 const [host,setHost]=useState(null),[chipHost,setChipHost]=useState(null),[text,setText]=useState(query),[draft,setDraft]=useState({}),[error,setError]=useState('');
 const querySetter=useRef(setQuery);querySetter.current=setQuery;
 const [composing,setComposing]=useState(false);
 const filterButton=useRef(null);
 const filterPresence=usePresence(filters);
 const input=useRef(null),fields=fieldsIn(children),applied=fields.filter(active);
 useLayoutEffect(()=>{setHost(document.getElementById('page-search-host'));setChipHost(document.getElementById('page-filter-host'))},[]);
 useLayoutEffect(()=>setText(query),[query]);
 useEffect(()=>{const q=text.trim();if(filters||composing||q===query||(q.length>0&&q.length<3))return;const timer=setTimeout(()=>querySetter.current(q),300);return()=>clearTimeout(timer)},[text,query,filters,composing]);
 function close(){setFilters(false);setDraft({});setError('');input.current?.focus()}
 function apply(event){event?.preventDefault();if(onSearchSubmit&&!filters){onSearchSubmit();return;}
  for(const f of fields){const value=draft[f.key]??f.value;if(f.range&&value.from&&value.to&&value.from>value.to){setError('Başlangıç tarihi bitiş tarihinden sonra olamaz.');return}}
  const minimum=fields.find(f=>f.child.props.name==='amountMin'),maximum=fields.find(f=>f.child.props.name==='amountMax');const low=minimum?(draft[minimum.key]??minimum.value):'',high=maximum?(draft[maximum.key]??maximum.value):'';if((low!==''&&(!Number.isFinite(Number(low))||Number(low)<0))||(high!==''&&(!Number.isFinite(Number(high))||Number(high)<0))||(low!==''&&high!==''&&Number(low)>Number(high))){setError('Tutar aralığını kontrol edin.');return}
  fields.forEach(f=>{if(f.key in draft)f.change(draft[f.key])});setQuery(text.trim());close();onFiltersApplied?.(text.trim());
 }
 function clear(){reset();setText('');close()}
 function clearDraft(){setDraft(Object.fromEntries(fields.map(field=>[field.key,field.empty])));setText('');setError('')}
 const chips=(!hideQueryChip&&query||applied.length>0)&&<div className="search-chips">{!hideQueryChip&&query&&<button type="button" onClick={()=>{setQuery('');setText('')}}>Arama: {query}<X size={14}/></button>}{applied.map(f=><button type="button" key={f.key} onClick={()=>f.change(f.empty)}>{f.label}{valueLabel(f)?': '+valueLabel(f):''}<X size={14}/></button>)}<button type="button" className="text-button" onClick={clear}>Temizle</button></div>;
 const search=<div className="page-search" onKeyDown={e=>{if(e.key==='Escape'&&!e.target.closest('[role=dialog]')){e.stopPropagation();setText(query);close()}else if(e.key==='Enter'&&filters&&!e.target.closest('button,select,[role=dialog]'))apply(e)}}>
  <form className="page-search-row" role="search" aria-label={placeholder} onSubmit={e=>{if(!e.defaultPrevented)apply(e)}}>
   <label className="cari-search"><Search size={18}/><input ref={input} id={inline?'party-search':'search'} aria-label={placeholder} placeholder={mobile?(onSearchSubmit?'Genel arama':/hareket/i.test(placeholder)?'Hareketlerde ara':'Bu sayfada ara'):placeholder} enterKeyHint="search" value={text} aria-autocomplete={suggestions?'list':undefined} aria-controls={suggestions?'global-search-suggestions':undefined} aria-activedescendant={activeSuggestion} onKeyDown={onSearchKeyDown} onChange={e=>{setText(e.target.value);onSearchText?.(e.target.value)}} onCompositionStart={()=>setComposing(true)} onCompositionEnd={e=>{setComposing(false);setText(e.currentTarget.value)}} aria-keyshortcuts={inline?undefined:'Control+k Meta+k'}/>{!inline&&<kbd aria-hidden="true">Ctrl K</kbd>}</label>
   {showFilters&&<button ref={filterButton} type="button" className={'list-icon '+(filters||applied.length?'active':'')} aria-label="Filtrele" title="Filtrele" aria-expanded={filters} aria-controls="page-search-filters" onClick={()=>{if(filters)close();else{setDraft({});setError('');setFilters(true)}}}><SlidersHorizontal size={18}/>{applied.length>0&&<span className="filter-count">{applied.length}</span>}</button>}
   <button className="primary-button search-submit icon-only" type="submit" aria-label="Ara" title="Ara"><Search size={18}/></button>
  </form>
  {chips&&(!inline&&chipHost?createPortal(chips,chipHost):chips)}
  {filterPresence.mounted&&<FloatingPanel exiting={!filters} id="page-search-filters" anchor={filterButton.current} alignTo={inline?input.current?.closest('.inline-list-tools'):host} title="Filtreler" className="search-filter-panel" mobileFit width={(inline?input.current?.closest('.inline-list-tools')?.clientWidth:host?.clientWidth)||600} onClose={()=>{setText(query);close()}}><div className="finance-filters shared-filters" onKeyDown={e=>{if(e.key==='Enter'&&e.target.matches('input'))apply(e)}}>{scopeControl}{renderFields(children,fields,draft,setDraft)}</div>{error&&<p role="alert" className="cari-error">{error}</p>}<div className="search-filter-actions" onKeyDown={e=>{if(e.key==='Enter')apply(e)}}><button type="button" className="secondary-button" onClick={()=>{setText(query);close()}}>Vazgeç</button><button type="button" className="secondary-button" onClick={clearDraft}>Temizle</button><button type="button" className="primary-button" onClick={apply} aria-label="Ara">Uygula</button></div></FloatingPanel>}
  {searchFeedback&&<p className="cari-error" role="status">{searchFeedback}</p>}
  {suggestions?.({anchor:input.current,host,filters})}
  <span className="sr-only" role="status" aria-live="polite">{resultCount===undefined?'':resultCount+' sonuç'}</span>
 </div>;
 const actions=showActions&&<ListActions sort={sort} setSort={setSort} sortOptions={sortOptions} csv={csv}/>;
 return inline?<div className="inline-list-tools">{searchEnabled&&search}<button type="button" className="list-icon" aria-label="Filtreleri sıfırla" title="Filtreleri sıfırla" onClick={clear}><RotateCcw size={18}/></button>{actions}</div>:<>{searchEnabled&&(host?createPortal(search,host):search)}{actions}</>;
}

// Content actions remain independent of the global search scope.
export function ListActions({sort,setSort,sortOptions=[],csv,label='Liste araçları',className=''}){
 const [sorting,setSorting]=useState(false),anchor=useRef(null);
 const presence=usePresence(sorting);
 if(!sortOptions.length&&!csv)return null;
 return <div className={'common-toolbar content-tools '+className} role="group" aria-label={label}><div className="cari-toolbar-actions">{sortOptions.length>0&&<div className="sort-container"><button ref={anchor} className={'list-icon '+(sorting?'active':'')} aria-label="Sırala" title="Sırala" aria-expanded={sorting} onClick={()=>setSorting(!sorting)}><ArrowDownUp size={18}/></button>{presence.mounted&&<FloatingPanel anchor={anchor.current} title="Sıralama" width={280} exiting={!sorting} onClose={()=>setSorting(false)}><div className="sheet-scroll sort-options">{sortOptions.map(([value,label])=><button key={value} aria-pressed={sort===value} onClick={()=>{setSort(value);setSorting(false)}}>{label}</button>)}</div></FloatingPanel>}</div>}{csv&&<button className="list-icon" aria-label="CSV indir" title="CSV indir" onClick={csv}><Download size={18}/></button>}</div></div>;
}

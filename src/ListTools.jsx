import { useState } from 'react';
import {Search, SlidersHorizontal, FilterX, ArrowDownUp, Download} from 'lucide-react';
import {Sheet} from './ui';
export function ListTools({query,setQuery,placeholder='Hareketlerde ara',filters,setFilters,count=0,reset,sort,setSort,sortOptions=[],csv,children,filterDisplay='sheet',filterTitle='Filtreler'}){
 const [sorting,setSorting]=useState(false);
 return <><div className="cari-toolbar common-toolbar"><label className="cari-search"><Search size={17}/><input aria-label={placeholder} placeholder={placeholder} value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="cari-toolbar-actions">
 <button className={'list-icon '+(filters||count?'active':'')} aria-label="Filtrele" title="Filtrele" aria-expanded={filters} onClick={()=>{setFilters(!filters);setSorting(false)}}><SlidersHorizontal size={18}/>{count>0&&<span className="filter-count">{count}</span>}</button>
 <button className="list-icon" aria-label="Filtreleri sıfırla" title="Filtreleri sıfırla" onClick={()=>{reset();setSorting(false)}}><FilterX size={18}/></button>
 <div className="sort-container"><button className={'list-icon '+(sorting?'active':'')} aria-label="Sırala" title="Sırala" aria-expanded={sorting} onClick={()=>{setSorting(!sorting);setFilters(false)}}><ArrowDownUp size={18}/></button>{sorting&&<Sheet title="Sıralama" onClose={()=>setSorting(false)}><div className="sheet-scroll sort-options">{sortOptions.map(([value,label])=><button key={value} aria-pressed={sort===value} onClick={()=>{setSort(value);setSorting(false)}}>{label}</button>)}</div></Sheet>}</div>
 <button className="list-icon" aria-label="CSV indir" title="CSV indir" onClick={csv}><Download size={18}/></button>
 </div></div>{filters&&(filterDisplay==='sheet'?<Sheet title={filterTitle} onClose={()=>setFilters(false)}><div className="sheet-scroll"><div className="finance-filters shared-filters sheet-filters">{children}</div></div></Sheet>:<div className="finance-filters shared-filters">{children}</div>)}</>;
}

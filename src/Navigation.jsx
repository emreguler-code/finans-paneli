import {createContext,useContext,useEffect,useRef,useState} from 'react';
import {useSearchStore} from './SearchState';
import {requestId} from './api';
import {readRoute,routeHash} from './routes.mjs';
const Navigation=createContext(null);
export function NavigationProvider({children}){
 const store=useSearchStore(),[route,setRoute]=useState(()=>readRoute(location.hash)),[revision,setRevision]=useState(0),current=useRef(route),snapshots=useRef(new Map()),lists=useRef(new Map()),seen=useRef('');
 const stamp=requestId;
 function remember(){const key=history.state?.finansEntry;if(key)snapshots.current.set(key,{store:new Map(store),scroll:window.scrollY});if(!current.current.record)lists.current.set(current.current.page,{store:new Map(store),scroll:window.scrollY})}
 function restore(snapshot){if(snapshot){store.clear();snapshot.store.forEach((v,k)=>store.set(k,v));requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,snapshot.scroll)))}}
 function navigate(next,{fresh=false,replace=false,restoreList=false,preserveFilters=false}={}){remember();const target={record:'',tab:'',event:'',q:'',category:'all',source:'all',...next};if(routeHash(target)===routeHash(current.current)&&!fresh&&!restoreList)return;if(fresh||(target.record&&current.current.record!==target.record&&!preserveFilters)){for(const key of store.keys())if(key.startsWith(target.page+':')||target.page==='Araçlarım'&&key.startsWith('vehicles:'))store.delete(key)}if(restoreList)restore(lists.current.get(target.page));const hash=routeHash(target),key=stamp();history[replace?'replaceState':'pushState']({finansEntry:key},'',hash);seen.current=key+hash;const remount=current.current.page!==target.page||current.current.record!==target.record||fresh||restoreList;current.current=target;setRoute(target);if(remount)setRevision(n=>n+1);if(!restoreList)window.scrollTo(0,0)}
 useEffect(()=>{if(!history.state?.finansEntry)history.replaceState({finansEntry:stamp()},'',routeHash(current.current));seen.current=history.state.finansEntry+location.hash;const pop=()=>{const key=(history.state?.finansEntry||'')+location.hash;if(key===seen.current)return;seen.current=key;current.current=readRoute(location.hash);restore(snapshots.current.get(history.state?.finansEntry));setRoute(current.current);setRevision(n=>n+1)};window.addEventListener('popstate',pop);window.addEventListener('hashchange',pop);return()=>{window.removeEventListener('popstate',pop);window.removeEventListener('hashchange',pop)}},[]);
 return <Navigation.Provider value={{route,revision,navigate,getRoute:()=>current.current}}>{children}</Navigation.Provider>
}
export const useNavigation=()=>useContext(Navigation);
export function useRecordState(page){const nav=useNavigation(),record=nav?.route.page===page?nav.route.record:'';return [record&&['Cari hesaplar','Araçlarım'].includes(page)?Number(record):record||null,id=>nav.navigate({page,record:id?String(id):''},{restoreList:!id})]}
export function useRouteTab(initial){const nav=useNavigation();return [nav.route.tab||initial,value=>nav.navigate({...nav.route,tab:value})]}

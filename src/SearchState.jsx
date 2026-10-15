import {createContext,useContext,useRef,useState} from 'react';
const SearchState=createContext(null);
export function SearchStateProvider({children}){const store=useRef(new Map());return <SearchState.Provider value={store.current}>{children}</SearchState.Provider>}
// Memory belongs to the authenticated app instance; logout discards all search state.
export function useScopedState(key,initial){
 const store=useContext(SearchState);
 const [value,setValue]=useState(()=>store?.has(key)?store.get(key):typeof initial==='function'?initial():initial);
 const update=next=>setValue(previous=>{const value=typeof next==='function'?next(previous):next;store?.set(key,value);return value});
 return [value,update];
}

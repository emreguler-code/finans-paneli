import {useEffect,useState} from 'react';
import {useMediaQuery} from './AppShell';
export function usePresence(open,duration=160){
 const reduced=useMediaQuery('(prefers-reduced-motion:reduce)'),[retained,setRetained]=useState(open);
 useEffect(()=>{if(open){setRetained(true);return}if(reduced){setRetained(false);return}const timer=setTimeout(()=>setRetained(false),duration);return()=>clearTimeout(timer)},[open,duration,reduced]);
 return {mounted:open||(!reduced&&retained)};
}
export function useDelayedBusy(busy,delay=200){const [visible,setVisible]=useState(false);useEffect(()=>{if(!busy){setVisible(false);return}const timer=setTimeout(()=>setVisible(true),delay);return()=>clearTimeout(timer)},[busy,delay]);return busy&&visible;}

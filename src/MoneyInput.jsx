
import {formatMoneyInput} from './list-utils.mjs';
export function MoneyInput({value,onValueChange,...props}) {
  function change(event) {
    const input=event.currentTarget,raw=input.value;
    const logical=raw.slice(0,input.selectionStart??raw.length).replaceAll('.','').length;
    const formatted=formatMoneyInput(raw);
    onValueChange(formatted);
    requestAnimationFrame(()=>{
      if (!input.isConnected) return;
      let index=0,count=0;
      while(index<formatted.length&&count<logical){if(formatted[index]!=='.')count++;index++;}
      input.setSelectionRange(index,index);
    });
  }
  return <input inputMode="decimal" {...props} value={value} onChange={change}/>;
}

import catalog from '../public/api/bank-catalog.json' with {type:'json'};
export const BANKS=catalog.banks;
export const PROGRAMS=catalog.programs;
export const bankKey=name=>name.normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('tr');
export function bankDirectory(data={}){const entries=new Map(BANKS.map(b=>[bankKey(b.name),b]));for(const row of [...(data.accounts||[]),...(data.cards||[])]){const name=row.bank?.trim().replace(/\s+/g,' ');if(name&&!entries.has(bankKey(name))&&!row.bank_code)entries.set(bankKey(name),{code:'',name,programs:[]})}return [...entries.values()].sort((a,b)=>a.name.localeCompare(b.name,'tr'))}

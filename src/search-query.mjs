export const fold=value=>String(value??'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').trim();
export const selectedValues=value=>Array.isArray(value)?value:[value];
export const matchesChoice=(selection,value,empty=['all','Tümü'])=>empty.includes(selection)||selectedValues(selection).some(s=>String(s)===String(value));
export function fieldAlias(label){const s=fold(label);if(s.includes('etiket'))return 'etiket';if(s.includes('islem')&&!s.includes('tutar'))return 'işlem';if(s.includes('ekleyen'))return 'ekleyen';if(s.includes('kapama'))return 'durum';if(s.includes('tarih'))return 'tarih';if(s.includes('arsiv'))return 'arşiv';if(s.includes('iptal'))return 'iptal';if(s.includes('en az tutar'))return 'enaz';if(s.includes('en fazla tutar'))return 'ençok';if(s.includes('kapsam'))return 'kapsam';return label.replace(/\s*\([^)]*\)/g,'').toLocaleLowerCase('tr-TR').trim();}
export function parseSearch(text,fields){
 const filters=[],plain=[],errors=[];const tokens=text.match(/[^\s:]+:(?:"[^"]*"|[^\s]*)|"[^"]*"|[^\s]+/g)||[];
 for(const token of tokens){const split=token.indexOf(':');if(split<0){plain.push(token.replace(/^"|"$/g,''));continue}const name=token.slice(0,split),value=token.slice(split+1).replace(/^"|"$/g,'');const field=fields.find(f=>fold(fieldAlias(f.label))===fold(name));if(!field){errors.push('Bilinmeyen arama alanı: '+name);continue}if(!value){errors.push(name+' için değer yazın.');continue}let resolved;
 if(field.check){if(['evet','hayir','true','false'].includes(fold(value)))resolved=['evet','true'].includes(fold(value));}
 else if(field.options?.length){resolved=field.options.find(o=>fold(o.label)===fold(value)||fold(o.value)===fold(value))?.value;}
 else if(field.range){const [from,to=from]=value.split('..');if(/^\d{4}-\d{2}-\d{2}$/.test(from)&&/^\d{4}-\d{2}-\d{2}$/.test(to)&&from<=to)resolved={from,to};}
 else if(Number.isFinite(Number(value))&&Number(value)>=0)resolved=value;
 if(resolved===undefined)errors.push('Geçersiz '+field.label+' değeri: '+value);else filters.push({field,value:resolved});
 }
 return {query:plain.join(' '),filters,errors};
}

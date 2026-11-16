// Frontend acceptance against a deterministic synthetic API. No database or credentials.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,webkit}=require('playwright');
const root=path.resolve(__dirname,'../dist/client'),out=path.resolve(process.env.QA_OUTPUT_DIR||'.qa/party118');fs.mkdirSync(out,{recursive:true});
const user={id:1,username:'test-admin',short_name:'Test',role:'admin'};
const party={id:1,name:'Poyraz Gıda',title:'Poyraz Gıda',type:'Tedarikçi',active:true,version:1,phone:'',email:'',tax_no:'',tax_office:'',address:'',notes:'',pos_programs:[],profile:{}};
let running=0;
const events=Array.from({length:30},(_,i)=>{
 const e={id:i+1,version:1,party_id:1,party_name:party.name,kind:i===1?'Ödeme':'Borç',operation:i===1?'payment':'purchase_invoice',amount_cents:i===0?91300:i===1?40000:10000,settled_cents:i===0?20000:0,party_effect:i===0?-71300:i===1?40000:-10000,event_date:'2026-10-'+String(Math.floor(i/2)+1).padStart(2,'0'),event_time:'10:'+String(i).padStart(2,'0')+':00',description:i===0?'Kısmi ödenen stok alışı':i===1?'Tedarikçi ödemesi':'Stok alışı '+(i+1),tag:i===0?'Gıda':'Genel',creator:'Test',created_by:1,cancelled:i===4?1:0,scheduled:false,cash_effect:0,card_effect:0,account_id:null,card_id:null,document_no:'',direction:'Borç'};
 if(!e.cancelled)running+=e.party_effect;e.party_balance=running;return e;
});party.balance_cents=running;
const scheduled={...events[0],id:31,event_date:'2026-11-01',scheduled:true,description:'Planlanan alış',party_effect:0,party_balance:running};
const data={today:'2026-10-16',demo:true,schemaVersion:12,user,users:[user],parties:[party],events:[...events,scheduled],accounts:[],cards:[],claims:[],allocations:[],advances:[],tx:[],vehicles:[],vehicle_records:[],vehicle_payments:[],campaigns:[],campaign_entries:[]};
const results=[];
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');if(url.pathname==='/api/index.php'){const a=url.searchParams.get('action');res.setHeader('Content-Type','application/json');res.end(JSON.stringify(a==='session'?{csrf:'synthetic-csrf',user}:a==='state'?data:a==='parties'?{parties:data.parties}:a==='audit'?{logs:[]}:{}));return}const file=path.join(root,decodeURIComponent(url.pathname));if(!file.startsWith(root+path.sep)&&file!==root+path.sep){res.writeHead(403);res.end();return}const f=fs.existsSync(file)&&fs.statSync(file).isFile()?file:path.join(root,'index.html');res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.ttf')?'font/ttf':'text/html');res.end(fs.readFileSync(f))});
(async()=>{
 await new Promise(resolve=>server.listen(Number(process.env.QA_PORT)||0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 if(process.env.QA_SERVE){console.log('Synthetic UI fixture listening at '+base);await new Promise(()=>{});}
 for(const engine of (process.env.QA_BROWSER_ENGINES||'chromium,webkit').split(',')){
  const browser=await {chromium,webkit}[engine].launch({headless:true,...(engine==='chromium'&&process.env.QA_BROWSER_BIN?{executablePath:process.env.QA_BROWSER_BIN}:{}),...(engine==='chromium'?{args:['--no-sandbox']}: {})});
  const context=await browser.newContext({locale:'tr-TR',timezoneId:'Europe/Istanbul',viewport:{width:1385,height:900}}),p=await context.newPage(),errors=[],checks=[];
  const ok=(name,value)=>{assert.ok(value,name);checks.push(name);console.log('PASS',engine,name)};
  p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/api/index.php?**',r=>{const a=new URL(r.request().url()).searchParams.get('action');const body=a==='session'?{csrf:'synthetic-csrf',user}:a==='state'?data:a==='parties'?{parties:data.parties}:a==='audit'?{logs:[]}:{};return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)})});
  const shot=async name=>{await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(out,engine+'-'+name+'.png'),animations:'disabled'})};
  try{
   await p.goto(base+'/#/cariler/1');await p.locator('.party-heading-name h1').waitFor();
   const summary=await p.locator('.party-current-balance').innerText();
   ok('Supplier debt has explicit direction',summary.includes('Tedarikçiye borcumuz'));
   ok('Single identity surface replaces large summary',await p.locator('.party-identity-summary').evaluate(e=>e.getBoundingClientRect().height<160));
   ok('Local and global search have distinct accessible inputs',await p.locator('#party-search').count()===1&&await p.locator('.topbar #search').count()===1);
   ok('Headers retain approved column order',JSON.stringify(await p.locator('.party-ledger th').allTextContents())===JSON.stringify(['Tarih','Açıklama','Etiket','İşlem / Ekleyen','Tutar','Bakiye']));
   ok('Details start collapsed',await p.locator('.party-inline-info').count()===0);
   await p.getByRole('button',{name:'Cari bilgileri',exact:true}).click();ok('Chevron expands the identity surface inline',await p.locator('.party-inline-info').isVisible()&&await p.getByRole('dialog').count()===0);await p.keyboard.press('Space');
   if(await p.locator('.party-inline-info').count())await p.getByRole('button',{name:'Cari bilgileri',exact:true}).click();
   const first=p.locator('[data-ledger-id="1"]');await first.click();
   const detail=p.locator('.party-effect-details');ok('Gross amount and partial payment explain net effect',(await detail.innerText()).includes('913,00 TL')&&(await detail.innerText()).includes('200,00 TL')&&(await detail.innerText()).includes('-713,00 TL'));
   ok('Expanded stripe continues into action row',await p.locator('.ledger-action-row>td').evaluate(e=>getComputedStyle(e).boxShadow.includes('3px')&&getComputedStyle(e).borderTopWidth==='0px'));
   ok('Ledger amounts are neutral while direction badge remains red',await first.locator('[data-label="Tutar"]').evaluate(e=>getComputedStyle(e).color===getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()||getComputedStyle(e).color==='rgb(32, 44, 57)')&&await first.locator('.effect-negative').count()>0);
   await shot('desktop-expanded');await first.click();
   await p.locator('.party-list-scope').getByRole('button',{name:'Son hareketler',exact:true}).click();
   ok('Recent shortcut changes order and keeps historical balances',await p.locator('[data-ledger-id]').first().getAttribute('data-ledger-id')==='30'&&(await p.locator('[data-ledger-id="30"] [data-label="Bakiye"]').innerText()).includes(new Intl.NumberFormat('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(running/100)));
   await p.locator('#party-search').fill('Kısmi');await p.locator('#party-search').press('Enter');await p.waitForFunction(()=>document.querySelectorAll('[data-ledger-id]').length===1);
   ok('Filtering leaves current balance unchanged',await p.locator('.party-current-balance').innerText()===summary);
   ok('Filtered total uses net effect not gross amount',(await p.locator('.party-filter-total').innerText()).includes('-713,00 TL'));
   await p.getByRole('button',{name:'Filtreleri sıfırla',exact:true}).click();await p.waitForFunction(()=>document.querySelectorAll('[data-ledger-id]').length===25);
   await p.getByRole('button',{name:'Sonraki',exact:true}).click();ok('Pagination still works',await p.locator('[data-ledger-id]').count()===5);await p.getByRole('button',{name:'Önceki',exact:true}).click();
   const local=p.locator('.inline-list-tools');await local.getByRole('button',{name:'Filtrele',exact:true}).click();const filter=p.getByRole('dialog',{name:'Filtreler',exact:true});await filter.getByRole('combobox',{name:'Etiket',exact:true}).selectOption('Gıda');ok('Filter is staged before Apply',await p.locator('[data-ledger-id]').count()===25);await filter.getByRole('button',{name:'Ara',exact:true}).click();await p.waitForFunction(()=>document.querySelectorAll('[data-ledger-id]').length===1);ok('Local filter applies to the ledger',await p.locator('[data-ledger-id]').first().getAttribute('data-ledger-id')==='1');await p.getByRole('button',{name:'Filtreleri sıfırla',exact:true}).click();
   for(const width of [320,390,430,768,960,1385,1920]){
    await p.setViewportSize({width,height:width===320?568:900});await p.locator('.main-content').evaluate(e=>e.scrollTop=0);
    ok('Page and balance fit '+width,await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)&&await p.locator('.party-current-balance .summary-value').evaluate(e=>e.scrollWidth<=e.clientWidth+1&&e.getBoundingClientRect().right<=innerWidth));
    const row=p.locator('[data-ledger-id="1"]');await row.click();
    ok('Expanded row and actions share width '+width,await p.locator('.ledger-action-row').evaluate(e=>Math.abs(e.getBoundingClientRect().width-e.previousElementSibling.getBoundingClientRect().width)<2));
    ok('No clipped financial values '+width,await p.locator('.party-effect-details dd').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth+1&&e.getBoundingClientRect().right<=innerWidth)));
    await shot('expanded-'+width);await row.click();
    await local.getByRole('button',{name:'Filtrele',exact:true}).click();ok('Local filter fits viewport '+width,await p.getByRole('dialog',{name:'Filtreler',exact:true}).evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight}));await p.keyboard.press('Escape');
   }
   ok('No browser runtime errors',errors.length===0);results.push({engine,browser:browser.version(),checks,errors});
  }catch(e){await p.screenshot({path:path.join(out,engine+'-failure.png')});throw e}finally{await browser.close()}
 }
 fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify(results,null,2));console.log('PASS party UI checks',results.map(r=>r.engine+': '+r.checks.length).join(', '));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());

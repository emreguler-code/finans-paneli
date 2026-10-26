const {chromium}=require('playwright');
const fs=require('fs');const path=require('path');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:8088';const out=path.resolve(process.env.QA_OUTPUT_DIR||'qa-output');fs.mkdirSync(out,{recursive:true});
let activePage;const checks=[],errors=[];const ok=(name,test)=>{if(!test)throw Error(name);checks.push(name);console.log('PASS '+name)};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.QA_BROWSER_BIN||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],env:process.env});
 const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'tr-TR',timezoneId:'Europe/Istanbul'});
 const p=await context.newPage();activePage=p;p.setDefaultTimeout(10000);p.on('pageerror',e=>errors.push(String(e)));
 await p.goto(base);await p.getByRole('button',{name:'Giriş yap'}).waitFor();
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/login-mobile.png'});
 ok('Login fits 390px',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.locator('input[name=username]').fill(process.env.QA_USERNAME);await p.locator('input[name=password]').fill(process.env.QA_PASSWORD);await p.getByRole('button',{name:'Giriş yap'}).click();await p.locator('.app').waitFor();
 await p.setViewportSize({width:1440,height:1000});
 const go=async name=>{await p.locator('.sidebar').getByRole('button',{name,exact:true}).click();if(name==='Cari hesaplar'&&await p.locator('.page-back').count())await p.locator('.page-back').click();if(['Hesaplar','Kredi kartları'].includes(name)&&await p.locator('.page-back').count())await p.locator('.page-back').click();await p.locator('.finance-page h1').filter({hasText:name}).waitFor();};
 ok('Submenus start collapsed',await p.locator('.sidebar').getByRole('button',{name:'Kampanyalar',exact:true}).count()===0&&await p.locator('.sidebar').getByRole('button',{name:'Kredi kartları',exact:true}).getAttribute('aria-expanded')==='false');
 await go('Cari hesaplar');if(await p.locator('.party-row').count())await p.locator('.party-row').filter({hasText:'Ada Tasarım'}).click();await p.locator('.party-detail-header').waitFor();
 const headers=await p.locator('.party-ledger th').allTextContents();ok('Cari Tutar precedes Bakiye',headers.indexOf('Tutar')<headers.indexOf('Bakiye'));ok('Cari separate Etiket column',headers.includes('Etiket'));
 ok('Description has no automatic party name',!(await p.locator('.party-ledger td[data-label="Açıklama"]').allTextContents()).some(s=>s.includes('Ada Tasarım')));
 await p.getByRole('button',{name:'Cari bilgileri',exact:true}).click();ok('Cari information expands inline',await p.locator('.party-inline-info').isVisible()&&await p.getByRole('dialog').count()===0);
 await p.locator('.party-ledger tbody tr').first().click();await p.locator('.ledger-action-row').waitFor();
 ok('Expanded lower row has no separator',await p.locator('.ledger-action-row td').evaluate(el=>getComputedStyle(el).borderTopWidth==='0px'));
 ok('Left stripe extends into action area',await p.locator('.ledger-action-row td').evaluate(el=>getComputedStyle(el).boxShadow.includes('3px')));
 await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/cari-desktop.png',fullPage:true});
 await p.getByRole('button',{name:'Yeni kayıt ekle',exact:true}).click();await p.getByRole('dialog').waitFor();
 const picker=p.locator('.transaction-picker');ok('Cari sale positive',await picker.getByRole('button',{name:'Satış',exact:true}).evaluate(el=>el.classList.contains('effect-positive')));ok('Cari collection negative',await picker.getByRole('button',{name:'Tahsilat',exact:true}).evaluate(el=>el.classList.contains('effect-negative')));
 await p.locator('summary').filter({hasText:'Ek bilgiler'}).click();ok('Time and document inputs restored',await p.locator('input[name=time]').isVisible()&&await p.locator('input[name=document]').isVisible());
 await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/entry-desktop.png'});await p.getByRole('button',{name:'Paneli kapat',exact:true}).last().click();
 await go('Hesaplar');ok('One shared account search in topbar',await p.locator('.topbar #search').count()===1&&await p.locator('.account-title input').count()===0);ok('Archive hidden initially',await p.getByText('Arşiv dahil',{exact:true}).count()===0);
 await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();ok('Archive opens as anchored overlay',await p.getByText('Arşiv dahil',{exact:true}).isVisible()&&await p.getByRole('dialog',{name:'Filtreler',exact:true}).isVisible());await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();
 ok('Account actions on card',await p.locator('.account-grid-item .account-card-actions').first().isVisible());
 ok('Account grid replaces carousel',await p.locator('.account-grid-item').count()===4&&await p.locator('.carousel-viewport').count()===0);await p.locator('.account-open').first().focus();await p.keyboard.press('Enter');ok('Grid card opens with keyboard',await p.locator('.summary-band').count()===1&&await p.locator('.ledger-view').count()===1);await p.locator('.page-back').click();
 await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/accounts-desktop.png',fullPage:true});
 await p.locator('#search').fill('KMH');await p.locator('#search').press('Enter');await p.locator('.kmh-card-body').waitFor();ok('KMH limit and daily warning',await p.locator('.kmh-card-body').isVisible()&&await p.locator('.alert-notice').filter({hasText:'Günlük tahmini faiz'}).isVisible());await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/kmh-desktop.png'});await p.locator('#search').fill('');await p.locator('#search').press('Enter');
 await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();await p.getByRole('combobox',{name:'Arama kapsamı',exact:true}).selectOption('movements');
 ok('Account kind and creator filters restored',await p.locator('.search-filter-panel').getByRole('combobox',{name:/Ekleyen kişi/}).isVisible()&&await p.locator('.search-filter-panel').getByRole('combobox',{name:/^İşlem/}).isVisible());await p.locator('.search-filter-panel').getByRole('button',{name:'Ara',exact:true}).click();
 await p.locator('.account-open').first().click();await p.locator('.ledger-view').getByRole('button',{name:'Sırala',exact:true}).click();ok('Ascending amount restored',await p.getByRole('button',{name:'Tutar: düşükten yükseğe',exact:true}).isVisible());await p.getByRole('button',{name:'Tutar: düşükten yükseğe',exact:true}).click();
 await go('Kredi kartları');ok('Credit parent reveals campaign submenu',await p.locator('.sidebar').getByRole('button',{name:'Kampanyalar',exact:true}).isVisible());ok('Card grid shows all cards',await p.locator('.account-grid-item').count()===3);ok('Bank and program marks together',await p.locator('.account-grid-item .face-mark svg').count()>=2);await p.locator('.account-open').first().click();ok('Default current period',await p.getByRole('button',{name:'Dönem içi işlemler',exact:true}).getAttribute('aria-pressed')==='true');ok('Card summary has record-local actions',await p.getByRole('button',{name:'Kartı düzenle',exact:true}).isVisible());await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/cards-desktop.png',fullPage:true});
 await p.getByRole('button',{name:'Kartı düzenle',exact:true}).click();ok('Optional linked-account selector is present',await p.getByRole('combobox',{name:'Bağlı hesap (isteğe bağlı)',exact:true}).isVisible());await p.getByRole('button',{name:'Paneli kapat',exact:true}).last().click();
 await p.getByRole('button',{name:'Bildirimleri aç',exact:true}).click();ok('Global KMH notification',await p.getByRole('dialog').locator('.notification-row').filter({hasText:'KMH Deneme'}).count()===1);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/notifications.png'});await p.keyboard.press('Escape');
 // Narrow live layouts, not screenshots of server-rendered HTML.
 for(const size of [390,320,768]){
  await p.setViewportSize({width:size,height:size===768?1024:844});
  for(const name of ['Hesaplar','Kredi kartları','Cari hesaplar','Raporlar','Ödeme Planı']){
   if(size<=760){const nav=p.locator('.mobile-nav');const b=nav.getByRole('button',{name,exact:true});if(await b.count())await b.click();else{await nav.getByRole('button',{name:'Diğer',exact:true}).click();await p.locator('.mobile-more').getByRole('button',{name,exact:true}).click();}}
   else await go(name);
   if(name==='Cari hesaplar'&&await p.locator('.page-back').count())await p.locator('.page-back').click();if(['Hesaplar','Kredi kartları'].includes(name)&&await p.locator('.page-back').count())await p.locator('.page-back').click();await p.locator('.finance-page h1').filter({hasText:name}).waitFor();
   await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/'+name.replaceAll(' ','-')+'-'+size+'.png',fullPage:true});
   const info=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&r.width>0&&!e.closest('.carousel-track,.cari-table-scroll,.sidebar')}).map(e=>e.className).slice(0,12)}));
   ok(name+' fits '+size,info.scroll<=size);fs.writeFileSync(out+'/layout-'+size+'-'+name.replaceAll(' ','-')+'.json',JSON.stringify(info));
  }
 }
 for(const size of [390,320]){
  await p.setViewportSize({width:size,height:844});await p.locator('.mobile-nav').getByRole('button',{name:'Diğer',exact:true}).click();await p.locator('.mobile-more').getByRole('button',{name:'Cari hesaplar',exact:true}).click();if(await p.locator('.party-row').count())await p.locator('.party-row').filter({hasText:'Ada Tasarım'}).click();await p.locator('.party-ledger tbody tr').first().waitFor();
  ok('Cari header balance fits '+size,await p.locator('.summary-primary .summary-value').evaluate(el=>{const r=el.getBoundingClientRect(),par=el.closest('.summary-band').getBoundingClientRect();return r.right<=par.right&&el.scrollWidth<=el.clientWidth+1}));
  const first=p.locator('.party-ledger tbody tr').first();ok('Gross sale shown at '+size,(await first.locator('[data-label="Tutar"]').innerText()).includes('18.500,00'));
  const clipped=await first.locator('[data-label="Tutar"]').evaluate(el=>{const r=el.getBoundingClientRect(),row=el.closest('tr').getBoundingClientRect();return r.left<row.left||r.right>row.right+1||el.scrollWidth>el.clientWidth+1});ok('Cari amount not clipped at '+size,!clipped);
  await first.click();await p.locator('.ledger-action-row').waitFor();ok('Mobile stripe covers action area '+size,await p.locator('.ledger-action-row td').evaluate(el=>getComputedStyle(el).boxShadow.includes('3px')));await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/cari-mobile-'+size+'.png',fullPage:true});await p.screenshot({path:out+'/cari-viewport-'+size+'.png'});
  await p.locator('.mobile-nav').getByRole('button',{name:'Diğer',exact:true}).click();await p.locator('.mobile-more').getByRole('button',{name:'Hesaplar',exact:true}).click();await p.locator('.account-grid').waitFor();
  await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();await p.getByRole('combobox',{name:'Arama kapsamı',exact:true}).selectOption('accounts');await p.locator('#search').fill('Günlük');await p.locator('.search-filter-panel').getByRole('button',{name:'Ara',exact:true}).click();
  await p.locator('.account-open').first().click();await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/accounts-viewport-'+size+'.png'});
  const cells=p.locator('.ledger-view td[data-label="Tutar"]');ok('Bank amounts not clipped at '+size,await cells.evaluateAll(els=>els.every(el=>{const r=el.getBoundingClientRect(),row=el.closest('tr').getBoundingClientRect();return r.right<=row.right+1&&el.scrollWidth<=el.clientWidth+1})));
  await p.locator('.ledger-view').scrollIntoViewIfNeeded();ok('Account movements remain reachable at '+size,await p.locator('.ledger-view tbody tr').count()>0);
 }
 await p.locator('.mobile-nav').getByRole('button',{name:'Diğer',exact:true}).click();await p.locator('.mobile-more').getByRole('button',{name:'Cari hesaplar',exact:true}).click();if(await p.locator('.party-row').count())await p.locator('.party-row').filter({hasText:'Ada Tasarım'}).click();await p.getByRole('button',{name:'Yeni kayıt ekle',exact:true}).click();await p.getByRole('dialog').waitFor();
 await p.setViewportSize({width:320,height:568});ok('Small-screen entry dialog bounded',await p.locator('.finance-sheet').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}));
 ok('Dialog stays bounded with stale cached viewport height',await p.locator('.finance-sheet').evaluate(el=>{const root=document.documentElement,previous=root.style.getPropertyValue('--visible-height');root.style.setProperty('--visible-height','2000px');const r=el.getBoundingClientRect(),bounded=r.top>=0&&r.bottom<=innerHeight;root.style.setProperty('--visible-height',previous);return bounded}));
 await p.getByRole('button',{name:'İşlem tarihi',exact:true}).click();await p.getByRole('dialog',{name:'İşlem tarihi',exact:true}).waitFor();await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/date-mobile.png'});
 ok('Single-date calendar is non-modal and adds no backdrop',await p.getByRole('dialog',{name:'İşlem tarihi',exact:true}).getAttribute('aria-modal')==='false'&&await p.locator('.drawer-layer .backdrop').count()===1);ok('Nested calendar fits small screen',await p.getByRole('dialog',{name:'İşlem tarihi',exact:true}).evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}));await p.keyboard.press('Escape');ok('Calendar Escape leaves parent form open',await p.locator('.finance-sheet').count()===1&&await p.locator('.date-floating').count()===0);await p.getByRole('button',{name:'Paneli kapat',exact:true}).last().click();ok('Scroll restored after nested dialogs',await p.evaluate(()=>document.body.style.overflow!=='hidden'));
 // Real form round trip with formatted amount, seconds and document number.
 await p.setViewportSize({width:390,height:844});await p.getByRole('button',{name:'Yeni kayıt ekle',exact:true}).click();await p.locator('input[name=amount]').fill('12345,67');ok('Amount groups live in actual form',await p.locator('input[name=amount]').inputValue()==='12.345,67');await p.getByLabel('Açıklama (isteğe bağlı)',{exact:true}).fill('Canlı giriş doğrulaması');await p.locator('summary').filter({hasText:'Ek bilgiler'}).click();await p.locator('input[name=time]').fill('14:22:33');await p.locator('input[name=document]').fill('FTR-LIVE');await p.getByRole('button',{name:'Kaydet',exact:true}).click();await p.getByRole('dialog').waitFor({state:'hidden'});
 const saved=await (await p.request.get(base+'/api/index.php?action=state')).json();const entry=saved.events.find(e=>e.description==='Canlı giriş doğrulaması');ok('Browser form saves amount/time/document to PHP',entry?.amount_cents===1234567&&entry.event_time==='14:22:33'&&entry.document_no==='FTR-LIVE');
 await p.locator('.mobile-nav').getByRole('button',{name:'Diğer',exact:true}).click();await p.locator('.mobile-more').getByRole('button',{name:'Hesaplar',exact:true}).click();
 await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();await p.getByRole('combobox',{name:'Arama kapsamı',exact:true}).selectOption('accounts');await p.locator('.search-filter-panel').getByRole('button',{name:'Ara',exact:true}).click();
 await p.locator('#search').fill('');await p.locator('#search').press('Enter');
 const download=await Promise.all([p.waitForEvent('download'),p.locator('.inventory-tools').getByRole('button',{name:'CSV indir',exact:true}).click()]);ok('Inventory CSV retained',download[0].suggestedFilename()==='hesaplar.csv');await download[0].saveAs(out+'/inventory.csv');
 await p.locator('.account-open').first().click();ok('Grid detail can return to list',await p.locator('.page-back').isVisible());await p.locator('.page-back').click();ok('Return restores inventory',await p.locator('.account-grid-item').count()===4);
 // Extracted entity forms and read-only details retain their shared modal behavior.
 await p.setViewportSize({width:1440,height:1000});await go('Cari hesaplar');
 await p.getByRole('button',{name:'Yeni kayıt ekle',exact:true}).click();await p.getByRole('dialog').waitFor();
 await p.locator('input[name=name]').fill('Form testi');await p.locator('summary').filter({hasText:'Açılış bakiyesi'}).click();
 await p.locator('input[name=opening]').fill('1234,56');ok('Entity money input shares live grouping',await p.locator('input[name=opening]').inputValue()==='1.234,56');
 await p.getByRole('button',{name:'Paneli kapat',exact:true}).last().click();
 if(await p.locator('.party-row').count())await p.locator('.party-row').filter({hasText:'Ada Tasarım'}).click();await p.getByRole('button',{name:'Düzenle',exact:true}).first().click();
 ok('Party edit form retains entity details',await p.locator('input[name=name]').inputValue()==='Ada Tasarım');await p.getByRole('button',{name:'Paneli kapat',exact:true}).last().click();
 await go('Hesaplar');await p.locator('.account-grid-item .account-card-actions').first().getByRole('button',{name:'Hesap bilgileri',exact:true}).click();
 ok('Account details and audit use extracted dialog',await p.getByRole('dialog').locator('.cari-info').count()===1);await p.getByRole('button',{name:'Paneli kapat',exact:true}).last().click();
 await go('Kullanıcılar');await p.getByRole('button',{name:'Yeni kayıt ekle',exact:true}).click();
 ok('User form retains role and password fields',await p.locator('input[name=password]').isVisible()&&await p.getByRole('dialog').getByRole('combobox',{name:'Rol',exact:true}).isVisible());
 await p.getByRole('button',{name:'Paneli kapat',exact:true}).last().click();
 // Approved Sade Netlik roles are verified on rendered controls, not CSS text.
 for(const width of [1440,768,390,320]){
  await p.setViewportSize({width,height:1000});
  const navigate=async name=>{
   if(width>760)await p.locator('.sidebar').getByRole('button',{name,exact:true}).click();
   else if(name==='Raporlar')await p.locator('.mobile-nav').getByRole('button',{name:'Raporlar',exact:true}).click();
   else {await p.locator('.mobile-nav').getByRole('button',{name:'Diğer',exact:true}).click();await p.locator('.mobile-more').getByRole('button',{name,exact:true}).click();}
   await p.locator('.finance-page h1').waitFor();
  };
  for(const name of ['Cari hesaplar','Hesaplar','Kredi kartları','Ödeme Planı','Raporlar']){
   await navigate(name);
   ok(name+' heading follows typography role at '+width,await p.locator('.finance-page h1').evaluate(el=>parseFloat(getComputedStyle(el).fontSize))===(width<=760?24:27));
   if(width<=760)ok(name+' tool touch areas at '+width,await p.locator('.common-toolbar .list-icon').evaluateAll(els=>els.every(el=>{const r=el.getBoundingClientRect();return r.width>=44&&r.height>=44})));
   if(name==='Hesaplar'||name==='Kredi kartları'){
    await p.waitForTimeout(150);
    ok(name+' grid cards stay readable at '+width,await p.locator('.account-face').evaluateAll(els=>els.every(el=>el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1)));
    ok(name+' no carousel remains at '+width,await p.locator('.carousel-viewport,.carousel-arrow').count()===0);
   }
   if(name==='Raporlar'){
    ok('Report grid follows 4/2/1 columns at '+width,await p.locator('.report-metrics .summary-fields').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length)===(width>1100?4:width>760?2:1));
    await p.locator('.report-metrics .cari-total').first().evaluate(el=>{el.firstChild.textContent='999.999.999,99 ';});
    ok('Large report amount stays together at '+width,await p.locator('.report-metrics .cari-total').first().evaluate(el=>el.scrollWidth<=el.clientWidth+1));
   }
  }
 }
 // Shared search applies drafts once, retains each page separately and preserves balances.
 await p.setViewportSize({width:1440,height:1000});await go('Cari hesaplar');
 await p.locator('#search').fill('Ada');await p.waitForFunction(()=>document.querySelectorAll('.party-row').length===1);ok('Cari search applies automatically after debounce',await p.locator('.party-row').count()===1);
 await p.locator('#search').press('Enter');await p.waitForFunction(()=>document.querySelectorAll('.party-row').length===1);
 ok('Cari search applies in current page',await p.locator('.party-row').count()===1);
 await go('Kullanıcılar');ok('User page does not inherit cari query',await p.locator('#search').inputValue()==='');
 await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();const userCount=await p.locator('.finance-due').count();
 await p.getByRole('combobox',{name:'Durum',exact:true}).selectOption('inactive');ok('Filter draft leaves results unchanged',await p.locator('.finance-due').count()===userCount);
 await p.keyboard.press('Escape');ok('Escape cancels draft and restores focus',await p.locator('.search-filter-panel').count()===0&&await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).evaluate(el=>el===document.activeElement));
 await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();ok('Cancelled filter value is discarded',await p.getByRole('combobox',{name:'Durum',exact:true}).inputValue()==='Tümü');
 await p.getByRole('combobox',{name:'Durum',exact:true}).selectOption('inactive');await p.locator('.search-filter-panel').getByRole('button',{name:'Ara',exact:true}).click();ok('Apply closes filters and shows applied chip',await p.locator('.search-filter-panel').count()===0&&(await p.locator('.search-chips').innerText()).includes('Pasif'));
 await p.locator('.search-chips').getByRole('button',{name:'Temizle',exact:true}).click();ok('Clear restores user list',await p.locator('.finance-due').count()===userCount);
 await go('Cari hesaplar');ok('Cari query survives page navigation',await p.locator('#search').inputValue()==='Ada'&&await p.locator('.party-row').count()===1);await p.locator('.search-chips').getByRole('button',{name:'Temizle',exact:true}).click();
 await p.keyboard.press('Control+k');ok('Shortcut focuses shared search',await p.locator('#search').evaluate(el=>el===document.activeElement));
 await go('Hesaplar');await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();await p.getByRole('combobox',{name:'Arama kapsamı',exact:true}).selectOption('accounts');await p.locator('#search').fill('Günlük');await p.locator('.search-filter-panel').getByRole('button',{name:'Ara',exact:true}).click();
 await p.locator('.account-open').first().click();const realBalance=await p.locator('.summary-primary .summary-value').innerText();
 await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();await p.getByRole('combobox',{name:'Arama kapsamı',exact:true}).selectOption('movements');await p.locator('#search').fill('bulunamayacak-islem');ok('Changing scope is staged',await p.locator('.summary-primary .summary-value').innerText()===realBalance);await p.locator('.search-filter-panel').getByRole('button',{name:'Ara',exact:true}).click();
 ok('Movement search leaves actual balance intact',await p.locator('.summary-primary .summary-value').innerText()===realBalance);
 ok('Movement query filters only ledger',await p.locator('.ledger-view tbody tr').count()===0&&await p.locator('.summary-band').count()===1);
 await p.locator('.search-chips').getByRole('button',{name:'Temizle',exact:true}).click();
 await go('Ödeme Planı');
 ok('Calendar count visible in monthly cells',await p.locator('.plan-count').first().isVisible());
 ok('Calendar monthly cells show payment and collection summaries',await p.locator('.calendar-total.danger-text').count()>0&&await p.locator('.calendar-total.positive').count()>0);
 const day=p.locator('.plan-day').filter({has:p.locator('.calendar-preview')}).first();const dayLabel=await day.getAttribute('aria-label');await day.click();ok('Day selection opens persistent agenda',await p.locator('.selected-day-panel h2').innerText()===dayLabel.split(',')[0]&&await p.locator('.plan-bubble').count()===0);
 const selectedLabel=await p.locator('.selected-day-panel h2').innerText();await p.getByRole('button',{name:'Haftalık',exact:true}).click();ok('View switch preserves selected date',await p.locator('.selected-day-panel h2').innerText()===selectedLabel);await p.getByRole('button',{name:'Aylık',exact:true}).click();
 await p.screenshot({path:out+'/calendar-selected-desktop.png',fullPage:true});
 await p.getByRole('button',{name:'Yaklaşanlara dön',exact:true}).click();ok('Upcoming agenda replaces account balances',await p.locator('.plan-aside').getByText('Hesaplarım',{exact:true}).count()===0);
 await p.locator('#search').fill('Ada');await p.locator('#search').press('Enter');ok('Calendar search filters agenda and summaries',await p.locator('.plan-agenda-item').evaluateAll(els=>els.every(el=>el.textContent.includes('Ada'))));
 await p.locator('.search-chips').getByRole('button',{name:'Temizle',exact:true}).click();await p.getByRole('button',{name:'Sonraki dönem',exact:true}).click();
 const monthDate=p.getByRole('button',{name:'Takvim tarihi',exact:true});await monthDate.click();await p.getByRole('dialog').getByRole('combobox',{name:'Ay',exact:true}).selectOption('7');await p.getByRole('dialog').getByRole('combobox',{name:'Yıl',exact:true}).selectOption('2026');await p.getByRole('dialog').locator('[data-day="2026-08-15"]').click();
 ok('Six-week month retains readable rows',await p.locator('.plan-day').count()===42&&await p.locator('.plan-day').first().evaluate(el=>el.getBoundingClientRect().height>=140));
 await p.getByRole('button',{name:'Bugün',exact:true}).click();
 await p.locator('.sidebar').getByRole('button',{name:'Genel bakış',exact:true}).click();const overviewAdd=await p.locator('.page-title').getByRole('button',{name:'İşlem ekle',exact:true}).boundingBox();await go('Cari hesaplar');const partyAdd=await p.getByRole('button',{name:'Yeni kayıt ekle',exact:true}).boundingBox();ok('Overview add button matches other pages',overviewAdd.width===44&&overviewAdd.height===44&&partyAdd.width===44&&partyAdd.height===44);
 await p.screenshot({path:out+'/shared-search-desktop.png',fullPage:true});
 for(const width of [390,320]){await p.setViewportSize({width,height:844});await p.locator('.mobile-nav').getByRole('button',{name:'Diğer',exact:true}).click();await p.locator('.mobile-more').getByRole('button',{name:'Ödeme Planı',exact:true}).click();await p.locator('.plan-day').filter({has:p.locator('.calendar-cell-content')}).first().click();ok('Mobile selected-day agenda follows calendar '+width,await p.locator('.plan-aside').evaluate(el=>el.getBoundingClientRect().top>=el.previousElementSibling.getBoundingClientRect().bottom));await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();ok('Mobile filter panel matches search width '+width,await p.locator('.page-search').evaluate(el=>Math.abs(el.querySelector('.page-search-row').getBoundingClientRect().width-document.querySelector('.search-filter-panel').getBoundingClientRect().width)<2));await p.screenshot({path:out+'/shared-filters-'+width+'.png',fullPage:true});await p.locator('.search-filter-panel').getByRole('button',{name:'Vazgeç',exact:true}).click();}

 // Restore previous controls and validate one shared header on every page.
 const navigateLayout=async(name,width)=>{
  if(width>760)await p.locator('.sidebar').getByRole('button',{name,exact:true}).click();
  else {const direct={'Genel bakış':'Özet','Raporlar':'Raporlar','Tahsilat & Ödeme':'Ödeme'}[name];if(direct)await p.locator('.mobile-nav').getByRole('button',{name:direct,exact:true}).click();else{await p.locator('.mobile-nav').getByRole('button',{name:'Diğer',exact:true}).click();await p.locator('.mobile-more').getByRole('button',{name,exact:true}).click();}}
  await p.locator('main h1').first().waitFor();if(name==='Cari hesaplar'&&await p.locator('.page-back').count())await p.locator('.page-back').click();if(['Hesaplar','Kredi kartları'].includes(name)&&await p.locator('.page-back').count())await p.locator('.page-back').click();
 };
 for(const width of [2540,1920,1440,768,390,320]){
  await p.setViewportSize({width,height:1000});
  for(const name of ['Genel bakış','Cari hesaplar','Tahsilat & Ödeme','Ödeme Planı','Hesaplar','Kredi kartları','Raporlar','Kullanıcılar']){
   await navigateLayout(name,width);
   ok(name+' has one search and no duplicate reset '+width,await p.locator('main input[aria-label*=ara]').count()===0&&await p.locator('.topbar #search').count()===1&&await p.getByRole('button',{name:'Filtreleri sıfırla',exact:true}).count()===0);
   const geometry=await p.locator('.page-search-row').evaluate(el=>{const parts=[el.querySelector('.cari-search'),...el.querySelectorAll(':scope>button')].map(e=>e.getBoundingClientRect());return parts.every(r=>Math.abs(r.height-44)<1&&Math.abs(r.top-parts[0].top)<1)});
   ok(name+' search controls align at 44px '+width,geometry);
   const titleAdd=p.locator('main .page-title .primary-button').first();if(await titleAdd.count())ok(name+' add action shares title row '+width,await titleAdd.evaluate(el=>{const action=el.getBoundingClientRect(),heading=el.closest('.page-title').firstElementChild.getBoundingClientRect();return action.top<heading.bottom&&action.left>=heading.right+4}));
   ok(name+' frame aligns with search '+width,await p.evaluate(()=>{const main=document.querySelector('.main-content'),box=main.getBoundingClientRect(),style=getComputedStyle(main),search=document.querySelector('.page-search-row').getBoundingClientRect();return Math.abs(search.left-box.left-parseFloat(style.paddingLeft))<2&&document.documentElement.scrollWidth<=innerWidth}));
   if(width>760)ok(name+' restores date '+width,await p.locator('.date-label').isVisible()&&(await p.locator('.date-label').innerText()).includes('2026'));
   for(const bar of await p.locator('.ledger-view .content-tools').all())ok(name+' ledger tools align right '+width,await bar.evaluate(el=>{const panel=el.closest('.ledger-view').getBoundingClientRect(),tools=el.querySelector('.cari-toolbar-actions').getBoundingClientRect();return panel.right-tools.right>=0&&panel.right-tools.right<=24}));
   if(name==='Raporlar')await p.waitForTimeout(1600);
   await p.screenshot({path:out+'/layout-review-'+name.replaceAll(' ','-')+'-'+width+'.png',fullPage:true});
  }
 }
 await p.setViewportSize({width:1440,height:1000});await navigateLayout('Genel bakış',1440);
 ok('Shortcut hint restored',await p.locator('.page-search kbd').isVisible());
 ok('Overview title has no orphan toolbar above it',await p.locator('main>.content-tools').count()===0&&await p.locator('.main-content').evaluate(el=>{const title=el.querySelector('.page-title').getBoundingClientRect();return title.top-el.getBoundingClientRect().top<=32}));
 const overviewState=await(await p.request.get(base+'/api/index.php?action=state')).json();const scheduledNames=overviewState.events.filter(e=>e.scheduled).map(e=>e.description);
 const recentText=await p.locator('.transactions-panel tbody').innerText();ok('Recent activity excludes planned records',scheduledNames.every(name=>!name||!recentText.includes(name))&&await p.locator('.transactions-panel tbody tr').count()>0);
 ok('Outgoing legend matches chart series',await p.evaluate(()=>{const legend=document.querySelector('.legend.outgoing'),bar=document.querySelector('.flow-panel .recharts-bar:nth-of-type(2) path');const paths=[...document.querySelectorAll('.flow-panel .recharts-bar path')];return paths.some(path=>getComputedStyle(path).fill===getComputedStyle(legend).backgroundColor)}));
 await navigateLayout('Hesaplar',1440);await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();await p.getByRole('combobox',{name:'Arama kapsamı',exact:true}).selectOption('accounts');await p.locator('.search-filter-panel').getByRole('button',{name:'Ara',exact:true}).click();
 await p.getByRole('group',{name:'Hesap listesi araçları',exact:true}).getByRole('button',{name:'Sırala',exact:true}).click();ok('Inventory sort remains independently available',await p.getByRole('button',{name:'Ad: A–Z',exact:true}).isVisible());await p.getByRole('button',{name:'Ad: A–Z',exact:true}).click();
 await p.locator('.account-open').first().click();await p.getByRole('group',{name:'Hareket araçları',exact:true}).getByRole('button',{name:'Sırala',exact:true}).click();ok('Movement sort remains available in account search scope',await p.getByRole('button',{name:'Tutar: düşükten yükseğe',exact:true}).isVisible());await p.getByRole('button',{name:'Tutar: düşükten yükseğe',exact:true}).click();
 const movementDownload=await Promise.all([p.waitForEvent('download'),p.getByRole('group',{name:'Hareket araçları',exact:true}).getByRole('button',{name:'CSV indir',exact:true}).click()]);ok('Movement CSV keeps its own context',movementDownload[0].suggestedFilename()==='hesap-hareketleri.csv');
 await navigateLayout('Raporlar',1440);await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();await p.getByRole('combobox',{name:'Hesap',exact:true}).selectOption({label:'KMH Deneme Hesabı'});await p.locator('.search-filter-panel').getByRole('button',{name:'Ara',exact:true}).click();
 await navigateLayout('Genel bakış',1440);await p.locator('.account-row').first().click();await p.locator('.finance-page h1').filter({hasText:'Raporlar'}).waitFor();await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();ok('Dashboard account keeps original report destination and overrides saved scope',(await p.getByRole('combobox',{name:'Hesap',exact:true}).locator('option:checked').innerText())==='Günlük hesap');await p.locator('.search-filter-panel').getByRole('button',{name:'Vazgeç',exact:true}).click();
 await navigateLayout('Hesaplar',1440);await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();await p.getByRole('combobox',{name:'Arama kapsamı',exact:true}).selectOption('accounts');await p.locator('#search').fill('Günlük');await p.locator('.search-filter-panel').getByRole('button',{name:'Ara',exact:true}).click();
 await p.getByRole('button',{name:'Bildirimleri aç',exact:true}).click();await p.getByRole('dialog').locator('.notification-row').filter({hasText:'KMH Deneme Hesabı'}).click();await p.locator('h1').filter({hasText:'KMH Deneme Hesabı'}).waitFor();ok('Notification destination overrides saved account and query',await p.locator('#search').inputValue()==='');
 await navigateLayout('Ödeme Planı',1440);await p.locator('#search').fill('bulunamayacak-plan');await p.locator('#search').press('Enter');await navigateLayout('Genel bakış',1440);await p.locator('.summary button.metric').first().click();await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();ok('Dashboard receivables override remembered plan query',await p.locator('#search').inputValue()===''&&await p.getByRole('combobox',{name:'Tür',exact:true}).inputValue()==='Tahsilat');await p.locator('.search-filter-panel').getByRole('button',{name:'Vazgeç',exact:true}).click();

 // Inventory search from a detail must switch the actual record; empty results stay usable.
 await navigateLayout('Hesaplar',1440);await p.locator('#search').fill('');await p.locator('#search').press('Enter');await p.locator('.account-open').first().click();
 await p.locator('.topbar').getByRole('button',{name:'Filtrele',exact:true}).click();await p.getByRole('combobox',{name:'Arama kapsamı',exact:true}).selectOption('accounts');await p.locator('#search').fill('KMH');await p.locator('.search-filter-panel').getByRole('button',{name:'Ara',exact:true}).click();await p.locator('h1').filter({hasText:'KMH Deneme Hesabı'}).waitFor();ok('Detail inventory scope selects matching account',await p.locator('.summary-band').innerText().then(t=>t.includes('KMH')));
 await p.locator('#search').fill('bulunamayacak-hesap');await p.locator('#search').press('Enter');await p.getByText('Bu kapsamda hesap veya kart bulunamadı.',{exact:true}).waitFor();ok('Empty detail inventory search preserves return navigation',await p.locator('.page-back').isVisible()&&await p.locator('.account-alerts').isVisible());await p.locator('.page-back').click();await p.locator('.account-grid').waitFor();
 // The updater distinguishes uploading application files from a schema migration.
 await require('./pos-browser.cjs')({p,go,ok,out});
 await require('./tracking-browser.cjs')({p,go,ok,out});
 await p.setViewportSize({width:1440,height:1000});await p.goto(base+'/update.php');
 await p.locator('#status').filter({hasText:'Veritabanı güncel (şema 10)'}).waitFor();
 ok('Current schema has no misleading update action',!await p.locator('#run').isVisible()&&await p.locator('#run').isDisabled());
 ok('Updater explains files are installed separately',(await p.locator('main').innerText()).includes('Uygulama dosyalarını indirmez veya yüklemez.'));
 ok('Demo renewal remains opt-in',!await p.locator('#demo').isChecked());await p.screenshot({path:out+'/updater-current-desktop.png'});
 await p.setViewportSize({width:320,height:844});await p.screenshot({path:out+'/updater-current-mobile.png',fullPage:true});ok('Updater fits 320px',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.route('**/api/index.php?action=update_status',route=>route.fulfill({json:{version:9,target:10,backupReady:false}}));await p.reload();await p.getByRole('button',{name:'Veritabanını güncelle',exact:true}).waitFor();
 ok('Older schema offers enabled migration',await p.locator('#run').isEnabled()&&(await p.locator('#status').innerText()).includes('9 → 10'));
 await p.unroute('**/api/index.php?action=update_status');await p.reload();await p.locator('#status').filter({hasText:'Veritabanı güncel (şema 10)'}).waitFor();
 ok('Bundled Inter loaded',await p.evaluate(()=>document.fonts.check('14px Inter')));
 ok('No runtime React errors',errors.length===0);
 await browser.close();fs.writeFileSync(out+'/checks.json',JSON.stringify({passed:checks.length,browser:browser.version(),compiled:true,checks,errors},null,2));
})().catch(async e=>{if(activePage){await activePage.screenshot({path:out+'/failure.png',fullPage:true}).catch(()=>{});fs.writeFileSync(out+'/failure-body.txt',await activePage.locator('body').innerText().catch(()=>''));fs.writeFileSync(out+'/failure-layout.json',JSON.stringify(await activePage.evaluate(()=>({width:innerWidth,height:innerHeight,visibleHeight:getComputedStyle(document.documentElement).getPropertyValue('--visible-height'),searchCounts:{main:document.querySelectorAll('main input[aria-label*=ara]').length,topbar:document.querySelectorAll('.topbar #search').length},heading:document.querySelector('main h1')?.textContent,dialogs:[...document.querySelectorAll('.finance-sheet')].map(el=>el.getBoundingClientRect().toJSON())})).catch(()=>({}))));}console.error(e);fs.writeFileSync(out+'/failure.txt',String(e));process.exit(1)});

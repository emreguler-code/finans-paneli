// Exercise the updater shipped in the ZIP, using only the runner's disposable database.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const checks=[];const ok=(name,value)=>{if(!value)throw Error(name);checks.push(name);console.log('PASS '+name)};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.QA_BROWSER_BIN||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1100,height:900},locale:'tr-TR'});page.setDefaultTimeout(20000);
 await page.goto(process.env.QA_BASE_URL);await page.locator('input[name=username]').fill(process.env.QA_USERNAME);await page.locator('input[name=password]').fill(process.env.QA_PASSWORD);await page.getByRole('button',{name:'Giriş yap',exact:true}).click();await page.locator('.app').waitFor();
 await page.goto(process.env.QA_BASE_URL+'/update.php');const seed=page.getByRole('button',{name:'Demo verilerini yenile',exact:true});await seed.waitFor();
 ok('Packaged updater keeps reset available when schema is current',await seed.isEnabled());
 await seed.click();await page.waitForFunction(()=>document.querySelector('#result').textContent.includes('işaretleyin'));ok('Reset requires the explicit demo checkbox',true);
 await page.locator('#demo').check();let previousIds=null;
 for(let pass=0;pass<2;pass++){
  await seed.click();await page.waitForFunction(()=>!document.querySelector('#seed').disabled&&document.querySelector('#result').textContent.includes('Demo verileri yenilendi'));
  const response=await page.request.get(process.env.QA_BASE_URL+'/api/index.php?action=state');ok('Packaged demo reset succeeds '+pass,response.ok());const s=await response.json();
  ok('Packaged reset creates the expanded demo '+pass,s.events.length>=623&&s.accounts.length===4&&s.parties.length===10&&s.cards.length===3);
  ok('Packaged demo includes vehicle and campaign fixtures '+pass,s.vehicles.length===4&&s.vehicle_records.length>=44&&s.campaigns.length===2);
  ok('Previous test transactions are removed '+pass,!s.events.some(e=>e.description==='Demo iptal edilmiş gider'));
  ok('Administrator remains intact '+pass,s.user.role==='admin'&&s.user.username===process.env.QA_USERNAME);
  const ids=s.events.map(e=>e.id);if(previousIds)ok('Second reset replaces demo instead of duplicating it',!ids.some(id=>previousIds.includes(id)));previousIds=ids;
 }
 await page.screenshot({path:path.join(process.env.QA_OUTPUT_DIR,'packaged-updater-demo.png'),fullPage:true});
 await page.context().clearCookies();await page.goto(process.env.QA_BASE_URL);await page.locator('input[name=username]').fill(process.env.QA_USERNAME);await page.locator('input[name=password]').fill(process.env.QA_PASSWORD);await page.getByRole('button',{name:'Giriş yap',exact:true}).click();await page.locator('.app').waitFor();ok('Original administrator password still logs in after both resets',true);
 fs.writeFileSync(path.join(process.env.QA_OUTPUT_DIR,'packaged-updater-checks.json'),JSON.stringify({passed:checks.length,checks},null,2));await browser.close();
})().catch(e=>{console.error(e);fs.writeFileSync(path.join(process.env.QA_OUTPUT_DIR,'failure.txt'),String(e));process.exit(1)});

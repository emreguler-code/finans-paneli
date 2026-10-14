// Compare the previously released frontend and current frontend against identical API data.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),net=require('node:net');
const {execFileSync}=require('node:child_process');
(async()=>{
 const port=await new Promise(resolve=>{const server=net.createServer().listen(0,'127.0.0.1',()=>{const p=server.address().port;server.close(()=>resolve(p))})});
 const name='finans-qa-compare-'+process.pid,root=path.resolve(__dirname,'..'),out=path.join(process.env.QA_OUTPUT_DIR,'compare');fs.mkdirSync(out,{recursive:true});
 let browser;
 try{
  execFileSync('docker',['run','-d','--name',name,'--network','host','-v',`${root}:${root}`,'finans-php-test','-S',`127.0.0.1:${port}`,'-t',process.env.QA_COMPARE_BASELINE],{stdio:'ignore'});
  browser=await chromium.launch({executablePath:process.env.QA_BROWSER_BIN||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  for(const width of [1440,390,320]){
   const shots=[];
   for(const [label,base] of [['before',`http://127.0.0.1:${port}`],['after',process.env.QA_BASE_URL]]){
    const context=await browser.newContext({viewport:{width,height:1000},locale:'tr-TR',timezoneId:'Europe/Istanbul'}),page=await context.newPage();
    await page.goto(base);await page.locator('input[name=username]').fill(process.env.QA_USERNAME);await page.locator('input[name=password]').fill(process.env.QA_PASSWORD);await page.getByRole('button',{name:'Giriş yap',exact:true}).click();await page.locator('.app').waitFor();
    const today=await page.evaluate(async()=> (await (await fetch('api/index.php?action=state')).json()).today);
    await page.clock.install({time:new Date(today+'T12:00:00+03:00')});
    for(const section of ['Genel bakış','Cari hesaplar','Hesaplar','Kredi kartları','Ödeme Planı','Raporlar','Kullanıcılar']){
     if(width>700)await page.locator('.sidebar').getByRole('button',{name:section,exact:true}).click();
     else if(['Genel bakış','Raporlar','Tahsilat & Ödeme'].includes(section))await page.locator('.mobile-nav').getByRole('button',{name:section==='Genel bakış'?'Özet':section==='Tahsilat & Ödeme'?'Ödeme':section,exact:true}).click();
     else {await page.locator('.mobile-nav').getByRole('button',{name:'Diğer',exact:true}).click();await page.locator('.mobile-more').getByRole('button',{name:section,exact:true}).click();}
     await page.evaluate(()=>{const label=document.querySelector('.demo-note');if(label)for(const node of label.childNodes)if(node.nodeType===Node.TEXT_NODE)node.textContent=node.textContent.replace(/1\.6\.[01]/g,'1.6.x');return document.fonts.ready});await page.waitForTimeout(2500);
     const shot=path.join(out,`${width}-${section}-${label}.png`);await page.screenshot({path:shot,animations:'disabled'});shots.push(shot);
    }
    await context.close();
   }
   const comparison=await browser.newPage();let changed=0;
   for(const before of shots.filter(name=>name.endsWith('-before.png'))){
    const after=before.replace('-before.png','-after.png');
    if(fs.readFileSync(before).equals(fs.readFileSync(after)))continue;
    const pixels=await comparison.evaluate(async({before,after})=>{
     const load=async value=>{const image=new Image();image.src='data:image/png;base64,'+value;await image.decode();return image};
     const [a,b]=await Promise.all([load(before),load(after)]);
     if(a.width!==b.width||a.height!==b.height)return Infinity;
     const canvas=document.createElement('canvas');canvas.width=a.width;canvas.height=a.height;const c=canvas.getContext('2d');
     c.drawImage(a,0,0);const x=c.getImageData(0,0,a.width,a.height).data;c.clearRect(0,0,a.width,a.height);c.drawImage(b,0,0);const y=c.getImageData(0,0,a.width,a.height).data;
     let count=0;for(let i=0;i<x.length;i+=4)if(x[i]!==y[i]||x[i+1]!==y[i+1]||x[i+2]!==y[i+2]||x[i+3]!==y[i+3])count++;return count;
    },{before:fs.readFileSync(before).toString('base64'),after:fs.readFileSync(after).toString('base64')});
    // Chromium occasionally differs at a handful of rounded-border antialias pixels.
    // Any larger change (including chart animation not settled) fails the comparison.
    if(pixels>16)throw new Error('Visual regression: '+path.basename(before)+' ('+pixels+' pixels)');
    changed+=pixels;
   }
   await comparison.close();
   console.log(`PASS baseline/current comparison at ${width}px (release label normalized; ${changed} antialias pixels)`);
  }
 }finally{await browser?.close();execFileSync('docker',['rm','-f',name],{stdio:'ignore'});}
})().catch(error=>{console.error(error);process.exitCode=1});

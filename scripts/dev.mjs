// Local development helper. Hosting uses the compiled hosting/ files, not Node.js.
import {spawn,spawnSync} from 'node:child_process';
import {existsSync,readFileSync,appendFileSync} from 'node:fs';
import net from 'node:net';
const config=existsSync('.dev-runtime.json')?JSON.parse(readFileSync('.dev-runtime.json','utf8').replaceAll('${ROOT}',process.cwd())):{};
const children=[];
const env={...process.env,...config.env};
function run(bin,args,extra={}){const child=spawn(bin,args,{stdio:'inherit',env,...extra});children.push(child);child.on('exit',code=>{if(code && !stopping){console.error(bin,'exited',code);shutdown()}});return child}
let stopping=false;
function shutdown(){stopping=true;children.reverse().forEach(c=>c.kill('SIGTERM'));setTimeout(()=>process.exit(),1000).unref()}
process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
async function ready(port){for(let i=0;i<100;i++){if(await new Promise(resolve=>{const s=net.connect(port,'127.0.0.1');s.once('connect',()=>{s.destroy();resolve(true)});s.once('error',()=>resolve(false));}))return;await new Promise(r=>setTimeout(r,100))}throw Error('Server not ready: '+port)}

if(config.mysql){run(config.mysql.bin,config.mysql.args);await ready(3307)}
const php=run(config.php?.bin||process.env.PHP_BIN||'php',[...(config.php?.args||[]),'-S','127.0.0.1:8088','-t','public',...(config.router?[config.router]:[])],{env:{...env,...(process.platform==='win32'?{}:{PHP_CLI_SERVER_WORKERS:'4'})}});
await ready(8088);
if(config.initialize){const result=spawnSync('python3',[config.initialize],{env,stdio:'inherit'});if(result.status!==0){shutdown();throw Error('Integration verification failed')}}
run(process.execPath,['node_modules/vite/bin/vite.js',...process.argv.slice(2)]);

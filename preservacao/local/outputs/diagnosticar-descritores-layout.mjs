import {createServer} from '../work/CodeLab/node_modules/vite/dist/node/index.js';
import {chromium} from '../work/CodeLab/node_modules/playwright/index.mjs';
const servidor=await createServer({configFile:false,root:new URL('../work/CodeLab/dist',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),server:{host:'127.0.0.1',port:5173,strictPort:true}});
await servidor.listen();
const navegador=await chromium.launch({channel:'msedge',headless:true});
try{
 const pagina=await navegador.newPage({viewport:{width:220,height:812}});
 await pagina.goto('http://127.0.0.1:5173/#/aula/py-objetos-protocolos');
 await pagina.locator('.lesson-chapter').first().waitFor();
 console.log(await pagina.evaluate(()=>[...document.querySelectorAll('.page *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&r.width>0;}).map(e=>({tag:e.tagName,classe:e.className,texto:e.textContent?.slice(0,110),direita:e.getBoundingClientRect().right,quebra:getComputedStyle(e).overflowWrap})).slice(0,12)));
}finally{await navegador.close();await servidor.close();}

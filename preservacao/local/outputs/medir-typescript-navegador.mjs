import {readFileSync,writeFileSync,readdirSync,statSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {resolve,join} from 'node:path';
import {preview} from '../work/CodeLab/node_modules/vite/dist/node/index.js';
import {chromium} from '../work/CodeLab/node_modules/playwright-core/index.mjs';
const raiz=resolve('../../outputs/prototipo-typescript');
const servidor=await preview({root:raiz,configFile:false,preview:{host:'127.0.0.1',port:5175,strictPort:true,headers:{'Content-Security-Policy':"default-src 'self'; script-src 'self'; worker-src 'self'; connect-src 'self'; object-src 'none'"}}});
const navegador=await chromium.launch({channel:'msedge',headless:true});
try{
 const pagina=await navegador.newPage({viewport:{width:375,height:812}});await pagina.goto('http://127.0.0.1:5175');await pagina.waitForFunction(()=>typeof window.iniciarCompilador==='function');
 const casos=[{nome:'contrato válido e emissão',codigo:'interface Pedido {valor:number; valido:boolean}\nconst pedidos:Pedido[]=[{valor:10,valido:true},{valor:20,valido:false}];\nconsole.log(pedidos.filter(p=>p.valido).reduce((total,p)=>total+p.valor,0));',esperados:[]},{nome:'tipo incompatível',codigo:'const quantidade:number="3"; console.log(quantidade);',esperados:[2322]},{nome:'API de rede ausente',codigo:'fetch("https://example.com");',esperados:[2304]},{nome:'importação indisponível',codigo:'import {readFile} from "node:fs"; console.log(readFile);',esperados:[2792]}];
 const resultados=[];
 for(const caso of casos){const resultado=await pagina.evaluate(codigo=>new Promise((resolve,reject)=>{const inicio=performance.now(),worker=window.iniciarCompilador(),prazo=setTimeout(()=>{worker.terminate();reject(Error('Prazo do protótipo excedido'));},20000);worker.onmessage=evento=>{clearTimeout(prazo);worker.terminate();resolve({...evento.data,totalMs:Math.round(performance.now()-inicio)});};worker.onerror=evento=>{clearTimeout(prazo);worker.terminate();reject(Error(evento.message));};worker.postMessage(codigo);}),caso.codigo);resultados.push({nome:caso.nome,...resultado});console.log(JSON.stringify({nome:caso.nome,...resultado}));if(caso.esperados.length===0&&(!resultado.emitiu||resultado.erros.length))throw Error('Programa válido recusado');if(caso.esperados.length&&!caso.esperados.every(c=>resultado.erros.some(e=>e.codigo===c)))throw Error('Diagnóstico esperado ausente: '+caso.nome);}
 const arquivos=readdirSync(join(raiz,'dist/assets')).map(nome=>{const caminho=join(raiz,'dist/assets',nome);return {nome,bytes:statSync(caminho).size,gzip:gzipSync(readFileSync(caminho)).length};});
 const medicao={capturadoEm:new Date().toISOString(),tipo:'protótipo externo ao produto, sem execução do JS emitido',navegador:await navegador.version(),csp:'somente origem local, sem unsafe-eval',arquivos,resultados,limites:'Viewport estreita em Edge desktop. Não mede RAM ou FPS de celular físico. Compilador não está no produto.'};writeFileSync('../../outputs/medicao-typescript-navegador-20261011.json',JSON.stringify(medicao,null,2));console.log(JSON.stringify(medicao,null,2));
}finally{await navegador.close();await new Promise(resolve=>servidor.httpServer.close(resolve));}


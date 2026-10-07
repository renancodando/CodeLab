import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
async function files(dir){const result=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())result.push(...await files(p));else result.push(p);}return result;}
const paths=(await files('dist')).filter(p=>p==='dist/index.html'||p.startsWith('dist/assets/')||p==='dist/favicon.svg').sort();
const hash=createHash('sha256');for(const p of paths){hash.update(p);hash.update(await readFile(p));}
const version=hash.digest('hex').slice(0,20),urls=paths.map(p=>'/'+p.slice(5));urls.push('/');
await writeFile('dist/sw.js',`const CACHE='codelab-offline-${version}';
const URLS=${JSON.stringify(urls)},known=new Set(URLS);
self.addEventListener('install',event=>event.waitUntil((async()=>{try{await(await caches.open(CACHE)).addAll(URLS);}catch(error){await caches.delete(CACHE);throw error;}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('codelab-offline-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!known.has(url.pathname))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);return(await cache.match(url.pathname))||fetch(event.request);})());
});
`);
console.log('Aplicação e conteúdo offline preparados: '+urls.length+' recursos locais; versão '+version+'.');

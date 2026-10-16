import {readFileSync,writeFileSync} from 'node:fs';
let texto=readFileSync('src/laboratory.ts','utf8');texto=texto.replace("const modulo=await import('./execution/sql-local');if(disposed||revision!==version)return;",`let modulo:typeof import('./execution/sql-local');
 try{modulo=await import('./execution/sql-local');}catch{if(!disposed&&revision===version)message('Não foi possível carregar SQLite. Seu SQL continua salvo. Conecte à internet para o primeiro carregamento e tente novamente.');return;}
 if(disposed||revision!==version)return;`);writeFileSync('src/laboratory.ts',texto);
texto=readFileSync('scripts/build-offline.mjs','utf8');
texto=texto.replace("const version=hash.digest('hex').slice(0,20),urls=paths.map(p=>'/'+p.slice(5));urls.push('/');",`const version=hash.digest('hex').slice(0,20);
const opcionais=paths.filter(p=>/\\/(?:sql-local(?:\\.worker)?-|sql-wasm-browser-)/.test(p)).map(p=>'/'+p.slice(5));
const urls=paths.map(p=>'/'+p.slice(5)).filter(p=>!opcionais.includes(p));urls.push('/');`);
texto=texto.replace('known=new Set(URLS)', 'known=new Set([...URLS,...'+ '${JSON.stringify(opcionais)}'+'])');
texto=texto.replace("return(await cache.match(url.pathname))||fetch(event.request);",`const salvo=await cache.match(url.pathname);if(salvo)return salvo;const resposta=await fetch(event.request);if(resposta.ok)try{await cache.put(url.pathname,resposta.clone());}catch{}return resposta;`);
texto=texto.replace("urls.length+' recursos locais; versão '","urls.length+' recursos locais e '+opcionais.length+' opcionais sob demanda; versão '");writeFileSync('scripts/build-offline.mjs',texto);

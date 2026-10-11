import {describe,it,expect,beforeAll} from 'vitest';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join,sep} from 'node:path';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
let codigo:string;
beforeAll(()=>{
 const raiz=mkdtempSync(join(tmpdir(),'codelab-sql-cache-'));
 try{
  mkdirSync(join(raiz,'dist/assets'),{recursive:true});
  for(const [arquivo,conteudo] of [['index.html','inicio'],['assets/index-a.js','aplicacao'],['assets/sql-local-a.js','carregador'],['assets/sql-local.worker-a.js','worker'],['assets/sql-wasm-browser-a.wasm','wasm']])writeFileSync(join(raiz,'dist',arquivo),conteudo);
  execFileSync(process.execPath,[resolve('scripts/build-offline.mjs')],{cwd:raiz,timeout:10000,stdio:'pipe'});
  codigo=readFileSync(join(raiz,'dist/sw.js'),'utf8');
 }finally{if(!resolve(raiz).startsWith(resolve(tmpdir())+sep))throw new Error('Diretório temporário inválido.');rmSync(raiz,{recursive:true,force:true});}
});
function ambiente(opcoes:{falharInstalacao?:boolean;semEspaco?:boolean}={}){
 const eventos=new Map<string,Function>(),salvos=new Map<string,Response>(),incluidos:string[]=[],apagados:string[]=[],requisitados:string[]=[];
 let semRede=false;
 const cache={addAll:async(urls:string[])=>{incluidos.push(...urls);if(opcoes.falharInstalacao)throw new Error('rede');},match:async(url:string)=>salvos.get(url),put:async(url:string,resposta:Response)=>{if(opcoes.semEspaco)throw new Error('quota');salvos.set(url,resposta);}};
 runInNewContext(codigo,{URL,self:{location:{origin:'https://codelab.test'},addEventListener:(nome:string,funcao:Function)=>eventos.set(nome,funcao),clients:{claim:async()=>{}}},caches:{open:async()=>cache,delete:async(chave:string)=>{apagados.push(chave);},keys:async()=>[]},fetch:async(pedido:{url:string})=>{requisitados.push(pedido.url);if(semRede)throw new Error('offline');return new Response('SQLite local',{status:200});}});
 function instalar(){let promessa:Promise<unknown>|undefined;eventos.get('install')!({waitUntil:(valor:Promise<unknown>)=>promessa=valor});return promessa!;}
 function buscar(caminho:string,metodo='GET'){let promessa:Promise<Response>|undefined;eventos.get('fetch')!({request:{url:new URL(caminho,'https://codelab.test').href,method:metodo},respondWith:(valor:Promise<Response>)=>promessa=valor});return promessa;}
 return{incluidos,apagados,requisitados,salvos,instalar,buscar,ficarOffline:()=>{semRede=true;}};
}
describe('cache opcional do motor SQL',()=>{
 it('prepara a aplicação sem baixar compilador, worker ou WASM de SQL',async()=>{
  const mundo=ambiente();await mundo.instalar();expect(mundo.incluidos).toContain('/assets/index-a.js');expect(mundo.incluidos).toContain('/');expect(mundo.incluidos.some(url=>/sql-local|sql-wasm/.test(url))).toBe(false);
 });
 it('guarda o recurso solicitado e volta a servir sem rede',async()=>{
  const mundo=ambiente(),caminho='/assets/sql-wasm-browser-a.wasm';await mundo.instalar();expect(await(await mundo.buscar(caminho))!.text()).toBe('SQLite local');mundo.ficarOffline();expect(await(await mundo.buscar(caminho))!.text()).toBe('SQLite local');expect(mundo.requisitados).toHaveLength(1);
 });
 it('falha de quota no cache não impede a resposta online',async()=>{
  const mundo=ambiente({semEspaco:true});expect(await(await mundo.buscar('/assets/sql-local.worker-a.js'))!.text()).toBe('SQLite local');expect(mundo.salvos.size).toBe(0);
 });
 it('não intercepta API, outra origem ou requisições com efeito',()=>{
  const mundo=ambiente();expect(mundo.buscar('/api/executions')).toBeUndefined();expect(mundo.buscar('https://outra.test/assets/sql-local-a.js')).toBeUndefined();expect(mundo.buscar('/assets/sql-local-a.js','POST')).toBeUndefined();expect(mundo.requisitados).toEqual([]);
 });
 it('uma instalação incompleta elimina somente o cache que falhou',async()=>{
  const mundo=ambiente({falharInstalacao:true});await expect(mundo.instalar()).rejects.toThrow('rede');expect(mundo.apagados).toHaveLength(1);expect(mundo.apagados[0]).toMatch(/^codelab-offline-[a-f0-9]{20}$/);
 });
});

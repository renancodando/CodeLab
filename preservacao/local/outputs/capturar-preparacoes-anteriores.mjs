import {createServer} from '../work/CodeLab/node_modules/vite/dist/node/index.js';
import ts from '../work/CodeLab/node_modules/typescript/lib/typescript.js';
import {execFileSync} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
const raiz=new URL('../work/CodeLab/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1');
const ler=caminho=>execFileSync('git',['-c','safe.directory='+raiz,'show','ecd7818192a7cf6402be2e8fe5d6271df73992a8:'+caminho],{cwd:raiz,encoding:'utf8'});
const fonte=ts.transpileModule(ler('src/learning/adaptive.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {buildDailySession,freshAdaptive}=await import('data:text/javascript;base64,'+Buffer.from(fonte).toString('base64'));
const anterior=ler('src/learning/hub-catalog.ts');
const servidor=await createServer({root:raiz,server:{middlewareMode:true},configFile:false,optimizeDeps:{noDiscovery:true},plugins:[{name:'catalogo-publicado',enforce:'pre',load(id){if(id.replaceAll('\\','/').endsWith('/src/learning/hub-catalog.ts'))return anterior;}}]});
try{
 const {adaptiveCatalog,idPreparacao}=await servidor.ssrLoadModule('/src/learning/hub-catalog.ts');
 const planos={};
 for(const [aula,linguagem,ids] of [['sql-null-logica','sql',['sql-prever-desconhecido','sql-corrigir-obrigatoriedade','sql-correlacionar-ausentes']],['repeticoes','javascript',['js-prever-ciclos','js-debug-soma-inclusiva','js-parar-contagem']],['valores','javascript',['js-prever-ausencia-zero','js-debug-saldo-textual','js-permitir-reatribuicao']]]){
  const introducao=adaptiveCatalog.activities.find(a=>a.id===idPreparacao(aula)).requiredConcepts[0];
  const estado=freshAdaptive();estado.seenConcepts=[introducao];
  const catalogo={...adaptiveCatalog,preferredLanguage:linguagem,activities:adaptiveCatalog.activities.filter(a=>a.id===introducao||ids.includes(a.id)).map(a=>ids.includes(a.id)?{...a,requiredConcepts:[introducao]}:a)};
  planos[aula]=buildDailySession(estado,catalogo,{now:Date.parse('2026-10-13T12:00:00Z'),timeZone:'UTC'});
 }
 await writeFile(new URL('./planos-preparacao-anteriores.json',import.meta.url),JSON.stringify(planos,null,2));
 console.log(JSON.stringify(planos));
}finally{await servidor.close();}

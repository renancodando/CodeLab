import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import ts from '../work/CodeLab/node_modules/typescript/lib/typescript.js';
import {montarCasosCsv} from '../work/CodeLab/tests/fixtures/python-csv.mjs';
const raiz=new URL('../work/CodeLab/',import.meta.url);
const transpilar=fonte=>ts.transpileModule(fonte,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const url=fonte=>'data:text/javascript;base64,'+Buffer.from(fonte).toString('base64');
const metadados=url(transpilar(await readFile(new URL('src/content/practice.ts',raiz),'utf8')));
const {practiceActivities}=await import(metadados);
const verificadores=transpilar(await readFile(new URL('src/learning/practice.ts',raiz),'utf8')).replace(/from ['"]\.\.\/content\/practice['"]/g,'from '+JSON.stringify(metadados));
const {getPracticeSolution}=await import(url(verificadores));
const pasta=new URL('./verificacao-python-csv/',import.meta.url);await mkdir(pasta,{recursive:true});
for(const caso of montarCasosCsv(practiceActivities,getPracticeSolution)) {
 const arquivo=new URL(caso.id+'.py',pasta);await writeFile(arquivo,caso.source);
 const resultado=spawnSync('python',[arquivo.pathname.replace(/^\/([A-Za-z]:)/,'$1')],{encoding:'utf8',timeout:20000,maxBuffer:1024*1024,env:{...process.env,PYTHONUTF8:'1',PYTHONIOENCODING:'utf-8'}});
 const linhas=resultado.stdout?.trim().split(/\r?\n/);
 if(resultado.error||resultado.status!==0||JSON.stringify(linhas)!==JSON.stringify(caso.expected))throw new Error(caso.id+': '+JSON.stringify({status:resultado.status,erro:resultado.error?.message,stderr:resultado.stderr,linhas,esperado:caso.expected}));
 console.log('OK '+caso.id+': '+linhas.join(' | '));
}

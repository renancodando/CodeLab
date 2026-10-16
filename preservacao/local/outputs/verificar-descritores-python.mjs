import fs from 'node:fs/promises';
import ts from '../work/CodeLab/node_modules/typescript/lib/typescript.js';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {montarCasosDescritores} from '../work/CodeLab/tests/fixtures/python-descritores.mjs';
const raiz=new URL('../work/CodeLab/',import.meta.url);
const compilar=texto=>ts.transpileModule(texto,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const url=texto=>'data:text/javascript;base64,'+Buffer.from(texto).toString('base64');
const metadados=url(compilar(await fs.readFile(new URL('src/content/practice.ts',raiz),'utf8')));
const {practiceActivities}=await import(metadados);
const regras=compilar(await fs.readFile(new URL('src/learning/practice.ts',raiz),'utf8')).replace(/from ['"]\.\.\/content\/practice['"]/g,'from '+JSON.stringify(metadados));
const {getPracticeSolution}=await import(url(regras));
const pasta=await mkdtemp(join(tmpdir(),'codelab-descritores-'));
try{
 for(const caso of montarCasosDescritores(practiceActivities,getPracticeSolution)){
  const caminho=join(pasta,caso.id+'.py');await writeFile(caminho,caso.source);
  const resultado=spawnSync('python',[caminho],{encoding:'utf8',timeout:10000,maxBuffer:65536,env:{...process.env,PYTHONUTF8:'1'}});
  if(resultado.error||resultado.status!==0)throw new Error(caso.id+': '+(resultado.error?.message??resultado.stderr));
  const saida=resultado.stdout.replace(/\r\n/g,'\n').replace(/\n$/,'').split('\n');
  if(JSON.stringify(saida)!==JSON.stringify(caso.expected))throw new Error(caso.id+': '+JSON.stringify({saida,esperada:caso.expected}));
  console.log('OK '+caso.id);
 }
}finally{await rm(pasta,{recursive:true,force:true});}

import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import ts from '../work/CodeLab/node_modules/typescript/lib/typescript.js';
import {verificarIteradoresCsharp} from '../work/CodeLab/tests/fixtures/csharp-iteradores.mjs';
const compilar=fonte=>ts.transpileModule(fonte,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const url=fonte=>'data:text/javascript;base64,'+Buffer.from(fonte).toString('base64');
const atividadesUrl=url(compilar(await readFile(new URL('../work/CodeLab/src/content/practice.ts',import.meta.url),'utf8')));
const {practiceActivities}=await import(atividadesUrl);
const verificacao=compilar(await readFile(new URL('../work/CodeLab/src/learning/practice.ts',import.meta.url),'utf8')).replace(/from ['"]\.\.\/content\/practice['"]/g,'from '+JSON.stringify(atividadesUrl));
const {getPracticeSolution}=await import(url(verificacao));
const raiz=await mkdtemp(join(tmpdir(),'codelab-iteradores-'));
try{console.log(await verificarIteradoresCsharp(raiz,practiceActivities,getPracticeSolution)+' cenários .NET conferidos.');}
finally{await rm(raiz,{recursive:true,force:true});}

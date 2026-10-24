import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,basename} from 'node:path';
import ts from '../work/CodeLab/node_modules/typescript/lib/typescript.js';
import {verificarObjetosCsharp} from '../work/CodeLab/tests/fixtures/csharp-objetos.mjs';
const compilar=fonte=>ts.transpileModule(fonte,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const url=fonte=>'data:text/javascript;base64,'+Buffer.from(fonte).toString('base64');
const metadata=url(compilar(await readFile('src/content/practice.ts','utf8')));
const {practiceActivities}=await import(metadata);
const solucoes=url(compilar(await readFile('src/content/solucoes-sql.ts','utf8')));
const fonte=compilar(await readFile('src/learning/practice.ts','utf8')).replace(/from ['"]\.\.\/content\/practice['"]/g,'from '+JSON.stringify(metadata)).replace(/from ['"]\.\.\/content\/solucoes-sql['"]/g,'from '+JSON.stringify(solucoes));
const {getPracticeSolution}=await import(url(fonte));
const temporarios=resolve(tmpdir()),raiz=await mkdtemp(join(temporarios,'codelab-objetos-'));
try{console.log(await verificarObjetosCsharp(raiz,practiceActivities,getPracticeSolution)+' cenários reais de objetos C# aprovados.');}
finally{const alvo=resolve(raiz);if(dirname(alvo)!==temporarios||!basename(alvo).startsWith('codelab-objetos-'))throw new Error('Pasta temporária fora do limite esperado.');await rm(alvo,{recursive:true,force:true});}

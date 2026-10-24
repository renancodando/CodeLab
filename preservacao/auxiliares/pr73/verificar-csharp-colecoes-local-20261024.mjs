import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,basename} from 'node:path';
import ts from '../work/CodeLab/node_modules/typescript/lib/typescript.js';
import {verificarColecoesCsharp} from '../work/CodeLab/tests/fixtures/csharp-colecoes.mjs';
import {montarCasosLinq,verificarLinqCsharp} from '../work/CodeLab/tests/fixtures/csharp-linq.mjs';
const compilar=fonte=>ts.transpileModule(fonte,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const enderecoModulo=fonte=>'data:text/javascript;base64,'+Buffer.from(fonte).toString('base64');
const metadados=enderecoModulo(compilar(await readFile('src/content/practice.ts','utf8')));
const {practiceActivities:atividades}=await import(metadados);
const solucoes=enderecoModulo(compilar(await readFile('src/content/solucoes-sql.ts','utf8')));
const fonte=compilar(await readFile('src/learning/practice.ts','utf8')).replace(/from ['"]\.\.\/content\/practice['"]/g,'from '+JSON.stringify(metadados)).replace(/from ['"]\.\.\/content\/solucoes-sql['"]/g,'from '+JSON.stringify(solucoes));
const {getPracticeSolution:obterSolucao}=await import(enderecoModulo(fonte));
const temporarios=resolve(tmpdir()),raiz=await mkdtemp(join(temporarios,'codelab-colecoes-'));
try{const anteriores=await verificarLinqCsharp(raiz,montarCasosLinq(atividades,obterSolucao));const atuais=await verificarColecoesCsharp(raiz,atividades,obterSolucao);console.log(anteriores+' cenários anteriores e '+atuais+' cenários novos de coleções C# aprovados.');}
finally{const alvo=resolve(raiz);if(dirname(alvo)!==temporarios||!basename(alvo).startsWith('codelab-colecoes-'))throw new Error('Pasta temporária fora do limite esperado.');await rm(alvo,{recursive:true,force:true});}

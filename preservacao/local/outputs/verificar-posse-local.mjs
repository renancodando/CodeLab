import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import ts from '../work/CodeLab/node_modules/typescript/lib/typescript.js';
import {verificarPosseCpp} from '../work/CodeLab/tests/fixtures/cpp-posse.mjs';
const compilar=codigo=>ts.transpileModule(codigo,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const url=codigo=>'data:text/javascript;base64,'+Buffer.from(codigo).toString('base64');
const fonteAtividades=url(compilar(await readFile('src/content/practice.ts','utf8')));
const {practiceActivities}=await import(fonteAtividades);
const fonteCorrecao=compilar(await readFile('src/learning/practice.ts','utf8')).replace(/from ['"]\.\.\/content\/practice['"]/g,'from '+JSON.stringify(fonteAtividades));
const {getPracticeSolution}=await import(url(fonteCorrecao));
const raiz=await mkdtemp(join(tmpdir(),'codelab-posse-'));
try { console.log((await verificarPosseCpp(raiz,practiceActivities,getPracticeSolution))+' cenarios conferidos'); }
finally { await rm(raiz,{recursive:true,force:true}); }

import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import ts from '../work/CodeLab/node_modules/typescript/lib/typescript.js';
import {verificarModulosTypeScript} from '../work/CodeLab/tests/fixtures/typescript-modulos.mjs';
const raiz=new URL('../work/CodeLab/',import.meta.url);
const compilar=codigo=>ts.transpileModule(codigo,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const url=codigo=>'data:text/javascript;base64,'+Buffer.from(codigo).toString('base64');
const metadados=url(compilar(await readFile(new URL('src/content/practice.ts',raiz),'utf8')));
const {practiceActivities}=await import(metadados);
const corretor=compilar(await readFile(new URL('src/learning/practice.ts',raiz),'utf8')).replace(/from ['"]\.\.\/content\/practice['"]/g,'from '+JSON.stringify(metadados));
const {getPracticeSolution}=await import(url(corretor));
const pasta=await mkdtemp(join(tmpdir(),'codelab-modulos-'));
try{console.log('Projetos conferidos:',await verificarModulosTypeScript(pasta,practiceActivities,getPracticeSolution));}finally{await rm(pasta,{recursive:true,force:true});}

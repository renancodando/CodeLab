import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {join,resolve,sep} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import ts from '../work/CodeLab/node_modules/typescript/lib/typescript.js';
import {montarCasosCancelamento} from '../work/CodeLab/tests/fixtures/csharp-cancelamento.mjs';
const repositorio = new URL('../work/CodeLab/',import.meta.url);
const compilar = codigo => ts.transpileModule(codigo,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const url = codigo => 'data:text/javascript;base64,'+Buffer.from(codigo).toString('base64');
const metadados = url(compilar(await readFile(new URL('src/content/practice.ts',repositorio),'utf8')));
const {practiceActivities} = await import(metadados);
const codigo = compilar(await readFile(new URL('src/learning/practice.ts',repositorio),'utf8')).replace(/from ['"]\.\.\/content\/practice['"]/g,'from '+JSON.stringify(metadados));
const {getPracticeSolution} = await import(url(codigo));
const temporario = await mkdtemp(join(tmpdir(),'codelab-cancelamento-'));
try {
 await writeFile(join(temporario,'Estudo.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable></PropertyGroup></Project>');
 const executar = argumentos => {
  const resultado = spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:30000,env:{...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1'}});
  if(resultado.error || resultado.status!==0)throw new Error(resultado.error?.message ?? resultado.stdout+'\n'+resultado.stderr);
  return resultado.stdout;
 };
 for(const caso of montarCasosCancelamento(practiceActivities,getPracticeSolution)) {
  await writeFile(join(temporario,'Program.cs'),caso.source);
  executar(['build',join(temporario,'Estudo.csproj'),'--configuration','Release','--nologo','--verbosity','quiet']);
  const saida = executar([join(temporario,'bin','Release','net10.0','Estudo.dll')]).replace(/\r\n/g,'\n').trimEnd().split('\n');
  if(JSON.stringify(saida)!==JSON.stringify(caso.expected))throw new Error(caso.id+': '+JSON.stringify(saida));
  console.log(caso.id+': compilação e saída conferidas');
 }
} finally {
 if(!resolve(temporario).startsWith(resolve(tmpdir())+sep))throw new Error('Pasta temporária fora do local esperado');
 await rm(temporario,{recursive:true,force:true});
}

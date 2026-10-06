import {mkdtemp,readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import ts from 'typescript';

// Apenas exemplos publicados de autoria do projeto, em processos temporários.
// Código recebido do usuário continua restrito ao executor isolado do aplicativo.
const root=await mkdtemp(join(tmpdir(),'codelab-content-'));
let count=0;
const run=(command,args,options={})=>{
 const result=spawnSync(command,args,{encoding:'utf8',timeout:90000,maxBuffer:4*1024*1024,...options});
 if(result.error||result.status!==0)throw new Error(command+' falhou: '+(result.error?.message??result.stderr??result.stdout));
 return result.stdout;
};
try{
 for(const key of ['python','cpp','csharp','sql']){
  const output=ts.transpileModule(await readFile('src/content/deep/'+key+'.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
  const {default:course}=await import('data:text/javascript;base64,'+Buffer.from(output).toString('base64'));
  for(const lesson of course.lessons)for(const [kind,code] of [['exemplo',lesson.code],['solucao',lesson.solution]]){
   const name=lesson.id+'-'+kind,folder=join(root,name);await mkdir(folder);
   if(key==='python'){
    const path=join(folder,'main.py');await writeFile(path,code);run(process.env.PYTHON??'python3',[path]);
   }else if(key==='cpp'){
    const path=join(folder,'main.cpp'),binary=join(folder,'programa');await writeFile(path,code);
    run('g++',['-std=c++20','-Wall','-Wextra','-Wpedantic','-pthread',path,'-o',binary]);run(binary,[]);
   }else if(key==='csharp'){
    await writeFile(join(folder,'Example.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable></PropertyGroup></Project>');
    await writeFile(join(folder,'Program.cs'),code);
    run('dotnet',['run','--project',join(folder,'Example.csproj'),'--configuration','Release'],{env:{...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1'}});
   }else{
    const path=join(folder,'main.sql');await writeFile(path,code);
    run('psql',['--no-psqlrc','--set','ON_ERROR_STOP=1','--file',path]);
   }
   count++;console.log('OK '+name);
  }
 }
 console.log(count+' exemplos e soluções externos compilados/executados.');
}finally{await rm(root,{recursive:true,force:true});}

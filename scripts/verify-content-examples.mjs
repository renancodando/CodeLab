import {mkdtemp,readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import ts from 'typescript';
import {verificarBancadaGit} from '../tests/fixtures/git-bancada.mjs';
import {montarCasosCancelamento} from '../tests/fixtures/csharp-cancelamento.mjs';
import {montarCasosCsv} from '../tests/fixtures/python-csv.mjs';
import {montarCasosDescritores} from '../tests/fixtures/python-descritores.mjs';
import {verificarModulosTypeScript} from '../tests/fixtures/typescript-modulos.mjs';
import {verificarConceitosCpp} from '../tests/fixtures/cpp-conceitos.mjs';
import {verificarAusenciasSql} from '../tests/fixtures/sql-null.mjs';
import {verificarIteradoresCsharp} from '../tests/fixtures/csharp-iteradores.mjs';

// Somente exemplos publicados de autoria do projeto, em recursos temporários.
// Código recebido do usuário continua restrito ao executor isolado do aplicativo.
const root=await mkdtemp(join(tmpdir(),'codelab-content-'));
let count=0;
const run=(command,args,options={})=>{
 const result=spawnSync(command,args,{encoding:'utf8',timeout:90000,maxBuffer:4*1024*1024,...options});
 if(result.error||result.status!==0)throw new Error(command+' falhou: '+(result.error?.message??result.stderr??result.stdout));
 return result.stdout;
};
const lines=output=>output.replace(/\r\n/g,'\n').replace(/\n$/,'').split('\n');
try{
 for(const key of ['python','cpp','csharp','sql','typescript']){
  const output=ts.transpileModule(await readFile('src/content/deep/'+key+'.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
  const {default:course}=await import('data:text/javascript;base64,'+Buffer.from(output).toString('base64'));
  for(const lesson of course.lessons){
   const samples=[
    {kind:'exemplo',code:lesson.code,expected:lesson.expectedOutput},
    {kind:'solucao',code:lesson.solution,expected:lesson.solutionOutput},
    ...(lesson.practices??[]).filter(p=>!p.postgresScenario).map(p=>({kind:'problema-'+p.id,code:p.solution,expected:p.expectedOutput}))
   ];
   for(const {kind,code,expected} of samples){
    const name=lesson.id+'-'+kind,folder=join(root,name);await mkdir(folder);
    let actual;
    if(key==='python'){
     const path=join(folder,'main.py');await writeFile(path,code);actual=run(process.env.PYTHON??'python3',[path]);
    }else if(key==='cpp'){
     const path=join(folder,'main.cpp'),binary=join(folder,'programa');await writeFile(path,code);
     run('g++',['-std=c++20','-Wall','-Wextra','-Wpedantic','-pthread',path,'-o',binary]);actual=run(binary,[]);
    }else if(key==='csharp'){
     await writeFile(join(folder,'Example.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable></PropertyGroup></Project>');
     await writeFile(join(folder,'Program.cs'),code);
     const env={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1'};
     run('dotnet',['build',join(folder,'Example.csproj'),'--configuration','Release','--nologo','--verbosity','quiet'],{env});
     actual=run('dotnet',[join(folder,'bin','Release','net10.0','Example.dll')],{env});
    }else if(key==='typescript'){
     // A verificação semântica strict de todos os trechos acontece nos testes de unidade.
     const js=ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
     const path=join(folder,'main.mjs');await writeFile(path,js);actual=run(process.execPath,[path]);
    }else{
     const path=join(folder,'main.sql');await writeFile(path,code);
     actual=run('psql',['--no-psqlrc','--set','ON_ERROR_STOP=1','--no-align','--tuples-only','--quiet','--file',path]);
    }
    if(expected&&JSON.stringify(lines(actual))!==JSON.stringify(expected))
     throw new Error(name+' saída divergente: '+JSON.stringify({expected,actual:lines(actual)}));
    count++;console.log('OK '+name+(expected?' — saída conferida':''));
   }
  }
 }

 // Confirma as saídas usadas nas atividades offline com ferramentas reais no CI.
 const compileContent=source=>ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
 const asUrl=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
 const metadataUrl=asUrl(compileContent(await readFile('src/content/practice.ts','utf8')));
 const {practiceActivities}=await import(metadataUrl);
 const practiceSource=compileContent(await readFile('src/learning/practice.ts','utf8')).replace(/from ['"]\.\.\/content\/practice['"]/g,'from '+JSON.stringify(metadataUrl));
 const {getPracticeSolution}=await import(asUrl(practiceSource));
 const cenariosModulos=await verificarModulosTypeScript(root,practiceActivities,getPracticeSolution);
 const cenariosConceitos=await verificarConceitosCpp(root,practiceActivities,getPracticeSolution);
 const cenariosAusencias=await verificarAusenciasSql(root,practiceActivities,getPracticeSolution);
 const cenariosIteradores=await verificarIteradoresCsharp(root,practiceActivities,getPracticeSolution);
 const examples=[
  ...montarCasosDescritores(practiceActivities,getPracticeSolution),
  ...montarCasosCsv(practiceActivities, getPracticeSolution),
  ...montarCasosCancelamento(practiceActivities, getPracticeSolution),
  {id:'cpp-prever-intervalo',key:'cpp',source:'#include <iostream>\n#include <vector>\nint main(){\n'+practiceActivities.find(a=>a.id==='cpp-prever-intervalo').code+'\n}',expected:['6,2']},
  {id:'cpp-ordenar-erase',key:'cpp',source:'#include <cassert>\n#include <iostream>\n#include <vector>\nint main(){\nstd::vector<int> dados{0,0,1,0,2,0};\n'+getPracticeSolution('cpp-ordenar-erase')+'\nassert((dados==std::vector<int>{1,2}));\nstd::cout << "zeros conferidos\\n";\n}',expected:['zeros conferidos']},
  {id:'cpp-reobter-reserva',key:'cpp',source:'#include <cassert>\n#include <cstddef>\n#include <iostream>\n#include <stdexcept>\n#include <vector>\nint main(){\nstd::vector<int> dados{4,6,8};\nconst std::size_t indice=1;\nconst auto capacidade=dados.capacity();\nif(capacidade==dados.max_size())throw std::length_error("capacidade máxima");\ndados.reserve(capacidade+1);\n'+getPracticeSolution('cpp-reobter-reserva')+'\nassert(valor==6 && dados.size()==3);\nstd::cout << valor << " " << dados.size() << "\\n";\n}',expected:['6 3']},
  {id:'py-prever-esgotamento',key:'python',source:practiceActivities.find(a=>a.id==='py-prever-esgotamento').code,expected:['0','[1, 2]','[]']},
  {id:'py-ordenar-lote',key:'python',source:'from itertools import islice\n'+getPracticeSolution('py-ordenar-lote')+'\nleituras=[]\ndef fonte():\n    for numero in range(5):\n        leituras.append(numero)\n        yield numero\norigem=fonte()\nassert primeiro_lote(origem,2)==(0,1)\nassert leituras==[0,1]\nassert next(origem)==2\nassert primeiro_lote(iter([]),2)==()\nassert primeiro_lote(iter([None,0]),3)==(None,0)\nprint("consumo limitado")',expected:['consumo limitado']},
  {id:'py-fechar-consumo',key:'python',source:'from contextlib import closing\neventos=[]\ndef produzir():\n    try:\n        eventos.append("leu")\n        yield 1\n        eventos.append("extra")\n        yield 2\n    finally:\n        eventos.append("fechou")\nfonte=produzir()\ndef processar(valor):\n    assert valor==1\n    raise OSError("estudo")\ntry:\n'+getPracticeSolution('py-fechar-consumo').split('\n').map(line=>'    '+line).join('\n')+'\nexcept OSError as erro:\n    assert str(erro)=="estudo"\nelse:\n    raise AssertionError("erro suprimido")\nassert eventos==["leu","fechou"]\nprint(eventos)',expected:["['leu', 'fechou']"]},
  {id:'py-prever-range',key:'python',source:practiceActivities.find(a=>a.id==='py-prever-range').code,expected:['0','2','4']},
  {id:'cs-prever-decimal',key:'csharp',source:'using System;\n'+practiceActivities.find(a=>a.id==='cs-prever-decimal').code,expected:['True']},
  {id:'cpp-prever-referencia',key:'cpp',source:'#include <iostream>\nint main(){\n'+practiceActivities.find(a=>a.id==='cpp-prever-referencia').code+'\n}',expected:['7,7']},
  {id:'py-ordenar-default',key:'python',source:getPracticeSolution('py-ordenar-default')+'\nprimeira=adicionar("a")\nsegunda=adicionar("b")\nfornecida=["x"]\nassert primeira == ["a"] and segunda == ["b"] and primeira is not segunda\nassert adicionar("y", fornecida) is fornecida and fornecida == ["x", "y"]\nprint("isoladas")',expected:['isoladas']},
  {id:'cs-ordenar-using',key:'csharp',source:'using System;\n'+getPracticeSolution('cs-ordenar-using')+'\nsealed class Recurso : IDisposable { public void Usar(){Console.WriteLine("usou");} public void Dispose(){Console.WriteLine("descartou");} }',expected:['usou','descartou','fim']},
  {id:'cpp-ordenar-raii',key:'cpp',source:'#include <iostream>\n#include <memory>\nint main(){\n'+getPracticeSolution('cpp-ordenar-raii')+'\n}',expected:['7','fim']}
 ];
 for(const sample of examples){
  const folder=join(root,'offline-'+sample.id);await mkdir(folder);let actual;
  if(sample.key==='python'){const path=join(folder,'main.py');await writeFile(path,sample.source);actual=run(process.env.PYTHON??'python3',[path]);}
  else if(sample.key==='cpp'){const path=join(folder,'main.cpp'),binary=join(folder,'programa');await writeFile(path,sample.source);run('g++',['-std=c++20','-Wall','-Wextra','-Wpedantic',path,'-o',binary]);actual=run(binary,[]);}
  else{await writeFile(join(folder,'Example.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable></PropertyGroup></Project>');await writeFile(join(folder,'Program.cs'),sample.source);const env={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1'};run('dotnet',['build',join(folder,'Example.csproj'),'--configuration','Release','--nologo','--verbosity','quiet'],{env});actual=run('dotnet',[join(folder,'bin','Release','net10.0','Example.dll')],{env});}
  if(JSON.stringify(lines(actual))!==JSON.stringify(sample.expected))throw new Error(sample.id+' saída divergente: '+JSON.stringify({expected:sample.expected,actual:lines(actual)}));
  count++;console.log('OK atividade offline '+sample.id+' — saída conferida no CI');
 }
 // Interoperabilidade: o ZIP criado no navegador é lido pelo zipfile da biblioteca padrão.
 const projectDataUrl=asUrl(compileContent(await readFile('src/content/project-paths.ts','utf8')));
 const projectsUrl=asUrl(compileContent(await readFile('src/learning/projects.ts','utf8')).replace(/from ['"]\.\.\/content\/project-paths['"]/g,'from '+JSON.stringify(projectDataUrl)));
 const archiveUrl=asUrl(compileContent(await readFile('src/learning/project-archive.ts','utf8')).replace(/from ['"]\.\/projects['"]/g,'from '+JSON.stringify(projectsUrl)));
 const {createProjectArchive}=await import(archiveUrl),archivePath=join(root,'projeto.zip');
 await writeFile(archivePath,new Uint8Array(createProjectArchive({'src/main.py':'print("ação")\n','README.md':'Projeto original'})));
 const zipResult=run(process.env.PYTHON??'python3',['-c','import sys, zipfile; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; assert z.namelist()==["src/main.py","README.md"]; assert z.read("src/main.py").decode("utf-8")==\'print("ação")\\n\'; assert z.read("README.md").decode("utf-8")=="Projeto original"; print("ZIP interoperável")',archivePath]);
 console.log(zipResult.trim());


 await verificarBancadaGit(root);
 console.log(count+' exemplos e soluções externos compilados/executados.');
 console.log(cenariosModulos+' projetos TypeScript conferidos, incluindo diagnósticos e falhas esperadas de resolução.');
 console.log(cenariosConceitos+' cenários C++20 conferidos, incluindo falhas esperadas de instanciação e ambiguidade.');
 console.log(cenariosAusencias+' cenários PostgreSQL conferidos para ausência, restrições e correspondência.');
 console.log(cenariosIteradores+' cenários .NET conferidos para suspensão, descarte e materialização.');
}finally{await rm(root,{recursive:true,force:true});}

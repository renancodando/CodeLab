import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';

export function montarCasosIteradores(atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const quebrado=atividade('cs-descartar-percurso').code;
 const fronteira=quebrado.indexOf('var percurso =');assert(fronteira>0);
 const produtor=quebrado.slice(0,fronteira);
 const correto=obterSolucao('cs-descartar-percurso');
 const materializar=atividade('cs-materializar-consulta').code;
 const casos=[
  {id:'avanco-suspenso',codigo:atividade('cs-prever-percurso').code,saida:['0','True','1|1','True','2|2','2']},
  {id:'recurso-abandonado',codigo:quebrado,saida:['10','1']},
  {id:'descarte-precoce',codigo:produtor+correto,saida:['10','0']},
  {id:'erro-do-consumidor',codigo:produtor.replace('Console.WriteLine(valor);','throw new InvalidOperationException("processamento");')+`
try {
${correto}
    throw new Exception("erro suprimido");
} catch (InvalidOperationException erro) when (erro.Message == "processamento") {
    Console.WriteLine("erro preservado");
}
if (ativos != 0) throw new Exception("recurso ativo após erro");
Console.WriteLine(ativos);`,saida:['erro preservado','0']},
  {id:'origem-vazia',codigo:produtor.replace('yield return 10; yield return 20;','yield break;')+correto,saida:['0']},
  {id:'array-materializado',codigo:materializar.replace('____',obterSolucao('cs-materializar-consulta')),saida:['2,4','2,4','4']},
  {id:'lista-materializada',codigo:materializar.replace('____','ToList()'),saida:['2,4','2,4','4']},
  {id:'consulta-repetida',codigo:materializar.replace('consulta.____','consulta'),saida:['2,4','2,4','8']},
  {id:'filtro-vazio-materializado',codigo:materializar.replace('____','ToArray()').replace('valor % 2 == 0','valor > 8'),saida:['','','4']},
  {id:'percursos-independentes',codigo:atividade('cs-prever-percurso').code+`
using var outro = sequencia.GetEnumerator();
if (!outro.MoveNext() || outro.Current != 1 || produzidos != 3)
    throw new Exception("a nova enumeração não começou na origem");
Console.WriteLine($"{outro.Current}|{produzidos}");`,saida:['0','True','1|1','True','2|2','2','1|3']}
 ];
 for(const caso of casos)assert(!caso.codigo.includes('____'),caso.id);
 return casos;
}

export async function verificarIteradoresCsharp(raiz,atividades,obterSolucao){
 const casos=montarCasosIteradores(atividades,obterSolucao);
 const pasta=join(raiz,'csharp-iteradores');await mkdir(pasta);
 await writeFile(join(pasta,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
 await writeFile(join(pasta,'Iteradores.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup></Project>');
 const funcoes=casos.map((caso,indice)=>`static void Cenario${indice}() {\n${caso.codigo}\n}`).join('\n');
 const chamadas=casos.map((caso,indice)=>`Conferir(${JSON.stringify(caso.id)}, Cenario${indice}, ${JSON.stringify(caso.saida.join('\n')+'\n')});`).join('\n');
 const codigo=`using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
${chamadas}
static void Conferir(string nome, Action executar, string esperada) {
    var original = Console.Out;
    using var captura = new StringWriter();
    try { Console.SetOut(captura); executar(); }
    finally { Console.SetOut(original); }
    var obtida = captura.ToString().Replace("\\r\\n", "\\n");
    if (obtida != esperada) throw new Exception(nome + ": saída divergente: " + obtida);
    Console.WriteLine("OK iteradores C# " + nome);
}
${funcoes}`;
 await writeFile(join(pasta,'Program.cs'),codigo);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{
  const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});
  if(resultado.error||resultado.status!==0)throw new Error('Iteradores C#: '+(resultado.error?.message??resultado.stderr)+resultado.stdout);
  return resultado.stdout;
 };
 executar(['build',join(pasta,'Iteradores.csproj'),'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')]);
 const saida=executar([join(pasta,'bin','Release','net10.0','Iteradores.dll')]);
 process.stdout.write(saida);
 assert.equal(saida.trim().split(/\r?\n/).length,casos.length);
 return casos.length;
}

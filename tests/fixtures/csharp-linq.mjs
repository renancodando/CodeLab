import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';

export function montarCasosLinq(atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const agrupamento=atividade('cs-agrupar-chaves-repetidas');
 const declaracao=agrupamento.code.slice(0,agrupamento.code.indexOf('\nvar grupos ='));
 const retorno='return palavras.ToDictionary(palavra => palavra.Length, palavra => new List<string> { palavra });';
 assert(declaracao.includes(retorno));
 const correto=declaracao.replace(retorno,obterSolucao(agrupamento.id));
 const preencher=atividade('cs-copiar-linhas-array');
 const casos=[
  {id:'igualdade-definida',codigo:atividade('cs-prever-igualdade-conjunto').code,saida:['2','True','False']},
  {id:'igualdade-sensivel',codigo:atividade('cs-prever-igualdade-conjunto').code.replace('StringComparer.OrdinalIgnoreCase','StringComparer.Ordinal'),saida:['3','False','True']},
  {id:'chave-repetida',codigo:declaracao+'\ntry { Agrupar(new[] { "a", "bb", "c" }); throw new Exception("chave repetida aceita"); } catch (ArgumentException) { Console.WriteLine("chave repetida"); }',saida:['chave repetida']},
  {id:'grupos-ordenados-independentes',codigo:correto+`
var entrada = new[] { "a", "bb", "c", "bb", "" };
var antes = entrada.ToArray();
var grupos = Agrupar(entrada);
if (string.Join(",", grupos[1]) != "a,c" || string.Join(",", grupos[2]) != "bb,bb" || grupos[0].Count != 1 || grupos[0][0] != "") throw new Exception("partição ou ordem");
if (Agrupar(Array.Empty<string>()).Count != 0) throw new Exception("vazio");
if (ReferenceEquals(grupos[1], grupos[2])) throw new Exception("listas compartilhadas");
grupos[1].Add("d");
if (grupos[2].Count != 2 || !entrada.SequenceEqual(antes)) throw new Exception("mutação atravessou grupo");
var outro = Agrupar(entrada);
if (outro[1].Count != 2 || ReferenceEquals(outro[1], grupos[1])) throw new Exception("chamadas compartilhadas");
Console.WriteLine("grupos preservados");`,saida:['grupos preservados']},
  {id:'deduplicacao-perde-palavra',codigo:declaracao.replace(retorno,agrupamento.options.find(opcao=>opcao.id==='descartar').text)+'\nvar grupos = Agrupar(new[] { "a", "bb", "c", "bb" });\nConsole.WriteLine(string.Join(",", grupos[1]));\nConsole.WriteLine(grupos[2].Count);',saida:['a','1']},
  {id:'lista-reutilizada-mistura-grupos',codigo:declaracao.replace(retorno,agrupamento.options.find(opcao=>opcao.id==='reutilizar').text)+'\nvar grupos = Agrupar(new[] { "a", "bb", "c", "bb" });\nConsole.WriteLine(ReferenceEquals(grupos[1], grupos[2]));\nConsole.WriteLine(grupos[1].Count);',saida:['True','4']},
  {id:'copia-interna',codigo:preencher.code.replace('____',obterSolucao(preencher.id)),saida:['1','9']},
  {id:'copia-tipo-explicito',codigo:preencher.code.replace('____','linha.ToArray<int>()'),saida:['1','9']},
  {id:'copia-apenas-externa',codigo:preencher.code.replace('____','linha'),saida:['9','9']},
  {id:'linhas-irregulares-e-alias',codigo:`
static int[][] Copiar(int[][] origem) => origem.Select(linha => ${obterSolucao(preencher.id)}).ToArray();
var compartilhada = new[] { 1, 2 };
var origem = new[] { compartilhada, Array.Empty<int>(), compartilhada, new[] { -3 } };
var copia = Copiar(origem);
if (Copiar(Array.Empty<int[]>()).Length != 0 || copia.Length != 4 || copia[1].Length != 0 || copia[3][0] != -3) throw new Exception("forma ou vazio");
copia[0][0] = 9;
if (origem[0][0] != 1 || copia[2][0] != 1 || ReferenceEquals(copia, origem)) throw new Exception("alias preservado");
var outra = Copiar(origem);
outra[3][0] = 7;
if (copia[3][0] != -3 || origem[3][0] != -3) throw new Exception("chamadas compartilhadas");
Console.WriteLine("cópia isolada");`,saida:['cópia isolada']}
 ];
 for(const caso of casos)assert(!caso.codigo.includes('____'),caso.id);
 return casos;
}

export async function verificarLinqCsharp(raiz,casos){
 const pasta=join(raiz,'csharp-linq');await mkdir(pasta);
 await writeFile(join(pasta,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
 await writeFile(join(pasta,'Linq.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup></Project>');
 const funcoes=casos.map((caso,indice)=>`static void Cenario${indice}() {\n${caso.codigo.replace(/^using [\w.]+;\r?\n/gm,'')}\n}`).join('\n');
 const chamadas=casos.map((caso,indice)=>`Conferir(${JSON.stringify(caso.id)}, Cenario${indice}, ${JSON.stringify(caso.saida.length?caso.saida.join('\n')+'\n':'')});`).join('\n');
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
    Console.WriteLine("OK LINQ C# " + nome);
}
${funcoes}`;
 await writeFile(join(pasta,'Program.cs'),codigo);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});if(resultado.error||resultado.status!==0)throw new Error('LINQ C#: '+(resultado.error?.message??resultado.stderr)+resultado.stdout);return resultado.stdout;};
 executar(['build',join(pasta,'Linq.csproj'),'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')]);
 const saida=executar([join(pasta,'bin','Release','net10.0','Linq.dll')]);process.stdout.write(saida);assert.equal(saida.trim().split(/\r?\n/).length,casos.length);return casos.length;
}

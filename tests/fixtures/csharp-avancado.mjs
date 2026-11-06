import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';

export async function verificarCsharpAvancado(raiz,atividades,obterSolucao){
 const atividade=id=>{const a=atividades.find(a=>a.id===id);assert(a,id);return a;};
 const texto=await readFile('src/content/deep/csharp.ts','utf8'),inicio=texto.indexOf('{',texto.indexOf('export default'));
 const curso=JSON.parse(texto.slice(inicio,texto.lastIndexOf('}')+1));
 const aula=curso.lessons.find(a=>a.id==='cs-objetos-contratos');assert(aula);
 const previsao=atividade('cs-contratos-prever-copia'),eventos=atividade('cs-contratos-desinscrever-evento');
 const casos=[
  {id:'politica-original',codigo:aula.code,saida:'900\n'},
  {id:'formatadores-originais',codigo:aula.solution,saida:''},
  {id:'record-compartilha-lista',codigo:previsao.code,saida:obterSolucao(previsao.id)+'\n'},
  {id:'record-com-mesmo-nome',codigo:previsao.code.replace('with {Nome="B"}','with {}'),saida:'Lia,Ana\nTrue\nTrue\n'}
 ];
 const conferirEventos=`var fonte = new Fonte();
var primeiro = new Assinante(fonte);
var segundo = new Assinante(fonte);
fonte.Emitir();
if(primeiro.Contagem!=1 || segundo.Contagem!=1)throw new InvalidOperationException("contrato-assinante");
primeiro.Dispose();
fonte.Emitir();
if(primeiro.Contagem!=1 || segundo.Contagem!=2)throw new InvalidOperationException("contrato-assinante");
primeiro.Dispose();
fonte.Emitir();
if(primeiro.Contagem!=1 || segundo.Contagem!=3)throw new InvalidOperationException("contrato-assinante");
segundo.Dispose();
fonte.Emitir();
if(primeiro.Contagem!=1 || segundo.Contagem!=3)throw new InvalidOperationException("contrato-assinante");
`;
 const errado='public void Dispose() { fonte.Sinal -= () => Contagem++; }';assert(eventos.code.includes(errado));
 for(const opcao of eventos.options)casos.push({id:'evento-'+opcao.id,codigo:conferirEventos+eventos.code.replace(errado,opcao.text),saida:'',erro:opcao.id==='mesma-instancia'?undefined:'contrato-assinante'});
 const conferirCopia=`foreach(var iniciais in new[]{Array.Empty<string>(),new[]{"Lia"},new[]{"Ana","Lia","Ana","ação"}}){
 var nomes = new List<string>(iniciais);
 var primeira = Copiar(nomes);
 var segunda = Copiar(nomes);
 if(!primeira.SequenceEqual(iniciais) || !segunda.SequenceEqual(iniciais) || !nomes.SequenceEqual(iniciais))throw new InvalidOperationException("contrato-snapshot");
 nomes.Add("Novo");
 if(!primeira.SequenceEqual(iniciais) || !segunda.SequenceEqual(iniciais))throw new InvalidOperationException("contrato-snapshot");
 if(iniciais.Length>0){
  if(ReferenceEquals(primeira,segunda))throw new InvalidOperationException("contrato-snapshot");
  primeira[0]="Alterado";
  if(nomes[0]!=iniciais[0] || segunda[0]!=iniciais[0])throw new InvalidOperationException("contrato-snapshot");
 }
}
`;
 for(const [indice,expressao] of ['nomes.ToArray()','[.. nomes]','Enumerable.ToArray(nomes)','System.Linq.Enumerable.ToArray(nomes)'].entries())casos.push({id:'snapshot-'+indice,codigo:'static string[] Copiar(List<string> nomes) => '+expressao+';\n'+conferirCopia,saida:''});
 for(const [indice,expressao] of ['Array.Empty<string>()','new string[nomes.Count]','nomes.AsEnumerable().Reverse().ToArray()'].entries())casos.push({id:'snapshot-defeituoso-'+indice,codigo:'static string[] Copiar(List<string> nomes) => '+expressao+';\n'+conferirCopia,saida:'',erro:'contrato-snapshot'});
 const runtime=curso.lessons.find(a=>a.id==='cs-runtime-avancado');assert(runtime);
 const views=atividade('cs-runtime-prever-views'),aluguel=atividade('cs-runtime-encerrar-lease');
 casos.push({id:'runtime-exemplo-original',codigo:runtime.code,saida:'28\n20\n'},{id:'runtime-solucao-original',codigo:runtime.solution,saida:''});
 casos.push({id:'views-e-snapshot',codigo:views.code,saida:obterSolucao(views.id)+'\n'},{id:'outra-faixa',codigo:views.code.replace('AsSpan(1,2)','AsSpan(2,2)').replace('origem[1]','origem[2]'),saida:'40\n6\n40\n'});
 const poolControlado=`sealed class PoolControlado : ArrayPool<byte> {
 readonly byte[] buffer=new byte[32];
 public int Alugueis {get;private set;}
 public int Devolucoes {get;private set;}
 public bool Limpou {get;private set;}
 public override byte[] Rent(int minimo) {
  if(minimo>buffer.Length)throw new ArgumentOutOfRangeException(nameof(minimo));
  Alugueis++;Array.Fill(buffer,(byte)127);return buffer;
 }
 public override void Return(byte[] array,bool clearArray=false) {
  if(!ReferenceEquals(array,buffer))throw new InvalidOperationException("buffer desconhecido");
  Devolucoes++;Limpou=clearArray;if(clearArray)Array.Clear(array);
 }
}`;
 const conferirAluguel=`foreach(var entrada in new[]{Array.Empty<byte>(),new byte[]{0,2,0,255},Enumerable.Range(0,20).Select(i=>(byte)i).ToArray()}){
 var pool=new PoolControlado();
 var resposta=CopiarBuffer(entrada,pool);
 if(pool.Alugueis!=1 || pool.Devolucoes!=1 || !pool.Limpou || !resposta.Span.SequenceEqual(entrada))throw new InvalidOperationException("contrato-buffer");
 var segunda=CopiarBuffer(new byte[]{9,8},pool);
 if(pool.Alugueis!=2 || pool.Devolucoes!=2 || !segunda.Span.SequenceEqual(new byte[]{9,8}) || !resposta.Span.SequenceEqual(entrada))throw new InvalidOperationException("contrato-buffer");
}
`;
 for(const opcao of aluguel.options)casos.push({id:'aluguel-'+opcao.id,codigo:aluguel.code.replace('return buffer.AsMemory(0,entrada.Length);','return '+opcao.text+';')+'\n'+conferirAluguel+poolControlado,saida:'',erro:opcao.id==='snapshot'?undefined:'contrato-buffer'});
 const conferirSoma=`foreach(var caso in new (int[] Valores,int Esperada)[]{(Array.Empty<int>(),0),(new[]{0},0),(new[]{1,-2,3},2),(new[]{int.MaxValue,-int.MaxValue,int.MaxValue},int.MaxValue),(new[]{int.MinValue,1},int.MinValue+1)}){
 var antes=caso.Valores.ToArray();
 if(Somar(caso.Valores)!=caso.Esperada || !caso.Valores.SequenceEqual(antes))throw new InvalidOperationException("contrato-soma");
}
foreach(var valores in new[]{new[]{int.MaxValue,1},new[]{int.MinValue,-1},new[]{int.MaxValue,1,-1},new[]{int.MinValue,-1,1}}){
 bool rejeitou=false;
 try{Somar(valores);}catch(OverflowException){rejeitou=true;}
 if(!rejeitou)throw new InvalidOperationException("contrato-soma");
}
int[] origem={9,2,3,8};
if(Somar(origem.AsSpan(1,2))!=5 || !origem.SequenceEqual(new[]{9,2,3,8}))throw new InvalidOperationException("contrato-soma");
`;
 for(const [indice,expressao] of ['checked(total + valor)','checked(valor + total)','total + valor','checked(total) + valor'].entries())casos.push({id:'soma-'+indice,codigo:atividade('cs-runtime-somar-checked').code.replace('____',expressao)+'\n'+conferirSoma,saida:'',erro:indice<2?undefined:'contrato-soma'});
 casos.push({id:'soma-larga-oculta-intermediario',codigo:'static int Somar(ReadOnlySpan<int> valores){long total=0;foreach(int valor in valores)total+=valor;return checked((int)total);}\n'+conferirSoma,saida:'',erro:'contrato-soma'});
 const pasta=join(raiz,'csharp-avancado');await mkdir(pasta);
 await writeFile(join(pasta,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
 await writeFile(join(pasta,'Avancado.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><LangVersion>14.0</LangVersion><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup></Project>');
 const tipos=codigo=>codigo.search(/^(?:(?:public|internal|sealed|abstract|static|partial)\s+)*(?:class|interface|record|struct)\s/m);
 const namespaces=casos.map((caso,i)=>{
  const codigo=caso.codigo.replace(/^using [^\r\n]+;\r?\n/gm,''),posicao=tipos(codigo),acoes=posicao<0?codigo:codigo.slice(0,posicao),declaracoes=posicao<0?'':codigo.slice(posicao);
  return 'namespace Cenario'+i+' { internal static class Programa { public static void Executar(){\n'+acoes+'\n} }\n'+declaracoes+'\n}';
 }).join('\n');
 const chamadas=casos.map((c,i)=>'Conferir('+JSON.stringify(c.id)+', Cenario'+i+'.Programa.Executar, '+JSON.stringify(c.saida)+', '+(c.erro?JSON.stringify(c.erro):'null')+');').join('\n');
 const programa=`using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Globalization;
using System.Buffers;
CultureInfo.CurrentCulture=CultureInfo.InvariantCulture;
@CHAMADAS@
static void Conferir(string nome, Action executar, string esperada, string? erroEsperado){
 var original=Console.Out;
 using var captura=new StringWriter();
 Exception? falha=null;
 try{Console.SetOut(captura);executar();}catch(Exception erro){falha=erro;}finally{Console.SetOut(original);}
 if(erroEsperado is null){
  if(falha is not null)throw new Exception(nome+": falha inesperada",falha);
  if(captura.ToString().Replace("\\r\\n","\\n")!=esperada)throw new Exception(nome+": saída divergente: "+captura.ToString());
 }else if(falha is not InvalidOperationException || falha.Message!=erroEsperado)throw new Exception(nome+": defeito não foi detectado",falha);
 Console.WriteLine("OK C# avançado "+nome);
}
`.replace('@CHAMADAS@',chamadas)+namespaces;
 await writeFile(join(pasta,'Program.cs'),programa);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{const r=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});if(r.error)throw r.error;assert.equal(r.status,0,r.stdout+r.stderr);return r.stdout;};
 executar(['build',join(pasta,'Avancado.csproj'),'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')]);
 const saida=executar([join(pasta,'bin','Release','net10.0','Avancado.dll')]);assert.equal(saida.trim().split(/\r?\n/).length,casos.length);process.stdout.write(saida);
 return casos.length;
}
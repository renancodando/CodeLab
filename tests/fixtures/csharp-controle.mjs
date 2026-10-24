import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';
import ts from 'typescript';

export async function verificarControleCsharp(raiz,atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(atividade=>atividade.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('cs-controle-prever-interrupcoes'),diagnostico=atividade('cs-controle-corrigir-limite'),reconstrucao=atividade('cs-controle-reconstruir-retorno');
 const fonte=ts.createSourceFile('curriculum.ts',await readFile('src/content/curriculum.ts','utf8'),ts.ScriptTarget.ESNext,true);
 let aula;
 function visitar(no){
  if(ts.isArrayLiteralExpression(no)&&no.elements.length>0&&ts.isStringLiteral(no.elements[0])&&no.elements[0].text==='csharp-controle')aula=no;
  ts.forEachChild(no,visitar);
 }
 visitar(fonte);assert(aula&&ts.isStringLiteralLike(aula.elements[3])&&ts.isStringLiteralLike(aula.elements[5]),'exemplo e solução originais precisam ser literais');
 const metodoAte=obterSolucao(diagnostico.id).split('\nConsole.WriteLine')[0],metodoPares=obterSolucao(reconstrucao.id);
 const alternativa=['metodo','total','percorrer','filtrar','acumular','fechar-metodo','retornar','fechar-laco'];
 const codigoAlternativo=alternativa.map(id=>reconstrucao.lines.find(linha=>linha.id===id).code).join('\n');
 const conferirPares=`
var entradas = new[] { Array.Empty<int>(), new[] { 1, 3, -5 }, new[] { -4, -3, 0, 2 }, new[] { 2, 2, 0, 6 }, new[] { int.MinValue, 1, 2 } };
var esperadas = new[] { 0, 0, -2, 10, int.MinValue + 2 };
for (int indice = 0; indice < entradas.Length; indice++) {
    var antes = (int[])entradas[indice].Clone();
    if (SomarPares(entradas[indice]) != esperadas[indice]) throw new Exception("paridade ou borda");
    if (!entradas[indice].SequenceEqual(antes)) throw new Exception("entrada alterada");
}
if (SomarPares(new[] { 2 }) != 2 || SomarPares(Array.Empty<int>()) != 0 || SomarPares(new[] { -2 }) != -2) throw new Exception("chamadas dependentes");
Console.WriteLine("pares conferidos");`;
 const casos=[
  {id:'exemplo-original',codigo:aula.elements[3].text,saida:['10']},
  {id:'gabarito-original-ehpar',codigo:aula.elements[5].text,saida:['True','False','True']},
  {id:'interrupcoes-previstas',codigo:previsao.code,saida:['5','0','0']},
  {id:'zero-ignorado-visita-sufixo',codigo:previsao.code.replace('numero == 0) break','numero == 0) continue'),saida:['14','8','0']},
  {id:'negativo-encerra-cedo',codigo:previsao.code.replace('numero < 0) continue','numero < 0) break'),saida:['2','0','0']},
  {id:'limite-excluido',codigo:diagnostico.code,saida:['0','0','6']},
  {id:'limite-inclusivo',codigo:obterSolucao(diagnostico.id),saida:['0','1','10']},
  ...[['extra',['1','3','15']],['igual',['0','1','0']]].map(([id,saida])=>({id:'condicao-'+id,codigo:diagnostico.code.replace('i < limite',diagnostico.options.find(opcao=>opcao.id===id).text),saida})),
  {id:'intervalo-inclusivo-completo',codigo:metodoAte+`
for (int limite = 0; limite <= 1000; limite++) {
    if (SomarAte(limite) != limite * (limite + 1) / 2) throw new Exception("limite incorreto");
}
if (SomarAte(1000) != 500500 || SomarAte(0) != 0 || SomarAte(1) != 1) throw new Exception("estado de outra chamada");
Console.WriteLine("limites conferidos");`,saida:['limites conferidos']},
  {id:'pares-escopo-e-chamadas',codigo:metodoPares+conferirPares,saida:['pares conferidos']},
  {id:'chaves-sem-depender-da-indentacao',codigo:codigoAlternativo+conferirPares,saida:['pares conferidos']},
  {id:'filtro-invertido-soma-impares',codigo:metodoPares.replace('numero % 2 != 0','numero % 2 == 0')+'\nConsole.WriteLine(SomarPares(new[] { -4, -3, 0, 2 }));',saida:['-3']},
  {id:'filtro-tardio-nao-desfaz-soma',codigo:metodoPares.replace('        if (numero % 2 != 0) continue;\n        total += numero;','        total += numero;\n        if (numero % 2 != 0) continue;')+'\nConsole.WriteLine(SomarPares(new[] { -4, -3, 0, 2 }));',saida:['-5']},
  {id:'break-descarta-pares-posteriores',codigo:metodoPares.replace('continue;','break;')+'\nConsole.WriteLine(SomarPares(new[] { -4, -3, 0, 2 }));',saida:['-4']}
 ];
 const pasta=join(raiz,'csharp-controle');await mkdir(pasta);
 await writeFile(join(pasta,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
 await writeFile(join(pasta,'Controle.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup></Project>');
 const chamadas=casos.map((caso,indice)=>`Conferir(${JSON.stringify(caso.id)}, Cenario${indice}, ${JSON.stringify(caso.saida.join('\n')+'\n')});`).join('\n');
 const funcoes=casos.map((caso,indice)=>`static void Cenario${indice}() {\n${caso.codigo}\n}`).join('\n');
 const codigo=`using System;
using System.IO;
using System.Linq;
${chamadas}
static void Conferir(string nome, Action executar, string esperada) {
    var original = Console.Out;
    using var captura = new StringWriter();
    try { Console.SetOut(captura); executar(); }
    finally { Console.SetOut(original); }
    var obtida = captura.ToString().Replace("\\r\\n", "\\n");
    if (obtida != esperada) throw new Exception(nome + ": saída divergente: " + obtida);
    Console.WriteLine("OK controle C# " + nome);
}
${funcoes}`;
 await writeFile(join(pasta,'Program.cs'),codigo);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});if(resultado.error)throw resultado.error;return resultado;};
 const compilar=()=>executar(['build',join(pasta,'Controle.csproj'),'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')]);
 const compilacao=compilar();assert.equal(compilacao.status,0,compilacao.stdout+compilacao.stderr);
 const saida=executar([join(pasta,'bin','Release','net10.0','Controle.dll')]);assert.equal(saida.status,0,saida.stdout+saida.stderr);assert.equal(saida.stdout.trim().split(/\r?\n/).length,casos.length);process.stdout.write(saida.stdout);
 const retornoInterno=metodoPares.replace('    }\n    return total;','        return total;\n    }');
 await writeFile(join(pasta,'Program.cs'),'using System;\nConsole.WriteLine(SomarPares(Array.Empty<int>()));\n'+retornoInterno);
 const rejeicao=compilar();assert.notEqual(rejeicao.status,0,'método sem retorno para array vazio foi aceito');assert.match(rejeicao.stdout+rejeicao.stderr,/error CS0161:/);console.log('OK controle C# diagnóstico CS0161');
 return casos.length+1;
}

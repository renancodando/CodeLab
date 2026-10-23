import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';

function permutar(linhas){
 return linhas.length?linhas.flatMap((linha,indice)=>permutar(linhas.filter((_,outro)=>outro!==indice)).map(resto=>[linha,...resto])):[[]];
}
export async function verificarFundamentosDotnet(raiz,atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(atividade=>atividade.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('cs-dotnet-prever-divisao'),diagnostico=atividade('cs-dotnet-diagnosticar-inferencia'),reconstrucao=atividade('cs-dotnet-reconstruir-total');
 const ordensValidas=new Set(['centavos,preco,quantidade,saida','centavos,quantidade,preco,saida','quantidade,centavos,preco,saida']);
 const codigoDaOrdem=ordem=>ordem.map(id=>reconstrucao.lines.find(linha=>linha.id===id).code).join('\n');
 const casos=[
  {id:'divisao-inteira-e-decimal',codigo:previsao.code,saida:['2','2.0','2.5']},
  {id:'conversao-antes-muda-resultado',codigo:previsao.code.replace('5 / 2;','5 / 2m;'),saida:['2.5','2.5','2.5']},
  {id:'literal-decimal-compila',codigo:obterSolucao(diagnostico.id),saida:['29.00']},
  ...['inteiro','depois'].map(id=>({id:'compila-mas-perde-centavos-'+id,codigo:diagnostico.code.replace('var preco = 7.25;',diagnostico.options.find(opcao=>opcao.id===id).text),saida:['28.00']})),
  ...[...ordensValidas].map((ordem,indice)=>({id:'dependencias-validas-'+indice,codigo:codigoDaOrdem(ordem.split(',')),saida:['29.00']})),
  ...[[0,4,'0.00'],[1,4,'0.04'],[99,4,'3.96'],[100,4,'4.00'],[725,0,'0.00']].map(([centavos,quantidade,saida])=>({id:'centavos-'+centavos+'-quantidade-'+quantidade,codigo:obterSolucao(reconstrucao.id).replace('centavos = 725','centavos = '+centavos).replace('quantidade = 4','quantidade = '+quantidade),saida:[saida]}))
 ];
 const erros=[
  {arquivo:'literal-double.cs',codigo:diagnostico.code,diagnostico:'CS0266'},
  {arquivo:'var-continua-tipado.cs',codigo:'var pontos = 3;\npontos = "3";\nConsole.WriteLine(pontos);',diagnostico:'CS0029'},
  ...permutar(['centavos','preco','quantidade','saida']).filter(ordem=>!ordensValidas.has(ordem.join(','))).map((ordem,indice)=>({arquivo:'dependencia-'+indice+'.cs',codigo:codigoDaOrdem(ordem),diagnostico:'CS0841'}))
 ];
 const pasta=join(raiz,'dotnet-fundamentos');await mkdir(pasta);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:512*1024,env:ambiente});if(resultado.error)throw resultado.error;return resultado;};
 const projeto='<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup></Project>';
 async function preparar(nome,codigo){
  const diretorio=join(pasta,nome);await mkdir(diretorio);
  await writeFile(join(diretorio,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');await writeFile(join(diretorio,'Fundamentos.csproj'),projeto);await writeFile(join(diretorio,'Program.cs'),codigo);return diretorio;
 }
 const chamadas=casos.map((caso,indice)=>`Conferir(${JSON.stringify(caso.id)}, Cenario${indice}, ${JSON.stringify(caso.saida.join('\n')+'\n')});`).join('\n');
 const funcoes=casos.map((caso,indice)=>`static void Cenario${indice}() {\n${caso.codigo}\n}`).join('\n');
 const codigo=`using System;
using System.IO;
using System.Globalization;
CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;
${chamadas}
static void Conferir(string nome, Action executar, string esperada) {
    var original = Console.Out;
    using var captura = new StringWriter();
    try { Console.SetOut(captura); executar(); }
    finally { Console.SetOut(original); }
    var obtida = captura.ToString().Replace("\\r\\n", "\\n");
    if (obtida != esperada) throw new Exception(nome + ": saída divergente: " + obtida);
    Console.WriteLine("OK fundamentos .NET " + nome);
}
${funcoes}`;
 const positivos=await preparar('execucao',codigo);
 const compilar=diretorio=>executar(['build',join(diretorio,'Fundamentos.csproj'),'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(diretorio,'NuGet.Config')]);
 const build=compilar(positivos);assert.equal(build.status,0,build.stdout+build.stderr);
 const saida=executar([join(positivos,'bin','Release','net10.0','Fundamentos.dll')]);assert.equal(saida.status,0,saida.stdout+saida.stderr);assert.equal(saida.stdout.trim().split(/\r?\n/).length,casos.length);process.stdout.write(saida.stdout);
 const codigoInvalido='using System;\nConsole.WriteLine("não executar");\n'+erros.map((caso,indice)=>`static void Falha${indice}() {\n#line 1 "${caso.arquivo}"\n${caso.codigo}\n#line default\n}`).join('\n');
 const negativos=await preparar('diagnosticos',codigoInvalido),rejeicao=compilar(negativos);assert.notEqual(rejeicao.status,0,'o compilador aceitou programas inválidos');
 const mensagens=rejeicao.stdout+rejeicao.stderr;
 for(const caso of erros){assert(mensagens.split(/\r?\n/).some(linha=>linha.includes(caso.arquivo+'(')&&linha.includes('error '+caso.diagnostico+':')),caso.arquivo+': diagnóstico ausente');console.log('OK fundamentos .NET diagnóstico '+caso.arquivo+' '+caso.diagnostico);}
 return casos.length+erros.length;
}

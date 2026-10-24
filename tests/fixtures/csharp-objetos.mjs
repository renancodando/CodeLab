import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';
import ts from 'typescript';

export async function verificarObjetosCsharp(raiz,atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(atividade=>atividade.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('cs-objetos-prever-referencias'),diagnostico=atividade('cs-objetos-proteger-saldo');
 const fonte=ts.createSourceFile('curriculum.ts',await readFile('src/content/curriculum.ts','utf8'),ts.ScriptTarget.ESNext,true);
 let aula;
 function visitar(no){
  if(ts.isArrayLiteralExpression(no)&&no.elements.length>0&&ts.isStringLiteral(no.elements[0])&&no.elements[0].text==='csharp-objetos')aula=no;
  ts.forEachChild(no,visitar);
 }
 visitar(fonte);assert(aula&&ts.isStringLiteralLike(aula.elements[3])&&ts.isStringLiteralLike(aula.elements[5]),'exemplo e solução originais precisam ser literais');
 const metodo=obterSolucao('cs-objetos-reconstruir-saque');
 const conta=trecho=>'sealed class Conta {\n    public int Saldo { get; private set; }\n    public Conta(int saldo) {\n        if (saldo < 0 || saldo > 1000000) throw new ArgumentOutOfRangeException(nameof(saldo));\n        Saldo = saldo;\n    }\n'+trecho+'\n}';
 const conferirSaques="for (int saldo = 0; saldo <= 25; saldo++) {\n    for (int pedido = -2; pedido <= 27; pedido++) {\n        var conta = new Conta(saldo);\n        bool esperada = pedido > 0 && pedido <= saldo;\n        bool obtida = conta.TentarSacar(pedido);\n        int saldoEsperado = esperada ? saldo - pedido : saldo;\n        if (obtida != esperada || conta.Saldo != saldoEsperado) throw new Exception(\"retorno ou estado divergente\");\n    }\n}\nforeach (int pedido in new[] { int.MinValue, int.MaxValue, -1, 0, 1000001 }) {\n    var conta = new Conta(1000000);\n    if (conta.TentarSacar(pedido) || conta.Saldo != 1000000) throw new Exception(\"recusa alterou o saldo\");\n}\nvar limite = new Conta(1000000);\nif (!limite.TentarSacar(1000000) || limite.Saldo != 0) throw new Exception(\"retirada exata recusada\");\nConsole.WriteLine(\"saques conferidos\");\n";
 const conferirDepositos="var conta = new Conta();\nconta.Depositar(1000000);\nforeach (int pedido in new[] { int.MinValue, -1, 0, 1, int.MaxValue }) {\n    bool recusou = false;\n    try { conta.Depositar(pedido); }\n    catch (ArgumentOutOfRangeException) { recusou = true; }\n    if (!recusou || conta.Saldo != 1000000) throw new Exception(\"depósito recusado mudou o saldo\");\n}\nvar outra = new Conta();\noutra.Depositar(1);\nif (outra.Saldo != 1 || conta.Saldo != 1000000) throw new Exception(\"saldo compartilhado\");\nConsole.WriteLine(\"depósitos conferidos\");\n";
 const inicioTipos=codigo=>codigo.search(/^(?:(?:public|internal|sealed|abstract|static|partial)\s+)*(?:class|interface|record|struct)\s/m);
 const tiposDiagnostico=diagnostico.code.slice(inicioTipos(diagnostico.code));
 const tiposProtegidos=tiposDiagnostico.replace('public int Saldo { get; set; }','public int Saldo { get; private set; }');
 const casos=[
  {id:'exemplo-original-produto',codigo:aula.elements[3].text,saida:['Caderno: 12']},
  {id:'gabarito-original-forma',codigo:'IForma forma = new Retangulo(3, 4);\nConsole.WriteLine(forma.Area());\nConsole.WriteLine(new Retangulo(0, 4).Area());\n'+aula.elements[5].text,saida:['12','0']},
  {id:'interface-observa-instancia',codigo:previsao.code,saida:['1','0','True']},
  {id:'interface-observa-outra-instancia',codigo:previsao.code.replace('ILeitura leitura = original;\nvar separado = new Contador();','var separado = new Contador();\nILeitura leitura = separado;'),saida:['0','0','False']},
  {id:'setter-publico-contorna-metodo',codigo:diagnostico.code,saida:['-50']},
  {id:'cliente-usa-operacao-permitida',codigo:obterSolucao(diagnostico.id),saida:['20']},
  {id:'depositos-preservam-regra',codigo:conferirDepositos+tiposProtegidos,saida:['depósitos conferidos']},
  {id:'saques-bordas-e-intervalo',codigo:conferirSaques+conta(metodo),saida:['saques conferidos']},
  {id:'chamadas-e-instancias-independentes',codigo:"var primeira = new Conta(20);\nvar segunda = new Conta(20);\nif (!primeira.TentarSacar(5) || primeira.Saldo != 15) throw new Exception(\"primeira retirada\");\nif (primeira.TentarSacar(16) || primeira.Saldo != 15) throw new Exception(\"recusa mutou\");\nif (!primeira.TentarSacar(15) || primeira.Saldo != 0) throw new Exception(\"retirada final\");\nif (primeira.TentarSacar(1) || primeira.Saldo != 0 || segunda.Saldo != 20) throw new Exception(\"estado indevido\");\nConsole.WriteLine(\"instâncias conferidas\");\n"+conta(metodo),saida:['instâncias conferidas']},
  {id:'mutante-desconta-antes-de-validar',codigo:'var conta = new Conta(20);\nConsole.WriteLine(conta.TentarSacar(30));\nConsole.WriteLine(conta.Saldo);\n'+conta(metodo.replace('    if (centavos <= 0 || centavos > Saldo) return false;\n    Saldo -= centavos;','    Saldo -= centavos;\n    if (centavos <= 0 || centavos > Saldo) return false;')),saida:['False','-10']},
  {id:'mutante-aceita-zero',codigo:'var conta = new Conta(20);\nConsole.WriteLine(conta.TentarSacar(0));\nConsole.WriteLine(conta.Saldo);\n'+conta(metodo.replace('centavos <= 0','centavos < 0')),saida:['True','20']},
  {id:'mutante-recusa-retirada-exata',codigo:'var conta = new Conta(20);\nConsole.WriteLine(conta.TentarSacar(20));\nConsole.WriteLine(conta.Saldo);\n'+conta(metodo.replace('centavos > Saldo','centavos >= Saldo')),saida:['False','20']}
 ];
 const pasta=join(raiz,'csharp-objetos');await mkdir(pasta);
 await writeFile(join(pasta,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
 await writeFile(join(pasta,'Objetos.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup></Project>');
 const cabecalho='using System;\nusing System.IO;\nusing System.Globalization;\n';
 const namespaces=casos.map((caso,indice)=>{
  const posicao=inicioTipos(caso.codigo);assert(posicao>=0,caso.id);
  return 'namespace Cenario'+indice+' {\ninternal static class Programa {\npublic static void Executar() {\n'+caso.codigo.slice(0,posicao)+'\n}\n}\n'+caso.codigo.slice(posicao)+'\n}';
 }).join('\n');
 const chamadas=casos.map((caso,indice)=>'Conferir('+JSON.stringify(caso.id)+', Cenario'+indice+'.Programa.Executar, '+JSON.stringify(caso.saida.join('\n')+'\n')+');').join('\n');
 const codigo=cabecalho+"CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;\n@CHAMADAS@\nstatic void Conferir(string nome, Action executar, string esperada) {\n    var original = Console.Out;\n    using var captura = new StringWriter();\n    try { Console.SetOut(captura); executar(); }\n    finally { Console.SetOut(original); }\n    var obtida = captura.ToString().Replace(\"\\r\\n\", \"\\n\");\n    if (obtida != esperada) throw new Exception(nome + \": saída divergente: \" + obtida);\n    Console.WriteLine(\"OK objetos C# \" + nome);\n}\n".replace('@CHAMADAS@',chamadas)+namespaces;
 await writeFile(join(pasta,'Program.cs'),codigo);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});if(resultado.error)throw resultado.error;return resultado;};
 const compilar=()=>executar(['build',join(pasta,'Objetos.csproj'),'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')]);
 const compilacao=compilar();assert.equal(compilacao.status,0,compilacao.stdout+compilacao.stderr);
 const saida=executar([join(pasta,'bin','Release','net10.0','Objetos.dll')]);assert.equal(saida.status,0,saida.stdout+saida.stderr);assert.equal(saida.stdout.trim().split(/\r?\n/).length,casos.length);process.stdout.write(saida.stdout);
 const rejeicoes=[
  {id:'escrita-externa-recusada',codigo:diagnostico.code.replace('public int Saldo { get; set; }','public int Saldo { get; private set; }'),erro:'CS0272'},
  {id:'init-nao-permite-atualizar-no-metodo',codigo:'var conta = new Conta();\nconta.Depositar(20);\n'+tiposDiagnostico.replace('public int Saldo { get; set; }','public int Saldo { get; init; }'),erro:'CS8852'},
  {id:'getter-nao-permite-atualizar-no-metodo',codigo:'var conta = new Conta();\nconta.Depositar(20);\n'+tiposDiagnostico.replace('public int Saldo { get; set; }','public int Saldo { get; }'),erro:'CS0200'}
 ];
 for(const caso of rejeicoes){
  await writeFile(join(pasta,'Program.cs'),cabecalho+caso.codigo);
  const rejeicao=compilar();assert.notEqual(rejeicao.status,0,caso.id+' foi aceito');assert.match(rejeicao.stdout+rejeicao.stderr,new RegExp('error '+caso.erro+':'));console.log('OK objetos C# '+caso.id+' '+caso.erro);
 }
 return casos.length+rejeicoes.length;
}

import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';
import ts from 'typescript';

export async function verificarExcecoesCsharp(raiz,atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('cs-async-prever-finally'),diagnostico=atividade('cs-async-diagnosticar-teste'),leitura=atividade('cs-async-aguardar-leitura');
 const fonte=ts.createSourceFile('curriculum.ts',await readFile('src/content/curriculum.ts','utf8'),ts.ScriptTarget.ESNext,true);
 let aula;
 function visitar(no){if(ts.isArrayLiteralExpression(no)&&no.elements.length>0&&ts.isStringLiteral(no.elements[0])&&no.elements[0].text==='csharp-async')aula=no;ts.forEachChild(no,visitar);}
 visitar(fonte);assert(aula&&ts.isStringLiteralLike(aula.elements[3]),'exemplo original deve continuar literal');
 const exemplo=aula.elements[3].text,marcador='\nif (Dividir(8,2)';
 assert(exemplo.includes(marcador));const dividir=exemplo.slice(0,exemplo.indexOf(marcador));
 const teste=obterSolucao(diagnostico.id);
 const quebrar=codigo=>codigo.replace('if (b == 0) throw new ArgumentException("divisor");','if (b == 0) return 0;');
 assert.notEqual(quebrar(teste),teste);
 const metodo=leitura.code.replace('____',obterSolucao(leitura.id));
 const trechos={
  suspensao:String.raw`var leitor = new LeitorControlado();
var tarefa = LerTextoAsync(leitor, CancellationToken.None);
if (tarefa.IsCompleted || leitor.Leituras != 1 || leitor.Descartes != 0) throw new Exception("não conservou o recurso pendente");
leitor.Liberar(" ação \n");
if (await tarefa != " ação \n" || leitor.Descartes != 1) throw new Exception("texto ou descarte");
Console.WriteLine("espera e descarte conferidos");`,
  falha:String.raw`var leitor = new LeitorControlado();
var tarefa = LerTextoAsync(leitor, CancellationToken.None);
var esperada = new IOException("falha controlada");
leitor.Falhar(esperada);
try { await tarefa; throw new Exception("erro convertido em sucesso"); }
catch (IOException erro) when (ReferenceEquals(erro, esperada)) { }
if (leitor.Descartes != 1) throw new Exception("erro perdeu descarte");
Console.WriteLine("falha preservada");`,
  cancelar:String.raw`var leitor = new LeitorControlado();
var tarefa = LerTextoAsync(leitor, fonte.Token);
@DURANTE@
try { await tarefa; throw new Exception("cancelamento ignorado"); }
catch (OperationCanceledException erro) when (erro.CancellationToken == fonte.Token) { }
if (!tarefa.IsCanceled || leitor.TokenRecebido != fonte.Token || leitor.Descartes != 1) throw new Exception("token, estado ou descarte");
Console.WriteLine("cancelamento preservado");`,
  arquivos:String.raw`foreach (string texto in new[] { "", " ", "ação\nsegunda linha\r\n", "  café  " }) {
    string caminho = Path.Combine(@PASTA@, Guid.NewGuid().ToString("N") + ".txt");
    await File.WriteAllTextAsync(caminho, texto);
    var leitor = new StreamReader(caminho);
    if (await LerTextoAsync(leitor, CancellationToken.None) != texto) throw new Exception("arquivo alterado");
    bool fechado = false;
    try { leitor.Read(); } catch (ObjectDisposedException) { fechado = true; }
    if (!fechado) throw new Exception("arquivo ficou aberto");
}
Console.WriteLine("arquivos reais conferidos");`,
  divisao:String.raw`if (Dividir(8,-2) != -4 || Dividir(0,2) != 0) throw new Exception("quociente incorreto");
bool recusou = false;
try { Dividir(1,0); } catch (ArgumentException) { recusou = true; }
if (!recusou) throw new Exception("zero aceito");
Console.WriteLine("contrato original conferido");`,
  defeito:String.raw`try { ExigirDivisorZero(); throw new Exception("teste aprovou defeito"); }
catch (Exception erro) when (erro.Message == "não recusou") { Console.WriteLine("defeito detectado"); }`,
  tipoErrado:String.raw`try { ExigirDivisorZero(); throw new Exception("erro esperado foi escondido"); }
catch (ArgumentException) { Console.WriteLine("tipo não corresponde"); }`,
  chamadas:String.raw`foreach (string texto in new[] { "", " ", "  ação  ", "\n", "ação\noutra" }) {
    var leitor = new StringReader(texto);
    if (await LerTextoAsync(leitor, CancellationToken.None) != texto) throw new Exception("texto alterado");
    bool fechado = false;
    try { leitor.Read(); } catch (ObjectDisposedException) { fechado = true; }
    if (!fechado) throw new Exception("leitor ficou aberto");
}
Console.WriteLine("chamadas independentes");`,
  mutante:String.raw`var leitor = new LeitorControlado();
var tarefa = LerTextoAsync(leitor, CancellationToken.None);
if (leitor.Descartes != 1) throw new Exception("mutante não saiu do using");
leitor.Liberar("texto");
try { await tarefa; throw new Exception("mutante não detectado"); }
catch (ObjectDisposedException) { Console.WriteLine("descarte prematuro detectado"); }`,
  conferir:String.raw`static async Task Conferir(string nome, Func<Task> executar, string esperada) {
    var original = Console.Out;
    using var captura = new StringWriter();
    try { Console.SetOut(captura); await executar(); }
    finally { Console.SetOut(original); }
    string obtida = captura.ToString().Replace("\r\n", "\n");
    if (obtida != esperada) throw new Exception(nome + ": saída divergente: " + obtida);
    Console.WriteLine("OK exceções C# " + nome);
}
sealed class LeitorControlado : TextReader {
    private readonly TaskCompletionSource<string> liberacao = new(TaskCreationOptions.RunContinuationsAsynchronously);
    public int Descartes { get; private set; }
    public int Leituras { get; private set; }
    public CancellationToken TokenRecebido { get; private set; }
    public void Liberar(string texto) => liberacao.SetResult(texto);
    public void Falhar(Exception erro) => liberacao.SetException(erro);
    public override async Task<string> ReadToEndAsync(CancellationToken cancellationToken) {
        Leituras++;
        TokenRecebido = cancellationToken;
        using var inscricao = cancellationToken.Register(() => liberacao.TrySetCanceled(cancellationToken));
        string texto = await liberacao.Task;
        if (Descartes != 0) throw new ObjectDisposedException(nameof(LeitorControlado));
        return texto;
    }
    protected override void Dispose(bool disposing) {
        if (disposing) Descartes++;
        base.Dispose(disposing);
    }
}`
 };
 const cancelar=antes=>'using var fonte = new CancellationTokenSource();\n'+(antes?'fonte.Cancel();\n':'')+trechos.cancelar.replace('@DURANTE@',antes?'':'if (tarefa.IsCompleted || leitor.Descartes != 0) throw new Exception("não suspendeu");\nfonte.Cancel();');
 const casos=[
  {id:'exemplo-original-divisao',codigo:exemplo,saida:['Divisor zero']},
  {id:'exercicio-original-negativo-e-zero',codigo:dividir+'\n'+trechos.divisao,saida:['contrato original conferido']},
  {id:'finally-em-retorno-e-catch',codigo:previsao.code,saida:['fim','4','recusa','fim','-1']},
  {id:'finally-com-divisor-negativo',codigo:previsao.code.replace('Calcular(2)','Calcular(-2)'),saida:['fim','-4','recusa','fim','-1']},
  {id:'teste-aceita-a-excecao-esperada',codigo:teste,saida:['teste passou']},
  {id:'teste-especifico-detecta-funcao-quebrada',codigo:quebrar(teste).replace('ExigirDivisorZero();\nConsole.WriteLine("teste passou");',trechos.defeito),saida:['defeito detectado']},
  {id:'catch-generico-aprova-funcao-quebrada',codigo:quebrar(diagnostico.code),saida:['teste passou']},
  ...['ArithmeticException','DivideByZeroException'].map(tipo=>({id:'catch-'+tipo+'-recusa-funcao-correta',codigo:diagnostico.code.replace('catch (Exception)','catch ('+tipo+')').replace('ExigirDivisorZero();\nConsole.WriteLine("teste passou");',trechos.tipoErrado),saida:['tipo não corresponde']})),
  {id:'aguarda-antes-de-descartar',codigo:metodo+'\n'+trechos.suspensao,saida:['espera e descarte conferidos']},
  {id:'configure-await-false-conserva-contrato',codigo:leitura.code.replace('____','await leitor.ReadToEndAsync(token).ConfigureAwait(false)')+'\n'+trechos.suspensao,saida:['espera e descarte conferidos']},
  {id:'configure-await-true-conserva-contrato',codigo:leitura.code.replace('____','await leitor.ReadToEndAsync(token).ConfigureAwait(true)')+'\n'+trechos.suspensao,saida:['espera e descarte conferidos']},
  {id:'falha-assincrona-descarta-e-propaga',codigo:metodo+'\n'+trechos.falha,saida:['falha preservada']},
  {id:'cancelamento-antes-da-leitura',codigo:metodo+'\n'+cancelar(true),saida:['cancelamento preservado']},
  {id:'cancelamento-durante-a-leitura',codigo:metodo+'\n'+cancelar(false),saida:['cancelamento preservado']},
  {id:'arquivo-real-vazio-unicode-e-fechamento',codigo:metodo+'\n'+trechos.arquivos,saida:['arquivos reais conferidos']},
  {id:'chamadas-independentes-sem-normalizar-texto',codigo:metodo+'\n'+trechos.chamadas,saida:['chamadas independentes']},
  {id:'mutante-retorna-task-e-descarta-cedo',codigo:metodo.replace('static async Task<string>','static Task<string>').replace('return await leitor.ReadToEndAsync(token);','return leitor.ReadToEndAsync(token);')+'\n'+trechos.mutante,saida:['descarte prematuro detectado']}
 ];
 const pasta=join(raiz,'csharp-excecoes');await mkdir(pasta);
 await writeFile(join(pasta,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
 const projeto=join(pasta,'Excecoes.csproj');
 await writeFile(projeto,'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup></Project>');
 const cabecalho='using System;\nusing System.IO;\nusing System.Threading;\nusing System.Threading.Tasks;\n';
 const funcoes=casos.map((caso,indice)=>'static async Task Cenario'+indice+'() {\nawait Task.CompletedTask;\n'+caso.codigo.replaceAll('@PASTA@',JSON.stringify(pasta)).replace(/^using [\w.]+;\r?\n/gm,'')+'\n}').join('\n');
 const chamadas=casos.map((caso,indice)=>'await Conferir('+JSON.stringify(caso.id)+', Cenario'+indice+', '+JSON.stringify(caso.saida.join('\n')+'\n')+');').join('\n');
 await writeFile(join(pasta,'Program.cs'),cabecalho+chamadas+'\n'+funcoes+'\n'+trechos.conferir);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});if(resultado.error||resultado.status!==0)throw new Error('Exceções C#: '+(resultado.error?.message??resultado.stderr)+resultado.stdout);return resultado.stdout;};
 executar(['build',projeto,'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')]);
 const saida=executar([join(pasta,'bin','Release','net10.0','Excecoes.dll')]);process.stdout.write(saida);assert.equal(saida.trim().split(/\r?\n/).length,casos.length);
 await writeFile(join(pasta,'Program.cs'),cabecalho+leitura.code.replace('____','leitor.ReadToEndAsync(token)'));
 const rejeitada=spawnSync('dotnet',['build',projeto,'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')],{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});
 if(rejeitada.error)throw rejeitada.error;
 assert.notEqual(rejeitada.status,0);assert.match(rejeitada.stdout+rejeitada.stderr,/error CS4016:/);
 console.log('OK exceções C# tarefa sem espera CS4016');
 return casos.length+1;
}

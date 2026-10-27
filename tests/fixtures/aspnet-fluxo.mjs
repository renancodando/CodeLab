import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';
import ts from 'typescript';

export async function verificarFluxoAspnet(raiz,atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('aspnet-pipeline-prever-fluxo'),diagnostico=atividade('aspnet-pipeline-corrigir-log'),producao=atividade('aspnet-pipeline-montar-configuracao');
 const fonte=ts.createSourceFile('curriculum.ts',await readFile('src/content/curriculum.ts','utf8'),ts.ScriptTarget.Latest,true);
 let original;
 function visitar(no){if(ts.isArrayLiteralExpression(no)&&no.elements.length>0&&ts.isStringLiteral(no.elements[0])&&no.elements[0].text==='aspnet-pipeline')original=no.elements[3].text;ts.forEachChild(no,visitar);}
 visitar(fonte);assert(original);
 const semUsings=codigo=>codigo.replace(/^using Microsoft\.[^;\n]+;\r?\n/gm,'');
 const funcoes=[],chamadas=[];
 const adicionar=(nome,corpo)=>{funcoes.push('static void '+nome+'() {\n'+corpo+'\n}');chamadas.push(nome+'();\nConsole.WriteLine('+JSON.stringify('OK fluxo '+nome)+');');};
 function servidor(nome,codigo,conferencia){
  const inicio='WebApplication.CreateBuilder(new WebApplicationOptions { Args = Array.Empty<string>(), EnvironmentName = Environments.Production, ContentRootPath = AppContext.BaseDirectory })';
  const ambiente='construtor.Configuration.Sources.Clear();\nconstrutor.Configuration.AddInMemoryCollection();\nconstrutor.Logging.ClearProviders();\nconstrutor.Logging.AddProvider(coletor);\nconstrutor.WebHost.UseUrls("http://127.0.0.1:0");\nvar app = construtor.Build();';
  assert(codigo.includes('app.Run();'));assert(codigo.includes('var app = construtor.Build();'));
  const corpo='var coletor = new Coletor();\n'+codigo.replace('WebApplication.CreateBuilder(args)',inicio).replace('var app = construtor.Build();',ambiente).replace('app.Run();','await ConferirHttp(app);')+'\n'+conferencia;
  funcoes.push('static async Task '+nome+'() {\n'+corpo+'\n}');chamadas.push('await '+nome+'();\nConsole.WriteLine('+JSON.stringify('OK fluxo '+nome)+');');
 }
 servidor('ExemploOriginal','var construtor = WebApplication.CreateBuilder(args);\nvar app = construtor.Build();\n'+original+'\napp.MapGet("/saude", () => Results.Ok());\napp.Run();',String.raw`var mensagens = coletor.Mensagens.Where(m => m.Modelo == "{Method} {Status} em {Elapsed}ms").ToArray();
Exigir(mensagens.Length == 2, "o exemplo deve registrar as duas requisições");
Exigir(mensagens.Select(m => m.Campos["Status"]).SequenceEqual(new object?[] { 200, 404 }), "status final divergente");
foreach (var mensagem in mensagens) {
    Exigir(Equals(mensagem.Campos["Method"], "GET"), "método divergente");
    Exigir(mensagem.Campos["Elapsed"] is long duracao && duracao >= 0, "duração sem valor numérico");
}`);
 servidor('EntradaERetorno',previsao.code,'Exigir(string.Join("\\n", eventos) == "entra A\\nentra B\\nendpoint\\nsai B\\nsai A\\nentra A\\nentra B\\nsai B\\nsai A", "ordem do middleware divergente");');
 const chamada=diagnostico.code.trim().split('\n').at(-1);assert(chamada.startsWith('registro.LogInformation('));
 const registros=[
  {id:'LogOriginal',codigo:diagnostico.code,estrutura:false,credencial:true},
  ...diagnostico.options.map(opcao=>({id:'Log_'+opcao.id,codigo:diagnostico.code.replace(chamada,opcao.text),estrutura:opcao.id==='metadados',credencial:['renomear','rebaixar'].includes(opcao.id)}))
 ];
 for(const caso of registros){
  const codigo=semUsings(caso.codigo).replace('configuracao => configuracao.AddConsole()','configuracao => configuracao.SetMinimumLevel(LogLevel.Trace).AddProvider(coletor)');
  assert.notEqual(codigo,semUsings(caso.codigo),'o teste deve capturar o provedor sem console');
  adicionar(caso.id,'var coletor = new Coletor();\n'+codigo+'\nConferirRegistro(coletor, '+caso.estrutura+', '+caso.credencial+');');
 }
 assert.equal(obterSolucao(diagnostico.id),registros.find(caso=>caso.id==='Log_metadados').codigo);
 const canonico=obterSolucao(producao.id),invertido=producao.code+'\n'+producao.lines.map(linha=>linha.code).join('\n');
 const minusculo=canonico.replace('["Importacao:Limite"] = "80"','["importacao:limite"] = "80"');assert.notEqual(minusculo,canonico);
 for(const [nome,codigo,saida] of [['ConfigCorreta',canonico,'80\nseguro'],['ConfigInvertida',invertido,'50\nseguro'],['ConfigSemDiferenciarCaixa',minusculo,'80\nseguro']]){
  funcoes.push('static void '+nome+'() {\n'+semUsings(codigo)+'\n}');chamadas.push('ConferirSaida('+nome+', '+JSON.stringify(saida)+');\nConsole.WriteLine('+JSON.stringify('OK fluxo '+nome)+');');
 }
 const comum=String.raw`
static void Exigir(bool condicao, string mensagem) { if (!condicao) throw new Exception(mensagem); }
static async Task ConferirHttp(WebApplication app) {
    try {
        await app.StartAsync();
        var endereco = new Uri(app.Urls.Single());
        Exigir(endereco.Scheme == "http" && endereco.Port > 0 && IPAddress.TryParse(endereco.Host, out var ip) && IPAddress.IsLoopback(ip), "host fora do loopback");
        using var cliente = new HttpClient(new SocketsHttpHandler { UseProxy = false }) { BaseAddress = endereco, Timeout = TimeSpan.FromSeconds(5) };
        foreach (var (caminho, status) in new[] { ("/saude", 200), ("/ausente", 404) }) {
            using var resposta = await cliente.GetAsync(caminho);
            Exigir((int)resposta.StatusCode == status, "status divergente em " + caminho);
        }
    } finally { await app.StopAsync(); await app.DisposeAsync(); }
}
static void ConferirSaida(Action programa, string esperada) {
    var anterior = Console.Out;
    using var captura = new StringWriter();
    try { Console.SetOut(captura); programa(); }
    finally { Console.SetOut(anterior); }
    Exigir(captura.ToString().Replace("\r\n", "\n").TrimEnd() == esperada, "precedência ou chave ausente divergente");
}
static void ConferirRegistro(Coletor coletor, bool estruturaEsperada, bool credencialEsperada) {
    var mensagem = coletor.Mensagens.Single();
    bool estrutura = mensagem.Campos.TryGetValue("Metodo", out var metodo) && Equals(metodo, "POST") &&
        mensagem.Campos.TryGetValue("Status", out var status) && status is int valor && valor == 503;
    bool credencial = mensagem.Campos.Values.Any(valor => valor?.ToString()?.Contains("exemplo-falso", StringComparison.Ordinal) == true);
    Exigir(estrutura == estruturaEsperada, "campos estruturados divergentes");
    Exigir(credencial == credencialEsperada, "tratamento da credencial fictícia divergente");
}
sealed record MensagemLog(string Modelo, IReadOnlyDictionary<string, object?> Campos);
sealed class Coletor : ILoggerProvider {
    public System.Collections.Concurrent.ConcurrentQueue<MensagemLog> Mensagens { get; } = new();
    public ILogger CreateLogger(string categoria) => new Captura(this);
    public void Dispose() { }
    private sealed class Captura(Coletor coletor) : ILogger {
        public IDisposable? BeginScope<TState>(TState estado) where TState : notnull => null;
        public bool IsEnabled(LogLevel nivel) => true;
        public void Log<TState>(LogLevel nivel, EventId evento, TState estado, Exception? erro, Func<TState, Exception?, string> formatar) {
            var campos = new Dictionary<string, object?>();
            if (estado is IEnumerable<KeyValuePair<string, object?>> pares) foreach (var par in pares) campos[par.Key] = par.Value;
            var modelo = campos.TryGetValue("{OriginalFormat}", out var formato) ? formato?.ToString() ?? "" : "";
            coletor.Mensagens.Enqueue(new MensagemLog(modelo, campos));
        }
    }
}
`;
 const programa='using System.Net;\nusing Microsoft.Extensions.Configuration;\n'+chamadas.join('\n')+'\n'+funcoes.join('\n')+'\n'+comum;
 const pasta=join(raiz,'aspnet-fluxo');await mkdir(pasta);
 await writeFile(join(pasta,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
 const projeto=join(pasta,'Fluxo.csproj');
 await writeFile(projeto,'<Project Sdk="Microsoft.NET.Sdk.Web"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup></Project>');
 await writeFile(join(pasta,'Program.cs'),programa);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});if(resultado.error||resultado.status!==0)throw new Error('Middleware: '+(resultado.error?.message??resultado.stderr)+resultado.stdout);return resultado.stdout;};
 executar(['build',projeto,'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')]);
 const saida=executar([join(pasta,'bin','Release','net10.0','Fluxo.dll')]);process.stdout.write(saida);assert.equal(saida.trim().split(/\r?\n/).length,chamadas.length);
 return chamadas.length;
}

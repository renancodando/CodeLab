import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';

export async function verificarProtecaoAspnet(raiz,atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('aspnet-protecao-prever-politica'),diagnostico=atividade('aspnet-protecao-corrigir-recurso'),producao=atividade('aspnet-protecao-montar-limite');
 const funcoes=[],chamadas=[];
 function adicionar(nome,corpo,assincrono=false){funcoes.push('static '+(assincrono?'async Task ':'void ')+nome+'() {\n'+corpo+'\n}');chamadas.push((assincrono?'await ':'')+nome+'();\nConsole.WriteLine('+JSON.stringify('OK proteção '+nome)+');');}
 const politica='var construtor = CriarConstrutor();\nconstrutor.Services.AddAuthentication("Cenario").AddScheme<AuthenticationSchemeOptions, IdentidadeDeTeste>("Cenario", _ => { });\nvar visitas = 0;\n'+previsao.code.replace('() => Results.NoContent()','() => { visitas++; return Results.NoContent(); }').replace('app.Run();','await ConferirPolitica(app);\nExigir(visitas == 2, "endpoint executou sem permissão ou deixou de executar autorizado");');
 assert(politica.includes('visitas++'));adicionar('PoliticaHttp',politica,true);
 const retornos={titular:[true,false,false,false,false,false,true,false],papel:[true,true,false,true,false,true,true,false],qualquer:[true,true,true,true,false,true,true,false],cliente:[false,true,false,true,false,true,false,false]};
 const retorno='return usuario.Identity?.IsAuthenticated == true && usuario.IsInRole("editor");';assert(diagnostico.code.includes(retorno));
 for(const opcao of diagnostico.options){
  const codigo=diagnostico.code.replace(/^using System.Security.Claims;\r?\n/,'').replace(retorno,opcao.text);
  adicionar('Recurso_'+opcao.id,codigo+'\nConferirRecurso(PodeExcluir, new bool[] { '+retornos[opcao.id].join(', ')+' });');
 }
 assert.equal(obterSolucao(diagnostico.id),diagnostico.code.replace(retorno,diagnostico.options.find(opcao=>opcao.id==='titular').text));
 const cabecalho='using Microsoft.AspNetCore.RateLimiting;\n\nvar construtor = WebApplication.CreateBuilder(args);\n';
 const alternativa=cabecalho+['servicos','aplicacao','rota','middleware','executar'].map(id=>producao.lines.find(linha=>linha.id===id).code).join('\n');
 const barreira='var entrou = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);\nvar liberar = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);\nvar terminou = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);\n';
 const handler=String.raw`async (HttpContext contexto) => {
    if (contexto.Request.Query.ContainsKey("segurar")) {
        contexto.Response.OnCompleted(() => { terminou.TrySetResult(); return Task.CompletedTask; });
        entrou.TrySetResult();
        await liberar.Task.WaitAsync(contexto.RequestAborted);
    }
    return Results.Ok("aceito");
}`;
 for(const [nome,codigo] of [['LimiteCanonico',obterSolucao(producao.id)],['LimiteEquivalente',alternativa]]){
  assert(codigo.includes('() => Results.Ok("aceito")'));
  adicionar(nome,barreira+codigo.replace('using Microsoft.AspNetCore.RateLimiting;','').replace('WebApplication.CreateBuilder(args)','CriarConstrutor()').replace('() => Results.Ok("aceito")',handler).replace('app.Run();','await ConferirLimite(app, entrou, liberar, terminou);'),true);
 }
 const tardio=producao.lines.map(linha=>linha.code).join('\n').replace('var app = construtor.Build();','var app = construtor.Build();\ndescartar = app;').replace('app.Run();','');
 adicionar('RegistroTardio','WebApplication? descartar = null;\nbool recusou = false;\ntry {\nvar construtor = CriarConstrutor();\n'+tardio+'\n} catch (InvalidOperationException) { recusou = true; } finally { if (descartar is not null) await descartar.DisposeAsync(); }\nExigir(recusou, "o registro tardio de serviços não deve ser aceito");',true);
 const comum=String.raw`
static void Exigir(bool condicao, string mensagem) { if (!condicao) throw new Exception(mensagem); }
static WebApplicationBuilder CriarConstrutor() {
    var construtor = WebApplication.CreateBuilder(new WebApplicationOptions { Args = Array.Empty<string>(), EnvironmentName = Environments.Production, ContentRootPath = AppContext.BaseDirectory });
    construtor.Configuration.Sources.Clear();
    construtor.Configuration.AddInMemoryCollection();
    construtor.Logging.ClearProviders();
    construtor.WebHost.UseUrls("http://127.0.0.1:0");
    return construtor;
}
static HttpClient CriarCliente(WebApplication app) {
    var endereco = new Uri(app.Urls.Single());
    Exigir(endereco.Scheme == "http" && endereco.Port > 0 && IPAddress.TryParse(endereco.Host, out var ip) && IPAddress.IsLoopback(ip), "host fora do loopback");
    return new HttpClient(new SocketsHttpHandler { UseProxy = false }) { BaseAddress = endereco, Timeout = TimeSpan.FromSeconds(5) };
}
static async Task ConferirPolitica(WebApplication app) {
    try {
        await app.StartAsync();
        using var cliente = CriarCliente(app);
        foreach (var (cenario, status) in new[] { ("anonimo", 401), ("leitor", 403), ("editor", 204), ("valor-diferente", 403), ("invalido", 401), ("editor", 204) }) {
            using var pedido = new HttpRequestMessage(HttpMethod.Delete, "/notas/7");
            pedido.Headers.Add("X-Cenario", cenario);
            using var resposta = await cliente.SendAsync(pedido);
            Exigir((int)resposta.StatusCode == status, "status de autorização divergente em " + cenario);
        }
    } finally { await app.StopAsync(); await app.DisposeAsync(); }
}
static ClaimsPrincipal CriarUsuario(bool autenticado, bool editor, string? id) {
    var claims = new List<Claim>();
    if (editor) claims.Add(new Claim(ClaimTypes.Role, "editor"));
    if (id is not null) claims.Add(new Claim(ClaimTypes.NameIdentifier, id));
    return new ClaimsPrincipal(new ClaimsIdentity(claims, autenticado ? "Teste" : null));
}
static void ConferirRecurso(Func<ClaimsPrincipal, string, string, bool> decidir, bool[] esperado) {
    var casos = new[] {
        new Caso(true, true, "ana", "ana", "bia"), new Caso(true, true, "ana", "bia", "bia"),
        new Caso(true, false, "bia", "bia", "bia"), new Caso(true, true, null, "ana", "ana"),
        new Caso(false, true, "ana", "ana", "ana"), new Caso(true, true, "bia", "ana", "ana"),
        new Caso(true, true, "bia", "bia", "ana"), new Caso(true, false, "ana", "bia", "bia")
    };
    Exigir(casos.Length == esperado.Length, "matriz incompleta");
    for (int indice = 0; indice < casos.Length; indice++) {
        var caso = casos[indice];
        bool resultado = decidir(CriarUsuario(caso.Autenticado, caso.Editor, caso.Id), caso.Autor, caso.Json);
        Exigir(resultado == esperado[indice], "decisão de recurso divergente no caso " + indice);
    }
}
static async Task ConferirLimite(WebApplication app, TaskCompletionSource entrou, TaskCompletionSource liberar, TaskCompletionSource terminou) {
    Task<HttpResponseMessage>? trabalho = null;
    try {
        await app.StartAsync();
        using var cliente = CriarCliente(app);
        trabalho = cliente.PostAsync("/executar?segurar", null);
        await entrou.Task.WaitAsync(TimeSpan.FromSeconds(5));
        using var segunda = await cliente.PostAsync("/executar", null);
        Exigir((int)segunda.StatusCode == 429, "operação excedente não foi rejeitada");
        liberar.TrySetResult();
        using var primeira = await trabalho;
        Exigir((int)primeira.StatusCode == 200, "primeira operação não concluiu");
        await terminou.Task.WaitAsync(TimeSpan.FromSeconds(5));
        using var terceira = await cliente.PostAsync("/executar", null);
        Exigir((int)terceira.StatusCode == 200, "a vaga não foi devolvida");
    } finally {
        liberar.TrySetResult();
        if (trabalho is not null) { try { using var resposta = await trabalho; } catch (OperationCanceledException) { } }
        await app.StopAsync(); await app.DisposeAsync();
    }
}
sealed record Caso(bool Autenticado, bool Editor, string? Id, string Autor, string Json);
sealed class IdentidadeDeTeste(IOptionsMonitor<AuthenticationSchemeOptions> opcoes, ILoggerFactory registros, UrlEncoder codificador)
    : AuthenticationHandler<AuthenticationSchemeOptions>(opcoes, registros, codificador) {
    protected override Task<AuthenticateResult> HandleAuthenticateAsync() {
        string cenario = Request.Headers["X-Cenario"].ToString();
        if (cenario == "anonimo") return Task.FromResult(AuthenticateResult.NoResult());
        if (cenario is not ("editor" or "leitor" or "valor-diferente")) return Task.FromResult(AuthenticateResult.Fail("cenário sintético inválido"));
        var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, "ana") };
        if (cenario != "leitor") claims.Add(new Claim("permissao", cenario == "editor" ? "notas:editar" : "NOTAS:EDITAR"));
        var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, Scheme.Name));
        return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(principal, Scheme.Name)));
    }
}
`;
 const programa='using System.Net;\nusing System.Security.Claims;\nusing System.Text.Encodings.Web;\nusing Microsoft.AspNetCore.Authentication;\nusing Microsoft.AspNetCore.RateLimiting;\nusing Microsoft.Extensions.Options;\n'+chamadas.join('\n')+'\n'+funcoes.join('\n')+'\n'+comum;
 const pasta=join(raiz,'aspnet-protecao');await mkdir(pasta);await writeFile(join(pasta,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
 const projeto=join(pasta,'Protecao.csproj');await writeFile(projeto,'<Project Sdk="Microsoft.NET.Sdk.Web"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup></Project>');await writeFile(join(pasta,'Program.cs'),programa);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});if(resultado.error||resultado.status!==0)throw new Error('Proteção: '+(resultado.error?.message??resultado.stderr)+resultado.stdout);return resultado.stdout;};
 executar(['build',projeto,'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')]);
 const saida=executar([join(pasta,'bin','Release','net10.0','Protecao.dll')]);process.stdout.write(saida);assert.equal(saida.trim().split(/\r?\n/).length,chamadas.length);return chamadas.length;
}

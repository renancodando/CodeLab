import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';
import ts from 'typescript';

export async function verificarDtoAspnet(raiz,atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('aspnet-dto-prever-limites'),diagnostico=atividade('aspnet-dto-diagnosticar-guarda');
 const fonte=ts.createSourceFile('curriculum.ts',await readFile('src/content/curriculum.ts','utf8'),ts.ScriptTarget.Latest,true);
 let original;
 function visitar(no){if(ts.isArrayLiteralExpression(no)&&no.elements.length>0&&ts.isStringLiteral(no.elements[0])&&no.elements[0].text==='aspnet-dto')original=no.elements[3].text;ts.forEachChild(no,visitar);}
 visitar(fonte);assert(original);
 const declaracao='record CriarNota(string Titulo);';
 const exemplos=[
  'var construtor = WebApplication.CreateBuilder(args);\nvar app = construtor.Build();\n'+original.replace(declaracao,'')+'\napp.Run();',
  obterSolucao('aspnet-dto-montar-criacao').replace(declaracao,'')
 ];
 const funcoes=exemplos.map((codigo,indice)=>{
  assert(codigo.includes('app.Run();'));
  const isolado=codigo.replace('WebApplication.CreateBuilder(args)','WebApplication.CreateBuilder(new WebApplicationOptions { Args = Array.Empty<string>(), EnvironmentName = Environments.Production, ContentRootPath = AppContext.BaseDirectory })')
   .replace('var app = construtor.Build();','construtor.Configuration.Sources.Clear();\nconstrutor.Configuration.AddInMemoryCollection();\nconstrutor.Logging.ClearProviders();\nconstrutor.WebHost.UseUrls("http://127.0.0.1:0");\nvar app = construtor.Build();')
   .replace('app.Run();','await ConferirHttp(app);');
  return 'static async Task Cenario'+indice+'() {\n'+isolado+'\n}';
 });
 const consoles=[
  {codigo:previsao.code,saida:'400\n400\n201\n400'},
  {codigo:diagnostico.code,saida:'201'},
  {codigo:obterSolucao(diagnostico.id)+'\nConsole.WriteLine(StatusTitulo(null));',saida:'400\n400'}
 ];
 const chamadas=consoles.map((cenario,indice)=>'ConferirSaida(Console'+indice+', '+JSON.stringify(cenario.saida)+');\nConsole.WriteLine("OK DTO console '+indice+'");').join('\n')+'\nawait Cenario0();\nConsole.WriteLine("OK DTO exemplo original HTTP");\nawait Cenario1();\nConsole.WriteLine("OK DTO reconstrução HTTP");';
 const programa=String.raw`using System.Net;
using System.Text;
using System.Text.Json;
`+chamadas+'\n'+funcoes.join('\n')+'\n'+consoles.map((cenario,indice)=>'static void Console'+indice+'() {\n'+cenario.codigo+'\n}').join('\n')+String.raw`
static void ConferirSaida(Action programa, string esperada) {
    var anterior = Console.Out;
    using var captura = new StringWriter();
    try { Console.SetOut(captura); programa(); }
    finally { Console.SetOut(anterior); }
    if (captura.ToString().Replace("\r\n", "\n").TrimEnd() != esperada)
        throw new Exception("saída de console divergente");
}
static async Task ConferirHttp(WebApplication app) {
    try {
        await app.StartAsync();
        var endereco = new Uri(app.Urls.Single());
        if (!IPAddress.TryParse(endereco.Host, out var ip) || !IPAddress.IsLoopback(ip))
            throw new Exception("host fora do loopback");
        using var cliente = new HttpClient(new SocketsHttpHandler { UseProxy = false }) {
            BaseAddress = endereco, Timeout = TimeSpan.FromSeconds(5)
        };
        var anteriores = new HashSet<Guid>();
        foreach (var titulo in new string?[] { null, "", "  ", new string('a', 81), " " + new string('a', 80), " x ", new string('a', 80), "😀" }) {
            using var corpo = new StringContent(JsonSerializer.Serialize(new { titulo }), Encoding.UTF8, "application/json");
            using var resposta = await cliente.PostAsync("/notas", corpo);
            bool valido = !string.IsNullOrWhiteSpace(titulo) && titulo.Length <= 80;
            if ((int)resposta.StatusCode != (valido ? 201 : 400)) throw new Exception("limite do título incorreto");
            if (resposta.Content.Headers.ContentType?.MediaType != "application/json") throw new Exception("resposta sem JSON");
            using var dados = JsonDocument.Parse(await resposta.Content.ReadAsStringAsync());
            if (valido) {
                var id = dados.RootElement.GetProperty("id").GetGuid();
                if (id == Guid.Empty || !anteriores.Add(id)) throw new Exception("identificador fixo ou repetido");
                if (dados.RootElement.GetProperty("titulo").GetString() != titulo!.Trim()) throw new Exception("título não foi limpo");
                if (dados.RootElement.EnumerateObject().Count() != 2) throw new Exception("representação expõe campos extras");
                if (resposta.Headers.Location?.OriginalString != "/notas/" + id) throw new Exception("Location divergente");
                using var busca = await cliente.GetAsync(resposta.Headers.Location);
                if (busca.StatusCode != HttpStatusCode.NotFound) throw new Exception("o exemplo não implementa recuperação");
            } else if (dados.RootElement.GetProperty("error").GetString() != "Título de 1 a 80 caracteres") throw new Exception("erro divergente");
        }
        foreach (var json in new[] { "{}", "null", "{\"titulo\":7}" }) {
            using var corpo = new StringContent(json, Encoding.UTF8, "application/json");
            using var resposta = await cliente.PostAsync("/notas", corpo);
            if (resposta.StatusCode != HttpStatusCode.BadRequest) throw new Exception("binding aceitou corpo inválido");
        }
        using var leitura = await cliente.GetAsync("/notas");
        if (leitura.StatusCode != HttpStatusCode.MethodNotAllowed || !leitura.Content.Headers.Allow.Contains("POST"))
            throw new Exception("contrato do método incorreto");
    } finally { await app.StopAsync(); await app.DisposeAsync(); }
}
record CriarNota(string Titulo);
`;
 const pasta=join(raiz,'aspnet-dto');await mkdir(pasta);
 await writeFile(join(pasta,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
 const projeto=join(pasta,'Dto.csproj');
 await writeFile(projeto,'<Project Sdk="Microsoft.NET.Sdk.Web"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup></Project>');
 await writeFile(join(pasta,'Program.cs'),programa);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});if(resultado.error||resultado.status!==0)throw new Error('DTO: '+(resultado.error?.message??resultado.stderr)+resultado.stdout);return resultado.stdout;};
 executar(['build',projeto,'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')]);
 const saida=executar([join(pasta,'bin','Release','net10.0','Dto.dll')]);process.stdout.write(saida);assert.equal(saida.trim().split(/\r?\n/).length,5);
 return 5;
}

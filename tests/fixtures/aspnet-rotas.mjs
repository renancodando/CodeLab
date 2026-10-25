import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';
import ts from 'typescript';

export async function verificarRotasAspnet(raiz,atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('aspnet-projeto-prever-rotas'),diagnostico=atividade('aspnet-projeto-corrigir-metodo'),producao=atividade('aspnet-projeto-montar-api');
 const fonte=ts.createSourceFile('curriculum.ts',await readFile('src/content/curriculum.ts','utf8'),ts.ScriptTarget.ESNext,true);
 let aula;
 function visitar(no){if(ts.isArrayLiteralExpression(no)&&no.elements.length>0&&ts.isStringLiteral(no.elements[0])&&no.elements[0].text==='aspnet-projeto')aula=no;ts.forEachChild(no,visitar);}
 visitar(fonte);assert(aula&&ts.isStringLiteralLike(aula.elements[3])&&ts.isStringLiteralLike(aula.elements[5]),'exemplo e solução originais devem continuar literais');
 const original=aula.elements[3].text,exercicio=original.replace('app.Run();',aula.elements[5].text+'\napp.Run();');
 const gabarito=obterSolucao(producao.id);
 const ordem=['construtor','aplicacao','saude','dobro','validar','retornar','fechar','executar'];
 const saudePrimeiro=ordem.map(id=>producao.lines.find(linha=>linha.id===id).code).join('\n');
 assert.notEqual(saudePrimeiro,gabarito);
 const linha=(metodo,caminho,status,corpo,permitido=status===405?'GET':null)=>({metodo,caminho,status,corpo,permitido});
 const dobro=[
  linha('GET','/dobro/5',200,{resultado:10}),linha('GET','/dobro/0',200,{resultado:0}),
  linha('GET','/dobro/-5',200,{resultado:-10}),linha('GET','/dobro/abc',404),
  linha('GET','/dobro/2147483648',404),linha('POST','/dobro/5',405)
 ];
 const contrato=[
  linha('GET','/saude',200,{estado:'ok'}),linha('POST','/saude',405),
  linha('GET','/dobro?numero=5',200,{resultado:10}),
  linha('GET','/dobro?numero=0',200,{resultado:0}),
  linha('GET','/dobro?numero=-1000000',200,{resultado:-2000000}),
  linha('GET','/dobro?numero=1000000',200,{resultado:2000000}),
  linha('GET','/dobro?numero=-1000001',400),linha('GET','/dobro?numero=1000001',400),
  linha('GET','/dobro?numero=2147483647',400),linha('GET','/dobro?numero=-2147483648',400),
  linha('GET','/dobro?numero=2147483648',400),linha('GET','/dobro?numero=abc',400),
  linha('GET','/dobro',400),linha('POST','/dobro?numero=5',405),
  linha('GET','/ausente',404),linha('GET','/saude',200,{estado:'ok'}),
  linha('GET','/dobro?numero=-2',200,{resultado:-4})
 ];
 const chamadaDiagnostico='aplicacao.MapPost("/saude", () =>';
 assert(diagnostico.code.includes(chamadaDiagnostico));
 const casos=[
  {id:'exemplo-original-saude',codigo:original,chamadas:[linha('GET','/saude',200,{status:'ok'}),linha('POST','/saude',405),linha('GET','/dobro/5',404)]},
  {id:'gabarito-original-dobro',codigo:exercicio,chamadas:[linha('GET','/saude',200,{status:'ok'}),...dobro]},
  {id:'original-int-pode-transbordar',codigo:exercicio,chamadas:[linha('GET','/dobro/2147483647',200,{resultado:-2}),linha('GET','/dobro/-2147483648',200,{resultado:0})]},
  {id:'previsao-correspondencia-e-metodo',codigo:previsao.code,chamadas:dobro},
  {id:'sem-restricao-falha-no-binding',codigo:previsao.code.replace('{numero:int}','{numero}'),chamadas:[linha('GET','/dobro/abc',400),linha('GET','/dobro/2147483648',400)]},
  {id:'metodo-invertido-na-saude',codigo:diagnostico.code,chamadas:[linha('GET','/saude',405,undefined,'POST'),linha('POST','/saude',200,{estado:'ok'})]},
  {id:'correcao-permite-so-leitura',codigo:obterSolucao(diagnostico.id),chamadas:[linha('GET','/saude',200,{estado:'ok'}),linha('POST','/saude',405),linha('GET','/outra',404)]},
  {id:'mutante-permite-metodo-indevido',codigo:diagnostico.code.replace(chamadaDiagnostico,'aplicacao.MapMethods("/saude", new[] { "GET", "POST" }, () =>'),chamadas:[linha('GET','/saude',200,{estado:'ok'}),linha('POST','/saude',200,{estado:'ok'})]},
  {id:'mutante-muda-so-o-caminho',codigo:diagnostico.code.replace('"/saude"','"/saude2"'),chamadas:[linha('GET','/saude',404),linha('GET','/saude2',405,undefined,'POST')]},
  {id:'api-validada-e-chamadas-independentes',codigo:gabarito,chamadas:contrato},
  {id:'ordem-equivalente-dos-endpoints',codigo:saudePrimeiro,chamadas:contrato},
  {id:'mutante-guarda-impossivel',codigo:gabarito.replace('numero < -1000000 || numero > 1000000','numero < -1000000 && numero > 1000000'),chamadas:[linha('GET','/dobro?numero=1000001',200,{resultado:2000002}),linha('GET','/dobro?numero=-1000001',200,{resultado:-2000002})]},
  {id:'mutante-resposta-fixa',codigo:gabarito.replace('resultado = numero * 2','resultado = 10'),chamadas:[linha('GET','/dobro?numero=0',200,{resultado:10}),linha('GET','/dobro?numero=-2',200,{resultado:10})]}
 ];
 const pasta=join(raiz,'aspnet-rotas');await mkdir(pasta);
 await writeFile(join(pasta,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
 const projeto=join(pasta,'Rotas.csproj');
 await writeFile(projeto,'<Project Sdk="Microsoft.NET.Sdk.Web"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors><CheckForOverflowUnderflow>false</CheckForOverflowUnderflow></PropertyGroup></Project>');
 const cabecalho='using System.Net;\nusing System.Text.Json.Nodes;\n';
 function montar(caso,indice){
  const construtor=caso.codigo.match(/var (\w+) = WebApplication.CreateBuilder\(args\);/),aplicacao=caso.codigo.match(/var (\w+) = \w+\.Build\(\);/);
  assert(construtor&&aplicacao,caso.id);const nome=construtor[1],app=aplicacao[1],fim=app+'.Run();';
  assert(caso.codigo.trimEnd().endsWith(fim),caso.id+' precisa registrar antes de Run');
  const inicio='var '+nome+' = WebApplication.CreateBuilder(new WebApplicationOptions { Args = Array.Empty<string>(), EnvironmentName = Environments.Production, ContentRootPath = AppContext.BaseDirectory });\n'+nome+'.Configuration.Sources.Clear();\n'+nome+'.Configuration.AddInMemoryCollection();\n'+nome+'.WebHost.UseUrls("http://127.0.0.1:0");\n'+nome+'.Logging.ClearProviders();';
  const chamadas=caso.chamadas.map(c=>'new Chamada('+JSON.stringify(c.metodo)+', '+JSON.stringify(c.caminho)+', '+c.status+', '+(c.corpo===undefined?'null':JSON.stringify(JSON.stringify(c.corpo)))+', '+JSON.stringify(c.permitido)+')').join(',\n');
  const codigo=caso.codigo.replace(construtor[0],inicio).trimEnd().slice(0,-fim.length)+'await ConferirHttp('+app+', new Chamada[] {\n'+chamadas+'\n});';
  return 'static async Task Cenario'+indice+'() {\n'+codigo+'\n}';
 }
 const funcoes=casos.map(montar).join('\n'),chamadas=casos.map((c,i)=>'await Cenario'+i+'();\nConsole.WriteLine('+JSON.stringify('OK ASP.NET '+c.id)+');').join('\n');
 const comum=String.raw`static async Task ConferirHttp(WebApplication aplicacao, Chamada[] chamadas) {
    try {
        await aplicacao.StartAsync();
        var endereco = new Uri(aplicacao.Urls.Single());
        if (endereco.Scheme != "http" || endereco.Port <= 0 ||
            !IPAddress.TryParse(endereco.Host, out var ip) || !IPAddress.IsLoopback(ip))
            throw new Exception("servidor fora do loopback");
        using var cliente = new HttpClient(new SocketsHttpHandler { UseProxy = false }) {
            BaseAddress = endereco, Timeout = TimeSpan.FromSeconds(5)
        };
        foreach (var chamada in chamadas) {
            using var pedido = new HttpRequestMessage(new HttpMethod(chamada.Metodo), chamada.Caminho);
            using var resposta = await cliente.SendAsync(pedido);
            if ((int)resposta.StatusCode != chamada.Status)
                throw new Exception(chamada.Metodo + " " + chamada.Caminho + ": status " + (int)resposta.StatusCode);
            if (chamada.Permitido is not null && !resposta.Content.Headers.Allow.Contains(chamada.Permitido))
                throw new Exception("método permitido ausente");
            if (chamada.Corpo is not null) {
                if (resposta.Content.Headers.ContentType?.MediaType != "application/json")
                    throw new Exception("tipo do corpo incorreto");
                var obtido = JsonNode.Parse(await resposta.Content.ReadAsStringAsync());
                if (!JsonNode.DeepEquals(obtido, JsonNode.Parse(chamada.Corpo)))
                    throw new Exception("JSON divergente em " + chamada.Caminho);
            }
        }
    } finally {
        await aplicacao.StopAsync();
        await aplicacao.DisposeAsync();
    }
}
sealed record Chamada(string Metodo, string Caminho, int Status, string? Corpo = null, string? Permitido = null);
`;
 await writeFile(join(pasta,'Program.cs'),cabecalho+chamadas+'\n'+funcoes+'\n'+comum);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});if(resultado.error||resultado.status!==0)throw new Error('ASP.NET: '+(resultado.error?.message??resultado.stderr)+resultado.stdout);return resultado.stdout;};
 executar(['build',projeto,'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')]);
 const saida=executar([join(pasta,'bin','Release','net10.0','Rotas.dll')]);process.stdout.write(saida);assert.equal(saida.trim().split(/\r?\n/).length,casos.length);
 const rejeicoes=[
  {id:'retorno-antes-da-validacao',codigo:producao.lines.map(l=>l.code).join('\n'),erro:'CS0162'},
  {id:'aplicacao-antes-do-construtor',codigo:gabarito.replace('var construtor = WebApplication.CreateBuilder(args);\nvar aplicacao = construtor.Build();','var aplicacao = construtor.Build();\nvar construtor = WebApplication.CreateBuilder(args);'),erro:'CS0841'}
 ];
 for(const caso of rejeicoes){
  await writeFile(join(pasta,'Program.cs'),caso.codigo);
  const resultado=spawnSync('dotnet',['build',projeto,'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')],{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});
  if(resultado.error)throw resultado.error;assert.notEqual(resultado.status,0,caso.id);assert.match(resultado.stdout+resultado.stderr,new RegExp('error '+caso.erro+':'));
  console.log('OK ASP.NET '+caso.id+' '+caso.erro);
 }
 return casos.length+rejeicoes.length;
}

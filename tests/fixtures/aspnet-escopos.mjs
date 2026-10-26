import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';
import ts from 'typescript';

export async function verificarEscoposAspnet(raiz,atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('aspnet-di-prever-instancias'),diagnostico=atividade('aspnet-di-corrigir-captura'),montagem=atividade('aspnet-di-montar-escopo');
 function separar(codigo){const semImports=codigo.replace(/^using [\w.]+;\r?\n/gm,'');const indice=semImports.indexOf('\nsealed class ');assert(indice>=0,'tipos de apoio devem continuar explícitos');return {corpo:semImports.slice(0,indice),tipos:semImports.slice(indice+1)};}
 const prever=separar(previsao.code),quebrado=separar(diagnostico.code),correto=separar(obterSolucao(diagnostico.id)),montado=separar(obterSolucao(montagem.id));
 assert.equal(quebrado.tipos,correto.tipos);assert.equal(montado.tipos.trim(),montagem.code.trim());
 const fonte=ts.createSourceFile('curriculum.ts',await readFile('src/content/curriculum.ts','utf8'),ts.ScriptTarget.ESNext,true);
 let aula;
 function visitar(no){if(ts.isArrayLiteralExpression(no)&&no.elements.length>0&&ts.isStringLiteral(no.elements[0])&&no.elements[0].text==='aspnet-di')aula=no;ts.forEachChild(no,visitar);}
 visitar(fonte);assert(aula&&ts.isStringLiteralLike(aula.elements[3]),'exemplo original deve continuar literal');
 const exemplo=aula.elements[3].text,depoisBuild='\n// Depois de Build:\n',depoisTipos='\n// Ao final do arquivo:\n';
 assert(exemplo.includes(depoisBuild)&&exemplo.includes(depoisTipos));
 const registros=exemplo.slice(0,exemplo.indexOf(depoisBuild)),endpoint=exemplo.slice(exemplo.indexOf(depoisBuild)+depoisBuild.length,exemplo.indexOf(depoisTipos)),calculadora=exemplo.slice(exemplo.indexOf(depoisTipos)+depoisTipos.length);
 const original="var builder = WebApplication.CreateBuilder(new WebApplicationOptions { Args = [], EnvironmentName = \"Production\", ContentRootPath = @PASTA@ });"+'\n'+"builder.Configuration.Sources.Clear();"+'\n'+"builder.Configuration.AddInMemoryCollection();"+'\n'+"builder.WebHost.UseUrls(\"http://127.0.0.1:0\");"+'\n'+"builder.Logging.ClearProviders();"+'\n'+registros+'\n'+"using var app = builder.Build();"+'\n'+"var observadas = new System.Collections.Generic.List<Calculadora>();"+'\n'+"app.Use(async (contexto, proximo) => {"+'\n'+"    var primeira = contexto.RequestServices.GetRequiredService<Calculadora>();"+'\n'+"    if (!object.ReferenceEquals(primeira, contexto.RequestServices.GetRequiredService<Calculadora>())) throw new Exception(\"resoluções do pedido divergiram\");"+'\n'+"    observadas.Add(primeira);"+'\n'+"    await proximo();"+'\n'+"});"+'\n'+endpoint+'\n'+"using var inicio = new CancellationTokenSource(TimeSpan.FromSeconds(10));"+'\n'+"app.StartAsync(inicio.Token).GetAwaiter().GetResult();"+'\n'+"try {"+'\n'+"    var endereco = new Uri(app.Urls.Single());"+'\n'+"    if (!endereco.IsLoopback || endereco.Port <= 0) throw new Exception(\"host fora do loopback\");"+'\n'+"    using var cliente = new HttpClient(new HttpClientHandler { UseProxy = false }) { Timeout = TimeSpan.FromSeconds(5) };"+'\n'+"    foreach (var caso in new[] { (a: 2, b: 3, esperado: 5), (a: 0, b: -4, esperado: -4) }) {"+'\n'+"        using var resposta = cliente.GetAsync(new Uri(endereco, \"/soma?a=\" + caso.a + \"&b=\" + caso.b)).GetAwaiter().GetResult();"+'\n'+"        if (resposta.StatusCode != HttpStatusCode.OK || resposta.Content.Headers.ContentType?.MediaType != \"application/json\") throw new Exception(\"contrato HTTP original\");"+'\n'+"        using var json = JsonDocument.Parse(resposta.Content.ReadAsStringAsync().GetAwaiter().GetResult());"+'\n'+"        if (json.RootElement.GetInt32() != caso.esperado) throw new Exception(\"soma divergente\");"+'\n'+"    }"+'\n'+"    if (observadas.Count != 2 || object.ReferenceEquals(observadas[0], observadas[1])) throw new Exception(\"pedidos compartilharam calculadora\");"+'\n'+"} finally {"+'\n'+"    using var parada = new CancellationTokenSource(TimeSpan.FromSeconds(10));"+'\n'+"    app.StopAsync(parada.Token).GetAwaiter().GetResult();"+'\n'+"}"+'\n'+"Console.WriteLine(\"registro original e duas requisições conferidos\");";
 const ordem=montagem.lines.map(linha=>linha.id),codigoOrdem=ids=>ids.map(id=>{const linha=montagem.lines.find(item=>item.id===id);assert(linha,id);return linha.code;}).join('\n');
 const alternativa=['colecao','relatorio','recurso','provedor','escopo','resolver','usar','fechar'];
 const troca=(codigo,antes,depois)=>{assert(codigo.includes(antes),antes);return codigo.replace(antes,depois);};
 const aposDescarte=troca(troca(troca(montado.corpo,'using (var escopo = provedor.CreateScope()) {','RelatorioPedido emprestado;\nusing (var escopo = provedor.CreateScope()) {'),'var relatorio =','emprestado ='),'Console.WriteLine(relatorio.Ler());','Console.WriteLine(emprestado.Ler());')+'\nemprestado.Ler();';
 const casos=[
  {id:'registro-e-calculadora-originais',codigo:original,saida:['registro original e duas requisições conferidos']},
  {id:'scoped-reutiliza-dentro-e-isola-fora',codigo:prever.corpo,saida:obterSolucao(previsao.id).split('\n')},
  {id:'transient-nao-reutiliza-a-outra-resolucao',codigo:troca(prever.corpo,'AddScoped<ContadorPedido>','AddTransient<ContadorPedido>'),saida:['False','0','0']},
  {id:'singleton-compartilha-entre-escopos',codigo:troca(prever.corpo,'AddScoped<ContadorPedido>','AddSingleton<ContadorPedido>'),saida:['True','1','1']},
  {id:'valida-captura-scoped-no-build',codigo:quebrado.corpo,saida:[],erro:'AggregateException'},
  {id:'resumo-scoped-recomeca-por-pedido',codigo:correto.corpo,saida:['1','2','1']},
  {id:'silenciar-validacao-nao-isola-pedidos',codigo:troca(quebrado.corpo,'ValidateScopes = true','ValidateScopes = false'),saida:['1','2','3']},
  {id:'estado-singleton-mantem-compartilhamento',codigo:troca(quebrado.corpo,'AddScoped<EstadoPedido>','AddSingleton<EstadoPedido>'),saida:['1','2','3']},
  {id:'transient-capturado-continua-retido',codigo:troca(quebrado.corpo,'AddScoped<EstadoPedido>','AddTransient<EstadoPedido>'),saida:['1','2','3']},
  {id:'montagem-principal-usa-e-descarta',codigo:montado.corpo,saida:['7','liberado']},
  {id:'registros-independentes-podem-inverter',codigo:codigoOrdem(alternativa),saida:['7','liberado']},
  {id:'registro-tardio-nao-altera-provedor',codigo:codigoOrdem(ordem),saida:[],erro:'InvalidOperationException'},
  {id:'raiz-nao-substitui-provedor-do-escopo',codigo:troca(montado.corpo,'escopo.ServiceProvider.GetRequiredService<RelatorioPedido>()','provedor.GetRequiredService<RelatorioPedido>()'),saida:[],erro:'InvalidOperationException'},
  {id:'excecao-no-trabalho-conserva-descarte',codigo:troca(montado.corpo,'Console.WriteLine(relatorio.Ler());','Console.WriteLine(relatorio.Ler());\n    throw new IOException("interrupção controlada");'),saida:['7','liberado'],erro:'IOException'},
  {id:'escopo-vazio-nao-cria-recurso',codigo:troca(troca(montado.corpo,'    var relatorio = escopo.ServiceProvider.GetRequiredService<RelatorioPedido>();',''),'    Console.WriteLine(relatorio.Ler());',''),saida:[]},
  {id:'referencia-nao-prolonga-recurso-descartado',codigo:aposDescarte,saida:['7','liberado'],erro:'ObjectDisposedException'}
 ];
 const conferir=[
  'static void Conferir(string nome, Action executar, string esperada, Type? tipoErro) {',
  '    var original = Console.Out;',
  '    using var captura = new StringWriter();',
  '    Exception? falha = null;',
  '    try { Console.SetOut(captura); executar(); }',
  '    catch (Exception erro) { falha = erro; }',
  '    finally { Console.SetOut(original); }',
  '    string obtida = captura.ToString().Replace("\\r\\n", "\\n");',
  '    if (obtida != esperada) throw new Exception(nome + ": saída divergente: " + obtida);',
  '    if (tipoErro is null && falha is not null) throw new Exception(nome + ": falha inesperada", falha);',
  '    if (tipoErro is not null && falha?.GetType() != tipoErro) throw new Exception(nome + ": tipo de falha divergente", falha);',
  '    if (falha is AggregateException conjunto && !conjunto.Flatten().InnerExceptions.Any(erro => erro is InvalidOperationException)) throw new Exception(nome + ": falha não corresponde à configuração");',
  '    Console.WriteLine("OK escopos ASP.NET " + nome);',
  '}'
 ].join('\n');
 const pasta=join(raiz,'aspnet-escopos');await mkdir(pasta);
 await writeFile(join(pasta,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
 const projeto=join(pasta,'Escopos.csproj');
 await writeFile(projeto,'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><LangVersion>14.0</LangVersion><ImplicitUsings>disable</ImplicitUsings><Nullable>enable</Nullable><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup><ItemGroup><FrameworkReference Include="Microsoft.AspNetCore.App" /></ItemGroup></Project>');
 const cabecalho='using System;\nusing System.IO;\nusing System.Linq;\nusing System.Net;\nusing System.Net.Http;\nusing System.Text.Json;\nusing System.Threading;\nusing Microsoft.AspNetCore.Hosting;\nusing Microsoft.Extensions.Configuration;\nusing Microsoft.AspNetCore.Builder;\nusing Microsoft.Extensions.DependencyInjection;\nusing Microsoft.Extensions.Logging;\n';
 const funcoes=casos.map((caso,indice)=>'static void Cenario'+indice+'() {\n'+caso.codigo.replaceAll('@PASTA@',JSON.stringify(pasta))+'\n}').join('\n');
 const chamadas=casos.map((caso,indice)=>'Conferir('+JSON.stringify(caso.id)+', Cenario'+indice+', '+JSON.stringify(caso.saida.length?caso.saida.join('\n')+'\n':'')+', '+(caso.erro?'typeof('+caso.erro+')':'null')+');').join('\n');
 await writeFile(join(pasta,'Program.cs'),cabecalho+chamadas+'\n'+funcoes+'\n'+conferir+'\n'+[calculadora,prever.tipos,correto.tipos,montado.tipos].join('\n'));
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:pasta,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const executar=argumentos=>{
  const etapa=argumentos[0]==='build'?'compilação':'execução',inicio=Date.now();
  process.stdout.write('Escopos ASP.NET: iniciando '+etapa+'\n');
  const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});
  if(resultado.error||resultado.status!==0)throw new Error('Escopos ASP.NET: '+etapa+' após '+(Date.now()-inicio)+' ms: '+(resultado.error?.message??resultado.stderr)+resultado.stdout);
  return resultado.stdout;
 };
 executar(['build',projeto,'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(pasta,'NuGet.Config')]);
 const saida=executar([join(pasta,'bin','Release','net10.0','Escopos.dll')]);process.stdout.write(saida);assert.equal(saida.trim().split(/\r?\n/).length,casos.length);
 return casos.length;
}

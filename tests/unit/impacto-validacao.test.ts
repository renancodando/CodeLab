import {it,expect} from 'vitest';
import {selecionarImpacto,idsDoConteudo,idsNoDiff,aulasModificadas} from '../../scripts/impacto-validacao.mjs';
const catalogo={unidades:['tests/unit/practice.test.ts','tests/unit/aspnet-escopos.test.ts','tests/unit/execution.test.ts','tests/unit/impacto-validacao.test.ts'],navegador:['tests/e2e/aspnet-escopos.spec.ts','tests/e2e/csharp-excecoes.spec.ts'],textos:{'tests/unit/aspnet-escopos.test.ts':'aspnet-di-prever-instancias','tests/e2e/aspnet-escopos.spec.ts':'aspnet-di'}};
it('documentação não instala runtimes nem exige build, tipos ou navegador',()=>{
 const plano=selecionarImpacto(['docs/continuidade.md','README.md'],[],catalogo);
 expect(plano).toMatchObject({produto:false,tipos:false,smoke:false,dotnet:false,postgres:false,unidades:[],navegador:[]});
});
it('mudança no teste de backup seleciona apenas seu arquivo e não recompila exemplos',()=>{
 const plano=selecionarImpacto(['tests/e2e/csharp-excecoes.spec.ts','docs/continuidade.md'],[],catalogo);
 expect(plano.navegador).toEqual(['tests/e2e/csharp-excecoes.spec.ts']);expect(plano.unidades).toEqual([]);expect(plano.familias).toEqual([]);expect(plano.tipos).toBe(false);expect(plano.smoke).toBe(false);
});
it('três atividades de uma aula não puxam o catálogo inteiro de testes',()=>{
 const plano=selecionarImpacto(['src/content/practice.ts'],['aspnet-di-prever-instancias','aspnet-di'],catalogo);
 expect(plano.unidades).toEqual(['tests/unit/aspnet-escopos.test.ts','tests/unit/practice.test.ts']);expect(plano.navegador).toEqual(['tests/e2e/aspnet-escopos.spec.ts']);expect(plano.familias).toEqual(['aspnet-escopos']);expect(plano.dotnet).toBe(true);expect(plano.postgres).toBe(false);
});
it('correção de teoria estática dispensa navegador e compilação nativa',()=>{
 const plano=selecionarImpacto(['src/content/explicacoes.ts'],['aspnet-di'],catalogo);
 expect(plano).toMatchObject({conteudo:true,tipos:true,navegador:[],familias:[],smoke:false});
});
it('alteração no executor mantém os contratos de isolamento e smoke',()=>{
 const plano=selecionarImpacto(['src/execution/executor.ts'],[],catalogo);
 expect(plano.unidades).toContain('tests/unit/execution.test.ts');
 expect(plano).toMatchObject({smoke:true,api:true,dotnet:true,dev:false});
});
it('uma alteração desconhecida do produto não desaparece da validação',()=>{expect(selecionarImpacto(['src/novo-modulo.ts'],[],catalogo).smoke).toBe(true);});
it('mudanças de CSS reservam a conferência de compatibilidade',()=>{expect(selecionarImpacto(['src/styles.css'],[],catalogo)).toMatchObject({compatibilidade:true,smoke:true});});
it('o verificador alterado recebe uma família real de referência',()=>{expect(selecionarImpacto(['scripts/verify-content-examples.mjs'],[],catalogo)).toMatchObject({familias:['aspnet-escopos'],dotnet:true,postgres:false});});
it('índices JSON gerados não são confundidos com documentação dispensável',()=>{expect(selecionarImpacto(['docs/cobertura-curriculo.json'],[],catalogo).conteudo).toBe(true);});
it('a leitura estática não confunde peças da ordenação com atividades',()=>{
 const ids=idsDoConteudo(["const atividades=[{id:'aspnet-di-ordenar',lessonIds:['aspnet-di'],lines:[{id:'usar',code:'Usar();'}]}];"]);
 expect([...ids]).toEqual(['aspnet-di-ordenar','aspnet-di']);
 expect(idsNoDiff('+++ b/arquivo\n contexto aspnet-di\n+ {id: \'aspnet-di-ordenar\'}',ids)).toEqual(['aspnet-di-ordenar']);
 expect(idsNoDiff(' contexto aspnet-di',ids)).toEqual([]);
});

it('conteúdo web não seleciona uma família nativa inexistente',()=>{
 for(const linguagem of ['html','css','javascript','index','types']){
  const plano=selecionarImpacto(['src/content/deep/'+linguagem+'.ts'],[],catalogo);
  expect(plano.familias).toEqual([]);expect(plano.unidades).toContain('tests/unit/practice.test.ts');
 }
});

it('menções em prosa não selecionam aulas com IDs curtos',()=>{
 const conhecidos=new Set(['http','armazenamento','aspnet-dto']);
 const linha='+ {id:"aspnet-dto",prompt:"O contrato http exige armazenamento e não é uma aula de rede."}';
 expect(idsNoDiff(linha,conhecidos)).toEqual(['aspnet-dto']);
});

it('gabaritos de missão recebem execução comportamental sem puxar o navegador',()=>{
 const plano=selecionarImpacto(['src/content/missions.ts'],[],catalogo);
 expect(plano).toMatchObject({conteudo:true,unidades:['tests/unit/execution.test.ts'],navegador:[],smoke:false,familias:[]});
});
it('soluções SQL recebem SQLite e a referência PostgreSQL afetada',()=>{
 const testes={...catalogo,unidades:[...catalogo.unidades,'tests/unit/sql-pratica.test.ts']};
 const plano=selecionarImpacto(['src/content/solucoes-sql.ts'],[],testes);
 expect(plano).toMatchObject({unidades:['tests/unit/sql-pratica.test.ts'],familias:['sql-pratica'],postgres:true,dotnet:false,navegador:[]});
});

it('mudanças no backend meteorológico mantêm seus contratos nativos',()=>{
 for(const arquivo of ['server/Meteorologia.cs','server/CodeLab.Api.csproj','tests/meteorologia-api/Program.cs'])expect(selecionarImpacto([arquivo],[],catalogo)).toMatchObject({meteorologia:true,dotnet:true});
 expect(selecionarImpacto(['server/ExecutionQueue.cs'],[],catalogo).meteorologia).toBe(false);
});
it('concorrência SQL mantém conexões PostgreSQL distintas quando afetada',()=>{
 expect(selecionarImpacto(['src/content/deep/sql.ts'],[],catalogo)).toMatchObject({concorrenciaSql:true,postgres:true});
 expect(selecionarImpacto(['scripts/verify-sql-concurrency.mjs'],[],catalogo)).toMatchObject({concorrenciaSql:true,postgres:true,smoke:false});
 expect(selecionarImpacto(['src/content/solucoes-sql.ts'],[],catalogo).concorrenciaSql).toBe(false);
});
it('imports diretos cobrem contratos com nome diferente do módulo',()=>{
 const testes={...catalogo,unidades:['tests/unit/sql-pratica.test.ts'],textos:{'tests/unit/sql-pratica.test.ts':"import {conferirConsultaSql} from '../../src/learning/pratica-sql';"}};
 expect(selecionarImpacto(['src/learning/pratica-sql.ts'],[],testes)).toMatchObject({unidades:['tests/unit/sql-pratica.test.ts'],familias:['sql-pratica'],postgres:true});
});

it('IDs de aulas não selecionam testes de outras aulas por prefixo',()=>{
 const testes={...catalogo,navegador:['tests/e2e/independent-practice.spec.ts','tests/e2e/api.spec.ts','tests/e2e/sql-join.spec.ts'],textos:{
  'tests/e2e/independent-practice.spec.ts':"const aulas=['sql-joins-cardinalidade'];",
  'tests/e2e/api.spec.ts':"request.get(base+'/api/licoes/sql-join')",
  'tests/e2e/sql-join.spec.ts':"pagina.goto('/#/aula/sql-join')"
 }};
 expect(selecionarImpacto(['src/content/practice.ts'],['sql-join'],testes).navegador).toEqual(['tests/e2e/api.spec.ts','tests/e2e/sql-join.spec.ts']);
});
it('alterar a aula mantém os testes que só mencionam suas atividades',()=>{
 const testes={...catalogo,navegador:['tests/e2e/sql-join.spec.ts'],textos:{'tests/e2e/sql-join.spec.ts':'sql-join-depurar-titulos'}};
 expect(selecionarImpacto(['src/learning/practice.ts'],['sql-join'],testes).navegador).toEqual(['tests/e2e/sql-join.spec.ts']);
});
it('o limite do ID distingue palavras e mantém extensões conservadoras por hífen',()=>{
 const nomes=['rota','seletor','prefixo','sufixo','palavra','quase'],navegador=nomes.map(nome=>'tests/e2e/'+nome+'.spec.ts');
 const textos=Object.fromEntries(navegador.map((arquivo,indice)=>[arquivo,["'/#/aula/sql-join'",'`[data-lesson="sql-join"]`',"'outro-sql-join'","'sql-join-extra'","'outrosql-join'","'sql-joins'"][indice]]));
 expect(selecionarImpacto(['src/content/practice.ts'],['sql-join'],{...catalogo,navegador,textos}).navegador).toEqual(['tests/e2e/rota.spec.ts','tests/e2e/seletor.spec.ts','tests/e2e/sufixo.spec.ts']);
});

it('uma família explícita de C++ impede acrescentar referências .NET sem relação',()=>{
 for(const arquivos of [
  ['scripts/verify-content-examples.mjs','tests/fixtures/cpp-texto.mjs'],
  ['tests/fixtures/cpp-texto.mjs','scripts/verify-content-examples.mjs']
 ])expect(selecionarImpacto(arquivos,[],catalogo)).toMatchObject({familias:['cpp-texto'],postgres:false});
});

it('planejamento e árvore usam seus contratos sem recompilar exemplos por imports de preparação',()=>{
 const unidades=['adaptive','hub-catalog','catalogo-linguagens','hub-backup','progress-migration','practice','execution','ordem-diaria','cpp-conceitos'].map(nome=>'tests/unit/'+nome+'.test.ts');
 const navegador=['learning-hub','ordem-diaria','sql-null'].map(nome=>'tests/e2e/'+nome+'.spec.ts');
 const testes={unidades,navegador,textos:{'tests/unit/cpp-conceitos.test.ts':"import {idPreparacao} from '../../src/learning/hub-catalog';",'tests/e2e/sql-null.spec.ts':"import {idPreparacao} from '../../src/learning/hub-catalog';"}};
 for(const arquivo of ['src/learning/adaptive.ts','src/learning/hub-catalog.ts','src/learning/hub-ui.ts']){
  const plano=selecionarImpacto([arquivo],[],testes);
  expect(plano.unidades).toEqual(unidades.filter(p=>!p.includes('cpp-conceitos')).sort());
  expect(plano.navegador).toEqual(navegador.filter(p=>!p.includes('sql-null')).sort());
  expect(plano.familias).toEqual([]);expect(plano.postgres).toBe(false);
 }
 const nativo=selecionarImpacto(['src/learning/hub-catalog.ts','tests/fixtures/sql-null.mjs'],[],testes);
 expect(nativo.familias).toContain('sql-null');expect(nativo.postgres).toBe(true);expect(nativo.navegador).toContain('tests/e2e/sql-null.spec.ts');
});
it('testes específicos alterados continuam selecionados junto com o planejamento',()=>{
 const arquivo='tests/unit/meu-contrato.test.ts';
 const plano=selecionarImpacto(['src/learning/adaptive.ts',arquivo],[],{...catalogo,unidades:[...catalogo.unidades,arquivo]});
 expect(plano.unidades).toContain(arquivo);expect(plano.unidades).toContain('tests/unit/execution.test.ts');
});

it('alterações no carregador mantêm integração nativa e corretores novos conferem seus imports',()=>{
 const testes={...catalogo,unidades:[...catalogo.unidades,'tests/unit/carregamento-praticas.test.ts']};
 for(const arquivo of ['scripts/carregar-praticas.mjs','scripts/verify-content-examples.mjs']){
  const plano=selecionarImpacto([arquivo],[],testes);expect(plano.unidades).toContain('tests/unit/carregamento-praticas.test.ts');expect(plano.familias).toEqual(['aspnet-escopos']);
 }
 for(const arquivo of ['src/learning/practice.ts','src/content/contratos-integracao.ts','src/content/contratos-projetos.ts'])expect(selecionarImpacto([arquivo],[],testes).unidades).toContain('tests/unit/carregamento-praticas.test.ts');
});

it('projeto API recebe somente sua referência C#/SQLite, não PostgreSQL',()=>{
 const testes={...catalogo,unidades:[...catalogo.unidades,'tests/unit/projeto-api.test.ts'],navegador:[...catalogo.navegador,'tests/e2e/projeto-api.spec.ts'],textos:{...catalogo.textos,'tests/unit/projeto-api.test.ts':'api-prever-transacao','tests/e2e/projeto-api.spec.ts':'projeto-api'}};
 const plano=selecionarImpacto(['src/content/practice.ts'],['projeto-api','api-prever-transacao'],testes);expect(plano.familias).toEqual(['projeto-api']);expect(plano).toMatchObject({dotnet:true,postgres:false});
 expect(selecionarImpacto(['tests/fixtures/projeto-api.mjs'],[],testes).familias).toEqual(['projeto-api']);
});

it('identifica a aula editada sem depender de seu ID aparecer na linha do diff',()=>{
 const antes='export default {title:"HTML",lessons:[{id:"html-a",summary:"Antes",sections:[]},{id:"html-b",summary:"B",sections:[]}]};';
 expect(aulasModificadas(antes,antes.replace('Antes','Depois'))).toEqual(['html-a']);
 const multiplas=antes.replace('lessons:[','lessons:[\n');expect(aulasModificadas(multiplas,multiplas.replaceAll('\n','\r\n'))).toEqual([]);
 expect(aulasModificadas(antes,antes.replace('title:"HTML"','title:"Outra estrutura"'))).toBeNull();
 expect(aulasModificadas(antes,antes+'export const efeito=1;')).toBeNull();
});
it('recorta dados HTML/CSS por aula e conserva os contratos gerais do catálogo',()=>{
 const modulo='src/content/deep/html.ts',proprios='tests/e2e/plataforma-web.spec.ts',alheios='tests/e2e/independent-practice.spec.ts';
 const dados={unidades:['tests/unit/practice.test.ts','tests/unit/expanded-content.test.ts','tests/unit/html-arvore.test.ts'],navegador:[proprios,alheios],textos:{[proprios]:"import html from '../../src/content/deep/html'; 'html-plataforma';",[alheios]:"import html from '../../src/content/deep/html'; 'html-outra';",'tests/unit/html-arvore.test.ts':"import html from '../../src/content/deep/html'; 'html-arvore';"},aulasPorModulo:{[modulo]:['html-plataforma']}};
 const plano=selecionarImpacto([modulo],[],dados);
 expect(plano.navegador).toEqual([proprios]);expect(plano.unidades).toEqual(['tests/unit/expanded-content.test.ts','tests/unit/practice.test.ts']);expect(plano.familias).toEqual([]);
 const amplo=selecionarImpacto([modulo],[],{...dados,aulasPorModulo:{}});expect(amplo.navegador).toContain(alheios);expect(amplo.unidades).toContain('tests/unit/html-arvore.test.ts');
});

it('genéricos TypeScript selecionam só sua família nativa, sem PostgreSQL ou .NET',()=>{
 const plano=selecionarImpacto(['tests/fixtures/typescript-genericos.mjs'],[],{unidades:['tests/unit/typescript-genericos.test.ts'],navegador:['tests/e2e/typescript-genericos.spec.ts'],textos:{}});
 expect(plano.familias).toEqual(['typescript-genericos']);expect(plano.dotnet).toBe(false);expect(plano.postgres).toBe(false);expect(plano.navegador).toEqual(['tests/e2e/typescript-genericos.spec.ts']);
});

it('contratos avançados C# usam .NET sem puxar PostgreSQL ou outras famílias',()=>{
 const plano=selecionarImpacto(['tests/fixtures/csharp-avancado.mjs'],[],{unidades:['tests/unit/csharp-avancado.test.ts'],navegador:['tests/e2e/csharp-avancado.spec.ts'],textos:{}});
 expect(plano.familias).toEqual(['csharp-avancado']);expect(plano.dotnet).toBe(true);expect(plano.postgres).toBe(false);expect(plano.navegador).toEqual(['tests/e2e/csharp-avancado.spec.ts']);
});
it('concorrência C++ usa só sua família nativa sem PostgreSQL ou .NET',()=>{
 const plano=selecionarImpacto(['tests/fixtures/cpp-concorrencia.mjs'],[],{unidades:['tests/unit/cpp-concorrencia.test.ts'],navegador:['tests/e2e/cpp-concorrencia.spec.ts'],textos:{}});
 expect(plano.familias).toEqual(['cpp-concorrencia']);expect(plano.dotnet).toBe(false);expect(plano.postgres).toBe(false);expect(plano.navegador).toEqual(['tests/e2e/cpp-concorrencia.spec.ts']);
});
it('SQL avançado seleciona PostgreSQL e só a família afetada',()=>{
 const plano=selecionarImpacto(['tests/fixtures/sql-avancado.mjs'],[],{unidades:['tests/unit/sql-avancado.test.ts'],navegador:['tests/e2e/sql-avancado.spec.ts'],textos:{}});
 expect(plano.familias).toEqual(['sql-avancado']);expect(plano.postgres).toBe(true);expect(plano.dotnet).toBe(false);expect(plano.navegador).toEqual(['tests/e2e/sql-avancado.spec.ts']);
});

it('percursos e projetos preservam a conferência ZIP sem compiladores alheios',()=>{
 const nativo='tests/unit/project-archive.test.ts',testes={unidades:['tests/unit/projects.test.ts',nativo],navegador:[],textos:{[nativo]:"import {capstoneProjects} from '../../src/content/project-paths'; import {createProjectArchive} from '../../src/learning/project-archive';"}};
 for(const arquivo of ['src/content/project-paths.ts','src/learning/project-archive.ts']){
  const plano=selecionarImpacto([arquivo],[],testes);expect(plano.unidades).toContain(nativo);expect(plano.familias).toEqual(['project-archive']);expect(plano.dotnet).toBe(arquivo.startsWith('src/learning/'));expect(plano.api).toBe(arquivo.startsWith('src/learning/'));expect(plano.postgres).toBe(false);
 }
});

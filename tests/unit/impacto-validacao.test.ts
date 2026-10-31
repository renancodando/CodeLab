import {it,expect} from 'vitest';
import {selecionarImpacto,idsDoConteudo,idsNoDiff} from '../../scripts/impacto-validacao.mjs';
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

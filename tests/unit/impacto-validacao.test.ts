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
 expect(plano.smoke).toBe(true);
});
it('uma alteração desconhecida do produto não desaparece da validação',()=>{expect(selecionarImpacto(['src/novo-modulo.ts'],[],catalogo).smoke).toBe(true);});
it('mudanças de CSS reservam a conferência de compatibilidade',()=>{expect(selecionarImpacto(['src/styles.css'],[],catalogo)).toMatchObject({compatibilidade:true,smoke:true});});
it('o verificador alterado recebe uma família real de referência',()=>{expect(selecionarImpacto(['scripts/verify-content-examples.mjs'],[],catalogo)).toMatchObject({familias:['aspnet-escopos'],dotnet:true,postgres:false});});
it('índices JSON gerados não são confundidos com documentação dispensável',()=>{expect(selecionarImpacto(['docs/cobertura-curriculo.json'],[],catalogo).conteudo).toBe(true);});
it('a leitura estática não confunde peças da ordenação com atividades',()=>{
 const ids=idsDoConteudo(["const atividades=[{id:'aspnet-di-ordenar',lessonIds:['aspnet-di'],lines:[{id:'usar',code:'Usar();'}]}];"]);
 expect([...ids]).toEqual(['aspnet-di-ordenar','aspnet-di']);
 expect(idsNoDiff('+++ b/arquivo\n contexto aspnet-di\n+ {id: \'aspnet-di-ordenar\'}',ids)).toEqual(['aspnet-di-ordenar','aspnet-di']);
 expect(idsNoDiff(' contexto aspnet-di',ids)).toEqual([]);
});

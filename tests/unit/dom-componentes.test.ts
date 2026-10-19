import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

it('componentes preserva a aula e o projeto e prepara as decisões DOM com execução JavaScript',()=>{
 const aula=lessons.find(item=>item.id==='componentes')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);expect(pausas.map(item=>item.afterBlock)).toEqual([3,6,8]);
 expect(pausas.map(item=>item.language)).toEqual(['html','html','javascript']);
 expect(aula.capitulos.find(item=>item.id==='projeto')?.paragrafos.join(' ')).toContain('painel reutilizável');
 const estado=freshAdaptive(),preparacao=idPreparacao(aula.id);
 estado.seenConcepts=adaptiveCatalog.activities.filter(item=>item.kind==='concept'&&item.id!==preparacao).map(item=>item.id);
 expect(buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'html'},{now:Date.parse('2026-10-19T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([preparacao,...pausas.map(item=>item.id)]);
 expect(estado.skills).toEqual({});
});
it('a previsão separa estado por montagem de conexão com a árvore',async()=>{
 expect(await evaluatePractice('html-componentes-prever-desconexao',' 2\r\n1\r\nfalse ')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['1\n1\nfalse','2\n2\nfalse','2\n1\ntrue','2 1 false'])expect((await evaluatePractice('html-componentes-prever-desconexao',resposta)).passed).toBe(false);
});
it('o código inicial recebe diagnóstico executado em vez de falha de inicialização',async()=>{
 const inicial=practicesForLesson('componentes').find(atividade=>atividade.id==='js-componentes-descarte-unico')!.code!;
 const resultado=await evaluatePractice('js-componentes-descarte-unico',inicial);
 expect(resultado).toMatchObject({passed:false,status:'evaluated',evidence:'executed',execution:'quickjs'});
 expect(resultado.feedback).toContain('ordem inversa');
});
it('o descarte precisa remover a referência e a captura do registro certo',async()=>{
 for(const resposta of ['captura','nova-funcao','']){
  const resultado=await evaluatePractice('html-componentes-remover-listener',resposta);
  expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(getPracticeSolution('html-componentes-remover-listener')!);
 }
 expect(await evaluatePractice('html-componentes-remover-listener','referencia')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each([
 ['referência',getPracticeSolution('js-componentes-descarte-unico')!],
 ['cópia invertida','function criarDescarte(limpezas){let feito=false;return()=>{if(feito)return;feito=true;[...limpezas].reverse().forEach(limpar=>limpar());};}'],
 ['reduceRight','function criarDescarte(limpezas){let ativo=true;return()=>{if(!ativo)return;ativo=false;limpezas.reduceRight((_,limpar)=>{limpar();return null;},null);};}']
])('executa o descarte equivalente: %s',async(_,codigo)=>{
 expect(await evaluatePractice('js-componentes-descarte-unico',codigo)).toMatchObject({passed:true,evidence:'executed',execution:'quickjs'});
});
it.each([
 ['ordem de aquisição','function criarDescarte(limpezas){let feito=false;return()=>{if(feito)return;feito=true;limpezas.forEach(limpar=>limpar());};}'],
 ['repete efeitos','function criarDescarte(limpezas){return()=>{for(let i=limpezas.length-1;i>=0;i--)limpezas[i]();};}'],
 ['muta o array','function criarDescarte(limpezas){let feito=false;return()=>{if(feito)return;feito=true;limpezas.reverse().forEach(limpar=>limpar());};}'],
 ['libera durante montagem','function criarDescarte(limpezas){for(let i=limpezas.length-1;i>=0;i--)limpezas[i]();return()=>{};}'],
 ['marca depois dos callbacks','function criarDescarte(limpezas){let feito=false;return()=>{if(feito)return;for(let i=limpezas.length-1;i>=0;i--)limpezas[i]();feito=true;};}'],
 ['compartilha a marca','let feito=false;function criarDescarte(limpezas){return()=>{if(feito)return;feito=true;for(let i=limpezas.length-1;i>=0;i--)limpezas[i]();};}'],
 ['deduplica posições','function criarDescarte(limpezas){let feito=false;return()=>{if(feito)return;feito=true;[...new Set(limpezas)].reverse().forEach(limpar=>limpar());};}'],
 ['ignora os callbacks','function criarDescarte(){return()=>{};}']
])('o corretor rejeita descarte defeituoso: %s',async(_,codigo)=>{
 const resultado=await evaluatePractice('js-componentes-descarte-unico',codigo);
 expect(resultado.passed).toBe(false);expect(resultado.evidence).toBe('executed');
 expect(resultado.feedback).not.toContain(getPracticeSolution('js-componentes-descarte-unico')!);
});

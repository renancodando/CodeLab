import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import html from '../../src/content/deep/html';

const prever='html-documentos-prever-arvore',diagnosticar='html-documentos-habilitar-controle',montar='html-documentos-montar-guia';
it('distingue recuperação do parser, pai real e texto retido',async()=>{
 const certa=await evaluatePractice(prever,'  P|SECTION|P\r\nMAIN\r\nAntes  ');
 expect(certa).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['P\nP\nAntesPraticarDepois','P|SECTION\nMAIN\nAntes','P|SECTION|P\nP\nAntes','P|SECTION|P\nMAIN\nAntesDepois']){
  const erro=await evaluatePractice(prever,resposta);expect(erro.passed).toBe(false);expect(erro.feedback).toContain('fechamento');expect(erro.feedback).not.toContain('P|SECTION|P');
 }
});
it('o diagnóstico verifica presença do atributo, sem confundir ARIA com comportamento',async()=>{
 const pausa=practicesForLesson('html-documentos').find(p=>p.id===diagnosticar)!;
 for(const opcao of pausa.options!){
  const resultado=await evaluatePractice(diagnosticar,opcao.id);
  expect(resultado.passed).toBe(opcao.id==='ausente');expect(resultado.execution).toBe('not-run');
  if(!resultado.passed){expect(resultado.feedback).toContain('comportamento nativo');expect(resultado.feedback).not.toContain('<button');}
 }
});
it('aceita duas ordens de seções e recusa as outras permutações de contêineres',async()=>{
 const ids=['inicio','pratica','revisao','fim'];
 function permutar(linhas:string[]):string[][]{return linhas.length?linhas.flatMap((linha,i)=>permutar(linhas.filter((_,j)=>j!==i)).map(resto=>[linha,...resto])):[[]];}
 const aprovadas:string[][]=[];
 for(const ordem of permutar(ids))if((await evaluatePractice(montar,ordem)).passed)aprovadas.push(ordem);
 expect(aprovadas).toEqual([['inicio','pratica','revisao','fim'],['inicio','revisao','pratica','fim']]);
 expect((await evaluatePractice(montar,'inicio\nrevisao\npratica\nfim')).passed).toBe(true);
});
it('não aprova prefixos, duplicações, fragmentos extras ou IDs desconhecidos',async()=>{
 for(const ordem of [[],['inicio','pratica','fim'],['inicio','pratica','pratica','fim'],['inicio','outra','pratica','fim'],['inicio','pratica','revisao','fim','extra']])expect((await evaluatePractice(montar,ordem)).passed).toBe(false);
});
it('distribui habilidades distintas preservando teoria e projeto independente',()=>{
 const aula=html.lessons.find(a=>a.id==='html-documentos')!,pausas=practicesForLesson(aula.id);
 expect(pausas.map(p=>p.afterBlock)).toEqual([1,4,6]);expect(pausas.map(p=>p.kind)).toEqual(['predict','choice','order']);
 expect(new Set(pausas.flatMap(p=>p.skillIds)).size).toBe(3);expect(pausas.every(p=>p.requiresConcept)).toBe(true);
 expect(aula.sections).toHaveLength(6);expect(aula.bugCode).toContain('disabled="false"');expect(aula.solution).toContain('id="revisao"');expect(aula.project).toContain('três artigos');
 for(const pausa of pausas){expect(getPracticeSolution(pausa.id)).toBeTruthy();expect('solution' in pausa).toBe(false);}
});

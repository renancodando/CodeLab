import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import html from '../../src/content/deep/html';

it('texto escapado não equivale a elementos criados nem a escape em dobro',async()=>{
 const id='html-texto-prever-escape';
 expect(await evaluatePractice(id,'<button>A & B</button>\r\n0')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['A & B\n1','<button>A & B</button>\n1','&lt;button&gt;A &amp; B&lt;/button&gt;\n0']){
  const erro=await evaluatePractice(id,resposta);expect(erro.passed).toBe(false);expect(erro.feedback).toContain('nova tag');expect(erro.feedback).not.toContain('<button>A & B</button>');
 }
});
it('as escolhas distinguem inserção literal, parsing e dupla transformação',async()=>{
 const pausa=practicesForLesson('html-texto-links').find(p=>p.id==='html-texto-corrigir-insercao')!;
 for(const opcao of pausa.options!){
  const resultado=await evaluatePractice(pausa.id,opcao.id);expect(resultado.passed).toBe(opcao.id==='literal');expect(resultado.execution).toBe('not-run');
  if(!resultado.passed){expect(resultado.feedback).toContain('entrada completa');expect(resultado.feedback).not.toContain('alvo.textContent = trecho;');}
 }
});
it('URLs preservam caminho, consulta e fragmento sob a base declarada',async()=>{
 const id='html-links-prever-base',certa=getPracticeSolution(id)!;
 expect((await evaluatePractice(id,certa.replaceAll('\n','\r\n'))).passed).toBe(true);
 for(const errada of [certa.replace('/guias/css/','/css/'),certa.replace('/laboratorio/','/guias/html/laboratorio/'),certa.replace('/guias/html/#comparacao','/#comparacao'),certa.replace('?nivel=1',''),certa.replace('#grade','')]){
  const resultado=await evaluatePractice(id,errada);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('URL da aula');
 }
});
it('distribui três habilidades sem substituir tabela, exercício ou projeto',()=>{
 const aula=html.lessons.find(a=>a.id==='html-texto-links')!,pausas=practicesForLesson(aula.id);
 expect(pausas.map(p=>p.afterBlock)).toEqual([3,4,5]);expect(new Set(pausas.flatMap(p=>p.skillIds)).size).toBe(3);expect(pausas.every(p=>p.requiresConcept)).toBe(true);
 expect(aula.sections).toHaveLength(6);expect(aula.code).toContain('Minutos de estudo');expect(aula.solution).toContain('Comparação de percursos');expect(aula.exercise).toContain('três linguagens');expect(aula.project).toContain('manual pequeno');
 for(const pausa of pausas){expect(getPracticeSolution(pausa.id)).toBeTruthy();expect('solution' in pausa).toBe(false);}
});

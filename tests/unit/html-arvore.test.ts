import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import html from '../../src/content/deep/html';

it('a barra em elemento normal não produz a árvore de XHTML',async()=>{
 const correta=await evaluatePractice('html-arvore-prever-barra','cartao\r\n2\r\n0');
 expect(correta).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['conteudo\n0\n0','cartao\n0\n0','cartao\n2\n1']){
  const erro=await evaluatePractice('html-arvore-prever-barra',resposta);expect(erro.passed).toBe(false);expect(erro.feedback).toContain('elemento HTML normal');expect(erro.feedback).not.toContain('cartao\n2\n0');
 }
});
it('o atalho precisa cumprir destino, foco e ausência de parada extra',async()=>{
 const pausa=practicesForLesson('html-arvore-semantica').find(p=>p.id==='html-arvore-corrigir-atalho')!;
 for(const opcao of pausa.options!){
  const resultado=await evaluatePractice(pausa.id,opcao.id);expect(resultado.passed).toBe(opcao.id==='destino');expect(resultado.execution).toBe('not-run');
  if(!resultado.passed){expect(resultado.feedback).toContain('parada');expect(resultado.feedback).not.toContain('tabindex="-1"');}
 }
});
it('as duas habilidades não substituem problemas abertos, teoria ou projeto',()=>{
 const aula=html.lessons.find(a=>a.id==='html-arvore-semantica')!,pausas=practicesForLesson(aula.id);
 expect(pausas.map(p=>p.afterBlock)).toEqual([2,4]);expect(new Set(pausas.flatMap(p=>p.skillIds)).size).toBe(2);expect(pausas.every(p=>p.requiresConcept)).toBe(true);
 expect(aula.sections).toHaveLength(6);expect(aula.practices).toHaveLength(2);expect(aula.practices![0].id).toBe('reparar');expect(aula.practices![1].id).toBe('tabela');expect(aula.project).toContain('três aulas');
 for(const pausa of pausas){expect(getPracticeSolution(pausa.id)).toBeTruthy();expect('solution' in pausa).toBe(false);}
});

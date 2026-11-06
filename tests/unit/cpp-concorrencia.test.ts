import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
it('junção e captura por valor permitem uma previsão definida',async()=>{
 const id='cpp-engenharia-prever-juncao';expect(await evaluatePractice(id,'24\n8')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const errada of ['0\n0','24\n12','12\n4'])expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it.each([['cpp-engenharia-atualizar-contador',['incremento','preincremento']],['cpp-engenharia-ligar-unidades',['juntas','separadas']]])('%s aceita as alternativas equivalentes sem alegar compilar a resposta',async(id,certas)=>{
 const pausa=practicesForLesson('cpp-concorrencia-engenharia').find(p=>p.id===id)!;
 for(const opcao of pausa.options!){const r=await evaluatePractice(id,opcao.id);expect(r).toMatchObject({passed:certas.includes(opcao.id),execution:'not-run'});if(!r.passed)expect(r.feedback).not.toContain(getPracticeSolution(id)!);}
});
it('concorrência e build recebem pausas distintas depois da teoria',()=>{
 const pausas=practicesForLesson('cpp-concorrencia-engenharia');expect(pausas.map(p=>p.afterBlock)).toEqual([2,4,6]);expect(new Set(pausas.flatMap(p=>p.skillIds)).size).toBe(3);
 for(const pausa of pausas){expect(pausa.requiresConcept).toBe(true);expect(getPracticeSolution(pausa.id)).toBeTruthy();expect('solution' in pausa).toBe(false);}
});

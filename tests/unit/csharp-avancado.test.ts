import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
it('record distingue a cópia superficial da igualdade do nome',async()=>{
 const id='cs-contratos-prever-copia';expect(await evaluatePractice(id,'Lia,Ana\nTrue\nFalse')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const errada of ['Lia\nFalse\nFalse','Lia,Ana\nTrue\nTrue','Lia,Ana\nFalse\nFalse'])expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it('snapshot aceita construções equivalentes sem aceitar aliases ou perda de nomes',async()=>{
 const id='cs-contratos-copiar-nomes';
 for(const certa of ['nomes.ToArray()',' nomes . ToArray ( ) ','[.. nomes]','Enumerable.ToArray(nomes)','System.Linq.Enumerable.ToArray(nomes)'])expect(await evaluatePractice(id,certa)).toMatchObject({passed:true,execution:'not-run'});
 for(const errada of ['nomes','nomes.AsReadOnly()','Array.Empty<string>()','new string[nomes.Count]','[.. nomes.Reverse()]','Nomes.ToArray()'])expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it('eventos exigem a mesma assinatura sem vazar a solução antes da tentativa',async()=>{
 const id='cs-contratos-desinscrever-evento',pausa=practicesForLesson('cs-objetos-contratos').find(p=>p.id===id)!;
 for(const opcao of pausa.options!){const r=await evaluatePractice(id,opcao.id);expect(r.passed).toBe(opcao.id==='mesma-instancia');expect(r.execution).toBe('not-run');if(!r.passed)expect(r.feedback).not.toContain(getPracticeSolution(id)!);}
});
it('as pausas de objetos seguem a teoria e habilidades distintas',()=>{
 const pausas=practicesForLesson('cs-objetos-contratos');expect(pausas.map(p=>p.afterBlock)).toEqual([4,5,7]);expect(new Set(pausas.flatMap(p=>p.skillIds)).size).toBe(3);
 for(const pausa of pausas){expect(pausa.requiresConcept).toBe(true);expect(getPracticeSolution(pausa.id)).toBeTruthy();expect('solution' in pausa).toBe(false);}
});

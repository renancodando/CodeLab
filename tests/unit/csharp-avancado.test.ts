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
 for(const errada of ['nomes','nomes.AsReadOnly()','Array.Empty<string>()','new string[nomes.Count]','[.. nomes.Reverse()]','Nomes.ToArray()','nom es.ToArray()','nomes.ToArr ay()','[. . nomes]'])expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it('eventos exigem a mesma assinatura sem vazar a solução antes da tentativa',async()=>{
 const id='cs-contratos-desinscrever-evento',pausa=practicesForLesson('cs-objetos-contratos').find(p=>p.id===id)!;
 for(const opcao of pausa.options!){const r=await evaluatePractice(id,opcao.id);expect(r.passed).toBe(opcao.id==='mesma-instancia');expect(r.execution).toBe('not-run');if(!r.passed)expect(r.feedback).not.toContain(getPracticeSolution(id)!);}
});
it('as pausas de objetos seguem a teoria e habilidades distintas',()=>{
 const pausas=practicesForLesson('cs-objetos-contratos');expect(pausas.map(p=>p.afterBlock)).toEqual([4,5,7]);expect(new Set(pausas.flatMap(p=>p.skillIds)).size).toBe(3);
 for(const pausa of pausas){expect(pausa.requiresConcept).toBe(true);expect(getPracticeSolution(pausa.id)).toBeTruthy();expect('solution' in pausa).toBe(false);}
});

it('runtime diferencia view, alias e snapshot sem simular execução da previsão',async()=>{
 const id='cs-runtime-prever-views';expect(await evaluatePractice(id,'40\n4\n40')).toMatchObject({passed:true,execution:'not-run'});
 for(const errada of ['4\n4\n40','40\n40\n40','40\n4\n4'])expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it('o buffer deve sair do período de aluguel como snapshot do conteúdo válido',async()=>{
 const id='cs-runtime-encerrar-lease',pausa=practicesForLesson('cs-runtime-avancado').find(p=>p.id===id)!;
 for(const opcao of pausa.options!)expect((await evaluatePractice(id,opcao.id)).passed).toBe(opcao.id==='snapshot');
});
it('soma verificada aceita operandos equivalentes e recusa overflow fora da expressão',async()=>{
 const id='cs-runtime-somar-checked';for(const certa of ['checked(total + valor)','checked ( valor + total )'])expect(await evaluatePractice(id,certa)).toMatchObject({passed:true,execution:'not-run'});
 for(const errada of ['total + valor','unchecked(total + valor)','checked((long)total + valor)','checked(total) + valor','che cked(total + valor)','checked(to tal + valor)','checked(total + val or)'])expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it('runtime recebe habilidades separadas depois da preparação teórica',()=>{
 const pausas=practicesForLesson('cs-runtime-avancado');expect(pausas.map(p=>p.afterBlock)).toEqual([4,5,8]);expect(new Set(pausas.flatMap(p=>p.skillIds)).size).toBe(3);
});

it('engenharia prevê o relógio injetado e recusa o avanço escondido',async()=>{
 const id='cs-engenharia-prever-relogio';expect(await evaluatePractice(id,'2026-10-06\n2026-10-09\n2')).toMatchObject({passed:true,execution:'not-run'});
 for(const errada of ['2026-10-06\n2026-10-08\n2','2026-10-06\n2026-10-09\n3'])expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it.each([['cs-engenharia-testar-defeitos','contrato'],['cs-engenharia-conferir-artefato','dll-publicado']])('%s conserva os limites da evidência',async(id,certa)=>{
 const pausa=practicesForLesson('cs-engenharia').find(p=>p.id===id)!;
 for(const opcao of pausa.options!)expect(await evaluatePractice(id,opcao.id)).toMatchObject({passed:opcao.id===certa,evidence:'conceptual',execution:'not-run'});
});
it('engenharia distribui previsão, diagnóstico e aplicação sem novas aulas',()=>{
 const pausas=practicesForLesson('cs-engenharia');expect(pausas.map(p=>p.afterBlock)).toEqual([3,4,6]);expect(new Set(pausas.flatMap(p=>p.skillIds)).size).toBe(3);
});

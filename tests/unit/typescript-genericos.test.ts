import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';

it.each([
 ['ts-genericos-prever-retorno','aceita\nrejeita\naceita'],
 ['ts-relacoes-prever-ausencia','aceita\nrejeita\nrejeita']
])('%s classifica cada fragmento sem alegar compilação da resposta',async(id,certa)=>{
 expect(await evaluatePractice(id,certa.toUpperCase())).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const errada of ['aceita\naceita\naceita','rejeita\nrejeita\naceita',certa.split('\n').slice(0,2).join('\n')])expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it.each([
 ['ts-genericos-construir-subtipo','ts-genericos','fabrica'],
 ['ts-relacoes-preservar-chave','ts-genericos-relacoes','relacionar'],
 ['ts-avancados-relacionar-evento','ts-tipos-avancados','por-campo']
])('%s mantém diagnóstico e solução sob consulta',async(id,aula,certa)=>{
 for(const opcao of practicesForLesson(aula).find(p=>p.id===id)!.options!){const r=await evaluatePractice(id,opcao.id);expect(r.passed).toBe(opcao.id===certa);expect(r.execution).toBe('not-run');if(!r.passed)expect(r.feedback).not.toContain(getPracticeSolution(id)!);}
});
it('a transformação aceita os dois tipos equivalentes e recusa perda de informação',async()=>{
 const id='ts-relacoes-completar-transformacao';for(const certa of ['U[]','Array<U>',' Array < U > '])expect((await evaluatePractice(id,certa)).passed).toBe(true);
 for(const errada of ['T[]','any[]','unknown[]','U','u[]','readonly U[]','U[]; return []','Arr ay<U>','A r r a y<U>'])expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it('a distribuição distingue a união inteira e aceita as duas notações de array',async()=>{
 const id='ts-avancados-prever-distribuicao';for(const certa of ['string[]\nnever','Array < string >\nnever'])expect((await evaluatePractice(id,certa)).passed).toBe(true);
 for(const errada of ['string[]\nstring[]','never\nnever','Array<number>\nnever','string[]','String[]\nnever','str ing[]\nnever','string[]\nne ver','Arr ay<string>\nnever'])expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it('o agrupamento exige os blocos, a inicialização e o retorno após o laço',async()=>{
 const id='ts-genericos-montar-grupos',ordem=['abrir','mapa','percorrer','inserir','fim-laco','retornar','fechar'];
 expect(await evaluatePractice(id,ordem)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 expect((await evaluatePractice(id,['abrir','mapa','percorrer','inserir','fechar','retornar','fim-laco'])).passed).toBe(true);
 expect((await evaluatePractice(id,['abrir','mapa','percorrer','inserir','fim-laco','retornar','fim-laco'])).passed).toBe(false);
 expect((await evaluatePractice(id,['abrir','mapa','percorrer','inserir','fim-laco','retornar','inventada'])).passed).toBe(false);
 for(const errada of [ordem.slice(0,-1),[...ordem,'outra'],['abrir','retornar','mapa','percorrer','inserir','fim-laco','fechar'],['abrir','mapa','percorrer','inserir','retornar','fim-laco','fechar'],['abrir','mapa','percorrer','inserir','inserir','retornar','fechar']])expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it.each([
 ['ts-genericos',[2,6,8]],['ts-genericos-relacoes',[4,5,8]],['ts-tipos-avancados',[3,5]]
] as const)('%s recebe pausas de habilidades distintas sem solução nos metadados', (aula,posicoes)=>{
 const pausas=practicesForLesson(aula);expect(pausas.map(p=>p.afterBlock)).toEqual(posicoes);expect(new Set(pausas.flatMap(p=>p.skillIds)).size).toBe(pausas.length);
 for(const pausa of pausas){expect(pausa.requiresConcept).toBe(true);expect(getPracticeSolution(pausa.id)).toBeTruthy();expect('solution' in pausa).toBe(false);}
});

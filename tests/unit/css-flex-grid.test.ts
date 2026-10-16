import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

it.each(['flex-position','grid-responsivo'])('%s conserva capítulos, projeto e preparação específica',aula=>{
 const original=lessons.find(item=>item.id===aula)!,pausas=practicesForLesson(aula);
 expect(original.capitulos).toHaveLength(12);
 expect(pausas.map(item=>item.afterBlock)).toEqual(aula==='flex-position'?[3,6,8]:[3,6]);
 expect(original.capitulos.find(item=>item.id==='projeto')?.paragrafos.join(' ')).toContain(aula==='flex-position'?'barra de ferramentas':'área de projetos');
 const estado=freshAdaptive(),preparacao=idPreparacao(aula);
 estado.seenConcepts=adaptiveCatalog.activities.filter(item=>item.kind==='concept'&&item.id!==preparacao).map(item=>item.id);
 expect(buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'css'},{now:Date.parse('2026-10-15T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([preparacao,...pausas.map(item=>item.id)]);
 expect(estado.skills).toEqual({});
});
it.each([
 ['css-prever-eixos','80 30\n80 50',['30 80\n50 80','80 50\n80 30','80 30','80 30\n80 50\n0 0']],
 ['css-grid-prever-vazias','170px\n170px',['110px\n110px','175px\n175px','350px\n350px','170px']]
] as const)('%s exige a previsão completa e permanece conceitual',async(id,correta,erradas)=>{
 for(const errada of erradas)expect((await evaluatePractice(id,errada)).passed).toBe(false);
 expect(await evaluatePractice(id,correta)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('coordenadas aceitam espaçamento equivalente sem fundir linhas ou inverter eixos',async()=>{
 for(const resposta of [' 80\t30 \r\n 80  50 ','80   30\n80\t50'])expect((await evaluatePractice('css-prever-eixos',resposta)).passed).toBe(true);
 for(const resposta of ['80 30 80 50','80px 30px\n80px 50px','80 30\n50 80'])expect((await evaluatePractice('css-prever-eixos',resposta)).passed).toBe(false);
});
it.each([
 ['css-diagnosticar-selo','cartao',['fixo','distancia']],
 ['css-grid-diagnosticar-conteiner','ancestral',['viewport','forcar']]
] as const)('%s rejeita compensações ou referências erradas',async(id,correta,erradas)=>{
 for(const errada of erradas){const resultado=await evaluatePractice(id,errada);expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(getPracticeSolution(id)!);}
 expect(await evaluatePractice(id,correta)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each(['wrap','WRAP','  WrAp\r\n'])('a palavra-chave %j permite linhas normais',async resposta=>{
 expect(await evaluatePractice('css-flex-quebrar',resposta)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each(['nowrap','wrap-reverse','initial','unset','','wrap wrap','wrap;display:none'])('a alteração %j não satisfaz a quebra sem inversão',async resposta=>{
 expect((await evaluatePractice('css-flex-quebrar',resposta)).passed).toBe(false);
});

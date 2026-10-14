import {it,expect} from 'vitest';
import {runInNewContext} from 'node:vm';
import {practicesForLesson} from '../../src/content/practice';
import {lessons} from '../../src/content/curriculum';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {evaluate} from '../../src/execution/evaluate';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

const pausas=practicesForLesson('async');
it('preserva a aula e o projeto e prepara as três decisões antes da solução',()=>{
 const aula=lessons.find(a=>a.id==='async')!;expect(aula.capitulos).toHaveLength(12);expect(pausas.map(p=>p.afterBlock)).toEqual([3,6,8]);
 expect(aula.capitulos.find(c=>c.id==='projeto')?.paragrafos.join(' ')).toContain('cancelamento da consulta anterior');
 expect(aula.capitulos.slice(0,9).map(c=>c.paragrafos.join(' ')).join(' ')).toContain('funções de teste locais');
 expect(aula.capitulos.slice(0,9).some(c=>c.id==='solucao')).toBe(false);
 const estado=freshAdaptive(),preparacao=idPreparacao('async');estado.seenConcepts=adaptiveCatalog.activities.filter(a=>a.kind==='concept'&&a.id!==preparacao).map(a=>a.id);
 expect(buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'javascript'},{now:Date.parse('2026-10-14T12:00:00Z'),timeZone:'UTC'}).items.map(i=>i.activityId)).toEqual([preparacao,...pausas.map(p=>p.id)]);
 expect(estado.skills).toEqual({});
});
it('a previsão é comprovada em QuickJS e no host Node, mas a resposta continua conceitual',async()=>{
 const codigo=pausas[0].code!,saida='Antes\nInício\nDepois\n7';
 const referencia=await evaluate(codigo,'laboratorio');expect(referencia.error).toBeUndefined();expect(referencia.logs.join('\n')).toBe(saida);
 const linhas:string[]=[];runInNewContext(codigo,{console:{log:(valor:unknown)=>linhas.push(String(valor))}});await Promise.resolve();expect(linhas.join('\n')).toBe(saida);
 const resultado=await evaluatePractice(pausas[0].id,saida);expect(resultado).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const errada of ['Antes\nInício\n7\nDepois','Antes\nDepois\nInício\n7','Antes\nDepois\n7'])expect((await evaluatePractice(pausas[0].id,errada)).passed).toBe(false);
});
it('o diagnóstico HTTP confere a escolha sem fingir uma conexão real',async()=>{
 for(const errada of ['catch','segundo-await'])expect((await evaluatePractice(pausas[1].id,errada)).passed).toBe(false);
 expect(await evaluatePractice(pausas[1].id,'status')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each([200,201,404,500])('o gabarito HTTP usa a semântica de Response para status %s, sem rede',async status=>{
 const resposta=new Response('[]',{status}),ler=resposta.json.bind(resposta);let leituras=0,consultas=0;
 resposta.json=()=>{leituras++;return ler();};
 const tarefa=runInNewContext(getPracticeSolution(pausas[1].id)!+'\ncarregar();',{fetch:(url:string)=>{expect(url).toBe('/api/licoes');consultas++;return Promise.resolve(resposta);}});
 if(status<300)expect(await tarefa).toEqual([]);else await expect(tarefa).rejects.toThrow('HTTP '+status);
 expect(consultas).toBe(1);expect(leituras).toBe(status<300?1:0);
});
it('o gabarito executa as seis famílias e o programa inicial falha',async()=>{
 expect((await evaluatePractice(pausas[2].id,pausas[2].code!)).passed).toBe(false);
 const resultado=await evaluatePractice(pausas[2].id,getPracticeSolution(pausas[2].id)!);expect(resultado.passed,resultado.feedback).toBe(true);expect(resultado.tests).toHaveLength(6);expect(resultado.execution).toBe('quickjs');expect(resultado.evidence).toBe('executed');
});
it.each([
 'function lerResposta(obter){return obter().then(r=>{if(!r.ok)throw new Error("HTTP");return r.json();});}',
 'async function lerResposta(obter){const r=await obter();if(!r.ok)throw new TypeError("HTTP");return await r.json();}',
 'async function lerResposta(obter){await Promise.resolve();const r=await obter();if(!r.ok)throw new Error();return r.json();}'
])('aceita controle equivalente da espera e do retorno: %s',async codigo=>{const resultado=await evaluatePractice(pausas[2].id,codigo);expect(resultado.passed,resultado.feedback).toBe(true);});
it.each([
 'async function lerResposta(obter){return {nome:"Lia"};}',
 'async function lerResposta(obter){const r=await obter();return r;}',
 'async function lerResposta(obter){const r=await obter();if(!r.ok)throw new Error();r.json();}',
 'async function lerResposta(obter){const r=await obter();return r.json();}',
 'async function lerResposta(obter){const r=await obter();if(r.status!==200)throw new Error();return r.json();}',
 'async function lerResposta(obter){const r=await obter();if(!r.ok)throw "HTTP";return r.json();}',
 'async function lerResposta(obter){try{const r=await obter();if(!r.ok)throw new Error();return await r.json();}catch{return [];}}',
 'async function lerResposta(obter){try{const r=await obter();if(!r.ok)throw new Error();return await r.json();}catch(e){throw new Error(e.message);}}',
 'async function lerResposta(obter){const r=await obter();if(!r.ok)throw new Error();return (await r.json())||[];}',
 'async function lerResposta(obter){await obter();const r=await obter();if(!r.ok)throw new Error();return r.json();}',
 'async function lerResposta(obter){const r=await obter();if(!r.ok)throw new Error();await r.json();return r.json();}',
 'async function lerResposta(obter){const r=await obter();if(!r.ok)throw new Error();return r.json().catch(()=>null);}'
])('rejeita uma implementação que apaga resultados ou falhas: %s',async codigo=>{expect((await evaluatePractice(pausas[2].id,codigo)).passed).toBe(false);});
it('o erro de status é localizado depois dos sucessos, sem revelar o algoritmo',async()=>{
 const resultado=await evaluatePractice(pausas[2].id,'async function lerResposta(obter){const r=await obter();return r.json();}');
 expect(resultado.tests.slice(0,2).every(t=>t.passed)).toBe(true);expect(resultado.tests[2].passed).toBe(false);expect(resultado.feedback).toContain('antes de json');expect(resultado.feedback).not.toContain('async function');
});
it('uma operação que nunca resolve falha sem congelar a correção seguinte',async()=>{
 const resultado=await evaluatePractice(pausas[2].id,'function lerResposta(obter){return new Promise(()=>{});}');expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('pendente');
 expect((await evaluatePractice(pausas[2].id,getPracticeSolution(pausas[2].id)!)).passed).toBe(true);
});

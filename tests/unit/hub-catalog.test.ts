import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practiceActivities} from '../../src/content/practice';
import {capstoneProjects} from '../../src/content/project-paths';
import {adaptiveCatalog} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession,ensureDailySession,markConceptSeen} from '../../src/learning/adaptive';
it('todas as ligações de práticas e projetos apontam para aulas existentes',()=>{
 const ids=new Set(lessons.map(l=>l.id));const missing:string[]=[];
 for(const a of practiceActivities)for(const id of a.lessonIds)if(!ids.has(id))missing.push(a.id+':'+id);
 for(const p of capstoneProjects)for(const m of p.milestones)for(const id of m.lessonIds)if(!ids.has(id))missing.push(p.id+'/'+m.id+':'+id);
 expect(missing).toEqual([]);
});
it('cada linguagem oferece conceito, duas práticas e desafio sem repetição',()=>{
 for(const language of ['html','css','javascript','typescript','python','csharp','cpp','sql']){
  const plan=buildDailySession(freshAdaptive(),{...adaptiveCatalog,preferredLanguage:language},{now:Date.parse('2026-10-07T12:00:00Z'),timeZone:'America/Sao_Paulo'});
  expect(plan.items.map(i=>i.kind),language).toEqual(['concept','practice','practice','challenge']);expect(new Set(plan.items.map(i=>i.id)).size).toBe(4);
  for(const item of plan.items)expect(adaptiveCatalog.activities.find(a=>a.id===item.activityId)!.skillIds.every(id=>id.startsWith(language+'.'))).toBe(true);
 }
});

it('inserir uma aula conserva conceitos lidos e o plano iniciado antes da expansão',()=>{
 const ids=['conceito-0-060-py-fundamentos','conceito-0-069-ts-fundamentos','conceito-0-123-sql-modelagem-completa'];
 for(const id of ids)expect(adaptiveCatalog.activities.some(a=>a.id===id),id).toBe(true);
 const clock={now:Date.parse('2026-10-07T12:00:00Z'),timeZone:'America/Sao_Paulo'},state=freshAdaptive();
 const catalog={...adaptiveCatalog,preferredLanguage:'python'};
 state.daily=buildDailySession(state,catalog,clock);
 expect(state.daily.items[0].activityId).toBe(ids[0]);
 markConceptSeen(state,ids[0],clock);
 const prior=JSON.parse(JSON.stringify(state.daily));
 const restored=JSON.parse(JSON.stringify(state));
 expect(ensureDailySession(restored,catalog,clock)).toEqual(prior);
 expect(restored.seenConcepts).toContain(ids[0]);
 const next=buildDailySession(restored,catalog,{...clock,now:clock.now+86400000});
 expect(next.items.filter(i=>i.kind==='concept').map(i=>i.activityId)).not.toContain(ids[0]);
 expect(adaptiveCatalog.activities.some(a=>a.id==='conceito-2-py-iteracao-recursos')).toBe(true);
});

it('variância avançada espera seu conceito e leitura não fabrica domínio',()=>{
 const state=freshAdaptive(),clock={now:Date.parse('2026-10-07T12:00:00Z'),timeZone:'America/Sao_Paulo'},catalog={...adaptiveCatalog,preferredLanguage:'typescript'};
 const advanced=['ts-fonte-covariancia','ts-callback-entrada','ts-propriedade-funcao'],concept='conceito-2-ts-variancia-contratos';
 const first=buildDailySession(state,catalog,clock);
 expect(first.items.map(i=>i.kind)).toEqual(['concept','practice','practice','challenge']);
 expect(first.items.some(i=>advanced.includes(i.activityId))).toBe(false);
 state.seenConcepts=catalog.activities.filter(a=>a.kind==='concept'&&a.id!==concept).map(a=>a.id);
 const prepared=buildDailySession(state,catalog,clock);
 expect(prepared.items[0].activityId).toBe(concept);
 expect(new Set(prepared.items.slice(1).map(i=>i.activityId))).toEqual(new Set(advanced));
 state.daily=prepared;markConceptSeen(state,concept,clock);
 expect(Object.keys(state.skills)).toEqual([]);
 const later=buildDailySession(state,catalog,{...clock,now:clock.now+86400000});
 expect(new Set(later.items.map(i=>i.activityId))).toEqual(new Set(advanced));
});
it('um pré-requisito de conceito inexistente é rejeitado no catálogo diário',()=>{
 const state=freshAdaptive(),clock={now:Date.parse('2026-10-07T12:00:00Z'),timeZone:'UTC'};
 const catalog={...adaptiveCatalog,preferredLanguage:'typescript',activities:adaptiveCatalog.activities.map(a=>a.id==='ts-zero-ausencia'?{...a,requiredConcepts:['conceito-inexistente']}:a)};
 expect(buildDailySession(state,catalog,clock).items.some(i=>i.activityId==='ts-zero-ausencia')).toBe(false);
});

it('o desafio novo de recursos Python não antecipa o conceito numa primeira sessão',()=>{
 const state=freshAdaptive(),clock={now:Date.parse('2026-10-07T12:00:00Z'),timeZone:'UTC'},catalog={...adaptiveCatalog,preferredLanguage:'python'};
 const advanced=['py-prever-esgotamento','py-ordenar-lote','py-fechar-consumo'],concept='conceito-2-py-iteracao-recursos';
 const first=buildDailySession(state,catalog,clock);
 expect(first.items.map(i=>i.kind)).toEqual(['concept','practice','practice','challenge']);
 expect(first.items.some(i=>advanced.includes(i.activityId))).toBe(false);
 state.seenConcepts=catalog.activities.filter(a=>a.kind==='concept'&&a.id!==concept).map(a=>a.id);
 const prepared=buildDailySession(state,catalog,clock);
 expect(prepared.items[0].activityId).toBe(concept);
 expect(new Set(prepared.items.slice(1).map(i=>i.activityId))).toEqual(new Set(advanced));
});

it('invalidação C++ espera o conceito sem antecipar conteúdo na primeira sessão',()=>{
 const state=freshAdaptive(),clock={now:Date.parse('2026-10-07T12:00:00Z'),timeZone:'UTC'},catalog={...adaptiveCatalog,preferredLanguage:'cpp'};
 const advanced=['cpp-prever-intervalo','cpp-ordenar-erase','cpp-reobter-reserva'],concept='conceito-2-cpp-iteradores-invalidacao';
 const first=buildDailySession(state,catalog,clock);
 expect(first.items.map(i=>i.kind)).toEqual(['concept','practice','practice','challenge']);
 expect(first.items.some(i=>advanced.includes(i.activityId))).toBe(false);
 state.seenConcepts=catalog.activities.filter(a=>a.kind==='concept'&&a.id!==concept).map(a=>a.id);
 const prepared=buildDailySession(state,catalog,clock);
 expect(prepared.items[0].activityId).toBe(concept);
 expect(new Set(prepared.items.slice(1).map(i=>i.activityId))).toEqual(new Set(advanced));
});

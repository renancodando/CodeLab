import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practiceActivities} from '../../src/content/practice';
import {capstoneProjects} from '../../src/content/project-paths';
import {adaptiveCatalog} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';
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

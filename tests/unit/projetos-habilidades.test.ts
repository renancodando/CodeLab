import {it,expect} from 'vitest';
import {practiceActivities} from '../../src/content/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession,markConceptSeen,recordEvidence,skillMastery,prepareAdaptiveBackup,normalizeAdaptive,linguagemDaHabilidade} from '../../src/learning/adaptive';

const aulas=['fullstack-arquitetura','fullstack-integracao','fullstack-testes','fullstack-config','fullstack-memoria','projeto-diario','projeto-tarefas','projeto-clima'];
const relogio={now:Date.parse('2026-11-04T12:00:00Z'),timeZone:'UTC'};
it('classifica todos os domínios pela linguagem executada, preservando os IDs publicados',()=>{
 for(const atividade of practiceActivities){
  for(const id of atividade.skillIds){const habilidade=adaptiveCatalog.skills.find(h=>h.id===id)!;expect(linguagemDaHabilidade(habilidade)).toBe(atividade.language);expect(habilidade.path[0]).not.toBe('projetos');expect(habilidade.path[0]).not.toBe('fullstack');}
 }
 const ids=aulas.flatMap(aula=>practiceActivities.filter(a=>a.lessonIds.includes(aula))).flatMap(a=>a.skillIds);
 expect(ids).toContain('fullstack.validacao.entrada');expect(ids).toContain('projetos.diario.backup-versionado');
 for(const id of ids)expect(linguagemDaHabilidade(adaptiveCatalog.skills.find(h=>h.id===id)!)).toBe('javascript');
});
it('oferece os oito assuntos no plano de JavaScript e mantém preparação antes de produção',()=>{
 for(const aula of aulas){
  const atividades=adaptiveCatalog.activities.filter(a=>a.lessonId===aula),catalogo={...adaptiveCatalog,activities:atividades,preferredLanguage:'javascript'},estado=freshAdaptive();
  const inicial=buildDailySession(estado,catalogo,relogio);expect(inicial.items.some(i=>i.kind==='concept')).toBe(true);expect(inicial.items.length).toBeGreaterThan(1);
  const preparo=atividades.find(a=>a.id===idPreparacao(aula))!;markConceptSeen(estado,preparo.id,relogio,preparo.incluiConceitos);
  expect(Object.keys(estado.skills)).toEqual([]);
  const preparado=buildDailySession(estado,catalogo,relogio);expect(preparado.items.some(i=>i.kind==='challenge')).toBe(true);
  expect(buildDailySession(freshAdaptive(),{...catalogo,preferredLanguage:'css'},relogio).items).toEqual([]);
 }
});
it('preserva evidência full stack anterior na normalização, no backup e na revisão',()=>{
 const estado=freshAdaptive(),id='fullstack.validacao.entrada';
 recordEvidence(estado,{id:'anterior-1',assessmentId:'fullstack-preparar-cadastro',activityId:'fullstack-preparar-cadastro',skillIds:[id],revision:1,passed:true,assisted:false,attempts:1,hints:0,kind:'challenge'},relogio);
 const restaurado=normalizeAdaptive(JSON.parse(JSON.stringify(prepareAdaptiveBackup(estado))),true);
 expect(restaurado.skills[id]).toEqual(estado.skills[id]);expect(Object.keys(restaurado.skills)).toEqual([id]);expect(skillMastery(restaurado,id)).toEqual(skillMastery(estado,id));
 const plano=buildDailySession(restaurado,{...adaptiveCatalog,preferredLanguage:'javascript'},{...relogio,now:relogio.now+86400000});
 expect(plano.items.some(i=>i.kind==='review'&&i.skillId===id)).toBe(true);
});
it('catálogos antigos sem metadado continuam usando o prefixo existente',()=>{
 expect(linguagemDaHabilidade({id:'sql.transacoes',label:'Transações',path:['SQL']})).toBe('sql');
});

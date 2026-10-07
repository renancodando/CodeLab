import {describe,it,expect} from 'vitest';
import {
 ADAPTIVE_LIMITS, REVIEW_DAYS, freshAdaptive, learningDay, normalizeAdaptive, prepareAdaptiveBackup,
 recordEvidence, skillMastery, dueReviews, buildDailySession, ensureDailySession, markConceptSeen,
 type AdaptiveState, type AdaptiveCatalog, type EvidenceEvent, type LearningClock, type LearningActivity,
} from '../../src/learning/adaptive';

const clock=(day:string,timeZone='UTC',time='12:00:00.000'):LearningClock=>({now:Date.parse(day+'T'+time+'Z'),timeZone});
let sequence=0;
const event=(changes:Partial<EvidenceEvent>={}):EvidenceEvent=>({
 id:'attempt-'+(++sequence),assessmentId:'cart-total',activityId:'cart-total',skillIds:['javascript.conversao'],
 revision:1,passed:true,assisted:false,attempts:1,hints:0,kind:'practice',...changes,
});
function record(state:AdaptiveState,day:string,changes:Partial<EvidenceEvent>={}){
 return recordEvidence(state,event(changes),clock(day));
}
const activity=(id:string,kind:LearningActivity['kind'],skillId='javascript.conversao',minutes=2):LearningActivity=>({id,title:id,kind,skillIds:[skillId],minutes});
const basicCatalog:AdaptiveCatalog={
 skills:[{id:'javascript.conversao',label:'Conversão',path:['JavaScript','Valores','Conversão']}],
 activities:[activity('concept-conversion','concept'),activity('cart-total','practice'),activity('price-empty','practice'),activity('checkout-challenge','challenge',undefined,4)],
};

describe('evidência independente por habilidade',()=>{
 it('não fabrica domínio a partir de uma habilidade desconhecida ou backup anterior',()=>{
  expect(skillMastery(freshAdaptive(),'javascript.conversao')).toMatchObject({score:null,practiced:0,dueDay:null});
  expect(prepareAdaptiveBackup(undefined)).toEqual(freshAdaptive());
  expect(normalizeAdaptive({version:2,completed:['cart-total'],score:100})).toEqual(freshAdaptive());
 });
 it('corrigir uma falha no mesmo problema é aceito e não vira acerto de primeira',()=>{
  const state=freshAdaptive();record(state,'2026-10-06',{passed:false});
  expect(skillMastery(state,'javascript.conversao').score).toBe(0);
  record(state,'2026-10-06',{attempts:2});
  expect(skillMastery(state,'javascript.conversao')).toMatchObject({score:80,practiced:1,stage:0,dueDay:'2026-10-07'});
 });
 it('deduplica o mesmo evento sem alterar o estado',()=>{
  const state=freshAdaptive();const answer=event();recordEvidence(state,answer,clock('2026-10-06'));
  const before=JSON.stringify(state);
  expect(recordEvidence(state,answer,clock('2026-10-07'))).toEqual({accepted:false,credited:false,reason:'duplicate'});
  expect(JSON.stringify(state)).toBe(before);
 });
 it('repetir a resposta com IDs novos não soma avaliações nem aumenta o intervalo no dia',()=>{
  const state=freshAdaptive();
  for(let i=0;i<30;i++)record(state,'2026-10-06');
  expect(skillMastery(state,'javascript.conversao')).toMatchObject({score:100,practiced:1,stage:0,dueDay:'2026-10-07'});
 });
 it('revisar o mesmo problema em outros dias não aumenta o número de avaliações distintas',()=>{
  const state=freshAdaptive();record(state,'2026-10-01');
  record(state,'2026-10-02',{kind:'review'});
  record(state,'2026-10-05',{kind:'review'});
  expect(skillMastery(state,'javascript.conversao')).toMatchObject({practiced:1,score:100,stage:2});
 });
 it('combina casos independentes e pistas, incluindo a falha mais recente',()=>{
  const state=freshAdaptive();
  record(state,'2026-10-06',{assessmentId:'one',activityId:'one'});
  record(state,'2026-10-06',{assessmentId:'two',activityId:'two',attempts:2});
  record(state,'2026-10-06',{assessmentId:'three',activityId:'three',passed:false});
  record(state,'2026-10-06',{assessmentId:'four',activityId:'four',attempts:2,hints:2});
  expect(skillMastery(state,'javascript.conversao')).toMatchObject({score:60,practiced:4,assisted:0});
  record(state,'2026-10-07',{assessmentId:'one',activityId:'one',passed:false});
  expect(skillMastery(state,'javascript.conversao').score).toBe(35);
 });
 it('uma solução assistida não gera domínio e não pode ser desmarcada no mesmo dia',()=>{
  const state=freshAdaptive();record(state,'2026-10-06',{assisted:true});
  expect(skillMastery(state,'javascript.conversao')).toMatchObject({score:null,practiced:0,assisted:1});
  expect(record(state,'2026-10-06',{assisted:false,attempts:2}).credited).toBe(false);
  expect(skillMastery(state,'javascript.conversao').score).toBeNull();
  record(state,'2026-10-07',{kind:'review',attempts:1});
  expect(skillMastery(state,'javascript.conversao')).toMatchObject({score:100,practiced:1,stage:1});
 });
 it('ver a solução preserva a evidência anterior, sem conceder novo crédito',()=>{
  const state=freshAdaptive();record(state,'2026-10-06');
  expect(record(state,'2026-10-06',{assisted:true,attempts:2}).credited).toBe(false);
  expect(skillMastery(state,'javascript.conversao')).toMatchObject({score:100,practiced:1});
  expect(prepareAdaptiveBackup(state)).toEqual(state);
 });
 it('a revisão do enunciado substitui a evidência antiga sem multiplicar o problema',()=>{
  const state=freshAdaptive();record(state,'2026-10-06',{passed:false,revision:1});
  record(state,'2026-10-07',{revision:2});
  expect(skillMastery(state,'javascript.conversao')).toMatchObject({score:100,practiced:1});
 });
 it('recusa relógio regressivo e eventos inválidos sem mutação parcial',()=>{
  const state=freshAdaptive();record(state,'2026-10-07');const before=JSON.stringify(state);
  expect(record(state,'2026-10-06').reason).toBe('stale');
  expect(record(state,'2026-10-07',{attempts:0}).reason).toBe('invalid');
  expect(record(state,'2026-10-07',{skillIds:['javascript.conversao','constructor']}).reason).toBe('invalid');
  expect(JSON.stringify(state)).toBe(before);
 });
 it('limita avaliações e IDs de evento sem perder a avaliação que acabou de chegar',()=>{
  const state=freshAdaptive();
  for(let i=0;i<ADAPTIVE_LIMITS.events+4;i++)record(state,'2026-10-06',{assessmentId:'case-'+i,activityId:'case-'+i});
  expect(state.eventIds).toHaveLength(ADAPTIVE_LIMITS.events);
  expect(Object.keys(state.skills['javascript.conversao'].evidence)).toHaveLength(ADAPTIVE_LIMITS.assessments);
  expect(state.skills['javascript.conversao'].evidence['case-'+(ADAPTIVE_LIMITS.events+3)]).toBeDefined();
  expect(prepareAdaptiveBackup(state)).toEqual(state);
 });
 it('rejeita a habilidade excedente atomicamente',()=>{
  const state=freshAdaptive();
  for(let i=0;i<ADAPTIVE_LIMITS.skills;i++)record(state,'2026-10-06',{skillIds:['skill-'+i]});
  const before=JSON.stringify(state);
  expect(record(state,'2026-10-06',{skillIds:['skill-extra','skill-0']}).reason).toBe('invalid');
  expect(JSON.stringify(state)).toBe(before);
 });
});

describe('revisão por dias do calendário',()=>{
 it('avança 1 → 3 → 7 → 14 → 30 → 60 somente após revisões vencidas',()=>{
  const state=freshAdaptive();record(state,'2026-10-01');
  const expected=['2026-10-02','2026-10-05','2026-10-12','2026-10-26','2026-11-25','2027-01-24'];
  expect(REVIEW_DAYS).toEqual([1,3,7,14,30,60]);
  expect(state.skills['javascript.conversao'].review.dueDay).toBe(expected[0]);
  for(let stage=1;stage<expected.length;stage++){
   record(state,expected[stage-1],{kind:'review'});
   expect(state.skills['javascript.conversao'].review).toMatchObject({stage,dueDay:expected[stage]});
   record(state,expected[stage-1],{kind:'review'});
   expect(state.skills['javascript.conversao'].review.stage).toBe(stage);
  }
 });
 it('prática antecipada ou um exercício novo não adia a revisão pendente',()=>{
  const state=freshAdaptive();record(state,'2026-10-01');record(state,'2026-10-02',{kind:'review'});
  record(state,'2026-10-03',{kind:'review'});record(state,'2026-10-05',{assessmentId:'new-case',activityId:'new-case'});
  expect(state.skills['javascript.conversao'].review).toMatchObject({stage:1,dueDay:'2026-10-05'});
 });
 it('um erro reduz dois estágios, sem punir repetidamente nem ampliar após a correção no dia',()=>{
  const state=freshAdaptive();record(state,'2026-10-01');
  for(const day of ['2026-10-02','2026-10-05','2026-10-12','2026-10-26'])record(state,day,{kind:'review'});
  record(state,'2026-10-27',{kind:'review',passed:false});
  expect(state.skills['javascript.conversao'].review).toMatchObject({stage:2,dueDay:'2026-11-03',lastOutcome:'failed'});
  record(state,'2026-10-27',{kind:'review',passed:false});
  record(state,'2026-10-27',{kind:'review',attempts:2});
  expect(state.skills['javascript.conversao'].review).toMatchObject({stage:2,dueDay:'2026-11-03',lastOutcome:'failed'});
  record(state,'2026-11-03',{kind:'review'});
  expect(state.skills['javascript.conversao'].review).toMatchObject({stage:3,dueDay:'2026-11-17'});
 });
 it('assistência encurta para amanhã e não prolonga o prazo existente',()=>{
  const state=freshAdaptive();record(state,'2026-10-01');record(state,'2026-10-02',{kind:'review'});
  record(state,'2026-10-03',{assisted:true});
  expect(state.skills['javascript.conversao'].review).toMatchObject({stage:0,dueDay:'2026-10-04',lastOutcome:'assisted'});
  record(state,'2026-10-03',{kind:'review'});
  expect(state.skills['javascript.conversao'].review.dueDay).toBe('2026-10-04');
 });
 it('a meia-noite UTC não antecipa o dia local ou a revisão no Brasil',()=>{
  const state=freshAdaptive();
  recordEvidence(state,event(),clock('2026-10-06','America/Sao_Paulo','15:00:00.000'));
  const boundary=clock('2026-10-07','America/Sao_Paulo','02:30:00.000');
  expect(learningDay(boundary)).toBe('2026-10-06');
  expect(dueReviews(state,boundary)).toEqual([]);
  expect(dueReviews(state,{...boundary,timeZone:'UTC'})).toEqual(['javascript.conversao']);
  recordEvidence(state,event({attempts:2}),boundary);
  const saved=state.skills['javascript.conversao'].evidence['cart-total'];
  expect(saved.day).toBe('2026-10-06');expect(saved.recordedAt).toBe('2026-10-07T02:30:00.000Z');
  expect(prepareAdaptiveBackup(state)).toEqual(state);
 });
 it('a mudança de horário de verão não exige esperar 24 horas exatas',()=>{
  const state=freshAdaptive();
  const start={now:Date.parse('2026-03-08T05:30:00.000Z'),timeZone:'America/New_York'};
  recordEvidence(state,event(),start);
  const next={now:Date.parse('2026-03-09T04:00:00.000Z'),timeZone:'America/New_York'};
  expect(next.now-start.now).toBeLessThan(86400000);
  expect(learningDay(next)).toBe('2026-03-09');
  expect(dueReviews(state,next)).toEqual(['javascript.conversao']);
 });
 it('prioriza atrasos antigos e, no mesmo dia, a habilidade mais fraca',()=>{
  const state=freshAdaptive();
  record(state,'2026-10-01',{skillIds:['skill-z']});
  record(state,'2026-10-02',{skillIds:['skill-a']});
  record(state,'2026-10-02',{skillIds:['skill-b'],passed:false});
  expect(dueReviews(state,clock('2026-10-06'))).toEqual(['skill-z','skill-b','skill-a']);
 });
});

describe('sessão diária limitada e estável',()=>{
 it('monta uma sessão inicial útil mesmo sem revisões ou executor',()=>{
  const state=freshAdaptive();const plan=buildDailySession(state,basicCatalog,clock('2026-10-06'));
  expect(plan.items.map(item=>item.kind)).toEqual(['concept','practice','practice','challenge']);
  expect(plan.items.map(item=>item.activityId)).toEqual(['concept-conversion','cart-total','price-empty','checkout-challenge']);
  expect(plan.totalMinutes).toBe(10);expect(plan.completed).toEqual([]);
 });
 it('respeita a sequência de seis slots, sem duplicar atividades nem listar toda a fila',()=>{
  const state=freshAdaptive();
  for(const [skill,day] of [['skill-a','2026-10-01'],['skill-b','2026-10-02'],['skill-c','2026-10-03']])record(state,day,{skillIds:[skill],assessmentId:skill,activityId:'review-'+skill});
  const catalog:AdaptiveCatalog={
   skills:['skill-a','skill-b','skill-c'].map(id=>({id,label:id,path:[id]})),
   activities:[
    activity('review-skill-a','practice','skill-a'),activity('review-skill-b','practice','skill-b'),activity('review-skill-c','practice','skill-c'),
    activity('new-concept','concept','skill-c'),activity('practice-c-one','practice','skill-c'),activity('practice-c-two','practice','skill-c'),
    activity('final-c','challenge','skill-c'),
   ],
  };
  const plan=buildDailySession(state,catalog,clock('2026-10-06'));
  expect(plan.items.map(item=>item.kind)).toEqual(['review','review','concept','practice','practice','challenge']);
  expect(plan.items.slice(0,2).map(item=>item.skillId)).toEqual(['skill-a','skill-b']);
  expect(new Set(plan.items.map(item=>item.activityId)).size).toBe(6);
  expect(plan.items[5].activityId).toBe('final-c');
  expect(prepareAdaptiveBackup({...state,daily:plan}).daily).toEqual(plan);
 });
 it('escolhe práticas relacionadas ao conceito antes de exercícios de outras habilidades',()=>{
  const catalog:AdaptiveCatalog={skills:[...basicCatalog.skills,{id:'css.grid',label:'Grid',path:['CSS','Grid']}],
   activities:[...basicCatalog.activities,activity('aaa-css','practice','css.grid'),activity('aaa-css-final','challenge','css.grid')]};
  const plan=buildDailySession(freshAdaptive(),catalog,clock('2026-10-06'));
  expect(plan.items.filter(item=>item.kind==='practice').map(item=>item.activityId)).toEqual(['cart-total','price-empty']);
  expect(plan.items.at(-1)?.activityId).toBe('checkout-challenge');
 });
 it('exige duas avaliações independentes e domínio mínimo para abrir pré-requisitos',()=>{
  const state=freshAdaptive();
  const catalog:AdaptiveCatalog={...basicCatalog,activities:[...basicCatalog.activities,{...activity('advanced-concept','concept'),prerequisites:['javascript.conversao']}]};
  record(state,'2026-10-06');for(let i=0;i<10;i++)record(state,'2026-10-06');
  expect(buildDailySession(state,catalog,clock('2026-10-06')).items.some(item=>item.activityId==='advanced-concept')).toBe(false);
  record(state,'2026-10-06',{assessmentId:'price-empty',activityId:'price-empty'});
  expect(buildDailySession(state,catalog,clock('2026-10-06')).items[0].activityId).toBe('advanced-concept');
 });
 it('congela o plano de hoje enquanto muda o progresso e renova na meia-noite local',()=>{
  const state=freshAdaptive();const first=ensureDailySession(state,basicCatalog,clock('2026-10-06'));
  markConceptSeen(state,'concept-conversion',clock('2026-10-06'));record(state,'2026-10-06');
  expect(ensureDailySession(state,basicCatalog,clock('2026-10-06'))).toBe(first);
  expect(first.completed).toEqual(['concept-conversion','cart-total']);
  const next=ensureDailySession(state,basicCatalog,clock('2026-10-07'));
  expect(next).not.toBe(first);expect(next.day).toBe('2026-10-07');
  expect(next.items.some(item=>item.kind==='concept')).toBe(false);
 });
 it('uma revisão errada conclui o slot e deixa prática errada aberta',()=>{
  const state=freshAdaptive();record(state,'2026-10-05');
  const plan=ensureDailySession(state,basicCatalog,clock('2026-10-06'));
  const review=plan.items.find(item=>item.kind==='review')!;
  record(state,'2026-10-06',{kind:'review',passed:false,activityId:review.activityId,assessmentId:review.activityId});
  expect(plan.completed).toContain(review.id);expect(state.skills['javascript.conversao'].review.dueDay).toBe('2026-10-07');
  const practice=plan.items.find(item=>item.kind==='practice')!;
  record(state,'2026-10-06',{passed:false,activityId:practice.activityId,assessmentId:practice.activityId});
  expect(plan.completed).not.toContain(practice.id);
 });
 it('assistência pode concluir a atividade, mantendo a ausência de domínio independente',()=>{
  const state=freshAdaptive();const plan=ensureDailySession(state,basicCatalog,clock('2026-10-06'));
  record(state,'2026-10-06',{assisted:true});
  expect(plan.completed).toContain('cart-total');expect(skillMastery(state,'javascript.conversao').score).toBeNull();
 });
 it('retorna um plano vazio válido e reconstrói referências removidas do catálogo',()=>{
  const state=freshAdaptive();ensureDailySession(state,basicCatalog,clock('2026-10-06'));
  const empty=ensureDailySession(state,{skills:[],activities:[]},clock('2026-10-06'));
  expect(empty).toEqual({day:'2026-10-06',items:[],completed:[],totalMinutes:0});
  expect(prepareAdaptiveBackup({...state,daily:empty}).daily).toEqual(empty);
 });
 it('produz a mesma seleção apesar da ordem de cadastro',()=>{
  const state=freshAdaptive();
  const reversed={skills:[...basicCatalog.skills].reverse(),activities:[...basicCatalog.activities].reverse()};
  expect(buildDailySession(state,reversed,clock('2026-10-06'))).toEqual(buildDailySession(state,basicCatalog,clock('2026-10-06')));
 });
});

describe('normalização e importação de dados locais',()=>{
 const populated=()=>{const state=freshAdaptive();record(state,'2026-10-06');ensureDailySession(state,basicCatalog,clock('2026-10-06'));return state;};
 it('faz round trip sem calcular crédito de campos percentuais fornecidos pelo arquivo',()=>{
  const state=populated();const restored=prepareAdaptiveBackup(JSON.parse(JSON.stringify(state)));
  expect(restored).toEqual(state);
  const dirty=JSON.parse(JSON.stringify(state));dirty.skills['javascript.conversao'].score=999;
  expect(skillMastery(normalizeAdaptive(dirty),'javascript.conversao').score).toBe(100);
  expect(()=>prepareAdaptiveBackup(dirty)).toThrow(/jornada atual foi preservada/);
 });
 it('recupera storage corrompido descartando entradas, mas rejeita um backup que perderia dados',()=>{
  const dirty=populated() as unknown as {skills:Record<string,{evidence:Record<string,{attempts:number}>}>};
  dirty.skills['javascript.conversao'].evidence['cart-total'].attempts=-1;
  expect(normalizeAdaptive(dirty).skills).toEqual({});
  expect(()=>prepareAdaptiveBackup(dirty)).toThrow(/inválidos/);
 });
 it('recusa datas impossíveis, intervalos exagerados, contadores fracionários e versões futuras',()=>{
  for(const mutate of [
   (s:AdaptiveState)=>{s.skills['javascript.conversao'].review.dueDay='2026-02-30';},
   (s:AdaptiveState)=>{s.skills['javascript.conversao'].review.dueDay='2027-10-07';},
   (s:AdaptiveState)=>{s.skills['javascript.conversao'].evidence['cart-total'].hints=1.5;},
  ]){const state=populated();mutate(state);expect(()=>prepareAdaptiveBackup(state)).toThrow(/inválidos/);}
  expect(()=>prepareAdaptiveBackup({...populated(),version:2})).toThrow(/inválidos/);
 });
 it('recusa chaves de protótipo, duplicatas e campos desconhecidos na importação estrita',()=>{
  const state=populated();
  const polluted=JSON.parse(JSON.stringify(state));polluted.skills.constructor=polluted.skills['javascript.conversao'];
  expect(Object.keys(normalizeAdaptive(polluted).skills)).toEqual(['javascript.conversao']);
  expect(()=>prepareAdaptiveBackup(polluted)).toThrow(/inválidos/);
  expect(()=>prepareAdaptiveBackup({...state,eventIds:['same','same']})).toThrow(/inválidos/);
  expect(()=>prepareAdaptiveBackup({...state,derivedScore:100})).toThrow(/inválidos/);
 });
 it('não aceita plano diário duplicado, fora de ordem, com duração ou conclusão inventada',()=>{
  for(const mutate of [
   (s:AdaptiveState)=>{s.daily!.items.push({...s.daily!.items[0]});},
   (s:AdaptiveState)=>{s.daily!.items.reverse();},
   (s:AdaptiveState)=>{s.daily!.totalMinutes=999;},
   (s:AdaptiveState)=>{s.daily!.completed=['missing-activity'];},
  ]){const state=populated();mutate(state);expect(()=>prepareAdaptiveBackup(state)).toThrow(/inválidos/);}
 });
 it('limita leituras acumuladas e rejeita um backup além do limite em vez de truncar silenciosamente',()=>{
  const state=freshAdaptive();for(let i=0;i<ADAPTIVE_LIMITS.concepts+2;i++)markConceptSeen(state,'concept-'+i,clock('2026-10-06'));
  expect(state.seenConcepts).toHaveLength(ADAPTIVE_LIMITS.concepts);
  expect(()=>prepareAdaptiveBackup({...state,seenConcepts:[...state.seenConcepts,'concept-extra']})).toThrow(/inválidos/);
 });
 it('datas e fusos inválidos falham explicitamente antes de alterar evidências',()=>{
  const state=freshAdaptive();expect(()=>recordEvidence(state,event(),{now:NaN,timeZone:'UTC'})).toThrow(RangeError);
  expect(()=>recordEvidence(state,event(),{now:Date.now(),timeZone:'Zona/Inexistente'})).toThrow(RangeError);
  expect(state).toEqual(freshAdaptive());
 });
});

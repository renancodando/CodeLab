import {it,expect} from 'vitest';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {buildDailySession,ensureDailySession,freshAdaptive,markConceptSeen,recordEvidence,prepareAdaptiveBackup,type AdaptiveCatalog} from '../../src/learning/adaptive';
import {planoValoresAnterior} from '../fixtures/plano-valores-anterior';
const relogio={now:Date.parse('2026-10-11T12:00:00Z'),timeZone:'UTC'};
const catalogo={...adaptiveCatalog,preferredLanguage:'javascript'};
it('a primeira sessão prepara e pratica somente o assunto apresentado',()=>{
 const plano=buildDailySession(freshAdaptive(),catalogo,relogio);
 expect(plano.items.map(item=>({id:item.activityId,kind:item.kind}))).toEqual([
  {id:idPreparacao('programar'),kind:'concept'},
  {id:'inicio-prever-ordem',kind:'practice'},
  {id:'inicio-diagnosticar-texto',kind:'practice'},
  {id:'inicio-reconstruir-roteiro',kind:'challenge'}
 ]);
});
it('uma jornada nova começa pelas instruções antes de valores, decisões e laços',()=>{
 const plano=buildDailySession(freshAdaptive(),catalogo,relogio);
 const conceito=adaptiveCatalog.activities.find(a=>a.id===plano.items.find(i=>i.kind==='concept')?.activityId);
 expect(conceito?.lessonId).toBe('programar');expect(conceito?.preparacaoAteBloco).toBe(8);
});
it('a preparação acompanha cada assunto na ordem pedagógica sem gerar domínio pela leitura',()=>{
 const estado=freshAdaptive();
 const obrigatorios=['programar','entrada-saida','passos','valores','decisoes','repeticoes','funcoes'];
 expect(adaptiveCatalog.activities.filter(a=>a.kind==='concept'&&a.preparacaoAteBloco===undefined).map(a=>a.lessonId)).toEqual(expect.arrayContaining(obrigatorios));
 for(const id of ['programar','entrada-saida','passos','tipos-erros','investigar','valores','decisoes','repeticoes','funcoes','colecoes']){
  const conceito=adaptiveCatalog.activities.find(a=>a.kind==='concept'&&a.lessonId===id&&a.preparacaoAteBloco===undefined);
  if(!conceito)continue;
  expect(buildDailySession(estado,catalogo,relogio).items.find(i=>i.kind==='concept')?.activityId).toBe(idPreparacao(id));
  const preparacao=adaptiveCatalog.activities.find(a=>a.id===idPreparacao(id))!;
  markConceptSeen(estado,preparacao.id,relogio,preparacao.incluiConceitos);expect(estado.seenConcepts).toContain(conceito.id);expect(estado.skills).toEqual({});
 }
});
it('o plano iniciado em valores antes das novas pausas continua válido',()=>{
 const estado=freshAdaptive();estado.daily=planoValoresAnterior('2026-10-11');
 const plano=estado.daily,conceito=adaptiveCatalog.activities.find(a=>a.id===plano.items.find(i=>i.kind==='concept')?.activityId);
 expect(conceito?.lessonId).toBe('valores');const antes=JSON.stringify(plano);
 expect(ensureDailySession(estado,catalogo,relogio)).toBe(plano);expect(JSON.stringify(plano)).toBe(antes);expect(estado.skills).toEqual({});
});
it.each([{anterior:'practice',atual:'challenge'},{anterior:'challenge',atual:'practice'}] as const)('retoma $anterior como $atual sem perder a etapa e aceita a conferência fora da sessão',({anterior,atual})=>{
 const estado=freshAdaptive(),catalogo:AdaptiveCatalog={skills:[{id:'javascript.teste',label:'Teste',path:['JavaScript']}],activities:[{id:'etapa-antiga',title:'Etapa',kind:atual,skillIds:['javascript.teste'],minutes:3}]};
 estado.daily={day:'2026-10-11',items:[{id:'etapa-antiga',activityId:'etapa-antiga',kind:anterior,minutes:3}],completed:[],totalMinutes:3};
 const plano=estado.daily;expect(ensureDailySession(estado,catalogo,relogio)).toBe(plano);
 const evento={assessmentId:'etapa-antiga',activityId:'etapa-antiga',skillIds:['javascript.teste'],revision:1,assisted:false,attempts:1,hints:0};
 recordEvidence(estado,{...evento,id:'revisao',kind:'review',passed:true},relogio);expect(plano.completed).toEqual([]);
 recordEvidence(estado,{...evento,id:'erro',kind:atual,passed:false},relogio);expect(plano.completed).toEqual([]);
 recordEvidence(estado,{...evento,id:'acerto',kind:atual,passed:true},relogio);expect(plano.completed).toEqual(['etapa-antiga']);
 expect(prepareAdaptiveBackup(JSON.parse(JSON.stringify(estado)))).toEqual(estado);expect(ensureDailySession(estado,catalogo,relogio)).toBe(plano);
});
it('revisão de outro assunto não insere novos exercícios dele depois do conceito',()=>{
 const estado=freshAdaptive();recordEvidence(estado,{id:'ontem',assessmentId:'soma',activityId:'js-debug-soma-vazia',skillIds:['javascript.arrays.reduce'],revision:1,assisted:false,attempts:1,hints:0,kind:'practice',passed:true},{...relogio,now:relogio.now-86400000});
 const plano=buildDailySession(estado,catalogo,relogio);expect(plano.items[0].kind).toBe('review');
 expect(plano.items.slice(1).map(i=>i.activityId)).toEqual([idPreparacao('programar'),'inicio-prever-ordem','inicio-diagnosticar-texto','inicio-reconstruir-roteiro']);
});
it('a sessão aceita menos etapas quando não há prática preparada suficiente',()=>{
 const catalogo:AdaptiveCatalog={skills:[{id:'javascript.teste',label:'Teste',path:['JavaScript']},{id:'javascript.outro',label:'Outro',path:['JavaScript']}],activities:[{id:'conceito',kind:'concept',title:'Conceito',skillIds:['javascript.teste'],minutes:2},{id:'aplicar',kind:'practice',title:'Aplicar',skillIds:['javascript.teste'],minutes:3},{id:'preenchimento',kind:'practice',title:'Outro assunto',skillIds:['javascript.outro'],minutes:3},{id:'final-aleatorio',kind:'challenge',title:'Outro desafio',skillIds:['javascript.outro'],minutes:4}]};
 expect(buildDailySession(freshAdaptive(),catalogo,relogio).items.map(i=>i.activityId)).toEqual(['conceito','aplicar']);
});
it('a leitura abrangente não pula um pré-requisito de habilidade nem aceita vínculo inexistente',()=>{
 const atividades:AdaptiveCatalog['activities']=[{id:'introducao',title:'Introdução',kind:'concept',skillIds:['javascript.teste'],minutes:2},{id:'preparacao',title:'Preparação',kind:'concept',skillIds:['javascript.teste'],minutes:3,incluiConceitos:['introducao'],prerequisites:['javascript.teste']},{id:'exercicio',title:'Exercício',kind:'practice',skillIds:['javascript.teste'],minutes:3,requiredConcepts:['preparacao']}];
 const catalogo:AdaptiveCatalog={skills:[{id:'javascript.teste',label:'Teste',path:['JavaScript']}],activities:atividades};
 expect(buildDailySession(freshAdaptive(),catalogo,relogio).items.map(i=>i.activityId)).toEqual(['introducao']);
 catalogo.activities[1]={...atividades[1],prerequisites:[],incluiConceitos:['inexistente']};
 expect(buildDailySession(freshAdaptive(),catalogo,relogio).items.map(i=>i.activityId)).toEqual(['introducao']);
});
it('mudar a ordem do catálogo não troca o plano já iniciado',()=>{const estado=freshAdaptive(),antigo={...catalogo,activities:catalogo.activities.map(({ordem,...a})=>a)};const plano=ensureDailySession(estado,antigo,relogio);const antes=JSON.stringify(plano);expect(ensureDailySession(estado,catalogo,relogio)).toBe(plano);expect(JSON.stringify(plano)).toBe(antes);});
it('a ordem pode vencer o nome e o desempate continua determinístico',()=>{const catalogo:AdaptiveCatalog={skills:[{id:'javascript.teste',label:'Teste',path:['JavaScript']}],activities:[{id:'a-avancado',title:'Avançado',kind:'concept',skillIds:['javascript.teste'],minutes:2,ordem:4},{id:'z-inicial',title:'Inicial',kind:'concept',skillIds:['javascript.teste'],minutes:2,ordem:0}]};expect(buildDailySession(freshAdaptive(),catalogo,relogio).items[0].activityId).toBe('z-inicial');catalogo.activities[0].ordem=0;expect(buildDailySession(freshAdaptive(),catalogo,relogio).items[0].activityId).toBe('a-avancado');delete catalogo.activities[0].ordem;delete catalogo.activities[1].ordem;expect(buildDailySession(freshAdaptive(),catalogo,relogio).items[0].activityId).toBe('a-avancado');});
it('uma ordem inválida não força prioridade sobre o catálogo válido',()=>{for(const ordem of [NaN,Infinity,-1,0.5,10001]){const catalogo:AdaptiveCatalog={skills:[{id:'javascript.teste',label:'Teste',path:['JavaScript']}],activities:[{id:'a-invalido',title:'Inválido',kind:'concept',skillIds:['javascript.teste'],minutes:2,ordem},{id:'z-valido',title:'Válido',kind:'concept',skillIds:['javascript.teste'],minutes:2,ordem:0}]};expect(buildDailySession(freshAdaptive(),catalogo,relogio).items.map(a=>a.activityId)).toEqual(['z-valido']);}});
it('a prioridade não dispensa pré-requisitos de habilidade nem preparação',()=>{const catalogo:AdaptiveCatalog={skills:[{id:'javascript.teste',label:'Teste',path:['JavaScript']}],activities:[{id:'a-bloqueado',title:'Bloqueado',kind:'concept',skillIds:['javascript.teste'],minutes:2,ordem:0,prerequisites:['javascript.teste']},{id:'b-preparacao',title:'Preparação',kind:'concept',skillIds:['javascript.teste'],minutes:2,ordem:1,requiredConcepts:['z-inicial']},{id:'z-inicial',title:'Inicial',kind:'concept',skillIds:['javascript.teste'],minutes:2,ordem:2}]};expect(buildDailySession(freshAdaptive(),catalogo,relogio).items[0].activityId).toBe('z-inicial');});

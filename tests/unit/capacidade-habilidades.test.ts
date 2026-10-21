import {it,expect} from 'vitest';
import {adaptiveCatalog} from '../../src/learning/hub-catalog';
import {freshAdaptive,recordEvidence,prepareAdaptiveBackup,ADAPTIVE_LIMITS} from '../../src/learning/adaptive';
import {normalizeProgress,prepareBackup} from '../../src/state';

it('conserva todas as habilidades atuais ao registrar a espera assíncrona e restaurar o backup',()=>{
 const estado=freshAdaptive(),relogio={now:Date.parse('2026-10-14T12:00:00.000Z'),timeZone:'UTC'};
 const habilidades=[...new Set([...adaptiveCatalog.skills.map(h=>h.id),'javascript.assincrono.espera'])];
 expect(habilidades.length).toBeGreaterThan(128);
 for(const [indice,habilidade] of habilidades.entries()){
  const resultado=recordEvidence(estado,{id:'tentativa-'+indice,assessmentId:'problema-'+indice,activityId:'problema-'+indice,skillIds:[habilidade],revision:1,passed:true,assisted:false,attempts:1,hints:0,kind:'practice'},relogio);
  expect(resultado.accepted,habilidade).toBe(true);
 }
 const jornada={version:2,adaptive:estado};
 expect(normalizeProgress(JSON.parse(JSON.stringify(jornada))).adaptive).toEqual(estado);
 expect(prepareBackup(JSON.parse(JSON.stringify(jornada))).adaptive).toEqual(estado);
 expect(JSON.stringify(estado).length).toBeLessThan(ADAPTIVE_LIMITS.bytes);
});
it('o limite de tamanho do backup continua obrigatório e a rejeição preserva a origem',()=>{
 const estado=freshAdaptive();recordEvidence(estado,{id:'base',assessmentId:'base',activityId:'base',skillIds:['base'],revision:1,passed:true,assisted:false,attempts:1,hints:0,kind:'practice'},{now:Date.parse('2026-10-14T12:00:00.000Z'),timeZone:'UTC'});
 const modelo=estado.skills.base;estado.skills={};
 for(let indice=0;indice<ADAPTIVE_LIMITS.skills;indice++){
  const evidence=Object.fromEntries(Array.from({length:ADAPTIVE_LIMITS.assessments},(_,numero)=>['problema-'+numero+'-'+'x'.repeat(130),{...modelo.evidence.base}]));
  estado.skills['habilidade-'+indice]={evidence,review:{...modelo.review}};
 }
 const antes=JSON.stringify(estado);expect(antes.length).toBeGreaterThan(ADAPTIVE_LIMITS.bytes);
 expect(()=>prepareAdaptiveBackup(estado)).toThrow();expect(JSON.stringify(estado)).toBe(antes);
 expect(prepareBackup({version:1}).adaptive.skills).toEqual({});
 const habilidades=Object.keys(estado.skills);let tamanhoAtual=antes.length;
 while(tamanhoAtual>ADAPTIVE_LIMITS.bytes){
  const chave=habilidades.pop()!;
  tamanhoAtual-=JSON.stringify(chave).length+1+JSON.stringify(estado.skills[chave]).length+(habilidades.length?1:0);
  delete estado.skills[chave];
 }
 while(tamanhoAtual<ADAPTIVE_LIMITS.bytes-200){
  const tamanho=Math.min(160,ADAPTIVE_LIMITS.bytes-200-tamanhoAtual-3);if(tamanho<5)break;
  const conceito='c'+String(estado.seenConcepts.length).padStart(3,'0')+'x'.repeat(tamanho-4);
  tamanhoAtual+=JSON.stringify(conceito).length+(estado.seenConcepts.length?1:0);
  estado.seenConcepts.push(conceito);
 }
 expect(JSON.stringify(estado).length).toBe(tamanhoAtual);
 expect(prepareAdaptiveBackup(estado)).toEqual(estado);
 const recuperavel=JSON.stringify(estado);
 const resultado=recordEvidence(estado,{id:'nova-tentativa',assessmentId:'nova-avaliacao',activityId:'nova-atividade',skillIds:['javascript.assincrono.espera'],revision:1,passed:true,assisted:false,attempts:1,hints:0,kind:'practice'},{now:Date.parse('2026-10-14T12:00:00.000Z'),timeZone:'UTC'});
 expect(resultado).toMatchObject({accepted:false,credited:false,reason:'invalid'});expect(JSON.stringify(estado)).toBe(recuperavel);
});

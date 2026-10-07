/**
 * Local learning evidence and calendar-based review. This module does not run
 * learner code or certify authorship: callers supply a verified result.
 * Percentages summarize distinct assessments; they are not a probability.
 */
export const REVIEW_DAYS = [1, 3, 7, 14, 30, 60] as const;
export const ADAPTIVE_LIMITS = {skills:128, assessments:24, events:128, concepts:512, bytes:2_000_000} as const;
export type LearningClock = {now:number; timeZone:string};
export type EvidenceEvent = {
 id:string; assessmentId:string; activityId:string; skillIds:string[]; revision:number;
 passed:boolean; assisted:boolean; attempts:number; hints:number; kind:'practice'|'review'|'challenge';
};
export type AssessmentEvidence = {
 activityId:string; revision:number; passed:boolean; assisted:boolean; attempts:number; hints:number; firstTry:boolean;
 day:string; recordedAt:string; lastDay:string; lastAt:string; assistedDay?:string; failedDay?:string;
};
export type ReviewSchedule = {stage:number; dueDay:string; lastDay:string; lastOutcome:'passed'|'failed'|'assisted'};
export type SkillProgress = {evidence:Record<string,AssessmentEvidence>; review:ReviewSchedule};
export type DailyItem = {id:string;kind:'review'|'concept'|'practice'|'challenge';activityId:string;skillId?:string;minutes:number};
export type DailySession = {day:string; items:DailyItem[]; completed:string[]; totalMinutes:number};
export type AdaptiveState = {version:1;skills:Record<string,SkillProgress>;eventIds:string[];seenConcepts:string[];daily?:DailySession};
export type SkillDefinition = {id:string;label:string;path:string[];prerequisites?:string[]};
export type LearningActivity = {id:string;title:string;kind:'concept'|'practice'|'challenge';skillIds:string[];minutes:number;lessonId?:string;prerequisites?:string[]};
export type AdaptiveCatalog = {skills:SkillDefinition[];activities:LearningActivity[];preferredLanguage?:string};
export type EvidenceResult = {accepted:boolean;credited:boolean;reason:'recorded'|'duplicate'|'stale'|'invalid'};
export type SkillMastery = {skillId:string;score:number|null;practiced:number;assisted:number;dueDay:string|null;stage:number};

const ownRecord=(value:unknown):value is Record<string,unknown>=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value);
const safeId=(value:unknown):value is string=>typeof value==='string'&&/^[a-z0-9][a-z0-9.-]{0,159}$/i.test(value)&&value.split('.').every(part=>part.length>0&&!['constructor','prototype'].includes(part));
const count=(value:unknown,min:number,max:number):value is number=>typeof value==='number'&&Number.isInteger(value)&&value>=min&&value<=max;
const dayValid=(value:unknown):value is string=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00.000Z'))&&new Date(value+'T00:00:00.000Z').toISOString().slice(0,10)===value;
const instantValid=(value:unknown):value is string=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString()===value;
const compare=(a:string,b:string)=>a<b?-1:a>b?1:0;
const daysBetween=(a:string,b:string)=>(Date.parse(b+'T00:00:00.000Z')-Date.parse(a+'T00:00:00.000Z'))/86400000;
const addDays=(day:string,days:number)=>new Date(Date.parse(day+'T00:00:00.000Z')+days*86400000).toISOString().slice(0,10);
const uniqueIds=(value:unknown,limit:number):value is string[]=>Array.isArray(value)&&value.length<=limit&&value.every(safeId)&&new Set(value).size===value.length;
const known=(value:Record<string,unknown>,fields:string[])=>Object.keys(value).every(key=>fields.includes(key));
export const freshAdaptive=():AdaptiveState=>({version:1,skills:{},eventIds:[],seenConcepts:[]});

/** Callers pass the browser's IANA zone. Due days do not use UTC midnight or 24h timers. */
export function learningDay(clock:LearningClock):string {
 if(!Number.isFinite(clock.now)||!Number.isFinite(new Date(clock.now).getTime()))throw new RangeError('Horário de aprendizagem inválido.');
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:clock.timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(clock.now));
 const part=(type:string)=>parts.find(value=>value.type===type)?.value??'';
 const day=part('year')+'-'+part('month')+'-'+part('day');
 if(!dayValid(day))throw new RangeError('Data de aprendizagem fora do intervalo suportado.');
 return day;
}

function parseEvidence(value:unknown,strict:boolean):AssessmentEvidence|undefined {
 if(!ownRecord(value)||!safeId(value.activityId)||!count(value.revision,1,100000)||typeof value.passed!=='boolean'||typeof value.assisted!=='boolean'||!count(value.attempts,1,100000)||!count(value.hints,0,10)||typeof value.firstTry!=='boolean'||!dayValid(value.day)||!dayValid(value.lastDay)||!instantValid(value.recordedAt)||!instantValid(value.lastAt))return;
 if(value.day>value.lastDay||value.recordedAt>value.lastAt)return;
 for(const field of ['assistedDay','failedDay'] as const)if(value[field]!==undefined&&(!dayValid(value[field])||value[field]>value.lastDay))return;
 const firstTry=value.passed&&!value.assisted&&value.attempts===1&&value.hints===0&&value.failedDay!==value.day;
 if(strict&&(!known(value,['activityId','revision','passed','assisted','attempts','hints','firstTry','day','recordedAt','lastDay','lastAt','assistedDay','failedDay'])||value.firstTry!==firstTry))return;
 return {activityId:value.activityId,revision:value.revision,passed:value.passed,assisted:value.assisted,attempts:value.attempts,hints:value.hints,firstTry,day:value.day,recordedAt:value.recordedAt,lastDay:value.lastDay,lastAt:value.lastAt,...(value.assistedDay===undefined?{}:{assistedDay:value.assistedDay as string}),...(value.failedDay===undefined?{}:{failedDay:value.failedDay as string})};
}
function parseSchedule(value:unknown,strict:boolean):ReviewSchedule|undefined {
 if(!ownRecord(value)||!count(value.stage,0,5)||!dayValid(value.dueDay)||!dayValid(value.lastDay)||typeof value.lastOutcome!=='string'||!['passed','failed','assisted'].includes(value.lastOutcome))return;
 const distance=daysBetween(value.lastDay,value.dueDay);
 if(distance<1||distance>REVIEW_DAYS[value.stage]||(strict&&!known(value,['stage','dueDay','lastDay','lastOutcome'])))return;
 return {stage:value.stage,dueDay:value.dueDay,lastDay:value.lastDay,lastOutcome:value.lastOutcome as ReviewSchedule['lastOutcome']};
}
function parseDaily(value:unknown,strict:boolean):DailySession|undefined {
 if(!ownRecord(value)||!dayValid(value.day)||!Array.isArray(value.items)||value.items.length>6||!uniqueIds(value.completed,6))return;
 const items:DailyItem[]=[];
 for(const item of value.items){
  if(!ownRecord(item)||!safeId(item.id)||!safeId(item.activityId)||typeof item.kind!=='string'||!['review','concept','practice','challenge'].includes(item.kind)||!count(item.minutes,1,60)||item.kind==='review'&&!safeId(item.skillId)||item.kind!=='review'&&item.skillId!==undefined||strict&&!known(item,['id','kind','activityId','skillId','minutes']))return;
  items.push({id:item.id,activityId:item.activityId,kind:item.kind as DailyItem['kind'],minutes:item.minutes,...(item.skillId===undefined?{}:{skillId:item.skillId as string})});
 }
 if(new Set(items.map(item=>item.id)).size!==items.length||new Set(items.map(item=>item.activityId)).size!==items.length||value.completed.some(id=>!items.some(item=>item.id===id)))return;
 // Slots remain ordered and bounded even in an imported backup.
 const kinds=items.map(item=>item.kind);const rank={review:0,concept:1,practice:2,challenge:3};
 if(kinds.some((kind,i)=>i>0&&rank[kind]<rank[kinds[i-1]])||kinds.filter(kind=>kind==='review').length>2||kinds.filter(kind=>kind==='concept').length>1||kinds.filter(kind=>kind==='practice').length>2||kinds.filter(kind=>kind==='challenge').length>1)return;
 const totalMinutes=items.reduce((sum,item)=>sum+item.minutes,0);
 if(strict&&(!known(value,['day','items','completed','totalMinutes'])||value.totalMinutes!==totalMinutes))return;
 return {day:value.day,items,completed:[...value.completed],totalMinutes};
}
function readAdaptive(raw:unknown,strict:boolean):AdaptiveState {
 const result=freshAdaptive();if(raw===undefined)return result;
 const invalid=():never=>{throw new Error('Os dados de habilidades ou revisão são inválidos. A jornada atual foi preservada.');};
 if(!ownRecord(raw)||raw.version!==1){if(strict)invalid();return result;}
 if(strict&&(!known(raw,['version','skills','eventIds','seenConcepts','daily'])||JSON.stringify(raw).length>ADAPTIVE_LIMITS.bytes))invalid();
 for(const [field,limit] of [['eventIds',ADAPTIVE_LIMITS.events],['seenConcepts',ADAPTIVE_LIMITS.concepts]] as const){
  const value=raw[field];
  if(strict&&!uniqueIds(value,limit))invalid();
  result[field]=Array.isArray(value)?[...new Set(value.filter(safeId))].slice(-limit):[];
 }
 if(!ownRecord(raw.skills)){if(strict)invalid();return result;}
 if(strict&&Object.keys(raw.skills).length>ADAPTIVE_LIMITS.skills)invalid();
 for(const [id,value] of Object.entries(raw.skills).slice(0,ADAPTIVE_LIMITS.skills)){
  if(!safeId(id)||!ownRecord(value)||!ownRecord(value.evidence)){if(strict)invalid();continue;}
  if(strict&&(!known(value,['evidence','review'])||Object.keys(value.evidence).length>ADAPTIVE_LIMITS.assessments))invalid();
  const review=parseSchedule(value.review,strict);if(!review){if(strict)invalid();continue;}
  const evidence:Record<string,AssessmentEvidence>={};
  for(const [assessment,entry] of Object.entries(value.evidence).slice(0,ADAPTIVE_LIMITS.assessments)){
   const parsed=parseEvidence(entry,strict);if(!safeId(assessment)||!parsed){if(strict)invalid();continue;}evidence[assessment]=parsed;
  }
  if(!Object.keys(evidence).length){if(strict)invalid();continue;}
  result.skills[id]={evidence,review};
 }
 if(raw.daily!==undefined){const daily=parseDaily(raw.daily,strict);if(!daily&&strict)invalid();if(daily)result.daily=daily;}
 return result;
}
/** Tolerant storage recovery. It never manufactures evidence from lesson completion. */
export const normalizeAdaptive=(raw:unknown):AdaptiveState=>readAdaptive(raw,false);
/** Undefined means a legacy backup without this feature; present malformed data is rejected. */
export const prepareAdaptiveBackup=(raw:unknown):AdaptiveState=>readAdaptive(raw,true);

export function skillMastery(state:AdaptiveState,skillId:string):SkillMastery {
 const progress=state.skills[skillId];const records=Object.values(progress?.evidence??{});
 const independent=records.filter(record=>!record.assisted);
 const points=independent.map(record=>!record.passed?0:record.firstTry?100:Math.max(40,80-record.hints*10));
 return {skillId,score:points.length?Math.round(points.reduce((sum,n)=>sum+n,0)/points.length):null,practiced:points.length,assisted:records.filter(record=>record.assisted).length,dueDay:progress?.review.dueDay??null,stage:progress?.review.stage??0};
}
export function dueReviews(state:AdaptiveState,clock:LearningClock):string[] {
 const day=learningDay(clock);
 return Object.keys(state.skills).filter(id=>state.skills[id].review.dueDay<=day)
  .sort((a,b)=>compare(state.skills[a].review.dueDay,state.skills[b].review.dueDay)||(skillMastery(state,a).score??-1)-(skillMastery(state,b).score??-1)||compare(a,b));
}
function nextReview(previous:ReviewSchedule|undefined,event:EvidenceEvent,day:string,assisted:boolean):ReviewSchedule {
 const outcome=assisted?'assisted':event.passed?'passed':'failed';
 if(!previous)return {stage:0,dueDay:addDays(day,1),lastDay:day,lastOutcome:outcome};
 // A day cannot grow the interval twice; a later error or solution reveal can still shorten it.
 if(previous.lastDay===day&&(previous.lastOutcome==='assisted'||previous.lastOutcome===outcome||previous.lastOutcome==='failed'&&outcome==='passed'))return previous;
 if(outcome!=='passed'){
  const stage=outcome==='assisted'?0:Math.max(0,previous.stage-2);
  const candidate=addDays(day,REVIEW_DAYS[stage]);
  const dueDay=previous.dueDay>day&&previous.dueDay<candidate?previous.dueDay:candidate;
  return {stage,dueDay,lastDay:day,lastOutcome:outcome};
 }
 // Completing a fresh exercise or practising early is not a successful due review.
 if(event.kind!=='review'||previous.dueDay>day||previous.lastDay===day)return previous;
 const stage=Math.min(5,previous.stage+1);
 return {stage,dueDay:addDays(day,REVIEW_DAYS[stage]),lastDay:day,lastOutcome:'passed'};
}
const validEvent=(event:EvidenceEvent)=>ownRecord(event)&&safeId(event.id)&&safeId(event.assessmentId)&&safeId(event.activityId)&&uniqueIds(event.skillIds,8)&&event.skillIds.length>0&&count(event.revision,1,100000)&&typeof event.passed==='boolean'&&typeof event.assisted==='boolean'&&count(event.attempts,1,100000)&&count(event.hints,0,10)&&['practice','review','challenge'].includes(event.kind);
/** Mutates the caller's local state only. assessmentId is stable per problem, not per day. */
export function recordEvidence(state:AdaptiveState,event:EvidenceEvent,clock:LearningClock):EvidenceResult {
 if(!validEvent(event))return {accepted:false,credited:false,reason:'invalid'};
 if(state.eventIds.includes(event.id))return {accepted:false,credited:false,reason:'duplicate'};
 const day=learningDay(clock);const at=new Date(clock.now).toISOString();
 const existingSkills=Object.keys(state.skills);
 if(new Set([...existingSkills,...event.skillIds]).size>ADAPTIVE_LIMITS.skills)return {accepted:false,credited:false,reason:'invalid'};
 if(event.skillIds.some(id=>{
  const previous=state.skills[id];return previous&&(previous.review.lastDay>day||Object.values(previous.evidence).some(record=>record.lastAt>at));
 }))return {accepted:false,credited:false,reason:'stale'};
 let credited=false;
 for(const skill of event.skillIds){
  const previous=state.skills[skill];const old=previous?.evidence[event.assessmentId];
  const sameRevision=old?.revision===event.revision;
  const assisted=event.assisted||Boolean(sameRevision&&old?.assistedDay===day);
  const failedDay=!event.passed&&!assisted?day:sameRevision?old?.failedDay:undefined;
  const assistedDay=assisted?day:sameRevision?old?.assistedDay:undefined;
  const attempts=sameRevision&&old?.lastDay===day?Math.max(old.attempts,event.attempts):event.attempts;
  const hints=sameRevision&&old?.lastDay===day?Math.max(old.hints,event.hints):event.hints;
  const update:AssessmentEvidence={activityId:event.activityId,revision:event.revision,passed:event.passed,assisted,attempts,hints,
   firstTry:event.passed&&!assisted&&attempts===1&&hints===0&&failedDay!==day,day,recordedAt:at,lastDay:day,lastAt:at,
   ...(assistedDay?{assistedDay}:{}),...(failedDay?{failedDay}:{})};
  // Seeing a solution preserves earlier independent evidence, without turning it into a new success.
  const record=assisted&&sameRevision&&old&&!old.assisted?{...old,lastDay:day,lastAt:at,assistedDay:day,...(failedDay?{failedDay}:{})}:update;
  const evidence={...(previous?.evidence??{}),[event.assessmentId]:record};
  if(Object.keys(evidence).length>ADAPTIVE_LIMITS.assessments){
   const oldest=Object.keys(evidence).filter(id=>id!==event.assessmentId).sort((a,b)=>compare(evidence[a].lastAt,evidence[b].lastAt)||compare(a,b))[0];
   delete evidence[oldest];
  }
  state.skills[skill]={evidence,review:nextReview(previous?.review,event,day,assisted)};
  if(!assisted&&event.passed&&(!sameRevision||!old?.passed||old.assisted))credited=true;
 }
 state.eventIds.push(event.id);state.eventIds=state.eventIds.slice(-ADAPTIVE_LIMITS.events);
 if(state.daily?.day===day)for(const item of state.daily.items){
  const complete=item.kind==='review'?event.kind==='review'&&event.skillIds.includes(item.skillId??'')&&item.activityId===event.activityId:
   item.kind===event.kind&&item.activityId===event.activityId&&event.passed;
  if(complete&&!state.daily.completed.includes(item.id))state.daily.completed.push(item.id);
 }
 return {accepted:true,credited,reason:'recorded'};
}
export function markConceptSeen(state:AdaptiveState,activityId:string,clock:LearningClock):void {
 if(!safeId(activityId))return;
 const day=learningDay(clock);
 if(!state.seenConcepts.includes(activityId))state.seenConcepts.push(activityId);
 state.seenConcepts=state.seenConcepts.slice(-ADAPTIVE_LIMITS.concepts);
 if(state.daily?.day===day)for(const item of state.daily.items)if(item.kind==='concept'&&item.activityId===activityId&&!state.daily.completed.includes(item.id))state.daily.completed.push(item.id);
}
function catalogActivities(catalog:AdaptiveCatalog):LearningActivity[] {
 const skills=new Set(catalog.skills.filter(skill=>safeId(skill.id)).map(skill=>skill.id));
 const ids=new Set<string>();
 return catalog.activities.filter(activity=>{
  if(activity.prerequisites!==undefined&&!uniqueIds(activity.prerequisites,16)||!safeId(activity.id)||ids.has(activity.id)||!uniqueIds(activity.skillIds,8)||!activity.skillIds.length||activity.skillIds.some(id=>!skills.has(id))||!count(activity.minutes,1,60)||!['concept','practice','challenge'].includes(activity.kind))return false;
  ids.add(activity.id);return true;
 }).sort((a,b)=>compare(a.id,b.id));
}
const hasPassed=(state:AdaptiveState,activityId:string)=>Object.values(state.skills).some(skill=>Object.values(skill.evidence).some(record=>record.activityId===activityId&&record.passed&&!record.assisted));
function prerequisitesMet(state:AdaptiveState,activity:LearningActivity,catalog:AdaptiveCatalog):boolean {
 const required=new Set([...(activity.prerequisites??[]),...activity.skillIds.flatMap(id=>catalog.skills.find(skill=>skill.id===id)?.prerequisites??[])]);
 return [...required].every(id=>{const mastery=skillMastery(state,id);return mastery.practiced>=2&&(mastery.score??0)>=60;});
}
function weakness(state:AdaptiveState,activity:LearningActivity):number {
 return Math.min(...activity.skillIds.map(id=>skillMastery(state,id).score??0));
}
/** A bounded plan, not an endless queue. Empty catalog or unavailable slots are valid. */
export function buildDailySession(state:AdaptiveState,catalog:AdaptiveCatalog,clock:LearningClock):DailySession {
 const day=learningDay(clock);const activities=catalogActivities(catalog);const items:DailyItem[]=[];const used=new Set<string>();
 const add=(kind:DailyItem['kind'],activity:LearningActivity,skillId?:string)=>{
  const id=activity.id;
  items.push({id,kind,activityId:activity.id,minutes:activity.minutes,...(skillId?{skillId}:{})});used.add(activity.id);
 };
 for(const skillId of dueReviews(state,clock)){
  if(items.length>=2)break;
  const activity=activities.filter(activity=>activity.kind!=='concept'&&activity.skillIds.includes(skillId)&&!used.has(activity.id))
   .sort((a,b)=>Number(b.kind==='practice')-Number(a.kind==='practice')||Number(hasPassed(state,a.id))-Number(hasPassed(state,b.id))||compare(a.id,b.id))[0];
  if(activity)add('review',activity,skillId);
 }
 const eligible=activities.filter(activity=>(!catalog.preferredLanguage||activity.skillIds.some(id=>id.split('.')[0]===catalog.preferredLanguage))&&prerequisitesMet(state,activity,catalog));
 const concept=eligible.filter(activity=>activity.kind==='concept'&&!state.seenConcepts.includes(activity.id)&&!used.has(activity.id))[0];
 if(concept)add('concept',concept);
 const focus=new Set([...(concept?.skillIds??[]),...items.flatMap(item=>item.skillId?[item.skillId]:[])]);
 const relevant=(activity:LearningActivity)=>activity.skillIds.some(id=>focus.has(id));
 const practices=eligible.filter(activity=>activity.kind==='practice'&&!used.has(activity.id))
  .sort((a,b)=>Number(relevant(b))-Number(relevant(a))||Number(hasPassed(state,a.id))-Number(hasPassed(state,b.id))||weakness(state,a)-weakness(state,b)||compare(a.id,b.id));
 for(const activity of practices.slice(0,2))add('practice',activity);
 const challenge=eligible.filter(activity=>activity.kind==='challenge'&&!used.has(activity.id))
  .sort((a,b)=>Number(relevant(b))-Number(relevant(a))||Number(hasPassed(state,a.id))-Number(hasPassed(state,b.id))||weakness(state,a)-weakness(state,b)||compare(a.id,b.id))[0];
 if(challenge)add('challenge',challenge);
 return {day,items,completed:[],totalMinutes:items.reduce((sum,item)=>sum+item.minutes,0)};
}
/** Keeps today's sequence stable while its evidence changes. Rebuilds after local midnight. */
export function ensureDailySession(state:AdaptiveState,catalog:AdaptiveCatalog,clock:LearningClock):DailySession {
 const day=learningDay(clock);const activities=catalogActivities(catalog);
 if(state.daily?.day===day&&(state.daily.items.length>0||activities.length===0)&&state.daily.items.every(item=>activities.some(activity=>activity.id===item.activityId&&activity.skillIds.includes(item.skillId??activity.skillIds[0])&&(item.kind==='review'||activity.kind===item.kind))))return state.daily;
 state.daily=buildDailySession(state,catalog,clock);return state.daily;
}

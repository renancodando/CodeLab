import type { Progress } from './types';
import {normalizeSessions} from './learning/session';
import {normalizeAdaptive,prepareAdaptiveBackup} from './learning/adaptive';
import {normalizePracticeAnswers,preparePracticeAnswers} from './learning/activity-state';
import {normalizeProjectWorkspaces,prepareProjectWorkspaces} from './learning/projects';
const key = 'codelab.progress.v2';
const legacyKey = 'codelab.progress.v1';
const fresh = (): Progress => ({version:2,learningLanguage:'javascript',adaptive:normalizeAdaptive(undefined),practiceAnswers:{},projectWorkspaces:{},lessonSessions:{},completed:[],lessons:[],projects:[],drafts:{},attempts:{},hints:{},history:{},review:{},activeDays:[],name:'Explorador'});
const safeKey=(key:unknown):key is string=>typeof key==='string'&&/^[a-z0-9][a-z0-9-]{0,79}$/i.test(key)&&!['constructor','prototype'].includes(key);
export function normalizeProgress(raw: unknown): Progress {
 const result=fresh();if(!raw||typeof raw!=='object')return result;const p=raw as Record<string,unknown>;
 for(const prop of ['completed','lessons','activeDays'] as const)if(Array.isArray(p[prop]))result[prop]=[...new Set((p[prop] as unknown[]).filter((v):v is string=>typeof v==='string'&&safeKey(v)))].slice(0,1000);
 if(typeof p.name==='string')result.name=p.name.trim().slice(0,40)||'Explorador';
 for(const prop of ['drafts','review'] as const)if(p[prop]&&typeof p[prop]==='object')for(const [k,v] of Object.entries(p[prop]).slice(0,80))if(safeKey(k)&&typeof v==='string')result[prop][k]=v.slice(0,prop==='drafts'?30000:40);
 for(const prop of ['attempts','hints'] as const)if(p[prop]&&typeof p[prop]==='object')for(const [k,v] of Object.entries(p[prop]).slice(0,200))if(safeKey(k)&&typeof v==='number'&&Number.isFinite(v)&&v>=0)result[prop][k]=Math.min(Math.floor(v),prop==='hints'?5:100000);
 if(p.history&&typeof p.history==='object')for(const [k,v] of Object.entries(p.history).slice(0,12))if(safeKey(k)&&Array.isArray(v))result.history[k]=v.filter(x=>x&&typeof x.code==='string'&&typeof x.date==='string').slice(-5).map(x=>({code:x.code.slice(0,15000),date:x.date.slice(0,40)}));
 if(Array.isArray(p.projects))result.projects=p.projects.filter(x=>x&&safeKey(x.id)&&typeof x.title==='string'&&typeof x.code==='string'&&['html','javascript','python','csharp','cpp','sql'].includes(x.language)).slice(0,12).map(x=>({id:x.id,title:x.title.slice(0,60),code:x.code.slice(0,30000),language:x.language,updatedAt:typeof x.updatedAt==='string'?x.updatedAt.slice(0,40):''}));
 result.lessonSessions=normalizeSessions(p.lessonSessions);
 result.learningLanguage=['html','css','javascript','typescript','python','csharp','cpp','sql'].includes(String(p.learningLanguage))?String(p.learningLanguage):'javascript';
 result.adaptive=normalizeAdaptive(p.adaptive);
 result.practiceAnswers=normalizePracticeAnswers(p.practiceAnswers);
 result.projectWorkspaces=normalizeProjectWorkspaces(p.projectWorkspaces);
 return result;
}
export function readProgress(): Progress {
 for(const storageKey of [key,legacyKey])try{const raw=localStorage.getItem(storageKey);if(raw){const data=JSON.parse(raw);if(data?.version===1||data?.version===2)return normalizeProgress(data);}}catch{}
 return fresh();
}
export function prepareBackup(value:unknown):Progress {
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('O arquivo não contém uma jornada válida.');
 const p=value as Record<string,unknown>;
 if(p.version!==1&&p.version!==2)throw new Error('Versão de jornada não suportada. Guarde o arquivo original.');
 const limits={completed:1000,lessons:1000,activeDays:1000,projects:12,drafts:80,review:80,attempts:200,hints:200,history:12,lessonSessions:60};
 for(const [field,limit] of Object.entries(limits)){const v=p[field];if(v&&typeof v==='object'&&Object.keys(v).length>limit)throw new Error('A jornada excede o limite de '+field+'. Nenhum dado foi substituído.');}
 if(Array.isArray(p.projects)&&p.projects.some(x=>x&&typeof x.code==='string'&&x.code.length>30000))throw new Error('Há um projeto maior que o limite. Exporte-o separadamente; a jornada atual foi preservada.');
 for(const prop of ['drafts','history','lessonSessions'])if(p[prop]&&typeof p[prop]==='object'){
  const serialized=JSON.stringify(p[prop]);if(serialized.length>2000000)throw new Error('O arquivo excede o limite de dados de '+prop+'. A jornada atual foi preservada.');
 }
 if(p.drafts&&typeof p.drafts==='object'&&Object.values(p.drafts).some(v=>typeof v==='string'&&v.length>30000))throw new Error('Há um rascunho maior que o limite. A jornada atual foi preservada.');
 if(p.lessonSessions&&typeof p.lessonSessions==='object')for(const session of Object.values(p.lessonSessions)){
  if(!session||typeof session!=='object')throw new Error('Há uma sessão de aula inválida.');
  const a=(session as {answers?:Record<string,{value?:unknown}>}).answers;
  if(a&&(Object.keys(a).length>100||Object.values(a).some(v=>v&&typeof v.value==='string'&&v.value.length>30000)))throw new Error('Uma sessão de aula excede o limite. Nenhum dado foi substituído.');
 }
 const invalid=(message:string):never=>{throw new Error(message+' A jornada atual foi preservada.');};
 if(p.name!==undefined&&(typeof p.name!=='string'||p.name.length>40))invalid('O nome da jornada é inválido ou excede 40 caracteres.');
 for(const field of ['completed','lessons','activeDays'])if(p[field]!==undefined){
  if(!Array.isArray(p[field])||(p[field] as unknown[]).some(v=>!safeKey(v)))invalid('Há dados inválidos em '+field+'.');
 }
 for(const field of ['drafts','review','attempts','hints','history','lessonSessions'])if(p[field]!==undefined){
  const mapping=p[field];if(!mapping||typeof mapping!=='object'||Array.isArray(mapping)||Object.keys(mapping).some(k=>!safeKey(k)))invalid('Há dados inválidos em '+field+'.');
 }
 for(const field of ['drafts','review'])if(p[field]&&Object.values(p[field]).some(v=>typeof v!=='string'||v.length>(field==='drafts'?30000:40)))invalid('Há valores inválidos ou maiores que o limite em '+field+'.');
 for(const field of ['attempts','hints'])if(p[field]&&Object.values(p[field]).some(v=>typeof v!=='number'||!Number.isInteger(v)||v<0||v>(field==='hints'?5:100000)))invalid('Há contadores inválidos em '+field+'.');
 if(p.projects!==undefined){
  if(!Array.isArray(p.projects))invalid('A lista de projetos é inválida.');
  for(const value of p.projects as unknown[]){
   if(!value||typeof value!=='object')invalid('Há um projeto inválido.');
   const project=value as Record<string,unknown>;
   if(!safeKey(project.id)||typeof project.title!=='string'||project.title.length>60||typeof project.code!=='string'||project.code.length>30000||!['html','javascript','python','csharp','cpp','sql'].includes(String(project.language)))invalid('Há um projeto inválido ou maior que o limite.');
  }
 }
 if(p.history)for(const value of Object.values(p.history)){
  if(!Array.isArray(value)||value.length>5||value.some(entry=>!entry||typeof entry.code!=='string'||entry.code.length>15000||typeof entry.date!=='string'||entry.date.length>40))invalid('Há um histórico inválido ou maior que o limite.');
 }
 if(p.lessonSessions)for(const [id,value] of Object.entries(p.lessonSessions)){
  const normalized=normalizeSessions({[id]:value});if(!normalized[id])invalid('Há uma sessão de aula inválida.');
  const session=value as Record<string,unknown>;
  if(!session.answers||typeof session.answers!=='object'||Array.isArray(session.answers))invalid('As respostas da sessão são inválidas.');
  for(const [step,value] of Object.entries(session.answers as Record<string,unknown>)){
   if(!safeKey(step)||!value||typeof value!=='object')invalid('Há uma resposta de aula inválida.');
   const a=value as Record<string,unknown>;
   if(typeof a.value!=='string'||a.value.length>30000||typeof a.attempts!=='number'||!Number.isInteger(a.attempts)||a.attempts<0||a.attempts>100000||typeof a.hints!=='number'||!Number.isInteger(a.hints)||a.hints<0||a.hints>10||['passed','assisted','firstTry'].some(field=>typeof a[field]!=='boolean'))invalid('Há uma resposta de aula inválida ou maior que o limite.');
  }
 }
 if(p.learningLanguage!==undefined&&!['html','css','javascript','typescript','python','csharp','cpp','sql'].includes(String(p.learningLanguage)))invalid('A linguagem de estudo é inválida.');
 prepareAdaptiveBackup(p.adaptive);
 preparePracticeAnswers(p.practiceAnswers);
 prepareProjectWorkspaces(p.projectWorkspaces);
 return normalizeProgress(value);
}
export let progress=readProgress();
export function saveProgress():boolean{try{localStorage.setItem(key,JSON.stringify(progress));window.dispatchEvent(new Event('progresschange'));return true;}catch{window.dispatchEvent(new CustomEvent('storageerror'));return false;}}
export function replaceProgress(value:unknown){progress=normalizeProgress(value);saveProgress();}
export function snapshot(id:string,code:string){if(!safeKey(id))return;code=code.slice(0,30000);const list=progress.history[id]||=[];if(list.at(-1)?.code!==code)list.push({code:code.slice(0,15000),date:new Date().toISOString()});progress.history[id]=list.slice(-5);progress.drafts[id]=code;saveProgress();}
export function recordResult(id:string,passed:boolean){progress.attempts[id]=(progress.attempts[id]||0)+1;if(passed&&!progress.completed.includes(id))progress.completed.push(id);progress.review[id]=new Date(Date.now()+(passed?7:1)*86400000).toISOString();const today=new Date().toLocaleDateString('en-CA');if(!progress.activeDays.includes(today))progress.activeDays.push(today);saveProgress();}
export const escapeHtml=(s:unknown)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

import type { Progress } from './types';
const key = 'codelab.progress.v1';
const fresh = (): Progress => ({version:1,completed:[],lessons:[],projects:[],drafts:{},attempts:{},hints:{},history:{},review:{},activeDays:[],name:'Explorador'});
const safeKey=(key:unknown):key is string=>typeof key==='string'&&/^[a-z0-9][a-z0-9-]{0,79}$/i.test(key)&&!['constructor','prototype'].includes(key);
export function normalizeProgress(raw: unknown): Progress {
 const result=fresh();if(!raw||typeof raw!=='object')return result;const p=raw as Record<string,unknown>;
 for(const prop of ['completed','lessons','activeDays'] as const)if(Array.isArray(p[prop]))result[prop]=[...new Set((p[prop] as unknown[]).filter((v):v is string=>typeof v==='string'&&safeKey(v)))].slice(0,1000);
 if(typeof p.name==='string')result.name=p.name.trim().slice(0,40)||'Explorador';
 for(const prop of ['drafts','review'] as const)if(p[prop]&&typeof p[prop]==='object')for(const [k,v] of Object.entries(p[prop]).slice(0,80))if(safeKey(k)&&typeof v==='string')result[prop][k]=v.slice(0,prop==='drafts'?30000:40);
 for(const prop of ['attempts','hints'] as const)if(p[prop]&&typeof p[prop]==='object')for(const [k,v] of Object.entries(p[prop]).slice(0,200))if(safeKey(k)&&typeof v==='number'&&Number.isFinite(v)&&v>=0)result[prop][k]=Math.min(Math.floor(v),prop==='hints'?5:100000);
 if(p.history&&typeof p.history==='object')for(const [k,v] of Object.entries(p.history).slice(0,12))if(safeKey(k)&&Array.isArray(v))result.history[k]=v.filter(x=>x&&typeof x.code==='string'&&typeof x.date==='string').slice(-5).map(x=>({code:x.code.slice(0,15000),date:x.date.slice(0,40)}));
 if(Array.isArray(p.projects))result.projects=p.projects.filter(x=>x&&safeKey(x.id)&&typeof x.title==='string'&&typeof x.code==='string'&&['html','javascript','python','csharp','cpp','sql'].includes(x.language)).slice(0,12).map(x=>({id:x.id,title:x.title.slice(0,60),code:x.code.slice(0,30000),language:x.language,updatedAt:typeof x.updatedAt==='string'?x.updatedAt.slice(0,40):''}));
 return result;
}
export function readProgress(): Progress {try{return normalizeProgress(JSON.parse(localStorage.getItem(key)||'null'));}catch{return fresh();}}
export let progress=readProgress();
export function saveProgress(){try{localStorage.setItem(key,JSON.stringify(progress));window.dispatchEvent(new Event('progresschange'));}catch{window.dispatchEvent(new CustomEvent('storageerror'));}}
export function replaceProgress(value:unknown){progress=normalizeProgress(value);saveProgress();}
export function snapshot(id:string,code:string){if(!safeKey(id))return;code=code.slice(0,30000);const list=progress.history[id]||=[];if(list.at(-1)?.code!==code)list.push({code:code.slice(0,15000),date:new Date().toISOString()});progress.history[id]=list.slice(-5);progress.drafts[id]=code;saveProgress();}
export function recordResult(id:string,passed:boolean){progress.attempts[id]=(progress.attempts[id]||0)+1;if(passed&&!progress.completed.includes(id))progress.completed.push(id);progress.review[id]=new Date(Date.now()+(passed?7:1)*86400000).toISOString();const today=new Date().toLocaleDateString('en-CA');if(!progress.activeDays.includes(today))progress.activeDays.push(today);saveProgress();}
export const escapeHtml=(s:unknown)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

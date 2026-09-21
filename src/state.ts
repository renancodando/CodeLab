import type { Progress } from './types';
const key = 'codelab.progress.v1';
const fresh = (): Progress => ({version:1,completed:[],drafts:{},attempts:{},hints:{},history:{},review:{},activeDays:[],name:'Explorador'});
export function normalizeProgress(raw: unknown): Progress {
 const result = fresh();
 if (!raw || typeof raw !== 'object') return result;
 const p = raw as Record<string,unknown>;
 for (const prop of ['completed','activeDays'] as const) if (Array.isArray(p[prop])) result[prop] = (p[prop] as unknown[]).filter((v):v is string => typeof v === 'string').slice(0,1000);
 if (typeof p.name === 'string') result.name = p.name.slice(0,40);
 for (const prop of ['drafts','review'] as const) if (p[prop] && typeof p[prop] === 'object') for (const [k,v] of Object.entries(p[prop] as object)) if (typeof v === 'string' && k.length < 80) result[prop][k] = v.slice(0,40000);
 for (const prop of ['attempts','hints'] as const) if (p[prop] && typeof p[prop] === 'object') for (const [k,v] of Object.entries(p[prop] as object)) if (typeof v === 'number' && Number.isFinite(v) && v >= 0) result[prop][k] = v;
 if (p.history && typeof p.history === 'object') for (const [k,v] of Object.entries(p.history)) if (Array.isArray(v)) result.history[k] = v.filter(x => x && typeof x.code === 'string' && typeof x.date === 'string').slice(-10).map(x => ({code:x.code.slice(0,40000),date:x.date}));
 return result;
}
export function readProgress(): Progress { try { return normalizeProgress(JSON.parse(localStorage.getItem(key) || 'null')); } catch { return fresh(); } }
export let progress = readProgress();
export function saveProgress() { try { localStorage.setItem(key, JSON.stringify(progress)); window.dispatchEvent(new Event('progresschange')); } catch { window.dispatchEvent(new CustomEvent('storageerror')); } }
export function replaceProgress(value:unknown) { progress = normalizeProgress(value); saveProgress(); }
export function snapshot(id:string, code:string) { const list = progress.history[id] ||= []; if (list.at(-1)?.code !== code) list.push({code,date:new Date().toISOString()}); progress.history[id] = list.slice(-10); progress.drafts[id] = code; saveProgress(); }
export function recordResult(id:string, passed:boolean) { progress.attempts[id] = (progress.attempts[id] || 0) + 1; if (passed && !progress.completed.includes(id)) progress.completed.push(id); progress.review[id] = new Date(Date.now() + (passed ? 7 : 1) * 86400000).toISOString(); const today = new Date().toLocaleDateString('en-CA'); if (!progress.activeDays.includes(today)) progress.activeDays.push(today); saveProgress(); }
export const escapeHtml = (s:unknown) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

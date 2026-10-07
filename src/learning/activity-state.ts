export type PracticeAnswer={value:string|string[];attempts:number;hints:number;assisted:boolean;passed:boolean;revision:number;updatedAt:string};
export type PracticeAnswers=Record<string,PracticeAnswer>;
const safe=(v:unknown):v is string=>typeof v==='string'&&/^[a-z0-9][a-z0-9-]{0,79}$/i.test(v)&&!['constructor','prototype'].includes(v);
export function emptyPracticeAnswer(revision=1):PracticeAnswer{return {value:'',attempts:0,hints:0,assisted:false,passed:false,revision,updatedAt:''};}
export function normalizePracticeAnswers(raw:unknown):PracticeAnswers{
 const answers:PracticeAnswers={};if(!raw||typeof raw!=='object'||Array.isArray(raw))return answers;
 for(const [id,value] of Object.entries(raw).slice(0,250)){
  if(!safe(id)||!value||typeof value!=='object'||Array.isArray(value))continue;
  const a=value as Record<string,unknown>;const count=(v:unknown,max:number)=>typeof v==='number'&&Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):0;
  const answer=typeof a.value==='string'?a.value.slice(0,30000):Array.isArray(a.value)?a.value.filter((v):v is string=>safe(v)).slice(0,100):'';
  answers[id]={value:answer,attempts:count(a.attempts,100000),hints:count(a.hints,10),passed:a.passed===true,assisted:a.assisted===true,revision:Math.max(1,count(a.revision,1000)),updatedAt:typeof a.updatedAt==='string'&&Number.isFinite(Date.parse(a.updatedAt))?a.updatedAt:''};
 }
 return answers;
}
export function preparePracticeAnswers(raw:unknown):PracticeAnswers{
 if(raw===undefined)return {};
 const invalid=()=>{throw new Error('Há respostas práticas inválidas ou maiores que o limite. A jornada atual foi preservada.');};
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).length>250)invalid();
 for(const [id,value] of Object.entries(raw as Record<string,unknown>)){
  if(!safe(id)||!value||typeof value!=='object'||Array.isArray(value))invalid();
  const a=value as Record<string,unknown>;if(!(typeof a.value==='string'&&a.value.length<=30000)&&!(Array.isArray(a.value)&&a.value.length<=100&&a.value.every(safe)))invalid();
  if(!Number.isInteger(a.attempts)||Number(a.attempts)<0||Number(a.attempts)>100000||!Number.isInteger(a.hints)||Number(a.hints)<0||Number(a.hints)>10||!Number.isInteger(a.revision)||Number(a.revision)<1||Number(a.revision)>1000||typeof a.passed!=='boolean'||typeof a.assisted!=='boolean'||typeof a.updatedAt!=='string'||(a.updatedAt!==''&&!Number.isFinite(Date.parse(a.updatedAt))))invalid();
 }
 return normalizePracticeAnswers(raw);
}

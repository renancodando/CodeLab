import type { Capability, InteractiveLesson, LessonSession, Step, StepAnswer } from './types';
export const capabilities: Capability[] = ['reconhecimento','leitura','alteracao','producao','depuracao','aplicacao'];
export const emptyAnswer = ():StepAnswer => ({value:'',attempts:0,hints:0,passed:false,assisted:false,firstTry:false});
export function createSession(lesson:InteractiveLesson):LessonSession {return {revision:lesson.revision,currentStep:lesson.steps[0].id,answers:{}};}
export function answerFor(session:LessonSession,step:Step):StepAnswer {return session.answers[step.id]??={...emptyAnswer(),value:step.type==='code'?step.code??'':''};}
export function currentIndex(session:LessonSession,lesson:InteractiveLesson):number {return Math.max(0,lesson.steps.findIndex(step=>step.id===session.currentStep));}
export function canAdvance(session:LessonSession,step:Step):boolean {return step.type==='explanation'||Boolean(session.answers[step.id]?.passed);}
export function move(session:LessonSession,lesson:InteractiveLesson,direction:-1|1):boolean {const index=currentIndex(session,lesson);if(direction===1&&!canAdvance(session,lesson.steps[index]))return false;const next=index+direction;if(next<0||next>=lesson.steps.length)return false;session.currentStep=lesson.steps[next].id;return true;}
export function recordAnswer(answer:StepAnswer,passed:boolean):void {if(answer.attempts===0)answer.firstTry=passed&&answer.hints===0&&!answer.assisted;answer.attempts++;answer.passed=passed;}
export function checkAnswer(step:Step,value:string):{passed:boolean;feedback:string} {
 if(step.type==='choice'){const selected=/^\d+$/.test(value)?step.options?.[Number(value)]:undefined;if(!selected)return {passed:false,feedback:'Escolha uma resposta antes de conferir.'};const passed=Number(value)===step.correct;return {passed,feedback:passed?step.success:selected.feedback};}
 const passed=Boolean(step.accepted?.includes(value.trim()));return {passed,feedback:passed?step.success:step.failure??'Confira o valor pedido e tente novamente.'};
}
export function mastery(session:LessonSession,lesson:InteractiveLesson) {
 return capabilities.map(capability=>{const assessed=lesson.steps.filter(step=>step.capability===capability&&(session.answers[step.id]?.attempts??0)>0);if(!assessed.length)return {capability,score:null,practiced:0};const points=assessed.map(step=>{const a=session.answers[step.id];if(!a.passed)return 0;if(a.assisted)return 20;return a.firstTry?100:Math.max(30,80-a.hints*15);});return {capability,score:Math.round(points.reduce((sum,n)=>sum+n,0)/points.length),practiced:assessed.length};});
}
export function isComplete(session:LessonSession,lesson:InteractiveLesson):boolean {return lesson.steps.every(step=>canAdvance(session,step));}
const safeKey=(value:unknown):value is string=>typeof value==='string'&&/^[a-z0-9][a-z0-9-]{0,79}$/i.test(value)&&!['constructor','prototype'].includes(value);
export function normalizeSessions(raw:unknown):Record<string,LessonSession> {
 const sessions:Record<string,LessonSession>={};
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return sessions;
 for(const [id,value] of Object.entries(raw).slice(0,60)){
  if(!safeKey(id)||!value||typeof value!=='object')continue;
  const p=value as Record<string,unknown>;if(!safeKey(p.currentStep)||typeof p.revision!=='number'||!Number.isInteger(p.revision)||p.revision<1)continue;
  const session:LessonSession={revision:p.revision,currentStep:p.currentStep,answers:{}};
  if(typeof p.completedAt==='string'&&Number.isFinite(Date.parse(p.completedAt)))session.completedAt=p.completedAt;
  if(p.answers&&typeof p.answers==='object'&&!Array.isArray(p.answers))for(const [key,v] of Object.entries(p.answers).slice(0,100)){
   if(!safeKey(key)||!v||typeof v!=='object')continue;
   const a=v as Record<string,unknown>;const counter=(n:unknown,max:number)=>typeof n==='number'&&Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
   session.answers[key]={value:typeof a.value==='string'?a.value.slice(0,30000):'',attempts:counter(a.attempts,100000),hints:counter(a.hints,10),passed:a.passed===true,assisted:a.assisted===true,firstTry:a.firstTry===true};
  }
  sessions[id]=session;
 }
 return sessions;
}

import {practiceActivities} from '../content/practice';
import {evaluatePractice,getPracticeSolution} from './practice';
import {recordEvidence,learningDay} from './adaptive';
import {emptyPracticeAnswer} from './activity-state';
import {progress,saveProgress,escapeHtml as esc} from '../state';
export const learningClock=()=>({now:Date.now(),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'});
type Options={mode?:'practice'|'review'|'challenge';onEvaluated?:(passed:boolean)=>void};
const labels:Record<string,string>={debug:'Encontrar e corrigir o bug',predict:'Prever a saída',order:'Reconstruir a sequência',fill:'Completar o código',choice:'Escolher e explicar'};
export function mountPractice(container:HTMLElement,id:string,options:Options={}):()=>void{
 const activity=practiceActivities.find(a=>a.id===id);if(!activity){container.textContent='Atividade não encontrada.';return()=>{};}
 const a=progress.practiceAnswers[id]??=emptyPracticeAnswer();let disposed=false,controller:AbortController|undefined;
 const clock=learningClock();
 if(a.updatedAt&&learningDay({...clock,now:Date.parse(a.updatedAt)})!==learningDay(clock)){
  a.attempts=0;a.hints=0;a.assisted=false;a.passed=false;
  if(options.mode==='review')a.value=activity.kind==='debug'?activity.code??'':activity.kind==='order'?(activity.lines??[]).map(l=>l.id):'';
 }
 if(activity.kind==='debug'&&!a.value)a.value=activity.code??'';
 if(activity.kind==='order'&&!Array.isArray(a.value))a.value=(activity.lines??[]).map(l=>l.id);
 const text=()=>Array.isArray(a.value)?a.value.join('\n'):a.value;
 const input=activity.kind==='choice'?'<fieldset><legend>Escolha um trecho</legend>'+activity.options!.map(o=>'<label><input type="radio" name="answer" value="'+esc(o.id)+'" '+(a.value===o.id?'checked':'')+'><span>'+esc(o.text)+'</span></label>').join('')+'</fieldset>':activity.kind==='order'?'<ol class="practice-order" aria-label="Linhas do programa"></ol>':activity.kind==='debug'?'<label class="practice-input">Seu código corrigido<textarea name="answer" spellcheck="false" maxlength="30000">'+esc(text())+'</textarea></label>':activity.kind==='predict'?'<label class="practice-input">Saída prevista, uma linha por saída<textarea name="answer" rows="3" maxlength="30000">'+esc(text())+'</textarea></label>':'<label class="practice-input">Trecho que falta<input name="answer" autocomplete="off" maxlength="30000" value="'+esc(text())+'"></label>';
 container.innerHTML='<section class="lesson-check practice-card" data-practice="'+esc(id)+'"><p class="eyebrow">'+esc(labels[activity.kind])+' · '+activity.minutes+' MIN</p><h3>'+esc(activity.title)+'</h3><p>'+esc(activity.prompt)+'</p>'+(activity.code&&activity.kind!=='debug'?'<pre class="example-code"><code>'+esc(activity.code)+'</code></pre>':'')+'<form>'+input+'<div class="practice-actions"><button class="button primary" type="submit">Conferir comportamento</button><button class="button subtle" type="button" data-hint>Uma pista</button><button class="button subtle" type="button" data-solution>Consultar solução</button></div></form><p class="practice-feedback" role="status" aria-live="polite"></p><div data-help></div><p class="small">'+(activity.kind==='debug'?'O comportamento será conferido com entradas variadas, incluindo casos de borda.':'Atividade conceitual local. Uma resposta correta não indica que o programa foi compilado ou executado.')+'</p></section>';
 const feedback=container.querySelector<HTMLElement>('[role=status]')!,help=container.querySelector<HTMLElement>('[data-help]')!,form=container.querySelector<HTMLFormElement>('form')!,button=form.querySelector<HTMLButtonElement>('[type=submit]')!;
 if(a.passed)feedback.textContent='Resposta conferida anteriormente. Explique a decisão sem consultar.';
 const persist=()=>{a.updatedAt=new Date().toISOString();saveProgress();};
 const changed=(value:string|string[])=>{controller?.abort();a.value=value;a.passed=false;feedback.textContent='';persist();renderVisual();};
 const showHelp=()=>{help.replaceChildren();if(a.hints){const p=document.createElement('p');p.textContent=activity.hint;help.append(p);}if(a.assisted){const pre=document.createElement('pre');pre.className='example-code';pre.textContent=getPracticeSolution(id)??'';help.append(pre);}};showHelp();
 function renderVisual(){
  if(!['css-grid-minimo','css-grade-estreita','html-label-vinculo'].includes(id))return;
  let target=container.querySelector<HTMLElement>('.practice-visual');if(!target){target=document.createElement('div');target.className='practice-visual';container.querySelector('form')!.before(target);}
  const value=typeof a.value==='string'?a.value:'',frame=document.createElement('iframe');frame.title='Experimento visual desta atividade';frame.setAttribute('sandbox','');frame.referrerPolicy='no-referrer';
  if(id==='html-label-vinculo')frame.srcdoc='<style>body{font:16px system-ui;padding:12px}input{max-width:100%;box-sizing:border-box}label{display:block;margin-bottom:12px}</style><label for="'+esc(value)+'">E-mail: clique no rótulo</label><input id="email-contato" type="email">';
  else{const columns=id==='css-grid-minimo'?'repeat(2,'+(value||'1fr')+')':activity!.options!.find(o=>o.id===value)?.text??'repeat(auto-fit, minmax(14rem, 1fr))';frame.srcdoc='<style>*{box-sizing:border-box}body{font:14px system-ui;padding:12px;margin:0}main{display:grid;gap:12px;grid-template-columns:'+esc(columns)+'}.item{min-width:0;overflow-wrap:anywhere;background:#dfeee2;padding:16px}</style><main><div class="item">Uma palavra muito comprida: aprendizadoResponsivo</div><div class="item">Segunda trilha</div><div class="item">Terceira trilha</div></main>';}
  target.replaceChildren(frame);const note=document.createElement('p');note.textContent='Observe a prévia enquanto altera a resposta. A conferência registra a decisão conceitual solicitada.';target.append(note);
 }
 renderVisual();
 function renderOrder(){
  const list=container.querySelector<HTMLElement>('.practice-order');if(!list||!Array.isArray(a.value))return;const ordered=a.value;
  list.innerHTML=ordered.map((lineId,i)=>{const line=activity!.lines!.find(l=>l.id===lineId);return'<li><span>'+(i+1)+'</span><code>'+esc(line?.code??'')+'</code><button type="button" class="button subtle" data-up="'+i+'" aria-label="Mover linha '+(i+1)+' para cima" '+(i===0?'disabled':'')+'>↑</button><button type="button" class="button subtle" data-down="'+i+'" aria-label="Mover linha '+(i+1)+' para baixo" '+(i===ordered.length-1?'disabled':'')+'>↓</button></li>';}).join('');
  list.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.up??b.dataset.down),j=i+(b.dataset.up!==undefined?-1:1),value=[...(a.value as string[])];[value[i],value[j]]=[value[j],value[i]];changed(value);renderOrder();container.querySelector<HTMLButtonElement>('[data-'+(b.dataset.up!==undefined?'up':'down')+'="'+j+'"]')?.focus();}));
 }
 renderOrder();
 form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('[name=answer]').forEach(input=>input.addEventListener(input instanceof HTMLInputElement&&input.type==='radio'?'change':'input',()=>changed(input.value)));
 container.querySelector('[data-hint]')!.addEventListener('click',()=>{a.hints=Math.max(a.hints,1);persist();showHelp();});
 container.querySelector('[data-solution]')!.addEventListener('click',()=>{a.assisted=true;persist();showHelp();feedback.textContent='Esta tentativa será assistida. Reconstrua sem consultar em uma revisão futura.';});
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(controller||disposed)return;const submitted=Array.isArray(a.value)?[...a.value]:a.value;controller=new AbortController();button.disabled=true;feedback.textContent='Conferindo…';
  try{
   const result=await evaluatePractice(id,submitted,controller.signal);if(disposed)return;
   if(result.status!=='evaluated'){feedback.textContent=result.feedback;return;}
   if(JSON.stringify(a.value)!==JSON.stringify(submitted)){feedback.textContent='Sua resposta mudou. Confira a versão atual.';return;}
   a.attempts++;a.passed=result.passed;persist();const current=learningClock(),mode=options.mode??(activity.afterBlock===5?'challenge':'practice');
   recordEvidence(progress.adaptive,{id:id+'-'+current.now+'-'+a.attempts,assessmentId:id,activityId:id,skillIds:activity.skillIds,revision:1,passed:result.passed,assisted:a.assisted,attempts:a.attempts,hints:a.hints,kind:mode},current);saveProgress();
   feedback.textContent=result.feedback+'\n'+result.tests.map(t=>(t.passed?'✓ ':'↻ ')+t.label).join('\n')+'\n'+(result.evidence==='executed'?'Comportamento avaliado no executor JavaScript isolado.':'Evidência conceitual; sem execução de compilador.');options.onEvaluated?.(result.passed);
  }catch{if(!disposed)feedback.textContent='Não foi possível conferir. Sua resposta está salva; tente novamente.';}
  finally{controller=undefined;if(!disposed)button.disabled=false;}
 });
 return()=>{disposed=true;controller?.abort();};
}

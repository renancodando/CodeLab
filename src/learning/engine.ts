import {progress,saveProgress,escapeHtml as esc} from '../state';
import {execute} from '../execution/runner';
import {answerFor,canAdvance,createSession,currentIndex,checkAnswer,isComplete,mastery,move,recordAnswer} from './session';
import type {InteractiveLesson,StepAnswer} from './types';

const labels:Record<string,string>={reconhecimento:'Reconhecer',leitura:'Ler e prever',alteracao:'Alterar',producao:'Produzir',depuracao:'Depurar',aplicacao:'Aplicar'};
export function mountLesson(container:HTMLElement,lesson:InteractiveLesson,title:string,back:string){
 let disposed=false,generation=0,editor:ReturnType<typeof import('../editor').createEditor>|undefined;
 let pending:ReturnType<typeof execute>|undefined;
 let session=progress.lessonSessions[lesson.id];
 if(!session||session.revision!==lesson.revision){session=createSession(lesson);progress.lessonSessions[lesson.id]=session;}
 if(!lesson.steps.some(s=>s.id===session.currentStep))session.currentStep=lesson.steps[0].id;
 const persist=()=>saveProgress();
 const release=()=>{generation++;pending?.cancel();pending=undefined;editor?.dispose();editor=undefined;};
 const invalidate=(answer:StepAnswer,value:string)=>{
  if(answer.value===value)return;answer.value=value;answer.passed=false;answer.firstTry=false;
  if(session.completedAt){delete session.completedAt;progress.lessons=progress.lessons.filter(id=>id!==lesson.id);}
  persist();
 };
 async function render(){
  release();const token=generation,index=currentIndex(session,lesson),step=lesson.steps[index],answer=answerFor(session,step);
  const input=step.type==='choice'?'<fieldset><legend>Escolha uma resposta</legend>'+step.options!.map((o,i)=>'<label><input type="radio" name="answer" value="'+i+'" '+(answer.value===String(i)?'checked':'')+'> <span>'+esc(o.text)+'</span></label>').join('')+'</fieldset>':step.type==='fill'?'<label class="field">Sua resposta<input id="step-answer" value="'+esc(answer.value)+'" autocomplete="off" maxlength="30000"></label>':step.type==='code'?'<div class="editor" id="step-editor"></div>':'';
  container.innerHTML='<article class="page reading"><a class="back" href="'+back+'">Voltar à trilha</a><p class="eyebrow">AULA PRÁTICA · PASSO '+(index+1)+' DE '+lesson.steps.length+'</p><h1>'+esc(title)+'</h1><div class="lesson-meta"><span>Um passo de cada vez</span><span>Salvo neste navegador</span></div><section class="lesson-chapter"><h2 tabindex="-1" id="step-title">'+esc(step.title)+'</h2><p>'+esc(step.prompt)+'</p>'+(step.type==='explanation'&&step.code?'<pre class="example-code"><code>'+esc(step.code)+'</code></pre>':'')+'<form class="lesson-check" id="step-form">'+input+(step.type!=='explanation'?'<button class="button primary" id="check-step">Conferir resposta</button>':'')+'<p role="status" aria-live="polite" id="step-feedback">'+(answer.passed?esc(step.success):'')+'</p></form><div id="step-help"></div>'+(step.type!=='explanation'?'<button class="button subtle" id="step-hint">Uma pista</button> <button class="button subtle" id="step-solution">Consultar solução</button>':'')+'</section><div class="reading-nav"><button class="button subtle" id="step-prev" '+(index===0?'disabled':'')+'>Passo anterior</button><button class="button primary" id="step-next" '+(!canAdvance(session,step)?'disabled':'')+'>'+(index===lesson.steps.length-1?'Concluir aula':'Próximo passo')+'</button></div><p><a href="#/leitura/'+lesson.id+'">Entender melhor: ler a aula completa</a></p><section id="lesson-summary"></section><button class="button subtle" id="restart-lesson">Recomeçar prática</button></article>';
  const feedback=container.querySelector<HTMLElement>('#step-feedback')!;
  const next=container.querySelector<HTMLButtonElement>('#step-next')!;
  const help=container.querySelector<HTMLElement>('#step-help')!;
  const showHelp=()=>{help.replaceChildren();for(const hint of (step.hints??[]).slice(0,answer.hints)){const p=document.createElement('p');p.textContent=hint;help.append(p);}if(answer.assisted){const pre=document.createElement('pre');pre.className='example-code';pre.textContent=step.solution??step.options?.[step.correct??0]?.text??step.accepted?.[0]??'';help.append(pre);}};
  showHelp();
  container.querySelector('#restart-lesson')!.addEventListener('click',()=>{session=createSession(lesson);progress.lessonSessions[lesson.id]=session;progress.lessons=progress.lessons.filter(id=>id!==lesson.id);delete progress.review['aula-'+lesson.id];persist();void render();});
  container.querySelector('#step-prev')!.addEventListener('click',()=>{if(move(session,lesson,-1)){persist();void render();}});
  next.addEventListener('click',()=>{if(index<lesson.steps.length-1){if(move(session,lesson,1)){persist();void render();}}else if(isComplete(session,lesson)){
   session.completedAt??=new Date().toISOString();if(!progress.lessons.includes(lesson.id))progress.lessons.push(lesson.id);
   const scores=mastery(session,lesson);const independent=scores.every(s=>s.score!==null&&s.score>=80);
   progress.review['aula-'+lesson.id]??=new Date(Date.now()+(independent?7:1)*86400000).toISOString();
   const today=new Date().toLocaleDateString('en-CA');if(!progress.activeDays.includes(today))progress.activeDays.push(today);persist();
   container.querySelector('#lesson-summary')!.innerHTML='<h2>Aula concluída</h2><p>Você praticou todas as etapas. As evidências abaixo consideram acertos, tentativas, pistas e consulta à solução. São indicadores para orientar a revisão.</p><div class="mastery">'+scores.map(s=>'<div><span>'+labels[s.capability]+'</span><b>'+(s.score===null?'Ainda não praticado':s.score+' / 100')+'</b></div>').join('')+'</div><p>Próxima revisão: '+esc(new Date(progress.review['aula-'+lesson.id]).toLocaleDateString('pt-BR'))+'.</p>';
  }});
  container.querySelector('#step-hint')?.addEventListener('click',()=>{if(answer.hints<(step.hints?.length??0)){answer.hints++;answer.firstTry=false;persist();showHelp();}});
  container.querySelector('#step-solution')?.addEventListener('click',()=>{answer.assisted=true;answer.firstTry=false;persist();showHelp();feedback.textContent='A solução é uma referência. Reconstrua o código e confira; consultar não conclui o passo.';});
  const changed=(value:string)=>{invalidate(answer,value);next.disabled=!canAdvance(session,step);feedback.textContent='';};
  container.querySelectorAll<HTMLInputElement>('input[name="answer"]').forEach(input=>input.addEventListener('change',()=>changed(input.value)));
  container.querySelector<HTMLInputElement>('#step-answer')?.addEventListener('input',e=>changed((e.target as HTMLInputElement).value));
  container.querySelector('#step-form')!.addEventListener('submit',async event=>{
   event.preventDefault();if(pending)return;
   const check=container.querySelector<HTMLButtonElement>('#check-step');if(!check)return;
   check.disabled=true;feedback.textContent='Conferindo…';
   try{
    if(step.type==='code'){const submitted=answer.value;pending=execute(submitted,'aula',step.checks);const result=await pending.result;if(disposed||token!==generation)return;pending=undefined;if(answer.value!==submitted){feedback.textContent='Seu código mudou durante a execução. Confira a versão atual.';return;}recordAnswer(answer,result.passed);feedback.textContent=[result.error??(result.passed?step.success:step.failure),...result.tests.map(t=>(t.passed?'✓ ':'↻ ')+t.label),...result.logs].filter(Boolean).join('\n');}
    else {const result=checkAnswer(step,answer.value);recordAnswer(answer,result.passed);feedback.textContent=result.feedback;}
    next.disabled=!canAdvance(session,step);persist();
   }catch{if(!disposed&&token===generation)feedback.textContent='Não foi possível conferir. Seu trabalho está preservado; tente novamente.';}
   finally{if(!disposed&&token===generation)check.disabled=false;}
  });
  persist();
  if(step.type==='code'){
   try{const {createEditor}=await import('../editor');if(disposed||token!==generation)return;editor=createEditor(container.querySelector<HTMLElement>('#step-editor')!,answer.value);editor.onDidChangeModelContent(()=>changed(editor!.getValue()));}
   catch{if(!disposed&&token===generation){const textarea=document.createElement('textarea');textarea.className='field';textarea.setAttribute('aria-label','Seu código');textarea.value=answer.value;textarea.addEventListener('input',()=>changed(textarea.value));container.querySelector('#step-editor')!.replaceWith(textarea);feedback.textContent='Editor simples disponível. Seu código continua salvo e pode ser executado.';}}
  }
 }
 void render();
 return ()=>{disposed=true;release();};
}

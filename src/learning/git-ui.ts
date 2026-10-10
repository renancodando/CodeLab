import {novoRepositorioGit,restaurarRepositorioGit,iniciarRepositorioGit,editarArquivoGit,prepararArquivoGit,registrarCommitGit,conferirPreparacaoGit} from './git';
import {progress,saveProgress,escapeHtml as esc} from '../state';
import {emptyPracticeAnswer} from './activity-state';

const chave='git-bancada-preparacao-v1';
export function montarBancadaGit(alvo:HTMLElement):()=>void{
 const resposta=progress.practiceAnswers[chave]??emptyPracticeAnswer(),controle=new AbortController(),opcoes={signal:controle.signal};
 const restaurado=resposta.value===''?novoRepositorioGit():resposta.revision===1?restaurarRepositorioGit(resposta.value):undefined;
 let estado=restaurado??novoRepositorioGit(),incompativel=!restaurado;
 alvo.innerHTML='<section class="practice-card lesson-check" aria-label="Bancada Git: três versões"><h3>Experimente as três versões</h3><p>Modelo didático local de um arquivo de texto, sem filtros, hooks, branches ou terminal Git. Não altera arquivos do computador nem executa comandos. Os rótulos A/B representam commits, não hashes reais.</p><p>Registre total=0, prepare total=10 e depois edite para total=20. O segundo commit deve conter 10, enquanto o trabalho conserva 20. Use uma linha terminada por quebra de linha. Limites desta bancada: 600 caracteres e 16 commits.</p><label class="field">Arquivo de trabalho: calculo.txt<textarea data-arquivo maxlength="600" spellcheck="false">'+esc(estado.trabalho)+'</textarea></label><label class="field">Mensagem do commit<input data-mensagem maxlength="80" value="Registrar minha mudança"></label><div class="practice-actions"><button class="button subtle" data-acao="iniciar">git init</button><button class="button subtle" data-acao="preparar">git add calculo.txt</button><button class="button primary" data-acao="registrar">git commit</button></div><dl><dt>Área de preparação</dt><dd><pre data-preparacao></pre></dd><dt>HEAD: conteúdo do último commit</dt><dd><pre data-head></pre></dd><dt>Histórico linear</dt><dd><pre data-historico></pre></dd></dl><p role="status" data-estado></p><div class="practice-actions"><button class="button primary" data-conferir>Conferir objetivo</button><button class="button subtle" data-pista>Uma pista</button><button class="button subtle" data-reiniciar>Reiniciar só esta bancada</button></div><p role="status" data-resultado></p><p class="small">O rascunho entra no backup da jornada. Conferir este modelo não comprova execução de Git nem produz nota de domínio. Execute o experimento real indicado na aula para comparar.</p></section>';
 const arquivo=alvo.querySelector<HTMLTextAreaElement>('[data-arquivo]')!,mensagem=alvo.querySelector<HTMLInputElement>('[data-mensagem]')!,aviso=alvo.querySelector<HTMLElement>('[data-estado]')!,resultado=alvo.querySelector<HTMLElement>('[data-resultado]')!;
 function exibir(){
  alvo.querySelector('[data-preparacao]')!.textContent=estado.preparacao??'Arquivo ainda não preparado.';
  alvo.querySelector('[data-head]')!.textContent=estado.historico.at(-1)?.conteudo??'Ainda não existe commit.';
  alvo.querySelector('[data-historico]')!.textContent=estado.historico.length?estado.historico.map(registro=>String.fromCharCode(64+registro.id)+' · '+registro.mensagem).join('\n')+'\n'+estado.historico.map(registro=>String.fromCharCode(64+registro.id)).join('──')+' ← HEAD / main (didático)':estado.iniciado?'main sem commits.':'Repositório ainda não iniciado.';
  for(const campo of alvo.querySelectorAll<HTMLInputElement|HTMLTextAreaElement|HTMLButtonElement>('[data-arquivo],[data-mensagem],[data-acao],[data-conferir],[data-pista]'))campo.disabled=incompativel;
 }
 function salvar(){
  resposta.assisted||=Boolean(progress.practiceAnswers['percurso-git-preparacao']?.assisted);
  resposta.value=JSON.stringify(estado);resposta.revision=1;resposta.updatedAt=new Date().toISOString();progress.practiceAnswers[chave]=resposta;
  const salvo=saveProgress();aviso.textContent=salvo?'Rascunho salvo somente neste navegador.':'O navegador não conseguiu salvar. Estado em memória: exporte a jornada no perfil antes de sair.';exibir();
 }
 const solucao=alvo.closest('[data-stage]')?.querySelector('details');
 solucao?.addEventListener('toggle',()=>{if(solucao.open&&!incompativel){resposta.assisted=true;salvar();resultado.textContent='Solução consultada. A assistência foi registrada; reconstrua o experimento por conta própria.';}},opcoes);
 function alterar(operacao:()=>typeof estado){
  try{estado=operacao();resposta.passed=false;resultado.textContent='';salvar();}
  catch(erro){aviso.textContent=erro instanceof Error?erro.message:'Não foi possível realizar esta operação.';}
 }
 arquivo.addEventListener('input',()=>alterar(()=>editarArquivoGit(estado,arquivo.value)),opcoes);
 for(const botao of alvo.querySelectorAll<HTMLButtonElement>('[data-acao]'))botao.addEventListener('click',()=>alterar(()=>botao.dataset.acao==='iniciar'?iniciarRepositorioGit(estado):botao.dataset.acao==='preparar'?prepararArquivoGit(estado):registrarCommitGit(estado,mensagem.value)),opcoes);
 alvo.querySelector('[data-conferir]')!.addEventListener('click',()=>{
  const testes=conferirPreparacaoGit(estado);resposta.attempts=Math.min(100000,resposta.attempts+1);resposta.passed=testes.every(teste=>teste.passed);salvar();
  resultado.textContent=resposta.passed?'Objetivo conferido neste modelo. O commit guardou a preparação e preservou a edição posterior.':testes.find(teste=>!teste.passed)!.label+' Investigue essa diferença antes de tentar novamente.';
 },opcoes);
 alvo.querySelector('[data-pista]')!.addEventListener('click',()=>{resposta.hints=Math.min(10,resposta.hints+1);salvar();resultado.textContent=resposta.hints===1?'Editar modifica o trabalho. Preparar captura seu conteúdo naquele momento.':'Depois de preparar, compare o editor com a preparação antes de registrar o próximo commit.';},opcoes);
 alvo.querySelector('[data-reiniciar]')!.addEventListener('click',()=>{estado=novoRepositorioGit();incompativel=false;arquivo.value=estado.trabalho;resposta.passed=false;resultado.textContent='Bancada reiniciada. Outros rascunhos e a jornada foram preservados.';salvar();},opcoes);
 exibir();
 aviso.textContent=incompativel?'Este rascunho está incompatível. Seu conteúdo original continua no backup; exporte a jornada antes de reiniciar só esta bancada.':'Bancada local. Suas alterações serão salvas neste navegador.';
 if(resposta.passed&&!incompativel)resultado.textContent='Há uma conferência anterior salva. Compare as três versões e reconfira após alterar.';
 return ()=>controle.abort();
}

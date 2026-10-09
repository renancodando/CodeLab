import type {EnvironmentState} from '../../types';
import type {AmbientFrame} from '../simulation';
import {combinarMeteorologia,qualidadeAtual} from './confianca';
import {cenariosAtmosfericos,criarCenario} from './cenarios';
export function montarDiagnostico(obter:()=>EnvironmentState,aplicar:(estado:EnvironmentState)=>void){
 const painel=document.createElement('details');painel.className='diagnostico-clima';painel.style.cssText='position:fixed;bottom:1rem;right:1rem;z-index:90;width:min(32rem,calc(100vw - 2rem));max-height:60vh;overflow:auto;padding:1rem;background:#15251ef2;border:1px solid #9aa779;color:#f1efdf;font-size:12px';
 const titulo=document.createElement('summary');titulo.textContent='Clima · diagnóstico de desenvolvimento';
 const seletor=document.createElement('select');seletor.setAttribute('aria-label','Cenário atmosférico ilustrativo');
 for(const nome of ['dados atuais',...cenariosAtmosfericos.filter(nome=>!nome.startsWith('noite')&&nome!=='pos-chuva')]){const opcao=document.createElement('option');opcao.textContent=nome;opcao.value=nome;seletor.append(opcao);}
 const aviso=document.createElement('p');aviso.textContent='Transições em tempo real. Sol e Lua seguem o relógio local; para pós-chuva, aplique chuva e depois céu limpo.';
 const saida=document.createElement('pre');painel.append(titulo,aviso,seletor,saida);document.body.append(painel);const original=obter();
 seletor.addEventListener('change',()=>aplicar(seletor.value==='dados atuais'?original:criarCenario(seletor.value as typeof cenariosAtmosfericos[number],original,Date.now())));
 let ultima=0;
 return {atualizar(frame:AmbientFrame){
  if(frame.tempo-ultima<1)return;ultima=frame.tempo;const agora=Date.now(),resultado=combinarMeteorologia(obter().fontes??[],agora);
  saida.textContent=JSON.stringify({representacao:'procedural; cenários são sintéticos',fontes:resultado.fontes.map(f=>({tipo:f.tipo,fonte:f.fonte,idade:f.capturadoEm===null?null:agora-f.capturadoEm,validade:f.validade,qualidade:qualidadeAtual(f,agora),controleQualidade:f.controleQualidade,precipitacao:f.variaveis.precipitacao})),resultado:{situacao:resultado.situacao,divergencia:resultado.divergencia,precipitacaoLocal:resultado.intensidadeLocal,chuvaLiquida:resultado.intensidadeLiquida,tipoPrecipitacao:resultado.tipoPrecipitacao,chuvaDistante:resultado.intensidadeDistante},visual:frame},null,2);
 },descartar(){painel.remove();}};
}

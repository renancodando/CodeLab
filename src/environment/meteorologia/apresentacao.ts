import type {EnvironmentState} from '../../types';
import {combinarMeteorologia,qualidadeAtual} from './confianca';
import {rotulosChuva} from './modelo';
import {escapeHtml} from '../../state';
export function resumoMeteorologico(estado:EnvironmentState,agora=Date.now()){
 const resultado=combinarMeteorologia(estado.fontes??[],agora);
 const rotulo=rotulosChuva[resultado.situacao],tipo=resultado.tipoPrecipitacao;
 const descricao=tipo==='chuva'||!['observada','provavel','proximidades'].includes(resultado.situacao)?rotulo:rotulo.replace('Chuva',tipo==='neve'?'Neve':tipo==='granizo'?'Precipitação de granizo':tipo==='mista'?'Precipitação mista':'Precipitação');
 return descricao+(resultado.divergencia?' · Condições locais podem variar':'');
}
export function detalhesMeteorologicos(estado:EnvironmentState,agora=Date.now()){
 const resultado=combinarMeteorologia(estado.fontes??[],agora),linhas=resultado.fontes.map(f=>{
  const idade=f.capturadoEm===null||!Number.isFinite(f.capturadoEm)?'horário indisponível':Math.max(0,Math.floor((agora-f.capturadoEm)/60000))+' min';
  const qualidade=qualidadeAtual(f,agora),antiga=f.capturadoEm===null||!Number.isFinite(f.capturadoEm)||agora-f.capturadoEm>f.validade;
  const situacao=qualidade===0?'sem validade atual':antiga?'dado antigo':f.tipo==='modelo'?'estimativa de modelo':'observação regional';
  return '<li>'+escapeHtml(f.fonte)+' · '+situacao+' · idade '+idade+(f.distanciaKm===null?'':' · estação a ≈ '+Math.round(f.distanciaKm)+' km')+'</li>';
 }).join('');
 const ausentes=['radar','pluviometro'].filter(tipo=>!resultado.fontes.some(f=>f.tipo===tipo));
 const disponibilidade=ausentes.length?'Sem leitura disponível: '+ausentes.map(tipo=>tipo==='radar'?'radar':'pluviômetro').join(' e ')+'. ':'';
 return '<p>'+escapeHtml(resumoMeteorologico(estado,agora))+'</p><ul>'+linhas+'</ul><p>'+disponibilidade+'Uma previsão não confirma chuva no seu ponto. Massas e células são representação procedural; intensidade qualitativa de METAR é uma escala visual indicativa.</p><p>Previsão: até 30 min entre consultas. Observação: até 10 min; boletins podem ser horários. Dados envelhecem mesmo sem conexão.</p>';
}

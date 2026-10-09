import {normalizarEvidencia,limitarDado} from './normalizacao';
import type {FonteComplementar} from '../weather';
const estacoes=[
 {codigo:'SBSP',latitude:-23.627,longitude:-46.655},{codigo:'SBRJ',latitude:-22.91,longitude:-43.163},
 {codigo:'SBCT',latitude:-25.529,longitude:-49.176},{codigo:'SBPA',latitude:-29.994,longitude:-51.171},
 {codigo:'SBRF',latitude:-8.126,longitude:-34.923},{codigo:'SBEG',latitude:-3.039,longitude:-60.05},{codigo:'LPPT',latitude:38.781,longitude:-9.136}
];
export function distanciaEstacao(a:{latitude:number;longitude:number},b:{latitude:number;longitude:number}){
 const rad=Math.PI/180,dlat=(b.latitude-a.latitude)*rad,dlon=(b.longitude-a.longitude)*rad;
 const h=Math.sin(dlat/2)**2+Math.cos(a.latitude*rad)*Math.cos(b.latitude*rad)*Math.sin(dlon/2)**2;
 return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
}
export function normalizarMetar(raw:unknown,codigo:string,distancia:number,recebidoEm:number){
 if(!Array.isArray(raw))return [];
 return raw.filter(r=>r&&typeof r==='object'&&r.icaoId===codigo).slice(0,1).map(r=>{
  const tempo=typeof r.wxString==='string'?r.wxString:'',termos:string[]=tempo.split(/\s+/);
  const sensorIndisponivel=typeof r.rawOb==='string'&&/\bPWINO\b/.test(r.rawOb);
  const locais=termos.filter(t=>!t.startsWith('VC')&&!/^[+-]?(BL|DR)/.test(t)&&/^[+-]?(SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP)+$/.test(t));
  const proximos=termos.filter(t=>/^VC(SH|TS|(SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP)+)$/.test(t)),proxima=locais.length===0&&proximos.length>0;
  const fenomenos=sensorIndisponivel?[]:locais.length?locais:proximos,liquida=fenomenos.some(t=>/(RA|DZ)/.test(t));
  const neve=fenomenos.some(t=>/(SN|SG|IC|PL)/.test(t)),granizo=fenomenos.some(t=>/(GR|GS)/.test(t)),solida=neve||granizo,precipita=fenomenos.length>0;
  const indicativa=fenomenos.some(t=>t.startsWith('+'))?6:fenomenos.some(t=>t.startsWith('-'))?.3:1.5;
  const seco=!sensorIndisponivel&&(r.cover==='CAVOK'||tempo==='NSW'||/^(BR|FG|HZ)$/.test(tempo));
  const n=(chave:string,min:number,max:number)=>limitarDado(r[chave],min,max),vento=n('wspd',0,160),rajada=n('wgst',0,220);
  const visibilidade=typeof r.visib==='number'?r.visib:typeof r.visib==='string'?Number(r.visib.replace('+','')):NaN;
  const cobertura=r.cover==='OVC'?100:r.cover==='BKN'?75:r.cover==='SCT'?40:r.cover==='FEW'?20:r.cover==='CAVOK'?10:null;
  const instante=n('obsTime',0,1e12);
  return normalizarEvidencia('observacao',{fonte:'NOAA/AWC METAR '+codigo,capturadoEm:instante===null?NaN:instante*1000,recebidoEm,distanciaKm:distancia,qualidade:.95,controleQualidade:n('qcField',0,Number.MAX_SAFE_INTEGER)??undefined,cobertura:distancia<=5&&!proxima?'ponto':'proximidades',
   detectouChuva:liquida?true:seco?false:undefined,detectouPrecipitacao:precipita?true:seco?false:undefined,fasePrecipitacao:liquida&&solida?'mista':solida?'solida':liquida?'liquida':'desconhecida',intensidadeIndicativa:precipita?indicativa:undefined,
   tempestade:!sensorIndisponivel&&termos.some(t=>!t.startsWith('VC')&&t.includes('TS')),granizo,neve:neve?Math.log1p(indicativa)/Math.log(7):0,
   variaveis:{temperatura:n('temp',-90,65),pontoDeOrvalho:n('dewp',-100,65),vento:vento===null?null:vento*1.852,rajada:rajada===null?null:rajada*1.852,direcao:n('wdir',0,360),nebulosidade:cobertura,visibilidade:limitarDado(visibilidade*1609.344,0,100000)}});
 });
}
export function criarObservacao(request:typeof fetch=fetch):FonteComplementar {
 return {nome:'METAR',intervalo:600000,async consultar(local,sinal){
  const proximas=estacoes.map(estacao=>({...estacao,distancia:distanciaEstacao(local,estacao)})).sort((a,b)=>a.distancia-b.distancia),estacao=proximas[0];
  if(estacao.distancia>50)return [];
  const resposta=await request('/api/meteorologia/observacao?estacao='+estacao.codigo,{signal:sinal});
  if(!resposta.ok)throw new Error('Observação temporariamente indisponível.');
  const dados=await resposta.json();
  return normalizarMetar(dados.dados,estacao.codigo,estacao.distancia,typeof dados.recebidoEm==='number'?dados.recebidoEm:Date.now());
 }};
}

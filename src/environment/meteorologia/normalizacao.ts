import type {LeituraMeteorologica,TipoFonte,VariaveisAtmosfericas} from './modelo';
export const limitarDado=(valor:unknown,min:number,max:number):number|null=>typeof valor==='number'&&Number.isFinite(valor)?Math.min(max,Math.max(min,valor)):null;
const objeto=(valor:unknown):Record<string,unknown>=>valor&&typeof valor==='object'&&!Array.isArray(valor)?valor as Record<string,unknown>:{};
export function normalizarModelo(raw:unknown,recebidoEm:number):LeituraMeteorologica {
 const atual=objeto(objeto(raw).current),n=(nome:string,min:number,max:number)=>limitarDado(atual[nome],min,max);
 const intervalo=n('interval',60,10800),chuva=n('rain',0,250),pancadas=n('showers',0,250);
 const acumulado=chuva===null?(n('snowfall',0,100)??0)>0?0:n('precipitation',0,250):chuva+(pancadas??0);
 return {fonte:'Open-Meteo',tipo:'modelo',capturadoEm:typeof atual.time==='number'&&Number.isFinite(atual.time)?atual.time*1000:null,recebidoEm,validade:7200000,distanciaKm:null,qualidade:.8,cobertura:'regional',
  variaveis:{temperatura:n('temperature_2m',-90,65),umidade:n('relative_humidity_2m',0,100),pontoDeOrvalho:n('dew_point_2m',-100,65),
   nebulosidade:n('cloud_cover',0,100),nuvensBaixas:n('cloud_cover_low',0,100),nuvensMedias:n('cloud_cover_mid',0,100),nuvensAltas:n('cloud_cover_high',0,100),
   precipitacao:acumulado!==null&&intervalo!==null?acumulado*3600/intervalo:null,probabilidade:n('precipitation_probability',0,100),
   vento:n('wind_speed_10m',0,300),direcao:n('wind_direction_10m',0,360),rajada:n('wind_gusts_10m',0,400),
   visibilidade:n('visibility',0,100000),radiacaoDireta:n('direct_radiation_instant',0,1500),radiacaoDifusa:n('diffuse_radiation_instant',0,1500)}};
}
export type EntradaObservacional = {
 fonte:string; capturadoEm:number; recebidoEm:number; distanciaKm:number|null; cobertura:'ponto'|'proximidades'|'regional';
 qualidade:number; variaveis:Partial<VariaveisAtmosfericas>; detectouChuva?:boolean; detectouPrecipitacao?:boolean; fasePrecipitacao?:LeituraMeteorologica['fasePrecipitacao']; intensidadeIndicativa?:number; tempestade?:boolean; granizo?:boolean; neve?:number; controleQualidade?:number;
};
export function normalizarEvidencia(tipo:Exclude<TipoFonte,'modelo'>,entrada:EntradaObservacional):LeituraMeteorologica {
 const limites:Record<keyof VariaveisAtmosfericas,[number,number]>={temperatura:[-90,65],umidade:[0,100],pontoDeOrvalho:[-100,65],nebulosidade:[0,100],nuvensBaixas:[0,100],nuvensMedias:[0,100],nuvensAltas:[0,100],precipitacao:[0,250],probabilidade:[0,100],vento:[0,300],direcao:[0,360],rajada:[0,400],visibilidade:[0,100000],radiacaoDireta:[0,1500],radiacaoDifusa:[0,1500]};
 const variaveis:Partial<VariaveisAtmosfericas>={};
 for(const chave of Object.keys(limites) as (keyof VariaveisAtmosfericas)[])if(chave in entrada.variaveis)variaveis[chave]=limitarDado(entrada.variaveis[chave],...limites[chave]);
 return {...entrada,tipo,variaveis,qualidade:limitarDado(entrada.qualidade,0,1)??0,distanciaKm:limitarDado(entrada.distanciaKm,0,20000),validade:tipo==='radar'?900000:tipo==='pluviometro'?1200000:3600000};
}

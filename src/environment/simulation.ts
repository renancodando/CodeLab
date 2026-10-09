import type { EnvironmentState } from '../types';
import { clamp, rainIntensity, forecastPreparation, windDirection } from './weather-state';
import {combinarMeteorologia} from './meteorologia/confianca';
import type {ResultadoAtmosferico} from './meteorologia/modelo';
export type AmbientFrame={rain:number;snow:number;hail:number;clouds:number;wind:number;gust:number;direction:number;humidity:number;temperature:number;visibility:number;fog:number;storm:number;wetness:number;runoff:number;daylight:number;moonlight:number;sunAltitude:number;birdActivity:number;preparation:number;
 nuvensBaixas:number;nuvensMedias:number;nuvensAltas:number;chuvaDistante:number;ventoEfetivo:number;pulsoRajada:number;tempo:number;pontoDeOrvalho:number|null;radiacaoDireta:number|null;radiacaoDifusa:number|null;aguaAcumulada:number;precipitacaoRecente:number;tempoDesdeChuva:number;evaporacao:number;condensacao:number};
const ease=(value:number,target:number,dt:number,tau:number)=>value+(target-value)*(1-Math.exp(-dt/tau));
export function initialFrame(state:EnvironmentState):AmbientFrame{return {rain:0,snow:0,hail:0,clouds:state.clouds/100,wind:state.wind,gust:state.gust,direction:state.direction,humidity:state.humidity,temperature:state.temperature,visibility:state.visibility??30000,fog:.004,storm:0,wetness:0,runoff:0,daylight:1,moonlight:0,sunAltitude:.5,birdActivity:1,preparation:0,
 nuvensBaixas:state.clouds/170,nuvensMedias:state.clouds/220,nuvensAltas:state.clouds/200,chuvaDistante:0,ventoEfetivo:state.wind,pulsoRajada:0,tempo:0,pontoDeOrvalho:null,radiacaoDireta:null,radiacaoDifusa:null,aguaAcumulada:0,precipitacaoRecente:0,tempoDesdeChuva:0,evaporacao:0,condensacao:0};}
export function wetnessAfter(wetness:number,dt:number,rain:number,temp:number,sun:number,wind:number,humidity:number):number {
 const wetRate=rain/100;
 const dryRate=(.00012+clamp(temp+5,0,50)*.000012+sun*.0007+clamp(wind,0,80)*.000009)*(1-clamp(humidity/100)*.85);
 return clamp((wetness-wetRate/(wetRate+dryRate))*Math.exp(-(wetRate+dryRate)*Math.max(0,dt))+wetRate/(wetRate+dryRate));
}
export function stepEnvironment(frame:AmbientFrame,target:EnvironmentState,dt:number,now=Date.now(),resultado?:ResultadoAtmosferico):void {
 dt=clamp(dt,0,5);frame.tempo+=dt;const atmosfera=resultado??combinarMeteorologia(target.fontes??[],now),valida=atmosfera.situacao!=='insuficiente';
 const precipitation=rainIntensity(atmosfera.intensidadeLiquida,0);
 frame.preparation=forecastPreparation(target,now);
 frame.clouds=ease(frame.clouds,clamp((atmosfera.nebulosidade??target.clouds)/100+frame.preparation),dt,28);
 frame.nuvensBaixas=ease(frame.nuvensBaixas,clamp((atmosfera.nuvensBaixas??frame.clouds*60)/100),dt,45);
 frame.nuvensMedias=ease(frame.nuvensMedias,clamp((atmosfera.nuvensMedias??frame.clouds*45)/100),dt,60);
 frame.nuvensAltas=ease(frame.nuvensAltas,clamp((atmosfera.nuvensAltas??frame.clouds*50)/100),dt,80);
 frame.chuvaDistante=ease(frame.chuvaDistante,rainIntensity(atmosfera.intensidadeDistante,0),dt,40);
 const ready=precipitation===0||target.clouds<35||frame.clouds>=Math.min(.5,target.clouds/100)*.8;
 frame.rain=ease(frame.rain,ready?precipitation:0,dt,precipitation>frame.rain?32:20);
 frame.hail=ease(frame.hail,rainIntensity(atmosfera.granizo,0),dt,24);frame.snow=ease(frame.snow,atmosfera.neve,dt,30);frame.wind=ease(frame.wind,atmosfera.vento??target.wind,dt,26);frame.gust=ease(frame.gust,Math.max(frame.wind,atmosfera.rajada??target.gust),dt,18);
 const angle=(((atmosfera.direcao??target.direction)-frame.direction+540)%360)-180;frame.direction=windDirection(frame.direction+angle*(1-Math.exp(-dt/10)));
 const onda=Math.max(0,Math.sin(frame.tempo*.071+Math.sin(frame.tempo*.013)*2)*Math.sin(frame.tempo*.113+.8));
 frame.pulsoRajada=ease(frame.pulsoRajada,onda**3,dt,2.5);frame.ventoEfetivo=ease(frame.ventoEfetivo,frame.wind+(frame.gust-frame.wind)*frame.pulsoRajada,dt,1.8);
 frame.humidity=ease(frame.humidity,atmosfera.umidade??target.humidity,dt,55);frame.temperature=ease(frame.temperature,atmosfera.temperatura??target.temperature,dt,75);
 frame.pontoDeOrvalho=atmosfera.pontoDeOrvalho;frame.radiacaoDireta=valida?atmosfera.radiacaoDireta:null;frame.radiacaoDifusa=valida?atmosfera.radiacaoDifusa:null;
 frame.visibility=ease(frame.visibility,atmosfera.visibilidade??30000,dt,40);
 frame.storm=ease(frame.storm,atmosfera.tempestade,dt,26);
 const saturacao=frame.pontoDeOrvalho===null?0:clamp(1-(frame.temperature-frame.pontoDeOrvalho)/3);
 const vapor=clamp((frame.humidity-85)/15)*saturacao*(1-clamp(frame.ventoEfetivo/35))*(.3+frame.nuvensBaixas*.4+frame.wetness*.3)*(1-frame.daylight*.5);
 const fog=clamp(3/Math.max(250,frame.visibility),.002,.014)+vapor*.006+frame.rain*.0008;
 frame.fog=ease(frame.fog,fog,dt,36);
 frame.wetness=wetnessAfter(frame.wetness,dt,frame.rain,frame.temperature,frame.daylight,frame.wind,frame.humidity);
 frame.evaporacao=(.02+Math.max(0,frame.temperature)*.002+frame.daylight*.08+frame.ventoEfetivo*.001)*(1-frame.humidity/115);
 frame.aguaAcumulada=clamp(frame.aguaAcumulada+dt*(atmosfera.intensidadeLocal/3600-frame.evaporacao/3600),0,25);
 frame.precipitacaoRecente=ease(frame.precipitacaoRecente,atmosfera.intensidadeLocal,dt,900);
 frame.tempoDesdeChuva=frame.rain>.005?0:frame.tempoDesdeChuva+dt;
 frame.condensacao=ease(frame.condensacao,saturacao*clamp((frame.humidity-80)/20)*(.2+frame.wetness*.5+frame.rain*.3)*(1-frame.daylight*.6),dt,120);
 frame.runoff=ease(frame.runoff,frame.wetness*frame.rain,dt,frame.rain>.2?120:480);
 const atividadeAlvo=clamp(frame.daylight*(1-frame.storm)*(1-frame.rain*1.7)*(1-clamp(frame.wind/120)));frame.birdActivity=ease(frame.birdActivity,atividadeAlvo,dt,35);
}
export type ThunderEvent={delay:number;distance:number;strength:number};
export class StormClock {
 private until=30;
 private flashAge=10;
 private strength=0;
 private thunder:{at:number;event:ThunderEvent}[]=[];
 constructor(private random=()=>Math.random()) {this.until=this.interval();}
 private interval(){return 25-Math.log(Math.max(.001,1-this.random()))*65;}
 step(dt:number,storm:number,flashes:boolean,reduced:boolean,onThunder:(event:ThunderEvent)=>void):number{
  this.flashAge+=dt;for(let i=this.thunder.length-1;i>=0;i--){this.thunder[i].at-=dt;if(this.thunder[i].at<=0){onThunder(this.thunder[i].event);this.thunder.splice(i,1);}}
  if(storm<.65){this.until=Math.max(this.until,20);return 0;}
  this.until-=dt;if(this.until<=0){this.until=this.interval();this.flashAge=0;this.strength=.15+this.random()*.2;const distance=800+this.random()*5000;const event={distance,delay:distance/343,strength:this.strength};if(this.thunder.length<2)this.thunder.push({at:event.delay,event});}
  return flashes&&!reduced?this.strength*Math.exp(-this.flashAge*5):0;
 }
 reset(){this.thunder=[];this.flashAge=10;this.until=this.interval();}
}

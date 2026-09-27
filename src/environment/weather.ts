import type { EnvironmentState } from '../types';
import { WEATHER_INTERVAL, MAX_STALE, normalizeWeather } from './weather-state';
export { WEATHER_INTERVAL } from './weather-state';
export const defaultEnvironment:EnvironmentState={latitude:-23.55,longitude:-46.63,city:'São Paulo · ambiente padrão',wind:9,gust:16,direction:130,rain:0,clouds:25,temperature:22,humidity:60,code:1,source:'default',updatedAt:0,kind:'partly-cloudy',forecast:[],visibility:null,pressure:null};
export const cities=[{name:'São Paulo',lat:-23.55,lon:-46.63},{name:'Rio de Janeiro',lat:-22.91,lon:-43.17},{name:'Curitiba',lat:-25.43,lon:-49.27},{name:'Porto Alegre',lat:-30.03,lon:-51.23},{name:'Recife',lat:-8.05,lon:-34.88},{name:'Lisboa',lat:38.72,lon:-9.14},{name:'Manaus',lat:-3.12,lon:-60.02}];
type Location={latitude:number;longitude:number;city:string};
export class WeatherService {
 private cache=new Map<string,EnvironmentState>();
 private pending?:{key:string;controller:AbortController;promise:Promise<EnvironmentState>};
 private timer?:ReturnType<typeof setTimeout>;
 private selection?:Location;
 private revision=0;
 private disposed=false;
 private lastAttempt=0;
 private listening=false;
 constructor(private onUpdate:(state:EnvironmentState)=>void=()=>{},private request:typeof fetch=fetch,private now=()=>Date.now()){}
 async select(latitude:number,longitude:number,city:string){
  if(!Number.isFinite(latitude)||latitude < -90||latitude>90||!Number.isFinite(longitude)||longitude < -180||longitude>180)throw new Error('Localização inválida.');
  this.selection={latitude:Math.round(latitude*100)/100,longitude:Math.round(longitude*100)/100,city};
  if(!this.listening&&typeof document!=='undefined'){document.addEventListener('visibilitychange',this.visibility);this.listening=true;}
  const revision=++this.revision;clearTimeout(this.timer);
  try{const state=await this.get(this.selection);if(revision===this.revision&&!this.disposed)this.onUpdate(state);return state;}
  finally{if(revision===this.revision)this.schedule();}
 }
 private get(location:Location):Promise<EnvironmentState>{
  const key=`${location.latitude},${location.longitude}`;const previous=this.cache.get(key);
  if(this.pending?.key===key)return this.pending.promise;
  this.pending?.controller.abort();
  if(previous&&this.now()-previous.updatedAt<WEATHER_INTERVAL)return Promise.resolve({...previous,city:location.city});
  const controller=new AbortController();this.lastAttempt=this.now();
  const promise=this.load(location,key,controller).finally(()=>{if(this.pending?.controller===controller)this.pending=undefined;});
  this.pending={key,controller,promise};return promise;
 }
 private async load(location:Location,key:string,controller:AbortController):Promise<EnvironmentState>{
  let timedOut=false;const timeout=setTimeout(()=>{timedOut=true;controller.abort();},10000);
  try{
   const url=new URL('https://api.open-meteo.com/v1/forecast');
   url.search=new URLSearchParams({latitude:String(location.latitude),longitude:String(location.longitude),current:'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl',hourly:'precipitation,cloud_cover,wind_speed_10m,visibility,weather_code',daily:'sunrise,sunset',forecast_days:'2',timezone:'auto',timeformat:'unixtime'}).toString();
   const response=await this.request.call(globalThis,url,{signal:controller.signal});if(!response.ok)throw new Error(`Clima indisponível (${response.status}).`);
   const state=normalizeWeather(await response.json(),location,this.now());
   if(controller.signal.aborted)throw new DOMException('Consulta substituída.','AbortError');
   this.cache.delete(key);this.cache.set(key,state);if(this.cache.size>4)this.cache.delete(this.cache.keys().next().value!);
   return state;
  }catch(error){
   if(controller.signal.aborted&&!timedOut)throw error;
   const previous=this.cache.get(key);if(previous&&this.now()-previous.updatedAt<=MAX_STALE)return {...previous,source:'cached',city:location.city};
   return {...defaultEnvironment,...location,source:'default',updatedAt:0};
  }finally{clearTimeout(timeout);}
 }
 private schedule(){clearTimeout(this.timer);if(this.disposed||!this.selection||(typeof document!=='undefined'&&document.hidden))return;this.timer=setTimeout(()=>void this.refresh(),WEATHER_INTERVAL);}
 async refresh(){if(!this.selection||this.disposed)return;const revision=this.revision;try{const state=await this.get(this.selection);if(revision===this.revision&&!this.disposed)this.onUpdate(state);}catch{/* uma seleção mais recente assume a consulta */}finally{if(revision===this.revision)this.schedule();}}
 private visibility=()=>{clearTimeout(this.timer);if(!document.hidden){if(this.now()-this.lastAttempt>=WEATHER_INTERVAL)void this.refresh();else this.timer=setTimeout(()=>void this.refresh(),WEATHER_INTERVAL-(this.now()-this.lastAttempt));}};
 dispose(){this.disposed=true;++this.revision;clearTimeout(this.timer);this.pending?.controller.abort();if(this.listening)document.removeEventListener('visibilitychange',this.visibility);this.cache.clear();}
}

import type { EnvironmentState } from '../types';
export const defaultEnvironment:EnvironmentState = {latitude:-23.55,longitude:-46.63,city:'São Paulo · ambiente padrão',wind:9,gust:16,direction:130,rain:0,clouds:25,temperature:22,humidity:60,code:1,source:'default',updatedAt:0};
const ttl=15*60*1000;
let cache:EnvironmentState|undefined;
let pending:AbortController|undefined;
export async function fetchWeather(latitude:number,longitude:number,city:string):Promise<EnvironmentState> {
 latitude=Math.round(latitude*100)/100;longitude=Math.round(longitude*100)/100;
 if(cache && cache.latitude===latitude && cache.longitude===longitude && Date.now()-cache.updatedAt<ttl) return {...cache,city};
 pending?.abort(); pending=new AbortController(); const controller=pending;
 const timeout=setTimeout(()=>controller.abort(),10000);
 try {
  const url=new URL('https://api.open-meteo.com/v1/forecast');
  url.search=new URLSearchParams({latitude:String(latitude),longitude:String(longitude),current:'temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m',timezone:'auto'}).toString();
  const response=await fetch(url,{signal:controller.signal});if(!response.ok)throw new Error('Clima indisponível');
  const {current:c}=await response.json();
  if(!c || !Number.isFinite(c.wind_speed_10m) || !Number.isFinite(c.temperature_2m))throw new Error('Dados incompletos');
  cache={latitude,longitude,city,wind:c.wind_speed_10m,gust:c.wind_gusts_10m??c.wind_speed_10m,direction:c.wind_direction_10m??0,rain:c.precipitation??0,clouds:c.cloud_cover??0,temperature:c.temperature_2m,humidity:c.relative_humidity_2m??50,code:c.weather_code??0,source:'live',updatedAt:Date.now()};return cache;
 } catch(error) {if(cache && cache.latitude===latitude && cache.longitude===longitude)return {...cache,source:'cached'};throw error;} finally{clearTimeout(timeout);}
}
export const cities=[{name:'São Paulo',lat:-23.55,lon:-46.63},{name:'Rio de Janeiro',lat:-22.91,lon:-43.17},{name:'Curitiba',lat:-25.43,lon:-49.27},{name:'Porto Alegre',lat:-30.03,lon:-51.23},{name:'Recife',lat:-8.05,lon:-34.88},{name:'Lisboa',lat:38.72,lon:-9.14},{name:'Manaus',lat:-3.12,lon:-60.02}];

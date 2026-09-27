import type { EnvironmentState, ForecastHour, WeatherKind } from '../types';

export const WEATHER_INTERVAL=5*60*1000;
export const MAX_STALE=2*60*60*1000;
export const clamp=(value:number,min=0,max=1)=>Math.min(max,Math.max(min,value));
export const windDirection=(value:number)=>((value%360)+360)%360;
export function classifyWeather(code:number):WeatherKind {
 if(code===0)return 'clear';if(code===1||code===2)return 'partly-cloudy';if(code===3)return 'overcast';
 if(code===45||code===48)return 'fog';if([51,53,55,56,57].includes(code))return 'drizzle';
 if([61,66,80].includes(code))return 'rain-light';if([63,67,81].includes(code))return 'rain';if([65,82].includes(code))return 'rain-heavy';
 if([71,73,75,77,85,86].includes(code))return 'snow';if(code===95)return 'storm';if(code===96||code===99)return 'hail';return 'unknown';
}
export const weatherLabels:Record<WeatherKind,string>={'clear':'céu limpo','partly-cloudy':'parcialmente nublado','overcast':'nublado','fog':'neblina','drizzle':'garoa','rain-light':'chuva fraca','rain':'chuva moderada','rain-heavy':'chuva forte','snow':'neve','storm':'trovoada','hail':'trovoada com granizo','unknown':'condição não informada'};
export function rainIntensity(rain:number,code:number):number {
 if(rain>0)return clamp(Math.log1p(rain)/Math.log(16));
 const kind=classifyWeather(code);
 return kind==='drizzle'?.06:kind==='rain-light'?.14:kind==='rain'?.35:kind==='rain-heavy'?.65:kind==='storm'||kind==='hail'?.45:0;
}
type Data=Record<string,unknown>;
const obj=(v:unknown):Data=>v&&typeof v==='object'&&!Array.isArray(v)?v as Data:{};
const number=(value:unknown,min:number,max:number):number|null=>typeof value==='number'&&Number.isFinite(value)?clamp(value,min,max):null;
const series=(record:Data,name:string,index:number)=>Array.isArray(record[name])?(record[name] as unknown[])[index]:undefined;
export function normalizeWeather(raw:unknown,location:{latitude:number;longitude:number;city:string},now=Date.now()):EnvironmentState {
 const data=obj(raw),c=obj(data.current),h=obj(data.hourly),d=obj(data.daily);
 if(!Object.keys(c).length)throw new Error('Resposta meteorológica incompleta.');
 const wind=number(c.wind_speed_10m,0,300),temperature=number(c.temperature_2m,-90,65);
 if(wind===null||temperature===null)throw new Error('Dados meteorológicos essenciais ausentes.');
 const code=number(c.weather_code,0,99)??-1;const times=Array.isArray(h.time)?h.time:[];
 const forecast:ForecastHour[]=times.map((time,i)=>({time:typeof time==='number'?time*1000:0,rain:number(series(h,'precipitation',i),0,250),clouds:number(series(h,'cloud_cover',i),0,100),wind:number(series(h,'wind_speed_10m',i),0,300),visibility:number(series(h,'visibility',i),0,100000),code:number(series(h,'weather_code',i),0,99)})).filter(hour=>hour.time>=now-3600000&&hour.time<=now+24*3600000);
 const nearest=[...forecast].sort((a,b)=>Math.abs(a.time-now)-Math.abs(b.time-now))[0];
 const rain=number(c.rain,0,250),showers=number(c.showers,0,250)??0,snow=number(c.snowfall,0,100)??0;
 const precipitation=number(c.precipitation,0,250)??(rain??0)+showers;
 const dailyTime=(name:string)=>{const value=series(d,name,0);return typeof value==='number'?value*1000:null;};
 return {...location,wind,gust:Math.max(wind,number(c.wind_gusts_10m,0,400)??wind),direction:windDirection(number(c.wind_direction_10m,-3600,3600)??0),rain:rain===null?(snow>0?0:precipitation):rain+showers,clouds:number(c.cloud_cover,0,100)??35,temperature,humidity:number(c.relative_humidity_2m,0,100)??60,code,kind:classifyWeather(code),source:'live',updatedAt:now,observedAt:(number(c.time,0,1e12)??now/1000)*1000,apparentTemperature:number(c.apparent_temperature,-100,80),precipitation,showers,snow,pressure:number(c.pressure_msl,800,1100),visibility:number(c.visibility,0,100000)??nearest?.visibility??null,sunrise:dailyTime('sunrise'),sunset:dailyTime('sunset'),timezone:typeof data.timezone==='string'?data.timezone:'auto',forecast};
}
export function forecastPreparation(state:EnvironmentState,now=Date.now()):number {
 const next=state.forecast?.find(hour=>hour.time>now&&hour.time-now<=3600000);
 if(!next||next.rain===null||next.rain<=state.rain)return 0;
 return clamp(1-(next.time-now)/3600000)*.08;
}

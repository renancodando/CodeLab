import { evaluate } from './evaluate';
import type { CodeCheck } from '../learning/types';
self.onmessage = async (event:MessageEvent<{code:string;missionId:string;checks?:CodeCheck[]}>) => { try { self.postMessage(await evaluate(event.data.code,event.data.missionId,event.data.checks)); } catch { self.postMessage({passed:false,tests:[],actions:[],logs:[],duration:0,error:'Não foi possível iniciar o ambiente de execução. Tente novamente.'}); } };

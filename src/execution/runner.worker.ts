import { evaluate } from './evaluate';
self.onmessage = async (event:MessageEvent<{code:string;missionId:string}>) => { try { self.postMessage(await evaluate(event.data.code,event.data.missionId)); } catch { self.postMessage({passed:false,tests:[],actions:[],logs:[],duration:0,error:'Não foi possível iniciar o ambiente de execução. Tente novamente.'}); } };

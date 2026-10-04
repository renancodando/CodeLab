import type { RunResult } from '../types';
import type { CodeCheck } from '../learning/types';
export function execute(code:string,missionId:string,checks:CodeCheck[]=[]) {
 const worker = new Worker(new URL('./runner.worker.ts',import.meta.url),{type:'module'});
 let stop:()=>void = ()=>{};
 const result = new Promise<RunResult>(resolve=>{
  let settled = false;
  const finish=(result:RunResult)=>{if(settled)return;settled=true;clearTimeout(timer);worker.terminate();resolve(result);};
  const failure=(error:string):RunResult=>({passed:false,tests:[],actions:[],logs:[],duration:0,error});
  const timer=setTimeout(()=>finish(failure('A execução foi interrompida por tempo limite. Confira seus loops.')),8000);
  stop=()=>finish(failure('Execução cancelada. Seu código está preservado.'));
  worker.onmessage=e=>finish(e.data);
  worker.onerror=()=>finish(failure('O executor não carregou. Verifique sua conexão e tente novamente.'));
  worker.postMessage({code,missionId,checks});
 });
 return {result,cancel:()=>stop()};
}

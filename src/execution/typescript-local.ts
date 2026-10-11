import type {CompilacaoTs} from './compilador-ts';
export function compilarTypescriptLocal(codigo:string,prazoCarregamento=20000){
 const trabalhador=new Worker(new URL('./typescript-local.worker.ts',import.meta.url),{type:'module'});
 let cancelar=()=>{};
 const resultado=new Promise<CompilacaoTs>(resolver=>{
  let terminou=false,pronto=false;
  function encerrar(resposta:CompilacaoTs){if(terminou)return;terminou=true;clearTimeout(prazo);trabalhador.terminate();resolver(resposta);}
  const falhar=(erro:string)=>encerrar({javascript:'',diagnosticos:[],versao:'',erro});
  let prazo=setTimeout(()=>falhar('Não foi possível carregar o compilador TypeScript no prazo. Seu código continua salvo; conecte à internet para o primeiro carregamento e tente novamente.'),prazoCarregamento);
  cancelar=()=>falhar('Compilação cancelada. Seu TypeScript está preservado.');
  trabalhador.onmessage=(evento:MessageEvent<{tipo:string;resultado?:CompilacaoTs}>)=>{
   if(evento.data.tipo==='pronto'&&!pronto){pronto=true;clearTimeout(prazo);prazo=setTimeout(()=>falhar('Compilação interrompida por tempo limite. Reduza a complexidade dos tipos e tente novamente.'),8000);}
   else if(evento.data.tipo==='resultado'&&evento.data.resultado)encerrar(evento.data.resultado);
  };
  trabalhador.onerror=()=>falhar('Não foi possível iniciar o compilador TypeScript. Seu código continua salvo; recarregue com conexão e tente novamente.');
  trabalhador.postMessage({codigo});
 });
 return{resultado,cancelar:()=>cancelar()};
}

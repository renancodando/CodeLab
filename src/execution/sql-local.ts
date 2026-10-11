import type {ResultadoSql} from './motor-sql';

export function executarSqlLocal(codigo:string,prazoCarregamento=20000){
 const trabalhador=new Worker(new URL('./sql-local.worker.ts',import.meta.url),{type:'module'});
 let cancelar=()=>{};
 const resultado=new Promise<ResultadoSql>(resolver=>{
  let terminou=false;
  const encerrar=(resposta:ResultadoSql)=>{if(terminou)return;terminou=true;clearTimeout(prazo);trabalhador.terminate();resolver(resposta);};
  const falhar=(erro:string)=>encerrar({comandos:0,tabelas:[],erro});
  let prazo=setTimeout(()=>falhar('Não foi possível carregar SQLite no prazo. Conecte à internet para o primeiro carregamento e tente novamente.'),prazoCarregamento);
  cancelar=()=>falhar('Consulta cancelada. O banco descartável foi encerrado; seu código está preservado.');
  trabalhador.onmessage=(evento:MessageEvent<{tipo:string;resultado?:ResultadoSql}>)=>{
   if(evento.data.tipo==='pronto'){
    clearTimeout(prazo);
    prazo=setTimeout(()=>falhar('Consulta interrompida por tempo limite. Reduza os dados ou investigue a recursão.'),8000);
   }else if(evento.data.tipo==='resultado'&&evento.data.resultado)encerrar(evento.data.resultado);
  };
  trabalhador.onerror=()=>falhar('Não foi possível iniciar SQLite. Seu SQL continua salvo; recarregue com conexão e tente novamente.');
  trabalhador.postMessage({codigo});
 });
 return{resultado,cancelar:()=>cancelar()};
}

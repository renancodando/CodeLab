export type PedidoHttp={tipo:'enviar';chave:string;quantidade:number;ida:number;processamento:number;volta:number;prazo:number;falha:'nenhuma'|'perdida'|'429'|'503'};
export type AcaoHttp=PedidoHttp|{tipo:'avancar';milissegundos:number};
export type TentativaHttp=PedidoHttp&{id:number;enviadoEm:number;servidorEm:number;respostaEm:number;limiteEm:number;status:number|null;reserva:number|null;repetida:boolean;cliente:'aguardando'|'respondeu'|'timeout'};
export type EstadoHttp={agora:number;tentativas:TentativaHttp[];reservas:{id:number;chave:string;quantidade:number}[]};
const inteiro=(valor:unknown,minimo:number,maximo:number):valor is number=>Number.isInteger(valor)&&Number(valor)>=minimo&&Number(valor)<=maximo;
function validarAcao(dado:unknown):AcaoHttp{
 if(!dado||typeof dado!=='object'||Array.isArray(dado))throw new Error('Ação HTTP inválida.');
 const acao=dado as Record<string,unknown>;
 if(acao.tipo==='avancar'&&inteiro(acao.milissegundos,0,60000))return{tipo:'avancar',milissegundos:acao.milissegundos};
 if(acao.tipo==='enviar'&&typeof acao.chave==='string'&&/^[a-zA-Z0-9-]{0,40}$/.test(acao.chave)&&inteiro(acao.quantidade,1,100)&&inteiro(acao.ida,0,5000)&&inteiro(acao.processamento,0,5000)&&inteiro(acao.volta,0,5000)&&inteiro(acao.prazo,1,10000)&&['nenhuma','perdida','429','503'].includes(String(acao.falha)))return{tipo:'enviar',chave:acao.chave,quantidade:acao.quantidade,ida:acao.ida,processamento:acao.processamento,volta:acao.volta,prazo:acao.prazo,falha:acao.falha as PedidoHttp['falha']};
 throw new Error('Use chave de até 40 letras, números ou hífens, quantidade de 1 a 100 e tempos dentro dos limites.');
}
function avancar(estado:EstadoHttp,ate:number){
 const eventos=estado.tentativas.flatMap(tentativa=>[
  {em:tentativa.servidorEm,ordem:0,tentativa},
  {em:tentativa.respostaEm,ordem:1,tentativa},
  {em:tentativa.limiteEm,ordem:2,tentativa}
 ]).filter(evento=>evento.em<=ate).sort((a,b)=>a.em-b.em||a.ordem-b.ordem||a.tentativa.id-b.tentativa.id);
 for(const {ordem,tentativa} of eventos){
  if(ordem===0&&tentativa.status===null){
   if(tentativa.falha==='429'||tentativa.falha==='503'){tentativa.status=Number(tentativa.falha);continue;}
   const anterior=tentativa.chave?estado.reservas.find(reserva=>reserva.chave===tentativa.chave):undefined;
   if(anterior&&anterior.quantidade!==tentativa.quantidade){tentativa.status=409;continue;}
   const reserva=anterior??{id:estado.reservas.length+1,chave:tentativa.chave,quantidade:tentativa.quantidade};
   if(!anterior)estado.reservas.push(reserva);tentativa.status=201;tentativa.reserva=reserva.id;tentativa.repetida=Boolean(anterior);
  }
  if(ordem===1&&tentativa.falha!=='perdida'&&tentativa.cliente==='aguardando'&&tentativa.respostaEm<=tentativa.limiteEm)tentativa.cliente='respondeu';
  if(ordem===2&&tentativa.cliente==='aguardando')tentativa.cliente='timeout';
 }
 estado.agora=ate;
}
export function reproduzirExperimentoHttp(entrada:unknown):{acoes:AcaoHttp[];estado:EstadoHttp}{
 if(!Array.isArray(entrada)||entrada.length>100||JSON.stringify(entrada).length>28000)throw new Error('O rascunho HTTP excedeu o limite. Exporte antes de reiniciar.');
 const acoes=entrada.map(validarAcao),estado:EstadoHttp={agora:0,tentativas:[],reservas:[]};
 for(const acao of acoes){
  if(acao.tipo==='enviar'){
   if(estado.tentativas.length>=20)throw new Error('Limite de 20 tentativas neste experimento.');
   const servidorEm=estado.agora+acao.ida+acao.processamento;
   estado.tentativas.push({...acao,id:estado.tentativas.length+1,enviadoEm:estado.agora,servidorEm,respostaEm:servidorEm+acao.volta,limiteEm:estado.agora+acao.prazo,status:null,reserva:null,repetida:false,cliente:'aguardando'});
   avancar(estado,estado.agora);
  }else{
   if(estado.agora+acao.milissegundos>600000)throw new Error('Limite de dez minutos no relógio didático.');
   avancar(estado,estado.agora+acao.milissegundos);
  }
 }
 return{acoes,estado};
}
export function restaurarExperimentoHttp(texto:unknown){
 if(typeof texto!=='string'||texto.length>28000)return;
 try{return reproduzirExperimentoHttp(JSON.parse(texto));}catch{return;}
}
export function proximoEventoHttp(estado:EstadoHttp):number|undefined{
 const tempos=estado.tentativas.flatMap(tentativa=>[
  ...(tentativa.status===null?[tentativa.servidorEm]:[]),
  ...(tentativa.cliente==='aguardando'?[tentativa.limiteEm,...(tentativa.falha==='perdida'?[]:[tentativa.respostaEm])]:[])
 ]).filter(tempo=>tempo>estado.agora);
 return tempos.length?Math.min(...tempos):undefined;
}
export function esperaRepeticaoHttp(tentativa:TentativaHttp):number|null{
 return tentativa.cliente==='respondeu'&&tentativa.status===429?tentativa.respostaEm+2000:null;
}

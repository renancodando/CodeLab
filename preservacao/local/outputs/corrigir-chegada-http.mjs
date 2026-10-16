import {readFileSync,writeFileSync} from 'node:fs';
const caminho='src/learning/http.ts';let texto=readFileSync(caminho,'utf8');
texto=texto.replace('enviadoEm:number;servidorEm:number','enviadoEm:number;chegadaEm:number;servidorEm:number');
texto=texto.replace('function avancar(estado:EstadoHttp,ate:number){',`function avancar(estado:EstadoHttp,ate:number){
 const primeiras=new Map<string,TentativaHttp>();
 for(const tentativa of [...estado.tentativas].sort((a,b)=>a.chegadaEm-b.chegadaEm||a.id-b.id)){
  if(!tentativa.chave||tentativa.falha==='429'||tentativa.falha==='503')continue;
  if(!primeiras.has(tentativa.chave))primeiras.set(tentativa.chave,tentativa);
 }
 for(const tentativa of estado.tentativas){
  const primeira=primeiras.get(tentativa.chave);
  tentativa.servidorEm=tentativa.chegadaEm+tentativa.processamento;
  if(primeira&&primeira.quantidade===tentativa.quantidade)tentativa.servidorEm=Math.max(tentativa.servidorEm,primeira.chegadaEm+primeira.processamento);
  tentativa.respostaEm=tentativa.servidorEm+tentativa.volta;
 }`);
texto=texto.replace('a.ordem-b.ordem||a.tentativa.id-b.tentativa.id','a.ordem-b.ordem||a.tentativa.chegadaEm-b.tentativa.chegadaEm||a.tentativa.id-b.tentativa.id');
texto=texto.replace("   const anterior=tentativa.chave?", "   const primeira=primeiras.get(tentativa.chave);\n   if(primeira&&primeira.quantidade!==tentativa.quantidade){tentativa.status=409;continue;}\n   const anterior=tentativa.chave?");
texto=texto.replace('enviadoEm:estado.agora,servidorEm,','enviadoEm:estado.agora,chegadaEm:estado.agora+acao.ida,servidorEm,');writeFileSync(caminho,texto);
const ui='src/learning/http-ui.ts';texto=readFileSync(ui,'utf8').replace("' ms → servidor '+ultima.servidorEm", "' ms → chegada '+ultima.chegadaEm+' ms → conclusão no servidor '+ultima.servidorEm");writeFileSync(ui,texto);
const testes='tests/unit/http.test.ts';texto=readFileSync(testes,'utf8');const novos=`
 it('a primeira chegada reserva a identidade enquanto o processamento está pendente',()=>{
  const inicio=[pedido({processamento:1500}),pedido({quantidade:3}),avancar(300)];
  const antes=reproduzirExperimentoHttp(inicio).estado;expect(antes.reservas).toEqual([]);expect(antes.tentativas.map(t=>t.status)).toEqual([null,409]);
  const depois=reproduzirExperimentoHttp([...inicio,avancar(1400)]).estado;expect(depois.reservas).toEqual([{id:1,chave:'pedido-123',quantidade:2}]);expect(depois.tentativas.map(t=>t.status)).toEqual([201,409]);
 });
 it('a repetição idêntica aguarda a conclusão original sem criar outro efeito',()=>{
  const inicio=[pedido({processamento:1500}),pedido(),avancar(300)];
  const antes=reproduzirExperimentoHttp(inicio).estado;expect(antes.reservas).toEqual([]);expect(antes.tentativas.map(t=>t.status)).toEqual([null,null]);
  const depois=reproduzirExperimentoHttp([...inicio,avancar(1400)]).estado;expect(depois.reservas).toHaveLength(1);expect(depois.tentativas.map(t=>t.repetida)).toEqual([false,true]);expect(depois.tentativas.map(t=>t.reserva)).toEqual([1,1]);
  expect(depois).toEqual(reproduzirExperimentoHttp([pedido({processamento:1500}),pedido(),...Array.from({length:17},()=>avancar(100))]).estado);
 });
 it('uma chegada anterior vence mesmo quando foi enviada depois e processa mais devagar',()=>{
  const estado=reproduzirExperimentoHttp([pedido({ida:1000}),pedido({quantidade:3,processamento:1500}),avancar(2000)]).estado;
  expect(estado.reservas).toEqual([{id:1,chave:'pedido-123',quantidade:3}]);expect(estado.tentativas.map(t=>t.status)).toEqual([409,201]);
 });
 it.each(['429','503'] as const)('falha %s não toma a identidade de uma operação válida',falha=>{
  const estado=reproduzirExperimentoHttp([pedido({falha,processamento:1500}),pedido({quantidade:3}),avancar(2000)]).estado;
  expect(estado.reservas).toEqual([{id:1,chave:'pedido-123',quantidade:3}]);expect(estado.tentativas.map(t=>t.status)).toEqual([Number(falha),201]);
 });
`;
texto=texto.replace("describe('HTTP com relógio e identidade da intenção',()=>{", "describe('HTTP com relógio e identidade da intenção',()=>{"+novos);writeFileSync(testes,texto);

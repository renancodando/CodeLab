import {describe,it,expect} from 'vitest';
import {reproduzirExperimentoHttp,restaurarExperimentoHttp,proximoEventoHttp,esperaRepeticaoHttp,type PedidoHttp,type AcaoHttp} from '../../src/learning/http';
const pedido=(campos:Partial<PedidoHttp>={}):PedidoHttp=>({tipo:'enviar',chave:'pedido-123',quantidade:2,ida:100,processamento:100,volta:100,prazo:700,falha:'nenhuma',...campos});
const avancar=(milissegundos:number):AcaoHttp=>({tipo:'avancar',milissegundos});
describe('HTTP com relógio e identidade da intenção',()=>{
 it('a primeira chegada reserva a identidade enquanto o processamento está pendente',()=>{
  const inicio=[pedido({processamento:1500}),pedido({quantidade:3}),avancar(300)];
  const antes=reproduzirExperimentoHttp(inicio).estado;expect(antes.reservas).toEqual([]);expect(antes.tentativas.map(t=>t.status)).toEqual([null,409]);
  const depois=reproduzirExperimentoHttp([...inicio,avancar(1400)]).estado;expect(depois.reservas).toEqual([{id:1,chave:'pedido-123',quantidade:2}]);expect(depois.tentativas.map(t=>t.status)).toEqual([201,409]);
 });
 it('uma falha de transporte injetada não aguarda a intenção original',()=>{
  const estado=reproduzirExperimentoHttp([pedido({processamento:1500}),pedido({falha:'429'}),avancar(300)]).estado;
  expect(estado.tentativas.map(t=>t.status)).toEqual([null,429]);expect(estado.tentativas[1].cliente).toBe('respondeu');expect(estado.reservas).toEqual([]);
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

 it('resposta perdida não desfaz efeito e repetição com identidade não duplica',()=>{
  const acoes=[pedido({falha:'perdida'}),avancar(700)],primeiro=reproduzirExperimentoHttp(acoes);expect(primeiro.estado.reservas).toHaveLength(1);expect(primeiro.estado.tentativas[0].cliente).toBe('timeout');
  const repetido=reproduzirExperimentoHttp([...acoes,pedido(),avancar(300)]).estado;expect(repetido.reservas).toHaveLength(1);expect(repetido.tentativas[1]).toMatchObject({cliente:'respondeu',status:201,reserva:1,repetida:true});expect(primeiro.estado.tentativas).toHaveLength(1);
 });
 it('timeout pode ocorrer antes de o servidor agir e não cancela a operação',()=>{
  const acoes=[pedido({processamento:1500}),avancar(700)],antes=reproduzirExperimentoHttp(acoes).estado;expect(antes.reservas).toEqual([]);expect(antes.tentativas[0].cliente).toBe('timeout');expect(proximoEventoHttp(antes)).toBe(1600);
  const depois=reproduzirExperimentoHttp([...acoes,avancar(1000)]).estado;expect(depois.reservas).toHaveLength(1);expect(depois.tentativas[0].cliente).toBe('timeout');expect(proximoEventoHttp(depois)).toBeUndefined();
 });
 it.each(['','outra-chave'])('mudar ou omitir identidade permite outro efeito: %j',chave=>{
  const estado=reproduzirExperimentoHttp([pedido({chave}),avancar(300),pedido({chave:chave?'chave-nova':''}),avancar(300)]).estado;expect(estado.reservas).toHaveLength(2);expect(estado.tentativas[1].repetida).toBe(false);
 });
 it('rejeita conteúdo diferente sem reaproveitar uma resposta incompatível',()=>{
  const estado=reproduzirExperimentoHttp([pedido(),avancar(300),pedido({quantidade:3}),avancar(300)]).estado;expect(estado.reservas).toEqual([{id:1,chave:'pedido-123',quantidade:2}]);expect(estado.tentativas[1]).toMatchObject({status:409,reserva:null,cliente:'respondeu'});
 });
 it('processa pela ordem de chegada ao servidor, não pela ordem de envio',()=>{
  const estado=reproduzirExperimentoHttp([pedido({ida:1000}),pedido({quantidade:3}),avancar(2000)]).estado;expect(estado.reservas[0].quantidade).toBe(3);expect(estado.tentativas.map(t=>t.status)).toEqual([409,201]);
 });
 it('duas chegadas simultâneas com a mesma identidade geram um efeito',()=>{
  const estado=reproduzirExperimentoHttp([pedido(),pedido(),avancar(300)]).estado;expect(estado.reservas).toHaveLength(1);expect(estado.tentativas.map(t=>t.reserva)).toEqual([1,1]);
 });
 it('429 não cria reserva e Retry-After conta a partir da resposta recebida',()=>{
  const estado=reproduzirExperimentoHttp([pedido({falha:'429',volta:500}),avancar(700)]).estado;expect(estado.reservas).toEqual([]);expect(estado.tentativas[0].cliente).toBe('respondeu');expect(esperaRepeticaoHttp(estado.tentativas[0])).toBe(2700);
 });
 it('429 perdido não fornece ao cliente um cabeçalho que ele não recebeu',()=>{
  const estado=reproduzirExperimentoHttp([pedido({falha:'429',volta:1000}),avancar(2000)]).estado;expect(estado.tentativas[0].cliente).toBe('timeout');expect(esperaRepeticaoHttp(estado.tentativas[0])).toBeNull();
 });
 it('503 neste cenário não cria reserva e não inventa Retry-After',()=>{
  const estado=reproduzirExperimentoHttp([pedido({falha:'503'}),avancar(300)]).estado;expect(estado.reservas).toEqual([]);expect(estado.tentativas[0].status).toBe(503);expect(esperaRepeticaoHttp(estado.tentativas[0])).toBeNull();
 });
 it('limite e resposta simultâneos favorecem entrega; um milissegundo depois é timeout',()=>{
  const estado=reproduzirExperimentoHttp([pedido({volta:500}),avancar(699)]).estado;expect(estado.tentativas[0].cliente).toBe('aguardando');expect(proximoEventoHttp(estado)).toBe(700);
  expect(reproduzirExperimentoHttp([pedido({volta:500}),avancar(700)]).estado.tentativas[0].cliente).toBe('respondeu');expect(reproduzirExperimentoHttp([pedido({volta:501}),avancar(701)]).estado.tentativas[0].cliente).toBe('timeout');
 });
 it('um avanço grande equivale a avanços menores sem executar efeito duas vezes',()=>{
  const inicio=[pedido({falha:'perdida'}),pedido({chave:'outro'})];expect(reproduzirExperimentoHttp([...inicio,avancar(1000)]).estado).toEqual(reproduzirExperimentoHttp([...inicio,...Array.from({length:10},()=>avancar(100))]).estado);
 });
 it('restaura por reprodução das ações, não por confiança em efeitos serializados',()=>{
  const acoes=[pedido(),avancar(300)],salvo=restaurarExperimentoHttp(JSON.stringify(acoes));expect(salvo?.estado).toEqual(reproduzirExperimentoHttp(acoes).estado);expect(restaurarExperimentoHttp(JSON.stringify({reservas:999}))).toBeUndefined();expect(restaurarExperimentoHttp(JSON.stringify([pedido({chave:'constructor'})]))?.estado.reservas).toEqual([]);
 });
 it.each([{tipo:'avancar',milissegundos:-1},{tipo:'avancar',milissegundos:NaN},pedido({quantidade:0}),pedido({quantidade:1.5}),pedido({chave:'<script>'}),pedido({prazo:0}),pedido({ida:5001}),{tipo:'enviar'},null])('rejeita dados inválidos %j',acao=>{expect(()=>reproduzirExperimentoHttp([acao])).toThrow();});
 it('aplica limites de tentativas, relógio e quantidade de ações',()=>{
  expect(()=>reproduzirExperimentoHttp(Array.from({length:21},()=>pedido()))).toThrow('20 tentativas');expect(()=>reproduzirExperimentoHttp(Array.from({length:11},()=>avancar(60000)))).toThrow('dez minutos');expect(()=>reproduzirExperimentoHttp(Array.from({length:101},()=>avancar(0)))).toThrow('limite');expect(restaurarExperimentoHttp('x'.repeat(28001))).toBeUndefined();
 });
});

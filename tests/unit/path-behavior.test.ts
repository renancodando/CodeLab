import {describe,it,expect} from 'vitest';
import {runInNewContext} from 'node:vm';
import {learningPaths} from '../../src/content/project-paths';
function sample(path:string,stage:string,expression:string,bindings:Record<string,unknown>={}){
 const code=learningPaths.find(p=>p.id===path)!.stages.find(s=>s.id===stage)!.example;
 return runInNewContext(code+'\n'+expression,bindings,{timeout:500});
}
describe('comportamento dos exemplos completos dos percursos',()=>{
 it('invariante da soma inclui vazio, zero, negativos e não mutação',()=>{
  expect(sample('algoritmos','invariantes','[totalCentavos([]),totalCentavos([0]),totalCentavos([2990,6000]),totalCentavos([-4,2])]')).toEqual([0,0,8990,-2]);
  const input=Object.freeze([3,7]);expect(sample('algoritmos','invariantes','totalCentavos(input)',{input})).toBe(10);expect(input).toEqual([3,7]);
 });
 it('busca binária devolve a primeira ocorrência e a posição de inserção',()=>{
  expect(sample('algoritmos','busca-binaria','[limiteInferior([],4),limiteInferior([2,4,4,9],4),limiteInferior([2,4,4,9],10),limiteInferior([2,4],1)]')).toEqual([0,1,4,0]);
 });
 it('busca em largura encerra em ciclos, preserva a menor distância e ignora desconectados',()=>{
  expect(sample('algoritmos','busca-largura','Array.from(distancias({A:["B","C"],B:["A","D"],C:["D"],D:[],X:[]},"A"))')).toEqual([['A',0],['B',1],['C',1],['D',2]]);
  expect(sample('algoritmos','busca-largura','Array.from(distancias({},"A"))')).toEqual([['A',0]]);
 });
 it('fila preserva zero e distingue exaustão',()=>{
  expect(sample('estruturas-dados','fila','[retirar(),retirar(),retirar(),retirar()]')).toEqual([{encontrado:true,valor:0},{encontrado:true,valor:7},{encontrado:true,valor:9},{encontrado:false}]);
 });
 it('frequências não confundem nomes de propriedades com chaves',()=>{
  expect(sample('estruturas-dados','frequencias','Array.from(frequencias(["JS","js","JS","constructor","__proto__"]))')).toEqual([['JS',2],['js',1],['constructor',1],['__proto__',1]]);
  expect(sample('estruturas-dados','frequencias','frequencias([]).size')).toBe(0);
 });
 it('árvore busca nos dois lados e termina ao não encontrar',()=>{
  const tree={valor:4,esquerda:{valor:2,esquerda:null,direita:null},direita:{valor:8,esquerda:null,direita:null}};
  expect(sample('estruturas-dados','arvore','[buscar(tree,2)?.valor,buscar(tree,8)?.valor,buscar(tree,7),buscar(null,1)]',{tree})).toEqual([2,8,null,null]);
 });
 it('HTTP distingue sucesso, status inválido, formato incorreto e rejeição de transporte',async()=>{
  const load=sample('redes','http','lerItens') as (transport:()=>Promise<unknown>)=>Promise<unknown>;
  await expect(load(async()=>({ok:true,status:200,json:async()=>[]}))).resolves.toEqual([]);
  await expect(load(async()=>({ok:false,status:404}))).rejects.toThrow('HTTP 404');
  await expect(load(async()=>({ok:true,status:200,json:async()=>({itens:[]})}))).rejects.toThrow('Lista esperada');
  await expect(load(async()=>{throw new Error('sem rede');})).rejects.toThrow('sem rede');
 });
 it('resposta antiga não substitui a busca mais recente',async()=>{
  const shown:string[]=[];const search=sample('redes','cancelamento','pesquisar',{mostrar:(value:string)=>shown.push(value)}) as (term:string,load:(term:string)=>Promise<string>)=>Promise<void>;
  const pending:Record<string,(value:string)=>void>={};
  const load=(term:string)=>new Promise<string>(resolve=>{pending[term]=resolve;});
  const a=search('A',load),b=search('B',load);pending.B('resultado B');await b;pending.A('resultado A');await a;expect(shown).toEqual(['resultado B']);
 });
 it('mesma intenção reaproveita resultado e recusa conflito de conteúdo',()=>{
  const reserve=sample('redes','idempotencia','reservar') as (key:string,quantity:number)=>unknown;
  const first=reserve('pedido',2);expect(reserve('pedido',2)).toBe(first);expect(()=>reserve('pedido',3)).toThrow('Conflito de chave');
  expect(reserve('novo',3)).toEqual({reservado:3});expect(reserve('pedido',2)).toBe(first);
 });
 it('fronteiras de preço e entrada inválida seguem o contrato',()=>{
  expect(sample('testes','fronteiras','[pagar(0),pagar(9999),pagar(10000),pagar(10001)]')).toEqual([0,9999,9000,9001]);
  for(const input of [-1,0.5,NaN,Infinity])expect(()=>sample('testes','fronteiras','pagar(input)',{input})).toThrow('Total inválido');
 });
 it('domínio rejeita quantia inválida e saldo insuficiente antes de produzir estado',()=>{
  const transfer=sample('arquitetura','dominio','transferir') as (balance:number,amount:number)=>number;
  expect(transfer(10000,2500)).toBe(7500);expect(transfer(10000,10000)).toBe(0);expect(()=>transfer(10,11)).toThrow('Saldo insuficiente');
  for(const amount of [0,-1,0.5,NaN])expect(()=>transfer(10000,amount)).toThrow('Quantia inválida');
 });
 it('adaptador mantém regra de versão antes de chamar o armazenamento',()=>{
  const calls:unknown[]=[];const repository={carregar:()=>({version:1}),salvar:(value:unknown)=>{calls.push(value);}};
  const notebook=sample('arquitetura','adaptadores','criarCaderno(repository)',{repository}) as {carregar:()=>unknown;salvar:(doc:unknown)=>unknown};
  expect(notebook.carregar()).toEqual({version:1});expect(()=>notebook.salvar({version:2})).toThrow('Versão não suportada');expect(calls).toEqual([]);
  notebook.salvar({version:1});expect(calls).toEqual([{version:1}]);
 });
});

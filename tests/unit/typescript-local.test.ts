import {beforeAll,describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {compilarTypescript} from '../../src/execution/compilador-ts';
import {evaluate} from '../../src/execution/evaluate';
const bibliotecas=new Map<string,string>();
beforeAll(()=>{
 function incluir(nome:string){if(bibliotecas.has('/'+nome))return;const texto=readFileSync(resolve('node_modules/typescript/lib',nome),'utf8');bibliotecas.set('/'+nome,texto);for(const referencia of texto.matchAll(/<reference lib="([^"]+)"/g))incluir('lib.'+referencia[1]+'.d.ts');}
 incluir('lib.es2022.d.ts');
});
const compilar=(codigo:string)=>compilarTypescript(codigo,bibliotecas);
describe('TypeScript real antes da execução isolada',()=>{
 it('confere contratos, remove tipos e executa casos vazio e misto no QuickJS',async()=>{
  const resposta=compilar('interface Pedido {centavos:number; valido:boolean}\nfunction somar(pedidos:Pedido[]):number{return pedidos.filter(p=>p.valido).reduce((total,p)=>total+p.centavos,0);}\nconsole.log(somar([]));\nconsole.log(somar([{centavos:2995,valido:true},{centavos:100,valido:false},{centavos:5995,valido:true}]));');
  expect(resposta.diagnosticos).toEqual([]);expect(resposta.erro).toBeUndefined();expect(resposta.versao).toBe('5.9.3');expect(resposta.javascript).not.toContain('interface Pedido');expect(resposta.javascript).not.toContain(':number');
  expect((await evaluate(resposta.javascript,'laboratorio')).logs).toEqual(['0','8990']);
 });
 it('checa generics, narrowing e mapped types com a biblioteca ES2022 real',async()=>{
  const resposta=compilar('type Leitura<T> = {readonly [K in keyof T]:T[K]};\nfunction primeiro<T>(valores:readonly T[]):T|undefined{return valores[0];}\nfunction normalizar(valor:unknown):string{return typeof valor === "string" ? valor.trim() : "ausente";}\nconst pedido:Leitura<{valor:number}>={valor:7}; console.log(primeiro([pedido])?.valor); console.log(normalizar(null));');expect(resposta.diagnosticos).toEqual([]);expect((await evaluate(resposta.javascript,'laboratorio')).logs).toEqual(['7','ausente']);
 });
 it('um erro semântico tem código e posição e impede emissão',()=>{
  const resposta=compilar('const certo=1;\nconst errado:number="2";');expect(resposta.javascript).toBe('');expect(resposta.diagnosticos).toContainEqual(expect.objectContaining({codigo:2322,linha:2,coluna:7}));
 });
 it.each(['function somar(valor){return valor+1;}','const valor:number=null;','const numero:number = ;'])('recusa erros de strict ou sintaxe: %s',codigo=>{const resposta=compilar(codigo);expect(resposta.diagnosticos.length).toBeGreaterThan(0);expect(resposta.javascript).toBe('');});
 it.each(['fetch("https://example.com");','document.title="x";','setTimeout(()=>{},0);','process.exit();','require("fs");'])('não declara APIs ausentes no executor: %s',codigo=>{const resposta=compilar(codigo);expect(resposta.diagnosticos.map(d=>d.mensagem).join('\n')).toContain("Cannot find name '"+codigo.match(/^\w+/)![0]+"'");expect(resposta.javascript).toBe('');});
 it.each(['import {readFile} from "node:fs";','const modulo=import("./outro");','type Modulo=import("pacote").Tipo;','export const valor=1;','export {};','import arquivo=require("fs");'])('mantém módulos fora do contrato desta bancada: %s',codigo=>{const resposta=compilar(codigo);expect(resposta.erro).toContain('script TypeScript isolado');expect(resposta.javascript).toBe('');});
 it('uma referência a arquivo externo falha sem ler o disco',()=>{const resposta=compilar('/// <reference path="/arquivo-externo.d.ts" />\nconsole.log(1);');expect(resposta.diagnosticos.some(d=>d.codigo===6053)).toBe(true);expect(resposta.javascript).toBe('');});
 it('compilar não executa efeitos e any não concede APIs ao QuickJS',async()=>{
  const resposta=compilar('const ambiente:any=globalThis; console.log(ambiente.fetch("https://example.com"));');expect(resposta.diagnosticos).toEqual([]);const execucao=await evaluate(resposta.javascript,'laboratorio');expect(execucao.error).toBeTruthy();expect(execucao.logs).toEqual([]);
 });
 it('limita entrada, emissão e número de diagnósticos sem truncar código executável',()=>{
  expect(compilar(' '.repeat(30001)).erro).toContain('30.000');
  const erros=compilar(Array.from({length:100},(_,i)=>'const erro'+i+':number="texto";').join('\n'));expect(erros.diagnosticos).toHaveLength(50);expect(erros.javascript).toBe('');
  const ampliado=compilar(Array.from({length:400},(_,i)=>'enum E'+i+' { A, B }').join('\n'));expect(ampliado.erro).toContain('JavaScript gerado');expect(ampliado.javascript).toBe('');
 });
});

import {it,expect} from 'vitest';
import {evaluate} from '../../src/execution/evaluate';

it('confere o valor resolvido depois das microtarefas de cada caso',async()=>{
 const resultado=await evaluate('async function dobro(n){await Promise.resolve();return n*2;}','aula',[
  {label:'primeira chamada',expression:'dobro(3)',expected:6,aguardar:true},
  {label:'chamada independente',expression:'dobro(-4)',expected:-8,aguardar:true}
 ]);
 expect(resultado.error).toBeUndefined();expect(resultado.tests.map(t=>t.passed)).toEqual([true,true]);
 const errado=await evaluate('async function dobro(n){return n;}','aula',[{label:'resultado',expression:'dobro(3)',expected:6,aguardar:true}]);
 expect(errado.passed).toBe(false);
});
it('não confunde uma Promise rejeitada com término correto',async()=>{
 const resultado=await evaluate('async function falhar(){await Promise.resolve();throw new Error("corpo inválido");}','aula',[{label:'rejeição',expression:'falhar()',expected:true,aguardar:true}]);
 expect(resultado.passed).toBe(false);expect(resultado.error).toContain('corpo inválido');
});
it('encerra uma Promise que depende de um evento ausente sem bloquear o host',async()=>{
 for(let indice=0;indice<3;indice++){
  const resultado=await evaluate('function esperar(){return new Promise(()=>{});}','aula',[{label:'pendente',expression:'esperar()',expected:true,aguardar:true}]);
  expect(resultado.passed).toBe(false);expect(resultado.error).toContain('pendente');
 }
 expect((await evaluate('console.log(typeof fetch, typeof setTimeout, typeof process);','laboratorio')).logs).toEqual(['undefined undefined undefined']);
});
it('o limite de microtarefas é compartilhado entre os casos',async()=>{
 const resultado=await evaluate('function percorrer(){let p=Promise.resolve(0);for(let i=0;i<600;i++)p=p.then(n=>n+1);return p;}','aula',[
  {label:'primeiro',expression:'percorrer()',expected:600,aguardar:true},
  {label:'segundo',expression:'percorrer()',expected:600,aguardar:true}
 ]);
 expect(resultado.tests).toEqual([{label:'primeiro',passed:true}]);expect(resultado.error).toContain('tempo demais');expect(resultado.passed).toBe(false);
});
it('mantém casos síncronos e não executa microtarefas extras sem solicitação',async()=>{
 const resultado=await evaluate('let total=0;','aula',[
  {label:'síncrono',expression:'(Promise.resolve().then(()=>total++),total)',expected:0},
  {label:'continua síncrono',expression:'total',expected:0}
 ]);
 expect(resultado.passed).toBe(true);
});

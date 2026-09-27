import { describe, expect, it } from 'vitest';
import { evaluate } from '../../src/execution/evaluate';
import { missions } from '../../src/content/missions';
describe('missões executam lógica real',()=>{
 for(const mission of missions)it(`${mission.id}: a solução passa todos os casos`,async()=>{const result=await evaluate(mission.solution,mission.id);expect(result.error).toBeUndefined();expect(result.passed).toBe(true);expect(result.tests.length).toBeGreaterThan(1);});
 it('rejeita uma ponte que abre independentemente da energia',async()=>{const result=await evaluate('function atravessar(energia) { abrirPonte(); } atraves sar','ponte');expect(result.passed).toBe(false);const hardcoded=await evaluate('function atravessar(energia) { abrirPonte(); }','ponte');expect(hardcoded.tests.some(t=>!t.passed)).toBe(true);});
 it('rejeita loops com limite incorreto',async()=>{const result=await evaluate(missions.find(m=>m.id==='debug')!.starter,'debug');expect(result.passed).toBe(false);expect(result.tests.every(t=>!t.passed)).toBe(true);});
 it('não aceita energia como texto',async()=>{expect((await evaluate('let energia = "100";','energia')).passed).toBe(false);});
 it('interrompe código infinito',async()=>{const result=await evaluate('while(true) {}','energia');expect(result.error).toContain('tempo demais');expect(result.duration).toBeLessThan(3500);});
 it('não expõe rede, DOM, arquivos, cookies ou ponte para o host',async()=>{const result=await evaluate('console.log(typeof fetch, typeof document, typeof process, typeof require, typeof localStorage, typeof postMessage);','laboratorio');expect(result.logs[0]).toBe('undefined undefined undefined undefined undefined undefined');});
 it('limita o tamanho do código',async()=>{expect((await evaluate(' '.repeat(30001),'energia')).error).toContain('30.000');});
 it('limita alocação de memória sem derrubar o host',async()=>{const result=await evaluate('const values=[]; while(true) values.push(new Array(100000).fill(123));','energia');expect(result.passed).toBe(false);expect(result.error).toBeTruthy();});
 it('não carrega globais entre execuções',async()=>{await evaluate('globalThis.segredo = 42;','laboratorio');const result=await evaluate('console.log(typeof segredo);','laboratorio');expect(result.logs).toEqual(['undefined']);});
 it('limita quantidade de mensagens',async()=>{const result=await evaluate('for(let i=0;i<1000;i++)console.log(i);','laboratorio');expect(result.logs.length).toBe(50);});
});

it('processa Promises locais com limite de microtarefas',async()=>{
 const result=await evaluate('Promise.resolve(7).then(n => console.log(n * 2));','laboratorio');expect(result.logs).toEqual(['14']);expect(result.passed).toBe(true);
 const infinite=await evaluate('function repetir(){Promise.resolve().then(repetir)} repetir();','laboratorio');expect(infinite.error).toMatch(/tempo/);
});

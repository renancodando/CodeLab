import {afterEach,beforeEach,describe,it,expect,vi} from 'vitest';
import {executarSqlLocal} from '../../src/execution/sql-local';
class TrabalhadorSql {
 static atual:TrabalhadorSql;
 onmessage:((evento:{data:unknown})=>void)|undefined;onerror:(()=>void)|undefined;
 terminate=vi.fn();postMessage=vi.fn();
 constructor(){TrabalhadorSql.atual=this;}
 enviar(data:unknown){this.onmessage?.({data});}
}
beforeEach(()=>{vi.useFakeTimers();vi.stubGlobal('Worker',TrabalhadorSql);});
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();});
describe('idade do carregamento e fase da falha SQLite',()=>{
 it('o prazo antes de pronto é falha de carregamento e encerra o worker',async()=>{
  const consulta=executarSqlLocal('SELECT 1;',100);const trabalhador=TrabalhadorSql.atual;vi.advanceTimersByTime(101);const resposta=await consulta.resultado;expect(resposta.faseErro).toBe('carregamento');expect(resposta.erro).toContain('carregar SQLite');expect(trabalhador.terminate).toHaveBeenCalledTimes(1);
 });
 it('depois de pronto o prazo de CPU corresponde à consulta',async()=>{
  const consulta=executarSqlLocal('SELECT 1;');const trabalhador=TrabalhadorSql.atual;trabalhador.enviar({tipo:'pronto'});vi.advanceTimersByTime(8001);const resposta=await consulta.resultado;expect(resposta.faseErro).toBe('consulta');expect(resposta.erro).toContain('tempo limite');expect(trabalhador.terminate).toHaveBeenCalledTimes(1);
 });
 it.each([false,true])('erro nativo conserva se a consulta já iniciou: %s',async pronto=>{
  const consulta=executarSqlLocal('SELECT 1;');const trabalhador=TrabalhadorSql.atual;if(pronto)trabalhador.enviar({tipo:'pronto'});trabalhador.onerror?.();expect((await consulta.resultado).faseErro).toBe(pronto?'consulta':'carregamento');
 });
 it('cancelar encerra uma vez e uma resposta tardia não reabre a execução',async()=>{
  const consulta=executarSqlLocal('SELECT 1;');const trabalhador=TrabalhadorSql.atual;consulta.cancelar();consulta.cancelar();trabalhador.enviar({tipo:'pronto'});expect(vi.getTimerCount()).toBe(0);trabalhador.enviar({tipo:'resultado',resultado:{comandos:1,tabelas:[]}});expect((await consulta.resultado).erro).toContain('cancelada');expect(trabalhador.terminate).toHaveBeenCalledTimes(1);
 });
 it('o erro estruturado do motor chega sem perder a fase',async()=>{
  const consulta=executarSqlLocal('SELECT FROM;');const trabalhador=TrabalhadorSql.atual;trabalhador.enviar({tipo:'pronto'});const erro={comandos:0,tabelas:[],erro:'SQLite: syntax error',faseErro:'consulta'};trabalhador.enviar({tipo:'resultado',resultado:erro});expect(await consulta.resultado).toEqual(erro);vi.advanceTimersByTime(30000);expect(trabalhador.terminate).toHaveBeenCalledTimes(1);
 });
});

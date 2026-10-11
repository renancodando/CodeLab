import {afterEach,beforeEach,describe,it,expect,vi} from 'vitest';
import {compilarTypescriptLocal} from '../../src/execution/typescript-local';
class TrabalhadorTeste {
 static ultimo:TrabalhadorTeste;
 onmessage:((evento:MessageEvent)=>void)|undefined;
 onerror:(()=>void)|undefined;
 terminate=vi.fn();postMessage=vi.fn();
 constructor(){TrabalhadorTeste.ultimo=this;}
 responder(dados:unknown){this.onmessage?.({data:dados} as MessageEvent);}
}
beforeEach(()=>{vi.useFakeTimers();vi.stubGlobal('Worker',TrabalhadorTeste);});
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();});
describe('prazos e descarte do compilador TypeScript',()=>{
 it('carregamento sem resposta termina no orçamento restante',async()=>{const tarefa=compilarTypescriptLocal('console.log(1)',1000);await vi.advanceTimersByTimeAsync(1001);expect((await tarefa.resultado).erro).toContain('carregar o compilador');expect(TrabalhadorTeste.ultimo.terminate).toHaveBeenCalledOnce();});
 it('o prazo de compilação começa depois de pronto, sem renovar indefinidamente',async()=>{const tarefa=compilarTypescriptLocal('');const trabalhador=TrabalhadorTeste.ultimo;trabalhador.responder({tipo:'pronto'});await vi.advanceTimersByTimeAsync(4000);trabalhador.responder({tipo:'pronto'});await vi.advanceTimersByTimeAsync(4001);expect((await tarefa.resultado).erro).toContain('Compilação interrompida');expect(trabalhador.terminate).toHaveBeenCalledOnce();});
 it('cancelar elimina o worker e ignora resultado atrasado',async()=>{const tarefa=compilarTypescriptLocal('');const trabalhador=TrabalhadorTeste.ultimo;tarefa.cancelar();trabalhador.responder({tipo:'resultado',resultado:{javascript:'console.log(99)',diagnosticos:[],versao:'5.9.3'}});expect((await tarefa.resultado).erro).toContain('cancelada');expect(trabalhador.terminate).toHaveBeenCalledOnce();expect(vi.getTimerCount()).toBe(0);});
 it('um resultado válido encerra o worker antes de liberar a resposta',async()=>{const tarefa=compilarTypescriptLocal('console.log(1)');const trabalhador=TrabalhadorTeste.ultimo;const resultado={javascript:'console.log(1)',diagnosticos:[],versao:'5.9.3'};trabalhador.responder({tipo:'resultado',resultado});expect(await tarefa.resultado).toEqual(resultado);expect(trabalhador.terminate).toHaveBeenCalledOnce();expect(vi.getTimerCount()).toBe(0);});
 it('falha de inicialização preserva uma resposta recuperável',async()=>{const tarefa=compilarTypescriptLocal('');TrabalhadorTeste.ultimo.onerror?.();expect((await tarefa.resultado).erro).toContain('Seu código continua salvo');expect(TrabalhadorTeste.ultimo.terminate).toHaveBeenCalledOnce();});
});

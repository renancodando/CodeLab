import {it,expect} from 'vitest';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {practicesForLesson} from '../../src/content/practice';
import javascript from '../../src/content/deep/javascript';

it('contador compartilhado passa sozinho e falha ao criar a segunda instância',async()=>{
 const atividade=practicesForLesson('js-closures-estado')[0];
 const resultado=await evaluatePractice(atividade.id,atividade.code!);
 expect(resultado.tests[0].passed).toBe(true);expect(resultado.tests[1].passed).toBe(false);
 expect(resultado.feedback).toContain('binding compartilhado');expect(resultado.feedback).not.toContain('let total = inicial');
});
it('contador com estado local ainda precisa rejeitar overflow antes de escrever',async()=>{
 const codigo=getPracticeSolution('js-debug-contadores')!.replace(' || !Number.isSafeInteger(total + valor)','');
 const resultado=await evaluatePractice('js-debug-contadores',codigo);
 expect(resultado.tests.slice(0,3).every(teste=>teste.passed)).toBe(true);
 expect(resultado.tests[3].passed).toBe(false);expect(resultado.feedback).toContain('próximo total inseguro');
});
it('callbacks com resultados fixos passam no exemplo e falham em outras quantidades',async()=>{
 const resultado=await evaluatePractice('js-debug-callbacks','function criarCallbacks(){return [()=>0,()=>1,()=>2];}');
 expect(resultado.tests[0].passed).toBe(true);expect(resultado.tests[1].passed).toBe(false);
 expect(resultado.feedback).toContain('quantidade recebida');
});
it('uma fábrica auxiliar também resolve os bindings, sem impor sintaxe let',async()=>{
 const codigo=getPracticeSolution('js-debug-callbacks')!.replace('for (let indice = 0; indice < quantidade; indice++) callbacks.push(() => indice);','function criarLeitor(valor) { return () => valor; }\n  for (var indice = 0; indice < quantidade; indice++) callbacks.push(criarLeitor(indice));');
 expect((await evaluatePractice('js-debug-callbacks',codigo)).passed).toBe(true);
});
it('um cursor compartilhado passa uma sequência e falha ao chamar fora de ordem',async()=>{
 const codigo='function criarCallbacks(quantidade) { if(!Number.isSafeInteger(quantidade)||quantidade<0||quantidade>32)throw new RangeError();let proximo=0;return Array.from({length:quantidade},()=>()=>proximo++); }';
 const resultado=await evaluatePractice('js-debug-callbacks',codigo);
 expect(resultado.tests.slice(0,2).every(teste=>teste.passed)).toBe(true);
 expect(resultado.tests[2].passed).toBe(false);expect(resultado.feedback).toContain('ordem ou do número de chamadas');
});
it('copiar somente a entrada não basta quando o snapshot expõe o array interno',async()=>{
 const codigo=getPracticeSolution('js-debug-snapshot')!.replace('return [...itens];','return itens;');
 const resultado=await evaluatePractice('js-debug-snapshot',codigo);
 expect(resultado.tests.slice(0,2).every(teste=>teste.passed)).toBe(true);
 expect(resultado.tests[2].passed).toBe(false);expect(resultado.feedback).toContain('referência devolvida');
});
it('a validação não pode ignorar uma posição ausente da coleção inicial',async()=>{
 const codigo=getPracticeSolution('js-debug-snapshot')!.replace('Array.from(iniciais).every','iniciais.every');
 const resultado=await evaluatePractice('js-debug-snapshot',codigo);
 expect(resultado.tests.slice(0,5).every(teste=>teste.passed)).toBe(true);
 expect(resultado.tests[5].passed).toBe(false);
});
it('a teoria prepara instância, binding e fronteiras antes das três pausas executáveis',()=>{
 const aula=javascript.lessons.find(aula=>aula.id==='js-closures-estado')!;
 const pausas=practicesForLesson(aula.id);
 expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([2,4,5]);
 expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);
 expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.kind==='debug')).toBe(true);
 expect(aula.sections[1].text.join(' ')).toContain('duas fases');
 expect(aula.sections[3].text.join(' ')).toContain('fora de ordem');
 expect(aula.sections[4].text.join(' ')).toContain('duas fronteiras');
});

import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {evaluate} from '../../src/execution/evaluate';
import {lessons} from '../../src/content/curriculum';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';

const respostas:Record<string,string|string[]>={
 'inicio-prever-ordem':'Preparar\nTestar\nPreparar',
 'inicio-diagnosticar-texto':'texto',
 'inicio-reconstruir-roteiro':['abrir','testar','fechar'],
 'entrada-prever-zero':'0\n7',
 'entrada-diagnosticar-unidade':'separar',
 'passos-prever-media':'21\n7',
 'passos-ordenar-dependencias':['entradas','somar','dividir','mostrar']
};
for(const [id,resposta] of Object.entries(respostas))it(id+': conceito sem alegar execução',async()=>{
 const resultado=await evaluatePractice(id,resposta);
 expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
 expect((await evaluatePractice(id,'resposta errada')).passed).toBe(false);
});
for(const aula of ['programar','entrada-saida','passos'])it(aula+': previsão conferida no executor e capítulos preservados',async()=>{
 const pausas=practicesForLesson(aula);expect(pausas).toHaveLength(3);expect(pausas.map(p=>p.afterBlock)).toEqual([3,6,8]);expect(pausas.every(p=>p.requiresConcept)).toBe(true);
 const previsao=pausas[0],execucao=await evaluate(previsao.code!,'laboratorio');expect(execucao.error).toBeUndefined();expect(execucao.logs.join('\n')).toBe(respostas[previsao.id]);
 expect(lessons.find(l=>l.id===aula)!.capitulos).toHaveLength(12);
 for(const pausa of pausas)expect(adaptiveCatalog.activities.find(a=>a.id===pausa.id)!.requiredConcepts).toContain(idPreparacao(aula));
});
it('reconstruir exige todas as instruções e distingue a ordem das dependências',async()=>{
 for(const resposta of [['entradas','somar','dividir'],['entradas','somar','somar','mostrar'],['entradas','dividir','somar','mostrar']])expect((await evaluatePractice('passos-ordenar-dependencias',resposta)).passed).toBe(false);
 const correto=await evaluate(getPracticeSolution('passos-ordenar-dependencias')!,'laboratorio');expect(correto.error).toBeUndefined();expect(correto.logs).toEqual(['7']);
 const errado=await evaluate('const media=soma/3; const soma=21; console.log(media);','laboratorio');expect(errado.error).toContain('ReferenceError');
 expect((await evaluate(getPracticeSolution('inicio-reconstruir-roteiro')!,'laboratorio')).logs).toEqual(['Abrir','Testar','Fechar']);
});
it('aspas delimitam texto, nomes não definidos e sintaxe incompleta são defeitos diferentes',async()=>{
 expect((await evaluate(getPracticeSolution('inicio-diagnosticar-texto')!,'laboratorio')).logs).toEqual(['Café']);
 expect((await evaluate('console.log(Café);','laboratorio')).error).toContain('ReferenceError');
 expect((await evaluate('console.log("Café);','laboratorio')).error).toContain('SyntaxError');
 for(const opcao of ['nome','incompleto'])expect((await evaluatePractice('inicio-diagnosticar-texto',opcao)).passed).toBe(false);
});
for(const id of ['entrada-corrigir-total','passos-corrigir-media'])it(id+': referência executada com quatro famílias',async()=>{
 const resultado=await evaluatePractice(id,getPracticeSolution(id)!);expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('quickjs');expect(resultado.evidence).toBe('executed');expect(resultado.tests).toHaveLength(4);
});
it('preço por unidade não transforma o frete em custo por unidade',async()=>{
 for(const opcao of ['somar','ignorar'])expect((await evaluatePractice('entrada-diagnosticar-unidade',opcao)).passed).toBe(false);
 const codigo=practicesForLesson('entrada-saida')[2].code!;const resultado=await evaluatePractice('entrada-corrigir-total',codigo);
 expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('custo fixo');expect(resultado.feedback).not.toContain('return quantidade * precoUnitario + frete');
 expect((await evaluate(codigo+'\nconsole.log(calcularTotal(3,1200,700));','laboratorio')).logs).toEqual(['5700']);
});
it.each([
 'function calcularTotal(){return 4300;}',
 'function calcularTotal(q,p,f){return String(q*p+f);}',
 'function calcularTotal(q,p,f){return (q||1)*p+f;}',
 'function calcularTotal(q,p,f){return q*p;}',
 'let acumulado=0;function calcularTotal(q,p,f){acumulado+=q*p+f;return acumulado;}',
 'function calcularTotal(q,p,f){console.log(q*p+f);}'
])('rejeita resultado fixo, tipo errado, zero substituído ou estado: %s',async codigo=>{
 expect((await evaluatePractice('entrada-corrigir-total',codigo)).passed).toBe(false);
});
it('total que só conhece os dois exemplos falha nas bordas, e a forma equivalente passa',async()=>{
 const incompleto=await evaluatePractice('entrada-corrigir-total','function calcularTotal(q,p,f){return q===3?4300:600;}');expect(incompleto.tests[0].passed).toBe(true);expect(incompleto.tests[1].passed).toBe(false);
 expect((await evaluatePractice('entrada-corrigir-total','const calcularTotal=(unidades,valor,entrega)=>entrega+valor*unidades;')).passed).toBe(true);
});
it.each([
 'function mediaTres(){return 7;}',
 'function mediaTres(a,b,c){return (a+b+c)/2;}',
 'function mediaTres(a,b,c){return (a+b)/2;}',
 'function mediaTres(a,b,c){return Math.round((a+b+c)/3);}',
 'function mediaTres(a,b,c){return String((a+b+c)/3);}',
 'function mediaTres(a,b,c){return ((a||1)+(b||1)+(c||1))/3;}',
 'function mediaTres(){return NaN;}',
 'function mediaTres(a,b,c){return (a+b+c)/3+0.00000001;}'
])('a média rejeita soma/divisor/tipo/precisão incorretos: %s',async codigo=>{
 expect((await evaluatePractice('passos-corrigir-media',codigo)).passed).toBe(false);
});
it('aceita médias equivalentes com arredondamento binário de poucas unidades, sem aceitar arredondamento decimal',async()=>{
 expect((await evaluatePractice('passos-corrigir-media','const mediaTres=(a,b,c)=>a/3+b/3+c/3;')).passed).toBe(true);
 expect((await evaluatePractice('passos-corrigir-media','function mediaTres(a,b,c){return Number(((a+b+c)/3).toFixed(2));}')).passed).toBe(false);
});

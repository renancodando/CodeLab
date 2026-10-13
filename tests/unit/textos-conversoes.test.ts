import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {lessons} from '../../src/content/curriculum';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {evaluate} from '../../src/execution/evaluate';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,recordEvidence,skillMastery,prepareAdaptiveBackup} from '../../src/learning/adaptive';

const id='textos-corrigir-entrada';
it('conversões ganham três pausas próprias sem perder os capítulos e o exercício original',()=>{
 const pausas=practicesForLesson('strings-numbers');expect(pausas).toHaveLength(3);expect(pausas.map(p=>p.afterBlock)).toEqual([3,6,8]);
 const aula=lessons.find(a=>a.id==='strings-numbers')!;expect(aula.capitulos).toHaveLength(12);expect(aula.solution).toContain('dobroTexto');
 for(const pausa of pausas)expect(adaptiveCatalog.activities.find(a=>a.id===pausa.id)!.requiredConcepts).toEqual([idPreparacao('strings-numbers')]);
 expect(adaptiveCatalog.activities.find(a=>a.id===id)!.kind).toBe('challenge');
});
it('a previsão corresponde ao programa executado, mas a resposta do aluno continua conceitual',async()=>{
 const pausa=practicesForLesson('strings-numbers')[0],execucao=await evaluate(pausa.code!,'laboratorio');expect(execucao.error).toBeUndefined();expect(execucao.logs).toEqual(['23','5','0','false']);
 const resultado=await evaluatePractice(pausa.id,'23\n5\n0\nfalse');expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');expect(resultado.evidence).toBe('conceptual');
 for(const resposta of ['5\n5\n0\nfalse','23\n5\nNaN\nfalse','23\n5\n0\ntrue'])expect((await evaluatePractice(pausa.id,resposta)).passed).toBe(false);
});
it('trim retorna outro texto e a correção conserva espaços internos',async()=>{
 const pausa=practicesForLesson('strings-numbers')[1];expect((await evaluate(pausa.code!,'laboratorio')).logs).toEqual(['[  Ana Maria  ]']);
 expect((await evaluate(getPracticeSolution(pausa.id)!,'laboratorio')).logs).toEqual(['[Ana Maria]']);
 expect((await evaluate('let nome="  Ana Maria  ";nome=nome.replaceAll(" ","");console.log("["+nome+"]");','laboratorio')).logs).toEqual(['[AnaMaria]']);
 for(const resposta of ['repetir','remover'])expect((await evaluatePractice(pausa.id,resposta)).passed).toBe(false);
 const resultado=await evaluatePractice(pausa.id,'guardar');expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');
});
it('o gabarito novo e o exercício original passam nas quatro famílias executadas',async()=>{
 for(const codigo of [getPracticeSolution(id)!,lessons.find(a=>a.id==='strings-numbers')!.solution]){
  const resultado=await evaluatePractice(id,codigo);expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('quickjs');expect(resultado.evidence).toBe('executed');expect(resultado.tests).toHaveLength(4);
 }
});
it('o programa quebrado funciona no caso comum e falha na rejeição de ausência ou prefixo',async()=>{
 const resultado=await evaluatePractice(id,practicesForLesson('strings-numbers')[2].code!);
 expect(resultado.tests[0].passed).toBe(true);expect(resultado.tests[1].passed).toBe(false);expect(resultado.feedback).toContain('ausência');expect(resultado.feedback).not.toContain('throw new Error');
});
it.each([
 'function dobroTexto(t){return 12;}',
 'function dobroTexto(t){return Number(t)*2;}',
 'function dobroTexto(t){const n=Number(t);if(!t.trim()||!Number.isFinite(n))throw new Error();return (n||1)*2;}',
 'function dobroTexto(t){const n=parseFloat(t);if(!Number.isFinite(n))throw new Error();return n*2;}',
 'function dobroTexto(t){const n=parseInt(t,10);if(!t.trim()||!Number.isFinite(n))throw new Error();return n*2;}',
 'function dobroTexto(t){const n=Number(t);if(!t.trim()||Number.isNaN(n))throw new Error();return n*2;}',
 'function dobroTexto(t){const n=Number(t.replace(",","."));if(!t.trim()||!Number.isFinite(n))throw new Error();return n*2;}',
 'function dobroTexto(t){const n=Number(t);if(!t.trim()||!Number.isFinite(n))return null;return n*2;}',
 'function dobroTexto(t){const n=Number(t);if(!t.trim()||!Number.isFinite(n))throw "Inválido";return n*2;}',
 'function dobroTexto(t){const n=Number(t);if(!t.trim()||!Number.isFinite(n))throw new Error();return String(n*2);}',
 'function dobroTexto(t){const n=Number(t);if(!t.trim()||!Number.isFinite(n))throw new Error();console.log(n*2);}',
 'let total=0;function dobroTexto(t){const n=Number(t);if(!t.trim()||!Number.isFinite(n))throw new Error();total+=n*2;return total;}'
])('recusa uma conversão que quebra o contrato: %s',async codigo=>{expect((await evaluatePractice(id,codigo)).passed).toBe(false);});
it('arredondar apenas a saída passa nos exemplos e é detectado nas outras frações',async()=>{
 const resultado=await evaluatePractice(id,'function dobroTexto(t){const n=Number(t);if(!t.trim()||!Number.isFinite(n))throw new Error();return Number((n*2).toFixed(2));}');
 expect(resultado.tests.slice(0,3).every(t=>t.passed)).toBe(true);expect(resultado.tests[3].passed).toBe(false);
});
it('restringir indevidamente os formatos de Number é detectado',async()=>{
 const resultado=await evaluatePractice(id,'function dobroTexto(t){const n=Number(t);if(!t.trim()||!Number.isFinite(n)||/^0[xbo]/i.test(t.trim()))throw new Error();return n*2;}');
 expect(resultado.tests[0].passed).toBe(true);expect(resultado.tests[1].passed).toBe(true);expect(resultado.tests[2].passed).toBe(false);
});
it.each([
 'const dobroTexto=t=>{const limpo=t.trim(),n=+limpo;if(limpo===""||!isFinite(n))throw new RangeError("Entrada inválida");return n+n;};',
 'function dobroTexto(t){if(!t.trim()||!Number.isFinite(+t))throw new TypeError("Valor inválido");return 2*(+t);}'
])('aceita conversões equivalentes sem exigir a escrita do gabarito: %s',async codigo=>{expect((await evaluatePractice(id,codigo)).passed).toBe(true);});
it('conversão recebe demonstrações independentes sem substituir o carrinho ou inflar repetições',async()=>{
 const estado=freshAdaptive(),relogio={now:Date.parse('2026-10-13T12:00:00Z'),timeZone:'UTC'};
 for(const atividadeId of ['js-debug-carrinho',id,id]){
  const resultado=await evaluatePractice(atividadeId,getPracticeSolution(atividadeId)!);expect(resultado.passed).toBe(true);
  recordEvidence(estado,{id:'evento-'+estado.eventIds.length,assessmentId:atividadeId,activityId:atividadeId,skillIds:resultado.skillIds,revision:1,passed:resultado.passed,assisted:false,attempts:1,hints:0,kind:'practice'},relogio);
 }
 expect(Object.keys(estado.skills['javascript.conversao'].evidence).sort()).toEqual(['js-debug-carrinho',id].sort());
 expect(skillMastery(estado,'javascript.conversao').practiced).toBe(2);expect(prepareAdaptiveBackup(estado)).toEqual(estado);
});

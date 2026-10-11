import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog} from '../../src/learning/hub-catalog';
import {buildDailySession,freshAdaptive} from '../../src/learning/adaptive';
import html from '../../src/content/deep/html';

describe('HTML: dados enviados e validação que se recupera',()=>{
 it.each(['A\nB\nhtml,css','A\nnull\nhtml,css,sql','null\nnull\nhtml,css'])('recusa uma previsão que altera participação nos dados: %s',async resposta=>{
  const resultado=await evaluatePractice('html-prever-controles',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('presença de disabled');
 });
 it('aceita a previsão completa como raciocínio sem execução do aluno',async()=>{
  const resultado=await evaluatePractice('html-prever-controles','A\nnull\nhtml,css');expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
 });
 it.each(['primeiro','controles'])('recusa %s e conserva as bordas do contrato de coleção',async resposta=>{
  const falha=await evaluatePractice('html-preservar-selecoes',resposta);expect(falha.passed).toBe(false);expect(falha.feedback).toContain('multiplicidade');expect(falha.feedback).not.toContain('dados.getAll');expect((await evaluatePractice('html-preservar-selecoes','colecao')).passed).toBe(true);
 });
 it.each(["' '",'false','null','undefined',"'válido'",'campo.disabled = true'])('não limpa o erro com %s',async resposta=>{
  const falha=await evaluatePractice('html-limpar-validacao',resposta);expect(falha.passed).toBe(false);expect(falha.feedback).toContain('customError');
 });
 it.each(["''",'""'])('aceita a string vazia %s',async resposta=>{expect((await evaluatePractice('html-limpar-validacao',resposta)).passed).toBe(true);});
 it('mantém as duas atividades antigas e exige o conceito para as três novas',()=>{
  const atividades=practicesForLesson('html-dados-formulario');expect(atividades.map(a=>a.id).sort()).toEqual(['html-label-vinculo','html-prever-controles','html-preservar-selecoes','html-ordenar-formulario','html-limpar-validacao'].sort());
  const aula=html.lessons.find(a=>a.id==='html-dados-formulario')!;expect(aula.sections).toHaveLength(6);expect(aula.practices).toHaveLength(2);expect(aula.solution).toContain("getAll('linguagem')");
  for(const id of ['html-prever-controles','html-preservar-selecoes','html-limpar-validacao']){
   const atividade=atividades.find(a=>a.id===id)!;expect(atividade.requiresConcept).toBe(true);expect(getPracticeSolution(id)).toBeTruthy();
   expect(adaptiveCatalog.skills.some(h=>h.id===atividade.skillIds[0])).toBe(true);
  }
  const plano=buildDailySession(freshAdaptive(),{...adaptiveCatalog,preferredLanguage:'html'},{now:Date.parse('2026-10-11T12:00:00Z'),timeZone:'UTC'});expect(plano.items.some(item=>['html-prever-controles','html-preservar-selecoes','html-limpar-validacao'].includes(item.activityId??''))).toBe(false);
 });
});

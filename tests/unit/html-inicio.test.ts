import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {lessons} from '../../src/content/curriculum';

const respostas:Record<string,string|string[]>={
 'html-prever-titulos-documento':'Guia da biblioteca\nCatálogo',
 'html-diagnosticar-idioma':'raiz',
 'html-reconstruir-documento':['tipo','inicio','cabecalho','corpo','fim'],
 'html-escolher-acao-teclado':'botao',
 'html-diagnosticar-regiao-principal':'agrupar',
 'html-reconstruir-hierarquia':['principal','artigo','descricao','fechar-artigo','fechar-principal'],
 'html-prever-validade-email':'false\ntrue\nfalse',
 'html-corrigir-associacao-label':'associar',
 'html-reconstruir-envio-campo':['formulario','rotulo','campo','enviar','fim']
};
for(const [id,resposta] of Object.entries(respostas))it(id+': confere decisão sem alegar execução de HTML do aluno',async()=>{
 const resultado=await evaluatePractice(id,resposta);expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');expect(resultado.feedback).toContain('não houve execução de html');
 expect((await evaluatePractice(id,'outra resposta')).passed).toBe(false);expect(getPracticeSolution(id)).toBeTruthy();
});
for(const aula of ['documento','semantica','formularios'])it(aula+': preserva capítulos e prepara as três pausas',()=>{
 const pausas=practicesForLesson(aula);expect(pausas).toHaveLength(3);expect(pausas.map(p=>p.afterBlock)).toEqual([3,6,8]);expect(pausas.every(p=>p.requiresConcept&&p.language==='html')).toBe(true);
 expect(lessons.find(l=>l.id===aula)!.capitulos).toHaveLength(12);
});
for(const aula of ['documento','semantica','formularios'])for(const pausa of practicesForLesson(aula)){
 for(const opcao of pausa.options??[])if(opcao.id!==respostas[pausa.id])it(pausa.id+': rejeita '+opcao.id,async()=>{
  expect((await evaluatePractice(pausa.id,opcao.id)).passed).toBe(false);
 });
 if(pausa.kind==='order')it(pausa.id+': exige todos os fragmentos e fechamentos na sequência pedida',async()=>{
  const ordem=respostas[pausa.id] as string[];
  for(const incorreta of [ordem.slice(0,-1),[...ordem].reverse(),[ordem[0],...ordem.slice(0,-1)],['extra',...ordem]])expect((await evaluatePractice(pausa.id,incorreta)).passed).toBe(false);
 });
}
it('previsão de validade distingue falta de valor, formato aceito e formato recusado',async()=>{
 for(const incorreta of ['true\ntrue\nfalse','false\ntrue\ntrue','false\nfalse\nfalse'])expect((await evaluatePractice('html-prever-validade-email',incorreta)).passed).toBe(false);
});
it('a montagem real dos fragmentos contém um único doctype antes da raiz',()=>{
 const pausa=practicesForLesson('documento').find(p=>p.id==='html-reconstruir-documento')!;
 const codigo=(respostas[pausa.id] as string[]).map(id=>pausa.lines!.find(l=>l.id===id)!.code).join('\n');
 expect(codigo.match(/<!doctype\s+html\s*>/gi)).toHaveLength(1);
 expect(codigo).toMatch(/^<!doctype\s+html\s*>\s*<html\s/i);
});

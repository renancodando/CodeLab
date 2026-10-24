import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';

const ordem=['metodo','validos','valores','retornar','fechar'];
it.each(['True:0\nFalse:99\n2','False:0\nFalse:0\n2','True:0\nTrue:0\n3','True:0\nFalse:0\n3','True:0\nFalse:0','True:0\nFalse:0\n2\n0'])('rejeita a previsão %s que confunde presença, out ou inclusão',async resposta=>{
 const resultado=await evaluatePractice('cs-colecoes-prever-busca',resposta);expect(resultado.passed).toBe(false);expect(resultado.execution).toBe('not-run');expect(resultado.feedback).toContain('out');
});
it('aceita a previsão com CRLF sem alegar execução C#',async()=>{
 const resultado=await evaluatePractice('cs-colecoes-prever-busca','True:0\r\nFalse:0\r\n2');expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
});
it.each(['adiar','origem','copiar-tudo'])('rejeita %s por quebrar tipo, filtro ou independência',async resposta=>{
 const resultado=await evaluatePractice('cs-colecoes-materializar-filtro',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('Add');expect(resultado.feedback).not.toContain('ToList');
});
it('materializar o filtro é decisão conceitual, sem execução do aluno',async()=>{
 const resultado=await evaluatePractice('cs-colecoes-materializar-filtro','copiar');expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');expect(resultado.evidence).toBe('conceptual');
});
it.each([ordem,ordem.join('\n')])('aceita a composição por dependências: %j',async resposta=>{
 const resultado=await evaluatePractice('cs-colecoes-reconstruir-total',resposta);expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');
});
it.each([
 ['metodo','validos','retornar','valores','fechar'],
 ['metodo','valores','validos','retornar','fechar'],
 ['metodo','retornar','validos','valores','fechar'],
 ['validos','metodo','valores','retornar','fechar'],
 ['metodo','validos','fechar','valores','retornar'],
 ['metodo','validos','valores','fechar','retornar'],
 ['metodo','validos','valores','retornar','retornar'],
 ['metodo','validos','valores','retornar','outra'],
 ordem.slice(0,4),[...ordem,'fechar'],[],[...ordem].reverse()
])('rejeita leitura antecipada, fechamento incorreto e peças inválidas: %j',async(...linhas)=>{
 const resultado=await evaluatePractice('cs-colecoes-reconstruir-total',linhas);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('filtrados');expect(resultado.evidence).toBe('conceptual');
});
it('preserva exemplo, soma de pares, capítulos, tipo de apoio e projeto',()=>{
 const aula=lessons.find(aula=>aula.id==='csharp-colecoes')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);expect(aula.code).toContain('4, 12, 7, 20');expect(aula.code).toContain('n * 2');expect(aula.solution).toContain('n % 2 == 0');expect(aula.solution).toContain('new List<int>().Sum()');
 expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,6,8]);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.language==='csharp')).toBe(true);
 expect(pausas.find(pausa=>pausa.kind==='order')!.code).toContain('class Pedido');
 const projeto=aula.capitulos.find(capitulo=>capitulo.id==='projeto')!.paragrafos.join(' ');for(const trecho of ['relatório de pedidos','agrupar por cliente','revisão manual','início incluído','fim excluído','dotnet build'])expect(projeto).toContain(trecho);
 for(const pausa of pausas)expect(getPracticeSolution(pausa.id)).toBeTruthy();
});

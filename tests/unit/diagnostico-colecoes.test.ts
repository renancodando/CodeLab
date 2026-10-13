import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {evaluate} from '../../src/execution/evaluate';
import {lessons} from '../../src/content/curriculum';

const respostas:Record<string,string>={
 'erros-prever-area':'7\n12','erros-localizar-interrupcao':'execucao',
 'investigar-prever-padrao':'8\n-6\n2','investigar-isolar-fronteira':'isolar',
 'colecoes-prever-unidades':'4\n3','colecoes-diagnosticar-limite':'menor'
};
for(const [id,resposta] of Object.entries(respostas))it(id+': escolha conceitual distingue resposta errada sem alegar execução',async()=>{
 const resultado=await evaluatePractice(id,resposta);expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
 expect((await evaluatePractice(id,'outra resposta')).passed).toBe(false);
});
for(const aula of ['tipos-erros','investigar','colecoes'])it(aula+': capítulos preservados e previsões conferidas no interpretador',async()=>{
 const pausas=practicesForLesson(aula);expect(pausas).toHaveLength(3);expect(pausas.map(p=>p.afterBlock)).toEqual([3,6,8]);expect(pausas.every(p=>p.requiresConcept)).toBe(true);
 expect(lessons.find(l=>l.id===aula)!.capitulos).toHaveLength(12);
 const execucao=await evaluate(pausas[0].code!,'laboratorio');expect(execucao.error).toBeUndefined();expect(execucao.logs.join('\n')).toBe(respostas[pausas[0].id]);
 const defeito=await evaluatePractice(pausas[2].id,pausas[2].code!);expect(defeito.passed).toBe(false);expect(defeito.evidence).toBe('executed');expect(defeito.execution).toBe('quickjs');
 const correto=await evaluatePractice(pausas[2].id,getPracticeSolution(pausas[2].id)!);expect(correto.passed).toBe(true);expect(correto.tests).toHaveLength(4);
});
it('classificação diferencia falha de análise, interrupção e cálculo incorreto com programas reais',async()=>{
 const interrompido=await evaluate(practicesForLesson('tipos-erros')[1].code!,'laboratorio');expect(interrompido.logs).toEqual(['Antes']);expect(interrompido.error).toContain('ReferenceError');
 const sintaxe=await evaluate('console.log("Antes"); console.log("sem fechamento);','laboratorio');expect(sintaxe.logs).toEqual([]);expect(sintaxe.error).toContain('SyntaxError');
 const logica=await evaluate('console.log(4+3);','laboratorio');expect(logica.logs).toEqual(['7']);expect(logica.error).toBeUndefined();
 for(const resposta of ['sintaxe','logica'])expect((await evaluatePractice('erros-localizar-interrupcao',resposta)).passed).toBe(false);
});
it.each([
 'function area(b,h){return b+h;}',
 'function area(b,h){return 2*(b+h);}',
 'function area(){return 12;}',
 'function area(b,h){return String(b*h);}',
 'function area(b,h){return (b||1)*h;}',
 'function area(b,h){return Math.round(b*h);}',
 'function area(b,h){console.log(b*h);}',
 'let soma=0; function area(b,h){soma+=b*h;return soma;}'
])('área rejeita cálculo, tipo, fronteira ou estado incorreto: %s',async codigo=>{
 expect((await evaluatePractice('erros-corrigir-area',codigo)).passed).toBe(false);
});
it('área aceita nomes e forma equivalentes, mas o acerto de um exemplo não basta',async()=>{
 expect((await evaluatePractice('erros-corrigir-area','const area=(largura,comprimento)=>comprimento*largura;')).passed).toBe(true);
 const incompleto=await evaluatePractice('erros-corrigir-area','function area(b,h){return b===4?12:b===2?10:9;}');expect(incompleto.tests[0].passed).toBe(true);expect(incompleto.tests[1].passed).toBe(false);
 expect(incompleto.feedback).toContain('zero');expect(incompleto.feedback).not.toContain('return base * altura');
});
it.each([
 'function dobro(v){return (v||1)*2;}',
 'function dobro(v){return Math.abs(v)*2;}',
 'function dobro(v){return Math.round(v*2);}',
 'function dobro(){return 8;}',
 'function dobro(v){return String(v*2);}',
 'function dobro(v){console.log(v*2);}',
 'let anterior=0;function dobro(v){anterior+=v*2;return anterior;}'
])('regressão recusa correção que perde parte do contrato: %s',async codigo=>{
 expect((await evaluatePractice('investigar-corrigir-dobro',codigo)).passed).toBe(false);
});
it('investigação aceita soma equivalente e demonstra o contraexemplo após casos comuns aprovados',async()=>{
 expect((await evaluatePractice('investigar-corrigir-dobro','const dobro=numero=>numero+numero;')).passed).toBe(true);
 const inicial=await evaluatePractice('investigar-corrigir-dobro',practicesForLesson('investigar')[2].code!);expect(inicial.tests[0].passed).toBe(true);expect(inicial.tests[1].passed).toBe(false);expect(inicial.feedback).toContain('Zero');
 for(const escolha of ['tipo','ignorar'])expect((await evaluatePractice('investigar-isolar-fronteira',escolha)).passed).toBe(false);
});
it('limite da coleção visita todos os registros e evita acessar posição ausente',async()=>{
 const prefixo='const itens=[{quantidade:2},{quantidade:3}];let total=0;';
 const quebrado=await evaluate(prefixo+'for(let i=0;i<=itens.length;i++)total+=itens[i].quantidade;','laboratorio');expect(quebrado.error).toContain('TypeError');
 const certo=await evaluate(prefixo+'for(let i=0;i<itens.length;i++)total+=itens[i].quantidade;console.log(total);','laboratorio');expect(certo.logs).toEqual(['5']);expect(certo.error).toBeUndefined();
 const vazio=await evaluate('const itens=[];let total=0;for(let i=0;i<itens.length;i++)total+=itens[i].quantidade;console.log(total);','laboratorio');expect(vazio.logs).toEqual(['0']);
 for(const escolha of ['ultimo-fora','igual'])expect((await evaluatePractice('colecoes-diagnosticar-limite',escolha)).passed).toBe(false);
});
it.each([
 'function totalEstoque(itens){return itens.length;}',
 'function totalEstoque(itens){return itens.reduce((soma,item)=>soma+item.quantidade);}',
 'function totalEstoque(itens){return [...new Set(itens.map(i=>i.quantidade))].reduce((s,q)=>s+q,0);}',
 'function totalEstoque(itens){return itens.slice(0,-1).reduce((s,i)=>s+i.quantidade,0);}',
 'function totalEstoque(itens){return 4;}',
 'function totalEstoque(itens){return String(itens.reduce((s,i)=>s+i.quantidade,0));}',
 'function totalEstoque(itens){return itens.sort((a,b)=>a.nome.localeCompare(b.nome)).reduce((s,i)=>s+i.quantidade,0);}',
 'function totalEstoque(itens){let soma=0;while(itens.length)soma+=itens.shift().quantidade;return soma;}',
 'function totalEstoque(itens){let soma=0;for(const item of itens){soma+=item.quantidade;item.quantidade=0;}return soma;}',
 'let soma=0;function totalEstoque(itens){for(const i of itens)soma+=i.quantidade;return soma;}'
])('estoque rejeita perda de contribuição, mutação ou estado: %s',async codigo=>{
 expect((await evaluatePractice('colecoes-corrigir-acumulacao',codigo)).passed).toBe(false);
});
it('estoque aceita reduce e uma cópia ordenada, mas detecta a mutação mesmo com totais corretos',async()=>{
 for(const codigo of ['const totalEstoque=itens=>itens.reduce((soma,{quantidade})=>soma+quantidade,0);','function totalEstoque(itens){return [...itens].sort((a,b)=>a.quantidade-b.quantidade).reduce((s,i)=>s+i.quantidade,0);}'])expect((await evaluatePractice('colecoes-corrigir-acumulacao',codigo)).passed).toBe(true);
 const mutante=await evaluatePractice('colecoes-corrigir-acumulacao','function totalEstoque(itens){const total=itens.reduce((s,i)=>s+i.quantidade,0);itens.reverse();return total;}');expect(mutante.tests.slice(0,3).every(t=>t.passed)).toBe(true);expect(mutante.tests[3].passed).toBe(false);expect(mutante.feedback).toContain('objetos originais');
});

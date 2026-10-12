import {it,expect} from 'vitest';
import {evaluatePractice} from '../../src/learning/practice';
const id='py-preservar-primeira-ordem';
it.each([
 'valor not in vistos','not (valor in vistos)','not(valor in vistos)',
 'not valor in vistos','valor  not  in  vistos','valor not in (vistos)',
 '(valor) not in ((vistos))','not ((valor) in (vistos))',
 '((valor not in vistos))','not not not valor in vistos',
 'not(valor) in vistos','valor\tnot\tin\tvistos'
])('aceita a condição equivalente de ausência %s',async resposta=>{
 const resultado=await evaluatePractice(id,resposta);
 expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
});
it.each([
 'valor in vistos','not not valor in vistos','not (valor not in vistos)',
 'vistos not in valor','valor not in resultado','not valor',
 'valor not in (vistos,)','valor not in vistos or True',
 'valor notin vistos','notvalor in vistos','valornot in vistos',
 '(valor not in vistos','valor not in vistos)',
 'valor not in vistos: executar()','__import__("os")','ausente',
 'valor\nnot in vistos'
])('rejeita outra expressão ou sintaxe incompleta %s',async resposta=>{
 const resultado=await evaluatePractice(id,resposta);expect(resultado.passed).toBe(false);expect(resultado.execution).toBe('not-run');
});
it('limita reconhecimento sem recursão ou execução arbitrária',async()=>{
 const resposta='('.repeat(200)+'valor not in vistos'+')'.repeat(200);
 expect((await evaluatePractice(id,resposta)).passed).toBe(false);
});

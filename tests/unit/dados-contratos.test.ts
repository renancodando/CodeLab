import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {lessons} from '../../src/content/curriculum';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {evaluate} from '../../src/execution/evaluate';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

const aulas=['array-metodos','objetos-modulos','erros-json'];
it.each(['metodos-somar-pares','json-validar-nome'])('%s exige produção a partir da assinatura vazia, sem algoritmo entregue',async id=>{
 const pausa=aulas.flatMap(practicesForLesson).find(p=>p.id===id)!;
 expect(pausa.capability).toBe('producao');expect(pausa.assinaturaVazia).toBe(true);expect(pausa.code).toMatch(/^function \w+\(\w+\) \{\s*\}$/);
 expect((await evaluatePractice(id,pausa.code!)).passed).toBe(false);
});
it.each(aulas)('%s conserva seus capítulos, projeto e três pausas ligadas à preparação',aula=>{
 const pausas=practicesForLesson(aula);expect(pausas).toHaveLength(3);expect(pausas.map(p=>p.afterBlock)).toEqual([3,6,8]);
 const original=lessons.find(a=>a.id===aula)!;expect(original.capitulos).toHaveLength(12);
 const projetos:Record<string,string>={'array-metodos':'Construa um resumo de compras','objetos-modulos':'Separe um pequeno app de tarefas','erros-json':'Crie um importador de configurações'};
 expect(original.capitulos.find(c=>c.id==='projeto')?.paragrafos.join(' ')).toContain(projetos[aula]);
 const estado=freshAdaptive(),preparacao=idPreparacao(aula);
 estado.seenConcepts=adaptiveCatalog.activities.filter(a=>a.kind==='concept'&&a.id!==preparacao).map(a=>a.id);
 expect(buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'javascript'},{now:Date.parse('2026-10-13T12:00:00Z'),timeZone:'UTC'}).items.map(i=>i.activityId)).toEqual([preparacao,...pausas.map(p=>p.id)]);
 expect(estado.skills).toEqual({});
});
it.each([
 ['metodos-prever-transformacao','2,4\n4,8\n6'],
 ['objetos-prever-compartilhamento','Lia\nNatal\nfalse\ntrue'],
 ['json-prever-falha','Antes\nSyntaxError\nDepois']
])('a previsão %s corresponde à execução do programa de referência',async(id,resposta)=>{
 const pausa=aulas.flatMap(practicesForLesson).find(p=>p.id===id)!;
 const execucao=await evaluate(pausa.code!,'laboratorio');expect(execucao.error).toBeUndefined();expect(execucao.logs.join('\n')).toBe(resposta);
 const resultado=await evaluatePractice(id,resposta);expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
 expect((await evaluatePractice(id,'resultado fixo')).passed).toBe(false);
});
it.each([
 ['metodos-devolver-predicado','devolver',['mapear','indice'],'2'],
 ['objetos-diagnosticar-padrao','ausencia',['falso','repetir'],'5'],
 ['json-identificar-contrato','estrutura',['sintaxe','garantia'],'true object']
] as const)('a decisão %s não confunde escolha conceitual com execução',async(id,certa,erradas,saida)=>{
 for(const errada of erradas)expect((await evaluatePractice(id,errada)).passed).toBe(false);
 const resultado=await evaluatePractice(id,certa);expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');
 const referencia=await evaluate(getPracticeSolution(id)!,'laboratorio');expect(referencia.error).toBeUndefined();expect(referencia.logs).toEqual([saida]);
});
it.each(['metodos-somar-pares','objetos-atualizar-endereco','json-validar-nome'])('%s executa o gabarito nas famílias de comportamento',async id=>{
 const resultado=await evaluatePractice(id,getPracticeSolution(id)!);expect(resultado.passed,resultado.feedback).toBe(true);expect(resultado.tests).toHaveLength(id==='objetos-atualizar-endereco'?5:4);expect(resultado.execution).toBe('quickjs');expect(resultado.evidence).toBe('executed');
});
it.each([
 'function somarPares(v){return 6;}',
 'function somarPares(v){return v.filter(n=>n%2===0).reduce((s,n)=>s+n);}',
 'function somarPares(v){return v.filter(n=>n%2===0&&n>=0).reduce((s,n)=>s+n,0);}',
 'function somarPares(v){return v.filter(n=>n%2).reduce((s,n)=>s+n,0);}',
 'function somarPares(v){return v.reduce((s,n)=>s+n,0);}',
 'function somarPares(v){return v.filter(n=>n%2===0).length;}',
 'function somarPares(v){v.reverse();return v.reduce((s,n)=>n%2===0?s+n:s,0);}',
 'let total=0;function somarPares(v){for(const n of v)if(n%2===0)total+=n;return total;}',
 'function somarPares(v){return String(v.reduce((s,n)=>n%2===0?s+n:s,0));}'
])('a soma rejeita uma solução que quebra o contrato: %s',async codigo=>{expect((await evaluatePractice('metodos-somar-pares',codigo)).passed).toBe(false);});
it('inverter duas vezes não esconde a mutação depois da primeira chamada',async()=>{
 const resultado=await evaluatePractice('metodos-somar-pares','function somarPares(v){v.reverse();return v.reduce((s,n)=>n%2===0?s+n:s,0);}');
 expect(resultado.tests.slice(0,3).every(t=>t.passed)).toBe(true);expect(resultado.tests[3].passed).toBe(false);
});
it.each([
 'function mudarCidade(p,c){p.endereco.cidade=c;return p;}',
 'function mudarCidade(p,c){const r={...p};r.endereco.cidade=c;return r;}',
 'function mudarCidade(p,c){return {nome:p.nome,endereco:{cidade:c}};}',
 'function mudarCidade(p,c){return {...p,endereco:{...p.endereco,cidade:c||p.endereco.cidade}};}',
 'function mudarCidade(p,c){if(c===p.endereco.cidade)return p;return {...p,endereco:{...p.endereco,cidade:c}};}',
 'const endereco={};function mudarCidade(p,c){Object.assign(endereco,p.endereco,{cidade:c});return {...p,endereco};}'
])('a atualização rejeita perda de campos ou compartilhamento indevido: %s',async codigo=>{expect((await evaluatePractice('objetos-atualizar-endereco',codigo)).passed).toBe(false);});
it('a cópia que preserva só campos conhecidos falha nos campos extras variáveis',async()=>{
 const resultado=await evaluatePractice('objetos-atualizar-endereco','function mudarCidade(p,c){return {nome:p.nome,...("ativo" in p?{ativo:p.ativo}:{}),endereco:{cidade:c,...("cep" in p.endereco?{cep:p.endereco.cep}:{}),...("numero" in p.endereco?{numero:p.endereco.numero}:{}),...("referencia" in p.endereco?{referencia:p.endereco.referencia}:{})}};}');
 expect(resultado.tests.slice(0,2).every(t=>t.passed)).toBe(true);expect(resultado.tests[2].passed).toBe(false);
});
it.each([
 'function lerNome(t){return "Lia";}',
 'function lerNome(t){return String(JSON.parse(t).nome);}',
 'function lerNome(t){return JSON.parse(t).nome;}',
 'function lerNome(t){try{const d=JSON.parse(t);if(!d||typeof d.nome!=="string")return null;return d.nome;}catch{return null;}}',
 'function lerNome(t){const d=JSON.parse(t);if(!d||typeof d.nome!=="string")throw "Inválido";return d.nome;}',
 'function lerNome(t){const d=JSON.parse(t);if(!d||typeof d.nome!=="string")throw new Error();return d.nome.trim();}',
 'function lerNome(t){const d=JSON.parse(t);if(!d||typeof d.nome!=="string"||!d.nome)throw new Error();return d.nome;}'
])('a leitura rejeita falsos sucessos e normalização fora do contrato: %s',async codigo=>{expect((await evaluatePractice('json-validar-nome',codigo)).passed).toBe(false);});
it.each([
 ['metodos-somar-pares','function somarPares(v){let soma=0;for(const n of v)if(n%2===0)soma+=n;return soma;}'],
 ['objetos-atualizar-endereco','function mudarCidade(p,c){return Object.assign({},p,{endereco:Object.assign({},p.endereco,{cidade:c})});}'],
 ['objetos-atualizar-endereco','function mudarCidade(p,c){const r=JSON.parse(JSON.stringify(p));r.endereco.cidade=c;return r;}'],
 ['json-validar-nome','function lerNome(t){const d=JSON.parse(t);if(d&&typeof d==="object"&&!Array.isArray(d)&&typeof d.nome==="string")return d.nome;throw new TypeError("Nome inválido");}']
])('%s aceita escrita equivalente ao gabarito',async(id,codigo)=>{const resultado=await evaluatePractice(id,codigo);expect(resultado.passed,resultado.feedback).toBe(true);});

import {beforeAll,it,expect} from 'vitest';
import iniciarSql from 'sql.js';
import type {SqlJsStatic} from 'sql.js';
import {practiceActivities,practicesForLesson} from '../../src/content/practice';
import {lessons} from '../../src/content/curriculum';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
let SQL:SqlJsStatic;
beforeAll(async()=>{SQL=await iniciarSql();});
const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
const idConsulta='sql-transacao-auditar-lancamentos',solucao=getPracticeSolution(idConsulta)!;
const criarContas='CREATE TABLE contas(id INTEGER PRIMARY KEY,saldo INTEGER NOT NULL CHECK(saldo>=0));';

it('executa o limite entre a transação confirmada e a desfeita',async()=>{
 const banco=new SQL.Database();try{const linhas=banco.exec(atividade('sql-transacao-prever-limite').code!).at(-1)!.values;expect(linhas).toEqual([[1,800],[2,700]]);expect(linhas.map(linha=>linha.join('|')).join('\n')).toBe(getPracticeSolution('sql-transacao-prever-limite'));}finally{banco.close();}
 expect(await evaluatePractice('sql-transacao-prever-limite','1|800\r\n2|700')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each(['1|1000\n2|500','1|700\n2|800','1|800\n2|500'])('recusa desfazer o commit anterior ou preservar apenas metade: %s',async resposta=>{
 const resultado=await evaluatePractice('sql-transacao-prever-limite',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('primeiro COMMIT');
});
it.each(['sem-excecao','so-debito','nao-negativo'])('recusa confirmar por política incompleta: %s',async resposta=>{
 const resultado=await evaluatePractice('sql-transacao-diagnosticar-ausencia',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('zero linhas');expect(resultado.feedback).not.toContain('ROLLBACK');
});
it('registra o diagnóstico correto como conceitual, sem fingir execução do controlador',async()=>{
 expect(await evaluatePractice('sql-transacao-diagnosticar-ausencia','duas-linhas')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('as políticas executadas distinguem sucesso, destino ausente, origem ausente e saldo insuficiente',()=>{
 const bases=[[[1,1000],[2,500]],[[1,1000]],[[2,500]],[[1,100],[2,500]],[[1,0],[2,500]]];
 for(const opcao of atividade('sql-transacao-diagnosticar-ausencia').options!){
  let aprovouTodas=true;const etapas=atividade('sql-transacao-diagnosticar-ausencia').code!.split('\n');
  for(const dados of bases){
   const banco=new SQL.Database();try{
    banco.run(criarContas);for(const [id,saldo] of dados)banco.run('INSERT INTO contas VALUES(?,?);',[id,saldo]);
    banco.run(etapas[0]+etapas[1]);const debitos=banco.getRowsModified();
    banco.run(etapas[2].replace('id=99','id=2'));const creditos=banco.getRowsModified();
    const confirmar=opcao.id==='duas-linhas'?debitos===1&&creditos===1:opcao.id==='so-debito'?debitos===1:opcao.id==='nao-negativo'?banco.exec('SELECT COUNT(*) FROM contas WHERE saldo<0;')[0].values[0][0]===0:true;
    banco.run(confirmar?'COMMIT;':'ROLLBACK;');const linhas=banco.exec('SELECT id,saldo FROM contas ORDER BY id;')[0].values;
    const esperado=dados.length===2&&dados[0][1]>=200?[[1,800],[2,700]]:dados;
    if(JSON.stringify(linhas)!==JSON.stringify(esperado))aprovouTodas=false;
   }finally{banco.close();}
  }
  expect(aprovouTodas,opcao.id).toBe(opcao.id==='duas-linhas');
 }
});
it('em SQLite, falha CHECK padrão desfaz a instrução, mas requer rollback explícito da transação',()=>{
 for(const recuperar of [true,false]){
  const banco=new SQL.Database();try{
   banco.run(criarContas+'INSERT INTO contas VALUES(1,1000),(2,500); BEGIN; UPDATE contas SET saldo=saldo-200 WHERE id=1;');
   expect(()=>banco.run('UPDATE contas SET saldo=saldo-1000 WHERE id=2;')).toThrow(/CHECK/);
   expect(banco.exec('SELECT saldo FROM contas ORDER BY id;')[0].values).toEqual([[800],[500]]);
   banco.run(recuperar?'ROLLBACK;':'COMMIT;');expect(banco.exec('SELECT saldo FROM contas ORDER BY id;')[0].values).toEqual(recuperar?[[1000],[500]]:[[800],[500]]);
  }finally{banco.close();}
 }
});
it('a auditoria de referência executa cinco bases e mantém cabeçalhos no vazio',async()=>{
 const resultado=await evaluatePractice(idConsulta,solucao);expect(resultado).toMatchObject({passed:true,evidence:'executed',execution:'sqlite'});expect(resultado.tests).toHaveLength(5);expect(resultado.tests.every(teste=>teste.passed)).toBe(true);
});
it.each([
 solucao.replace('COUNT(*)','COUNT(1)'),
 solucao.replace('SUM(delta_centavos)<>0 OR COUNT(*)<>2 OR COUNT(DISTINCT conta_id)<>2','NOT (SUM(delta_centavos)=0 AND COUNT(*)=2 AND COUNT(DISTINCT conta_id)=2)'),
 'WITH grupos AS (SELECT transferencia_id,SUM(delta_centavos) AS total_centavos,COUNT(*) AS linhas,COUNT(DISTINCT conta_id) AS contas FROM lancamentos GROUP BY transferencia_id) SELECT transferencia_id,total_centavos FROM grupos WHERE total_centavos<>0 OR linhas<>2 OR contas<>2 ORDER BY transferencia_id;'
])('aceita uma auditoria equivalente: %s',async consulta=>{expect((await evaluatePractice(idConsulta,consulta)).passed).toBe(true);});
it.each([
 atividade(idConsulta).code!,
 solucao.replace('SUM(delta_centavos)<>0 OR ',''),
 solucao.replaceAll(' OR ',' AND '),
 solucao.replace(' OR COUNT(DISTINCT conta_id)<>2',''),
 solucao.replace('SUM(delta_centavos)<>0','SUM(delta_centavos)=0'),
 solucao.replace('SUM(delta_centavos) AS total_centavos','0 AS total_centavos'),
 solucao.replace('ORDER BY transferencia_id','ORDER BY transferencia_id DESC'),
 'SELECT 20 AS transferencia_id,-100 AS total_centavos;'
])('rejeita auditoria incompleta, total fixo ou ordem errada: %s',async consulta=>{
 const resultado=await evaluatePractice(idConsulta,consulta);expect(resultado.status).toBe('evaluated');expect(resultado.passed).toBe(false);expect(resultado.tests.some(teste=>!teste.passed)).toBe(true);
});
it('a tentativa inicial passa no caso visível e revela a duplicação sem entregar o predicado',async()=>{
 const resultado=await evaluatePractice(idConsulta,atividade(idConsulta).code!);expect(resultado.tests.map(teste=>teste.passed)).toEqual([true,false]);expect(resultado.feedback).toContain('lançamentos demais');expect(resultado.feedback).not.toContain('COUNT(*)');
});
it('contas iguais são uma borda distinta da quantidade de lançamentos',async()=>{
 const resultado=await evaluatePractice(idConsulta,solucao.replace(' OR COUNT(DISTINCT conta_id)<>2',''));expect(resultado.tests.map(teste=>teste.passed)).toEqual([true,true,false]);expect(resultado.feedback).toContain('contas distintas');
});
it('mantém a aula original e distingue previsão, diagnóstico e consulta executada',()=>{
 const aula=lessons.find(item=>item.id==='sql-transacao')!;expect(aula.code).toContain('COMMIT;');expect(aula.exercise).toContain('ROLLBACK');const pausas=practicesForLesson('sql-transacao');expect(pausas).toHaveLength(3);expect(pausas.map(pausa=>pausa.capability)).toEqual(['leitura','depuracao','alteracao']);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(atividade(idConsulta).prompt).toContain('não prova');
});

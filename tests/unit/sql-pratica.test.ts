import {describe,it,expect} from 'vitest';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {practicesForLesson} from '../../src/content/practice';
import {conferirConsultaSql,cenariosSql} from '../../src/learning/pratica-sql';

const contar=getPracticeSolution('sql-depurar-clientes-pagos')!;
const somar=getPracticeSolution('sql-depurar-totais-colecoes')!;
describe('consultas do aluno executadas em SQLite real',()=>{
 it.each(['sql-depurar-clientes-pagos','sql-depurar-totais-colecoes'])('%s executa quatro bases e produz evidência real',async id=>{
  const resposta=await evaluatePractice(id,getPracticeSolution(id)!);
  expect(resposta.status).toBe('evaluated');expect(resposta.passed).toBe(true);expect(resposta.tests).toHaveLength(4);expect(resposta.tests.every(teste=>teste.passed)).toBe(true);expect(resposta.execution).toBe('sqlite');expect(resposta.evidence).toBe('executed');expect(resposta.feedback).toContain('não valida recursos específicos de PostgreSQL');
 });
 it.each([
  contar.replace(" AND p.status='pago'",'').replace('GROUP BY',"WHERE p.status='pago' GROUP BY"),
  contar.replace('count(p.id)','count(*)'),
  contar.replace('LEFT JOIN','JOIN'),
  contar.replace(" AND p.status='pago'",''),
  'SELECT 1 AS cliente_id,1 AS pagos UNION ALL SELECT 2,0 UNION ALL SELECT 3,0;'
 ])('detecta perda de cliente, contagem indevida ou saída fixa: %s',async consulta=>{
  const resposta=await evaluatePractice('sql-depurar-clientes-pagos',consulta);expect(resposta.passed).toBe(false);expect(resposta.status).toBe('evaluated');expect(resposta.execution).toBe('sqlite');expect(resposta.tests.some(teste=>!teste.passed)).toBe(true);expect(resposta.feedback).not.toContain('GROUP BY');
 });
 it.each([
  somar.replaceAll('LEFT JOIN','JOIN'),
  somar.replace('coalesce(i.total,0)','i.total').replace('coalesce(pg.total,0)','pg.total'),
  'SELECT 7 AS pedido_id,20 AS itens,12 AS pagamentos;',
  'SELECT p.id AS pedido_id,coalesce(sum(i.centavos),0) AS itens,coalesce(sum(pg.centavos),0) AS pagamentos FROM pedidos p LEFT JOIN itens i ON i.pedido_id=p.id LEFT JOIN pagamentos pg ON pg.pedido_id=p.id GROUP BY p.id ORDER BY p.id;',
  'SELECT p.id AS pedido_id,coalesce(sum(DISTINCT i.centavos),0) AS itens,coalesce(sum(DISTINCT pg.centavos),0) AS pagamentos FROM pedidos p LEFT JOIN itens i ON i.pedido_id=p.id LEFT JOIN pagamentos pg ON pg.pedido_id=p.id GROUP BY p.id ORDER BY p.id;'
 ])('detecta perda, NULL, constantes, fanout ou deduplicação: %s',async consulta=>{
  const resposta=await evaluatePractice('sql-depurar-totais-colecoes',consulta);expect(resposta.passed).toBe(false);expect(resposta.tests.some(teste=>!teste.passed)).toBe(true);expect(resposta.feedback).not.toContain('WITH totais_itens');
 });
 it('aceita subconsultas correlacionadas sem exigir o texto do gabarito',async()=>{
  const alternativa='SELECT p.id AS pedido_id,coalesce((SELECT sum(i.centavos) FROM itens i WHERE i.pedido_id=p.id),0) AS itens,coalesce((SELECT sum(pg.centavos) FROM pagamentos pg WHERE pg.pedido_id=p.id),0) AS pagamentos FROM pedidos p ORDER BY p.id;';
  expect((await evaluatePractice('sql-depurar-totais-colecoes',alternativa)).passed).toBe(true);
 });
 it('aceita aliases em maiúsculas e números inteiros sem perder a comparação BigInt',async()=>{
  expect((await evaluatePractice('sql-depurar-clientes-pagos',contar.replace('AS cliente_id','AS CLIENTE_ID').replace('AS pagos','AS PAGOS'))).passed).toBe(true);
 });
 it.each([contar.replace('AS pagos','AS quantidade'),contar+' SELECT 1;',contar.replace('ORDER BY c.id','ORDER BY c.id DESC'),contar.replace('count(p.id)',"CAST(count(p.id) AS TEXT)")])('cabeçalhos, resultados extras, ordem e tipos integram o contrato: %s',async consulta=>{
  expect((await evaluatePractice('sql-depurar-clientes-pagos',consulta)).passed).toBe(false);
 });
 it('informa que o caso comum passou e outra base falhou sem entregar a consulta',async()=>{
  const resposta=await evaluatePractice('sql-depurar-clientes-pagos',contar.replace('GROUP BY c.id','GROUP BY c.id HAVING c.id<=3'));
  expect(resposta.tests.map(teste=>teste.passed)).toEqual([true,false]);expect(resposta.feedback).toContain('outras chaves');expect(resposta.feedback).not.toContain('SELECT c.id');
 });
 it('um erro de sintaxe é erro avaliado, sem confundir com carregamento',async()=>{
  const resposta=await evaluatePractice('sql-depurar-clientes-pagos','SELECT FROM;');expect(resposta.status).toBe('evaluated');expect(resposta.passed).toBe(false);expect(resposta.execution).toBe('sqlite');expect(resposta.feedback).toContain('syntax error');
  expect((await evaluatePractice('sql-depurar-clientes-pagos',contar)).passed).toBe(true);
 });
 it('cancelamento anterior não abre um banco nem registra erro de consulta',async()=>{
  const controle=new AbortController();controle.abort();expect((await evaluatePractice('sql-depurar-clientes-pagos',contar,controle.signal)).status).toBe('cancelled');
  let chamadas=0;await expect(conferirConsultaSql('sql-depurar-clientes-pagos',contar,async()=>{chamadas++;return {comandos:0,tabelas:[]};},controle.signal)).rejects.toThrow('cancelada');expect(chamadas).toBe(0);
 });
 it('não transforma atividade inexistente em aprovação vazia',async()=>{
  await expect(conferirConsultaSql('inexistente','SELECT 1;',async()=>({comandos:0,tabelas:[]}))).rejects.toThrow('indisponível');
 });
 it('mantém a previsão existente e prepara as duas habilidades de depuração',()=>{
  const pausas=practicesForLesson('sql-joins-cardinalidade');expect(pausas.map(pausa=>pausa.id)).toContain('sql-prever-fanout');
  const novas=pausas.filter(pausa=>pausa.id in cenariosSql);expect(novas.map(pausa=>pausa.afterBlock)).toEqual([3,5]);expect(novas.every(pausa=>pausa.requiresConcept)).toBe(true);expect(new Set(novas.flatMap(pausa=>pausa.skillIds)).size).toBe(2);
 });
});

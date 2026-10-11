import {beforeAll,describe,it,expect} from 'vitest';
import iniciarSql from 'sql.js';
import type {SqlJsStatic} from 'sql.js';
import {executarConsultaSql} from '../../src/execution/motor-sql';
let SQL:SqlJsStatic;
beforeAll(async()=>{SQL=await iniciarSql();});
const consultar=(codigo:string)=>executarConsultaSql(SQL,codigo);
const linhas=(codigo:string)=>consultar(codigo).tabelas.at(-1)!.linhas;

describe('SQLite real em banco descartável',()=>{
 it('cria dados, faz join e agrega depois de alterar e apagar',()=>{
  expect(linhas(`CREATE TABLE clientes(id INTEGER PRIMARY KEY,nome TEXT); CREATE TABLE pedidos(cliente INTEGER REFERENCES clientes(id),centavos INTEGER CHECK(centavos>=0));
   INSERT INTO clientes VALUES(1,'Ana'),(2,'Bia'); INSERT INTO pedidos VALUES(1,2995),(1,3000),(2,500);
   UPDATE pedidos SET centavos=3005 WHERE centavos=2995; DELETE FROM pedidos WHERE cliente=2;
   SELECT c.nome,SUM(p.centavos) AS total FROM clientes c JOIN pedidos p ON p.cliente=c.id GROUP BY c.id;`)).toEqual([['Ana',6005n]]);
 });
 it('commit e rollback realmente alteram quais linhas sobrevivem',()=>{
  expect(linhas('CREATE TABLE valores(n INTEGER); BEGIN; INSERT INTO valores VALUES(1); ROLLBACK; BEGIN; INSERT INTO valores VALUES(2); COMMIT; SELECT n FROM valores;')).toEqual([[2n]]);
 });
 it('uma execução não conserva o banco anterior',()=>{
  consultar('CREATE TABLE segredo(n); INSERT INTO segredo VALUES(42);');
  expect(()=>consultar('SELECT * FROM segredo;')).toThrow('no such table');
 });
 it('conserva os cabeçalhos quando a consulta não encontra linhas',()=>{
  expect(consultar('SELECT 7 AS numero WHERE 0;').tabelas).toEqual([{comando:1,colunas:['numero'],linhas:[]}]);
 });
 it('conserva inteiros de 64 bits, real, nulo, texto e tamanho binário',()=>{
  expect(linhas("SELECT 9223372036854775807, -9223372036854775808, 1.25, NULL, 'NULL', '<img src=x>', x'0102';")).toEqual([[9223372036854775807n,-9223372036854775808n,1.25,null,'NULL','<img src=x>',{bytes:2}]]);
 });
 it('usa o parser SQL para triggers e ponto e vírgula em texto',()=>{
  expect(linhas("CREATE TABLE origem(n); CREATE TABLE historico(texto); CREATE TRIGGER copia AFTER INSERT ON origem BEGIN INSERT INTO historico VALUES('a;b'); INSERT INTO historico VALUES('c'); END; INSERT INTO origem VALUES(1); SELECT texto FROM historico ORDER BY rowid;")).toEqual([['a;b'],['c']]);
 });
 it.each([
  ['SELECT FROM;', 'syntax error'],
  ['CREATE TABLE t(n INTEGER CHECK(n>0)); INSERT INTO t VALUES(-1);','CHECK constraint failed'],
  ['CREATE TABLE pai(id PRIMARY KEY); CREATE TABLE filho(id REFERENCES pai(id)); INSERT INTO filho VALUES(1);','FOREIGN KEY constraint failed'],
  ["SELECT load_extension('arquivo');",'no such function'],
  ["SELECT readfile('arquivo');",'no such function'],
  ["SELECT writefile('arquivo','dados');",'no such function']
 ])('recusa SQL inválido ou função indisponível: %s',(codigo,mensagem)=>{
  expect(()=>consultar(codigo)).toThrow(mensagem);expect(linhas('SELECT 7;')).toEqual([[7n]]);
 });
 it.each([
  ['CREATE TABLE t(n);'+'INSERT INTO t VALUES(1);'.repeat(100),'100 comandos'],
  ['SELECT '+Array.from({length:41},(_,i)=>String(i)).join(',')+';','40 colunas'],
  ['SELECT 1;'.repeat(11),'dez tabelas'],
  ['WITH RECURSIVE numeros(n) AS(VALUES(1) UNION ALL SELECT n+1 FROM numeros WHERE n<101) SELECT n FROM numeros;','100 linhas'],
  ['WITH RECURSIVE numeros(n) AS(VALUES(1) UNION ALL SELECT n+1 FROM numeros WHERE n<100) SELECT '+Array.from({length:11},()=> 'n').join(',')+' FROM numeros;','1.000 valores'],
  ["SELECT '"+'a'.repeat(2001)+"';",'Resultado muito grande'],
  [' '.repeat(30001),'30.000 caracteres']
 ])('recusa entrada ou saída acima do limite',(codigo,mensagem)=>{
  expect(()=>consultar(codigo)).toThrow(mensagem);expect(linhas('SELECT 8;')).toEqual([[8n]]);
 });
 it('limita o alocador SQLite e recupera depois de uma alocação excessiva',()=>{
  expect(linhas('PRAGMA hard_heap_limit=999999999;')).toEqual([[8388608n]]);
  expect(()=>consultar('SELECT zeroblob(20000000);')).toThrow(/memory/i);
  expect(linhas('SELECT 9;')).toEqual([[9n]]);
 });
 it('libera comandos preparados após exceder o resultado',()=>{
  for(let i=0;i<12;i++)expect(()=>consultar('SELECT 1;'.repeat(11))).toThrow('dez tabelas');
  expect(linhas('SELECT 10;')).toEqual([[10n]]);
 });
});

import assert from 'node:assert/strict';
import iniciarSql from '../../work/CodeLab/node_modules/sql.js/dist/sql-wasm.js';

const cenariosContagem=[
 {nome:'pago-aberto-sem-pedido',clientes:[1,2,3],pedidos:[[10,1,'pago'],[11,1,'aberto'],[12,2,'aberto']],esperado:[[1,1],[2,0],[3,0]]},
 {nome:'varios-pagos-e-outras-chaves',clientes:[8,2,15],pedidos:[[1,8,'pago'],[2,8,'pago'],[3,2,'cancelado'],[4,15,'pago']],esperado:[[2,0],[8,2],[15,1]]},
 {nome:'nenhum-pedido',clientes:[4,9],pedidos:[],esperado:[[4,0],[9,0]]},
 {nome:'nenhum-cliente',clientes:[],pedidos:[],esperado:[]}
];
const cenariosTotais=[
 {nome:'valores-iguais-legitimos',pedidos:[7],itens:[[7,10],[7,10]],pagamentos:[[7,5],[7,7]],esperado:[[7,20,12]]},
 {nome:'colecoes-ausentes-e-multiplos-pedidos',pedidos:[4,2,9,6],itens:[[2,120],[2,30],[4,0],[4,20]],pagamentos:[[2,100],[2,25],[6,7]],esperado:[[2,150,125],[4,20,0],[6,0,7],[9,0,0]]},
 {nome:'outras-chaves-e-repeticoes',pedidos:[20,3],itens:[[20,5],[20,5],[20,15],[3,9]],pagamentos:[[20,2],[20,2],[20,6],[3,9],[3,0]],esperado:[[3,9,9],[20,25,10]]},
 {nome:'nenhum-pedido',pedidos:[],itens:[],pagamentos:[],esperado:[]}
];
const contar=`SELECT c.id AS cliente_id, count(p.id) AS pagos
FROM clientes c LEFT JOIN pedidos p ON p.cliente_id=c.id AND p.status='pago'
GROUP BY c.id ORDER BY c.id;`;
const somar=`WITH totais_itens AS (SELECT pedido_id,sum(centavos) AS total FROM itens GROUP BY pedido_id),
totais_pagamentos AS (SELECT pedido_id,sum(centavos) AS total FROM pagamentos GROUP BY pedido_id)
SELECT p.id AS pedido_id,coalesce(i.total,0) AS itens,coalesce(pg.total,0) AS pagamentos
FROM pedidos p LEFT JOIN totais_itens i ON i.pedido_id=p.id
LEFT JOIN totais_pagamentos pg ON pg.pedido_id=p.id ORDER BY p.id;`;
const literal=valor=>typeof valor==='number'?String(valor):"'"+valor.replaceAll("'","''")+"'";
const inserir=(tabela,linhas)=>linhas.length?'INSERT INTO '+tabela+' VALUES '+linhas.map(linha=>'('+linha.map(literal).join(',')+')').join(',')+';':'';
function prepararContagem(caso){return 'CREATE TABLE clientes(id INTEGER PRIMARY KEY); CREATE TABLE pedidos(id INTEGER PRIMARY KEY,cliente_id INTEGER NOT NULL REFERENCES clientes(id),status TEXT NOT NULL);'+inserir('clientes',caso.clientes.map(id=>[id]))+inserir('pedidos',caso.pedidos);}
function prepararTotais(caso){return 'CREATE TABLE pedidos(id INTEGER PRIMARY KEY); CREATE TABLE itens(pedido_id INTEGER NOT NULL REFERENCES pedidos(id),centavos INTEGER NOT NULL CHECK(centavos>=0)); CREATE TABLE pagamentos(pedido_id INTEGER NOT NULL REFERENCES pedidos(id),centavos INTEGER NOT NULL CHECK(centavos>=0));'+inserir('pedidos',caso.pedidos.map(id=>[id]))+inserir('itens',caso.itens)+inserir('pagamentos',caso.pagamentos);}
const SQL=await iniciarSql();let conferidos=0;
function consultar(caso,preparar,consulta){const banco=new SQL.Database();try{banco.run('PRAGMA foreign_keys=ON;'+preparar(caso));return banco.exec(consulta)[0]?.values??[];}finally{banco.close();}}
for(const [casos,preparar,consulta] of [[cenariosContagem,prepararContagem,contar],[cenariosTotais,prepararTotais,somar]])for(const caso of casos){assert.deepEqual(consultar(caso,preparar,consulta),caso.esperado,caso.nome);conferidos++;}
const contagensRuins=[
 contar.replace(" AND p.status='pago'",'').replace('GROUP BY',"WHERE p.status='pago' GROUP BY"),
 contar.replace('count(p.id)','count(*)'),
 contar.replace('LEFT JOIN','JOIN'),
 contar.replace(" AND p.status='pago'",''),
 'SELECT 1 AS cliente_id,1 AS pagos UNION ALL SELECT 2,0 UNION ALL SELECT 3,0;'
];
const somasRuins=[
 `SELECT p.id AS pedido_id,coalesce(sum(i.centavos),0) AS itens,coalesce(sum(pg.centavos),0) AS pagamentos FROM pedidos p LEFT JOIN itens i ON i.pedido_id=p.id LEFT JOIN pagamentos pg ON pg.pedido_id=p.id GROUP BY p.id ORDER BY p.id;`,
 `SELECT p.id AS pedido_id,coalesce(sum(DISTINCT i.centavos),0) AS itens,coalesce(sum(DISTINCT pg.centavos),0) AS pagamentos FROM pedidos p LEFT JOIN itens i ON i.pedido_id=p.id LEFT JOIN pagamentos pg ON pg.pedido_id=p.id GROUP BY p.id ORDER BY p.id;`,
 somar.replaceAll('LEFT JOIN','JOIN'),
 somar.replaceAll('coalesce(i.total,0)','i.total').replaceAll('coalesce(pg.total,0)','pg.total'),
 'SELECT 7 AS pedido_id,20 AS itens,12 AS pagamentos;'
];
for(const [casos,preparar,consultas] of [[cenariosContagem,prepararContagem,contagensRuins],[cenariosTotais,prepararTotais,somasRuins]])for(const consulta of consultas){assert(casos.some(caso=>JSON.stringify(consultar(caso,preparar,consulta))!==JSON.stringify(caso.esperado)),'mutante sobreviveu');conferidos++;}
const alternativa=`SELECT p.id AS pedido_id,coalesce((SELECT sum(i.centavos) FROM itens i WHERE i.pedido_id=p.id),0) AS itens,coalesce((SELECT sum(pg.centavos) FROM pagamentos pg WHERE pg.pedido_id=p.id),0) AS pagamentos FROM pedidos p ORDER BY p.id;`;
for(const caso of cenariosTotais){assert.deepEqual(consultar(caso,prepararTotais,alternativa),caso.esperado,caso.nome);conferidos++;}
console.log(conferidos+' verificações SQLite reais: oito bases, dez consultas incorretas detectadas e alternativa correlacionada aceita. Rascunho isolado; ainda não integrado ao produto.');
export {cenariosContagem,cenariosTotais,contar,somar,prepararContagem,prepararTotais};
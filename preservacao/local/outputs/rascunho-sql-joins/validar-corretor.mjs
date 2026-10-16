import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from '../../work/CodeLab/node_modules/typescript/lib/typescript.js';
import iniciarSql from '../../work/CodeLab/node_modules/sql.js/dist/sql-wasm.js';
import {contar,somar} from './validar.mjs';
const compilar=async caminho=>import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(await readFile(caminho,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText).toString('base64'));
const {executarConsultaSql}=await compilar(new URL('../../work/CodeLab/src/execution/motor-sql.ts',import.meta.url));
const {conferirConsultaSql}=await compilar(new URL('./pratica-sql.ts',import.meta.url));
const SQL=await iniciarSql();const consultar=async codigo=>executarConsultaSql(SQL,codigo);
let quantidade=0;
for(const [id,solucao] of [['sql-depurar-clientes-pagos',contar],['sql-depurar-totais-colecoes',somar]]){
 const resposta=await conferirConsultaSql(id,solucao,consultar);assert.equal(resposta.aprovado,true);assert.equal(resposta.verificacoes.length,4);quantidade++;
 const erro=await conferirConsultaSql(id,'SELECT 1;',consultar);assert.equal(erro.aprovado,false);assert.match(erro.mensagem,/cabeçalhos/);quantidade++;
 const extra=await conferirConsultaSql(id,solucao+' SELECT 1;',consultar);assert.equal(extra.aprovado,false);quantidade++;
 await assert.rejects(()=>conferirConsultaSql(id,'SELECT FROM;',consultar),/syntax/);quantidade++;
 const sinal=new AbortController();sinal.abort();let chamadas=0;await assert.rejects(()=>conferirConsultaSql(id,solucao,async codigo=>{chamadas++;return consultar(codigo);},sinal.signal),/cancelada/);assert.equal(chamadas,0);quantidade++;
}
const comum=`SELECT c.id AS cliente_id,count(p.id) AS pagos FROM clientes c LEFT JOIN pedidos p ON p.cliente_id=c.id AND p.status='pago' GROUP BY c.id HAVING c.id<=3 ORDER BY c.id;`;
const parcial=await conferirConsultaSql('sql-depurar-clientes-pagos',comum,consultar);assert.equal(parcial.aprovado,false);assert.equal(parcial.verificacoes[0].passed,true);assert.equal(parcial.verificacoes[1].passed,false);quantidade++;
const maiusculo=await conferirConsultaSql('sql-depurar-clientes-pagos',contar.replace('AS cliente_id','AS CLIENTE_ID').replace('AS pagos','AS PAGOS'),consultar);assert.equal(maiusculo.aprovado,true);quantidade++;
console.log(quantidade+' contratos do corretor conferidos com motor e SQLite reais, incluindo BigInt, cabeçalhos, múltiplos resultados, erro, cancelamento e sucesso parcial. Rascunho fora do produto.');
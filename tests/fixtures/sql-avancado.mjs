import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

export async function verificarSqlAvancado(raiz,atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(a=>a.id===id);assert.ok(encontrada,id);return encontrada;};
 const texto=await readFile('src/content/deep/sql.ts','utf8');
 const curso=JSON.parse(texto.slice(texto.indexOf('{',texto.indexOf('export default')),texto.lastIndexOf('}')+1));
 const aula=id=>curso.lessons.find(a=>a.id===id);
 const contar='sql-janelas-contar-ausencias',pares='sql-janelas-prever-pares',explicar='sql-indices-prever-analyze',indices='sql-indices-escolher-prefixo',caminhos='sql-esquema-prever-caminhos',json='sql-esquema-distinguir-json-null';
 const casos=[
  {id:'aula-janelas',codigo:aula('sql-agregacoes-janelas').code,saida:['Ana|3|15|15','Lia|1|20|20','Lia|2|30|50','Ana|1|15','Lia|2|50']},
  {id:'solucao-janelas',codigo:aula('sql-agregacoes-janelas').solution,saida:['Ana|50|1','Lia|50|1','Bia|10|2']},
  {id:'aula-planos',codigo:aula('sql-indices-planos').code.replace('ANALYZE,BUFFERS','ANALYZE,BUFFERS,FORMAT JSON'),planos:1},
  {id:'solucao-planos',codigo:aula('sql-indices-planos').solution.replaceAll('ANALYZE,BUFFERS','ANALYZE,BUFFERS,FORMAT JSON'),planos:2},
  {id:'aula-recursiva',codigo:aula('sql-esquema-avancado').code,saida:['Programação|0','Web|1','HTML|2']},
  {id:'solucao-jsonb',codigo:aula('sql-esquema-avancado').solution,saida:['1|Lia']},
  ...atividade(contar).options.map(opcao=>({id:'contagem-'+opcao.id,codigo:atividade(contar).code.split('\nSELECT')[0]+'\n'+opcao.text,saida:({'linhas-valores':['1|3|2|5','2|1|0|0'],'so-informados':['1|2|2|5','2|0|0|0'],'todas-informadas':['1|3|3|5','2|1|1|0'],'excluir-ausentes':['1|2|2|5']})[opcao.id]})),
  {id:'pares-padrao',codigo:atividade(pares).code,saida:obterSolucao(pares).split('\n')},
  {id:'pares-com-desempate',codigo:atividade(pares).code.replace('ORDER BY dia)','ORDER BY dia,id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)'),saida:['1|10','2|30','3|25']},
  {id:'analyze-altera-antes-do-rollback',codigo:atividade(explicar).code,inteiros:['15','13']},
  {id:'explain-sem-analyze',codigo:atividade(explicar).code.replace('ANALYZE,COSTS OFF,TIMING OFF','COSTS OFF'),inteiros:['13','13']},
  {id:'caminhos-repetidos',codigo:atividade(caminhos).code,saida:obterSolucao(caminhos).split('\n')},
  {id:'nos-distintos',codigo:atividade(caminhos).code.replace('UNION ALL','UNION'),saida:['1|1','2|1','3|1','4|1']},
  ...atividade(json).options.map(opcao=>({id:'json-'+opcao.id,codigo:atividade(json).code.split('\nSELECT')[0]+'\nSELECT id FROM preferencias WHERE '+opcao.text+' ORDER BY id;',saida:({'tipo-json':['2'],'presenca-e-json':['2'],'texto-null':['1','2','7'],'sql-null':['1','7']})[opcao.id]}))
 ];
 for(const opcao of atividade(indices).options){
  const chaves={composto:'aluno_id,id',parcial:'id',trocado:'id,aluno_id','outra-chave':'minutos,aluno_id,id'}[opcao.id];
  casos.push({id:'indice-'+opcao.id,codigo:`CREATE TEMP TABLE sessoes(id integer PRIMARY KEY,aluno_id integer,minutos integer);
INSERT INTO sessoes SELECT g,g%100,g%60 FROM generate_series(1,10000) AS g;
${opcao.text}
SELECT string_agg(a.attname,',' ORDER BY chave.ordem) FROM pg_index i CROSS JOIN LATERAL unnest(i.indkey) WITH ORDINALITY AS chave(numero,ordem) JOIN pg_attribute a ON a.attrelid=i.indrelid AND a.attnum=chave.numero WHERE i.indexrelid='indice_estudo'::regclass;
SELECT COALESCE(pg_get_expr(indpred,indrelid),'sem predicado') FROM pg_index WHERE indexrelid='indice_estudo'::regclass;
${atividade(indices).code}`,saida:[chaves,opcao.id==='parcial'?'(aluno_id = 7)':'sem predicado',...Array.from({length:10},(_,i)=>{const id=7+i*100;return id+'|'+id%60;})]});
 }
 const pasta=join(raiz,'sql-avancado');await mkdir(pasta);
 for(const caso of casos){
  const fonte=join(pasta,caso.id+'.sql');await writeFile(fonte,"SET statement_timeout='5s';\nSET lock_timeout='1s';\n"+caso.codigo);
  const r=spawnSync('psql',['--no-psqlrc','--set','ON_ERROR_STOP=1','--no-align','--tuples-only','--quiet','--file',fonte],{encoding:'utf8',timeout:15000,maxBuffer:256*1024});assert.ifError(r.error);assert.equal(r.status,0,caso.id+': '+r.stderr);
  const linhas=r.stdout.trim()?r.stdout.trim().split(/\r?\n/):[];
  if(caso.planos){const planos=r.stdout.trim().split(/\r?\n(?=\[)/).map(p=>JSON.parse(p));assert.equal(planos.length,caso.planos,caso.id);for(const plano of planos){assert.equal(plano[0].Plan['Actual Rows'],10,caso.id);assert.equal(typeof plano[0]['Execution Time'],'number');assert.ok(plano[0]['Execution Time']>=0);}}
  else assert.deepEqual(caso.inteiros?linhas.filter(l=>/^\d+$/.test(l)):linhas,caso.inteiros??caso.saida,caso.id);
  console.log('OK SQL avançado '+caso.id+' — referência PostgreSQL conferida');
 }
 return casos.length;
}

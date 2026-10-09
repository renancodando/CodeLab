import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

export async function verificarAusenciasSql(raiz,atividades,obterSolucao){
 const atividade=id=>atividades.find(atividade=>atividade.id===id);
 const previsao=atividade('sql-prever-desconhecido').code;
 const exclusao=atividade('sql-correlacionar-ausentes').code.replace('____',obterSolucao('sql-correlacionar-ausentes'));
 const casos=[
  {id:'comparacoes-exibidas',codigo:previsao,saida:obterSolucao('sql-prever-desconhecido').split('\n')},
  {id:'negacao-nao-seleciona-ausencia',codigo:'SELECT id FROM (VALUES (1,NULL::integer),(2,0),(3,5)) AS dados(id,saldo) WHERE NOT (saldo <> 0) ORDER BY id;',saida:['2']},
  {id:'presenca-e-faixa',codigo:obterSolucao('sql-corrigir-obrigatoriedade')+`
INSERT INTO estoque_null VALUES (0),(5);
DO $$
BEGIN
 BEGIN
  INSERT INTO estoque_null VALUES (NULL);
  RAISE EXCEPTION 'ausencia foi aceita';
 EXCEPTION WHEN not_null_violation THEN NULL;
 END;
 BEGIN
  INSERT INTO estoque_null VALUES (-1);
  RAISE EXCEPTION 'negativo foi aceito';
 EXCEPTION WHEN check_violation THEN NULL;
 END;
 IF (SELECT count(*) FROM estoque_null) <> 2 THEN RAISE EXCEPTION 'insercao rejeitada deixou linha'; END IF;
END $$;
SELECT valor FROM estoque_null ORDER BY valor;`,saida:['0','5']},
  {id:'faixa-sozinha-aceita-null',codigo:atividade('sql-corrigir-obrigatoriedade').code+'\nINSERT INTO estoque_null VALUES (NULL);\nSELECT valor IS NULL FROM estoque_null;',saida:['t']},
  {id:'coalesce-nao-exige-presenca',codigo:'CREATE TEMP TABLE estoque_null (valor integer CHECK (COALESCE(valor,0) >= 0));\nINSERT INTO estoque_null VALUES (NULL);\nSELECT valor IS NULL FROM estoque_null;',saida:['t']},
  {id:'correspondencia-com-ausencia-e-duplicatas',codigo:exclusao,saida:['2','4']},
  {id:'igualdade-comum-deixa-ausencia-passar',codigo:exclusao.replace('IS NOT DISTINCT FROM','='),saida:['1','2','4']},
  {id:'coalesce-colide-com-zero',codigo:exclusao.replace('b.chave IS NOT DISTINCT FROM c.chave','COALESCE(b.chave,0) = COALESCE(c.chave,0)'),saida:['4']},
  {id:'bloqueio-vazio',codigo:exclusao.replace('(VALUES (2), (NULL::integer), (2))','(SELECT NULL::integer WHERE false)'),saida:['1','2','3','4']},
  {id:'candidatos-vazios',codigo:exclusao.replace('VALUES (1, NULL::integer), (2, 0), (3, 2), (4, 3)','SELECT NULL::integer, NULL::integer WHERE false'),saida:[]},
  {id:'somente-ausencia-bloqueada',codigo:exclusao.replace('(VALUES (2), (NULL::integer), (2))','(VALUES (NULL::integer))'),saida:['2','3','4']},
  {id:'sem-ausencia-no-bloqueio',codigo:exclusao.replace('(VALUES (2), (NULL::integer), (2))','(VALUES (2), (2))'),saida:['1','2','4']}
 ];
 const pasta=join(raiz,'ausencias-sql');await mkdir(pasta);
 for(const caso of casos){
  const fonte=join(pasta,caso.id+'.sql');
  await writeFile(fonte,"BEGIN;\nSET LOCAL statement_timeout = '5s';\nSET LOCAL lock_timeout = '1s';\n"+caso.codigo+'\nROLLBACK;\n');
  const resultado=spawnSync('psql',['--no-psqlrc','--set','ON_ERROR_STOP=1','--no-align','--tuples-only','--quiet','--file',fonte],{encoding:'utf8',timeout:15000,maxBuffer:256*1024});
  assert.ifError(resultado.error);
  assert.equal(resultado.status,0,caso.id+': '+resultado.stderr);
  const linhas=resultado.stdout.trim()?resultado.stdout.trim().split(/\r?\n/):[];
  assert.deepEqual(linhas,caso.saida,caso.id);
  console.log('OK ausência SQL '+caso.id+' — resultado PostgreSQL conferido');
 }
 return casos.length;
}

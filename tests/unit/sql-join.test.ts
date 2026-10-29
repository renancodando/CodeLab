import {beforeAll,it,expect} from 'vitest';
import iniciarSql from 'sql.js';
import type {SqlJsStatic} from 'sql.js';
import {practiceActivities,practicesForLesson} from '../../src/content/practice';
import {lessons} from '../../src/content/curriculum';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
let SQL:SqlJsStatic;
beforeAll(async()=>{SQL=await iniciarSql();});
const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
const idConsulta='sql-join-depurar-titulos',solucao=getPracticeSolution(idConsulta)!;

it('prevê a linha preservada sem contar NULL como chave de nota',async()=>{
 expect(await evaluatePractice('sql-join-prever-contagem','10|2|2\r\n20|1|0')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 const banco=new SQL.Database();try{const linhas=banco.exec(atividade('sql-join-prever-contagem').code!).at(-1)!.values;expect(linhas).toEqual([[10,2,2],[20,1,0]]);expect(linhas.map(linha=>linha.join('|')).join('\n')).toBe(getPracticeSolution('sql-join-prever-contagem'));}finally{banco.close();}
});
it.each(['10|2|2\n20|0|0','10|2|2\n20|1|1','10|2|2'])('recusa uma previsão que perde ausência ou preservação: %s',async resposta=>{
 const resultado=await evaluatePractice('sql-join-prever-contagem',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('categoria vazia');
});
it.each(['linhas','estrito','agregado-no-where'])('recusa %s sem entregar a cláusula correta',async resposta=>{
 const resultado=await evaluatePractice('sql-join-diagnosticar-grupo',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('limite de duas');expect(resultado.feedback).not.toContain('HAVING COUNT');
});
it('aceita filtrar os grupos sem declarar execução da escolha',async()=>{
 expect(await evaluatePractice('sql-join-diagnosticar-grupo','grupos')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('executa cada alternativa de filtro e detecta fase errada e limite exclusivo',()=>{
 const pausa=atividade('sql-join-diagnosticar-grupo');
 for(const opcao of pausa.options!){
  const banco=new SQL.Database();try{
   banco.run("CREATE TABLE categorias(id INTEGER PRIMARY KEY); CREATE TABLE notas(id INTEGER PRIMARY KEY,categoria_id INTEGER NOT NULL REFERENCES categorias(id),titulo TEXT NOT NULL); INSERT INTO categorias VALUES(1),(2),(3),(4); INSERT INTO notas VALUES(1,2,'A'),(2,3,'B'),(3,3,'B'),(4,4,'C'),(5,4,'C'),(6,4,'C');");
   const consulta=pausa.code!.replace('WHERE COUNT(n.id)>=2\nGROUP BY c.id',opcao.text);
   if(opcao.id==='agregado-no-where')expect(()=>banco.exec(consulta)).toThrow(/aggregate/i);
   else{const linhas=banco.exec(consulta)[0]?.values??[];expect(JSON.stringify(linhas)===JSON.stringify([[3,2],[4,3]]),opcao.id).toBe(opcao.id==='grupos');}
  }finally{banco.close();}
 }
});
it('a consulta de referência executa cinco bases e mantém os dois cabeçalhos no vazio',async()=>{
 const resultado=await evaluatePractice(idConsulta,solucao);expect(resultado).toMatchObject({passed:true,evidence:'executed',execution:'sqlite'});expect(resultado.tests).toHaveLength(5);expect(resultado.tests.every(teste=>teste.passed)).toBe(true);
});
it.each([
 solucao.replaceAll('COUNT(n.id)','COUNT(*)'),
 solucao.replace('LEFT JOIN','INNER JOIN'),
 'SELECT categoria_id,COUNT(*) AS quantidade FROM notas GROUP BY categoria_id HAVING COUNT(*)>=2 ORDER BY quantidade DESC,categoria_id ASC;',
 'WITH contagens AS (SELECT categoria_id,COUNT(*) AS quantidade FROM notas GROUP BY categoria_id) SELECT categoria_id,quantidade FROM contagens WHERE quantidade>=2 ORDER BY quantidade DESC,categoria_id;'
])('aceita uma solução equivalente no contrato com mínimo de duas notas: %s',async consulta=>{
 expect((await evaluatePractice(idConsulta,consulta)).passed).toBe(true);
});
it.each([
 solucao.replaceAll('COUNT(n.id)','COUNT(DISTINCT n.titulo)'),
 solucao.replace('>=2','>2'),
 solucao.replace('>=2','>=1'),
 solucao.replace(' HAVING COUNT(n.id)>=2',''),
 solucao.replace('c.id ASC','c.id DESC'),
 solucao.replace('ORDER BY quantidade DESC,c.id ASC','ORDER BY c.id'),
 "SELECT 30 AS categoria_id,3 AS quantidade UNION ALL SELECT 10,2;"
])('rejeita perda de notas, limite, ordem ou resultado fixo: %s',async consulta=>{
 const resultado=await evaluatePractice(idConsulta,consulta);expect(resultado.status).toBe('evaluated');expect(resultado.passed).toBe(false);expect(resultado.tests.some(teste=>!teste.passed)).toBe(true);
});
it('o programa inicial passa no caso comum e recebe a borda de títulos repetidos sem gabarito',async()=>{
 const resultado=await evaluatePractice(idConsulta,atividade(idConsulta).code!);expect(resultado.tests.map(teste=>teste.passed)).toEqual([true,false]);expect(resultado.feedback).toContain('títulos repetidos');expect(resultado.feedback).not.toContain('COUNT(n.id)');
});
it('o desempate por ID é verificado depois das duas primeiras bases',async()=>{
 const resultado=await evaluatePractice(idConsulta,solucao.replace('c.id ASC','c.id DESC'));expect(resultado.tests.map(teste=>teste.passed)).toEqual([true,true,false]);expect(resultado.feedback).toContain('ordem de inserção');
});
it('a nova atividade não permite modificar ou configurar a base antes da consulta',async()=>{
 for(const codigo of ['DELETE FROM notas;'+solucao,'PRAGMA query_only=OFF;'+solucao]){const resultado=await evaluatePractice(idConsulta,codigo);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('uma única consulta');}
});
it('preserva a aula e seu exercício e distribui três habilidades próprias',()=>{
 const aula=lessons.find(item=>item.id==='sql-join')!;expect(aula.code).toContain('COUNT(n.id)');expect(aula.exercise).toContain('COUNT(*)');const pausas=practicesForLesson('sql-join');expect(pausas).toHaveLength(3);expect(pausas.map(pausa=>pausa.capability)).toEqual(['leitura','depuracao','alteracao']);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(pausas.every(pausa=>pausa.requiresConcept)).toBe(true);
});
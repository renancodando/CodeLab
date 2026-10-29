import {beforeAll,it,expect} from 'vitest';
import iniciarSql from 'sql.js';
import type {SqlJsStatic} from 'sql.js';
import {practiceActivities,practicesForLesson} from '../../src/content/practice';
import {lessons} from '../../src/content/curriculum';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {cenariosSql} from '../../src/learning/pratica-sql';
let SQL:SqlJsStatic;
beforeAll(async()=>{SQL=await iniciarSql();});
const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
const idConsulta='sql-crud-depurar-pendencias';
const solucao=getPracticeSolution(idConsulta)!;

it('a previsão acompanha alteração e exclusão e continua sendo conceitual',async()=>{
 expect(await evaluatePractice('sql-crud-prever-alteracoes','10|0\r\n20|1')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 const banco=new SQL.Database();
 try{const linhas=banco.exec(atividade('sql-crud-prever-alteracoes').code!).at(-1)!.values;expect(linhas).toEqual([[10,0],[20,1]]);expect(linhas.map(linha=>linha.join('|')).join('\n')).toBe(getPracticeSolution('sql-crud-prever-alteracoes'));}finally{banco.close();}
});
it.each(['10|1\n20|1','10|0\n20|1\n30|1','20|1','10|0\n20|0'])('recusa uma previsão que perde o alcance dos comandos: %s',async resposta=>{
 const resultado=await evaluatePractice('sql-crud-prever-alteracoes',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('conjunto');
});
it.each(['uniao','somente-id','outras'])('recusa %s sem revelar a condição correta',async resposta=>{
 const resultado=await evaluatePractice('sql-crud-corrigir-alvo',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('segunda chamada');expect(resultado.feedback).not.toContain('WHERE id=20 AND');
});
it('aceita a condição conjunta sem alegar execução da escolha',async()=>{
 expect(await evaluatePractice('sql-crud-corrigir-alvo','intersecao')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('as quatro alternativas são executadas contra alvos pendentes, concluídos, ausentes e chamadas repetidas',()=>{
 const pausa=atividade('sql-crud-corrigir-alvo');
 const bases=[[[10,0,2],[20,0,4],[30,1,7]],[[10,0,2],[20,1,4]],[[10,0,2]],[],[[20,0,0],[30,1,2]]];
 const esperado:Record<string,boolean[]>={intersecao:[true,true,true,true,true],uniao:[false,false,false,true,false],'somente-id':[false,false,true,true,false],outras:[false,false,false,true,false]};
 for(const opcao of pausa.options!)for(const [indice,dados] of bases.entries()){
  const banco=new SQL.Database();
  try{
   banco.run('CREATE TABLE tarefas(id INTEGER PRIMARY KEY,concluida INTEGER NOT NULL CHECK(concluida IN(0,1)),edicoes INTEGER NOT NULL DEFAULT 0 CHECK(edicoes>=0));');
   for(const linha of dados)banco.run('INSERT INTO tarefas VALUES(?,?,?)',linha);
   const comando=pausa.code!.replace(/WHERE[\s\S]*$/,opcao.text);
   banco.run(comando);banco.run(comando);
   const final=banco.exec('SELECT id,concluida,edicoes FROM tarefas ORDER BY id;')[0]?.values??[];
   const correto=dados.map(([id,concluida,edicoes])=>id===20&&concluida===0?[id,1,edicoes+1]:[id,concluida,edicoes]);
   expect(JSON.stringify(final)===JSON.stringify(correto),opcao.id+' na base '+indice).toBe(esperado[opcao.id][indice]);
  }finally{banco.close();}
 }
});
it('executa a consulta corrigida em cinco bases independentes com tipos e ordem',async()=>{
 const resultado=await evaluatePractice(idConsulta,solucao);expect(resultado).toMatchObject({passed:true,evidence:'executed',execution:'sqlite'});expect(resultado.tests).toHaveLength(5);expect(resultado.tests.every(teste=>teste.passed)).toBe(true);expect(cenariosSql[idConsulta]).toHaveLength(5);
});
it.each(['SELECT id,titulo FROM tarefas WHERE NOT(concluida=1) ORDER BY id ASC;','SELECT t.id AS ID,t.titulo AS TITULO FROM tarefas t WHERE t.concluida<>1 ORDER BY 1;'])('aceita uma consulta equivalente pelo resultado: %s',async consulta=>{
 expect((await evaluatePractice(idConsulta,consulta)).passed).toBe(true);
});
it.each([
 'SELECT id,titulo FROM tarefas WHERE concluida=1 ORDER BY id;',
 'SELECT id,titulo FROM tarefas ORDER BY id;',
 'SELECT id,titulo FROM tarefas WHERE concluida=0 ORDER BY id DESC;',
 'SELECT id,titulo FROM tarefas WHERE concluida=0 ORDER BY id LIMIT 1;',
 'SELECT id,titulo FROM tarefas WHERE concluida=0 AND id BETWEEN 1 AND 50 ORDER BY id;',
 'SELECT id,titulo FROM tarefas WHERE concluida=0 GROUP BY titulo ORDER BY id;',
 "SELECT 20 AS id,'Criar' AS titulo UNION ALL SELECT 30,'Testar';"
])('rejeita estado, ordem, limite, deduplicação ou resposta fixa: %s',async consulta=>{
 const resultado=await evaluatePractice(idConsulta,consulta);expect(resultado.passed).toBe(false);expect(resultado.status).toBe('evaluated');expect(resultado.execution).toBe('sqlite');expect(resultado.tests.some(teste=>!teste.passed)).toBe(true);
});
it('mostra a base que falhou sem entregar a solução após o exemplo passar',async()=>{
 const resultado=await evaluatePractice(idConsulta,'SELECT id,titulo FROM tarefas WHERE concluida=0 AND id>0 ORDER BY id;');expect(resultado.tests.map(teste=>teste.passed)).toEqual([true,false]);expect(resultado.feedback).toContain('caso visível passou');expect(resultado.feedback).not.toContain('WHERE concluida=0');
});
it.each(['DELETE FROM tarefas;'+solucao,'PRAGMA query_only=OFF;'+solucao,solucao+'DROP TABLE tarefas;',solucao+'SELECT 1;'])('mantém a base protegida contra comandos extras: %s',async codigo=>{
 const resultado=await evaluatePractice(idConsulta,codigo);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('uma única consulta');expect((await evaluatePractice(idConsulta,solucao)).passed).toBe(true);
});
it('mantém a aula original e separa três habilidades e seus tipos de evidência',()=>{
 const aula=lessons.find(item=>item.id==='sql-crud')!;expect(aula.code).toContain("INSERT INTO tarefas(titulo)");expect(aula.exercise).toContain('id 2');const pausas=practicesForLesson('sql-crud');expect(pausas).toHaveLength(3);expect(pausas.map(pausa=>pausa.capability)).toEqual(['leitura','depuracao','alteracao']);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(pausas.every(pausa=>pausa.requiresConcept)).toBe(true);
});
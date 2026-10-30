import {beforeAll,it,expect} from 'vitest';
import iniciarSql from 'sql.js';
import type {SqlJsStatic} from 'sql.js';
import {practiceActivities,practicesForLesson} from '../../src/content/practice';
import {lessons} from '../../src/content/curriculum';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
let SQL:SqlJsStatic;
beforeAll(async()=>{SQL=await iniciarSql();});
const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
const esquema='CREATE TABLE notas(id INTEGER PRIMARY KEY,titulo TEXT NOT NULL,categoria_id INTEGER NOT NULL);';
const entrada="' OR 1=1 --";
function preparar(){const banco=new SQL.Database();banco.run(esquema);for(const [id,titulo,categoria] of [[1,"D'água",7],[2,'Estudar',7],[7,entrada,9],[9,entrada,9]])banco.run('INSERT INTO notas VALUES(?,?,?);',[id,titulo,categoria]);return banco;}
function buscar(banco:InstanceType<SqlJsStatic['Database']>,titulo:string){
 const consulta=banco.prepare(atividade('sql-indices-prever-parametro').code!);const ids:number[]=[];
 try{consulta.bind({$titulo:titulo});while(consulta.step())ids.push(Number(consulta.get()[0]));return ids;}finally{consulta.free();}
}
it('executa a vinculação real preservando as duas correspondências literais',async()=>{
 const banco=preparar();try{const ids=buscar(banco,entrada);expect(ids).toEqual([7,9]);expect(ids.join('\n')).toBe(getPracticeSolution('sql-indices-prever-parametro'));}finally{banco.close();}
 expect(await evaluatePractice('sql-indices-prever-parametro','7\r\n9')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('vincula apóstrofos e não transforma um valor com comandos em uma segunda instrução',()=>{
 const banco=preparar();try{expect(buscar(banco,"D'água")).toEqual([1]);expect(buscar(banco,"x'; DROP TABLE notas; --")).toEqual([]);expect(buscar(banco,'sem correspondência')).toEqual([]);expect(banco.exec('SELECT COUNT(*) FROM notas;')[0].values).toEqual([[4]]);}finally{banco.close();}
});
it('a concatenação defeituosa amplia o resultado enquanto o valor vinculado continua literal',()=>{
 const banco=preparar();try{const insegura="SELECT id FROM notas WHERE titulo='"+entrada+"';";const ids=banco.exec(insegura)[0].values.map(linha=>Number(linha[0])).sort((a,b)=>a-b);expect(ids).toEqual([1,2,7,9]);expect(buscar(banco,entrada)).toEqual([7,9]);}finally{banco.close();}
});
it.each(['1\n2\n7\n9','7','9'])('recusa interpretar o parâmetro como SQL ou perder correspondências: %s',async resposta=>{
 const resultado=await evaluatePractice('sql-indices-prever-parametro',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('valor vinculado');
});
it.each(['unico','outro-campo','apagar'])('recusa uma criação de índice fora do contrato: %s',async resposta=>{
 const resultado=await evaluatePractice('sql-indices-corrigir-unicidade',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('preservar todas as notas');expect(resultado.feedback).not.toContain('CREATE INDEX');
});
it('aceita o diagnóstico correto sem declarar execução da escolha',async()=>{
 expect(await evaluatePractice('sql-indices-corrigir-unicidade','comum')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('as alternativas preservam coluna, linhas e novas categorias repetidas apenas com o índice comum',()=>{
 const bases=[[],[[1,'A',7]],[[1,'A',7],[2,'A',7],[3,'B',9]]];
 for(const opcao of atividade('sql-indices-corrigir-unicidade').options!){
  let aprovouTodas=true;
  for(const dados of bases){const banco=new SQL.Database();try{
   banco.run(esquema);for(const linha of dados)banco.run('INSERT INTO notas VALUES(?,?,?);',linha);
   banco.run(opcao.text);const preservados=banco.exec('SELECT id,titulo,categoria_id FROM notas ORDER BY id;')[0]?.values??[];
   const indices=banco.exec("PRAGMA index_list('notas');")[0].values;const comum=indices.some(linha=>linha[1]==='idx_notas_categoria'&&linha[2]===0);
   const colunas=banco.exec("PRAGMA index_info('idx_notas_categoria');")[0].values.map(linha=>linha[2]);
   banco.run("INSERT INTO notas VALUES(500,'Outra',7),(501,'Outra',7);");
   const quantidade=banco.exec('SELECT COUNT(*) FROM notas;')[0].values[0][0];
   if(JSON.stringify(preservados)!==JSON.stringify(dados)||!comum||JSON.stringify(colunas)!==JSON.stringify(['categoria_id'])||quantidade!==dados.length+2)aprovouTodas=false;
  }catch{aprovouTodas=false;}finally{banco.close();}}
  expect(aprovouTodas,opcao.id).toBe(opcao.id==='comum');
 }
});
it('mantém exemplo, exercício e dois contratos próprios sem fingir medir desempenho',()=>{
 const aula=lessons.find(item=>item.id==='sql-indices')!;expect(aula.code).toContain('EXPLAIN QUERY PLAN');expect(aula.exercise).toContain('apóstrofo');const pausas=practicesForLesson('sql-indices');expect(pausas).toHaveLength(2);expect(pausas.map(pausa=>pausa.capability)).toEqual(['leitura','depuracao']);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(2);expect(pausas.every(pausa=>pausa.requiresConcept)).toBe(true);expect(atividade('sql-indices-corrigir-unicidade').prompt).toContain('não prova ganho de tempo');
});

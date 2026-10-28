import {beforeAll,it,expect} from 'vitest';
import iniciarSql from 'sql.js';
import type {SqlJsStatic} from 'sql.js';
import {practiceActivities,practicesForLesson} from '../../src/content/practice';
import {lessons} from '../../src/content/curriculum';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';

let SQL:SqlJsStatic;
beforeAll(async()=>{SQL=await iniciarSql();});
const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
const ordem=['autores','livros','autor','livro','consulta'];
const equivalentes=[ordem,['livros','autores','autor','livro','consulta'],['autores','autor','livros','livro','consulta']];

it('prevê restrições sem transformar uma resposta conceitual em execução',async()=>{
 expect(await evaluatePractice('sql-modelagem-prever-integridade',' ACEITO \r\n recusado \r\nRECUSADO\r\naceito ')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each(['aceito\naceito\nrecusado\naceito','aceito\nrecusado\naceito\naceito','aceito\nrecusado\nrecusado\nrecusado'])('recusa ausência, referência ou unicidade confundida: %s',async resposta=>{
 const resultado=await evaluatePractice('sql-modelagem-prever-integridade',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('base original');
});
it('executa cada INSERT previsto em sua própria base SQLite e conserva dados após rejeição',()=>{
 const comandos=atividade('sql-modelagem-prever-integridade').code!.split(';').map(comando=>comando.trim()).filter(Boolean);
 expect(comandos).toHaveLength(9);
 const respostas:string[]=[];
 for(const comando of comandos.slice(5)){
  const banco=new SQL.Database();
  try{
   banco.run(comandos.slice(0,5).join(';')+';');expect(banco.exec('PRAGMA foreign_keys')[0].values).toEqual([[1]]);
   try{banco.run(comando);respostas.push('aceito');}catch(erro){expect(String(erro)).toMatch(/NOT NULL|FOREIGN KEY/);respostas.push('recusado');}
   expect(banco.exec('SELECT id,titulo,autor_id FROM livros WHERE id=10')[0].values).toEqual([[10,'Mapa',7]]);
   expect(banco.exec('SELECT count(*) FROM livros')[0].values).toEqual([[respostas.at(-1)==='aceito'?2:1]]);
  }finally{banco.close();}
 }
 expect(respostas.join('\n')).toBe(getPracticeSolution('sql-modelagem-prever-integridade'));
});
it.each(['opcional','solta','unica'])('diagnostica %s sem entregar a declaração correta',async resposta=>{
 const resultado=await evaluatePractice('sql-modelagem-corrigir-cardinalidade',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('dois livros');expect(resultado.feedback).not.toContain('autor_id INTEGER');
});
it('a declaração escolhida permite multiplicidade sem perder presença ou integridade',async()=>{
 expect(await evaluatePractice('sql-modelagem-corrigir-cardinalidade','relacao')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('executa as quatro declarações contra livros repetidos, ausência, órfãos e mudanças do pai',()=>{
 const pausa=atividade('sql-modelagem-corrigir-cardinalidade');
 const comandos=["INSERT INTO livros VALUES(11,'Outro',7)","INSERT INTO livros VALUES(11,'Outro',NULL)","INSERT INTO livros VALUES(11,'Outro',99)","INSERT INTO livros VALUES(11,'Mapa',8)","INSERT INTO livros VALUES(10,'Outro',8)","INSERT INTO livros VALUES(11,NULL,8)",'DELETE FROM autores WHERE id=7','UPDATE autores SET id=99 WHERE id=7'];
 const esperado:Record<string,boolean[]>={relacao:[true,false,false,true,false,false,false,false],opcional:[true,true,false,true,false,false,false,false],solta:[true,false,true,true,false,false,true,true],unica:[false,false,false,true,false,false,false,false]};
 for(const opcao of pausa.options!)for(const [indice,comando] of comandos.entries()){
  const banco=new SQL.Database();
  try{
   const esquema=pausa.code!.replace('autor_id INTEGER NOT NULL UNIQUE REFERENCES autores(id)',opcao.text);
   banco.run("PRAGMA foreign_keys=ON; CREATE TABLE autores(id INTEGER PRIMARY KEY,nome TEXT NOT NULL);"+esquema+"INSERT INTO autores VALUES(7,'Ana'),(8,'Bia'); INSERT INTO livros VALUES(10,'Mapa',7);");
   let aceito=true;try{banco.run(comando);}catch(erro){aceito=false;expect(String(erro)).toMatch(/FOREIGN KEY|NOT NULL|UNIQUE/);}
   expect(aceito,opcao.id+': '+comando).toBe(esperado[opcao.id][indice]);
   if(!aceito)expect(banco.exec('SELECT id,titulo,autor_id FROM livros')[0].values).toEqual([[10,'Mapa',7]]);
  }finally{banco.close();}
 }
});
it('aceita todas as três ordens de dependências permitidas pelo contrato SQLite',async()=>{
 for(const linhas of equivalentes)for(const resposta of [linhas,linhas.join('\n')])expect((await evaluatePractice('sql-modelagem-montar-relacao',resposta)).passed).toBe(true);
});
it('recusa filho antecipado, tabela ausente, consulta incompleta, duplicação e injeção',async()=>{
 for(const linhas of [['autores','livros','livro','autor','consulta'],['autor','autores','livros','livro','consulta'],['autores','autor','livro','livros','consulta'],['autores','livros','autor','consulta','livro'],ordem.slice(0,-1),[...ordem,'consulta'],ordem.map(id=>id==='livros'?'autores':id),ordem.map(id=>id==='livros'?'inventada':id)])expect((await evaluatePractice('sql-modelagem-montar-relacao',linhas)).passed).toBe(false);
});
it('as três reconstruções válidas realmente criam dois livros sem mudar a relação',()=>{
 const pausa=atividade('sql-modelagem-montar-relacao');
 for(const linhas of equivalentes){
  const banco=new SQL.Database();
  try{const resultado=banco.exec(pausa.code+'\n'+linhas.map(id=>pausa.lines!.find(linha=>linha.id===id)!.code).join('\n'));expect(resultado.at(-1)?.values).toEqual([[21,7],[22,7]]);expect(banco.exec('PRAGMA foreign_key_check')).toEqual([]);}
  finally{banco.close();}
 }
 const banco=new SQL.Database();
 try{
  for(const id of ['autores','livros'])banco.run(pausa.lines!.find(linha=>linha.id===id)!.code);
  banco.run(pausa.code!);expect(()=>banco.run(pausa.lines!.find(linha=>linha.id==='livro')!.code)).toThrow(/FOREIGN KEY/);expect(banco.exec('SELECT count(*) FROM livros')[0].values).toEqual([[0]]);
 }finally{banco.close();}
});
it('cada conexão precisa habilitar sua própria integridade antes de gravar',()=>{
 const primeira=new SQL.Database(),segunda=new SQL.Database();
 try{
  primeira.run('PRAGMA foreign_keys=ON;');segunda.run('PRAGMA foreign_keys=OFF;');
  for(const banco of [primeira,segunda])banco.run('CREATE TABLE autores(id INTEGER PRIMARY KEY); CREATE TABLE livros(autor_id INTEGER NOT NULL REFERENCES autores(id));');
  expect(()=>primeira.run('INSERT INTO livros VALUES(99)')).toThrow(/FOREIGN KEY/);expect(()=>segunda.run('INSERT INTO livros VALUES(99)')).not.toThrow();
  segunda.run('PRAGMA foreign_keys=ON;');expect(segunda.exec('PRAGMA foreign_key_check')[0].values).toHaveLength(1);expect(()=>segunda.run('INSERT INTO livros VALUES(100)')).toThrow(/FOREIGN KEY/);
 }finally{primeira.close();segunda.close();}
});
it('conserva o exemplo e exercício originais e distribui habilidades distintas',()=>{
 const aula=lessons.find(item=>item.id==='sql-modelagem')!;expect(aula.code).toContain('CREATE TABLE categorias');
 const pausas=practicesForLesson('sql-modelagem');expect(pausas).toHaveLength(3);expect(pausas.map(pausa=>pausa.capability)).toEqual(['leitura','depuracao','alteracao']);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.prompt.includes('conceitual'))).toBe(true);
});
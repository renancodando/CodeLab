import {it,expect} from 'vitest';
import {DatabaseSync} from 'node:sqlite';
import {lessons} from '../../src/content/curriculum';
it('os cinco exemplos SQL são válidos em SQLite e produzem resultados coerentes',()=>{
 for(const lesson of lessons.filter(l=>l.language==='sql')){const db=new DatabaseSync(':memory:');try{if(lesson.id!=='sql-modelagem')db.exec(lessons.find(l=>l.id==='sql-modelagem')!.code);db.exec(lesson.code);if(lesson.id==='sql-crud')expect(db.prepare('SELECT titulo FROM tarefas WHERE concluida=0').all()).toEqual([{titulo:'Praticar'}]);if(lesson.id==='sql-transacao')expect(db.prepare('SELECT saldo FROM contas ORDER BY id').all()).toEqual([{saldo:800},{saldo:700}]);}finally{db.close();}}
});
it('LEFT JOIN preserva categorias vazias e COUNT ignora NULL',()=>{const db=new DatabaseSync(':memory:');try{db.exec(lessons.find(l=>l.id==='sql-modelagem')!.code);db.exec("INSERT INTO categorias VALUES(1,'Estudo'),(2,'Pessoal'); INSERT INTO notas VALUES(1,'DOM',1),(2,'SQL',1);");expect(db.prepare(lessons.find(l=>l.id==='sql-join')!.code).all()).toEqual([{nome:'Estudo',quantidade:2},{nome:'Pessoal',quantidade:0}]);}finally{db.close();}});

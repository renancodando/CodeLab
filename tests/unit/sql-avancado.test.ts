import {it,expect} from 'vitest';
import iniciarSql from 'sql.js';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {practicesForLesson} from '../../src/content/practice';
import {executarConsultaSql} from '../../src/execution/motor-sql';
import {cenariosSql} from '../../src/learning/pratica-sql';
const idAcumulado='sql-janelas-acumular-movimentos',acumulado=getPracticeSolution(idAcumulado)!;
it('frame padrão executa a referência sem executar a previsão do aluno',async()=>{
 const id='sql-janelas-prever-pares',pausa=practicesForLesson('sql-agregacoes-janelas').find(p=>p.id===id)!,SQL=await iniciarSql();
 const r=executarConsultaSql(SQL,pausa.code!,'');expect(r.tabelas[0].linhas.map(l=>l.map(String).join('|')).join('\n')).toBe(getPracticeSolution(id));expect(await evaluatePractice(id,getPracticeSolution(id)!)).toMatchObject({passed:true,execution:'not-run'});expect((await evaluatePractice(id,'1|10\n2|30\n3|25')).passed).toBe(false);
});
it('contagens confrontam todas as alternativas em SQLite real',async()=>{
 const id='sql-janelas-contar-ausencias',pausa=practicesForLesson('sql-agregacoes-janelas').find(p=>p.id===id)!,SQL=await iniciarSql(),base=pausa.code!.slice(0,pausa.code!.indexOf('\nSELECT'));
 for(const opcao of pausa.options!){const r=executarConsultaSql(SQL,base+'\n'+opcao.text,'');expect(r.tabelas[0].linhas.map(l=>l.map(String).join('|')).join('\n')==='1|3|2|5\n2|1|0|0').toBe(opcao.id==='linhas-valores');expect((await evaluatePractice(id,opcao.id)).passed).toBe(opcao.id==='linhas-valores');}
});
it('o acumulado executa seis bases e mantém ausência, zero e negativos',async()=>{
 const r=await evaluatePractice(idAcumulado,acumulado);expect(r).toMatchObject({passed:true,evidence:'executed',execution:'sqlite'});expect(r.tests).toHaveLength(6);expect(r.feedback).toContain('não valida recursos específicos de PostgreSQL');
});
it('aceita acumulado equivalente por subconsulta, sem exigir texto ou OVER',async()=>{
 const consulta="SELECT m.conta_id,m.id,COALESCE((SELECT SUM(x.centavos) FROM movimentos x WHERE x.conta_id=m.conta_id AND x.estado='confirmado' AND (x.instante<m.instante OR (x.instante=m.instante AND x.id<=m.id))),0) AS acumulado FROM movimentos m WHERE m.estado='confirmado' ORDER BY m.conta_id,m.instante,m.id;";
 expect((await evaluatePractice(idAcumulado,consulta)).passed).toBe(true);
});
it('frame padrão com desempate único continua semanticamente equivalente',async()=>{expect((await evaluatePractice(idAcumulado,acumulado.replace(' ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',''))).passed).toBe(true);});
for(const [nome,consulta] of Object.entries({
 semFiltro:acumulado.replace(" WHERE estado='confirmado'",''),
 pares:acumulado.replace('ORDER BY instante,id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW','ORDER BY instante'),
 misturaContas:acumulado.replace('PARTITION BY conta_id ',''),
 ausencia:acumulado.replace('COALESCE(centavos,0)','centavos'),
 ordemID:acumulado.replace('ORDER BY conta_id,instante,id','ORDER BY conta_id,id'),
 constante:'SELECT 2 AS conta_id,10 AS id,5 AS acumulado UNION ALL SELECT 2,20,12 UNION ALL SELECT 8,30,-3;'
}))it('acumulado recusa '+nome+' sem revelar a consulta',async()=>{const r=await evaluatePractice(idAcumulado,consulta);expect(r.passed).toBe(false);expect(r.execution).toBe('sqlite');expect(r.feedback).not.toContain(acumulado);});
it('a granularidade precede a previsão de frames e sua aplicação',()=>{expect(practicesForLesson('sql-agregacoes-janelas').map(p=>p.afterBlock)).toEqual([3,6,8]);});

it('preparação distingue NULL de texto e preserva apóstrofos existentes',async()=>{
 const SQL=await iniciarSql();const r=executarConsultaSql(SQL,'SELECT COUNT(*) AS linhas,COUNT(centavos) AS informados,SUM(CASE WHEN centavos IS NULL THEN 1 ELSE 0 END) AS ausentes FROM movimentos;',cenariosSql[idAcumulado][2].preparacao);expect(r.tabelas[0].linhas[0].map(String)).toEqual(['4','2','2']);
 const antiga=executarConsultaSql(SQL,'SELECT titulo FROM tarefas WHERE id=2;',cenariosSql['sql-crud-depurar-pendencias'][1].preparacao);expect(antiga.tabelas[0].linhas).toEqual([["D'água"]]);
});

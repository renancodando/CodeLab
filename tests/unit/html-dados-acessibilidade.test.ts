import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {lessons} from '../../src/content/curriculum';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession,ADAPTIVE_LIMITS} from '../../src/learning/adaptive';

it.each(['imagens-tabelas','html-acessivel'])('%s conserva capítulos, aplicação e preparação específica',aula=>{
 const pausas=practicesForLesson(aula),original=lessons.find(a=>a.id===aula)!;expect(original.capitulos).toHaveLength(12);expect(pausas.map(p=>p.afterBlock)).toEqual([3,6,8]);
 expect(original.capitulos.find(c=>c.id==='projeto')?.paragrafos.join(' ')).toContain(aula==='imagens-tabelas'?'tabela de comparação de três projetos':'auditoria manual de uma página sua');
 expect(original.capitulos.slice(0,9).some(c=>c.id==='solucao')).toBe(false);expect(pausas.every(p=>p.requiresConcept)).toBe(true);
 const estado=freshAdaptive(),preparacao=idPreparacao(aula);estado.seenConcepts=adaptiveCatalog.activities.filter(a=>a.kind==='concept'&&a.id!==preparacao).map(a=>a.id);
 expect(buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'html'},{now:Date.parse('2026-10-14T12:00:00Z'),timeZone:'UTC'}).items.map(i=>i.activityId)).toEqual([preparacao,...pausas.map(p=>p.id)]);expect(estado.skills).toEqual({});
 expect(adaptiveCatalog.skills.length).toBeLessThanOrEqual(ADAPTIVE_LIMITS.skills);
});
it.each([
 ['html-prever-cabecalhos','Unidades\nCabo USB',['Estoque\nCabo USB','Unidades\nAdaptador','Cabo USB\nUnidades','Unidades\n']],
 ['html-prever-tabulacao','Ajuda\nTestar',['Ajuda\nSalvar','Testar\nResumo','Salvar\nTestar','Ajuda\nTestar\nResumo']]
] as const)('%s exige as relações completas e continua conceitual',async(id,certa,erradas)=>{
 for(const errada of erradas)expect((await evaluatePractice(id,errada)).passed).toBe(false);
 expect(await evaluatePractice(id,certa)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each([
 ['html-diagnosticar-imagem-link','destino',['arquivo','decoracao']],
 ['html-diagnosticar-nome-acao','visivel',['papel','cor']]
] as const)('%s rejeita alterações que não corrigem o nome no contexto',async(id,certa,erradas)=>{
 for(const errada of erradas){const resultado=await evaluatePractice(id,errada);expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(getPracticeSolution(id)!);}
 expect(await evaluatePractice(id,certa)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
function permutar(partes:string[]):string[][]{return partes.length?partes.flatMap((parte,indice)=>permutar(partes.filter((_,posicao)=>posicao!==indice)).map(resto=>[parte,...resto])):[[]];}
it.each([
 ['html-reconstruir-tabela-dados',['abertura','cabecalho','linhas','fim-corpo','fim-tabela']],
 ['html-reconstruir-status',['controles','inicio','selecionar','reagir','fim']]
] as const)('%s confere todos os fragmentos, não um prefixo ou duplicação',async(id,ordem)=>{
 for(const tentativa of permutar([...ordem]))expect((await evaluatePractice(id,tentativa)).passed).toBe(tentativa.every((parte,indice)=>parte===ordem[indice]));
 for(const tentativa of [ordem.slice(0,-1),[...ordem,ordem[0]],[...ordem,'<script>alert(1)</script>'],[ordem[0],ordem[0],...ordem.slice(2)]])expect((await evaluatePractice(id,tentativa)).passed).toBe(false);
 expect(await evaluatePractice(id,[...ordem])).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});

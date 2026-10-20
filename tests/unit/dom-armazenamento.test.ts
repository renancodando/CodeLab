import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

it('armazenamento conserva capítulos e projeto com preparação antes da prática',()=>{
 const aula=lessons.find(item=>item.id==='armazenamento')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);expect(pausas.map(item=>item.afterBlock)).toEqual([3,6,8]);
 expect(pausas.map(item=>item.language)).toEqual(['html','html','javascript']);
 expect(aula.capitulos.find(item=>item.id==='projeto')?.paragrafos.join(' ')).toContain('preferências locais versionadas');
 expect(aula.capitulos.find(item=>item.id==='modelo-mental')?.paragrafos.join(' ')).toContain('não grave padrões automaticamente');
 const estado=freshAdaptive(),preparacao=idPreparacao(aula.id);
 estado.seenConcepts=adaptiveCatalog.activities.filter(item=>item.kind==='concept'&&item.id!==preparacao).map(item=>item.id);
 expect(buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'html'},{now:Date.parse('2026-10-20T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([preparacao,...pausas.map(item=>item.id)]);
 expect(estado.skills).toEqual({});
});
it('a previsão distingue as referências em memória do texto persistido',async()=>{
 expect(await evaluatePractice('html-armazenamento-prever-snapshot',' escuro\r\nclaro\r\nfalse ')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['escuro\nescuro\ntrue','escuro\nclaro\ntrue','claro\nclaro\nfalse','escuro claro false'])expect((await evaluatePractice('html-armazenamento-prever-snapshot',resposta)).passed).toBe(false);
});
it('uma escrita rejeitada mantém a pendência e não perde nenhuma versão',async()=>{
 for(const resposta of ['reverter','apagar','']){
  const resultado=await evaluatePractice('html-armazenamento-falha-gravacao',resposta);
  expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(getPracticeSolution('html-armazenamento-falha-gravacao')!);
 }
 expect(await evaluatePractice('html-armazenamento-falha-gravacao','preservar')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('o código inicial recebe diagnóstico de comportamento sem revelar a solução',async()=>{
 const inicial=practicesForLesson('armazenamento').find(item=>item.id==='js-armazenamento-migrar-preferencias')!.code!;
 const resultado=await evaluatePractice('js-armazenamento-migrar-preferencias',inicial);
 expect(resultado).toMatchObject({passed:false,status:'evaluated',evidence:'executed',execution:'quickjs'});
 expect(resultado.feedback).toContain('false');expect(resultado.feedback).not.toContain(getPracticeSolution('js-armazenamento-migrar-preferencias')!);
});
it.each([
 ['referência',getPracticeSolution('js-armazenamento-migrar-preferencias')!],
 ['retorno por versão','const recuperarPreferencias=texto=>{try{const d=JSON.parse(texto);if(d===null||typeof d!=="object"||Array.isArray(d)||!["claro","escuro"].includes(d.tema))return null;switch(d.versao){case 1:return {tema:d.tema,compacto:false,versao:2};case 2:return typeof d.compacto==="boolean"?{compacto:d.compacto,versao:2,tema:d.tema}:null;default:return null;}}catch{return null;}};'],
 ['validação antes de reconstruir','function recuperarPreferencias(texto){try{const d=JSON.parse(texto);if(!d||Array.isArray(d)||typeof d!=="object"||!(d.tema==="claro"||d.tema==="escuro"))return null;if(d.versao!==1&&!(d.versao===2&&typeof d.compacto==="boolean"))return null;return {compacto:d.versao===1?false:d.compacto,tema:d.tema,versao:2};}catch{return null;}}']
])('executa a solução equivalente de recuperação: %s',async(_,codigo)=>{
 expect(await evaluatePractice('js-armazenamento-migrar-preferencias',codigo)).toMatchObject({passed:true,evidence:'executed',execution:'quickjs',skillIds:['javascript.persistencia.migracao']});
});
const solucao=getPracticeSolution('js-armazenamento-migrar-preferencias')!;
it.each([
 ['descarta false',solucao.replace('compacto: dados.compacto','compacto: dados.compacto || true')],
 ['converte tipos',solucao.replace('typeof dados.compacto === "boolean"','dados.compacto !== undefined').replace('compacto: dados.compacto','compacto: Boolean(dados.compacto)')],
 ['aceita versões futuras',solucao.replace('dados.versao === 2 &&','')],
 ['aceita versão como texto',solucao.replace('dados.versao === 2','Number(dados.versao) === 2')],
 ['herda o campo da versão antiga',solucao.replace('compacto: false','compacto: dados.compacto ?? false')],
 ['vaza campos extras',solucao.replace('{ versao: 2, tema: dados.tema, compacto: dados.compacto }','{ ...dados }')],
 ['aceita tema desconhecido',solucao.replace('if (dados.tema !== "claro" && dados.tema !== "escuro") return null;','')],
 ['ignora o tema na versão atual',solucao.replace('if (dados.tema !== "claro" && dados.tema !== "escuro") return null;','if (dados.versao === 1 && dados.tema !== "claro" && dados.tema !== "escuro") return null;')],
 ['não trata JSON quebrado','function recuperarPreferencias(texto){const d=JSON.parse(texto);return d&&d.versao===2?{versao:2,tema:d.tema,compacto:d.compacto}:null;}'],
 ['resposta fixa','function recuperarPreferencias(){return {versao:2,tema:"claro",compacto:false};}'],
 ['objeto compartilhado','const resultado={};'+solucao.replace('recuperarPreferencias','validarPreferencias')+';function recuperarPreferencias(texto){const r=validarPreferencias(texto);return r?Object.assign(resultado,r):null;}']
])('o corretor detecta o defeito real: %s',async(_,codigo)=>{
 expect(codigo).not.toBe(solucao);
 const resultado=await evaluatePractice('js-armazenamento-migrar-preferencias',codigo);
 expect(resultado.passed).toBe(false);expect(resultado.evidence).toBe('executed');
 expect(resultado.feedback).not.toContain(solucao);
});

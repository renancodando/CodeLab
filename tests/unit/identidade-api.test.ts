import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

const identificador='js-identidade-autorizar-nota',solucao=getPracticeSolution(identificador)!;
it('a preparação antecede a prática de identidade e conserva a API de notas',()=>{
 const aula=lessons.find(item=>item.id==='identidade-api')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);expect(pausas.map(item=>item.afterBlock)).toEqual([3,6,8]);
 expect(aula.capitulos.find(item=>item.id==='projeto')!.paragrafos.join(' ')).toContain('anotações privadas');
 expect(aula.capitulos.find(item=>item.id==='projeto')!.paragrafos.join(' ')).toContain('revisão manual');
 const catalogo={...adaptiveCatalog,preferredLanguage:'javascript',activities:adaptiveCatalog.activities.filter(item=>item.lessonId===aula.id)},estado=freshAdaptive();
 expect(buildDailySession(estado,catalogo,{now:Date.parse('2026-10-23T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([idPreparacao(aula.id),...pausas.map(item=>item.id)]);
 expect(estado.skills).toEqual({});
});
it('prever a falha do corpo continua conceitual e distingue a identidade',async()=>{
 expect(await evaluatePractice('js-identidade-prever-corpo','Nota de Ana\r\nbia')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['Negado\nbia','Nota de Ana\nana','true\nbia']){
  const r=await evaluatePractice('js-identidade-prever-corpo',resposta);expect(r.passed).toBe(false);expect(r.feedback).not.toContain(getPracticeSolution('js-identidade-prever-corpo')!);
 }
});
it('o diagnóstico combina os requisitos sem entregar a solução',async()=>{
 for(const resposta of ['papel','dono','botao','']){const r=await evaluatePractice('js-identidade-combinar-permissoes',resposta);expect(r.passed).toBe(false);expect(r.feedback).not.toContain(getPracticeSolution('js-identidade-combinar-permissoes')!);}
 expect(await evaluatePractice('js-identidade-combinar-permissoes','conjuncao')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run',capability:'depuracao'});
});
it('a implementação começa vazia e executa a política sem autenticar',async()=>{
 const atividade=practicesForLesson('identidade-api').find(item=>item.id===identificador)!;
 expect(atividade).toMatchObject({assinaturaVazia:true,capability:'producao'});
 const r=await evaluatePractice(identificador,atividade.code!);expect(r).toMatchObject({passed:false,status:'evaluated',evidence:'executed',execution:'quickjs'});expect(r.feedback).not.toContain(solucao);
});
it.each([
 ['referência',solucao],
 ['switch e Set','function autorizarNota(p,n,a){if(p===null)return false;if(p.id!==n.donoId)return false;switch(a){case "ler":return true;case "alterar":return n.arquivada===false&&new Set(p.papeis).has("editor");default:return false;}}'],
 ['expressão booleana','const autorizarNota=(p,n,a)=>p!==null&&p.id===n.donoId&&(a==="ler"||(a==="alterar"&&!n.arquivada&&p.papeis.some(papel=>papel==="editor")));']
])('aceita uma política equivalente por comportamento: %s',async(_,codigo)=>{
 expect(await evaluatePractice(identificador,codigo)).toMatchObject({passed:true,status:'evaluated',evidence:'executed',execution:'quickjs'});
});
const defeitos:[string,string][]=[
 ['nega tudo','function autorizarNota(){return false;}'],
 ['libera tudo','function autorizarNota(){return true;}'],
 ['exige editor para ler',solucao.replace('if (acao === "ler") return true;','if (acao === "ler") return identidade.papeis.includes("editor");')],
 ['nega leitura arquivada',solucao.replace('if (acao === "ler") return true;','if (acao === "ler") return !nota.arquivada;')],
 ['ignora o arquivo na alteração',solucao.replace('!nota.arquivada && ','')],
 ['ignora o papel na alteração',solucao.replace('!nota.arquivada && identidade.papeis.includes("editor")','!nota.arquivada')],
 ['papel substitui o vínculo','function autorizarNota(p,n,a){return p!==null&&(p.id===n.donoId||p.papeis.includes("editor"))&&(a==="ler"||(a==="alterar"&&!n.arquivada));}'],
 ['libera outro dono',solucao.replace(' || identidade.id !== nota.donoId','')],
 ['converte identificadores',solucao.replace('identidade.id !== nota.donoId','Number(identidade.id) !== Number(nota.donoId)')],
 ['apara identificadores',solucao.replace('identidade.id !== nota.donoId','identidade.id.trim() !== nota.donoId.trim()')],
 ['aceita papel em outra caixa',solucao.replace('identidade.papeis.includes("editor")','identidade.papeis.some(papel=>papel.toLowerCase()==="editor")')],
 ['aceita parte do nome do papel',solucao.replace('identidade.papeis.includes("editor")','identidade.papeis.some(papel=>papel.includes("editor"))')],
 ['trata qualquer ação como leitura',solucao.replace('if (acao === "ler") return true;','if (acao !== "alterar") return true;')],
 ['devolve números em vez de booleanos','function autorizarNota(p,n,a){return Number(p!==null&&p.id===n.donoId&&(a==="ler"||(a==="alterar"&&!n.arquivada&&p.papeis.includes("editor"))));}'],
 ['muda campos extras',solucao.replace('  if (acao === "ler")','  if (nota.extra) nota.extra.titulo="Alterado";\n  if (acao === "ler")')],
 ['muda a lista de papéis',solucao.replace('  if (acao === "ler")','  identidade.papeis.sort();\n  if (acao === "ler")')],
 ['retém a primeira decisão','let salvo;'+solucao.replace('autorizarNota','calcularPolitica')+';function autorizarNota(p,n,a){return salvo??=(calcularPolitica(p,n,a));}'],
 ['reutiliza decisão de alteração sem rever o arquivo','const cache=new Map();'+solucao.replace('autorizarNota','calcularPolitica')+';function autorizarNota(p,n,a){if(p===null)return false;const chave=p.id+"|"+n.donoId+"|"+a+"|"+p.papeis.join(",");if(!cache.has(chave))cache.set(chave,calcularPolitica(p,n,a));return cache.get(chave);}']
];
it.each(defeitos)('recusa o defeito concreto: %s',async(_,codigo)=>{
 expect(codigo).not.toBe(solucao);const r=await evaluatePractice(identificador,codigo);expect(r.passed).toBe(false);expect(r.evidence).toBe('executed');expect(r.feedback).not.toContain(solucao);
});

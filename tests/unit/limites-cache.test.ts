import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

const identificador='js-cache-selecionar-copia',solucao=getPracticeSolution(identificador)!;
it('a preparação de cache antecede as pausas e conserva deduplicação e rate limit no projeto',()=>{
 const aula=lessons.find(item=>item.id==='limites-cache')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);expect(pausas.map(item=>item.afterBlock)).toEqual([3,6,8]);
 const projeto=aula.capitulos.find(item=>item.id==='projeto')!.paragrafos.join(' ');
 expect(projeto).toContain('deduplicação');expect(projeto).toContain('429');expect(projeto).toContain('rubrica manual');
 const catalogo={...adaptiveCatalog,preferredLanguage:'javascript',activities:adaptiveCatalog.activities.filter(item=>item.lessonId===aula.id)},estado=freshAdaptive();
 expect(buildDailySession(estado,catalogo,{now:Date.parse('2026-10-23T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([idPreparacao(aula.id),...pausas.map(item=>item.id)]);expect(estado.skills).toEqual({});
});
it('prever validade permanece conceitual e distingue prazo e relógio anterior',async()=>{
 expect(await evaluatePractice('js-cache-prever-validade','true\r\nfalse\r\nfalse')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['true\ntrue\nfalse','true\nfalse\ntrue','false\nfalse\nfalse']){const r=await evaluatePractice('js-cache-prever-validade',resposta);expect(r.passed).toBe(false);expect(r.feedback).not.toContain(getPracticeSolution('js-cache-prever-validade')!);}
});
it('o diagnóstico preserva os dois fatores sem considerar a escolha uma execução',async()=>{
 for(const resposta of ['separador','pessoa','filtro','']){const r=await evaluatePractice('js-cache-distinguir-chaves',resposta);expect(r.passed).toBe(false);expect(r.feedback).not.toContain(getPracticeSolution('js-cache-distinguir-chaves')!);}
 expect(await evaluatePractice('js-cache-distinguir-chaves','par')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run',capability:'depuracao'});
});
it('a seleção começa vazia e recebe correção executada sem rede',async()=>{
 const atividade=practicesForLesson('limites-cache').find(item=>item.id===identificador)!;expect(atividade).toMatchObject({assinaturaVazia:true,capability:'producao'});
 const r=await evaluatePractice(identificador,atividade.code!);expect(r).toMatchObject({passed:false,evidence:'executed',execution:'quickjs'});expect(r.feedback).not.toContain(solucao);
});
it.each([
 ['referência',solucao],
 ['constante ausente congelada','const ausente=Object.freeze({estado:"ausente",dados:null});function selecionarCache(e,c,a,f){if(e===null||e.chave!==c||a<e.salvoEm)return ausente;const atual=a-e.salvoEm<e.ttl;if(!atual&&!f)return ausente;return{dados:e.dados,estado:atual?"atual":"antigo"};}'],
 ['cópia JSON',solucao.replace('dados: entrada.dados','dados: JSON.parse(JSON.stringify(entrada.dados))')],
 ['objetos com outra ordem','const copiar=d=>d===null||typeof d!=="object"?d:Array.isArray(d)?d.map(copiar):Object.fromEntries(Object.entries(d).reverse().map(([k,v])=>[k,copiar(v)]));'+solucao.replace('selecionarCache','decidirCopia')+';function selecionarCache(e,c,a,f){const r=decidirCopia(e,c,a,f);return {dados:copiar(r.dados),estado:r.estado};}']
])('aceita a seleção equivalente: %s',async(_,codigo)=>{
 expect(await evaluatePractice(identificador,codigo)).toMatchObject({passed:true,status:'evaluated',evidence:'executed',execution:'quickjs'});
});
const defeitos:[string,string][]=[
 ['sempre ausente','function selecionarCache(){return{estado:"ausente",dados:null};}'],
 ['inclui o prazo de expiração',solucao.replace('idade < entrada.ttl','idade <= entrada.ttl')],
 ['usa prazo padrão para TTL zero',solucao.replace('idade < entrada.ttl','idade < (entrada.ttl||60000)')],
 ['troca unidade por segundos',solucao.replace('agora - entrada.salvoEm','(agora - entrada.salvoEm)/1000')],
 ['usa relógio global no lugar do parâmetro',solucao.replace('const idade = agora - entrada.salvoEm','const idade = Date.now() - entrada.salvoEm')],
 ['aceita timestamp futuro',solucao.replace(' || entrada.salvoEm > agora','')],
 ['ignora a chave',solucao.replace(' || entrada.chave !== chave','')],
 ['apara a chave',solucao.replace('entrada.chave !== chave','entrada.chave.trim() !== chave.trim()')],
 ['faz fallback de outra consulta',solucao.replace('return { estado: "ausente", dados: null };','return entrada&&falhou?{estado:"antigo",dados:entrada.dados}:{estado:"ausente",dados:null};')],
 ['trata dados falsy como ausência',solucao.replace('entrada === null','(entrada === null || !entrada.dados)')],
 ['trata chave vazia como ausência',solucao.replace('entrada === null','(entrada === null || !chave)')],
 ['ignora fallback quando há falha',solucao.replace('if (falhou) return { estado: "antigo", dados: entrada.dados };','')],
 ['usa antigo sem falha',solucao.replace('if (falhou) return','if (!falhou) return')],
 ['rotula cópia atual como antiga na falha',solucao.replace('estado: "atual"','estado: falhou?"antigo":"atual"')],
 ['rotula cópia antiga como atual',solucao.replace('estado: "antigo"','estado: "atual"')],
 ['converte dados em texto',solucao.replaceAll('dados: entrada.dados','dados: JSON.stringify(entrada.dados)')],
 ['ordena os dados recebidos',solucao.replace('  const idade','  if (Array.isArray(entrada.dados)) entrada.dados.sort();\n  const idade')],
 ['renova a data da entrada',solucao.replace('  const idade','  entrada.salvoEm = agora;\n  const idade')],
 ['apaga metadados antes de devolver',solucao.replace('  const idade','  delete entrada.extra;\n  const idade')],
 ['reutiliza um objeto mutável','let compartilhado={};'+solucao.replace('selecionarCache','decidirCopia')+';function selecionarCache(e,c,a,f){return Object.assign(compartilhado,decidirCopia(e,c,a,f));}'],
 ['copia só a quantidade de posições da lista',solucao.replaceAll('dados: entrada.dados','dados: Array.isArray(entrada.dados)?new Array(entrada.dados.length):entrada.dados')],
 ['guarda a primeira decisão por objeto','const cache=new Map();'+solucao.replace('selecionarCache','decidirCopia')+';function selecionarCache(e,c,a,f){if(!cache.has(e))cache.set(e,decidirCopia(e,c,a,f));return cache.get(e);}']
];
it.each(defeitos)('recusa o defeito concreto de cache: %s',async(_,codigo)=>{
 expect(codigo).not.toBe(solucao);const r=await evaluatePractice(identificador,codigo);expect(r.passed).toBe(false);expect(r.evidence).toBe('executed');expect(r.feedback).not.toContain(solucao);
});

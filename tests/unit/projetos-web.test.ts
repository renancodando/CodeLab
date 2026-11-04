import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {contratosProjetos} from '../../src/content/contratos-projetos';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {evaluate} from '../../src/execution/evaluate';
import {lessons} from '../../src/content/curriculum';

const aulas=['projeto-diario','projeto-tarefas','projeto-clima'];
const atividades=aulas.flatMap(practicesForLesson);
const atividade=(id:string)=>atividades.find(a=>a.id===id)!;
const respostas:Record<string,string>={'diario-prever-indice-filtrado':'n2,n3','diario-preservar-importacao':'validar-antes','tarefas-prever-contador':'1\n0','tarefas-contar-fonte-completa':'colecao','clima-prever-resposta-atrasada':'B\n28','clima-conferir-consulta':'completa'};
it('distingue seis decisões conceituais de execução e recusa distratores sem solução antecipada',async()=>{
 for(const [id,resposta] of Object.entries(respostas)){
  expect(await evaluatePractice(id,resposta)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
  expect((await evaluatePractice(id,'outra resposta')).passed).toBe(false);
  for(const opcao of atividade(id).options??[])if(opcao.id!==resposta){const resultado=await evaluatePractice(id,opcao.id);expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(getPracticeSolution(id)!);}
 }
});
it('executa referências de identidade, contador e respostas ordenadas sem simular DOM ou rede real',async()=>{
 for(const id of ['diario-prever-indice-filtrado','tarefas-prever-contador','clima-prever-resposta-atrasada']){
  const resultado=await evaluate(atividade(id).code!,'laboratorio');expect(resultado.error).toBeUndefined();expect(resultado.logs).toEqual(respostas[id].split('\n'));
 }
});
it('verifica importação atômica em sucesso, erro de parsing e formato recusado',async()=>{
 const pausa=atividade('diario-preservar-importacao');
 for(const opcao of pausa.options!){
  const codigo=pausa.code!.replace('estado.notas = [];\n    estado.notas = ler(texto);',opcao.text);
  const checks=[{texto:'{"notas":[{"id":"nova"}]}',falhar:false},{texto:'{',falhar:true},{texto:'{"notas":[]}',falhar:true}].map(caso=>({label:'importação '+caso.texto,expression:`(()=>{const anteriores=[{id:'atual'}],estado={notas:anteriores,erro:''},texto=${JSON.stringify(caso.texto)};tentarImportar(estado,texto,t=>{${caso.falhar?'throw new TypeError();':'return JSON.parse(t).notas;'}});return ${caso.falhar?"estado.notas===anteriores&&estado.erro==='Importação recusada'":"estado.notas.length===1&&estado.notas[0].id==='nova'"};})()`,expected:true}));
  const resultado=await evaluate(codigo,'aula',checks);expect(resultado.error).toBeUndefined();expect(resultado.passed).toBe(opcao.id==='validar-antes');
 }
});
it('executa os contadores em todos os filtros, vazio e todos concluídos',async()=>{
 const pausa=atividade('tarefas-contar-fonte-completa');
 for(const opcao of pausa.options!){
  const codigo=pausa.code!.replace('visiveis.filter(tarefa => !tarefa.concluida).length',opcao.text);
  const checks=[[],[{id:7,concluida:true}],[{id:8,concluida:false},{id:3,concluida:true},{id:9,concluida:false}]].flatMap(tarefas=>['todas','pendentes','concluidas'].map(filtro=>({label:filtro+' '+tarefas.length,expression:`(()=>{const tarefas=${JSON.stringify(tarefas)},antes=JSON.stringify(tarefas),obtido=resumir(tarefas,${JSON.stringify(filtro)});return obtido.pendentes===${tarefas.filter(t=>!t.concluida).length}&&obtido.visiveis.map(t=>t.id).join(',')===${JSON.stringify(tarefas.filter(t=>filtro==='todas'||(filtro==='concluidas'?t.concluida:!t.concluida)).map(t=>t.id).join(','))}&&JSON.stringify(tarefas)===antes;})()`,expected:true})));
  const resultado=await evaluate(codigo,'aula',checks);expect(resultado.error).toBeUndefined();expect(resultado.passed).toBe(opcao.id==='colecao');
 }
});
it('a guarda rejeita outra cidade, outra consulta e repetição depois do encerramento',async()=>{
 for(const opcao of atividade('clima-conferir-consulta').options!){
  const codigo='function deveIgnorar(estado,retorno){return '+opcao.text+';}';
  const checks=[{estado:{local:'B',consulta:1,carregando:true},retorno:{local:'A',consulta:1},ignorar:true},{estado:{local:'A',consulta:2,carregando:true},retorno:{local:'A',consulta:1},ignorar:true},{estado:{local:'A',consulta:2,carregando:false},retorno:{local:'A',consulta:2},ignorar:true},{estado:{local:'A',consulta:2,carregando:true},retorno:{local:'A',consulta:2},ignorar:false}].map(c=>({label:JSON.stringify(c),expression:'deveIgnorar('+JSON.stringify(c.estado)+','+JSON.stringify(c.retorno)+')',expected:c.ignorar}));
  const resultado=await evaluate(codigo,'aula',checks);expect(resultado.error).toBeUndefined();expect(resultado.passed).toBe(opcao.id==='completa');
 }
});
for(const id of ['diario-mesclar-backup','tarefas-reduzir-acao','clima-concluir-consulta'])it(id+': executa referência e recusa o início incompleto',async()=>{
 expect(await evaluatePractice(id,contratosProjetos[id].solution)).toMatchObject({passed:true,evidence:'executed',execution:'quickjs'});
 expect((await evaluatePractice(id,atividade(id).code!)).passed).toBe(false);
});
it('aceita mesclagem equivalente com Map e propriedades em outra ordem',async()=>{
 const codigo=`function mesclarDiario(lista,arquivo){if(typeof arquivo!=='string')throw TypeError();const d=JSON.parse(arquivo);if(!d||typeof d!=='object'||Array.isArray(d)||d.versao!==1||!Array.isArray(d.notas))throw TypeError();const importadas=new Map();for(const n of d.notas){if(!n||typeof n!=='object'||Array.isArray(n)||['id','texto','categoria','criadaEm'].some(k=>typeof n[k]!=='string'||n[k].trim()==='')||importadas.has(n.id))throw TypeError();importadas.set(n.id,{criadaEm:n.criadaEm,categoria:n.categoria,texto:n.texto,id:n.id});}const saida=lista.map(n=>{if(!importadas.has(n.id))return n;const nova=importadas.get(n.id);importadas.delete(n.id);return nova;});return saida.concat([...importadas.values()]);}`;
 expect((await evaluatePractice('diario-mesclar-backup',codigo)).passed).toBe(true);
});
it('aceita redução equivalente por iteração e cópia independente',async()=>{
 const codigo=`function reduzirTarefas(lista,comando){const nova=[];for(const item of lista){if(item.id===comando.id&&comando.tipo==='remover')continue;const copia=Object.assign({},item);if(item.id===comando.id)copia.concluida=!item.concluida;nova.push(copia);}return nova;}`;
 expect((await evaluatePractice('tarefas-reduzir-acao',codigo)).passed).toBe(true);
});
it('aceita conclusão equivalente com cópias de dados e ordem diferente de campos',async()=>{
 const codigo=`function concluirLeitura(e,r){if(e.carregando&&e.local===r.local&&e.consulta===r.consulta){const n=Object.assign({},e);n.erro=r.tipo==='falha'?r.mensagem:'';n.carregando=false;if(r.tipo==='sucesso')n.dados={capturadoEm:r.dados.capturadoEm,origem:r.dados.origem,temperatura:r.dados.temperatura};return n;}return {...e};}`;
 expect((await evaluatePractice('clima-concluir-consulta',codigo)).passed).toBe(true);
});
const diario=contratosProjetos['diario-mesclar-backup'].solution;
const diariosErrados={
 idsEspeciais:diario.replace("if(indice<0)saida.push(nota);","if(indice<0){if(nota.id!=='__proto__')saida.push(nota);}"),
 apagar:diario.replace('const saida=atuais.slice();','const saida=[];'),
 duplicar:diario.replace('else saida[indice]=nota;','else saida.push(nota);'),
 extras:diario.replace('return {id:nota.id,texto:nota.texto,categoria:nota.categoria,criadaEm:nota.criadaEm};','return {...nota};'),
 mutacao:diario.replace('const saida=atuais.slice();','const saida=atuais;'),
 tipoDeErro:diario.replace('const documento=JSON.parse(texto);','let documento;try{documento=JSON.parse(texto);}catch{throw new TypeError();}'),
 repetidos:diario.replace('||ids.has(nota.id)',''),
 limparNaRecusa:diario.replace('const documento=JSON.parse(texto);',"let documento;try{documento=JSON.parse(texto);}catch(e){atuais.length=0;throw e;}"),
 compartilhar:diario.replace('function mesclarDiario','function importar')+`\nconst unica=[];function mesclarDiario(a,t){const itens=importar(a,t);unica.length=0;unica.push(...itens);return unica;}`
};
const tarefa=contratosProjetos['tarefas-reduzir-acao'].solution;
const tarefasErradas={
 sempreConcluir:tarefa.replace('!tarefa.concluida','true'),
 indice:tarefa.replace('tarefa.id===acao.id','tarefas.indexOf(tarefa)===acao.id'),
 perderCampos:tarefa.replace('{...tarefa,concluida:!tarefa.concluida}','{id:tarefa.id,titulo:tarefa.titulo,concluida:!tarefa.concluida}'),
 removerErrada:tarefa.replace('tarefa.id!==acao.id','tarefa.id===acao.id'),
 mutacao:tarefa.replace('{...tarefa,concluida:!tarefa.concluida}',"Object.assign(tarefa,{concluida:!tarefa.concluida})"),
 mesmoArray:tarefa.replace("if(acao.tipo==='remover')", "if(!tarefas.some(t=>t.id===acao.id))return tarefas;if(acao.tipo==='remover')"),
 compartilhar:tarefa.replace('function reduzirTarefas','function aplicar')+`\nconst unica=[];function reduzirTarefas(t,a){const proxima=aplicar(t,a);unica.length=0;unica.push(...proxima);return unica;}`
};
const clima=contratosProjetos['clima-concluir-consulta'].solution;
const climasErrados={
 sucessoAntigo:clima.replace('retorno.consulta!==estado.consulta',"(retorno.tipo==='falha'&&retorno.consulta!==estado.consulta)"),
 sucessoRepetido:clima.replace('!estado.carregando',"(!estado.carregando&&retorno.tipo==='falha')"),
 soNumero:clima.replace('retorno.local!==estado.local||',''),
 soCidade:clima.replace('retorno.consulta!==estado.consulta||',''),
 repeticao:clima.replace('||!estado.carregando',''),
 apagarNaFalha:clima.replace('erro:retorno.mensagem','dados:null,erro:retorno.mensagem'),
 inventarZero:clima.replace('dados:retorno.dados',"dados:{...retorno.dados,temperatura:retorno.dados.temperatura||null}"),
 atualizaRelogio:clima.replace('dados:retorno.dados',"dados:{...retorno.dados,capturadoEm:999999}"),
 mutacao:clima.replace('function concluirLeitura(estado, retorno) {','function concluirLeitura(estado, retorno) {estado.erro="";'),
 compartilhar:clima.replace('function concluirLeitura','function aplicar')+`\nconst unico={};function concluirLeitura(e,r){for(const k of Object.keys(unico))delete unico[k];return Object.assign(unico,aplicar(e,r));}`
};
for(const [id,base,variantes] of [['diario-mesclar-backup',diario,diariosErrados],['tarefas-reduzir-acao',tarefa,tarefasErradas],['clima-concluir-consulta',clima,climasErrados]] as const)for(const [nome,codigo] of Object.entries(variantes))it(id+' recusa '+nome,async()=>{
 expect(codigo).not.toBe(base);const resultado=await evaluatePractice(id,codigo);expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(base);
});
it('mantém projeto independente e teoria original nas três aulas, com prática distribuída',()=>{
 for(const id of aulas){const aula=lessons.find(l=>l.id===id)!;expect(aula.capitulos).toHaveLength(12);expect(aula.exercise.length).toBeGreaterThan(40);const pausas=practicesForLesson(id);expect(pausas.map(p=>p.afterBlock)).toEqual([3,6,8]);expect(pausas[2]).toMatchObject({capability:'producao',assinaturaVazia:true});}
 expect(lessons.find(l=>l.id==='projeto-diario')!.code).toContain('exportação');expect(lessons.find(l=>l.id==='projeto-tarefas')!.code).toContain('filter');expect(lessons.find(l=>l.id==='projeto-clima')!.code).toContain('abortar consulta anterior');
});

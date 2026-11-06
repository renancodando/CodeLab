import {it,expect} from 'vitest';
import {runInNewContext} from 'node:vm';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {evaluate} from '../../src/execution/evaluate';

it.each([
 ['js-async-prever-filas','js-assincrono','A\nE\nB\nC\nD'],
 ['js-promessas-prever-falha-parcial','js-promessas-contratos','iniciadas\nfalhou\ncontinua']
])('%s executa a referência em QuickJS e Node, sem executar a resposta conceitual',async(id,aula,saida)=>{
 const codigo=practicesForLesson(aula).find(p=>p.id===id)!.code!;
 const referencia=await evaluate(codigo,'laboratorio');expect(referencia.error).toBeUndefined();expect(referencia.logs.join('\n')).toBe(saida);
 const linhas:string[]=[];runInNewContext(codigo,{console:{log:(valor:unknown)=>linhas.push(String(valor))}});for(let i=0;i<20;i++)await Promise.resolve();expect(linhas.join('\n')).toBe(saida);
 expect(await evaluatePractice(id,saida)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});expect((await evaluatePractice(id,saida.split('\n').reverse().join('\n'))).passed).toBe(false);
});
const limpeza={label:'espera, retorno e liberação única',aguardar:true,expected:true,expression:`(async()=>{const eventos=[],dado={id:1};const p=usarRecurso(()=>Promise.resolve().then(()=>{eventos.push('fim');return dado;}),()=>eventos.push('liberar'));if(eventos.length)return false;if(await p!==dado||eventos.join(',')!=='fim,liberar')return false;for(const modo of ['valor','rejeicao','sincrono']){const motivo={modo};let liberacoes=0,consultas=0;try{const r=await usarRecurso(()=>{consultas++;if(modo==='sincrono')throw motivo;return modo==='valor'?0:Promise.reject(motivo);},()=>liberacoes++);if(modo!=='valor'||r!==0)return false;}catch(erro){if(modo==='valor'||erro!==motivo)return false;}if(liberacoes!==1||consultas!==1)return false;}return true;})()`};
const observacao={label:'sucesso ou motivo original',aguardar:true,expected:true,expression:`(async()=>{for(const dado of [null,false,0,'',{id:1}]){let vezes=0;if(await observar(Promise.resolve(dado),()=>vezes++)!==dado||vezes)return false;}for(const motivo of [null,0,'falhou',{id:9}]){const vistos=[];try{await observar(Promise.reject(motivo),erro=>vistos.push(erro));return false;}catch(erro){if(erro!==motivo||vistos.length!==1||vistos[0]!==motivo)return false;}}return true;})()`};
it.each([
 ['js-async-liberar-apos-espera','js-assincrono','aguardar',limpeza],
 ['js-promessas-conservar-rejeicao','js-promessas-contratos','relancar',observacao]
] as const)('%s verifica as alternativas executando seu comportamento',async(id,aula,certa,caso)=>{
 for(const opcao of practicesForLesson(aula).find(p=>p.id===id)!.options!){expect((await evaluatePractice(id,opcao.id)).passed).toBe(opcao.id===certa);const r=await evaluate(opcao.text,'aula',[caso]);expect(r.passed,opcao.id+': '+r.error).toBe(opcao.id===certa);}
});
const dobro='js-async-dobrar-todos',grupo='js-promessas-limitar-partidas',solucaoDobro=getPracticeSolution(dobro)!,solucaoGrupo=getPracticeSolution(grupo)!;
it.each([dobro,grupo])('%s confere a solução e recusa a assinatura vazia',async id=>{
 const pausa=[...practicesForLesson('js-assincrono'),...practicesForLesson('js-promessas-contratos')].find(p=>p.id===id)!;
 expect((await evaluatePractice(id,pausa.code!)).passed).toBe(false);const r=await evaluatePractice(id,getPracticeSolution(id)!);expect(r.passed,r.feedback).toBe(true);expect(r).toMatchObject({evidence:'executed',execution:'quickjs'});
});
it('aceita encadeamento equivalente para o dobro',async()=>{
 const r=await evaluatePractice(dobro,'function dobrarTodos(valores){return Promise.resolve().then(()=>{const saida=[];for(const n of valores){if(!Number.isFinite(n)||!Number.isFinite(n+n))throw new TypeError();saida.push(n+n);}return saida;});}');expect(r.passed,r.feedback).toBe(true);
});
it('aceita consumidores recursivos e outra ordem de propriedades',async()=>{
 const codigo=`function executarComLimite(itens,limite,tarefa){if(!Number.isSafeInteger(limite)||limite<1)return Promise.reject(new TypeError());const r=[];let proximo=0;function consumir(){const i=proximo++;if(i>=itens.length)return Promise.resolve();return Promise.resolve().then(()=>tarefa(itens[i],i)).then(valor=>{r[i]={value:valor,status:'fulfilled'};},motivo=>{r[i]={reason:motivo,status:'rejected'};}).then(consumir);}return Promise.all(Array.from({length:Math.min(limite,itens.length)},consumir)).then(()=>r);}`;
 const r=await evaluatePractice(grupo,codigo);expect(r.passed,r.feedback).toBe(true);
});
const dobrosErrados={
 arredondar:solucaoDobro.replace('return valor * 2','return Number((valor * 2).toFixed(2))'),
 sincrono:'function dobrarTodos(v){return v.map(n=>n*2);}',
 converter:'async function dobrarTodos(v){return v.map(n=>{if(!Number.isFinite(Number(n)*2))throw new Error();return Number(n)*2;});}',
 ignorarInvalidos:'async function dobrarTodos(v){return v.filter(Number.isFinite).map(n=>n*2);}',
 overflow:solucaoDobro.replace(' || !Number.isFinite(valor * 2)',''),
 respostaFixa:'async function dobrarTodos(){return [];}',
 esparso:solucaoDobro.replace('return Promise.all','if(valores.length>4)return new Array(valores.length);return Promise.all'),
 mutacao:solucaoDobro.replace('return Promise.all','valores.sort();return Promise.all')
};
for(const [nome,codigo] of Object.entries(dobrosErrados))it('dobro recusa '+nome,async()=>{expect(codigo).not.toBe(solucaoDobro);const r=await evaluatePractice(dobro,codigo);expect(r.passed).toBe(false);expect(r.feedback).not.toContain(solucaoDobro);});
const gruposErrados={
 semLimite:solucaoGrupo.replace('Math.min(limite, itens.length)','itens.length'),
 limiteFixo:solucaoGrupo.replace('Math.min(limite, itens.length)','Math.min(2, itens.length)'),
 emSerie:solucaoGrupo.replace('Math.min(limite, itens.length)','Math.min(1, itens.length)'),
 semEspera:solucaoGrupo.replace('value:await tarefa','value:tarefa'),
 falhaComoSucesso:solucaoGrupo.replace('status:"rejected", reason:motivo','status:"fulfilled", value:motivo'),
 indiceAdiantado:solucaoGrupo.replace('const indice = proximo++','const indice = ++proximo'),
 ordemConclusao:solucaoGrupo.replace('const resultados = new Array(itens.length)','const resultados = []').replace('resultados[indice] = {status:"fulfilled", value:await tarefa(itens[indice], indice)}','resultados.push({status:"fulfilled", value:await tarefa(itens[indice], indice)})'),
 semValidacao:solucaoGrupo.replace('if (!Number.isSafeInteger(limite) || limite < 1) throw new TypeError("limite inválido");','limite = limite || 1;'),
 compartilhado:'const compartilhado=[];'+solucaoGrupo.replace('const resultados = new Array(itens.length)','const resultados = compartilhado')
};
for(const [nome,codigo] of Object.entries(gruposErrados))it('grupo recusa '+nome,async()=>{expect(codigo).not.toBe(solucaoGrupo);const r=await evaluatePractice(grupo,codigo);expect(r.passed).toBe(false);expect(r.feedback).not.toContain(solucaoGrupo);});

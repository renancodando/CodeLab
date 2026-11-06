import {it,expect} from 'vitest';
import {runInNewContext} from 'node:vm';
import {learningPaths} from '../../src/content/project-paths';
import {evaluate} from '../../src/execution/evaluate';
const percursos=learningPaths.filter(p=>['algoritmos','estruturas-dados','testes'].includes(p.id));
const etapa=(percurso:string,id:string)=>percursos.find(p=>p.id===percurso)!.stages.find(e=>e.id===id)!;
const executar=(codigo:string,expressao:string,contexto:Record<string,unknown>={})=>runInNewContext(codigo+'\n'+expressao,contexto,{timeout:500});
for(const percurso of percursos)for(const e of percurso.stages)it('referências completas executam no QuickJS: '+percurso.id+'/'+e.id,async()=>{
 for(const codigo of new Set([e.example,e.solution])){const r=await evaluate(codigo,'laboratorio');expect(r.error).toBeUndefined();expect(r.logs.length).toBeGreaterThan(0);}
});
it('busca respeita a fronteira inteira e o custo de leituras sem cronometrar',()=>{
 const codigo=etapa('algoritmos','busca-binaria').example;
 for(const lista of [[],[-2],[-2,0,0,7],[1,1,1]])for(const alvo of [-3,0,1,8]){
  const i=executar(codigo,'limiteInferior(lista,alvo)',{lista:Object.freeze(lista),alvo});expect(lista.slice(0,i).every(v=>v<alvo)).toBe(true);expect(i===lista.length||lista[i]>=alvo).toBe(true);
 }
 let leituras=0;const lista=new Proxy(Array.from({length:65535},(_,i)=>i),{get(alvo,chave,receptor){if(typeof chave==='string'&&/^\d+$/.test(chave))leituras++;return Reflect.get(alvo,chave,receptor);}});
 expect(executar(codigo,'limiteInferior(lista,65536)',{lista})).toBe(65535);expect(leituras).toBeLessThanOrEqual(16);
});
it('o caminho completo aceita alcance, raiz única e destino desconectado',()=>{
 const codigo=etapa('algoritmos','busca-largura').solution,grafo={A:['B','C'],B:['D','A'],C:['D'],D:[],X:[]};
 const caminho=executar(codigo,"caminhoMinimo(entrada,'A','D')",{entrada:grafo});expect(caminho[0]).toBe('A');expect(caminho.at(-1)).toBe('D');expect(caminho).toHaveLength(3);for(let i=1;i<caminho.length;i++)expect(grafo[caminho[i-1] as keyof typeof grafo]).toContain(caminho[i]);
 expect(executar(codigo,"caminhoMinimo(entrada,'A','X')",{entrada:grafo})).toBeNull();expect(executar(codigo,"caminhoMinimo(entrada,'A','A')",{entrada:grafo})).toEqual(['A']);
});
it('fila conserva valores falsy, ausência e ordem após compactação',()=>{
 const codigo=etapa('estruturas-dados','fila').example;const origem=Object.freeze([false,'',0,null,undefined]);
 expect(executar(codigo,'(()=>{const q=criarFila(origem),saida=[q.retirar(),q.retirar()];q.compactar();saida.push(q.tamanho(),q.retirar(),q.retirar(),q.retirar(),q.retirar(),q.tamanho());return saida;})()',{origem})).toEqual([{encontrado:true,valor:false},{encontrado:true,valor:''},3,{encontrado:true,valor:0},{encontrado:true,valor:null},{encontrado:true,valor:undefined},{encontrado:false},0]);expect(origem).toHaveLength(5);
});
it('frequências conservam identidade de objetos e normalização explícita',()=>{
 const codigo=etapa('estruturas-dados','frequencias').example;const a={x:1},b={x:1};expect(executar(codigo,'Array.from(frequencias([a,b,a,0,0]).values())',{a,b})).toEqual([2,1,2]);
 expect(executar(etapa('estruturas-dados','frequencias').solution,"Array.from(contarNomes(['JS','js','constructor'],true))")).toEqual([['js',2],['constructor',1]]);
});
it('o oráculo aceita o controle e distingue quatro defeitos de ordenação',()=>{
 const codigo=etapa('testes','oraculos').example;
 expect(executar(codigo,'verificarOrdenacao(ordenar)')).toEqual([]);
 for(const [funcao,mensagem] of [["itens=>[]",'Quantidade'],["itens=>[...new Set(itens)].sort((a,b)=>a-b)",'Frequências'],["itens=>[...itens].sort()",'Ordem numérica'],["itens=>itens.sort((a,b)=>a-b)",'Entrada foi alterada']])expect(executar(codigo,'verificarOrdenacao('+funcao+').join(";")')).toContain(mensagem);
});
it('os testes de fronteira recusam comparação, arredondamento e validação defeituosos',()=>{
 const codigo=etapa('testes','fronteiras').solution;expect(executar(codigo,'conferirPagamento(pagar)')).toBe('fronteiras conferidas');
 for(const [corpo,erro] of [["total=>total>10000?Math.round(total*0.9):total","10000"],["total=>total>=10000?Math.trunc(total*0.9):total","10001"],["total=>total>=10000?Math.round(total*0.9):total","Entrada inválida foi aceita"]])expect(()=>executar(codigo,'conferirPagamento('+corpo+')')).toThrow(erro);
});
it('testes assíncronos aguardam rejeição e detectam resposta antiga sem timer',async()=>{
 const codigo=etapa('testes','assincronos').example.split('conferirAssincrono().then')[0];await expect(executar(codigo,'conferirAssincrono()')).resolves.toBe('Rejeições e ordem de respostas conferidas');
 await expect(executar(codigo.replace('if(versao===ultima)mostrar(dados);','mostrar(dados);'),'conferirAssincrono()')).rejects.toThrow('Resposta antiga');
 await expect(executar(codigo,"conferirRejeicao(async()=>{},'HTTP 404')")).rejects.toThrow('deveria rejeitar');await expect(executar(codigo,"conferirRejeicao(async()=>{throw new Error('outra causa');},'HTTP 404')")).rejects.toThrow('outra causa');
});

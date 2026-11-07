import {it,expect} from 'vitest';
import {runInNewContext} from 'node:vm';
import {createServer} from 'node:http';
import {learningPaths} from '../../src/content/project-paths';
import {evaluate} from '../../src/execution/evaluate';
const etapa=(p:string,id:string)=>learningPaths.find(c=>c.id===p)!.stages.find(e=>e.id===id)!;
const executar=(codigo:string,expressao:string,contexto:Record<string,unknown>={})=>runInNewContext(codigo+'\n'+expressao,contexto,{timeout:500});
for(const [p,id,esperado] of [['redes','http','[]'],['redes','cancelamento','["resultado B"]'],['redes','idempotencia','Mesma intenção preservada e conflito recusado'],['arquitetura','dominio','7500'],['arquitetura','adaptadores','{"version":1}']])it('referência executável de aplicação '+p+'/'+id,async()=>{
 const e=etapa(p,id);for(const codigo of new Set([e.example,e.solution])){const r=await evaluate(codigo,'laboratorio');expect(r.error).toBeUndefined();expect(r.logs.join('\n')).toContain(esperado);expect(r.logs.join('\n')).not.toContain('Falha na conferência:');}
});
it('transporte é conferido em HTTP real com status, representação e ausência de corpo',async()=>{
 const pedidos:string[]=[],servidor=createServer((pedido,resposta)=>{const url=new URL(pedido.url!,'http://127.0.0.1'),caso=Number(url.searchParams.get('caso'));pedidos.push(pedido.method+' '+url.pathname);resposta.setHeader('Content-Type','application/json');resposta.statusCode=caso===1?404:caso===4?204:200;resposta.end(caso===0?'[]':caso===1?'{"erro":"ausente"}':caso===2?'{"itens":[]}':caso===3?'{':'');});
 await new Promise<void>((resolver,rejeitar)=>{servidor.once('error',rejeitar);servidor.listen(0,'127.0.0.1',resolver);});
 try{
  const endereco=servidor.address();if(!endereco||typeof endereco==='string')throw Error('Porta local não encontrada');const ler=executar(etapa('redes','http').example,'lerItens',{console:{log:()=>{}}}) as (transporte:(caminho:string)=>Promise<Response>)=>Promise<unknown>;
  const consultar=(caso:number)=>ler(caminho=>{expect(caminho).toBe('/itens');return fetch('http://127.0.0.1:'+endereco.port+caminho+'?caso='+caso,{signal:AbortSignal.timeout(5000)});});
  await expect(consultar(0)).resolves.toEqual([]);await expect(consultar(1)).rejects.toThrow('HTTP 404');await expect(consultar(2)).rejects.toThrow('Lista esperada');for(const caso of [3,4])await expect(consultar(caso)).rejects.toMatchObject({name:'SyntaxError'});expect(pedidos).toEqual(Array(5).fill('GET /itens'));
 }finally{servidor.closeAllConnections();await new Promise<void>((resolver,rejeitar)=>servidor.close(erro=>erro?rejeitar(erro):resolver()));}
});
it('erro antigo não substitui sucesso recente, inclusive no diagnóstico QuickJS',async()=>{
 const codigo=etapa('redes','cancelamento').example.replaceAll('if(minha!==geracao)return;','');const r=await evaluate(codigo,'laboratorio');expect(r.logs.join('\n')).toContain('Falha na conferência: Resposta antiga alterou a tela');expect(r.logs).not.toContain('["resultado B"]');
});
it('reservas validam intenção, conflito, isolamento e resultado imutável',()=>{
 const codigo=etapa('redes','idempotencia').example;expect(executar(codigo,"(()=>{const a=criarReservas(),b=criarReservas(),primeira=a('p',2);return [a('p',2)===primeira,b('p',2)===primeira,Object.isFrozen(primeira)];})()")).toEqual([true,false,true]);
 for(const expressao of ["reservar('',1)","reservar('p',0)","reservar('p',0.5)","reservar('p',NaN)"])expect(()=>executar(codigo,expressao)).toThrow();expect(()=>executar(codigo,"reservar('p',1);reservar('p',2)")).toThrow('Conflito de chave');
});
it('a orquestração publica só depois de validar e confirmar a gravação',()=>{
 const codigo=etapa('arquitetura','dominio').solution;let chamadas=0;const repositorio={salvar(){chamadas++;throw new Error('Sem espaço');}};
 expect(()=>executar(codigo,'efetivarTransferencia(100,101,repositorio)',{repositorio})).toThrow('Saldo insuficiente');expect(chamadas).toBe(0);expect(()=>executar(codigo,'efetivarTransferencia(100,20,repositorio)',{repositorio})).toThrow('Sem espaço');expect(chamadas).toBe(1);
});
it('envelope inválido e falha do adaptador conservam o documento anterior',()=>{
 const codigo=etapa('arquitetura','adaptadores').solution,atual={version:1,nome:'Anterior'};let chamadas=0;const repositorio={salvar(){chamadas++;throw new Error('Sem espaço');}};
 for(const texto of ['{','{"version":99}','null','[]']){const r=executar(codigo,'substituirCaderno(repositorio,atual,texto)',{repositorio,atual,texto});expect(r.ok).toBe(false);expect(r.documento).toBe(atual);}expect(chamadas).toBe(0);
 const falha=executar(codigo,'substituirCaderno(repositorio,atual,\'{"version":1,"nome":"Novo"}\')',{repositorio,atual});expect(falha).toMatchObject({ok:false,motivo:'Sem espaço'});expect(falha.documento).toBe(atual);expect(chamadas).toBe(1);expect(atual.nome).toBe('Anterior');
 const gravados:unknown[]=[],sucesso=executar(codigo,'substituirCaderno(repositorio,atual,\'{"version":1,"nome":"Novo"}\')',{repositorio:{salvar:(d:unknown)=>gravados.push(d)},atual});expect(sucesso).toMatchObject({ok:true,documento:{version:1,nome:'Novo'}});expect(gravados).toHaveLength(1);expect(atual.nome).toBe('Anterior');
});

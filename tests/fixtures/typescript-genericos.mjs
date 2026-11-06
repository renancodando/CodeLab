import {mkdir,writeFile,access} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import ts from 'typescript';

export async function verificarGenericosTypeScript(raiz,atividades,obterSolucao){
 assert.equal(ts.version,'5.9.3');
 const atividade=id=>atividades.find(a=>a.id===id),casos=[];
 const declaracoes=(id,prefixo,saidas,diagnosticos)=>{
  const partes=atividade(id).code.split(/\n\/\/ [ABC]\n/);assert.equal(partes.length,4,id);
  for(let i=0;i<3;i++)casos.push({id:prefixo+'-'+i,codigo:partes[0]+'\n'+partes[i+1]+(saidas[i]?'\nconsole.log('+saidas[i][0]+');':''),...(diagnosticos[i]?{diagnostico:diagnosticos[i]}:{saida:[saidas[i][1]]})});
 };
 declaracoes('ts-genericos-prever-retorno','manter',[['texto','Lia'],null,['numero','7']],[null,2322,null]);
 declaracoes('ts-relacoes-prever-ausencia','opcional',[['opcional','undefined'],null,null],[null,2322,2345]);
 const fabrica=`const criado=criar(()=>({id:7,nome:"Lia"}));const nome:string=criado.nome;const literal:7=criar(()=>({id:7 as const,ativo:true})).id;if(nome!=="Lia"||literal!==7)throw new Error("fabrica");console.log(nome);console.log(literal);`;
 for(const opcao of atividade('ts-genericos-construir-subtipo').options)casos.push({id:'fabrica-'+opcao.id,codigo:opcao.text+'\n'+fabrica,...(opcao.id==='fixo'?{diagnostico:2322}:opcao.id==='tipo-amplo'?{diagnostico:2339}:opcao.id==='forcar-tipo'?{falhaExecucao:'fabrica'}:{saida:['Lia','7']})});
 const ler=`const pessoa={id:7,nome:"Lia"};const id:number=ler(pessoa,"id");const nome:string=ler(pessoa,"nome");function negativas(){
 // @ts-expect-error chave inexistente
 ler(pessoa,"ausente");
 // @ts-expect-error id não é string
 const texto:string=ler(pessoa,"id");void texto;
}void negativas;if(id!==7||nome!=="Lia")throw new Error("leitura");console.log(id);console.log(nome);`;
 for(const opcao of atividade('ts-relacoes-preservar-chave').options)casos.push({id:'ler-'+opcao.id,codigo:opcao.text+'\n'+ler,...(opcao.id==='relacionar'?{saida:['7','Lia']}:{diagnostico:opcao.id==='qualquer'?2578:opcao.id==='somente-texto'?2345:2322})});
 const transformar=`const origem=Object.freeze([1,2]);const textos:string[]=transformar(origem,n=>"n="+n);textos.push("fim");function negativas(){
 // @ts-expect-error string[] não vira number[]
 const errado:number[]=transformar(origem,n=>String(n));void errado;
}void negativas;const vazio=transformar([] as readonly number[],n=>String(n));if(origem.length!==2||origem[0]!==1||vazio.length!==0||JSON.stringify(textos)!=='["n=1","n=2","fim"]')throw new Error("transformar");console.log(JSON.stringify(textos));`;
 for(const valor of ['U[]','Array<U>','T[]','unknown[]','any[]'])casos.push({id:'transformar-'+valor.replace(/[^a-zA-Z]/g,''),codigo:atividade('ts-relacoes-completar-transformacao').code.replace('____',valor)+'\n'+transformar,...(['U[]','Array<U>'].includes(valor)?{saida:['["n=1","n=2","fim"]']}:{diagnostico:valor==='any[]'?2578:2322})});
 const grupos=`type Item={id:number;grupo:"a"|"b"|"__proto__"|"constructor"};const itens:readonly Item[]=[{id:1,grupo:"a"},{id:2,grupo:"b"},{id:3,grupo:"a"},{id:4,grupo:"__proto__"},{id:5,grupo:"constructor"}];Object.freeze(itens);let chamadas=0;const grupos:Map<Item["grupo"],Item[]>=agrupar(itens,item=>{chamadas++;return item.grupo;});if(chamadas!==5||grupos.get("a")![0]!==itens[0]||grupos.get("a")![1]!==itens[2])throw new Error("ordem");grupos.get("a")!.push({id:99,grupo:"a"});if(grupos.get("b")!.length!==1||itens.length!==5)throw new Error("listas");const vazio=agrupar<Item,Item["grupo"]>([],item=>item.grupo);const outro=agrupar([itens[0]],item=>item.grupo);if(vazio.size!==0||outro===grupos||outro.get("a")===grupos.get("a"))throw new Error("independencia");console.log(JSON.stringify([...grupos].map(([chave,valores])=>[chave,valores.map(v=>v.id)])));`;
 casos.push({id:'grupos-corretos',codigo:obterSolucao('ts-genericos-montar-grupos')+'\n'+grupos,saida:['[["a",[1,3,99]],["b",[2]],["__proto__",[4]],["constructor",[5]]]']});
 casos.push({id:'grupos-inicio-desordenado',codigo:atividade('ts-genericos-montar-grupos').lines.map(l=>l.code).join('\n'),diagnostico:2448});
 const condicional=atividade('ts-avancados-prever-distribuicao').code;
 casos.push({id:'distribuicao-aceita-string',codigo:condicional+'\nconst itens:A=["Lia"];console.log(itens[0]);',saida:['Lia']});
 casos.push({id:'distribuicao-rejeita-numero',codigo:condicional+'\nconst itens:A=[7];',diagnostico:2322});
 casos.push({id:'tupla-rejeita-uniao',codigo:condicional+'\nconst itens:B=["Lia"];',diagnostico:2322});
 casos.push({id:'tupla-aceita-string-inteira',codigo:condicional+'\nconst itens:EmBloco<string>=["Lia"];console.log(itens[0]);',saida:['Lia']});
 const evento=`type Modelo={nome:string;pontos:number};const pontos:Evento<Modelo>={nome:"alterou:pontos",valor:4};const nome:Evento<Modelo>={nome:"alterou:nome",valor:"Lia"};
 // @ts-expect-error nome e valor não correspondem
 const trocado:Evento<Modelo>={nome:"alterou:pontos",valor:"4"};void trocado;console.log(pontos.valor);console.log(nome.valor);`;
 for(const opcao of atividade('ts-avancados-relacionar-evento').options)casos.push({id:'evento-'+opcao.id,codigo:opcao.text+'\n'+evento,...(opcao.id==='por-campo'?{saida:['4','Lia']}:{diagnostico:opcao.id==='so-texto'?2322:2578})});
 for(const caso of casos){
  const pasta=join(raiz,'genericos-'+caso.id);await mkdir(pasta);
  const entrada=join(pasta,'entrada.ts'),ambiente=join(pasta,'ambiente.d.ts');await writeFile(entrada,caso.codigo);await writeFile(ambiente,'declare const console: { log(...valores: unknown[]): void };');
  const programa=ts.createProgram([entrada,ambiente],{strict:true,noEmitOnError:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None,types:[],lib:['lib.es2022.d.ts'],outDir:join(pasta,'dist')});
  assert.deepEqual(programa.getSyntacticDiagnostics(),[],caso.id);
  const erros=ts.getPreEmitDiagnostics(programa).filter(d=>d.category===ts.DiagnosticCategory.Error),emissao=programa.emit(),destino=join(pasta,'dist','entrada.js');
  if(caso.diagnostico){assert.ok(erros.some(d=>d.code===caso.diagnostico),caso.id+': '+erros.map(d=>d.code+':'+ts.flattenDiagnosticMessageText(d.messageText,' ')).join(';'));assert.equal(emissao.emitSkipped,true,caso.id);await assert.rejects(access(destino),{code:'ENOENT'});}
  else{assert.deepEqual(erros.map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')),[],caso.id);assert.equal(emissao.emitSkipped,false,caso.id);const resultado=spawnSync(process.execPath,[destino],{encoding:'utf8',timeout:10000,maxBuffer:256*1024});assert.ifError(resultado.error);if(caso.falhaExecucao){assert.equal(resultado.status,1,caso.id);assert.ok(resultado.stderr.includes(caso.falhaExecucao),caso.id);}else{assert.equal(resultado.status,0,caso.id+': '+resultado.stderr);assert.deepEqual(resultado.stdout.trim().split(/\r?\n/),caso.saida,caso.id);}}
 }
 return casos.length;
}

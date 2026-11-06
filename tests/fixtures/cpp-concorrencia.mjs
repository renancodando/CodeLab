import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';

export async function verificarConcorrenciaCpp(raiz,atividades,obterSolucao){
 const atividade=id=>{const a=atividades.find(a=>a.id===id);assert(a,id);return a;};
 const texto=await readFile('src/content/deep/cpp.ts','utf8'),inicio=texto.indexOf('{',texto.indexOf('export default'));
 const curso=JSON.parse(texto.slice(inicio,texto.lastIndexOf('}')+1));
 const aula=curso.lessons.find(a=>a.id==='cpp-concorrencia-engenharia');assert(aula);
 const previsao=atividade('cpp-engenharia-prever-juncao'),atomico=atividade('cpp-engenharia-atualizar-contador'),ligacao=atividade('cpp-engenharia-ligar-unidades');
 const pasta=join(raiz,'cpp-concorrencia');await mkdir(pasta);
 const flags=['-std=c++20','-Wall','-Wextra','-Wpedantic','-Werror','-pthread','-UNDEBUG'];
 const normalizar=texto=>texto.replace(/\r\n/g,'\n');
 const compilar=(argumentos,cwd=pasta)=>{const r=spawnSync(process.env.CXX??'g++',argumentos,{cwd,encoding:'utf8',timeout:90000,maxBuffer:256*1024});if(r.error)throw r.error;return r;};
 const executar=(arquivo,cwd=pasta)=>{const r=spawnSync(arquivo,[],{cwd,encoding:'utf8',timeout:10000,maxBuffer:32768});if(r.error)throw r.error;assert.equal(r.status,0,r.stdout+r.stderr);return normalizar(r.stdout);};
 const nomeBinario=process.platform==='win32'?'programa.exe':'programa';
 const casos=[
  {id:'exemplo-original-atomico',codigo:aula.code,saida:'4000\n'},
  {id:'solucao-original-parciais',codigo:aula.solution,saida:''},
  {id:'juncao-e-captura',codigo:previsao.code,saida:obterSolucao(previsao.id)+'\n'},
  {id:'outros-parciais',codigo:previsao.code.replace('(i+1)*4','(i+1)*7'),saida:'42\n14\n'}
 ];
 assert.equal(obterSolucao(atomico.id),atomico.code.replace('total.store(anterior+1);',atomico.options.find(o=>o.id==='incremento').text));
 for(const opcao of atomico.options)casos.push({id:'atomico-'+opcao.id,codigo:atomico.code.replace('total.store(anterior+1);',opcao.text),saida:['incremento','preincremento'].includes(opcao.id)?'2\n12\n':'1\n11\n'});
 for(const caso of casos){
  const dir=join(pasta,caso.id);await mkdir(dir);const fonte=join(dir,'principal.cpp'),binario=join(dir,nomeBinario);
  await writeFile(fonte,'static_assert(__cplusplus>=202002L);\n'+caso.codigo);
  const r=compilar([...flags,fonte,'-o',binario],dir);assert.equal(r.status,0,r.stdout+r.stderr);
  assert.equal(executar(binario,dir),caso.saida,caso.id);console.log('OK C++20 '+caso.id);
 }
 const nomes=['soma.hpp','soma.cpp','principal.cpp'];
 const arquivos=Object.fromEntries(nomes.map((nome,i)=>{
  const marcador='// '+nome+'\n',de=ligacao.code.indexOf(marcador);assert(de>=0,nome);
  const ate=i+1<nomes.length?ligacao.code.indexOf('// '+nomes[i+1]+'\n'):ligacao.code.length;assert(ate>de,nome);
  return [nome,ligacao.code.slice(de+marcador.length,ate).trim()+'\n'];
 }));
 assert.equal(obterSolucao(ligacao.id),ligacao.options.find(o=>o.id==='juntas').text);
 const permitidos=new Set(['-std=c++20','-c','-o','principal.cpp','soma.cpp','principal.o','soma.o','programa']);
 for(const opcao of ligacao.options){
  const dir=join(pasta,'ligacao-'+opcao.id);await mkdir(dir);
  for(const [nome,codigo] of Object.entries(arquivos))await writeFile(join(dir,nome),codigo);
  let resultado;
  const comandos=opcao.text.trim().split('\n');
  for(const [indice,comando] of comandos.entries()){
   const [programa,...argumentos]=comando.trim().split(/\s+/);assert.equal(programa,'g++');assert(argumentos.every(a=>permitidos.has(a)),opcao.id);
   const saida=argumentos.indexOf('-o');assert(saida>=0&&['principal.o','soma.o','programa'].includes(argumentos[saida+1]));
   const adaptados=argumentos.map(a=>a==='programa'?nomeBinario:a);
   resultado=compilar([...flags,...adaptados],dir);
   if(indice<comandos.length-1)assert.equal(resultado.status,0,resultado.stdout+resultado.stderr);
  }
  assert(resultado,opcao.id);
  if(['juntas','separadas'].includes(opcao.id)){
   assert.equal(resultado.status,0,resultado.stdout+resultado.stderr);
   assert.equal(executar(join(dir,nomeBinario),dir),'0\n-4\n2147483648\n-2147483649\n');
  }else{
   assert.notEqual(resultado.status,0,opcao.id+' foi aceito');
   assert.match(resultado.stdout+resultado.stderr,opcao.id==='sem-definicao'?/undefined reference/i:/multiple definition/i);
  }
  console.log('OK C++20 ligacao-'+opcao.id);
 }
 return casos.length+ligacao.options.length;
}
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import ts from 'typescript';
export async function verificarPercursosGit(raiz,selecionadas){
 const texto=await readFile('src/content/project-paths.ts','utf8'),fonte=ts.createSourceFile('dados.ts',texto,ts.ScriptTarget.Latest,true);let caminhos;
 for(const no of fonte.statements)if(ts.isVariableStatement(no))for(const declaracao of no.declarationList.declarations)if(declaracao.name.getText(fonte)==='learningPaths')caminhos=JSON.parse(declaracao.initializer.getText(fonte));
 const etapas=caminhos.find(p=>p.id==='git').stages,base=join(raiz,'git-percursos');await mkdir(base);
 const executar=(comando,args,cwd)=>{const r=spawnSync(comando,args,{cwd,encoding:'utf8',timeout:15000,maxBuffer:256*1024});assert.ifError(r.error);assert.equal(r.status,0,comando+': '+r.stderr+'\n'+r.stdout);return r.stdout.replace(/\r\n/g,'\n');};
 if(selecionadas&&(!selecionadas.length||selecionadas.some(id=>!etapas.some(e=>e.id===id))))throw new Error('Etapa Git desconhecida.');
 const conferidas=selecionadas?etapas.filter(e=>selecionadas.includes(e.id)):etapas;
 for(const etapa of conferidas){
  const pasta=join(base,etapa.id);await mkdir(pasta);const arquivo=join(base,etapa.id+'.sh');await writeFile(arquivo,etapa.solution);
  executar(process.env.CODELAB_BASH??'bash',['--noprofile','--norc',arquivo.replaceAll('\\','/')],pasta);
  const nome={preparacao:'estudo-preparacao',conflitos:'estudo-conflitos',reversao:'estudo-recuperacao'}[etapa.id],repositorio=join(pasta,nome),git=(...args)=>executar('git',['-C',repositorio,...args],pasta);
  assert.equal(git('remote').trim(),'');
  if(etapa.id==='preparacao'){
   assert.equal(git('show','HEAD:calculo.txt'),'total=10\n');assert.equal(git('show',':calculo.txt'),'total=10\n');assert.equal(await readFile(join(repositorio,'calculo.txt'),'utf8'),'total=20\n');assert.equal(git('rev-list','--count','HEAD').trim(),'2');
  }else if(etapa.id==='conflitos'){
   assert.equal(git('rev-list','--parents','-n','1','HEAD').trim().split(/\s+/).length,3);assert.equal(await readFile(join(repositorio,'regra.js'),'utf8'),'export const desconto = (total, ativo) => total >= 120 && ativo;\n');assert.ok(!git('status','--porcelain').trim());
  }else{
   assert.equal(git('show','HEAD:regra.txt'),'regra=1\n');assert.equal(git('show','HEAD:mensagem.txt'),'mensagem preservada\n');assert.equal(git('show','trabalho-recuperado:reserva.txt'),'rascunho recuperável\n');assert.equal(await readFile(join(repositorio,'reserva.txt'),'utf8'),'rascunho recuperável\n');assert.ok(!git('ls-tree','--name-only','HEAD').includes('reserva.txt'));assert.equal(git('rev-list','--count','--grep=^Alterar regra da etapa$','HEAD').trim(),'1');assert.equal(git('rev-parse','HEAD@{1}').trim(),git('rev-parse','trabalho-recuperado').trim());assert.equal(git('diff','--cached','--name-only').trim(),'reserva.txt');
  }
  console.log('OK roteiro Git '+etapa.id+' — gabarito Bash e estado real conferidos');
 }
 return conferidas.length;
}

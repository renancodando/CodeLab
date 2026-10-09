import {mkdir,writeFile,readFile,access} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import ts from 'typescript';

export async function verificarModulosTypeScript(raiz,atividades,obterSolucao){
 const atividade=id=>atividades.find(atividade=>atividade.id===id);
 const [contratos,entrada]=atividade('ts-import-tipo-efeito').code.replace('// contratos.ts\n','').split('\n\n// entrada.ts\n');
 const calculo='export function dobrar(valor: number): number { return valor * 2; }';
 const resolucao=atividade('ts-import-extensao').code;
 const alias=atividade('ts-alias-emitido').code;
 const casos=[
  {id:'tipo-apagado',arquivos:{'contratos.ts':contratos,'entrada.ts':entrada},saida:['2'],importEmitido:false},
  {id:'efeito-explicito',arquivos:{'contratos.ts':contratos,'entrada.ts':'import "./contratos.js";\n'+entrada},saida:['contratos','2'],importEmitido:'./contratos.js'},
  {id:'extensao-corrigida',arquivos:{'calculo.ts':calculo,'entrada.ts':resolucao.replace('____',obterSolucao('ts-import-extensao'))},saida:['6'],importEmitido:'./calculo.js'},
  {id:'extensao-node-rejeitada',arquivos:{'calculo.ts':calculo,'entrada.ts':resolucao.replace('____','./calculo')},diagnostico:2835},
  {id:'bundler-nao-e-node',arquivos:{'calculo.ts':calculo,'entrada.ts':resolucao.replace('____','./calculo')},opcoes:{module:'ESNext',moduleResolution:'Bundler'},erroRuntime:'ERR_MODULE_NOT_FOUND',importEmitido:'./calculo'},
  {id:'alias-nao-reescrito',arquivos:{'calculo.ts':calculo,'entrada.ts':alias},opcoes:{paths:{'@dominio/*':['./*.ts']}},erroRuntime:'ERR_MODULE_NOT_FOUND',importEmitido:'@dominio/calculo'},
  {id:'alias-corrigido',arquivos:{'calculo.ts':calculo,'entrada.ts':obterSolucao('ts-alias-emitido')},saida:['6'],importEmitido:'./calculo.js'},
  {id:'interface-importada-como-valor',arquivos:{'contratos.ts':contratos,'entrada.ts':entrada.replace('import type','import')},diagnostico:1484}
 ];
 for(const caso of casos){
  const pasta=join(raiz,'modulos-'+caso.id);await mkdir(pasta);
  await writeFile(join(pasta,'package.json'),'{"type":"module"}');
  await writeFile(join(pasta,'ambiente.d.ts'),'declare const console: { log(...valores: unknown[]): void };');
  for(const [nome,codigo] of Object.entries(caso.arquivos))await writeFile(join(pasta,nome),codigo);
  const configuracao={compilerOptions:{target:'ES2022',module:'NodeNext',moduleResolution:'NodeNext',strict:true,verbatimModuleSyntax:true,noEmitOnError:true,types:[],lib:['ES2022'],rootDir:'.',outDir:'dist',...caso.opcoes},include:['*.ts']};
  const caminhoConfiguracao=join(pasta,'tsconfig.json');await writeFile(caminhoConfiguracao,JSON.stringify(configuracao));
  const leitura=ts.readConfigFile(caminhoConfiguracao,ts.sys.readFile);assert.equal(leitura.error,undefined,caso.id);
  const projeto=ts.parseJsonConfigFileContent(leitura.config,ts.sys,pasta);assert.deepEqual(projeto.errors,[],caso.id);
  const programa=ts.createProgram(projeto.fileNames,projeto.options);
  const erros=ts.getPreEmitDiagnostics(programa).filter(diagnostico=>diagnostico.category===ts.DiagnosticCategory.Error);
  const emissao=programa.emit();
  const destino=join(pasta,'dist','entrada.js');
  if(caso.diagnostico){
   assert.deepEqual(erros.map(erro=>erro.code),[caso.diagnostico],caso.id);
   assert.equal(emissao.emitSkipped,true,caso.id);
   await assert.rejects(access(destino),{code:'ENOENT'});
  }else{
   assert.deepEqual(erros.map(erro=>ts.flattenDiagnosticMessageText(erro.messageText,' ')),[],caso.id);
   assert.equal(emissao.emitSkipped,false,caso.id);
   const emitido=await readFile(destino,'utf8');
   if(caso.importEmitido===false)assert.doesNotMatch(emitido,/contratos|import /,caso.id);
   else assert.ok(emitido.includes('from "'+caso.importEmitido+'"')||emitido.includes('import "'+caso.importEmitido+'"'),caso.id);
   const resultado=spawnSync(process.execPath,[destino],{encoding:'utf8',timeout:10000,maxBuffer:256*1024});
   assert.ifError(resultado.error);
   if(caso.erroRuntime){assert.equal(resultado.status,1,caso.id);assert.ok(resultado.stderr.includes(caso.erroRuntime),caso.id);assert.equal(resultado.stdout,'',caso.id);}
   else {assert.equal(resultado.status,0,caso.id+': '+resultado.stderr);assert.deepEqual(resultado.stdout.trimEnd().split(/\r?\n/),caso.saida,caso.id);}
  }
  console.log('OK módulos TypeScript '+caso.id+' — '+(caso.diagnostico?'diagnóstico e emissão bloqueada':caso.erroRuntime?'falha esperada no Node':'artefato executado'));
 }
 return casos.length;
}

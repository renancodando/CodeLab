import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import ts from 'typescript';

export async function verificarProjetoPython(raiz,selecionadas){
 const grupos=['dominio','cli','csv'];if(selecionadas&&(!selecionadas.length||selecionadas.some(g=>!grupos.includes(g))))throw Error('Grupo Python desconhecido.');
 const conferir=grupo=>!selecionadas||selecionadas.includes(grupo);
 const texto=await readFile('src/content/project-paths.ts','utf8'),fonte=ts.createSourceFile('dados.ts',texto,ts.ScriptTarget.Latest,true);let projetos;
 for(const no of fonte.statements)if(ts.isVariableStatement(no))for(const declaracao of no.declarationList.declarations)if(declaracao.name.getText(fonte)==='capstoneProjects')projetos=JSON.parse(declaracao.initializer.getText(fonte));
 const projeto=projetos.find(p=>p.id==='python-biblioteca'),pasta=join(raiz,'projeto-python');await mkdir(pasta);
 for(const [nome,codigo] of Object.entries(projeto.starterFiles))await writeFile(join(pasta,nome),codigo);
 const executar=(args)=>{const r=spawnSync(process.env.PYTHON??'python3',args,{cwd:pasta,env:{...process.env,PYTHONUTF8:'1',PYTHONIOENCODING:'utf-8'},encoding:'utf8',timeout:15000,maxBuffer:256*1024});assert.ifError(r.error);return r;};
 if(conferir('dominio')){
 const correto=executar(['-B','-m','unittest','-v']);assert.equal(correto.status,0,correto.stderr);assert.match(correto.stderr,/Ran 1 test/);assert.match(correto.stderr,/OK/);
 await writeFile(join(pasta,'dominio.py'),projeto.starterFiles['dominio.py'].replace(' and ',' or '));
 const mutante=executar(['-B','-m','unittest','-v','test_dominio']);assert.equal(mutante.status,1,mutante.stderr);assert.match(mutante.stderr,/FAIL:.*disponiveis=0, ativos=0/);assert.match(mutante.stderr,/FAIL:.*disponiveis=1, ativos=2/);
 await writeFile(join(pasta,'dominio.py'),projeto.starterFiles['dominio.py']);
 const importacao=executar(['-B','-c','import app; import dominio']);assert.equal(importacao.status,0,importacao.stderr);assert.equal(importacao.stdout,'');assert.equal(importacao.stderr,'');
 }
 if(conferir('cli')){
 const vazio=executar(['-B','app.py','listar']);assert.equal(vazio.status,0,vazio.stderr);assert.equal(vazio.stdout.trim(),'Catálogo ainda vazio');assert.equal(vazio.stderr,'');
 const ajuda=executar(['-B','app.py','--help']);assert.equal(ajuda.status,0,ajuda.stderr);assert.match(ajuda.stdout,/listar/);
 const invalido=executar(['-B','app.py','inexistente']);assert.equal(invalido.status,2);assert.equal(invalido.stdout,'');assert.match(invalido.stderr,/inexistente/);assert.doesNotMatch(invalido.stderr,/Traceback/);
 }
 if(conferir('csv')){
 const csv=executar(['-B','-c',"import csv; from pathlib import Path; dados = list(csv.DictReader(Path('dados.csv').open(encoding='utf-8'))); assert len(dados)==2; assert sum(int(linha['exemplares']) for linha in dados)==5; print('CSV inicial conferido')"]);assert.equal(csv.status,0,csv.stderr);assert.equal(csv.stdout.trim(),'CSV inicial conferido');
 }
 console.log('OK projeto Python — grupos '+(selecionadas??grupos).join(', ')+', somente arquivos iniciais; banco e projeto completo continuam manuais');
 return (conferir('dominio')?3:0)+(conferir('cli')?3:0)+(conferir('csv')?1:0);
}

import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {strict as assert} from 'node:assert';
import ts from '../work/CodeLab/node_modules/typescript/lib/typescript.js';
const arquivo='tests/e2e/csharp-excecoes.spec.ts';
const antiga=execFileSync('git',['-c','safe.directory=C:/Users/perei/Documents/Codex/2026-10-03/nao-m/work/CodeLab','show','origin/main:'+arquivo],{encoding:'utf8'});
const nova=readFileSync(arquivo,'utf8');
function analisar(texto){
 const fonte=ts.createSourceFile(arquivo,texto,ts.ScriptTarget.Latest,true),impressor=ts.createPrinter({removeComments:true}),esperas=[];let testes=0;
 function visitar(no){if(ts.isCallExpression(no)){if((ts.isIdentifier(no.expression)&&no.expression.text==='expect')||(ts.isPropertyAccessExpression(no.expression)&&ts.isIdentifier(no.expression.expression)&&no.expression.expression.text==='expect'))esperas.push(impressor.printNode(ts.EmitHint.Unspecified,no,fonte));if(ts.isIdentifier(no.expression)&&no.expression.text==='test')testes++;}ts.forEachChild(no,visitar);}
 visitar(fonte);return {esperas,testes};
}
const antes=analisar(antiga),depois=analisar(nova),restantes=[...depois.esperas];
for(const espera of antes.esperas){const indice=restantes.indexOf(espera);assert(indice>=0,'asserção anterior precisa continuar: '+espera);restantes.splice(indice,1);}
assert.equal(depois.testes,antes.testes+1);assert.equal(restantes.length,1);assert(restantes[0].includes('arquivo.byteLength'));
assert(!nova.includes('localStorage.removeItem'));assert(nova.includes('test.describe.serial'));
console.log(JSON.stringify({assercoesAntes:antes.esperas.length,assercoesDepois:depois.esperas.length,todasPreservadas:true,testesAntes:antes.testes,testesDepois:depois.testes,arquivoRealPreservado:true}));
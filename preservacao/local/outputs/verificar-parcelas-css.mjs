import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const fluxo=readFileSync('.github/workflows/validacao.yml','utf8');
const parcelas=fluxo.match(/parcela: \[([\d, ]+)\]/)[1].split(',').map(Number);
const total=Number(fluxo.match(/--shard=\$\{\{ matrix\.parcela \}\}\/(\d+)/)[1]);
if(parcelas.length!==total||parcelas.some((numero,indice)=>numero!==indice+1))throw new Error('Matriz e comando de parcelas divergem.');
function identificadores(grupos){return grupos.flatMap(grupo=>[...(grupo.specs??[]).map(caso=>caso.id),...identificadores(grupo.suites??[])]);}
function listar(nome,args){
 const resultado=spawnSync(process.execPath,[resolve('node_modules/@playwright/test/cli.js'),'test','--list','--reporter=json',...args],{encoding:'utf8',maxBuffer:8*1024*1024,timeout:60000});
 writeFileSync(resolve('../../outputs/'+nome+'.json'),resultado.stdout??'');
 if(resultado.status!==0)throw new Error(resultado.stderr||resultado.error?.message||'Listagem falhou.');
 return identificadores(JSON.parse(resultado.stdout).suites);
}
const todos=listar('css-flex-grid-lista-completa',[]),distribuidos=[];
for(const numero of parcelas){const casos=listar('css-flex-grid-parcela-'+numero,['--shard='+numero+'/'+total]);distribuidos.push(...casos);console.log('Parcela '+numero+'/'+total+': '+casos.length+' cenários.');}
if(new Set(todos).size!==todos.length||new Set(distribuidos).size!==distribuidos.length||distribuidos.length!==todos.length||todos.some(id=>!distribuidos.includes(id)))throw new Error('Cenários ausentes, duplicados ou diferentes.');
console.log('Partição conferida: '+todos.length+' cenários, sem exclusões ou duplicação. A listagem não executa os testes.');

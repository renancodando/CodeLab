import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';
const listar=parcela=>{
 const resultado=spawnSync(process.execPath,['node_modules/@playwright/test/cli.js','test','--list',...(parcela?['--shard='+parcela+'/2']:[])],{encoding:'utf8',timeout:30000,maxBuffer:1000000});
 assert.equal(resultado.status,0,resultado.stderr);
 return resultado.stdout.split(/\r?\n/).filter(linha=>linha.includes(' › ')).map(linha=>linha.trim());
};
const completo=listar(),primeira=listar(1),segunda=listar(2);
assert.equal(new Set(completo).size,completo.length);
assert.equal(primeira.filter(caso=>segunda.includes(caso)).length,0);
assert.deepEqual([...primeira,...segunda].sort(),completo.sort());
console.log(JSON.stringify({total:completo.length,primeira:primeira.length,segunda:segunda.length,semOmissoesOuDuplicacoes:true}));

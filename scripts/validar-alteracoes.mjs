import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const plano=JSON.parse(await readFile('plano-validacao.json','utf8'));
const etapa=process.argv[2];
let argumentos;
if(etapa==='unidades')argumentos=['node_modules/vitest/vitest.mjs','run','--configLoader','runner',...plano.unidades];
else if(etapa==='exemplos')argumentos=['scripts/verify-content-examples.mjs','--familia',...plano.familias];
else throw new Error('Etapa desconhecida. Use unidades ou exemplos.');
if(etapa==='unidades'&&!plano.unidades.length||etapa==='exemplos'&&!plano.familias.length){console.log('Nenhuma verificação desta etapa foi selecionada.');process.exit(0);}
const resultado=spawnSync(process.execPath,argumentos,{stdio:'inherit',env:process.env});
if(resultado.error)throw resultado.error;process.exitCode=resultado.status??1;

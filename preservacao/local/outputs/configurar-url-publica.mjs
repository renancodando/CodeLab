import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

const cli='C:/Users/perei/AppData/Roaming/npm/node_modules/vercel/dist/vc.js';
const ambiente=['--scope','renancodandos-projects'];
const listar=spawnSync(process.execPath,[cli,'env','ls','production',...ambiente,'--json'],{encoding:'utf8',timeout:30000,maxBuffer:256*1024});
assert.equal(listar.status,0,'Não foi possível conferir a configuração existente.');
const dados=JSON.parse(listar.stdout);
assert.ok(Array.isArray(dados.envs),'Formato de metadados não reconhecido.');
assert.equal(dados.envs.filter(variavel=>variavel.key==='CODELAB_PUBLIC_URL').length,0,'A URL já existe; não será sobrescrita.');
const adicionar=spawnSync(process.execPath,[cli,'env','add','CODELAB_PUBLIC_URL','production','--type','config',...ambiente],{input:'https://code-lab-omega.vercel.app',encoding:'utf8',timeout:30000,maxBuffer:256*1024});
assert.equal(adicionar.status,0,adicionar.stderr);
console.log('CODELAB_PUBLIC_URL adicionada como configuração de produção ao domínio já publicado.');

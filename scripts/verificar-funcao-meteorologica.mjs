import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

const temporario = await mkdtemp(join(tmpdir(), 'codelab-meteorologia-'));
try {
 await writeFile(join(temporario, 'package.json'), '{"type":"module"}');
 for (const arquivo of ['api/meteorologia/observacao.ts', 'server/observacao-meteorologica.ts']) {
  const destino = join(temporario, arquivo.replace(/\.ts$/, '.js'));
  await mkdir(resolve(destino, '..'), { recursive: true });
  const compilado = ts.transpileModule(await readFile(arquivo, 'utf8'), {
   compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
  }).outputText;
  await writeFile(destino, compilado);
 }
 const programa = `
  import assert from 'node:assert/strict';
  let chamadas = 0;
  const capturadoEm = Math.floor(Date.now() / 1000);
  globalThis.fetch = async (url, opcoes) => {
   assert.equal(url, 'https://aviationweather.gov/api/data/metar?ids=SBSP&format=json');
   assert.equal(opcoes.redirect, 'error');
   chamadas++;
   return Response.json([{icaoId:'SBSP',obsTime:capturadoEm,wxString:'RA'}]);
  };
  const {default:rota} = await import('./api/meteorologia/observacao.js');
  const respostas = await Promise.all(Array.from({length:30}, () => rota.fetch(new Request('https://codelab.example/api/meteorologia/observacao?estacao=SBSP'))));
  assert.equal(chamadas, 1);
  for (const resposta of respostas) {
   assert.equal(resposta.status, 200);
   const boletim = await resposta.json();
   assert.equal(boletim.dados[0].obsTime, capturadoEm);
   assert.ok(boletim.recebidoEm >= capturadoEm * 1000);
  }
  assert.equal((await rota.fetch(new Request('https://codelab.example/api/meteorologia/observacao?estacao=ZZZZ'))).status, 400);
 `;
 const resultado = spawnSync(process.execPath, ['--input-type=module', '-e', programa], {
  cwd: temporario, encoding: 'utf8', timeout: 10000
 });
 if (resultado.error) throw resultado.error;
 if (resultado.status !== 0) throw new Error(resultado.stderr || 'A entrada Node.js da meteorologia falhou.');
 console.log('Função meteorológica conferida em Node.js com módulos ESM emitidos e 30 consultas concorrentes.');
} finally {
 if (!resolve(temporario).startsWith(resolve(tmpdir()) + sep)) throw new Error('Diretório temporário fora do esperado.');
 await rm(temporario, { recursive: true, force: true });
}

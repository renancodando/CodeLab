import {mkdtemp, mkdir, writeFile, readFile, rm} from 'node:fs/promises';
import {join, resolve, sep} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {expect, it} from 'vitest';

it('rejeita métricas antigas e distingue problemas de mesmo id em aulas diferentes', async () => {
 const temporario = await mkdtemp(join(tmpdir(), 'codelab-metricas-'));
 try {
  for (const pasta of ['src/content/deep', 'docs']) await mkdir(join(temporario, pasta), {recursive:true});
  await writeFile(join(temporario,'src/content/curriculum.ts'), 'course("comecando","Começando","","","javascript","",[["um","Primeiros passos"]]);');
  await writeFile(join(temporario,'src/content/deep/index.ts'), 'export const expandedLessons=[{"id":"dois","title":"Coleções","track":"python-completo","language":"python","level":"Fundamentos"}];');
  const atividades = [{id:'a',language:'python',lessonIds:['um']},{id:'b',language:'python',lessonIds:['um']}];
  const salvarAtividades = () => writeFile(join(temporario,'src/content/practice.ts'), 'export const practiceActivities=' + JSON.stringify(atividades));
  await salvarAtividades();
  await writeFile(join(temporario,'src/content/project-paths.ts'), 'export const learningPaths=[{stages:[{},{}]}];export const capstoneProjects=[{milestones:[{criteria:[{},{}]},{criteria:[{}]}]}]');
  await writeFile(join(temporario,'docs/cobertura-curriculo.json'), JSON.stringify({totalLessons:2,totalCourses:1,originalLessons:0,expandedLessons:2,courses:[{lessons:[
   {id:'um',practices:[{id:'comum'}],topics:[{status:'praticaIndependente'}]},
   {id:'dois',practices:[{id:'comum'}],topics:[{status:'introduzido'}]}
  ]}]}));
  await writeFile(join(temporario,'README.md'), '# Catálogo\n<!-- metricas:inicio -->\nantigo\n<!-- metricas:fim -->\n');
  const gerar = (...argumentos:string[]) => spawnSync(process.execPath,[resolve('scripts/gerar-metricas.mjs'),...argumentos],{cwd:temporario,encoding:'utf8',timeout:10000});
  expect(gerar().status).toBe(0);
  expect(gerar('--check').status).toBe(0);
  const lacunasAntes = await readFile(join(temporario,'docs/aulas-sem-pratica.md'),'utf8');
  expect(lacunasAntes).toContain('**1 de 2 aulas sem pausas');
  expect(lacunasAntes).toContain('`dois` — Coleções');
  expect(lacunasAntes).not.toContain('`um` — Primeiros passos');
  atividades.push({id:'c',language:'css',lessonIds:['dois']});
  await salvarAtividades();
  const desatualizado = gerar('--check');
  expect(desatualizado.status).not.toBe(0);
  expect(desatualizado.stderr).toContain('está desatualizado');
  expect(gerar().status).toBe(0);
  expect(gerar('--check').status).toBe(0);
  const metricas = JSON.parse(await readFile(join(temporario,'src/content/metricas.json'),'utf8'));
  expect(metricas.atividadesCorrigiveis).toBe(3);
  expect(metricas.aulasComPausas).toBe(2);
  expect(metricas.aulasSemPausas).toBe(0);
  expect(metricas.coberturaPorLinguagem.python).toEqual({aulas:1,comPausas:1,semPausas:0});
  expect(metricas.problemasIndependentes).toBe(2);
  expect(metricas.criteriosManuais).toBe(3);
  expect(metricas.linguagens).toEqual(['css','python']);
  expect(await readFile(join(temporario,'README.md'),'utf8')).toContain('**3 atividades corrigíveis**');
  expect(await readFile(join(temporario,'docs/aulas-sem-pratica.md'),'utf8')).not.toContain('`dois` — Coleções');
  await writeFile(join(temporario,'docs/aulas-sem-pratica.md'),'lista antiga');
  expect(gerar('--check').stderr).toContain('docs/aulas-sem-pratica.md está desatualizado');
  atividades[0].lessonIds=['inexistente'];await salvarAtividades();
  expect(gerar().stderr).toContain('vínculos inválidos');
 } finally {
  if (!resolve(temporario).startsWith(resolve(tmpdir())+sep)) throw new Error('Diretório temporário fora do esperado.');
  await rm(temporario,{recursive:true,force:true});
 }
});

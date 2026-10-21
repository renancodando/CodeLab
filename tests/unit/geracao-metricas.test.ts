import {mkdtemp, mkdir, writeFile, readFile, rm} from 'node:fs/promises';
import {join, resolve, sep} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {expect, it} from 'vitest';
import {gerarMetricas} from '../../scripts/gerar-metricas.mjs';

async function prepararCatalogo(){
 const temporario=await mkdtemp(join(tmpdir(),'codelab-metricas-'));
 const limpar=async()=>{
  if(!resolve(temporario).startsWith(resolve(tmpdir())+sep))throw new Error('Diretório temporário fora do esperado.');
  await rm(temporario,{recursive:true,force:true});
 };
 try{
  for(const pasta of ['src/content/deep','docs'])await mkdir(join(temporario,pasta),{recursive:true});
  await writeFile(join(temporario,'src/content/curriculum.ts'),'course("comecando","Começando","","","javascript","",[["um","Primeiros passos"]]);');
  await writeFile(join(temporario,'src/content/deep/index.ts'),'export const expandedLessons=[{"id":"dois","title":"Coleções","track":"python-completo","language":"python","level":"Fundamentos"}];');
  const atividades=[{id:'a',language:'python',lessonIds:['um']},{id:'b',language:'python',lessonIds:['um']}];
  const salvarAtividades=()=>writeFile(join(temporario,'src/content/practice.ts'),'export const practiceActivities='+JSON.stringify(atividades));
  await salvarAtividades();
  await writeFile(join(temporario,'src/content/project-paths.ts'),'export const learningPaths=[{stages:[{},{}]}];export const capstoneProjects=[{milestones:[{criteria:[{},{}]},{criteria:[{}]}]}]');
  await writeFile(join(temporario,'docs/cobertura-curriculo.json'),JSON.stringify({totalLessons:2,totalCourses:1,originalLessons:0,expandedLessons:2,courses:[{lessons:[
   {id:'um',practices:[{id:'comum'}],topics:[{status:'praticaIndependente'}]},
   {id:'dois',practices:[{id:'comum'}],topics:[{status:'introduzido'}]}
  ]}]}));
  await writeFile(join(temporario,'README.md'),'# Catálogo\n<!-- metricas:inicio -->\nantigo\n<!-- metricas:fim -->\n');
  const gerar=(conferir=false)=>gerarMetricas({diretorio:temporario,conferir});
  const executarCli=(...argumentos:string[])=>spawnSync(process.execPath,[resolve('scripts/gerar-metricas.mjs'),...argumentos],{cwd:temporario,encoding:'utf8',timeout:10000});
  return{temporario,atividades,salvarAtividades,gerar,executarCli,limpar};
 }catch(erro){await limpar();throw erro;}
}

it('gera a fila inicial e distingue problemas de mesmo id em aulas diferentes',async()=>{
 const catalogo=await prepararCatalogo();
 try{
  const gerado=catalogo.executarCli();
  expect(gerado.status).toBe(0);expect(gerado.stdout).toContain('Métricas geradas: 2 aulas, 2 atividades.');
  const conferido=catalogo.executarCli('--check');
  expect(conferido.status).toBe(0);expect(conferido.stdout).toContain('Métricas conferidas: 2 aulas, 2 atividades.');
  const lacunas=await readFile(join(catalogo.temporario,'docs/aulas-sem-pratica.md'),'utf8');
  expect(lacunas).toContain('**1 de 2 aulas sem pausas');
  expect(lacunas).toContain('`dois` — Coleções');
  expect(lacunas).not.toContain('`um` — Primeiros passos');
  const metricas=JSON.parse(await readFile(join(catalogo.temporario,'src/content/metricas.json'),'utf8'));
  expect(metricas.problemasIndependentes).toBe(2);
  expect(metricas.criteriosManuais).toBe(3);
 }finally{await catalogo.limpar();}
});

it('rejeita contagens antigas e atualiza métricas e fila depois de uma nova atividade',async()=>{
 const catalogo=await prepararCatalogo();
 try{
  const diretorioInicial=process.cwd();
  await catalogo.gerar();expect(process.cwd()).toBe(diretorioInicial);
  catalogo.atividades.push({id:'c',language:'css',lessonIds:['dois']});
  await catalogo.salvarAtividades();
  const desatualizado=catalogo.executarCli('--check');
  expect(desatualizado.status).not.toBe(0);
  expect(desatualizado.stderr).toContain('está desatualizado');
  await catalogo.gerar();
  await catalogo.gerar(true);
  const metricas=JSON.parse(await readFile(join(catalogo.temporario,'src/content/metricas.json'),'utf8'));
  expect(metricas.atividadesCorrigiveis).toBe(3);
  expect(metricas.aulasComPausas).toBe(2);
  expect(metricas.aulasSemPausas).toBe(0);
  expect(metricas.coberturaPorLinguagem.python).toEqual({aulas:1,comPausas:1,semPausas:0});
  expect(metricas.problemasIndependentes).toBe(2);
  expect(metricas.criteriosManuais).toBe(3);
  expect(metricas.linguagens).toEqual(['css','python']);
  expect(await readFile(join(catalogo.temporario,'README.md'),'utf8')).toContain('**3 atividades corrigíveis**');
  expect(await readFile(join(catalogo.temporario,'docs/aulas-sem-pratica.md'),'utf8')).not.toContain('`dois` — Coleções');
 }finally{await catalogo.limpar();}
});

it('rejeita a fila adulterada e vínculos com aulas inexistentes',async()=>{
 const catalogo=await prepararCatalogo();
 try{
  await catalogo.gerar();
  await writeFile(join(catalogo.temporario,'docs/aulas-sem-pratica.md'),'lista antiga');
  const fila=catalogo.executarCli('--check');
  expect(fila.status).not.toBe(0);
  expect(fila.stderr).toContain('docs/aulas-sem-pratica.md está desatualizado');
  catalogo.atividades[0].lessonIds=['inexistente'];
  await catalogo.salvarAtividades();
  await expect(catalogo.gerar()).rejects.toThrow('vínculos inválidos');
  const vinculo=catalogo.executarCli();
  expect(vinculo.status).not.toBe(0);
  expect(vinculo.stderr).toContain('vínculos inválidos');
 }finally{await catalogo.limpar();}
});

import {it,expect} from 'vitest';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,basename} from 'node:path';
import {spawnSync} from 'node:child_process';

const script=resolve('scripts/generate-curriculum-index.mjs');
async function fixture() {
 const folder=await mkdtemp(join(tmpdir(),'codelab-index-'));
 await mkdir(join(folder,'src/content/deep'),{recursive:true});await mkdir(join(folder,'docs'));
 await writeFile(join(folder,'src/content/deep/python.ts'),`export default {id:'fixture',title:'Fixture',description:'Teste',icon:'book',language:'python',source:'https://docs.python.org/3/',lessons:[{id:'sample',title:'Sample',level:'Fundamentos',summary:'Body',topics:['iteradores']}]};`);
 await writeFile(join(folder,'src/content/curriculum.ts'),"course('original','Original','Teste','book',[{id:'original'}]);");
 await writeFile(join(folder,'docs/cobertura-curriculo.json'),JSON.stringify({edition:'fixture',statusLegend:{introduzido:'Introduzido',praticaDoModulo:'Módulo',praticaIndependente:'Prática'}}));
 const run=(check=false)=>spawnSync(process.execPath,[script,...(check?['--check']:[])],{cwd:folder,encoding:'utf8',timeout:30000});
 const initial=run();expect(initial.status,initial.stderr).toBe(0);
 const cleanup=async()=>{
  if(dirname(folder)!==resolve(tmpdir())||!basename(folder).startsWith('codelab-index-'))throw new Error('Diretório temporário inesperado');
  await rm(folder,{recursive:true,force:true});
 };
 return {folder,run,cleanup};
}
it('o gerador aceita LF e CRLF nos dois artefatos sem alterar o conteúdo',async()=>{
 const f=await fixture();
 try{
  let result=f.run(true);expect(result.status,result.stderr).toBe(0);
  for(const path of ['src/content/deep/index.ts','docs/cobertura-curriculo.json']){
   const absolute=join(f.folder,path),text=await readFile(absolute,'utf8');
   await writeFile(absolute,text.replace(/\n/g,'\r\n'));
  }
  const before=await readFile(join(f.folder,'src/content/deep/index.ts'),'utf8');
  result=f.run(true);expect(result.status,result.stderr).toBe(0);
  expect(await readFile(join(f.folder,'src/content/deep/index.ts'),'utf8')).toBe(before);
 }finally{await f.cleanup();}
},60000);
it('normalizar CRLF mantém a rejeição de metadados e contagens divergentes',async()=>{
 const f=await fixture();
 try{
  const index=join(f.folder,'src/content/deep/index.ts'),original=await readFile(index,'utf8');
  await writeFile(index,original.replace('"title": "Fixture"','"title": "Divergente"').replace(/\n/g,'\r\n'));
  let result=f.run(true);expect(result.status).not.toBe(0);expect(result.stderr).toContain('src/content/deep/index.ts está desatualizado');
  await writeFile(index,original.replace(/\n/g,'\r\n'));
  const path=join(f.folder,'docs/cobertura-curriculo.json'),matrix=JSON.parse(await readFile(path,'utf8'));matrix.totalLessons=999;
  await writeFile(path,(JSON.stringify(matrix,null,2)+'\n').replace(/\n/g,'\r\n'));
  result=f.run(true);expect(result.status).not.toBe(0);expect(result.stderr).toContain('docs/cobertura-curriculo.json está desatualizado');
 }finally{await f.cleanup();}
},60000);

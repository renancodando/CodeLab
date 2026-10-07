import {describe,it,expect} from 'vitest';
import {learningPaths,capstoneProjects} from '../../src/content/project-paths';
import {
 createProjectWorkspace,normalizeProjectWorkspaces,prepareProjectWorkspaces,updateProjectFile,
 removeProjectFile,markMilestoneEvidence,projectCompletion,nextMilestone,milestoneComplete,
 exportProjectFiles,validProjectPath,projectLimits
} from '../../src/learning/projects';
import type {ProjectWorkspace} from '../../src/learning/projects';

const now='2026-10-07T12:00:00.000Z';
const project=capstoneProjects.find(p=>p.id==='html-caderno')!;
function finishMilestone(workspace:ProjectWorkspace,index=0):ProjectWorkspace {
 const milestone=project.milestones[index];
 for(const criterion of milestone.criteria){
  workspace=markMilestoneEvidence(workspace,project,milestone.id,criterion.id,
   'Conferi o resultado no cenário descrito e registrei a observação.',now);
 }
 return workspace;
}
describe('percursos e projetos originais',()=>{
 it('oferece seis percursos com dezoito práticas e contratos de feedback próprios',()=>{
  expect(learningPaths.map(p=>p.id)).toEqual(['algoritmos','estruturas-dados','redes','git','testes','arquitetura']);
  for(const path of learningPaths){
   expect(path.stages).toHaveLength(3);
   expect(new Set(path.stages.map(s=>s.id)).size).toBe(3);
   for(const stage of path.stages){
    expect(stage.theory).toHaveLength(2);
    expect(stage.theory.every(p=>p.length>=250)).toBe(true);
    for(const text of [stage.example,stage.bug,stage.exercise,stage.solution,stage.explanation])
     expect(text.length).toBeGreaterThan(40);
    expect(stage.checkpoints).toHaveLength(3);
    expect(stage.assessment.options).toHaveLength(3);
    expect(stage.assessment.feedback).toHaveLength(3);
    expect(stage.assessment.correct).toBeGreaterThanOrEqual(0);
    expect(stage.assessment.correct).toBeLessThan(3);
    expect(stage.references.every(url=>url.startsWith('https://'))).toBe(true);
   }
  }
 });
 it('possui um projeto de conclusão por linguagem e critérios observáveis em todos os marcos',()=>{
  expect(capstoneProjects).toHaveLength(8);
  expect(new Set(capstoneProjects.map(p=>p.language)).size).toBe(8);
  const criterionIds:string[]=[];
  for(const capstone of capstoneProjects){
   expect(capstone.milestones.length).toBeGreaterThanOrEqual(7);
   expect(new Set(capstone.milestones.map(m=>m.id)).size).toBe(capstone.milestones.length);
   for(const milestone of capstone.milestones){
    expect(milestone.deliverables.length).toBeGreaterThan(0);
    expect(milestone.tests.length).toBeGreaterThan(0);
    expect(milestone.criteria).toHaveLength(3);
    expect(milestone.diagnosis.length).toBeGreaterThan(40);
    expect(milestone.transfer.length).toBeGreaterThan(20);
    criterionIds.push(...milestone.criteria.map(c=>capstone.id+':'+c.id));
   }
   expect(()=>createProjectWorkspace(capstone,now)).not.toThrow();
  }
  expect(new Set(criterionIds).size).toBe(criterionIds.length);
 });
 it('faz o mesmo produto frontend crescer até transporte, persistência, testes e entrega',()=>{
  expect(project.milestones.map(m=>m.id)).toEqual([
   'documento','formulario','layout','comportamento','transporte','persistencia','testes','entrega'
  ]);
  expect(project.constraints.join(' ')).toContain('220px a 4000px');
  expect(project.starterFiles['index.html']).toContain('lang="pt-BR"');
  expect(project.starterFiles['index.html']).toContain('viewport');
 });
});
describe('projeto retomável e revisão manual',()=>{
 it('restaura todos os arquivos, marco selecionado e evidências pelo contrato de backup',()=>{
  let workspace=createProjectWorkspace(project,now);
  workspace=updateProjectFile(workspace,project,'src/notas.txt','Uma ideia preservada.',now);
  workspace={...workspace,activeMilestone:'layout'};
  workspace=finishMilestone(workspace);
  const restored=prepareProjectWorkspaces(JSON.parse(JSON.stringify({[project.id]:workspace})))[project.id];
  expect(restored).toEqual(workspace);
  expect(restored.files['src/notas.txt']).toBe('Uma ideia preservada.');
  expect(restored.activeMilestone).toBe('layout');
  expect(projectCompletion(restored,project).completedMilestones).toBe(1);
 });
 it('consultar um projeto não o aprova automaticamente',()=>{
  const workspace=createProjectWorkspace(project,now),status=projectCompletion(workspace,project);
  expect(status.completedMilestones).toBe(0);
  expect(status.readyForReview).toBe(false);
  expect(status.automaticallyVerified).toBe(false);
  expect(nextMilestone(workspace,project)?.id).toBe('documento');
 });
 it('exige evidência para todos os critérios e não aceita somente um clique',()=>{
  const workspace=createProjectWorkspace(project,now),milestone=project.milestones[0];
  expect(()=>markMilestoneEvidence(workspace,project,milestone.id,milestone.criteria[0].id,'feito',now)).toThrow();
  const partial=markMilestoneEvidence(workspace,project,milestone.id,milestone.criteria[0].id,
   'Percorri a leitura sem script e registrei títulos e links.',now);
  expect(milestoneComplete(partial,project,milestone.id)).toBe(false);
  expect(projectCompletion(partial,project).completedMilestones).toBe(0);
 });
 it('uma alteração preserva notas, mas invalida as evidências da versão anterior',()=>{
  const old=finishMilestone(createProjectWorkspace(project,now));
  const changed=updateProjectFile(old,project,'index.html',old.files['index.html']+'\n<!-- revisão -->',now);
  expect(changed.fileRevision).toBe(old.fileRevision+1);
  expect(changed.evidence).toEqual(old.evidence);
  expect(projectCompletion(changed,project).completedMilestones).toBe(0);
  expect(projectCompletion(old,project).completedMilestones).toBe(1);
  expect(changed.files).not.toBe(old.files);
 });
 it('a mesma gravação não invalida evidências nem cria revisão artificial',()=>{
  const workspace=finishMilestone(createProjectWorkspace(project,now));
  expect(updateProjectFile(workspace,project,'index.html',workspace.files['index.html'],now)).toBe(workspace);
 });
 it('não permite registrar um marco posterior antes de revisar os anteriores',()=>{
  const workspace=createProjectWorkspace(project,now),later=project.milestones[1];
  expect(()=>markMilestoneEvidence(workspace,project,later.id,later.criteria[0].id,
   'Testei um cenário observável com o formulário.',now)).toThrow(/anteriores/);
 });
 it('a rubrica completa fica pronta para revisão humana e continua sem aprovação automática',()=>{
  let workspace=createProjectWorkspace(project,now);
  for(let i=0;i<project.milestones.length;i++)workspace=finishMilestone(workspace,i);
  expect(projectCompletion(workspace,project)).toEqual({
   completedMilestones:8,totalMilestones:8,readyForReview:true,automaticallyVerified:false
  });
  expect(nextMilestone(workspace,project)).toBeUndefined();
 });
 it('recusa excesso antes de modificar o espaço atual',()=>{
  const workspace=createProjectWorkspace(project,now),before=JSON.stringify(workspace);
  expect(()=>updateProjectFile(workspace,project,'grande.txt','x'.repeat(projectLimits.fileChars+1),now)).toThrow();
  expect(JSON.stringify(workspace)).toBe(before);
  const oversized={...workspace,files:{'grande.txt':'x'.repeat(projectLimits.fileChars+1)}};
  expect(()=>prepareProjectWorkspaces({[project.id]:oversized})).toThrow();
 });
 it('valida tamanho total e quantidade de arquivos',()=>{
  const workspace=createProjectWorkspace(project,now);
  const files:Record<string,string>={};
  for(let i=0;i<5;i++)files['f'+i+'.txt']='x'.repeat(30000);
  expect(()=>prepareProjectWorkspaces({[project.id]:{...workspace,files}})).toThrow(/total/);
  const many:Record<string,string>={};
  for(let i=0;i<25;i++)many['f'+i+'.txt']='x';
  expect(()=>prepareProjectWorkspaces({[project.id]:{...workspace,files:many}})).toThrow(/arquivos/);
 });
 it('recusa caminhos perigosos e preserva o arquivo final',()=>{
  const workspace=createProjectWorkspace(project,now);
  for(const path of ['../arquivo.txt','/arquivo.txt','a//b','a/../b','__proto__','a/constructor','C:/x','a\\b']){
   expect(validProjectPath(path)).toBe(false);
   expect(()=>updateProjectFile(workspace,project,path,'texto',now)).toThrow();
  }
  const single={...workspace,files:{'unico.txt':'conteúdo'}};
  expect(()=>removeProjectFile(single,project,'unico.txt',now)).toThrow(/pelo menos/);
 });
 it('rejeita backups desconhecidos, evidência do futuro e metadados incompatíveis',()=>{
  const workspace=finishMilestone(createProjectWorkspace(project,now));
  expect(()=>prepareProjectWorkspaces({'projeto-desconhecido':workspace})).toThrow();
  expect(()=>prepareProjectWorkspaces({[project.id]:{...workspace,projectRevision:99}})).toThrow();
  const invalid=JSON.parse(JSON.stringify(workspace));
  const first=project.milestones[0];
  invalid.evidence[first.id][first.criteria[0].id].fileRevision=workspace.fileRevision+1;
  expect(()=>prepareProjectWorkspaces({[project.id]:invalid})).toThrow(/evidência/);
  expect(()=>prepareProjectWorkspaces(JSON.parse('{"__proto__":{}}'))).toThrow();
 });
 it('a leitura tolerante mantém outro projeto válido sem truncar o inválido',()=>{
  const other=capstoneProjects.find(p=>p.language==='python')!;
  const valid=createProjectWorkspace(other,now);
  const raw={[project.id]:{version:99},[other.id]:valid};
  expect(Object.keys(normalizeProjectWorkspaces(raw))).toEqual([other.id]);
  expect(raw[project.id]).toEqual({version:99});
 });
 it('exporta arquivos, execução e rubrica sem sobrescrever README escrito pela pessoa',()=>{
  let workspace=createProjectWorkspace(project,now);
  workspace=updateProjectFile(workspace,project,'README-CODELAB.md','Meu relatório original.',now);
  workspace=finishMilestone(workspace);
  workspace=updateProjectFile(workspace,project,'app.js',workspace.files['app.js']+'\n// mudança',now);
  const exported=exportProjectFiles(workspace,project);
  expect(exported['README-CODELAB.md']).toBe('Meu relatório original.');
  expect(exported['README-CODELAB-2.md']).toContain('Não é aprovação automática');
  expect(exported['README-CODELAB-2.md']).toContain('histórica; precisa reconferir');
  expect(exported['README-CODELAB-2.md']).toContain('Testes/diagnóstico');
  expect(exported['index.html']).toBe(workspace.files['index.html']);
 });
});

import {capstoneProjects} from '../content/project-paths';
import type {CapstoneProject,ProjectMilestone} from '../content/project-paths';

/** Rubrica preenchida pela pessoa: nunca representa execução automática. */
export type ProjectEvidence = {note:string;fileRevision:number;recordedAt:string};
export type ProjectWorkspace = {
 version:1;projectId:string;projectRevision:number;fileRevision:number;
 activeMilestone:string;files:Record<string,string>;
 evidence:Record<string,Record<string,ProjectEvidence>>;updatedAt:string;
};
export const projectLimits = Object.freeze({
 workspaces:8,files:24,fileChars:30000,totalChars:120000,noteChars:2000,minNoteChars:12
});
const object = (value:unknown):value is Record<string,unknown> =>
 Boolean(value)&&typeof value==='object'&&!Array.isArray(value);
const record = <T>():Record<string,T> => Object.create(null) as Record<string,T>;
const validDate=(value:unknown):value is string =>
 typeof value==='string'&&value.length<=40&&Number.isFinite(Date.parse(value));
export function validProjectPath(path:string):boolean {
 return path.length>0&&path.length<=120&&/^[a-zA-Z0-9._/-]+$/.test(path)
 &&!path.startsWith('/')&&!path.endsWith('/')
 &&path.split('/').every(part=>part!==''&&part!=='.'&&part!=='..'
 &&!['__proto__','constructor','prototype'].includes(part));
}
function identity(workspace:ProjectWorkspace,project:CapstoneProject):void {
 if(workspace.projectId!==project.id||workspace.projectRevision!==project.revision)
  throw new Error('A versão do projeto não corresponde ao espaço salvo. Exporte uma cópia antes de migrar.');
}
function date(now:string):string {
 if(!validDate(now))throw new Error('Data do projeto inválida.');
 return now;
}
function validateFiles(raw:unknown):Record<string,string> {
 if(!object(raw)||Object.keys(raw).length>projectLimits.files)
  throw new Error('O projeto excede o limite de arquivos ou tem formato inválido.');
 const files=record<string>();let total=0;
 for(const [path,content] of Object.entries(raw)){
  if(!validProjectPath(path)||typeof content!=='string'||content.length>projectLimits.fileChars)
   throw new Error('Há um arquivo com nome inválido ou maior que o limite. Exporte-o separadamente.');
  total+=content.length;
  if(total>projectLimits.totalChars)throw new Error('O projeto excede o limite total. Os dados atuais foram preservados.');
  files[path]=content;
 }
 if(Object.keys(files).length===0)throw new Error('O projeto precisa de pelo menos um arquivo.');
 return files;
}
export function createProjectWorkspace(project:CapstoneProject,now=new Date().toISOString()):ProjectWorkspace {
 if(!project.milestones.length)throw new Error('O projeto precisa de um marco inicial.');
 return {version:1,projectId:project.id,projectRevision:project.revision,fileRevision:0,
  activeMilestone:project.milestones[0].id,files:validateFiles(project.starterFiles),
  evidence:record<Record<string,ProjectEvidence>>(),updatedAt:date(now)};
}
function parseWorkspace(raw:unknown,project:CapstoneProject):ProjectWorkspace {
 if(!object(raw)||raw.version!==1||raw.projectId!==project.id||raw.projectRevision!==project.revision
  ||typeof raw.fileRevision!=='number'||!Number.isSafeInteger(raw.fileRevision)||raw.fileRevision<0
  ||!validDate(raw.updatedAt)||typeof raw.activeMilestone!=='string'
  ||!project.milestones.some(m=>m.id===raw.activeMilestone)||!object(raw.evidence))
  throw new Error('Há um projeto salvo com versão ou metadados inválidos. A jornada atual foi preservada.');
 const files=validateFiles(raw.files),fileRevision=Number(raw.fileRevision);
 const evidence=record<Record<string,ProjectEvidence>>();
 for(const [milestoneId,entries] of Object.entries(raw.evidence)){
  const milestone=project.milestones.find(m=>m.id===milestoneId);
  if(!milestone||!object(entries))throw new Error('Há evidências de um marco desconhecido.');
  const target=record<ProjectEvidence>();
  for(const [criterionId,value] of Object.entries(entries)){
   if(!milestone.criteria.some(c=>c.id===criterionId)||!object(value)
    ||typeof value.note!=='string'||value.note.trim().length<projectLimits.minNoteChars
    ||value.note.length>projectLimits.noteChars||!validDate(value.recordedAt)
    ||typeof value.fileRevision!=='number'||!Number.isSafeInteger(value.fileRevision)||value.fileRevision<0
    ||Number(value.fileRevision)>fileRevision)
    throw new Error('Há uma evidência inválida. A jornada atual foi preservada.');
   target[criterionId]={note:value.note,fileRevision:Number(value.fileRevision),recordedAt:value.recordedAt};
  }
  evidence[milestoneId]=target;
 }
 return {version:1,projectId:project.id,projectRevision:project.revision,fileRevision,
  activeMilestone:raw.activeMilestone,files,evidence,updatedAt:raw.updatedAt};
}
/** Leitura tolerante: um projeto inválido não invalida os outros. Não corta arquivos. */
export function normalizeProjectWorkspaces(raw:unknown):Record<string,ProjectWorkspace> {
 const result=record<ProjectWorkspace>();
 if(!object(raw))return result;
 for(const project of capstoneProjects){
  if(!Object.prototype.hasOwnProperty.call(raw,project.id))continue;
  try{result[project.id]=parseWorkspace(raw[project.id],project);}catch{/* Um projeto inválido não será apresentado como recuperado. */}
 }
 return result;
}
/** Backup estrito: validar tudo antes de substituir a jornada do navegador. */
export function prepareProjectWorkspaces(raw:unknown):Record<string,ProjectWorkspace> {
 const result=record<ProjectWorkspace>();
 if(raw===undefined)return result;
 if(!object(raw)||Object.keys(raw).length>projectLimits.workspaces)
  throw new Error('O backup de projetos tem formato inválido ou excede o limite. A jornada atual foi preservada.');
 for(const [id,value] of Object.entries(raw)){
  const project=capstoneProjects.find(p=>p.id===id);
  if(!project)throw new Error('O backup contém um projeto desconhecido. A jornada atual foi preservada.');
  result[id]=parseWorkspace(value,project);
 }
 return result;
}
export function milestoneComplete(workspace:ProjectWorkspace,project:CapstoneProject,milestoneId:string):boolean {
 identity(workspace,project);
 const milestone=project.milestones.find(m=>m.id===milestoneId);
 if(!milestone)return false;
 return milestone.criteria.every(c=>{
  const evidence=workspace.evidence[milestone.id]?.[c.id];
  return Boolean(evidence&&evidence.fileRevision===workspace.fileRevision
   &&evidence.note.trim().length>=projectLimits.minNoteChars);
 });
}
export function nextMilestone(workspace:ProjectWorkspace,project:CapstoneProject):ProjectMilestone|undefined {
 identity(workspace,project);
 return project.milestones.find(m=>!milestoneComplete(workspace,project,m.id));
}
export function projectCompletion(workspace:ProjectWorkspace,project:CapstoneProject) {
 identity(workspace,project);
 const completedMilestones=project.milestones.filter(m=>milestoneComplete(workspace,project,m.id)).length;
 return {completedMilestones,totalMilestones:project.milestones.length,
  readyForReview:completedMilestones===project.milestones.length,automaticallyVerified:false as const};
}
export function selectProjectMilestone(workspace:ProjectWorkspace,project:CapstoneProject,id:string):ProjectWorkspace {
 identity(workspace,project);
 if(!project.milestones.some(m=>m.id===id))throw new Error('Marco desconhecido.');
 return {...workspace,activeMilestone:id};
}
/** Toda alteração torna as notas anteriores históricas; não apaga o texto das evidências. */
export function updateProjectFile(workspace:ProjectWorkspace,project:CapstoneProject,path:string,content:string,now=new Date().toISOString()):ProjectWorkspace {
 identity(workspace,project);
 if(!validProjectPath(path))throw new Error('Nome de arquivo inválido.');
 if(workspace.files[path]===content)return workspace;
 const files=validateFiles({...workspace.files,[path]:content});
 if(workspace.fileRevision>=Number.MAX_SAFE_INTEGER)throw new Error('Exporte o projeto antes de migrar seu histórico.');
 return {...workspace,files,fileRevision:workspace.fileRevision+1,updatedAt:date(now)};
}
export function removeProjectFile(workspace:ProjectWorkspace,project:CapstoneProject,path:string,now=new Date().toISOString()):ProjectWorkspace {
 identity(workspace,project);
 if(!Object.prototype.hasOwnProperty.call(workspace.files,path))return workspace;
 const files={...workspace.files};delete files[path];
 const validated=validateFiles(files);
 if(workspace.fileRevision>=Number.MAX_SAFE_INTEGER)throw new Error('Exporte o projeto antes de migrar seu histórico.');
 return {...workspace,files:validated,fileRevision:workspace.fileRevision+1,updatedAt:date(now)};
}
export function markMilestoneEvidence(workspace:ProjectWorkspace,project:CapstoneProject,milestoneId:string,criterionId:string,note:string,now=new Date().toISOString()):ProjectWorkspace {
 identity(workspace,project);
 const index=project.milestones.findIndex(m=>m.id===milestoneId),milestone=project.milestones[index];
 if(!milestone||!milestone.criteria.some(c=>c.id===criterionId))throw new Error('Critério de projeto desconhecido.');
 if(project.milestones.slice(0,index).some(m=>!milestoneComplete(workspace,project,m.id)))
  throw new Error('Registre primeiro as evidências dos marcos anteriores na versão atual.');
 const trimmed=note.trim();
 if(trimmed.length<projectLimits.minNoteChars||note.length>projectLimits.noteChars)
  throw new Error('Descreva o que observou, como conferiu e qual resultado encontrou (12 a 2000 caracteres).');
 const recordedAt=date(now);
 return {...workspace,evidence:{...workspace.evidence,[milestoneId]:{
  ...workspace.evidence[milestoneId],[criterionId]:{note:trimmed,fileRevision:workspace.fileRevision,recordedAt}
 }},updatedAt:recordedAt};
}
/** Exporta arquivos e um roteiro; o relatório informa explicitamente que a rubrica é manual. */
export function exportProjectFiles(workspace:ProjectWorkspace,project:CapstoneProject):Record<string,string> {
 identity(workspace,project);
 const status=projectCompletion(workspace,project),lines=[
  '# '+project.title,'',project.summary,'',
  '## Ambiente','',project.offline,'',
  '## Escopo','',...project.scope.map(s=>'- '+s),'',
  '## Restrições','',...project.constraints.map(s=>'- '+s),'',
  '## Revisão','',
  'Esta rubrica contém evidências registradas pela pessoa. Não é aprovação automática nem comprovação de compilação ou execução.',
  'Marcos com evidências da versão atual: '+status.completedMilestones+'/'+status.totalMilestones+'.',
  'Revisão dos arquivos: '+workspace.fileRevision+'.',''
 ];
 for(const milestone of project.milestones){
  lines.push('### '+milestone.title,'',milestone.goal,'','Entregáveis:',...milestone.deliverables.map(s=>'- '+s),'');
  for(const criterion of milestone.criteria){
   const evidence=workspace.evidence[milestone.id]?.[criterion.id];
   lines.push('- '+criterion.label);
   if(evidence)lines.push('  Evidência '+(evidence.fileRevision===workspace.fileRevision?'da versão atual':'histórica; precisa reconferir')+': '+evidence.note);
   else lines.push('  Sem evidência registrada.');
  }
  lines.push('','Testes/diagnóstico:',...milestone.tests.map(s=>'- '+s),milestone.diagnosis,'','Transferência: '+milestone.transfer,'');
 }
 lines.push('## Referências','',...project.references.map(s=>'- '+s),'');
 const files={...workspace.files};let readme='README-CODELAB.md',n=2;
 while(Object.prototype.hasOwnProperty.call(files,readme)){readme='README-CODELAB-'+n+'.md';n++;}
 files[readme]=lines.join('\n');
 return files;
}

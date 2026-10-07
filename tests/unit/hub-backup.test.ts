import {it,expect} from 'vitest';
import {prepareBackup,normalizeProgress} from '../../src/state';
import {freshAdaptive,recordEvidence} from '../../src/learning/adaptive';
import {emptyPracticeAnswer} from '../../src/learning/activity-state';
import {capstoneProjects} from '../../src/content/project-paths';
import {createProjectWorkspace,updateProjectFile} from '../../src/learning/projects';
it('leva habilidades, respostas e projeto de vários arquivos no mesmo backup',()=>{
 const adaptive=freshAdaptive();recordEvidence(adaptive,{id:'tentativa-1',assessmentId:'cs-prever-decimal',activityId:'cs-prever-decimal',skillIds:['csharp.tipos.decimal'],revision:1,passed:true,assisted:false,attempts:1,hints:0,kind:'practice'},{now:Date.parse('2026-10-07T12:00:00.000Z'),timeZone:'America/Sao_Paulo'});
 const project=capstoneProjects[0];let workspace=createProjectWorkspace(project);const path=Object.keys(workspace.files)[0];workspace=updateProjectFile(workspace,project,path,'Meu código original');
 const source={version:2,learningLanguage:'csharp',adaptive,practiceAnswers:{'cs-prever-decimal':{...emptyPracticeAnswer(),value:'True',attempts:1,passed:true}},projectWorkspaces:{[project.id]:workspace}};
 const p=prepareBackup(JSON.parse(JSON.stringify(source)));expect(p.adaptive).toEqual(adaptive);expect(p.practiceAnswers['cs-prever-decimal'].passed).toBe(true);expect(p.projectWorkspaces[project.id].files[path]).toBe('Meu código original');expect(p.learningLanguage).toBe('csharp');
});
it('rejeita corrupção sem fabricar domínio e aceita versões anteriores',()=>{
 expect(normalizeProgress({version:1,lessons:['programar']}).adaptive.skills).toEqual({});
 expect(prepareBackup({version:1}).projectWorkspaces).toEqual({});
 expect(()=>prepareBackup({version:2,adaptive:{version:1,skills:{},eventIds:['constructor'],seenConcepts:[]}})).toThrow();
 expect(()=>prepareBackup({version:2,practiceAnswers:{a:{...emptyPracticeAnswer(),value:'x'.repeat(30001)}}})).toThrow();
 expect(()=>prepareBackup({version:2,projectWorkspaces:{desconhecido:{}}})).toThrow();
});

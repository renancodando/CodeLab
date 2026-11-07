import {it,expect} from 'vitest';
import {capstoneProjects} from '../../src/content/project-paths';
import {createProjectWorkspace,prepareProjectWorkspaces,updateProjectFile,markMilestoneEvidence,exportProjectFiles,projectCompletion} from '../../src/learning/projects';
const projeto=capstoneProjects.find(p=>p.id==='python-biblioteca')!,agora='2026-11-07T12:00:00.000Z';
it('um projeto Python anterior sem o novo teste conserva fonte e evidência',()=>{
 let anterior=createProjectWorkspace(projeto,agora);delete anterior.files['test_dominio.py'];
 anterior=updateProjectFile(anterior,projeto,'dominio.py','def minha_regra():\n    return 7\n',agora);
 anterior=markMilestoneEvidence(anterior,projeto,'dominio','dominio-c1','Conferi estoque zero na minha implementação e registrei o resultado.',agora);
 const restaurado=prepareProjectWorkspaces(JSON.parse(JSON.stringify({[projeto.id]:anterior})))[projeto.id];
 expect(restaurado).toEqual(anterior);expect(restaurado.files).not.toHaveProperty('test_dominio.py');expect(restaurado.files['dominio.py']).toContain('minha_regra');
 const arquivos=exportProjectFiles(restaurado,projeto);expect(arquivos['dominio.py']).toBe(anterior.files['dominio.py']);expect(arquivos['README-CODELAB.md']).toContain('python -m unittest -v');expect(arquivos['README-CODELAB.md']).toContain('Conferi estoque zero');expect(projectCompletion(restaurado,projeto).automaticallyVerified).toBe(false);
});
it('a exportação nova inclui o teste inicial sem converter a rubrica em aprovação automática',()=>{
 const inicial=createProjectWorkspace(projeto,agora),arquivos=exportProjectFiles(inicial,projeto);
 expect(arquivos['test_dominio.py']).toContain('from dominio import pode_emprestar');expect(arquivos['README-CODELAB.md']).toContain('não comprova CLI, banco');expect(projectCompletion(inicial,projeto)).toMatchObject({completedMilestones:0,readyForReview:false,automaticallyVerified:false});expect(inicial.evidence).toEqual({});
});

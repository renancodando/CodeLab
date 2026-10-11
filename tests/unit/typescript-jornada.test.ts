import {describe,it,expect} from 'vitest';
import {normalizeProgress,prepareBackup} from '../../src/state';
describe('projetos TypeScript na jornada local',()=>{
 it('exportação normalizada e importação mantêm linguagem e rascunhos independentes',()=>{
  const jornada=normalizeProgress({version:2,projects:[{id:'projeto-ts',title:'Pedidos',code:'const total:number=7;',language:'typescript',updatedAt:'2026-10-11'}],drafts:{'lab-typescript':'const ts:number=8;','lab-js':'console.log(9)'}});
  const restaurada=prepareBackup(JSON.parse(JSON.stringify(jornada)));expect(restaurada.projects).toEqual(jornada.projects);expect(restaurada.projects[0].language).toBe('typescript');expect(restaurada.drafts).toEqual({'lab-typescript':'const ts:number=8;','lab-js':'console.log(9)'});
 });
 it('preserva o projeto vazio e continua recusando uma linguagem não suportada',()=>{
  const projeto={id:'projeto-ts',title:'Vazio',code:'',language:'typescript'};expect(prepareBackup({version:2,projects:[projeto]}).projects[0].code).toBe('');expect(()=>prepareBackup({version:2,projects:[{...projeto,language:'arquivo-remoto'}]})).toThrow('projeto inválido');
 });
});

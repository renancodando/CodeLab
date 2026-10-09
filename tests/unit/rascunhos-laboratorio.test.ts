import {describe,it,expect,vi,beforeEach} from 'vitest';
import {readProgress,prepareBackup} from '../../src/state';

beforeEach(()=>vi.stubGlobal('localStorage',{getItem:vi.fn(),setItem:vi.fn()}));
describe('anotações e rascunhos do laboratório',()=>{
 const projeto={id:'notas-estudo',title:'Decisões do projeto',code:'Investigar o caso vazio',language:'text',updatedAt:'2026-10-08T12:00:00.000Z'};
 it('conserva projeto de anotações ao ler o progresso armazenado',()=>{
  vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify({version:2,projects:[projeto],drafts:{'lab-html':'','lab-js':'','lab-python':'print(7)'}}));
  const jornada=readProgress();
  expect(jornada.projects).toEqual([projeto]);
  expect(jornada.drafts).toEqual({'lab-html':'','lab-js':'','lab-python':'print(7)'});
 });
 it('restaura seu próprio backup de anotações sem liberar linguagens desconhecidas',()=>{
  expect(prepareBackup({version:2,projects:[projeto]}).projects).toEqual([projeto]);
  expect(()=>prepareBackup({version:2,projects:[{...projeto,language:'desconhecida'}]})).toThrow('projeto inválido');
 });
});

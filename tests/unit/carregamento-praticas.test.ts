import {it,expect} from 'vitest';
import {carregarPraticas} from '../../scripts/carregar-praticas.mjs';
import {getPracticeSolution} from '../../src/learning/practice';

it('o carregador nativo resolve corretores separados e mantém soluções antigas',async()=>{
 const carregado=await carregarPraticas();
 for(const id of ['fullstack-preparar-cadastro','fullstack-testar-cadastro','diario-mesclar-backup','tarefas-reduzir-acao','clima-concluir-consulta','cs-async-aguardar-leitura']){
  expect(carregado.practiceActivities.some(a=>a.id===id)).toBe(true);
  const solucao=carregado.getPracticeSolution(id);expect(typeof solucao).toBe('string');expect(solucao!.length).toBeGreaterThan(0);expect(solucao).toBe(getPracticeSolution(id));
 }
});

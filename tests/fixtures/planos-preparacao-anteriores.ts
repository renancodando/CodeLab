import type {DailySession} from '../../src/learning/adaptive';
export const planoSqlAnterior=(dia:string):DailySession=>({
 day:dia,items:[
  {id:'sql-corrigir-obrigatoriedade',kind:'practice',activityId:'sql-corrigir-obrigatoriedade',minutes:3},
  {id:'sql-prever-desconhecido',kind:'practice',activityId:'sql-prever-desconhecido',minutes:3},
  {id:'sql-correlacionar-ausentes',kind:'challenge',activityId:'sql-correlacionar-ausentes',minutes:4}
 ],completed:[],totalMinutes:10
});
export const planoLacosAnterior=(dia:string):DailySession=>({
 day:dia,items:[
  {id:'js-parar-contagem',kind:'practice',activityId:'js-parar-contagem',minutes:3},
  {id:'js-prever-ciclos',kind:'practice',activityId:'js-prever-ciclos',minutes:3},
  {id:'js-debug-soma-inclusiva',kind:'challenge',activityId:'js-debug-soma-inclusiva',minutes:5}
 ],completed:[],totalMinutes:11
});
export const planoValoresPreparadoAnterior=(dia:string):DailySession=>({
 day:dia,items:[
  {id:'js-permitir-reatribuicao',kind:'practice',activityId:'js-permitir-reatribuicao',minutes:2},
  {id:'js-prever-ausencia-zero',kind:'practice',activityId:'js-prever-ausencia-zero',minutes:2},
  {id:'js-debug-saldo-textual',kind:'challenge',activityId:'js-debug-saldo-textual',minutes:4}
 ],completed:[],totalMinutes:8
});

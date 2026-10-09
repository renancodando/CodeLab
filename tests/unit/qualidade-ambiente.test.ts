import {describe,it,expect} from 'vitest';
import {QualityController,tetoQualidade,proporcaoRenderizacao} from '../../src/environment/quality';

describe('qualidade do ambiente em dispositivos limitados',()=>{
 it.each([[2,8,'low'],[8,2,'low'],[4,8,'medium'],[8,4,'medium'],[8,8,'high']])('limita recursos com %s núcleos e %s GB', (nucleos,memoria,teto)=>{
  expect(tetoQualidade(nucleos,memoria)).toBe(teto);
 });
 it('não interpreta informação ausente ou inválida como hardware fraco',()=>{
  for(const valor of [undefined,null,0,-1,NaN,Infinity,'2'])expect(tetoQualidade(valor,valor)).toBe('high');
  expect(tetoQualidade(undefined,2)).toBe('low');
 });
 it.each(['low','medium'] as const)('não ultrapassa o teto %s após muitos frames rápidos',teto=>{
  const controle=new QualityController(teto);
  for(let i=0;i<6000;i++)controle.sample(34,1000/30,false);
  expect(controle.tier).toBe(teto);
  controle.sample(100,100,true);expect(controle.tier).toBe('reduced');
  controle.sample(34,1000/30,false);expect(controle.tier).toBe(teto==='low'?'low':'medium');
 });
 it('mantém redução por lentidão e recuperação dentro do teto',()=>{
  const controle=new QualityController('medium');
  for(let i=0;i<60;i++)controle.sample(70,1000/30,false);
  expect(controle.tier).toBe('low');
  for(let i=0;i<720;i++)controle.sample(34,1000/30,false);
  expect(controle.tier).toBe('medium');
 });
 it('limita pixels em telas grandes sem mudar o tamanho lógico',()=>{
  for(const [qualidade,orcamento] of [['high',4500000],['medium',2500000],['low',1200000],['reduced',1200000]] as const){
   const proporcao=proporcaoRenderizacao(4000,2250,3,qualidade);
   expect(4000*2250*proporcao**2).toBeLessThanOrEqual(orcamento+1);
   expect(proporcao).toBeGreaterThan(0);
  }
  expect(proporcaoRenderizacao(375,812,3,'low')).toBe(.75);
  expect(proporcaoRenderizacao(1440,1000,1,'high')).toBe(1);
  expect(proporcaoRenderizacao(0,0,2,'medium')).toBe(1);
 });
});

import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {contratosProjetos} from '../../src/content/contratos-projetos';
import {evaluatePractice} from '../../src/learning/practice';
import {evaluate} from '../../src/execution/evaluate';

const pausas=practicesForLesson('projeto-entrega'),id='entrega-resumir-verificacoes',gabarito=contratosProjetos[id].solution;
it('previsão e reprodução do ambiente são decisões conceituais',async()=>{
 expect(await evaluatePractice('entrega-prever-status','true\n0')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 expect((await evaluatePractice('entrega-prever-status','false\n1')).passed).toBe(false);
 expect(await evaluatePractice('entrega-reproduzir-ambiente','limpo')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const opcao of ['captura','pastas','planejado'])expect((await evaluatePractice('entrega-reproduzir-ambiente',opcao)).passed).toBe(false);
});
it('executa a referência que distingue não falhou de aprovação atual',async()=>{
 const resultado=await evaluate(pausas.find(p=>p.kind==='predict')!.code!,'laboratorio');expect(resultado.error).toBeUndefined();expect(resultado.logs).toEqual(['true','0']);
});
it('executa o gabarito e recusa o início incompleto',async()=>{
 expect(await evaluatePractice(id,gabarito)).toMatchObject({passed:true,evidence:'executed',execution:'quickjs'});
 expect((await evaluatePractice(id,pausas.find(p=>p.id===id)!.code!)).passed).toBe(false);
});
it('aceita uma produção equivalente sem Map e com outra ordem de propriedades',async()=>{
 const codigo=`function resumirVerificacoes(sha,criterios,registros){const estados=criterios.map(id=>({id,status:registros.filter(r=>r.criterio===id&&r.sha===sha).slice(-1)[0]?.status}));const aprovados=estados.filter(e=>e.status==='passou').map(e=>e.id),falhos=estados.filter(e=>e.status==='falhou').map(e=>e.id),pendentes=estados.filter(e=>e.status!=='passou'&&e.status!=='falhou').map(e=>e.id);return {pronto:criterios.length!==0&&aprovados.length===criterios.length,pendentes,falhos,aprovados};}`;
 expect((await evaluatePractice(id,codigo)).passed).toBe(true);
});
const variantes={
 ignorarSha:gabarito.replace('if(registro.sha===shaAtual)','if(true)'),
 primeiraTentativa:gabarito.replace('if(registro.sha===shaAtual)','if(registro.sha===shaAtual&&!ultimos.has(registro.criterio))'),
 cancelarComoSucesso:gabarito.replace("if(status==='passou')","if(status==='passou'||status==='cancelado')"),
 ignorarFalha:gabarito.replace("pronto:criterios.length>0&&aprovados.length===criterios.length","pronto:criterios.length>0&&pendentes.length===0"),
 vazioPronto:gabarito.replace('criterios.length>0&&',''),
 ordenarEntrada:gabarito.replace('for(const criterio of criterios)','for(const criterio of criterios.sort())'),
 mesmoShaSemCaso:gabarito.replace('registro.sha===shaAtual','registro.sha.toLowerCase()===shaAtual.toLowerCase()'),
 apagarHistorico:gabarito.replace('for(const registro of registros)','for(const registro of registros.reverse())'),
 campoCompartilhado:gabarito.replace('function resumirVerificacoes','function resumir')+'\nconst unico={};function resumirVerificacoes(s,c,r){return Object.assign(unico,resumir(s,c,r));}'
};
for(const [nome,codigo] of Object.entries(variantes))it('resumo recusa '+nome,async()=>{expect(codigo).not.toBe(gabarito);const resultado=await evaluatePractice(id,codigo);expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(gabarito);});
it('distribui prática e mantém produção independente',()=>{expect(pausas.map(p=>p.afterBlock)).toEqual([3,6,8]);expect(pausas[2]).toMatchObject({capability:'producao',assinaturaVazia:true});});

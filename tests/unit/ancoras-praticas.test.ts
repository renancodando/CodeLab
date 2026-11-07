import {it,expect} from 'vitest';
import {practiceActivities,practicesForLesson} from '../../src/content/practice';
import {expandedLessons} from '../../src/content/deep/index';
import {resolveLesson} from '../../src/content/curriculum';
const ancorasDeAplicacao:Record<string,string>={
 'sql-esquema-alcancar-nos':'erro','sql-indices-consultar-intervalo':'erro','sql-janelas-acumular-movimentos':'erro',
 'cs-runtime-somar-checked':'erro','cs-contratos-desinscrever-evento':'codigo',
 'ts-genericos-montar-grupos':'erro','ts-relacoes-completar-transformacao':'erro','js-async-dobrar-todos':'erro',
 'html-plataforma-montar-nota':'codigo','css-visual-completar-fases':'erro','css-arquitetura-restaurar-camada':'erro'
};
const idsProfundos=new Set(expandedLessons.map(aula=>aula.id));
const ids=new Set(practiceActivities.flatMap(a=>a.lessonIds).filter(id=>idsProfundos.has(id)));
const aulas=await Promise.all([...ids].map(id=>resolveLesson(id)));
it('preserva as âncoras de teoria, exemplo e diagnóstico sem expor solução antes da pausa',()=>{
 const aplicacoes=new Set<string>();
 for(const aula of aulas){expect(aula).toBeTruthy();if(!aula)continue;
  const solucao=aula.capitulos.findIndex(c=>c.id==='solucao');expect(solucao).toBeGreaterThan(0);
  for(const pausa of practicesForLesson(aula.id)){
   const esperada=ancorasDeAplicacao[pausa.id]??(pausa.afterBlock===1?'contexto':'teoria-'+(pausa.afterBlock-1));
   expect(aula.capitulos[pausa.afterBlock]?.id,pausa.id).toBe(esperada);
   expect(pausa.afterBlock,pausa.id).toBeLessThan(solucao);
   if(Object.hasOwn(ancorasDeAplicacao,pausa.id))aplicacoes.add(pausa.id);
  }
 }
 expect([...aplicacoes].sort()).toEqual(Object.keys(ancorasDeAplicacao).sort());
});

import {describe, expect, it} from 'vitest';
import metricas from '../../src/content/metricas.json';
import {courses, lessons} from '../../src/content/curriculum';
import {practiceActivities} from '../../src/content/practice';
import {learningPaths, capstoneProjects} from '../../src/content/project-paths';
import matriz from '../../docs/cobertura-curriculo.json';

describe('métricas publicadas', () => {
 it('conserva os totais reais usados pela interface sem carregar aulas completas', () => {
  expect(metricas.aulas).toBe(lessons.length);
  expect(metricas.trilhas).toBe(courses.length);
  expect(metricas.atividadesCorrigiveis).toBe(practiceActivities.length);
  expect(metricas.aulasComPausas).toBe(new Set(practiceActivities.flatMap(atividade => atividade.lessonIds)).size);
  expect(metricas.linguagens).toEqual([...new Set(practiceActivities.map(atividade => atividade.language))].sort());
  expect(Object.values(metricas.atividadesPorLinguagem).reduce((total, quantidade) => total + quantidade, 0)).toBe(practiceActivities.length);
 });
 it('distingue tópicos introduzidos de problemas específicos e critérios manuais', () => {
  const aulas = matriz.courses.flatMap(trilha => trilha.lessons);
  const problemas = new Set(aulas.flatMap(aula => 'practices' in aula ? aula.practices.map(problema => aula.id + ':' + problema.id) : []));
  expect(metricas.problemasIndependentes).toBe(problemas.size);
  expect(metricas.entradasCobertura).toBe(metricas.entradasComPratica + metricas.entradasIntroduzidas);
  expect(metricas.entradasComPratica).toBe(aulas.flatMap(aula => aula.topics).filter(topico => topico.status === 'praticaIndependente').length);
  expect(metricas.projetosConclusao).toBe(capstoneProjects.length);
  expect(metricas.marcosProjeto).toBe(capstoneProjects.flatMap(projeto => projeto.milestones).length);
  expect(metricas.criteriosManuais).toBe(capstoneProjects.flatMap(projeto => projeto.milestones.flatMap(marco => marco.criteria)).length);
  expect(metricas.percursosEngenharia).toBe(learningPaths.length);
  expect(metricas.etapasEngenharia).toBe(learningPaths.flatMap(percurso => percurso.stages).length);
 });
});

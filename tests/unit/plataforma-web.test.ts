import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import html from '../../src/content/deep/html';
import css from '../../src/content/deep/css';

it.each([
 ['html-plataforma-prever-fragmento','2\n0',['3\n1','2\n1','1\n0','2']],
 ['css-visual-prever-preenchimento','1\n0.5\n0.8',['0.2\n0.5\n0.8','1\n0.6\n1','1\n0.5']],
 ['css-arquitetura-prever-camadas','fora\nbase',['fora\nfora','componente\ncomponente','base\nfora']]
])('%s exige todos os efeitos previstos, sem alegar execução',async(id,certa,erradas)=>{
 expect(await evaluatePractice(id,certa as string)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const errada of erradas)expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it.each([
 ['html-plataforma-limpar-listener','referencia'],
 ['css-visual-isolar-transparencia','fundo'],
 ['css-arquitetura-consultar-subgrid','propriedade']
])('%s distingue cada diagnóstico e conserva a solução sob consulta',async(id,certa)=>{
 const pausa=[...practicesForLesson('html-plataforma'),...practicesForLesson('css-visual-movimento'),...practicesForLesson('css-arquitetura')].find(p=>p.id===id)!;
 for(const opcao of pausa.options!){const resultado=await evaluatePractice(id,opcao.id);expect(resultado.passed).toBe(opcao.id===certa);expect(resultado.execution).toBe('not-run');if(!resultado.passed)expect(resultado.feedback).not.toContain(getPracticeSolution(id)!);}
});
it.each([
 ['css-visual-completar-fases','both',['backwards','forwards','none','both; opacity:0','animation-fill-mode:both']],
 ['css-arquitetura-restaurar-camada','revert-layer',['revert','initial','inherit','navy','revert-layer!important']]
])('%s aceita a mesma palavra CSS em outra caixa e rejeita alterações fora do contrato',async(id,certa,erradas)=>{
 for(const valor of [certa as string,(certa as string).toUpperCase(),'  '+certa+'  '])expect((await evaluatePractice(id,valor)).passed).toBe(true);
 for(const errada of erradas)expect((await evaluatePractice(id,errada)).passed).toBe(false);
});
it('a montagem exige o fragmento preenchido antes de transferir seus nós',async()=>{
 const id='html-plataforma-montar-nota',ordem=['abrir','modelo','clonar','texto','anexar','fechar'];
 expect(await evaluatePractice(id,ordem)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 expect((await evaluatePractice(id,ordem.join('\n'))).passed).toBe(true);
 for(const tentativa of [ordem.slice(0,-1),[...ordem,'extra'],['abrir','modelo','clonar','anexar','texto','fechar'],['abrir','clonar','modelo','texto','anexar','fechar'],['abrir','modelo','clonar','texto','texto','fechar']])expect((await evaluatePractice(id,tentativa)).passed).toBe(false);
});
it.each(['html-plataforma','css-visual-movimento','css-arquitetura'])('%s recebe três habilidades e mantém exercício e projeto abertos',aula=>{
 const original=[...html.lessons,...css.lessons].find(a=>a.id===aula)!,pausas=practicesForLesson(aula);
 expect(original.sections).toHaveLength(6);expect(original.exercise.length).toBeGreaterThan(100);expect(original.project.length).toBeGreaterThan(100);
 expect(pausas).toHaveLength(3);expect(new Set(pausas.flatMap(p=>p.skillIds)).size).toBe(3);expect(pausas.every(p=>p.requiresConcept)).toBe(true);
 expect(pausas.map(p=>p.kind).sort()).toEqual(aula==='html-plataforma'?['choice','order','predict']:['choice','fill','predict']);
 for(const pausa of pausas){expect(getPracticeSolution(pausa.id)).toBeTruthy();expect('solution' in pausa).toBe(false);}
});

it('a previsão de opacidade aceita números equivalentes sem aceitar lixo ou respostas incompletas',async()=>{
 const id='css-visual-prever-preenchimento';
 for(const resposta of ['1.0\n.5\n8e-1','+1\n0.50\n.800'])expect((await evaluatePractice(id,resposta)).passed).toBe(true);
 for(const resposta of ['1px\n.5\n.8','1\n0.5texto\n0.8','1\n.5\nInfinity','1\n.5\n.8\n0'])expect((await evaluatePractice(id,resposta)).passed).toBe(false);
});

import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog} from '../../src/learning/hub-catalog';
import {lessons} from '../../src/content/curriculum';

it('os dois recortes C# são conceituais e não alegam execução do aluno',async()=>{
 expect(await evaluatePractice('api-prever-transacao','0\n1')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 expect((await evaluatePractice('api-prever-transacao','1\n2')).passed).toBe(false);
 const pausa=practicesForLesson('projeto-api').find(p=>p.id==='api-vincular-parametro')!;
 for(const opcao of pausa.options!){const resultado=await evaluatePractice(pausa.id,opcao.id);expect(resultado.passed).toBe(opcao.id==='vincular');expect(resultado.evidence).toBe('conceptual');if(opcao.id!=='vincular')expect(resultado.feedback).not.toContain(getPracticeSolution(pausa.id)!);}
});
it('mantém o projeto aberto e classifica parâmetros/transações como C#',()=>{
 const pausas=practicesForLesson('projeto-api');expect(pausas.map(p=>p.afterBlock)).toEqual([3,6]);
 for(const pausa of pausas){expect(pausa.language).toBe('csharp');for(const id of pausa.skillIds)expect(adaptiveCatalog.skills.find(h=>h.id===id)?.linguagem).toBe('csharp');}
 const aula=lessons.find(l=>l.id==='projeto-api')!;expect(aula.capitulos).toHaveLength(12);expect(aula.exercise).toContain('fatia completa');expect(aula.code).toContain('POST /produtos');
});

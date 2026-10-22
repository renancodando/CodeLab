import {describe,it,expect} from 'vitest';
import ts from 'typescript';
import {courses,lessons,resolveLesson} from '../../src/content/curriculum';
import {expandedCourses,expandedLessons} from '../../src/content/deep/index';
import python from '../../src/content/deep/python';
import typescript from '../../src/content/deep/typescript';
import cpp from '../../src/content/deep/cpp';
import javascript from '../../src/content/deep/javascript';
import html from '../../src/content/deep/html';
import css from '../../src/content/deep/css';
import csharp from '../../src/content/deep/csharp';
import sql from '../../src/content/deep/sql';
import type {DeepCourse} from '../../src/content/deep/types';
import coverage from '../../docs/cobertura-curriculo.json';
import {evaluate} from '../../src/execution/evaluate';

const definitions:DeepCourse[]=[python,typescript,cpp,javascript,html,css,csharp,sql];
function compilarAmostras(amostras:{nome:string;codigo:string}[]){
 const opcoes:ts.CompilerOptions={strict:true,noEmit:true,types:[],target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,lib:['lib.es2022.d.ts','lib.dom.d.ts']};
 const arquivos=new Map(amostras.map(amostra=>[amostra.nome,"export {};\n"+amostra.codigo]));
 const host=ts.createCompilerHost(opcoes),original=host.getSourceFile.bind(host);
 host.getSourceFile=(arquivo,versao,erro,recriar)=>arquivos.has(arquivo)?ts.createSourceFile(arquivo,arquivos.get(arquivo)!,versao,true):original(arquivo,versao,erro,recriar);
 const programa=ts.createProgram([...arquivos.keys()],opcoes,host);
 return ts.getPreEmitDiagnostics(programa).filter(diagnostico=>diagnostico.category===ts.DiagnosticCategory.Error);
}

describe('expansão por linguagem',()=>{
 it('publica oito percursos sequenciais com aulas reais em todas as linguagens',async()=>{
  expect(expandedCourses).toHaveLength(8);expect(expandedLessons).toHaveLength(77);
  expect(courses).toHaveLength(20);expect(lessons).toHaveLength(137);
  expect(new Set(expandedLessons.map(l=>l.language))).toEqual(new Set(['html','javascript','typescript','python','csharp','cpp','sql']));
  let temas=0;
  for(const course of expandedCourses){
   expect(course.lessonIds).toHaveLength(['python-completo','typescript-completo','cpp-completo','javascript-completo','css-completo'].includes(course.id)?10:9);
   const aulas=await Promise.all(course.lessonIds.map(id=>resolveLesson(id)));
   expect(aulas[0]?.level).toBe('Fundamentos');expect(aulas.at(-1)?.level).toBe('Especialização');
   for(const aula of aulas){
    expect(aula).toBeDefined();expect(aula!.track).toBe(course.id);
    const entry=definitions.find(c=>c.id===course.id)!.lessons.find(l=>l.id===aula!.id)!;
    const chapters=7+entry.sections.length+2*(entry.practices?.length??0);expect(aula!.capitulos).toHaveLength(chapters);
    expect(aula!.capitulos.slice(1,1+entry.sections.length).map(capitulo=>capitulo.titulo)).toEqual(entry.sections.map(secao=>secao.title));
    expect(new Set(aula!.capitulos.map(c=>c.id)).size).toBe(chapters);
    expect(aula!.topics!.length).toBeGreaterThanOrEqual(8);temas+=aula!.topics!.length;
    const teoria=aula!.capitulos.filter(c=>c.id==='contexto'||c.id.startsWith('teoria-'));
    expect(teoria).toHaveLength(entry.sections.length);expect(teoria.length).toBeGreaterThanOrEqual(6);
    expect(teoria.map(capitulo=>capitulo.paragrafos)).toEqual(entry.sections.map(secao=>secao.text));
    expect(teoria.flatMap(c=>c.paragrafos).join(' ').length,aula!.id).toBeGreaterThan(2400);
    expect(aula!.capitulos.find(c=>c.id==='codigo')!.pontos).toHaveLength(3);
    expect(aula!.capitulos.find(c=>c.id==='erro')!.codigo,aula!.id).toBeTruthy();
    expect(aula!.capitulos.find(c=>c.id==='pratica')!.pontos).toHaveLength(3);
   }
  }
  expect(temas).toBe(654);
 });
 it('conserva um único resultado de carregamento ao resolver a mesma aula simultaneamente',async()=>{
  const [a,b]=await Promise.all([resolveLesson('py-fundamentos'),resolveLesson('py-fundamentos')]);expect(a).toBe(b);expect(a?.capitulos).toHaveLength(13);
  expect(await resolveLesson('aula-inexistente')).toBeUndefined();
 });
 for(const metadata of expandedLessons.filter(l=>l.language==='typescript')){
  it('TypeScript strict: exemplo e solução de '+metadata.id,async()=>{
   const aula=(await resolveLesson(metadata.id))!;
   const entry=typescript.lessons.find(l=>l.id===metadata.id)!;
   const amostras=[['exemplo',aula.code],['solução',aula.solution],...('practices' in entry?entry.practices.map(p=>['problema-'+p.id,p.solution]):[])];
   const erros=compilarAmostras(amostras.map(([tipo,codigo])=>({nome:'/codelab-'+metadata.id+'-'+tipo+'.ts',codigo})));
   expect(erros.map(erro=>({arquivo:erro.file?.fileName,mensagem:ts.flattenDiagnosticMessageText(erro.messageText,' ')})),metadata.id).toEqual([]);
  },30000);
 }
 it('a compilação conjunta conserva escopos de módulos e diagnósticos strict/DOM',()=>{
  const erros=compilarAmostras([
   {nome:'/escopo-a.ts',codigo:'const valor=1; const privado="texto";'},
   {nome:'/escopo-b.ts',codigo:'const valor="dois";'},
   {nome:'/tipo-incorreto.ts',codigo:'const total: number = "texto";'},
   {nome:'/nome-ausente.ts',codigo:'console.log(privado.length);'},
   {nome:'/nulo.ts',codigo:'const texto: string | null = null; console.log(texto.length);'},
   {nome:'/dom.ts',codigo:'document.body.inexistente();'}
  ]);
  expect(erros.filter(erro=>['/escopo-a.ts','/escopo-b.ts'].includes(erro.file?.fileName??''))).toEqual([]);
  for(const [arquivo,codigo] of [['/tipo-incorreto.ts',2322],['/nome-ausente.ts',2304],['/nulo.ts',18047],['/dom.ts',2339]] as const){
   expect(erros.some(erro=>erro.file?.fileName===arquivo&&erro.code===codigo),arquivo).toBe(true);
  }
 },30000);
 const expected:Record<string,string[]>= {
  'js-semantica':['1 2 11','0 5','true'],
  'js-funcoes-this':['13','[2,4,6]'],
  'js-objetos-modelos':['350','0'],
  'js-colecoes-iteracao':['[[2,2],[3,1]]','[1,2,10]'],
  'js-assincrono':['[4,"erro",6]'],
  'js-modulos-engenharia':['{"nome":"Lia","pontos":3}']
 };
 for(const [id,logs] of Object.entries(expected))it('resultado real do exemplo '+id,async()=>{
  const aula=(await resolveLesson(id))!,result=await evaluate(aula.code,'laboratorio');expect(result.error).toBeUndefined();expect(result.logs).toEqual(logs);
  const solution=await evaluate(aula.solution,'laboratorio');expect(solution.error).toBeUndefined();
 });
});

describe('prática independente e mapa de cobertura',()=>{
 const expanded=definitions.flatMap(c=>c.lessons).filter(l=>l.practices);
 it('publica vinte e nove aulas com dois problemas específicos e referências próprias',async()=>{
  expect(expanded).toHaveLength(29);
  for(const entry of expanded){
   expect(entry.sections.flatMap(s=>s.text).join(' ').length,entry.id).toBeGreaterThan(4500);
   expect(entry.practices,entry.id).toHaveLength(2);
   expect(new Set(entry.practices!.map(p=>p.id)).size).toBe(2);
   const resolved=(await resolveLesson(entry.id))!;
   expect(resolved.capitulos).toHaveLength(17);expect(resolved.source).toBe(entry.source);
   for(const p of entry.practices!){
    expect(p.prompt.length,entry.id+' '+p.id).toBeGreaterThan(100);
    expect(p.explanation.join(' ').length,entry.id+' '+p.id).toBeGreaterThan(300);
    expect(p.checks).toHaveLength(3);
    expect(p.topics.length).toBeGreaterThan(0);
    for(const topic of p.topics)expect(entry.topics).toContain(topic);
    expect(resolved.capitulos.find(c=>c.id==='resolucao-'+p.id)?.codigo).toBe(p.solution);
   }
  }
 });
 it('atribui prática independente somente às atividades que realmente a exercitam',()=>{
  let independent=0;
  for(const course of coverage.courses)for(const lesson of course.lessons){
   const definition=definitions.find(c=>c.id===course.id)!.lessons.find(l=>l.id===lesson.id)!;
   for(const topic of lesson.topics){
    const activities=definition.practices?.filter(p=>p.topics.includes(topic.title)).map(p=>p.id)??[];
    expect(topic.status).toBe(activities.length?'praticaIndependente':'introduzido');
    if(activities.length){
     independent++;
     expect('activities' in topic?topic.activities:undefined).toEqual(activities);
    }
   }
  }
  expect(independent).toBe(162);
 });
 for(const entry of javascript.lessons.filter(l=>'practices' in l)){
  it('executa exemplo, exercício e dois problemas de '+entry.id,async()=>{
   const samples=[
    {code:entry.code,expected:entry.expectedOutput},
    {code:entry.solution,expected:entry.solutionOutput},
    ...entry.practices.map(p=>({code:p.solution,expected:p.expectedOutput}))
   ];
   for(const sample of samples){
    const result=await evaluate(sample.code,'laboratorio');
    expect(result.error).toBeUndefined();expect(result.logs).toEqual(sample.expected);
   }
  });
 }
});

import {describe,it,expect} from 'vitest';
import ts from 'typescript';
import {courses,lessons,resolveLesson} from '../../src/content/curriculum';
import {expandedCourses,expandedLessons} from '../../src/content/deep/index';
import {evaluate} from '../../src/execution/evaluate';

describe('expansão por linguagem',()=>{
 it('publica oito percursos sequenciais com seis módulos reais por linguagem',async()=>{
  expect(expandedCourses).toHaveLength(8);expect(expandedLessons).toHaveLength(48);
  expect(courses).toHaveLength(20);expect(lessons).toHaveLength(108);
  expect(new Set(expandedLessons.map(l=>l.language))).toEqual(new Set(['html','javascript','typescript','python','csharp','cpp','sql']));
  let temas=0;
  for(const course of expandedCourses){
   expect(course.lessonIds).toHaveLength(6);
   const aulas=await Promise.all(course.lessonIds.map(id=>resolveLesson(id)));
   expect(aulas[0]?.level).toBe('Fundamentos');expect(aulas.at(-1)?.level).toBe('Especialização');
   for(const aula of aulas){
    expect(aula).toBeDefined();expect(aula!.track).toBe(course.id);expect(aula!.capitulos).toHaveLength(13);
    expect(new Set(aula!.capitulos.map(c=>c.id)).size).toBe(13);
    expect(aula!.topics!.length).toBeGreaterThanOrEqual(8);temas+=aula!.topics!.length;
    const teoria=aula!.capitulos.filter(c=>c.id==='contexto'||c.id.startsWith('teoria-'));
    expect(teoria).toHaveLength(6);expect(teoria.flatMap(c=>c.paragrafos).join(' ').length,aula!.id).toBeGreaterThan(2400);
    expect(aula!.capitulos.find(c=>c.id==='codigo')!.pontos).toHaveLength(3);
    expect(aula!.capitulos.find(c=>c.id==='erro')!.codigo,aula!.id).toBeTruthy();
    expect(aula!.capitulos.find(c=>c.id==='pratica')!.pontos).toHaveLength(3);
   }
  }
  expect(temas).toBe(414);
 });
 it('conserva um único resultado de carregamento ao resolver a mesma aula simultaneamente',async()=>{
  const [a,b]=await Promise.all([resolveLesson('py-fundamentos'),resolveLesson('py-fundamentos')]);expect(a).toBe(b);expect(a?.capitulos).toHaveLength(13);
  expect(await resolveLesson('aula-inexistente')).toBeUndefined();
 });
 for(const metadata of expandedLessons.filter(l=>l.language==='typescript')){
  it('TypeScript strict: exemplo e solução de '+metadata.id,async()=>{
   const aula=(await resolveLesson(metadata.id))!;
   for(const [kind,code] of [['exemplo',aula.code],['solução',aula.solution]]){
    const name='/codelab-'+metadata.id+'-'+kind+'.ts',source="export {};\n"+code;
    const options:ts.CompilerOptions={strict:true,noEmit:true,types:[],target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,lib:['lib.es2022.d.ts','lib.dom.d.ts']};
    const host=ts.createCompilerHost(options),original=host.getSourceFile.bind(host);
    host.getSourceFile=(file,version,onError,shouldCreate)=>file===name?ts.createSourceFile(name,source,version,true):original(file,version,onError,shouldCreate);
    const program=ts.createProgram([name],options,host);
    const errors=ts.getPreEmitDiagnostics(program).filter(d=>d.category===ts.DiagnosticCategory.Error);
    expect(errors.map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')),metadata.id+' '+kind).toEqual([]);
   }
  },30000);
 }
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

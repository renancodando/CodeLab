import {readFile,writeFile,readdir} from 'node:fs/promises';
import ts from 'typescript';

const preferred=['python','typescript','cpp','javascript','html','css','csharp','sql'];
const found=(await readdir('src/content/deep')).filter(f=>f.endsWith('.ts')&&!['index.ts','types.ts'].includes(f)).map(f=>f.slice(0,-3));
const keys=[...preferred.filter(k=>found.includes(k)),...found.filter(k=>!preferred.includes(k)).sort()];
const courses=[],lessons=[],loaders=[],coverage=[];
for(const key of keys){
 const output=ts.transpileModule(await readFile('src/content/deep/'+key+'.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
 const {default:course}=await import('data:text/javascript;base64,'+Buffer.from(output).toString('base64'));
 const {lessons:entries,language,source,environment,...metadata}=course;
 courses.push({...metadata,lessonIds:entries.map(l=>l.id)});
 for(const l of entries)lessons.push({id:l.id,track:course.id,title:l.title,body:l.summary,level:l.level,topics:l.topics,language:course.language,source:l.source??course.source,capitulos:[],code:'',exercise:'',solution:'',error:'',question:'',options:[],correct:0});
 loaders.push(JSON.stringify(course.id)+":()=>import('./"+key+"')");
 coverage.push({id:course.id,title:course.title,lessons:entries.map(l=>({id:l.id,title:l.title,level:l.level,topics:l.topics,practices:l.practices?.map(p=>({id:p.id,title:p.title,topics:p.topics})),source:l.source??course.source}))});
}
const index="import type {Course,Lesson} from '../curriculum';\nimport {materialize,type DeepCourse} from './types';\nexport const expandedCourses:Course[]="+JSON.stringify(courses,null,2)+";\nexport const expandedLessons:Lesson[]="+JSON.stringify(lessons,null,2)+";\nconst loaders:Record<string,()=>Promise<{default:DeepCourse}>>={"+loaders.join(',')+"};\nconst pending=new Map<string,Promise<DeepCourse>>();\nexport async function resolveExpandedLesson(id:string):Promise<Lesson|undefined>{\n const metadata=expandedLessons.find(l=>l.id===id);if(!metadata)return;\n let promise=pending.get(metadata.track);\n if(!promise){promise=loaders[metadata.track]().then(module=>module.default);pending.set(metadata.track,promise);promise.catch(()=>pending.delete(metadata.track));}\n const course=await promise,entry=course.lessons.find(l=>l.id===id);\n return entry?materialize(course,entry):undefined;\n}\n";
const previous=JSON.parse(await readFile('docs/cobertura-curriculo.json','utf8'));
const edition=process.argv.find(arg=>arg.startsWith('--edition='))?.slice(10)??previous.edition;
const source=ts.createSourceFile('curriculum.ts',await readFile('src/content/curriculum.ts','utf8'),ts.ScriptTarget.ESNext,true,ts.ScriptKind.TS);
let original=0,originalLessons=0;
const count=node=>{
 if(ts.isCallExpression(node)&&ts.isIdentifier(node.expression)&&node.expression.text==='course'){
  const entries=node.arguments.at(-1);if(!entries||!ts.isArrayLiteralExpression(entries))throw new Error('A trilha original exige uma lista explícita de aulas para gerar a matriz.');
  original++;originalLessons+=entries.elements.length;
 }
 ts.forEachChild(node,count);
};
count(source);
const matrix=JSON.stringify({edition,originalLessons,expandedLessons:lessons.length,totalLessons:originalLessons+lessons.length,totalCourses:original+courses.length,statusLegend:previous.statusLegend,courses:coverage.map(c=>({...c,lessons:c.lessons.map(l=>({...l,status:'praticaDoModulo',topics:l.topics.map(title=>({title,status:l.practices?.some(p=>p.topics.includes(title))?'praticaIndependente':'introduzido',...(l.practices?.some(p=>p.topics.includes(title))?{activities:l.practices.filter(p=>p.topics.includes(title)).map(p=>p.id)}:{})}))}))}))},null,2)+'\n';
for(const [path,content] of [['src/content/deep/index.ts',index],['docs/cobertura-curriculo.json',matrix]]){
 if(process.argv.includes('--check')){
  if(await readFile(path,'utf8')!==content)throw new Error(path+' está desatualizado. Execute npm run content:generate e revise as contagens/documentação.');
 }else await writeFile(path,content);
}
console.log('Índice e matriz '+(process.argv.includes('--check')?'conferidos':'atualizados')+': '+courses.length+' percursos adicionais, '+lessons.length+' aulas.');

import {readFile} from 'node:fs/promises';
import ts from 'typescript';

const compilar=fonte=>ts.transpileModule(fonte,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const comoUrl=fonte=>'data:text/javascript;base64,'+Buffer.from(fonte).toString('base64');
export async function carregarPraticas(){
 const fontes=new Map();
 for(const nome of ['practice','solucoes-sql','contratos-integracao','contratos-projetos'])fontes.set(nome,comoUrl(compilar(await readFile('src/content/'+nome+'.ts','utf8'))));
 let corretor=compilar(await readFile('src/learning/practice.ts','utf8'));
 for(const [nome,url] of fontes)corretor=corretor.replace(new RegExp('from [\'\"]\\.\\./content/'+nome+'[\'\"]','g'),'from '+JSON.stringify(url));
 const {practiceActivities}=await import(fontes.get('practice'));
 const {getPracticeSolution}=await import(comoUrl(corretor));
 return {practiceActivities,getPracticeSolution};
}

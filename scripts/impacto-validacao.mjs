import {readFile,readdir,writeFile,appendFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

export const essenciais=['execution','progress-migration','hub-backup','practice','adaptive'];
const centrais=['src/content/practice.ts','src/learning/practice.ts','src/content/explicacoes.ts','src/content/curriculum.ts'];
const nativas=['aspnet-dto','aspnet-escopos','aspnet-rotas','cpp-conceitos','cpp-posse','csharp-iteradores','csharp-linq','dotnet-fundamentos','csharp-controle','csharp-objetos','csharp-colecoes','csharp-excecoes','csharp-cancelamento','python-engenharia','python-concorrencia','python-numeros','python-csv','python-descritores','typescript-modulos','sql-null','sql-pratica','git-bancada'];
export function selecionarImpacto(arquivos,ids=[],catalogo={unidades:[],navegador:[],textos:{}}){
 const unidades=new Set(),navegador=new Set(),familias=new Set(),motivos=[];
 const produto=arquivos.some(p=>!(/^(docs\/.*\.(md|txt)|README\.md|STATUS\.md|LICENSE|\.github\/ISSUE_TEMPLATE\/)/.test(p)));
 const conteudo=arquivos.some(p=>/^src\/content\/|^docs\/.*\.json$|generate-curriculum|gerar-metricas/.test(p));
 const adicionar=(nome)=>{for(const p of catalogo.unidades)if(p.endsWith('/'+nome+'.test.ts'))unidades.add(p);for(const p of catalogo.navegador)if(p.endsWith('/'+nome+'.spec.ts'))navegador.add(p);if(nativas.includes(nome))familias.add(nome);};
 for(const p of arquivos){
  if(p.startsWith('tests/unit/')&&p.endsWith('.test.ts'))unidades.add(p);
  else if(p.startsWith('tests/e2e/')&&p.endsWith('.spec.ts'))navegador.add(p);
  else if(p.startsWith('tests/fixtures/'))adicionar(p.split('/').at(-1).replace(/\.mjs$/,''));
  else if(centrais.includes(p)){
   if(p!=='src/content/explicacoes.ts')adicionar('practice');
   if(p!=='src/content/explicacoes.ts')for(const id of ids)for(const [teste,texto] of Object.entries(catalogo.textos))if(texto.includes(id)){
    if(teste.startsWith('tests/unit/'))unidades.add(teste);else navegador.add(teste);
    const nome=teste.split('/').at(-1).replace(/\.(test|spec)\.ts$/,'');if(nativas.includes(nome))familias.add(nome);
   }
   if(!ids.length&&p!=='src/content/explicacoes.ts')essenciais.forEach(adicionar);
  }else if(p==='src/content/missions.ts')adicionar('execution');
  else if(p==='src/content/solucoes-sql.ts')adicionar('sql-pratica');
  else if(p==='src/content/project-paths.ts'){adicionar('projects');adicionar('project-archive');}
  else if(/^src\/content\/deep\//.test(p)){
   const lingua=p.split('/').at(-1).replace('.ts','');
   for(const teste of catalogo.unidades)if(teste.split('/').at(-1).startsWith(lingua==='typescript'?'typescript':lingua))unidades.add(teste);
   if(['python','cpp','csharp','sql','typescript'].includes(lingua))familias.add(lingua);
   else adicionar('practice');
  }else if(/^server\/|^api\//.test(p)){adicionar('observacao-servidor');adicionar('identidade-api');adicionar('api');}
  else if(/^src\/execution\//.test(p)){adicionar('execution');if(p.includes('sql'))adicionar('sql-local');if(p.includes('typescript'))adicionar('typescript-worker');}
  else if(/^src\/learning\//.test(p)){essenciais.forEach(adicionar);adicionar(p.split('/').at(-1).replace('.ts',''));}
  else if(/^scripts\/impacto-validacao|^scripts\/validar-alteracoes|^tests\/unit\/impacto-validacao/.test(p))adicionar('impacto-validacao');
  else if(p==='scripts/verify-content-examples.mjs'){adicionar('impacto-validacao');familias.add('aspnet-escopos');}
 }
 const compartilhado=arquivos.some(p=>/^src\/(main|ui|style|styles|environment|world|execution)|^src\/learning\/(progress|backup|storage|project|adaptive)|^public\/|^index\.html$|^package(-lock)?\.json$/.test(p));
 const pipeline=arquivos.some(p=>/^\.github\/workflows\/|^playwright.*config|^scripts\/(impacto-validacao|validar-alteracoes)/.test(p));
 if(compartilhado){essenciais.forEach(adicionar);motivos.push('contratos compartilhados e smoke');}
 if(conteudo)motivos.push('catálogo, métricas e tipos');
 const smoke=produto&&(compartilhado||pipeline||(unidades.size===0&&navegador.size===0&&!conteudo));
 const api=smoke||[...navegador].some(p=>/5080/.test(catalogo.textos[p]??''));
 const dev=[...navegador].some(p=>/5174/.test(catalogo.textos[p]??''));
 const dotnet=api||[...familias].some(n=>/csharp|dotnet|aspnet/.test(n))||arquivos.some(p=>/^server\//.test(p));
 const postgres=[...familias].some(n=>/^sql/.test(n));
 const compatibilidade=arquivos.some(p=>/\.css$|src\/environment\/|src\/world/.test(p));
 const tipos=arquivos.some(p=>/^src\/|^api\/|^server\/.*\.ts$|^.*config\.(ts|js|mjs)$|^package(-lock)?\.json$/.test(p));
 return {produto,conteudo,tipos,unidades:[...unidades].sort(),navegador:[...navegador].sort(),familias:[...familias].sort(),smoke,api,dev,dotnet,postgres,compatibilidade,auditoria:arquivos.some(p=>/^package(-lock)?\.json$/.test(p)),motivos};
}

export function idsDoConteudo(textos){
 const ids=new Set();
 for(const texto of textos){
  const fonte=ts.createSourceFile('conteudo.ts',texto,ts.ScriptTarget.Latest,true);
  const literal=no=>no&&(ts.isStringLiteral(no)||ts.isNoSubstitutionTemplateLiteral(no))?no.text:null;
  function visitar(no){
   if(ts.isObjectLiteralExpression(no)){
    const campos=new Map(no.properties.filter(ts.isPropertyAssignment).map(p=>[p.name.getText(fonte).replace(/['"]/g,''),p.initializer]));
    if(campos.has('lessonIds')||(campos.has('summary')&&campos.has('title'))){const id=literal(campos.get('id'));if(id)ids.add(id);const aulas=campos.get('lessonIds');if(aulas&&ts.isArrayLiteralExpression(aulas))for(const aula of aulas.elements){const id=literal(aula);if(id)ids.add(id);}}
   }
   if(ts.isArrayLiteralExpression(no)&&no.elements.length>3&&literal(no.elements[0])&&literal(no.elements[1]))ids.add(literal(no.elements[0]));
   ts.forEachChild(no,visitar);
  }
  visitar(fonte);
 }
 return ids;
}
export function idsNoDiff(diff,conhecidos){
 const encontrados=new Set();
 for(const linha of diff.split(/\r?\n/)){
  if(!/^[+-](?![+-])/.test(linha))continue;
  const leitor=ts.createScanner(ts.ScriptTarget.Latest,true,ts.LanguageVariant.Standard,linha.slice(1));
  for(let token=leitor.scan();token!==ts.SyntaxKind.EndOfFileToken;token=leitor.scan())
   if(token===ts.SyntaxKind.StringLiteral||token===ts.SyntaxKind.NoSubstitutionTemplateLiteral)encontrados.add(leitor.getTokenValue());
 }
 return [...conhecidos].filter(id=>encontrados.has(id));
}
async function listar(pasta){const entradas=await readdir(pasta,{withFileTypes:true});return (await Promise.all(entradas.map(e=>e.isDirectory()?listar(pasta+'/'+e.name):[pasta+'/'+e.name]))).flat();}
export async function planejar(base){
 const git=args=>execFileSync('git',args,{encoding:'utf8',maxBuffer:8*1024*1024});
 const arquivos=git(['diff','--name-only',base,'HEAD']).trim().split(/\r?\n/).filter(Boolean);
 const unidades=(await listar('tests/unit')).filter(p=>p.endsWith('.test.ts')),navegador=(await listar('tests/e2e')).filter(p=>p.endsWith('.spec.ts'));
 const textos=Object.fromEntries(await Promise.all([...unidades,...navegador].map(async p=>[p,await readFile(p,'utf8')])));
 const fontes=await Promise.all(['src/content/practice.ts','src/content/curriculum.ts'].map(p=>readFile(p,'utf8')));
 for(const p of ['src/content/practice.ts','src/content/curriculum.ts']){try{fontes.push(git(['show',base+':'+p]));}catch{}}
 const ids=idsNoDiff(git(['diff','--unified=0',base,'HEAD','--',...centrais]),idsDoConteudo(fontes));
 const plano=selecionarImpacto(arquivos,ids,{unidades,navegador,textos});
 plano.arquivos=arquivos;plano.ids=ids;plano.base=base;
 return plano;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const base=process.argv[2];if(!base)throw new Error('Informe o SHA base para selecionar as alterações.');
 const plano=await planejar(base);
 if(process.argv.includes('--pos-merge'))Object.assign(plano,{fase:'pos-merge',unidades:[],navegador:[],familias:[],api:plano.produto,dev:false,dotnet:plano.produto,postgres:false,compatibilidade:false,auditoria:false,tipos:false,conteudo:false,smoke:plano.produto});
 await writeFile('plano-validacao.json',JSON.stringify(plano,null,2)+'\n');
 console.log(JSON.stringify(plano,null,2));
 if(process.env.GITHUB_OUTPUT)for(const [nome,valor] of Object.entries({produto:plano.produto,conteudo:plano.conteudo,tipos:plano.tipos,unidades:plano.unidades.length>0,exemplos:plano.familias.length>0,navegador:plano.navegador.length>0||plano.smoke,dotnet:plano.dotnet||plano.api,api:plano.api,postgres:plano.postgres,canais:JSON.stringify(plano.compatibilidade?['chromium','msedge']:['chromium']),auditoria:plano.auditoria}))await appendFile(process.env.GITHUB_OUTPUT,nome+'='+valor+'\n');
}

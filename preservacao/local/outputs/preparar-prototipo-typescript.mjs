import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {build} from '../work/CodeLab/node_modules/vite/dist/node/index.js';
const raiz=resolve('../../outputs/prototipo-typescript'),libs=resolve('node_modules/typescript/lib'),bibliotecas=new Map();mkdirSync(raiz,{recursive:true});
function incluir(nome){if(bibliotecas.has(nome))return;const texto=readFileSync(join(libs,nome),'utf8');bibliotecas.set(nome,texto);for(const referencia of texto.matchAll(/<reference lib="([^"]+)"/g))incluir('lib.'+referencia[1]+'.d.ts');}
incluir('lib.es2022.d.ts');writeFileSync(join(raiz,'bibliotecas.json'),JSON.stringify(Object.fromEntries(bibliotecas)));
writeFileSync(join(raiz,'index.html'),'<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Medição local do compilador</title><script type="module" src="/entrada.js"></script></html>');
writeFileSync(join(raiz,'entrada.js'),`window.iniciarCompilador=()=>new Worker(new URL('./compilador.js',import.meta.url),{type:'module'});`);
writeFileSync(join(raiz,'compilador.js'),`import ts from '../../work/CodeLab/node_modules/typescript/lib/typescript.js';
import bibliotecas from './bibliotecas.json';
self.onmessage=evento=>{
 const fontes=new Map(Object.entries(bibliotecas).map(([nome,texto])=>['/'+nome,texto]));fontes.set('/ambiente.d.ts','declare const console: {log(...valores: unknown[]): void};');fontes.set('/entrada.ts',evento.data);
 const saida=[],host={getSourceFile:(nome,linguagem)=>fontes.has(nome)?ts.createSourceFile(nome,fontes.get(nome),linguagem,true):undefined,getDefaultLibFileName:()=>'/lib.es2022.d.ts',writeFile:(nome,texto)=>saida.push({nome,texto}),getCurrentDirectory:()=> '/',getDirectories:()=>[],fileExists:nome=>fontes.has(nome),readFile:nome=>fontes.get(nome),getCanonicalFileName:nome=>nome,useCaseSensitiveFileNames:()=>true,getNewLine:()=> '\\n'};
 const inicio=performance.now(),programa=ts.createProgram(['/entrada.ts','/ambiente.d.ts'],{strict:true,noEmitOnError:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None,lib:['lib.es2022.d.ts'],skipLibCheck:true},host),diagnosticos=ts.getPreEmitDiagnostics(programa),emitido=programa.emit();
 self.postMessage({versao:ts.version,milissegundos:Math.round(performance.now()-inicio),erros:diagnosticos.map(d=>({codigo:d.code,mensagem:ts.flattenDiagnosticMessageText(d.messageText,'\\n')})),emitiu:!emitido.emitSkipped,saida});
};`);
await build({root:raiz,configFile:false,build:{target:'es2022'},worker:{format:'es'}});

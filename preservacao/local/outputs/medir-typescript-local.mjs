import ts from '../work/CodeLab/node_modules/typescript/lib/typescript.js';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {gzipSync} from 'node:zlib';
const raiz=resolve('node_modules/typescript/lib'),bibliotecas=new Map();
function incluir(nome){if(bibliotecas.has(nome))return;const texto=readFileSync(join(raiz,nome),'utf8');bibliotecas.set(nome,texto);for(const referencia of texto.matchAll(/<reference lib="([^"]+)"/g))incluir('lib.'+referencia[1]+'.d.ts');}
incluir('lib.es2022.d.ts');
const conteudo=JSON.stringify(Object.fromEntries(bibliotecas)),compilador=readFileSync(join(raiz,'typescript.js'));
const fontes=new Map([...bibliotecas].map(([nome,texto])=>['/'+nome,texto]));fontes.set('/ambiente.d.ts','declare const console: {log(...valores: unknown[]): void};');
const opcoes={strict:true,noEmitOnError:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,lib:['lib.es2022.d.ts'],skipLibCheck:true};
const casos=[['correto','interface Pedido {valor: number} const pedidos: Pedido[] = [{valor: 3}, {valor: 5}]; console.log(pedidos.reduce((soma,pedido)=>soma+pedido.valor,0));'],['tipo-invalido','const total: number = "8"; console.log(total);'],['rede-indisponivel','fetch("https://example.com");'],['modulo-ausente','import {dobrar} from "./calculo.js"; console.log(dobrar(3));']];
const resultados=[];
for(const [cenario,codigo] of casos){fontes.set('/entrada.ts',codigo);const saida=[];
 const host={getSourceFile:(nome,linguagem)=>fontes.has(nome)?ts.createSourceFile(nome,fontes.get(nome),linguagem,true):undefined,getDefaultLibFileName:()=>'/lib.es2022.d.ts',writeFile:(nome,texto)=>saida.push({nome,texto}),getCurrentDirectory:()=> '/',getDirectories:()=>[],fileExists:nome=>fontes.has(nome),readFile:nome=>fontes.get(nome),getCanonicalFileName:nome=>nome,useCaseSensitiveFileNames:()=>true,getNewLine:()=> '\n'};
 const antes=performance.now(),programa=ts.createProgram(['/entrada.ts','/ambiente.d.ts'],opcoes,host),diagnosticos=ts.getPreEmitDiagnostics(programa),emitido=programa.emit();
 resultados.push({cenario,milissegundos:Math.round(performance.now()-antes),erros:diagnosticos.map(d=>({codigo:d.code,mensagem:ts.flattenDiagnosticMessageText(d.messageText,'\n')})),emitiu:!emitido.emitSkipped,saida});
}
const medicao={typescript:ts.version,compiladorBytes:compilador.length,compiladorGzip:gzipSync(compilador).length,bibliotecas:bibliotecas.size,bibliotecasBytes:Buffer.byteLength(conteudo),bibliotecasGzip:gzipSync(conteudo).length,memoria:process.memoryUsage(),resultados,limites:'Protótipo Node, não mede memória/FPS de celular. Não integrado ao produto.'};writeFileSync('../../outputs/medicao-typescript-20261011.json',JSON.stringify(medicao,null,2)+'\n');console.log(JSON.stringify(medicao,null,2));

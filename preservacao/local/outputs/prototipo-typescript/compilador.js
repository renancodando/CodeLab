import ts from '../../work/CodeLab/node_modules/typescript/lib/typescript.js';
import bibliotecas from './bibliotecas.json';
self.onmessage=evento=>{
 const fontes=new Map(Object.entries(bibliotecas).map(([nome,texto])=>['/'+nome,texto]));fontes.set('/ambiente.d.ts','declare const console: {log(...valores: unknown[]): void};');fontes.set('/entrada.ts',evento.data);
 const saida=[],host={getSourceFile:(nome,linguagem)=>fontes.has(nome)?ts.createSourceFile(nome,fontes.get(nome),linguagem,true):undefined,getDefaultLibFileName:()=>'/lib.es2022.d.ts',writeFile:(nome,texto)=>saida.push({nome,texto}),getCurrentDirectory:()=> '/',getDirectories:()=>[],fileExists:nome=>fontes.has(nome),readFile:nome=>fontes.get(nome),getCanonicalFileName:nome=>nome,useCaseSensitiveFileNames:()=>true,getNewLine:()=> '\n'};
 const inicio=performance.now(),programa=ts.createProgram(['/entrada.ts','/ambiente.d.ts'],{strict:true,noEmitOnError:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None,lib:['lib.es2022.d.ts'],skipLibCheck:true},host),diagnosticos=ts.getPreEmitDiagnostics(programa),emitido=programa.emit();
 self.postMessage({versao:ts.version,milissegundos:Math.round(performance.now()-inicio),erros:diagnosticos.map(d=>({codigo:d.code,mensagem:ts.flattenDiagnosticMessageText(d.messageText,'\n')})),emitiu:!emitido.emitSkipped,saida});
};
import ts from 'typescript';

export type DiagnosticoTs={codigo:number;mensagem:string;linha?:number;coluna?:number};
export type CompilacaoTs={javascript:string;diagnosticos:DiagnosticoTs[];erro?:string;versao:string};
export function compilarTypescript(codigo:string,bibliotecas:ReadonlyMap<string,string>):CompilacaoTs{
 const resposta:CompilacaoTs={javascript:'',diagnosticos:[],versao:ts.version};
 if(typeof codigo!=='string'||codigo.length>30000)return{...resposta,erro:'Limite de 30.000 caracteres. Divida o programa em partes menores.'};
 const entrada=ts.createSourceFile('/entrada.ts',codigo,ts.ScriptTarget.ES2022,true);
 let externo=false;
 function inspecionar(no:ts.Node){
  if(ts.isImportDeclaration(no)||ts.isImportEqualsDeclaration(no)||ts.isImportTypeNode(no)||ts.isExportDeclaration(no)||ts.isExportAssignment(no)||(ts.isCallExpression(no)&&no.expression.kind===ts.SyntaxKind.ImportKeyword)||(ts.canHaveModifiers(no)&&ts.getModifiers(no)?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)))externo=true;
  ts.forEachChild(no,inspecionar);
 }
 inspecionar(entrada);
 if(externo)return{...resposta,erro:'Esta bancada compila um script TypeScript isolado. Imports, exports e pacotes exigem o ambiente indicado na aula; exporte o arquivo para trabalhar com módulos.'};
 const fontes=new Map(bibliotecas);fontes.set('/entrada.ts',codigo);fontes.set('/ambiente.d.ts','declare const console: { log(...valores: unknown[]): void };');
 const host:ts.CompilerHost={
  getSourceFile:(nome,linguagem)=>nome==='/entrada.ts'?entrada:fontes.has(nome)?ts.createSourceFile(nome,fontes.get(nome)!,linguagem,true):undefined,
  getDefaultLibFileName:()=>'/lib.es2022.d.ts',writeFile:(nome,texto)=>{if(nome==='/entrada.js')resposta.javascript=texto;},
  getCurrentDirectory:()=> '/',getDirectories:()=>[],fileExists:nome=>fontes.has(nome),readFile:nome=>fontes.get(nome),
  getCanonicalFileName:nome=>nome,useCaseSensitiveFileNames:()=>true,getNewLine:()=> '\n'
 };
 const programa=ts.createProgram(['/entrada.ts','/ambiente.d.ts'],{strict:true,noEmitOnError:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None,lib:['lib.es2022.d.ts'],types:[],skipLibCheck:true},host);
 const diagnosticos=ts.getPreEmitDiagnostics(programa);
 resposta.diagnosticos=diagnosticos.slice(0,50).map(d=>{
  const posicao=d.file&&d.start!==undefined?d.file.getLineAndCharacterOfPosition(d.start):undefined;
  return{codigo:d.code,mensagem:ts.flattenDiagnosticMessageText(d.messageText,'\n').slice(0,1000),...(posicao?{linha:posicao.line+1,coluna:posicao.character+1}:{})};
 });
 if(diagnosticos.some(d=>d.category===ts.DiagnosticCategory.Error))return resposta;
 const emitido=programa.emit();
 if(emitido.emitSkipped)return{...resposta,javascript:'',erro:'O compilador não emitiu JavaScript. Confira os diagnósticos antes de tentar novamente.'};
 if(resposta.javascript.length>30000)return{...resposta,javascript:'',erro:'O JavaScript gerado ultrapassou 30.000 caracteres. Reduza o programa; o limite do executor continua preservado.'};
 return resposta;
}

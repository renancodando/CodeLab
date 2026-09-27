import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
(self as typeof self & {MonacoEnvironment:unknown}).MonacoEnvironment = {getWorker:()=>new EditorWorker()};
monaco.editor.defineTheme('codelab',{base:'vs-dark',inherit:true,rules:[{token:'comment',foreground:'879384',fontStyle:'italic'},{token:'keyword',foreground:'EBC481'},{token:'string',foreground:'A7CC9F'},{token:'number',foreground:'E5AD86'}],colors:{'editor.background':'#141B18','editor.foreground':'#EAE8DD','editorLineNumber.foreground':'#788577','editorCursor.foreground':'#EBC481','editor.selectionBackground':'#435646','editor.lineHighlightBackground':'#1B241F','editorWidget.background':'#202920'}});
export function createEditor(container:HTMLElement,value:string,language='javascript',advanced=false) {
 const editor=monaco.editor.create(container,{value,language,theme:'codelab',automaticLayout:true,fontFamily:'"Cascadia Code", "Consolas", monospace',fontSize:15,lineHeight:26,minimap:{enabled:false},padding:{top:20,bottom:20},scrollBeyondLastLine:false,wordWrap:'on',tabSize:2,insertSpaces:true,accessibilitySupport:'on',ariaLabel:'É aqui que você escreve seu código',quickSuggestions:advanced,parameterHints:{enabled:advanced},suggestOnTriggerCharacters:advanced,lineNumbers:'on',renderLineHighlight:'line',bracketPairColorization:{enabled:true},roundedSelection:false,overviewRulerLanes:0,hideCursorInOverviewRuler:true,scrollbar:{verticalScrollbarSize:8,horizontalScrollbarSize:8},fixedOverflowWidgets:true});
 const model=editor.getModel();
 editor.onDidDispose(()=>model?.dispose());
 return editor;
}

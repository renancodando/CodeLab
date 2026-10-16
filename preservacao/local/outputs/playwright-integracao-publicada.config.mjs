import base from './playwright-publicado.config.mjs';
export default {...base,testMatch:['css-containers.spec.ts','csharp-cancelamento.spec.ts','rascunhos-laboratorio.spec.ts','interactive-lesson.spec.ts'],reporter:[['list']],outputDir:new URL('./integracao-publicada-artefatos/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')};

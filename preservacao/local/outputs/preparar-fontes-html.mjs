import {readFile,writeFile} from 'node:fs/promises';
const raiz=new URL('../work/CodeLab/',import.meta.url);
for(const caminho of ['src/content/practice.ts','src/learning/practice.ts']){
 const arquivo=new URL(caminho,raiz);
 let codigo=await readFile(arquivo,'utf8');
 codigo=codigo.replaceAll('<source media="(max-width: 600px)"','<source type="image/svg+xml" media="(max-width: 600px)"');
 codigo=codigo.replaceAll('<source srcset="/exemplos/imagens/fluxo-amplo.svg"','<source type="image/svg+xml" srcset="/exemplos/imagens/fluxo-amplo.svg"');
 codigo=codigo.replaceAll('srcset="/exemplos/imagens/fluxo-compacto.svg">','srcset="/exemplos/imagens/fluxo-compacto.svg" width="240" height="360">');
 codigo=codigo.replaceAll('srcset="/exemplos/imagens/fluxo-amplo.svg">','srcset="/exemplos/imagens/fluxo-amplo.svg" width="720" height="240">');
 if(caminho.endsWith('/practice.ts')&&caminho.startsWith('src/content')){
  codigo=codigo.replace(/(lines:\[\{id:'abrir',code:'<picture>'\},)(\{id:'compacta',code:'[^']+'\},)(\{id:'ampla',code:'[^']+'\},)/,'$1$3$2');
 }
 await writeFile(arquivo,codigo);
}
const arquivo=new URL('src/learning/hub-catalog.ts',raiz);
const codigo=await readFile(arquivo,'utf8');
await writeFile(arquivo,codigo.replace('={comparacoes:',"={imagens:'Imagens',alternativas:'Alternativas',tamanho:'Tamanho de exibição',fontes:'Fontes',comparacoes:"));

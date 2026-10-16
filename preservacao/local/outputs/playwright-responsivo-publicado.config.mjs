import configuracao from './playwright-publicado.config.mjs';
export default {
 ...configuracao,
 testMatch:['responsive-hub.spec.ts'],
 reporter:[['list'],['json',{outputFile:new URL('./responsividade-publicada.json',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')}]],
 outputDir:new URL('./responsividade-publicada-artefatos/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')
};

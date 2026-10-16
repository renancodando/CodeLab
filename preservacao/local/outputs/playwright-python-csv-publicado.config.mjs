import base from './playwright-publicado.config.mjs';
export default {...base,testMatch:['python-csv.spec.ts'],reporter:'list',outputDir:new URL('./python-csv-publicado-artefatos/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')};

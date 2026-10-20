import base from './playwright-componentes-local-corrigido-20261019.config.mjs';
export default {...base,outputDir:new URL('./resultados-componentes-local-20261020/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')};

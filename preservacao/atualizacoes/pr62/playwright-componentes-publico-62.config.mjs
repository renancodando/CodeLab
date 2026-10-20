import base from './playwright-componentes-publico.config.mjs';
export default {...base,outputDir:new URL('./resultados-componentes-publico-62/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')};

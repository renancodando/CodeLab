import base from './playwright-componentes-publico.config.mjs';
export default {...base,grep:/componentes praticados|componentes respondidos/,outputDir:new URL('./resultados-componentes-publico-correcao-20261020/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')};

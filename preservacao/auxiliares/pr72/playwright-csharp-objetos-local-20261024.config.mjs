import base from './playwright-fetch-local-20261021.config.mjs';
export default {...base,testMatch:['csharp-objetos.spec.ts','csharp-controle.spec.ts'],outputDir:new URL('./resultados-csharp-objetos-local-20261024/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')};

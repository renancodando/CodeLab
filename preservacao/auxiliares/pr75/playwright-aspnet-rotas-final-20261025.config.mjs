import base from './playwright-fetch-local-20261021.config.mjs';
export default {...base,testMatch:['aspnet-rotas.spec.ts','csharp-excecoes.spec.ts'],outputDir:new URL('./resultados-aspnet-rotas-local-20261025/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')};

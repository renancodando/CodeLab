export default {
 testDir:new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch:['dom-selecao.spec.ts','dom-eventos.spec.ts','css-fluxo.spec.ts','css-movimento.spec.ts'],timeout:60000,workers:1,reporter:'list',
 outputDir:new URL('./resultados-dom-local-20261018/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 use:{baseURL:'http://127.0.0.1:5173',channel:'msedge',headless:true,viewport:{width:375,height:812},trace:'retain-on-failure',screenshot:'only-on-failure'}
};

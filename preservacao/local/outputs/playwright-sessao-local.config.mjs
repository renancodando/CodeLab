export default {
 testDir:new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch:['learning-hub.spec.ts','ordem-diaria.spec.ts','valores-preparacao.spec.ts','sql-null.spec.ts','lacos-fundamentos.spec.ts','html-inicio.spec.ts'],timeout:60000,workers:1,reporter:'list',
 outputDir:new URL('./resultados-sessao-local/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 use:{baseURL:'http://127.0.0.1:5173',channel:'msedge',headless:true,viewport:{width:375,height:812},trace:'retain-on-failure',screenshot:'only-on-failure'}
};

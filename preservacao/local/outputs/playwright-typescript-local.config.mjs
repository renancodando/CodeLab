export default {
 testDir:new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch:['typescript-local.spec.ts','sql-local.spec.ts','http-bancada.spec.ts','html-formularios.spec.ts'],timeout:120000,workers:1,reporter:'list',
 outputDir:new URL('./resultados-typescript-local/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 use:{baseURL:'http://127.0.0.1:5173',channel:'msedge',headless:true,viewport:{width:375,height:812},trace:'retain-on-failure',screenshot:'only-on-failure'}
};

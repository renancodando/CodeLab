export default {
 testDir:new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch:['dom-componentes.spec.ts','dom-formulario.spec.ts'],grep:new RegExp('o descarte executa JavaScript real'),timeout:60000,workers:1,reporter:'list',
 outputDir:new URL('./resultados-componentes-repeticao-20261019/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 use:{baseURL:'http://127.0.0.1:5173',channel:'msedge',headless:true,viewport:{width:375,height:812},trace:'retain-on-failure',screenshot:'only-on-failure'}
};

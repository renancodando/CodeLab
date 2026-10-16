export default {
 testDir:new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch:['html-dados-acessibilidade.spec.ts','assincrono-pratica.spec.ts'],timeout:60000,workers:1,reporter:'list',
 outputDir:new URL('./resultados-html-dados-publico-54/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 use:{baseURL:'https://code-lab-omega.vercel.app',channel:'msedge',headless:true,viewport:{width:375,height:812},trace:'retain-on-failure',screenshot:'only-on-failure'}
};


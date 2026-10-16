export default {
 testDir:new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch:['assincrono-pratica.spec.ts','dados-contratos.spec.ts','ordem-diaria.spec.ts'],timeout:60000,workers:1,reporter:'list',
 outputDir:new URL('./resultados-promessas-publico-53/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 use:{baseURL:'https://code-lab-omega.vercel.app',channel:'msedge',headless:true,viewport:{width:375,height:812},trace:'retain-on-failure',screenshot:'only-on-failure'}
};


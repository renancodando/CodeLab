export default {
 testDir:new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch:['learning.spec.ts'],grep:/laboratório HTML renderiza/,timeout:60000,workers:1,reporter:'list',
 outputDir:new URL('./resultados-csharp-linq-publicado/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 use:{baseURL:'https://code-lab-omega.vercel.app',channel:'msedge',headless:true,viewport:{width:375,height:812},trace:'retain-on-failure',screenshot:'only-on-failure'}
};

export default {
 testDir:new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch:['inicio-pratica.spec.ts','ordem-diaria.spec.ts','valores-preparacao.spec.ts','learning-hub.spec.ts'],
 grep:/primeiras instruções|entrada e saída|decomposição|a sessão nova|preparação de valores|leitura não pontua/,
 timeout:60000,workers:1,reporter:'list',
 outputDir:new URL('./resultados-fundamentos-ordem-publico-47/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 use:{baseURL:'https://code-lab-omega.vercel.app',channel:'msedge',headless:true,viewport:{width:375,height:812},trace:'retain-on-failure',screenshot:'only-on-failure'}
};

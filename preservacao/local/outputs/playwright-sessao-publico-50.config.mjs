export default {
 testDir:new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 grep:/documento HTML: títulos|depuração confere|leitura não pontua|a sessão nova|a reconstrução na aula|SQL: plano antigo|preparação original|preparação de valores/,testMatch:['learning-hub.spec.ts','ordem-diaria.spec.ts','valores-preparacao.spec.ts','sql-null.spec.ts','lacos-fundamentos.spec.ts','html-inicio.spec.ts'],timeout:60000,workers:1,reporter:'list',
 outputDir:new URL('./resultados-sessao-publico-50/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 use:{baseURL:'https://code-lab-omega.vercel.app',channel:'msedge',headless:true,viewport:{width:375,height:812},trace:'retain-on-failure',screenshot:'only-on-failure'}
};

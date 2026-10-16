export default {
 testDir:new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch:['sql-null.spec.ts','learning-hub.spec.ts'],grep:/SQL:|leitura não pontua domínio/,
 timeout:120000,workers:1,reporter:'list',
 use:{baseURL:'http://127.0.0.1:5173',channel:'msedge',headless:true,viewport:{width:375,height:812}}
};

export default {
 testDir: new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch: ['learning-hub.spec.ts','armazenamento-real.spec.ts'],
 timeout:60000,fullyParallel:false,workers:1,
 reporter:[['list'],['json',{outputFile:new URL('./fluxos-publicados.json',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')}]],
 outputDir:new URL('./fluxos-publicados-artefatos/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 use:{baseURL:'https://code-lab-omega.vercel.app',channel:'msedge',headless:true,viewport:{width:375,height:812},timezoneId:'America/Sao_Paulo',trace:'retain-on-failure',screenshot:'only-on-failure'}
};

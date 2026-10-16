export default {
 testDir:new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch:'cpp-conceitos.spec.ts',timeout:60000,workers:1,reporter:'list',
 use:{baseURL:'http://127.0.0.1:5173',channel:'msedge',headless:true,viewport:{width:375,height:812}},
 webServer:{command:'node node_modules/vite/bin/vite.js preview --configLoader runner --host 127.0.0.1 --port 5173',cwd:new URL('../work/CodeLab/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),url:'http://127.0.0.1:5173',reuseExistingServer:true,timeout:60000}
};

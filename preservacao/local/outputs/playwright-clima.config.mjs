export default {
 testDir: new URL('../work/CodeLab/tests/e2e/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),
 testMatch:['qualidade-ambiente.spec.ts','meteorologia-visual.spec.ts'],timeout:60000,workers:1,reporter:'list',
 use:{baseURL:'http://127.0.0.1:5174',channel:'msedge',headless:true,viewport:{width:1440,height:1000}},
 webServer:{command:'node node_modules/vite/bin/vite.js --configLoader runner --host 127.0.0.1 --port 5174',cwd:new URL('../work/CodeLab/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),url:'http://127.0.0.1:5174',reuseExistingServer:false,timeout:60000}
};
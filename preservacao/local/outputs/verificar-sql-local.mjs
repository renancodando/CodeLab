import {preview} from '../work/CodeLab/node_modules/vite/dist/node/index.js';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const raiz=fileURLToPath(new URL('../work/CodeLab/',import.meta.url));
const configuracao=fileURLToPath(new URL(process.argv[2]??'./playwright-sql-local.config.mjs',import.meta.url));
const servidor=await preview({root:raiz,configFile:false,preview:{host:'127.0.0.1',port:5173,strictPort:true}});
try{
 const teste=spawn(process.execPath,['node_modules/@playwright/test/cli.js','test','--config',configuracao,...process.argv.slice(3)],{cwd:raiz,stdio:'inherit'});
 const codigo=await new Promise((resolve,reject)=>{teste.on('error',reject);teste.on('exit',resolve);});
 process.exitCode=codigo??1;
}finally{
 await new Promise(resolve=>servidor.httpServer.close(resolve));
}

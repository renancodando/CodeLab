import {createServer} from '../work/CodeLab/node_modules/vite/dist/node/index.js';
import {writeFile} from 'node:fs/promises';
const servidor=await createServer({root:new URL('../work/CodeLab/',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),server:{middlewareMode:true},configFile:false});
try{
 const {adaptiveCatalog}=await servidor.ssrLoadModule('/src/learning/hub-catalog.ts');
 const {buildDailySession,freshAdaptive}=await servidor.ssrLoadModule('/src/learning/adaptive.ts');
 const catalogo={...adaptiveCatalog,preferredLanguage:'javascript',activities:adaptiveCatalog.activities.filter(a=>!['programar','entrada-saida','passos','tipos-erros','investigar'].includes(a.lessonId??''))};
 const plano=buildDailySession(freshAdaptive(),catalogo,{now:Date.parse('2026-10-13T12:00:00Z'),timeZone:'UTC'});
 await writeFile(new URL('./plano-valores-anterior.json',import.meta.url),JSON.stringify(plano,null,2));
 console.log(JSON.stringify(plano));
}finally{await servidor.close();}

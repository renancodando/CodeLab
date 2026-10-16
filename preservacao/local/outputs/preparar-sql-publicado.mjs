import {readFileSync,writeFileSync} from 'node:fs';
const texto=readFileSync('../../outputs/playwright-sql-local.config.mjs','utf8').replace('http://127.0.0.1:5173','https://code-lab-omega.vercel.app').replace('resultados-sql-local/','resultados-sql-publicado/');writeFileSync('../../outputs/playwright-sql-publicado.config.mjs',texto);

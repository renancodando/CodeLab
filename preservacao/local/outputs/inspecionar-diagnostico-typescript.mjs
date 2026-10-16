import {readFileSync,writeFileSync} from 'node:fs';
const caminho='../../outputs/medir-typescript-navegador.mjs';let texto=readFileSync(caminho,'utf8').replace('resultados.push({nome:caso.nome,...resultado});','resultados.push({nome:caso.nome,...resultado});console.log(JSON.stringify({nome:caso.nome,...resultado}));');writeFileSync(caminho,texto);

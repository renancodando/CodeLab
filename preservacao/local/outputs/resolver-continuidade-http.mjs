import {readFileSync,writeFileSync} from 'node:fs';
const caminho='docs/continuidade.md',texto=readFileSync(caminho,'utf8');if(!texto.includes('<<<<<<< HEAD'))throw Error('Conflito esperado ausente');writeFileSync(caminho,texto.replace(/^<<<<<<< HEAD\r?\n/gm,'').replace(/^=======\r?\n/gm,'').replace(/^>>>>>>> laboratorio\/sql-local\r?\n/gm,''));

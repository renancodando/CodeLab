import {readFileSync,writeFileSync} from 'node:fs';
const c='src/learning/practice.ts';const t=readFileSync(c,'utf8');const antes='JSON.stringify([...cem,{nome:\"extra\"}])));';const depois='JSON.stringify([...cem,{nome:\"extra\"}]));';if(!t.includes(antes))throw Error('Expressão não encontrada');writeFileSync(c,t.replace(antes,depois));

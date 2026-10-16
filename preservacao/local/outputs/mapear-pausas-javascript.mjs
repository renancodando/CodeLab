import {readFileSync} from 'node:fs';
const dados=readFileSync('src/content/deep/javascript.ts','utf8');const curso=JSON.parse(dados.slice(dados.indexOf('{',dados.indexOf('export default')),dados.lastIndexOf('}')+1));const atividades=readFileSync('src/content/practice.ts','utf8');for(const aula of curso.lessons){const ligacoes=[...atividades.matchAll(/(?:lessonIds|"lessonIds")\s*:\s*\[([^\]]+)\]/g)].filter(m=>m[1].includes(aula.id)).length;console.log(aula.id+' | '+ligacoes+' | '+aula.sections.length+' blocos | '+aula.title);}


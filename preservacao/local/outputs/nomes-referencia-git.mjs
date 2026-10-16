import {readFile,writeFile} from 'node:fs/promises';
const caminho='tests/fixtures/git-bancada.mjs';let texto=await readFile(caminho,'utf8');
for(const [antigo,novo] of Object.entries({root:'raiz',run:'executar',gitFolder:'pastaGit',gitRun:'executarGit',calculation:'arquivoCalculo',rule:'arquivoRegra',ruleText:'textoRegra',condition:'condicao',conflict:'conflito',combined:'regraCombinada',ruleCheck:'arquivoConferencia',badCommit:'commitRuim'}))texto=texto.replace(new RegExp('\\b'+antigo+'\\b','g'),novo);
await writeFile(caminho,texto.trimEnd()+'\n');

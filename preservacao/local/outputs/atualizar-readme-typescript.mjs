import {readFileSync,writeFileSync} from 'node:fs';
const caminho='README.md';let texto=readFileSync(caminho,'utf8');
texto=texto.replace('JavaScript em interpretador separado, SQLite local em banco descartável e exportação de arquivos.','JavaScript em interpretador separado, TypeScript com compilação real e JavaScript emitido, SQLite local em banco descartável e exportação de arquivos.');
texto=texto.replace('SQLite é opcional: seu carregador, worker e WASM entram no cache somente após a primeira execução online, quando houver espaço.','SQLite e o compilador TypeScript são opcionais: seus carregadores, workers e WASM SQL entram no cache somente após o primeiro uso online, quando houver espaço.');
texto=texto.replace('TypeScript e PostgreSQL têm seu ambiente indicado, sem simular execução no laboratório atual.','O laboratório TypeScript confere um script único com strict, mostra diagnósticos e o JavaScript emitido, depois o executa no isolamento QuickJS. Módulos, pacotes e projetos completos continuam com ambiente próprio; PostgreSQL também mantém sua infraestrutura indicada. Consulte [o contrato TypeScript](docs/laboratorio-typescript.md).');
writeFileSync(caminho,texto);

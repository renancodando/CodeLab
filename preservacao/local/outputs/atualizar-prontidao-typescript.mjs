import {readFileSync,writeFileSync} from 'node:fs';
const continuidade=readFileSync('docs/continuidade.md','utf8');
const inicio=continuidade.lastIndexOf('## Entregas verificadas em 11 de outubro');
const fim=continuidade.indexOf('## Laboratório TypeScript em validação',inicio);
const fechamento=continuidade.slice(inicio,fim);
const caminho='docs/prontidao-producao.md',texto=readFileSync(caminho,'utf8');
if(!texto.includes('## Entregas verificadas em 11 de outubro'))writeFileSync(caminho,texto.replace(/^# Prontidão de produção\r?\n/,'# Prontidão de produção\n\n'+fechamento+'## Próxima entrega: laboratório TypeScript\n\nO compilador real está implementado na branch laboratorio/typescript-local, com diagnósticos, JavaScript emitido, execução QuickJS, projetos e cache opcional. Exigir validação do head final, revisão, integração e domínio antes de declarar esta entrega publicada. Detalhes e limites em laboratorio-typescript.md. As seções abaixo são registros históricos.\n'));
console.log('Prontidão atualizada com evidências publicadas.');

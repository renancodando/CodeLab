import {readFileSync,writeFileSync} from 'node:fs';
const caminho='docs/prontidao-producao.md';let texto=readFileSync(caminho,'utf8');texto=texto.replace('# Prontidão de produção',`# Prontidão de produção

## Checkpoint de 11 de outubro: HTTP publicado; posse C++ e SQLite em validação

A PR #30 foi integrada em 3b04fe4b8f2a056517983e9261bf86f1139af003 após o run 38085602449 aprovar os quatro jobs: 543 unidades e 129 fluxos de navegador (68 + 61), compiladores, PostgreSQL, API, cache meteorológico e auditoria. A árvore 50c796e94b5d25da07122a8ccdc83885df2b1397 é a do head testado. O deployment dpl_DNWbAZ9exSqN8mRcWaSp2h8SE2wf foi confirmado READY/production com esse SHA e os três fluxos HTTP passaram no domínio público.

A revisão posterior da PR #31 encontrou a disputa entre chegada e conclusão HTTP. A correção 014e745 separa esses instantes e passou nos 28 testes específicos. O novo run 38142793678 aprovou validação comum e auditoria; ambas as parcelas de navegador ainda precisam terminar. O run anterior 38086825160 aprovou os quatro jobs do head 5259ae6, incluindo 554 unidades e oito novos cenários C++20, mas não valida a correção posterior. A PR #31 continua aberta até a conferência do novo head, revisões, árvore e domínio.

SQLite está sendo acrescentado ao laboratório em uma branch própria, sem alterar o currículo PostgreSQL. Os 21 testes com o mecanismo real passaram; strict/build passaram. O runtime, worker e WASM são três recursos opcionais carregados somente ao executar, fora do precache inicial. O primeiro teste de navegador apontou uso do build anterior enquanto a nova compilação ainda ocorria; repetir contra o build concluído antes de afirmar funcionamento no navegador. O pedido integral e as 17 frentes permanecem abertos. As seções seguintes são registros históricos.
`);writeFileSync(caminho,texto);

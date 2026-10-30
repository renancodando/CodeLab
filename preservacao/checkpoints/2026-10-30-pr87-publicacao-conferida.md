# PR87 publicada e conferida — 30/10/2026

PR: https://github.com/renancodando/CodeLab/pull/87
Head verificado: 870c664b7f58f510180bbfd74913953ea9655413
Merge main: 2fcd45769d480327cff12c6663905087d2506c0f
Árvore: e15eab62d48ed3e1ac8a9eb8790dd3e3c251b16b, idêntica ao head. Pais: 4d9f9091910f936eca7b5957fd8b06b96e4c740d e 870c664b7f58f510180bbfd74913953ea9655413. Revisão concluída nesse head sem apontamentos e sem threads pendentes. O run pendente não foi tratado como aprovado na execução anterior.

CI por impacto 41100208264 aprovado: 133 testes em três arquivos, catálogo/tipos/build e um fluxo Chromium da aula (4,7 s; corpo do cenário 3,3 s). Sem API, .NET, PostgreSQL ou outras famílias não afetadas. Metadados e logs têm tempos distintos: run criado às 17:36:05 UTC; último job aparece concluído às 17:46:37; último log do navegador é das 17:40:30 e updated_at do run era 17:57:28. Não usar updated_at como duração dos testes, atribuir essa diferença a uma causa não isolada ou afirmar ganho de tempo comparando PRs com escopos diferentes. Não houve falha de cenário, aumento de timeout/retries ou enfraquecimento de asserções. Pós-merge 41130124541 aprovado: build e dois smokes (38,8 s), sem repetir a bateria da PR.

Produção: a primeira consulta ao alias ainda mostrava 4d9f909; aguardamos a nova implantação. Deployment dpl_ED7vzXMCLcRrKwvwGevUyESPkYNz READY/production no SHA 2fcd45769d480327cff12c6663905087d2506c0f, projeto prj_XgncY54wYGiSgPH0n1JOol3UFWCn e alias code-lab-omega.vercel.app conferidos antes e depois dos fluxos públicos. Três aprovados em 1,4 min: axe e programas completos 220–4000 px (29,8 s), offline Python/C#/C++ (24,4 s), backup/importação (17,7 s). Logs locais outputs/pr87-publico-20261030.log e alias-pr87-ready-antes/depois-20261030.json. O teste da aula, já aprovado no CI, não foi repetido em produção.

Publicado: duas pausas em sql-indices sobre valor vinculado e índice sem unicidade indevida. Referências executadas realmente em SQLite, incluindo contraste com concatenação, títulos iguais, ausência, coluna indexada, preservação de dados e novas inserções. Respostas do aluno permanecem conceituais; produção independente e medição pertencem ao projeto com rubrica manual. A bancada recebe SQL puro e não expõe a interface de parâmetros desse driver. Não alegar medição de desempenho ou execução PostgreSQL desta atividade.

Métricas geradas: 137 aulas preservadas, 239 atividades, 108 aulas com ao menos uma pausa e 29 sem. Não significa 108 aulas concluídas nem edição encerrada. Próxima lacuna da fila: cpp-texto-conversao; depois html-documentos, html-arvore-semantica e html-texto-links. Seguir os pré-requisitos e executar somente gabaritos/runtimes afetados; C++20 deve ser compilado de verdade, sem tratar previsão offline como compilação. Os seis percursos e oito projetos seguem no escopo, sem criar recursos ou aulas para inflar números. Fechamento amplo e auditoria final só após implementação dos critérios.

Checkout local em main sincronizado, sem alterações pendentes. Implementação desta entrega e recibos estão salvos no GitHub. A branch preservacao/retomada-cloud-20261015 é só checkpoint e não deve ser integrada.

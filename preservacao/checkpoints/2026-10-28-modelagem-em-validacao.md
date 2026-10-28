# Checkpoint — proteção integrada e modelagem SQL em validação

Branch de preservação: nunca integrar em main.

A PR #81 foi integrada pelo head f648534c50d87e88be5c9ffdbd484cb5da20b6bf após revisão do mesmo head sem apontamentos, CI 40581912211 verde e nenhuma thread aberta. Main agora d9dd6fc7f7defa78bfffaa48477e600197225cf8, árvore ff662d0fb8744388036e56811f4235235d932372 igual ao head, pais 8f13fda e f648534. Pós-merge 40771735474 aprovado; não repetir unitários ou referências .NET desse lote por rotina. A conferência pública do conjunto aguarda a integração de SQL; merge/CI não comprovam publicação.

PR #82: https://github.com/renancodando/CodeLab/pull/82. Branch conteudo/modelagem-sql-20261028, head 64de718a87a98afcf9722e80086a4fc19cd2c421. Contém as três pausas de sql-modelagem, reforço do projeto manual e referências SQLite reais nas unidades. Respostas do aluno são conceituais; não há execução de SQL livre ou prova de PostgreSQL. Integra main por merge sem rebase/force push: conflitos de metadados/corretores combinados, métricas regeneradas. Os dois corretores de ordem e todos os exemplos anteriores estão preservados.

Local: 127 testes iniciais; só os 15 da aula após normalização de caixa/espaços; dois cenários após corrigir a preparação isolada no teste de migração. O primeiro CI 40688034647 falhou nessa suposição de primeira preparação; mantidas todas as asserções. CI 40688521337 do e72acee passou em 2 min 04 s. Após incorporar #81, passaram 157 testes de quatro arquivos afetados; CI 40772139051 do 64de718 está em andamento e nova revisão foi disparada marcando a PR pronta. Não reutilizar aprovação do e72acee. Não integrar enquanto algum gate necessário estiver pendente.

Métricas desta branch combinada: 137 aulas, 228 atividades, 104 aulas com pausas e 33 sem. Fonte publicada ainda precisa ser conferida por SHA/alias. Próximos: conferir head/base/CI/revisão/árvore, merge com expected_head_sha, build e dois smokes pós-merge, deployment READY com projeto/alias/SHA antes e depois de três fluxos públicos. Apenas então declarar publicação. Não rodar suíte inteira, todos os runtimes ou a matriz de navegadores por rotina. Se o cenário falhar, repetir primeiro somente ele, sem elevar timeout/retries ou enfraquecer asserções.

Checkout C:/Users/perei/Documents/Codex/2026-10-03/nao-m/work/CodeLab. Conteúdo e commits enviados ao GitHub. SQL seguinte: aula original sql-crud, seguindo docs/aulas-sem-pratica.md. Preservar 137 aulas, local-first, visual, mundo, sandbox, offline e backups; não reabrir expansão meteorológica. A edição não está concluída.

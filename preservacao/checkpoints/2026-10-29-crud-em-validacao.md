# Checkpoint — prática CRUD SQL em validação

Branch de preservação: nunca integrar em main.

Main/produção reconferidos antes da edição em 5724081ec4c266eadd6cdf06f6be3cec496a8d3b, READY/production com projeto/alias corretos e CI 40772556253 verde. Não havia PR aberta. A publicação anterior de #81/#82 tem recibo remoto próprio e não precisa de nova bateria por rotina.

Fonte atual salva na branch conteudo/crud-sql-20261029, commit 8e62489dea3e29cc4bfe0d222cafba6f2512bd52, PR https://github.com/renancodando/CodeLab/pull/83. Três pausas na aula existente sql-crud: previsão de INSERT/UPDATE/DELETE, diagnóstico de alvo/estado com contador e duas chamadas, consulta de pendências executada no corretor SQLite existente em cinco bases. Preservados exemplo/exercício originais, Worker, limites e bloqueio de comandos extras/mutações. Projeto com revisão manual e SQL/resultados exportáveis, sem prometer concorrência ou idempotência distribuída.

Duas respostas são conceituais; referências e alternativas são executadas em SQLite real nos testes. A consulta livre é executada localmente em SQLite e aceita soluções equivalentes por resultado. Não fingir execução PostgreSQL do aluno. As cinco bases cobrem ordem, estado, IDs variados, títulos repetidos/apóstrofo, todas pendentes, só concluídas e vazio. Os gabaritos da família sql-pratica são conferidos pelo PostgreSQL real no CI; psql não disponível localmente.

Local aprovou 170 testes de três arquivos, catálogo/métricas e TypeScript strict. Plano de CI seleciona nove arquivos unitários, sql-crud.spec e sql-pratica.spec, somente a família SQL apropriada e build; sem API, outros compiladores ou segundo navegador. CI 40876371896 e revisão do próprio 8e62489 estão em andamento, não são aprovação. Não integrar até concluir checks e revisão desse head, sem threads pendentes. Depois conferir árvore/pais, merge com expected_head_sha, build/dois smokes pós-merge, deployment READY/SHA/projeto/alias antes/depois de três fluxos públicos. Repetir primeiro só cenário que falhar, sem elevar limites.

Métricas da branch: 137 aulas, 231 atividades, 105 aulas com pausas, 32 sem. Ainda não publicadas; produção mantém 228/104/33. Presença de pausa não conclui profundidade ou edição. Próxima aula da fila: sql-join. Código/commits portugueses, aparência e local-first sem login preservados. Não expandir clima nem aulas e não rodar suíte integral por rotina.

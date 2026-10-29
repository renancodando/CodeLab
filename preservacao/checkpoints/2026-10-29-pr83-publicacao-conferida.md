# Publicação conferida — prática CRUD SQL (#83)

Branch de preservação: não integrar em main. Este recibo substitui o estado pendente de 2026-10-29-crud-em-validacao.md e do topo histórico de docs/continuidade.md.

PR https://github.com/renancodando/CodeLab/pull/83 integrada pelo head 8e62489dea3e29cc4bfe0d222cafba6f2512bd52. Main agora be2688b69cca9e9fc7e266805e171e7e4949fab4; pais 5724081/8e62489 e árvore da266d0f98557c55ba033247c17a0842660db466 igual ao head conferido. Revisão automática do próprio 8e62489 concluída sem apontamentos e nenhuma thread pendente. Branch de conteúdo preservada; main local limpa e sincronizada. Sem PR aberta na última consulta.

## Entrega

Três pausas na aula original sql-crud: prever o estado após INSERT/UPDATE/DELETE; diagnosticar filtro de alvo/estado com contador e segunda chamada; corrigir uma consulta de pendências em SQLite local real. As duas primeiras são conceituais, com referências executadas nos testes. A consulta do aluno é executada pelo Worker SQLite existente em cinco bases e aceita resultados equivalentes. Não é execução PostgreSQL do aluno. Títulos iguais/apóstrofo, IDs variados, todas pendentes, só concluídas e vazio têm contratos próprios. A consulta não pode alterar dados, configurar o banco ou adicionar comandos extras. Preservados limites, cancelamento, isolamento, carregamento sob demanda, aparência, mundo e progresso local sem contas.

Projeto com revisão manual, SQL/resultados exportáveis e verificação de linhas que devem continuar intactas. A prévia SELECT não substitui controle de concorrência. O contador não prova idempotência distribuída; a consulta corrigível não aprova o CRUD inteiro. Exemplo/exercício originais preservados.

Métricas publicadas: 137 aulas, 20 trilhas, 58 problemas, 231 atividades, 105 aulas com pausas e 32 sem. Nenhuma aula ou percurso foi acrescentado. Pausa não significa profundidade completa ou domínio da linguagem.

## Validação proporcional

Local: 170 testes de três arquivos afetados, catálogo/métricas gerados e conferidos e TypeScript strict. Psql não está disponível localmente; não alegar execução local de PostgreSQL.

CI 40876371896 do 8e62489 aprovado em 4 min: 235 testes de nove arquivos, 13 bases de referência em PostgreSQL 18, build de 157 páginas e quatro fluxos Chromium aprovados em 1,8 min. A família SQL foi a única execução nativa selecionada; sem API, outros compiladores ou segundo navegador.

Os quatro fluxos cobrem a aula nova e os contratos SQL existentes: resultado real, alternativa equivalente, offline, assistência/persistência, limite/alteração/saída encerrando Workers e módulo indisponível preservando resposta/nota. Nenhum timeout, retry ou asserção foi reduzido para aprovar.

Pós-merge 40877016304 aprovado: build e somente dois smokes de artefato/isolamento, ambos passaram em 42,1 s. Não repetiu unitários, referências ou a bateria da PR.

## Produção

Deployment dpl_8mVkb9WJnZJ4RqZ9idrwSpCN8m9o READY/production. SHA be2688b69cca9e9fc7e266805e171e7e4949fab4, projeto prj_XgncY54wYGiSgPH0n1JOol3UFWCn e alias code-lab-omega.vercel.app conferidos antes e depois dos três fluxos públicos, sem promover preview ou refazer deploy.

```text
axe e programas completos de 220 a 4000 px — 53,6 s
Python, C# e C++ offline após preparação, sem submissões externas — 25,3 s
exportação e importação preservam jornada local — 44,2 s
3 passed (2.8m)
```

O tempo público variou em relação ao recibo anterior; a causa não foi estabelecida e os três passaram com os limites existentes. Não repetir a bateria por essa variação. Logs locais em outputs/sql-crud-*-20261029.log e outputs/pr83-publico-20261029.log; recibos filtrados de alias antes/depois no mesmo diretório. Este checkpoint preserva remotamente os resultados públicos, sem publicar dados privados do provedor.

## Próxima etapa

Atualizar o topo de docs/continuidade.md com este recibo na próxima entrega. Confirmar main/PRs/checks atuais; seguir docs/aulas-sem-pratica.md começando por sql-join. A base e os modelos de correção estão em src/learning/pratica-sql.ts e src/content/solucoes-sql.ts; conferir soluções equivalentes e casos de borda sem enfraquecer a base somente de leitura. O verificador existente confere as referências da família sql-pratica em PostgreSQL real no CI. Novas pausas não devem apenas repetir as atividades avançadas de cardinalidade. Preservar as 137 aulas e fechar o escopo definido; não reabrir clima ou inventar funcionalidades. Validação proporcional continua valendo: suíte ampla somente no fechamento ou impacto comprovadamente amplo.

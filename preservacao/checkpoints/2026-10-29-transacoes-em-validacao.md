# Transações e auditoria em validação — 29/10/2026

PR https://github.com/renancodando/CodeLab/pull/86; branch conteudo/transacoes-sql-20261029; headf6733aab85800d4cbc06a130803d10f874903941; base5e97e53d810a5303a456625fa6ad26c0772ac20d. Push concluído e branch rastreada. Não publicado ainda.

Três pausas em sql-transacao: previsão de commit seguido de rollback, diagnóstico de UPDATE sem linha afetada e auditoria executávelSQLite de lançamentos. Mantém exemplo/exercício originais, projeto manual. Auditoria verifica soma, quantidade e contas distintas, aceitaequivalentes e não prova atomicidade/concorrência. Corrigida a teoria sobre ABORTSQLite e recuperaçãoPostgreSQL. Fontes oficiais no corpo da PR e continuidade.

Local148 testes comuns/SQL passaram;25 da aula passaram após corrigir lacuna que um mutante revelou: adicionar par de contas distintas com soma20, em vez de todos os casos de soma errada também terem quantidade errada. Asserção preservada, repetido só arquivoafetado. Catálogo gerado/conferido e TypeScript sem erros. Novo fluxo E2E cobre três pausas, consulta real, assistência/persistência e220/4000.

Plano por impacto:10 arquivos unitários, família sql-pratica/23 basesPostgreSQL e dois arquivosE2E(sql-pratica+sql-transacao), quatrofluxos, semAPI/.NET/outro navegador. Não executar tudo localmente outra vez. AguardarCI e revisão exatos, resolver falhas se houver, conferirárvore/merge, deployment READY/SHA/alias e somente pós-builddoissmokes/públicotrêscontratos.

Métricashead137 aulas/237atividades/107com pausas/30sem. Produção anteriorREADY5e97e53 tem234atividades/106com/31sem;recibos84/85 remotos na mesma pasta. Próxima lacuna será sql-indices; seguirfila gerada, sem aumentar aulas. Edição não concluída: reduzirlacunas e revisar profundidade/projetos/fechamento final.

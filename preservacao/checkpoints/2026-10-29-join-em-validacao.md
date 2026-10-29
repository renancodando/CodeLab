# JOIN e agregações em validação — 29/10/2026

PR: https://github.com/renancodando/CodeLab/pull/84
Branch: conteudo/join-sql-20261029
Head: 55c2cc810dd35b3075c30a337f750281ae890819
Base: be2688b69cca9e9fc7e266805e171e7e4949fab4

Três pausas na aula sql-join: previsão COUNT(*)/COUNT(n.id) com ausência, diagnóstico WHERE/HAVING e depuração executável SQLite de títulos repetidos. O corretor aceita soluções equivalentes; cinco bases verificam bordas, empates e vazio. Projeto com rubrica manual; duas pausas conceituais não executam a resposta do aluno.

Local: 171 testes em três arquivos aprovados, catálogo gerado/consistente e TypeScript aprovado. Worktree limpo e push conferido. Métricas do head: 234 atividades, 106/137 aulas com pausas, 31 sem. Não publicado ainda; produção continua em be2688b com 231 atividades e 32 aulas sem pausas.

Próximo: aguardar CI por impacto e revisão deste head exato; resolver falhas, conferir árvore, integrar somente verificado. Após merge usar apenas build e dois smokes; conferir READY/SHA/projeto/alias e três fluxos públicos. Registrar recibo final remoto. Não repetir a suíte inteira nem ampliar limites.

Próxima lacuna na fila gerada: sql-transacao. Não aumentar o catálogo de aulas. Prévia de observação: o seletor usa texto.includes(id), então sql-join também seleciona independent-practice.spec.ts por conter sql-joins-cardinalidade; avaliar comparação por limite de identificador em lote próprio com testes específicos, preservando referências reais como /api/licoes/sql-join. Não foi alterado neste lote.

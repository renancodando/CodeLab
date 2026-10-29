# Seleção por IDs em validação — 29/10/2026

PR https://github.com/renancodando/CodeLab/pull/85, branch manutencao/ids-validacao-20261029, head 00d491349c38f74b607e0dd9521f75185bc70656, base d78cfec18b724e7c407747e011b1c3c9c670434e. Push concluído, worktree limpo.

Corrige comparação por substring de IDs: sql-join não deve selecionar sql-joins-cardinalidade. Mantém rotas, seletores e os IDs das atividades. Vinte testes específicos aprovados localmente. Comparação do mesmo lote34→5 fluxos (85,3% menos cenários), sem alegar tempo poupado ainda. Nenhum teste apagado, timeout/retry/assertiva inalterados.

PR84 está publicada e conferida; recibo remoto 2026-10-29-pr84-publicacao-conferida.md. Main d78cfec18b724e7c407747e011b1c3c9c670434e READY/alias correto.234 atividades,106/137 aulas com pausas,31 sem. Próxima lacuna curricular:sql-transacao, separar falha da instrução de rollback total. Seguir validação proporcional, sem repetir runtimes ou suíte completa.

Próximo: aguardar CI/revisão do head exato85, conferir árvore e integrar somente verificado. Esta PR não muda aplicação ou aulas; pós-merge build/smoke e conferir SHA/alias real. Não é necessário repetir os três fluxos públicos de PR84 se a árvore da aplicação for idêntica; documentar equivalência de src/public/api/server/configs e conferir HTTP/versionamento. Se houver diferença de produto, ampliar somente a área afetada. Não declarar85 publicada enquanto deployment não estiver READY nesse merge.

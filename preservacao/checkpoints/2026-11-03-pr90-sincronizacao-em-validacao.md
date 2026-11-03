# PR #90: sincronização do cenário em validação — 03/11/2026

PR https://github.com/renancodando/CodeLab/pull/90
Branch conteudo/html-arvore-20261102; head remoto fa13ceac0db38f40626afe4b3b9b0e248f90c7a6.
Main/produção anterior: 5ab7a7d8a9c57d9c89cbcd126845cb35b281f10f (PR #89 publicada, recibo de 02/11). Métricas publicadas 244 atividades/110 aulas com pausas/27 sem; branch 246/111/26, sempre 137 aulas.

O CI antigo 41505001844 aprovou contratos/build e 30 fluxos; o cenário offline falhou ao medir 436 px de excesso imediatamente após mudar para 220 px. Trace: setViewportSize terminou em 12049,9 ms; leitura em 12162,219–12198,061 ms; captura posterior em 12222,697 ms já registra canvas em 220 px. Captura anterior conservava bounding rect antigo. DOM final reconstruído sem scripts cabe em 220 px (scrollWidth 220); desenvolvimento também não reproduziu excesso persistente. Não há evidência para alterar CSS ou esconder conteúdo.

Correção: aguardar dois requestAnimationFrame após cada redimensionamento. Asserção original <=1 px, 220/4000 e controles visíveis preservados. Nenhum timeout/retry ampliado. Dois ensaios locais somente do cenário com a build exata do CI atingiram o limite de 60 s; o trace local chega a setViewportSize após operações lentas, sem provar aprovação ou uma segunda falha de overflow. Não repetir os outros 30 fluxos localmente. Build local redundante interrompida ao reutilizar artefato 13169084789; prévias temporárias encerradas. Fonte e correção enviadas ao GitHub.

Novo CI 41637900287 em andamento no head fa13cea; revisão própria solicitada pelo evento ready_for_review porque o parecer anterior era de b4c027a. Não reutilizar aquela aprovação nem declarar esta PR publicada. Conferir gates do novo head, threads, árvore/pais antes de merge; depois build+2smokes e READY/SHA/projeto/alias+3 contratos públicos. Sem compiladores de exemplos ou suíte completa repetidos por rotina. Próxima lacuna após publicação: html-texto-links. Esta branch de preservação não é integrável.

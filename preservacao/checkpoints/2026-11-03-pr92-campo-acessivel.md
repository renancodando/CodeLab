# PR #92: campo acessível e head atual

Branch limpa/sincronizada `conteudo/fullstack-pratica-20261103`, head `1a80a70d3bc63b01a56f639e39d8a4c239d5dba1`. PR https://github.com/renancodando/CodeLab/pull/92. Main/produção continuam na #91, `16fd74d2f3d7863f223408db8f0e2a607974234a`.

CI `41686225948`: 190 contratos/tipos/catálogo/build aprovados, cinco jornadas falharam no mesmo getByLabel exato do campo de código. Trocado por getByRole textbox com nome acessível exato, seguindo testes existentes da bancada de cache; timeout/retries/asserções mantidos. Guardado o finally para não mascarar a falha com contexto já fechado. Nenhum código de produto mudou neste commit.

Investigado somente fullstack-integracao localmente, usando o ZIP exato do artefato `13254384265`, SHA-256 `08e1f499f4aaed738135503a013ec26e40467721b8e6afb53f2ad2d5ad39cf98`, sem build. A execução local não passou: atingiu o limite global de 60 s (1,6 min com encerramento). O trace mostra o novo campo encontrado/preenchido, feedback A correção passou, reload e projeto visível, antes do fim do prazo durante a leitura do progresso. Isso confirma a seleção, não aprovação do cenário completo. Não elevar limites nem repetir outras jornadas localmente. Preview desta investigação encerrado; não deixar processos próprios ativos.

CI novo `41689025562` estava queued e revisão do head `1a80a70` running neste checkpoint. Não usar a revisão sem apontamentos de `9f2e7ea` como aprovação do novo head. O P2 antigo de mutação durante recusa foi corrigido e resolvido, com dez testes específicos aprovados. Aguardar CI/revisão atuais, resolver eventuais falhas, conferir árvore e integrar só o head verificado.

L01 tem quinze atividades nas cinco aulas existentes, cinco produções reais QuickJS. Branch: 137 aulas, 264 atividades, 117 com pausas e 20 sem; publicado 249/112/25. Não declarar publicado ou edição finalizada. Depois de merge: build/dois smokes, deployment READY/SHA/projeto/alias, três contratos públicos proporcionais e recibo remoto. Só então contar L01 entregue e seguir L02, sem reiniciar os aproximadamente 12 lotes contados da PR #91.

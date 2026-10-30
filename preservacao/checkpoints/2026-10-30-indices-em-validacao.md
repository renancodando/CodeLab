# Índices e parâmetros em validação — 30/10/2026

PR: https://github.com/renancodando/CodeLab/pull/87
Branch: conteudo/indices-parametros-sql-20261030
Head: 870c664b7f58f510180bbfd74913953ea9655413
Base: 4d9f9091910f936eca7b5957fd8b06b96e4c740d
Push concluído. O novo lote ainda não está publicado.

Duas pausas conceituais próprias em sql-indices: prever valor vinculado pelo driver e diagnosticar UNIQUE indevido. Referências executadas realmente em SQLite, com apóstrofos, texto que lembra SQL, múltiplas correspondências e nenhuma correspondência; as quatro alternativas DDL recebem três bases e verificações de coluna, preservação de linhas e novas categorias repetidas. Produção independente e medição real seguem no projeto manual. A bancada recebe SQL puro e não oferece interface para os parâmetros desse driver; isso está explícito. Não prometer velocidade por criar índice nem fingir execução do aluno.

Local: 130 testes em dois arquivos, catálogo gerado/conferido e tipos sem erros. Plano por impacto: tests/unit/metricas-catalogo.test.ts, practice.test.ts, sql-indices.test.ts e um fluxo sql-indices.spec.ts. Sem API, .NET, outras linguagens, PostgreSQL ou outro navegador. Não repetir a mesma bateria localmente. Aguardar CI e revisão próprios do head exato; conferir árvore antes de integrar, depois build/dois smokes e deployment READY/SHA/projeto/alias/fluxos públicos pertinentes. Se falhar um cenário, repetir primeiro apenas o afetado sem mudar limites ou assertivas.

Head tem 239 atividades, 108/137 aulas com pausas e 29 sem. Produção está em PR86 com 237 atividades, 107/137 com pausas e 30 sem; publicação PR86 foi conferida em 30/10, recibo 2026-10-30-pr86-publicacao-conferida.md. Toda a implementação deste lote e os recibos estão remotos. Não integrar a branch de preservação.

Próxima lacuna pedagógica após publicação: cpp-texto-conversao. Continuar a fila gerada sem criar aulas por quantidade. Encerrar uma lacuna de pausa não encerra profundidade: ainda faltam revisão dos projetos/percursos, produção independente e fechamento da edição conforme critérios registrados.

## Última conferência dos gates

Run 41100208264, head 870c664b7f58f510180bbfd74913953ea9655413: seleção aprovada; contratos/build ainda reportados em andamento e navegador em fila, sem conclusão. A revisão de código deste mesmo head terminou sem apontamentos. O preview da Vercel está aprovado, mas não comprova CI nem produção. Houve leituras intermitentes com ReadTimeout no conector; uma nova leitura de check-runs e do run confirmou os estados pendentes. Não repetir testes locais, aumentar limites, cancelar o run atual ou integrar usando o preview como aprovação. Próximo passo é conferir a conclusão real deste run e seus logs antes de qualquer merge.

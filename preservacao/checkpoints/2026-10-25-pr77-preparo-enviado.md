# Retomada da acessibilidade ASP.NET — 25/10/2026

A fonte está integralmente enviada na branch testes/aspnet-acessibilidade-preparo, commit 6fa89eb0db6bb0d733d89c98dac53c9b0bdc50a9, PR https://github.com/renancodando/CodeLab/pull/77. O checkout ficou limpo após commit/push e o SHA remoto foi conferido. Aplicação, corretores e currículo permanecem iguais.

Main está em db10c3dae681b5ec2e801e3d903911c8fbb72913 (PR #76). Os CIs 40215361917 e 40217528513 terminaram aprovados nos dez jobs: 1.500 testes/84 arquivos, 194 exemplos externos, 15 cenários ASP.NET e 308 fluxos. Revisão do head 8a4518f sem apontamentos; árvore e pais conferidos. Deployment READY, SHA, projeto e alias confirmados novamente às 18:11 UTC.

A conferência pública 40217741270 passou 11/11 no Chromium e 10/11 no Edge. Todas as seis jornadas C# passaram. O teste ASP.NET de montagem, axe e responsividade excedeu 60 s. O trace 12607624060 mostra foco de cerca de 23 s e tecla de cerca de 15 s, com sucesso, durante a preparação; a causa da lentidão não foi comprovada. O prazo foi atingido antes do axe. Falha e análise estão em preservacao/atualizacoes/pr76. Não declarar a conferência integral aprovada.

A PR #77 conserva as 34 asserções e os cinco testes ASP.NET por comparação da sintaxe, timeout de 60 s e retries zero. Somente o cenário de acessibilidade prepara a ordem principal válida, com uma troca adjacente em vez de cinco. Os três outros fluxos de montagem conservam a ordem alternativa pelo teclado.

Validação local da PR #77: build com exit 0, Vite em 5 min 13 s, 157 páginas e offline 38+6; onze fluxos no Edge com exit 0 em 3,6 min. Axe e responsividade de 220 a 4000 px passaram em 26,3 s. Resultados e auxiliares em preservacao/atualizacoes/pr77 e preservacao/auxiliares/pr77.

CI da PR #77: 40219890859. Revisão do head 6fa89eb concluída sem apontamentos; conferir novamente antes de integrar. Conferência pública anterior ao merge: 40219944442, definição 63fda51ff5785072a2e8e47c519e1af2c4eba69c, testes fixados em 6fa89eb sobre o produto db10c3d.

Continuar pelos gates: CI integral, revisão e threads do head verdadeiro, main, árvore e pais; integrar apenas o head aprovado. Aguardar deployment READY, SHA e alias; fixar a conferência pública no SHA integrado e executar onze fluxos por navegador. Conferir alias após os fluxos e CI pós-merge completo. Não ampliar limites, retirar verificações ou tratar job pendente/cancelado como aprovado. As branches verificacao/publicacao-pr77 e preservacao/retomada-cloud-20261015 não devem ser integradas.

Depois de encerrar esta correção, seguir para aspnet-di: comparar instâncias por escopo, diagnosticar scoped capturado por singleton e praticar resolução/descarte com referências .NET 10 reais. Preservar as aulas existentes. O mapa continua com 137 aulas, 213 atividades, 99 aulas com pausas e 38 sem; presença de pausa não prova profundidade concluída.

URLs assinadas, JSON privado do provedor e traces brutos não foram enviados ao código.

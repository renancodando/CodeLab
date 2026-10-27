# Checkpoint — proteção ASP.NET em validação

Branch de preservação: não integrar em main.

Fonte salva na branch conteudo/autorizacao-limites-20261027, commit f648534c50d87e88be5c9ffdbd484cb5da20b6bf, PR https://github.com/renancodando/CodeLab/pull/81. Base/main publicada: 8f13fdae2a39f8be12392771cedcf3d988f438f3, com CI e alias READY reconferidos antes da edição. Working tree limpa e branch enviada ao GitHub.

A aula existente aspnet-protecao recebeu três pausas: previsão 401/403/204; diagnóstico da autoria confiável, sem confiar no JSON; montagem do limiter de concorrência sem fila. A reconstrução aceita duas ordens equivalentes de rota/middleware. Exemplo e exercício originais preservados, projeto com revisão manual mais concreta. O CodeLab continua sem login e com progresso local; autenticação existe apenas como conteúdo. As respostas do aluno são conceituais. O verificador usa identidades sintéticas e HTTP no loopback; não valida JWT/cookies nem oferece o handler de teste como autenticação de produção.

Local: 123 testes da aula/corretor comum, oito cenários nativos .NET 10 e catálogo/métricas/tipos aprovados. As alternativas da decisão por recurso recebem oito combinações de identidades/autoria; o limiter usa barreiras, sem sleep, para testar 429 e devolução da vaga. CI proporcional 40581912211 do próprio f648534 aprovado em 4 min 56 s: quatro arquivos unitários/143 testes, sete fluxos Chromium, 24 cenários .NET das famílias afetadas e build/API. Não rodar suíte completa nem outros runtimes por rotina.

Na última consulta, a revisão do f648534 ainda estava running, sem threads apontadas. Isso não é aprovação; não integrar enquanto a revisão necessária não concluir. Não reutilizar revisão de outra PR ou commit. Após aprovação, conferir main/head/árvore, merge com expected_head_sha, build/dois smokes pós-merge e deployment READY/SHA/projeto/alias antes/depois de três fluxos públicos. Repetir primeiro somente cenário que falhar, mantendo limites e asserções.

Métricas deste checkout: 137 aulas, 225 atividades, 103 aulas com pausas e 34 sem. Ainda não publicadas por esta PR; produção permanece com o lote #80 (222 atividades/102 aulas com pausas/35 sem). A presença de pausas não conclui profundidade ou a edição. Depois, seguir a fila gerada, começando pelos fundamentos SQL, sem inflar aulas ou reabrir expansão meteorológica.

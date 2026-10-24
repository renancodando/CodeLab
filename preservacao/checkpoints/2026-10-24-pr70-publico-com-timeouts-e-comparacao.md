# PR #70: pós-merge aprovado e conferência pública comparativa

Main: 714991c0f7e066ab5a92a3ee40e48f0568375e3f.
A revisão do head a933b85, as árvores/pais e o CI de entrada 40042896202 foram conferidos antes da integração. O pós-merge 40097101648 concluiu todos os dez jobs aprovados: 1.359 testes/79 arquivos, 282 fluxos de navegador, 194 exemplos externos, 36 cenários .NET 10 e auditoria zerada. Prova pública própria em preservacao/atualizacoes/pr70/ci-pos-merge-714991c.json.

Antes dos testes, o deployment foi observado READY/production no projeto e no SHA esperados, associado ao domínio code-lab-omega.vercel.app. Os metadados internos do provedor permanecem locais.

A tentativa pública local em Edge terminou com falha, e não é aprovação:
- .NET: quatro testes passaram e um esgotou o limite global de 60 segundos no fluxo de exportação/restauração.
- Git: um teste passou e três esgotaram esse limite, incluindo recuperação, larguras e quota. A limpeza do contexto offline também registrou contexto fechado após o timeout.
- O trace de .NET mostra navegação inicial demorada, reload e clique de restauração sem conclusão antes do limite. Não prova restauração correta, perda de dados ou causa da lentidão.
- O diagnóstico Chronos observou 1,7 GB livres e classificou pressão pelo limiar de disco; helper saudável e responsividade não medida. Não atribuir os timeouts a esse diagnóstico como causa comprovada. Nenhum processo, dado, log ou cache do usuário foi apagado e nenhum limite foi ampliado.

Para comparação independente, a branch verificacao/publicacao-pr70 contém somente o workflow de conferência, commit 080bfc28e6c13b5f068211cacb440018ca2c605e, pai 714991c. Não integrar essa branch de verificação em main. O workflow usa permissões somente de leitura e checkout fixo do SHA 714991c, conferido por comando; roda os mesmos nove testes contra o domínio público, em Chromium, sem retries, com 60 segundos por teste e os mesmos cenários. Não altera a produção nem os fontes da aplicação.

Execução pública isolada: https://github.com/renancodando/CodeLab/actions/runs/40098887331, em andamento neste checkpoint. Exigir resultado completo, examinar falhas e reconfirmar alias/SHA após a execução. Um resultado posterior não apaga os timeouts de Edge nem demonstra sua causa.

Todo o código da entrega está em main e no GitHub. O checkout local permanece em main, limpo. Relatórios privados e traces locais não são incluídos neste registro. Ainda há 43 aulas sem pausas na fila gerada; não declarar a edição curricular concluída.

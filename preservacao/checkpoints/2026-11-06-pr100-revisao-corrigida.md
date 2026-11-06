# Continuação L09 — PR #100

Oito lotes publicados, L09–L12 (~4) restantes. Main publicado dc186bd442afb132779a1acc58333ab044f835d2. Branch conteudo/percursos-pratica-20261106, head remoto 39e8eb1f56bc6f75ef7bcc477fded4413c3d07d1, push conferido. PR #100 aberta, não integrada/publicada ainda.

Após c25e04b, o contrato editorial do CI exigiu preservar dois parágrafos e três checkpoints por etapa. Todo o aprofundamento foi incorporado à estrutura anterior, sem remover conteúdo ou mudar asserção; caso local específico aprovado e commit 02f85ab. CI 42305283332 desse head passou, mas não aprova o head novo.

A revisão detectou defeito real: o mutante da corrida assíncrona gerava rejeição não observada no QuickJS e não mostrava erro no laboratório. Novo caso no executor real reproduziu logs vazios. O exemplo/solução agora relata a falha por console.log (a API disponível), em vez de apenas criar nova promise rejeitada. O controle exige a mensagem de conclusão; o mutante exige Falha na conferência: Resposta antiga substituiu a atual, sem sucesso. Ambos passaram no recorte local QuickJS. Não alterou executor, limites ou domínio. Commit 39e8eb1.

Thread PRRT_kwDOUi7gEc60t8Tm resolvida após correção/teste/push, e revisão renovada do head 39e8eb1 concluída sem findings/pendências. CI 42308797900 ainda com navegador em andamento na conferência: jobs 128204849240/128204978886 aprovados e 128205452375 em execução. Não tratar como aprovado antes do resultado final.

Retomar pelo head verdadeiro. Se green e threads resolvidas, conferir main/árvore, merge esperado, pós-merge build/dois smokes, deployment READY/SHA/projeto/alias e três contratos públicos distintos antes/depois. Fonte relevante está remota; nada deve ser descartado. Não repetir suíte geral localmente. Depois L10 redes/Git/arquitetura; L11 projetos/corretores/resíduos TS/SQL; L12 fechamento e investigação dos timeouts públicos de axe ainda sem causa comprovada. Preservar identidades, etapas, local-first, sandbox, lazy loading e dados locais.

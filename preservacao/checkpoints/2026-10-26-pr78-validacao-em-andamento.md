# Retomada da prática de escopos ASP.NET

- Branch de código: `pratica/aspnet-escopos-servicos`.
- PR: https://github.com/renancodando/CodeLab/pull/78 (rascunho).
- Head enviado e lido no GitHub: `b1a4813785b0d33d8eaad8ebfaa51406f517f69e`.
- Commits: c7a42af adiciona três atividades na aula existente aspnet-di; b1a4813 explicita a revisão manual do projeto com critérios observáveis.
- Catálogo gerado neste head: 137 aulas, 216 atividades, 100 aulas com pausas, 37 sem pausas. Fila: docs/aulas-sem-pratica.md. Isso não significa edição concluída.
- Main e produção permanecem `dae4e44e0b24ec4ed3426526e43cf5a61c2f9229`; deployment READY, projeto e alias code-lab-omega.vercel.app conferidos em 26/10. A nova aula ainda não foi publicada.
- O CI 40318632883 do primeiro head aprovou o núcleo: 1528 testes/85 arquivos, 194 exemplos externos, 16 cenários de escopos .NET 10, incluindo duas requisições HTTP reais. O CI integral desse head ainda estava em andamento; não reutilizar esse resultado para aprovar o head novo.
- CI do head atual: https://github.com/renancodando/CodeLab/actions/runs/40320647497 (em andamento).
- Local: 91 testes específicos/regressões e primeiro build 157 páginas/offline 38+6 passaram. Navegador: 16/17; faltava explicitar revisão manual no projeto. Corrigido o texto, preservada a asserção. Novo build local em andamento; nova rodada dos 17 fluxos ainda pendente.
- As referências de console passaram antes de acrescentar HTTP. Duas compilações locais da versão HTTP excederam 90000 ms; diagnóstico identifica compilação. Causa não comprovada; não aumentar limite. O mesmo verificador HTTP passou no CI do primeiro head.
- Logs anteriores e traces locais preservados. Evidência filtrada em preservacao/atualizacoes/pr78/validacao-inicial-c7a42af.json; auxiliares em preservacao/auxiliares/pr78/. Não copiar payloads privados de hospedagem nem URLs assinadas.
- Próximo: terminar build e 17 fluxos locais; resolver falhas; conferir CI integral e revisão do head exato; conferir árvore/pais antes e depois do merge; deployment READY/SHA/projeto/alias; 17 fluxos públicos em Chromium e Edge; CI pós-merge. Template de conferência pode partir da branch verificacao/publicacao-pr77, fixando o SHA novo e incluindo aspnet-escopos.spec.ts.
- Preservação: esta branch de backup e as branches de verificação NÃO devem ser integradas. Sem descarte/reset/force push; respeitar limites, sandbox, progresso local e visual.

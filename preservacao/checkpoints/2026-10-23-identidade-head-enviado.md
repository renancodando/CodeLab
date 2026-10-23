# Retomada: identidade e autorização em validação

- Branch de trabalho: pratica/identidade-autorizacao; PR #68 em rascunho, head f7bac1f5528ccb21d80f4d566a4d8efd74c078f6, fonte enviada ao GitHub.
- Base publicada main 9dd40f0635e6a8445f3db10500935a0a97809d68, PR #67. CI de entrada e pós-merge aprovados, revisão/árvore/pais conferidos e deployment READY/production no projeto/SHA/alias esperados. Oito fluxos públicos Fetch e dois C++ passaram em dois lotes completos, com alias reconfirmado depois; provas/checkpoint próprios preservados.
- A aula existente identidade-api conserva 12 capítulos e projeto. Três pausas: previsão da origem do corpo, diagnóstico de vínculo/papel e produção de autorizarNota. Previsão e escolha conceituais; política pura executa em QuickJS, sem credenciais, autenticação, HTTP ou persistência. Projeto externo/manual; CodeLab continua sem contas.
- Primeira prova específica 53/54 revelou aprovação indevida do mutante que ordena papeis. O teste de preservação passou a usar dois papéis fora da ordem alfabética em entradas mutáveis/congeladas; 54/54 específicos/regressão Fetch passaram depois, em 7,09 s, sem retirar o mutante ou mudar limites.
- Métricas geradas da branch: 137 aulas, 192 atividades, 92 aulas com pausas, 45 sem. Publicação continua 189/91/46 até gates próprios.
- Suíte local completa e build em sequência estão em andamento. Depois do build, usar a configuração local de identidade para sete novos fluxos e oito regressões Fetch. CI próprio 40018646005 iniciado. Exigir resultados completos, revisão do head verdadeiro, árvore/base, integração e conferência pública antes de declarar publicado.
- Não reutilizar aprovações de #67. Não aumentar timeouts, reduzir cenários ou converter lotes incompletos em aprovações. Preservar logs da falha e corrigidos.
- Documentação já explica o lote e a publicação anterior; atualizações adicionais de resultados podem ir ao checkpoint/PR para não disparar CI apenas por relato.

Próxima aula após finalizar esta entrega: limites-cache. Não expandir o catálogo ou retomar meteorologia sem regressão concreta. A edição ainda não está concluída. Branch de preservação não deve ser integrada ao main. Metadados privados Vercel e traces brutos ficam locais; provas relevantes devem ser sanitizadas e enviadas com hashes.

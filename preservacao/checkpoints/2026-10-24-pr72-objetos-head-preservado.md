# Retomada da prática de objetos C# — PR 72 em rascunho

## Fonte preservada

Branch pratica/csharp-objetos-estado, head 9ff6250c7b147f25f8690cd20f881a666f3a9be2, commit "pratica referências e invariantes de objetos em C#". Commit enviado, SHA da branch e head da PR conferidos diretamente no GitHub. PR https://github.com/renancodando/CodeLab/pull/72, em rascunho. Quinze arquivos, 218 adições e 27 remoções; estado Git local limpo depois do push. Nenhum código relevante deste lote ficou somente local.

Main publicado permanece a8b7cedb0e93b035b3a8b38afe66a77850ea386c (PR 71), com CI de entrada/pós-merge completos, revisão exata e 28 fluxos públicos aprovados em Chromium/Edge. READY, SHA, projeto e alias conferidos antes/depois; consultar checkpoint 2026-10-24-pr71-publicacao-conferida.md. Não integrar branches de preservação ou conferência.

## O que mudou

Somente a aula existente csharp-objetos: prever a mesma instância por interface, diagnosticar escrita externa que contorna validação e reconstruir TentarSacar com recusa sem mutação. Mantém Produto/IDescritivel, IForma/Retangulo, doze capítulos e Conta sob revisão manual. São pausas conceituais offline, não compilação do aluno ou avaliação de código livre. Sem novas aulas, dependências, contas ou alterações visuais.

Verificador tests/fixtures/csharp-objetos.mjs ligado a scripts/verify-content-examples.mjs: lê os exemplos/gabaritos originais via AST, usa .NET 10, executa doze programas com casos e mutantes e exige três diagnósticos reais. Há cinco novos fluxos de navegador e vinte e seis novos testes unitários.

## Evidência e pendências

52 testes específicos/regressão em dois arquivos passaram em 17,95 s. Métricas geradas e staged whitespace conferidos.

A primeira compilação nativa local terminou com ETIMEDOUT em 90 s. A repetição isolada executou os doze programas e confirmou CS0272 e CS8852, mas terminou novamente com ETIMEDOUT em 90 s na última compilação, que deveria confirmar CS0200. A suíte nativa local não foi aprovada integralmente. Preservar ambas as falhas; não aumentar limites nem inferir sua causa.

Durante essa execução, o disco C: tinha 0,52 GB livres (antes: 1,7 GB). Isso é uma condição crítica de armazenamento, mas não prova causalidade para os timeouts. Nenhum arquivo existente foi apagado para contornar o problema. Antes de iniciar outros builds locais, conferir recursos disponíveis. É possível validar a fonte remota num ambiente com espaço suficiente; não declarar que os gates locais foram aprovados.

Build e dez fluxos locais (cinco objetos/cinco controle) pendentes. CI 40121389848 em andamento no head 9ff6250; auditoria concluída com sucesso, núcleo ainda executando os exemplos na última leitura. Conferir resultado real de todos os jobs, sem converter parcial em aprovação. Ainda exigir revisão pedagógica, compilação completa, build, navegador, revisão do head e publicação própria. Não integrar esta PR enquanto esses gates estiverem pendentes.

Métricas da branch: 137 aulas, 204 atividades, 96 aulas com pausas e 41 sem. Produção: 201 atividades, 95 com pausas e 42 sem. Uma pausa não encerra a aula ou a edição.

## Retomada

1. Conferir main, PR 72, CI 40121389848 e recursos do ambiente.
2. Resolver falhas concretas no head real sem enfraquecer testes ou limites; executar referências, build e os fluxos completos.
3. Liberar revisão quando os gates próprios estiverem cumpridos; não reutilizar revisão da PR 71.
4. Conferir árvore, integração, READY, SHA/alias e fluxos públicos antes de declarar publicado.
5. Depois seguir csharp-colecoes e csharp-async na fila gerada, sem aumentar o catálogo ou retomar expansão do clima.

Dois auxiliares locais foram preservados exatamente em preservacao/auxiliares/pr72 (commits d2d2953 e 198be8a), com comparação do conteúdo remoto. Dependem da disposição local de pastas; o CI usa o verificador completo do repositório. Logs brutos e metadados privados de hospedagem continuam locais de propósito. Este checkpoint fornece a evidência necessária sem publicar esses dados.

# PR 73: coleções preservadas e validação em andamento

Branch pratica/csharp-colecoes-consultas, head 71747d3a18fc603af9356cc381536e6591f5b8da, commit "pratica busca e composição de coleções em C#". Fonte enviada, branch e head conferidos diretamente no GitHub. PR https://github.com/renancodando/CodeLab/pull/73 em rascunho e anexada ao chat. Dezesseis arquivos, 215 adições e 28 remoções; worktree limpo depois do push.

Base main 6a912cdf369f3208529b2e8c6fa532d514327d56, PR 72 publicada e verificada: CI de entrada/pós-merge completos, revisão exata e vinte fluxos públicos Chromium/Edge aprovados; READY/SHA/projeto/alias antes/depois. Checkpoint final em 2026-10-24-pr72-publicacao-conferida.md.

A aula existente csharp-colecoes conserva exemplo, pares, doze capítulos e relatório por cliente/período. Três pausas: TryGetValue com presença/zero/ausência, ToList filtrado independente e Where/Select/Sum sobre Pedido. Skill de composição csharp.colecoes.composicao. Respostas conceituais offline, sem execução do aluno ou avaliação de código livre; projeto manual. Tipos de apoio não entregam o relatório pronto.

Verificador novo tests/fixtures/csharp-colecoes.mjs ligado ao script completo; lê o exemplo/gabarito reais via AST. O compilador LINQ existente aceita declarações opcionais, mantendo chamada antiga de dois argumentos. Local: 52 testes específicos/regressão em dois arquivos aprovados (7,59 s), 15 cenários novos .NET 10 (treze programas e CS1061/CS0841 esperados) e dez antigos de LINQ aprovados, com exit 0. Matrizes conferem vazio, zero, borda, ordem, repetição, origem preservada, chamadas independentes, mutantes e uma única enumeração.

Build local em andamento; conferir conclusão real antes de executar dez fluxos de navegador (cinco coleções/cinco objetos). CI 40142806559 em andamento no head 71747d3. Não converter parcial em aprovação. Exigir build, navegador, revisão pedagógica/automática, CI integral no head correto, árvore, integração, deployment READY/SHA/alias e fluxos públicos próprios antes de declarar esta entrega publicada.

Os auxiliares novos foram preservados em preservacao/auxiliares/pr73 com conteúdo remoto conferido. O script PowerShell admite etapas fixas especificos/referencias/compilacao/navegador e pede atividade temporária só durante a validação, restaurada no final. Isso evita a suspensão por inatividade diagnosticada no lote anterior sem alterar a política global de energia ou impedir ação manual. Nenhum timeout, cenário ou isolamento foi enfraquecido. Conferir espaço disponível antes de builds; não apagar arquivos existentes para obter verde.

Nesta branch: 137 aulas, 207 atividades, 97 aulas com pausas e 40 sem. Produção ainda tem 204/96/41. Não aumentar aulas ou declarar C# concluído. Depois desta entrega, a próxima lacuna original é csharp-async. Traces e metadados privados de hospedagem seguem locais, sem upload.

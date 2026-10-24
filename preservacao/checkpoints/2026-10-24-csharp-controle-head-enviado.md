# Retomada da prática de controle C#

Branch: pratica/csharp-controle-fluxo.
Head enviado e confirmado no remoto: fd602efedbe3ab4967b108bf5a2e201e52004a7d — pratica interrupções e retorno em C#.
PR atual: https://github.com/renancodando/CodeLab/pull/71, rascunho.
CI próprio: https://github.com/renancodando/CodeLab/actions/runs/40116365172, em andamento.

Três pausas adicionadas somente à aula existente csharp-controle: previsão de continue/break/return, condição inclusiva e reconstrução de filtro/acumulador/retorno. Preservados SomarAte, EhPar, doze capítulos e o projeto de frete. O corretor aceita a troca entre chaves equivalentes, sem exigir indentação; cada peça deve aparecer uma vez. As respostas do aluno são conceituais offline.

Validação específica local: 66 testes em dois arquivos aprovados em 11,68 s, incluindo a regressão da abertura .NET. Dezesseis cenários reais .NET 10 aprovados: quinze execuções e um diagnóstico CS0161. O verificador lê por AST o exemplo e o gabarito originais, além das referências das pausas. Casos conferem vazio, zero, negativos, limite inclusivo, entradas preservadas e chamadas independentes.

Build local seguido por dez fluxos de navegador (cinco novos/cinco da abertura .NET) está em andamento. Exigir as conclusões completas, revisão do head verdadeiro e CI integral antes de integrar. Depois conferir árvore/base/pais, deployment READY, SHA/domínio e fluxos públicos próprios. Não utilizar a aprovação da base para este lote, não ampliar limites nem retirar verificações.

Base main 714991c: PR #70 integrada, CI de entrada e pós-merge completos e nove testes públicos Chromium aprovados. Domínio READY/production, projeto e SHA foram reconfirmados antes de editar. Quatro timeouts locais de Edge permanecem registrados sem causa comprovada; não afirmar que Chromium os resolve. Documentação de continuidade atualizada com os resultados reais.

Métricas/fila da branch geradas: 137 aulas, 201 atividades, 95 aulas com pausas e 42 sem. Main publicado mantém 198 atividades/94 aulas com pausas/43 sem até a integração e conferência deste lote. Essas contagens não concluem aula, linguagem ou edição.

Código e testes estão commitados e enviados. Não apagar alterações, branches ou artefatos existentes. Relatórios privados do provedor não são incluídos neste checkpoint.

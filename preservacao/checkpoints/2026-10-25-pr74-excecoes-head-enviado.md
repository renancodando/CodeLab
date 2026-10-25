# Exceções e leitura C# preservadas em rascunho

Fonte relevante enviada à branch pratica/csharp-excecoes-leitura, head 75db1bfc000f2b81cff9662a00f183593f11861c. PR https://github.com/renancodando/CodeLab/pull/74 em rascunho, baseada em main aea1b17fd80da25a5be3c51981f8aaeabe582ac2. Não integrar sem gates próprios.

Lote: três pausas em csharp-async, preservando Dividir, exercício original, doze capítulos e importador JSON. Previsão de finally/retorno, diagnóstico de teste que engole sua própria falha e expressão await dentro do using. Respostas do aluno conceituais offline, sem execução C#. O preenchimento reconhece a forma pedida com espaçamento e ConfigureAwait(bool), não código livre. O verificador .NET 10 compila/roda referências, arquivos reais e dublê explícito de leitor, com erro, cancelamento antes/durante a espera e descarte. Mutantes demonstram aprovação indevida pelo catch genérico e descarte prematuro ao devolver Task.

Passaram 58 testes específicos/regressões em dois arquivos (21,31 s) e 19 cenários .NET 10 (18 programas executados e rejeição CS4016). Build e dez fluxos locais ainda precisam terminar. CI integral 40191403879 em andamento; revisão do head ainda pendente. Não reutilizar a aprovação da PR 73, não aumentar limites ou retirar cenários.

PR 73 está publicada/conferida: merge aea1b17, árvore/pais, CI de entrada/pós-merge e vinte fluxos públicos, deployment READY/SHA/projeto/alias confirmados. Main remoto segue aea1b17; nenhuma outra PR aberta foi encontrada no início deste lote.

Métricas geradas na branch: 137 aulas preservadas, 210 atividades, 98 aulas com pausas e 39 sem. Publicação conferida ainda tem 207/97/40 até integrar/publicar a PR 74. Uma pausa não encerra a profundidade da aula, linguagem ou edição. Próxima lacuna da fila: aspnet-projeto, somente depois de concluir a entrega atual.

Inspeção Chronos de 25/10: sem conflito de instalação, fsHelper saudável e disco aproximadamente 2,5 GB; não comprovou causa para latência de comandos, nem mediu impacto do banco de diagnóstico. Cobertura de uso/quota parcial e heurística, sem equivalência com faturamento ou painel. Nenhum processo/configuração/log foi removido. Pedidos temporários de atividade nas validações próprias restaurados em finally; não mudar política global de energia.

Logs, traces e metadados privados de hospedagem ficam locais intencionalmente. Preservar os três auxiliares de validação e conferir conteúdo remoto antes de encerrar. A ferramenta para anexar a PR ao chat ficou indisponível nesta execução; a URL acima é a referência verificável.

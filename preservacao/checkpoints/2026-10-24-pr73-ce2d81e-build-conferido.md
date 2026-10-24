# PR 73: seletor corrigido no head ce2d81e

Branch pratica/csharp-colecoes-consultas, head ce2d81e4a4f44d24629bb41f07dd4a6d7144269e, enviado ao GitHub e conferido na PR https://github.com/renancodando/CodeLab/pull/73, ainda em rascunho. Commits 71747d3 (prática) e ce2d81e (teste/docs). Nenhuma alteração de conteúdo, interface, gabarito ou limite na correção.

O primeiro head teve nove testes locais aprovados e um erro de seletor: depois de consultar a solução, .example-code encontrava tipo de apoio e gabarito. O CI inicial 40142806559 também terminou com failure; a parcela 1/8 registrou o mesmo erro, com 38 aprovados e um reprovado. Não chamar essa execução de verde. Provas em navegador-local-inicial-71747d3.json e ci-inicial-71747d3-com-falha.json na pasta de atualizações pr73. Traces brutos ficaram preservados localmente.

O novo teste distingue o código de apoio direto da seção e o código em data-help e exige ambos visíveis em 220/4000 px. Mantém axe, contagem das pausas, overflow, os dez cenários, timeout e retries. Nenhum assert foi retirado.

Os 52 específicos/regressão e 25 cenários nativos (quinze novos/dez antigos LINQ) passaram sobre o mesmo conteúdo e verificadores, que não mudaram nessa correção. Build final do head corrigido passou com exit 0: Vite 3m28, 157 páginas, offline 38 essenciais/seis opcionais, versão 1c64dfca9c47d093fdbd. Os dez fluxos locais finais estão rodando em diretório novo para não sobrescrever a falha inicial.

CI do head corrigido 40143973678 ainda em andamento. Núcleo e auditoria já aprovados; exigir todas as parcelas de navegador e conclusão do run. Ainda não há revisão liberada deste head; não reutilizar resultados integrais ou revisão de outro SHA.

Auxiliares finais preservados em preservacao/auxiliares/pr73/final. O script de atividade temporária aponta para o novo diretório de resultados; restaura o estado em finally e não muda política global de energia. Seguir os gates locais, liberar revisão do head certo, conferir main/árvore/CI, integrar e verificar deployment/SHA/alias e fluxos públicos próprios.

Base publicada ainda é main 6a912cdf369f3208529b2e8c6fa532d514327d56 (PR 72), com CI e domínio conferidos. Produção tem 137 aulas, 204 atividades, 96 aulas com pausas e 41 sem. A PR 73 propõe 207/97/40; uma pausa não encerra aula ou linguagem. Próxima lacuna original após esta entrega: csharp-async.

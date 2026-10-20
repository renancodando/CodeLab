# Retomada: PR #62 integrada e evidência pública preservada

## Estado de fonte

- Main/local/origin: 681890cd027ab35041a7186c33ce0c5b14b54410, integra validação de componentes com cenários independentes.
- Árvore real 70d3e228a21e9c9d71fd0e31e8f4cdb9ace175a3, igual ao head/merge virtual conferido.
- Pais: 25197c70895170781337f301d4200c1645f81820 e 6a064b4bb813a548a2d2711da241f6c81c7a5682.
- PR #62 integrada; branch validacao/componentes-acessibilidade e head 6a064b4bb813a548a2d2711da241f6c81c7a5682 permanecem remotos.
- Checkout limpo, sem arquivos novos, stash ou commits locais de branches ausentes dos remotos. Um worktree. Ignorados são builds, dependências e resultados de testes. Fonte necessária para continuar está no GitHub.

## Gates comprovados

CI da PR 39422799320 completo/success, tentativa 1, head 6a064b4: 1163 unitários/73 arquivos, 194 exemplos externos compilados/executados, PostgreSQL, build e auditoria; navegador 61/73/42/55, total 231. Revisão do mesmo head concluída sem achados/tópicos abertos. Não foi usada aprovação da PR #61 para esse head.

Validação local: 33 unitários, build 4m03/157 páginas/offline f37d964d9f0d8e658bfd; dois cenários separados passaram no domínio em 37,4 s. Lote completo local teve 12/13, com timeout no reload do backup de formulário; repetição isolada passou em 46,6 s. Limites e afirmações mantidos. Não chamar a primeira execução de integralmente aprovada.

CI pós-merge 39426437901, head 681890c: última consulta com cinco jobs aprovados e Navegador (4/4), job 118641268845, ainda em execução. Confirmar conclusão real antes de editar a próxima entrega. Se houver recibo posterior nesta pasta, ele atualiza essa observação temporal; não usar in_progress/cancelled como aprovação.

## Produção observada

Alias https://code-lab-omega.vercel.app, deployment dpl_FyXHeiUo4AfKCRgUp4RxbWLaqP7b READY/production, projeto prj_XgncY54wYGiSgPH0n1JOol3UFWCn, gitSource.sha 681890cd027ab35041a7186c33ce0c5b14b54410.

Treze fluxos públicos: 12/13 na execução completa em 5,3 min. O fluxo de descarte recebeu indisponibilidade do executor ao avaliar código correto. Repetição isolada passou em 49,9 s de cenário, sem alterar teste/código/limites. As duas verificações separadas de decisões/teclado e axe/220–4000 px passaram na execução completa. Offline, formulários e backups passaram. Não dizer que foram 13/13 na primeira execução nem que a causa da indisponibilidade foi corrigida.

O trace registrou JS/Worker/WASM HTTP 200 e MIME correto, sem erro específico que explique a falha. A inicialização intermitente continua uma limitação a reproduzir/investigar, preservando status unavailable e o código do aluno, sem fabricar erro de aprendizagem. Não aumentar limites de execução, memória ou expectativas para obter verde. Alterar o executor maduro somente com evidência e teste capaz de reproduzir a causa.

## Artefatos e privacidade

Preservacao/atualizacoes/pr62 contém logs sanitizados, configurações e diagnostico-publico-62-20261020.json; manifesto-publico-681890c.json distingue 12/13 de repetição e registra hashes. Todos os blobs desse conjunto foram conferidos contra os bytes enviados. Os manifestos local-6a064b4 e 6a064b4 registram build/unitários e reprodução local. Evidências antigas da PR #61 e seus manifests permanecem preservadas.

A revisão automática rejeitou a publicação de dois logs brutos por conter caminhos pessoais. Versões sanitizadas foram enviadas e verificadas; originais dos logs/traces e respostas privadas de hospedagem permanecem no PC. Eles não são fonte necessária para reconstruir o produto. Não contornar essa rejeição nem expor segredos. O manifesto-publico-sanitizado-20261020.json corrige a distinção entre os hashes dos originais rejeitados e os arquivos realmente arquivados.

## Próxima execução

1. Conferir main/PRs e conclusão do CI pós-merge 39426437901; resolver uma falha real antes de integrar outra entrega.
2. Reproduzir e diagnosticar a indisponibilidade intermitente de inicialização antes de alterar o executor. Não confundir HTTP 200 com execução comprovada nem culpar o ambiente sem evidência.
3. Continuar a fila gerada quando a validação estiver encerrada: primeira lacuna armazenamento. Preservar a aula/projeto e aprofundar snapshots JSON, validação/migração e falha de persistência sem perda do estado em memória.
4. Atualizar continuidade/produção com os resultados posteriores no próximo lote coerente, evitando commits exclusivos de documentação que provoquem um novo ciclo de CI sem mudança de produto.
5. Métricas atuais: 137 aulas, 177 atividades, 87 aulas com pausas, 50 sem. A edição ainda exige profundidade, percursos e projetos; não está finalizada.

Uma tarefa Cloud pode continuar pelo main acima e por este checkpoint, sem depender dos artefatos privados do PC. A automação desktop não executa com o computador desligado; os workflows do GitHub continuam na infraestrutura do GitHub. Não criar outra tarefa Cloud sem pedido humano explícito.

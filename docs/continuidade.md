# Continuidade do CODELAB

## Estado em 7 de outubro de 2026

- PRs #1, #2, #3 e #4 integradas. O catálogo tem 132 aulas em 20 trilhas; as oito trilhas por linguagem têm nove aulas cada.
- Há 48 módulos panorâmicos de 13 capítulos e 24 aulas próprias de 17 capítulos, além das 60 aulas originais. As aulas próprias oferecem 48 problemas independentes.
- Matriz com 606 entradas: 134 vinculadas a atividades específicas e 472 introduzidas. Entradas podem repetir conceitos em contextos diferentes; a contagem não representa esgotamento das especializações.

## Evidências da última entrega

- Código validado no head `9cd2122d36b8a6c9d025c7f993812045536220e0`.
- Run [37566327714](https://github.com/renancodando/CodeLab/actions/runs/37566327714): 136 testes de unidade, 118 programas externos, três cronogramas PostgreSQL com conexões distintas, 59 testes de navegador, builds frontend/API e 138 páginas.
- Auditoria npm sem vulnerabilidades. A correção de source-map-js 1.2.2 permanece no lockfile.
- Revisão concluída para esse head sem novos achados; a thread P2 do stderr foi resolvida após a correção e a execução dos cenários.
- Integração em `1ba1ae70ed6953124c419f06c94078bf87481b02`; árvore `7ffa35ce37a96aeb762c3782c5fdf2e3a7777b1f`, igual à testada.
- Heap no ciclo medido: 12.860.480 para 15.156.564 bytes, crescimento 2.296.084; zero editores visíveis restantes e 114 geometrias. É evidência deste cenário.
- A PR #3 também teve CI aprovado após sua integração em main, no run 37565921506.

Este checkpoint altera apenas documentação. As execuções automáticas de main podem estar em andamento; confira seu resultado na próxima retomada e investigue qualquer falha real antes de ampliar código.

## Próxima ação editorial

Leia docs/curriculo-completo.md. Priorize aulas próprias sobre biblioteca padrão e protocolos Python; variância e módulos TypeScript; iteradores, invalidação e algoritmos C++; propriedade e protótipos JavaScript. Continue a aprofundar as oito linguagens, projetos maiores, ecossistemas e diagnóstico. Não marque temas apenas listados como prática pronta.

O diálogo modal, Grid com trilhas automáticas, iteradores C# e snapshots/conflito PostgreSQL já possuem aulas e verificações próprias. Ampliar esses assuntos com novas atividades exige mecanismos adicionais, evitando repetir o que já foi entregue.

Depois das prioridades editoriais, prossiga com a migração gradual para passos interativos, mantendo a leitura extensa e o progresso local sem contas.

## Manutenção e critério de integração

As definições em src/content/deep são a fonte de verdade; content:generate deriva índice e matriz. Os gabaritos SQL que exigem conexões distintas usam postgresScenario e verify-sql-concurrency. O verificador espera close para capturar streams completos; em psql interativo a pessoa deve executar ROLLBACK após o erro.

Antes de editar, confira main, PRs abertas e este checkpoint. Preserve critérios de profundidade, execute os exemplos e o fluxo completo no CI, revise achados e integre somente código verificado. Confira se a árvore integrada corresponde à testada. Revise contagens ao acrescentar aulas.

## Preservação do produto

Preservar aparência, mundo, clima, áudio, editor e armazenamento local. Os estilos novos pertencem aos exemplos didáticos. A bancada orienta o dialeto da aula: PostgreSQL na expansão e SQLite nos exemplos originais correspondentes. Não acrescentar login, contas ou progresso remoto.

## Verificação da implantação e execução local

O conector Vercel recusou leitura do projeto code-lab em renancodandos-projects com 403. A ampliação de acesso já foi solicitada ao usuário; ainda não houve resposta. Preview Ready não comprova a implantação.

A consulta pública também não conseguiu acessar o endereço pela ferramenta web. O navegador de teste local falhou ao iniciar com erro de caminho dos assets do kernel. Isso não demonstra que o site esteja fora do ar; a verificação do fluxo publicado permanece pendente.

O executor local continua falhando na preparação de ACL antes de iniciar processos. A cópia local não foi sincronizada. Não alterar ACLs do sistema nem sobrescrever clones ou arquivos não rastreados. Quando a execução local voltar, inspecione mudanças e arquivos não rastreados antes de sincronizar.

## Retomada

A automação continuar-melhorias-do-codelab permanece configurada neste chat. Confira gates de main e PRs abertas, retome o estado existente e comunique somente progresso significativo, falha ou ação necessária. Se um limite impedir publicação, registre o head e o último gate conhecido; retome quando houver disponibilidade. O pedido integral ainda está em andamento enquanto os aprofundamentos e a verificação da implantação estiverem pendentes.

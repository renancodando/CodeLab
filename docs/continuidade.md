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

## Nova prioridade autorizada: aprendizagem com prática e projetos

Branch de trabalho: aprendizagem-debug-habilidades-projetos, iniciada na main e7bca514800b284b84bc926ccfed33ce3d391768, cujos gates de main foram aprovados (37568195439). Esta expansão ainda deve passar em todos os gates antes de integrar.

Implementado na branch: 25 atividades distribuídas nas oito linguagens (quatro programas JS quebrados); pausas corrigíveis nos capítulos ligados a essas atividades; domínio por habilidade com evidência distinta e assistência; revisão 1/3/7/14/30/60 por calendário local; sessão diária limitada; seis percursos com 18 etapas; oito projetos de conclusão com 57 marcos e 171 critérios manuais; vários arquivos, exportação ZIP e backup integrado; cache versionado da aplicação e módulos para estudo offline após preparação; adaptação de 220 a 4000 px.

O catálogo principal permanece com 132 aulas. As 18 etapas dos percursos são novas unidades separadas, não aulas de 17 capítulos. A correção de respostas conceituais não comprova compilação; projetos abertos têm rubrica manual. Os casos reservados ficam fora da tela durante a tentativa e são inspecionáveis no pacote local. Não declarar autocorreção universal.

A primeira versão completa da expansão foi aprovada no head 045072f7df785c0117b0cde5121c492bbde1098e, run [37638438456](https://github.com/renancodando/CodeLab/actions/runs/37638438456): 236 testes de unidade, 124 exemplos externos, ZIP interoperável, três cronogramas PostgreSQL, 74 testes de navegador, builds e 152 páginas. As oito larguras de 220 a 4000 px passaram. A revisão apontou assistência após resposta e troca de linguagem; as correções já foram publicadas em e82cdf8b86c45b54c7eaa542d3603f211688e295, com lógica, exemplos, três cenários Git e builds aprovados e navegador em andamento. Também foram acrescentados tratamento de falha ao instalar cache, falha real de armazenamento e verificação dos exemplos dos percursos. O último ajuste amplia a importação para 16 MB e preserva a jornada anterior se a restauração não conseguir gravar. A versão final ainda precisa concluir todos os gates antes de integrar. Verifique o head da PR, os resultados finais e qualquer revisão antes de integrar. A implantação pública e a sincronização local continuam limitadas pelos problemas já descritos.

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

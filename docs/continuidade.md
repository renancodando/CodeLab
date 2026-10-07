# Continuidade do CODELAB

## Estado em 7 de outubro de 2026

- PRs #1, #2, #3, #4 e #5 integradas. O catálogo tem 132 aulas em 20 trilhas; as oito trilhas por linguagem têm nove aulas cada.
- Há 48 módulos panorâmicos de 13 capítulos e 24 aulas próprias de 17 capítulos, além das 60 aulas originais. As aulas próprias oferecem 48 problemas independentes.
- Matriz com 606 entradas: 134 vinculadas a atividades específicas e 472 introduzidas. Entradas podem repetir conceitos em contextos diferentes; a contagem não representa esgotamento das especializações.

## Evidências da entrega curricular anterior

- Código validado no head `9cd2122d36b8a6c9d025c7f993812045536220e0`.
- Run [37566327714](https://github.com/renancodando/CodeLab/actions/runs/37566327714): 136 testes de unidade, 118 programas externos, três cronogramas PostgreSQL com conexões distintas, 59 testes de navegador, builds frontend/API e 138 páginas.
- Auditoria npm sem vulnerabilidades. A correção de source-map-js 1.2.2 permanece no lockfile.
- Revisão concluída para esse head sem novos achados; a thread P2 do stderr foi resolvida após a correção e a execução dos cenários.
- Integração em `1ba1ae70ed6953124c419f06c94078bf87481b02`; árvore `7ffa35ce37a96aeb762c3782c5fdf2e3a7777b1f`, igual à testada.
- Heap no ciclo medido: 12.860.480 para 15.156.564 bytes, crescimento 2.296.084; zero editores visíveis restantes e 114 geometrias. É evidência deste cenário.
- A PR #3 também teve CI aprovado após sua integração em main, no run 37565921506.

Os dados acima descrevem a entrega curricular da PR #4. A expansão de aprendizagem da PR #5 está registrada abaixo; confira o CI atual de main antes de ampliar código.

## Aprendizagem com prática e projetos integrada

A [PR #5](https://github.com/renancodando/CodeLab/pull/5) foi integrada em 53715e9b01993f0a5594030f1f7db04408bdf9b7. O head testado foi 35c2163b507c6f15c465aac940faac102c092b55; a árvore integrada 845ff30b1e94dc2381ef8c153ca962f9dbb16352 é idêntica à testada.

Disponível em main: 25 atividades distribuídas nas oito linguagens (quatro programas JS quebrados); pausas corrigíveis nos capítulos ligados a essas atividades; domínio por habilidade com evidência distinta e assistência; revisão 1/3/7/14/30/60 por calendário local; sessão diária limitada; seis percursos com 18 etapas; oito projetos de conclusão com 57 marcos e 171 critérios manuais; vários arquivos, exportação ZIP e backup integrado; cache versionado da aplicação e módulos para estudo offline após preparação; adaptação de 220 a 4000 px.

O catálogo principal permanece com 132 aulas. As 18 etapas dos percursos são novas unidades separadas, não aulas de 17 capítulos. A correção de respostas conceituais não comprova compilação; projetos abertos têm rubrica manual. Os casos reservados ficam fora da tela durante a tentativa e são inspecionáveis no pacote local. Não declarar autocorreção universal.

O [run 37641654276](https://github.com/renancodando/CodeLab/actions/runs/37641654276) aprovou 248 testes de unidade, 124 exemplos externos, três cenários Git, três cronogramas PostgreSQL em conexões distintas, ZIP interoperável, 79 testes de navegador, builds frontend/API e 152 páginas. npm audit informou zero vulnerabilidades. As oito larguras de 220 a 4000 px passaram nos fluxos testados.

As duas sugestões de revisão foram corrigidas, verificadas e resolvidas: revelar solução após tentativa atualiza imediatamente o agendamento; a linguagem fica fixa depois de iniciar o plano do dia. A suíte também conferiu falha na instalação de cache, quota indisponível com exportação dos arquivos em memória, backup válido acima de 2 MB e restauração que conserva a jornada anterior quando a gravação falha. O limite de importação agora é 16 MB.

Este checkpoint altera documentação. A workflow de main após a integração/checkpoint deve ser conferida na próxima retomada; uma nova falha real exige investigação. A implantação pública e a sincronização local continuam limitadas pelos problemas já descritos.

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


## Expansão Python em preparação

Branch: `curriculo-python-iteracao-recursos`, a partir do checkpoint integrado da PR #5. A definição acrescenta `py-iteracao-recursos`, 17 capítulos, dois problemas independentes e três pausas offline. O catálogo desta branch é 133 aulas/20 trilhas (Python 10, outras linguagens 9), 25 aulas próprias/50 problemas e 616 entradas (139 vinculadas, 477 introduzidas), com 28 atividades corrigíveis.

Os gabaritos incluem bordas de consumo, fonte infinita, limite zero, esgotamento, validação antes da fábrica e fechamento após erro. O verificador inclui quatro programas da aula e três fixtures das pausas. Há navegação dinâmica e estática nos testes e um fluxo novo de pausas offline com persistência e conclusão.

A expansão conserva os 40 ids de conceitos da PR #5 para não invalidar planos iniciados nem conceitos lidos. Não integrar esta branch antes do CI completo e da revisão. Os contadores desta seção descrevem o conteúdo definido; não declaram aprovação antecipada dos gates nem currículo exaustivo. Atualizar head e resultados após validação.


## Próxima expansão TypeScript em preparação

Branch `curriculo-typescript-variancia-contratos` parte do head da PR #6 de Python. Integrar primeiro a dependência aprovada. O novo módulo `ts-variancia-contratos` oferece 17 capítulos, quatro programas com saídas esperadas, duas práticas independentes e três pausas offline. Na branch: 134 aulas/20 trilhas, Python e TypeScript 10, demais linguagens 9; 26 aulas próprias/52 problemas; 626 entradas (144 vinculadas/482 introduzidas); 31 atividades corrigíveis.

Testar strict com casos negativos, execução real, diferença método/propriedade, callbacks vazios e erro propagado, restauração offline e páginas estáticas. Nenhum gate é declarado aprovado antes da leitura do CI. Não promover readonly, in/out ou todo o ecossistema TypeScript como especialização completa apenas por ter introdução no módulo.

A revisão TypeScript restringiu a substituição de ler/usar via readonly e acrescentou testes negativos dessa permissão. As novas atividades avançadas têm requiredConcepts no catálogo diário para conservar a primeira sessão nos fundamentos; o conceito pode precedê-las no mesmo plano, sem criar domínio pela leitura. Conferir os novos testes de catálogo e o início da sessão TypeScript no navegador antes de integrar o head final.

A correção de sequência diária também cobre as três atividades de iteradores Python publicadas na PR #6; seu desafio de fechamento não deve substituir o desafio de fundamentos na primeira sessão Python. O teste verifica preparação de conceito e plano novo nas duas linguagens.

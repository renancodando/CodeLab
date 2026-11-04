# PR #93: classificação e validação proporcionais

Head atual enviado `93d27766c836b7eb0a862bf0bf1e2327e5dc7be1`, branch `conteudo/projetos-web-pratica-20261103`. Três commits coerentes. L01 está publicado; L02 ainda aguarda gates próprios. Main segue `081f2079a868fccab013650bac06a3867c5032d4`.

O primeiro CI da PR, `41831579239`, aprovou conteúdo/build e três jornadas em 2 min 08 s, mas a revisão de `08f41b8` encontrou um P2 real: prefixos projetos.* ficavam fora da árvore e do planejamento. A mesma limitação existia em fullstack.* da #92. A correção usa a linguagem real da atividade no catálogo, árvore e planejador, mantendo IDs/evidências/backup e fallback de catálogos antigos. Não acrescenta opção ao seletor. A thread antiga foi resolvida após o push e uma transição rascunho/pronta pediu revisão do head novo, não aprovação por revisão anterior.

38 casos específicos dos projetos cobertos. Na correção de classificação, 58 de 59 testes de adaptação/catálogo passaram na rodada conjunta; o antigo teste de 512 habilidades atingiu 10 s. Repetido somente esse caso, passou em rodada de 4,22 s, sem ampliar limite. Quatro regressões novas (agora em catalogo-linguagens.test.ts) verificam os oito assuntos, seleção/preparação, IDs antigos com backup/revisão e fallback. Tipos aprovados. Jornada offline também confere projetos e full stack sob JavaScript na árvore.

O seletor por imports puxava 40 arquivos unitários, nove de navegador e seis famílias nativas só por helpers de preparação. Catálogo/planejamento/árvore agora usam seus contratos próprios e os essenciais. Os quatro testes foram movidos integralmente, sem exclusão de cenários. 23 testes do seletor passaram; fixtures nativas realmente alteradas continuam selecionadas. Plano do head: 11 arquivos unitários, três de navegador e seis smokes críticos compartilhados. API compilada para smokes; sem PostgreSQL, seis famílias intactas ou segunda matriz. Isso compara seleção, não mede redução de tempo de duas rodadas equivalentes.

Conferir CI/revisão/threads do head 93d2776, resolver falhas, comparar árvore e só integrar se verificado. Depois build/dois smokes, deployment READY/SHA/projeto/alias e três contratos públicos distintos, com recibo. Não repetir a bateria local ou os runtimes antigos por rotina.

Branch: 137 aulas, 273 atividades, 120 com pausas e 17 sem. Publicado ainda 264/117/20. Não concluir a edição por essas contagens. Depois de publicar L02, faltam aproximadamente dez lotes do plano da #91; L03 são as duas aulas existentes projeto-api e projeto-entrega. Não reiniciar doze a cada retomada.

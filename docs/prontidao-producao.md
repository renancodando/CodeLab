# Prontidão de produção

## Correção Vite publicada; verificações locais em reforço

A PR #65 está integrada em bcdf68a, com CI integral e revisão do head corretos. Deployment READY, SHA/alias e 24 cenários públicos conferidos; o CI pós-merge 39674011779 permanece um resultado próprio. Os três timeouts unitários locais anteriores não são convertidos em aprovação. A entrega seguinte fortalece a prova de memória, conserva o vetor no navegador e reduz o custo dos dados de teste de backup e métricas, com os mesmos limites e todas as afirmações anteriores. Resultados e condições de integração estão em continuidade.md; não há alteração do catálogo nem alegação de conclusão da edição.

## HTTP integrado; correção de dependência em validação

A PR #64 está no main 4b1c41b com revisão do head, árvore e pais conferidos, CI de entrada integral e 22 fluxos públicos aprovados; deployment READY e SHA/alias foram reconfirmados depois. O CI pós-merge encontrou Vite 7.3.6 na faixa de um aviso de segurança e não é considerado aprovado. A atualização para 7.3.7 segue em entrega própria, com auditoria, testes, build, revisão, CI e produção como gates preservados. Detalhes e evidências estão em continuidade.md e na branch de preservação; não encerrar essa correção nem a edição pela aprovação anterior.

## Armazenamento publicado antes do recorte HTTP

A PR #63 foi integrada em c62d24c0a24eab1084af842e3a6db5e55e983686, com árvore/pais iguais aos conferidos no head 8228cc4. CI 39487372972 completo: 1.183 unitários, 194 exemplos externos e 238 fluxos de navegador; revisão do mesmo SHA sem pendências. Deployment dpl_HykARHJMA8XQkTRu4uzj8UxuZfjf READY/production no projeto e SHA esperados, alias conferido antes e depois e quinze cenários públicos aprovados em 2,6 min. O cenário de quota foi realmente executado; a falha injetada da aula é identificada separadamente. A intermitência de inicialização do executor anterior não é considerada resolvida por uma execução aprovada.

A branch de HTTP/métodos parte dessa publicação e conserva recursos maduros. Seus gates, e o acompanhamento do CI pós-merge 39491006879 da base, estão em continuidade.md e nos checkpoints da branch de preservação. A edição curricular permanece em andamento; contagens atuais são geradas e as seções posteriores preservam o histórico.

## Base conferida para a entrega de armazenamento

Antes de modificar esta aula, main/PRs/CI/alias foram conferidos novamente em 20 de outubro. A PR #62 estava integrada em 681890cd027ab35041a7186c33ce0c5b14b54410, sem PR aberta; CI pós-merge 39426437901 aprovado nos seis jobs. O deployment dpl_FyXHeiUo4AfKCRgUp4RxbWLaqP7b estava READY/production no projeto e SHA esperados. O lote público anterior tinha 12/13 e uma repetição isolada aprovada: a inicialização intermitente do executor continua uma limitação conhecida, sem causa demonstrada. Não chamar esse lote de integralmente aprovado nem atribuir a causa ao computador sem evidência.

A prática de armazenamento acrescenta referências nativas e execução isolada sem mudar persistência, sandbox, runtimes ou contas. Sua validação própria, incluindo a correção de overflow encontrada no teste de 220 px, está registrada em continuidade.md e nos checks/checkpoint da entrega. Não herda aprovação do build ou do SHA anterior. As contagens seguem as métricas geradas; as seções seguintes preservam o histórico de suas etapas.

## Estado corrente e critério de conclusão

As contagens atuais vêm das [métricas geradas](metricas-catalogo.md); as lacunas pedagógicas estão na [fila de aulas](aulas-sem-pratica.md). O [checkpoint de continuidade](continuidade.md) registra o head, a árvore, CI, revisões, deployment, SHA, alias e fluxos públicos conferidos de cada entrega. Build ou CI aprovado sozinho não confirma produção. A auditoria final desta edição ocorre depois da cobertura ativa, projetos/percursos utilizáveis e validações de dados locais, offline, acessibilidade, responsividade e ausência de regressões graves. Os registros abaixo são históricos de suas etapas, não a fotografia atual da publicação.

## Coleções C# publicadas em 12 de outubro

A PR #44 foi integrada em ce8e91de8fa45a8609c64c64f3f0ec227beca36b, árvore 85897ca26f026c82e9ff31df3feb79eb8d264c1b idêntica ao head 6952e24ccd1478848e9200b171ce99b345c52382. CI 38299162632: 798 testes unitários em 53 arquivos, 155 testes de navegador (70/39/46), 194 exemplos externos e dez cenários LINQ .NET adicionais aprovados, além de compiladores, PostgreSQL, API/cache e auditoria. A revisão de entrada não nula foi resolvida; o corretor aceita o tipo explícito compatível sem executar C# do aluno.

Deployment dpl_76EkVrSkEV3TTxqhr812ESJyaNvp READY/production, gitSource.sha e alias conferidos. Dois fluxos públicos Edge passaram em 1,4 min: C# LINQ e funções, com forma genérica explícita, offline e persistência. O build local do mesmo conteúdo passou: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 211,01 kB gzip e mundo 135,94 kB gzip. O fluxo C# final local passou em 51,4 s; main local foi avançada por fast-forward, sem alterações pendentes naquele checkpoint. Contagens correntes vêm de metricas-catalogo.md; os parágrafos seguintes preservam as validações e contagens de suas etapas.

O CI pós-merge atual 38302219911 passou integralmente. O anterior 38299927723 falhou no teste HTML: o trace registrou corpo vazio e o diagnóstico ocultou o erro original ao esgotar o prazo. A falha anterior permanece registrada; a aprovação do pós-merge atual não apaga a reprodução intermitente. A reprodução no domínio motivou a correção da substituição da prévia descrita em continuidade.md; o isolamento permanece obrigatório.

## C#: igualdade, agrupamento e cópia em preparação

O CI 38289894018 registrou 153 testes de navegador aprovados, mas foi cancelado pelo prazo global de 35 min em uma parcela. Não é aprovação do CI. A correção isolada divide a mesma suíte em três parcelas, preserva limites e foi incorporada nesta branch a partir de #43. A descoberta local conferiu 155 testes em 70/39/46, sem omissões ou duplicações. A revisão seguinte corrigiu condições Python equivalentes recusadas pelo corretor. Os heads/runs atuais são #42 d396b07 / 38296263616 e #43 78450b4 / 38296297327; os anteriores foram substituídos e não autorizam integração. Esta branch incorpora #43 sem alterar a árvore já compilada. Exigir os gates completos dos heads atuais antes de integrar.

cs-colecoes-linq conserva as seis seções, exemplo de consulta/snapshot, exercício Agrupar e projeto de relatório. Recebe três pausas após os blocos 1/3/4: prever a política de HashSet, diagnosticar chaves repetidas sem perder palavras e separar a cópia dos arrays internos. A teoria prepara comparação, ordem dentro de cada grupo local, listas independentes e o limite da materialização superficial. Não extrapola LINQ local para provedores remotos ou clonagem arbitrária.

Passaram 44 testes específicos e 12 programas compilados/executados com SDK .NET 10.0.401: dez cenários novos e o exemplo/solução preservados. Os casos diferenciam as políticas de igualdade, ArgumentException por chave repetida, GroupBy com ordem/repetição/vazio, deduplicação que perde palavras, lista compartilhada, cópia superficial e interna, linhas irregulares/aliased e chamadas independentes. O verificador de conteúdo recebe os dez cenários, sem pacotes externos; o exemplo também ganha saída esperada explícita. O corretor também aceita ToArray<int>() e ToArray<System.Int32>(), sem aceitar tipos incompatíveis; o CI confere persistência da forma explícita. Isso não mede performance e não executa C# do aluno: as pausas são conceituais, offline, com leitura sem domínio e solução como assistência.

Branch: 103 pausas em 61/137 aulas, 76 sem pausas. Strict/build passaram: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 210,97 kB gzip e mundo 135,94 kB gzip. Após a correção de pertencimento Python, três fluxos Edge locais passaram em 2,0 min: LINQ, funções e engenharia Python, com erro/acerto, assistência, persistência, offline e 220–4000 px. O lote de regressão aprovou 65 testes específicos, e 19 programas Python reais conferiram as expressões equivalentes e os gabaritos anteriores. CI e publicação próprios permanecem pendentes. Depende da etapa de funções #43; publicação confirmada permanece 94/58/79 após #41 enquanto #42 termina seus gates.

Referências oficiais: [HashSet](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.hashset-1.-ctor?view=net-10.0), [GroupBy](https://learn.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby?view=net-10.0) e [ToArray](https://learn.microsoft.com/en-us/dotnet/api/system.linq.enumerable.toarray?view=net-10.0). Não encerra coleções, generics, LINQ ou C#.


## Concorrência Python publicada em 12 de outubro

A PR #41 foi integrada em 030b48e54488d8e1db0342ccb8e73b746754ad74, árvore be1d14327dd06b3a18126def7ef4ca23d2ef01fc igual ao head 8501af3431f5736aa9d101b7620b4b8ff0681bb2. CI 38262798743: 719 testes unitários em 49 arquivos, 152 fluxos de navegador (76/76), 177 exemplos externos, compiladores, PostgreSQL, API/cache e auditoria aprovados; sem revisões abertas. Deployment dpl_D57T4vf9jR1NiP9AgZYS4QFyTdD6 READY/production com gitSource.sha e alias conferidos. Dois fluxos públicos Edge passaram em 2,7 min: concorrência e números Python, com offline e progresso. Cobertura publicada: 94 pausas em 58/137 aulas, 79 ainda sem pausas deste catálogo. As seções anteriores no tempo conservam seus checkpoints.

## Funções: parâmetros, composição e retorno em preparação

A aula original funcoes mantém os 12 capítulos, exemplo de desconto, exercício de conversão e projeto de biblioteca. Três pausas após os blocos 3/5/7 trabalham o parâmetro numérico separado do nome externo, a correção executada de uma função que mostra sem devolver e a quebra de linha logo após return. A teoria prepara zero, frações, composição, independência e retorno sem expressão. Não tenta ensinar mutação de objetos como se todo argumento fosse um número.

O verificador QuickJS confere quatro famílias: números retornados no caso comum; zero, frações e limite do contrato; novas entradas; composição e chamadas independentes. O contrato é um número finito de 0 a 1440; não exige validação fora dessa faixa nem confunde console com retorno. As pausas de previsão e escolha são conceituais. Ler não gera domínio; solução é assistência; a execução permanece no isolamento existente.

Passaram 36 testes específicos, incluindo regressões de decisões e engenharia Python. Eles rejeitam console sem retorno, truncamento de frações, substituição de zero, texto, respostas fixas e acúmulo entre chamadas; aceitam forma equivalente com parâmetro opcional. Reproduzem a quebra após return e a alternativa com parêntese aberto na mesma linha. Strict e build passaram: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 209,10 kB gzip e mundo 135,94 kB gzip. Dois fluxos Edge locais passaram em 1,2 min: funções e engenharia Python, com erro/acerto, assistência, persistência, offline e larguras de 220 e 4000 px. CI e publicação próprios permanecem pendentes. Branch: 100 pausas em 60/137 aulas, 77 sem pausas; produção conferida 94/58/79. Esta etapa depende de #42, cujo head e8196c8 corrigiu a nota Python colocada na seção TypeScript e aguarda o CI completo novamente.

Referências: [return](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/return) e [funções](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Functions). Não conclui funções, JavaScript ou as frentes curriculares.


## Números Python publicados em 12 de outubro

A PR #40 está publicada após CI 38259821060: 706 testes unitários, 151 fluxos (75/76), 169 exemplos externos, compiladores, PostgreSQL, API/cache e auditoria. Sem revisões abertas. Merge be777ce404aaa9257eed502d4fa1e0da491f5f66, árvore 94ab7f69ccf88425ca94d0658ae9f6a9ac2d34a5 igual ao head fe30a994bd99bd7cbeda4f06d65ecaeb1e781981. Deployment dpl_5fxMM1Q7tCi8cSn7gRCUUXWPeRp2 READY/production com gitSource.sha e alias confirmados. Dois fluxos públicos Edge passaram em 1,6 min: números Python e sessão diária. Cobertura publicada: 91 pausas em 57/137 aulas; 80 ainda sem pausas deste catálogo. As seções seguintes preservam checkpoints e contagens da época.


## Publicação conferida em 12 de outubro

Valores (#37) e decisões (#38) foram integrados com árvores iguais aos heads aprovados. Valores: CI 38174480235, 671 testes unitários e 148 fluxos de navegador; merge deb99ffae40fcc74c47a2886765735fd1527c927; árvore a787c859ca40cf5320e12d62b286db4594d79ff1; deployment dpl_FxFRYoSCcEFJJwNsta8eJovr5vof READY/production com esse SHA, dois fluxos públicos aprovados em 1 min. Decisões: CI 38175247548, 684 unidades e 149 fluxos; merge 8ae9ebe535e045e0e39c975e861decad540cb70b; árvore ede2d2533d25d8b2149f80cc794f70e3c329509e; deployment dpl_2XYB6FRC693e4ThYsgC4D7XfXVdX READY/production com esse SHA, dois fluxos públicos aprovados em 2,5 min. Revisões resolvidas, incluindo a navegação da preparação para a leitura de valores sem substituir o percurso de 25 passos.

Cobertura publicada: 88 pausas em 56 das 137 aulas principais; 81 ainda sem pausas deste catálogo. Missões, experiências Git/HTTP e os 25 passos próprios de valores ficam fora dessa contagem. A PR #39 também foi publicada: CI 38255384773 aprovado no head 430d0cd27b07057ca85c522f118cd919e1806b08 com 690 unidades e 150 fluxos; merge 20dd5898765cb5b7a34230fd300e43d130fb915a, árvore 16ce668b8c22f5ddda69370d854b475cd9f65f1a igual. Deployment dpl_8D5VkrUT9FwGehVs1WSFhVrjb26G READY/production com SHA confirmado; dois fluxos públicos aprovados em 1,8 min. Ordena novos conceitos pela progressão sem trocar planos iniciados, IDs, pré-requisitos ou atribuir domínio à leitura.

O CI de main 38170698880 terminou com os quatro jobs aprovados após repetir uma falha anterior ao checkout, causada pelo limite de dados da imagem pública PostgreSQL. Não houve alteração de código para contornar o problema. Esses resultados não encerram o currículo nem medem FPS em celular físico.


## Entrega atual: laços e preparação diária

A PR #36 foi integrada após o CI 38168212787: 658 testes unitários, 146 fluxos de navegador, compiladores, PostgreSQL, API/cache e auditoria. Merge bf1bcca07664e58d66b25727509e103f3ac67038, árvore a31f9b62ea617c2f087b0a61d1cce18bc813546a igual ao head aprovado, sem revisões abertas. Deployment dpl_8zhswjMu8TpFhyJvHbnD8PwLxfhr READY/production com esse SHA; quatro fluxos públicos Edge aprovados em 3,9 min. Publicação conferida: 82 pausas em 54/137 aulas, 83 ainda sem pausas. Valores e decisões em preparação não entram nessa contagem publicada.

As seções seguintes registram a evidência das integrações anteriores e suas contagens da época.

## Entregas atuais: TypeScript e importação JavaScript

As PRs #34/#35 foram integradas com árvores iguais aos heads aprovados. TypeScript: run 38163020418, 632 unidades e 142 fluxos; merge 147658af86c04c94a1a894e8aa04bc024d237835, deployment dpl_3c5ETa3xqZdb54aXPe7phvhz4PfG READY/production com esse SHA e seis fluxos públicos aprovados em 4,6 min. Importação JavaScript: run 38163600601, 644 unidades e 144 fluxos; merge e0e15e5d18e405cf8f5ab1f6376d36720022a548, deployment dpl_9S2Jqs52jZS4wCNuCZuemiYqfHwE READY/production com esse SHA e dois fluxos públicos aprovados em 1,3 min. Revisões resolvidas. Incluem compiladores, PostgreSQL, API/cache e auditoria; não encerram currículo, módulos TypeScript ou medição em celular físico.

A edição publicada tem 79 atividades corrigíveis em 53 das 137 aulas principais; 84 aulas ainda não possuem pausas. Os números novos da branch de fundamentos só serão publicação após seus próprios gates.

A migração de fundamentos está em preparação e ainda exige testes e integração. As seções seguintes registram checkpoints históricos, com seus números e pendências da época.

## Entregas verificadas em 11 de outubro

As PRs #31, #32 e #33 estão integradas, com revisões resolvidas e árvores iguais aos respectivos heads aprovados. A #31 passou no run 38143642894 (560 unidades, 130 fluxos), a #32 no 38148827540 (586 unidades, 134 fluxos) e a #33 no 38148866512 (601 unidades, 136 fluxos), além de compiladores, PostgreSQL, API, cache meteorológico e auditoria.

A hospedagem confirmou READY/production e gitSource.sha para cada integração: 06defa49b36a8debcd5aecac4092ce91aa154bf3 em dpl_2vmHCMy5dVm7Lo9nErkcVi9BAtdL; 941c388aba6a4c3db9b583ff33a7725abbd8f7e4 em dpl_AvwMwTo3fYqH4Do8mejG5u2b81ri; 0e54bff8b268a474105bbc2010ae1e29534839ac em dpl_3ZMbTaoRW6hD41akeDAgmSdj3uEM. Os quatro fluxos públicos C++/HTTP passaram (2,1 min). SQL aprovou três dos quatro no primeiro lote; o cenário restante de consultas/backup/offline passou isoladamente (56,1 s), após uma falha de espera de abertura do editor. Não foi um único lote 4/4. Os dois fluxos HTML passaram no domínio (1,0 min), incluindo validade nativa, assistência, offline e larguras extremas.

A edição publicada tem 76 atividades corrigíveis em 52 das 137 aulas principais; 85 aulas ainda não têm pausas. Esta contagem não inclui os experimentos Git/HTTP, nem transforma projetos de revisão manual em atividades corrigidas automaticamente. As linguagens e as frentes curriculares continuam abertas.

## Próxima entrega: laboratório TypeScript

O compilador real está implementado na branch laboratorio/typescript-local, com diagnósticos, JavaScript emitido, execução QuickJS, projetos e cache opcional. Exigir validação do head final, revisão, integração e domínio antes de declarar esta entrega publicada. Detalhes e limites em laboratorio-typescript.md. As seções abaixo são registros históricos.

## Checkpoint de 11 de outubro: posse C++ integrada; SQLite e formulários em validação

A PR #30 foi integrada em 3b04fe4b8f2a056517983e9261bf86f1139af003 após o run 38085602449 aprovar os quatro jobs: 543 unidades e 129 fluxos de navegador (68 + 61), compiladores, PostgreSQL, API, cache meteorológico e auditoria. A árvore 50c796e94b5d25da07122a8ccdc83885df2b1397 é a do head testado. O deployment dpl_DNWbAZ9exSqN8mRcWaSp2h8SE2wf foi confirmado READY/production com esse SHA e os três fluxos HTTP passaram no domínio público.

A revisão posterior da PR #31 encontrou a disputa entre chegada e conclusão HTTP. As correções 014e745/2657a51 separam esses instantes e preservam recusas 429/503 independentes; 29 testes específicos passaram. O head final 2657a51 exige o run 38143642894 completo. O run intermediário 38142793678 aprovou validação comum e auditoria, mas não valida o último caso de borda. O run anterior 38086825160 aprovou os quatro jobs do head 5259ae6, incluindo 554 unidades e oito novos cenários C++20, mas não valida a correção posterior. A PR #31 foi integrada em 06defa49b36a8debcd5aecac4092ce91aa154bf3 após o run final aprovar 560 unidades e 130 fluxos de navegador (65 + 65), compiladores, PostgreSQL, API/cache e auditoria. Revisões resolvidas e árvore 2b93cfa077da522b59c61b327f6d794df83c6cc2 igual ao head aprovado. A conferência do deployment/SHA e dos fluxos públicos dessa integração está em andamento.

SQLite está sendo acrescentado ao laboratório em uma branch própria, sem alterar o currículo PostgreSQL. Os 21 testes com o mecanismo real passaram; strict/build passaram. O runtime, worker e WASM são três recursos opcionais carregados somente ao executar, fora do precache inicial. Os três fluxos Edge passaram contra o build concluído e o cancelamento de um Worker já criado passou na repetição ampliada. Offline, importação/exportação, tipos, limites e 220/4000 px foram conferidos. Os cinco testes do cache gerado passaram e a auditoria informou zero vulnerabilidades. A primeira tentativa usou o build anterior enquanto a nova compilação ainda ocorria; não conta como aprovação. A PR #32 recebeu a correção do prazo: importação, Worker e WASM compartilham 20 segundos. O teste reproduziu a falha no build anterior e passou com a correção, incluindo cancelamento e resposta tardia. Seis fluxos SQL/HTML passaram contra o build corrigido; a prova ampliada do CacheStorage real também passou. O head b3106c1 exige novo CI completo; 586 unidades e o job comum do head anterior não o substituem. A suíte local completa teve 578/586 e oito timeouts, sem ampliar limites.

A preparação HTML tem três pausas novas em dados de formulário, com gabaritos nativos e os dois fluxos Edge aprovados. As métricas geradas são 76 atividades, ainda em 52 aulas; 85 permanecem sem pausas. Exigir CI, revisão, integração e domínio próprios. O pedido integral e as 17 frentes permanecem abertos. As seções seguintes são registros históricos.


## Gates pendentes: integração, descritores e parcelas do navegador

CSS (#26) e rascunhos (#27) passaram nos CIs 38018467196/38019095799, com 120/122 testes de navegador e 484 unitários. C# (#25) atingiu o limite de duração após 114 testes aprovados; foi reenviado no mesmo head e continua exigindo conclusão completa. Nenhuma dessas evidências substitui a conferência das árvores, revisões e domínio após integração.

A preparação seguinte acrescenta descritores Python, com 498 unitários e nove cenários Python reais locais aprovados. Strict/build passaram. O teste de navegador detectou duas causas de overflow a 220 px; a correção manteve o conteúdo e passou no fluxo completo Edge com assistência, recarga offline e 220/4000 px (40,4 s). As métricas 70/52 são da branch, não uma declaração de publicação. Nenhum executor ou dependência foi acrescentado.

O novo workflow conserva validação, compiladores, PostgreSQL, API, cache meteorológico e auditoria, distribuindo apenas o navegador em duas parcelas que usam o mesmo build. A listagem local comprova união completa e sem duplicações dos 123 testes; não comprova execução no GitHub. Exigir sucesso da validação comum e de ambas as parcelas, com relatórios próprios, antes de integrar esse head.

## Gate seguinte: caixas CSS

A branch CSS depende do head C# da PR #25 e exige integração nessa ordem após os gates próprios. Tem 484 unitários e strict/build aprovados; os 29 testes específicos foram conferidos após o ajuste do rótulo. O primeiro teste nativo detectou uma hipótese incorreta sobre min-content do próprio rótulo, mantendo a exigência em vez de reduzir a asserção. A referência precisa passar novamente e o CI completo do head final continua obrigatório. Nenhuma mudança foi feita na aparência do produto, no sandbox, em permissões de rede, nos runtimes ou nas dependências.

## SQL e HTML publicados; próximo gate de iteradores C#

As PRs #23/#24 passaram nos respectivos CIs finais 37996313180 e 37996662758, com 442/453 unitários e 115/117 testes de navegador. Os exemplos incluíram PostgreSQL real e as árvores dos merges coincidiram com os heads validados. A implantação da main 04217e927284326444946cda02e5600e876f37cd está READY/production; os dois fluxos SQL e os dois HTML passaram no domínio. Essas pendências de integração/publicação estão encerradas para os comportamentos testados.

A preparação de iteradores C# tem dez cenários locais .NET aprovados e 31 testes específicos de prática/catálogo, com strict. Ainda exige suíte completa, build, navegador, CI e publicação. Não acrescenta runtime ao cliente, rede ao aluno, pacotes ou permissões de execução. As evidências das PRs anteriores não validam automaticamente esse próximo head.

## Gates seguintes: SQL e imagens HTML

A PR #23 ganhou um commit operacional separado após duas falhas de download do Docker Hub antes do checkout. PostgreSQL 18 passa a ser obtido no repositório público oficial Docker da AWS, com manifest Linux/amd64 disponível; o próximo CI precisa executar todos os gates. A branch HTML depende desse head e tem evidências locais de 452 testes unitários, strict/build e dois fluxos Edge, incluindo referências nativas e arquivos realmente recuperados offline. Isso não autoriza tratar SQL/HTML como integrados ou publicados antes dos gates dos heads e da verificação posterior no domínio. Os checkpoints abaixo descrevem a main já integrada.

## Gate adicional: revisão da preparação diária

A PR #23 recebeu uma correção após a revisão detectar liberação de exercícios pela leitura apenas da introdução. A preparação agora tem identidade própria e cobre os capítulos necessários; planos antigos exigem a leitura ausente sem perder itens/respostas. O novo head precisa repetir CI completo e fluxo público. Leituras antigas não passam a contar como preparação nova nem geram domínio. As evidências dos heads anteriores não validam essa alteração de fluxo.


## Checkpoint atual: main aprovada e closures verificadas publicamente

As PRs #21/#22 foram integradas com árvores idênticas aos respectivos heads aprovados. A main `093584f82b7000c859b4b0898f1c2568c98b0ede` passou no CI 37965665399; o head #22 passou no run 37961175745 com 427 testes unitários, 152 exemplos externos, oito projetos TypeScript, sete cenários C++20 e 113 testes de navegador. O fluxo C++ passou em produção. A implantação posterior de closures `5CnXqjxpKeVFYHugrZKBeo3wpQNz` está READY/production. Sua verificação pública foi inicialmente impedida pela quota da aprovação automática; após a disponibilidade voltar, passou no domínio público com correções executadas, assistência, respostas/evidências offline e 220/4000 px. Essa pendência está resolvida.

Robots, sitemap e canonical foram conferidos publicamente após configurar a origem de produção; não há evidência de indexação por buscadores. A próxima expansão SQL está em branch própria e exige PostgreSQL real, CI do head e verificação pública antes de ser declarada entregue. O escopo integral permanece aberto. As seções seguintes são registros históricos.

## Vidros e módulos TypeScript integrados e publicados

A main `4790188f8ab6c7ddab7167a33984043dc86f216a` integra #19/#20 com árvores idênticas aos heads aprovados, sem revisões pendentes. O CI #20 (37953975921) aprovou 401 testes unitários, 152 exemplos externos, oito projetos TypeScript e 111 testes de navegador. O CI #19 aprovou 392 testes unitários, 152 exemplos externos e 110 testes de navegador.

A implantação `B4N9m1yekqkEJyQAbfBNF6PnX4UD` foi confirmada READY/production. No domínio público, a aula TypeScript conferiu erro/acerto, solução sob solicitação, assistência, reload offline, domínio e larguras 220/4000 px. A inspeção dos vidros conferiu estado vindo do motor, camada CSS sem filtros/interceptação, arte original, um canvas, 42 massas e movimento reduzido em 220/375/4000 px. Condensação real era zero; o efeito ativo foi testado em cenários sintéticos no CI, não apresentado como observação meteorológica. Não comprova FPS físico, fontes adicionais ou cobertura curricular integral.

As novas pausas C++ exigem seu próprio head/CI. Os registros abaixo são evidências históricas e não anulam as integrações posteriores.

## Estado atual e próximo gate

A PR #18 está integrada na main `48971a4035d5131e1fa795fb36c150806de95f8c`, com árvore idêntica ao head aprovado no CI 37938119575: 389 testes unitários, 152 exemplos externos e 108 testes de navegador. O CI de push 37942664815 também aprovou a main. A implantação `GLwR5eRuoBeM1gF4mtUFY6D8y58v` foi confirmada em produção e o fluxo CSV passou no endereço público, incluindo retomada offline sem executor remoto. O catálogo e os limites pedagógicos permanecem descritos nas métricas geradas.

O embaçamento do interior está em validação separada. Usa a condensação gradual já simulada e a transparência da arte preservada, sem afirmar medição da superfície ou do ar interno. Quatro testes locais de navegador passaram, incluindo 13 cenários atmosféricos em duas larguras, redimensionamento nativo e composição dos vidros. Strict/build passaram. A primeira suíte local teve um timeout no teste de limite de memória do executor, com os outros 391 aprovados; o teste passou isolado e os 392 passaram na execução completa seguinte com um worker, sem ampliar limites. Exigir o CI do novo head, revisões e verificação publicada antes de integrar. Os registros seguintes descrevem evidências históricas, inclusive pendências que entregas posteriores resolveram.

## Integrações verificadas em 9 de outubro

O head climático `b15fc8adc5bd285476a30495b1cc23b486fee125` aprovou o [CI completo 37930523384](https://github.com/renancodando/CodeLab/actions/runs/37930523384): 382 testes unitários, 147 exemplos externos e 107 testes de navegador. O merge `f4f28227869f90a1c7853e66dad628ea976c5390` preserva a árvore testada `d0d39886dfc246b9c443f1edf7abe0f82dd0134d`. Revisão resolvida; main local sincronizada.

O deployment `6zHHpnBuzYc8ec9hcPnWS2Z95sJB` está READY/production com alias `code-lab-omega.vercel.app`. A verificação pública mediu cada escrita nativa do canvas durante seis redimensionamentos/orientações: pico de 1.198.483 pixels para orçamento de 1.200.000 no nível baixo, 42 massas persistentes e movimento reduzido, sem erros WebGL. O fluxo de observação real/cache/entrada inválida passou e conservou condição estimada para a estação regional. Não comprova FPS físico, radar/pluviômetros ativos ou conhecimento da chuva no ponto.

As PRs anteriores entraram por sucessores aprovados: #13 inclui #12 e #16 inclui #15. As árvores de cada merge foram conferidas. Depois da publicação dos rascunhos, passaram nove fluxos do domínio e quatro testes isolados de exemplos CSS em Edge; o escopo inclui retomada offline CSS/C#, os 25 passos, HTML/JS vazios, rascunhos de todas as linguagens existentes e projeto de anotações com exportação/importação. Os testes novos de CSV ainda exigem seu próprio head/CI antes de integrar. O pedido curricular integral e os laboratórios TypeScript/SQL permanecem abertos.

## Checkpoints reais do fluxo prático

O teste agregado dos 25 passos excedeu seu limite em quatro heads, em momentos diferentes próximos da conclusão/reinício. O mesmo arquivo passou no CI dos heads de #14 e #16. A nova organização mantém todas as ações e expectativas em três etapas seriais: produz o checkpoint dos doze primeiros passos, retoma esse dado em outro contexto e conclui os treze restantes, depois verifica invalidação, assistência, revisão e reinício. Não preenche respostas corretas por estado fabricado e não desativa o mundo. Uma falha interrompe as etapas dependentes.

Essas três etapas e o cenário de leitura passaram em Edge contra o domínio público da integração climática. É evidência do fluxo e da nova estrutura de teste; não comprova que a correção posterior do canvas esteja implantada. Os limites individuais não foram ampliados, e o CI completo do novo head continua obrigatório antes de integrar.

## Rascunhos e anotações do laboratório em validação

A revisão do laboratório encontrou dois caminhos de perda de trabalho: os rascunhos persistidos de Python/C#/C++/SQL/anotações não eram carregados na nova montagem, e projetos de anotações eram descartados na normalização e rejeitados pelo próprio backup. Rascunhos HTML/JavaScript vazios também eram substituídos pelos exemplos padrão. A correção lê todas as chaves existentes, distingue vazio de ausência e conserva anotações nas mesmas listas de linguagens aceitas pela leitura e importação.

Dois testes reproduziram a falha de anotações antes da correção. Depois passaram 372 testes unitários, strict/build e três fluxos Edge: restauração dos rascunhos, edição Python após sair/recarregar sem executar, e projeto de anotações com reload/exportação/importação. Os limites de tamanho, quantidade e linguagens desconhecidas continuam aplicados. A correção ainda precisa do CI completo e de verificação depois da implantação; os treze fluxos públicos abaixo não a aprovam antecipadamente.

## Recuperação diante de quota real

Um contexto Edge novo conferiu o domínio público depois da integração climática. O cenário preencheu localStorage até a API nativa lançar QuotaExceededError, sem substituir Storage.setItem. Ao editar depois disso, o aplicativo informou a falha, preservou o checkpoint armazenado e exportou o trabalho ainda em memória em ZIP e backup JSON. Depois de remover somente as chaves de preenchimento do teste, voltou a salvar e retomou o arquivo completo após reload. Não foram usados dados do navegador pessoal do usuário.

O mesmo fluxo passou localmente no build de produção e está em `tests/e2e/armazenamento-real.spec.ts` para o CI da entrega sucessora. Os testes de exceção simulada continuam cobrindo outros caminhos. Essa evidência comprova o cenário de quota descrito; não promete recuperação após fechar a página sem exportar enquanto a gravação continua impossível.

## Fluxos publicados conferidos nesta retomada

Treze fluxos passaram em Edge no domínio público após a integração climática, com contextos novos de 375 px: depuração JavaScript executada e casos de borda, domínio sem crédito pela leitura, sessão diária, revisão encurtada por erro/assistência, Python/C#/C++ conceituais offline sem submissão remota, projetos com vários arquivos e invalidação de evidência, seis percursos, falha de instalação do cache, exportação sob falha de gravação, backup válido acima de 2 MB e restauração que preserva a jornada anterior. Inclui quota nativa preenchida até QuotaExceededError, exportação em memória e recuperação após liberar espaço. Configuração e relatório estão nos outputs do workspace.

Esses fluxos testam o artefato publicado da integração 7893a3200bc8eb2a7aa85e304eb7e64fcf168f54. Não comprovam execução Judge0 configurada, todos os exercícios futuros ou desempenho em celular físico. As novas práticas CSS/C# ainda exigem seus próprios gates e verificação depois da implantação.

## Motor atmosférico integrado

A PR #11 foi integrada com a mesma árvore do head aprovado no [run 37870369915](https://github.com/renancodando/CodeLab/actions/runs/37870369915): 356 testes unitários, 94 fluxos de navegador, exemplos, SQL/Git/ZIP, builds/API e auditoria. O domínio público foi conferido depois da implantação, incluindo boletim NOAA real, cache, idade, rejeição 400/405, seleção de cidade e cena sem erros WebGL. Consulte [meteorologia.md](meteorologia.md) para escopo e limitações.

Não há radar/pluviômetro regional ativo nem medição em celular físico. O embaçamento usa os vidros 3D existentes; o interior em imagem ainda não tem máscara independente. O pedido integral de conteúdo e produção permanece aberto. Na PR seguinte, métricas passaram nos gates anteriores ao navegador, mas o orçamento total de 30 minutos cancelou o run; a alteração para 40 minutos exige uma execução completa nova e não amplia limites individuais.

## Como avaliar uma entrega

O escopo de uma versão precisa estar explícito. Uma entrega editorial pode estar validada para integração sem que todas as especializações solicitadas estejam concluídas. Não use uma quantidade de aulas, uma página de títulos ou o sucesso do build como prova de cobertura exaustiva.

## Gates do repositório

| Área | Evidência exigida | Gate |
| --- | --- | --- |
| Conteúdo | Texto próprio, exemplos completos, erro, exercício, solução e projeto | Testes de profundidade e revisão editorial |
| Prática independente | Atividade identificada, solução explicada, critérios e execução do mecanismo | Matriz ligada à definição, saídas reais e navegador |
| TypeScript | Verificação semântica strict; expectativas negativas úteis; comportamento após apagamento | Testes de tipos e execução Node.js |
| Python, C++, C# | Compilação/execução de exemplos e soluções em recursos temporários | verify-content-examples |
| PostgreSQL | Dados de estudo, respostas por passo, conflitos e resultado confirmado | Serviço descartável e conexões psql distintas no CI |
| Navegação e leitura | Carregamento, falha e repetição, saída durante download, busca e páginas sem scripts | Playwright em build de produção |
| Progresso | Persistência local, importação validada e compatibilidade com versão anterior | Unidade e E2E existentes |
| Editor e mundo | Descarte de modelos, cancelamento, heap, workers e geometria estável | Ciclos medidos no navegador |
| Dependências | Lockfile instalável e ausência de alertas altos ou críticos | npm ci e npm audit obrigatório |
| Integração | Head atual aprovado e árvore integrada igual à testada | Actions e verificação Git |

## Dependências de uma implantação real

- Meteorologia: a rota de observação na mesma origem possui entradas .NET e Vercel/Node.js compatíveis. Hospedagem sem a rota mantém previsão/fallback; verificar HTTP, contrato, captura e recepção no preview e no domínio publicado antes de afirmar observação disponível. Radar ou pluviômetros não estão ativos. Conferir [contratos, fontes e lacunas](meteorologia.md).

- Endereço público definido pelo ambiente e disponibilidade dos recursos estáticos e rotas.
- Execução externa configurada quando o produto oferecer Python, C# ou C++; conferir indisponibilidade e erros no ambiente publicado.
- Os exemplos TypeScript e PostgreSQL não são apresentados como execução nativa do laboratório atual.
- Backup do progresso é local e depende da exportação pelo estudante. Não prometer sincronização entre dispositivos sem uma funcionalidade que a implemente.
- Uma implantação deve ser verificada no próprio endereço. O CI usa o build real e a API local, mas não comprova configuração de domínio ou hospedagem não informada.

## Pendências editoriais

O mapa de currículo mantém as especializações ainda por aprofundar. Nesta edição, os oito percursos têm cobertura principal e aulas independentes iniciais; biblioteca padrão por domínio, concorrência avançada, ecossistemas, projetos maiores e outros aprofundamentos continuam previstos. Cada nova entrega deve ampliar a evidência de aprendizagem, sem reduzir a profundidade existente.

## Preservação do produto

A expansão de leitura utiliza os componentes existentes. Os arquivos de aparência, mundo e editor não precisam mudar para acrescentar aulas. Alterações futuras nessas áreas exigem verificação do comportamento que afetarem. A migração interativa deve continuar gradual e preservar o acesso à leitura extensa.

## Histórico da hospedagem na PR #3

O bot da Vercel registra um preview Ready para a PR #3. A leitura pelo conector retornou 403 por falta de acesso ao escopo renancodandos-projects; o executor local também impediu usar o CLI. Esses resultados não comprovam o funcionamento do endereço publicado. Os gates de build e navegador do Actions continuam sendo a evidência verificável do repositório até haver acesso à implantação.

## Dependência corrigida nesta entrega

A auditoria da PR #3 identificou `source-map-js@1.2.1`, dependência transitiva de desenvolvimento usada pelo PostCSS. O [aviso GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) informa correção na versão `1.2.2`. O lockfile foi atualizado somente nesse pacote com os metadados e a integridade publicados no npm. O CI deve comprovar instalação, auditoria e compatibilidade dos builds antes da integração. A presença no build não comprova exposição do site publicado ao ataque descrito no aviso.

## Conexões e recursos desta entrega

Os novos casos de navegador verificam diálogo por teclado, retorno de foco, validade do formulário e geometria de Grid. Os programas C# verificam execução adiada e descarte antecipado. Os cronogramas PostgreSQL usam conexões diferentes e exigem o SQLSTATE esperado, evitando aceitar uma falha genérica como demonstração de concorrência. Os gates devem concluir no head específico antes da integração.

## Evidência do código integrado

O run [37566327714](https://github.com/renancodando/CodeLab/actions/runs/37566327714) aprovou 136 testes de unidade, 118 exemplos externos, três cronogramas PostgreSQL, 59 testes de navegador e os builds. O código foi integrado em 1ba1ae70ed6953124c419f06c94078bf87481b02 com a mesma árvore testada. A revisão da condição de corrida do stderr foi resolvida aguardando close; consulte a [documentação de ChildProcess](https://nodejs.org/api/child_process.html#event-close). O roteiro manual segue o comportamento de [ON_ERROR_STOP no psql](https://www.postgresql.org/docs/current/app-psql.html): a interação retorna ao prompt e exige encerrar a transação em erro.

Essas evidências validam o código desta entrega. A implantação continua pendente: as ferramentas de leitura pública e o navegador local também falharam ao acessar/iniciar a verificação, além da falta de escopo no conector. Esses erros não comprovam indisponibilidade do site.

## Entrega de aprendizagem da PR #5

O [run 37641654276](https://github.com/renancodando/CodeLab/actions/runs/37641654276) aprovou o head 35c2163b507c6f15c465aac940faac102c092b55: 248 testes de unidade, 124 exemplos externos, três cenários Git, três cronogramas PostgreSQL, 79 testes de navegador e builds. O build gerou 152 páginas; npm audit informou zero vulnerabilidades. A integração 53715e9b01993f0a5594030f1f7db04408bdf9b7 conserva a árvore testada 845ff30b1e94dc2381ef8c153ca962f9dbb16352.

Foram verificados depuração com casos de borda, assistência após resposta, domínio por habilidade, sessão diária estável, revisão por calendário local, estudo offline preparado e falha de instalação do cache. Projetos com vários arquivos retomam e exportam ZIP; alterações invalidam evidências anteriores. O navegador também conferiu quota indisponível com recuperação por exportação, backup válido acima de 2 MB e falha de restauração que preserva a jornada anterior. O limite de importação é 16 MB. As oito larguras de 220 a 4000 px passaram nos fluxos cobertos.

A rubrica dos projetos é manual. As atividades conceituais não certificam compilação; os casos do executor local são inspecionáveis. A migração interativa é parcial e o aprofundamento editorial continua. O preview da PR #5 foi informado como Ready pela Vercel, mas a ferramenta pública não conseguiu abri-lo; a implantação continua sem verificação do fluxo publicado. O executor local ainda falha na preparação de ACL e a cópia local permanece sem sincronização.

## Aprofundamentos Python, TypeScript e C++

Python foi integrado pela PR #6 após o run 37677492690 (252 unidade, 131 programas externos, 81 navegador e 153 páginas), com árvore idêntica à testada. TypeScript foi integrado pela PR #7 após o run 37680909578 (259 unidade, 135 programas externos, 83 navegador e 154 páginas), também com árvore idêntica. Ambos concluíram builds/API e auditoria sem vulnerabilidades.

A [PR #8](https://github.com/renancodando/CodeLab/pull/8) foi integrada em `b217be7e63bf0225808117739de2e2011e0831d5`. Head aprovado: `3ecd7fdd147bc9e15057a211f54eb1aee370e57d`; árvore `d35985c0b81b8b28947e2aa23e604b9a0a6f0ad2`, idêntica à testada. O [run 37701742395](https://github.com/renancodando/CodeLab/actions/runs/37701742395) aprovou 263 testes de unidade em 15 arquivos, 142 programas externos, três cenários Git, três cronogramas PostgreSQL, ZIP interoperável, 85 testes de navegador, builds frontend/API e 155 páginas. Auditoria sem vulnerabilidades. Revisão manual concluída, sem threads abertas.

Essas entregas ampliam teoria e prática independente; não encerram os ecossistemas. Consulte [as 17 frentes abertas](etapas-restantes.md). Uma verificação no endereço público passou no fluxo Python (17 capítulos, três pausas, correção, retomada após recarregar e recarregamento offline preparado, sem erros de página ou requisições nesse cenário). Os demais fluxos publicados continuam por verificar. A cópia local foi sincronizada, com commits e arquivos antigos preservados. Os gabaritos compilados no CI não tornam atividades conceituais um compilador de código do estudante.

## Evidência pública e local desta retomada

A execução autorizada fora do sandbox permitiu superar a falha de preparação do executor para os comandos desta tarefa, sem alterar ACLs do sistema. A main local foi sincronizada e seu estado limpo foi conferido; os dois commits e três arquivos anteriores foram preservados com hashes. O executor padrão e o kernel continuam falhando; utilizar o caminho de execução autorizado e inspecionar Git na próxima retomada.

O fluxo público Python foi conferido em um contexto Edge novo: home HTTP 200, aula py-iteracao-recursos com 17 capítulos e três pausas, previsão correta, estado local e resposta restaurados após reload e recarregamento offline depois da preparação do cache. Sem pageerror/requestfailed nessa execução. Script e captura estão em outputs. Esse resultado valida a fronteira de leitura/avaliação conceitual/persistência testada; não prova os demais fluxos públicos nem a implantação integral pronta para produção.


## Portabilidade Windows e propriedades JavaScript integradas

As PRs #9 e #10 foram integradas com árvores idênticas às testadas, registradas em continuidade.md. O run 37707217346 aprovou 275 testes unitários, 142 exemplos externos, 87 testes de navegador, 156 páginas, builds/API, SQL/Git/ZIP e auditoria. Inclui debugging JavaScript executado, feedback sem gabarito automático e persistência offline. O run anterior 37704436528 teve timeout em um teste interativo; duas suítes completas posteriores passaram o cenário sem aumentar o limite. A verificação pública C++ confirmou leitura, correção e persistência online; Python também confirmou reload offline preparado. Os demais fluxos públicos e o currículo integral permanecem abertos.


## Progressão diária integrada, domínio pendente

A PR #39 passou no CI 38255384773 com 690 testes unitários, 150 fluxos de navegador em duas parcelas de 75 e os 161 exemplos externos, compiladores, PostgreSQL, API/cache e auditoria. Sem revisões abertas. Merge 20dd5898765cb5b7a34230fd300e43d130fb915a, árvore 16ce668b8c22f5ddda69370d854b475cd9f65f1a igual ao head 430d0cd27b07057ca85c522f118cd919e1806b08. Conferência do deployment/SHA e dos dois fluxos públicos ainda pendente; não presumir que o alias já atualizou. IDs, planos iniciados, pré-requisitos e leitura sem domínio preservados.


## Sessão diária conferida no domínio

O deployment dpl_8D5VkrUT9FwGehVs1WSFhVrjb26G ficou READY/production com gitSource.sha 20dd5898765cb5b7a34230fd300e43d130fb915a confirmado. Dois fluxos públicos Edge passaram em 1,8 min: progressão nova, plano anterior offline, preparação de valores na leitura e retorno pelo catálogo, sem substituir os 25 passos. Isso conclui a publicação de #39, mantendo as contagens de atividades. A prática Python #40 aguarda os dois jobs de navegador; 706 testes unitários e 169 exemplos externos passaram no CI 38259821060. Esses resultados não dispensam seus gates finais.


## Números Python integrados, domínio pendente

A PR #40 passou no CI 38259821060 com 706 unidades, 151 fluxos em parcelas de 75/76 e 169 exemplos externos, compiladores, PostgreSQL, API/cache e auditoria. Sem revisões abertas. Merge be777ce404aaa9257eed502d4fa1e0da491f5f66, árvore 94ab7f69ccf88425ca94d0658ae9f6a9ac2d34a5 igual ao head fe30a994bd99bd7cbeda4f06d65ecaeb1e781981. Não declarar publicação até conferir deployment/SHA e os dois fluxos públicos. A PR #41 mantém head 8501af3431f5736aa9d101b7620b4b8ff0681bb2; seu CI 38262798743 está em andamento, sem usar os gates de #40 como substitutos.

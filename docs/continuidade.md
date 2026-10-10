# Continuidade do CODELAB

## Preparação seguinte: descritores Python e duração do CI

O primeiro CI #28 (38064749952) encontrou dois critérios que foram acrescentados depois da última suíte local: a estrutura da prática aberta exigia os três critérios originais. Esses critérios originais foram preservados, e o aprofundamento dos descritores continua nos blocos e nas pausas próprios. Repetir a suíte e o CI completo no novo head; não usar o resultado anterior como gate.

A branch pratica/python-descritores-estado parte do head 3e417cac340fd325815b429e585a06faad0c8e28 da PR #27. Preserva as seis seções, o exemplo dataclass, o exercício Retangulo/Quadro e o projeto de py-objetos-protocolos. Acrescenta três pausas após os blocos 3/4/5: precedência de atributos, depuração de valores compartilhados pelo descritor e acesso pela classe sem confundir None com falsidade ou igualdade. Esta aula antiga não possui o par de problemas independentes das expansões recentes; não houve remoção de problemas.

Passaram 498 testes unitários e nove cenários Python reais. O verificador compartilhado inclui esses cenários, reproduz os programas quebrados e confere valores independentes, dois campos, rejeição sem mutação, zero, bool, herança, acesso pela classe, identidade equivalente, igualdade não executada e property sem setter. As respostas do aluno continuam conceituais e offline, sem enviar Python a executor. Strict/build passaram; o bundle inicial está em 193,18 kB gzip, o mundo em 135,94 kB, com 32 recursos locais e 157 páginas.

O fluxo offline encontrou transbordamento de uma alternativa longa e da palavra metaprogramação no título a 220 px. A correção permite quebra de identificadores nas alternativas e palavras longas nos títulos de leitura, preservando conteúdo, fonte e ordem. Após essas correções, o fluxo Edge passou em 40,4 s (57,5 s total), incluindo erro/acerto, assistência, armazenamento, recarga offline e 220/4000 px.

O CI C# 38017961491 foi cancelado no limite de 40 min após 114 testes de navegador aprovados; o mesmo head foi reenviado para validação, sem considerá-lo aprovado. CSS 38018467196 passou com 484 unitários e 120 testes de navegador; rascunhos 38019095799 passou com 484 unitários e 122 testes. As revisões consultadas estavam vazias. Conferir os gates finais, integrar #25/#26/#27 na ordem e verificar publicação.

Para não manter toda a suíte de navegador presa ao mesmo limite, o próximo workflow separa dois jobs depois da validação comum, recuperando o mesmo artefato dist. A lista Playwright conferiu os 123 testes desta branch em parcelas de 62/61, sem omissões ou duplicações. Cada parcela conserva um worker, os três servidores e os relatórios; não reduz asserções nem executa duas vezes os compiladores e o PostgreSQL. O novo desenho ainda exige CI real, incluindo a transferência do artefato.

As métricas geradas desta branch são 70 atividades em 52 das 137 aulas; 85 aulas ainda não têm pausas na teoria. A produção precisa ser conferida separadamente. Esta contagem não mede conclusão de linguagens, do currículo integral ou de todas as frentes de produção.

## Correção em preparação: trocas consecutivas no laboratório

A branch correcao/rascunhos-troca-linguagem parte do head 766f5a78fde7f3bd6c4054849caa1999ab7bba20 da PR #26; depende da integração verificada de C# (#25) e CSS (#26). O teste de navegador reproduziu uma perda real: trocar de JavaScript para anotações e imediatamente para Python salvava o JavaScript sobre as anotações enquanto o import do editor ainda aguardava. A troca agora usa o módulo Monaco já carregado e atualiza linguagem/conteúdo na mesma operação síncrona, mantendo persistência e cancelamento existentes.

Os quatro fluxos iniciais passaram no Edge: troca consecutiva, restauração de rascunhos incluindo código vazio, edição Python após navegação/recarga sem executar e projeto de anotações com exportação/importação da jornada (1,5 min). A regressão foi ampliada para anotações vazias: os dois cenários consecutivos passaram em 47,4 s. O teste exige exportação correta de cada linguagem, conteúdo preservado no armazenamento e ausência de requisições de execução. Não foi acrescentado executor, runtime ou permissão ao código do aluno.

Strict e build passaram. O editor continua sob demanda; o bundle inicial está em 191,73 kB gzip e o mundo em 135,94 kB. A referência dinâmica duplicada ao Monaco desapareceu e seus dois chunks foram reunidos no chunk lazy do editor; isso explica 32 arquivos do manifesto offline em vez de 33, sem retirada de conteúdo. Exigir CI completo do head final, revisões, árvore de integração e fluxo no domínio público antes de declarar a correção publicada. As métricas curriculares continuam 67 atividades em 51 das 137 aulas nesta branch; a produção ainda precisa ser conferida separadamente.

## Preparação seguinte: caixas CSS com conteúdo adverso

A branch pratica/css-caixas-conteudo parte do head 658e2b5d9f59106b255a41e47e55f490c0a8ce2e da PR #25, cuja integração deve ser conferida antes desta entrega. A aula css-caixas-intrinseco conserva seis seções, exemplos e dois problemas independentes; recebe três pausas onde ainda não havia atividades corrigíveis: prever a borda quando o conteúdo chega a zero, permitir encolhimento sem recortar texto e corrigir a referência de um cabeçalho durante rolagem local.

Passaram 484 testes unitários, strict/build e, após corrigir o rótulo do exemplo, 29 testes específicos de prática/catálogo. O primeiro teste nativo encontrou que Código excedia os 48px previstos pelo mínimo automático; o exemplo agora usa o rótulo curto ID para isolar a restrição do identificador, sem recorte ou mudança das regras do produto. O teste continua exigindo 48px para esse rótulo e o identificador inteiro. O bundle inicial está em 191,78 kB gzip e o mundo mantém 135,94 kB. Exigir os fluxos de navegador e CI do head final, resolver revisões e integrar C# antes de CSS.

As métricas desta branch incluem a dependência C#: 67 atividades em 51 das 137 aulas. Isso deixa 86 aulas sem pausas na teoria e não significa 86 entregas até um currículo exaustivo. A main publicada no início desta preparação tinha 61 atividades; conferir o checkpoint e as PRs para o estado posterior.

## Checkpoint: SQL e HTML integrados; iteradores C# em preparação

As PRs #23/#24 foram integradas com árvores idênticas aos heads aprovados. SQL: head 09d232b5b3c197c4180e68ffea2b0484dd3fce52, CI 37996313180, 442 unitários e 115 testes de navegador. HTML: head 241ccbd68061e81f0f47cd08ff723c514cd3a9fc, CI 37996662758, 453 unitários e 117 testes de navegador. Ambos executaram 152 exemplos externos, oito projetos TypeScript, sete cenários C++20 e 12 cenários PostgreSQL, além dos gates de isolamento, API, build e auditoria. A revisão da preparação diária foi resolvida.

A main 04217e927284326444946cda02e5600e876f37cd tem árvore 32f3e829a5d8061f69067dabc1db6078e03ea80a, igual à do head HTML aprovado. A implantação AhnGXJpGEpzJ2h9zVstzcBiiLJCP foi confirmada READY/production nesse SHA. Os dois fluxos SQL passaram no domínio (15,5 s), incluindo plano antigo e respostas offline. Os dois fluxos HTML passaram em seguida (9,3 s), incluindo referências nativas, fallback e arquivos SVG recuperados offline. A main local foi sincronizada sem descartar branches. Os registros anteriores de gates pendentes são históricos.

A próxima branch pratica/csharp-iteradores-percursos preserva a atividade de using preexistente e os dois problemas independentes de cs-iteradores-descarte. Acrescenta previsão de avanço, depuração de enumerador abandonado e materialização de consulta finita. ToArray e ToList são decisões válidas nesse contrato, sem promover a materialização universal. Os dez cenários .NET 10 passaram localmente, com suspensão, nova enumeração, reprodução da fuga, descarte normal/por exceção, origem vazia, duas materializações, repetição de efeitos e filtro vazio. O build local precisou executar fora do sandbox porque o SDK não conseguiu ler a configuração NuGet do usuário; o projeto descartável desativa fontes de pacotes e não acrescenta dependências. Exigir testes completos, CI do head, revisões e verificação publicada antes da integração.

## Próxima entrega: imagens com contexto e arquivos offline

A branch `pratica/html-imagens-contexto` depende do head SQL `09d232b5b3c197c4180e68ffea2b0484dd3fce52` da PR #23, ainda exigindo CI completo. Acrescenta três pausas à aula existente `html-midia`, que não tinha atividades corrigíveis. Preserva suas seis seções e os exemplos SVG, aprofunda alternativas funcionais, sizes e seleção de picture, e fornece três diagramas locais no cache offline. A ordem inicial de picture é propositalmente incorreta; o aluno precisa movê-la. Não há novo executor, runtime, permissão de rede ou alteração de arte.

Após incorporar a preparação diária revisada, passaram 453 testes unitários, strict/build e novamente os dois fluxos HTML no Edge (26,5 s total). As referências nativas e os arquivos offline continuam válidos. O bundle inicial dessa combinação é 189,10 kB gzip, com 33 recursos locais preparados. Exigir o CI deste head sucessor; o run da branch anterior à revisão não cobre a nova preparação.

Passaram 452 testes unitários, strict/build e dois fluxos Edge locais. A referência nativa confere nome acessível/foco, tamanho CSS, seleção nas larguras 220/600/601/4000, proporção, reprodução da fonte genérica antecipada e fallback. O fluxo do produto confere erro/acerto, assistência, respostas/ordem/evidências após reload offline, os três arquivos SVG acessíveis sem rede e layout 220/4000 px. A conferência do aluno continua conceitual; seleção de candidatos por densidade não é prometida como determinística nem medida como economia de fotografias. O bundle inicial cresce de 187,28 para 188,86 kB gzip; o mundo mantém tamanho e carregamento existentes. Após explicitar tipo SVG e dimensões nas sources, os 23 testes específicos, build e os dois fluxos foram conferidos novamente.

O CI SQL falhou duas vezes antes do checkout por limite/timeouts do Docker Hub. Um commit separado passa a obter a mesma imagem oficial PostgreSQL 18 no registro público da AWS. A tag foi consultada e contém Linux/amd64; nenhum gate, porta, usuário descartável ou segredo foi modificado. Referência operacional: [pull público no ECR](https://docs.aws.amazon.com/AmazonECR/latest/public/docker-pull-ecr-image.html). Exigir os CIs dos heads atuais, resolver revisões e integrar SQL antes de HTML. Nenhuma falha de download comprova defeito ou aprovação dos exemplos.

## Revisão: preparação real e retomada de planos antigos

A revisão da PR #23 apontou que requiresConcept só exigia a introdução: a sessão mostrava dois capítulos, enquanto restrições e correlação estavam nos blocos posteriores. A correção acrescenta uma preparação identificada por revisão para cada família que exige conceito, exibindo os capítulos até o último bloco necessário. A leitura introdutória conserva seu identificador; não é transformada em leitura dos novos capítulos. A preparação tem seu próprio identificador v1, que deve ser revisto quando seu contrato pedagógico mudar.

Planos já salvos conservam itens, respostas e conclusões. Antes de montar uma atividade cuja preparação ainda não foi lida, a sessão mostra essa leitura e só então retoma o mesmo item. Não apaga domínio anterior nem cria evidência de habilidade por leitura. Gabaritos e capítulos de resolução ficam fora desse recorte. A correção foi incorporada à branch HTML; exigir CIs dos novos heads, não dos anteriores à revisão.

Passaram 442 testes unitários e strict/build. Os fluxos Edge de fundamentos e prática SQL passaram; o caso novo de plano antigo passou após corrigir seu setup para abrir uma sessão e salvar o estado antes de alterá-lo. Confere capítulos 4/5 visíveis, resolução ausente, leitura antiga preservada, plano idêntico, domínio vazio e retomada após reload. O CI anterior já executou os 12 cenários PostgreSQL com sucesso, mas a revisão de fluxo exige novo gate completo. O bundle inicial da branch SQL está em 187,49 kB gzip.


## Checkpoint de 9 de outubro: C++ e closures integrados

A main `093584f82b7000c859b4b0898f1c2568c98b0ede` integra as PRs #21 e #22, depois de #19/#20. A árvore `9289005baa4ace21d809fc241d0000957451dcf7` é idêntica ao head aprovado #22 `b2816488cd519663875cf35cf191879deb89941c`. O CI 37961175745 aprovou 427 testes unitários, 152 exemplos externos, oito projetos TypeScript, sete cenários C++20 e 113 testes de navegador. Os CIs de push 37964985020 e 37965665399 também passaram. Não há PRs abertas neste checkpoint.

O fluxo C++ passou no domínio público, incluindo erro/acerto, assistência, retomada offline e 220/4000 px. A implantação posterior de closures `5CnXqjxpKeVFYHugrZKBeo3wpQNz` foi confirmada READY/production. A primeira tentativa pública de JavaScript não começou por quota da aprovação automática, sem determinação de insegurança. Após a disponibilidade voltar, o mesmo fluxo passou no domínio: três correções executadas, assistência, respostas/evidências offline e 220/4000 px (8,7 s; 11,7 s total). A pendência de verificação pública de closures está resolvida.

A configuração de produção `CODELAB_PUBLIC_URL` foi preenchida com a origem pública. Na implantação C++ foram conferidos robots permitindo conteúdo, sitemap com as URLs próprias e canonical sem noindex em duas páginas; isso não comprova indexação por buscadores. Nenhum segredo foi acrescentado ao cliente.

## Entrega seguinte: ausência e contratos SQL

A branch `pratica/sql-null-contratos` parte dessa main. Preserva a pausa inicial e os dois problemas independentes de `sql-null-logica`; acrescenta previsão, depuração da restrição e alteração da correlação após os blocos 2/4/5. As três habilidades exigem preparação conceitual na sessão diária. Há 12 cenários PostgreSQL no verificador compartilhado: comparação exibida, negação com unknown, violações específicas, reprodução das restrições incompletas, correspondência nula, duplicatas, zero e conjuntos vazios. O computador local não dispõe de psql; executar esses casos no PostgreSQL real do CI antes de integrar. Não existe execução SQL do aluno no navegador nesta entrega.

Passaram 441 testes unitários e o build com strict, geração de métricas, função meteorológica, páginas e cache offline. Os testes conservaram a pausa SQL preexistente em vez de tratá-la como atividade nova; somente as três práticas novas exigem a preparação adicional. O bundle inicial passou de 185,93 para 187,28 kB gzip, sem dependência ou runtime novo; o mundo permanece com o mesmo artefato.

O fluxo Edge local das três pausas também passou (22,8 s; 25,2 s total): erro/acerto, solução sob solicitação, assistência, respostas e evidências retomadas offline, nenhum pedido de execução remota e larguras 220/4000 px. Os 17 capítulos e os dois problemas independentes permanecem. Ainda exigir o CI completo do head e os cenários PostgreSQL antes da integração.

Os registros abaixo são históricos. Pendências de branches já integradas descrevem o momento daquele registro, não o estado atual.

## Histórico: preparação das closures executáveis

A branch `pratica/javascript-closures-estado` depende do head C++ `9b82a81814511aead5ba23ea4f6e3e9961b208d5` da PR #21, ainda em validação. Acrescenta três programas corrigíveis em QuickJS à aula existente, com contratos de instância, callbacks e snapshots, sem alterar limites ou dependências. Exigir os gates completos de cada head e integrar primeiro C++; conferir árvore e fluxo público após cada integração. Métricas são geradas e não demonstram currículo concluído.

Passaram 427 testes unitários, strict/build e o fluxo Edge offline das três pausas: erro/acerto, assistência, respostas/evidências preservadas e larguras 220/4000 px. Os 17 capítulos existentes, incluindo problemas abertos, foram conservados. O teste inicial esperava somente 13 e foi corrigido para incluir esses problemas, sem retirar conteúdo. A suíte aceita uma fábrica auxiliar de callbacks e recusa resultados fixos, cursor compartilhado, overflow e snapshot com alias. O bundle inicial cresceu de 182,78 para 185,93 kB gzip, sem novo runtime; Three.js/Monaco e o WASM conservam seus carregamentos existentes. Não reutilizar esse gate local como comprovação do CI ou da implantação.

## Main verificada: vidros e módulos TypeScript

As PRs #19 e #20 estão integradas, nessa ordem. A main `4790188f8ab6c7ddab7167a33984043dc86f216a` preserva a árvore do head #20 `0126d54776e3c5e014e99ad796135347aeb62b9b`: `275cd5b493f5a92fed455a9b0d7e2fafc4df88f1`. O CI 37953975921 aprovou 401 testes unitários, 152 exemplos externos, oito projetos TypeScript adicionais e 111 testes de navegador. A PR #19 aprovou 392/152/110 no run 37951920788 e seu merge `5b45b72d45a2d55f88f429ca159f508f346357e0` também teve árvore idêntica à testada. Não havia revisões abertas.

O deployment `B4N9m1yekqkEJyQAbfBNF6PnX4UD` foi confirmado READY/production. No domínio code-lab-omega.vercel.app passaram o fluxo TypeScript offline completo e a verificação do estado/CSS dos vidros em 220/375/4000 px, um canvas, 42 massas, movimento reduzido e ausência de erros WebGL. O estado real dessa verificação tinha condensação zero: isso comprova conexão do motor e CSS publicados, não observação de vidro fisicamente embaçado. As regiões sintéticas embaçadas/secas foram conferidas na fixture do CI sem alterar a arte.

A expansão local seguinte, `pratica/cpp-requisitos-sobrecargas`, aprofunda `cpp-templates` com requisitos simples/aninhados, instanciação e sobrecargas com requisitos compartilhados. Três pausas conceituais e sete cenários externos C++20 não introduzem compilador no navegador nem encerram templates/concorrência/memória. Passaram strict/build, 412 testes unitários, os sete cenários g++ e o fluxo Edge offline com respostas, assistência e retomada em 220/4000 px. Cinco cenários executam programas; dois exigem recusa da compilação. A suíte diária agora verifica a primeira sessão no catálogo completo e a preparação na família isolada, sem depender do desempate com práticas de fundamentos. Exigir o CI completo do head publicado antes de integrar. Os checkpoints abaixo são históricos, não pendências atuais das PRs já integradas.

## Próxima entrega: prática de módulos TypeScript

A branch `pratica/typescript-modulos-host` parte do head `97b5725c0a08b1032f3bbeb4ac9103e99db9fa21` da PR #19, que ainda exige seu gate completo. A expansão da aula existente prepara extensão do artefato, alias e efeitos de imports de tipo antes de três pausas. As métricas são geradas pelo catálogo; não surgiu uma nova aula própria nem execução TypeScript no laboratório.

Passaram oito projetos reais TypeScript/Node (incluindo diagnósticos com emissão bloqueada e falhas esperadas de resolução), 401 testes unitários completos, strict/build e o fluxo Edge offline de respostas, assistência e retomada. A suíte detectou uma suposição antiga de catálogo fixo no teste de variância: o cenário agora isola a família sob estudo e verifica também módulos, mantendo todas as expectativas de preparação e leitura sem domínio. A previsão final vem no bloco 5 para participar como desafio da sessão diária. A verificação externa compartilhada mantém a contagem anterior de exemplos separada desses oito cenários de módulos. Exigir o CI completo do head atual antes de integrar; preservar a dependência da PR #19 e conferir árvores na ordem dos merges.

## Checkpoint atual: CSV integrado e vidros em validação

A main `48971a4035d5131e1fa795fb36c150806de95f8c` integra a PR #18. O head `2b8c31b09dca516f5e6fa033409bbcca5f78ad7c` aprovou o CI 37938119575: 389 testes unitários, 152 exemplos compilados/executados e 108 testes de navegador. A árvore `f41e1fd0acb88496d0ca3ab8e3ed1ba02dcb1ae8` é idêntica à do merge. O CI da main 37942664815 também passou. A implantação `GLwR5eRuoBeM1gF4mtUFY6D8y58v` foi confirmada READY/production e o fluxo CSV passou no domínio público: erros/acertos, assistência, reload offline e respostas/ordem preservadas. São atividades conceituais, sem execução Python no navegador.

A branch `clima/condensacao-interior` liga o estado gradual existente a um véu CSS atrás da arte original. A transparência do PNG expõe o efeito nos vidros e preserva o primeiro plano. Não mede a temperatura do vidro ou a umidade interna. Não acrescenta blur, texturas, canvas ou dependências. Descarte remove o estado CSS. Passaram 65 testes específicos, strict/build e quatro cenários Edge, incluindo amostras de pixels da composição e orçamento/qualidade de 220 a 4000 px. A primeira suíte local teve 391 aprovações e um timeout no teste preexistente de limite de memória do executor; esse teste passou isolado e depois a suíte inteira aprovou 392 testes com um worker, sem mudar limites. Conferir o CI completo do head antes de integrar.

Após esse gate, retomar módulos TypeScript por ambiente e prática curricular. Radar/pluviômetros sustentáveis, medições em celulares físicos, laboratórios TypeScript/SQL e o aprofundamento integral permanecem abertos. Os registros abaixo são históricos de cada entrega; seus estados intermediários não substituem este checkpoint.

## Clima e entregas anteriores integrados em 9 de outubro

A main `f4f28227869f90a1c7853e66dad628ea976c5390` integra a PR #17, cujo head `b15fc8adc5bd285476a30495b1cc23b486fee125` aprovou o run 37930523384: 382 testes unitários, 147 exemplos externos e 107 testes de navegador, builds, API, isolamento PostgreSQL e auditoria. A árvore do merge é idêntica à testada: `d0d39886dfc246b9c443f1edf7abe0f82dd0134d`. A revisão de redimensionamento foi resolvida. A main local também avançou sem apagar o histórico preservado.

As PRs #12–#16 estão integradas. Foram usados heads sucessores com CI completo aprovado: #13 inclui os commits de #12, e #16 inclui os de #15. Os timeouts próprios de #12/#15 não foram tratados como aprovação. As árvores de cada merge conferem com os respectivos heads testados. O domínio recebeu métricas centralizadas, prática CSS/C#, teste de quota real e preservação de rascunhos/projetos de anotações.

A implantação atmosférica `6zHHpnBuzYc8ec9hcPnWS2Z95sJB` foi confirmada READY/production, com alias code-lab-omega.vercel.app. Em produção, seis tamanhos/orientações entre 220 e 4000 px produziram pico medido de 1.198.483 pixels no nível baixo, conservaram 42 massas e alternaram movimento reduzido sem erros WebGL. A rota de observação retornou boletim real SBSP, cache HIT sem rejuvenescimento, 400 para parâmetro extra e 405 para escrita. A interface manteve condição estimada para estação a cerca de 9 km. Isso não comprova FPS físico, radar ativo ou chuva no ponto.

Após a integração dos rascunhos passaram nove fluxos no domínio e quatro verificações isoladas dos exemplos CSS em Edge: práticas offline CSS/C#, quatro cenários dos 25 passos e três de rascunhos/projeto/backup. Scripts temporários estão em outputs do workspace. O pedido integral continua aberto, incluindo interior embaçado, fontes adicionais sustentáveis, laboratórios TypeScript/SQL e aprofundamentos curriculares.

## Prática CSV em preparação

A branch `pratica/python-csv-contratos` parte dessa main e aprofunda a aula existente `py-biblioteca-dados`: registros multilinha, cabeçalho completo e lote validado antes de alterar uma lista. Três pausas conceituais usam habilidades distintas. Sete testes falharam antes da implementação. Os gabaritos e reproduções de falhas entram no mesmo verificador Python do CI; conferir resultados locais e head remoto antes de integrar. Não houve criação de uma aula própria de toda a biblioteca padrão nem execução Python no navegador.

## Revisão do buffer e timeout do fluxo longo

A revisão da PR #17 identificou aumento transitório de resolução ao encolher a janela. Um teste com os setters nativos do canvas reproduziu 1.827.000 pixels no nível baixo, apesar do tamanho final caber no orçamento de 1.200.000. O redimensionamento agora usa um buffer intermediário limitado antes de aplicar dimensões/proporção finais. Passaram o teste ampliado de seis mudanças de viewport/orientação, movimento reduzido, chuva forte e 42 massas, e os treze cenários atmosféricos em duas larguras. O strict também passou; conferir o build completo e o próximo head no CI antes de integrar.

Os heads das PRs #14 e #16 aprovaram seus CIs completos. O da PR #16 conferiu 372 testes unitários, 147 exemplos externos e 104 testes de navegador. Nos heads anteriores de #12/#13/#15/#17, somente o fluxo agregado dos 25 passos estourou 180 segundos; os demais cenários passaram. Novas tentativas foram iniciadas para #12/#13/#15. A correção de testes na branch atual separa o percurso em etapas seriais: cada contexto retoma o checkpoint realmente produzido pela etapa anterior, sem fabricar respostas. Preservar todas as verificações e exigir CI do head que for integrado; nenhum sucesso anterior valida uma alteração posterior.

Os quatro cenários do novo arquivo passaram no domínio público: doze primeiros passos com erro e reload; retomada real dos treze restantes com avaliação; invalidação/assistência/revisão/descarte/recomeço; leitura sem aprovação por consultar solução. A aplicação publicada continua sendo a integração climática 7893a3200bc8eb2a7aa85e304eb7e64fcf168f54. A evidência valida a reorganização do teste e a recuperação real do checkpoint, não a implantação antecipada da correção de canvas. A configuração está em outputs/playwright-aula-publicada.config.mjs do workspace. Os dois primeiros casos conservam o limite de 180 segundos; os demais usam o limite padrão. Nenhuma verificação do percurso original foi removida.

## Qualidade atmosférica para dispositivos limitados em validação

A branch `clima/qualidade-dispositivos` parte do head `348988c1ee21c063e2c3be2089b247508ac111a3` da PR #16. Acrescenta teto inicial por recursos locais do navegador e orçamento de pixels para telas grandes. Mantém recuperação por FPS dentro do teto, movimento reduzido, partículas, fontes e 42 massas. Dez testes específicos incluem promoção indevida e orçamento de pixels; nove falharam antes da correção. Os 382 testes unitários, build e quatro cenários Edge passaram: os 25 passos da aula com retomada/assistência, leitura, treze estados atmosféricos em duas larguras e hardware limitado com chuva forte/canvas de 375 a 4000 px. Conferir o CI do novo head antes de integrar; não foram medidos FPS em celular físico.

As oito larguras de 220 a 4000 px passaram no domínio público da integração climática, além dos treze fluxos anteriormente registrados. O CI atual da PR #14 aprovou 147 exemplos externos e 100 testes de navegador; as PRs dependentes e a nova otimização ainda precisam de seus próprios gates. Uma falha de timeout no run anterior da PR #13 ocorreu depois de a resposta final passar nas verificações, conforme o artefato; não atribuir esse timeout a uma resposta incorreta. Consultar o resultado dos heads atuais antes de decidir sobre repetição ou correção.

## Correção de rascunhos pronta para o gate

A branch `correcao/rascunhos-laboratorio` parte da PR #15 com as revisões propagadas. Corrige leitura dos rascunhos de todas as linguagens do laboratório, preserva HTML/JavaScript vazios e aceita projetos de anotações na leitura e no próprio backup. Dois testes falharam antes da correção e passaram depois; a suíte local aprovou 372 testes em 23 arquivos, strict/build de produção e três fluxos Edge completos. Sem nova aparência, runtime, rede ou ampliação de limites.

As PRs #12/#13/#14/#15 continuam exigindo CI dos heads posteriores à revisão de contagens. Resolver revisões novas antes de integrar, nessa ordem, e conferir árvore idêntica à testada. A correção de rascunhos também precisa de PR própria, CI completo e verificação publicada após integrar. O pedido integral e os laboratórios TypeScript/SQL continuam abertos; não confundir essa correção com execução TypeScript implementada.

## Quota nativa e exportação verificadas

A branch `qualidade/cota-real` acrescenta um teste de navegador que enche o armazenamento de um contexto descartável até QuotaExceededError real. O cenário preserva o checkpoint anterior, exporta ZIP e jornada com o trabalho em memória, libera somente suas chaves de preenchimento e confirma nova gravação e reload. Passou no build local e em `https://code-lab-omega.vercel.app` após a implantação climática, sem pageerror. O script público está em outputs/verificar-quota-publicada.mjs do workspace. Exigir CI do head antes de integrar; esta evidência não encerra todos os fluxos de produção.

## Revisão de métricas e evidência pública

O run 37874897089 aprovou a primeira correção do orçamento de CI, mas a revisão das PRs sucessoras identificou totais manuais antigos em outros parágrafos do README. Essas duplicações foram removidas: o catálogo atual fica somente no bloco gerado, e um teste rejeita contagens curriculares repetidas fora dele. Preservar evidências históricas de testes. Conferir o novo head da PR #12 e propagar a correção às PRs #13/#14/#15 antes de integrar; o run anterior não valida essa alteração.

Treze fluxos passaram no domínio público da integração climática, incluindo sessão diária, depuração executada, revisões, projetos, offline, backup grande, falhas de gravação e quota nativa. O escopo está em prontidao-producao.md. A lista aberta das PRs e seus heads atuais deve ser consultada no GitHub, sem retomar um head antigo deste histórico por engano.

## Clima integrado e próxima entrega

A PR #11 foi integrada em `7893a3200bc8eb2a7aa85e304eb7e64fcf168f54`. O head `da6cf8138971fff27c1ff5dfce348865a1b8ac84` passou no [run 37870369915](https://github.com/renancodando/CodeLab/actions/runs/37870369915): 356 testes unitários, 94 de navegador, exemplos externos, SQL/Git/ZIP, builds, verificação .NET, módulos ESM Node e auditoria. A árvore integrada é idêntica à testada: `27b10296bc6167a5011796add88e2d28df71f8c0`. Três threads de revisão foram resolvidas.

O domínio público `https://code-lab-omega.vercel.app` foi conferido depois dessa implantação: boletim real SBSP HTTP 200, cache HIT sem rejuvenescer recebidoEm, entrada extra 400 e POST 405. Em Edge com viewport 375 px, o fluxo selecionou cidade, mostrou idade e estação a cerca de 9 km, manteve condição estimada e 42 massas sem erros WebGL. Script e captura estão nos outputs do workspace. Isso não comprova FPS em celular físico nem ativa radar/pluviômetros; os limites estão em meteorologia.md.

A PR #12 centraliza métricas geradas. O run `37870417188` aprovou unidade, exemplos, builds e auditoria, mas o job completo atingiu 30 minutos durante o navegador, após 91 testes aprovados. Foi cancelado, não aprovado. O orçamento total agora é 40 minutos; timeouts individuais e testes foram preservados. Conferir o novo head e seu CI completo antes de integrar.

A expansão CSS foi publicada na PR #13 sobre a PR #12: aula própria, dois problemas e três pausas. Seus cinco testes Edge, 363 testes unitários e build local passaram. Após a revisão do README, o head passou a `8d1b1880774e32f347f415639aa1b75cf9e9919a`; conferir seu run mais recente, sem reutilizar o gate do head anterior. A aula ainda não está em main. Retomar os aprofundamentos de HTML/SQL e as demais frentes, sem considerar todo o currículo concluído.

A branch `pratica/csharp-cancelamento` acrescenta três pausas ao módulo assíncrono existente, com teoria anterior à tentativa, habilidades específicas e preparação na sessão diária. Cinco programas .NET 10 passaram localmente: previsão, bug de liberação sem aquisição, correção em quatro caminhos e dois tokens originais independentes. O verificador de exemplos do CI recebe os mesmos casos. Passaram também 369 testes unitários, strict/build e o fluxo Edge de retomada offline, assistência e persistência sem executor externo. As métricas geradas distinguem a branch sucessora da versão publicada; nenhuma nova aula própria foi inventada para contar essas pausas. Exigir o CI completo da PR sucessora e integrar dependências primeiro.

## Estado em 8 de outubro de 2026

Prioridade humana mais recente: concluir primeiro a reestruturação meteorológica, depois retomar aprendizagem ativa e aprofundamentos. A branch de clima preserva o catálogo; veja [o contrato e limitações](meteorologia.md). Não confundir previsão Open-Meteo com observação atual nem ativar chuva local por código WMO.

Main anterior `22e02d7cf9325f0c2e04e5ea4ca6a77505119562`: runs 37802151482, 37802009510 e 37801960626 concluídos com sucesso, incluindo as integrações #9/#10. O CI da nova branch precisa concluir antes da integração.

Clima em revisão na [PR #11](https://github.com/renancodando/CodeLab/pull/11), branch `clima/motor-atmosferico-continuo`. O head inicial `16ad5388dc805b11ce3859ce58d130794daf4f8d` passou o run 37816072375. Antes de integrar, verificar o head posterior: corrige qcField não booleano, precipitação sólida e cadência do modelo durante falha, além de névoa na água. Não usar o sucesso do head inicial como gate das correções.

Retomada: 354 testes unitários passaram, incluindo 19 casos da nova rota Vercel/Node.js; sete testes de navegador meteorológicos passaram após as correções, com 13 cenários visuais em desktop e viewport móvel. O adaptador local recebeu boletim NOAA real HTTP 200. Vercel CLI autenticada como renancodando acessa o preview protegido; a rota no preview anterior e no domínio retorna 404. Publicar o próximo head, aguardar CI completo e testar a função no preview antes de integrar; conferir o domínio depois. As três threads de revisão ainda precisam ser resolvidas após a verificação.

O preview de `1b2ab89` instalou a função, mas retornou 500 por import ESM sem extensão. A correção usa `.js` na entrada TypeScript; o build agora executa o JavaScript emitido em um processo Node separado, com 30 consultas concorrentes e fonte simulada. Conferir o preview do head corrigido: build Ready isoladamente não comprovou o funcionamento.

Preview de `f22da3d`: função respondeu JSON HTTP 200, cache MISS/HIT preservou recepção, parâmetros extras retornaram 400 e escrita retornou 405. Navegador em 375 px conferiu seleção de cidade, boletim NOAA real nos detalhes, condição estimada, 42 massas e zero chuva local, sem pageerror/WebGL. Revisão manual posterior retirou a inferência de precipitação de VCTS isolado; TS/VCTS possuem teste próprio. Aguardar CI do próximo head antes de integrar. As três threads anteriores foram corrigidas, testadas e resolvidas.

- PRs #1 a #10 integradas. Catálogo: 136 aulas em 20 trilhas; Python, TypeScript, C++ e JavaScript têm dez aulas, outras quatro linguagens nove.
- 60 aulas originais, 48 módulos panorâmicos de 13 capítulos e 28 aulas próprias de 17 capítulos, com 56 problemas independentes.
- Matriz: 646 entradas, 155 vinculadas a atividades específicas e 491 introduzidas. Os conceitos podem reaparecer em contextos diferentes; não são contagem de especializações completas.
- 37 atividades corrigíveis: cinco programas JS e 32 atividades conceituais. Doze pausas novas distribuídas em Python, TypeScript, C++ e JavaScript exigem preparação do conceito na sessão diária.
- Pedido integral em andamento: [17 frentes restantes](etapas-restantes.md). Não há contagem finita auditada de aulas que esgote todos os ecossistemas.

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

Os runs de main 37675611114 e 37676345090 aprovaram a integração da PR #5 e o checkpoint anterior. A PR #6 também teve main aprovado no run 37680250543. Confira o CI do checkpoint atual na próxima retomada; uma falha real exige investigação. A sincronização local foi concluída; a verificação pública passou no fluxo Python e continua parcial, conforme descrito abaixo.

## Próxima ação editorial

Leia docs/curriculo-completo.md. As aulas de iteradores Python, variância TypeScript e invalidação C++ foram integradas. Propriedades, descritores e receptores JavaScript foram integrados pela PR #10. Priorize biblioteca padrão Python por domínio, módulos TypeScript por ambiente e templates/algoritmos C++ com contratos próprios; prossiga também com internacionalização, workers e cancelamento JavaScript. Continue a aprofundar as oito linguagens, projetos maiores, ecossistemas e diagnóstico. Não marque temas apenas listados como prática pronta.

O diálogo modal, Grid com trilhas automáticas, iteradores C# e snapshots/conflito PostgreSQL já possuem aulas e verificações próprias. Ampliar esses assuntos com novas atividades exige mecanismos adicionais, evitando repetir o que já foi entregue.

Depois das prioridades editoriais, prossiga com a migração gradual para passos interativos, mantendo a leitura extensa e o progresso local sem contas.

## Manutenção e critério de integração

As definições em src/content/deep são a fonte de verdade; content:generate deriva índice e matriz. Os gabaritos SQL que exigem conexões distintas usam postgresScenario e verify-sql-concurrency. O verificador espera close para capturar streams completos; em psql interativo a pessoa deve executar ROLLBACK após o erro.

Antes de editar, confira main, PRs abertas e este checkpoint. Preserve critérios de profundidade, execute os exemplos e o fluxo completo no CI, revise achados e integre somente código verificado. Confira se a árvore integrada corresponde à testada. Revise contagens ao acrescentar aulas.

## Preservação do produto

Preservar aparência, mundo, clima, áudio, editor e armazenamento local. A expansão editorial utiliza as superfícies existentes; as adaptações responsivas da PR #5 têm verificação própria. A bancada orienta o dialeto da aula: PostgreSQL na expansão e SQLite nos exemplos originais correspondentes. Não acrescentar login, contas ou progresso remoto.

## Verificação da implantação e execução local

As tentativas anteriores pelo conector Vercel retornaram 403 e a ferramenta pública não abriu o endereço. Nesta retomada, uma consulta HTTP retornou 200 em https://code-lab-omega.vercel.app e um navegador Edge isolado verificou o fluxo Python: abrir py-iteracao-recursos com 17 capítulos e três pausas, conferir a previsão, salvar estado, retomar a resposta após recarregar e repetir a retomada offline depois da preparação do cache. Não houve pageerror nem requestfailed nesse cenário. A captura está em outputs/verificacao-publica-python.png e o script em outputs/verify-production.mjs.

Essa evidência cobre esse fluxo publicado; não substitui a verificação dos demais fluxos, falhas de armazenamento e configuração da execução externa no endereço público. O preview Ready continua insuficiente sozinho. A leitura de logs/configuração pelo conector continua sem acesso confirmado.

O executor padrão e o kernel Node ainda falham na preparação de ACLs. A execução autorizada fora do sandbox recuperou a leitura e a sincronização local, sem alterar ACLs do sistema. Os dois commits antigos foram preservados na branch local local-preservado-20261007 (head 80be23d); três arquivos não rastreados foram guardados em outputs/preservado-local-20261007, com hashes conferidos e manifest.json. A main local foi criada a partir da origem atual e está limpa. Conferir novamente Git antes de atualizar; não sobrescrever alterações futuras.

## Retomada

A automação continuar-melhorias-do-codelab permanece configurada neste chat. Confira gates de main e PRs abertas, retome o estado existente e comunique somente progresso significativo, falha ou ação necessária. Se um limite impedir publicação, registre o head e o último gate conhecido; retome quando houver disponibilidade. O pedido integral ainda está em andamento enquanto os aprofundamentos e a verificação da implantação estiverem pendentes.


## Python integrado e verificado

Branch: `curriculo-python-iteracao-recursos`, a partir do checkpoint integrado da PR #5. A entrega acrescenta `py-iteracao-recursos`, 17 capítulos, dois problemas independentes e três pausas offline. O catálogo desta branch é 133 aulas/20 trilhas (Python 10, outras linguagens 9), 25 aulas próprias/50 problemas e 616 entradas (139 vinculadas, 477 introduzidas), com 28 atividades corrigíveis.

Os gabaritos incluem bordas de consumo, fonte infinita, limite zero, esgotamento, validação antes da fábrica e fechamento após erro. O verificador inclui quatro programas da aula e três fixtures das pausas. Há navegação dinâmica e estática nos testes e um fluxo novo de pausas offline com persistência e conclusão.

A expansão conserva os 40 ids de conceitos da PR #5 para não invalidar planos iniciados nem conceitos lidos. O head 9525287e92e7584d2599a1dd3f9e5c3b445e489a foi aprovado no run 37677492690: 252 unidade, 131 programas externos, 81 navegador, builds/API, 153 páginas e auditoria sem vulnerabilidades. Integração 8b87854b93ca34e3fda16fb6cc08a87df74c6af9 com árvore 4c6b09542936e9d32ca118b983c4f0d5ea83bb16 idêntica à testada. As contagens descrevem essa entrega, sem currículo exaustivo.


## TypeScript integrado e verificado

Branch `curriculo-typescript-variancia-contratos` parte do head da PR #6 de Python. A dependência Python foi integrada antes. O novo módulo `ts-variancia-contratos` oferece 17 capítulos, quatro programas com saídas esperadas, duas práticas independentes e três pausas offline. Na branch: 134 aulas/20 trilhas, Python e TypeScript 10, demais linguagens 9; 26 aulas próprias/52 problemas; 626 entradas (144 vinculadas/482 introduzidas); 31 atividades corrigíveis.

Testar strict com casos negativos, execução real, diferença método/propriedade, callbacks vazios e erro propagado, restauração offline e páginas estáticas. O head final 0d98f529c39c28dddddc5fb96d352da104d1d9f6 teve 259 testes de unidade, 135 programas externos, 83 testes de navegador, builds/API, 154 páginas e auditoria sem vulnerabilidades no run 37680909578. Integração 7f27f1759c610edbf86d9d61fe1a589b307cc07e, árvore 0547361ce77cf3af0281b1f5379b5cbd886f7c67 idêntica à testada. Não promover readonly, in/out ou todo o ecossistema TypeScript como especialização completa apenas por ter introdução no módulo.

A revisão TypeScript restringiu a substituição de ler/usar via readonly e acrescentou testes negativos dessa permissão. As novas atividades avançadas têm requiredConcepts no catálogo diário para conservar a primeira sessão nos fundamentos; o conceito pode precedê-las no mesmo plano, sem criar domínio pela leitura. Os testes de catálogo e início da sessão foram aprovados no head final.

A correção de sequência diária também cobre as três atividades de iteradores Python publicadas na PR #6; seu desafio de fechamento não deve substituir o desafio de fundamentos na primeira sessão Python. O teste verifica preparação de conceito e plano novo nas duas linguagens.

## Iteradores C++ integrados e verificados

Branch `curriculo-cpp-iteradores-invalidacao`, a partir da integração TypeScript `7f27f1759c610edbf86d9d61fe1a589b307cc07e`. A PR #7 teve 259 testes de unidade, 135 programas externos e 83 testes de navegador aprovados no run 37680909578; sua árvore integrada é a testada `0547361ce77cf3af0281b1f5379b5cbd886f7c67`.

A expansão C++ define 135 aulas/20 trilhas, 27 aulas próprias/54 problemas, 636 entradas (149 vinculadas, 487 introduzidas) e 34 atividades. Python, TypeScript e C++ têm dez aulas; as outras linguagens têm nove. A [PR #8](https://github.com/renancodando/CodeLab/pull/8) foi integrada em `b217be7e63bf0225808117739de2e2011e0831d5`. Head aprovado: `3ecd7fdd147bc9e15057a211f54eb1aee370e57d`; árvore `d35985c0b81b8b28947e2aa23e604b9a0a6f0ad2`, idêntica à testada. O [run 37701742395](https://github.com/renancodando/CodeLab/actions/runs/37701742395) aprovou 263 testes de unidade em 15 arquivos, 142 programas externos, três cenários Git, três cronogramas PostgreSQL, ZIP interoperável, 85 testes de navegador, builds frontend/API e 155 páginas. Auditoria sem vulnerabilidades. Revisão manual concluída, sem threads abertas.

Os resultados cobrem os quatro programas, três fixtures e fluxo offline com reconstrução, persistência e conclusão. Projetos têm rubrica manual; span/views e identidade estável permanecem introduzidos. Esta entrega não conclui o currículo integral.


O CI de main após a PR #7 também foi aprovado no run 37700233574. O checkpoint final tem seu próprio run e deve ser conferido quando concluir.

## Correção Windows em revisão

O build local após sincronização encontrou um falso desatualizado no índice: o checkout usa CRLF, enquanto o gerador produz LF. A branch `fix/indice-crlf-windows` normaliza apenas CRLF na comparação --check, preservando diferenças de conteúdo, formato e contagens. Dois testes executam o gerador em fixtures LF/CRLF e exigem falha em metadados e matriz realmente divergentes. Ambos passaram no Windows; o build local ultrapassou índice/matriz e TypeScript, e está concluindo a geração dos assets.

Conferir a PR de portabilidade e seu CI completo antes de integrar. O catálogo permanece com 135 aulas e 34 atividades; esta correção não amplia cobertura curricular nem comprova implantação integral.

## Propriedades JavaScript em preparação

Branch `curriculo-javascript-propriedades-descritores`, a partir da correção Windows `bc291e4bba41c06637d714d5925e1dc9ba784381` (PR #9). Integrar primeiro essa dependência após CI completo. Novo módulo `js-propriedades-prototipos`: 17 capítulos, quatro programas com asserts e saídas, dois problemas independentes, previsão, escolha e debugging executado.

Na branch: 136 aulas/20 trilhas, 28 aulas próprias/56 problemas, 646 entradas (155 vinculadas, 491 introduzidas), 37 atividades (cinco JS executadas, 32 conceituais). Python, TypeScript, C++ e JavaScript têm dez aulas; as outras quatro linguagens têm nove. Quatro programas passaram em Node.js durante autoria; validar também QuickJS, casos específicos e fluxo offline/persistência no CI antes de integrar.

A pré-condição dos exemplos exclui Proxy e não é detectada pelo validador. Não declarar sanitização genérica, freeze profundo ou projetos automaticamente aprovados. A verificação pública C++ passou após a PR #8 (17 capítulos, três pausas, correção e persistência, sem pageerror/requestfailed nesse cenário). O fluxo Python público também passou offline. Os demais fluxos de produção continuam no mapa de 17 frentes.


## Integrações verificadas em 8 de outubro

PR #9 integrada em ee5436648f8f878200220912003023619ec20ede, com árvore f50f3635f6878c94ad705eb9885c95fe3b814265 idêntica ao head bc291e4bba41c06637d714d5925e1dc9ba784381. Run [37705378788](https://github.com/renancodando/CodeLab/actions/runs/37705378788): 265 testes unitários, 142 exemplos externos, 85 fluxos de navegador, builds/API e auditoria aprovados. O build local Windows também concluiu as 155 páginas.

PR #10 integrada em e04b385c18ac60b1d119670edb19c0ab73d2d01e, com árvore 5b3f2918d52f4f701e85675ede23b26b15318752 idêntica ao head baa3a7759095d646c5b57339d81a7ea7094bf29d. Run [37707217346](https://github.com/renancodando/CodeLab/actions/runs/37707217346): 275 testes unitários em 16 arquivos, 142 exemplos externos, três cenários Git, três cronogramas PostgreSQL, ZIP, 87 fluxos de navegador, 156 páginas, builds/API e auditoria aprovados. O fluxo novo verifica erro, feedback específico sem solução automática, correção executada no QuickJS, retomada offline e conclusão persistida. Nenhuma thread de revisão aberta na integração.

O checkpoint anterior de main, run 37704436528, falhou por timeout de 180 segundos no fluxo interativo de 25 passos, com 84/85 testes aprovados. As duas suítes completas posteriores passaram esse fluxo sem ampliar o timeout. Registrar qualquer recorrência e investigar o trace; não apresentar aquele run como aprovado. Os CIs disparados pelas integrações #9/#10 e por este checkpoint devem ser conferidos na próxima retomada.

As seções “em revisão” e “em preparação” acima registram a sequência histórica; as integrações desta seção são o estado atual. Continuam 17 frentes amplas abertas, sem contagem finita auditada das aulas futuras. A implantação pública segue parcialmente verificada.

## Validação local da prática de iteradores

Passaram 470 testes unitários em 31 arquivos, strict/build, dez cenários .NET 10 e o fluxo Edge offline (23,2 s; 25,6 s total). A referência preserva solução assistida, tentativas anteriores, respostas após reload e ausência de overflow em 220/4000 px. O bundle inicial está em 190,42 kB gzip; o mundo mantém 135,94 kB e carregamento sob demanda. São 64 atividades no catálogo desta branch, em 50 aulas; 61 estão publicadas na main. Exigir o gate completo do commit publicado e conferir revisões antes de integrar.


## Validação de navegador das caixas CSS

Os dois fluxos Edge passaram depois do ajuste do rótulo (1,4 s referência nativa; 22,7 s produto; 26,0 s total). A referência confere bordas 150/120/30 px, falha com mínimo automático, identificador inteiro sem recorte, texto vazio e posição do cabeçalho antes/depois de scrollTop 80 em 200/220/375/4000 px. O produto confere respostas, assistência, evidências offline e layout 220/4000 px. Essas evidências locais não substituem o CI completo nem a implantação deste head.


## Artefatos completos nos testes de navegador

O run 38065369704 do head 99604b5 aprovou 498 testes de unidade, exemplos, builds e auditoria. Os grupos de navegador passaram 61/61 e 61/62: a API de catálogo falhou porque o novo job recuperava dist, mas não server/Content/curriculum.json, gerado pela pré-renderização e ignorado no Git. O artefato agora transporta os dois destinos com a raiz preservada; a suíte continua exigindo o catálogo completo. Não considerar aquele run verde. As duas execuções antigas da PR #25 esgotaram o limite de 40 minutos. A PR #28 contém integralmente os commits das PRs #25–#27; integrar esse conjunto somente no novo head após os quatro jobs completos, revisão e comparação da árvore, preservando os commits separados.

## Bancada Git em validação

Branch pratica/git-preparacao-interativa, a partir da PR #28 corrigida. A primeira etapa Git acrescenta manipulação de trabalho/preparação/HEAD e histórico linear, sem retirar as três etapas existentes. A representação é declaradamente didática, sem acesso ao sistema de arquivos ou execução de comandos do aluno. O catálogo continua com 70 atividades/52 aulas; este experimento não infla a métrica das oito linguagens.

Passaram 520 testes de unidade em 34 arquivos, strict/build e cinco cenários Git reais. O build gerou 157 páginas e 33 recursos offline. A bancada tem chunk próprio de 3,00 kB gzip; inicial 193,19 kB e mundo 135,94 kB. O primeiro teste de 220 px identificou o input da mensagem fora da largura; os campos agora usam coluna e sizing intrínseco, preservando texto e ordem. Validar retomada offline, assistência, importação/exportação, rascunho incompatível e recuperação depois de quota real, além do CI completo antes de integrar.

Os três fluxos Edge passaram (1,2 min): objetivo com erro/acerto, comparação visual, assistência, backup/importação e retomada offline; rascunho incompatível preservado; falha real de quota com exportação do estado em memória. A extensão do último cenário também passou (24,7 s): o checkpoint armazenado ficou intacto, a quota foi liberada, o estado em memória reapareceu, o salvamento voltou e o reload conservou a edição. A listagem completa confere 126 fluxos = 65 + 61, sem omissões/duplicações. Exigir o CI do novo head e verificar o domínio antes de chamar esta bancada publicada.

## Integrações de prática e bancada Git em 10 de outubro

A PR #28 foi integrada em e334e4d051d104b1c17386dc030e7e191e19375b. O head 74a8b42fdeab5995e12db4d8e02c466d40582289 teve os quatro jobs aprovados no run 38066654363: 498 testes de unidade, 161 exemplos externos, oito projetos TypeScript, sete cenários C++20, doze PostgreSQL, dez .NET, três Git e 123 fluxos de navegador (62 + 61). A árvore b6354b9dcc976e9c627eee8b77e07817ea5be7ff corresponde ao head testado. Os commits separados das PRs #25–#27 foram incorporados integralmente; as duas tentativas anteriores da PR #25 esgotaram tempo e não são evidências de aprovação.

A PR #29 foi integrada em 336474045445ae383331ce843805f74a7ef14bf9. Run 38066981361 do head b6dd6f5906fbe606b9cf11368cee25e205b13b91: 520 testes de unidade em 34 arquivos, cinco cenários Git reais e 126 fluxos (65 + 61), além dos mesmos exemplos, builds e auditoria. Nenhuma thread aberta; árvore fe1933b61f5728d0693dc40cd70aad19bad6a585 igual ao head aprovado. Main contém 70 atividades em 52 aulas, mais o experimento Git, sem somá-lo à métrica das oito linguagens. Permanecem 85 aulas sem pausas. A verificação do deployment/SHA e dos novos fluxos públicos está em andamento; não confundir integração com prova de implantação.

## Validação local do experimento HTTP

O motor tem 23 testes determinísticos: perda de resposta antes/depois do efeito, repetição da intenção, chave ausente/nova, conflito de conteúdo, chegadas simultâneas/invertidas, 429/503, prazo exato e um milissegundo depois, equivalência entre passos, importação reproduzida e limites. Strict e build passaram; chunk HTTP separado com 3,48 kB gzip, inicial 193,19 kB e mundo 135,94 kB; 157 páginas e 34 recursos offline. As referências específicas e o aprofundamento sobre validade/atomicidade da chave e repetição limitada foram mantidos na etapa existente.

A suíte local completa terminou com 535/543 aprovados: oito timeouts em seis compilações TypeScript, limite de memória e geração de métricas. Nenhuma dessas falhas deve ser registrada como aprovação. Repetir esses três arquivos sem os navegadores e exigir o CI completo do novo head; limites não foram ampliados. Os três fluxos HTTP passaram após mover as verificações de largura para o fim do fluxo de backup: 45,8/31,7/27,3 s. O primeiro fluxo anterior esgotou 120 s no clique após importação em viewport de 4000 px; não foi uma divergência das reservas. Continuam sendo verificados offline, assistência, importação/exportação, ações reproduzidas e 220/4000 px. Não tratar isso como medição de FPS em celular físico.

## Verificação publicada das PRs #28/#29

Deployment dpl_2pHrvaTdUW4kGSZfXdNQYaTjDAqS READY/production com gitSource.sha 336474045445ae383331ce843805f74a7ef14bf9 confirmado pela API da hospedagem. A execução pública dos doze fluxos aprovou onze e falhou na espera de download do laboratório. O teste repetia uma operação com efeito dentro de expect.poll, cujo limite era cinco segundos. Agora cada troca síncrona gera uma única exportação e comparação; o cenário corrigido passou isoladamente (30,3 s, 1,3 min total). A primeira execução pública permanece registrada como 11/12; o conjunto de cenários foi coberto pelas duas execuções. Nenhuma correção no código do laboratório foi necessária neste recorte. Exigir o CI do teste alterado junto ao HTTP.

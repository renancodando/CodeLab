# Continuidade do CODELAB

## Revisão da correção SQL: consultas não alteram a base

A revisão #46 demonstrou que DELETE seguido de um relatório podia passar ao modificar a entrada. O preparo agora chega separado do SQL do aluno. O motor prepara a base, ativa query_only e usa o parser SQLite para exigir uma única consulta SELECT/WITH antes de percorrer o resultado. Comentários e ponto e vírgula em literais continuam válidos; transações, PRAGMAs, comandos extras e alterações de dados são recusados. WITH seguido de DELETE também encontra a guarda nativa de escrita. O laboratório livre preserva seus scripts, transações e alterações: esse recorte só é ativado pela base de um exercício.

Passaram 134 testes específicos em quatro arquivos, incluindo a reprodução da revisão, mutações antes/depois da consulta, comentários/CTE, a proteção nativa e o laboratório anterior. Strict/build passaram: 157 páginas, 38 recursos essenciais e seis opcionais; inicial 212,55 kB gzip, mundo 135,92 kB gzip. O primeiro CI do head 55565d5 passou nos testes/compilação e nas oito bases PostgreSQL, mas não aprova o head revisado. Os sete fluxos Edge locais passaram em 1,6 min, incluindo a tentativa de alterar a base e a regressão do laboratório. Revisão e CI completo do novo commit devem ser conferidos antes de integrar.

Referências: [parser sql.js](https://sql.js.org/documentation/Database.html#iterateStatements) e [query_only](https://www.sqlite.org/pragma.html#pragma_query_only). A guarda limita o contrato dos exercícios; os casos e a implementação continuam inspecionáveis no cliente.

## Escopo de conclusão definido em 12 de outubro

A orientação humana atual fixa esta edição no catálogo existente: aprofundar e distribuir prática nas 137 aulas, nos seis percursos e nos oito projetos, sem aumentar o catálogo por quantidade. O trabalho começa pela integração das entregas pendentes, depois reduz as aulas sem pausas por prioridade pedagógica. Uma pausa não encerra uma aula nem uma linguagem. Leitura não gera domínio; assistência, evidência conceitual, execução real e revisão continuam distintas.

A conferência inicial encontrou main em 34f4b20021d834c7e707faae539fd3bb7aea975b, nenhuma PR aberta e #42–#45 integradas, sem revisões pendentes. O CI pós-merge 38308942394 passou. O deployment dpl_f4P9i2Brgco2c7sWyN1FNgajgimP está READY/production com gitSource.sha igual a main e alias code-lab-omega.vercel.app conferido. As novas consultas SQL ainda são locais neste registro. Contagens correntes devem ser lidas em metricas-catalogo.md; números e gates abaixo são históricos de cada entrega.

## Prévia HTML integrada e publicada em 12 de outubro

A PR #45 foi integrada em 34f4b20021d834c7e707faae539fd3bb7aea975b. Árvore 7faa897393a61849a80202c569cb6b7de3278fe9 idêntica ao head d1f049c403c02ce104a2b9e2e0e943df0b597a19 e ao merge previsto, com pais conferidos. O CI 38306042949 passou: 798 testes unitários em 53 arquivos, 157 testes de navegador (70/39/48), 194 exemplos externos e os cenários adicionais de compiladores, PostgreSQL, Git e API/cache. Não havia revisão aberta. Main local foi sincronizada por fast-forward.

Deployment dpl_f4P9i2Brgco2c7sWyN1FNgajgimP READY/production, gitSource.sha e alias conferidos. Os três fluxos HTML passaram no domínio em 2,0 min: isolamento, substituição/reexecução/parada/troca/saída e rejeição acima do limite. Falhas anteriores continuam registradas; os parágrafos seguintes preservam o histórico, inclusive seus gates então pendentes. O currículo e as fontes ambientais restantes não foram declarados concluídos.

## Correção SQL por execução em preparação

Dois desafios da aula sql-joins-cardinalidade passam a executar consultas do aluno em SQLite descartável: preservar clientes sem pedido pago e combinar totais sem multiplicar coleções. Cada um possui quatro bases, com chaves diferentes, repetições legítimas, ausência de coleções e conjunto vazio. O verificador compara uma única tabela, cabeçalhos, ordem e valores, aceitando soluções alternativas por comportamento. Dez consultas incorretas são diferenciadas por testes reais, sem entregar o gabarito no feedback.

Carregamento e execução mantêm fases separadas. Falta de runtime/rede não registra tentativa nem domínio; sintaxe, resultado, tempo e limites são erros da consulta. Alterar a resposta ou sair cancela o worker, e mensagens tardias não recriam temporizadores. Carregamento sob demanda, limites de SQLite/saída/CPU, progresso local e assistência permanecem. Não há execução remota ou rede fornecida ao SQL do aluno. Os casos reservados são inspecionáveis no cliente; isso não é correção inviolável nem prova formal.

O lote específico aprovou 126 testes em quatro arquivos, incluindo os corretores existentes, SQLite real e classificação das falhas. A regressão completa executou 831 testes: 828 passaram e três casos existentes expiraram (compilação strict, limite de memória QuickJS e geração de métricas). Os três passaram isoladamente, com os mesmos limites, em 16,4 s; a tentativa completa com falhas permanece registrada e o CI do head ainda é obrigatório. Um protótipo externo anterior conferiu 22 combinações/controles e 12 contratos do corretor; não foi contado como recurso publicado. O verificador externo recebe oito bases PostgreSQL temporárias para conferir os gabaritos compartilhados; no navegador a execução é SQLite, sem alegar suporte a extensões PostgreSQL. Strict/build passaram: 157 páginas, 38 recursos essenciais e seis opcionais; inicial 212,55 kB gzip e mundo 135,93 kB gzip. A conferência SQL fica em módulo sob demanda (2,80 kB gzip); SQLite/Worker/WASM continuam opcionais. Sete fluxos Edge locais passaram em 1,1 min: laboratório anterior e novos desafios, alternativas, erro/acerto, offline preparado, assistência sem apagar evidência independente, persistência, 220–4000 px, limites, cancelamento e módulo indisponível com retomada. A primeira execução teve uma expectativa incorreta sobre assistência; o teste foi ajustado ao contrato existente, sem alterar o domínio. CI e publicação próprios continuam pendentes.

## Substituição da prévia HTML validada localmente

A execução de outro HTML válido substitui srcdoc diretamente, sem navegar antes para about:blank. Parar, trocar de linguagem, sair da rota e rejeitar HTML acima de 30.000 caracteres continuam limpando a prévia e cancelando a execução. Sandbox, CSP, bloqueio de rede, referrerpolicy e limites permanecem iguais.

Strict e build passaram: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 211,02 kB gzip e mundo 135,94 kB gzip. Três testes Edge locais passaram em 1,3 min: isolamento, substituição/reexecução/parada/troca/saída e rejeição acima do limite. Os testes aguardam um sinal do novo documento, conferem sua origem e verificam também o conteúdo efetivo. O diagnóstico de falha tem prazo próprio para preservar o erro original.

A primeira tentativa de sincronizar por framenavigated falhou mesmo com o novo documento visível; isso não foi contado como aprovação. A navegação intermediária foi removida e a sincronização agora observa a execução do documento. A causa exata da intermitência anterior não foi isolada. CI completo, revisão e publicação desta correção ainda serão conferidos antes da integração.

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


## Python: contratos, testes e ordem em preparação

py-engenharia conserva suas seis seções, exemplo unicos, exercício media e projeto com pyproject.toml. Recebe pausas após os blocos 3/4/5: prever o que uma anotação não impõe em execução, diagnosticar um teste que passa sem chamar o código quebrado e completar o índice que preserva a primeira ocorrência. As respostas são conceituais e offline; não executam Python do aluno nem representam validação estática ou benchmark.

A solução anterior definia TestMedia sem rodar seus testes quando executada pelo verificador. Agora inclui o ponto de entrada unittest.main e casos de iterável e NaN/infinidades, conservando a função e os testes anteriores. Passaram 32 testes específicos e 11 programas Python reais: nove cenários novos, exemplo com dois testes executados e solução com quatro. Os cenários distinguem teste fraco, contexto não usado, teste que detecta o retorno errado, implementação corrigida e exceção de tipo errado. A ordem estável é conferida em combinações, vazio, strings distintas, preservação da entrada e chamadas independentes. Isso comprova os casos testados, sem provar performance.

Branch: 97 pausas em 59/137 aulas, 78 sem pausas; as dez aulas do percurso Python passam a ter ao menos uma pausa nesta branch. Isso não conclui Python: pacotes, distribuição instalada, ferramentas estáticas, profiling e aprofundamentos dos tópicos agrupados permanecem no mapa. Exigir strict/build, navegador, CI e integração após #41. A publicação conferida é 91/57/80 após os fluxos públicos de #40; #41 e esta etapa ainda exigem gates próprios.

Referências oficiais: [typing](https://docs.python.org/3/library/typing.html), [unittest](https://docs.python.org/3/library/unittest.html) e [assertRaises](https://docs.python.org/3/library/unittest.html#unittest.TestCase.assertRaises).


## Python: corrotinas, cancelamento e filas em preparação

py-concorrencia conserva suas seis seções, exemplo TaskGroup/Semaphore, exercício mapear_limitado e projeto de coletor. Três pausas após os blocos 2/3/4 distinguem criação de corrotina e execução; diagnosticam CancelledError transformado em sucesso; completam envio que aguarda vaga em uma Queue limitada. A teoria separa limpeza, propagação, operações ativas e trabalho pendente. Ler não gera domínio; abrir solução é assistência. As respostas continuam conceituais e offline, sem executor Python do aluno.

Passaram 35 testes específicos e dez programas com Python 3.14.6: oito cenários novos, o exemplo preservado e a solução anterior com lista vazia, zero/negativos/repetições e limite inválido. Os cenários usam Events, capacidade da fila e passagens explícitas pelo loop; não usam rede ou atrasos positivos estimados. Conferem o defeito original, propagação e limpeza, pass que suprime cancelamento, QueueFull sem espera, produtor cancelado sem perda do item anterior e falha TaskGroup que cancela a irmã e conclui sua limpeza. Nenhum build free-threaded, paralelismo com processos ou medição de performance foi comprovado por esses casos.

O primeiro verificador local expirou antes de imprimir o primeiro resultado; uma importação isolada de asyncio confirmou inicialização lenta e concluiu. Repetição após isso passou nos dez programas, conservando o limite de 10 s por programa. Não se aumentaram limites de execução do produto ou testes para obter aprovação. Exigir strict/build, navegador, CI e integração após #40. Branch: 94 pausas em 58/137 aulas, 79 sem pausas; produção conferida permanece 88/56/81.

Referências oficiais: [corrotinas e tarefas](https://docs.python.org/3/library/asyncio-task.html), [cancelamento](https://docs.python.org/3/library/asyncio-task.html#task-cancellation) e [filas assíncronas](https://docs.python.org/3/library/asyncio-queue.html). As APIs usadas existem desde Python 3.11 ou antes; a documentação atual também descreve recursos posteriores que não foram introduzidos nesta etapa.


## Python: divisão, conservação e entrada ASCII em preparação

A aula py-numeros-texto mantém suas seis seções, exemplos, exercício de rateio e dois problemas independentes. Recebe três pausas após os blocos 2/3/5: prever piso e resto com dividendo negativo; diagnosticar perda de centavos sem trocar distribuição justa por simples conservação da soma; completar a fronteira de dígitos ASCII antes de converter. A teoria prepara as invariantes e distingue isdigit de um contrato restrito. A preparação diária é obrigatória; leitura não gera domínio, solução é assistência e respostas permanecem locais.

As respostas dessas pausas são conceituais e funcionam offline; nenhum Python do aluno é executado. O verificador compartilhado executa oito cenários de referência com Python real: saída prevista, defeito original, conservação/ordem/diferença/independência, resto concentrado incorreto, fronteiras ASCII, aspas equivalentes, Unicode aceito por isdigit e conversão sem validação lexical. Inclui zero, menos centavos que pessoas, inteiros grandes, limites, sinais, espaços e rejeição de entradas inválidas. Localmente passaram esses oito programas e os quatro exemplos/soluções anteriores da aula, com Python 3.14.6. Não comprova produção independente do aluno ou execução no navegador. Exigir suíte, build, navegador, CI e publicação próprios antes de integrar.

Referências oficiais: [operações numéricas e piso](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex), [dígitos Unicode e isdigit](https://docs.python.org/3/library/stdtypes.html#str.isdigit) e [Decimal e construção a partir de texto](https://docs.python.org/3/library/decimal.html). Não encerra números, Unicode, arredondamento financeiro ou a linguagem Python.


## Publicação conferida em 12 de outubro

Valores (#37) e decisões (#38) foram integrados com árvores iguais aos heads aprovados. Valores: CI 38174480235, 671 testes unitários e 148 fluxos de navegador; merge deb99ffae40fcc74c47a2886765735fd1527c927; árvore a787c859ca40cf5320e12d62b286db4594d79ff1; deployment dpl_FxFRYoSCcEFJJwNsta8eJovr5vof READY/production com esse SHA, dois fluxos públicos aprovados em 1 min. Decisões: CI 38175247548, 684 unidades e 149 fluxos; merge 8ae9ebe535e045e0e39c975e861decad540cb70b; árvore ede2d2533d25d8b2149f80cc794f70e3c329509e; deployment dpl_2XYB6FRC693e4ThYsgC4D7XfXVdX READY/production com esse SHA, dois fluxos públicos aprovados em 2,5 min. Revisões resolvidas, incluindo a navegação da preparação para a leitura de valores sem substituir o percurso de 25 passos.

Cobertura publicada: 88 pausas em 56 das 137 aulas principais; 81 ainda sem pausas deste catálogo. Missões, experiências Git/HTTP e os 25 passos próprios de valores ficam fora dessa contagem. A PR #39 também foi publicada: CI 38255384773 aprovado no head 430d0cd27b07057ca85c522f118cd919e1806b08 com 690 unidades e 150 fluxos; merge 20dd5898765cb5b7a34230fd300e43d130fb915a, árvore 16ce668b8c22f5ddda69370d854b475cd9f65f1a igual. Deployment dpl_8D5VkrUT9FwGehVs1WSFhVrjb26G READY/production com SHA confirmado; dois fluxos públicos aprovados em 1,8 min. Ordena novos conceitos pela progressão sem trocar planos iniciados, IDs, pré-requisitos ou atribuir domínio à leitura.

O CI de main 38170698880 terminou com os quatro jobs aprovados após repetir uma falha anterior ao checkout, causada pelo limite de dados da imagem pública PostgreSQL. Não houve alteração de código para contornar o problema. Esses resultados não encerram o currículo nem medem FPS em celular físico.


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

## Gates HTTP e aprofundamento de posse C++

A PR #30 está aberta no head ed7acb26e6670b82e224a934577a34c66260885a. O run 38085602449 aprovou os 543 testes de unidade em 35 arquivos, os exemplos/compilações e a auditoria; as duas parcelas de navegador continuam em execução. A partição de 129 cenários foi conferida como 68 + 61, sem omissões nem duplicações. A repetição local dos três arquivos lentos terminou com 34/43 aprovados e nove timeouts; não é aprovação local. Os limites foram mantidos. O CI da main 3364740, run 38083869423, terminou com todos os quatro jobs aprovados.

A branch pratica/cpp-vida-posse prepara três novas pausas na aula cpp-memoria-posse, mantendo a atividade anterior cpp-iterador-invalidado no bloco 5. Há 28 testes específicos/de catálogo aprovados após corrigir uma expectativa que omitia essa atividade anterior. As métricas geradas são 73 atividades em 52 aulas; 85 continuam sem pausas. Nenhuma linguagem está encerrada por essa ampliação.

O verificador C++ adiciona oito cenários com g++ C++20. Localmente, a primeira tentativa excedeu tempo na compilação negativa; a segunda confirmou a recusa do dono constante, mas excedeu tempo no caso modificável. Os limites de compilação não foram ampliados. Exigir os oito casos completos no CI e o fluxo de navegador offline antes de integrar; testes conceituais não substituem compilação. O retorno incorreto de string_view é barrado por static_assert de tipo, sem executar acesso pendente.

## Correção da chegada HTTP em 11 de outubro

A revisão da PR #31 encontrou uma diferença entre chegada e conclusão: uma tentativa lenta podia perder a identidade para uma tentativa posterior. O motor agora reivindica a chave pela chegada, separa esse instante da conclusão e faz repetições idênticas aguardarem o efeito original. Conflitos de conteúdo recebem 409 mesmo enquanto o primeiro processamento está pendente; 429/503 injetados não reivindicam a chave. Os 28 testes HTTP passaram localmente, incluindo chegadas invertidas, processamento lento, conflitos e equivalência dos passos. Exigir novo CI do head corrigido antes de integrar a PR #31; o run anterior aprovado não valida esta correção.

## SQLite local e revisão HTTP em 11 de outubro

HTTP #30 integrado em 3b04fe4b8f2a056517983e9261bf86f1139af003, árvore 50c796e94b5d25da07122a8ccdc83885df2b1397. Run 38085602449 completo: 543 unidades e 129 fluxos (68 + 61), compiladores/PostgreSQL/API/cache/auditoria. Deployment dpl_DNWbAZ9exSqN8mRcWaSp2h8SE2wf READY/production com esse SHA; três fluxos HTTP passaram no domínio (1,0 min). A revisão tardia de chegada/conclusão foi corrigida em 014e745 e o caso 429/503 em 2657a51; os 29 testes HTTP passaram e a thread foi resolvida. Exigir run final 38143642894 antes de integrar #31; runs anteriores não validam o último commit.

SQLite 1.14.2 por sql.js e tipos 1.4.11 foram fixados. Há 21 testes com mecanismo real e cinco do service worker gerado aprovados; strict/build e audit passaram. Três fluxos Edge passaram (28,0/25,8/9,3 s; 1,1 min), incluindo uso sob demanda, SQL real, tipos/HTML seguro, banco descartável, offline, backup e 220/4000 px. O cancelamento ampliado passou isoladamente em 31,3 s. A tentativa inicial usou o build anterior durante a compilação; não conta como aprovação.

Build inicial: 195,43 kB gzip, mundo 135,94 kB, WASM SQL 658,41 kB (322,99 kB gzip), Worker SQL 41,89 kB, carregador 0,94 kB. Os três recursos SQL estão fora dos 34 essenciais do precache. Consultas offline dependem de primeiro carregamento/cache e podem exigir novo carregamento após atualização. O limite de 8 MiB é do alocador SQLite, não da memória total do navegador. SQL não muda métricas de aulas ou comprova PostgreSQL. Exigir CI do head SQL, revisões, árvore e domínio.

## Preparação HTML de dados e validação

A branch pratica/html-envio-validacao acrescenta três pausas conceituais em html-dados-formulario: presença de controles, multiplicidade e limpeza de customError. Conserva a prática de label e ordenação, os seis blocos de teoria, dois problemas independentes e projeto. O recorte inclui novos parágrafos originais e modelos que não inventam seleções nem confundem readonly com disabled.

Os 58 testes específicos (15 HTML, 17 de catálogo, 21 SQLite e cinco de cache) passaram após corrigir duas expectativas do teste novo: a ordem interna do catálogo e os argumentos reais da sessão diária. Strict/build passaram. Os dois fluxos HTML Edge passaram em 10,0/40,8 s, incluindo gabaritos nativos, falhas seguidas de correção, assistência, recarga offline e 220/4000 px. A mesma execução comprovou que o novo cenário SQL detecta a falta de prazo na importação do build anterior. A correção SQL passou após recompilar: seis fluxos SQL/HTML aprovados (3,9 min), incluindo importação retida com prazo/cancelamento/resposta tardia. CacheStorage real sem SQL no precache também passou isoladamente (1,4 min). O head SQL b3106c1 exige novo CI.

As métricas geradas da preparação HTML são 76 atividades, ainda em 52/137 aulas; 85 aulas continuam sem pausas. Exigir CI do head, revisões e verificação publicada antes de considerar essa ampliação integrada. O laboratório TypeScript, experiências Git/HTTP adicionais e aprofundamentos continuam pendentes.

A PR #31 foi integrada em 06defa49b36a8debcd5aecac4092ce91aa154bf3, árvore 2b93cfa077da522b59c61b327f6d794df83c6cc2 igual ao head 2657a51. Run 38143642894 completo: 560 unidades em 36 arquivos, oito cenários novos C++20 e 130 fluxos (65 + 65), compiladores/PostgreSQL/API/cache/auditoria. Nenhuma revisão aberta. Deployment e fluxos públicos em verificação; SQLite e HTML não estão antecipadamente integrados. Main local foi sincronizada por fast-forward sem trocar a branch de trabalho.

## Persistência imediata de assistência HTTP

A PR #31 foi integrada em 06defa49b36a8debcd5aecac4092ce91aa154bf3, árvore 2b93cfa077da522b59c61b327f6d794df83c6cc2. O run 38143642894 aprovou 560 unidades e 130 fluxos em duas parcelas de 65, além dos compiladores, PostgreSQL, API e auditoria. A hospedagem confirmou esse SHA no deployment dpl_2vmHCMy5dVm7Lo9nErkcVi9BAtdL, READY/production; os quatro fluxos públicos C++/HTTP passaram (2,1 min).

Os runs 38146266563 (#32) e 38146478584 (#33) falharam no registro de assistência ao abrir a solução HTTP e recarregar imediatamente. O evento toggle podia chegar depois da saída. A abertura pelo summary agora registra a consulta no próprio clique, mantendo toggle como fallback para abertura programática. O teste confere o armazenamento no mesmo ciclo do clique, antes de qualquer espera ou reload; ele reproduziu false no build anterior. Esses runs com falha não autorizam integração. Exigir novos heads, CI completo, revisões, árvore e domínio.
Os três fluxos HTTP passaram no build corrigido (14,9 s), incluindo a verificação síncrona, reload, backup/importação, uso offline e 220/4000 px. Strict e build passaram; os limites de tempo não foram ampliados.


## Entregas verificadas em 11 de outubro

As PRs #31, #32 e #33 estão integradas, com revisões resolvidas e árvores iguais aos respectivos heads aprovados. A #31 passou no run 38143642894 (560 unidades, 130 fluxos), a #32 no 38148827540 (586 unidades, 134 fluxos) e a #33 no 38148866512 (601 unidades, 136 fluxos), além de compiladores, PostgreSQL, API, cache meteorológico e auditoria.

A hospedagem confirmou READY/production e gitSource.sha para cada integração: 06defa49b36a8debcd5aecac4092ce91aa154bf3 em dpl_2vmHCMy5dVm7Lo9nErkcVi9BAtdL; 941c388aba6a4c3db9b583ff33a7725abbd8f7e4 em dpl_AvwMwTo3fYqH4Do8mejG5u2b81ri; 0e54bff8b268a474105bbc2010ae1e29534839ac em dpl_3ZMbTaoRW6hD41akeDAgmSdj3uEM. Os quatro fluxos públicos C++/HTTP passaram (2,1 min). SQL aprovou três dos quatro no primeiro lote; o cenário restante de consultas/backup/offline passou isoladamente (56,1 s), após uma falha de espera de abertura do editor. Não foi um único lote 4/4. Os dois fluxos HTML passaram no domínio (1,0 min), incluindo validade nativa, assistência, offline e larguras extremas.

A edição publicada tem 76 atividades corrigíveis em 52 das 137 aulas principais; 85 aulas ainda não têm pausas. Esta contagem não inclui os experimentos Git/HTTP, nem transforma projetos de revisão manual em atividades corrigidas automaticamente. As linguagens e as frentes curriculares continuam abertas.

## Laboratório TypeScript em validação

O compilador oficial 5.9.3 usa strict/noEmitOnError e bibliotecas ES2022 locais em Worker descartável. O Monaco recebe diagnósticos reais e a interface mostra o JavaScript emitido antes de executar no QuickJS existente. Tipos não concedem DOM/rede nem substituem validação em runtime. São preservados limites, rascunhos separados, projeto.ts, backup e isolamento. Os dois recursos do compilador ficam fora do precache essencial; primeiro uso exige conexão/cache. Não há promessa de limite absoluto do heap do compilador ou medição de celular físico.

Há 34 testes específicos aprovados; a suíte local completa anterior teve 621/629 e oito timeouts herdados, sem aprovação nem ampliação desses limites. O novo fluxo de abertura do editor tem prazo de 20 segundos, exportação da fonte preservada durante falha e recuperação por reload; respostas tardias não montam uma bancada abandonada. A revisão de navegador final e o CI deste head ainda são obrigatórios.


A validação final contra o build concluído aprovou as seis histórias TypeScript em 5,3 min: diagnósticos/emit/isolamento; projetos/backup/offline/220–4000 px; cancelamento/CPU/memória/edição/saída; primeiro uso offline; prazo do módulo; e prazo do editor com exportação sem Monaco e recuperação após reload. A compilação TypeScript e a execução QuickJS foram reais. Esta prova local não substitui CI completo, revisão, árvore e conferência do domínio.


## Importação JavaScript com prática própria

A preparação em pratica/js-importacao-atomica liga três pausas a js-modulos-engenharia, antes sem atividades corrigíveis: prever perdas no transporte JSON, depurar a confirmação de uma importação e escolher apresentação como texto literal. A depuração executa sete contratos no QuickJS, incluindo falha depois do primeiro registro, lista vazia, 100/101 registros, SyntaxError e nova tentativa. As outras duas pausas continuam conceituais; a referência JSON foi executada e o trecho DOM tem teste nativo próprio. Preserva seis blocos, exercício e projeto anteriores.

Os 74 testes específicos passaram, incluindo rejeição de soluções frágeis e aceitação de outra implementação válida. Métricas geradas da branch: 79 atividades em 53/137 aulas, com 84 ainda sem pausas. Essas métricas ainda não são publicação. Exigir build, dois fluxos de navegador, CI completo, revisão, árvore e domínio. Não há novo runtime ou permissão de rede. A PR #34 TypeScript precisa concluir seu CI corrigido antes desta integração dependente.

Referências: [JSON.stringify na especificação ECMAScript](https://tc39.es/ecma262/multipage/structured-data.html#sec-json.stringify) e [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent). Os comportamentos usados são conferidos no mecanismo e no navegador; não dependem de novos recursos do draft.


Strict/build passaram: 157 páginas, 35 recursos essenciais e cinco opcionais sob demanda; inicial 199,82 kB gzip e mundo 135,94 kB. Os dois fluxos Edge passaram (47,0 s), incluindo referência DOM real, depuração executada offline, erro/acerto, assistência, recarga e 220/4000 px. As primeiras validações detectaram uma literal de gabarito e um parêntese extra no caso de borda novo; ambos foram corrigidos antes dos 74 testes e dos fluxos aprovados. Exigir agora CI completo e revisão do head publicado, integração posterior à PR #34 e conferência do domínio.


## TypeScript e importação verificados no domínio

As PRs #34/#35 foram integradas com árvores iguais aos heads aprovados. TypeScript: run 38163020418, 632 unidades e 142 fluxos; merge 147658af86c04c94a1a894e8aa04bc024d237835, deployment dpl_3c5ETa3xqZdb54aXPe7phvhz4PfG READY/production com esse SHA e seis fluxos públicos aprovados em 4,6 min. Importação JavaScript: run 38163600601, 644 unidades e 144 fluxos; merge e0e15e5d18e405cf8f5ab1f6376d36720022a548, deployment dpl_9S2Jqs52jZS4wCNuCZuemiYqfHwE READY/production com esse SHA e dois fluxos públicos aprovados em 1,3 min. Revisões resolvidas. Incluem compiladores, PostgreSQL, API/cache e auditoria; não encerram currículo, módulos TypeScript ou medição em celular físico.

A edição publicada tem 79 atividades corrigíveis em 53 das 137 aulas principais; 84 aulas ainda não possuem pausas. Os números novos da branch de fundamentos só serão publicação após seus próprios gates.


## Fundamentos de laços em preparação

A aula original repeticoes recebe três pausas nos capítulos de raciocínio, previsão e investigação: rastrear condição/corpo/avanço, corrigir a soma inclusiva e escolher uma condição que realmente se aproxima da parada. A entrada do exercício já é um inteiro de 0 a 1000; validação de entradas arbitrárias não faz parte desse contrato. Cinco famílias executadas em QuickJS conferem zero, um, outros intervalos, retorno numérico e independência entre chamadas. Implementações equivalentes são aceitas. Previsão e escolha continuam conceituais; seus gabaritos são executados nos testes.

As doze seções e exercícios anteriores permanecem. As âncoras de pausas usam a mesma posição de capítulo da preparação diária, conservando as posições nas aulas aprofundadas e alcançando as originais. A preparação também mostra os pontos de raciocínio que antes eram omitidos, sem abrir a solução. Ler não gera domínio e consultar solução permanece assistência. Os 78 testes específicos passaram; strict, build, navegador e CI ainda precisam concluir.

Referências oficiais: [for](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-for-statement) e [while](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-while-statement). O draft pode incluir recursos futuros; esta entrega usa construções estáveis e confere os programas no interpretador real.


Strict/build passaram: 157 páginas, 35 recursos essenciais e cinco opcionais. Inicial 201,13 kB gzip; mundo 135,94 kB gzip preservado. Os quatro fluxos Edge passaram em 3,2 min: aula original com âncoras reais/depuração/offline/assistência/220–4000 px, preparação original sem gabarito/domínio pela leitura e duas regressões SQL de preparação e retomada offline. Métricas da branch: 82 atividades em 54/137 aulas; 83 sem pausas. Exigir CI completo, revisão, árvore e conferência publicada deste head antes de atualizar a contagem de produção.


## Valores e variáveis originais em preparação

A aula original valores conserva seus doze capítulos e recebe previsão de ausência/zero, depuração de soma que concatenava texto e escolha de declaração para reatribuição numérica. A teoria prepara comparação sem conversão, ordem da operação e diferença entre associação e valor. Quatro famílias executadas no QuickJS conferem resultado numérico, zero, sinais, fronteiras e chamadas independentes; as entradas já são inteiros de -10000 a 10000. Não pretende validar texto de formulário ou implementar contabilidade. As respostas de previsão/escolha são conceituais; suas referências são executadas nos testes. Ler não gera domínio; solução consultada continua assistência.

Os 91 testes específicos passaram, incluindo as regressões de loops e todas as referências de depuração; strict, build e navegador desta preparação ainda precisam concluir. A entrega depende da PR #36 para montar as pausas nos capítulos originais.

Referências oficiais: [adição](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-addition-operator-plus) e [let/const](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-let-and-const-declarations). Usa construções estáveis, conferidas no interpretador real; o draft pode conter recursos posteriores.


O teste de navegador encontrou a rota prática madura de valores, com 25 passos. As novas pausas complementam a leitura completa em #/leitura/valores e a sessão diária; não substituem esse percurso nem suas evidências. O fluxo passou a navegar pelo link real de leitura e verificar a retomada do passo salvo depois das pausas. A primeira tentativa do teste usava a rota prática esperando capítulos de leitura e não conta como aprovação.


Strict e build passaram: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 202,33 kB gzip, mundo 135,94 kB gzip. As duas regressões de loops passaram no primeiro lote; o fluxo de valores, corrigido para entrar pelo link real de leitura, passou isoladamente em 49,6 s. Foram três fluxos aprovados em dois lotes, não um lote 3/3. A prova inclui correção equivalente executada, assistência, recarga offline, 220/4000 px e preservação do passo 2 de 25 da prática madura. A branch tem 85 atividades em 55/137 aulas, 82 ainda sem pausas; isso não é publicação. Exigir CI, revisão, integração após #36 e conferência do domínio.


A revisão da PR #37 encontrou o link da preparação de valores apontando para a rota prática de 25 passos. O link de leitura completa e o retorno do catálogo passam a usar #/leitura/valores; as demais aulas conservam suas rotas. A nova regressão navega pelo plano antigo offline, confere três pausas sem fabricar domínio e retorna também pelo catálogo. Exigir build, navegador e novo CI do head corrigido.


## Laços publicados e conferidos

A PR #36 foi integrada após o CI 38168212787: 658 testes unitários, 146 fluxos de navegador, compiladores, PostgreSQL, API/cache e auditoria. Merge bf1bcca07664e58d66b25727509e103f3ac67038, árvore a31f9b62ea617c2f087b0a61d1cce18bc813546a igual ao head aprovado, sem revisões abertas. Deployment dpl_8zhswjMu8TpFhyJvHbnD8PwLxfhr READY/production com esse SHA; quatro fluxos públicos Edge aprovados em 3,9 min. Publicação conferida: 82 pausas em 54/137 aulas, 83 ainda sem pausas. Valores e decisões em preparação não entram nessa contagem publicada.


A revisão do link passou no Edge com navegação offline, recarga e retorno pelo catálogo, sem domínio atribuído pela leitura (54,6 s isolado). O fluxo principal de valores também passou (58,2 s). A primeira tentativa da regressão nova esperava o indicador offline dentro da sessão diária; o teste foi corrigido para aguardar o indicador na home e só depois abrir a sessão. Foram dois fluxos aprovados em dois lotes. Strict/build aprovados na correção: 157 páginas, 35 recursos essenciais, cinco opcionais, inicial 202,36 kB gzip e mundo 135,94 kB gzip. Exigir CI completo do último head, revisão resolvida, árvore e domínio.


## Decisões originais em preparação

A aula decisoes conserva doze capítulos e recebe previsão de acesso com duas condições, depuração de faixas contínuas e escolha da guarda inclusiva. As entradas da classificação já são números finitos de 0 a 100; os testes conferem casos comuns, 20/80, valores decimais, todos os inteiros desse intervalo e chamadas independentes. Aceita ordem alternativa dos ramos. Os testes chamam nivel somente com a energia, sem passar o índice do array como argumento adicional. A previsão e a escolha são conceituais; seus gabaritos são executados no interpretador. Ler não gera domínio e abrir solução continua assistência.

Referências oficiais: [if](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-if-statement) e [operadores lógicos](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-binary-logical-operators). Usa construções estáveis conferidas no JavaScript real; o draft pode incluir recursos futuros. Exigir os testes, build, navegador, CI, revisão, árvore e domínio próprios desta entrega dependente de valores.


Decisões passou em 104 testes específicos, strict e build: 157 páginas, 35 recursos essenciais e cinco opcionais, inicial 203,81 kB gzip e mundo 135,94 kB gzip. Os dois fluxos Edge passaram em 2,1 min, cobrindo previsão, fronteiras, correção equivalente executada, assistência, recarga offline, 220/4000 px e preservação da prática de valores. Branch: 88 pausas em 56/137 aulas, 81 sem pausas. Produção permanece com 82 em 54/137 até a integração de valores e desta entrega. Exigir CI completo, revisão, árvore e domínio. A próxima correção deve ordenar conceitos diários pela progressão do currículo sem trocar planos iniciados ou IDs.


## Progressão da sessão diária em preparação

A escolha de novos conceitos passa a usar a posição da aula no currículo, seguida de sua preparação. A ordem lexical dos IDs permanece somente como desempate e fallback para catálogos sem prioridade. IDs, evidências e planos salvos não são renomeados; um plano existente continua o mesmo, inclusive se já começou. A ordem não dispensa leitura necessária ou pré-requisitos por habilidade, nem cria domínio pela leitura. Prioridades inválidas são rejeitadas. Os 42 testes específicos de lógica passaram; strict, build, navegador e CI ainda precisam concluir. As métricas de atividades não mudam.


A progressão diária passou em 42 testes específicos, strict/build e dois fluxos Edge em 3,5 min: jornada nova começa por valores, sua preparação destrava a prática sem domínio pela leitura, recarga offline conserva o plano anterior e os links de preparação/catálogo continuam corretos. Build: 157 páginas, 35 recursos essenciais, cinco opcionais, inicial 203,87 kB gzip e mundo 135,94 kB gzip. Não muda a contagem de atividades. Exigir CI completo, revisão, integração após a PR #38, árvore e domínio.


## Validação da prática Python

Passaram 35 testes específicos de Python/descritores/progressão diária, TypeScript strict e build: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 205,32 kB gzip e mundo 135,94 kB gzip. O lote unitário local completo apresentou falhas de tempo em exemplos TypeScript, no caso de memória do executor e no teste de métricas durante execução simultânea com o build; foi interrompido e não é aprovação da suíte completa. Os 35 específicos foram repetidos separadamente e passaram em 9,42 s, sem mudar limites. A suíte completa continua exigida no CI do novo head. Os oito cenários novos e quatro programas anteriores passaram no Python 3.14.6. Dois fluxos Edge passaram em 1,8 min: prática Python e regressão da sessão diária, com assistência, persistência, offline e 220/4000 px. CI completo ainda pendente. Branch: 91 pausas em 57/137 aulas; 80 sem pausas. Produção conferida continua em 88/56/81 até integração própria.


## Progressão diária integrada, domínio pendente

A PR #39 passou no CI 38255384773 com 690 testes unitários, 150 fluxos de navegador em duas parcelas de 75 e os 161 exemplos externos, compiladores, PostgreSQL, API/cache e auditoria. Sem revisões abertas. Merge 20dd5898765cb5b7a34230fd300e43d130fb915a, árvore 16ce668b8c22f5ddda69370d854b475cd9f65f1a igual ao head 430d0cd27b07057ca85c522f118cd919e1806b08. Conferência do deployment/SHA e dos dois fluxos públicos ainda pendente; não presumir que o alias já atualizou. IDs, planos iniciados, pré-requisitos e leitura sem domínio preservados.


## Sessão diária conferida no domínio

O deployment dpl_8D5VkrUT9FwGehVs1WSFhVrjb26G ficou READY/production com gitSource.sha 20dd5898765cb5b7a34230fd300e43d130fb915a confirmado. Dois fluxos públicos Edge passaram em 1,8 min: progressão nova, plano anterior offline, preparação de valores na leitura e retorno pelo catálogo, sem substituir os 25 passos. Isso conclui a publicação de #39, mantendo as contagens de atividades. A prática Python #40 aguarda os dois jobs de navegador; 706 testes unitários e 169 exemplos externos passaram no CI 38259821060. Esses resultados não dispensam seus gates finais.


Nos cenários de cancelamento, Event sinaliza início e passagem pela limpeza; não representa fechamento real de arquivo, socket ou recurso externo. TaskGroup e Queue são APIs reais executadas em Python, sem simulação do loop. A confirmação do marcador prova o fluxo de finally, não uma integração externa.


Concorrência passou em TypeScript strict e build: 157 páginas, 35 recursos essenciais, cinco opcionais, inicial 206,54 kB gzip e mundo 135,94 kB gzip. Dois fluxos Edge passaram em 1,8 min: concorrência e regressão de números, com erros/acertos, assistência, progresso salvo, recarga offline e 220/4000 px. Exigir CI completo e publicação próprios após #40. Não houve runtime novo, permissão de rede do aluno ou mudança visual.


## Números Python integrados, domínio pendente

A PR #40 passou no CI 38259821060 com 706 unidades, 151 fluxos em parcelas de 75/76 e 169 exemplos externos, compiladores, PostgreSQL, API/cache e auditoria. Sem revisões abertas. Merge be777ce404aaa9257eed502d4fa1e0da491f5f66, árvore 94ab7f69ccf88425ca94d0658ae9f6a9ac2d34a5 igual ao head fe30a994bd99bd7cbeda4f06d65ecaeb1e781981. Não declarar publicação até conferir deployment/SHA e os dois fluxos públicos. A PR #41 mantém head 8501af3431f5736aa9d101b7620b4b8ff0681bb2; seu CI 38262798743 está em andamento, sem usar os gates de #40 como substitutos.


Engenharia passou em strict/build: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 207,84 kB gzip e mundo 135,94 kB gzip. O teste do marco exige ao menos uma pausa em cada uma das dez aulas Python, sem afirmar domínio por leitura ou conclusão da linguagem. Dois fluxos locais Edge passaram em 1,5 min: engenharia e regressão de concorrência, incluindo assistência, recarga offline, evidência e 220/4000 px. A publicação de #40 já tem deployment dpl_5fxMM1Q7tCi8cSn7gRCUUXWPeRp2 READY/production, gitSource.sha be777ce404aaa9257eed502d4fa1e0da491f5f66 confirmado e domínio atribuído; os fluxos públicos ainda precisam passar.

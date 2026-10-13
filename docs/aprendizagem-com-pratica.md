# Aprendizagem com prática, revisão e projetos

## Escopo e estado corrente

Esta edição prioriza aprendizagem ativa nas aulas, percursos e projetos existentes. A [fila gerada](aulas-sem-pratica.md) ordena as aulas sem pausas, e as [métricas geradas](metricas-catalogo.md) mantêm as contagens. Uma pausa ou leitura não encerra o domínio; previsão, diagnóstico, produção, assistência e revisão precisam de evidência adequada. A confirmação de cada entrega está em [continuidade](continuidade.md). Os registros seguintes são históricos e conservam os números e gates de cada etapa.

## Coerência entre preparação e prática diária

O plano novo combina a preparação dos capítulos com as práticas daquele assunto. A preparação também registra a introdução que efetivamente contém, sem evidência de domínio; a leitura antiga isolada continua sem equivaler aos capítulos posteriores. As revisões vencidas permanecem globais e anteriores ao assunto novo. Vagas não são preenchidas com exercícios de habilidades não apresentadas. Em aulas preparadas, a última pausa ocupa o desafio final; as anteriores seguem sua posição pedagógica.

Os planos já iniciados conservam sequência, tipos e tempos, inclusive quando uma atividade passa de prática a desafio ou no sentido inverso. Uma conferência correta da mesma atividade na aula pode concluir a etapa antiga; falha e resposta em modo revisão não concluem uma prática pendente. O progresso e a importação/exportação mantêm o formato existente. Validação e publicação desta correção são registradas em continuidade.md.

## Coleções C# publicadas em 12 de outubro

A PR #44 foi integrada em ce8e91de8fa45a8609c64c64f3f0ec227beca36b, árvore 85897ca26f026c82e9ff31df3feb79eb8d264c1b idêntica ao head 6952e24ccd1478848e9200b171ce99b345c52382. CI 38299162632: 798 testes unitários em 53 arquivos, 155 testes de navegador (70/39/46), 194 exemplos externos e dez cenários LINQ .NET adicionais aprovados, além de compiladores, PostgreSQL, API/cache e auditoria. A revisão de entrada não nula foi resolvida; o corretor aceita o tipo explícito compatível sem executar C# do aluno.

Deployment dpl_76EkVrSkEV3TTxqhr812ESJyaNvp READY/production, gitSource.sha e alias conferidos. Dois fluxos públicos Edge passaram em 1,4 min: C# LINQ e funções, com forma genérica explícita, offline e persistência. O build local do mesmo conteúdo passou: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 211,01 kB gzip e mundo 135,94 kB gzip. O fluxo C# final local passou em 51,4 s; main local foi avançada por fast-forward, sem alterações pendentes naquele checkpoint. Contagens correntes vêm de metricas-catalogo.md; os parágrafos seguintes preservam as validações e contagens de suas etapas.

O CI pós-merge atual 38302219911 passou integralmente. O anterior 38299927723 falhou no teste HTML: o trace registrou corpo vazio e o diagnóstico ocultou o erro original ao esgotar o prazo. A falha anterior permanece registrada; a aprovação do pós-merge atual não apaga a reprodução intermitente. A reprodução no domínio motivou a correção da substituição da prévia descrita em continuidade.md; o isolamento permanece obrigatório.

## C#: igualdade, agrupamento e cópia em preparação

cs-colecoes-linq conserva as seis seções, exemplo de consulta/snapshot, exercício Agrupar e projeto de relatório. Recebe três pausas após os blocos 1/3/4: prever a política de HashSet, diagnosticar chaves repetidas sem perder palavras e separar a cópia dos arrays internos. A teoria prepara comparação, ordem dentro de cada grupo local, listas independentes e o limite da materialização superficial. Não extrapola LINQ local para provedores remotos ou clonagem arbitrária.

Passaram 44 testes específicos e 12 programas compilados/executados com SDK .NET 10.0.401: dez cenários novos e o exemplo/solução preservados. Os casos diferenciam as políticas de igualdade, ArgumentException por chave repetida, GroupBy com ordem/repetição/vazio, deduplicação que perde palavras, lista compartilhada, cópia superficial e interna, linhas irregulares/aliased e chamadas independentes. O verificador de conteúdo recebe os dez cenários, sem pacotes externos; o exemplo também ganha saída esperada explícita. O corretor também aceita ToArray<int>() e ToArray<System.Int32>(), sem aceitar tipos incompatíveis; o CI confere persistência da forma explícita. Isso não mede performance e não executa C# do aluno: as pausas são conceituais, offline, com leitura sem domínio e solução como assistência.

Branch: 103 pausas em 61/137 aulas, 76 sem pausas. Strict/build passaram: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 210,97 kB gzip e mundo 135,94 kB gzip. Após a correção de pertencimento Python, três fluxos Edge locais passaram em 2,0 min: LINQ, funções e engenharia Python, com erro/acerto, assistência, persistência, offline e 220–4000 px. O lote de regressão aprovou 65 testes específicos, e 19 programas Python reais conferiram as expressões equivalentes e os gabaritos anteriores. CI e publicação próprios permanecem pendentes. Depende da etapa de funções #43; publicação confirmada permanece 94/58/79 após #41 enquanto #42 termina seus gates.

Referências oficiais: [HashSet](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.hashset-1.-ctor?view=net-10.0), [GroupBy](https://learn.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby?view=net-10.0) e [ToArray](https://learn.microsoft.com/en-us/dotnet/api/system.linq.enumerable.toarray?view=net-10.0). Não encerra coleções, generics, LINQ ou C#.


## Funções: parâmetros, composição e retorno em preparação

A aula original funcoes mantém os 12 capítulos, exemplo de desconto, exercício de conversão e projeto de biblioteca. Três pausas após os blocos 3/5/7 trabalham o parâmetro numérico separado do nome externo, a correção executada de uma função que mostra sem devolver e a quebra de linha logo após return. A teoria prepara zero, frações, composição, independência e retorno sem expressão. Não tenta ensinar mutação de objetos como se todo argumento fosse um número.

O verificador QuickJS confere quatro famílias: números retornados no caso comum; zero, frações e limite do contrato; novas entradas; composição e chamadas independentes. O contrato é um número finito de 0 a 1440; não exige validação fora dessa faixa nem confunde console com retorno. As pausas de previsão e escolha são conceituais. Ler não gera domínio; solução é assistência; a execução permanece no isolamento existente.

Passaram 36 testes específicos, incluindo regressões de decisões e engenharia Python. Eles rejeitam console sem retorno, truncamento de frações, substituição de zero, texto, respostas fixas e acúmulo entre chamadas; aceitam forma equivalente com parâmetro opcional. Reproduzem a quebra após return e a alternativa com parêntese aberto na mesma linha. Strict e build passaram: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 209,10 kB gzip e mundo 135,94 kB gzip. Dois fluxos Edge locais passaram em 1,2 min: funções e engenharia Python, com erro/acerto, assistência, persistência, offline e larguras de 220 e 4000 px. CI e publicação próprios permanecem pendentes. Branch: 100 pausas em 60/137 aulas, 77 sem pausas; produção conferida 94/58/79. Esta etapa depende de #42, cujo head e8196c8 corrigiu a nota Python colocada na seção TypeScript e aguarda o CI completo novamente.

Referências: [return](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/return) e [funções](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Functions). Não conclui funções, JavaScript ou as frentes curriculares.


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


## C++: transferência, posse temporária e retorno de texto

cpp-memoria-posse recebe três pausas após os blocos 2/3/4, mantendo a pausa anterior de invalidação no bloco 5. A pessoa diagnostica a tentativa de mover um unique_ptr constante, prevê a vida conservada pelo shared_ptr obtido de lock e completa um retorno de string com posse. As novas habilidades exigem preparação na sessão diária. Respostas são conceituais, sem compilação do aluno; assistência, respostas e evidências continuam no progresso local. O exercício de optional e o projeto de árvore foram preservados.

O verificador compartilhado inclui oito cenários C++20: recusa de transferência constante, transferência modificável, conversão sem transferência, previsão de lock, observador vazio/expirado, liberação da última posse e retorno independente com texto vazio/curto/longo. A alternativa string_view é recusada por uma asserção de tipo antes de qualquer chamada; nenhum acesso pendente é executado. Esses casos ainda exigem confirmação do CI desta entrega. Não representam teste de concorrência nem encerram span, allocators, ciclos ou análise geral de lifetime. Referências: [construtores de unique_ptr](https://eel.is/c++draft/unique.ptr.single.ctor), [lock e expired](https://eel.is/c++draft/util.smartptr.weak.obs), [string_view](https://eel.is/c++draft/string.view.template) e [std::move](https://eel.is/c++draft/forward).

## Python: atributos e estado de descritores

py-objetos-protocolos recebe previsão de precedência, diagnóstico de armazenamento compartilhado e alteração da guarda no acesso pela classe. As pausas exigem preparação dos blocos 3/4/5 na sessão diária. Leitura não gera domínio; assistência e respostas são preservadas offline. Nenhum programa do aluno é executado nessas pausas. A teoria foi aprofundada, mantendo o exercício Retangulo e seus critérios e exemplos anteriores.

Os nove cenários de referência são executados com Python no verificador do CI, incluindo reprodução dos defeitos, duas instâncias, dois atributos, zero, inteiros grandes, rejeição de bool/negativo/outros tipos sem mutação, herança, property, sombra de atributo e identidade sem chamar igualdade. O armazenamento proposto usa __dict__, a busca padrão e uma instância de descritor por campo; não cobre slots exclusivos, busca personalizada, reuso do mesmo descritor sob vários nomes ou isolamento de segurança. Referências oficiais: [guia de descritores](https://docs.python.org/3/howto/descriptor.html) e [protocolo do modelo de dados](https://docs.python.org/3/reference/datamodel.html#implementing-descriptors). A aula e suas atividades não encerram metaprogramação Python.

## CSS: caixa medida, mínimo do item e rolagem local

css-caixas-intrinseco recebe previsão, alteração e depuração após os blocos 1/3/5, mantendo os exercícios e problemas anteriores. A primeira pausa exige considerar o piso zero da área de conteúdo de border-box; a segunda distingue flex-shrink, mínimo automático e a política de quebra break-word; a terceira mantém o cabeçalho no fluxo e mede sua adesão ao contêiner que realmente rola. A leitura preparatória vem antes da família diária e não produz domínio. Respostas são conceituais, com assistência sob solicitação e progresso offline.

Referências oficiais consultadas: [dimensionamento de caixas](https://www.w3.org/TR/css-sizing-3/#box-sizing), [mínimo automático em Flexbox](https://www.w3.org/TR/css-flexbox-1/#min-size-auto), [quebra de texto](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap) e [posicionamento aderente](https://www.w3.org/TR/css-position-3/#sticky-pos). A referência nativa verifica bordas reais, reprodução do overflow, texto inteiro sem recorte, rótulo curto, fonte vazia e scrollTop efetivamente alterado. O escopo usa escrita horizontal e navegadores dos testes; não certifica todos os modos de escrita, leitores de tela ou motores CSS.

## C#: percursos, descarte e materialização

A aula cs-iteradores-descarte passa a distribuir três novas pausas após os blocos 2/3/5. Prever MoveNext exercita estado e suspensão; corrigir o consumidor que abandona o enumerador exercita a fronteira de Dispose inclusive em exceção; completar uma materialização distingue receita de resultado guardado. A atividade de using anterior e os dois problemas independentes permanecem. A preparação diária cobre os blocos necessários, leitura não gera domínio e solução consultada registra assistência. Respostas continuam conceituais/offline; não houve execução .NET do aluno.

O verificador compartilhado compila um projeto .NET 10 descartável sem pacotes externos e confere dez cenários. Além dos gabaritos, reproduz o recurso ativo sem Dispose e a duplicação de efeitos por reenumeração. Origem vazia, falha no consumidor, filtro vazio e nova enumeração têm contratos observáveis. A origem é finita e os valores são inteiros; isso não testa arquivos, IAsyncEnumerable, cópia profunda ou todas as origens LINQ. Referências oficiais: [yield e descarte](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/yield), [using](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/using) e [avaliação adiada](https://learn.microsoft.com/en-us/dotnet/standard/linq/deferred-execution-lazy-evaluation).

## HTML: alternativas e seleção de imagens

`html-midia` recebe três pausas preparadas pelos blocos 1/2/5: nomear um link que só contém imagem, completar sizes conforme o espaço CSS e reconstruir picture quando a fonte genérica esconde a específica. O conceito é exigido na sessão diária; leitura não cria domínio e consultar solução registra assistência. São decisões conceituais, sem alegar que o aluno executou HTML ou concluiu uma auditoria de acessibilidade.

As referências são verificadas pelo navegador real: nome acessível/foco, arquivos locais decodificados, medidas CSS, seleção de fonte nas bordas 600/601 px, proporção, reprodução da ordem errada e fallback. Os SVGs preservam as três etapas nas duas composições e ficam disponíveis offline. Não há promessa de uma escolha universal de srcset, economia medida de imagens raster ou teste com leitor de tela físico. Referências oficiais: [picture/source](https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element), [sizes](https://html.spec.whatwg.org/multipage/images.html#sizes-attributes) e [alternativas de imagens](https://html.spec.whatwg.org/multipage/images.html#alt).

## Preparação na sessão diária

As famílias que exigem conceito têm uma leitura preparatória com identidade própria, separada da introdução que já podia estar salva. A sessão apresenta os capítulos necessários antes da prática, sem exibir resoluções. A conclusão da leitura libera a sequência e não cria nota. Mesmo um plano antigo que já continha o exercício precisa mostrar a preparação ausente antes de retomá-lo; seus itens e respostas são preservados. Essa leitura declarada pelo aluno não certifica compreensão: as respostas e revisões continuam fornecendo as evidências.


## SQL: ausência, integridade e correspondência

A aula `sql-null-logica` conserva a pausa inicial e recebe três decisões após os blocos 2/4/5: prever a comparação desconhecida, investigar a aceitação de NULL por CHECK e completar uma correlação com política explícita para duas ausências. Zero continua sendo um valor distinto; repetir bloqueios não pode multiplicar linhas. Pistas apontam o mecanismo, solução consultada registra assistência e leitura não cria domínio. As respostas do aluno são conceituais/offline; os gabaritos têm cenários PostgreSQL separados no verificador externo, ainda sujeitos ao gate desta entrega. Não surgiu um executor SQL no laboratório.

Os casos de referência distinguem aceitação de CHECK e seleção de WHERE, capturam somente not_null_violation/check_violation e reproduzem os erros de igualdade comum e de COALESCE colidindo com zero. Conjuntos vazios, duplicatas e ausência presente/somente ausente no bloqueio são conferidos com resultados explícitos. Referências oficiais consultadas: [comparações](https://www.postgresql.org/docs/current/functions-comparison.html), [restrições](https://www.postgresql.org/docs/current/ddl-constraints.html) e [subconsultas](https://www.postgresql.org/docs/current/functions-subquery.html). A política de corresponder duas ausências é um contrato didático explícito; não deduz identidade de registros desconhecidos.

## Closures: depuração com execução isolada

`js-closures-estado` passa a oferecer três programas quebrados nos blocos 2/4/5. O aluno corrige a independência dos contadores, os índices capturados por callbacks e as fronteiras de uma lista de strings. O executor QuickJS existente confere contratos específicos, inclusive instâncias intercaladas, overflow sem escrita, chamadas fora de ordem, quantidade zero, entrada esparsa, snapshots alterados e validação sem mutação parcial. Não há rede, runtime adicional ou mudança dos limites do sandbox.

Os corretores aceitam comportamentos equivalentes: uma fábrica auxiliar de callbacks também passa. Saída fixa, cursor compartilhado e cópia apenas da entrada não passam nos casos adicionais. A teoria prepara os contratos antes de cada pausa; a sessão diária exige o conceito, leitura não cria domínio e consultar solução registra assistência. Referências consultadas: [ambientes e closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) e [bindings de let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let). As métricas atuais vêm de [metricas-catalogo.md](metricas-catalogo.md); números dos registros abaixo descrevem suas entregas históricas.

## C++20: requisito, instanciação e subsunção

As pausas de `cpp-templates` distinguem validade de expressão, condição satisfeita, descarte de ramo dependente e escolha da sobrecarga por requisitos compartilhados. O conceito vem antes da prática na sessão diária; leitura não cria evidência de domínio. Respostas são locais e conceituais. Pistas apontam o mecanismo sem revelar imediatamente o trecho, e consultar solução registra assistência.

O verificador externo compila sete cenários, incluindo dois que devem falhar: if comum tentando size em int e chamada ambígua após copiar o requisito. Os demais conferem saídas e contratos, com tipos integrais/não integrais, coleções vazias, fixas/dinâmicas e conservação dos elementos. O fluxo de navegador cobre respostas erradas/corretas, ausência de solução antecipada, assistência e retomada offline. Não há execução de código do aluno ou novo runtime cliente.

## TypeScript: resolução e efeitos de módulos

Três pausas em `ts-modulos-configuracao` distinguem caminho no artefato, alias do compilador e grafo de execução após apagar tipos. As habilidades são diferentes; previsões de saída continuam no eixo de leitura existente. Preparação conceitual é exigida na sessão diária. Falhas apontam o mecanismo e a solução fica sob solicitação, registrando assistência. A resposta é avaliada localmente, sem compilador ou execução TypeScript no navegador.

O verificador externo lê tsconfig/package.json, compila oito projetos descartáveis e confere emissão, diagnósticos e execução real. Extensão incompleta e interface importada como valor devem bloquear emissão; bundler/paths aceitando o código não podem esconder o erro do artefato em Node ESM direto. O fluxo de navegador verifica erro, acerto, ausência de solução antecipada, assistência, persistência offline e layout de 220 a 4000 px. Conferir o CI do head antes de integrar.

## CSV com contratos e destino preservado

A aula `py-biblioteca-dados` recebe pausas após os blocos 3/4/5: previsão de campos/registros/linhas físicas, investigação de cabeçalho duplicado e ordenação da confirmação de um lote. As habilidades são distintas e exigem preparação conceitual na sessão diária. Falhas dão uma pista específica; a solução permanece sob solicitação e seu uso registra assistência. As respostas são conceituais e locais, não prova de compilação/execução Python.

Os programas de referência usam o parser real da biblioteca padrão e verificam cabeçalhos ausentes, repetidos, invertidos, extras; registros vazios e incompletos; quantidade zero, limite, sinais, espaços e algarismos não ASCII; falha de leitura e CSV malformado após um registro válido. A lista de destino deve conservar seu conteúdo diante dessas falhas. A representação não promete transação de banco, retorno do iterador ao início ou recuperação durante falha de memória na gravação. As métricas atuais continuam geradas pelo catálogo.

## C#: cancelamento e posse de recursos

O módulo `cs-assincrono-recursos` passa a oferecer três pausas específicas depois dos blocos sobre cancelamento, concorrência e descarte. A previsão distingue efeito concluído de pedido futuro; a depuração identifica liberação de vaga sem aquisição; a alteração propaga o token vinculado. A teoria prepara essas decisões antes da tentativa, e a primeira sessão C# continua nos fundamentos. Esta expansão está em validação antes de integrar.

Cinco programas usados pelo verificador compilam em .NET 10: previsão, versão quebrada da vaga, correção em sucesso/erro/cancelamento e propagação independente por cada origem. Os cenários controlam o momento sem rede nem sleeps; a espera infinita só é usada com cancelamento explícito e o processo de teste tem limite externo. A escolha correta e o preenchimento continuam sendo avaliações conceituais offline, sem execução do código do aluno nem domínio fabricado pela leitura. Consulte [cancelamento cooperativo](https://learn.microsoft.com/en-us/dotnet/standard/threading/cancellation-in-managed-threads), [aquisição assíncrona](https://learn.microsoft.com/en-us/dotnet/api/system.threading.semaphoreslim.waitasync?view=net-10.0) e [fontes vinculadas](https://learn.microsoft.com/en-us/dotnet/api/system.threading.cancellationtokensource.createlinkedtokensource?view=net-10.0).

## Mecanismos nesta expansão

- Atividades próprias em HTML, CSS, JavaScript, TypeScript, Python, C#, C++ e SQL. O [resumo gerado](metricas-catalogo.md) informa quantidades atuais e distribuição. Desafios JS começam quebrados e são conferidos com casos distintos, entradas vazias, negativos, não mutação e limites.
- Metadados de apresentação não incluem soluções ou verificações. Consultar solução é explícito e registrado como assistência. Os verificadores locais são inspecionáveis; não se promete sigilo nem integridade contra edição do armazenamento.
- Pausas são inseridas pelos blocos indicados em cada atividade, somente nas aulas referenciadas e depois da preparação correspondente. As demais aulas continuam com leitura completa e suas práticas existentes; a migração geral permanece trabalho futuro.
- Evidência de domínio usa avaliações distintas por habilidade, tentativas, pistas e assistência. Repetir o mesmo problema não aumenta a quantidade praticada. Percentual é resumo de evidências, não certificação.
- Revisão por dias locais: 1, 3, 7, 14, 30, 60. Errar reduz dois estágios; assistência agenda um dia. Somente revisão vencida independente amplia o intervalo. Revelar a solução após uma tentativa registra assistência imediatamente, inclusive depois de acertar uma revisão.
- A sessão diária contém até 2 revisões antigas, 1 conceito novo, 2 práticas e 1 desafio. A preferência de linguagem afeta conteúdo novo; revisões antigas continuam globais. O plano do dia é retomável e não repete atividades. A linguagem fica fixa depois de iniciar o plano; consulte outras atividades pelo catálogo e ajuste a preferência no próximo dia.
- Percursos próprios de algoritmos, estruturas, redes, Git, testes e arquitetura, com etapas de teoria original, exemplo, falha, exercício, solução, critérios e decisão conceitual.
- Projetos de conclusão com marcos e critérios, código em vários arquivos, notas de evidência, invalidação após editar, ZIP e backup da jornada. A rubrica é manual e os projetos não são aprovados automaticamente. Se o navegador recusar a gravação, a interface informa alterações em memória e permite exportar arquivos e jornada antes de sair. A importação aceita arquivos de até 16 MB e preserva a jornada anterior se a gravação da restauração falhar.

## Uso offline

O build gera um service worker que prepara index, módulos, estilos, WASM e recursos locais. Após a mensagem de preparação concluída, a aplicação e as atividades conceituais podem ser reabertas sem conexão. JS usa QuickJS no navegador; Python/C#/C++ conceituais não usam Judge0. A execução completa dessas linguagens continua opcional e exige o executor configurado ou ferramentas locais nos arquivos exportados.

Fontes externas, clima, chamadas de API e execução remota não ficam disponíveis offline. Páginas estáticas de leitura possuem endereços próprios; o cache garante o aplicativo no endereço principal, não todas essas páginas independentes. Atualizações aguardam fechar as abas para trocar a versão consistente; não recarregam automaticamente nem apagam progresso.

Referências de implementação: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries), [ZIP](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT).

## Verificação requerida

Executar toda a suíte de unidade, exemplos externos, cronogramas SQL, builds e navegador. Novos fluxos cobrem depuração, bordas, assistência, habilidades, leitura sem crédito, sessão retomável, offline após preparação, projeto com vários arquivos, exportação/backup, invalidação de evidência e telas entre 220 e 4000 px. Registrar os resultados reais da versão integrada; não substituir evidência por contagens planejadas.


## Pausas Python e continuidade do catálogo

A aula `py-iteracao-recursos` acrescenta `py-prever-esgotamento`, `py-ordenar-lote` e `py-fechar-consumo`. O total passa de 25 para 28 atividades. Elas funcionam nas pausas da aula, no catálogo e na revisão por habilidade. Seus gabaritos são executados com Python no CI; a resposta da pessoa continua avaliada conceitualmente no navegador.

As habilidades novas são Python → Iteradores → Consumo/Lotes/Recursos. Os ids das 40 entradas de conceito da PR #5 são preservados em `legacy-concept-ids.ts`. Novos conceitos usam rank e id da aula, sem posição do catálogo. Um teste restaura o plano iniciado com ids antigos e conserva os conceitos lidos no dia seguinte.


## Pausas de contratos TypeScript

`ts-variancia-contratos` acrescenta `ts-fonte-covariancia`, `ts-callback-entrada` e `ts-propriedade-funcao`. O catálogo passa a 31 atividades; as habilidades novas são TypeScript → Variância → Resultados/Parâmetros/Métodos. A conferência de uma escolha é conceitual: os testes do gabarito em strict e em execução não devem ser apresentados como execução de código do aluno.

As três práticas avançadas de variância exigem seu conceito para entrar num novo plano diário. Elas podem seguir o conceito na mesma sessão ou reaparecer depois de lido. Leitura prepara a sequência e não gera evidência de domínio; pré-requisitos de habilidade continuam sendo exigidos separadamente. As rotas explícitas de prática e revisões já devidas continuam disponíveis, e planos iniciados são preservados.

A mesma preparação é aplicada às três atividades novas de iteradores Python, conservando a primeira sessão em previsão de range, funções e contrato nomeado. Novos desafios de recursos passam a seguir sua introdução conceitual, sem bloquear estudo escolhido diretamente no catálogo.

## Pausas C++ e acesso após modificações

`cpp-iteradores-invalidacao` acrescenta `cpp-prever-intervalo`, `cpp-ordenar-erase` e `cpp-reobter-reserva`, levando o total a 34 atividades. As habilidades são C++ → Vector → Iteração/Remoção/Realocação. As pausas exigem o conceito correspondente no plano diário, preservam respostas e funcionam offline após preparação. Leitura não fabrica domínio. A reconstrução usa os fechamentos identificados do if e do for; a previsão nunca desreferencia end nem um iterador inválido.

Os gabaritos das pausas são compilados em C++20 no CI; a resposta do estudante permanece conceitual. Compilação geral e validação automática de projetos abertos continuam fora desse mecanismo.

## Edição verificada anterior (PR #8)

As expansões Python, TypeScript e C++ levam o catálogo a 34 atividades: quatro programas JS executados e 30 atividades conceituais. O catálogo principal tem 135 aulas, incluindo 27 aulas próprias de 17 capítulos e 54 problemas independentes. As nove pausas novas têm conceitos exigidos no plano diário; as atividades anteriores conservam seu comportamento. A construção de uma sequência completa de pré-requisitos em todo o catálogo permanece no mapa de interatividade.

O fluxo Python publicado foi conferido em Edge isolado, com correção, persistência após recarregar e retomada offline depois da preparação do cache. O CI do C++ está registrado em continuidade.md. O pedido integral permanece aberto em [17 frentes](etapas-restantes.md).

## Propriedades JavaScript e quinto debugging

A edição integrada pela PR #10 tem 37 atividades: cinco executam JavaScript e 32 são conceituais. As três novas pausas são `js-prever-propriedade`, `js-descritor-sem-getter` e `js-debug-numero-proprio`, ligadas às habilidades JavaScript → Objetos → Propriedades/Descritores/Validação. Todas exigem o conceito no plano diário, conservando fundamentos na primeira sessão.

O desafio corrige uma implementação completa no QuickJS; os outros dois são conceituais. As seis famílias de casos são inspecionáveis no pacote e não prometem sigilo. O run 37707217346 verificou falha seguida de correção, ausência de solução automática, prova executada, persistência offline e conclusão; 87 fluxos de navegador passaram.

## Bancada Git de trabalho e preparação

O percurso Git conserva as três etapas, exemplos, investigação, solução e conferência conceitual anteriores. A primeira etapa oferece uma bancada carregada sob demanda: editar calculo.txt, iniciar, preparar, registrar um commit e comparar trabalho, preparação e HEAD. O objetivo exige dois commits e preserva uma edição posterior à preparação; o feedback aponta qual relação ainda está errada. Pistas não mostram a sequência completa automaticamente.

É um modelo didático linear de um arquivo, não um terminal ou implementação completa de Git. Os rótulos A/B não são hashes. Não há filtros, hooks, remoção de arquivos, remotos, branches ou execução de comandos do aluno. Não toca arquivos do computador, não usa rede arbitrária e não atribui domínio pela conferência do modelo. As três etapas anteriores continuam propondo execução em repositório descartável real; conflitos e reversão não ganharam bancada nesta entrega.

O rascunho usa practiceAnswers e entra no backup existente. Há limite explícito de 600 caracteres por versão, 16 commits e 28 mil caracteres serializados; não há truncamento silencioso. Rascunhos incompatíveis são preservados para exportação, com reinício específico. Uma falha de armazenamento mantém o estado em memória e orienta a exportar. Consultar a solução existente registra assistência na bancada. Repetir a conferência não gera nota de domínio.

A bancada não é somada ao catálogo de atividades das oito linguagens: os totais atuais são gerados em [métricas do catálogo](metricas-catalogo.md). Ela é um experimento adicional do percurso Git. O verificador compartilhado compara snapshots do modelo com Git real, incluindo arquivo vazio, preparação repetida e commit sem mudança; mantém os casos reais de conflito por contrato e reversão. Referências: [git add](https://git-scm.com/docs/git-add), [git commit](https://git-scm.com/docs/git-commit) e [as três áreas](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F).

## Relógio HTTP e repetição de uma intenção

A etapa de idempotência ganha um experimento carregado sob demanda, mantendo os exemplos e exercícios anteriores. A pessoa envia uma intenção, avança um relógio manual, observa separadamente o conhecimento do cliente e os efeitos no servidor e pode repetir com a mesma chave/conteúdo, outra chave, chave vazia ou conteúdo diferente. A linha do tempo explicita ida, processamento, volta e prazo. Um timeout pode acontecer antes ou depois do efeito; ele não comprova ausência de reserva. Resposta perdida nunca é entregue. A chegada ao servidor ordena as operações, inclusive tentativas concorrentes.

O contrato didático mantém uma reserva por chave/conteúdo e rejeita conflito com 409. Essa deduplicação é uma regra da aplicação simulada, não uma garantia geral de POST ou um protocolo universal de chave HTTP. O modelo aplica cada efeito de modo indivisível e guarda chaves sem expiração. Sistemas reais precisam definir validade, persistência, atomicidade, proteção concorrente e semântica de falhas. O experimento não faz HTTP real, pagamentos ou reservas, nem atribui domínio.

Os cenários 429 e 503 são injetados em cada próxima tentativa. Neste contrato eles recusam a operação antes de qualquer efeito; APIs reais podem ter outro contrato. 429 informa Retry-After: 2; a espera mostrada começa no recebimento da resposta. Uma resposta que chega após o prazo não transmite esse conhecimento ao cliente. 503 neste cenário não informa prazo: sugere considerar backoff limitado e a identidade da intenção, sem executar um ciclo de tentativas. O controle de cenário não representa um algoritmo real de rate limit. DNS, TCP, TLS, cache, cookies e CORS ainda precisam de experimentos próprios.

O rascunho armazena ações validadas no backup existente; a restauração reproduz essas ações, sem aceitar uma lista inventada de efeitos. Há limites de 20 tentativas, 100 ações, dez minutos simulados e tamanho de serialização. Formato incompatível fica preservado para exportar. Solução consultada continua assistência. As métricas do catálogo das oito linguagens não incluem este experimento. Referências oficiais: [idempotência HTTP](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2), [429](https://www.rfc-editor.org/rfc/rfc6585.html#section-4), [Retry-After](https://www.rfc-editor.org/rfc/rfc9110.html#section-10.2.3).

## Execução SQL local

A bancada SQL agora executa SQLite real em Worker descartável, com resultados em tabelas, tipos preservados, transações dentro do script, cancelamento e limites explícitos. Scripts continuam em projetos e backups; bancos e resultados não persistem entre cliques. PostgreSQL não é simulado por SQLite e conserva o ambiente próprio das aulas e do CI. O runtime só carrega ao executar; offline exige esse carregamento e cache disponível. Detalhes, evidências e gates em [laboratório SQL](laboratorio-sql.md). Executar livremente no laboratório não gera domínio nem substitui correção específica das atividades.

## Presença, multiplicidade e validação de formulários HTML

A aula html-dados-formulario recebe três pausas nos blocos 3, 4 e 6, preservando as duas atividades anteriores, exemplos, dois problemas independentes e projeto. A pessoa prevê readonly/disabled e checkboxes realmente enviadas, depura a perda de seleções ao converter pares para objeto e retira o estado personalizado que mantém um campo inválido após correção. As novas habilidades exigem conceito na sessão diária. São evidências conceituais; não afirmam execução do HTML escrito pelo aluno.

Os gabaritos foram conferidos em navegador nativo: ordem e ausência dos pares, duas/uma/nenhuma escolha, perda por Object.fromEntries/get e transições inválido→válido→vazio→válido em setCustomValidity. A previsão não promete validar qualquer formulário nem substitui validação no servidor. Referências primárias: [construção das entradas](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constructing-the-entry-list) e [validação de restrições](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation). As métricas atualizadas vêm do gerador; a aula já possuía pausas, portanto este aprofundamento não reduz sozinho o número de aulas sem prática.


## Compilação TypeScript na bancada

TypeScript prepara um fluxo real de diagnósticos → JavaScript emitido → execução isolada, com projetos .ts e backup do original. Os tipos são conferidos com strict, sem equivaler a validação de dados em runtime. O compilador só carrega ao executar e o primeiro uso offline exige cache prévio. O contrato de script único, limites e diferenças dos hosts estão em laboratorio-typescript.md. Exigir CI/integração/domínio próprios; nenhuma atividade ou nota de domínio foi fabricada por essa ferramenta.


## Importação JavaScript com prática própria

A preparação em pratica/js-importacao-atomica liga três pausas a js-modulos-engenharia, antes sem atividades corrigíveis: prever perdas no transporte JSON, depurar a confirmação de uma importação e escolher apresentação como texto literal. A depuração executa sete contratos no QuickJS, incluindo falha depois do primeiro registro, lista vazia, 100/101 registros, SyntaxError e nova tentativa. As outras duas pausas continuam conceituais; a referência JSON foi executada e o trecho DOM tem teste nativo próprio. Preserva seis blocos, exercício e projeto anteriores.

Os 74 testes específicos passaram, incluindo rejeição de soluções frágeis e aceitação de outra implementação válida. Métricas geradas da branch: 79 atividades em 53/137 aulas, com 84 ainda sem pausas. Essas métricas ainda não são publicação. Exigir build, dois fluxos de navegador, CI completo, revisão, árvore e domínio. Não há novo runtime ou permissão de rede. A PR #34 TypeScript precisa concluir seu CI corrigido antes desta integração dependente.

Referências: [JSON.stringify na especificação ECMAScript](https://tc39.es/ecma262/multipage/structured-data.html#sec-json.stringify) e [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent). Os comportamentos usados são conferidos no mecanismo e no navegador; não dependem de novos recursos do draft.


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


## Decisões originais em preparação

A aula decisoes conserva doze capítulos e recebe previsão de acesso com duas condições, depuração de faixas contínuas e escolha da guarda inclusiva. As entradas da classificação já são números finitos de 0 a 100; os testes conferem casos comuns, 20/80, valores decimais, todos os inteiros desse intervalo e chamadas independentes. Aceita ordem alternativa dos ramos. Os testes chamam nivel somente com a energia, sem passar o índice do array como argumento adicional. A previsão e a escolha são conceituais; seus gabaritos são executados no interpretador. Ler não gera domínio e abrir solução continua assistência.

Referências oficiais: [if](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-if-statement) e [operadores lógicos](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-binary-logical-operators). Usa construções estáveis conferidas no JavaScript real; o draft pode incluir recursos futuros. Exigir os testes, build, navegador, CI, revisão, árvore e domínio próprios desta entrega dependente de valores.


Decisões passou em 104 testes específicos, strict e build: 157 páginas, 35 recursos essenciais e cinco opcionais, inicial 203,81 kB gzip e mundo 135,94 kB gzip. Os dois fluxos Edge passaram em 2,1 min, cobrindo previsão, fronteiras, correção equivalente executada, assistência, recarga offline, 220/4000 px e preservação da prática de valores. Branch: 88 pausas em 56/137 aulas, 81 sem pausas. Produção permanece com 82 em 54/137 até a integração de valores e desta entrega. Exigir CI completo, revisão, árvore e domínio. A próxima correção deve ordenar conceitos diários pela progressão do currículo sem trocar planos iniciados ou IDs.


## Progressão da sessão diária em preparação

A escolha de novos conceitos passa a usar a posição da aula no currículo, seguida de sua preparação. A ordem lexical dos IDs permanece somente como desempate e fallback para catálogos sem prioridade. IDs, evidências e planos salvos não são renomeados; um plano existente continua o mesmo, inclusive se já começou. A ordem não dispensa leitura necessária ou pré-requisitos por habilidade, nem cria domínio pela leitura. Prioridades inválidas são rejeitadas. Os 42 testes específicos de lógica passaram; strict, build, navegador e CI ainda precisam concluir. As métricas de atividades não mudam.


A progressão diária passou em 42 testes específicos, strict/build e dois fluxos Edge em 3,5 min: jornada nova começa por valores, sua preparação destrava a prática sem domínio pela leitura, recarga offline conserva o plano anterior e os links de preparação/catálogo continuam corretos. Build: 157 páginas, 35 recursos essenciais, cinco opcionais, inicial 203,87 kB gzip e mundo 135,94 kB gzip. Não muda a contagem de atividades. Exigir CI completo, revisão, integração após a PR #38, árvore e domínio.


## Validação da prática Python

Passaram 35 testes específicos de Python/descritores/progressão diária, TypeScript strict e build: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 205,32 kB gzip e mundo 135,94 kB gzip. O lote unitário local completo apresentou falhas de tempo em exemplos TypeScript, no caso de memória do executor e no teste de métricas durante execução simultânea com o build; foi interrompido e não é aprovação da suíte completa. Os 35 específicos foram repetidos separadamente e passaram em 9,42 s, sem mudar limites. A suíte completa continua exigida no CI do novo head. Os oito cenários novos e quatro programas anteriores passaram no Python 3.14.6. Dois fluxos Edge passaram em 1,8 min: prática Python e regressão da sessão diária, com assistência, persistência, offline e 220/4000 px. CI completo ainda pendente. Branch: 91 pausas em 57/137 aulas; 80 sem pausas. Produção conferida continua em 88/56/81 até integração própria.


Nos cenários de cancelamento, Event sinaliza início e passagem pela limpeza; não representa fechamento real de arquivo, socket ou recurso externo. TaskGroup e Queue são APIs reais executadas em Python, sem simulação do loop. A confirmação do marcador prova o fluxo de finally, não uma integração externa.


Concorrência passou em TypeScript strict e build: 157 páginas, 35 recursos essenciais, cinco opcionais, inicial 206,54 kB gzip e mundo 135,94 kB gzip. Dois fluxos Edge passaram em 1,8 min: concorrência e regressão de números, com erros/acertos, assistência, progresso salvo, recarga offline e 220/4000 px. Exigir CI completo e publicação próprios após #40. Não houve runtime novo, permissão de rede do aluno ou mudança visual.


Engenharia passou em strict/build: 157 páginas, 35 recursos essenciais e cinco opcionais; inicial 207,84 kB gzip e mundo 135,94 kB gzip. O teste do marco exige ao menos uma pausa em cada uma das dez aulas Python, sem afirmar domínio por leitura ou conclusão da linguagem. Dois fluxos locais Edge passaram em 1,5 min: engenharia e regressão de concorrência, incluindo assistência, recarga offline, evidência e 220/4000 px. A publicação de #40 já tem deployment dpl_5fxMM1Q7tCi8cSn7gRCUUXWPeRp2 READY/production, gitSource.sha be777ce404aaa9257eed502d4fa1e0da491f5f66 confirmado e domínio atribuído; os fluxos públicos ainda precisam passar.

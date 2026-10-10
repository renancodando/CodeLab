# Aprendizagem com prática, revisão e projetos

## Python: atributos e estado de descritores

py-objetos-protocolos recebe previsão de precedência, diagnóstico de armazenamento compartilhado e alteração da guarda no acesso pela classe. As pausas exigem preparação dos blocos 3/4/5 na sessão diária. Leitura não gera domínio; assistência e respostas são preservadas offline. Nenhum programa do aluno é executado nessas pausas. A teoria e os critérios foram aprofundados, mantendo o exercício Retangulo e os exemplos anteriores.

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

# Currículo do zero à especialização

## Conteúdo proposto nesta expansão

A versão integrada tem **128 aulas em 20 trilhas**. A PR #4 acrescenta quatro aulas próprias e propõe **132 aulas**, após a aprovação dos gates desta versão. A primeira expansão publicou 48 módulos com treze capítulos. O aprofundamento atual acrescenta **24 aulas de 17 capítulos**, com **48 problemas independentes**, soluções comentadas e critérios próprios. As oito trilhas por linguagem têm agora nove aulas cada; as 60 aulas originais continuam disponíveis.

Cada módulo tem seis seções de teoria original, exemplo completo, resultado esperado, rastreamento, falha para investigar, exercício com três critérios, solução, projeto e revisão. A matriz contém **606 entradas de cobertura**: **134** estão vinculadas a atividades específicas como `praticaIndependente`; as outras **472** permanecem `introduzido`. Entradas não equivalem a tópicos únicos, pois conceitos podem reaparecer em contextos diferentes. Essa contagem não declara que todos os ecossistemas e especializações foram esgotados.

A matriz legível por ferramentas está em [cobertura-curriculo.json](cobertura-curriculo.json). Um tópico introduzido só deve ser marcado como prática independente quando houver uma atividade específica e validação correspondente.

## Percursos

### Python · do zero ao avançado

#### Python: execução, tipos e controle

- Nível: Fundamentos.
- Aula: `#/aula/py-fundamentos` e página `/aulas/py-fundamentos/`.
- Conteúdo: interpretador e REPL; indentação; int float bool None; str e Unicode; conversões e entrada; if elif else; for range while; break continue else; comparação e identidade.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### Python: coleções, funções e iteração

- Nível: Intermediário.
- Aula: `#/aula/py-colecoes-funcoes` e página `/aulas/py-colecoes-funcoes/`.
- Conteúdo: list tuple dict set; mutabilidade e cópia; slicing e desempacotamento; comprehensions; parâmetros posicionais e nomeados; args kwargs; escopo LEGB closures; iteradores e yield; complexidade.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### Python: classes, protocolos e metaprogramação

- Nível: Avançado.
- Aula: `#/aula/py-objetos-protocolos` e página `/aulas/py-objetos-protocolos/`.
- Conteúdo: classes instâncias self; dataclasses; herança composição MRO super; property descritores; dunder repr eq hash; duck typing protocolos; decoradores functools.wraps; context managers; slots metaclasses.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### Python: arquivos, exceções e biblioteca padrão

- Nível: Intermediário.
- Aula: `#/aula/py-biblioteca-dados` e página `/aulas/py-biblioteca-dados/`.
- Conteúdo: pathlib arquivos encoding; with e exceções; JSON CSV validação; datetime zoneinfo; decimal fractions; collections itertools functools; re Unicode; logging argparse; os subprocess segurança.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### Python: concorrência, async e paralelismo

- Nível: Avançado.
- Aula: `#/aula/py-concorrencia` e página `/aulas/py-concorrencia/`.
- Conteúdo: concorrência versus paralelismo; async await corrotinas; TaskGroup cancelamento; timeouts semáforos filas; threads locks; ProcessPoolExecutor; GIL builds free-threaded; backpressure; falhas e recursos.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### Python: tipagem, testes, pacotes e desempenho

- Nível: Especialização.
- Aula: `#/aula/py-engenharia` e página `/aulas/py-engenharia/`.
- Conteúdo: módulos imports __main__; venv pip pyproject.toml; typing Protocol Generic; testes unittest mocks; propriedades casos de borda; profiling timeit tracemalloc; algoritmos complexidade; distribuição wheels; documentação e evolução.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

### TypeScript · do zero ao avançado

#### TypeScript: tipos, inferência e execução

- Nível: Fundamentos.
- Aula: `#/aula/ts-fundamentos` e página `/aulas/ts-fundamentos/`.
- Conteúdo: tsc e apagamento de tipos; inferência; string number boolean; arrays readonly tuples; literal types unions; strictNullChecks; unknown versus any; type assertions satisfies.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### TypeScript: objetos, narrowing e uniões discriminadas

- Nível: Intermediário.
- Aula: `#/aula/ts-contratos` e página `/aulas/ts-contratos/`.
- Conteúdo: type interface tipagem estrutural; optional readonly; excess property checks; typeof in instanceof; type predicates assertions; discriminated unions; never exhaustiveness; intersections index signatures.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### TypeScript: genéricos, coleções e variância

- Nível: Avançado.
- Aula: `#/aula/ts-genericos` e página `/aulas/ts-genericos/`.
- Conteúdo: generic functions interfaces; constraints extends; keyof indexed access; defaults inference; overloads; callbacks variance; readonly collections; generic classes factories.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### TypeScript: transformação e programação de tipos

- Nível: Avançado.
- Aula: `#/aula/ts-tipos-avancados` e página `/aulas/ts-tipos-avancados/`.
- Conteúdo: mapped types modifiers; Pick Omit Partial Required Readonly; Record Exclude Extract; conditional types distribution; infer ReturnType Parameters Awaited; template literal types; key remapping; recursive types limits.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### TypeScript: módulos, configuração e declarações

- Nível: Especialização.
- Aula: `#/aula/ts-modulos-configuracao` e página `/aulas/ts-modulos-configuracao/`.
- Conteúdo: tsconfig strict; target lib module; NodeNext bundler resolution; ESM CommonJS; import type verbatimModuleSyntax; declaration d.ts; ambient declarations; project references; source maps packaging.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### TypeScript: validação, assíncrono e qualidade

- Nível: Especialização.
- Aula: `#/aula/ts-fronteiras-qualidade` e página `/aulas/ts-fronteiras-qualidade/`.
- Conteúdo: JSON unknown validation; Result discriminated unions; Promise async errors; AbortController; static versus runtime tests; ts-expect-error; gradual migration checkJs JSDoc; domain DTO boundaries; security and serialization.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

### C++ · do zero ao avançado

#### C++: compilação, tipos e controle

- Nível: Fundamentos.
- Aula: `#/aula/cpp-fundamentos` e página `/aulas/cpp-fundamentos/`.
- Conteúdo: compilação ligação main; headers namespaces; tipos fundamentais auto; inicialização narrowing; signed unsigned overflow; if switch loops; funções parâmetros retorno; const constexpr; entrada e streams.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### C++: classes, RAII e semântica de valor

- Nível: Intermediário.
- Aula: `#/aula/cpp-classes-raii` e página `/aulas/cpp-classes-raii/`.
- Conteúdo: struct class encapsulamento; constructors invariants; RAII destructors; rule of zero five; copy move semantics; composition inheritance; virtual destructor slicing; exceptions guarantees; explicit const methods.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### C++: STL, iteradores, algoritmos e ranges

- Nível: Intermediário.
- Aula: `#/aula/cpp-stl-algoritmos` e página `/aulas/cpp-stl-algoritmos/`.
- Conteúdo: vector array deque list; map set unordered_map; iterator categories invalidation; algorithms sort find accumulate; lambdas captures; comparators strict weak ordering; ranges views lifetime; complexity.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### C++: templates, concepts e avaliação constante

- Nível: Avançado.
- Aula: `#/aula/cpp-templates` e página `/aulas/cpp-templates/`.
- Conteúdo: function class templates; deduction instantiation; concepts requires; constraints overloads; if constexpr type_traits; variadic templates folds; constexpr consteval; specialization ODR headers.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### C++: memória, posse e segurança de vida

- Nível: Avançado.
- Aula: `#/aula/cpp-memoria-posse` e página `/aulas/cpp-memoria-posse/`.
- Conteúdo: storage duration lifetime; pointers references nullptr; unique_ptr shared_ptr weak_ptr; ownership cycles; span string_view dangling; value categories move forwarding; optional variant visit; alignment allocation placement; sanitizers UB.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### C++: concorrência, build e desempenho

- Nível: Especialização.
- Aula: `#/aula/cpp-concorrencia-engenharia` e página `/aulas/cpp-concorrencia-engenharia/`.
- Conteúdo: thread jthread stop_token; mutex scoped_lock condition_variable; atomics memory ordering; data races deadlocks; future async; build headers CMake modules; profiling benchmarks; cache locality false sharing; coroutines custom awaitables.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

### JavaScript · fundamentos à especialização

#### JavaScript: valores, coerção e escopo

- Nível: Fundamentos.
- Aula: `#/aula/js-semantica` e página `/aulas/js-semantica/`.
- Conteúdo: primitives objects typeof; Number BigInt NaN; Unicode strings; coercion equality Object.is; truthiness nullish; let const var TDZ; destructuring rest spread; closures lexical scope.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### JavaScript: funções, this e composição

- Nível: Intermediário.
- Aula: `#/aula/js-funcoes-this` e página `/aulas/js-funcoes-this/`.
- Conteúdo: declaration expression arrow; parameters defaults rest; this call apply bind; lexical this; higher-order functions; closures callbacks; pure functions composition; recursion stack tail calls.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### JavaScript: objetos, protótipos e classes

- Nível: Avançado.
- Aula: `#/aula/js-objetos-modelos` e página `/aulas/js-objetos-modelos/`.
- Conteúdo: property keys descriptors; own versus inherited; prototype chain; classes constructors private fields; getters setters; composition inheritance super; symbols; Proxy Reflect; prototype pollution boundaries.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### JavaScript: coleções, iteradores e memória

- Nível: Avançado.
- Aula: `#/aula/js-colecoes-iteracao` e página `/aulas/js-colecoes-iteracao/`.
- Conteúdo: arrays sparse map filter reduce sort; Map Set identity; WeakMap WeakSet GC; iterators generators yield; typed arrays ArrayBuffer DataView; RegExp Unicode; Intl formatting segmentation; resource lifetime dispose; memory leaks.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### JavaScript: promises, concorrência e cancelamento

- Nível: Avançado.
- Aula: `#/aula/js-assincrono` e página `/aulas/js-assincrono/`.
- Conteúdo: event loop jobs microtasks; Promise states chaining; async await rejection; all allSettled race any; bounded concurrency; AbortController host APIs; timeouts stale responses; idempotency retry backoff.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### JavaScript: módulos, testes e arquitetura

- Nível: Especialização.
- Aula: `#/aula/js-modulos-engenharia` e página `/aulas/js-modulos-engenharia/`.
- Conteúdo: ES modules live bindings; dynamic import top-level await; cycles CommonJS hosts; errors causes boundaries; JSON structured clone; unit integration e2e; dependency injection; performance profiling; security DOM SQL boundaries.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

### HTML · do zero à plataforma web

#### HTML: documento, árvore e semântica

- Nível: Fundamentos.
- Aula: `#/aula/html-documentos` e página `/aulas/html-documentos/`.
- Conteúdo: doctype html head body; DOM parsing nesting; lang charset viewport; title meta link; main header nav section article aside footer; global attributes id class data; boolean attributes; void elements entities namespaces.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### HTML: texto, links, listas e tabelas

- Nível: Fundamentos.
- Aula: `#/aula/html-texto-links` e página `/aulas/html-texto-links/`.
- Conteúdo: headings paragraphs emphasis; strong em mark small; blockquote cite q; pre code whitespace; ol ul dl; URLs relative absolute fragments; a download target rel; tables caption th scope.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### HTML: formulários, validação e dados enviados

- Nível: Intermediário.
- Aula: `#/aula/html-formularios` e página `/aulas/html-formularios/`.
- Conteúdo: form action method; label name value; input types textarea select; checkbox radio fieldset legend; required min max step pattern; autocomplete inputmode; constraint validation; FormData successful controls; client server validation.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### HTML: imagens, mídia e conteúdo incorporado

- Nível: Intermediário.
- Aula: `#/aula/html-midia` e página `/aulas/html-midia/`.
- Conteúdo: img alt width height; srcset sizes picture; figure figcaption; audio video source track; captions transcripts autoplay; SVG canvas alternatives; iframe title sandbox permissions; lazy loading performance.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### HTML: acessibilidade e interação nativa

- Nível: Avançado.
- Aula: `#/aula/html-acessibilidade` e página `/aulas/html-acessibilidade/`.
- Conteúdo: keyboard focus tabindex; button versus link; accessible names descriptions; details summary; dialog modal focus return; popover support; ARIA states relationships; live regions; progressive enhancement.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### HTML: DOM, componentes e integração da plataforma

- Nível: Especialização.
- Aula: `#/aula/html-plataforma` e página `/aulas/html-plataforma/`.
- Conteúdo: DOM createElement textContent; events propagation delegation; template document fragments; custom elements lifecycle; Shadow DOM slots; storage origin sandbox; fetch workers host APIs; CSP same-origin permissions; SEO progressive enhancement.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

### CSS · do zero ao avançado

#### CSS: seletores, cascata e valores

- Nível: Fundamentos.
- Aula: `#/aula/css-cascata` e página `/aulas/css-cascata/`.
- Conteúdo: selectors combinators attributes; pseudo classes elements; cascade origin importance layers; specificity source order; inherit initial unset revert; custom properties var fallback; computed used values; relative absolute units.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### CSS: caixas, fluxo e posicionamento

- Nível: Fundamentos.
- Aula: `#/aula/css-caixas` e página `/aulas/css-caixas/`.
- Conteúdo: box model box-sizing; block inline inline-block; normal flow intrinsic sizing; margin collapse; overflow scroll clipping; position relative absolute fixed sticky; containing blocks; stacking context z-index; logical properties writing modes.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### CSS: Flexbox, Grid e alinhamento

- Nível: Intermediário.
- Aula: `#/aula/css-flex-grid` e página `/aulas/css-flex-grid/`.
- Conteúdo: flex axes wrap basis grow shrink; alignment gap auto margins; flex min-size; grid tracks fr minmax; auto-fit auto-fill; explicit implicit placement; grid areas subgrid; source order accessibility.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### CSS: responsividade, consultas e dimensões fluidas

- Nível: Avançado.
- Aula: `#/aula/css-responsivo` e página `/aulas/css-responsivo/`.
- Conteúdo: media queries content breakpoints; container queries inline-size; clamp min max calc; viewport svh lvh dvh; reflow zoom text; responsive images aspect-ratio; prefers-color-scheme reduced-motion; pointer hover capabilities.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### CSS: tipografia, cor e movimento

- Nível: Avançado.
- Aula: `#/aula/css-visual-movimento` e página `/aulas/css-visual-movimento/`.
- Conteúdo: font stacks web fonts loading; line-height measure text; color contrast modern color spaces; background gradients borders shadows; transforms transitions; keyframes animation timing; reduced motion; render layout paint composite.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### CSS: arquitetura, compatibilidade e depuração

- Nível: Especialização.
- Aula: `#/aula/css-arquitetura` e página `/aulas/css-arquitetura/`.
- Conteúdo: tokens themes component APIs; layers scope naming; supports progressive enhancement; compatibility fallback; contain content-visibility; logical properties internationalization; DevTools computed layout; visual regression states; dead CSS maintenance.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

### C# · do zero à engenharia

#### C#: tipos, valores e controle de fluxo

- Nível: Fundamentos.
- Aula: `#/aula/cs-tipos-controle` e página `/aulas/cs-tipos-controle/`.
- Conteúdo: dotnet project build runtime; value reference types; int long double decimal; checked conversions; string char Unicode; nullable reference value types; if switch pattern matching; loops methods parameters; exceptions contracts.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### C#: genéricos, coleções e LINQ

- Nível: Intermediário.
- Aula: `#/aula/cs-colecoes-linq` e página `/aulas/cs-colecoes-linq/`.
- Conteúdo: List Dictionary HashSet; generic constraints variance; IEnumerable IEnumerator; LINQ Where Select OrderBy GroupBy; deferred execution materialization; First Single Any; IQueryable providers; complexity multiple enumeration.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### C#: objetos, interfaces, records e padrões

- Nível: Avançado.
- Aula: `#/aula/cs-objetos-contratos` e página `/aulas/cs-objetos-contratos/`.
- Conteúdo: classes structs records; constructors properties init required; interfaces composition inheritance; virtual override abstract sealed; value equality record copying; pattern matching switch; delegates lambdas events; operator overload contracts.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### C#: async, cancelamento e recursos

- Nível: Avançado.
- Aula: `#/aula/cs-assincrono-recursos` e página `/aulas/cs-assincrono-recursos/`.
- Conteúdo: Task async await; Task.WhenAll WhenAny; CancellationToken cooperative; timeouts bounded concurrency; IDisposable using; IAsyncDisposable await using; IAsyncEnumerable await foreach; async void contexts; deadlocks Result Wait.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### C#: runtime, memória e recursos avançados

- Nível: Avançado.
- Aula: `#/aula/cs-runtime-avancado` e página `/aulas/cs-runtime-avancado/`.
- Conteúdo: GC allocations boxing; struct readonly ref struct; Span ReadOnlySpan Memory; stackalloc lifetime; generics constraints; reflection attributes; source generators trimming AOT; unsafe pointers interop; profiling benchmarking.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### C#: testes, pacotes e arquitetura .NET

- Nível: Especialização.
- Aula: `#/aula/cs-engenharia` e página `/aulas/cs-engenharia/`.
- Conteúdo: solutions projects references NuGet; unit integration end-to-end tests; dependency injection lifetimes; ASP.NET middleware APIs; EF Core transactions migrations; logging configuration secrets; publish trimming AOT; architecture domain adapters; versioning compatibility.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

### SQL · do zero ao avançado

#### SQL: modelo relacional, tipos e integridade

- Nível: Fundamentos.
- Aula: `#/aula/sql-modelagem-completa` e página `/aulas/sql-modelagem-completa/`.
- Conteúdo: relations rows columns keys; CREATE ALTER DROP schema; primary foreign unique keys; NOT NULL CHECK DEFAULT; NULL three-valued logic; numeric text boolean dates; normalization dependencies; INSERT UPDATE DELETE RETURNING; PostgreSQL dialect.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### SQL: consultas, joins e composição

- Nível: Intermediário.
- Aula: `#/aula/sql-consultas-joins` e página `/aulas/sql-consultas-joins/`.
- Conteúdo: SELECT FROM WHERE order logic; INNER LEFT RIGHT FULL CROSS JOIN; join cardinality aliases; EXISTS NOT EXISTS correlated; UNION ALL INTERSECT EXCEPT; CTEs composition; ORDER BY LIMIT keyset pagination; LATERAL; parameterized queries.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### SQL: agregações, janelas e análise

- Nível: Avançado.
- Aula: `#/aula/sql-agregacoes-janelas` e página `/aulas/sql-agregacoes-janelas/`.
- Conteúdo: GROUP BY HAVING; count sum avg NULL; aggregate FILTER distinct; window PARTITION ORDER; row_number rank dense_rank; lag lead; ROWS RANGE frames; running totals; grouping sets rollup.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### SQL: transações, MVCC e concorrência

- Nível: Avançado.
- Aula: `#/aula/sql-transacoes` e página `/aulas/sql-transacoes/`.
- Conteúdo: ACID BEGIN COMMIT ROLLBACK; savepoints; MVCC snapshots; read committed repeatable read serializable; lost updates write skew; SELECT FOR UPDATE; deadlocks ordering; retry idempotency; constraints concurrency.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### SQL: índices, planos e otimização

- Nível: Especialização.
- Aula: `#/aula/sql-indices-planos` e página `/aulas/sql-indices-planos/`.
- Conteúdo: EXPLAIN ANALYZE BUFFERS; statistics ANALYZE estimates; B-tree composite order; partial expression covering indexes; GIN GiST BRIN; sequential index bitmap scans; join strategies; sargability; write costs maintenance.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

#### SQL: views, recursão, JSON e evolução

- Nível: Especialização.
- Aula: `#/aula/sql-esquema-avancado` e página `/aulas/sql-esquema-avancado/`.
- Conteúdo: views materialized refresh; recursive CTE termination cycles; JSONB operators indexes; functions procedures triggers; generated identity columns; partitioning pruning; roles grants least privilege; schema migrations compatibility; backup restore verification.
- Entrega: teoria, exemplo, erro, exercício, solução e projeto do módulo.

## Aulas independentes de aprofundamento

Cada aula abaixo tem seis seções de teoria com mais de 4.500 caracteres de explicação própria, exemplo, exercício principal, depuração, projeto e dois problemas com soluções explicadas. As verificações executam o comportamento ensinado; não se limitam à existência dos capítulos.

### python

#### Python: números exatos, texto e conversão de entrada

- Aula: `#/aula/py-numeros-texto`; nível Fundamentos; 17 capítulos.
- Mecanismos: int e limites de representação; divisão real e divisão pelo piso; resto e distribuição de unidades; float e erro de representação; Decimal construído de texto; str e pontos de código Unicode; normalização NFC; conversão integral estrita.
- Atividades: Problema 1: quantidade recebida como texto (`quantidade`); Problema 2: comparar nomes canonicamente equivalentes (`unicode`).
- Referência principal: [docs.python.org/3/library/stdtypes.html](https://docs.python.org/3/library/stdtypes.html).

#### Python: decisões, laços e prova de término

- Aula: `#/aula/py-controle-invariantes`; nível Fundamentos; 17 capítulos.
- Mecanismos: if elif e ordem das condições; intervalos semiabertos; range com passo; acumulador e invariante; while e variante de término; break continue e else de laço; busca sem resultado; lista vazia e casos de fronteira.
- Atividades: Problema 1: primeira posição que atende ao limite (`busca`); Problema 2: término de uma contagem de parcelas (`parcelas`).
- Referência principal: [docs.python.org/3/tutorial/controlflow.html](https://docs.python.org/3/tutorial/controlflow.html).

### typescript

#### TypeScript: inferência, ausência e contratos sem coerção

- Aula: `#/aula/ts-inferencia-ausencia`; nível Fundamentos; 17 capítulos.
- Mecanismos: inferência e widening; union com undefined; strictNullChecks; narrowing por typeof; operador nullish; assertion sem validação; readonly e mutação; contrato de retorno discriminado.
- Atividades: Problema 1: busca que pode não encontrar (`catalogo`); Problema 2: padrão sem apagar zero (`limite`).
- Referência principal: [www.typescriptlang.org/docs/handbook/2/narrowing.html](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

#### TypeScript: validar JSON aninhado e produzir dados de domínio

- Aula: `#/aula/ts-validacao-aninhada`; nível Intermediário; 17 capítulos.
- Mecanismos: JSON.parse como fronteira unknown; objeto não nulo e não array; validação de campos aninhados; validação de todos os itens; mensagem com caminho de erro; cópia dos campos aceitos; campo opcional versus inválido; testes com ts-expect-error.
- Atividades: Problema 1: apelido ausente ou inválido (`opcional`); Problema 2: provar o contrato para consumidores (`tipos`).
- Referência principal: [www.typescriptlang.org/docs/handbook/2/objects.html](https://www.typescriptlang.org/docs/handbook/2/objects.html).

### cpp

#### C++: entrada textual, conversão completa e estados de erro

- Aula: `#/aula/cpp-texto-conversao`; nível Fundamentos; 17 capítulos.
- Mecanismos: string como sequência de unidades char; getline e leitura de linha; extração formatada e texto residual; from_chars e errc; consumo completo da entrada; limites de int; optional para conversão; gramática ASCII e faixa de domínio.
- Atividades: Problema 1: nome completo e linha vazia (`linhas`); Problema 2: conversão completa com estouro detectado (`inteiro`).
- Referência principal: [eel.is/c++draft/charconv.from.chars](https://eel.is/c++draft/charconv.from.chars).

#### C++: funções, cópia, referência e tempo de vida

- Aula: `#/aula/cpp-funcoes-referencias`; nível Fundamentos; 17 capítulos.
- Mecanismos: parâmetro por valor; referência mutável; referência const; pré-condição e pós-condição; retorno por valor; referência para objeto local; const não significa posse; cópia de vector e dados originais.
- Atividades: Problema 1: criar uma coleção independente (`copia`); Problema 2: observar o tamanho sem modificar (`observacao`).
- Referência principal: [eel.is/c++draft/dcl.ref](https://eel.is/c++draft/dcl.ref).

### csharp

#### C#: valores decimais, arredondamento e overflow

- Aula: `#/aula/cs-decimal-limites`; nível Fundamentos; 17 capítulos.
- Mecanismos: literal decimal com sufixo m; decimal e double; arredondamento com MidpointRounding; cultura na apresentação; checked no ponto da operação; TryParse e contrato de formato; nullable e ausência; limite numérico antes de converter.
- Atividades: Problema 1: preço com formato de intercâmbio (`formato`); Problema 2: produto inteiro com faixa final (`inteiro`).
- Referência principal: [learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/floating-point-numeric-types](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/floating-point-numeric-types).

#### C#: métodos, parâmetros e estado compartilhado

- Aula: `#/aula/cs-metodos-parametros`; nível Fundamentos; 17 capítulos.
- Mecanismos: passagem por valor; cópia de referência de classe; ref para trocar a variável; out e padrão Try; validação antes da mutação; array copiado versus compartilhado; retorno e efeito observável; exceção como parte do contrato.
- Atividades: Problema 1: normalizar sem alterar a entrada (`copia`); Problema 2: substituir a referência do chamador (`troca`).
- Referência principal: [learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/method-parameters](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/method-parameters).

### javascript

#### JavaScript: conversão explícita e números nos limites

- Aula: `#/aula/js-conversao-limites`; nível Fundamentos; 17 capítulos.
- Mecanismos: coerção do operador mais; Number e conversão explícita; parseInt e prefixo válido; NaN e Number.isNaN; inteiros seguros; zero e operador nullish; BigInt e Number separados; validação antes do cálculo.
- Atividades: Problema 1: configurar limite sem apagar zero (`default`); Problema 2: preservar um identificador grande (`identificador`).
- Referência principal: [tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber).

#### JavaScript: closures, identidade e estado de uma instância

- Aula: `#/aula/js-closures-estado`; nível Fundamentos; 17 capítulos.
- Mecanismos: escopo léxico; closure e binding capturado; fábrica e estado por instância; const e objeto mutável; identidade versus cópia; let em laço; var e ambiente compartilhado; snapshot sem referência interna.
- Atividades: Problema 1: uma função por índice (`callbacks`); Problema 2: snapshot de lista sem alias (`snapshot`).
- Referência principal: [tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-function-definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-function-definitions).

### html

#### HTML: parser, árvore do documento e estrutura semântica

- Aula: `#/aula/html-arvore-semantica`; nível Fundamentos; 17 capítulos.
- Mecanismos: fonte HTML e árvore DOM; fechamento implícito de p; elementos void; doctype e modo de renderização; lang charset e title; regiões main nav article; hierarquia de headings; caption th e scope.
- Atividades: Problema 1: corrigir o agrupamento de blocos (`reparar`); Problema 2: tabela com cabeçalhos de linha e coluna (`tabela`).
- Referência principal: [html.spec.whatwg.org/multipage/parsing.html](https://html.spec.whatwg.org/multipage/parsing.html).

#### HTML: controles enviados, validação e botão de submissão

- Aula: `#/aula/html-dados-formulario`; nível Intermediário; 17 capítulos.
- Mecanismos: name e id em papéis diferentes; label e nome acessível; disabled e readonly; checkbox e ausência quando desmarcado; nomes repetidos e getAll; FormData e submitter; validação nativa antes de submit; botão type button versus submit.
- Atividades: Problema 1: preservar a ação do botão (`acoes`); Problema 2: presença de controles nos dados (`presenca`).
- Referência principal: [html.spec.whatwg.org/multipage/form-control-infrastructure.html#constructing-the-entry-list](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constructing-the-entry-list).

### css

#### CSS: cascata por camadas e valores de custom properties

- Aula: `#/aula/css-cascata-camadas`; nível Fundamentos; 17 capítulos.
- Mecanismos: declaração aplicável e valor vencedor; ordem de camadas normais; regra normal sem camada; ordem invertida de important; especificidade dentro da etapa; herança de color; fallback de var; inválido no valor computado.
- Atividades: Problema 1: ordem invertida nas camadas (`important`); Problema 2: token ausente e valor inválido (`token`).
- Referência principal: [www.w3.org/TR/css-cascade-5/](https://www.w3.org/TR/css-cascade-5/).

#### CSS: dimensões de caixa, conteúdo intrínseco e overflow

- Aula: `#/aula/css-caixas-intrinseco`; nível Fundamentos; 17 capítulos.
- Mecanismos: content-box e dimensão externa; border-box e espaço de conteúdo; padding e border no cálculo; tamanho mínimo automático de flex item; min-inline-size zero; overflow-wrap anywhere; overflow e contêiner de rolagem; sticky e referência de rolagem.
- Atividades: Problema 1: conteúdo intrínseco em item flexível (`minimo`); Problema 2: cabeçalho dentro de uma rolagem local (`sticky`).
- Referência principal: [www.w3.org/TR/css-sizing-3/](https://www.w3.org/TR/css-sizing-3/).

### sql

#### SQL: NULL, lógica de três valores e dados ausentes

- Aula: `#/aula/sql-null-logica`; nível Fundamentos; 17 capítulos.
- Mecanismos: NULL como ausência de valor; comparação com resultado unknown; WHERE aceita apenas true; IS NULL e IS NOT NULL; IS DISTINCT FROM; CHECK e NOT NULL; count estrela versus count coluna; NOT IN com NULL e NOT EXISTS.
- Atividades: Problema 1: exclusão com uma chave ausente (`exclusao`); Problema 2: campo obrigatório e faixa válida (`obrigatorio`).
- Referência principal: [www.postgresql.org/docs/current/functions-comparison.html](https://www.postgresql.org/docs/current/functions-comparison.html).

#### SQL: cardinalidade de joins e agregação sem duplicar totais

- Aula: `#/aula/sql-joins-cardinalidade`; nível Intermediário; 17 capítulos.
- Mecanismos: granularidade antes da consulta; cardinalidade um para muitos; LEFT JOIN e linha estendida; filtro em ON versus WHERE; count da chave relacionada; agregação antes do join; fanout entre duas coleções; EXISTS para testar presença.
- Atividades: Problema 1: preservar clientes sem pedido pago (`filtro`); Problema 2: somar coleções antes de combinar (`fanout`).
- Referência principal: [www.postgresql.org/docs/current/queries-table-expressions.html](https://www.postgresql.org/docs/current/queries-table-expressions.html).

## Segundo aprofundamento desta entrega

### Python: parâmetros, escopo e funções com contratos

- Aula: `#/aula/py-funcoes-contratos`; nível Intermediário; 17 capítulos.
- Mecanismos: contrato de entrada e retorno; parâmetros nomeados e keyword-only; default avaliado na definição; sentinela None para default mutável; escopo LEGB; nonlocal e binding externo; closure por chamada; retorno novo sem modificar entrada.
- Atividades: Problema 1: opção exigida por nome (`assinatura`); Problema 2: coletor com estado por instância (`isolamento`).
- Referência principal: [docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions](https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions).

### TypeScript: genéricos que preservam relações entre dados

- Aula: `#/aula/ts-genericos-relacoes`; nível Avançado; 17 capítulos.
- Mecanismos: parâmetro de tipo como relação; inferência do tipo de retorno; constraint extends; keyof e chave válida; indexed access T K; readonly na entrada genérica; tipo específico não inventado; teste negativo de propriedade.
- Atividades: Problema 1: seleção de propriedade opcional (`opcional`); Problema 2: construir T por uma fábrica (`fabrica`).
- Referência principal: [www.typescriptlang.org/docs/handbook/2/generics.html](https://www.typescriptlang.org/docs/handbook/2/generics.html).

### C++: RAII, posse exclusiva e transferência de recursos

- Aula: `#/aula/cpp-raii-posse-unica`; nível Intermediário; 17 capítulos.
- Mecanismos: RAII e duração do recurso; destrutor na saída de escopo; desenrolamento por exceção; unique_ptr não copiável; move transfere a posse; ponteiro movido e estado vazio; rule of zero na composição; observador sem propriedade.
- Atividades: Problema 1: recurso como membro de uma classe (`composicao`); Problema 2: observar enquanto o dono permanece vivo (`observador`).
- Referência principal: [eel.is/c++draft/unique.ptr](https://eel.is/c++draft/unique.ptr).

### JavaScript: promises, propagação de falhas e concorrência limitada

- Aula: `#/aula/js-promessas-contratos`; nível Avançado; 17 capítulos.
- Mecanismos: promise pendente fulfilled rejected; then retorna outra promise; throw vira rejeição no callback; await e propagação de erro; all não cancela tarefas; allSettled conserva resultados; concorrência limitada por trabalhadores; ordem de saída versus ordem de término.
- Atividades: Problema 1: fallback ou propagação (`recuperacao`); Problema 2: limitar operações ativas (`trabalhadores`).
- Referência principal: [tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.all](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.all).


## Terceiro aprofundamento: interação, recursos e sessões

Esta entrega acrescenta quatro aulas próprias, com seis seções de teoria, dois problemas e 17 capítulos cada. Os resultados do novo head precisam ser conferidos antes da integração.

| Aula | Mecanismos e prática | Verificação |
| --- | --- | --- |
| `html-dialogo-foco` | Nome acessível, showModal, foco, cancel/close, method dialog, validade e rascunho | Teclado, conteúdo inerte, retorno de foco, saída inválida e literalidade do texto no navegador |
| `css-grid-trilhas` | Linhas/trilhas, mínimo intrínseco, auto-fill/fit, gap, distribuição e dense | Medidas reais, contexto estreito, texto longo e ordem de foco |
| `cs-iteradores-descarte` | Execução adiada, MoveNext, finally/Dispose, repetição e snapshot | Quatro programas .NET com saídas e invariantes explícitas |
| `sql-isolamento-sessoes` | Read Committed, Repeatable Read, conflito 40001 e repetição inteira | Três cronogramas com processos psql distintos, respostas por passo e resultado confirmado |

Referências principais: [HTML Standard](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element), [CSS Grid](https://www.w3.org/TR/css-grid-1/), [C# yield](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/yield) e [isolamento PostgreSQL](https://www.postgresql.org/docs/current/transaction-iso.html).

Os gabaritos SQL entre sessões mostram um cronograma para conexões separadas. Eles não são concatenados e executados como se fossem uma consulta numa conexão única. Os mesmos comandos estruturados na definição alimentam o verificador específico; ON_ERROR_STOP e SQLSTATE distinguem o conflito esperado de falhas de sintaxe ou conexão.

## Ambiente e entrega

- Capítulos novos carregam ao abrir a aula; o índice inicial conserva títulos, resumo e temas para busca.
- O build gera páginas completas sem JavaScript e o catálogo usado pela API existente.
- A aparência e os arquivos de estilo do produto não foram alterados.
- JavaScript e HTML/CSS usam as capacidades já existentes do laboratório. Python, C# e C++ dependem da disponibilidade do executor externo configurado.
- TypeScript exige compilação real com `tsc`; os exemplos são verificados com `strict`, sem oferecer um botão que simule suporte de execução.
- A trilha SQL nova declara **PostgreSQL**. Seus exemplos são executados em uma base descartável no CI; não são apresentados como compatíveis com qualquer executor SQLite.

## Gates de qualidade

1. Catálogo: ids, relações, sequência, capítulos e profundidade da teoria própria.
2. JavaScript: exemplos e saídas reais no interpretador isolado; soluções executáveis.
3. TypeScript: exemplos e soluções passam pela verificação semântica com `strict`.
4. Python, C++, C#, PostgreSQL e TypeScript: 118 exemplos/soluções compilados ou executados em processos/base temporários no CI. Nas aulas novas, as saídas são comparadas com expectativas explícitas; TypeScript também passa por strict, incluindo problemas e expectativas negativas de tipos.
5. Navegador: navegação, busca antes de carregar capítulos, progresso local, falha de download, saída durante carregamento e páginas sem JavaScript; os trechos HTML/CSS das aulas independentes verificam árvore, formulários, valores computados, dimensões e rolagem.
6. PostgreSQL concorrente: três cronogramas com conexões distintas, sem pausas arbitrárias para presumir confirmações.
7. Gates anteriores de build, API, acessibilidade e ciclos de memória continuam ativos.

## Aprofundamento contínuo

Este é o percurso principal publicado; a solicitação de conteúdo completo continua exigindo expansão editorial. Prioridades para as próximas entregas:

- Transformar tópicos agrupados em aulas próprias com mais de um problema e casos de transferência.
- Python: biblioteca padrão por domínio, descritores, typing avançado, multiprocessing com falhas, distribuição e interoperabilidade.
- TypeScript: testes de tipos em bibliotecas reais, resolução de módulos por ambiente, variância e validação de dados aninhados.
- C++: allocators, corrotinas com scheduler real, memória atômica, interoperabilidade, builds com várias unidades e versões posteriores a C++20.
- HTML/CSS: mídia com arquivos e legendas reais, widgets completos, compatibilidade por navegador e recursos recentes com fallback.
- JavaScript: protocolos completos, internacionalização, workers e cancelamento, módulos em diferentes hosts e gerenciamento explícito de recursos.
- C#: testes com frameworks, ASP.NET por fluxo, EF Core com provedor real, source generators, AOT e diagnóstico de produção.
- SQL: cenários concorrentes com duas sessões, isolation/retry, planos com distribuição realista, migrations e restauração verificada.
- Algoritmos, estruturas de dados, redes, Git, testes e arquitetura: acrescentar percursos próprios além do contexto presente nos módulos.

A automação existente retoma a expansão a cada quatro horas. Deve conferir o checkpoint e a PR antes de editar e avisar apenas sobre mudanças relevantes.

## Manutenção do catálogo

As definições por linguagem são a fonte de verdade. `npm run content:generate` recria o índice de navegação e a matriz JSON; `npm run build` confere que os dois estão sincronizados. Uma aula nova exige revisar também o mapa editorial, os limites de cobertura da edição e as contagens dos testes. Vincule cada tópico de prática independente aos ids de atividades que o exercitam; um título novo ou exemplo geral não promove sozinho o status de todos os tópicos. Não reduza os critérios de profundidade para acomodar conteúdo incompleto.

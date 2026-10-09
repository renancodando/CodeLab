# Aprendizagem com prática, revisão e projetos

## Mecanismos nesta expansão

- Atividades próprias em HTML, CSS, JavaScript, TypeScript, Python, C#, C++ e SQL. O [resumo gerado](metricas-catalogo.md) informa quantidades atuais e distribuição. Desafios JS começam quebrados e são conferidos com casos distintos, entradas vazias, negativos, não mutação e limites.
- Metadados de apresentação não incluem soluções ou verificações. Consultar solução é explícito e registrado como assistência. Os verificadores locais são inspecionáveis; não se promete sigilo nem integridade contra edição do armazenamento.
- Pausas por afterBlock 1, 3 e 5 são inseridas somente nas aulas referenciadas. As demais aulas continuam com leitura completa e suas práticas existentes; a migração geral permanece trabalho futuro.
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

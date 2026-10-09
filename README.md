# CODELAB

Plataforma de estudo de programação com **20 trilhas, 136 aulas e oito missões de código**. Sem login, contas ou banco de usuários: nome, progresso, rascunhos e projetos ficam somente no `localStorage` deste navegador. Exportação e importação JSON permitem levar a jornada a outro dispositivo.

## Executar

Node.js **24 LTS** e npm. O SDK **.NET 10** é opcional para estudar e executar HTML/JavaScript; é necessário para a API e os testes completos de integração.

```sh
npm ci
npm run dev
```

Abra `http://127.0.0.1:5173/`. Para compilar as páginas públicas e executar o servidor opcional:

```sh
npm run build
dotnet run --project server/CodeLab.Api.csproj
```

O servidor atende em `http://127.0.0.1:5080/` e também serve o conteúdo de `dist/`. O Vite encaminha `/api` para essa porta durante o desenvolvimento. Não há configuração de conta ou banco para iniciar.

## Aprender e criar

As 12 trilhas originais têm cinco aulas e **12 capítulos internos por aula**. Python, TypeScript, C++ e JavaScript têm dez aulas por trilha; as outras quatro linguagens têm nove: os módulos panorâmicos têm **13 capítulos**, e as 28 aulas de aprofundamento têm **17 capítulos**, incluindo dois problemas independentes e resoluções comentadas. A leitura original segue esta sequência: conexão com a jornada, contexto, modelo mental, raciocínio passo a passo, leitura linha por linha, previsão, experimentos controlados, depuração, prática em quatro níveis, aplicação real, análise da solução e critérios de domínio:

| Trilha | Conteúdo |
| --- | --- |
| Começando | Programas, algoritmos, entradas/saídas, decomposição e diagnóstico |
| Lógica | Tipos, operadores, decisões, loops, funções, arrays e objetos |
| JavaScript | Strings, coleções, callbacks, módulos, JSON, erros e assincronismo |
| HTML | Documento, semântica, formulários, imagens, tabelas e acessibilidade |
| CSS | Cascata, box model, tipografia, Flexbox, Grid, responsividade e animação |
| DOM | Elementos, eventos, formulários, componentes, ciclo de vida e armazenamento |
| APIs | HTTP, métodos, contratos, fetch, identidade conceitual, cache e limites |
| C# e .NET 10 | Tipos, controle, métodos, classes, interfaces, LINQ, arquivos e testes |
| ASP.NET Core | Rotas, DI, DTOs, validação, middleware, configuração e autorização conceitual |
| Banco de dados | Modelagem, chaves, CRUD, JOIN, agregações, transações, índices e parâmetros |
| Full stack | Arquitetura, integração, testes de jornada, publicação e desempenho |
| Projetos reais | Diário, tarefas, painel de clima, catálogo e entrega documentada |

As oito missões de fundamentos avaliam código e casos de fronteira automaticamente. As aulas originais possuem roteiros por tema e a expansão acrescenta seis seções de teoria própria por módulo. Todas as **136 aulas têm conteúdo, prática e aplicação específicos**. Cada aula sabe qual conteúdo veio antes e qual vem depois, explica por que o assunto existe, constrói um modelo mental, desmonta o exemplo linha por linha, propõe experimentos, ensina depuração e termina com um pequeno projeto e critérios verificáveis de domínio. As perguntas registram respostas sobre um conceito; os exercícios abertos não possuem correção automática completa. Conceitos de autenticação fazem parte do conteúdo, mas não são funcionalidades de conta da plataforma.

O laboratório oferece HTML/CSS/JavaScript em preview isolado, JavaScript em interpretador separado e exportação de arquivos. Até **12 projetos independentes** podem ser salvos, renomeados e removidos. Começar outro projeto não substitui o anterior. O build gera **156 páginas educacionais estáticas**, incluindo as aulas, os seis percursos e os oito projetos, legíveis sem JavaScript. O aplicativo mantém a leitura extensa e acrescenta pausas corrigíveis nas aulas ligadas às novas atividades.

## Aprendizagem ativa

- **Atividades nas oito linguagens**, incluindo programas JavaScript quebrados. Os verificadores conferem resultados e casos de borda, com feedback antes da solução. As [métricas geradas](docs/metricas-catalogo.md) acompanham o catálogo atual. Os casos ficam fora da apresentação da tentativa e são inspecionáveis no pacote local.
- **Python, C# e C++ sem Judge0 para atividades conceituais**: previsão, reconstrução e decisões com correção local. Essas respostas não comprovam execução de compilador; a bancada de execução completa mantém seus requisitos.
- **Domínio por habilidade**: árvore por linguagem, assunto e habilidade, baseada em avaliações distintas, tentativas, pistas e assistência. Leitura e notas manuais de projeto não fabricam desempenho.
- **Revisão de 1, 3, 7, 14, 30 e 60 dias**: erros encurtam o intervalo; revelar uma solução após tentativa registra assistência imediatamente. A sessão contém até duas revisões, um conceito, duas práticas e um desafio. O plano é retomável e a linguagem fica fixa depois de iniciá-lo.
- **Percursos de engenharia**: algoritmos, estruturas, redes, Git, testes e arquitetura com teoria própria, exemplos, falhas, exercício, solução e decisão conceitual corrigida.
- **Projetos de conclusão com marcos e critérios**: um produto cresce durante cada percurso. Há vários arquivos, rubrica manual, notas preservadas, invalidação das evidências após editar, ZIP e backup da jornada.
- **Estudo offline após preparação**: no build de produção, o service worker prepara aplicativo, módulos, estilos e WASM. Aguarde a mensagem de preparação; conteúdo e atividades locais podem continuar sem conexão. APIs, clima, fontes externas e execução remota dependem de rede.
- **Persistência informada**: se o navegador recusar a gravação, as alterações continuam em memória e podem ser exportadas antes de sair. Apagar os dados ou fechar uma sessão que não conseguiu salvar pode perder mudanças sem backup.

As pausas a cada um a três blocos são inseridas apenas nas aulas ligadas às atividades corrigíveis. A expansão das demais aulas e a autocorreção de exercícios abertos permanecem no mapa de trabalho. Consulte [os mecanismos e limites](docs/aprendizagem-com-pratica.md).

## Ambiente vivo

- Motor de evidência separa modelo, observação, radar e pluviômetro. Open-Meteo é previsão, com consulta optativa a cada 30 min; previsão isolada não inicia chuva local.
- Uma consulta compartilhada por local, cancelamento ao trocar de seleção, timeout de dez segundos e cache limitado a quatro locais. Sem gravar coordenadas no perfil; localização aproximada, solicitada apenas ao acionar a opção.
- Observação NOAA/AWC METAR usa uma rota na mesma origem, disponível no backend .NET e como função Node.js na Vercel: sete estações permitidas e cache de 10 min, sem enviar coordenadas ao NOAA. Fora da cobertura ou sem rota disponível, o mundo continua estimado. Radar, CPTEC e Cemaden não estão ativos; consulte [fontes e limitações](docs/meteorologia.md).
- Captura, recebimento, validade, distância e concordância regulam confiança. Falhas mantêm o último estado, envelhecem dados e retiram sustentação de chuva local, sem travar navegação.
- Transições mais lentas e graduais, umidade acumulada, secagem conforme temperatura/sol/vento/umidade, materiais mais escuros e menos ásperos, poças e ondulações aproximadas por shaders.
- Campo persistente de nuvens baixas, médias e altas, com sementes, vida, crescimento e dissipação; células visuais acompanham massas baixas. Vento e rajadas são compartilhados com vegetação, chuva, névoa, água e áudio.
- Chuva inclinada, partículas reaproveitadas, respingos menores, neve/granizo, folhas, vento coerente na vegetação, água e nuvens. Aves diminuem progressivamente com chuva, vento e tempestade; cachoeiras respondem ao histórico de chuva.
- Sol e Lua calculados com SunCalc, fase lunar e máscaras espaciais nas estrelas. Camadas e radiação modulam luz. Clarões exigem evidência observacional convectiva, ficam desativados por padrão e são suprimidos com movimento reduzido. Trovão tem atraso pela distância simulada.
- Áudio procedural de vento, chuva, cobertura, água, aves, noite e trovões, agora com volumes e transições mais discretos. Só começa após interação; pausa quando a aba fica oculta.
- Mundo continua em todas as páginas, com menor frequência fora da home. Aba oculta pausa desenho; qualidade se adapta aos tempos medidos. Movimento reduzido acompanha o sistema.

O interior é uma imagem com janelas transparentes; o exterior é 3D estilizado. Reflexos, névoa, células e secagem são aproximações coerentes, sem precisão física ou espacial de radar. Condensação atua nas janelas 3D; não há máscara independente dos vidros do interior. Cadência de consulta não altera a frequência de atualização da fonte.

## Memória e execução

- Monaco e seu modelo de texto são descartados juntos; montagens assíncronas abandonadas não criam editores ocultos.
- Cada execução JavaScript usa um Worker encerrado após resultado, cancelamento ou limite externo de oito segundos. O interpretador limita heap em 4 MiB, pilha em 256 KiB, execução em aproximadamente 1,2 segundo e quantidade de microtarefas. Esses limites não representam o consumo total do navegador/WebAssembly.
- Console, ações, código, histórico, projetos e dados importados têm limites. Salvamento durante digitação usa debounce.
- Apenas a variante de produção síncrona do QuickJS é incluída: aproximadamente **519 KB de WebAssembly**, em vez das quatro variantes que somavam cerca de 9,8 MB no build anterior. O arquivo é localizado explicitamente também no servidor Vite.
- Chuva e respingos reutilizam buffers/instâncias; materiais reutilizam cores. Sombras começam desativadas na qualidade média e, na qualidade alta, são atualizadas com menor frequência.
- A fila remota tem tamanho e concorrência limitados, máximo de 100 resultados, limpeza periódica, expiração e descarte do código após processamento. Leituras de saída remota são limitadas mesmo sem Content-Length.

## Testar

```sh
npm test
npm run build
dotnet build server/CodeLab.Api.csproj
npm run test:e2e
```

Playwright testa o build servido por `vite preview` e usa Edge instalado no Windows. A workflow de CI instala Chromium, executa `npm run test:e2e` e guarda capturas, traces e relatório quando há falha. A suíte ainda inicia a API .NET para verificar suas rotas e páginas estáticas enquanto a migração local não termina. Os testes usam Node 24, inclusive seu SQLite em memória para validar exemplos SQL. Vitest, Playwright e axe são dependências de desenvolvimento; nenhuma dessas ferramentas integra o bundle da aplicação.

A suíte verifica missões, loops infinitos, memória, Promises, currículo, importação de dados, WMO, chuva, umidade, secagem, previsão, timers, cache, cancelamento, modo offline e qualidade gráfica. A integração verifica API sem contas, editor, projeto, exportação/importação, quizzes, clima, áudio optativo, acessibilidade, larguras de 220 a 4000 pixels e, em 20 trocas de tela, a remoção de editores visíveis, Workers, crescimento do heap e estabilidade das geometrias.

Validação realizada em 26/09/2026: instalação limpa com `npm ci`, 82 testes locais e 17 testes de navegador aprovados, build de produção e build .NET concluídos sem erros. A missão também foi executada no build de produção servido pelo .NET. Cinco exemplos C# foram compilados/executados e uma consulta real ao Open-Meteo foi conferida.

Na medição automatizada de 20 trocas de tela no Edge, após coleta de lixo, o heap JavaScript passou de 15,62 MB para 18,25 MB (crescimento de aproximadamente 2,52 MiB), com zero modelos Monaco restantes ao sair do editor, zero Workers de execução restantes e 112 geometrias antes/depois. É uma medição deste cenário, não uma garantia de consumo total ou de desempenho em todos os dispositivos.

## Limites e dependências externas

1. **Python, C# e C++ na bancada:** exigem uma instância Judge0 configurada. A integração .NET está preparada, mas não há instância/credenciais incluídas. Exemplos C# também podem ser executados num projeto local com SDK .NET 10. ASP.NET completo precisa de um projeto local, não de um único arquivo no executor.
2. **SQL:** aulas e exemplos estão disponíveis e testados; a bancada permite escrever/exportar `.sql`, mas não inclui um motor SQL no navegador. Use uma base descartável e o dialeto indicado na aula. A expansão avançada utiliza PostgreSQL, verificado no CI; os exemplos SQLite do currículo original conservam seu contexto.
3. **Preview HTML:** sandbox e CSP isolam o documento pai, armazenamento e rede. Scripts de DOM não têm o limite de CPU do QuickJS. Use código conhecido e o botão Parar; um script infinito pode ainda exigir fechar a aba. Módulos, rede e localStorage devem ser testados no projeto exportado servido por HTTP.
4. **Projetos:** a bancada mantém um arquivo por projeto independente; os oito projetos progressivos têm vários arquivos, exportação ZIP e rubrica manual. Não há publicação de aplicações nem integração direta com repositórios pessoais. A área de comunidade foi removida para manter o foco em estudo, prática e construção.
5. **Dados locais:** limpar dados do navegador apaga a jornada. Não há sincronização remota. Exportar regularmente é o mecanismo de backup. A versão antiga de progresso é migrada; bancos de contas antigos, se existentes localmente, não são utilizados nem apagados automaticamente.
6. **Publicação:** enviar ao GitHub não configura hospedagem, domínio ou HTTPS. Defina `CODELAB_PUBLIC_URL` antes do build para canonical/sitemap/indexação. Sem domínio real, a indexação fica desativada. O build conserva chunks grandes de Monaco e Three.js, carregados sob demanda.
7. **Validação:** testes automatizados não substituem revisão pedagógica humana, leitor de tela real ou medição em todos os celulares/GPUs. Progresso local não deve fundamentar certificação ou ranking competitivo.

## API opcional e configuração

A API expõe `/api/health`, `/api/capabilities`, `/api/trilhas`, `/api/trilhas/{slug}`, `/api/licoes`, `/api/licoes/{slug}`, `/api/missoes`, `/api/referencias` e a fila `/api/executions`. Rotas de login, cadastro e progresso remoto foram removidas. O servidor não mantém contas, cookies de sessão ou banco de usuários.

As variáveis estão exemplificadas em `.env.example`; o .NET não carrega esse arquivo automaticamente. Configure no ambiente:

- `Judge0__Url`, `Judge0__Token`, `Judge0__Languages__python`, `Judge0__Languages__csharp`, `Judge0__Languages__cpp`.
- `Frontend__Origin` e `AllowedHosts` para o domínio real.
- `CODELAB_PUBLIC_URL` antes de executar o build, se houver hospedagem pública.

A fila é volátil. O identificador aleatório do trabalho permite consultar/cancelar o resultado sem conta. Cancelar interrompe a espera local; um trabalho já enviado ao Judge0 continua sujeito aos limites do serviço remoto. Código só é enviado quando o usuário pede execução de linguagem remota.

## Organização

`src/content/` contém aulas e missões; `src/state.ts` cuida da jornada local; `src/laboratory.ts` administra bancadas; `src/execution/` contém o interpretador; `src/environment/` separa consulta, normalização, simulação, partículas, nuvens, qualidade, áudio e cena. `server/` é a API opcional; `scripts/prerender.mjs` gera páginas e catálogo. `public/assets/casa.png` é a arte do interior. Fontes são carregadas do Google Fonts, com alternativas locais.

Referências técnicas: [MDN](https://developer.mozilla.org/pt-BR/docs/), [Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/), [SQLite](https://www.sqlite.org/lang.html), [QuickJS Emscripten](https://github.com/justjake/quickjs-emscripten), [SunCalc](https://github.com/mourner/suncalc) e [Open-Meteo](https://open-meteo.com/en/docs).


## Currículo aprofundado por linguagem

O catálogo tem 136 aulas em 20 trilhas. A expansão acrescenta percursos de HTML, CSS, JavaScript, TypeScript, Python, C#, C++ e SQL, com 48 módulos panorâmicos de treze capítulos e 28 aulas aprofundadas de dezessete capítulos. A matriz identifica 155 entradas com prática específica, além dos temas introduzidos; isso não representa esgotamento de todas as especializações. Consulte [a matriz de cobertura](docs/curriculo-completo.md) para temas, ambientes, gates e os aprofundamentos editoriais ainda previstos.

O conteúdo novo carrega por linguagem ao abrir a aula, mantendo um índice leve para navegação e busca. O build também entrega capítulos completos em páginas públicas sem JavaScript. TypeScript e PostgreSQL têm seu ambiente indicado, sem simular execução no laboratório atual.

As aulas de diálogos, Grid, iteradores e isolamento acrescentam testes de foco, dimensões, descarte e três cronogramas PostgreSQL com conexões reais. A entrega curricular da PR #4 foi validada com 118 exemplos externos, três cronogramas, 136 testes de unidade e 59 testes de navegador. A PR #5 de aprendizagem foi integrada após aprovação de 248 testes de unidade, 124 exemplos externos, três cenários Git, três cronogramas e 79 testes de navegador no [run 37641654276](https://github.com/renancodando/CodeLab/actions/runs/37641654276). As evidências e os aprofundamentos pendentes estão em docs/continuidade.md.

Para verificar exemplos externos em um ambiente de CI com Python, g++, .NET 10 e PostgreSQL disponível: `node scripts/verify-content-examples.mjs`. Esse script executa somente exemplos publicados do repositório; código de usuário continua no executor isolado do aplicativo.

Para conferir os cronogramas entre conexões, use o mesmo ambiente de estudo com PostgreSQL e execute `node scripts/verify-sql-concurrency.mjs`. O verificador cria esquemas exclusivos e encerra sessões antes de removê-los. Não o aponte para uma base de produção.

Ao editar aulas, atividades ou projetos, execute `npm run content:generate` para atualizar o índice leve, a matriz JSON, as métricas compartilhadas e o resumo deste README. O build rejeita artefatos desatualizados. Revise também o mapa editorial e os critérios dos testes ao publicar conteúdo; conserve os critérios de profundidade e execução. Os números de runs anteriores nos checkpoints são evidência histórica, não o catálogo atual.


### Últimos aprofundamentos integrados

| Linguagem | Aula própria | Prática e interação |
| --- | --- | --- |
| Python | `py-iteracao-recursos` | Iteradores, lotes, recursos; dois problemas e três pausas offline |
| TypeScript | `ts-variancia-contratos` | Variância, callbacks e propriedades de função; dois problemas e três pausas offline |
| C++ | `cpp-iteradores-invalidacao` | Retorno de erase, reserva e compactação; dois problemas e três pausas offline |
| JavaScript | `js-propriedades-prototipos` | Propriedades, descritores e receiver; dois problemas, três pausas e novo debugging executado |

<!-- metricas:inicio -->
O catálogo tem **136 aulas em 20 trilhas**, **56 problemas independentes** e **37 atividades corrigíveis**. As pausas dessas atividades estão ligadas a **44 aulas**. Há **6 percursos de engenharia com 18 etapas** e **8 projetos de conclusão com 57 marcos e 171 critérios manuais**.
<!-- metricas:fim -->

O resumo acima é gerado com as [métricas do catálogo](docs/metricas-catalogo.md), também usadas pela interface. JavaScript possui atividades executadas no sandbox; as demais decisões são conceituais e não comprovam compilação. O build rejeita resumos desatualizados.

Os gabaritos dessas entregas passam por ferramentas reais no CI. A resposta conceitual do estudante não comprova compilação; projetos abertos têm rubrica manual. Consulte [o checkpoint](docs/continuidade.md) para os heads e gates aprovados, e [as 17 frentes restantes](docs/etapas-restantes.md) para acompanhar o pedido integral. A verificação pública passou no fluxo Python de leitura, correção, persistência e retomada offline preparada; os demais fluxos publicados ainda precisam de evidências próprias.

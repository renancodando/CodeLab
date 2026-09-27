# CODELAB

Plataforma de estudo de programação com **12 trilhas, 60 aulas e oito missões de código**. Sem login, contas ou banco de usuários: nome, progresso, rascunhos e projetos ficam somente no `localStorage` deste navegador. Exportação e importação JSON permitem levar a jornada a outro dispositivo.

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

Cada uma das 12 trilhas tem cinco aulas transformadas em estudos profundos com **12 capítulos internos por aula**: conexão com a jornada, contexto, modelo mental, raciocínio passo a passo, leitura linha por linha, previsão, experimentos controlados, depuração, prática em quatro níveis, aplicação real, análise da solução e critérios de domínio:

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

As oito missões de fundamentos avaliam código e casos de fronteira automaticamente. As **60 aulas possuem roteiro próprio**, sem reutilizar o mesmo texto de aprofundamento entre temas. Cada aula sabe qual conteúdo veio antes e qual vem depois, explica por que o assunto existe, constrói um modelo mental, desmonta o exemplo linha por linha, propõe experimentos, ensina depuração e termina com um pequeno projeto e critérios verificáveis de domínio. As perguntas registram compreensão; os exercícios abertos não possuem correção automática completa. Conceitos de autenticação fazem parte do conteúdo, mas não são funcionalidades de conta da plataforma.

O laboratório oferece HTML/CSS/JavaScript em preview isolado, JavaScript em interpretador separado e exportação de arquivos. Até **12 projetos independentes** podem ser salvos, renomeados e removidos. Começar outro projeto não substitui o anterior. O build gera **66 páginas educacionais estáticas**, incluindo as 60 aulas, legíveis sem JavaScript.

## Ambiente vivo

- Consulta Open-Meteo optativa, com **intervalo e validade de cache de cinco minutos**.
- Uma consulta compartilhada por local, cancelamento ao trocar de seleção, timeout de dez segundos e cache limitado a quatro locais. Sem gravar coordenadas no perfil; localização aproximada, solicitada apenas ao acionar a opção.
- Dados atuais, previsão horária e nascer/pôr do sol. Códigos WMO distinguem garoa, chuva, neve, neblina e trovoadas. A previsão prepara nuvens e não é apresentada como chuva atual.
- Falha de rede reaproveita dados da mesma cidade por no máximo duas horas, com identificação de cache. Depois disso o ambiente fica neutro e explicitamente ilustrativo.
- Transições mais lentas e graduais, umidade acumulada, secagem conforme temperatura/sol/vento/umidade, materiais mais escuros e menos ásperos, poças e ondulações aproximadas por shaders.
- O mundo prioriza microanimações discretas: vegetação com dois ritmos de vento de baixa amplitude, nuvens com deslocamento lento, água com ondas menores, estrelas com oscilação quase imperceptível, janelas com variação sutil de luz, aves com voo menos mecânico e parallax reduzido.
- Chuva inclinada, partículas reaproveitadas, respingos menores, neve/granizo, folhas, vento coerente na vegetação, água e nuvens. Aves diminuem progressivamente com chuva, vento e tempestade; cachoeiras respondem ao histórico de chuva.
- Sol e Lua calculados com SunCalc, fase lunar, estrelas e iluminação noturna. Clarões suaves só com códigos de trovoada, desativados por padrão e suprimidos com movimento reduzido. Trovão tem atraso estimado pela distância simulada.
- Áudio procedural de vento, chuva, cobertura, água, aves, noite e trovões, agora com volumes e transições mais discretos. Só começa após interação; pausa quando a aba fica oculta.
- Mundo continua em todas as páginas, com menor frequência fora da home. Aba oculta pausa desenho; qualidade se adapta aos tempos medidos. Movimento reduzido acompanha o sistema.

O interior é uma imagem com janelas transparentes; o exterior é 3D estilizado. Reflexos e efeitos de água são aproximações visuais, não simulações físicas ou um ambiente fotorealista integralmente 3D. O intervalo de consulta de cinco minutos não altera a frequência de atualização dos dados fornecidos pela Open-Meteo.

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

Playwright usa Edge instalado no Windows. Em CI, usa Chromium (`npx playwright install --with-deps chromium`). Os testes usam Node 24, inclusive seu SQLite em memória para validar exemplos SQL. Vitest, Playwright e axe são dependências de desenvolvimento; nenhuma dessas ferramentas integra o bundle da aplicação.

A suíte verifica missões, loops infinitos, memória, Promises, currículo, importação de dados, WMO, chuva, umidade, secagem, previsão, timers, cache, cancelamento, modo offline e qualidade gráfica. A integração verifica API sem contas, editor, projeto, exportação/importação, quizzes, clima, áudio optativo, acessibilidade, larguras de 280 a 3840 pixels e descarte de modelos em 20 trocas de tela.

Validação realizada em 26/09/2026: instalação limpa com `npm ci`, 82 testes locais e 17 testes de navegador aprovados, build de produção e build .NET concluídos sem erros. A missão também foi executada no build de produção servido pelo .NET. Cinco exemplos C# foram compilados/executados e uma consulta real ao Open-Meteo foi conferida.

Na medição automatizada de 20 trocas de tela no Edge, após coleta de lixo, o heap JavaScript passou de 15,62 MB para 18,25 MB (crescimento de aproximadamente 2,52 MiB), com zero modelos Monaco restantes ao sair do editor, zero Workers de execução restantes e 112 geometrias antes/depois. É uma medição deste cenário, não uma garantia de consumo total ou de desempenho em todos os dispositivos.

## Limites e dependências externas

1. **Python, C# e C++ na bancada:** exigem uma instância Judge0 configurada. A integração .NET está preparada, mas não há instância/credenciais incluídas. Exemplos C# também podem ser executados num projeto local com SDK .NET 10. ASP.NET completo precisa de um projeto local, não de um único arquivo no executor.
2. **SQL:** aulas e exemplos estão disponíveis e testados; a bancada permite escrever/exportar `.sql`, mas não inclui um motor SQL no navegador. Execute em um banco SQLite local descartável.
3. **Preview HTML:** sandbox e CSP isolam o documento pai, armazenamento e rede. Scripts de DOM não têm o limite de CPU do QuickJS. Use código conhecido e o botão Parar; um script infinito pode ainda exigir fechar a aba. Módulos, rede e localStorage devem ser testados no projeto exportado servido por HTTP.
4. **Projetos:** um arquivo por bancada, com exportação local. Não há publicação de aplicações nem integração direta com repositórios pessoais. A área de comunidade foi removida para manter o foco em estudo, prática e construção.
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

import type {DeepCourse} from './types';
export default {
  "id": "html-completo",
  "title": "HTML · do zero à plataforma web",
  "description": "Documentos semânticos, texto, formulários, mídia, acessibilidade e integração com o navegador.",
  "icon": "file-code-2",
  "language": "html",
  "source": "https://html.spec.whatwg.org/multipage/",
  "lessons": [
    {
      "id": "html-documentos",
      "title": "HTML: documento, árvore e semântica",
      "level": "Fundamentos",
      "summary": "Aprenda como HTML descreve um documento e como o navegador transforma sua fonte em uma árvore DOM. Estude estrutura, metadados, elementos semânticos, atributos globais e regras de parsing para construir páginas que funcionam sem depender da aparência ou de scripts para transmitir seu significado.",
      "topics": [
        "doctype html head body",
        "DOM parsing nesting",
        "lang charset viewport",
        "title meta link",
        "main header nav section article aside footer",
        "global attributes id class data",
        "boolean attributes",
        "void elements entities namespaces"
      ],
      "sections": [
        {
          "title": "Fonte e árvore não são a mesma coisa",
          "text": [
            "HTML é uma linguagem de marcação que descreve conteúdo e estrutura. O navegador faz parsing e cria uma árvore de nós. Ele pode corrigir marcação inválida, portanto o DOM observado pode diferir do que a fonte parece expressar.",
            "A indentação ajuda humanos, mas não substitui as regras de aninhamento. Fechar um elemento no lugar errado pode deslocar conteúdo; colocar certos blocos dentro de p pode encerrar o parágrafo implicitamente. Confira a árvore e valide a marcação."
          ]
        },
        {
          "title": "Estrutura mínima e metadados",
          "text": [
            "O doctype seleciona o modo de documento apropriado. html contém head para metadados e body para conteúdo. Declare charset cedo, use um title que identifique a página e configure viewport para layouts adaptados a telas.",
            "lang informa o idioma e ajuda pronúncia e ferramentas de leitura. meta description descreve a página para consumidores que a utilizam; não é uma garantia de apresentação em buscadores. link associa recursos e relações, não um conteúdo textual dentro da página."
          ]
        },
        {
          "title": "Semântica e regiões",
          "text": [
            "main identifica o conteúdo principal; nav organiza navegação importante; article representa conteúdo que pode fazer sentido como unidade; section agrupa uma parte temática, normalmente identificável por um título.",
            "header e footer dependem do contexto em que aparecem. aside contém material complementar. Não escolha o elemento pela aparência padrão: CSS controla apresentação, enquanto a marcação comunica a relação do conteúdo."
          ]
        },
        {
          "title": "Atributos e identificadores",
          "text": [
            "id identifica um elemento no documento e deve ser único. class pode reunir vários elementos para estilos ou comportamento. data-* guarda dados associados ao elemento, lidos por scripts como strings; ele não substitui estado estruturado da aplicação.",
            "Atributos booleanos como disabled são verdadeiros pela presença; disabled='false' continua ativado. Para desativá-los, remova o atributo ou use a propriedade DOM adequada. Essa diferença é importante em geração de HTML."
          ]
        },
        {
          "title": "Conteúdo permitido e caracteres",
          "text": [
            "Elementos void, como img e input, não contêm filhos HTML nem precisam de tag de fechamento. Entidades como &amp; representam caracteres especiais onde a sintaxe exige. Escape texto vindo de dados para que ele não vire marcação.",
            "SVG e MathML usam namespaces e têm regras próprias. Não aplique automaticamente todas as regras de tags e atributos HTML a esses conteúdos. Uma inserção por innerHTML é uma operação de parsing com uma fronteira de confiança."
          ]
        },
        {
          "title": "Validação e melhoria progressiva",
          "text": [
            "Construa primeiro um documento cujo conteúdo e navegação façam sentido sem script. Acrescente interação quando ela oferece uma função concreta. Uma falha de script não deveria tornar invisível toda a informação essencial.",
            "Use um validador de HTML, inspecione a árvore e percorra títulos e links por teclado. A ausência de erro visual não prova estrutura correta; os consumidores incluem leitores de tela, impressão e sistemas que processam o documento."
          ]
        }
      ],
      "code": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>Diário de estudos</title>\n</head>\n<body>\n  <header><h1>Diário de estudos</h1><nav aria-label=\"Principal\"><a href=\"#anotacoes\">Anotações</a></nav></header>\n  <main id=\"anotacoes\"><article><h2>Primeira descoberta</h2><p>HTML descreve a estrutura do conteúdo.</p></article></main>\n  <footer><p>Atualizado em <time datetime=\"2026-10-06\">6 de outubro de 2026</time>.</p></footer>\n</body>\n</html>",
      "output": "O navegador apresenta um documento com título principal, navegação por fragmento, conteúdo principal e uma data legível cuja representação técnica está em datetime.",
      "trace": [
        "head estabelece codificação, viewport e título do documento.",
        "O link aponta para um id que existe uma única vez.",
        "time conserva uma representação padronizada da data além do texto apresentado."
      ],
      "exercise": "Crie uma página de guia com um título principal, navegação para duas seções, um main e uma nota complementar. Cada link interno deve encontrar um id único e cada seção deve ter um título.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Guia de estudo</title></head><body><header><h1>Guia de estudo</h1><nav aria-label=\"Seções\"><a href=\"#inicio\">Começar</a> <a href=\"#revisao\">Revisar</a></nav></header><main><section id=\"inicio\"><h2>Começar</h2><p>Leia um exemplo e faça uma previsão.</p></section><section id=\"revisao\"><h2>Revisar</h2><p>Reconstrua o exemplo com dados diferentes.</p></section><aside><h2>Nota</h2><p>Guarde suas dúvidas.</p></aside></main></body></html>",
      "bug": "Atributos booleanos não interpretam a string false como uma negação. Um controle com disabled='false' continua desativado.",
      "bugCode": "<button disabled=\"false\">Continuar</button>",
      "repair": "Remova disabled para habilitar o botão. Em script, atribua button.disabled = false à propriedade; teste a participação do controle na navegação por teclado.",
      "checks": [
        "O documento possui idioma, codificação e título identificável.",
        "Cada fragmento aponta para um id único.",
        "A estrutura faz sentido sem CSS e sem JavaScript."
      ],
      "project": "Escreva um guia de estudos com três artigos e navegação interna. Valide o HTML e confira a árvore DOM, registrando uma correção que o parser teria feito silenciosamente.",
      "question": "O atributo disabled='false' habilita um botão?",
      "answer": "Não; a presença do atributo booleano o mantém desativado.",
      "distractors": [
        "Sim; o navegador interpreta false como uma negação.",
        "Sim; mas somente quando há aspas duplas."
      ]
    },
    {
      "id": "html-arvore-semantica",
      "title": "HTML: parser, árvore do documento e estrutura semântica",
      "level": "Fundamentos",
      "summary": "Leia HTML como uma descrição que o navegador transforma numa árvore, e não como uma sequência de caixas desenhadas. Esta aula investiga aninhamento, correções do parser, títulos, regiões e links internos. Os problemas pedem documentos completos e tabelas com relações claras, conferidos pela estrutura criada pelo navegador e pela navegação de teclado.",
      "source": "https://html.spec.whatwg.org/multipage/parsing.html",
      "topics": [
        "fonte HTML e árvore DOM",
        "fechamento implícito de p",
        "elementos void",
        "doctype e modo de renderização",
        "lang charset e title",
        "regiões main nav article",
        "hierarquia de headings",
        "caption th e scope"
      ],
      "sections": [
        {
          "title": "O navegador constrói uma árvore a partir do texto",
          "text": [
            "O código-fonte HTML é entrada para um parser que produz nós e relações de pai e filho. O DOM observado nas ferramentas do navegador pode conter elementos que não aparecem literalmente na fonte, ou relações diferentes das que o autor imaginou. Um documento com erros de aninhamento não precisa gerar uma página em branco: o parser tem regras de recuperação. Uma aparência plausível não prova que a estrutura está correta.",
            "Ao investigar HTML, compare a fonte e o painel de elementos. Pergunte quais nós ficaram dentro de main, onde um parágrafo terminou e qual heading descreve uma seção. Essa árvore participa de consultas DOM, seletores CSS e da informação disponível a tecnologias assistivas. Consertar a semântica pelo código permite uma estrutura previsível antes de qualquer ajuste de estilo."
          ]
        },
        {
          "title": "Nem todo elemento aceita qualquer filho",
          "text": [
            "Um p representa um parágrafo de conteúdo apropriado à sua categoria. Colocar um div dentro dele pode causar fechamento implícito do p pelo parser, deixando o div fora do parágrafo. A indentação da fonte não força a relação no DOM. O mesmo princípio aparece em listas e tabelas, cujos modelos de conteúdo determinam filhos permitidos. Use um contêiner adequado para agrupar blocos em vez de estender um parágrafo além do que ele representa.",
            "Elementos void, como img e input, não têm tag de fechamento em HTML. Escrever uma barra no fim de uma tag não transforma qualquer elemento em autocontido segundo a sintaxe XML. Um script ou div continua precisando do fechamento apropriado. Aprender quais elementos não têm conteúdo e quais exigem fechamento evita estruturas que só parecem corretas porque o navegador recuperou um erro."
          ]
        },
        {
          "title": "Metadados descrevem o documento inteiro",
          "text": [
            "O doctype moderno solicita o modo de renderização esperado para documentos HTML. Lang informa o idioma do conteúdo, charset declara a codificação e title nomeia o documento em contextos como a aba do navegador. Esses elementos não são meras mensagens decorativas. Uma página intitulada apenas Documento dificulta distinguir abas e resultados de navegação, mesmo que seu h1 seja bem escrito.",
            "A meta viewport participa da configuração da viewport em dispositivos móveis; ela não torna um layout responsivo sozinha. O CSS ainda precisa permitir reflow e tamanhos adequados. Use lang='pt-BR' para o idioma predominante e marque trechos em outro idioma quando isso tiver significado. Não escolha uma codificação diferente apenas para fazer acentos aparecerem: confira como o arquivo foi salvo e como o servidor o entrega."
          ]
        },
        {
          "title": "Regiões dão nomes às responsabilidades",
          "text": [
            "main contém o conteúdo principal da página. nav agrupa blocos de navegação relevantes, e article descreve uma composição independente quando essa independência faz sentido. section organiza uma seção temática, normalmente identificada por um heading. Uma div continua útil para um agrupamento sem significado semântico específico; não é necessário converter toda caixa visual numa section.",
            "Use header e footer conforme o contexto que introduzem ou encerram. Eles podem aparecer em uma composição interna, e não apenas uma vez como topo e rodapé do site. Um link interno para main oferece um caminho curto ao conteúdo para quem navega por teclado, mas seu destino precisa existir e ser alcançável. A semântica ajuda a explicar o documento; o comportamento do foco merece verificação no navegador."
          ]
        },
        {
          "title": "Headings e tabelas expressam relações",
          "text": [
            "h1 até h6 representam níveis de títulos. Escolha o nível pela relação entre seções, não pelo tamanho visual padrão. Um documento de curso pode ter h1 para o curso, h2 para módulos e h3 para aulas de cada módulo. Um salto de nível sem motivo dificulta entender a hierarquia. O HTML não exige que você use um elemento semântico para cada estilo de fonte, e o CSS pode alterar a apresentação sem alterar o nível do título.",
            "Em tabelas de dados, caption fornece um título e th identifica células de cabeçalho. scope='col' e scope='row' descrevem relações simples com colunas e linhas. Tabelas complexas podem exigir associações mais explícitas. Não use table só para posicionar conteúdo sem relação tabular: você introduziria relações de dados que a interface não possui. Antes de escrever as células, identifique quais dados uma linha e uma coluna representam."
          ]
        },
        {
          "title": "Conferir a estrutura é parte da autoria",
          "text": [
            "Para verificar um documento, conte regiões principais, confira ids únicos, siga os links de fragmento e leia os headings em ordem. Inspecione a árvore de um trecho com aninhamento inválido e compare-a com uma versão corrigida. Esses passos revelam problemas que uma captura visual pode deixar passar. Um título e um link devem continuar fazendo sentido mesmo quando o leitor não vê o layout inteiro.",
            "As soluções da aula são documentos completos e legíveis sem JavaScript. Os testes de navegador verificam nós e relações concretas, além de headings e destinos. Isso não equivale a uma avaliação completa com todas as tecnologias assistivas, mas confere os mecanismos ensinados. Transfira a estrutura para uma página de documentação: preserve o significado das regiões e use CSS para apresentação quando houver necessidade."
          ]
        }
      ],
      "code": "<!doctype html>\n<html lang=\"pt-BR\">\n<head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Guia de estudos — CodeLab</title></head>\n<body>\n<a href=\"#conteudo\">Ir ao conteúdo</a>\n<header><h1>Guia de estudos</h1><nav aria-label=\"Seções\"><a href=\"#modulo\">Módulo inicial</a></nav></header>\n<main id=\"conteudo\" tabindex=\"-1\">\n<section id=\"modulo\"><h2>Módulo inicial</h2>\n<article><h3>Primeiro documento</h3><p>Uma página começa por conteúdo com relações claras.</p></article>\n</section>\n</main>\n<footer><p>Material de estudo.</p></footer>\n</body></html>",
      "output": "A árvore tem um main com a seção Módulo inicial e um article. A hierarquia é h1, h2, h3, e os dois links internos têm destinos existentes.",
      "trace": [
        "O head descreve idioma, codificação, viewport e título da aba.",
        "main contém a seção; article descreve uma aula independente dentro dela.",
        "Os links de fragmento apontam para ids únicos e o destino principal aceita foco."
      ],
      "exercise": "Escreva uma página completa de um módulo com título da aba, idioma, um main, duas seções com h2 e um link interno para a segunda. Evite colocar blocos dentro de p. O conteúdo precisa continuar disponível sem JavaScript.",
      "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Módulo de HTML</title></head>\n<body><header><h1>Módulo de HTML</h1><nav aria-label=\"Conteúdo\"><a href=\"#pratica\">Ir à prática</a></nav></header>\n<main><section><h2>Conceitos</h2><p>O parser produz uma árvore de elementos.</p></section>\n<section id=\"pratica\"><h2>Prática</h2><p>Confira fonte, árvore e destinos dos links.</p></section></main>\n</body></html>",
      "bug": "O autor colocou um div dentro de p e espera que o div seja seu filho. O parser encerra o parágrafo antes do bloco e a árvore não corresponde à indentação.",
      "bugCode": "<p id=\"introducao\">Antes<div id=\"bloco\">Conteúdo em bloco</div>Depois</p>",
      "repair": "Separe o parágrafo e o div em elementos irmãos dentro de um contêiner apropriado. Inspecione parentElement no navegador para conferir o que foi construído; não conclua a partir do recuo da fonte.",
      "checks": [
        "Um main descreve o conteúdo principal e os ids são únicos.",
        "Os headings expressam a hierarquia, sem escolher nível pela aparência.",
        "Os links internos encontram os destinos e o conteúdo funciona sem scripts."
      ],
      "project": "Crie uma página de documentação de três aulas com sumário por fragmento. Escreva títulos que façam sentido fora do contexto visual e confira a árvore no navegador. Acrescente uma tabela de prazos somente se linhas e colunas representarem dados reais.",
      "question": "Por que um div escrito dentro de p pode aparecer fora dele no DOM?",
      "answer": "O parser aplica regras de conteúdo e pode fechar p implicitamente antes do bloco.",
      "distractors": [
        "A indentação sempre força a relação e o painel DOM está errado.",
        "Todo elemento HTML aceita qualquer filho; somente CSS muda o pai dos nós."
      ],
      "practices": [
        {
          "id": "reparar",
          "title": "Problema 1: corrigir o agrupamento de blocos",
          "topics": [
            "fonte HTML e árvore DOM",
            "fechamento implícito de p",
            "hierarquia de headings"
          ],
          "prompt": "Produza um documento em que um article tenha h1, um parágrafo introdutório e uma section com h2 e outro parágrafo. Os dois parágrafos precisam pertencer aos contêineres pretendidos, sem usar p para envolver a section.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Estrutura de uma aula</title></head>\n<body><main><article id=\"aula\"><h1>Estrutura de uma aula</h1>\n<p id=\"intro\">Este parágrafo apresenta a aula.</p>\n<section id=\"atividade\"><h2>Atividade</h2><p id=\"instrucoes\">Confira os pais no DOM.</p></section>\n</article></main></body></html>",
          "explanation": [
            "article e section são contêineres de blocos adequados ao significado proposto. O parágrafo intro é filho direto do article; instrucoes fica dentro da section.",
            "A correção não depende de uma mudança visual. A evidência é a árvore: os parágrafos têm os pais esperados e a seção contém um heading do nível seguinte."
          ],
          "checks": [
            "intro pertence diretamente a aula.",
            "instrucoes pertence a atividade.",
            "Nenhum bloco foi colocado dentro de p."
          ]
        },
        {
          "id": "tabela",
          "title": "Problema 2: tabela com cabeçalhos de linha e coluna",
          "topics": [
            "caption th e scope",
            "lang charset e title"
          ],
          "prompt": "Descreva horas de estudo de duas pessoas em duas colunas de dados: pessoa e horas. Inclua caption e cabeçalhos de coluna; os nomes nas linhas devem ser cabeçalhos de linha. O título da aba precisa identificar o relatório.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Horas de estudo</title></head><body><main>\n<h1>Horas de estudo</h1><table id=\"horas\"><caption>Horas por pessoa nesta semana</caption>\n<thead><tr><th scope=\"col\">Pessoa</th><th scope=\"col\">Horas</th></tr></thead>\n<tbody><tr><th scope=\"row\">Lia</th><td>4</td></tr><tr><th scope=\"row\">Caio</th><td>6</td></tr></tbody>\n</table></main></body></html>",
          "explanation": [
            "Caption descreve o conjunto de dados, th com scope col descreve cada coluna e th com scope row identifica a pessoa à qual o valor pertence.",
            "A tabela usa relações reais de dados e não posicionamento de caixas. Para adicionar uma coluna de período, revise os cabeçalhos e a correspondência de células, mantendo a estrutura explícita."
          ],
          "checks": [
            "Há um caption e dois cabeçalhos de coluna.",
            "Lia e Caio são cabeçalhos de linha.",
            "O relatório identifica seu assunto em title e h1."
          ]
        }
      ]
    },
    {
      "id": "html-texto-links",
      "title": "HTML: texto, links, listas e tabelas",
      "level": "Fundamentos",
      "summary": "Estruture informação para leitura e navegação, usando títulos, parágrafos, ênfase, citações, código, listas e tabelas de dados. Aprenda URLs, fragmentos, caminhos e nomes acessíveis de links, preservando relações que continuam claras sem a disposição visual da página.",
      "topics": [
        "headings paragraphs emphasis",
        "strong em mark small",
        "blockquote cite q",
        "pre code whitespace",
        "ol ul dl",
        "URLs relative absolute fragments",
        "a download target rel",
        "tables caption th scope"
      ],
      "sections": [
        {
          "title": "Títulos e organização da leitura",
          "text": [
            "Títulos descrevem a hierarquia do conteúdo. h1 a h6 não são apenas tamanhos de fonte; escolha níveis segundo a estrutura e use CSS para apresentação. Um salto de nível sem motivo pode dificultar compreender as relações.",
            "Parágrafos representam unidades de texto. br é uma quebra dentro do conteúdo, não uma ferramenta para simular margens. Não monte uma coluna de conteúdo com dezenas de quebras quando a estrutura correta são parágrafos ou uma lista."
          ]
        },
        {
          "title": "Ênfase e significado",
          "text": [
            "em marca ênfase e strong importância; b e i têm outros usos semânticos conforme o contexto. mark pode destacar relevância numa busca, e small pode representar observações secundárias. O efeito visual padrão não é a definição desses elementos.",
            "blockquote representa uma citação em bloco e q uma citação curta. cite identifica uma obra em contextos apropriados, não qualquer autor por convenção visual. Escreva atribuições claras em texto quando a origem precisa ser compreendida."
          ]
        },
        {
          "title": "Código e espaços",
          "text": [
            "code identifica código; pre conserva espaços e quebras na apresentação usual. Ao mostrar HTML como texto, escape < e & para impedir que o exemplo vire elementos reais. Um bloco de código deve poder ser lido e copiado.",
            "Não use pre para alinhar uma tabela de dados com espaços quando os dados exigem cabeçalhos e relações. Mantenha linhas de código razoáveis e permita quebra ou rolagem no bloco sem forçar overflow da página inteira."
          ]
        },
        {
          "title": "Listas e descrições",
          "text": [
            "ul indica uma coleção sem ordem essencial; ol indica sequência ou classificação em que a ordem importa. li deve participar da estrutura de lista adequada. dl associa termos e descrições, podendo ter agrupamentos de várias relações.",
            "Escolha conforme o significado: passos de instalação normalmente exigem ordem; assuntos disponíveis podem não exigir. Uma sequência visual de cartões pode continuar sendo uma lista semanticamente, dependendo do conteúdo e da navegação."
          ]
        },
        {
          "title": "URLs e links compreensíveis",
          "text": [
            "URLs absolutas identificam uma origem completa; relativas são resolvidas pela base do documento. Um fragmento pode apontar para um id. Diferencie caminho relativo ao diretório atual de caminho que começa na raiz da origem.",
            "O texto do link deve explicar seu destino ou ação no contexto. target pode abrir outro contexto e rel expressa relações relevantes; download é uma indicação com limitações conforme origem e navegador. Não prometa um download que não verificou."
          ]
        },
        {
          "title": "Tabelas de dados",
          "text": [
            "table representa relações tabulares, não layout geral. caption identifica a tabela; th marca cabeçalhos e scope relaciona cabeçalhos de linhas ou colunas. Tabelas complexas podem exigir associações mais explícitas.",
            "thead e tbody organizam regiões e não corrigem cabeçalhos ausentes. Teste como cada célula será compreendida fora da disposição visual. Quando a tabela é larga, mantenha seu acesso sem tornar todo o documento horizontalmente deslocável."
          ]
        }
      ],
      "code": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Plano semanal</title></head><body><main><h1>Plano semanal</h1><ol><li>Ler o conceito</li><li>Executar o exemplo</li><li>Escrever uma variação</li></ol><table><caption>Minutos de estudo</caption><thead><tr><th scope=\"col\">Dia</th><th scope=\"col\">Minutos</th></tr></thead><tbody><tr><th scope=\"row\">Segunda</th><td>30</td></tr><tr><th scope=\"row\">Terça</th><td>45</td></tr></tbody></table><p>Exemplo: <code>console.log(&quot;Olá&quot;)</code>.</p></main></body></html>",
      "output": "A página apresenta passos ordenados e uma tabela cujo título e cabeçalhos explicam as relações entre dias e minutos. O código aparece como texto.",
      "trace": [
        "ol conserva a natureza sequencial dos passos.",
        "th de coluna e de linha fornece contexto para os valores.",
        "A entidade &quot; aparece como aspas dentro do exemplo."
      ],
      "exercise": "Crie uma tabela de três linguagens com colunas linguagem, uso e pré-requisito, caption e cabeçalhos. Acrescente uma lista de passos e um link interno para a tabela.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Linguagens</title></head><body><main><h1>Escolha uma linguagem</h1><p><a href=\"#comparacao\">Ver a comparação</a></p><ol><li>Escolha um objetivo</li><li>Revise o pré-requisito</li></ol><table id=\"comparacao\"><caption>Comparação de percursos</caption><tr><th scope=\"col\">Linguagem</th><th scope=\"col\">Uso</th><th scope=\"col\">Pré-requisito</th></tr><tr><th scope=\"row\">HTML</th><td>Documentos</td><td>Nenhum</td></tr><tr><th scope=\"row\">CSS</th><td>Apresentação</td><td>HTML</td></tr><tr><th scope=\"row\">JavaScript</th><td>Comportamento</td><td>Lógica</td></tr></table></main></body></html>",
      "bug": "Mostrar código HTML sem escapar caracteres pode criar elementos em vez de mostrar a fonte. Um exemplo aparentemente ausente pode ter sido interpretado pelo parser.",
      "bugCode": "<pre><code><button>Exemplo</button></code></pre>",
      "repair": "Use &lt;button&gt;Exemplo&lt;/button&gt; no texto HTML ou atribua o exemplo com textContent em script. Não insira texto não confiável por innerHTML.",
      "checks": [
        "Links indicam destino e fragmentos válidos.",
        "Listas representam ordem conforme o conteúdo.",
        "Cada tabela tem título e cabeçalhos que explicam as células."
      ],
      "project": "Escreva um manual pequeno de instalação com passos, notas, código escapado e uma tabela de requisitos. Leia o documento sem estilos e confira se todas as relações continuam claras.",
      "question": "Qual é o uso apropriado de table?",
      "answer": "Representar dados com relações tabulares e cabeçalhos.",
      "distractors": [
        "Posicionar qualquer interface em colunas.",
        "Substituir títulos e parágrafos por células vazias."
      ]
    },
    {
      "id": "html-formularios",
      "title": "HTML: formulários, validação e dados enviados",
      "level": "Intermediário",
      "summary": "Construa formulários com controles nativos, rótulos, grupos e instruções compreensíveis. Entenda name, value, tipos de input, submissão, validação de restrições, FormData e acessibilidade, sem confundir validação do navegador com confiança nos dados recebidos por um sistema.",
      "topics": [
        "form action method",
        "label name value",
        "input types textarea select",
        "checkbox radio fieldset legend",
        "required min max step pattern",
        "autocomplete inputmode",
        "constraint validation",
        "FormData successful controls",
        "client server validation"
      ],
      "sections": [
        {
          "title": "Rótulos e contrato de preenchimento",
          "text": [
            "label associa um nome visível ao controle por for e id ou pela estrutura permitida. Placeholder é uma dica temporária e não substitui o rótulo. Instruções e mensagens devem permanecer disponíveis quando o usuário começa a digitar.",
            "fieldset e legend agrupam controles relacionados, especialmente escolhas como radios. Um grupo precisa de uma pergunta compreensível, e cada opção de um rótulo próprio. Defina quais campos são obrigatórios antes de desenhar o formulário."
          ]
        },
        {
          "title": "name, value e envio",
          "text": [
            "name identifica um campo no conjunto de dados enviado; id serve a referências no documento e não o substitui. value representa o dado do controle conforme suas regras. Controles desativados normalmente não integram os dados de submissão.",
            "GET pode codificar dados na URL e é apropriado a consultas sem efeitos; POST envia no corpo e não significa criptografia ou autorização. Segurança depende também de HTTPS, validação e políticas do servidor quando houver um servidor."
          ]
        },
        {
          "title": "Tipos e experiência de entrada",
          "text": [
            "Escolha input conforme significado, como email, date ou number, e use textarea para texto multilinha. inputmode sugere teclado, mas não restringe nem valida por si só. autocomplete fornece pistas para preenchimento e deve refletir o campo.",
            "Um código postal pode ser texto mesmo quando parece numérico: zeros iniciais e formatos não aritméticos têm significado. Não use number apenas por conter dígitos. Teste o comportamento no teclado e em tamanhos diferentes."
          ]
        },
        {
          "title": "Escolhas e valores ausentes",
          "text": [
            "Radios com o mesmo name formam um grupo; checkbox marcado envia seu valor, enquanto um não marcado normalmente não aparece. Defina como a ausência será interpretada. select pode ter uma opção inicial que não é uma escolha válida.",
            "Botões dentro de form têm tipo padrão que pode submeter o formulário. Declare type='button' para ações locais e type='submit' para envio. Um botão de reset altera vários campos e pode surpreender usuários; só o ofereça com uma finalidade clara."
          ]
        },
        {
          "title": "Restrições e mensagens",
          "text": [
            "required, min, max, step e pattern participam da validação nativa nos controles adequados. reportValidity apresenta problemas e setCustomValidity define uma mensagem personalizada; limpe a mensagem quando a condição inválida deixar de existir.",
            "Validação no cliente melhora a experiência, mas pode ser contornada. Uma fronteira de dados precisa validar novamente o contrato. Não esconda falhas apenas com cor e relacione mensagens ao campo que precisa de correção."
          ]
        },
        {
          "title": "FormData e controle do fluxo",
          "text": [
            "FormData reúne dados conforme regras de controles bem-sucedidos e pode conter strings ou arquivos. Ler um campo exige tratar ausência e o tipo real. Convertê-lo para número sem verificar texto vazio pode criar um zero indevido.",
            "Intercepte submit quando o programa precisa tratar o envio localmente e só chame preventDefault com uma alternativa funcional. Preserve a ação por teclado: Enter e ativação do botão devem percorrer o mesmo fluxo de validação."
          ]
        }
      ],
      "code": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Meta de estudo</title></head><body><main><h1>Meta de estudo</h1><form id=\"meta\"><label for=\"minutos\">Minutos por dia</label><input id=\"minutos\" name=\"minutos\" type=\"number\" min=\"1\" max=\"180\" step=\"1\" required><button type=\"submit\">Conferir</button></form><p id=\"resultado\" role=\"status\"></p></main><script>document.querySelector('#meta').addEventListener('submit',event=>{event.preventDefault();const dados=new FormData(event.currentTarget);document.querySelector('#resultado').textContent='Meta: '+dados.get('minutos')+' minutos.';});</script></body></html>",
      "output": "O formulário exige um inteiro entre 1 e 180. Um envio válido apresenta a meta em uma região de status; o fluxo passa pela validação nativa antes do evento submit usual.",
      "trace": [
        "name inclui minutos nos dados do formulário.",
        "required e restrições numéricas descrevem o intervalo.",
        "textContent apresenta o dado sem interpretá-lo como HTML."
      ],
      "exercise": "Crie um formulário local com nome obrigatório, um grupo de três radios de linguagem e um checkbox opcional. Exiba uma confirmação textual e trate explicitamente a ausência do checkbox.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Plano</title></head><body><form id=\"plano\"><label for=\"nome\">Nome</label><input id=\"nome\" name=\"nome\" required><fieldset><legend>Linguagem</legend><label><input type=\"radio\" name=\"linguagem\" value=\"HTML\" required>HTML</label><label><input type=\"radio\" name=\"linguagem\" value=\"CSS\">CSS</label><label><input type=\"radio\" name=\"linguagem\" value=\"JavaScript\">JavaScript</label></fieldset><label><input type=\"checkbox\" name=\"revisar\" value=\"sim\">Incluir revisão</label><button type=\"submit\">Confirmar</button></form><p id=\"saida\" role=\"status\"></p><script>document.querySelector('#plano').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);document.querySelector('#saida').textContent=d.get('nome')+' escolheu '+d.get('linguagem')+'; revisão: '+(d.has('revisar')?'sim':'não');});</script></body></html>",
      "bug": "Um controle com id mas sem name pode aparecer e aceitar entrada, mas seu dado não participa do FormData normal.",
      "bugCode": "<form><label for=\"nome\">Nome</label><input id=\"nome\"><button>Enviar</button></form>",
      "repair": "Adicione name='nome' e verifique os dados efetivamente reunidos. Teste controles vazios, desativados e opções não marcadas, em vez de olhar apenas a aparência.",
      "checks": [
        "Todos os campos têm rótulos e grupos compreensíveis.",
        "Dados enviados têm nomes e ausência tratada.",
        "Erros são apresentados e a validação não depende somente de cor ou de um clique de mouse."
      ],
      "project": "Construa um planejador de estudo local com validação e resumo. Teste envio por Enter, nenhuma escolha, limite mínimo e máximo, e uma mensagem personalizada que desaparece após correção.",
      "question": "id é suficiente para incluir um input no FormData?",
      "answer": "Não; o controle precisa de name e deve cumprir as regras de participação.",
      "distractors": [
        "Sim; id e name são sempre equivalentes.",
        "Sim; todo elemento visual vira um campo enviado."
      ]
    },
    {
      "id": "html-dados-formulario",
      "title": "HTML: controles enviados, validação e botão de submissão",
      "level": "Intermediário",
      "summary": "Diferencie o que aparece no formulário do que realmente entra no conjunto de dados enviado. Esta aula compara name e id, disabled e readonly, caixas marcadas e desmarcadas e o botão que disparou a submissão. Os exemplos funcionam sem servidor e mostram FormData no próprio documento, preservando validação nativa e mensagens como texto.",
      "source": "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constructing-the-entry-list",
      "topics": [
        "name e id em papéis diferentes",
        "label e nome acessível",
        "disabled e readonly",
        "checkbox e ausência quando desmarcado",
        "nomes repetidos e getAll",
        "FormData e submitter",
        "validação nativa antes de submit",
        "botão type button versus submit"
      ],
      "sections": [
        {
          "title": "Ver um controle não garante que ele seja enviado",
          "text": [
            "Um formulário reúne controles, mas o conjunto de entradas enviado depende das regras de cada controle. id identifica um elemento no documento e ajuda label a apontar para ele; name identifica uma entrada nos dados. Um campo pode aparecer, aceitar digitação e ter label correto, mas ficar fora de FormData porque não tem name. A aparência do formulário não estabelece seu contrato de intercâmbio.",
            "Escreva uma tabela com controle, name, valor, estado e presença nos dados. Essa tabela precisa cobrir campos desativados, controles desmarcados e múltiplos valores com o mesmo nome. O contrato de quem recebe os dados deve dizer quais entradas podem estar ausentes e quais são obrigatórias. Não pressuponha que uma chave ausente equivale sempre a string vazia ou false."
          ]
        },
        {
          "title": "Label e name resolvem problemas distintos",
          "text": [
            "Um label associado pelo atributo for ao id do controle fornece um nome e permite ativá-lo ao clicar no texto. Esse vínculo também beneficia tecnologias assistivas, mas não substitui o atributo name. O formulário de estudo precisa ter os dois quando ambos os papéis são necessários. Placeholder não é uma substituição adequada de label, pois desaparece durante a digitação e não descreve todos os estados do campo.",
            "Use ids únicos e textos de label que façam sentido sem depender de uma posição visual. Quando um conjunto de escolhas tem uma pergunta comum, fieldset e legend podem descrevê-lo. O name repetido em radios estabelece um grupo de escolha; ids diferentes continuam necessários para labels individuais. Em checkboxes, nomes repetidos podem representar múltiplas seleções, que devem ser lidas como uma coleção."
          ]
        },
        {
          "title": "Disabled e readonly produzem estados diferentes",
          "text": [
            "Um controle disabled não participa normalmente da construção dos dados enviados e não é validado como um controle habilitado. Readonly, nos tipos aos quais se aplica, impede edição pelo usuário, mas o valor pode continuar no conjunto enviado. Não use os dois atributos como estilos intercambiáveis de campo cinza. Escolha o estado pela interação e pelo contrato dos dados.",
            "Esses atributos são booleanos em HTML: a presença ativa a condição, mesmo em disabled='false'. Para habilitar o controle, remova o atributo ou ajuste a propriedade DOM para false. Nenhum desses estados torna o valor confiável para um servidor. Uma pessoa pode alterar o documento e os dados recebidos ainda exigem validação na fronteira que efetivamente aplica regras do sistema."
          ]
        },
        {
          "title": "Ausência e multiplicidade fazem parte da estrutura",
          "text": [
            "Uma checkbox desmarcada normalmente não cria a entrada correspondente. Quando marcada, usa seu value ou o padrão definido pela plataforma. Um consumidor que precisa de um booleano pode traduzir presença e ausência para esse domínio, mas deve saber que se trata de uma regra do adaptador. Se um nome aparece em várias escolhas marcadas, FormData.get devolve uma entrada, enquanto getAll preserva a multiplicidade.",
            "Object.fromEntries transforma pares em um objeto, mas nomes repetidos podem sobrescrever valores e perder seleções. Para mostrar o conjunto completo sem esconder dados, o exemplo usa Array.from(formData.entries()). Essa representação também permite visualizar ordem e repetição. Antes de serializar para JSON, defina quais campos são escalares e quais são listas em vez de escolher um formato apenas por conveniência."
          ]
        },
        {
          "title": "O botão escolhido pode compor os dados",
          "text": [
            "Um botão submit com name e value pode indicar a ação solicitada, como salvar ou revisar. FormData(form, submitter) inclui o botão de submissão válido fornecido ao construtor. FormData(form) sozinho não identifica automaticamente qual botão foi clicado. O evento submit oferece submitter para que o exemplo preserve essa informação. Se não houver submitter, o código precisa escolher um comportamento explícito.",
            "Um button sem type dentro de form pode funcionar como botão de submissão. Para uma ação local que não deve enviar, como limpar uma prévia personalizada, use type='button'. A validação nativa é considerada antes de um envio iniciado pelo usuário ou requestSubmit; uma chamada direta a form.submit tem comportamento diferente e não equivale a clicar no botão. Não use essa diferença para contornar campos inválidos inadvertidamente."
          ]
        },
        {
          "title": "Validação nativa ajuda a pessoa, e dados continuam dados",
          "text": [
            "required, min, max, step e pattern expressam regras no navegador. Confira a validade no exemplo e trate estados inválidos com os recursos nativos ou mensagens associadas. Um formulário sem servidor pode interceptar submit e apresentar a prévia, mantendo o comportamento dos controles. Quando o exemplo passa a enviar para uma API, a API precisa reaplicar os contratos de entrada porque o navegador não é uma fronteira de confiança.",
            "O resultado é inserido com textContent, então um texto digitado com marcação aparece como texto e não como HTML executável. Teste uma entrada que contém sinais de menor e maior para conferir essa propriedade. Transfira o exemplo para uma inscrição de estudo: documente os nomes, os valores repetidos, as ausências e as ações antes de definir o esquema JSON que a aplicação consumirá."
          ]
        }
      ],
      "code": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Dados de uma inscrição</title></head><body>\n<main><h1>Dados de uma inscrição</h1>\n<form id=\"inscricao\">\n<label for=\"nome\">Nome</label><input id=\"nome\" name=\"nome\" required maxlength=\"60\">\n<label for=\"codigo\">Código</label><input id=\"codigo\" name=\"codigo\" value=\"A1\" readonly>\n<label for=\"interno\">Campo desativado</label><input id=\"interno\" name=\"interno\" value=\"não enviar\" disabled>\n<fieldset><legend>Assuntos</legend>\n<label><input type=\"checkbox\" name=\"assunto\" value=\"html\" checked>HTML</label>\n<label><input type=\"checkbox\" name=\"assunto\" value=\"css\">CSS</label></fieldset>\n<button type=\"submit\" name=\"acao\" value=\"salvar\">Mostrar dados</button>\n<button type=\"button\" id=\"limpar\">Limpar prévia</button>\n</form><pre id=\"resultado\" aria-live=\"polite\"></pre></main>\n<script>\nconst form=document.querySelector('#inscricao'),saida=document.querySelector('#resultado');\nform.addEventListener('submit',event=>{\n event.preventDefault();\n const dados=event.submitter?new FormData(form,event.submitter):new FormData(form);\n saida.textContent=JSON.stringify(Array.from(dados.entries()));\n});\ndocument.querySelector('#limpar').addEventListener('click',()=>{saida.textContent='';});\n</script></body></html>",
      "output": "Ao preencher Nome com Lia e enviar, aparecem nome=Lia, codigo=A1, assunto=html e acao=salvar. interno e assunto=css estão ausentes. A prévia mantém pares para não perder nomes repetidos.",
      "trace": [
        "required impede um envio vazio iniciado pelo botão.",
        "Readonly participa dos dados; disabled e a checkbox desmarcada não participam.",
        "event.submitter permite incluir a ação escolhida, e textContent mantém a prévia como texto."
      ],
      "exercise": "Monte um formulário com duas checkboxes de nome linguagem. Ao enviar, mostre getAll('linguagem') como JSON. Aceite nenhuma seleção como lista vazia e não perca a segunda escolha quando ambas estiverem marcadas.",
      "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Seleções múltiplas</title></head><body><main>\n<h1>Seleções múltiplas</h1><form id=\"escolhas\"><fieldset><legend>Linguagens</legend>\n<label><input type=\"checkbox\" name=\"linguagem\" value=\"html\">HTML</label>\n<label><input type=\"checkbox\" name=\"linguagem\" value=\"css\">CSS</label></fieldset>\n<button type=\"submit\">Conferir seleções</button></form><pre id=\"selecionadas\" aria-live=\"polite\"></pre></main>\n<script>document.querySelector('#escolhas').addEventListener('submit',event=>{\nevent.preventDefault();document.querySelector('#selecionadas').textContent=JSON.stringify(new FormData(event.currentTarget).getAll('linguagem'));\n});</script></body></html>",
      "bug": "O campo tem id e label, mas não name. A pessoa vê e preenche o controle, porém o campo não aparece em FormData. Adicionar placeholder não muda a regra de envio.",
      "bugCode": "<form id=\"f\"><label for=\"email\">E-mail</label><input id=\"email\" type=\"email\"></form>\n<script>console.log(new FormData(document.querySelector('#f')).get('email')); // null</script>",
      "repair": "Adicione name='email' e confira o contrato enviado. Id continua responsável pela relação com label; os dois atributos têm funções diferentes e podem até usar nomes distintos.",
      "checks": [
        "Campos enviados têm name e estados adequados.",
        "Nomes repetidos são tratados como coleção.",
        "Botão local não dispara submit e prévia usa textContent."
      ],
      "project": "Crie uma inscrição sem backend que exiba os pares enviados e uma tradução para um objeto de domínio. Documente quais campos são escalares e listas, como ausência de checkbox vira booleano e o que deve ser revalidado se houver uma API no futuro.",
      "question": "Qual diferença de envio existe entre disabled e readonly num input textual?",
      "answer": "Disabled fica fora dos dados; readonly pode continuar enviado, embora não editável pela interação normal.",
      "distractors": [
        "Os dois sempre são enviados e apenas mudam o estilo visual.",
        "Readonly remove o name automaticamente; disabled protege o valor no servidor."
      ],
      "practices": [
        {
          "id": "acoes",
          "title": "Problema 1: preservar a ação do botão",
          "topics": [
            "FormData e submitter",
            "botão type button versus submit"
          ],
          "prompt": "Crie um formulário com botões Enviar rascunho e Enviar final, ambos submit com name='acao'. Mostre a ação do botão clicado e inclua um botão local que altere uma mensagem sem submeter.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Ações de envio</title></head><body><main>\n<h1>Ações de envio</h1><form id=\"acoes\">\n<button type=\"submit\" name=\"acao\" value=\"rascunho\">Enviar rascunho</button>\n<button type=\"submit\" name=\"acao\" value=\"final\">Enviar final</button>\n<button type=\"button\" id=\"local\">Ação local</button></form><output id=\"acao\" aria-live=\"polite\"></output>\n<script>\nconst f=document.querySelector('#acoes'),o=document.querySelector('#acao');\nf.addEventListener('submit',e=>{e.preventDefault();o.textContent=new FormData(f,e.submitter).get('acao')??'sem botão';});\ndocument.querySelector('#local').addEventListener('click',()=>{o.textContent='local';});\n</script></main></body></html>",
          "explanation": [
            "O evento informa o submitter e o construtor inclui seu name/value. Sem esse argumento, a criação de FormData não escolhe um botão automaticamente.",
            "Ação local tem type button, portanto seu listener não se confunde com o envio. Se o formulário for enviado por código sem um submitter, revise o ramo de fallback conforme o contrato da aplicação."
          ],
          "checks": [
            "Cada submit produz sua ação específica.",
            "A ação local mostra local sem submeter.",
            "O evento é cancelado para a prévia não navegar."
          ]
        },
        {
          "id": "presenca",
          "title": "Problema 2: presença de controles nos dados",
          "topics": [
            "name e id em papéis diferentes",
            "disabled e readonly",
            "checkbox e ausência quando desmarcado",
            "nomes repetidos e getAll"
          ],
          "prompt": "Monte um formulário que permita observar readonly enviado, disabled omitido, campo sem name omitido e checkbox desmarcada omitida. Depois marque a checkbox e mostre que ela passa a aparecer, preservando as demais regras.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Presença nos dados</title></head><body><main>\n<h1>Presença nos dados</h1><form id=\"presenca\">\n<label for=\"fixo\">Fixo</label><input id=\"fixo\" name=\"fixo\" value=\"A\" readonly>\n<label for=\"off\">Desativado</label><input id=\"off\" name=\"off\" value=\"B\" disabled>\n<label for=\"visual\">Sem name</label><input id=\"visual\" value=\"C\">\n<label><input type=\"checkbox\" name=\"aceite\" value=\"sim\">Aceite</label>\n<button type=\"submit\">Conferir presença</button></form><pre id=\"dados\" aria-live=\"polite\"></pre>\n<script>document.querySelector('#presenca').addEventListener('submit',e=>{\ne.preventDefault();document.querySelector('#dados').textContent=JSON.stringify(Array.from(new FormData(e.currentTarget).entries()));\n});</script></main></body></html>",
          "explanation": [
            "Readonly mantém a entrada fixo; disabled e a falta de name eliminam outras entradas mesmo que os valores sejam visíveis.",
            "A checkbox muda o conjunto de pares pela sua marcação. O contrato de intercâmbio precisa considerar essa ausência, em vez de esperar que um valor false seja enviado automaticamente."
          ],
          "checks": [
            "Primeiro envio contém apenas fixo=A.",
            "Após marcar, aparece também aceite=sim.",
            "off e o campo visual permanecem ausentes."
          ]
        }
      ]
    },
    {
      "id": "html-midia",
      "title": "HTML: imagens, mídia e conteúdo incorporado",
      "level": "Intermediário",
      "summary": "Inclua imagens, áudio, vídeo, gráficos e documentos externos com alternativas e políticas claras. Estude alt, dimensões, imagens responsivas, captions, controles, SVG, canvas e sandbox, reconhecendo que uma mídia visível não garante informação acessível nem um recurso seguro.",
      "topics": [
        "img alt width height",
        "srcset sizes picture",
        "figure figcaption",
        "audio video source track",
        "captions transcripts autoplay",
        "SVG canvas alternatives",
        "iframe title sandbox permissions",
        "lazy loading performance"
      ],
      "sections": [
        {
          "title": "Alternativa de imagem pelo contexto",
          "text": [
            "alt descreve a informação que a imagem fornece naquele contexto, não uma lista genérica de objetos visíveis. Uma imagem decorativa pode ter alt vazio para não repetir conteúdo sem função. Uma imagem que é link precisa comunicar o destino ou a ação.",
            "Dimensões ajudam a reservar espaço e reduzir mudanças de layout. Uma descrição extensa de um gráfico pode exigir texto ou tabela adicional, além de um alt curto que identifique a informação e a localização da explicação.",
            "Quando um link contém apenas uma imagem, sem outro texto ou nome fornecido, a alternativa da imagem deve comunicar o destino ou a ação. Um arquivo chamado fluxo-amplo.svg não explica que o link abre o relatório. Alt vazio é adequado para decoração quando a informação necessária já está em outro lugar; não o aplique por regra a todas as imagens pequenas. Teste o nome exposto e o foco do link pelo teclado; isso ainda não substitui conferir o contexto com tecnologias assistivas."
          ]
        },
        {
          "title": "Imagens responsivas",
          "text": [
            "srcset oferece candidatos e sizes descreve o tamanho de exibição esperado para candidatos por largura. O navegador escolhe conforme layout, densidade e outras condições; não suponha uma escolha fixa para todos os dispositivos.",
            "picture permite alternativas de formato ou direção de arte. Preserve um img como fallback. Verifique os arquivos reais e o conteúdo alternativo; uma marcação sofisticada não corrige uma imagem inadequada ou um caminho inexistente.",
            "Com descritores w, cada número corresponde à largura intrínseca do arquivo, não ao espaço CSS reservado. sizes descreve esse espaço: se o CSS ocupa a janela inteira até 600 px e metade acima, declare (max-width: 600px) 100vw, 50vw. sizes sozinho não muda a largura desenhada. A resolução, cache e decisões do navegador ainda influenciam o candidato; não apresente essa lista como uma promessa de baixar exatamente um arquivo em qualquer dispositivo.",
            "Dentro de picture, a primeira source cujas condições se aplicam e cujo tipo é suportado fornece os candidatos. Uma source sem media antes da versão compacta pode esconder o recorte específico. O img continua responsável pela alternativa textual e pelo fallback. Os diagramas fornecidos nas atividades têm versões vertical e horizontal com as mesmas três etapas; uma mudança de composição não deve eliminar informação essencial."
          ]
        },
        {
          "title": "Figuras e legenda",
          "text": [
            "figure reúne conteúdo autocontido e figcaption sua legenda. Nem toda imagem precisa de figure, e a legenda visível não substitui necessariamente alt. Os dois podem cumprir papéis diferentes sem repetir a mesma frase sem necessidade.",
            "Para uma imagem técnica, explique eixos, unidade e conclusão no texto. O leitor deve conseguir acessar a informação principal mesmo se o arquivo falhar ou não puder ser percebido visualmente.",
            "Teste também a proporção do recorte. Width e height do img ajudam a reservar espaço para sua versão padrão, mas uma fonte vertical pode ter outra razão. Defina dimensões coerentes nas sources quando precisar reservar esse recorte e use height: auto para não esticá-lo. Os exemplos de imagem das pausas fornecem arquivos SVG locais, que também entram no cache offline; o uso vetorial permite conferir a seleção sem prometer economia de bytes equivalente à de fotografias."
          ]
        },
        {
          "title": "Áudio e vídeo",
          "text": [
            "audio e video com controls oferecem controles nativos. source pode oferecer formatos alternativos; track fornece recursos como legendas. Não conte com autoplay de áudio, pois navegadores aplicam políticas e o usuário precisa controlar a reprodução.",
            "Legendas sincronizadas, transcrição e, quando necessário, descrição do conteúdo visual atendem necessidades diferentes. Teste teclado, pausa e volume, e forneça informação textual para conteúdo que não deve depender exclusivamente de ouvir ou ver."
          ]
        },
        {
          "title": "SVG e canvas",
          "text": [
            "SVG descreve uma estrutura vetorial que pode conter título e descrição; escolha uma estratégia de nome acessível segundo o contexto. Canvas desenha pixels e não expõe automaticamente o significado de cada forma.",
            "Um gráfico em canvas precisa de alternativa textual ou estrutura acessível paralela. Elementos interativos desenhados exigem teclado, foco e informações adicionais; desenhar um botão não cria um controle de formulário."
          ]
        },
        {
          "title": "Incorporação e isolamento",
          "text": [
            "iframe incorpora outro documento e deve ter um título que explique sua função. sandbox e políticas de permissões restringem capacidades segundo tokens e origem; combine-os com cuidado e não conceda permissões desnecessárias.",
            "loading='lazy' pode adiar recursos fora da área inicial, mas não é apropriado para todo recurso crítico. Medir tamanho, tempo e estabilidade de layout ajuda a escolher; a experiência deve continuar útil quando um recurso externo falha."
          ]
        }
      ],
      "code": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Gráfico de metas</title></head><body><main><h1>Metas da semana</h1><figure><svg role=\"img\" aria-labelledby=\"titulo-grafico descricao-grafico\" viewBox=\"0 0 200 100\" width=\"200\" height=\"100\"><title id=\"titulo-grafico\">Minutos em dois dias</title><desc id=\"descricao-grafico\">Segunda: 30 minutos. Terça: 45 minutos.</desc><rect x=\"20\" y=\"60\" width=\"50\" height=\"30\" fill=\"teal\"/><rect x=\"100\" y=\"45\" width=\"50\" height=\"45\" fill=\"navy\"/></svg><figcaption>Terça teve 15 minutos a mais que segunda.</figcaption></figure><dl><dt>Segunda</dt><dd>30 minutos</dd><dt>Terça</dt><dd>45 minutos</dd></dl></main></body></html>",
      "output": "O gráfico usa SVG embutido e uma alternativa textual completa. Ele funciona sem baixar imagens externas e seus valores continuam disponíveis fora das barras visuais.",
      "trace": [
        "title e desc são ligados ao gráfico por referências de id.",
        "width e height reservam uma área definida.",
        "A lista de dados oferece valores exatos além da interpretação visual."
      ],
      "exercise": "Crie uma figura SVG de progresso com título e descrição, uma legenda e o valor numérico em texto. O significado deve continuar claro se o gráfico for removido.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Progresso</title></head><body><main><h1>Progresso da meta</h1><figure><svg role=\"img\" aria-labelledby=\"nome desc\" width=\"200\" height=\"30\" viewBox=\"0 0 200 30\"><title id=\"nome\">Progresso de estudo</title><desc id=\"desc\">Foram concluídas três de cinco sessões.</desc><rect width=\"200\" height=\"30\" fill=\"silver\"/><rect width=\"120\" height=\"30\" fill=\"teal\"/></svg><figcaption>3 de 5 sessões concluídas, equivalentes a 60%.</figcaption></figure></main></body></html>",
      "bug": "Uma imagem informativa com alt vazio pode desaparecer da experiência de quem depende de uma alternativa. Por outro lado, uma imagem decorativa com descrição redundante pode adicionar ruído.",
      "bugCode": "<img src=\"grafico.png\" alt=\"\">\n<p>Veja os resultados no gráfico.</p>",
      "repair": "Defina a informação que o gráfico comunica e ofereça alt e descrição adequados. Para dados exatos, forneça também uma tabela ou texto com valores e unidades.",
      "checks": [
        "A informação principal existe em texto acessível.",
        "A mídia tem controles e alternativas apropriadas.",
        "Conteúdo incorporado recebe nome e permissões justificadas."
      ],
      "project": "Construa uma página de relatório com um gráfico embutido, tabela de dados e instruções para uma versão futura em vídeo. Liste recursos, alternativas e comportamento quando cada arquivo falhar.",
      "question": "Desenhar um botão em canvas cria automaticamente um botão acessível?",
      "answer": "Não; foco, teclado, nome e comportamento precisam de uma estrutura apropriada.",
      "distractors": [
        "Sim; qualquer retângulo vira um controle nativo.",
        "Sim; o navegador deduz automaticamente a ação pelo desenho."
      ]
    },
    {
      "id": "html-acessibilidade",
      "title": "HTML: acessibilidade e interação nativa",
      "level": "Avançado",
      "summary": "Implemente interações que respeitam teclado, foco e nomes acessíveis, usando elementos nativos antes de criar widgets complexos. Estude botões, links, details, dialog, popover, live regions e ARIA, verificando o comportamento completo em vez de confiar apenas na presença de atributos.",
      "topics": [
        "keyboard focus tabindex",
        "button versus link",
        "accessible names descriptions",
        "details summary",
        "dialog modal focus return",
        "popover support",
        "ARIA states relationships",
        "live regions",
        "progressive enhancement"
      ],
      "sections": [
        {
          "title": "Controle nativo e intenção",
          "text": [
            "Um link navega e um botão executa uma ação. Elementos nativos trazem comportamento de teclado e semântica que uma div com click não recebe automaticamente. Escolha o elemento pela intenção e evite controles interativos aninhados.",
            "Um nome acessível explica o controle. Texto visível costuma ser a melhor fonte; aria-label pode ser necessário para um botão só com ícone, mas não deve contrariar o texto que a pessoa vê."
          ]
        },
        {
          "title": "Foco e ordem",
          "text": [
            "A ordem natural de foco segue a estrutura e os controles disponíveis. tabindex='0' pode incluir um elemento na sequência; valores positivos criam uma ordem artificial difícil de manter. tabindex='-1' permite foco por script sem incluir na sequência usual.",
            "Não remova indicadores de foco sem uma alternativa perceptível. Ao inserir ou remover conteúdo, preserve uma posição compreensível. O usuário deve saber onde está e como retornar após fechar uma interação."
          ]
        },
        {
          "title": "Expansão nativa",
          "text": [
            "details e summary oferecem um mecanismo nativo de expansão. Use summary como rótulo da região e coloque conteúdo complementar dentro de details. Não dependa do formato visual da seta para comunicar toda a função.",
            "Um popover pode participar de uma interação não modal em navegadores com suporte. Ele não é automaticamente um diálogo modal nem um menu com todos os comportamentos esperados; selecione o padrão conforme a tarefa e mantenha fallback adequado."
          ]
        },
        {
          "title": "Diálogo e ciclo de foco",
          "text": [
            "dialog com showModal participa de um modo modal nativo. Dê-lhe um nome por um título relacionado e uma ação de fechamento. O foco inicial deve ajudar a tarefa; diálogos longos exigem cuidado para não levar o usuário a uma posição confusa.",
            "Teste Escape e o retorno ao controle que abriu o diálogo. Não substitua showModal apenas por adicionar open quando precisa de comportamento modal. O estado visual aberto é só uma parte da interação."
          ]
        },
        {
          "title": "ARIA descreve, não implementa",
          "text": [
            "ARIA adiciona nomes, estados e relações quando a semântica nativa não basta. aria-expanded informa um estado, mas não abre o conteúdo sozinho. aria-controls aponta para um elemento, mas não cria o comportamento de controle.",
            "Evite adicionar roles que contradizem o elemento nativo. Um widget personalizado exige implementar também teclado, foco, seleção e mudanças de estado. A presença de atributos não prova que essas operações funcionam."
          ]
        },
        {
          "title": "Mensagens e verificação",
          "text": [
            "Uma região role='status' pode comunicar uma atualização sem mover o foco. Não anuncie a cada tecla quando isso produz ruído. Mensagens urgentes e fluxo de erro exigem uma estratégia proporcional ao problema.",
            "Percorra a tarefa com teclado e confira nome, estado e resultado. Ferramentas automáticas detectam uma parte dos problemas; testes manuais de foco e compreensão continuam necessários para widgets e conteúdo real."
          ]
        }
      ],
      "code": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Revisão</title></head><body><main><h1>Revisão de estudos</h1><details><summary>Como revisar</summary><p>Reconstrua o exemplo sem consultar a solução.</p></details><button id=\"abrir\" type=\"button\">Escolher uma meta</button><dialog id=\"meta\" aria-labelledby=\"titulo\"><h2 id=\"titulo\">Escolher uma meta</h2><form method=\"dialog\"><label for=\"tema\">Tema</label><input id=\"tema\" name=\"tema\"><button value=\"fechar\">Fechar</button></form></dialog></main><script>const abrir=document.querySelector('#abrir'),meta=document.querySelector('#meta');abrir.addEventListener('click',()=>meta.showModal());meta.addEventListener('close',()=>abrir.focus());</script></body></html>",
      "output": "details permite revelar instruções. O botão abre um diálogo modal nomeado; fechar retorna o foco ao botão de origem.",
      "trace": [
        "O controle de abertura é um button com ação explícita.",
        "showModal ativa o comportamento modal nativo.",
        "O evento close reorganiza o foco para o controle que iniciou a tarefa."
      ],
      "exercise": "Crie um botão que alterna uma região de ajuda, mantendo aria-expanded e hidden coerentes. A ação deve funcionar por teclado e o foco deve continuar no botão.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Ajuda</title></head><body><button id=\"alternar\" type=\"button\" aria-expanded=\"false\" aria-controls=\"ajuda\">Mostrar ajuda</button><section id=\"ajuda\" hidden><h1>Ajuda</h1><p>Faça uma previsão antes de executar.</p></section><script>const botao=document.querySelector('#alternar'),ajuda=document.querySelector('#ajuda');botao.addEventListener('click',()=>{const aberto=botao.getAttribute('aria-expanded')==='true';botao.setAttribute('aria-expanded',String(!aberto));ajuda.hidden=aberto;botao.textContent=aberto?'Mostrar ajuda':'Ocultar ajuda';});</script></body></html>",
      "bug": "Uma div com evento click não recebe automaticamente foco nem a ativação nativa por Enter e Espaço. A interação pode funcionar só com mouse.",
      "bugCode": "<div onclick=\"alert('pronto')\">Continuar</div>",
      "repair": "Use button para a ação. Se um widget realmente exigir estrutura personalizada, implemente o padrão completo; trocar apenas o role não basta.",
      "checks": [
        "Toda ação necessária é operável por teclado.",
        "Nome, estado e conteúdo exibido permanecem coerentes.",
        "Abrir e fechar uma interação mantém uma posição de foco compreensível."
      ],
      "project": "Monte um fluxo de escolha de meta com ajuda expansível e confirmação modal. Teste Tab, Shift+Tab, Enter, Espaço e Escape e registre a ordem de foco em cada estado.",
      "question": "aria-expanded abre ou fecha uma região automaticamente?",
      "answer": "Não; descreve o estado, que deve acompanhar o comportamento implementado.",
      "distractors": [
        "Sim; ele executa o evento click.",
        "Sim; ele cria o conteúdo da região se estiver vazio."
      ]
    },
    {
      "id": "html-dialogo-foco",
      "title": "HTML: diálogo modal, foco e formas de encerramento",
      "level": "Avançado",
      "summary": "Construa um diálogo completo com nome acessível, foco inicial e retorno ao acionador. Diferencie show de showModal, submissão com method dialog, fechamento programático e cancelamento por Escape. Trate validação e alterações não salvas sem impedir que a pessoa consiga sair, e verifique as transições por teclado no navegador real.",
      "source": "https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element",
      "topics": [
        "dialog e nome acessível",
        "show versus showModal",
        "modalidade e conteúdo inerte",
        "foco inicial e acionador",
        "form method dialog e returnValue",
        "cancel e close",
        "formnovalidate para cancelar",
        "alterações não salvas e saída explícita"
      ],
      "sections": [
        {
          "title": "Escolha o comportamento que a tarefa exige",
          "text": [
            "Dialog representa uma interação apresentada em um contexto separado do restante do documento. Um diálogo pode ser não modal ou modal. Show abre uma interação sem tornar automaticamente o resto da página indisponível; showModal estabelece uma interação modal e permite ao navegador aplicar seu comportamento correspondente. Colocar apenas o atributo open não substitui esse método. Defina primeiro se a tarefa exige interromper a interação com o restante da página ou se uma seção comum já resolveria a necessidade.",
            "Uma confirmação de descarte pode justificar um diálogo curto. Uma página inteira de documentação geralmente precisa de navegação e leitura contínua. Não use modalidade como decoração para chamar atenção a qualquer mensagem. No exemplo, a pessoa escolhe uma ação explícita e depois retorna ao mesmo acionador. Esse contrato de entrada, escolha e retorno é o que os testes precisam observar, além de conferir se uma caixa apareceu."
          ]
        },
        {
          "title": "O conteúdo precisa de um nome e de uma estrutura legível",
          "text": [
            "Um título dentro do diálogo pode fornecer seu nome acessível por aria-labelledby, apontando para um id único existente. A pessoa que navega por teclado ou tecnologia assistiva precisa entender qual interação acabou de abrir. Não invente um título genérico como Atenção para todas as tarefas. Nomeie a decisão e escreva instruções que continuem compreensíveis quando lidas sem o contexto visual da página ao fundo.",
            "Para texto longo, preserve parágrafos, listas e headings que permitam navegar pela estrutura. Não converta um documento extenso numa única descrição concatenada. No formulário da atividade, label associa cada campo ao seu nome e as ações têm rótulos próprios. O elemento nativo oferece comportamento de diálogo, mas o autor ainda responde pelo conteúdo, pelas relações entre ids e pelas alternativas de saída."
          ]
        },
        {
          "title": "O foco é uma transição observável",
          "text": [
            "Ao abrir, escolha qual controle deve receber foco e justifique essa escolha pela tarefa. Autofocus pode identificar um destino inicial apropriado, como Cancelar numa confirmação destrutiva ou um campo que a pessoa precisa preencher. Não faça o primeiro Enter confirmar uma ação arriscada sem que isso corresponda à intenção expressa. Teste também abertura pelo teclado, já que clicar com o mouse e observar o desenho não prova onde a interação começou.",
            "Num diálogo modal, o restante do documento fica inerte para a interação correspondente. A pessoa deve conseguir operar os controles dentro dele e encerrar a tarefa. Ao fechar, o foco deve retornar a um destino coerente, normalmente o acionador ainda existente. O exemplo conserva esse elemento e reforça o retorno no evento close. Se a interface remover o acionador, estabeleça um destino alternativo que faça sentido; chamar focus num elemento desconectado não resolve o roteiro."
          ]
        },
        {
          "title": "Encerrar um formulário não é sempre enviar dados ao servidor",
          "text": [
            "Um form com method dialog pode encerrar seu diálogo quando submetido, sem uma requisição de formulário convencional. O valor do botão de submissão escolhido fornece returnValue para identificar a ação. Esse valor descreve a escolha, não valida todos os dados de domínio e não representa automaticamente uma operação salva num servidor. O exemplo usa confirmar e cancelar como resultados locais e mostra a decisão com textContent.",
            "As regras de validade do formulário continuam relevantes. Se um campo required estiver vazio, a ação de salvar pode ser impedida. Um botão para cancelar normalmente precisa de formnovalidate quando a intenção é permitir sair mesmo com um formulário incompleto. Não force a pessoa a preencher dados que ela decidiu abandonar. Confira que o botão local correto fecha o diálogo e que uma ação de salvar válida percorre a validação esperada."
          ]
        },
        {
          "title": "Cancelamento e fechamento expressam momentos diferentes",
          "text": [
            "O evento cancel permite observar uma solicitação de cancelamento, como Escape no comportamento usual. Ele pode ser cancelado com preventDefault quando existe uma regra justificada, por exemplo avisar sobre um rascunho alterado. O evento close observa que o diálogo foi encerrado. Organize cada efeito no momento adequado: limpar um aviso ao abrir, decidir sobre uma solicitação de cancelamento e apresentar o resultado depois de fechar são responsabilidades diferentes.",
            "ReturnValue pode conservar um resultado anterior se você não estabelecer o estado de uma nova abertura. No exemplo, ele é redefinido antes de showModal, para que Escape numa nova tentativa não pareça confirmar a tentativa anterior. Close pode receber um resultado explícito num fechamento programático. Não suponha que clicar no fundo encerra todo diálogo por padrão em qualquer configuração; ofereça botões claros e teste os mecanismos que seu componente realmente implementa."
          ]
        },
        {
          "title": "Uma proteção de rascunho precisa conservar uma saída",
          "text": [
            "Bloquear Escape por causa de mudanças pode ser útil somente quando o diálogo explica o motivo e permite escolher o que fazer. A atividade oferece uma ação explícita de descarte, que continua encerrando a interação. Não crie um estado em que cancelar é impedido e o único botão exige dados válidos para sair. O contrato deve permitir guardar, continuar editando ou abandonar, conforme o escopo da tarefa.",
            "Os testes abrem o diálogo, conferem o foco, tentam focar um controle externo, cancelam por teclado e submetem ações distintas. Também verificam o caso inválido e a possibilidade de descarte com rascunho. Isso confere os mecanismos ensinados em Chromium, mas não substitui toda avaliação em navegadores e tecnologias assistivas. Ao usar o padrão num projeto real, registre essas verificações adicionais e evite depender de comportamento novo sem conferir o suporte necessário."
          ]
        }
      ],
      "code": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Confirmar uma decisão</title></head><body><main>\n<h1>Confirmar uma decisão</h1><button id=\"abrir\" type=\"button\">Abrir confirmação</button>\n<button id=\"fora\" type=\"button\">Outra ação</button>\n<dialog id=\"confirmacao\" aria-labelledby=\"titulo\">\n<h2 id=\"titulo\">Confirmar a escolha</h2><p>Você pode confirmar ou voltar sem aplicar a ação.</p>\n<form method=\"dialog\"><button value=\"cancelar\" autofocus>Cancelar</button><button value=\"confirmar\">Confirmar</button></form>\n</dialog><output id=\"resultado\" aria-live=\"polite\"></output>\n<script>\nconst acionador=document.querySelector('#abrir'),dialogo=document.querySelector('#confirmacao');\nacionador.addEventListener('click',()=>{\n dialogo.returnValue='';\n dialogo.showModal();\n});\ndialogo.addEventListener('close',()=>{\n document.querySelector('#resultado').textContent=dialogo.returnValue||'cancelado';\n if(acionador.isConnected&&!acionador.disabled)acionador.focus();\n});\n</script></main></body></html>",
      "output": "Abrir coloca foco em Cancelar. Confirmar fecha e mostra confirmar. Numa nova abertura, Escape fecha e mostra cancelado porque o resultado foi redefinido. O foco retorna a Abrir confirmação.",
      "trace": [
        "ShowModal abre o diálogo modal e seu controle com autofocus recebe o foco inicial.",
        "A submissão method dialog fecha e registra o value do botão escolhido.",
        "Close apresenta o resultado como texto e devolve o foco ao acionador conservado."
      ],
      "exercise": "Crie um diálogo para escrever um nome obrigatório, com Guardar e Cancelar. Guardar só pode fechar quando o campo estiver válido; Cancelar precisa permitir sair com o nome vazio. Mostre nome e ação como texto, sem interpretar marcação digitada, e devolva foco ao acionador.",
      "checks": [
        "Guardar com nome vazio mantém o diálogo aberto.",
        "Cancelar pode encerrar com o campo vazio.",
        "O nome salvo aparece como texto e o foco retorna ao acionador."
      ],
      "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Guardar um nome</title></head><body><main>\n<h1>Guardar um nome</h1><button id=\"abrir\" type=\"button\">Editar nome</button>\n<dialog id=\"editor\" aria-labelledby=\"titulo\"><h2 id=\"titulo\">Editar o nome</h2>\n<form id=\"formulario\" method=\"dialog\"><label for=\"nome\">Nome</label><input id=\"nome\" name=\"nome\" required maxlength=\"60\" autofocus>\n<button value=\"cancelar\" formnovalidate>Cancelar</button><button value=\"guardar\">Guardar</button></form></dialog>\n<output id=\"resultado\" aria-live=\"polite\"></output>\n<script>\nconst abrir=document.querySelector('#abrir'),d=document.querySelector('#editor'),nome=document.querySelector('#nome');\nabrir.addEventListener('click',()=>{d.returnValue='';d.showModal();});\nd.addEventListener('close',()=>{\n document.querySelector('#resultado').textContent=d.returnValue==='guardar'?'guardado: '+nome.value:'cancelado';\n abrir.focus();\n});\n</script></main></body></html>",
      "bug": "O diálogo usa um formulário com campo required vazio, e o botão Cancelar participa da submissão validada sem formnovalidate. A pessoa que escolhe sair recebe a mesma exigência de preencher dados da ação de salvar.",
      "bugCode": "<dialog open><form method=\"dialog\">\n<label for=\"nome\">Nome</label><input id=\"nome\" required>\n<button value=\"cancelar\">Cancelar</button><button value=\"guardar\">Guardar</button>\n</form></dialog>",
      "repair": "Quando cancelar significa abandonar a edição, use formnovalidate nesse botão ou um botão type button com fechamento explícito. Mantenha a validação na ação de guardar e confira as duas trajetórias com o campo vazio. Não remova required de todo o formulário para consertar apenas a saída.",
      "project": "Implemente um editor local de uma preferência de estudo com diálogo, campo validado e rascunho. Defina foco inicial, resultado da submissão, Escape sem mudanças, Escape com mudanças e descarte explícito. Teste abertura e fechamento por teclado, retorno ao acionador e inserção de texto com sinais de marcação. Registre o que ocorre se o acionador for removido antes do fechamento e escolha um destino alternativo.",
      "question": "Por que o botão Cancelar da solução usa formnovalidate?",
      "answer": "Ele permite abandonar o formulário mesmo quando os campos required ainda estão inválidos, mantendo a validação na ação de guardar.",
      "distractors": [
        "Formnovalidate transforma o botão automaticamente numa requisição para o servidor.",
        "Esse atributo remove permanentemente required dos campos para todas as próximas ações."
      ],
      "practices": [
        {
          "id": "validacao",
          "title": "Problema 1: abandonar um formulário inválido",
          "topics": [
            "formnovalidate para cancelar",
            "form method dialog e returnValue",
            "dialog e nome acessível",
            "foco inicial e acionador"
          ],
          "prompt": "Monte um diálogo de nome obrigatório. Confira que Guardar vazio não encerra a interação, que Cancelar vazio encerra e que Guardar com o texto <b>Lia</b> mostra esses caracteres literalmente. A cada abertura reinicie o resultado da tentativa anterior.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Saídas de uma edição</title></head><body><main>\n<h1>Saídas de uma edição</h1><button id=\"abrir\" type=\"button\">Começar edição</button>\n<dialog id=\"d\" aria-labelledby=\"t\"><h2 id=\"t\">Escolher nome</h2><form method=\"dialog\">\n<label for=\"n\">Nome</label><input id=\"n\" required autofocus><button value=\"cancelar\" formnovalidate>Cancelar</button><button value=\"guardar\">Guardar</button>\n</form></dialog><output id=\"r\" aria-live=\"polite\"></output>\n<script>\nconst a=document.querySelector('#abrir'),d=document.querySelector('#d'),n=document.querySelector('#n'),r=document.querySelector('#r');\na.addEventListener('click',()=>{d.returnValue='';d.showModal();});\nd.addEventListener('close',()=>{r.textContent=d.returnValue==='guardar'?'guardado: '+n.value:'cancelado';a.focus();});\n</script></main></body></html>",
          "explanation": [
            "Required participa da ação Guardar; o navegador impede a submissão inválida e conserva a edição. Cancelar tem formnovalidate porque seu contrato é abandonar a tarefa sem completar o dado. A validade e a possibilidade de sair são verificadas separadamente.",
            "O resultado é reiniciado por tentativa e apresentado com textContent. Assim <b>Lia</b> não vira um elemento b nem uma decisão anterior reaparece como resultado de Escape. O retorno ao acionador é parte da trajetória de teclado, além da mudança de estado open."
          ],
          "checks": [
            "Guardar vazio mantém d aberto.",
            "Cancelar vazio fecha e retorna foco a abrir.",
            "Guardar mostra a marcação digitada literalmente."
          ]
        },
        {
          "id": "rascunho",
          "title": "Problema 2: proteger o rascunho e conservar uma saída",
          "topics": [
            "cancel e close",
            "alterações não salvas e saída explícita",
            "show versus showModal",
            "modalidade e conteúdo inerte"
          ],
          "prompt": "Abra um diálogo modal com um campo de rascunho. Escape sem alterações pode fechar. Depois de digitar, Escape deve manter a interação e explicar que há mudanças. Inclua Descartar como saída explícita, sem depender de clicar no fundo da página.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Rascunho de estudo</title></head><body><main>\n<h1>Rascunho de estudo</h1><button id=\"abrir\" type=\"button\">Escrever rascunho</button><button id=\"externo\" type=\"button\">Ação externa</button>\n<dialog id=\"d\" aria-labelledby=\"t\"><h2 id=\"t\">Rascunho</h2><form id=\"f\" method=\"dialog\">\n<label for=\"texto\">Texto</label><input id=\"texto\" autofocus><p id=\"aviso\" aria-live=\"polite\"></p>\n<button value=\"descartar\">Descartar</button><button value=\"guardar\">Guardar</button></form></dialog>\n<output id=\"r\" aria-live=\"polite\"></output>\n<script>\nconst a=document.querySelector('#abrir'),d=document.querySelector('#d'),f=document.querySelector('#f'),aviso=document.querySelector('#aviso');\nlet alterado=false;\na.addEventListener('click',()=>{f.reset();alterado=false;aviso.textContent='';d.returnValue='';d.showModal();});\ndocument.querySelector('#texto').addEventListener('input',()=>{alterado=true;});\nd.addEventListener('cancel',e=>{if(alterado){e.preventDefault();aviso.textContent='Há mudanças. Escolha Guardar ou Descartar.';}});\nd.addEventListener('close',()=>{document.querySelector('#r').textContent=d.returnValue||'cancelado';a.focus();});\n</script></main></body></html>",
          "explanation": [
            "Cancel representa a solicitação por Escape, que pode ser impedida somente no estado alterado definido pelo exemplo. Close representa o encerramento que realmente aconteceu. O aviso explica a regra e as ações do formulário continuam oferecendo guardar ou descartar.",
            "ShowModal estabelece a interação modal, enquanto show não imporia o mesmo estado ao conteúdo externo. A proteção não transforma o diálogo numa armadilha: Descartar fecha por uma ação explícita e o foco retorna ao acionador. O rascunho é reiniciado na abertura seguinte conforme o contrato desta atividade."
          ],
          "checks": [
            "Escape fecha antes de qualquer alteração.",
            "Escape após digitar mantém aberto e apresenta o aviso.",
            "Descartar fecha e devolve foco ao acionador."
          ]
        }
      ]
    },
    {
      "id": "html-plataforma",
      "title": "HTML: DOM, componentes e integração da plataforma",
      "level": "Especialização",
      "summary": "Conecte documentos a comportamento usando DOM e eventos, preservando conteúdo seguro e melhoria progressiva. Estude templates, custom elements, Shadow DOM, armazenamento, políticas de origem, workers e APIs do navegador, mantendo clara a diferença entre HTML, JavaScript e capacidades do ambiente.",
      "topics": [
        "DOM createElement textContent",
        "events propagation delegation",
        "template document fragments",
        "custom elements lifecycle",
        "Shadow DOM slots",
        "storage origin sandbox",
        "fetch workers host APIs",
        "CSP same-origin permissions",
        "SEO progressive enhancement"
      ],
      "sections": [
        {
          "title": "DOM como representação mutável",
          "text": [
            "querySelector encontra elementos pela estrutura atual; createElement e textContent constroem conteúdo sem interpretar texto como HTML. Referências a elementos removidos podem continuar vivas se callbacks ou coleções ainda os guardam.",
            "Use innerHTML apenas quando a origem da marcação e a política de segurança forem controladas. Para dados recebidos, construa elementos e atribua texto. O parser de HTML não é um mecanismo de escape."
          ]
        },
        {
          "title": "Eventos e delegação",
          "text": [
            "Eventos têm fases de propagação e podem oferecer ações padrão. preventDefault impede uma ação cancelável; stopPropagation altera propagação e não é o mesmo mecanismo. Não use ambos automaticamente sem entender o fluxo.",
            "Delegação registra um listener em um contêiner e identifica o alvo relevante. Confira se o alvo está dentro da região esperada. Libere listeners quando o componente termina, especialmente quando eles são registrados em window ou document."
          ]
        },
        {
          "title": "Templates e reutilização",
          "text": [
            "template guarda conteúdo que não é renderizado imediatamente; seu content pode ser clonado para criar instâncias. DocumentFragment reúne nós para montagem. Cada instância precisa manter ids e relações sem duplicação no documento.",
            "Reutilizar uma estrutura não significa compartilhar todo estado. Passe dados por um contrato e inicialize controles por instância. Teste duas instâncias ao mesmo tempo para descobrir referências ou ids globais indevidos."
          ]
        },
        {
          "title": "Custom elements e Shadow DOM",
          "text": [
            "Custom elements permitem componentes com callbacks de ciclo de vida. connectedCallback pode ocorrer novamente quando o elemento é reconectado; não registre listeners duplicados a cada conexão. Defina limpeza ou idempotência da inicialização.",
            "Shadow DOM cria uma fronteira de árvore e estilo, com slots para composição. Não é uma barreira de segurança contra todo script da página. Eventos e nomes acessíveis exigem atenção ao atravessar essas fronteiras."
          ]
        },
        {
          "title": "Capacidades, origem e persistência",
          "text": [
            "Armazenamento e acesso a recursos dependem de origem, permissões e políticas do navegador. localStorage é síncrono e guarda strings; IndexedDB oferece outra forma de persistência. Falha de cota ou política precisa de recuperação, não de silêncio.",
            "Um iframe sandbox pode não ter acesso ao armazenamento que o arquivo exportado terá quando servido por HTTP. fetch e workers são APIs do host. HTML não faz rede nem concorrência sozinho: o script precisa tratar falhas e encerrar recursos."
          ]
        },
        {
          "title": "Entrega e melhoria progressiva",
          "text": [
            "Disponibilize conteúdo útil no documento entregue e adicione comportamento em camadas. Metadados e links claros ajudam navegação e sistemas de indexação, mas não substituem conteúdo real. Teste uma página sem JavaScript quando esse for um requisito.",
            "CSP, política de mesma origem e permissões restringem capacidades, com regras próprias. Não desative políticas indiscriminadamente para fazer uma demo funcionar. Identifique a operação necessária e mantenha uma fronteira explícita e testável."
          ]
        }
      ],
      "code": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Notas locais</title></head><body><main><h1>Notas</h1><form id=\"nova\"><label for=\"texto\">Nova nota</label><input id=\"texto\" name=\"texto\" required><button>Adicionar</button></form><ul id=\"notas\"></ul><template id=\"modelo\"><li><span></span> <button type=\"button\">Remover</button></li></template></main><script>const form=document.querySelector('#nova'),lista=document.querySelector('#notas');form.addEventListener('submit',e=>{e.preventDefault();const campo=form.elements.namedItem('texto');const texto=campo.value.trim();if(!texto)return;const item=document.querySelector('#modelo').content.cloneNode(true);item.querySelector('span').textContent=texto;lista.append(item);form.reset();campo.focus();});lista.addEventListener('click',e=>{if(e.target instanceof HTMLButtonElement)e.target.closest('li').remove();});</script></body></html>",
      "output": "O formulário acrescenta notas como texto e cada botão remove sua própria linha. Um único listener no contêiner trata botões criados depois.",
      "trace": [
        "O template é clonado, criando nós independentes.",
        "textContent impede que o texto da nota vire marcação.",
        "A delegação encontra a linha associada ao botão acionado."
      ],
      "exercise": "Amplie o exemplo com um contador de notas em uma região de status, atualizando ao adicionar e remover. Não use innerHTML para o texto recebido e preserve a operação por teclado.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Contador de notas</title></head><body><form id=\"nova\"><label for=\"texto\">Nota</label><input id=\"texto\" required><button>Adicionar</button></form><p id=\"total\" role=\"status\">0 notas</p><ul id=\"lista\"></ul><script>const form=document.querySelector('#nova'),campo=document.querySelector('#texto'),lista=document.querySelector('#lista');const atualizar=()=>document.querySelector('#total').textContent=lista.children.length+' notas';form.addEventListener('submit',e=>{e.preventDefault();if(!campo.value.trim())return;const li=document.createElement('li'),b=document.createElement('button');li.append(document.createTextNode(campo.value.trim()+' '));b.type='button';b.textContent='Remover nota';b.addEventListener('click',()=>{li.remove();atualizar();campo.focus();});li.append(b);lista.append(li);campo.value='';atualizar();});</script></body></html>",
      "bug": "Usar innerHTML para mostrar uma entrada trata essa entrada como marcação e pode permitir execução ou alterações de estrutura fora do contrato.",
      "bugCode": "lista.innerHTML += '<li>' + campo.value + '</li>';",
      "repair": "Crie li e atribua o texto com textContent ou createTextNode. Quando uma funcionalidade realmente aceita HTML, use uma política de sanitização adequada e uma fronteira explícita.",
      "checks": [
        "Dados recebidos aparecem como texto.",
        "Duas instâncias não compartilham ids ou estado indevidamente.",
        "Listeners e recursos têm limpeza, e falhas de capacidade recebem tratamento."
      ],
      "project": "Transforme a lista de notas em um componente com ciclo de vida claro e uma camada separada de persistência. Teste duas instâncias, remoção e reinserção, falha de armazenamento e execução sem a camada de persistência.",
      "question": "Shadow DOM é uma barreira de segurança que impede todo script da página de acessar um componente?",
      "answer": "Não; ele oferece encapsulamento de árvore e estilo, com um contrato diferente de isolamento de segurança.",
      "distractors": [
        "Sim; substitui sandbox e CSP.",
        "Sim; torna desnecessário validar conteúdo inserido."
      ]
    }
  ]
} satisfies DeepCourse;

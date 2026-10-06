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
            "Dimensões ajudam a reservar espaço e reduzir mudanças de layout. Uma descrição extensa de um gráfico pode exigir texto ou tabela adicional, além de um alt curto que identifique a informação e a localização da explicação."
          ]
        },
        {
          "title": "Imagens responsivas",
          "text": [
            "srcset oferece candidatos e sizes descreve o tamanho de exibição esperado para candidatos por largura. O navegador escolhe conforme layout, densidade e outras condições; não suponha uma escolha fixa para todos os dispositivos.",
            "picture permite alternativas de formato ou direção de arte. Preserve um img como fallback. Verifique os arquivos reais e o conteúdo alternativo; uma marcação sofisticada não corrige uma imagem inadequada ou um caminho inexistente."
          ]
        },
        {
          "title": "Figuras e legenda",
          "text": [
            "figure reúne conteúdo autocontido e figcaption sua legenda. Nem toda imagem precisa de figure, e a legenda visível não substitui necessariamente alt. Os dois podem cumprir papéis diferentes sem repetir a mesma frase sem necessidade.",
            "Para uma imagem técnica, explique eixos, unidade e conclusão no texto. O leitor deve conseguir acessar a informação principal mesmo se o arquivo falhar ou não puder ser percebido visualmente."
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

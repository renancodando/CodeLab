import type {DeepCourse} from './types';
export default {
  "id": "css-completo",
  "title": "CSS · do zero ao avançado",
  "description": "Cascata, caixas, Flexbox, Grid, responsividade, tipografia, movimento e arquitetura de estilos.",
  "icon": "layers",
  "language": "html",
  "source": "https://www.w3.org/Style/CSS/specs.en.html",
  "lessons": [
    {
      "id": "css-cascata",
      "title": "CSS: seletores, cascata e valores",
      "level": "Fundamentos",
      "summary": "Aprenda a prever qual declaração CSS vence e por que um valor chega ao elemento. Estude seletores, herança, especificidade, ordem, camadas, custom properties e unidades, usando o painel de estilos como ferramenta de diagnóstico em vez de acumular !important a cada conflito.",
      "topics": [
        "selectors combinators attributes",
        "pseudo classes elements",
        "cascade origin importance layers",
        "specificity source order",
        "inherit initial unset revert",
        "custom properties var fallback",
        "computed used values",
        "relative absolute units"
      ],
      "sections": [
        {
          "title": "Seletores descrevem relações",
          "text": [
            "Seletores podem usar tipo, classe, id, atributos e relações como filho e descendente. A escolha deve corresponder à estrutura real. Uma cadeia muito dependente da posição do elemento pode quebrar quando o HTML é reorganizado.",
            "Pseudo-classes descrevem estados ou relações; pseudo-elementos representam partes ou conteúdo gerado. :is e :where têm regras distintas de especificidade. Conteúdo gerado não deve ser a única fonte de uma informação essencial."
          ]
        },
        {
          "title": "A cascata resolve conflitos em etapas",
          "text": [
            "A cascata considera aspectos como origem, importância, camadas e especificidade antes de usar a ordem como desempate apropriado. Não é correto dizer que a última regra sempre vence. Primeiro confirme se a regra se aplica e se a propriedade é válida.",
            "Uma declaração riscada no painel de estilos é evidência de outra escolha; uma declaração inválida pode ser ignorada. Investigue o valor calculado e a regra vencedora antes de adicionar outra classe ou !important."
          ]
        },
        {
          "title": "Especificidade e camadas",
          "text": [
            "Ids, classes e seletores de tipo contribuem de maneira diferente. A especificidade é comparada como componentes, não como um número decimal universal. Estilos inline e importância participam do contexto da cascata.",
            "@layer permite declarar uma ordem de camadas. Regras normais sem camada e regras importantes têm comportamentos de prioridade que exigem atenção; !important altera mais que uma disputa local. Defina uma política antes de distribuir camadas por arquivos."
          ]
        },
        {
          "title": "Herança e palavras de controle",
          "text": [
            "Algumas propriedades, como color, normalmente herdam; outras, como margin, não. inherit força herança, initial usa o valor inicial, unset escolhe entre herdar e inicial conforme a propriedade e revert retorna a uma etapa anterior da cascata.",
            "A palavra utilizada não recupera necessariamente o valor que o desenvolvedor imagina como padrão visual. Confira o valor inicial da propriedade e a origem das regras. Reset e normalização são decisões que afetam os controles nativos."
          ]
        },
        {
          "title": "Custom properties",
          "text": [
            "Custom properties armazenam valores que participam da cascata e normalmente herdam. var usa esse valor e pode oferecer fallback quando ele falta. O fallback não corrige qualquer combinação inválida com a propriedade de destino.",
            "Uma custom property não é sempre uma variável numérica pré-calculada. Sua substituição ocorre segundo regras de valores CSS; uma declaração pode falhar depois da substituição. Use nomes de tokens que expressem função e não apenas a cor atual."
          ]
        },
        {
          "title": "Unidades e valores efetivos",
          "text": [
            "px é uma unidade de referência CSS, não necessariamente um pixel físico. rem depende da raiz, em do contexto e percentuais de bases específicas da propriedade. Unidades de viewport também têm variantes para diferentes estados do viewport.",
            "Valor especificado, calculado e usado podem diferir. Um width percentual precisa de um bloco de referência apropriado; uma unidade pode ser válida e ainda produzir layout inadequado. Meça em contextos reais, zoom e texto mais longo."
          ]
        }
      ],
      "code": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Cascata</title><style>@layer base,componentes;@layer base{p{color:navy}}@layer componentes{.nota{color:var(--cor-nota,teal)}}:root{--cor-nota:purple}.nota{padding:1rem}</style></head><body><p class=\"nota\">A cor vem da camada componentes e o espaçamento de uma regra sem camada.</p></body></html>",
      "output": "O parágrafo fica roxo e recebe padding. A custom property definida na raiz herda até ele; a camada de componentes define a cor aplicada.",
      "trace": [
        "A ordem das camadas é declarada antes das regras.",
        "var lê o token herdado e só usa o fallback se ele faltar.",
        "A regra de padding não compete pela propriedade color."
      ],
      "exercise": "Defina tokens para cor de texto e espaço, uma camada base e uma camada de componentes. Crie dois cartões com o mesmo componente, alterando um token no contêiner de apenas um deles.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Tokens</title><style>@layer base,componentes;:root{--texto:navy;--espaco:1rem}@layer base{body{color:var(--texto)}}@layer componentes{.cartao{padding:var(--espaco);border:1px solid currentColor;color:var(--texto)}}.alternativo{--texto:purple}</style></head><body><article class=\"cartao\">Cartão padrão</article><div class=\"alternativo\"><article class=\"cartao\">Cartão com token local</article></div></body></html>",
      "bug": "Uma regra posterior não vence necessariamente um seletor mais específico dentro do mesmo contexto relevante da cascata.",
      "bugCode": "#aviso { color: red; }\n.aviso { color: blue; }",
      "repair": "Inspecione a regra vencedora e reduza a especificidade da API de estilos quando apropriado. Evite aumentar a força de todo seletor para compensar uma política inconsistente.",
      "checks": [
        "Explica a regra vencedora sem usar a fórmula 'a última sempre vence'.",
        "Tokens locais afetam somente o contexto esperado.",
        "O layout permanece legível com zoom e texto maior."
      ],
      "project": "Organize os estilos de uma página de estudos em camadas e tokens. Documente três conflitos reais e a etapa da cascata que resolveu cada um, usando o painel de estilos.",
      "question": "A ordem no arquivo é sempre o primeiro critério que decide uma disputa CSS?",
      "answer": "Não; ela é um desempate após outros critérios relevantes da cascata.",
      "distractors": [
        "Sim; a última declaração sempre vence qualquer seletor.",
        "Sim; camadas e especificidade são ignoradas."
      ]
    },
    {
      "id": "css-cascata-camadas",
      "title": "CSS: cascata por camadas e valores de custom properties",
      "level": "Fundamentos",
      "summary": "Descubra qual declaração vence antes de aumentar a especificidade de um seletor. Esta aula separa origem, importância, camadas, especificidade e ordem, e mostra quando var usa seu fallback. Os problemas incluem importância com ordem de camadas invertida e um valor inválido após substituição, conferidos por estilos computados no navegador.",
      "source": "https://www.w3.org/TR/css-cascade-5/",
      "topics": [
        "declaração aplicável e valor vencedor",
        "ordem de camadas normais",
        "regra normal sem camada",
        "ordem invertida de important",
        "especificidade dentro da etapa",
        "herança de color",
        "fallback de var",
        "inválido no valor computado"
      ],
      "sections": [
        {
          "title": "A cascata escolhe declarações aplicáveis",
          "text": [
            "Um elemento pode corresponder a vários seletores e receber várias declarações para a mesma propriedade. A cascata estabelece uma ordem para escolher entre elas, mas começa com as regras aplicáveis no contexto atual. Uma regra dentro de uma media query falsa nem entra nessa comparação. Saber que existe uma declaração no arquivo não significa que ela participou da decisão para aquele elemento e naquele tamanho de viewport.",
            "A ordem considera fatores como origem, importância, camada e especificidade. A origem inclui estilos do autor, do usuário e do navegador. Nesta aula os exemplos comparam declarações de autor e usam propriedades sem animações ou transições; essa delimitação deixa a disputa reproduzível. Não reduza toda a cascata à frase o seletor mais específico sempre vence, porque outras etapas podem decidir antes dele."
          ]
        },
        {
          "title": "Camadas organizam a prioridade de regras normais",
          "text": [
            "A declaração @layer base, componentes, ajustes estabelece uma ordem de camadas. Para regras normais de uma mesma origem, camadas posteriores têm prioridade sobre anteriores. Uma regra normal sem camada fica acima das regras normais em camadas nessa comparação. Assim um seletor de baixa especificidade numa camada posterior pode vencer um seletor mais específico numa anterior.",
            "Use a ordem das camadas para expressar uma arquitetura de estilos, e não para corrigir um erro isolado sem documentar o efeito. A primeira declaração de ordem pode estabelecer a sequência que regras posteriores reutilizam. Em uma folha real, confira também imports e onde a camada foi criada. A especificidade continua relevante dentro da etapa em que as declarações ainda estão empatadas."
          ]
        },
        {
          "title": "Important altera a comparação e inverte camadas",
          "text": [
            "Para declarações importantes da mesma origem, a ordem de prioridade das camadas se inverte: a primeira camada fica acima das posteriores, e regras importantes em camadas ficam acima das importantes sem camada nessa etapa. Essa inversão permite proteger certas regras de base, mas também explica por que adicionar !important numa camada de ajustes pode não vencer uma declaração importante anterior.",
            "A palavra important não é uma pontuação para forçar qualquer resultado sem análise. Há outras origens e etapas da cascata, além de situações com transições. Nos problemas, as regras ficam na origem do autor e sem estilos inline para que o mecanismo de camadas seja o foco. Escreva quais declarações estão sendo comparadas e por qual etapa uma delas venceu antes de sugerir outra declaração."
          ]
        },
        {
          "title": "Especificidade e ordem resolvem os empates restantes",
          "text": [
            "Dentro de uma mesma origem, importância e camada, a especificidade compara os seletores conforme suas categorias. Ids têm um papel diferente de classes e seletores de tipo. Um seletor :where tem especificidade zero para sua contribuição, enquanto outras pseudoclasses têm regras próprias. Não some a especificidade como um único número decimal arbitrário; compare as categorias na ordem apropriada.",
            "Se ainda houver empate relevante, a ordem de aparecimento pode decidir entre declarações. A herança ocorre depois da escolha do valor aplicável para o elemento e não faz o seletor do pai disputar diretamente com o seletor do filho. Color é herdada em muitos casos, enquanto propriedades como margin não são. Para depurar, observe primeiro a declaração do próprio elemento e depois o valor vindo de seus ancestrais."
          ]
        },
        {
          "title": "Custom properties carregam valores para substituição",
          "text": [
            "Uma custom property como --accent participa da cascata e pode ser herdada. var(--accent, red) usa o fallback quando a custom property não tem um valor utilizável para aquela referência, por exemplo quando está ausente. O fallback não significa tente red se o texto substituído não for uma cor. Se --accent contém 18px, a substituição numa propriedade color torna essa declaração inválida no estágio de valor computado.",
            "Quando a invalidez aparece depois de escolher a declaração, o navegador não volta simplesmente à segunda declaração antiga de color como se repetisse a cascata. O comportamento segue as regras do valor inválido naquele estágio, frequentemente equivalente ao valor inicial ou herdado conforme a propriedade. No exemplo color herda do pai. Esse mecanismo é uma razão para validar os contratos dos tokens e não confiar que um fallback corrige qualquer tipo errado."
          ]
        },
        {
          "title": "O estilo computado mostra a decisão final",
          "text": [
            "O painel de regras mostra candidatas e declarações vencidas; o estilo computado mostra o valor resultante. Os dois são úteis, mas respondem a perguntas diferentes. Um rgb final não explica sozinho se veio de uma camada, de herança ou de var. Monte uma tabela com seletor, camada, importância e valor, e marque a primeira etapa da comparação que diferencia as candidatas.",
            "Os exemplos são documentos isolados, então você pode alterar uma regra de cada vez sem tocar nos estilos do produto. Os testes conferem cores computadas e propriedades concretas. Transfira o método para um componente que recebe tokens: descreva os valores aceitos, a camada da implementação e a camada de ajustes. Evite acumular seletores cada vez maiores quando a prioridade estrutural da cascata é a causa da disputa."
          ]
        }
      ],
      "code": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Camadas da cascata</title>\n<style>\n@layer base, componente, ajuste;\n@layer base {#painel {color: rgb(180,0,0);}}\n@layer componente {.painel {color: rgb(0,100,0);}}\n@layer ajuste {:where(.painel) {color: rgb(0,0,180);}}\n.painel {border: 2px solid currentColor; padding: 1rem;}\n</style></head><body><main><h1>Camadas da cascata</h1><p id=\"painel\" class=\"painel\">A camada ajuste vence a disputa de color.</p></main></body></html>",
      "output": "Color de painel é rgb(0, 0, 180). O id da camada base não vence a camada posterior; border usa essa cor por currentColor.",
      "trace": [
        "As três declarações color são normais e da mesma origem.",
        "A ordem das camadas decide antes de comparar especificidade.",
        "A regra sem camada modifica border e padding, mas não disputa color neste exemplo."
      ],
      "exercise": "Crie duas camadas, base e ajuste, com declarações normais de color para um mesmo elemento. Em seguida adicione uma regra normal sem camada com outra cor e confira que ela vence, sem usar important.",
      "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Regra normal sem camada</title><style>\n@layer base, ajuste;\n@layer base {#alvo {color:rgb(180,0,0);}}\n@layer ajuste {.alvo {color:rgb(0,100,0);}}\n.alvo {color:rgb(0,0,180);}\n</style></head><body><main><h1>Regra sem camada</h1><p id=\"alvo\" class=\"alvo\">Esta regra normal não pertence a uma camada.</p></main></body></html>",
      "bug": "O token --accent contém 18px. O autor espera que var use o fallback vermelho em color, mas o token existe e a substituição produz um valor inválido para cor.",
      "bugCode": "<div style=\"color:rgb(0,100,0)\">\n<p style=\"--accent:18px;color:var(--accent,rgb(180,0,0))\">Qual cor?</p>\n</div>",
      "repair": "Garanta que o token de cor contém uma cor válida ou deixe-o ausente quando o fallback deve ser usado. No trecho, color acaba herdando a cor verde do pai; o fallback não valida a gramática do valor substituído.",
      "checks": [
        "Explique a etapa em que a camada decidiu a cor.",
        "Uma regra normal sem camada vence as normais em camadas.",
        "Diferencie token ausente de token existente com tipo inadequado."
      ],
      "project": "Crie um componente isolado com camadas de base, componente e ajustes, e dois tokens de cor. Documente valores permitidos e crie uma tabela de disputas reais. Confira o estilo computado para estado padrão e ajuste, sem aumentar a especificidade como primeira tentativa.",
      "question": "Quando --accent tem o valor 18px, var(--accent, red) em color usa automaticamente red?",
      "answer": "Não; o token existe e a substituição pode invalidar color no estágio de valor computado.",
      "distractors": [
        "Sim; o fallback de var valida qualquer valor e corrige seu tipo.",
        "Sim, desde que o seletor tenha um id e portanto especificidade suficiente."
      ],
      "practices": [
        {
          "id": "important",
          "title": "Problema 1: ordem invertida nas camadas",
          "topics": [
            "ordem invertida de important",
            "especificidade dentro da etapa"
          ],
          "prompt": "Use camadas base e ajuste, ambas com color important no mesmo elemento, e uma regra important sem camada. A cor da primeira camada deve vencer. Explique a disputa sem mudar seletores.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Importância por camada</title><style>\n@layer base, ajuste;\n@layer base {.alvo {color:rgb(180,0,0)!important;}}\n@layer ajuste {#alvo {color:rgb(0,100,0)!important;}}\n#alvo {color:rgb(0,0,180)!important;}\n</style></head><body><main><h1>Importância por camada</h1><p id=\"alvo\" class=\"alvo\">A primeira camada vence.</p></main></body></html>",
          "explanation": [
            "Todas as declarações são importantes e da origem do autor. A inversão de camadas faz base vencer ajuste e as declarações importantes sem camada nesta comparação.",
            "O id em ajuste não resolve uma disputa já decidida pela camada. Remover important das três regras altera a prioridade e exige revisar a expectativa de cor."
          ],
          "checks": [
            "Color computada é rgb(180, 0, 0).",
            "A regra sem camada não vence neste caso importante.",
            "Explique qual seria o resultado se todas fossem normais."
          ]
        },
        {
          "id": "token",
          "title": "Problema 2: token ausente e valor inválido",
          "topics": [
            "fallback de var",
            "inválido no valor computado",
            "herança de color"
          ],
          "prompt": "Crie dois parágrafos sob um pai verde. Um usa --accent ausente e deve ficar vermelho pelo fallback; outro define --accent como 18px e deve herdar verde por invalidez de color após substituição.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Fallback e valor computado</title><style>\n.grupo {color:rgb(0,100,0);}\n.ausente {color:var(--accent,rgb(180,0,0));}\n.invalido {--accent:18px;color:var(--accent,rgb(180,0,0));}\n</style></head><body><main><h1>Fallback e valor computado</h1><div class=\"grupo\">\n<p id=\"ausente\" class=\"ausente\">Token ausente.</p><p id=\"invalido\" class=\"invalido\">Token com valor inadequado para color.</p>\n</div></main></body></html>",
          "explanation": [
            "No primeiro caso a referência não encontra --accent e usa o fallback. No segundo o token é encontrado, então a substituição ocorre antes de a declaração se revelar inadequada para color.",
            "Como color é uma propriedade herdada, o segundo parágrafo usa a cor do pai. Essa atividade demonstra um mecanismo específico; não conclua que toda propriedade inválida terá a mesma cor ou será herdada."
          ],
          "checks": [
            "O parágrafo ausente fica vermelho.",
            "O parágrafo inválido fica verde.",
            "Explique por que fallback não é uma validação de tipo."
          ]
        }
      ]
    },
    {
      "id": "css-caixas",
      "title": "CSS: caixas, fluxo e posicionamento",
      "level": "Fundamentos",
      "summary": "Entenda como conteúdo, padding, borda e margem formam caixas e como elas participam do fluxo. Estude box-sizing, display, dimensões intrínsecas, overflow, colapso de margens, posicionamento e stacking contexts para diagnosticar cortes e sobreposições sem depender de ajustes aleatórios.",
      "topics": [
        "box model box-sizing",
        "block inline inline-block",
        "normal flow intrinsic sizing",
        "margin collapse",
        "overflow scroll clipping",
        "position relative absolute fixed sticky",
        "containing blocks",
        "stacking context z-index",
        "logical properties writing modes"
      ],
      "sections": [
        {
          "title": "A caixa e sua dimensão",
          "text": [
            "No modelo content-box, width mede o conteúdo e padding e borda se somam externamente. border-box inclui essas partes no tamanho declarado. Margem continua fora da caixa de borda e pode afetar o espaço entre elementos.",
            "Um reset de box-sizing pode facilitar contas, mas não elimina restrições de conteúdo. Texto longo, min-width automático e elementos substituídos podem exigir uma política específica de quebra ou dimensionamento."
          ]
        },
        {
          "title": "Fluxo e display",
          "text": [
            "Elementos de bloco e inline participam do fluxo de formas diferentes. Uma caixa inline pode se fragmentar entre linhas, e propriedades de dimensão não se comportam exatamente como em um bloco. display define também relações internas e externas.",
            "display:none remove a participação no layout; visibility:hidden normalmente conserva espaço. Opacity zero não remove necessariamente interação e foco. Escolha a forma de ocultação conforme o comportamento esperado, além da aparência."
          ]
        },
        {
          "title": "Tamanho intrínseco e limites",
          "text": [
            "min-content e max-content descrevem dimensões influenciadas pelo conteúdo. min-width, max-width e min-height impõem limites adicionais. Uma width fixa pode ser incompatível com um viewport estreito ou um texto ampliado.",
            "Prefira limites que preservem leitura e teste palavras longas. overflow deve resolver a necessidade do contêiner, não esconder informação que o usuário precisa. Um bloco de código pode rolar dentro dele sem deslocar a página toda."
          ]
        },
        {
          "title": "Margens e fluxo normal",
          "text": [
            "Margens verticais de blocos podem colapsar em certos contextos; somá-las mentalmente pode produzir uma previsão errada. Gap em layouts apropriados evita alguns usos de margem para espaço entre itens.",
            "Criar um novo contexto de formatação, por exemplo com flow-root, muda relações do fluxo e pode conter floats. Use o mecanismo cujo contrato atende ao layout, em vez de adicionar elementos vazios para empurrar conteúdo."
          ]
        },
        {
          "title": "Posicionamento e bloco de referência",
          "text": [
            "relative conserva a participação no fluxo e permite deslocamento; absolute sai do fluxo e usa um bloco de referência. fixed e sticky têm regras próprias e podem ser afetados por ancestrais e containers de rolagem.",
            "Sticky exige limites apropriados e espaço para atuar. Um elemento absolute pode cobrir conteúdo sem reservar lugar para ele. Antes de escolher posicionamento, verifique se Flexbox ou Grid expressa a relação desejada no fluxo."
          ]
        },
        {
          "title": "Empilhamento e direção",
          "text": [
            "z-index opera dentro de contextos de empilhamento, que podem ser criados por várias propriedades. Um número enorme não permite escapar automaticamente do contexto do ancestral. Investigue a árvore de contextos ao depurar sobreposição.",
            "Propriedades lógicas como margin-inline e padding-block acompanham modos de escrita e direção. Elas expressam intenção melhor que assumir esquerda e direita para todo idioma. Teste direção, zoom e rolagem quando esses contextos são suportados."
          ]
        }
      ],
      "code": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Caixas</title><style>*{box-sizing:border-box}.cartao{width:min(100%,30rem);padding:1rem;border:2px solid teal;margin-inline:auto}.codigo{max-width:100%;overflow:auto}body{padding:1rem}</style></head><body><article class=\"cartao\"><h1>Uma caixa previsível</h1><p>Padding e borda estão incluídos na largura.</p><pre class=\"codigo\">uma_linha_de_codigo_que_pode_ser_maior_que_o_cartao_sem_alargar_a_pagina()</pre></article></body></html>",
      "output": "O cartão não excede a largura disponível, inclui padding e borda na dimensão e deixa o código rolar dentro do próprio bloco quando necessário.",
      "trace": [
        "border-box torna a dimensão declarada mais direta.",
        "min escolhe a menor largura entre o limite e o espaço disponível.",
        "overflow pertence ao bloco de código, preservando o documento."
      ],
      "exercise": "Crie um aviso com largura máxima, padding e borda, mantendo-o dentro do viewport em 280px e com zoom de texto. Um identificador longo deve quebrar sem cortar a mensagem.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Aviso</title><style>*{box-sizing:border-box}body{margin:0;padding:1rem}.aviso{max-width:32rem;margin-inline:auto;padding:1rem;border:2px solid teal;overflow-wrap:anywhere}</style></head><body><main class=\"aviso\"><h1>Aviso</h1><p>Identificador: abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz</p></main></body></html>",
      "bug": "width:100% com content-box e padding horizontal pode produzir uma caixa maior que o contêiner. Ocultar overflow do documento apenas esconde a causa.",
      "bugCode": ".cartao { width:100%; padding:2rem; border:2px solid; }",
      "repair": "Use border-box quando esse for o contrato de dimensão e confira limites intrínsecos dos filhos. Meça scrollWidth no viewport e teste conteúdo longo antes de ocultar qualquer excesso.",
      "checks": [
        "Conteúdo obrigatório não é cortado.",
        "A caixa cabe em viewport estreito sem overflow do documento.",
        "A ordem de leitura permanece coerente quando o posicionamento é removido."
      ],
      "project": "Diagnostique três caixas de uma página: um texto longo, um bloco de código e uma região sticky. Registre dimensões e o contêiner de referência de cada uma.",
      "question": "z-index muito grande permite escapar de qualquer contexto de empilhamento ancestral?",
      "answer": "Não; a posição continua limitada pelas relações dos contextos de empilhamento.",
      "distractors": [
        "Sim; basta usar o maior inteiro possível.",
        "Sim; z-index sempre ignora todos os ancestrais."
      ]
    },
    {
      "id": "css-caixas-intrinseco",
      "title": "CSS: dimensões de caixa, conteúdo intrínseco e overflow",
      "level": "Fundamentos",
      "summary": "Calcule o espaço que uma caixa ocupa e investigue por que um texto comprido pode quebrar o layout. Esta aula compara content-box e border-box, limites de tamanho em Flexbox e rolagem dentro de um contêiner. Os exercícios medem caixas no navegador e tratam conteúdos adversos sem esconder o problema com overflow indiscriminado.",
      "source": "https://www.w3.org/TR/css-sizing-3/",
      "topics": [
        "content-box e dimensão externa",
        "border-box e espaço de conteúdo",
        "padding e border no cálculo",
        "tamanho mínimo automático de flex item",
        "min-inline-size zero",
        "overflow-wrap anywhere",
        "overflow e contêiner de rolagem",
        "sticky e referência de rolagem"
      ],
      "sections": [
        {
          "title": "A dimensão declarada não é sempre a dimensão externa",
          "text": [
            "No modelo content-box, width ou inline-size dimensiona a caixa de conteúdo. Padding e border acrescentam espaço ao redor dela. Uma caixa com conteúdo de 180px, padding de 20px em cada lado e border de 2px ocupa 224px nesse eixo. Margin fica fora da borda e não entra no tamanho obtido por getBoundingClientRect, embora participe do posicionamento em outros cálculos.",
            "Com border-box, a dimensão declarada inclui conteúdo, padding e border no caso comum. A mesma declaração de 180px deixa 136px para conteúdo quando os extras somam 44px. O espaço de conteúdo não pode ser negativo; dimensões e restrições ainda interagem quando os extras são grandes. Calcule as partes antes de depurar um alinhamento, em vez de ajustar valores sucessivamente até parecer certo."
          ]
        },
        {
          "title": "Dimensões lógicas seguem o modo de escrita",
          "text": [
            "Inline-size corresponde ao eixo em linha do modo de escrita, e block-size ao eixo de blocos. Em um documento horizontal comum, inline-size funciona como a largura; em outros modos a correspondência muda. Padding-inline e margin-block também expressam relações lógicas. Essa abordagem facilita componentes que precisam adaptar a direção e o modo de escrita sem duplicar regras físicas para cada caso.",
            "O cálculo do exemplo usa escrita horizontal para tornar as medidas previsíveis. Ao internacionalizar um componente, confira alinhamentos, ícones e ordem de leitura além de trocar left por uma propriedade lógica. Dimensões lógicas não alteram o significado do conteúdo. Uma lista deve continuar em ordem coerente no DOM, mesmo quando o eixo visual ou a direção de escrita muda."
          ]
        },
        {
          "title": "O conteúdo contribui para o tamanho mínimo",
          "text": [
            "Alguns modelos de layout consideram tamanhos intrínsecos do conteúdo. Uma palavra longa sem oportunidades de quebra pode exigir mais espaço do que uma caixa disponível. Em Flexbox, um item pode ter um tamanho mínimo automático ligado ao conteúdo, impedindo a redução que o autor esperava de flex-shrink. Flex: 1 não garante sozinho que qualquer texto caiba em qualquer espaço.",
            "Quando o item deve poder encolher no eixo relevante, min-inline-size: 0 pode remover essa restrição mínima apropriada ao caso. Overflow-wrap: anywhere oferece oportunidades de quebra para sequências longas e afeta contribuições intrínsecas de modo útil. Escolha a regra pelo conteúdo: um identificador pode quebrar para leitura, enquanto uma tabela de código talvez precise de rolagem horizontal com indicação clara."
          ]
        },
        {
          "title": "Overflow descreve o que acontece com conteúdo excedente",
          "text": [
            "Overflow pode deixar o conteúdo visível, recortar ou criar rolagem conforme o valor e o eixo. Esconder o excedente não resolve automaticamente a causa de uma dimensão incorreta e pode tornar informações inacessíveis. Se uma caixa contém conteúdo essencial, teste se a pessoa consegue alcançá-lo por rolagem, reflow ou outro mecanismo. Um layout sem barra horizontal pode ainda ter texto recortado.",
            "Definir overflow num ancestral também pode afetar qual contêiner de rolagem certas propriedades consideram. Por isso uma regra adicionada para esconder um efeito lateral pode mudar sticky. Inspecione os ancestrais e suas dimensões antes de concluir que position sticky não funciona. A escolha de recorte, rolagem e tamanho deve ser coerente com a interação pretendida."
          ]
        },
        {
          "title": "Sticky tem limites definidos pelo contexto",
          "text": [
            "Position sticky conserva uma relação com o fluxo e aplica deslocamentos conforme a posição de rolagem e seus limites. Um inset como top: 0 permite observar a adesão no eixo escolhido. O elemento continua limitado pelo bloco e pelo contexto em que está; ele não se torna um elemento fixed solto em relação a toda a página. Um contêiner sem conteúdo suficiente para rolar não demonstra o efeito.",
            "No problema, o contêiner tem altura definida e overflow auto, e o cabeçalho está dentro dele. A verificação mede a posição antes e depois de alterar scrollTop. Não use apenas uma captura da primeira tela para declarar sticky pronto, pois ali o elemento pode estar na mesma posição sem qualquer rolagem. Teste o mecanismo que o exemplo pretende ensinar."
          ]
        },
        {
          "title": "Meça comportamento sob conteúdo adverso",
          "text": [
            "Use getBoundingClientRect para verificar a dimensão da borda em exemplos sem transformações, e getComputedStyle para identificar regras aplicadas. Compare scrollWidth com clientWidth no contêiner relevante para descobrir excesso horizontal. Essas medidas têm significados diferentes: scrollWidth inclui o espaço de conteúdo rolável, enquanto uma caixa visual transformada pode apresentar outro retângulo.",
            "Teste viewport estreita, palavra comprida, conteúdo vazio e mais itens que o normal. Uma solução que depende do texto curto original pode falhar na tradução ou no dado real. Transfira o cálculo para cartões de documentação: documente o eixo, a caixa medida e a política de quebra ou rolagem. Evite mascarar uma falha de tamanho com uma regra global de overflow hidden."
          ]
        }
      ],
      "code": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Medindo caixas</title><style>\nbody {margin:0;}\n.caixa {inline-size:180px;padding:20px;border:2px solid; margin-block:8px;}\n#conteudo {box-sizing:content-box;}\n#borda {box-sizing:border-box;}\n</style></head><body><main><h1>Medindo caixas</h1>\n<p id=\"conteudo\" class=\"caixa\">Content-box</p><p id=\"borda\" class=\"caixa\">Border-box</p>\n</main></body></html>",
      "output": "A caixa conteudo tem largura externa de 224px; borda tem 180px. Padding e border continuam existindo nas duas.",
      "trace": [
        "Em content-box os extras de 44px são acrescentados aos 180px de conteúdo.",
        "Em border-box os extras estão contidos na largura declarada de 180px.",
        "As margens verticais não fazem parte da largura medida da borda."
      ],
      "exercise": "Construa uma linha Flexbox de 220px com um título curto e um identificador de 80 letras. O identificador deve quebrar e o contêiner não deve ter excesso horizontal. Explique o papel de min-inline-size e overflow-wrap.",
      "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Texto comprido em Flexbox</title><style>\nbody {margin:0;}\n.linha {display:flex;gap:8px;inline-size:220px;max-inline-size:100%;box-sizing:border-box;}\n.titulo {flex:0 0 40px;}\n.texto {flex:1;min-inline-size:0;overflow-wrap:anywhere;}\n</style></head><body><main><h1>Flexbox</h1><div id=\"linha\" class=\"linha\">\n<span class=\"titulo\">Código</span><span class=\"texto\">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</span>\n</div></main></body></html>",
      "bug": "O autor define width 180px, padding 20px e border 2px, mas espera uma largura externa de 180px sem mudar box-sizing. A caixa content-box ocupa 224px.",
      "bugCode": ".caixa {width:180px;padding:20px;border:2px solid;box-sizing:content-box;}",
      "repair": "Se a dimensão declarada deve incluir os extras, use border-box. Se ela deve representar o espaço de conteúdo, mantenha content-box e calcule a dimensão externa. A escolha depende do contrato do layout.",
      "checks": [
        "As larguras medidas são 224px e 180px.",
        "Conteúdo longo quebra sem criar excesso no contêiner Flexbox.",
        "A rolagem de um contêiner é distinguida da rolagem da página."
      ],
      "project": "Crie cartões de documentação com títulos, identificadores e blocos de código. Defina quais conteúdos quebram e quais rolam, confira caixas e viewport estreita e mantenha o DOM em ordem de leitura. Registre medidas para um texto longo e uma tradução maior.",
      "question": "Quanto ocupa externamente uma caixa content-box de 180px com padding 20px e border 2px em cada lado?",
      "answer": "224px, pois padding e border são acrescentados à largura de conteúdo.",
      "distractors": [
        "180px, porque width sempre inclui padding e border.",
        "204px, porque somente um lado do padding participa do cálculo."
      ],
      "practices": [
        {
          "id": "minimo",
          "title": "Problema 1: conteúdo intrínseco em item flexível",
          "topics": [
            "tamanho mínimo automático de flex item",
            "min-inline-size zero",
            "overflow-wrap anywhere"
          ],
          "prompt": "Crie um contêiner flexível de no máximo 240px com uma etiqueta de 48px e um texto sem espaços de 64 letras. Permita encolhimento e quebra do texto, mantendo toda a informação disponível em viewport de 200px.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Limite do item flexível</title><style>\nbody {margin:0;}\n#grupo {display:flex;gap:8px;inline-size:min(240px,100%);}\n.etiqueta {flex:0 0 48px;}\n#valor {flex:1;min-inline-size:0;overflow-wrap:anywhere;}\n</style></head><body><main><h1>Conteúdo</h1><div id=\"grupo\">\n<span class=\"etiqueta\">Valor</span><span id=\"valor\">BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB</span>\n</div></main></body></html>",
          "explanation": [
            "min-inline-size permite o encolhimento do item no eixo em linha e overflow-wrap cria oportunidades de quebra para o conteúdo sem espaços.",
            "A etiqueta mantém sua parcela, enquanto o texto ocupa o restante. O teste precisa medir scrollWidth do grupo e do texto; esconder o excesso com recorte não atenderia ao contrato de manter toda a informação."
          ],
          "checks": [
            "A viewport de 200px não produz excesso horizontal no grupo.",
            "O texto continua inteiro no DOM.",
            "O item de texto pode encolher e tem altura de mais de uma linha."
          ]
        },
        {
          "id": "sticky",
          "title": "Problema 2: cabeçalho dentro de uma rolagem local",
          "topics": [
            "overflow e contêiner de rolagem",
            "sticky e referência de rolagem"
          ],
          "prompt": "Construa um contêiner de 120px de altura com conteúdo suficiente para rolar e um cabeçalho sticky top zero. Ao rolar o contêiner 80px, o cabeçalho deve continuar no topo desse contêiner, sem virar fixed da página.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Rolagem local</title><style>\nbody {margin:0;}\n#rolagem {block-size:120px;inline-size:240px;max-inline-size:100%;overflow:auto;}\n#cabecalho {position:sticky;top:0;background:white;margin:0;block-size:24px;}\n#conteudo {block-size:400px;}\n</style></head><body><main><h1>Rolagem local</h1><div id=\"rolagem\">\n<h2 id=\"cabecalho\">Seção</h2><div id=\"conteudo\"><p>Conteúdo rolável para verificar o cabeçalho.</p></div>\n</div></main></body></html>",
          "explanation": [
            "A altura limitada e overflow auto criam uma região que pode rolar. O cabeçalho está no fluxo dessa região e o inset top permite a adesão durante a rolagem.",
            "Ao mudar scrollTop, compare o topo do cabeçalho com o topo do contêiner. Essa medida demonstra o comportamento local e evita confundir uma posição inicial estática com uma implementação sticky funcionando."
          ],
          "checks": [
            "scrollHeight supera clientHeight.",
            "Após scrollTop 80, o cabeçalho continua junto ao topo do contêiner.",
            "O cabeçalho usa sticky e mantém seu lugar no fluxo."
          ]
        }
      ]
    },
    {
      "id": "css-flex-grid",
      "title": "CSS: Flexbox, Grid e alinhamento",
      "level": "Intermediário",
      "summary": "Escolha Flexbox ou Grid pela relação entre itens e espaço, compreendendo eixos, tamanhos, distribuição e ordem. Estude tracks, fr, minmax, auto-fit, alinhamento e subgrid, preservando a sequência do documento e tratando o tamanho mínimo do conteúdo para evitar layouts frágeis.",
      "topics": [
        "flex axes wrap basis grow shrink",
        "alignment gap auto margins",
        "flex min-size",
        "grid tracks fr minmax",
        "auto-fit auto-fill",
        "explicit implicit placement",
        "grid areas subgrid",
        "source order accessibility"
      ],
      "sections": [
        {
          "title": "Flexbox e eixos",
          "text": [
            "Flexbox organiza uma dimensão principal por vez, com direção e possibilidade de wrap. justify-content distribui no eixo principal, enquanto align-items atua no eixo transversal conforme o contexto. Mudar flex-direction muda quais eixos você está observando.",
            "Não memorize horizontal e vertical como definições fixas. Modo de escrita e direção também influenciam o layout. Gap expressa espaço entre itens, e margens automáticas podem consumir espaço disponível em cenários adequados."
          ]
        },
        {
          "title": "Distribuição e tamanho mínimo",
          "text": [
            "flex-basis define uma base de dimensionamento e grow e shrink controlam como espaço livre ou falta de espaço é distribuído. A forma abreviada tem valores padrão que precisam ser compreendidos para prever o resultado.",
            "Itens podem conservar um tamanho mínimo baseado no conteúdo. min-width:0 ou seu equivalente lógico pode permitir encolher quando o contrato exige, mas o texto ainda precisa de quebra ou rolagem apropriada. Não use a propriedade para cortar conteúdo silenciosamente."
          ]
        },
        {
          "title": "Grid e tracks",
          "text": [
            "Grid organiza linhas e colunas e pode relacionar itens em duas dimensões. fr distribui espaço disponível entre tracks flexíveis; não significa uma fração de todo viewport. minmax define limites de um track.",
            "repeat reduz repetição de definição. minmax(0,1fr) pode ser útil quando o mínimo baseado no conteúdo impede encolhimento, desde que os filhos tenham uma estratégia de overflow. Colunas fixas continuam exigindo espaço suficiente."
          ]
        },
        {
          "title": "Grades adaptáveis",
          "text": [
            "auto-fit e auto-fill criam repetições conforme o espaço, com diferença no tratamento de tracks vazios. Um padrão de cartões pode usar um mínimo e permitir que a largura se distribua, evitando dezenas de breakpoints artificiais.",
            "O mínimo não deve exceder a largura disponível em telas pequenas. Combine limites com min e teste um único cartão, muitos cartões e conteúdos de comprimento diferente. Uma grade bonita com três textos iguais não prova um layout robusto."
          ]
        },
        {
          "title": "Posicionamento e subgrid",
          "text": [
            "Linhas, áreas e posicionamento explícito permitem relações claras, mas também podem criar tracks implícitos inesperados. Um item colocado muito longe da grade declarada pode aumentar a estrutura em vez de gerar um erro.",
            "Subgrid permite compartilhar tracks com uma grade ancestral em navegadores que o suportam. Use quando a relação realmente exige alinhamento entre componentes e mantenha fallback apropriado quando o ambiente de destino exigir."
          ]
        },
        {
          "title": "Ordem visual e ordem do documento",
          "text": [
            "order e posicionamento em Grid podem mudar a apresentação sem alterar a sequência DOM usada por leitura e foco. Não reorganize visualmente uma tarefa de modo que o teclado percorra uma ordem confusa.",
            "Teste a interface sem layout, com zoom e com elementos extras. O alinhamento deve servir ao conteúdo e não obrigar o documento a depender da posição visual para transmitir a sequência."
          ]
        }
      ],
      "code": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Grade de estudos</title><style>*{box-sizing:border-box}body{margin:0;padding:1rem}.grade{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:1rem}.cartao{border:1px solid teal;padding:1rem;min-width:0;overflow-wrap:anywhere}.acoes{display:flex;flex-wrap:wrap;gap:.5rem}</style></head><body><main><h1>Estudos</h1><div class=\"grade\"><article class=\"cartao\"><h2>HTML</h2><p>Estrutura do documento.</p><div class=\"acoes\"><button>Revisar</button><button>Praticar</button></div></article><article class=\"cartao\"><h2>CSS</h2><p>Layout e apresentação.</p></article></div></main></body></html>",
      "output": "A grade adapta a quantidade de colunas ao espaço e cada cartão conserva seu conteúdo. O grupo de ações usa Flexbox e pode quebrar em várias linhas.",
      "trace": [
        "Grid controla a relação dos cartões em linhas e colunas.",
        "O mínimo nunca exige mais de 100% da largura disponível.",
        "Flexbox organiza um conjunto local de controles sem reordenar o DOM."
      ],
      "exercise": "Crie uma lista de seis cartões em uma grade responsiva, com ações em Flexbox. Teste nomes longos, um cartão sem ações e a navegação por teclado na ordem da fonte.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Cartões</title><style>*{box-sizing:border-box}.grade{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr));gap:1rem}.cartao{padding:1rem;border:1px solid;overflow-wrap:anywhere}.acoes{display:flex;flex-wrap:wrap;gap:.5rem}body{padding:1rem;margin:0}</style></head><body><h1>Cartões</h1><div class=\"grade\" id=\"grade\"></div><script>for(let i=1;i<=6;i++){const a=document.createElement('article');a.className='cartao';const h=document.createElement('h2');h.textContent='Tema '+i;a.append(h);if(i!==6){const div=document.createElement('div');div.className='acoes';const b=document.createElement('button');b.textContent='Praticar tema '+i;div.append(b);a.append(div);}document.querySelector('#grade').append(a);}</script></body></html>",
      "bug": "Reordenar itens com order pode fazer o teclado e a leitura seguirem uma sequência diferente da disposição visual.",
      "bugCode": ".ultimo { order:-1; }",
      "repair": "Mantenha a ordem DOM de acordo com a tarefa. Se uma reorganização visual for necessária, teste a compreensão e o foco; não compense com tabindex positivo.",
      "checks": [
        "A grade cabe no viewport estreito e acomoda texto longo.",
        "A ordem de foco corresponde à sequência compreensível da tarefa.",
        "A escolha de Flexbox e Grid é explicada pelos eixos e relações."
      ],
      "project": "Monte um catálogo de aulas com cartões de alturas variadas e ações locais. Meça em vários tamanhos e compare um caso com uma única coluna e outro com várias.",
      "question": "fr em Grid é sempre uma fração de toda a largura do viewport?",
      "answer": "Não; distribui espaço disponível entre tracks flexíveis da grade.",
      "distractors": [
        "Sim; 1fr sempre vale 1% do viewport.",
        "Sim; padding e tracks fixos não afetam seu cálculo."
      ]
    },
    {
      "id": "css-grid-trilhas",
      "title": "CSS: trilhas de Grid, tamanho mínimo e ordem de leitura",
      "level": "Intermediário",
      "summary": "Modele linhas, colunas e espaços de uma grade, calcule quantas trilhas cabem e diferencie auto-fill de auto-fit. Investigue conteúdo que força overflow, trilhas implícitas e a diferença entre posição visual, ordem do DOM e foco. Verifique o layout por medidas reais e pelo teclado, sem confundir uma disposição que parece correta com um contrato de leitura preservado.",
      "source": "https://www.w3.org/TR/css-grid-1/",
      "topics": [
        "grade bidimensional e linhas",
        "trilhas explícitas e implícitas",
        "fr e espaço disponível",
        "minmax zero e mínimo intrínseco",
        "auto-fill e auto-fit",
        "gap e contagem de trilhas",
        "auto-placement dense",
        "ordem DOM foco e visual"
      ],
      "sections": [
        {
          "title": "Uma grade tem trilhas e linhas, não apenas caixas lado a lado",
          "text": [
            "Display grid estabelece um contexto que organiza itens em duas dimensões. Colunas e linhas de conteúdo são trilhas; os limites entre elas são linhas da grade. Três colunas têm quatro linhas verticais, então um item que ocupa de 1 a 3 atravessa duas colunas. Desenhe os limites e os espaços antes de escolher grid-column: a numeração fica mais fácil de explicar quando você separa quantidade de trilhas de quantidade de linhas.",
            "A grade explícita nasce das definições de template. Itens posicionados além dela, ou elementos que precisam de novas linhas durante a distribuição automática, podem criar trilhas implícitas. Grid-auto-rows e grid-auto-columns controlam o tamanho dessas trilhas adicionais. Não espere que definir duas linhas impeça a existência de uma terceira. No exemplo, a largura das colunas é explícita e novas linhas aparecem conforme a quantidade de cartões."
          ]
        },
        {
          "title": "Fr distribui espaço, mas o conteúdo participa do cálculo",
          "text": [
            "A unidade fr expressa uma participação no espaço flexível considerado pelo algoritmo da grade. Com duas trilhas minmax(0,1fr) e minmax(0,2fr), num contêiner de 600 pixels e gap de 12, restam 588 pixels para dividir em 196 e 392. Gap faz parte da geometria e precisa ser descontado antes dessa divisão. Não multiplique simplesmente a largura externa pela razão de fr quando há espaços, bordas ou outras trilhas com tamanho fixo.",
            "Uma trilha escrita como 1fr tem um mínimo automático, que pode considerar contribuições intrínsecas dos itens. Um texto longo sem oportunidades de quebra pode fazer esse mínimo superar a largura que você imaginava distribuir. Minmax(0,1fr) permite um mínimo de zero na trilha, mas o conteúdo ainda precisa de uma política de quebra ou overflow. Combinar mínimo apropriado com overflow-wrap anywhere resolve outro aspecto do problema: como o texto deve continuar legível dentro da área recebida."
          ]
        },
        {
          "title": "Uma repetição automática considera o espaço entre trilhas",
          "text": [
            "Repeat com auto-fill ou auto-fit cria uma quantidade de trilhas que caiba no espaço disponível segundo os tamanhos informados. Para mínimo de 180 e gap 12 numa largura de 600, três trilhas precisam de 3 vezes 180 mais 2 vezes 12, totalizando 564. Quatro exigiriam 756 e não cabem. Esse cálculo de quantidade não é o tamanho final de cada trilha: o máximo 1fr ainda pode distribuir a sobra entre as trilhas consideradas.",
            "No grupo auto-fill do exemplo, três trilhas dividem 576 pixels após os dois gaps, resultando em 192 por trilha. Existem só dois cartões, mas a terceira trilha vazia conserva sua participação. Na versão auto-fit, as trilhas repetidas vazias são colapsadas e os dois cartões ocupam 294 pixels cada, separados por um gap. Compare as medidas dos cartões e não apenas o número de elementos. Os dois grupos têm o mesmo DOM e uma regra diferente de aproveitamento do espaço vazio."
          ]
        },
        {
          "title": "Defina um mínimo que ainda caiba no menor contexto",
          "text": [
            "Minmax(180px,1fr) é adequado somente se o contêiner puder reservar ao menos 180 para uma trilha. Num painel ainda menor, esse mínimo pode causar overflow em vez de ser reduzido automaticamente. Uma opção para grades de cartões é minmax(min(100%,180px),1fr), quando esse tamanho expressa a intenção do projeto. Outra opção é mudar a definição num breakpoint correspondente ao conteúdo. O objetivo é garantir que uma única trilha também funcione no menor espaço em que o componente será usado.",
            "Uma media query baseada na viewport não mede diretamente a largura de todo componente interno. Um painel lateral pode ser estreito mesmo numa janela grande. Para esta aula, os exemplos usam limites explícitos de largura para tornar os cálculos verificáveis. Ao transferir para componentes reutilizáveis, escolha entre uma regra intrínseca, uma container query ou um contrato de tamanho mínimo do contêiner. Não declare responsividade apenas porque testou dois tamanhos de janela."
          ]
        },
        {
          "title": "Preencher buracos pode mudar a ordem que os olhos seguem",
          "text": [
            "O auto-placement usual conserva a progressão pelo percurso da grade. Dense pode procurar espaços vazios anteriores para encaixar itens menores que surgem depois. Isso melhora o preenchimento de certas grades, mas pode colocar visualmente um elemento posterior antes de um elemento anterior. O navegador não reescreve por isso a ordem dos nós no DOM. O caminho de foco e a leitura em outras representações continuam exigindo atenção à ordem do documento.",
            "Na atividade, A e B atravessam duas colunas cada; C ocupa apenas uma. Em três colunas, B não cabe ao lado de A. Com dense, C pode preencher o espaço restante da primeira linha e aparecer acima de B, apesar de vir depois dele na fonte. Percorra os links por Tab e compare essa sequência com as posições medidas. Um conjunto de passos obrigatórios não deve depender de uma ordem visual que contradiz o roteiro. Escolha o preenchimento conforme o significado dos itens."
          ]
        },
        {
          "title": "Geometria, conteúdo e foco têm verificações diferentes",
          "text": [
            "Para testar uma grade, meça a largura do contêiner, o gap computado e as caixas dos itens. Confira uma quantidade com trilha vazia e outra em que todas as trilhas estejam ocupadas. Inclua texto longo e um contêiner menor que o mínimo originalmente desejado. Esses casos distinguem uma divisão flexível de uma soma de tamanhos mínimos que excede o espaço disponível. Use uma tolerância pequena para arredondamentos de subpixel em vez de exigir inteiros para qualquer tamanho.",
            "Teste também a sequência de foco e a ordem dos nós quando posicionamento manual ou dense puderem mudar a disposição. Uma captura de tela não prova esse comportamento. Os exemplos desta aula usam apenas CSS de estudo e HTML local, preservando a aparência do produto. O projeto final deve documentar o que acontece ao acrescentar cartões, ampliar um título e reduzir o espaço; uma grade previsível precisa acomodar essas mudanças sem esconder informação necessária."
          ]
        }
      ],
      "code": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Trilhas vazias de Grid</title>\n<style>\n.grade { display:grid; width:min(100%,600px); gap:12px; margin-block:12px; }\n#preencher { grid-template-columns:repeat(auto-fill,minmax(min(100%,180px),1fr)); }\n#ajustar { grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr)); }\narticle { min-inline-size:0; overflow-wrap:anywhere; background:#ddd; }\n</style></head><body><main><h1>Trilhas vazias</h1>\n<h2>Auto-fill</h2><section id=\"preencher\" class=\"grade\"><article>A</article><article>B</article></section>\n<h2>Auto-fit</h2><section id=\"ajustar\" class=\"grade\"><article>A</article><article>B</article></section>\n</main></body></html>",
      "output": "Com 600 pixels disponíveis, auto-fill mantém três trilhas de 192, embora haja dois itens; auto-fit colapsa a trilha vazia e produz dois itens de 294. Com apenas 360 pixels, cabe uma trilha, e os dois cartões aparecem em linhas diferentes.",
      "trace": [
        "Três mínimos de 180 e dois gaps de 12 cabem em 600; quatro mínimos não cabem.",
        "Auto-fill mantém a participação da trilha vazia na divisão da sobra.",
        "Auto-fit colapsa a trilha repetida vazia e os gaps adjacentes correspondentes."
      ],
      "exercise": "Crie uma grade de conteúdo e painel com razão 1 para 2, largura máxima 600 e gap 12. Abaixo de 500 pixels de viewport use uma coluna. Inclua uma palavra de 80 letras e mantenha o texto completo sem overflow horizontal. Preveja larguras de 196 e 392 quando houver 600 pixels para a grade.",
      "checks": [
        "As duas trilhas dividem o espaço após descontar o gap na razão 1 para 2.",
        "Texto longo permanece visível e não expande horizontalmente a grade.",
        "A regra estreita usa uma trilha e conserva a ordem da fonte."
      ],
      "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Razão entre colunas</title>\n<style>\n#grade { display:grid; width:min(100%,600px); gap:12px; grid-template-columns:minmax(0,1fr) minmax(0,2fr); }\narticle { min-inline-size:0; overflow-wrap:anywhere; background:#ddd; }\n@media(max-width:500px) { #grade { grid-template-columns:minmax(0,1fr); } }\n</style></head><body><main><h1>Razão entre colunas</h1>\n<section id=\"grade\"><article id=\"texto\">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</article><article id=\"painel\">Painel</article></section>\n</main></body></html>",
      "bug": "Uma grade exige uma trilha mínima de 400 pixels mesmo quando seu contêiner tem somente 280. O máximo 1fr distribui a sobra, mas não transforma um mínimo fixo de 400 em 280.",
      "bugCode": "<style>#g { display:grid; width:280px; grid-template-columns:repeat(auto-fit,minmax(400px,1fr)); }</style>\n<div id=\"g\"><p>Uma trilha maior que a grade.</p></div>",
      "repair": "Escolha um mínimo que possa caber, como min(100%,400px), ou uma regra específica para esse contexto estreito. Confira a caixa da trilha e o scrollWidth; não esconda o conteúdo com overflow hidden para encobrir uma soma impossível.",
      "project": "Implemente um catálogo de seis cartões com textos curtos e longos. Documente a largura mínima, a quantidade de colunas, a regra para espaço vazio e a ordem de leitura. Teste 220, 360 e 800 pixels de espaço do componente, acrescente um sétimo cartão e percorra links com Tab. Compare auto-fill e auto-fit antes de escolher, e evite dense quando a coleção expressar uma sequência obrigatória.",
      "question": "Numa grade auto-fit com trilhas repetidas suficientes para três itens, por que dois cartões podem ocupar mais espaço que em auto-fill?",
      "answer": "As trilhas repetidas vazias de auto-fit são colapsadas, deixando mais espaço para as trilhas ocupadas.",
      "distractors": [
        "Auto-fit cria automaticamente um terceiro cartão invisível no DOM.",
        "Auto-fill ignora gap, enquanto auto-fit sempre soma gap ao tamanho de cada cartão."
      ],
      "practices": [
        {
          "id": "espaco",
          "title": "Problema 1: calcular a trilha vazia e a sobra",
          "topics": [
            "auto-fill e auto-fit",
            "gap e contagem de trilhas",
            "fr e espaço disponível"
          ],
          "prompt": "Produza dois grupos com largura 600, gap 12 e dois itens: um usa auto-fill, outro auto-fit, ambos com mínimo 180 e máximo 1fr. Preveja as larguras dos itens e confira no navegador; depois reduza a largura de ambos para 360 sem alterar a quantidade de itens.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Medir o espaço vazio</title>\n<style>\n.grupo { display:grid; width:600px; gap:12px; margin-block:12px; }\n#fill { grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); }\n#fit { grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); }\n.grupo > div { background:#ddd; min-height:24px; }\n</style></head><body><main><h1>Medir o espaço vazio</h1>\n<div id=\"fill\" class=\"grupo\"><div>A</div><div>B</div></div>\n<div id=\"fit\" class=\"grupo\"><div>A</div><div>B</div></div>\n</main></body></html>",
          "explanation": [
            "Em 600, cabem três trilhas mínimas. Auto-fill conserva três participações e dois espaços, então (600 - 24) / 3 resulta em 192. Auto-fit colapsa a trilha vazia e divide (600 - 12) / 2, resultando em 294 para cada item ocupado.",
            "Em 360, duas trilhas de 180 exigiriam ainda um gap de 12, ultrapassando a largura. Uma única trilha ocupa 360 e os dois itens ficam em linhas distintas. O teste de fronteira mostra por que contar elementos não basta para prever colunas nem o espaço final de cada caixa."
          ],
          "checks": [
            "Em 600 os itens de fill medem 192 e os de fit medem 294.",
            "Em 360 ambos os grupos têm uma coluna de 360.",
            "O segundo item está na linha seguinte quando a largura é 360."
          ]
        },
        {
          "id": "ordem",
          "title": "Problema 2: comparar dense com a sequência de foco",
          "topics": [
            "auto-placement dense",
            "ordem DOM foco e visual",
            "trilhas explícitas e implícitas",
            "grade bidimensional e linhas"
          ],
          "prompt": "Crie três links A, B e C nessa ordem no DOM. Numa grade de três colunas, faça A e B atravessarem duas colunas cada e habilite dense. Confira que C preenche o espaço da primeira linha, mas Tab continua percorrendo A, B e C. Explique se essa configuração serve para um roteiro de passos.",
          "solution": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Ordem de uma grade</title>\n<style>\n#g { display:grid; width:600px; gap:10px; grid-template-columns:repeat(3,minmax(0,1fr)); grid-auto-flow:row dense; }\n#g a { display:block; min-height:30px; background:#ddd; }\n#a,#b { grid-column:span 2; }\n</style></head><body><main><h1>Ordem de uma grade</h1>\n<nav id=\"g\" aria-label=\"Itens\"><a id=\"a\" href=\"#destino\">A</a><a id=\"b\" href=\"#destino\">B</a><a id=\"c\" href=\"#destino\">C</a></nav>\n<p id=\"destino\">Destino de estudo</p>\n</main></body></html>",
          "explanation": [
            "B não cabe no espaço que sobra após A e passa para a próxima linha. Dense pode colocar C no espaço anterior que aceita uma única coluna, então C aparece acima de B. As caixas foram distribuídas por outra regra; os nós continuam na ordem A, B e C.",
            "O teste de teclado evidencia a diferença entre posição e sequência de foco. Para um roteiro obrigatório, conservar uma ordem visual compatível costuma exigir remover dense ou redefinir a disposição. Não tente corrigir a divergência fabricando tabindex positivos; isso introduz outro percurso de manutenção."
          ],
          "checks": [
            "C aparece na primeira linha e B na segunda.",
            "A ordem dos links no DOM continua A, B, C.",
            "A sequência por Tab coincide com a ordem do DOM."
          ]
        }
      ]
    },
    {
      "id": "css-responsivo",
      "title": "CSS: responsividade, consultas e dimensões fluidas",
      "level": "Avançado",
      "summary": "Projete componentes que se adaptam ao espaço, texto e preferências do usuário. Aprenda media queries, container queries, clamp, unidades de viewport, imagens responsivas e estratégias de reflow, escolhendo pontos de mudança a partir do conteúdo em vez de uma lista fixa de aparelhos.",
      "topics": [
        "media queries content breakpoints",
        "container queries inline-size",
        "clamp min max calc",
        "viewport svh lvh dvh",
        "reflow zoom text",
        "responsive images aspect-ratio",
        "prefers-color-scheme reduced-motion",
        "pointer hover capabilities"
      ],
      "sections": [
        {
          "title": "Comece pelo conteúdo",
          "text": [
            "Um breakpoint existe quando o conteúdo deixa de funcionar adequadamente, não porque um aparelho conhecido tem aquela largura. Comece com a estrutura mais simples e aumente a complexidade quando houver espaço real.",
            "Teste títulos longos, controles extras, zoom e idiomas diferentes. Um layout responsivo deve preservar informação e tarefa, não apenas reduzir tamanho de fonte até caber."
          ]
        },
        {
          "title": "Media queries e capacidades",
          "text": [
            "Media queries podem consultar dimensões e preferências ou capacidades, como hover e pointer. Um dispositivo pode ter mais de uma forma de entrada; não associe largura pequena exclusivamente a toque.",
            "prefers-color-scheme e prefers-reduced-motion expressam preferências que devem ser respeitadas conforme o produto. Uma alteração de tema precisa manter contraste e significado, e uma redução de movimento precisa conservar feedback útil."
          ]
        },
        {
          "title": "Container queries",
          "text": [
            "Container queries permitem adaptar um componente ao espaço de um contêiner adequado, reduzindo dependência do viewport inteiro. Defina containment apropriado e consulte a dimensão que você consegue medir.",
            "Não aplique containment indiscriminadamente: ele pode afetar tamanho e layout. O componente consultado e o contêiner têm uma relação específica; teste a mesma peça em barra lateral e região principal para verificar a intenção."
          ]
        },
        {
          "title": "Tamanhos fluidos com limites",
          "text": [
            "clamp define mínimo, preferência fluida e máximo. min e max escolhem limites, e calc combina valores compatíveis. Tipografia fluida deve conservar limites legíveis e respeitar preferências de texto.",
            "Uma fórmula que usa só vw pode reagir mal ao zoom ou produzir texto minúsculo. Combine unidades relativas e limites, e confira o resultado efetivo. O cálculo correto não garante uma boa experiência em toda largura."
          ]
        },
        {
          "title": "Viewport e mídia",
          "text": [
            "Unidades svh, lvh e dvh modelam diferentes estados de viewport em ambientes com interface dinâmica. Uma altura rígida pode cortar conteúdo quando texto cresce ou a barra do navegador muda.",
            "aspect-ratio ajuda a reservar uma relação de dimensões, mas não resolve todos os limites. Imagens precisam de candidatos adequados e tamanho de exibição coerente; CSS não recupera detalhes de uma imagem pequena ampliada."
          ]
        },
        {
          "title": "Reflow e verificação",
          "text": [
            "Conteúdo deve refluir sem exigir rolagem horizontal geral para leitura comum. Algumas regiões, como uma tabela extensa ou código, podem precisar de tratamento local. Esconder overflow na raiz não prova conformidade do layout.",
            "Verifique a página em larguras contínuas e não apenas dois screenshots. Teste foco visível, menus abertos e mensagens de erro. Estados interativos alteram o conteúdo e precisam participar da validação responsiva."
          ]
        }
      ],
      "code": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Componente adaptável</title><style>*{box-sizing:border-box}body{margin:0;padding:1rem}.regiao{container-type:inline-size;max-width:50rem}.cartao{display:grid;gap:1rem;padding:1rem;border:1px solid}h1{font-size:clamp(1.5rem,1rem + 2vw,2.5rem)}@container (min-width:30rem){.cartao{grid-template-columns:1fr 1fr}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}</style></head><body><h1>Uma peça, vários espaços</h1><div class=\"regiao\"><article class=\"cartao\"><h2>Estudo</h2><p>O cartão muda pelo espaço do contêiner.</p></article></div></body></html>",
      "output": "O cartão passa de uma para duas colunas conforme a largura de sua região. O título tem tamanho fluido limitado por valores em rem.",
      "trace": [
        "container-type define um contexto de consulta por dimensão inline.",
        "A mudança de colunas responde ao contêiner, não apenas à janela.",
        "clamp estabelece limites para a preferência fluida do título."
      ],
      "exercise": "Coloque o mesmo cartão em uma região larga e outra estreita. Use container query para mudar a disposição e teste o comportamento com texto duplicado e zoom.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Regiões</title><style>*{box-sizing:border-box}body{padding:1rem;margin:0}.regiao{container-type:inline-size;max-width:100%;margin-block:1rem}.estreita{width:18rem}.larga{width:45rem}.cartao{display:grid;gap:1rem;border:1px solid;padding:1rem;overflow-wrap:anywhere}@container(min-width:30rem){.cartao{grid-template-columns:1fr 2fr}}</style></head><body><h1>Componentes</h1><div class=\"regiao estreita\"><article class=\"cartao\"><h2>Estudo</h2><p>Leia e pratique.</p></article></div><div class=\"regiao larga\"><article class=\"cartao\"><h2>Estudo</h2><p>Leia e pratique com exemplos diferentes e anote suas decisões.</p></article></div></body></html>",
      "bug": "Um tamanho de fonte definido apenas em vw pode se tornar muito pequeno em uma tela estreita e não responder às necessidades de ampliação como esperado.",
      "bugCode": "h1 { font-size:2vw; }",
      "repair": "Defina uma faixa legível com unidades relativas e teste zoom e preferências de texto. Não trate clamp como uma garantia automática: confirme seus limites no conteúdo real.",
      "checks": [
        "O componente adapta-se ao próprio espaço disponível.",
        "A ampliação de texto conserva acesso às informações e controles.",
        "Não há overflow do documento escondido como correção de layout."
      ],
      "project": "Faça um relatório de adaptação de um componente em quatro regiões e vários estados. Inclua texto longo, erro de formulário, foco e preferências de movimento.",
      "question": "Container query permite que um componente responda a quê?",
      "answer": "À dimensão ou condição de um contêiner apropriado, conforme a consulta suportada.",
      "distractors": [
        "Somente ao nome do aparelho do usuário.",
        "Sempre à largura total da janela, ignorando seus ancestrais."
      ]
    },
    {
      "id": "css-visual-movimento",
      "title": "CSS: tipografia, cor e movimento",
      "level": "Avançado",
      "summary": "Trabalhe com apresentação visual sem perder legibilidade, contraste e controle do usuário. Estude tipografia, fontes, cores, fundos, gradientes, transformações, transições e animações, compreendendo custos de renderização e o uso de preferências para reduzir movimento desnecessário.",
      "topics": [
        "font stacks web fonts loading",
        "line-height measure text",
        "color contrast modern color spaces",
        "background gradients borders shadows",
        "transforms transitions",
        "keyframes animation timing",
        "reduced motion",
        "render layout paint composite"
      ],
      "sections": [
        {
          "title": "Tipografia e fallback",
          "text": [
            "Uma pilha de fontes define alternativas quando a primeira não existe. Fontes web têm custo de download e mudanças de métricas podem deslocar conteúdo. Escolha uma estratégia de carregamento e teste o fallback real.",
            "line-height unitless costuma acompanhar o tamanho do texto herdado. Largura de linha, tamanho e espaçamento afetam leitura. Texto em um cartão deve crescer sem ficar preso a uma altura que o corta."
          ]
        },
        {
          "title": "Cor e percepção",
          "text": [
            "Cor precisa transmitir contraste suficiente e não ser a única indicação de estado. Espaços de cor modernos oferecem formas diferentes de representar e interpolar valores; suporte e gamut do dispositivo influenciam a apresentação.",
            "Um valor de cor perceptualmente intuitivo ainda precisa ser verificado em combinações de texto e fundo. Transparência e imagens atrás do texto mudam o contraste efetivo. Teste estados de foco, hover, erro e desativação."
          ]
        },
        {
          "title": "Fundos e decoração",
          "text": [
            "Gradientes, sombras, bordas e imagens de fundo podem reforçar hierarquia, mas não carregam semântica por si. Uma imagem de fundo não oferece alt; se transmite informação necessária, precisa de conteúdo correspondente.",
            "Múltiplos fundos e filtros podem aumentar custo de pintura. Não avalie apenas um screenshot estático: rolagem e movimento revelam custos que a imagem parada não mostra. Mantenha o conteúdo acessível sem a decoração."
          ]
        },
        {
          "title": "Transformações e transições",
          "text": [
            "Transformações alteram a apresentação e podem criar contextos relevantes de empilhamento. Elas não reposicionam necessariamente outras caixas no fluxo. Um item movido pode cobrir conteúdo que continua ocupando seu lugar original.",
            "Transições interpolam mudanças entre estados conforme propriedades e timing. Declare as propriedades relevantes em vez de transition:all sem necessidade. Uma alteração de altura ou layout pode ter custo diferente de uma transformação."
          ]
        },
        {
          "title": "Animação e preferência",
          "text": [
            "@keyframes define etapas, e animation controla duração, repetição e preenchimento. Uma animação infinita pode distraír e precisa de propósito e controle apropriados. A informação essencial não deve depender de esperar uma animação.",
            "prefers-reduced-motion permite reduzir movimento para quem solicita. Preserve uma resposta perceptível, como uma mudança imediata de estado. Retirar movimento não significa retirar toda indicação de sucesso ou falha."
          ]
        },
        {
          "title": "Renderização e medição",
          "text": [
            "Mudanças podem exigir cálculo de estilo, layout, pintura ou composição. Transform e opacity frequentemente permitem estratégias eficientes, mas efeitos reais dependem da árvore, camadas e navegador. will-change também tem custo e não deve ser aplicado a tudo.",
            "Use ferramentas de desempenho com a interação real. Evite ler layout e escrever estilos repetidamente de forma intercalada quando isso força trabalho extra. Compare legibilidade e resposta, além de frames por segundo."
          ]
        }
      ],
      "code": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Estados visuais</title><style>body{font:1rem/1.6 system-ui;padding:1rem}.botao{font:inherit;padding:.75rem 1rem;background:#173e36;color:white;border:2px solid transparent;border-radius:.5rem;transition:transform .15s}.botao:hover{transform:translateY(-2px)}.botao:focus-visible{outline:3px solid #7b2cbf;outline-offset:3px}@media(prefers-reduced-motion:reduce){.botao{transition:none}.botao:hover{transform:none}}</style></head><body><h1>Feedback com controle</h1><p>O botão preserva foco e texto em todos os estados.</p><button class=\"botao\" type=\"button\">Continuar estudo</button></body></html>",
      "output": "O botão tem um foco visível e uma pequena mudança no hover. Quando movimento reduzido está ativo, ele conserva o controle e remove o deslocamento.",
      "trace": [
        "font:inherit conserva a tipografia do contexto no controle.",
        "focus-visible oferece um indicador separado do hover.",
        "A media query altera movimento sem remover o botão ou seu nome."
      ],
      "exercise": "Crie uma mensagem de sucesso com texto explícito e um ícone decorativo, uma transição breve e uma versão sem movimento. O texto deve continuar legível sem cor.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>Mensagem</title><style>body{font:1rem/1.6 system-ui;padding:1rem}.mensagem{border:2px solid #14532d;padding:1rem;color:#14532d;transition:background-color .2s}.mensagem:hover{background:#dcfce7}@media(prefers-reduced-motion:reduce){.mensagem{transition:none}}</style></head><body><p class=\"mensagem\" role=\"status\"><span aria-hidden=\"true\">✓</span> Exercício salvo com sucesso.</p></body></html>",
      "bug": "Uma animação que gira permanentemente para comunicar sucesso pode continuar causando distração e não fornecer informação adicional depois da conclusão.",
      "bugCode": ".sucesso { animation:girar 1s linear infinite; }\n@keyframes girar { to { transform:rotate(360deg); } }",
      "repair": "Use uma mudança de estado breve ou estática e respeite movimento reduzido. Se a tarefa exigir animação contínua, ofereça controle apropriado e uma alternativa informativa.",
      "checks": [
        "Estado e erro são compreensíveis sem depender só da cor.",
        "Foco continua perceptível e texto pode crescer.",
        "Movimento reduzido conserva feedback e a tarefa completa."
      ],
      "project": "Defina uma pequena biblioteca de estados visuais para carregamento, sucesso e erro. Meça uma interação e justifique duração, contraste e alternativa sem movimento.",
      "question": "Usar will-change em todos os elementos é uma otimização garantida?",
      "answer": "Não; pode aumentar custos de recursos e deve responder a uma necessidade medida.",
      "distractors": [
        "Sim; elimina qualquer pintura e layout.",
        "Sim; torna qualquer animação gratuita."
      ]
    },
    {
      "id": "css-arquitetura",
      "title": "CSS: arquitetura, compatibilidade e depuração",
      "level": "Especialização",
      "summary": "Organize estilos para evoluir um produto sem conflitos crescentes, usando tokens, componentes, camadas e regras claras. Estude suporte de recursos, @supports, escopo, estratégias de fallback e testes de produção, relacionando manutenção, acessibilidade e desempenho à experiência que o usuário realmente percorre.",
      "topics": [
        "tokens themes component APIs",
        "layers scope naming",
        "supports progressive enhancement",
        "compatibility fallback",
        "contain content-visibility",
        "logical properties internationalization",
        "DevTools computed layout",
        "visual regression states",
        "dead CSS maintenance"
      ],
      "sections": [
        {
          "title": "Uma API de estilos",
          "text": [
            "Um componente precisa declarar o que pode ser configurado e quais estados suporta. Tokens semânticos descrevem funções, como superfície e texto secundário, e permitem tema sem reescrever cada seletor.",
            "Classes devem expressar estrutura e estado de forma previsível. Um padrão de nomes pode ajudar, mas não substitui limites de responsabilidade. Evite uma classe utilitária que altera uma invariante essencial de um componente sem que seu consumidor saiba."
          ]
        },
        {
          "title": "Camadas e escopo",
          "text": [
            "Camadas organizam precedência deliberada entre resets, fundamentos, componentes e ajustes. Mantenha a ordem em um lugar claro e documente o uso de importância. @scope oferece outro mecanismo de limitar aplicação em ambientes que o suportam.",
            "Escopo não elimina necessidade de entender a cascata. Uma regra pode herdar valores de fora ou competir com outras origens. Teste componentes em contextos diferentes para verificar se seu contrato depende de um ancestral inesperado."
          ]
        },
        {
          "title": "Suporte e fallback",
          "text": [
            "@supports verifica suporte a uma declaração ou condição correspondente, não a qualidade de toda implementação. Uma versão básica deve funcionar antes de uma melhoria. Não esconda conteúdo porque uma propriedade nova não está disponível.",
            "Defina ambientes suportados com base no público e no projeto, e confira recursos antes de adotá-los. Um fallback precisa ser executado em um contexto que o utiliza; apenas escrever a regra não comprova seu comportamento."
          ]
        },
        {
          "title": "Contenção e custo",
          "text": [
            "contain e content-visibility podem limitar trabalho de renderização e têm efeitos de layout e disponibilidade. Reserve dimensões quando apropriado e teste acesso, busca e interação. Não use contenção como uma correção geral para uma árvore mal organizada.",
            "Elimine regras mortas com evidência de uso e estados possíveis. Uma ferramenta pode não observar classes criadas dinamicamente; remover tudo que não apareceu em uma visita pode quebrar erros, modais ou configurações raras."
          ]
        },
        {
          "title": "Depuração reproduzível",
          "text": [
            "Inspecione estilos calculados, regras vencedoras, dimensões e contextos de layout. Reduza a falha a uma pequena combinação de HTML e CSS. Isso separa uma regra inválida de um contêiner inesperado ou um problema de conteúdo.",
            "Registre viewport, zoom, estado da interface e preferência relevante. Uma imagem sem esses dados pode ser insuficiente para reproduzir. Faça a correção na causa e confira os outros contextos que compartilham o componente."
          ]
        },
        {
          "title": "Verificar a história inteira",
          "text": [
            "Teste início, erro, foco, carregamento, vazio e conteúdo extenso. Screenshots ajudam a comparar aparência, enquanto assertions de layout e teclado verificam comportamento. O artefato de produção precisa participar da validação.",
            "Uma arquitetura boa permite melhorar sem redesenhar o produto a cada mudança. Preserve tokens e contratos existentes quando a tarefa exige conservar aparência e use alterações localizadas com critérios observáveis."
          ]
        }
      ],
      "code": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Melhoria progressiva</title><style>@layer base,componentes;@layer base{:root{--texto:#173e36;--espaco:1rem}body{color:var(--texto);font:1rem/1.6 system-ui;padding:var(--espaco)}}@layer componentes{.lista{display:block}.item{border:1px solid;padding:var(--espaco);margin-block:var(--espaco)}@supports(display:grid){.lista{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr));gap:var(--espaco)}.item{margin:0}}}</style></head><body><main><h1>Componentes</h1><div class=\"lista\"><article class=\"item\"><h2>Um</h2><p>Funciona no fluxo básico.</p></article><article class=\"item\"><h2>Dois</h2><p>Melhora quando a grade é suportada.</p></article></div></main></body></html>",
      "output": "O fluxo básico apresenta os itens como blocos. Quando Grid é suportado, a melhoria muda a distribuição e usa gap sem duplicar a margem anterior.",
      "trace": [
        "Tokens expressam funções e são usados pelo componente.",
        "@supports delimita a melhoria e conserva a versão básica.",
        "A regra de margem é adaptada para evitar espaçamento duplicado."
      ],
      "exercise": "Organize um componente de aviso com tokens, estado de erro e fallback, sem usar !important. Produza um caso mínimo que demonstre o componente em dois contêineres e em texto longo.",
      "solution": "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Avisos</title><style>@layer base,componentes;@layer base{:root{--aviso-texto:#173e36;--aviso-borda:currentColor}body{font:1rem/1.6 system-ui;padding:1rem}}@layer componentes{.aviso{padding:1rem;border:2px solid var(--aviso-borda);color:var(--aviso-texto);overflow-wrap:anywhere}.aviso[data-estado=\"erro\"]{--aviso-texto:#8b1e1e}}.estreito{max-width:18rem}</style></head><body><div class=\"estreito\"><p class=\"aviso\">Registro pronto para revisão.</p></div><p class=\"aviso\" data-estado=\"erro\">Erro: o nome é obrigatório e precisa ser corrigido antes de continuar.</p></body></html>",
      "bug": "Remover estilos só porque não apareceram numa captura pode apagar estados criados em tempo de execução ou em uma falha de formulário.",
      "bugCode": "/* A ferramenta não observou .erro nesta visita. */\n/* Remover .erro sem verificar os fluxos deixa falhas sem apresentação. */",
      "repair": "Identifique onde classes e estados são produzidos, percorra os fluxos e só remova regras comprovadamente sem uso. Inclua estados de erro e carregamento na verificação.",
      "checks": [
        "O contrato do componente e seus estados estão documentados.",
        "Fallback conserva conteúdo e tarefa.",
        "A validação inclui produção, texto longo, foco e erros."
      ],
      "project": "Faça uma revisão dos estilos de um módulo real, mapeando tokens, componentes e estados. Corrija um conflito e meça o efeito em todos os contextos sem mudar a identidade visual.",
      "question": "@supports prova que toda a experiência usando uma propriedade funciona corretamente?",
      "answer": "Não; verifica suporte à condição consultada, e o fluxo precisa ser testado.",
      "distractors": [
        "Sim; substitui os testes de navegador.",
        "Sim; verifica automaticamente contraste e ordem de foco."
      ]
    }
  ]
} satisfies DeepCourse;

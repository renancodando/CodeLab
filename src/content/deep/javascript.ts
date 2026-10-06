import type {DeepCourse} from './types';
export default {
  "id": "javascript-completo",
  "title": "JavaScript · fundamentos à especialização",
  "description": "Semântica da linguagem, funções, objetos, coleções, assíncrono, módulos e engenharia.",
  "icon": "braces",
  "language": "javascript",
  "source": "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide",
  "lessons": [
    {
      "id": "js-semantica",
      "title": "JavaScript: valores, coerção e escopo",
      "level": "Fundamentos",
      "summary": "Consolide o modelo de execução de JavaScript, distinguindo valores primitivos, referências a objetos, coerção e escopo. Estude operadores, números, strings Unicode, comparação, destructuring e closures para prever programas com precisão, inclusive nos casos em que a sintaxe parece simples mas o resultado surpreende.",
      "topics": [
        "primitives objects typeof",
        "Number BigInt NaN",
        "Unicode strings",
        "coercion equality Object.is",
        "truthiness nullish",
        "let const var TDZ",
        "destructuring rest spread",
        "closures lexical scope"
      ],
      "sections": [
        {
          "title": "Valores e referências",
          "text": [
            "Primitivos incluem undefined, null, boolean, number, bigint, string e symbol. Objetos têm identidade; duas referências podem apontar para o mesmo objeto. Atribuir uma referência não copia os campos, e const não congela o objeto referido.",
            "typeof null devolve 'object' por uma particularidade histórica; trate null explicitamente ao validar objetos. Arrays também são objetos, e Array.isArray é a verificação apropriada para distingui-los de um registro comum."
          ]
        },
        {
          "title": "Números e texto",
          "text": [
            "Number usa ponto flutuante binário e tem limites para inteiros exatos. Number.isSafeInteger verifica o intervalo seguro; Number.isFinite rejeita NaN e infinitos sem converter texto. BigInt oferece inteiros grandes e não pode ser misturado implicitamente com Number nas operações usuais.",
            "String é imutável e usa unidades UTF-16. length não equivale sempre ao número de caracteres percebidos. for...of percorre pontos de código, enquanto segmentação de grafemas exige uma política mais rica, como uma API de internacionalização disponível no ambiente."
          ]
        },
        {
          "title": "Coerção e comparações",
          "text": [
            "+ pode concatenar strings ou somar números, enquanto outros operadores numéricos fazem conversões diferentes. Evite depender de conversões implícitas em dados de formulário; valide e converta uma vez na fronteira.",
            "=== compara sem a coerção de ==. NaN não é igual a si mesmo; Number.isNaN é a verificação explícita. Object.is distingue -0 de 0 e considera NaN igual a NaN. Escolha a comparação segundo o contrato, não uma regra memorizada sem contexto."
          ]
        },
        {
          "title": "Ausência e curto-circuito",
          "text": [
            "Valores como 0, false, '', null, undefined e NaN são falsy. || substitui todos eles quando usado para fornecer um padrão. ?? substitui somente null e undefined, preservando zero e false.",
            "?. interrompe um acesso quando a base é null ou undefined; não garante que um método exista nem trata qualquer exceção. Use ausência deliberadamente e não a deixe esconder um campo obrigatório que deveria ser validado."
          ]
        },
        {
          "title": "Escopo e inicialização",
          "text": [
            "let e const têm escopo de bloco e uma zona antes da inicialização em que acesso falha. var tem escopo de função e pode ser observado como undefined antes da atribuição. Hoisting não significa que toda inicialização já ocorreu.",
            "Closure conserva acesso ao ambiente léxico em que a função foi criada. Variáveis capturadas continuam sendo lidas conforme o estado desse ambiente; a closure não é sempre uma fotografia dos valores de criação."
          ]
        },
        {
          "title": "Destructuring e cópias superficiais",
          "text": [
            "Destructuring extrai valores de uma estrutura; defaults normalmente atuam quando o valor é undefined, não null. Rest reúne elementos restantes, e spread copia ou expande elementos conforme a operação.",
            "{...objeto} e [...array] criam contêineres novos, mas objetos internos continuam compartilhados. Para uma atualização independente, copie os níveis alterados ou adote uma representação imutável cujo contrato seja explícito."
          ]
        }
      ],
      "code": "function criarContador(inicial = 0) {\n  let valor = inicial;\n  return () => ++valor;\n}\nconst a = criarContador();\nconst b = criarContador(10);\nconsole.log(a(), a(), b());\nconsole.log(0 ?? 5, 0 || 5);\nconsole.log(Number.isNaN(NaN));",
      "output": "A saída é 1 2 11, depois 0 5 e true. Cada chamada de criarContador cria um ambiente independente; ?? conserva zero e || usa o padrão.",
      "trace": [
        "a conserva o valor criado na primeira chamada.",
        "b tem outro ambiente e começa em dez.",
        "O operador escolhido determina quais valores são tratados como ausência."
      ],
      "exercise": "Implemente criarAcumulador(inicial) que aceita somente um número finito e devolve uma função adicionar(valor), validando cada valor antes de atualizar. Duas instâncias devem ser independentes.",
      "solution": "function criarAcumulador(inicial = 0) {\n  if (!Number.isFinite(inicial)) throw new Error(\"inicial inválido\");\n  let total = inicial;\n  return function adicionar(valor) {\n    if (!Number.isFinite(valor) || !Number.isFinite(total + valor)) throw new Error(\"soma inválida\");\n    total += valor;\n    return total;\n  };\n}\nconst somar = criarAcumulador(2);\nconsole.log(somar(3), somar(-1));",
      "bug": "Usar || para aplicar um padrão pode descartar um zero que o domínio aceita. O defeito aparece quando a entrada válida é falsy.",
      "bugCode": "function tentativas(valor) {\n  return valor || 3;\n}\nconsole.log(tentativas(0));",
      "repair": "Use ?? se apenas null e undefined representam ausência. Depois valide finitude, integralidade e intervalo conforme a regra de tentativas.",
      "checks": [
        "Instâncias da closure não compartilham estado.",
        "Zero é preservado quando o contrato o aceita.",
        "Entradas inválidas não alteram o total anterior."
      ],
      "project": "Crie um pequeno modelo de metas com acumuladores independentes e atualização imutável dos registros. Demonstre aliases, defaults e uma regra clara para ausência.",
      "question": "const impede alterar propriedades de um objeto?",
      "answer": "Não; impede reatribuir o nome, enquanto as propriedades podem continuar mutáveis.",
      "distractors": [
        "Sim; congela recursivamente qualquer objeto.",
        "Sim; transforma o objeto em uma cópia independente."
      ]
    },
    {
      "id": "js-funcoes-this",
      "title": "JavaScript: funções, this e composição",
      "level": "Intermediário",
      "summary": "Estude declarações, expressões, arrow functions, callbacks e closures como formas de criar e combinar comportamento. Entenda como this é escolhido por uma chamada, como bind, call e apply alteram esse contexto e como funções puras ajudam a testar regras sem efeitos externos.",
      "topics": [
        "declaration expression arrow",
        "parameters defaults rest",
        "this call apply bind",
        "lexical this",
        "higher-order functions",
        "closures callbacks",
        "pure functions composition",
        "recursion stack tail calls"
      ],
      "sections": [
        {
          "title": "Funções são valores",
          "text": [
            "Uma função pode ser armazenada, passada e devolvida. Declarações e expressões têm diferenças de inicialização e escopo; escolha uma forma que torne dependências claras. Nomear uma função ajuda a ler stack traces.",
            "Parâmetros padrão e rest descrevem conveniências de chamada, mas não validam entradas. arguments existe em funções usuais; arrows usam o ambiente externo e não têm seu próprio arguments. Prefira parâmetros explícitos quando isso melhora o contrato."
          ]
        },
        {
          "title": "O contexto depende da chamada",
          "text": [
            "Em uma função usual, this depende de como ela é chamada. objeto.metodo() usa objeto como receptor, mas extrair const f = objeto.metodo e chamar f() não conserva automaticamente aquele receptor.",
            "O modo estrito evita algumas conversões implícitas de this. call fornece um receptor e argumentos separados; apply recebe uma sequência; bind cria uma função com contexto e possivelmente argumentos pré-aplicados."
          ]
        },
        {
          "title": "Arrow e contexto léxico",
          "text": [
            "Arrow functions não criam this próprio: usam o contexto léxico. Isso é útil em callbacks que devem acompanhar o contexto externo, mas pode ser incorreto para um método que espera o objeto receptor.",
            "Arrows também não são construtoras e não devem ser usadas com new. A concisão da sintaxe não muda essas regras. Escolha a forma segundo o contrato de chamada e teste a função quando ela é passada como callback."
          ]
        },
        {
          "title": "Composição e funções de ordem superior",
          "text": [
            "map recebe uma transformação, filter uma decisão e reduce uma combinação. Callbacks devem ter assinaturas compatíveis com o que a API fornece: passar uma função que interpreta um segundo argumento de outra forma pode causar uma surpresa.",
            "Compor funções pequenas permite testar cada regra. Não decomponha em funções tão genéricas que o significado do domínio desaparece; um nome como calcularTotal é mais útil que um combinador obscuro para uma operação simples."
          ]
        },
        {
          "title": "Pureza e efeitos",
          "text": [
            "Uma função pura depende de entradas e devolve resultado sem alterar estado externo observável. Tempo, aleatoriedade, rede e armazenamento são dependências que precisam ser controladas para testes reproduzíveis.",
            "Separe cálculo de efeitos: uma função calcula o pedido e outra o persiste ou apresenta. Pureza facilita raciocínio, mas o programa ainda precisa de efeitos nas fronteiras. Documente quando uma função modifica a coleção recebida."
          ]
        },
        {
          "title": "Recursão e pilha",
          "text": [
            "Uma função recursiva exige um caso base e uma medida que progride até ele. Entradas grandes podem esgotar a pilha; não suponha otimização de chamadas de cauda em todo ambiente JavaScript.",
            "Uma versão iterativa com estado explícito pode ser mais apropriada para percorrer dados extensos. Meça legibilidade e limites, e teste o caso base separado dos casos comuns para evitar uma recursão que nunca termina."
          ]
        }
      ],
      "code": "const carteira = {\n  saldo: 10,\n  somar(valor) { this.saldo += valor; return this.saldo; }\n};\nconst adicionar = carteira.somar.bind(carteira);\nconsole.log(adicionar(3));\nconst dobrar = x => x * 2;\nconst valores = [1, 2, 3].map(dobrar);\nconsole.log(valores);",
      "output": "A saída é 13 e [2,4,6]. bind conserva o receptor de somar quando a função é chamada fora da propriedade; map cria uma sequência transformada.",
      "trace": [
        "A função usual lê this no receptor vinculado.",
        "bind cria outro valor função, sem executar a soma na vinculação.",
        "dobrar não altera a lista nem depende de estado externo."
      ],
      "exercise": "Implemente compor(f, g) retornando uma função que calcula f(g(x)). Use duas funções puras para remover espaços e transformar texto em maiúsculas. Mostre que a ordem da composição importa.",
      "solution": "function compor(f, g) { return x => f(g(x)); }\nconst limpar = texto => texto.trim();\nconst maiusculas = texto => texto.toUpperCase();\nconsole.log(compor(maiusculas, limpar)(\" Lia \"));\nconst envolver = texto => \"[\" + texto + \"]\";\nconsole.log(compor(envolver, limpar)(\" x \"));\nconsole.log(compor(limpar, envolver)(\" x \"));",
      "bug": "Extrair um método para uma variável muda a forma de chamada. A referência à função não inclui automaticamente o objeto do qual ela veio.",
      "bugCode": "const objeto = {valor:3, ler(){return this.valor;}};\nconst ler = objeto.ler;\nconsole.log(ler());",
      "repair": "Use bind quando a API exige um callback com receptor fixo, ou passe uma closure como () => objeto.ler(). Confira a vida do objeto e evite vincular contexto sem necessidade.",
      "checks": [
        "A composição aplica primeiro g e depois f.",
        "Os exemplos não dependem de estado externo oculto.",
        "Callbacks com this têm um contrato de receptor explícito."
      ],
      "project": "Escreva um pipeline de validação e transformação de registros, mantendo os efeitos de leitura e gravação fora das funções de domínio. Inclua um callback que exige contexto e teste sua chamada separada.",
      "question": "Uma arrow function chamada como objeto.f() recebe automaticamente objeto como this?",
      "answer": "Não; ela conserva o this do ambiente léxico onde foi criada.",
      "distractors": [
        "Sim; toda função recebe o objeto imediatamente à esquerda.",
        "Sim; mas somente quando o objeto foi declarado com const."
      ]
    },
    {
      "id": "js-objetos-modelos",
      "title": "JavaScript: objetos, protótipos e classes",
      "level": "Avançado",
      "summary": "Entenda acesso a propriedades, identidade, descritores e cadeia de protótipos antes de usar classes. Explore encapsulamento com campos privados, composição, herança, getters, symbols, Proxy e Reflect, mantendo validação e políticas de dados distintas dos mecanismos da linguagem.",
      "topics": [
        "property keys descriptors",
        "own versus inherited",
        "prototype chain",
        "classes constructors private fields",
        "getters setters",
        "composition inheritance super",
        "symbols",
        "Proxy Reflect",
        "prototype pollution boundaries"
      ],
      "sections": [
        {
          "title": "Propriedades e cadeia de protótipos",
          "text": [
            "A leitura de uma propriedade pode pesquisar o próprio objeto e depois sua cadeia de protótipos. Object.hasOwn verifica propriedade própria, enquanto in inclui herdadas. for...in também pode percorrer propriedades herdadas enumeráveis.",
            "Chaves de propriedade usuais são strings ou symbols. Um objeto usado como dicionário exige cuidado com nomes especiais e herança; Map ou Object.create(null) pode expressar melhor chaves externas. Não copie chaves não confiáveis sem validar a fronteira."
          ]
        },
        {
          "title": "Descritores e cópias",
          "text": [
            "Descritores controlam escrita, enumeração e configuração de propriedades, ou definem getters e setters. Object.keys considera próprias enumeráveis com chave string; outras APIs observam conjuntos diferentes.",
            "Spread e Object.assign copiam valores de certas propriedades e podem executar getters durante a leitura. Não são uma clonagem universal de descritores, protótipos ou objetos especiais. Defina o que uma cópia precisa preservar."
          ]
        },
        {
          "title": "Classes e inicialização",
          "text": [
            "Classes organizam construtores e métodos sobre o modelo de protótipos. Campos privados com # são mecanismos de encapsulamento da linguagem, diferentes de uma propriedade cujo nome apenas começa com _.",
            "Construa objetos válidos e evite expor coleções internas mutáveis quando isso permite quebrar invariantes. Um getter pode calcular um valor, mas não deve esconder efeitos caros sem um contrato explícito."
          ]
        },
        {
          "title": "Herança e composição",
          "text": [
            "extends cria uma relação de herança e super acessa operações relacionadas ao base segundo regras da linguagem. Um derivado deve atender às expectativas dos clientes do base, não apenas compartilhar código.",
            "Composição recebe colaboradores para delegar responsabilidades sem criar uma hierarquia. Ela facilita substituir uma política em testes. Escolha herança por uma relação de contrato e não porque duas classes têm alguns métodos parecidos."
          ]
        },
        {
          "title": "Symbols e protocolos",
          "text": [
            "Symbols criam chaves que não colidem por simples igualdade textual. Symbols conhecidos, como Symbol.iterator, participam de protocolos da linguagem. Uma chave symbol não é uma proteção contra toda observação do objeto.",
            "Protocols precisam cumprir regras semânticas: um iterador deve fornecer next com resultados adequados. Não altere protocolos fundamentais apenas para obter uma sintaxe interessante; preserve expectativas de quem usa a API."
          ]
        },
        {
          "title": "Proxy, Reflect e invariantes",
          "text": [
            "Proxy intercepta operações, e Reflect oferece operações correspondentes com contratos explícitos. Os traps devem respeitar invariantes, especialmente para propriedades não configuráveis e objetos não extensíveis.",
            "Esses mecanismos podem ajudar em observação e adaptação, mas acrescentam indireção. Um Proxy não torna dados externos seguros nem substitui validação. Teste leitura, escrita, enumeração e identidade quando a aplicação depender dessas operações."
          ]
        }
      ],
      "code": "class Carrinho {\n  #precos = [];\n  adicionar(centavos) {\n    if (!Number.isSafeInteger(centavos) || centavos < 0) throw new Error(\"preço inválido\");\n    if (!Number.isSafeInteger(this.total + centavos)) throw new Error(\"total excessivo\");\n    this.#precos.push(centavos);\n  }\n  get total() { return this.#precos.reduce((a,b) => a+b, 0); }\n}\nconst c = new Carrinho();\nc.adicionar(250); c.adicionar(100);\nconsole.log(c.total);\nconsole.log(new Carrinho().total);",
      "output": "A saída é 350 e 0. O campo privado não é exposto; a validação acontece antes de alterar a coleção e o total é calculado do estado atual.",
      "trace": [
        "Cada instância inicializa uma lista própria.",
        "A soma é verificada antes de aceitar um novo preço.",
        "O getter devolve um valor e não uma referência para a lista interna."
      ],
      "exercise": "Crie um Registro que guarda nomes únicos em um Set privado, aceita somente texto não vazio e oferece uma lista nova dos nomes. Alterar a lista devolvida não deve alterar o registro.",
      "solution": "class Registro {\n  #nomes = new Set();\n  adicionar(valor) {\n    if (typeof valor !== \"string\" || !valor.trim()) throw new Error(\"nome inválido\");\n    this.#nomes.add(valor.trim());\n  }\n  listar() { return [...this.#nomes]; }\n}\nconst r = new Registro(); r.adicionar(\" Lia \"); r.adicionar(\"Lia\");\nconst copia = r.listar(); copia.push(\"Outra\");\nconsole.log(r.listar());",
      "bug": "Devolver uma coleção interna permite que o chamador a altere sem passar pela validação, quebrando o contrato do objeto.",
      "bugCode": "class Registro {\n  nomes = [];\n  listar() { return this.nomes; }\n}\nconst r = new Registro(); r.listar().push(null);",
      "repair": "Encapsule o estado e devolva uma cópia ou uma representação cuja imutabilidade real seja adequada. Se os elementos forem objetos, defina também a política para mutações internas.",
      "checks": [
        "O objeto rejeita entradas antes de alterar estado.",
        "Listas devolvidas não expõem diretamente a coleção privada.",
        "A API distingue propriedades próprias e herdadas quando processa dados externos."
      ],
      "project": "Modele registros de estudo com uma política de pontuação recebida por composição. Mantenha dados privados e teste se um consumidor consegue quebrar invariantes por um valor devolvido.",
      "question": "O operador in verifica apenas propriedades próprias?",
      "answer": "Não; ele também considera a cadeia de protótipos.",
      "distractors": [
        "Sim; é idêntico a Object.hasOwn em qualquer objeto.",
        "Sim; mas somente para arrays."
      ]
    },
    {
      "id": "js-colecoes-iteracao",
      "title": "JavaScript: coleções, iteradores e memória",
      "level": "Avançado",
      "summary": "Escolha arrays, Map, Set e coleções fracas segundo o contrato, e use iteradores e geradores para processar sequências com controle de memória. Estude mutabilidade, ordenação, typed arrays, buffers, expressões regulares, internacionalização e gestão de recursos, respeitando as APIs disponíveis em cada runtime.",
      "topics": [
        "arrays sparse map filter reduce sort",
        "Map Set identity",
        "WeakMap WeakSet GC",
        "iterators generators yield",
        "typed arrays ArrayBuffer DataView",
        "RegExp Unicode",
        "Intl formatting segmentation",
        "resource lifetime dispose",
        "memory leaks"
      ],
      "sections": [
        {
          "title": "Arrays e operações mutáveis",
          "text": [
            "map e filter criam arrays novos, mas os elementos podem continuar sendo os mesmos objetos. sort modifica o array e sua ordenação padrão usa representação textual. Use um comparador numérico quando o contrato exigir números.",
            "Arrays esparsos têm posições ausentes que não equivalem sempre a valores undefined em todas as operações. Evite produzir lacunas acidentalmente. Métodos de cópia mais recentes exigem verificar o suporte do ambiente antes de usá-los."
          ]
        },
        {
          "title": "Map, Set e identidade",
          "text": [
            "Map permite chaves de diferentes tipos e conserva ordem de inserção. Set elimina duplicação segundo a comparação usada por essa coleção; dois objetos com campos iguais ainda têm identidades distintas e podem ocupar duas posições.",
            "Para agrupar registros por conteúdo, extraia uma chave de domínio estável. Não use JSON.stringify como igualdade universal: ordem, tipos especiais e dados não serializáveis podem mudar o significado."
          ]
        },
        {
          "title": "Referências fracas e coleta",
          "text": [
            "WeakMap e WeakSet não conservam seus objetos chave vivos apenas por estarem na coleção. Eles são úteis para metadados associados à vida de um objeto, mas não oferecem enumeração confiável das chaves.",
            "Garbage collection não é uma política determinística de liberação de arquivos, conexões ou listeners. Remova inscrições e encerre recursos explicitamente. Closures, caches e arrays de histórico podem conservar referências além do necessário."
          ]
        },
        {
          "title": "Iteradores e geradores",
          "text": [
            "O protocolo iterável fornece Symbol.iterator; o iterador devolve resultados com value e done. Um gerador com yield conserva seu estado entre avanços. Isso permite produzir uma sequência sem materializar todos os elementos.",
            "Um iterador consumido não reinicia sozinho. Um gerador que usa um recurso precisa de uma política para término antecipado e finally. Ao encerrar um for...of cedo, o protocolo pode chamar return do iterador para permitir limpeza."
          ]
        },
        {
          "title": "Dados binários e APIs especializadas",
          "text": [
            "Typed arrays apresentam visões numéricas sobre ArrayBuffer; DataView permite escolher offsets e endianness explicitamente. Várias views podem compartilhar os mesmos bytes, então uma escrita em uma aparece nas outras.",
            "RegExp trabalha com padrões e flags, inclusive regras Unicode. Intl formata números, datas e, onde disponível, segmenta texto segundo localidade. Essas APIs dependem do runtime e dos dados de internacionalização; formatar não substitui validar ou armazenar dados de domínio."
          ]
        },
        {
          "title": "Limites de recursos",
          "text": [
            "Recursos devem ter dono e encerramento definidos. Mecanismos de descarte explícito e suas sintaxes têm suporte variável entre ambientes; verifique a documentação antes de adotá-los. try/finally continua importante para preservar limpeza.",
            "Para investigar memória, repita um fluxo e acompanhe referências e crescimento, não apenas uma fotografia isolada do heap. Uma coleção que aumenta com toda navegação pode revelar um listener, editor ou cache que deixou de ser liberado."
          ]
        }
      ],
      "code": "function* positivos(valores) {\n  for (const valor of valores) if (valor > 0) yield valor;\n}\nconst grupos = new Map();\nfor (const valor of positivos([-1, 2, 2, 3])) {\n  grupos.set(valor, (grupos.get(valor) ?? 0) + 1);\n}\nconsole.log([...grupos.entries()]);\nconsole.log([10, 2, 1].sort((a,b) => a-b));",
      "output": "A saída é [[2,2],[3,1]] e [1,2,10]. O gerador filtra sob demanda; Map acumula por número e o comparador define ordenação numérica.",
      "trace": [
        "Cada avanço do gerador percorre até encontrar o próximo positivo.",
        "O valor anterior de cada chave é lido antes do incremento.",
        "sort modifica o array literal criado para esse exemplo."
      ],
      "exercise": "Implemente um gerador intervalo(inicio, fim) que produz inteiros do início ao fim exclusivo. Rejeite valores que não sejam inteiros seguros e teste que uma sequência vazia não produz elementos.",
      "solution": "function* intervalo(inicio, fim) {\n  if (!Number.isSafeInteger(inicio) || !Number.isSafeInteger(fim)) throw new Error(\"limites inválidos\");\n  for (let valor = inicio; valor < fim; valor++) yield valor;\n}\nconsole.log([...intervalo(1,4)]);\nconsole.log([...intervalo(2,2)]);",
      "bug": "Set de objetos não remove registros duplicados por igualdade de campos. Cada literal cria outra identidade.",
      "bugCode": "const dados = [{id:1}, {id:1}];\nconsole.log(new Set(dados).size);",
      "repair": "Use uma chave de domínio e uma política para duplicação, como manter a primeira ocorrência em Map. Documente se uma duplicata idêntica e uma duplicata com dados conflitantes recebem o mesmo tratamento.",
      "checks": [
        "A sequência usa fim exclusivo e trata o intervalo vazio.",
        "A deduplicação segue uma chave de domínio explícita.",
        "Recursos e inscrições têm término definido, sem depender apenas do coletor."
      ],
      "project": "Crie um processador de eventos com gerador, deduplicação por identificador e histórico limitado. Compare consumo sob demanda com materialização e verifique crescimento de memória em várias execuções.",
      "question": "Dois objetos {id:1} entram como um único item em Set?",
      "answer": "Não; são objetos com identidades distintas.",
      "distractors": [
        "Sim; Set compara recursivamente todos os campos.",
        "Sim; todo objeto é convertido para JSON antes da comparação."
      ]
    },
    {
      "id": "js-assincrono",
      "title": "JavaScript: promises, concorrência e cancelamento",
      "level": "Avançado",
      "summary": "Entenda event loop, microtasks, promises e async/await para coordenar trabalho sem perder erros ou atualizar uma interface com resultados antigos. Estude combinações, limites de concorrência, cancelamento, timeouts e idempotência, distinguindo tarefas de JavaScript de APIs oferecidas pelo ambiente.",
      "topics": [
        "event loop jobs microtasks",
        "Promise states chaining",
        "async await rejection",
        "all allSettled race any",
        "bounded concurrency",
        "AbortController host APIs",
        "timeouts stale responses",
        "idempotency retry backoff"
      ],
      "sections": [
        {
          "title": "Execução e filas",
          "text": [
            "JavaScript executa um trecho até devolver controle; promessas agendam reações em uma fila de jobs ou microtasks do ambiente. setTimeout é uma API do host, não uma instrução da linguagem, e seu atraso não garante execução exatamente naquele instante.",
            "Uma tarefa longa de CPU pode impedir outras ações da interface. Escrever async não move automaticamente cálculo para outra thread. Divida trabalho quando apropriado ou use workers com uma fronteira de dados e cancelamento."
          ]
        },
        {
          "title": "Estados e encadeamento",
          "text": [
            "Uma Promise fica pendente e depois resolve ou rejeita; esse estado não volta a pendente. then devolve outra Promise e o valor retornado pelo callback determina a sequência. Esquecer return de uma operação assíncrona pode fazer a cadeia avançar cedo.",
            "O executor de new Promise roda durante sua criação. Não envolva uma Promise existente sem necessidade. Uma rejeição precisa de um observador apropriado; erro perdido não deve virar uma operação aparentemente bem-sucedida."
          ]
        },
        {
          "title": "async, await e falhas",
          "text": [
            "Uma função async sempre devolve uma Promise. await suspende aquela função até o resultado, sem bloquear necessariamente o restante do ambiente. Um throw dentro dela rejeita a Promise retornada.",
            "try/catch observa rejeições aguardadas dentro do bloco. Se você devolve uma Promise sem await em certos contextos, a falha pode não ser capturada ali. Use finally para limpeza e não o deixe substituir involuntariamente um resultado ou erro."
          ]
        },
        {
          "title": "Combinações e limites",
          "text": [
            "Promise.all conserva a ordem dos resultados, mas rejeita quando uma entrada rejeita e não cancela as demais. allSettled reúne todos os estados; race segue a primeira conclusão e any o primeiro sucesso, com falha agregada se todos falharem.",
            "Criar milhares de operações de uma vez pode saturar recursos. Um conjunto de consumidores sobre uma fila pode limitar concorrência. Defina política para falha parcial e deixe claro se o restante deve continuar, encerrar ou ser cancelado cooperativamente."
          ]
        },
        {
          "title": "Cancelamento e respostas antigas",
          "text": [
            "AbortController pode pedir cancelamento a APIs que aceitam signal. Ele não desfaz efeitos externos já concluídos e não é uma Promise cancelável universal. A operação e o consumidor devem entender o pedido.",
            "Mesmo com cancelamento, use um identificador de execução para ignorar resultados antigos quando uma entrada mudou. Isso evita que uma resposta lenta substitua uma nova. Limpe listeners e tarefas auxiliares ao sair da tela."
          ]
        },
        {
          "title": "Repetição e consistência",
          "text": [
            "Timeout limita a espera do consumidor, mas uma operação remota pode continuar. Repetir um pedido com efeito exige idempotência ou uma chave que impeça duplicação. Backoff e limites de repetição devem responder ao tipo de falha.",
            "Teste atrasos, falha de uma tarefa, cancelamento e conclusão fora de ordem. Faça a interface comunicar estado real e conserve o erro original para diagnóstico. Uma promessa resolvida não significa que uma regra de domínio foi cumprida."
          ]
        }
      ],
      "code": "async function calcular(valor) {\n  await Promise.resolve();\n  if (valor < 0) throw new Error(\"valor negativo\");\n  return valor * 2;\n}\nasync function main() {\n  const resultados = await Promise.allSettled([calcular(2), calcular(-1), calcular(3)]);\n  console.log(resultados.map(r => r.status === \"fulfilled\" ? r.value : \"erro\"));\n}\nmain();",
      "output": "A saída é [4,\"erro\",6]. allSettled conserva a posição de cada operação e permite apresentar a falha sem descartar os sucessos.",
      "trace": [
        "Cada chamada devolve uma Promise e suspende em await.",
        "O valor negativo rejeita sua operação.",
        "main aguarda todos os estados antes de transformá-los em uma saída."
      ],
      "exercise": "Escreva dobrarTodos(valores) com async e Promise.all, preservando a ordem e rejeitando qualquer número não finito. Teste vazio, valores válidos e uma entrada inválida.",
      "solution": "async function dobrarTodos(valores) {\n  return Promise.all(valores.map(async valor => {\n    if (!Number.isFinite(valor) || !Number.isFinite(valor * 2)) throw new Error(\"número inválido\");\n    return valor * 2;\n  }));\n}\ndobrarTodos([1,3,2]).then(resultado => console.log(resultado));",
      "bug": "forEach não aguarda automaticamente o retorno assíncrono do callback. A função externa pode devolver uma lista antes que as operações preencham seus itens.",
      "bugCode": "async function transformar(valores) {\n  const resultado = [];\n  valores.forEach(async x => {resultado.push(await Promise.resolve(x * 2));});\n  return resultado;\n}",
      "repair": "Use Promise.all com map quando as operações podem começar juntas, ou um for...of com await para sequência. Para listas grandes e recursos limitados, implemente concorrência limitada.",
      "checks": [
        "A ordem do retorno segue a ordem das entradas.",
        "Falhas são observadas e não desaparecem em callbacks.",
        "Cancelamento e respostas antigas têm políticas distintas e testáveis."
      ],
      "project": "Crie uma busca simulada em que uma consulta antiga demora mais que a nova. Verifique que só a execução vigente atualiza a interface e que sair da tela libera os recursos da operação.",
      "question": "Promise.all cancela automaticamente as outras operações quando uma rejeita?",
      "answer": "Não; a rejeição do conjunto não cancela os efeitos das demais.",
      "distractors": [
        "Sim; todas são desfeitas atomicamente.",
        "Sim; qualquer Promise sempre aceita AbortController."
      ]
    },
    {
      "id": "js-modulos-engenharia",
      "title": "JavaScript: módulos, testes e arquitetura",
      "level": "Especialização",
      "summary": "Organize programas JavaScript em módulos e fronteiras, usando testes, validação e medição para evoluir com confiança. Estude imports, exports, dependências, ambientes, tratamento de erros, serialização, segurança e observação, relacionando ferramentas à correção dos fluxos completos.",
      "topics": [
        "ES modules live bindings",
        "dynamic import top-level await",
        "cycles CommonJS hosts",
        "errors causes boundaries",
        "JSON structured clone",
        "unit integration e2e",
        "dependency injection",
        "performance profiling",
        "security DOM SQL boundaries"
      ],
      "sections": [
        {
          "title": "Módulos e dependências",
          "text": [
            "ES modules têm escopo próprio e imports com vínculos ao módulo exportador. exports descrevem a API pública. Um módulo deve evitar trabalho externo inesperado ao importar; efeitos de inicialização precisam ser deliberados.",
            "Ciclos podem expor valores antes da inicialização. Separe contratos e responsabilidades para reduzir ciclos. CommonJS e ESM têm mecanismos distintos, e a resolução de caminhos depende do ambiente ou bundler."
          ]
        },
        {
          "title": "Carregamento e falha",
          "text": [
            "import() carrega um módulo de forma assíncrona e devolve uma Promise. Ele permite adiar conteúdo extenso, mas o consumidor precisa de estado de carregamento, tratamento de falha e proteção contra resultados após uma navegação.",
            "Top-level await pode atrasar dependentes e precisa de suporte no destino. Não use carregamento dinâmico para cada detalhe sem medir: muitos fragmentos pequenos podem aumentar a latência e tornar falhas difíceis de reproduzir."
          ]
        },
        {
          "title": "Fronteiras de dados",
          "text": [
            "JSON preserva um subconjunto de dados e não conserva protótipos, métodos, undefined em todas as posições ou referências circulares. structuredClone atende a outro contrato de cópia e também tem tipos e limites próprios.",
            "Valide antes de substituir dados existentes, especialmente em importação de backup. Parsing bem-sucedido não garante estrutura nem tamanho aceitável. Uma importação parcialmente aplicada pode perder dados; prepare e valide a substituição inteira antes de confirmá-la."
          ]
        },
        {
          "title": "Testes que provam comportamento",
          "text": [
            "Unidade verifica regras, integração verifica fronteiras e E2E percorre uma história de uso. Use resultados independentes como oráculo e teste falhas observáveis. Um teste que espelha a implementação pode conservar o mesmo defeito.",
            "Injete relógio, aleatoriedade e adaptadores externos para controlar cenários. Não simule exatamente a dependência que você precisa verificar em uma integração. Um build de produção pode ter comportamento diferente do servidor de desenvolvimento."
          ]
        },
        {
          "title": "Segurança e erros",
          "text": [
            "Erro esperado pode virar um resultado de domínio; erro inesperado precisa de diagnóstico. Preserve causa e evite mensagens que exponham segredos. Não absorva todas as falhas para manter uma tela aparentemente normal.",
            "Escape texto inserido em HTML e use parâmetros em consultas SQL. Não execute conteúdo recebido com eval. Uma fronteira de confiança deve ser explícita; usar uma linguagem dinâmica não justifica tratar dados externos como código."
          ]
        },
        {
          "title": "Observação e manutenção",
          "text": [
            "Meça o fluxo que o usuário percorre: tempo, consumo, cancelamento e recursos conservados após sair. Um benchmark isolado não revela necessariamente lentidão de navegação, editores duplicados ou workers esquecidos.",
            "Faça mudanças pequenas com critérios e exemplos reproduzíveis. Atualizar uma dependência exige conferir compatibilidade e testar o artefato final. Documentação deve explicar execução, limites e recuperação dos dados, não apenas listar comandos."
          ]
        }
      ],
      "code": "function validarRegistro(valor) {\n  if (typeof valor !== \"object\" || valor === null || Array.isArray(valor)) throw new Error(\"objeto esperado\");\n  if (typeof valor.nome !== \"string\" || !valor.nome.trim()) throw new Error(\"nome inválido\");\n  if (!Number.isSafeInteger(valor.pontos) || valor.pontos < 0) throw new Error(\"pontos inválidos\");\n  return {nome:valor.nome.trim(), pontos:valor.pontos};\n}\nconst dados = JSON.parse('{\"nome\":\"Lia\",\"pontos\":3}');\nconsole.log(validarRegistro(dados));",
      "output": "A saída é um novo registro com nome Lia e pontos 3. A fronteira copia apenas campos aceitos após validar estrutura, tipo e intervalo.",
      "trace": [
        "O parser lê dados, sem executar expressões.",
        "A validação estabelece o modelo interno.",
        "Campos extras não são propagados automaticamente para o domínio."
      ],
      "exercise": "Implemente prepararImportacao(texto) que interpreta uma lista JSON e valida todos os registros antes de devolver a lista nova. Se um item falhar, não devolva uma importação parcial.",
      "solution": "function prepararImportacao(texto) {\n  const dados = JSON.parse(texto);\n  if (!Array.isArray(dados) || dados.length > 100) throw new Error(\"lista inválida\");\n  return dados.map(item => {\n    if (!item || typeof item !== \"object\" || Array.isArray(item) || typeof item.nome !== \"string\" || !item.nome.trim()) throw new Error(\"registro inválido\");\n    return {nome:item.nome.trim()};\n  });\n}\nconsole.log(prepararImportacao('[{\"nome\":\"Lia\"}]'));",
      "bug": "Atualizar o estado ao validar cada item permite aplicar alguns registros e falhar no seguinte, deixando uma mistura entre dados antigos e novos.",
      "bugCode": "const estado = [];\nfor (const item of JSON.parse('[{\"nome\":\"Lia\"},null]')) {\n  estado.push(item.nome.trim());\n}",
      "repair": "Valide e construa um candidato separado. Só substitua o estado depois de toda a preparação concluir; mantenha a versão anterior se qualquer item falhar.",
      "checks": [
        "Uma falha não altera o estado anterior.",
        "O build e o fluxo de produção são verificados.",
        "Listeners, workers e recursos de tela são liberados ao encerrar o fluxo."
      ],
      "project": "Organize um importador e exportador de estudos em módulos, com validação, testes de unidade e um fluxo de navegador. Teste arquivo inválido, excesso de dados e navegação durante carregamento.",
      "question": "Por que validar toda uma importação antes de substituir o estado?",
      "answer": "Para evitar uma atualização parcial e preservar os dados anteriores em caso de falha.",
      "distractors": [
        "Porque JSON sempre executa código recebido.",
        "Porque map garante automaticamente persistência transacional."
      ]
    }
  ]
} satisfies DeepCourse;

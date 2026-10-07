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
      "id": "js-conversao-limites",
      "title": "JavaScript: conversão explícita e números nos limites",
      "level": "Fundamentos",
      "summary": "Trate a entrada recebida antes de permitir que os operadores escolham uma conversão implícita. Esta aula explica concatenação, igualdade, números seguros, NaN e preservação de zero. Os problemas constroem uma quantidade inteira e um total em centavos com contratos que rejeitam dados ambíguos, sem depender de parseInt para validar um campo completo.",
      "source": "https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber",
      "topics": [
        "coerção do operador mais",
        "Number e conversão explícita",
        "parseInt e prefixo válido",
        "NaN e Number.isNaN",
        "inteiros seguros",
        "zero e operador nullish",
        "BigInt e Number separados",
        "validação antes do cálculo"
      ],
      "sections": [
        {
          "title": "O operador trabalha com os valores que recebeu",
          "text": [
            "Em JavaScript, o operador + pode somar números ou concatenar strings depois das conversões aplicáveis. Se um campo de formulário contém '12', campo + 1 pode produzir '121'. Outros operadores podem converter o mesmo texto para número e produzir uma aparência de inconsistência. O problema é deixar a representação da entrada implícita. Decida na fronteira se o dado é texto, uma quantidade inteira ou uma medida antes de calcular.",
            "Uma conversão explícita não basta sem uma regra de validade. Number('') e Number('   ') resultam em zero; Number('12') resulta em 12; Number('12kg') produz NaN. O domínio de quantidade desta aula não aceita vazio ou espaços. Conferir a gramática antes da conversão impede que o número zero apareça por um caminho que deveria ser uma rejeição. Zero fornecido corretamente continua sendo um valor válido."
          ]
        },
        {
          "title": "Converter um prefixo não aceita um campo inteiro",
          "text": [
            "parseInt procura uma representação inteira no início do texto e pode parar antes do fim. Com base dez, parseInt('12kg', 10) produz 12. Isso pode ser útil quando o contrato permite um prefixo, mas não valida o campo de quantidade. Um parser para um formulário precisa escolher se aceita espaços, sinais e notação exponencial. Não transfira ao usuário uma gramática acidental determinada pela função de conversão escolhida.",
            "Nesta aula, uma expressão ancorada exige de um a seis dígitos ASCII, sem sinal e sem separadores. Em JavaScript, a âncora $ pode corresponder antes de uma quebra de linha final; para um consumo estrito usamos uma verificação adicional de fim sem caractere restante. Uma alternativa é percorrer os caracteres e conferir comprimento. O objetivo é provar que toda a entrada atende ao contrato, e não ensinar uma expressão regular decorada."
          ]
        },
        {
          "title": "NaN, infinito e fração têm verificações diferentes",
          "text": [
            "NaN indica um resultado numérico que não representa um número comum, e sua igualdade consigo mesmo é falsa. Number.isNaN verifica especificamente esse valor sem converter a entrada. Number.isFinite aceita apenas números finitos, enquanto a função global isFinite faz coerção. Se o domínio é contagem, finitude ainda não basta: 2.5 é finito, mas não é inteiro. Number.isSafeInteger reúne integralidade e faixa de exatidão para o tipo Number.",
            "Não use if (!numero) como validação universal. Essa condição rejeita zero e NaN, mas aceita vários valores que podem estar fora do domínio. A validação precisa descrever diretamente tipo, finitude, integralidade e faixa conforme o problema. Um valor negativo pode ser uma temperatura válida e uma quantidade inválida. O teste deve refletir a unidade e a regra da função que recebe o número."
          ]
        },
        {
          "title": "Precisão tem limites antes de existir overflow infinito",
          "text": [
            "Number usa uma representação binária de precisão finita. Inteiros até Number.MAX_SAFE_INTEGER em magnitude têm a garantia esperada de exatidão; acima dessa região, operações podem perder a distinção entre inteiros consecutivos. Um resultado ainda finito pode estar incorreto para um identificador ou total de unidades exatas. Confira o resultado de somas e produtos quando a função promete permanecer em inteiros seguros.",
            "BigInt fornece aritmética inteira com magnitudes além da faixa segura de Number, limitada por recursos. Ele não mistura automaticamente suas operações aritméticas com Number e não representa frações. Converter um Number já impreciso para BigInt não recupera o inteiro pretendido. Para um identificador grande recebido em JSON ou formulário, preserve o texto decimal original até uma conversão que mantenha sua exatidão."
          ]
        },
        {
          "title": "Defaults não devem apagar dados válidos",
          "text": [
            "O operador || escolhe o valor à direita quando o da esquerda é falsy, incluindo zero, false e string vazia. O operador ?? só substitui null e undefined. Se o limite zero é permitido, limite || 10 muda a regra do usuário. Isso é um bug de negócio que não exige erro de sintaxe e pode passar em testes que usam apenas limites positivos.",
            "Depois de aplicar um default, valide o resultado. Uma configuração null pode significar ausência aceitável num sistema e erro de integração em outro. O operador não escolhe essa política sozinho. Uma função pode devolver { ok: true, valor } ou { ok: false, erro } para tornar sucesso e falha observáveis. O consumidor então confere ok, sem tentar inferir validade a partir de o valor ser verdadeiro em uma condição."
          ]
        },
        {
          "title": "Teste a fronteira e o resultado numérico",
          "text": [
            "Monte casos com texto vazio, espaço, zero, zeros iniciais, sufixo, sinal, quebra de linha final, fração e limite exato. Para cálculo, use também um valor seguro cujo produto exceda a faixa segura. Essa combinação confere tanto a forma textual quanto a capacidade do resultado. Converter uma vez e usar o número por todo o domínio evita coerções espalhadas em várias fórmulas.",
            "As soluções usam uma função verificar que lança Error em divergências. Isso permite executar o mesmo código no interpretador do laboratório e no CI sem uma biblioteca de testes externa. Transfira a regra para um carrinho em centavos: defina faixa de preço e quantidade, valide o produto e só depois formate. Se a faixa não for suficiente para o negócio, altere a representação e a serialização junto com os testes."
          ]
        }
      ],
      "code": "function quantidade(texto) {\n  if (typeof texto !== \"string\" || !/^[0-9]{1,6}(?![\\s\\S])/.test(texto))\n    return {ok:false,erro:\"formato\"};\n  const valor=Number(texto);\n  return valor<=500 ? {ok:true,valor} : {ok:false,erro:\"faixa\"};\n}\nconst zero=quantidade(\"0\"),ruim=quantidade(\"12kg\");\nif (!zero.ok || zero.valor!==0 || ruim.ok || quantidade(\"12\\n\").ok) throw new Error(\"quantidade\");\nconsole.log(JSON.stringify(zero));\nconsole.log(JSON.stringify(ruim));\nconsole.log(\"12\"+1,Number(\"12\")+1);\nconsole.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER+1));",
      "expectedOutput": [
        "{\"ok\":true,\"valor\":0}",
        "{\"ok\":false,\"erro\":\"formato\"}",
        "121 13",
        "false"
      ],
      "output": "Saída: sucesso com valor zero, falha de formato, 121 13 e false. A última linha mostra que um número finito pode sair da faixa segura de inteiros.",
      "trace": [
        "A gramática exige o consumo integral, inclusive quando há quebra de linha final.",
        "Number só é chamado após a prova do formato; o zero não é usado como sentinela de falha.",
        "O operador + recebe tipos diferentes em duas expressões e produz resultados diferentes."
      ],
      "exercise": "Calcule totalCentavos(preco, quantidade) para números inteiros seguros não negativos. Confira também que o produto é inteiro seguro. Retorne um resultado discriminado e teste quantidade zero, fração, valor negativo e produto além do limite.",
      "solution": "function totalCentavos(preco,quantidade) {\n  if (!Number.isSafeInteger(preco) || preco<0 || !Number.isSafeInteger(quantidade) || quantidade<0)\n    return {ok:false,erro:\"entrada\"};\n  const valor=preco*quantidade;\n  return Number.isSafeInteger(valor) ? {ok:true,valor} : {ok:false,erro:\"limite\"};\n}\nconst bom=totalCentavos(1250,3),zero=totalCentavos(1250,0);\nif (!bom.ok || bom.valor!==3750 || !zero.ok || zero.valor!==0 ||\n    totalCentavos(1.5,2).ok || totalCentavos(-1,2).ok || totalCentavos(Number.MAX_SAFE_INTEGER,2).ok)\n  throw new Error(\"total\");\nconsole.log(JSON.stringify(bom));",
      "solutionOutput": [
        "{\"ok\":true,\"valor\":3750}"
      ],
      "bug": "parseInt aceita 12kg como 12. A função chama isso de validação de quantidade inteira, mas verifica só um prefixo. Acrescentar base dez não resolve o consumo do sufixo.",
      "bugCode": "const entrada=\"12kg\";\nconst quantidade=parseInt(entrada,10);\nif (!Number.isNaN(quantidade)) console.log(\"aceito\",quantidade);",
      "repair": "Escolha a gramática do campo e confira todos os caracteres antes de Number. Depois valide faixa e resultado. Para um contrato que aceita sufixos, modele também qual unidade o sufixo representa, em vez de ignorá-lo.",
      "checks": [
        "Zero textual é aceito e ausência ou formato inválido são rejeitados.",
        "O produto é conferido depois de calcular com entradas válidas.",
        "Explique por que parseInt não verifica o campo inteiro."
      ],
      "project": "Construa um orçamento em centavos com limite de itens. Separe a entrada textual do cálculo, preserve limite zero e gere mensagens para formato, faixa e capacidade. Documente como serializar totais se migrar para BigInt.",
      "question": "Por que Number.isFinite(total) não basta para um total de centavos exatos?",
      "answer": "Um número finito pode ser fracionário ou estar fora da faixa de inteiros seguros.",
      "distractors": [
        "Number.isFinite sempre aceita strings e não pode ser usado com números.",
        "Todo número finito é um inteiro seguro em JavaScript."
      ],
      "practices": [
        {
          "id": "default",
          "title": "Problema 1: configurar limite sem apagar zero",
          "topics": [
            "zero e operador nullish",
            "validação antes do cálculo"
          ],
          "prompt": "Crie limite(valor) para usar 10 quando valor for null ou undefined, preservar inteiros seguros de zero a cem e rejeitar o restante com uma falha explícita. Teste zero, ausência, string numérica e NaN.",
          "solution": "function limite(entrada) {\n  const valor=entrada??10;\n  return Number.isSafeInteger(valor) && valor>=0 && valor<=100\n    ? {ok:true,valor} : {ok:false,erro:\"limite\"};\n}\nif (limite(0).valor!==0 || limite(null).valor!==10 || limite(undefined).valor!==10 ||\n    limite(\"3\").ok || limite(NaN).ok) throw new Error(\"limite\");\nconsole.log(JSON.stringify(limite(0)));\nconsole.log(JSON.stringify(limite(undefined)));",
          "expectedOutput": [
            "{\"ok\":true,\"valor\":0}",
            "{\"ok\":true,\"valor\":10}"
          ],
          "explanation": [
            "?? implementa a política de ausência escolhida para os dois valores nulos. A validação depois do default mantém números de outra faixa e texto fora do domínio.",
            "O teste com zero detecta o uso acidental de ||. O consumidor usa ok para saber se há sucesso, sem depender do valor numérico ser truthy. Troque o operador por || e execute o caso zero para observar qual promessa deixa de ser atendida."
          ],
          "checks": [
            "0 é preservado.",
            "null e undefined usam o padrão.",
            "Texto e NaN falham sem coerção."
          ]
        },
        {
          "id": "identificador",
          "title": "Problema 2: preservar um identificador grande",
          "topics": [
            "BigInt e Number separados",
            "inteiros seguros",
            "Number e conversão explícita"
          ],
          "prompt": "Converta o texto 9007199254740993 diretamente para BigInt e demonstre que Number perde a distinção com 9007199254740992. Não passe primeiro por Number para obter BigInt. Serializar o identificador deve produzir string.",
          "solution": "const texto=\"9007199254740993\";\nconst exato=BigInt(texto);\nconst aproximado=Number(texto);\nif (exato.toString()!==texto || aproximado!==Number(\"9007199254740992\")) throw new Error(\"representação\");\nconst transporte=JSON.stringify({id:exato.toString()});\nconsole.log(exato.toString());\nconsole.log(transporte);",
          "expectedOutput": [
            "9007199254740993",
            "{\"id\":\"9007199254740993\"}"
          ],
          "explanation": [
            "O texto original contém a informação necessária para BigInt. A etapa intermediária por Number arredondaria o inteiro e a conversão posterior não recuperaria o dígito perdido.",
            "JSON.stringify não transporta BigInt diretamente pela regra padrão; o contrato de intercâmbio escolhe uma string decimal. O consumidor precisa conhecer essa regra em vez de supor que o campo seja um Number."
          ],
          "checks": [
            "O texto decimal é preservado exatamente.",
            "A perda em Number fica demonstrada por dois textos diferentes.",
            "O objeto serializado contém uma string, sem BigInt bruto."
          ]
        }
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
      "id": "js-closures-estado",
      "title": "JavaScript: closures, identidade e estado de uma instância",
      "level": "Fundamentos",
      "summary": "Acompanhe os ambientes léxicos que uma função conserva e separe o estado de duas instâncias. Esta aula constrói um contador com contrato, compara captura de variável com cópia de valor e explica por que const não congela um objeto. Os problemas investigam callbacks em laços e snapshots independentes, com todas as saídas previstas antes da execução.",
      "source": "https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-function-definitions",
      "topics": [
        "escopo léxico",
        "closure e binding capturado",
        "fábrica e estado por instância",
        "const e objeto mutável",
        "identidade versus cópia",
        "let em laço",
        "var e ambiente compartilhado",
        "snapshot sem referência interna"
      ],
      "sections": [
        {
          "title": "Uma função usa o ambiente em que foi criada",
          "text": [
            "O escopo léxico é determinado pela posição em que o código aparece. Uma função criada dentro de outra pode acessar variáveis do ambiente externo mesmo depois de a chamada externa terminar. Essa combinação de função e acesso ao ambiente é uma closure. O ambiente necessário permanece alcançável enquanto houver funções ou outros caminhos que dependem dele; não se trata de copiar automaticamente todos os valores no momento da criação.",
            "Se a variável externa muda antes de a closure lê-la, a função pode observar o valor novo. Para capturar um valor específico, crie um novo binding com aquele valor e preserve-o conforme o contrato. A distinção aparece em callbacks agendados, configurações e laços. Pergunte qual variável a função referencia e quando ela será lida, em vez de dizer apenas que a função guarda o número."
          ]
        },
        {
          "title": "Uma fábrica pode isolar o estado das instâncias",
          "text": [
            "Cada chamada de uma função fábrica cria seus próprios bindings locais. Duas chamadas de criarContador produzem estados separados, mesmo que os métodos retornados tenham o mesmo código. Os métodos de uma mesma chamada compartilham o binding que precisam atualizar. Essa estrutura permite oferecer uma pequena API sem expor diretamente a variável interna do contador.",
            "Isolamento de binding não exige que todos os dados sejam independentes. Se a fábrica recebe um objeto externo e guarda a mesma referência, as instâncias podem continuar compartilhando aquele objeto. Copie ou valide a representação quando o contrato exigir independência. Para um contador numérico local, o estado é um Number e a mudança fica restrita aos métodos da instância."
          ]
        },
        {
          "title": "const protege o binding, não o conteúdo",
          "text": [
            "const impede reatribuir a variável declarada, mas um objeto referenciado pode continuar mutável. const dados = { total: 0 } permite dados.total = 1. Um nome constante não estabelece um contrato de imutabilidade profunda. Object.freeze restringe alterações de propriedades próprias no objeto congelado, mas não congela automaticamente objetos internos. Entender o nível da garantia evita expor estado que uma API promete controlar.",
            "A igualdade estrita entre objetos compara identidade, não conteúdo. Dois objetos com campos iguais são referências diferentes; uma cópia rasa cria um objeto novo, mas pode conservar referências internas. Ao devolver um snapshot de estado, escolha se cada parte precisa ser copiada. Para uma lista de strings simples, copiar a lista separa a coleção; para objetos aninhados, as propriedades internas exigem uma decisão adicional."
          ]
        },
        {
          "title": "Callbacks de laço mostram qual binding é capturado",
          "text": [
            "Um for com let cria bindings adequados por iteração para closures que dependem daquela variável do laço. Um laço com var pode deixar todas as funções apontando para o mesmo binding, que ao final contém o valor terminal. Assim, três callbacks podem devolver três vezes o mesmo número. Não é um atraso de execução que escolhe um índice aleatório; é a relação entre a função e a variável capturada.",
            "Para investigar, crie as funções primeiro e só depois execute todas em ordem. Essa separação torna visível que os valores observados dependem do estado final ou do binding de cada iteração. Você também pode criar uma função auxiliar que recebe o índice e devolve uma closure; cada chamada fornece um ambiente próprio. Compare as duas correções e explique por que funcionam."
          ]
        },
        {
          "title": "Mutações precisam de condições antes da escrita",
          "text": [
            "Um contador que recebe um incremento pode exigir inteiro seguro positivo. Valide o incremento e o próximo total antes de atualizar a variável. Se a entrada falhar, o estado deve permanecer como antes. Essa pós-condição ajuda a usar a API sem precisar conhecer sua implementação. Não atualize primeiro e tente consertar depois, pois isso amplia os estados intermediários e pode perder a informação original.",
            "A closure oferece uma forma de encapsulamento, mas não fornece persistência, autenticação ou segurança geral. Quem tem os métodos ainda pode chamá-los conforme a API. O estado desaparece quando não é preservado por nenhuma referência ou mecanismo de armazenamento. Use esse recorte para estudar uma instância em memória; as aulas de persistência e arquitetura tratam a vida de dados entre recargas e diferentes componentes."
          ]
        },
        {
          "title": "Um snapshot deve corresponder à promessa da API",
          "text": [
            "Se um método retorna diretamente o array interno, o chamador pode alterá-lo sem passar pela validação da instância. Um método snapshot pode retornar uma cópia da coleção e expor somente dados aceitos. Teste isso alterando o resultado e consultando a instância novamente. A verificação compara a relação entre estado interno e saída, não apenas o conteúdo da primeira saída.",
            "Transfira o padrão para uma lista de estudos ou uma seleção de itens. Defina operações válidas, limites e o nível de cópia dos snapshots. A depuração deve listar instância, binding e objeto compartilhado. Quando ocorrer uma alteração inesperada, descubra qual referência ainda permite escrever no objeto. Esse raciocínio também ajuda a encontrar vazamentos de memória quando listeners conservam closures depois de a interface ser removida."
          ]
        }
      ],
      "code": "function criarContador(inicial=0) {\n  if (!Number.isSafeInteger(inicial) || inicial<0) throw new Error(\"inicial\");\n  let total=inicial;\n  return {\n    somar(valor) {\n      const proximo=total+valor;\n      if (!Number.isSafeInteger(valor) || valor<=0 || !Number.isSafeInteger(proximo)) return false;\n      total=proximo;\n      return true;\n    },\n    ler() {return total;}\n  };\n}\nconst a=criarContador(1),b=criarContador(10);\nif (!a.somar(2) || a.somar(-1) || a.ler()!==3 || b.ler()!==10) throw new Error(\"estado\");\nconsole.log(a.ler(),b.ler());\nlet valor=1;\nconst ler=()=>valor;\nvalor=7;\nconsole.log(ler());",
      "expectedOutput": [
        "3 10",
        "7"
      ],
      "output": "Saída: 3 10 e 7. Os contadores têm ambientes separados; a closure ler observa o binding valor depois de sua alteração.",
      "trace": [
        "Cada chamada da fábrica cria um total local.",
        "A falha de somar não modifica total; b permanece independente de a.",
        "ler conserva acesso à variável valor e não a uma cópia automática de 1."
      ],
      "exercise": "Crie uma fábrica de placar com pontos iniciais zero, adicionar(inteiro positivo) e ler(). Rejeite incrementos inválidos sem mudar o placar. Demonstre independência entre duas instâncias.",
      "solution": "function criarPlacar() {\n  let pontos=0;\n  return {\n    adicionar(valor) {\n      if (!Number.isSafeInteger(valor) || valor<=0 || !Number.isSafeInteger(pontos+valor)) return false;\n      pontos+=valor;\n      return true;\n    },\n    ler:()=>pontos\n  };\n}\nconst a=criarPlacar(),b=criarPlacar();\nif (!a.adicionar(4) || a.adicionar(0) || a.adicionar(1.5) || a.ler()!==4 || b.ler()!==0)\n  throw new Error(\"placar\");\nconsole.log(a.ler(),b.ler());",
      "solutionOutput": [
        "4 0"
      ],
      "bug": "Callbacks criados com var no laço compartilham a variável i. Quando são executados depois do laço, todos observam o valor terminal, em vez do índice da criação.",
      "bugCode": "const callbacks=[];\nfor (var i=0;i<3;i++) callbacks.push(()=>i);\nconsole.log(callbacks.map(fn=>fn())); // [3,3,3]",
      "repair": "Use let no laço ou uma fábrica que receba o índice e crie um binding por chamada. Explique qual ambiente cada callback mantém, sem atribuir o resultado a uma execução aleatória.",
      "checks": [
        "Instâncias diferentes conservam estados independentes.",
        "Incremento inválido não modifica o estado.",
        "Explique captura de binding e diferença entre const e congelamento."
      ],
      "project": "Implemente uma lista de estudos em memória com adicionar, remover e snapshot. Não devolva o array interno e documente o nível de cópia para cada item. Use duas instâncias e tente alterar um snapshot para verificar a promessa de isolamento.",
      "question": "Por que uma closure pode ler 7 depois de a variável externa ter começado em 1?",
      "answer": "Ela conserva acesso ao binding, que pode ter sido atualizado antes da leitura.",
      "distractors": [
        "Toda closure copia o primeiro valor, mas o motor altera essa cópia automaticamente.",
        "Closures só podem ler constantes e o exemplo exige erro de sintaxe."
      ],
      "practices": [
        {
          "id": "callbacks",
          "title": "Problema 1: uma função por índice",
          "topics": [
            "let em laço",
            "var e ambiente compartilhado",
            "closure e binding capturado"
          ],
          "prompt": "Construa três callbacks que, executados depois do laço, devolvam 0, 1 e 2. Use let e compare com a versão var. Não execute os callbacks durante a criação, porque isso esconderia o problema.",
          "solution": "const corretos=[],compartilhados=[];\nfor (let i=0;i<3;i++) corretos.push(()=>i);\nfor (var j=0;j<3;j++) compartilhados.push(()=>j);\nconst a=corretos.map(fn=>fn()),b=compartilhados.map(fn=>fn());\nif (JSON.stringify(a)!==\"[0,1,2]\" || JSON.stringify(b)!==\"[3,3,3]\") throw new Error(\"bindings\");\nconsole.log(JSON.stringify(a));\nconsole.log(JSON.stringify(b));",
          "expectedOutput": [
            "[0,1,2]",
            "[3,3,3]"
          ],
          "explanation": [
            "Os callbacks são executados só depois dos laços. Isso demonstra os bindings de cada iteração com let e o binding único com var.",
            "Uma função auxiliar criarLeitor(indice) também seria correta, pois cada chamada teria seu parâmetro local. A condição importante é a relação de cada closure com a variável que lê."
          ],
          "checks": [
            "A sequência let produz 0, 1 e 2.",
            "A sequência var produz 3 três vezes.",
            "Explique por que executar dentro do laço não testa o mesmo cenário."
          ]
        },
        {
          "id": "snapshot",
          "title": "Problema 2: snapshot de lista sem alias",
          "topics": [
            "snapshot sem referência interna",
            "identidade versus cópia",
            "fábrica e estado por instância"
          ],
          "prompt": "Crie uma lista de strings com adicionar e snapshot. O snapshot deve ser um array novo, e alterar esse array não pode alterar o estado da instância. Teste duas instâncias e dois snapshots da mesma instância.",
          "solution": "function criarLista() {\n  const itens=[];\n  return {\n    adicionar(texto) {\n      if (typeof texto!==\"string\" || texto.trim()===\"\") return false;\n      itens.push(texto.trim());\n      return true;\n    },\n    snapshot:()=>[...itens]\n  };\n}\nconst a=criarLista(),b=criarLista();\na.adicionar(\" HTML \");\nconst primeiro=a.snapshot(),segundo=a.snapshot();\nprimeiro.push(\"CSS\");\nif (primeiro===segundo || JSON.stringify(a.snapshot())!=='[\"HTML\"]' || b.snapshot().length!==0)\n  throw new Error(\"snapshot\");\nconsole.log(JSON.stringify(a.snapshot()));\nconsole.log(JSON.stringify(primeiro));",
          "expectedOutput": [
            "[\"HTML\"]",
            "[\"HTML\",\"CSS\"]"
          ],
          "explanation": [
            "Spread cria uma nova coleção. Os elementos são strings imutáveis, então essa cópia rasa atende ao nível de independência exigido nesta atividade.",
            "Se a API passar a armazenar objetos mutáveis, a cópia do array não separará automaticamente os objetos. Revise o contrato e acrescente um teste de alteração de campo interno antes de escolher uma estratégia de cópia."
          ],
          "checks": [
            "Alterar snapshot não altera a lista.",
            "Snapshots diferentes têm identidades diferentes.",
            "A segunda instância permanece vazia."
          ]
        }
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

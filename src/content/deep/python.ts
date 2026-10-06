import type {DeepCourse} from './types';
export default {
  "id": "python-completo",
  "title": "Python · do zero ao avançado",
  "description": "Tipos, coleções, funções, objetos, biblioteca padrão, concorrência e engenharia de projetos.",
  "icon": "file-code-2",
  "language": "python",
  "source": "https://docs.python.org/3/",
  "lessons": [
    {
      "id": "py-fundamentos",
      "title": "Python: execução, tipos e controle",
      "level": "Fundamentos",
      "summary": "Construa seu primeiro programa Python entendendo a execução do arquivo, a indentação e a relação entre nomes e objetos. Estude números, strings, booleanos, conversões, entrada e saída, decisões, repetição e os casos de limite que distinguem um programa previsível de um exemplo que só funciona com uma entrada.",
      "topics": [
        "interpretador e REPL",
        "indentação",
        "int float bool None",
        "str e Unicode",
        "conversões e entrada",
        "if elif else",
        "for range while",
        "break continue else",
        "comparação e identidade"
      ],
      "sections": [
        {
          "title": "Do arquivo ao interpretador",
          "text": [
            "O interpretador executa as instruções do módulo em ordem. Use o REPL para experimentos curtos e um arquivo .py para repetir um programa inteiro. A indentação delimita blocos; quatro espaços consistentes tornam explícito o que pertence a uma condição ou função.",
            "Um nome aponta para um objeto. Ao executar total = 3 e depois total = total + 2, o lado direito é avaliado primeiro e o nome passa a apontar para o novo resultado. Atribuir não cria uma igualdade matemática permanente."
          ]
        },
        {
          "title": "Tipos e operações numéricas",
          "text": [
            "int representa inteiros de precisão arbitrária, limitados pela memória. float usa ponto flutuante binário: 0.1 + 0.2 pode não ser exatamente 0.3. Para dinheiro, prefira centavos inteiros ou Decimal com uma política explícita de arredondamento.",
            "/ produz divisão usual; // arredonda o quociente para baixo e % devolve o resto compatível com essa divisão. bool participa de operações numéricas, mas não use esse detalhe para misturar sem explicação contadores e decisões. None representa ausência, não zero."
          ]
        },
        {
          "title": "Texto, Unicode e conversões",
          "text": [
            "str é texto Unicode imutável. len mede pontos de código, não necessariamente os símbolos visuais percebidos pelo usuário. Fatiamento cria outra string; métodos como strip e lower devolvem resultados e não modificam a string original.",
            "input sempre devolve texto. int('12') converte uma representação válida, mas int('doze') levanta ValueError. Separe leitura, conversão e validação do intervalo. f-strings formatam valores; formatar um número para exibição não muda sua precisão interna."
          ]
        },
        {
          "title": "Decisões e valores verdadeiros",
          "text": [
            "if testa a veracidade de uma expressão; listas vazias, zero, string vazia e None são falsos. Use is None quando ausência tem significado diferente de coleção vazia. and e or fazem curto-circuito e devolvem operandos, não obrigatoriamente bool.",
            "elif evita testar condições posteriores depois da primeira correspondência. Organize intervalos sem lacunas nem sobreposição indevida e teste o valor exatamente igual à fronteira. == compara valores; is compara identidade e não é uma substituição geral para ==."
          ]
        },
        {
          "title": "Repetição e progresso",
          "text": [
            "for percorre um iterável. range(3) produz 0, 1 e 2; o limite final é exclusivo. while repete enquanto a condição é verdadeira e exige que alguma ação faça o estado progredir, ou uma saída explícita.",
            "break encerra o laço e continue avança para a próxima iteração. O else de um laço executa quando ele termina sem break; não significa que o corpo nunca executou. Evite alterar uma lista enquanto a percorre quando isso modifica os índices restantes."
          ]
        },
        {
          "title": "Contratos, erros e rastreamento",
          "text": [
            "Um contrato descreve entradas aceitas, saída e falhas esperadas. Aceitar uma idade exige definir se negativos, frações ou texto inválido serão rejeitados. Um traceback mostra a sequência de chamadas e a linha que levantou a exceção.",
            "Reduza uma falha ao menor caso reproduzível. Imprima temporariamente tipo e valor nas fronteiras, depois remova o diagnóstico ou use logging. Cobrir zero, um e vários elementos revela erros que entradas comuns escondem."
          ]
        }
      ],
      "code": "def somar_positivos(valores):\n    total = 0\n    for valor in valores:\n        if valor > 0:\n            total += valor\n    return total\n\nprint(somar_positivos([-2, 0, 3, 5]))\nprint(somar_positivos([]))",
      "output": "A saída é 8 e depois 0. A lista vazia conserva o acumulador inicial; zero e números negativos não entram na soma.",
      "trace": [
        "total começa em zero em cada chamada.",
        "-2 e 0 falham na condição; 3 e 5 alteram o acumulador.",
        "return só executa depois do laço e devolve o total para print."
      ],
      "exercise": "Implemente contar_intervalo(valores, minimo, maximo), contando valores dentro dos limites inclusivos. Rejeite minimo maior que maximo com ValueError. Não leia input dentro da função.",
      "solution": "def contar_intervalo(valores, minimo, maximo):\n    if minimo > maximo:\n        raise ValueError(\"intervalo invertido\")\n    total = 0\n    for valor in valores:\n        if minimo <= valor <= maximo:\n            total += 1\n    return total\n\nassert contar_intervalo([0, 1, 2, 3], 1, 2) == 2\nassert contar_intervalo([], 1, 2) == 0",
      "bug": "range não inclui seu limite final. Percorrer range(1, n) omite n; isso muda resultados exatamente na fronteira e passa despercebido em testes que só verificam valores internos.",
      "bugCode": "n = 3\nfor numero in range(1, n):\n    print(numero)",
      "repair": "Se o contrato é listar de 1 até n inclusive, use range(1, n + 1). Para n menor que 1, decida se a lista vazia é válida ou se a função deve rejeitar a entrada.",
      "checks": [
        "Conta os dois limites inclusive e ignora valores fora deles.",
        "Retorna zero para uma coleção vazia.",
        "Rejeita o intervalo invertido e distingue essa falha de uma contagem zero."
      ],
      "project": "Crie um analisador de medições que recebe números em uma função pura, classifica cada medição e produz um resumo. Faça uma camada separada para input e print; assim os mesmos cálculos poderão ser usados depois em uma interface ou serviço.",
      "question": "Qual operação testa corretamente se um valor representa ausência?",
      "answer": "valor is None",
      "distractors": [
        "valor == 0",
        "not valor, em qualquer contrato"
      ]
    },
    {
      "id": "py-colecoes-funcoes",
      "title": "Python: coleções, funções e iteração",
      "level": "Intermediário",
      "summary": "Aprenda a escolher list, tuple, dict e set pelo contrato dos dados, escrever funções com parâmetros claros e percorrer coleções sem modificar acidentalmente seus elementos. Conecte fatiamento, comprehensions, desempacotamento, escopo, closures, iteradores e geradores a problemas de transformação e agregação.",
      "topics": [
        "list tuple dict set",
        "mutabilidade e cópia",
        "slicing e desempacotamento",
        "comprehensions",
        "parâmetros posicionais e nomeados",
        "args kwargs",
        "escopo LEGB closures",
        "iteradores e yield",
        "complexidade"
      ],
      "sections": [
        {
          "title": "Coleções são decisões de representação",
          "text": [
            "list guarda uma sequência mutável; tuple expressa uma sequência cuja estrutura não muda. Um tuple pode conter uma lista mutável, portanto imutabilidade do contêiner não congela seus elementos. dict mapeia chaves únicas a valores; set representa pertencimento sem duplicação.",
            "Dict preserva ordem de inserção, mas ordem não substitui a definição das chaves. Consultas em dict e set costumam ter custo médio constante; buscar repetidamente em uma lista tem custo linear. A escolha depende também do tamanho e das operações do problema."
          ]
        },
        {
          "title": "Cópias, fatias e aliases",
          "text": [
            "b = a cria outro nome para a mesma lista. a[:] e a.copy() copiam apenas o contêiner: listas internas continuam compartilhadas. Use uma cópia profunda somente quando o contrato exige independência recursiva e considere seu custo.",
            "Uma fatia usa início inclusivo, fim exclusivo e passo. índices negativos contam a partir do final. Desempacotar exige cardinalidade compatível, salvo o alvo com estrela, que recolhe os elementos restantes. Não oculte validação de tamanho em um erro distante."
          ]
        },
        {
          "title": "Comprehensions legíveis",
          "text": [
            "Uma comprehension descreve produzir elementos, percorrer uma origem e opcionalmente filtrar. [x * 2 for x in dados if x > 0] expressa uma transformação pura. Quando há múltiplas decisões ou efeitos, um laço explícito fica mais fácil de revisar.",
            "Comprehensions de lista materializam tudo; expressões geradoras produzem valores sob demanda. Uma dict comprehension pode sobrescrever chaves repetidas: defina a política de colisão antes de usá-la para agrupar dados."
          ]
        },
        {
          "title": "Parâmetros e valores padrão",
          "text": [
            "Parâmetros posicionais e nomeados tornam chamadas legíveis; / marca argumentos exclusivamente posicionais e * pode marcar os exclusivamente nomeados. *args recolhe uma tupla e **kwargs um dicionário; aceitar qualquer argumento sem validar apenas adia erros.",
            "Valores padrão são avaliados quando a função é definida. Uma lista usada como padrão é compartilhada entre chamadas. Use None como sentinela e crie uma lista nova no corpo, distinguindo ausência de uma coleção fornecida pelo chamador."
          ]
        },
        {
          "title": "Escopo e funções como valores",
          "text": [
            "A busca de nomes segue local, enclosing, global e builtins. Atribuir a um nome dentro da função normalmente o torna local. nonlocal permite atualizar um nome de uma função envolvente; global declara intenção de alterar o módulo.",
            "Closures capturam nomes, e a leitura ocorre quando a função é chamada. Funções criadas em um laço podem enxergar o mesmo valor final. Capture o valor por parâmetro padrão ou crie uma função fábrica quando cada callback precisa de estado próprio."
          ]
        },
        {
          "title": "Iteradores, geradores e consumo",
          "text": [
            "Um iterável fornece um iterador; next avança até StopIteration. Um gerador criado com yield suspende a execução e conserva estado entre avanços. Depois de consumido, o mesmo iterador não reinicia automaticamente.",
            "Isso permite processar arquivos grandes sem criar uma lista de todas as linhas. Entretanto, o recurso que alimenta o gerador deve permanecer aberto durante o consumo. Transformações preguiçosas podem executar e falhar bem depois do ponto onde foram construídas."
          ]
        }
      ],
      "code": "def frequencias(palavras):\n    contagem = {}\n    for palavra in palavras:\n        chave = palavra.strip().casefold()\n        if chave:\n            contagem[chave] = contagem.get(chave, 0) + 1\n    return contagem\n\nprint(frequencias([\" Sol \", \"sol\", \"\", \"Lua\"]))",
      "output": "O resultado associa sol a 2 e lua a 1. O texto vazio é descartado após normalização; casefold é apropriado para comparações sem diferença de caixa em Unicode.",
      "trace": [
        "Cada string gera uma chave nova; a lista recebida não é alterada.",
        "get fornece zero somente quando a chave ainda não existe.",
        "O dicionário acumula por chave, sem pesquisar todas as palavras anteriores."
      ],
      "exercise": "Escreva agrupar_por_tamanho(palavras), devolvendo um dicionário que associa cada comprimento a uma lista nova de palavras. Preserve a ordem de chegada dentro de cada grupo e não compartilhe listas entre grupos.",
      "solution": "def agrupar_por_tamanho(palavras):\n    grupos = {}\n    for palavra in palavras:\n        grupos.setdefault(len(palavra), []).append(palavra)\n    return grupos\n\nassert agrupar_por_tamanho([\"a\", \"bb\", \"c\"]) == {1: [\"a\", \"c\"], 2: [\"bb\"]}",
      "bug": "Um argumento padrão mutável conserva itens de chamadas anteriores. O erro fica oculto quando o teste executa a função apenas uma vez.",
      "bugCode": "def adicionar(item, destino=[]):\n    destino.append(item)\n    return destino",
      "repair": "Troque o padrão por None e, quando destino is None, atribua uma lista nova. Se o chamador fornecer uma lista, documente se a função pode modificá-la.",
      "checks": [
        "Agrupa sem perder elementos repetidos.",
        "Preserva a ordem dentro de cada comprimento.",
        "Duas chamadas independentes não compartilham estado; a entrada permanece igual."
      ],
      "project": "Construa um índice de palavras de vários textos. Separe o gerador de palavras, a normalização e a agregação. Meça o uso de memória de uma versão que materializa tudo e de uma que consome um gerador.",
      "question": "O que acontece em b = a quando a é uma lista?",
      "answer": "Os dois nomes referenciam a mesma lista.",
      "distractors": [
        "É feita uma cópia profunda.",
        "b recebe uma lista imutável."
      ]
    },
    {
      "id": "py-objetos-protocolos",
      "title": "Python: classes, protocolos e metaprogramação",
      "level": "Avançado",
      "summary": "Modele objetos por responsabilidades e contratos, usando classes, dataclasses, propriedades e composição. Entenda o sistema de atributos, métodos especiais, herança, super, protocolos, decoradores e context managers para criar APIs previsíveis, sem recorrer a mecanismos avançados quando uma função simples resolve o problema.",
      "topics": [
        "classes instâncias self",
        "dataclasses",
        "herança composição MRO super",
        "property descritores",
        "dunder repr eq hash",
        "duck typing protocolos",
        "decoradores functools.wraps",
        "context managers",
        "slots metaclasses"
      ],
      "sections": [
        {
          "title": "Estado da instância e estado da classe",
          "text": [
            "self é a referência explícita à instância recebida pelo método. Atributos criados em __init__ normalmente pertencem à instância; uma lista declarada no corpo da classe é compartilhada. Essa diferença importa quando vários objetos devem ter histórico independente.",
            "Uma dataclass pode gerar inicialização, representação e igualdade. default_factory cria coleções por instância. frozen impede atribuições usuais aos campos, mas não transforma objetos internos em imutáveis. Defina primeiro quais invariantes o objeto deve conservar."
          ]
        },
        {
          "title": "Composição, herança e resolução",
          "text": [
            "Composição delega a um colaborador; herança afirma que um objeto pode cumprir o contrato do tipo base. Sobrescrever um método para rejeitar operações que o contrato prometia pode quebrar o código cliente.",
            "super segue a ordem de resolução de métodos, MRO, e não significa simplesmente chamar a classe escrita imediatamente acima. Em herança múltipla cooperativa, assinaturas e uso consistente de super são essenciais. Prefira hierarquias pequenas e explicáveis."
          ]
        },
        {
          "title": "Atributos, propriedades e descritores",
          "text": [
            "property permite oferecer uma interface de atributo com cálculo ou validação. Evite esconder operações caras ou efeitos inesperados em uma leitura aparentemente simples. Um descritor controla acesso por __get__, __set__ ou __delete__.",
            "__slots__ pode restringir atributos e reduzir memória em cenários adequados; não é uma garantia geral de velocidade ou imutabilidade. Antes de usar uma metaclasse, avalie se um decorador de classe, __init_subclass__ ou composição atende ao mesmo contrato."
          ]
        },
        {
          "title": "Métodos especiais e identidade",
          "text": [
            "__repr__ deve ajudar no diagnóstico; __str__ na apresentação. __eq__ define igualdade por valor. Se valores iguais podem entrar em um set ou como chave de dict, seu hash precisa ser igual e permanecer estável enquanto estiverem armazenados.",
            "Objetos mutáveis com igualdade baseada em campos alteráveis geralmente não devem ser hashable. Para operadores que não reconhecem o outro operando, devolver NotImplemented permite que o protocolo tente o método correspondente do outro lado."
          ]
        },
        {
          "title": "Duck typing e contratos verificáveis",
          "text": [
            "Duck typing permite aceitar um objeto pelas operações que ele oferece. Um protocolo de typing descreve esse contrato para ferramentas estáticas; anotações não validam valores automaticamente durante a execução.",
            "Um iterador exige __iter__ e __next__; um context manager usa __enter__ e __exit__. Protocolos explícitos em fronteiras de componentes facilitam testes com colaboradores pequenos e evitam acoplar toda a aplicação a uma classe concreta."
          ]
        },
        {
          "title": "Decoradores e gestão de recursos",
          "text": [
            "Um decorador recebe uma função e devolve outra função ou objeto chamável. functools.wraps conserva metadados úteis. Preserve retorno, exceções e assinatura esperada; um decorador que engole erros pode transformar falhas em resultados aparentemente válidos.",
            "with garante a chamada de saída do context manager mesmo quando o bloco falha. __exit__ só deve suprimir a exceção quando esse comportamento fizer parte do contrato. contextlib.contextmanager permite expressar aquisição e liberação com try/finally."
          ]
        }
      ],
      "code": "from dataclasses import dataclass, field\n\n@dataclass\nclass Carrinho:\n    precos: list[int] = field(default_factory=list)\n\n    def adicionar(self, centavos: int) -> None:\n        if centavos < 0:\n            raise ValueError(\"preço negativo\")\n        self.precos.append(centavos)\n\n    @property\n    def total(self) -> int:\n        return sum(self.precos)\n\nc = Carrinho()\nc.adicionar(250)\nc.adicionar(100)\nprint(c.total)\nprint(Carrinho().total)",
      "output": "Os totais são 350 e 0. Cada carrinho recebe uma lista própria; a propriedade total calcula o resultado a partir do estado atual.",
      "trace": [
        "default_factory chama list para cada instância.",
        "adicionar rejeita um valor inválido antes de mudar estado.",
        "A propriedade não armazena uma soma que poderia ficar desatualizada."
      ],
      "exercise": "Implemente uma classe Retangulo com largura e altura não negativas e uma propriedade area somente para leitura. Escreva testes para dimensões zero e negativas. Use composição em um objeto Quadro que contém um Retangulo.",
      "solution": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Retangulo:\n    largura: float\n    altura: float\n\n    def __post_init__(self):\n        if self.largura < 0 or self.altura < 0:\n            raise ValueError(\"dimensão negativa\")\n\n    @property\n    def area(self):\n        return self.largura * self.altura\n\n@dataclass\nclass Quadro:\n    formato: Retangulo\n\nassert Quadro(Retangulo(3, 4)).formato.area == 12",
      "bug": "Uma coleção declarada como atributo de classe é compartilhada por todas as instâncias. Alterá-la por uma instância modifica o que as outras observam.",
      "bugCode": "class Carrinho:\n    itens = []\n\nprimeiro = Carrinho()\nsegundo = Carrinho()\nprimeiro.itens.append(\"livro\")\nprint(segundo.itens)",
      "repair": "Crie self.itens = [] em __init__ ou use field(default_factory=list). Faça um teste com duas instâncias; um teste isolado não detecta o compartilhamento.",
      "checks": [
        "Objetos independentes não compartilham coleções mutáveis.",
        "A construção rejeita dimensões negativas.",
        "A área reflete o contrato e a composição não exige herança artificial."
      ],
      "project": "Modele pedidos, itens e uma política de desconto recebida por composição. Use um protocolo para a política, uma dataclass para dados e um context manager para um recurso de saída. Justifique cada mecanismo usado.",
      "question": "O que uma anotação de tipo faz por si só durante a execução?",
      "answer": "Documenta o contrato; não valida automaticamente os valores.",
      "distractors": [
        "Converte toda entrada para o tipo anotado.",
        "Impede qualquer objeto de outro tipo de chegar à função."
      ]
    },
    {
      "id": "py-biblioteca-dados",
      "title": "Python: arquivos, exceções e biblioteca padrão",
      "level": "Intermediário",
      "summary": "Aprenda a trabalhar com recursos reais usando pathlib, arquivos Unicode, JSON, CSV, datas, expressões regulares e coleções especializadas. Estabeleça fronteiras de validação, trate exceções específicas e escreva arquivos com uma estratégia que não deixe resultados parciais silenciosamente.",
      "topics": [
        "pathlib arquivos encoding",
        "with e exceções",
        "JSON CSV validação",
        "datetime zoneinfo",
        "decimal fractions",
        "collections itertools functools",
        "re Unicode",
        "logging argparse",
        "os subprocess segurança"
      ],
      "sections": [
        {
          "title": "Caminhos, arquivos e codificação",
          "text": [
            "pathlib representa caminhos com operações explícitas. Um caminho relativo depende do diretório de trabalho, não necessariamente do arquivo Python. Defina a raiz da operação antes de montar subcaminhos e não confie em caminhos fornecidos pelo usuário.",
            "Abra texto com encoding explícito, normalmente utf-8, e use with para fechar o arquivo em qualquer saída. Arquivo binário produz bytes; arquivo de texto produz str. Converter entre os dois exige uma codificação e uma política para erros."
          ]
        },
        {
          "title": "Exceções como parte do contrato",
          "text": [
            "Capture a exceção mais específica que você sabe tratar. FileNotFoundError pode significar configuração ausente; PermissionError exige outra resposta. except Exception sem diagnóstico encobre defeitos e pode produzir uma saída vazia que parece sucesso.",
            "Use raise ... from erro quando traduzir a falha para preservar a causa. finally serve à liberação, não deve esconder a exceção com um return. Uma gravação crítica pode escrever em arquivo temporário na mesma área e substituir o destino após sucesso."
          ]
        },
        {
          "title": "Dados estruturados e validação",
          "text": [
            "json.loads interpreta estrutura, mas não garante o contrato da aplicação. Confira tipo do objeto, chaves obrigatórias, tipos dos campos e limites. Não use eval para ler dados: texto recebido não deve virar código.",
            "csv lida com delimitadores, aspas e quebras dentro de campos. Abra arquivos CSV com newline='' para permitir o tratamento correto pelo módulo. Converta números depois da leitura e preserve o número da linha para explicar falhas de importação."
          ]
        },
        {
          "title": "Tempo e números de domínio",
          "text": [
            "datetime sem timezone é naive e não identifica um instante universal. ZoneInfo fornece regras de fusos que podem variar por data. Guarde instantes com convenção explícita e converta para o fuso de apresentação; horário local pode ser ambíguo.",
            "Decimal construido a partir de string evita incorporar previamente um erro de float. fractions representa razões exatas. A precisão e o arredondamento pertencem ao contrato do domínio: não escolha apenas o tipo numérico e suponha que a política está resolvida."
          ]
        },
        {
          "title": "Ferramentas para transformação",
          "text": [
            "Counter conta frequências, defaultdict cria valores por chave e deque oferece operações eficientes nas pontas. itertools compõe iteração, mas funções como groupby agrupam sequências contíguas; dados não ordenados podem produzir grupos separados da mesma chave.",
            "re descreve padrões de texto, não um parser geral de estruturas aninhadas. Prefira fullmatch quando toda a entrada precisa satisfazer uma regra. Trate padrões e limites de tamanho com cuidado para evitar trabalho excessivo em entradas grandes."
          ]
        },
        {
          "title": "Programas de linha de comando",
          "text": [
            "argparse define argumentos, ajuda e erros de uso. logging separa mensagens de diagnóstico da saída de dados. Faça uma função main que devolve um código de saída e mantenha o núcleo da transformação independente do terminal.",
            "subprocess.run com uma lista de argumentos evita interpolar comandos em um shell. Não habilite shell=True para executar texto não confiável. os.environ lê configuração; não registre segredos e valide valores antes de usá-los como caminhos ou opções."
          ]
        }
      ],
      "code": "import json\nfrom decimal import Decimal\n\ntexto = '[{\"produto\":\"caderno\",\"preco\":\"12.50\",\"quantidade\":2}]'\nitens = json.loads(texto)\ntotal = Decimal(\"0\")\nfor item in itens:\n    quantidade = item[\"quantidade\"]\n    if type(quantidade) is not int or quantidade < 0:\n        raise ValueError(\"quantidade inválida\")\n    preco = Decimal(item[\"preco\"])\n    if not preco.is_finite() or preco < 0:\n        raise ValueError(\"preço inválido\")\n    total += preco * quantidade\nprint(total)",
      "output": "A saída é 25.00. A representação textual de preço entra diretamente em Decimal; uma quantidade booleana é rejeitada porque type(True) não é int.",
      "trace": [
        "JSON é interpretado como dados, sem executar expressões.",
        "Validação precede a acumulação de cada item.",
        "A regra rejeita preços negativos e valores especiais não finitos."
      ],
      "exercise": "Escreva ler_nomes(caminho), lendo JSON UTF-8 que deve ser uma lista de strings não vazias. Rejeite estruturas diferentes com ValueError, mas preserve erros de leitura do arquivo para o chamador tratar.",
      "solution": "import json\nfrom pathlib import Path\n\ndef ler_nomes(caminho):\n    dados = json.loads(Path(caminho).read_text(encoding=\"utf-8\"))\n    if not isinstance(dados, list) or any(not isinstance(x, str) or not x.strip() for x in dados):\n        raise ValueError(\"esperada lista de nomes não vazios\")\n    return [x.strip() for x in dados]",
      "bug": "JSON válido pode conter null, objetos, números ou booleanos. Acesso direto aos campos sem validar a estrutura confunde validade sintática com validade de domínio.",
      "bugCode": "import json\ndados = json.loads('{\"nomes\": null}')\nfor nome in dados[\"nomes\"]:\n    print(nome.upper())",
      "repair": "Valide o objeto externo e o tipo de nomes antes de percorrer. Uma mensagem de erro deve indicar o campo e a regra violada; não transforme silenciosamente null em uma lista vazia sem autorização do contrato.",
      "checks": [
        "Lê acentos com UTF-8 e conserva a ordem dos nomes.",
        "Rejeita null, números, strings vazias e objetos onde se espera lista.",
        "Não transforma arquivo inexistente em sucesso vazio."
      ],
      "project": "Crie um importador CSV que valida datas, quantidades e preços, gera um relatório JSON e registra falhas por linha. Use uma opção de linha de comando para o arquivo de entrada e teste com arquivos temporários.",
      "question": "json.loads garante que os dados atendem ao modelo da aplicação?",
      "answer": "Não; ele interpreta JSON, e a aplicação deve validar o contrato.",
      "distractors": [
        "Sim; qualquer JSON é um registro de domínio válido.",
        "Sim; campos ausentes recebem automaticamente valores corretos."
      ]
    },
    {
      "id": "py-concorrencia",
      "title": "Python: concorrência, async e paralelismo",
      "level": "Avançado",
      "summary": "Distinga concorrência de paralelismo e escolha entre asyncio, threads e processos pelo tipo de trabalho. Estude corrotinas, tarefas, cancelamento, limites, filas, sincronização, tratamento de falhas e o impacto do runtime, evitando supor que escrever async torna uma operação bloqueante automaticamente assíncrona.",
      "topics": [
        "concorrência versus paralelismo",
        "async await corrotinas",
        "TaskGroup cancelamento",
        "timeouts semáforos filas",
        "threads locks",
        "ProcessPoolExecutor",
        "GIL builds free-threaded",
        "backpressure",
        "falhas e recursos"
      ],
      "sections": [
        {
          "title": "Escolha pelo recurso limitado",
          "text": [
            "Concorrência organiza tarefas que podem progredir em períodos sobrepostos. Paralelismo executa trabalho simultaneamente. Esperar rede é diferente de calcular milhões de hashes: o mecanismo apropriado depende de onde o programa passa o tempo.",
            "asyncio é útil quando as operações oferecem espera cooperativa. Threads acomodam APIs bloqueantes e algumas bibliotecas nativas. Processos podem paralelizar cálculo e isolam memória, com custo de inicialização e transferência de dados. Meça antes de escolher."
          ]
        },
        {
          "title": "Corrotinas e pontos de suspensão",
          "text": [
            "Chamar uma função async cria uma corrotina; ela precisa ser aguardada ou agendada. await suspende a corrotina quando a operação ainda não terminou, permitindo que o loop execute outras tarefas. Código comum continua executando sem interrupção cooperativa.",
            "time.sleep bloqueia a thread do loop; asyncio.sleep suspende a tarefa. Um cálculo longo sem await também impede progresso das demais. Use uma API assíncrona apropriada, asyncio.to_thread para I/O bloqueante ou um executor adequado ao trabalho."
          ]
        },
        {
          "title": "Tarefas estruturadas e falhas",
          "text": [
            "TaskGroup delimita tarefas filhas e aguarda sua conclusão ao sair do bloco. Uma falha pode cancelar tarefas irmãs e aparecer em um grupo de exceções. Esse escopo evita deixar tarefas órfãs funcionando depois que a operação já terminou.",
            "gather reúne resultados, mas sua política de exceções difere. Leia o contrato escolhido e teste falha parcial. O código de limpeza deve usar try/finally e propagar cancelamento; engolir CancelledError pode quebrar encerramentos e timeouts."
          ]
        },
        {
          "title": "Limites e pressão de trabalho",
          "text": [
            "Criar uma tarefa para cada item de uma lista enorme pode consumir memória e saturar um serviço. Semáforos limitam operações simultâneas; uma Queue com capacidade limita trabalho pendente e força o produtor a esperar quando o consumidor está lento.",
            "Timeout limita uma espera, mas não desfaz efeitos externos já concluídos. Defina idempotência, política de repetição e o destino de resultados tardios. Cancelamento é um pedido cooperativo e não substitui uma transação do sistema remoto."
          ]
        },
        {
          "title": "Estado compartilhado e runtime",
          "text": [
            "Locks protegem invariantes que envolvem várias operações sobre estado compartilhado. Não deduza que uma sequência é segura só porque uma operação isolada parece atômica. Uma fila permite transferir trabalho e reduzir compartilhamento direto.",
            "Em builds tradicionais do CPython, o GIL limita a execução paralela de código Python pelas threads. Extensões podem liberar o GIL, e builds free-threaded têm propriedades diferentes. Evite transformar esse detalhe de runtime em uma regra universal sobre toda implementação Python."
          ]
        },
        {
          "title": "Processos e observação",
          "text": [
            "ProcessPoolExecutor recebe trabalhos que precisam ser serializáveis; funções no topo do módulo costumam ser a escolha segura. Proteja o ponto de entrada com if __name__ == '__main__' quando a plataforma recria processos importando o módulo.",
            "Meça tempo total, latência, memória e taxa de falhas com cargas realistas. Instrumente identificadores de tarefa e preserve causas. Concorrência que devolve dados incorretos ou perde erros não é uma otimização aceitável."
          ]
        }
      ],
      "code": "import asyncio\n\nasync def dobrar(valor, limite):\n    async with limite:\n        await asyncio.sleep(0)\n        return valor * 2\n\nasync def main():\n    limite = asyncio.Semaphore(2)\n    async with asyncio.TaskGroup() as grupo:\n        tarefas = [grupo.create_task(dobrar(x, limite)) for x in [1, 2, 3]]\n    print([t.result() for t in tarefas])\n\nasyncio.run(main())",
      "output": "A saída é [2, 4, 6]. As tarefas são concorrentes, o semáforo limita a região protegida e os resultados são apresentados na ordem da lista de tarefas.",
      "trace": [
        "TaskGroup recebe e acompanha as três tarefas.",
        "Cada tarefa adquire uma vaga e a devolve ao sair de async with.",
        "O grupo termina antes de ler result, garantindo que todas concluíram com sucesso."
      ],
      "exercise": "Implemente mapear_limitado(valores, limite) com asyncio, rejeitando limites menores que 1 e dobrando os valores com no máximo limite operações simultâneas. Preserve a ordem dos resultados.",
      "solution": "import asyncio\n\nasync def mapear_limitado(valores, limite):\n    if limite < 1:\n        raise ValueError(\"limite deve ser positivo\")\n    vagas = asyncio.Semaphore(limite)\n    async def executar(x):\n        async with vagas:\n            await asyncio.sleep(0)\n            return x * 2\n    return await asyncio.gather(*(executar(x) for x in valores))",
      "bug": "Uma chamada bloqueante dentro de async def impede o loop de atender as outras tarefas. O prefixo async só altera como a função é chamada; não reescreve bibliotecas bloqueantes.",
      "bugCode": "import asyncio\nimport time\n\nasync def esperar():\n    time.sleep(1)\n    return \"pronto\"",
      "repair": "Use await asyncio.sleep para essa espera. Para uma operação real bloqueante de I/O, avalie await asyncio.to_thread; para cálculo pesado, avalie processos. Teste duas tarefas para observar sobreposição.",
      "checks": [
        "Preserva a ordem de saída mesmo se as conclusões ocorrerem fora de ordem.",
        "Rejeita limite zero em vez de esperar indefinidamente.",
        "Propaga falhas e libera vagas também quando uma tarefa é cancelada."
      ],
      "project": "Monte um coletor de resultados de serviços simulados com atraso, erro e timeout. Limite concorrência, registre o motivo de cada falha e teste cancelamento. Não use serviços externos reais para tornar o teste determinístico.",
      "question": "Por que time.sleep dentro de uma corrotina é problemático?",
      "answer": "Ele bloqueia a thread do loop e impede outras tarefas de progredir.",
      "distractors": [
        "Porque cria automaticamente um processo por chamada.",
        "Porque async remove toda possibilidade de espera."
      ]
    },
    {
      "id": "py-engenharia",
      "title": "Python: tipagem, testes, pacotes e desempenho",
      "level": "Especialização",
      "summary": "Transforme scripts em projetos reproduzíveis, com ambientes isolados, módulos bem delimitados, anotação de tipos, testes úteis e medição de desempenho. Aprenda a documentar contratos e distribuir pacotes, relacionando ferramentas de engenharia às falhas que elas realmente conseguem detectar.",
      "topics": [
        "módulos imports __main__",
        "venv pip pyproject.toml",
        "typing Protocol Generic",
        "testes unittest mocks",
        "propriedades casos de borda",
        "profiling timeit tracemalloc",
        "algoritmos complexidade",
        "distribuição wheels",
        "documentação e evolução"
      ],
      "sections": [
        {
          "title": "Módulos e fronteiras",
          "text": [
            "Um módulo executa seu código de topo na primeira importação usual e fica em cache. Evite abrir conexão, ler input ou executar trabalho pesado ao importar uma biblioteca. O bloco __main__ permite distinguir execução direta de importação.",
            "Organize pacotes por responsabilidade e mantenha dependências em uma direção clara. Imports circulares costumam revelar fronteiras mal definidas. Um caminho alterado manualmente em sys.path pode esconder problemas de instalação; teste o pacote instalado."
          ]
        },
        {
          "title": "Ambientes e distribuição",
          "text": [
            "venv isola dependências do projeto. Use o interpretador do ambiente para executar pip e registre configuração em pyproject.toml. Distingua dependências necessárias em execução de ferramentas de desenvolvimento.",
            "Um pacote distribuído inclui código e metadados; wheel permite instalação sem reconstruir certas etapas. Teste construir e instalar em um ambiente limpo, fora do diretório do código fonte. Uma instalação editável é útil para desenvolver, mas não prova que os artefatos distribuídos estão completos."
          ]
        },
        {
          "title": "Tipos como contrato de manutenção",
          "text": [
            "Anotações como list[str], T | None e Protocol ajudam ferramentas estáticas a seguir contratos. Any suspende parte da verificação; object exige refinar o valor antes de operações específicas. Tipagem não elimina validação na entrada de dados externos.",
            "Um tipo genérico expressa relações, como receber T e devolver T. Evite anotações muito amplas que apagam a relação entre entrada e saída. Use um verificador estático e trate avisos como evidência a investigar, sem supor que um programa tipado está livre de erros lógicos."
          ]
        },
        {
          "title": "Testes e colaboradores",
          "text": [
            "Testes de unidade verificam regras isoladas; integração verifica fronteiras reais; ponta a ponta verifica um fluxo completo. Um mock deve substituir uma fronteira cara ou externa, não reproduzir a implementação que o teste pretende validar.",
            "Use unittest e arquivos temporários da biblioteca padrão quando forem suficientes. Teste falha, ausência, duplicação e limites. Uma propriedade, como ordenar não mudar a multiconjuntidade dos dados, pode revelar casos que exemplos fixos não cobrem."
          ]
        },
        {
          "title": "Desempenho com evidências",
          "text": [
            "timeit mede trechos curtos controlando repetições; cProfile ajuda a localizar onde o tempo é gasto e tracemalloc acompanha alocações Python. Meça depois de validar correção e mantenha carga e ambiente comparáveis.",
            "Melhorar a complexidade pode valer mais que uma pequena alteração sintática. Um índice de pertencimento em set pode evitar buscas repetidas em lista. Porém o índice usa memória e tem custo de construção; meça o padrão de uso real."
          ]
        },
        {
          "title": "Evolução e compatibilidade",
          "text": [
            "Documente entradas, saídas, exceções e exemplos. Mudar um detalhe de formato pode romper clientes mesmo sem mudar a assinatura. Separe API pública de funções internas e mantenha notas de migração quando o contrato muda.",
            "Uma biblioteca confiável precisa de testes da distribuição, versões suportadas e dependências verificáveis. Automatize gates proporcionais ao projeto e mantenha instruções reproduzíveis; uma ferramenta de qualidade sem uma regra clara só produz ruído."
          ]
        }
      ],
      "code": "from collections.abc import Iterable\nimport unittest\n\ndef unicos(valores: Iterable[str]) -> list[str]:\n    vistos: set[str] = set()\n    resultado: list[str] = []\n    for valor in valores:\n        if valor not in vistos:\n            vistos.add(valor)\n            resultado.append(valor)\n    return resultado\n\nclass TestUnicos(unittest.TestCase):\n    def test_ordem_e_repeticao(self):\n        self.assertEqual(unicos([\"b\", \"a\", \"b\"]), [\"b\", \"a\"])\n    def test_vazio(self):\n        self.assertEqual(unicos([]), [])\n\nif __name__ == \"__main__\":\n    unittest.main()",
      "output": "Os dois testes passam. A função conserva a primeira ocorrência e sua ordem, usando set somente para acelerar consultas de pertencimento.",
      "trace": [
        "A assinatura aceita qualquer iterável de strings.",
        "vistos e resultado são locais e novos a cada chamada.",
        "O teste vazio verifica a identidade da transformação e o outro verifica ordem e duplicação."
      ],
      "exercise": "Crie uma função media que recebe uma sequência não vazia de números, rejeita sequência vazia com ValueError e tem testes para um valor, vários valores e valores negativos. Defina como seu contrato trata valores não finitos.",
      "solution": "import math\nimport unittest\n\ndef media(valores):\n    dados = list(valores)\n    if not dados or any(not math.isfinite(x) for x in dados):\n        raise ValueError(\"esperados números finitos em coleção não vazia\")\n    return math.fsum(dados) / len(dados)\n\nclass TestMedia(unittest.TestCase):\n    def test_resultados(self):\n        self.assertEqual(media([4]), 4)\n        self.assertAlmostEqual(media([-2, 4]), 1)\n    def test_vazia(self):\n        with self.assertRaises(ValueError):\n            media([])",
      "bug": "Um teste que chama a mesma função para calcular resultado real e esperado pode confirmar qualquer defeito da implementação. O oráculo deve vir de uma regra independente.",
      "bugCode": "resultado = media([2, 4])\nesperado = media([2, 4])\nassert resultado == esperado",
      "repair": "Use um resultado conhecido, 3, e casos de borda definidos pelo contrato. Para números de ponto flutuante, compare com uma tolerância adequada quando a operação não produz um valor exato.",
      "checks": [
        "Testes expressam resultados independentes da implementação.",
        "O pacote pode ser importado sem iniciar interação ou trabalho externo.",
        "O desempenho é medido mantendo correção e carga comparáveis."
      ],
      "project": "Empacote o analisador criado nas aulas anteriores com pyproject.toml, uma API pequena, testes e uma CLI. Instale a distribuição em um ambiente novo, execute os testes e produza um perfil antes de otimizar.",
      "question": "Qual teste oferece um oráculo independente para media([2, 4])?",
      "answer": "Comparar o resultado com 3, calculado a partir do contrato.",
      "distractors": [
        "Comparar a chamada com outra chamada idêntica.",
        "Verificar apenas que a função não levantou exceção."
      ]
    }
  ]
} satisfies DeepCourse;

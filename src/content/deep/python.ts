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
      "id": "py-numeros-texto",
      "title": "Python: números exatos, texto e conversão de entrada",
      "level": "Fundamentos",
      "summary": "Aprenda a escolher uma representação para quantidades, preços e texto antes de escrever cálculos. Esta aula separa o dado recebido, a validação do contrato e o resultado formatado. Você vai investigar divisão, restos, aproximação binária, Unicode e entradas inválidas, com programas completos que não dependem de interação no terminal.",
      "source": "https://docs.python.org/3/library/stdtypes.html",
      "topics": [
        "int e limites de representação",
        "divisão real e divisão pelo piso",
        "resto e distribuição de unidades",
        "float e erro de representação",
        "Decimal construído de texto",
        "str e pontos de código Unicode",
        "normalização NFC",
        "conversão integral estrita"
      ],
      "sections": [
        {
          "title": "Representação é uma decisão do problema",
          "text": [
            "Uma quantidade de ingressos pertence aos inteiros: não existe meia unidade nesse contrato. Em Python, int cresce conforme a magnitude do número, limitado pela memória disponível, sem o estouro de largura fixa de um int de 32 bits. Isso não torna qualquer cálculo barato: multiplicar números enormes exige mais trabalho e espaço. A escolha de int resolve a exatidão de unidades discretas, mas não a complexidade do algoritmo.",
            "Já uma medida física pode aceitar aproximação e um preço pode exigir regras decimais. Escreva primeiro a unidade do valor: centavos, reais, segundos ou metros. Somar 150 centavos a 2 reais sem conversão mistura representações. Manter a unidade no nome, como total_centavos, ajuda a revisar o cálculo. Só depois de concluir a operação transforme a representação interna em texto para apresentação."
          ]
        },
        {
          "title": "Divisão, piso e resto têm contratos diferentes",
          "text": [
            "O operador / produz divisão real; mesmo 6 / 3 resulta em float. O operador // calcula o piso do quociente, arredondando para menos infinito, e % fornece um resto consistente com a identidade a == (a // b) * b + a % b. Para divisor positivo, o resto é não negativo. Assim, -7 // 3 é -3 e -7 % 3 é 2. Essa regra difere de truncar em direção a zero e importa ao portar algoritmos de outras linguagens.",
            "Use divmod(total, pessoas) para obter simultaneamente a cota inteira e as unidades restantes. Se repartir 10 unidades entre 3 pessoas, cada uma recebe inicialmente 3 e sobra 1; a primeira recebe uma unidade adicional. Exija total não negativo e quantidade de pessoas positiva antes da divisão. Um divisor zero é uma entrada inválida do domínio, e não uma situação para esconder devolvendo zero."
          ]
        },
        {
          "title": "Aproximação não desaparece na formatação",
          "text": [
            "O float representa números em base binária com precisão finita. Algumas frações decimais, como 0.1, precisam de expansão infinita nessa base. Por isso 0.1 + 0.2 pode não ser exatamente 0.3. Imprimir com duas casas altera a apresentação, sem substituir o valor armazenado por uma representação decimal exata. Evite explicar esse comportamento como um defeito da soma ou recomendar uma tolerância arbitrária para qualquer contexto.",
            "Para medidas aproximadas, math.isclose permite definir tolerância relativa e absoluta conforme o problema. Perto de zero, uma tolerância absoluta pode ser necessária. Para valores decimais de entrada, Decimal('0.10') começa com o decimal pretendido; Decimal(0.1) começa com a aproximação do float. Decimal também tem contexto de precisão e operações que arredondam. Valores monetários exigem ainda uma política explícita para o ponto e o modo de arredondamento."
          ]
        },
        {
          "title": "Texto tem codificação, conteúdo e forma visual",
          "text": [
            "Uma str é uma sequência de pontos de código Unicode, imutável. len não mede bytes nem, em geral, caracteres percebidos pela pessoa. Um e seguido de acento combinante ocupa dois pontos de código, enquanto é pré-composto ocupa um. encode('utf-8') produz bytes para um arquivo ou rede; decode faz a operação inversa. Não corte bytes de uma sequência UTF-8 no meio de uma unidade de codificação.",
            "unicodedata.normalize('NFC', texto) pode colocar formas canonicamente equivalentes numa representação comum. Isso é útil ao comparar nomes recebidos de origens diferentes. Não remova acentos, espaços internos ou diferenças de caixa automaticamente sem uma regra do produto: códigos, senhas e nomes podem tratar essas diferenças como significativas. Nesta aula, os identificadores da atividade aceitam apenas dígitos ASCII, embora a linguagem tenha suporte muito maior a Unicode."
          ]
        },
        {
          "title": "Converter também é validar uma fronteira",
          "text": [
            "Uma entrada de arquivo ou formulário chega como texto. int('12') converte o conteúdo para um inteiro, mas int('12.5') lança ValueError. O conversor admite formas que seu domínio talvez não queira aceitar, como espaços e certos dígitos Unicode. Para um campo de quantidade decimal sem sinal, verifique explicitamente que ele contém pelo menos um caractere e que todos estão entre '0' e '9', depois converta. Não use uma comparação de string para decidir se a quantidade excede dez.",
            "Separar validação sintática e semântica facilita mensagens de erro. Primeiro verifique a gramática do campo; depois a faixa permitida, como 0 até 500. Um texto pode ser um inteiro válido e ainda ser uma quantidade proibida. Também limite o tamanho do campo quando os dados vierem de fora: a capacidade de int representar magnitudes grandes não exige aceitar um número com milhões de dígitos."
          ]
        },
        {
          "title": "Depure a unidade antes do operador",
          "text": [
            "Para investigar um resultado inesperado, registre repr da entrada, type do valor convertido e a unidade usada em cada operação. Uma string vazia, uma string com espaço e uma string com zero parecem semelhantes numa interface, mas têm contratos diferentes. Monte uma tabela com entrada, classificação, valor interno e saída esperada. A tabela permite localizar se a falha está no recebimento, na conversão, no cálculo ou na apresentação.",
            "Nesta aula, todos os programas usam dados fixos e assert para serem reproduzíveis. Esses asserts verificam a solução de estudo; um programa de produção não deve depender de assert para validar entrada externa, pois a execução otimizada pode removê-los. Transfira a regra para um formulário de orçamento ou importador CSV, preservando a distinção entre dado ausente, texto inválido e quantidade zero."
          ]
        }
      ],
      "code": "from decimal import Decimal\nfrom unicodedata import normalize\n\ntotal_centavos = 1000\npessoas = 3\ncota, resto = divmod(total_centavos, pessoas)\nparcelas = [cota + (1 if i < resto else 0) for i in range(pessoas)]\nassert parcelas == [334, 333, 333]\nassert sum(parcelas) == total_centavos\nprint(parcelas)\npreco = Decimal(\"0.10\") + Decimal(\"0.20\")\nassert preco == Decimal(\"0.30\")\nprint(f\"{preco:.2f}\")\nnome = normalize(\"NFC\", \"Cafe\\u0301\")\nassert nome == \"Café\"\nprint(nome)",
      "output": "Saída: [334, 333, 333], depois 0.30 e Café, em linhas separadas. A soma das parcelas conserva os 1000 centavos.",
      "expectedOutput": [
        "[334, 333, 333]",
        "0.30",
        "Café"
      ],
      "trace": [
        "divmod separa 1000 em três cotas de 333 e uma unidade restante.",
        "A primeira parcela recebe a sobra; nenhuma conversão para float participa da distribuição.",
        "Decimal recebe strings; a normalização transforma a sequência e + acento em é."
      ],
      "exercise": "Distribua 17 unidades entre 5 pessoas em uma lista. A diferença entre duas parcelas não pode ultrapassar uma unidade; conserve a soma e coloque as parcelas maiores primeiro. Repita para total zero.",
      "solution": "def distribuir(total, pessoas):\n    if total < 0 or pessoas <= 0:\n        raise ValueError(\"total não negativo e pessoas positivas\")\n    cota, resto = divmod(total, pessoas)\n    resultado = []\n    for indice in range(pessoas):\n        resultado.append(cota + (1 if indice < resto else 0))\n    return resultado\n\nassert distribuir(17, 5) == [4, 4, 3, 3, 3]\nassert distribuir(0, 3) == [0, 0, 0]\nassert sum(distribuir(17, 5)) == 17\nprint(distribuir(17, 5))",
      "solutionOutput": [
        "[4, 4, 3, 3, 3]"
      ],
      "bug": "Um programa divide 1000 centavos por três e arredonda cada parcela de forma independente. O total recebido deixa de ser garantido. Explique por que a representação e a distribuição da sobra pertencem ao contrato, antes de ajustar a formatação.",
      "bugCode": "total = 1000\nparcelas = [round(total / 3) for _ in range(3)]\nprint(parcelas, sum(parcelas))  # 999, não 1000",
      "repair": "Calcule cota e resto inteiros e distribua uma unidade adicional exatamente resto vezes. Verifique a soma e a diferença máxima entre parcelas; escrever .2f não recupera uma unidade perdida.",
      "checks": [
        "17 / 5 produz [4, 4, 3, 3, 3] e conserva a soma.",
        "Zero total produz cinco parcelas zero; quantidade de pessoas zero gera erro explícito.",
        "Explique por que // com negativos não significa truncar em direção a zero."
      ],
      "project": "Crie um repartidor de despesas em centavos. Receba uma quantidade ASCII e um número de participantes, preserve a soma, explique quem recebe a sobra e apresente o resultado em reais. Documente como tratar centavos negativos e por que a regra atual os rejeita.",
      "question": "Por que Decimal('0.1') é preferível a Decimal(0.1) quando a entrada pretendida é um decimal exato?",
      "answer": "A string preserva o decimal pretendido; o float já contém uma aproximação binária.",
      "distractors": [
        "Decimal construído de float sempre arredonda automaticamente para duas casas.",
        "Strings só mudam a apresentação; ambas as construções armazenam exatamente o mesmo valor."
      ],
      "practices": [
        {
          "id": "quantidade",
          "title": "Problema 1: quantidade recebida como texto",
          "topics": [
            "conversão integral estrita"
          ],
          "prompt": "Implemente quantidade(texto) para aceitar somente de 1 a 3 dígitos ASCII, inclusive zero, com valor máximo 500. Rejeite vazio, espaço, sinal, decimal, dígitos de outro alfabeto e 501. Use ValueError para falhas; não converta texto inválido em zero.",
          "solution": "def quantidade(texto):\n    if not 1 <= len(texto) <= 3 or any(c < \"0\" or c > \"9\" for c in texto):\n        raise ValueError(\"use de 1 a 3 dígitos ASCII\")\n    valor = int(texto)\n    if valor > 500:\n        raise ValueError(\"máximo 500\")\n    return valor\n\nassert quantidade(\"0\") == 0\nassert quantidade(\"050\") == 50\nassert quantidade(\"500\") == 500\nfor invalido in [\"\", \" 1\", \"-1\", \"1.0\", \"１２\", \"501\", \"0000\"]:\n    try:\n        quantidade(invalido)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError(invalido)\nprint(\"quantidades verificadas\")",
          "expectedOutput": [
            "quantidades verificadas"
          ],
          "explanation": [
            "A gramática é conferida antes de int: esse conversor sozinho aceita entradas que o contrato não permite. O limite de comprimento controla também o custo da conversão.",
            "Zero é um valor válido. O laço usa o ramo else do try para detectar uma entrada inválida que tenha sido aceita sem exceção. A validação de faixa continua separada da validação dos caracteres."
          ],
          "checks": [
            "Aceite 0, 050 e 500.",
            "Rejeite todas as sete entradas inválidas com ValueError.",
            "Mude o limite para 999 e identifique qual teste deve mudar."
          ]
        },
        {
          "id": "unicode",
          "title": "Problema 2: comparar nomes canonicamente equivalentes",
          "topics": [
            "str e pontos de código Unicode",
            "normalização NFC"
          ],
          "prompt": "Compare Café e Cafe seguido de U+0301 após normalização NFC, mantendo maiúsculas e minúsculas distintas. Demonstre comprimentos antes e depois e mostre que codificar em UTF-8 mede bytes, sem confundir essa contagem com len da string.",
          "solution": "from unicodedata import normalize\n\na = \"Café\"\nb = \"Cafe\\u0301\"\nassert a != b and len(a) == 4 and len(b) == 5\nnormalizado = normalize(\"NFC\", b)\nassert normalizado == a and len(normalizado) == 4\nassert normalize(\"NFC\", \"café\") != a\nassert len(a.encode(\"utf-8\")) == 5\nprint(len(a), len(b), len(normalizado), len(a.encode(\"utf-8\")))",
          "expectedOutput": [
            "4 5 4 5"
          ],
          "explanation": [
            "A aparência semelhante não garante sequências de pontos de código iguais. NFC trata equivalência canônica; não é uma regra de remoção de acentos ou comparação sem distinguir caixa.",
            "O exemplo torna visíveis três medidas: pontos de código originais, pontos após normalização e bytes UTF-8. Para limitar caracteres percebidos em uma interface seria necessário segmentar grafemas, assunto além deste contrato."
          ],
          "checks": [
            "A comparação bruta é falsa e a comparação normalizada é verdadeira.",
            "Café e café continuam diferentes.",
            "Explique por que cinco bytes não significam cinco letras."
          ]
        }
      ]
    },
    {
      "id": "py-controle-invariantes",
      "title": "Python: decisões, laços e prova de término",
      "level": "Fundamentos",
      "summary": "Construa decisões e repetições que você consiga explicar antes de executá-las. Esta aula usa intervalos, acumuladores, busca e sentinelas para mostrar como um laço preserva uma regra e como seu estado avança até terminar. As atividades incluem entrada vazia, ausência de resultado e um limite exato, sem depender de um while infinito para ensinar repetição.",
      "source": "https://docs.python.org/3/tutorial/controlflow.html",
      "topics": [
        "if elif e ordem das condições",
        "intervalos semiabertos",
        "range com passo",
        "acumulador e invariante",
        "while e variante de término",
        "break continue e else de laço",
        "busca sem resultado",
        "lista vazia e casos de fronteira"
      ],
      "sections": [
        {
          "title": "Decisões expressam partições do domínio",
          "text": [
            "Uma cadeia if, elif, else executa somente o primeiro ramo cuja condição seja verdadeira. Por isso a ordem das condições participa da regra. Ao classificar nota como excelente a partir de 90 e aprovada a partir de 60, testar >= 60 primeiro captura também a nota 95. Escreva intervalos disjuntos em papel e escolha se vai começar pelo maior ou pelo menor limite. Cada valor válido deve cair em exatamente uma categoria.",
            "Valide o domínio antes de classificar. Uma nota -1 ou 101 não deve receber uma categoria normal. Não confunda duas instruções if independentes com uma cadeia: na primeira forma os dois blocos podem executar. Quando condições têm efeitos, como consumir uma entrada, repeti-las altera ainda o estado observado. Prefira condições claras e dados já recebidos para que a classificação seja uma função previsível da entrada."
          ]
        },
        {
          "title": "Limites ficam mais simples quando o fim é excluído",
          "text": [
            "range(inicio, fim, passo) produz valores até antes de fim. range(2, 8, 2) visita 2, 4 e 6. O fim excluído combina com índices: para uma sequência de tamanho n, os índices válidos são de zero até n - 1. Um intervalo semiaberto [a, b) contém b - a inteiros quando o passo é um e b é maior ou igual a a. Essa relação facilita conferir quantidade sem listar cada valor.",
            "Um passo negativo exige um início maior que o fim para produzir valores na direção pretendida. range(3, -1, -1) inclui zero, mas range(3, 0, -1) termina em um. Um passo zero é inválido. Antes de executar uma repetição numérica, anote o primeiro valor, o último possível e a quantidade esperada. Essa previsão encontra muitos erros de um elemento a mais ou a menos sem precisar de um depurador."
          ]
        },
        {
          "title": "Um acumulador precisa de estado inicial correto",
          "text": [
            "Para somar valores, comece com total = 0. Antes de processar o elemento de índice i, a invariante pode ser: total é a soma dos elementos anteriores a i. O passo total += valor estende a propriedade para o próximo elemento. Quando o laço acaba, todos os elementos foram processados e a invariante implica o resultado desejado. Isso é uma explicação da correção, não apenas uma descrição de cada linha.",
            "O valor inicial também define o caso vazio. A soma vazia é zero nesse contrato; a média vazia não existe sem uma regra adicional. Para encontrar o maior valor, começar em zero falha se todos os valores forem negativos. Você pode inicializar pelo primeiro item depois de conferir se há dados, ou manter um estado de ausência. Escolha o comportamento do vazio explicitamente em vez de deixar uma exceção acidental estabelecer a interface."
          ]
        },
        {
          "title": "Término exige um estado que avance",
          "text": [
            "Um while reavalia a condição antes de cada passagem. Para provar que termina, identifique uma quantidade inteira não negativa que diminui em todo passo relevante. Se restante começa em cinco e cada iteração subtrai um, ele alcança zero. Se um continue pula a atualização, essa prova deixa de valer. A palavra continue não avança automaticamente o contador de um while escrito manualmente.",
            "Não existe prova de término baseada apenas em a condição parece correta. Pergunte quais ramos atualizam o estado, quais podem voltar sem alteração e o que acontece se a entrada nunca chegar. Em processos com espera externa, término pode depender de cancelamento ou limite de tentativas. Nos programas desta aula todos os dados são finitos; esse recorte permite estudar correção sem misturar espera de rede ou terminal."
          ]
        },
        {
          "title": "Busca distingue encontrado, ausente e interrompido",
          "text": [
            "break encerra o laço mais interno. Um else associado ao for ou while executa se o laço chega ao fim sem break, incluindo um for sobre uma sequência vazia. Ele pode expressar que uma busca esgotou os candidatos. Esse else não pertence ao if anterior e não significa a condição do if foi falsa uma vez. A indentação deixa claro a qual estrutura ele está ligado.",
            "Evite usar zero como sinal de ausência quando o resultado pode ser zero. None permite distinguir não encontrado de índice zero. Se você retorna cedo de uma função, o resultado encontrado pode sair diretamente e um return None depois do laço cobre a ausência. Em uma busca com filtro, continue ignora apenas o candidato atual; a busca ainda precisa visitar os seguintes e manter seu contrato de retorno."
          ]
        },
        {
          "title": "Casos pequenos permitem revisar a regra inteira",
          "text": [
            "Para testar um laço, comece com nenhum elemento, um elemento, limite exato, todos aceitos e todos rejeitados. Depois use uma mistura em que o primeiro e o último têm papéis diferentes. Um teste com dez valores parecidos pode passar sem revelar que o último nunca foi visitado. Uma lista contendo só um elemento no limite força o programa a decidir exatamente a fronteira que você quer investigar.",
            "Ao depurar, monte colunas para posição, valor, estado antes e estado depois. Compare cada mudança com a invariante. Uma soma incorreta pode nascer de reinicializar o acumulador dentro do laço, de somar antes de filtrar ou de interromper cedo. Transfira esse método para processamento de registros e paginação: a regra preservada deve incluir tanto o resultado parcial quanto quais entradas já foram consumidas."
          ]
        }
      ],
      "code": "valores = [4, -2, 7, 0, 3]\ntotal = 0\naceitos = 0\nfor valor in valores:\n    if valor < 0:\n        continue\n    total += valor\n    aceitos += 1\nassert total == 14 and aceitos == 4\nprint(total, aceitos)\nfor indice, valor in enumerate(valores):\n    if valor >= 7:\n        print(\"primeiro\", indice)\n        break\nelse:\n    print(\"ausente\")",
      "expectedOutput": [
        "14 4",
        "primeiro 2"
      ],
      "output": "Saída: 14 4 e primeiro 2. Zero conta como aceito; -2 é ignorado; a busca encerra na primeira ocorrência que satisfaz >= 7.",
      "trace": [
        "O acumulador começa no elemento neutro zero e só muda para valores não negativos.",
        "O continue ignora -2, mas não exclui zero da contagem.",
        "A busca visita índices 0, 1 e 2; break evita o ramo else."
      ],
      "exercise": "Some todos os inteiros de um intervalo semiaberto [inicio, fim) usando range e um acumulador. Retorne zero para intervalo vazio e rejeite fim menor que inicio. Demonstre os casos [2, 5), [0, 0) e [-2, 2).",
      "solution": "def soma_intervalo(inicio, fim):\n    if fim < inicio:\n        raise ValueError(\"fim anterior ao início\")\n    total = 0\n    for numero in range(inicio, fim):\n        total += numero\n    return total\n\nassert soma_intervalo(2, 5) == 9\nassert soma_intervalo(0, 0) == 0\nassert soma_intervalo(-2, 2) == -2\nprint(soma_intervalo(2, 5), soma_intervalo(0, 0), soma_intervalo(-2, 2))",
      "solutionOutput": [
        "9 0 -2"
      ],
      "bug": "A classificação testa aprovação antes de excelência. A nota 95 nunca alcança o ramo excelente, embora o programa execute sem erro. Localize o problema na partição do domínio e proponha uma ordem que atenda também às notas 59, 60, 89 e 90.",
      "bugCode": "nota = 95\nif nota >= 60:\n    categoria = \"aprovada\"\nelif nota >= 90:\n    categoria = \"excelente\"\nelse:\n    categoria = \"rever\"\nprint(categoria)",
      "repair": "Valide 0 <= nota <= 100 e teste >= 90 antes de >= 60. Outra opção é testar < 60, depois < 90, depois else. As duas ordens funcionam porque cada ramo passa a cobrir uma faixa bem definida.",
      "checks": [
        "O fim de range fica excluído e a lista vazia conserva o acumulador.",
        "Explique a invariante e mostre como cada iteração a preserva.",
        "Encontre a diferença entre resultado zero e ausência de resultado."
      ],
      "project": "Implemente um relatório de leituras de temperatura: conte leituras válidas, some valores e localize a primeira que ultrapassa um limite. Defina comportamento para lista vazia e use uma tabela de rastreamento para justificar a saída de uma sequência com negativos, zero e limites exatos.",
      "question": "Quando o else de um for é executado?",
      "answer": "Quando o laço termina sem executar break, inclusive quando não há elementos.",
      "distractors": [
        "Sempre depois de executar break no primeiro elemento.",
        "Quando o último if dentro do laço avalia como falso, independentemente de break."
      ],
      "practices": [
        {
          "id": "busca",
          "title": "Problema 1: primeira posição que atende ao limite",
          "topics": [
            "busca sem resultado",
            "lista vazia e casos de fronteira"
          ],
          "prompt": "Escreva primeira_posicao(valores, limite), retornando o primeiro índice com valor >= limite ou None quando não houver. Mostre que encontrar no índice zero não é ausência e que a lista vazia é tratada sem acesso fora da faixa.",
          "solution": "def primeira_posicao(valores, limite):\n    for indice, valor in enumerate(valores):\n        if valor >= limite:\n            return indice\n    return None\n\nassert primeira_posicao([8, 9], 8) == 0\nassert primeira_posicao([1, 3, 7], 7) == 2\nassert primeira_posicao([1, 3], 7) is None\nassert primeira_posicao([], 7) is None\nprint(primeira_posicao([8, 9], 8), primeira_posicao([], 7))",
          "expectedOutput": [
            "0 None"
          ],
          "explanation": [
            "enumerate entrega o índice junto do valor. Retornar imediatamente preserva a regra de primeira ocorrência; continuar procurando poderia trocar o resultado pelo último índice.",
            "O return depois do laço cobre tanto a lista vazia quanto o esgotamento sem correspondência. None permite um teste is None explícito, sem confundir o índice zero com ausência. O programa não usa break; compare sua estrutura com for/else do exemplo."
          ],
          "checks": [
            "Índice zero é encontrado corretamente.",
            "Limite exato é aceito e ausência retorna None.",
            "Reescreva com for/else mantendo os quatro resultados."
          ]
        },
        {
          "id": "parcelas",
          "title": "Problema 2: término de uma contagem de parcelas",
          "topics": [
            "while e variante de término",
            "acumulador e invariante"
          ],
          "prompt": "Conte quantas parcelas de no máximo 4 unidades são necessárias para consumir um total inteiro não negativo. Use while, diminua restante em todo passo e devolva zero para total zero. Documente a variante de término e rejeite total negativo.",
          "solution": "def numero_parcelas(total):\n    if total < 0:\n        raise ValueError(\"total não negativo\")\n    restante = total\n    parcelas = 0\n    while restante > 0:\n        consumido = min(4, restante)\n        restante -= consumido\n        parcelas += 1\n    return parcelas\n\nassert numero_parcelas(0) == 0\nassert numero_parcelas(4) == 1\nassert numero_parcelas(9) == 3\nprint(numero_parcelas(0), numero_parcelas(4), numero_parcelas(9))",
          "expectedOutput": [
            "0 1 3"
          ],
          "explanation": [
            "restante é a variante: inteira, não negativa e estritamente menor depois de cada iteração, pois consumido é positivo enquanto restante > 0. Assim o laço termina.",
            "A invariante relaciona restante às unidades ainda não consumidas e parcelas ao número de retiradas feitas. min evita tornar restante negativo. Se trocar 4 por uma parcela configurável, valide que ela é positiva antes de iniciar o while."
          ],
          "checks": [
            "0, 4 e 9 exigem respectivamente 0, 1 e 3 parcelas.",
            "O estado avança em todas as iterações.",
            "Explique por que uma parcela configurada como zero impede término."
          ]
        }
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
      "id": "py-funcoes-contratos",
      "title": "Python: parâmetros, escopo e funções com contratos",
      "level": "Intermediário",
      "summary": "Leia uma função como um acordo entre entrada, resultado e efeitos. Você vai escolher parâmetros posicionais ou nomeados, evitar defaults mutáveis compartilhados, compreender LEGB e produzir uma closure com estado próprio. Os problemas verificam independência entre chamadas e preservação dos dados de entrada, incluindo testes que expõem erros que uma única execução esconderia.",
      "source": "https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions",
      "topics": [
        "contrato de entrada e retorno",
        "parâmetros nomeados e keyword-only",
        "default avaliado na definição",
        "sentinela None para default mutável",
        "escopo LEGB",
        "nonlocal e binding externo",
        "closure por chamada",
        "retorno novo sem modificar entrada"
      ],
      "sections": [
        {
          "title": "Uma função organiza um contrato verificável",
          "text": [
            "Uma função não é apenas um bloco que evita repetição. Ela estabelece o que recebe, o que devolve e quais efeitos pode produzir. Se calcular_total recebe preços, seu contrato precisa dizer a unidade, se aceita uma sequência vazia e se pode modificar a coleção. Escrever essas regras antes do corpo permite avaliar duas implementações diferentes pela mesma expectativa, sem depender dos nomes de variáveis internos.",
            "Uma docstring pode registrar o contrato perto da implementação, mas texto não aplica regras por si só. Valide o que vem de uma fronteira externa e teste os casos que definem o domínio. Nesta aula algumas funções assumem inteiros fornecidos por quem chama, enquanto outras conferem explicitamente a representação. Distinguir pré-condição de validação executada evita afirmar uma garantia que o código não oferece."
          ]
        },
        {
          "title": "A assinatura orienta como chamar a operação",
          "text": [
            "Parâmetros podem receber argumentos por posição ou por nome conforme a assinatura. Um asterisco antes de certo parâmetro pode torná-lo keyword-only, exigindo que a chamada explicite seu nome. Isso é útil para opções cujo significado não é claro numa lista de valores, como desconto ou incluir_cancelados. Um contrato bem escolhido reduz a chance de trocar dois argumentos que têm o mesmo tipo.",
            "Use valores padrão para regras estáveis e documentadas, não para esconder dados obrigatórios ausentes. Um parâmetro opcional precisa ter um comportamento definido. Args e kwargs ampliam a flexibilidade, mas podem deixar a interface menos visível quando usados sem necessidade. Prefira uma assinatura explícita para o problema atual e acrescente flexibilidade quando houver uma relação concreta entre as chamadas que precisa suportar."
          ]
        },
        {
          "title": "Defaults são avaliados quando a função é definida",
          "text": [
            "Um objeto usado como valor padrão é criado na avaliação da definição, não novamente a cada chamada. Assim def adicionar(item, lista=[]) pode compartilhar a mesma lista entre chamadas que omitem o argumento. A primeira execução parece correta; a segunda revela dados de uma chamada anterior. Isso não significa que toda lista seja global: significa que o default é um objeto alcançado pela função.",
            "Use None como sentinela e crie uma lista dentro do corpo quando o argumento não foi fornecido. Se None também for um valor legítimo do domínio e precisar ser distinguido de ausência, use uma sentinela própria. Outra decisão é exigir a coleção explicitamente. A escolha depende do contrato de efeitos: receber uma lista pode autorizar modificá-la ou pode exigir produzir um resultado novo."
          ]
        },
        {
          "title": "Escopo procura nomes e não copia valores",
          "text": [
            "A resolução usual de nomes envolve ambiente local, ambientes de funções externas, módulo global e builtins, frequentemente resumida como LEGB. Uma atribuição a um nome dentro do corpo normalmente o torna local naquele escopo, o que pode impedir uma leitura anterior do nome externo e gerar UnboundLocalError. Não é necessário usar global para qualquer função que consulta um dado do módulo; leitura e atribuição são operações distintas.",
            "nonlocal permite reatribuir um binding existente no escopo de uma função externa. Ele não cria uma variável de módulo e não mantém uma cópia do valor inicial. Uma closure que lê o binding observa suas alterações conforme o fluxo. No exemplo de acumulador, nonlocal deixa os métodos de uma mesma instância atualizarem total, enquanto chamadas diferentes da fábrica têm seus próprios bindings."
          ]
        },
        {
          "title": "Estado independente depende dos objetos compartilhados",
          "text": [
            "Cada chamada da fábrica pode criar um ambiente novo, mas um objeto recebido de fora pode continuar compartilhado. Se duas instâncias guardam a mesma lista, alterações nessa lista atravessam a separação dos bindings. Copiar a coleção separa o contêiner, mas pode continuar compartilhando elementos mutáveis internos. Documente o nível de independência necessário e teste uma alteração que o exponha.",
            "Uma função que promete não modificar entrada deve construir outro resultado ou operar apenas com leitura. Para uma lista de inteiros, uma cópia rasa atende à separação de elementos necessária porque os inteiros são imutáveis. Para uma árvore de objetos mutáveis, a estratégia precisa ser revista. Não faça deepcopy automaticamente para qualquer situação: cópias podem ter custo e significados que o domínio não deseja."
          ]
        },
        {
          "title": "Repetir chamadas é um caso de teste essencial",
          "text": [
            "Teste uma função com default mutável pelo menos duas vezes sem fornecer o argumento. Teste também uma lista fornecida explicitamente e confira a política de preservação ou mutação. Para uma fábrica, crie duas instâncias e intercale chamadas. Esses casos verificam relações entre chamadas e ambientes, enquanto um teste isolado só confere um resultado inicial.",
            "Os exercícios incluem asserts que tornam as expectativas reproduzíveis. Ao transferir o padrão para processamento de arquivos ou uma API, mantenha as entradas explícitas e evite estado de módulo desnecessário. Uma função pura é mais fácil de comparar, mas efeitos podem ser legítimos quando são parte de uma interface clara. O objetivo é saber onde o estado mora, quem pode alterá-lo e o que a função promete conservar."
          ]
        }
      ],
      "code": "def criar_acumulador(inicial=0):\n    total = inicial\n    def somar(valor):\n        nonlocal total\n        if valor <= 0:\n            return total\n        total += valor\n        return total\n    return somar\n\na = criar_acumulador(1)\nb = criar_acumulador(10)\nassert a(2) == 3 and a(4) == 7 and b(1) == 11\nprint(a(0), b(0))\n\ndef rotulo(nome, *, prefixo=\"Aula\"):\n    return f\"{prefixo}: {nome}\"\n\nprint(rotulo(\"Funções\", prefixo=\"Módulo\"))",
      "expectedOutput": [
        "7 11",
        "Módulo: Funções"
      ],
      "output": "Saída: 7 11 e Módulo: Funções. As chamadas da fábrica têm totais separados; prefixo só pode ser fornecido por nome.",
      "trace": [
        "Cada fábrica cria seu binding total e devolve a função que o alcança.",
        "nonlocal permite a atualização do binding externo dessa chamada.",
        "O asterisco na assinatura torna prefixo keyword-only."
      ],
      "exercise": "Crie anexar(valor, valores=None) que sempre devolve uma lista nova com o valor no final e não modifica uma lista fornecida. Duas chamadas sem lista devem produzir resultados independentes.",
      "solution": "def anexar(valor, valores=None):\n    resultado = [] if valores is None else list(valores)\n    resultado.append(valor)\n    return resultado\n\na = anexar(1)\nb = anexar(2)\noriginal = [3]\nc = anexar(4, original)\nassert a == [1] and b == [2] and c == [3, 4] and original == [3]\nassert a is not b and c is not original\nprint(a, b, c, original)",
      "solutionOutput": [
        "[1] [2] [3, 4] [3]"
      ],
      "bug": "A lista padrão é compartilhada entre chamadas que omitem o argumento. Executar apenas uma vez não revela a falha de independência prometida pela função.",
      "bugCode": "def adicionar(valor, valores=[]):\n    valores.append(valor)\n    return valores\nprint(adicionar(1))\nprint(adicionar(2))  # contém também o 1 anterior",
      "repair": "Use uma sentinela None e construa a lista dentro de cada chamada. Se a função promete preservar uma lista fornecida, copie-a também antes de anexar; apenas mudar o default não resolve esse segundo contrato.",
      "checks": [
        "Duas chamadas sem coleção não compartilham dados.",
        "A coleção recebida permanece inalterada.",
        "Explique qual binding nonlocal altera e qual assinatura exige argumento nomeado."
      ],
      "project": "Crie um processador de registros com função de transformação sem mutação e uma fábrica que acumula estatísticas. Intercale duas instâncias e guarde o resultado de chamadas anteriores para conferir que ele não muda depois de uma chamada nova.",
      "question": "Quando a lista em um parâmetro padrão como valores=[] é criada?",
      "answer": "Na avaliação da definição da função, podendo ser reutilizada entre chamadas.",
      "distractors": [
        "Sempre no começo de cada chamada, portanto nunca pode compartilhar estado.",
        "Só quando append é chamado; o compilador cria uma lista por elemento."
      ],
      "practices": [
        {
          "id": "assinatura",
          "title": "Problema 1: opção exigida por nome",
          "topics": [
            "parâmetros nomeados e keyword-only",
            "contrato de entrada e retorno"
          ],
          "prompt": "Implemente etiqueta(nome, *, prefixo='Estudo') e teste chamada com prefixo nomeado e rejeição de um segundo argumento posicional. Preserve o nome recebido e não use args para aceitar silenciosamente a forma errada.",
          "solution": "def etiqueta(nome, *, prefixo=\"Estudo\"):\n    return f\"{prefixo}: {nome}\"\n\nassert etiqueta(\"HTML\") == \"Estudo: HTML\"\nassert etiqueta(\"HTML\", prefixo=\"Aula\") == \"Aula: HTML\"\ntry:\n    etiqueta(\"HTML\", \"Aula\")\nexcept TypeError:\n    pass\nelse:\n    raise AssertionError(\"argumento posicional aceito\")\nprint(etiqueta(\"HTML\", prefixo=\"Aula\"))",
          "expectedOutput": [
            "Aula: HTML"
          ],
          "explanation": [
            "O asterisco separa a parte que pode ser chamada por posição das opções exigidas por nome. A chamada errada falha antes de executar o corpo, porque não atende à assinatura.",
            "Esse teste verifica a forma de uso da função, além do resultado formatado. Se o produto passar a permitir o segundo argumento por posição, mude a assinatura e revise a expectativa de rejeição."
          ],
          "checks": [
            "O padrão produz Estudo: HTML.",
            "O argumento nomeado produz Aula: HTML.",
            "A chamada posicional indevida gera TypeError."
          ]
        },
        {
          "id": "isolamento",
          "title": "Problema 2: coletor com estado por instância",
          "topics": [
            "closure por chamada",
            "retorno novo sem modificar entrada",
            "sentinela None para default mutável"
          ],
          "prompt": "Crie uma fábrica de coletor que recebe uma lista inicial opcional, copia os dados e devolve adicionar e snapshot. A alteração de um snapshot ou da lista inicial após a criação não pode alterar o coletor. Use inteiros como elementos.",
          "solution": "def coletor(iniciais=None):\n    valores = [] if iniciais is None else list(iniciais)\n    def adicionar(valor):\n        valores.append(valor)\n    def snapshot():\n        return list(valores)\n    return adicionar, snapshot\n\noriginal = [1]\nadicionar, snapshot = coletor(original)\noutro_add, outro_snapshot = coletor()\noriginal.append(9)\nadicionar(2)\ncopia = snapshot()\ncopia.append(8)\nassert snapshot() == [1, 2] and outro_snapshot() == []\nassert original == [1, 9]\noutro_add(3)\nassert outro_snapshot() == [3] and snapshot() == [1, 2]\nprint(snapshot(), outro_snapshot())",
          "expectedOutput": [
            "[1, 2] [3]"
          ],
          "explanation": [
            "A fábrica copia a coleção inicial e cada snapshot copia novamente o contêiner interno. Os elementos são inteiros, portanto esse nível de cópia atende ao contrato definido pela atividade.",
            "Adicionar muda a lista interna sem reatribuir o binding valores, então nonlocal não é necessário para append. Duas chamadas da fábrica mantêm listas independentes, o que a sequência intercalada de testes demonstra."
          ],
          "checks": [
            "A lista inicial pode mudar sem alterar o coletor.",
            "Um snapshot pode mudar sem alterar o coletor.",
            "As duas instâncias têm dados independentes."
          ]
        }
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
      "id": "py-iteracao-recursos",
      "title": "Python: iteradores, geradores e consumo com recursos",
      "level": "Avançado",
      "summary": "Diferencie um objeto iterável de um cursor de uso único, acompanhe a suspensão de um gerador e componha processamento em lotes sem carregar a fonte inteira. A aula separa consumo de dados, validação e posse de recursos: os exercícios verificam ausência de leitura antecipada, esgotamento, limpeza após interrupção e propagação de erros. As pausas conceituais funcionam offline; os programas de referência são executados com Python no CI.",
      "source": "https://docs.python.org/3/library/itertools.html",
      "topics": [
        "iterável e iterador de uso único",
        "protocolo __iter__ e __next__",
        "StopIteration e esgotamento",
        "suspensão e retomada com yield",
        "delegação com yield from",
        "validação antes da iteração",
        "lotes com itertools.islice",
        "consumo sem leitura antecipada",
        "posse e fechamento explícito",
        "finally e interrupção do consumidor"
      ],
      "sections": [
        {
          "title": "Iterável descreve acesso; iterador guarda uma posição",
          "text": [
            "iter(objeto) pede um iterador ao objeto. Um iterador oferece __next__, que devolve o próximo elemento ou levanta StopIteration ao terminar, e __iter__, que devolve o próprio iterador. Uma lista costuma produzir um cursor novo a cada iter(lista); já iter(cursor) devolve esse mesmo cursor. Portanto receber um Iterable não promete que será possível repetir a leitura: um gerador também é iterável e normalmente só permite uma passagem.",
            "A posição pertence ao cursor, e não a uma cópia invisível da coleção. Ao chamar next(it) e depois list(it), a lista reúne apenas os elementos restantes. Outra chamada a list(it) encontra o cursor esgotado. Para percorrer duas vezes, o contrato pode exigir uma coleção reutilizável, uma fábrica de fontes novas ou uma materialização explícita. Essa última decisão custa memória e pode ser impossível para uma sequência infinita."
          ]
        },
        {
          "title": "O protocolo de parada não é um valor de negócio",
          "text": [
            "StopIteration sinaliza o fim do protocolo. None, zero e uma string vazia podem ser elementos legítimos e não devem ser usados como sinal improvisado de término. O laço for solicita valores até receber StopIteration. Depois de esgotado, um iterador correto continua sinalizando o fim nas chamadas seguintes; ele não reinicia sozinho. Um objeto iterável reutilizável oferece um novo iterador quando se deseja outra passagem.",
            "next(it, padrao) fornece um resultado alternativo quando o cursor acabou. Se esse padrão também puder ocorrer nos dados, use um objeto sentinela cuja identidade possa ser conferida com is. A sobrecarga iter(chamavel, sentinela) chama a função até obter um valor igual à sentinela, então só serve quando essa fronteira representa corretamente o domínio. A classe do exemplo usa um limite explícito e mantém StopIteration fora dos valores produzidos."
          ]
        },
        {
          "title": "yield suspende o corpo e conserva seu ambiente",
          "text": [
            "Uma função que contém yield produz um objeto gerador quando é chamada; seu corpo começa na primeira retomada. Cada yield entrega um elemento e suspende a execução, conservando variáveis locais e a posição. Isso permite transformar uma fonte aos poucos. Suspensão não torna a operação paralela nem assíncrona: o consumidor ainda determina quando solicitar o próximo elemento. list(gerador) solicita todos os restantes, eliminando essa vantagem quando a fonte é grande.",
            "yield from delega a produção a outro iterável, simplificando a composição de sequências. O protocolo também oferece send para enviar um valor ao ponto suspenso e throw para injetar uma exceção; um gerador recém-criado só aceita None como primeiro send. Nesta aula os exercícios usam next e yield from, sem exigir domínio de corrotinas. Para encerrar normalmente o corpo de um gerador, use return; levantar StopIteration diretamente ali pode se transformar em RuntimeError."
          ]
        },
        {
          "title": "islice delimita consumo e lotes delimitam memória",
          "text": [
            "islice(iterator, n) entrega no máximo n elementos e avança o cursor compartilhado. Montar uma tupla desses elementos permite oferecer um lote estável. Repetir isso até uma tupla vazia organiza a fonte em blocos, conservando o lote final incompleto. O exercício verifica também que construir o adaptador não lê a fonte e que pedir um lote de tamanho dois não consome o terceiro elemento antecipadamente.",
            "Processamento preguiçoso não significa custo constante em qualquer operação. sorted materializa dados; guardar cada lote em uma lista externa volta a acumular a fonte inteira. itertools.tee cria cursors independentes usando armazenamento intermediário, que pode crescer muito quando um consumidor fica atrás do outro. No projeto, use um único consumidor e descarte cada lote após tratá-lo. O tamanho do lote limita os itens desse adaptador, mas não controla buffers que o arquivo, cliente de rede ou próprio consumidor mantêm."
          ]
        },
        {
          "title": "Validar agora ou no primeiro next é uma decisão de API",
          "text": [
            "Se a validação estiver dentro do corpo que contém yield, ela só ocorre quando o gerador é retomado. O chamador pode criar um adaptador com tamanho inválido e só descobrir o problema bem depois. Uma função externa comum pode validar o tamanho e devolver um gerador interno. O exercício especifica que a rejeição deve ocorrer na chamada, antes de adquirir o cursor ou consumir dados. Esse momento também faz parte do contrato verificável.",
            "Nos problemas, um tamanho válido é exatamente um int positivo; bool é rejeitado mesmo sendo uma subclasse de int em Python. Essa regra é deliberada, não um requisito de todo programa Python. Erros da fonte devem continuar visíveis para o consumidor; capturar qualquer Exception e fingir que a sequência terminou esconderia uma falha de leitura. Escreva testes para entrada vazia, limite parcial, valores falsy e exceção antes de escolher uma estratégia de recuperação."
          ]
        },
        {
          "title": "Interromper a leitura não define quem fecha o recurso",
          "text": [
            "Um break termina o laço consumidor, mas não chama genericamente close no iterador que ele abandonou. Um gerador que adquiriu um recurso pode estar suspenso dentro de try/finally. Quem é dono dessa fonte precisa encerrá-la de maneira explícita. contextlib.closing chama close na saída do bloco, inclusive se houver erro. Quando o objeto já oferece um context manager adequado, use seu with diretamente. Não feche uma fonte emprestada sem declarar essa transferência de responsabilidade.",
            "Fechar um gerador suspenso permite executar seu finally; fechar um gerador que nunca começou não executa um corpo que ainda não foi iniciado. Por isso zero elementos não prova que um finally interno tenha rodado. O segundo problema usa uma fábrica que entrega um recurso com close e verifica a chamada explícita inclusive no limite zero. Não dependa do instante de coleta de lixo para liberar arquivos ou conexões. O exemplo de fechamento antecipado e os testes de erro conferem o caminho de liberação sem suprimir a exceção da leitura."
          ]
        }
      ],
      "code": "from contextlib import closing\n\nclass Contador:\n    def __init__(self, limite):\n        self.atual = 0\n        self.limite = limite\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.atual >= self.limite:\n            raise StopIteration\n        valor = self.atual\n        self.atual += 1\n        return valor\n\nit = Contador(3)\nassert iter(it) is it\nprint(next(it), list(it), list(it))\nfor _ in range(2):\n    try:\n        next(it)\n    except StopIteration:\n        pass\n    else:\n        raise AssertionError(\"cursor reiniciou\")\n\ndef quadrados(limite):\n    yield from (valor * valor for valor in range(limite))\n\ng = quadrados(4)\nprint(next(g), list(g))\n\neventos = []\ndef fonte():\n    try:\n        for valor in range(3):\n            eventos.append(f\"leu {valor}\")\n            yield valor\n    finally:\n        eventos.append(\"fechou\")\n\nwith closing(fonte()) as origem:\n    print(next(origem))\nassert eventos == [\"leu 0\", \"fechou\"]\nprint(eventos)",
      "expectedOutput": [
        "0 [1, 2] []",
        "0 [1, 4, 9]",
        "0",
        "['leu 0', 'fechou']"
      ],
      "output": "Saída: 0 [1, 2] []; depois 0 [1, 4, 9]; depois 0 e ['leu 0', 'fechou']. O primeiro cursor não reinicia. O gerador da fonte foi retomado uma vez e encerrado explicitamente, sem ler o segundo elemento.",
      "trace": [
        "next(it) avança o cursor; list(it) consome os restantes e uma nova lista encontra esgotamento.",
        "yield from entrega os quadrados sob demanda, mantendo o estado entre as solicitações.",
        "closing chama close na saída, levando o gerador suspenso ao finally sem consumir o restante."
      ],
      "exercise": "Crie Pares(limite) como iterável reutilizável dos inteiros pares de 0 até limite excluído. Aceite exatamente int não negativo; rejeite bool e outros tipos. Duas chamadas a iter no mesmo objeto devem ter posições independentes. Teste limite zero, dois cursors intercalados e repetição da sequência inteira.",
      "solution": "class Pares:\n    def __init__(self, limite):\n        if type(limite) is not int:\n            raise TypeError(\"limite deve ser int, sem bool\")\n        if limite < 0:\n            raise ValueError(\"limite negativo\")\n        self.limite = limite\n    def __iter__(self):\n        return (valor for valor in range(0, self.limite, 2))\n\npares = Pares(6)\na, b = iter(pares), iter(pares)\nassert a is not b and iter(a) is a\nassert next(a) == 0 and next(a) == 2 and next(b) == 0\nassert list(a) == [4] and list(b) == [2, 4]\nassert list(pares) == [0, 2, 4] and list(pares) == [0, 2, 4]\nassert list(Pares(0)) == []\nfor invalido in (True, 2.0, \"2\", None):\n    try:\n        Pares(invalido)\n    except TypeError:\n        pass\n    else:\n        raise AssertionError(\"tipo aceito\")\ntry:\n    Pares(-1)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError(\"limite negativo aceito\")\nprint(list(pares), list(Pares(0)))",
      "solutionOutput": [
        "[0, 2, 4] []"
      ],
      "bug": "O programa presume que um gerador pode ser percorrido duas vezes. A primeira soma esgota a fonte; a segunda conta zero elementos. O erro é de contrato de consumo, não do cálculo de sum.",
      "bugCode": "valores = (numero for numero in range(3))\ntotal = sum(valores)\nquantidade = sum(1 for _ in valores)\nprint(total, quantidade)  # 3 0, embora a fonte tenha produzido três itens",
      "repair": "Se a fonte for finita e couber em memória, materialize uma vez e reutilize a coleção. Para uma fonte grande ou de passagem única, mantenha soma e quantidade no mesmo laço. Para reler uma fonte externa, exija uma fábrica que possa abri-la novamente e defina quem fecha cada instância. Teste duas operações intercaladas para revelar o esgotamento.",
      "checks": [
        "Explique e teste a diferença entre iterável reutilizável e cursor esgotado.",
        "Construa lotes sem leitura antecipada e rejeite tamanho inválido antes da iteração.",
        "Feche recursos de sua posse em consumo parcial e erro, preservando a exceção original."
      ],
      "project": "Construa um importador de registros em lotes com uma fonte de estudo que registra cada leitura e fechamento. Valide o tamanho antes de abrir a fonte, processe apenas o lote atual e ofereça um limite de registros. Registre testes para arquivo vazio, último lote incompleto, falha de leitura e interrupção solicitada. A versão com arquivos deve usar um context manager e preservar os dados de entrada. A revisão do projeto é manual; a atividade conceitual não comprova execução do seu importador.",
      "question": "Uma função recebe um gerador, chama next nele e depois percorre list(gerador). O que essa lista contém?",
      "answer": "Somente os elementos restantes; o cursor não reinicia para recuperar o item já consumido.",
      "distractors": [
        "Todos os elementos desde o início, porque list sempre reinicia qualquer iterável.",
        "Nenhum elemento, porque uma única chamada a next esgota obrigatoriamente todo gerador."
      ],
      "practices": [
        {
          "id": "lotes",
          "title": "Problema 1: lotes sem consumir o próximo bloco",
          "topics": [
            "validação antes da iteração",
            "lotes com itertools.islice",
            "consumo sem leitura antecipada"
          ],
          "prompt": "Implemente em_lotes(fonte, tamanho), que devolve um iterador de tuplas de até tamanho elementos, incluindo o último lote parcial. tamanho precisa ser exatamente int positivo; rejeite bool, tipos diferentes e valores não positivos na própria chamada. Criar o adaptador não deve chamar next na fonte. Solicitar o primeiro lote não deve ler elementos do segundo. A fonte é emprestada: este adaptador não a fecha.",
          "solution": "from itertools import islice, count\n\ndef em_lotes(fonte, tamanho):\n    if type(tamanho) is not int:\n        raise TypeError(\"tamanho deve ser int, sem bool\")\n    if tamanho <= 0:\n        raise ValueError(\"tamanho deve ser positivo\")\n    origem = iter(fonte)\n    def produzir():\n        while True:\n            lote = tuple(islice(origem, tamanho))\n            if not lote:\n                return\n            yield lote\n    return produzir()\n\nleituras = []\ndef rastreada():\n    for valor in range(5):\n        leituras.append(valor)\n        yield valor\n\ngrupos = em_lotes(rastreada(), 2)\nassert leituras == []\nprimeiro = next(grupos)\nassert primeiro == (0, 1) and leituras == [0, 1]\nrestantes = list(grupos)\nassert restantes == [(2, 3), (4,)] and leituras == list(range(5))\nassert list(grupos) == [] and primeiro == (0, 1)\nassert list(em_lotes([], 3)) == []\nassert list(em_lotes([None, 0, \"\"], 2)) == [(None, 0), (\"\",)]\ninfinita = em_lotes(count(10), 2)\nassert next(infinita) == (10, 11) and next(infinita) == (12, 13)\ninfinita.close()\n\nfor invalido in (True, 2.0, \"2\", None, 0, -1):\n    leituras_antes = []\n    def nao_ler():\n        leituras_antes.append(\"leu\")\n        yield 1\n    try:\n        em_lotes(nao_ler(), invalido)\n    except (TypeError, ValueError) as erro:\n        esperado = TypeError if type(invalido) is not int else ValueError\n        assert type(erro) is esperado\n    else:\n        raise AssertionError(\"validação foi adiada\")\n    assert leituras_antes == []\n\ndef falha():\n    yield 1\n    raise OSError(\"leitura falhou\")\ntry:\n    next(em_lotes(falha(), 2))\nexcept OSError as erro:\n    assert str(erro) == \"leitura falhou\"\nelse:\n    raise AssertionError(\"erro da fonte foi escondido\")\nprint(primeiro, restantes)\nprint(\"lotes: bordas, consumo e erro conferidos\")",
          "expectedOutput": [
            "(0, 1) [(2, 3), (4,)]",
            "lotes: bordas, consumo e erro conferidos"
          ],
          "explanation": [
            "A função externa valida o tamanho antes de obter o cursor e devolve um gerador interno. Cada retomada materializa apenas uma tupla de até tamanho elementos. islice não solicita o primeiro item do próximo lote para decidir se o lote atual está cheio; o teste de leituras expõe esse contrato. Uma tupla vazia encerra o gerador sem gerar um lote artificial.",
            "O lote final incompleto é preservado e valores falsy continuam sendo dados. A fonte infinita pode fornecer dois lotes sem ser esgotada. Erros da fonte se propagam: se ela falhar no meio de um lote, esse lote não é entregue parcialmente. Como a fonte é emprestada, fechar produzir não fecha a origem; seu dono continua responsável por ela."
          ],
          "checks": [
            "Criar o adaptador não consome e pedir um lote não antecipa o seguinte.",
            "Vazio, lote incompleto, valores falsy e fonte infinita conservam o contrato.",
            "Tamanho inválido falha na chamada e um erro da fonte não vira término normal."
          ]
        },
        {
          "id": "fechamento",
          "title": "Problema 2: consumo limitado com dono explícito",
          "topics": [
            "posse e fechamento explícito",
            "finally e interrupção do consumidor",
            "consumo sem leitura antecipada"
          ],
          "prompt": "Implemente coletar_ate(fabrica, limite). A fábrica cria um iterador novo com método close, cuja posse é transferida à função. limite precisa ser exatamente int não negativo e deve ser validado antes de chamar a fábrica. Devolva até limite valores e feche a fonte exatamente uma vez em consumo completo, parcial, zero e erro. Não esconda a exceção de leitura. Para este exercício close termina normalmente.",
          "solution": "from contextlib import closing\nfrom itertools import islice\n\ndef coletar_ate(fabrica, limite):\n    if type(limite) is not int:\n        raise TypeError(\"limite deve ser int, sem bool\")\n    if limite < 0:\n        raise ValueError(\"limite negativo\")\n    with closing(fabrica()) as origem:\n        return list(islice(origem, limite))\n\nclass Fonte:\n    def __init__(self, valores, falhar_em=None):\n        self.valores = list(valores)\n        self.posicao = 0\n        self.falhar_em = falhar_em\n        self.leituras = []\n        self.fechamentos = 0\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.posicao == self.falhar_em:\n            raise OSError(\"origem falhou\")\n        if self.posicao >= len(self.valores):\n            raise StopIteration\n        valor = self.valores[self.posicao]\n        self.leituras.append(valor)\n        self.posicao += 1\n        return valor\n    def close(self):\n        self.fechamentos += 1\n\nfontes = []\ndef criar(valores, falhar_em=None):\n    def fabrica():\n        fonte = Fonte(valores, falhar_em)\n        fontes.append(fonte)\n        return fonte\n    return fabrica\n\nassert coletar_ate(criar([0, None, 2]), 1) == [0]\nassert fontes[-1].leituras == [0] and fontes[-1].fechamentos == 1\nassert coletar_ate(criar([0, None]), 5) == [0, None]\nassert fontes[-1].fechamentos == 1\nassert coletar_ate(criar([9]), 0) == []\nassert fontes[-1].leituras == [] and fontes[-1].fechamentos == 1\nassert coletar_ate(criar([]), 3) == [] and fontes[-1].fechamentos == 1\ntry:\n    coletar_ate(criar([1, 2, 3], falhar_em=1), 3)\nexcept OSError as erro:\n    assert str(erro) == \"origem falhou\"\nelse:\n    raise AssertionError(\"exceção suprimida\")\nassert fontes[-1].leituras == [1] and fontes[-1].fechamentos == 1\nquantidade = len(fontes)\nfor invalido in (True, \"1\", 1.0, None, -1):\n    try:\n        coletar_ate(criar([1]), invalido)\n    except (TypeError, ValueError) as erro:\n        esperado = TypeError if type(invalido) is not int else ValueError\n        assert type(erro) is esperado\n    else:\n        raise AssertionError(\"limite inválido aceito\")\nassert len(fontes) == quantidade\nprint([fonte.fechamentos for fonte in fontes])\nprint(\"fechamento: parcial, zero, vazio e erro conferidos\")",
          "expectedOutput": [
            "[1, 1, 1, 1, 1]",
            "fechamento: parcial, zero, vazio e erro conferidos"
          ],
          "explanation": [
            "A validação externa evita abrir uma fonte para uma chamada inválida. closing define a fronteira de posse e chama close ao sair; islice limita o número de elementos solicitado. O limite zero abre e fecha o recurso criado pela fábrica, sem solicitar um elemento. Esse comportamento está explicitado no contrato e não depende de iniciar o corpo de um gerador.",
            "Quando __next__ levanta OSError, a saída do with ainda fecha o recurso e a exceção continua visível. Os testes contam as liberações e os elementos lidos, pois uma saída correta por si só não provaria a ausência de leitura antecipada. A classe de estudo guarda uma lista apenas para tornar as observações reproduzíveis; ela não representa uma implementação de arquivo com memória constante."
          ],
          "checks": [
            "A fonte de posse transferida é fechada uma vez em cada caminho, inclusive limite zero.",
            "Uma interrupção parcial não lê o elemento seguinte e conserva None como dado.",
            "Erro de leitura é propagado e limites inválidos não chegam à fábrica."
          ]
        }
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
            "CSV não se resolve separando o texto por vírgula e depois por quebra de linha: um nome entre aspas pode conter ambos. Entregue o fluxo ao módulo csv, com o delimitador combinado com quem produz os dados. O leitor devolve texto; interpretar uma quantidade continua sendo uma decisão da aplicação.",
            "Abra o arquivo com encoding explícito e newline='' para deixar o módulo tratar as quebras. StringIO permite experimentar o mesmo fluxo em memória. Um registro lógico pode ocupar várias linhas físicas; line_num indica quantas linhas o leitor consumiu, e não quantos registros produziu. Registre qual dessas posições seu diagnóstico usa. A próxima pausa diferencia essas três contagens."
          ]
        },
        {
          "title": "O cabeçalho também é dado externo",
          "text": [
            "Imagine uma entrega que exige exatamente produto,quantidade nessa ordem. Antes de ler os itens, compare o cabeçalho completo com essa sequência. Um arquivo sem cabeçalho, com nome repetido, coluna extra ou ordem diferente deve ser rejeitado por esse contrato. Outra aplicação pode permitir reordenação, mas precisa fazer essa escolha explicitamente; não basta aceitar qualquer conjunto de nomes.",
            "DictReader transforma colunas em chaves. Se o arquivo repetir produto, o segundo valor ocupará a mesma chave e o primeiro não ficará disponível no registro convertido. Comparar apenas set(fieldnames) deixa essa repetição passar. Inspecione fieldnames antes de consumir registros. Essa verificação protege a informação antes de uma transformação que pode perdê-la.",
            "Cabeçalho correto não garante linhas corretas. DictReader pode preencher ausências com None e guardar campos excedentes em uma chave especial; não leia isso como preenchimento válido do domínio. Defina também a quantidade de campos por registro. Para uma fronteira pequena e explícita, csv.reader mais uma validação própria costuma facilitar a investigação. Consulte as referências oficiais de csv e io ligadas nesta aula."
          ]
        },
        {
          "title": "Valide um lote antes de alterar o destino",
          "text": [
            "Considere uma lista destino com dados já aceitos. Se cada registro novo for acrescentado imediatamente, um erro no segundo registro deixa o primeiro gravado. Dizer que a importação falhou passa a esconder uma mudança parcial. Prepare uma lista temporária, valide cada registro e só então acrescente o lote ao destino. Uma falha de leitura durante a iteração também deve acontecer antes dessa mudança.",
            "Nesta prática, cada registro contém dois textos: produto não vazio após strip e quantidade de um a nove algarismos ASCII, com zero permitido. Sinal, fração, espaço na quantidade e algarismos de outros alfabetos são rejeitados deliberadamente. Essas são escolhas do arquivo de estudo, não uma regra universal para quantidades. O limite de comprimento restringe a conversão. O índice passado ao validador identifica o registro lógico; line_num seria a posição física do parser.",
            "O lote ocupa memória proporcional à entrada. Para um arquivo grande, estabeleça um limite ou use armazenamento temporário e uma estratégia de confirmação adequada. Esta função preserva a lista diante de erro de leitura/validação; não promete recuperação de falta de memória durante extend, falha de processo ou acesso concorrente. Não equivale a uma transação de banco. O iterador de entrada já foi consumido e não volta ao início automaticamente.",
            "Depois de ordenar, teste destino previamente preenchido, entrada vazia, quantidade zero, campos a mais/menos e erro após um registro válido. Use também um gerador que levanta OSError no meio da leitura. Confira tanto a exceção quanto o destino. Assim o teste detecta uma implementação que devolve erro correto, mas deixa dados parciais. Referências: https://docs.python.org/3/library/csv.html e https://docs.python.org/3/library/io.html#io.StringIO."
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

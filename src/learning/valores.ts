import type {InteractiveLesson} from './types';
export const valores:InteractiveLesson = {
  "id": "valores",
  "revision": 2,
  "steps": [
    {
      "id": "uma-caixa",
      "title": "Um nome para guardar um valor",
      "prompt": "Uma variável liga um nome a um valor. Aqui, energia guarda o número 40. O nome nos permite ler e atualizar esse valor sem espalhar números soltos pelo programa.",
      "type": "explanation",
      "code": "let energia = 40;\nconsole.log(energia);",
      "success": ""
    },
    {
      "id": "reconhecer-valor",
      "title": "Nome e valor",
      "prompt": "Em let energia = 40, qual é o valor guardado?",
      "type": "choice",
      "capability": "reconhecimento",
      "options": [
        {
          "text": "energia",
          "feedback": "energia é o nome; o valor aparece depois do sinal =."
        },
        {
          "text": "40",
          "feedback": ""
        },
        {
          "text": "let",
          "feedback": "let é a palavra usada para declarar a variável."
        }
      ],
      "correct": 1,
      "success": "Isso mesmo. Use essa ideia no próximo passo.",
      "hints": [
        "Acompanhe o valor de cada nome, instrução por instrução."
      ]
    },
    {
      "id": "reconhecer-tipo",
      "title": "Número ou texto?",
      "prompt": "Qual declaração guarda um número?",
      "type": "choice",
      "capability": "reconhecimento",
      "options": [
        {
          "text": "let pontos = \"12\";",
          "feedback": "As aspas transformam 12 em texto."
        },
        {
          "text": "let pontos = 12;",
          "feedback": ""
        },
        {
          "text": "let pontos = \"pontos\";",
          "feedback": "O conteúdo entre aspas é uma string."
        }
      ],
      "correct": 1,
      "success": "Isso mesmo. Use essa ideia no próximo passo.",
      "hints": [
        "Acompanhe o valor de cada nome, instrução por instrução."
      ]
    },
    {
      "id": "prever-inicial",
      "title": "Leia antes de executar",
      "prompt": "let energia = 40; console.log(energia); Qual número aparece?",
      "type": "fill",
      "capability": "leitura",
      "accepted": [
        "40"
      ],
      "success": "Correto. Sua previsão acompanha o que o programa faz.",
      "failure": "Refaça a previsão na ordem das instruções. Digite apenas o valor pedido.",
      "hints": [
        "Anote o valor inicial e substitua-o a cada atribuição."
      ],
      "solution": "40"
    },
    {
      "id": "atribuir",
      "title": "Atribuir um novo valor",
      "prompt": "O sinal = atribui o resultado da direita ao nome da esquerda. Ele não pergunta se dois valores são iguais. Após energia = 55, o valor anterior 40 foi substituído.",
      "type": "explanation",
      "code": "let energia = 40;\nenergia = 55;\nconsole.log(energia);",
      "success": ""
    },
    {
      "id": "prever-atualizado",
      "title": "O valor mais recente",
      "prompt": "let energia = 40; energia = 55; console.log(energia); Qual número aparece?",
      "type": "fill",
      "capability": "leitura",
      "accepted": [
        "55"
      ],
      "success": "Correto. Sua previsão acompanha o que o programa faz.",
      "failure": "Refaça a previsão na ordem das instruções. Digite apenas o valor pedido.",
      "hints": [
        "Anote o valor inicial e substitua-o a cada atribuição."
      ],
      "solution": "55"
    },
    {
      "id": "alterar-inicial",
      "title": "Faça uma mudança",
      "prompt": "Altere o valor inicial para que energia seja o número 100.",
      "type": "code",
      "capability": "alteracao",
      "code": "let energia = 40;",
      "solution": "let energia = 100;",
      "checks": [
        {
          "label": "energia é o número 100.",
          "expression": "typeof energia === 'number' && energia === 100",
          "expected": true
        }
      ],
      "hints": [
        "O nome energia deve continuar igual.",
        "Troque o número à direita do sinal =."
      ],
      "success": "O seu programa passou nas verificações.",
      "failure": "Veja qual verificação falhou e ajuste o programa."
    },
    {
      "id": "alterar-atualizacao",
      "title": "Use o valor atual",
      "prompt": "Energia começa em 40. Atualize a variável somando 15 ao valor atual.",
      "type": "code",
      "capability": "alteracao",
      "code": "let energia = 40;\n// Atualize energia aqui.",
      "solution": "let energia = 40;\nenergia = energia + 15;",
      "checks": [
        {
          "label": "energia termina em 55.",
          "expression": "energia",
          "expected": 55
        }
      ],
      "hints": [
        "O lado direito pode ler energia antes de guardar o novo resultado.",
        "energia + 15 calcula o novo valor."
      ],
      "success": "O seu programa passou nas verificações.",
      "failure": "Veja qual verificação falhou e ajuste o programa."
    },
    {
      "id": "tipos",
      "title": "O tipo muda o resultado",
      "prompt": "Números permitem soma aritmética. Strings representam texto. Com uma string, + pode juntar valores. 10 + 5 resulta em 15; \"10\" + 5 resulta no texto \"105\".",
      "type": "explanation",
      "code": "console.log(10 + 5);\nconsole.log(\"10\" + 5);",
      "success": ""
    },
    {
      "id": "prever-texto",
      "title": "Preveja a concatenação",
      "prompt": "let total = \"10\" + 5; Digite o conteúdo do texto em total, sem aspas.",
      "type": "fill",
      "capability": "leitura",
      "accepted": [
        "105"
      ],
      "success": "Correto. Sua previsão acompanha o que o programa faz.",
      "failure": "Refaça a previsão na ordem das instruções. Digite apenas o valor pedido.",
      "hints": [
        "Anote o valor inicial e substitua-o a cada atribuição."
      ],
      "solution": "105"
    },
    {
      "id": "booleano",
      "title": "Uma decisão em um valor",
      "prompt": "Qual valor é booleano?",
      "type": "choice",
      "capability": "reconhecimento",
      "options": [
        {
          "text": "\"true\"",
          "feedback": "Com aspas, é o texto true."
        },
        {
          "text": "true",
          "feedback": ""
        },
        {
          "text": "1",
          "feedback": "1 é um número; pode ser tratado como verdadeiro em certos contextos, mas não é do tipo boolean."
        }
      ],
      "correct": 1,
      "success": "Isso mesmo. Use essa ideia no próximo passo.",
      "hints": [
        "Acompanhe o valor de cada nome, instrução por instrução."
      ]
    },
    {
      "id": "const-let",
      "title": "Quando usar const",
      "prompt": "const impede uma nova atribuição ao mesmo nome. Use const quando não precisar trocar esse valor, e let quando ele for atualizado. const não torna todos os objetos imutáveis; essa distinção será praticada em outra aula.",
      "type": "explanation",
      "code": "const limite = 100;\nlet energia = 40;\nenergia = energia + 10;",
      "success": ""
    },
    {
      "id": "escolher-declaracao",
      "title": "Escolha pela intenção",
      "prompt": "Você pretende atualizar a pontuação ao ganhar pontos. Qual declaração permite isso?",
      "type": "choice",
      "capability": "reconhecimento",
      "options": [
        {
          "text": "const pontos = 0;",
          "feedback": "const não permite atribuir outro valor a pontos."
        },
        {
          "text": "let pontos = 0;",
          "feedback": ""
        },
        {
          "text": "\"pontos = 0\";",
          "feedback": "Isso cria apenas um texto, sem declarar a variável."
        }
      ],
      "correct": 1,
      "success": "Isso mesmo. Use essa ideia no próximo passo.",
      "hints": [
        "Acompanhe o valor de cada nome, instrução por instrução."
      ]
    },
    {
      "id": "corrigir-const",
      "title": "Depure uma atribuição",
      "prompt": "O código tenta atualizar um nome declarado com const. Corrija a declaração e preserve a atualização.",
      "type": "code",
      "capability": "depuracao",
      "code": "const pontos = 10;\npontos = pontos + 5;",
      "solution": "let pontos = 10;\npontos = pontos + 5;",
      "checks": [
        {
          "label": "pontos termina em 15.",
          "expression": "pontos",
          "expected": 15
        }
      ],
      "hints": [
        "Leia a mensagem técnica do erro.",
        "A variável que muda precisa de let."
      ],
      "success": "O seu programa passou nas verificações.",
      "failure": "Veja qual verificação falhou e ajuste o programa."
    },
    {
      "id": "corrigir-texto",
      "title": "Depure o tipo",
      "prompt": "Queremos somar 5 ao número 10 e obter o número 15. Corrija o valor inicial.",
      "type": "code",
      "capability": "depuracao",
      "code": "let pontos = \"10\";\npontos = pontos + 5;",
      "solution": "let pontos = 10;\npontos = pontos + 5;",
      "checks": [
        {
          "label": "pontos é um número.",
          "expression": "typeof pontos",
          "expected": "number"
        },
        {
          "label": "A soma produz 15.",
          "expression": "pontos",
          "expected": 15
        }
      ],
      "hints": [
        "As aspas definem uma string.",
        "O valor inicial deve ser numérico."
      ],
      "success": "O seu programa passou nas verificações.",
      "failure": "Veja qual verificação falhou e ajuste o programa."
    },
    {
      "id": "prever-independencia",
      "title": "Uma cópia de valor",
      "prompt": "let a = 10; let b = a; a = 20; Qual número fica em b?",
      "type": "fill",
      "capability": "leitura",
      "accepted": [
        "10"
      ],
      "success": "Correto. Sua previsão acompanha o que o programa faz.",
      "failure": "Refaça a previsão na ordem das instruções. Digite apenas o valor pedido.",
      "hints": [
        "Anote o valor inicial e substitua-o a cada atribuição."
      ],
      "solution": "10"
    },
    {
      "id": "expressao",
      "title": "Calcular antes de guardar",
      "prompt": "Em const total = preco * quantidade, o programa calcula a expressão e guarda o resultado em total. Números primitivos são copiados por valor; atualizar preco depois não recalcula total automaticamente.",
      "type": "explanation",
      "code": "let preco = 12;\nconst quantidade = 3;\nconst total = preco * quantidade;",
      "success": ""
    },
    {
      "id": "produzir-texto",
      "title": "Escreva do início",
      "prompt": "Declare nome com o texto Lia e ativo com o booleano true. Use nomes exatamente como pedidos.",
      "type": "code",
      "capability": "producao",
      "code": "// Declare nome e ativo.",
      "solution": "const nome = \"Lia\";\nconst ativo = true;",
      "checks": [
        {
          "label": "nome guarda Lia.",
          "expression": "nome",
          "expected": "Lia"
        },
        {
          "label": "ativo é o booleano true.",
          "expression": "ativo === true",
          "expected": true
        }
      ],
      "hints": [
        "Texto precisa de aspas; um booleano não.",
        "Declare cada nome antes de usá-lo."
      ],
      "success": "O seu programa passou nas verificações.",
      "failure": "Veja qual verificação falhou e ajuste o programa."
    },
    {
      "id": "produzir-calculo",
      "title": "Calcule um total",
      "prompt": "Declare preco como 12, quantidade como 3 e total como o produto dos dois.",
      "type": "code",
      "capability": "producao",
      "code": "// Crie as três variáveis.",
      "solution": "const preco = 12;\nconst quantidade = 3;\nconst total = preco * quantidade;",
      "checks": [
        {
          "label": "preco vale 12.",
          "expression": "preco",
          "expected": 12
        },
        {
          "label": "quantidade vale 3.",
          "expression": "quantidade",
          "expected": 3
        },
        {
          "label": "total vale 36.",
          "expression": "total",
          "expected": 36
        }
      ],
      "hints": [
        "O operador de multiplicação é *.",
        "Calcule total usando preco e quantidade."
      ],
      "success": "O seu programa passou nas verificações.",
      "failure": "Veja qual verificação falhou e ajuste o programa."
    },
    {
      "id": "ordem",
      "title": "A ordem também importa",
      "prompt": "Por que console.log(total); antes de const total = 36; gera erro?",
      "type": "choice",
      "capability": "depuracao",
      "options": [
        {
          "text": "O nome ainda não pode ser acessado naquele ponto.",
          "feedback": ""
        },
        {
          "text": "console.log só aceita textos.",
          "feedback": "console.log também recebe números."
        },
        {
          "text": "36 é grande demais.",
          "feedback": "36 é um número normal; a ordem das instruções é o problema."
        }
      ],
      "correct": 0,
      "success": "Isso mesmo. Use essa ideia no próximo passo.",
      "hints": [
        "Acompanhe o valor de cada nome, instrução por instrução."
      ]
    },
    {
      "id": "depurar-nome",
      "title": "Um nome precisa coincidir",
      "prompt": "Corrija o nome usado no cálculo para que dobro seja 16.",
      "type": "code",
      "capability": "depuracao",
      "code": "const energia = 8;\nconst dobro = energias * 2;",
      "solution": "const energia = 8;\nconst dobro = energia * 2;",
      "checks": [
        {
          "label": "dobro é 16.",
          "expression": "dobro",
          "expected": 16
        }
      ],
      "hints": [
        "Compare o nome declarado e o nome lido.",
        "energia e energias são nomes diferentes."
      ],
      "success": "O seu programa passou nas verificações.",
      "failure": "Veja qual verificação falhou e ajuste o programa."
    },
    {
      "id": "planejar-projeto",
      "title": "Planeje um orçamento",
      "prompt": "Seu pequeno projeto calcula o saldo de uma compra. Entradas: saldoInicial, preco e quantidade. Custo = preco × quantidade; saldoFinal = saldoInicial − custo. Primeiro produza o cálculo, depois confira se ele também funciona quando as entradas mudam.",
      "type": "explanation",
      "success": ""
    },
    {
      "id": "aplicar-orcamento",
      "title": "Monte o orçamento",
      "prompt": "Use saldoInicial = 100, preco = 12 e quantidade = 3. Declare custo e saldoFinal a partir dessas entradas.",
      "type": "code",
      "capability": "aplicacao",
      "code": "const saldoInicial = 100;\nconst preco = 12;\nconst quantidade = 3;\n// Calcule custo e saldoFinal.",
      "solution": "const saldoInicial = 100;\nconst preco = 12;\nconst quantidade = 3;\nconst custo = preco * quantidade;\nconst saldoFinal = saldoInicial - custo;",
      "checks": [
        {
          "label": "custo é 36.",
          "expression": "custo",
          "expected": 36
        },
        {
          "label": "saldoFinal é 64.",
          "expression": "saldoFinal",
          "expected": 64
        }
      ],
      "hints": [
        "Calcule custo antes de usá-lo em saldoFinal.",
        "Subtraia o custo do saldo inicial."
      ],
      "success": "O seu programa passou nas verificações.",
      "failure": "Veja qual verificação falhou e ajuste o programa."
    },
    {
      "id": "transferir-orcamento",
      "title": "Adapte a outro cenário",
      "prompt": "Agora pratique compras diferentes. A estrutura abaixo recebe saldoInicial, preco e quantidade, e entrega os valores calculados. Complete apenas as declarações de custo e saldoFinal. Os testes usam entradas diferentes, incluindo quantidade zero.",
      "type": "code",
      "capability": "aplicacao",
      "code": "function calcularCompra(saldoInicial, preco, quantidade) {\n  // Declare custo e saldoFinal a partir das entradas.\n  return { custo, saldoFinal };\n}",
      "solution": "function calcularCompra(saldoInicial, preco, quantidade) {\n  const custo = preco * quantidade;\n  const saldoFinal = saldoInicial - custo;\n  return { custo, saldoFinal };\n}",
      "checks": [
        {
          "label": "Saldo 80, preço 7 e quatro itens deixam 52.",
          "expression": "calcularCompra(80, 7, 4)",
          "expected": {
            "custo": 28,
            "saldoFinal": 52
          }
        },
        {
          "label": "Outra compra calcula custo e saldo a partir de novas entradas.",
          "expression": "calcularCompra(100, 12, 3)",
          "expected": {
            "custo": 36,
            "saldoFinal": 64
          }
        },
        {
          "label": "Quantidade zero preserva o saldo inicial.",
          "expression": "calcularCompra(25, 9, 0)",
          "expected": {
            "custo": 0,
            "saldoFinal": 25
          }
        }
      ],
      "hints": [
        "Use os três nomes recebidos pela estrutura; evite guardar os resultados de uma compra específica.",
        "Declare custo como preco * quantidade e saldoFinal como saldoInicial - custo."
      ],
      "success": "O seu programa passou nas verificações.",
      "failure": "Veja qual verificação falhou e ajuste o programa."
    },
    {
      "id": "projeto-final",
      "title": "Seu orçamento reutilizável",
      "prompt": "Escreva uma função saldoAposCompra(saldo, preco, quantidade) que devolve saldo menos o custo. Os testes usarão compras diferentes, incluindo quantidade zero. Os parâmetros funcionam como nomes locais que recebem cada entrada.",
      "type": "code",
      "capability": "aplicacao",
      "code": "function saldoAposCompra(saldo, preco, quantidade) {\n  // Devolva o saldo restante.\n}",
      "solution": "function saldoAposCompra(saldo, preco, quantidade) {\n  const custo = preco * quantidade;\n  return saldo - custo;\n}",
      "checks": [
        {
          "label": "A compra de exemplo deixa 64.",
          "expression": "saldoAposCompra(100, 12, 3)",
          "expected": 64
        },
        {
          "label": "Outra compra deixa 52.",
          "expression": "saldoAposCompra(80, 7, 4)",
          "expected": 52
        },
        {
          "label": "Sem itens o saldo fica igual.",
          "expression": "saldoAposCompra(25, 9, 0)",
          "expected": 25
        },
        {
          "label": "O cálculo também aceita saldo insuficiente.",
          "expression": "saldoAposCompra(10, 8, 2)",
          "expected": -6
        }
      ],
      "hints": [
        "Calcule preco * quantidade dentro da função.",
        "return entrega o resultado de saldo - custo."
      ],
      "success": "O seu programa passou nas verificações.",
      "failure": "Veja qual verificação falhou e ajuste o programa."
    }
  ]
};

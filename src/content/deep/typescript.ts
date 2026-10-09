import type {DeepCourse} from './types';
export default {
  "id": "typescript-completo",
  "title": "TypeScript · do zero ao avançado",
  "description": "JavaScript tipado, narrowing, contratos, genéricos, tipos avançados e integração com dados reais.",
  "icon": "braces",
  "language": "typescript",
  "source": "https://www.typescriptlang.org/docs/",
  "lessons": [
    {
      "id": "ts-fundamentos",
      "title": "TypeScript: tipos, inferência e execução",
      "level": "Fundamentos",
      "summary": "Entenda o que TypeScript verifica antes da execução e o que permanece responsabilidade do JavaScript. Aprenda inferência, tipos primitivos, arrays, tuplas, literal types, uniões, null e undefined, distinguindo erros do compilador de validação dos dados que chegam durante a execução.",
      "topics": [
        "tsc e apagamento de tipos",
        "inferência",
        "string number boolean",
        "arrays readonly tuples",
        "literal types unions",
        "strictNullChecks",
        "unknown versus any",
        "type assertions satisfies"
      ],
      "sections": [
        {
          "title": "O compilador e o programa que executa",
          "text": [
            "TypeScript analisa relações entre tipos e produz JavaScript. A maioria das anotações é apagada; o navegador e Node executam o JavaScript resultante. Um arquivo aceito pelo compilador ainda pode falhar por rede, dados inválidos ou erro lógico.",
            "Use tsc para verificar e compilar. Ferramentas que apenas transpilem podem remover tipos sem verificar todos os contratos; mantenha uma etapa tsc --noEmit. Os exemplos desta trilha devem ser compilados em um ambiente TypeScript, pois o laboratório atual não executa essa linguagem."
          ]
        },
        {
          "title": "Inferência e alargamento",
          "text": [
            "let quantidade = 2 infere number, pois o valor pode mudar. const estado = 'aberto' preserva um tipo literal quando a inferência permite. Um objeto const ainda tem propriedades mutáveis; const restringe reatribuir o nome, não todos os campos.",
            "Anote fronteiras públicas e deixe o compilador inferir detalhes locais quando isso mantém clareza. Uma anotação excessivamente ampla pode perder informação útil. as const preserva literais e torna propriedades e tuplas readonly no modelo de tipos."
          ]
        },
        {
          "title": "Arrays, tuplas e readonly",
          "text": [
            "string[] aceita uma sequência de strings. Uma tupla como [string, number] descreve posições com tipos diferentes e um tamanho esperado. Elementos opcionais e rest ampliam esse contrato; não use uma tupla para esconder campos que seriam mais claros em um objeto.",
            "ReadonlyArray impede mutações por aquela referência durante a verificação, mas outro alias mutável pode alterar o mesmo objeto em execução. readonly não congela memória. Para impedir mudanças em execução, é preciso definir uma estratégia de imutabilidade real."
          ]
        },
        {
          "title": "Uniões e valores ausentes",
          "text": [
            "string | number significa que o valor pode ter qualquer uma das alternativas. Uma operação precisa ser válida para todas ou ocorrer depois de narrowing. Com strictNullChecks, null e undefined exigem tratamento explícito.",
            "Parâmetro opcional pode estar ausente. Defina se ausência significa usar padrão ou rejeitar entrada. O operador ?? usa o padrão somente para null e undefined; || também substitui zero, false e string vazia. Essa diferença pode mudar regras de domínio."
          ]
        },
        {
          "title": "unknown e any nas fronteiras",
          "text": [
            "unknown aceita qualquer valor, mas exige refinamento antes de operações específicas. any permite quase tudo e propaga perda de verificação. Use unknown para JSON recebido e transforme-o em um tipo de domínio somente após validar.",
            "Uma type assertion informa ao compilador uma hipótese; ela não converte nem verifica o valor. Escrever resposta as Usuario não torna os campos válidos. Asserções não devem substituir a validação de entradas que o programa não controla."
          ]
        },
        {
          "title": "Contratos preservados com satisfies",
          "text": [
            "satisfies verifica se uma expressão atende a um tipo sem necessariamente substituir seu tipo inferido pelo tipo do contrato. Isso é útil em configurações que precisam manter nomes e literais específicos.",
            "Ative strict e leia os diagnósticos como sinais de um contrato incompleto. Não silencie uma incompatibilidade por conveniência: explique a transformação, refine o tipo ou valide o dado que justificará a hipótese."
          ]
        }
      ],
      "code": "type Estado = \"aberto\" | \"fechado\";\nconst configuracao = { estado: \"aberto\", tentativas: 0 } satisfies { estado: Estado; tentativas: number };\nfunction rotulo(quantidade: number | undefined): string {\n  return String(quantidade ?? 10);\n}\nconsole.log(configuracao.estado);\nconsole.log(rotulo(0));\nconsole.log(rotulo(undefined));",
      "output": "Após compilar, a saída é aberto, 0 e 10. O tipo Estado desaparece do JavaScript; ?? preserva zero e usa o padrão somente para ausência.",
      "trace": [
        "satisfies verifica as propriedades da configuração.",
        "rotulo recebe um valor que pode estar ausente e resolve a união com ??.",
        "String faz uma conversão real em execução; a anotação : string apenas descreve o retorno."
      ],
      "exercise": "Crie normalizarNome(valor: unknown): string que aceita somente strings, remove espaços das pontas e rejeita texto vazio. Não use any nem as string para evitar a validação.",
      "solution": "function normalizarNome(valor: unknown): string {\n  if (typeof valor !== \"string\") throw new Error(\"nome deve ser texto\");\n  const nome = valor.trim();\n  if (!nome) throw new Error(\"nome vazio\");\n  return nome;\n}\nconsole.log(normalizarNome(\" Ana \"));",
      "bug": "Uma asserção pode fazer o compilador aceitar uma operação que falha em execução. Ela não muda o tipo real do objeto recebido.",
      "bugCode": "const entrada: unknown = 42;\nconst nome = entrada as string;\nconsole.log(nome.toUpperCase());",
      "repair": "Teste typeof entrada === 'string' antes de usar métodos de texto, ou rejeite a entrada. Não troque a asserção por any: isso só remove mais evidências do problema.",
      "checks": [
        "Aceita texto e remove apenas espaços das pontas.",
        "Rejeita número, null, undefined e string vazia.",
        "O programa passa por tsc com strict sem depender de asserções injustificadas."
      ],
      "project": "Tipifique uma configuração de estudos com estados literais, tentativas e um prazo opcional. Preserve zero como um valor válido, teste ausência e explique quais garantias vêm da tipagem e quais exigem validação.",
      "question": "O que valor as string faz durante a execução?",
      "answer": "Não verifica nem converte o valor; é uma hipótese para o compilador.",
      "distractors": [
        "Converte automaticamente o valor para texto.",
        "Valida que o valor recebido é uma string."
      ]
    },
    {
      "id": "ts-inferencia-ausencia",
      "title": "TypeScript: inferência, ausência e contratos sem coerção",
      "level": "Fundamentos",
      "summary": "Entenda o que o compilador consegue provar sobre uma variável e o que continua dependendo dos dados recebidos. Você vai modelar quantidade opcional, preservar zero, usar narrowing em vez de assertions e distinguir ausência de erro. Os problemas incluem catálogo por identificador e limite configurável, com testes positivos, negativos e resultados reais depois do apagamento dos tipos.",
      "source": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      "topics": [
        "inferência e widening",
        "union com undefined",
        "strictNullChecks",
        "narrowing por typeof",
        "operador nullish",
        "assertion sem validação",
        "readonly e mutação",
        "contrato de retorno discriminado"
      ],
      "sections": [
        {
          "title": "O tipo acompanha operações possíveis",
          "text": [
            "TypeScript verifica o programa antes de executá-lo. Uma variável inicializada com um número costuma ser inferida como number, permitindo outros números em atribuições posteriores; um const com literal pode conservar um tipo literal mais específico. O tipo descreve operações que o compilador permite no ponto atual. Ele não acrescenta uma etiqueta secreta ao valor JavaScript e não transforma automaticamente texto recebido em um número.",
            "O alargamento de literais, chamado widening, faz diferença em objetos mutáveis. Um campo status inicializado com 'aberto' pode ser inferido como string se o objeto permitir alterações. Uma anotação de union ou as const pode preservar o conjunto de valores pretendido. as const também cria uma visão readonly para a expressão, mas não congela objetos em runtime. Escolha a representação pelo contrato de mutação, não apenas para silenciar uma mensagem."
          ]
        },
        {
          "title": "Ausência pertence ao modelo de dados",
          "text": [
            "Com strictNullChecks, number e undefined são possibilidades distintas. Se um parâmetro é opcional, seu corpo precisa tratar a ausência antes de usá-lo como número. Isso permite tornar visível uma regra que JavaScript deixaria implícita. Uma quantidade zero não está ausente; um total negativo pode estar presente e ser inválido. Modelar essas três situações evita que um valor falso em condição se transforme em configuração padrão.",
            "O operador ?? seleciona o valor da direita apenas para null ou undefined. O operador || seleciona para qualquer valor falsy, incluindo zero, string vazia e false. Use a operação que corresponde ao domínio. Nesta aula, limite zero significa não aceitar itens, portanto limite ?? 10 preserva uma escolha válida. O compilador não decide sozinho qual operador expressa a regra do produto: os dois podem ser programas bem tipados."
          ]
        },
        {
          "title": "Narrowing usa evidência observável",
          "text": [
            "Quando uma variável é string | number, uma condição typeof valor === 'number' permite usar operações numéricas no ramo. O compilador refina o conjunto de possibilidades ao acompanhar o fluxo de controle. Se o outro ramo encerra com return ou throw, os trechos seguintes também podem herdar esse refinamento. Essa redução de possibilidades é chamada narrowing e deve se apoiar em verificações que realmente acontecem na execução.",
            "A verificação typeof valor === 'object' ainda inclui null em JavaScript; arrays também são objetos. Um predicado para um objeto precisa combinar null, tipo e, quando apropriado, Array.isArray. Um type predicate escrito por você é uma promessa ao compilador: ele pode estar errado. Prefira começar com verificações simples cujo efeito você consegue explicar e teste os dados que deveriam ser rejeitados, além do caminho feliz."
          ]
        },
        {
          "title": "Assertions mudam a visão, sem conferir o dado",
          "text": [
            "A expressão valor as number instrui o compilador a tratar o valor com aquele tipo quando a conversão de visão é permitida. Ela não chama Number e não lança erro se o dado de execução for uma string. O operador ! de não nulidade também não procura um registro perdido. Essas formas podem ser úteis quando existe uma garantia externa conhecida, mas não substituem a validação da fronteira de um formulário, JSON ou consulta.",
            "unknown representa um valor cuja forma você ainda não sabe. Diferentemente de any, ele exige prova antes de acessar propriedades e chamar operações. Ao converter uma resposta para unknown, você mantém a responsabilidade de validar no adaptador. Após produzir um objeto do domínio, o restante do programa pode receber um contrato estreito. Se usar uma assertion para atravessar essa fronteira, você remove exatamente a prova que o tipo deveria exigir."
          ]
        },
        {
          "title": "Retorno discriminado evita sentinelas ambíguas",
          "text": [
            "Uma função que calcula um valor pode devolver { ok: true, valor: number } ou { ok: false, erro: string }. O campo ok distingue os formatos e permite narrowing. No ramo de sucesso o valor existe; no de falha o erro existe. Isso deixa o contrato mais claro que retornar -1 para falha quando números negativos podem ser resultados válidos. Também força quem chama a decidir como comunicar a falha.",
            "ReadonlyArray ou readonly T[] impede certas mutações por essa referência, enquanto outras referências podem continuar a modificar o mesmo objeto. Um parâmetro somente leitura deixa explícito que a função não deve alterar a coleção recebida. Não confunda esse contrato estático com cópia, imutabilidade profunda ou proteção de concorrência. Teste que a operação preserva os dados originais quando essa propriedade pertence ao comportamento prometido."
          ]
        },
        {
          "title": "Confira tipos e comportamento separadamente",
          "text": [
            "Um teste de tipos pode usar @ts-expect-error para exigir que uma operação inválida seja rejeitada. Se ela passar a compilar, o comentário gera um diagnóstico de diretiva não utilizada. Escreva a diretiva sobre uma chamada com um erro específico, e não sobre um bloco que contém vários problemas. Dessa forma o teste detecta que o contrato está estreito o suficiente sem esconder erros não relacionados.",
            "Ainda é necessário executar o JavaScript produzido. Uma função pode ter tipo correto e somar os valores errados, ignorar zero ou modificar o array recebido. Os exemplos desta aula incluem expectativas de saída e verificações que lançam Error em caso de divergência. Use o modo strict para a análise estática e dados de fronteira para a execução. A combinação confere duas propriedades diferentes do mesmo contrato."
          ]
        }
      ],
      "code": "type Resultado = {ok:true; valor:number} | {ok:false; erro:string};\nfunction quantidade(entrada:unknown, limite?:number):Resultado {\n  const maximo = limite ?? 10;\n  if (!Number.isSafeInteger(maximo) || maximo < 0) return {ok:false,erro:\"limite inválido\"};\n  if (typeof entrada !== \"number\" || !Number.isSafeInteger(entrada) || entrada < 0)\n    return {ok:false,erro:\"quantidade inválida\"};\n  return entrada <= maximo ? {ok:true,valor:entrada} : {ok:false,erro:\"acima do limite\"};\n}\nconst a = quantidade(0,0), b = quantidade(\"2\");\nif (!a.ok || a.valor !== 0 || b.ok) throw new Error(\"contrato quebrado\");\nconsole.log(JSON.stringify(a));\nconsole.log(JSON.stringify(b));",
      "expectedOutput": [
        "{\"ok\":true,\"valor\":0}",
        "{\"ok\":false,\"erro\":\"quantidade inválida\"}"
      ],
      "output": "Saída: um sucesso com valor 0 e uma falha quantidade inválida. A string \"2\" não sofre coerção implícita.",
      "trace": [
        "typeof produz a evidência para o ramo numérico, sem transformar uma string.",
        "?? preserva limite zero; Number.isSafeInteger rejeita NaN, infinitos e frações.",
        "O campo ok decide qual propriedade pode ser acessada após o narrowing."
      ],
      "exercise": "Escreva dobro(entrada: unknown) devolvendo um resultado discriminado. Aceite somente números finitos, inclusive zero e negativos; rejeite strings, null e Infinity. Não use as number, any ou ! para tratar entrada.",
      "solution": "type Dobro = {ok:true; valor:number} | {ok:false; erro:string};\nfunction dobro(entrada:unknown):Dobro {\n  if (typeof entrada !== \"number\" || !Number.isFinite(entrada))\n    return {ok:false,erro:\"número finito esperado\"};\n  const valor = entrada * 2;\n  return Number.isFinite(valor) ? {ok:true,valor} : {ok:false,erro:\"resultado não finito\"};\n}\nconst a = dobro(0), b = dobro(-3);\nif (!a.ok || a.valor !== 0 || !b.ok || b.valor !== -6 || dobro(\"3\").ok || dobro(null).ok || dobro(Infinity).ok)\n  throw new Error(\"casos de fronteira\");\nconsole.log(JSON.stringify(b));",
      "solutionOutput": [
        "{\"ok\":true,\"valor\":-6}"
      ],
      "bug": "O limite padrão usa || e substitui zero por dez. O código pode passar por strict e ainda contrariar o domínio. Separe a garantia de tipo da regra de negócio e escreva o menor teste que expõe o erro.",
      "bugCode": "function maximo(limite?:number):number {\n  return limite || 10;\n}\nconsole.log(maximo(0)); // 10, embora zero tenha sido fornecido",
      "repair": "Use limite ?? 10 e valide a faixa depois. Adicione um teste com limite zero; um diagnóstico do compilador não detectará sozinho que || era o operador errado para esse contrato.",
      "checks": [
        "Zero é preservado como dado e como limite.",
        "unknown só é usado após uma verificação executada.",
        "Erros são representados por um ramo que não contém valor de sucesso."
      ],
      "project": "Implemente a configuração de limite de uma lista de tarefas. O adaptador recebe unknown, valida quantidade e limite, e entrega um resultado discriminado. Inclua exemplos para zero, ausência, NaN e texto numérico; explique quais regras são estáticas e quais dependem de execução.",
      "question": "O que entrada as number faz quando entrada contém a string '12' em runtime?",
      "answer": "Muda a visão estática do compilador; não converte a string nem valida seu conteúdo.",
      "distractors": [
        "Converte automaticamente a string para o número 12.",
        "Lança uma exceção antes de o JavaScript começar a executar."
      ],
      "practices": [
        {
          "id": "catalogo",
          "title": "Problema 1: busca que pode não encontrar",
          "topics": [
            "union com undefined",
            "strictNullChecks",
            "readonly e mutação"
          ],
          "prompt": "Receba um catálogo readonly de {id, nome}. A busca por id deve retornar o nome ou undefined, sem assertion de não nulidade e sem modificar o catálogo. Verifique id existente, inexistente e catálogo vazio.",
          "solution": "type Item = {id:number; nome:string};\nfunction buscarNome(itens:readonly Item[], id:number):string|undefined {\n  return itens.find(item=>item.id===id)?.nome;\n}\nconst itens:readonly Item[] = [{id:0,nome:\"Lia\"}];\nif (buscarNome(itens,0)!==\"Lia\" || buscarNome(itens,1)!==undefined || buscarNome([],0)!==undefined || itens.length!==1)\n  throw new Error(\"busca inválida\");\nconsole.log(buscarNome(itens,0));\nconsole.log(String(buscarNome(itens,1)));",
          "expectedOutput": [
            "Lia",
            "undefined"
          ],
          "explanation": [
            "find retorna um item ou undefined. O encadeamento opcional permite obter nome só quando o item existe e preserva ausência no resultado.",
            "O tipo readonly documenta a restrição de escrita pela referência recebida. Ele não faz uma cópia. As verificações de execução mostram tanto o caso encontrado quanto o caso ausente e a preservação da coleção."
          ],
          "checks": [
            "Id zero encontra Lia.",
            "Catálogo vazio e id desconhecido retornam undefined.",
            "Explique por que adicionar ! esconderia um caso válido do retorno."
          ]
        },
        {
          "id": "limite",
          "title": "Problema 2: padrão sem apagar zero",
          "topics": [
            "union com undefined",
            "narrowing por typeof"
          ],
          "prompt": "Crie limiteValido(valor: unknown): number | undefined. undefined recebe o padrão 10; um inteiro seguro não negativo é preservado. Outros valores, inclusive null, retornam undefined indicando erro. Verifique 0, 3, ausência, null e string.",
          "solution": "function limiteValido(valor:unknown):number|undefined {\n  if (valor === undefined) return 10;\n  if (typeof valor !== \"number\" || !Number.isSafeInteger(valor) || valor < 0) return undefined;\n  return valor;\n}\nif (limiteValido(0)!==0 || limiteValido(3)!==3 || limiteValido(undefined)!==10 ||\n    limiteValido(null)!==undefined || limiteValido(\"3\")!==undefined) throw new Error(\"limite inválido\");\nconsole.log(limiteValido(0),limiteValido(undefined));",
          "expectedOutput": [
            "0 10"
          ],
          "explanation": [
            "A ausência aceita pelo contrato é somente undefined. Por isso o teste explícito vem antes do narrowing numérico e null é uma falha, diferente do comportamento de ?? sozinho.",
            "O retorno numérico inclui zero. No consumidor, teste resultado === undefined, sem usar if (!resultado). Para transportar mensagens de falha, substitua a sentinela pelo Resultado discriminado apresentado no exemplo principal."
          ],
          "checks": [
            "0 é preservado e undefined recebe 10.",
            "null e texto numérico são rejeitados.",
            "Explique por que ?? sozinho não implementa a regra de null desta atividade."
          ]
        }
      ]
    },
    {
      "id": "ts-contratos",
      "title": "TypeScript: objetos, narrowing e uniões discriminadas",
      "level": "Intermediário",
      "summary": "Descreva modelos com type e interface, compreenda tipagem estrutural e refine valores por controle de fluxo. Use uniões discriminadas para representar estados possíveis e impossíveis, mantendo decisões exaustivas e evitando objetos cheios de propriedades opcionais cuja combinação não tem significado.",
      "topics": [
        "type interface tipagem estrutural",
        "optional readonly",
        "excess property checks",
        "typeof in instanceof",
        "type predicates assertions",
        "discriminated unions",
        "never exhaustiveness",
        "intersections index signatures"
      ],
      "sections": [
        {
          "title": "Tipos estruturais e contratos públicos",
          "text": [
            "TypeScript compara estruturas: um objeto é compatível quando possui os membros exigidos, mesmo sem declarar uma relação nominal. interface descreve formas extensíveis; type também pode nomear uniões, tuplas e transformações.",
            "A verificação de propriedades extras em literais ajuda a encontrar erros de digitação, mas não significa que tipos de objetos sejam sempre exatos. Objetos vindos de outras referências podem conter campos adicionais. A aplicação deve definir como tratar esses campos em entradas externas."
          ]
        },
        {
          "title": "Propriedades opcionais e índices",
          "text": [
            "Um campo opcional pode faltar, e sua leitura exige lidar com undefined. Com exactOptionalPropertyTypes, declarar ausência e escrever explicitamente undefined deixam de ser intercambiáveis em alguns contratos.",
            "Uma assinatura de índice descreve chaves dinâmicas; noUncheckedIndexedAccess ajuda a lembrar que a chave pode não existir. Não prometa um valor para toda string se o dicionário é parcial. Map pode tornar operações de presença mais explícitas."
          ]
        },
        {
          "title": "Refinamento por controle de fluxo",
          "text": [
            "typeof, instanceof, comparações e o operador in ajudam o compilador a reduzir possibilidades. typeof null é 'object', então valide null separadamente. instanceof depende do construtor e pode ter limitações entre ambientes diferentes.",
            "Uma atribuição ou passagem por uma fronteira pode alterar o que o compilador sabe. Evite mutar objetos refinados sem necessidade. Faça a validação perto do uso e dê nomes a transformações que estabelecem invariantes."
          ]
        },
        {
          "title": "Predicados e funções de asserção",
          "text": [
            "Uma função que retorna valor is Tipo declara um predicado. O compilador confia nessa declaração; o corpo precisa verificar realmente todos os requisitos. Um predicado falso pode espalhar uma suposição incorreta por todo o programa.",
            "Uma função asserts valor is Tipo encerra por exceção quando o contrato não é satisfeito. Use-a quando falha significa interromper a operação. Para dados que podem ser inválidos normalmente, um resultado explícito de sucesso ou erro costuma ser mais fácil de compor."
          ]
        },
        {
          "title": "Estados com discriminante",
          "text": [
            "Uma união discriminada usa um campo literal comum, como status. Cada variante contém somente os dados que fazem sentido naquele estado. Isso evita combinações como carregando com resultado obrigatório ou erro sem mensagem.",
            "O switch sobre status permite acessar os campos da variante refinada. Adicionar um novo estado deve exigir revisar decisões que precisam tratá-lo; esse é um benefício de modelar possibilidades explicitamente."
          ]
        },
        {
          "title": "never e interseções",
          "text": [
            "never representa um caso que não pode ocorrer segundo os tipos. Uma função que recebe never em um default ajuda a verificar exaustividade. Não use uma asserção para forçar o caso a never, pois ela desativa a evidência que você queria obter.",
            "Interseções combinam requisitos, não alternativas. {id:string} & {id:number} exige uma propriedade impossível, não string ou number. Examine conflitos antes de compor contratos com &, especialmente em tipos distribuídos por bibliotecas."
          ]
        }
      ],
      "code": "type Resultado = { status: \"ok\"; valor: number } | { status: \"erro\"; mensagem: string };\nfunction impossivel(valor: never): never { throw new Error(\"estado inesperado\"); }\nfunction apresentar(r: Resultado): string {\n  switch (r.status) {\n    case \"ok\": return \"Total: \" + r.valor;\n    case \"erro\": return \"Falha: \" + r.mensagem;\n    default: return impossivel(r);\n  }\n}\nconsole.log(apresentar({status:\"ok\", valor:3}));",
      "output": "A saída é Total: 3. O discriminante status permite acessar valor somente na variante de sucesso; uma nova variante não tratada produzirá incompatibilidade no caso never.",
      "trace": [
        "Resultado descreve duas formas completas, sem propriedades opcionais ambíguas.",
        "Cada case refina r pela propriedade literal.",
        "O default exige que nenhuma possibilidade válida tenha restado."
      ],
      "exercise": "Modele uma requisição como parado, carregando, sucesso com dados ou erro com mensagem. Escreva uma função exaustiva que devolve um texto e mantenha os dados exclusivos de cada variante.",
      "solution": "type Requisicao = {status:\"parado\"} | {status:\"carregando\"} | {status:\"sucesso\";dados:string[]} | {status:\"erro\";mensagem:string};\nfunction texto(r:Requisicao):string {\n  switch(r.status){\n    case \"parado\":return \"Pronto\";\n    case \"carregando\":return \"Aguarde\";\n    case \"sucesso\":return r.dados.join(\", \");\n    case \"erro\":return r.mensagem;\n    default:{const fim:never=r;return fim;}\n  }\n}",
      "bug": "Um modelo com status string e campos opcionais aceita combinações sem sentido. Ele também exige usar ! para acessar dados mesmo quando o programador acredita que o status os garante.",
      "bugCode": "type Resposta = {status:string; dados?:string[]; erro?:string};\nconst r:Resposta = {status:\"sucesso\"};\nconsole.log(r.dados!.length);",
      "repair": "Troque por uma união discriminada em que sucesso exige dados e erro exige mensagem. O ! é uma asserção de ausência de null/undefined; ele não cria o valor faltante.",
      "checks": [
        "Cada variante contém somente os campos do seu estado.",
        "Todos os estados são tratados sem non-null assertions.",
        "Adicionar uma variante nova exige rever a função exaustiva."
      ],
      "project": "Modele o estado de uma busca da interface: consulta vazia, carregando, resultados e falha. Escreva transições como funções e impeça que uma resposta antiga substitua uma consulta mais recente.",
      "question": "Por que usar uma união discriminada em vez de vários campos opcionais?",
      "answer": "Ela descreve combinações válidas e permite refinar campos por estado.",
      "distractors": [
        "Porque impede todos os erros de rede em execução.",
        "Porque obriga toda variante a ter todos os campos."
      ]
    },
    {
      "id": "ts-validacao-aninhada",
      "title": "TypeScript: validar JSON aninhado e produzir dados de domínio",
      "level": "Intermediário",
      "summary": "Atravesse uma fronteira de JSON sem fingir que uma anotação de tipo valida a resposta. Esta aula constrói um adaptador de unknown para um pedido com itens, confere cada nível, copia os campos aceitos e relata uma falha com caminho. Os exercícios aprofundam campos opcionais e testes de tipos, preservando a diferença entre o formato externo e o modelo usado no cálculo.",
      "source": "https://www.typescriptlang.org/docs/handbook/2/objects.html",
      "topics": [
        "JSON.parse como fronteira unknown",
        "objeto não nulo e não array",
        "validação de campos aninhados",
        "validação de todos os itens",
        "mensagem com caminho de erro",
        "cópia dos campos aceitos",
        "campo opcional versus inválido",
        "testes com ts-expect-error"
      ],
      "sections": [
        {
          "title": "JSON descreve dados e não um contrato TypeScript",
          "text": [
            "JSON.parse pode retornar um número, null, um array ou um objeto, além de lançar SyntaxError quando o texto não é JSON válido. Anotar o resultado como Pedido não faz o parser verificar os campos. Trate o resultado como unknown na fronteira, confira a estrutura e só então produza Pedido. Essa sequência torna explícito de onde vem a confiança necessária para o restante da aplicação.",
            "Um DTO externo e um modelo de domínio podem ter nomes e regras diferentes. A API pode fornecer quantidade como texto, mas o cálculo pode exigir um inteiro. Essa conversão deve ter um contrato próprio e não ocorrer incidentalmente em uma multiplicação. Nesta aula a fronteira exige quantidades numéricas; se a API mudar, o adaptador precisa ser revisado e seus casos de teste documentam essa decisão."
          ]
        },
        {
          "title": "Cada nível exige uma verificação",
          "text": [
            "Para acessar uma propriedade de unknown, primeiro confirme typeof valor === 'object', valor !== null e !Array.isArray(valor). Esse conjunto identifica um objeto adequado para um registro de campos, sem afirmar que todos os seus campos estão corretos. Um helper pode expor Record<string, unknown>; cada valor lido continua desconhecido e exige a sua própria prova.",
            "Um objeto com itens não garante que itens seja array. Um array de itens não garante que cada elemento seja objeto. Um objeto de item não garante que quantidade seja inteiro positivo. Organize a validação do exterior para o interior e encerre na primeira falha com um caminho como itens[1].quantidade. Esse caminho é uma informação útil para corrigir dados e evita a mensagem genérica pedido inválido."
          ]
        },
        {
          "title": "Confira a coleção inteira antes do cálculo",
          "text": [
            "Validar só o primeiro item deixa os demais atravessarem a fronteira sem garantia. Um for com índice permite conferir cada elemento e informar exatamente qual falhou. Construa um novo array de objetos aceitos em vez de declarar que o array original tem um tipo mais estreito. Só retorne sucesso depois de todos os itens passarem. Dessa forma uma falha tardia não publica um pedido parcialmente validado.",
            "Escolha também uma regra para array vazio e limites de tamanho. Aqui pedidos precisam de pelo menos um item e quantidades são inteiros seguros positivos. Em um adaptador exposto a dados de rede, limite o número de itens e o tamanho do texto antes do processamento. Esses limites controlam consumo de recursos e pertencem à validação semântica, mesmo quando cada item isolado parece correto."
          ]
        },
        {
          "title": "Selecionar campos reduz dependência do formato externo",
          "text": [
            "Retornar {...entrada} após validar alguns campos também copia os campos que você nunca conferiu. O tipo declarado pode ocultar a presença desses dados extras, enquanto serialização e outras operações em runtime ainda os encontram. Ao retornar { id, itens }, você escolhe a forma produzida pelo adaptador. O contrato desta aula ignora campos extras no JSON, mas não os inclui no objeto de domínio.",
            "Uma cópia rasa só duplica o objeto do nível atual. Se você reutilizar o array de entrada, alterações posteriores no array ainda atingem o resultado. Construa também cada item aceito quando precisa isolar o modelo validado. Isso não estabelece imutabilidade profunda para todo tipo possível; estabelece uma separação suficiente para esta árvore composta apenas por strings, números, objetos de item e um array."
          ]
        },
        {
          "title": "Opcional não significa qualquer coisa",
          "text": [
            "Um campo opcional pode estar ausente, mas quando presente precisa cumprir sua regra. Se apelido é opcional, um número no campo não deve ser tratado como ausência silenciosa. Distinga entrada.apelido === undefined do caso em que existe um valor inválido. A diferença permite detectar erro de integração que seria escondido por uma regra de valor padrão aplicada indiscriminadamente.",
            "Para transportar falhas, uma união com ok discrimina sucesso e erro. Uma função consumidora deve verificar ok antes de acessar valor. Testes com @ts-expect-error podem conferir que propriedades de sucesso não vazam para o ramo de falha. Eles também mostram por que unknown é útil: tentar passar dados externos diretamente para uma função do domínio deve ser rejeitado até ocorrer validação."
          ]
        },
        {
          "title": "Validação precisa de dados hostis e casos incompletos",
          "text": [
            "Monte uma tabela com null, array no lugar de objeto, itens ausentes, item null, quantidade fracionária, quantidade zero e um item inválido depois de um válido. Inclua dados bons com campos extras para conferir a política de seleção. Uma atividade que só usa o JSON ideal testa o parser feliz, mas não a fronteira que o modelo afirma proteger.",
            "Depois do sucesso, modifique a entrada original e confira se o resultado conserva os valores aceitos. Esse teste investiga compartilhamento de referências e complementa os testes de forma. Em produção, não execute getters ou classes arbitrárias como se fossem JSON puro sem definir essa fronteira; o exemplo considera dados originados de JSON.parse, que são uma árvore de dados simples."
          ]
        }
      ],
      "code": "type Pedido = {id:string; itens:{sku:string; quantidade:number}[]};\ntype Validacao<T> = {ok:true; valor:T} | {ok:false; erro:string};\nfunction registro(x:unknown):x is Record<string,unknown> {\n  return typeof x===\"object\" && x!==null && !Array.isArray(x);\n}\nfunction pedido(x:unknown):Validacao<Pedido> {\n  if (!registro(x) || typeof x.id!==\"string\" || x.id.trim()===\"\")\n    return {ok:false,erro:\"id\"};\n  if (!Array.isArray(x.itens) || x.itens.length<1 || x.itens.length>100)\n    return {ok:false,erro:\"itens\"};\n  const itens:Pedido[\"itens\"]=[];\n  for (let i=0;i<x.itens.length;i++) {\n    const item:unknown=x.itens[i];\n    if (!registro(item) || typeof item.sku!==\"string\" || item.sku.trim()===\"\")\n      return {ok:false,erro:`itens[${i}].sku`};\n    const q=item.quantidade;\n    if (typeof q!==\"number\" || !Number.isSafeInteger(q) || q<=0)\n      return {ok:false,erro:`itens[${i}].quantidade`};\n    itens.push({sku:item.sku,quantidade:q});\n  }\n  return {ok:true,valor:{id:x.id,itens}};\n}\nconst entrada:unknown=JSON.parse('{\"id\":\"p1\",\"itens\":[{\"sku\":\"A\",\"quantidade\":2}],\"extra\":true}');\nconst bom=pedido(entrada),ruim=pedido({id:\"p2\",itens:[{sku:\"A\",quantidade:0}]});\nif (!bom.ok || bom.valor.itens[0].quantidade!==2 || ruim.ok) throw new Error(\"validação\");\nconsole.log(JSON.stringify(bom));\nconsole.log(JSON.stringify(ruim));",
      "expectedOutput": [
        "{\"ok\":true,\"valor\":{\"id\":\"p1\",\"itens\":[{\"sku\":\"A\",\"quantidade\":2}]}}",
        "{\"ok\":false,\"erro\":\"itens[0].quantidade\"}"
      ],
      "output": "O resultado válido contém somente id e itens. A quantidade zero falha com o caminho itens[0].quantidade, sem produzir um Pedido.",
      "trace": [
        "A fronteira começa em unknown e registro prova apenas a forma externa.",
        "O laço confere todo item e constrói objetos novos com campos aceitos.",
        "Somente ao completar a coleção a função retorna o ramo ok com Pedido."
      ],
      "exercise": "Valide um endereço {cidade:string, cep:string} recebido como unknown. Exija cidade não vazia após trim e CEP com exatamente oito dígitos ASCII. Ignore campos extras no resultado e rejeite null, array e CEP numérico.",
      "solution": "type Endereco={cidade:string; cep:string};\nfunction endereco(x:unknown):Endereco|undefined {\n  if (typeof x!==\"object\" || x===null || Array.isArray(x)) return undefined;\n  if (!(\"cidade\" in x) || !(\"cep\" in x) || typeof x.cidade!==\"string\" ||\n      x.cidade.trim()===\"\" || typeof x.cep!==\"string\" || !/^[0-9]{8}$/.test(x.cep)) return undefined;\n  return {cidade:x.cidade.trim(),cep:x.cep};\n}\nconst bom=endereco({cidade:\" Recife \",cep:\"01234567\",extra:1});\nif (!bom || bom.cidade!==\"Recife\" || \"extra\" in bom || endereco(null)!==undefined ||\n    endereco([])!==undefined || endereco({cidade:\"R\",cep:12345678})!==undefined) throw new Error(\"endereço\");\nconsole.log(JSON.stringify(bom));",
      "solutionOutput": [
        "{\"cidade\":\"Recife\",\"cep\":\"01234567\"}"
      ],
      "bug": "A função promete Pedido depois de uma assertion do retorno de JSON.parse. Um item com quantidade string passa pela fronteira e pode concatenar texto num cálculo. O tipo declarado esconde a falta de prova em execução.",
      "bugCode": "type Pedido={itens:{quantidade:number}[]};\nconst pedido=JSON.parse('{\"itens\":[{\"quantidade\":\"2\"}]}') as Pedido;\nconsole.log(pedido.itens[0].quantidade + 1); // \"21\"",
      "repair": "Receba unknown, confira cada nível e cada quantidade, devolva um resultado discriminado e calcule apenas no ramo válido. Acrescente um item inválido na segunda posição para evitar uma validação limitada ao primeiro item.",
      "checks": [
        "Todos os itens são conferidos e a falha informa o caminho.",
        "Campos extras não são copiados para o resultado.",
        "A fronteira não usa any ou assertions para inventar a validade do JSON."
      ],
      "project": "Crie um importador de pedidos de um arquivo JSON. Separe erro de sintaxe, erro de estrutura e cálculo do total. Escreva um relatório dos registros rejeitados com caminho, sem retornar pedidos parcialmente validados, e documente os limites de tamanho.",
      "question": "Por que conferir Array.isArray(entrada.itens) não basta para produzir um Pedido?",
      "answer": "Cada elemento ainda pode ter campos ausentes ou inválidos e precisa ser validado.",
      "distractors": [
        "Array.isArray converte automaticamente os elementos para o tipo esperado.",
        "Depois de identificar um array, strict verifica os dados de rede durante a execução."
      ],
      "practices": [
        {
          "id": "opcional",
          "title": "Problema 1: apelido ausente ou inválido",
          "topics": [
            "campo opcional versus inválido",
            "objeto não nulo e não array"
          ],
          "prompt": "Valide um perfil com nome obrigatório não vazio e apelido opcional não vazio quando fornecido. Ausência ou undefined omitem apelido no resultado; null, número e espaços no apelido invalidam o perfil. Produza um novo objeto com strings aparadas.",
          "solution": "type Perfil={nome:string; apelido?:string};\nfunction perfil(x:unknown):Perfil|undefined {\n  if (typeof x!==\"object\" || x===null || Array.isArray(x) ||\n      !(\"nome\" in x) || typeof x.nome!==\"string\" || x.nome.trim()===\"\") return undefined;\n  if (!(\"apelido\" in x) || x.apelido===undefined) return {nome:x.nome.trim()};\n  if (typeof x.apelido!==\"string\" || x.apelido.trim()===\"\") return undefined;\n  return {nome:x.nome.trim(),apelido:x.apelido.trim()};\n}\nif (perfil({nome:\"Lia\",apelido:null})!==undefined || perfil({nome:\"Lia\",apelido:\"  \"})!==undefined ||\n    perfil({nome:\"Lia\",apelido:3})!==undefined) throw new Error(\"opcional inválido\");\nconsole.log(JSON.stringify(perfil({nome:\" Lia \"})));\nconsole.log(JSON.stringify(perfil({nome:\"Lia\",apelido:\" Li \"})));",
          "expectedOutput": [
            "{\"nome\":\"Lia\"}",
            "{\"nome\":\"Lia\",\"apelido\":\"Li\"}"
          ],
          "explanation": [
            "Ausência é testada antes do conteúdo. Um campo opcional presente continua tendo um contrato, portanto null e espaços não são tratados como se a pessoa tivesse omitido o valor.",
            "A construção explícita omite a propriedade na ausência e copia só strings válidas. Trocar essa regra por uma normalização silenciosa esconderia diferenças entre ausência e erro de integração."
          ],
          "checks": [
            "Ausência omite a propriedade apelido.",
            "Apelido presente é string aparada não vazia.",
            "Três formas inválidas são rejeitadas, sem coerção."
          ]
        },
        {
          "id": "tipos",
          "title": "Problema 2: provar o contrato para consumidores",
          "topics": [
            "testes com ts-expect-error",
            "JSON.parse como fronteira unknown"
          ],
          "prompt": "Modele uma união Validacao<T> e uma função consumir que exige {id:string}. Demonstre uma chamada válida, um id numérico rejeitado e o acesso ao valor de sucesso somente depois de ok. Os casos negativos devem passar pelo compilador como expectativas de erro.",
          "solution": "type Validacao<T>={ok:true; valor:T}|{ok:false; erro:string};\nfunction consumir(x:{id:string}):string {return x.id;}\nfunction mostrar(r:Validacao<{id:string}>):string {\n  if (r.ok) return consumir(r.valor);\n  // @ts-expect-error o ramo de falha não contém valor\n  const impossivel:unknown=r.valor;\n  void impossivel;\n  return r.erro;\n}\nfunction contratosNegativos():void {\n  // @ts-expect-error id numérico não atende ao contrato\n  consumir({id:42});\n  const externo:unknown={id:\"p1\"};\n  // @ts-expect-error unknown exige validação antes do consumo\n  consumir(externo);\n}\nvoid contratosNegativos;\nif (mostrar({ok:true,valor:{id:\"p1\"}})!==\"p1\" || mostrar({ok:false,erro:\"id\"})!==\"id\")\n  throw new Error(\"consumidor\");\nconsole.log(mostrar({ok:true,valor:{id:\"p1\"}}));",
          "expectedOutput": [
            "p1"
          ],
          "explanation": [
            "As chamadas negativas ficam numa função que não é executada; elas existem para exigir rejeição estática. O teste de execução usa somente caminhos permitidos pelo contrato.",
            "@ts-expect-error é sensível ao diagnóstico da linha seguinte. Remova a diretiva para observar o erro ou torne a operação válida e veja a diretiva não utilizada ser rejeitada. O narrowing de ok protege o acesso de sucesso."
          ],
          "checks": [
            "Os dois consumidores válidos produzem o resultado esperado.",
            "O compilador exige três diagnósticos nas linhas marcadas.",
            "Explique por que testar um tipo não valida um JSON recebido."
          ]
        }
      ]
    },
    {
      "id": "ts-genericos",
      "title": "TypeScript: genéricos, coleções e variância",
      "level": "Avançado",
      "summary": "Use genéricos para preservar relações entre tipos de entrada e saída, imponha constraints proporcionais ao que a função realmente usa e componha funções sem apagar informações com any. Explore keyof, indexed access, overloads, parâmetros padrão, callbacks e os cuidados de variância em coleções mutáveis.",
      "topics": [
        "generic functions interfaces",
        "constraints extends",
        "keyof indexed access",
        "defaults inference",
        "overloads",
        "callbacks variance",
        "readonly collections",
        "generic classes factories"
      ],
      "sections": [
        {
          "title": "Relações que um tipo amplo perde",
          "text": [
            "Uma função identidade genérica recebe T e devolve T, preservando o tipo específico de cada chamada. Uma versão que recebe unknown e devolve unknown pode executar o mesmo código, mas perde a relação para o chamador.",
            "Crie parâmetros de tipo quando eles ligam pelo menos duas partes do contrato. Um genérico usado apenas para ornamentar a assinatura pode tornar a API mais difícil de usar. A implementação precisa ser válida para qualquer T permitido."
          ]
        },
        {
          "title": "Constraints descrevem o necessário",
          "text": [
            "T extends {id:string} permite usar id e preserva os outros campos de T. A constraint não transforma T no tipo exato {id:string}. Não devolva um objeto arbitrário com id como se fosse T; a chamada pode esperar campos adicionais.",
            "Prefira constraints mínimas e operações que devolvem valores realmente derivados da entrada. Mensagens do compilador que dizem que T poderia ser instanciado com outro subtipo indicam uma promessa de retorno que a implementação não cumpre."
          ]
        },
        {
          "title": "Chaves e acesso relacionado",
          "text": [
            "keyof T descreve chaves de T e T[K] o tipo da propriedade correspondente. Relacionar K extends keyof T impede pedir uma chave incompatível e preserva o retorno de acordo com a chave escolhida.",
            "Object.keys devolve strings em execução e não conhece necessariamente o conjunto exato de propriedades declarado. Não use uma asserção indiscriminada para ignorar chaves extras; defina um contrato de dados fechado ou valide a chave."
          ]
        },
        {
          "title": "Inferência, padrão e overloads",
          "text": [
            "O compilador infere tipos a partir dos argumentos e do contexto. Parâmetros padrão ajudam quando há uma escolha razoável, mas não substituem relações mal definidas. Em algumas chamadas, anotar explicitamente T torna a intenção mais clara.",
            "Overloads descrevem formas de chamada distintas, enquanto uma implementação compatível atende todas. Não crie overloads quando uma união simples resolve o problema com o mesmo retorno; excesso de assinaturas aumenta a manutenção."
          ]
        },
        {
          "title": "Callbacks e variância",
          "text": [
            "Uma função que pode receber qualquer Animal não pode depender de receber apenas Cachorro. Em strictFunctionTypes, parâmetros de funções têm verificações que ajudam a detectar essa promessa indevida. Métodos têm exceções de compatibilidade por razões históricas.",
            "Coleções mutáveis tornam relações de subtipos delicadas: inserir um valor mais amplo em uma referência compatível pode violar o contrato de outra referência. readonly reduz o conjunto de operações e facilita APIs seguras de leitura."
          ]
        },
        {
          "title": "Classes e fábricas genéricas",
          "text": [
            "Uma classe Caixa<T> pode guardar e devolver T com o mesmo contrato. O parâmetro da instância não está automaticamente disponível em membros estáticos; o lado estático é compartilhado, não uma classe separada para cada T.",
            "Factories podem receber uma função construtora ou callback e produzir objetos sem depender de cast. Preserve limites: tipos não garantem que uma coleção recebeu dados externos corretos, nem que um callback não produzirá efeitos."
          ]
        }
      ],
      "code": "function selecionar<T, K extends keyof T>(objeto:T, chave:K):T[K] {\n  return objeto[chave];\n}\nfunction mapear<T,U>(itens:readonly T[], transformar:(item:T)=>U):U[] {\n  return itens.map(transformar);\n}\nconst aluno={nome:\"Lia\",pontos:12};\nconst pontos=selecionar(aluno,\"pontos\");\nconsole.log(mapear([pontos,3],n=>n*2));",
      "output": "A saída é [24, 6]. selecionar preserva number para a chave pontos; mapear relaciona o tipo de cada entrada ao retorno do callback.",
      "trace": [
        "K é restringido às chaves do objeto.",
        "T[K] conserva o tipo da propriedade selecionada.",
        "readonly impede mapear de alterar o array recebido por sua referência."
      ],
      "exercise": "Implemente agrupar<T,K extends string>(itens: readonly T[], chave:(item:T)=>K):Map<K,T[]> sem any. Cada grupo deve receber uma lista independente e conservar a ordem dos itens.",
      "solution": "function agrupar<T,K extends string>(itens:readonly T[],chave:(item:T)=>K):Map<K,T[]> {\n  const grupos=new Map<K,T[]>();\n  for(const item of itens){\n    const k=chave(item);\n    const grupo=grupos.get(k);\n    if(grupo)grupo.push(item);else grupos.set(k,[item]);\n  }\n  return grupos;\n}\nconsole.log(agrupar([\"a\",\"ab\",\"b\"],s=>String(s.length)));",
      "bug": "Um cast para T pode prometer campos que a implementação não criou. Constraints mínimas autorizam ler esses campos, mas não fabricar qualquer subtipo possível.",
      "bugCode": "function reiniciar<T extends {id:string}>(valor:T):T {\n  return {id:valor.id} as T;\n}\nconst item=reiniciar({id:\"1\",nome:\"Lia\"});\nconsole.log(item.nome.toUpperCase());",
      "repair": "Devolva {...valor} preservando os campos quando esse é o contrato, ou declare o retorno como {id:string} se a função realmente descarta os demais. Retire o cast e deixe o compilador mostrar a promessa inconsistente.",
      "checks": [
        "Mantém o tipo dos elementos em cada grupo.",
        "Não compartilha a mesma lista entre chaves.",
        "Não altera o array de entrada nem usa any para escapar da verificação."
      ],
      "project": "Crie utilitários tipados para selecionar campos, agrupar registros e transformar uma sequência. Mostre chamadas com dados diferentes e confira no editor os tipos inferidos de cada retorno.",
      "question": "O que uma constraint T extends {id:string} garante?",
      "answer": "T tem id string, podendo possuir outros campos que devem ser preservados quando o retorno promete T.",
      "distractors": [
        "T tem exatamente um campo e nenhum outro.",
        "Qualquer objeto com id pode ser devolvido como qualquer T."
      ]
    },
    {
      "id": "ts-genericos-relacoes",
      "title": "TypeScript: genéricos que preservam relações entre dados",
      "level": "Avançado",
      "summary": "Use parâmetros de tipo para manter uma relação que se perderia com any ou unions desconectadas. Esta aula constrói seleção de propriedade e transformação de coleções, compara constraints com assertions e mostra por que uma função genérica não pode inventar qualquer T. Os problemas incluem keyof, indexed access, inferência e casos negativos conferidos pelo compilador.",
      "source": "https://www.typescriptlang.org/docs/handbook/2/generics.html",
      "topics": [
        "parâmetro de tipo como relação",
        "inferência do tipo de retorno",
        "constraint extends",
        "keyof e chave válida",
        "indexed access T K",
        "readonly na entrada genérica",
        "tipo específico não inventado",
        "teste negativo de propriedade"
      ],
      "sections": [
        {
          "title": "Um genérico preserva informação da chamada",
          "text": [
            "Uma função identidade que recebe any e retorna any permite a chamada, mas perde a relação estática entre entrada e saída. Uma função identidade<T>(valor: T): T conserva essa relação: se a chamada recebe um objeto com nome, o retorno ainda descreve aquele objeto. O parâmetro T não é um objeto de execução e não cria uma verificação do dado. Ele liga posições do contrato analisado pelo compilador.",
            "Use um parâmetro de tipo quando a operação realmente relaciona dados, como elemento de uma coleção e resultado encontrado. Acrescentar letras genéricas sem uma relação pode tornar a assinatura mais difícil sem aumentar a garantia. Uma função que sempre devolve string provavelmente pode declarar string diretamente. Uma função que transforma T em U precisa dizer de onde vem a transformação, normalmente por um callback ou outro argumento que estabelece U."
          ]
        },
        {
          "title": "Inferência aproveita os argumentos disponíveis",
          "text": [
            "O compilador pode inferir T a partir da entrada e U a partir do callback de transformação. Isso reduz a necessidade de escrever parâmetros de tipo na chamada e mantém informação específica. Se uma função recebe readonly T[] e um callback (valor: T) => U, pode devolver U[] sem usar assertions. A implementação cria uma coleção nova e aplica o callback a cada valor, preservando o contrato de elemento.",
            "A inferência depende do contexto e das relações oferecidas pela assinatura. Se você anota um argumento como um tipo amplo antes de chamar, parte da informação já pode ter sido perdida. Um parâmetro explícito pode ser útil, mas não deve servir para afirmar um tipo incompatível com o dado. Confira qual tipo entrou na chamada e qual saiu, em vez de assumir que o genérico sempre reconstrói a forma original mais estreita."
          ]
        },
        {
          "title": "Constraints limitam operações permitidas",
          "text": [
            "T extends { id: string } informa que todo T aceito oferece ao menos id string, então a função pode ler essa propriedade. A constraint não significa que T é exatamente aquele objeto mínimo. Uma chamada pode escolher um T com campos adicionais obrigatórios. Por isso uma implementação que promete devolver T não pode simplesmente construir { id: 'x' } e presumir que satisfez todos os requisitos do tipo concreto.",
            "A mensagem de que algo atende à constraint mas T poderia ser outro subtipo aponta essa diferença. Retorne o dado recebido, um tipo mínimo declarado ou use uma fábrica fornecida pelo chamador para construir o tipo concreto. Uma assertion as T pode apagar o diagnóstico sem produzir os campos ausentes. O contrato genérico precisa ser realizável para todas as instâncias de tipo que a assinatura aceita."
          ]
        },
        {
          "title": "Uma chave depende da forma do objeto",
          "text": [
            "keyof T descreve as chaves conhecidas de T. Um segundo parâmetro K extends keyof T conecta a chave ao objeto, e o retorno T[K] representa o tipo da propriedade selecionada. Se o objeto tem id number e nome string, escolher id devolve number, enquanto escolher nome devolve string. Uma chave inexistente deve ser rejeitada na chamada, sem precisar esperar por undefined em runtime.",
            "Essa relação não valida automaticamente um texto recebido de uma URL como chave segura. Uma variável string ampla pode não pertencer a keyof do objeto e precisa de uma verificação na fronteira. Também existem objetos com index signatures que aceitam conjuntos mais amplos de chaves. Estude a assinatura real do modelo antes de tratar keyof como uma lista fechada em qualquer contexto."
          ]
        },
        {
          "title": "Somente leitura e ausência continuam fazendo parte do tipo",
          "text": [
            "Um parâmetro readonly T[] permite receber coleções de leitura e evita mutação por essa referência na implementação. Uma função que transforma a coleção produz outra, preservando a entrada. Readonly não faz uma cópia e não estabelece imutabilidade profunda para o elemento T. Se T contém objetos mutáveis, o callback ainda pode produzir efeitos ou compartilhar dados, dependendo de seu contrato.",
            "Se uma propriedade é opcional, o indexed access correspondente inclui a possibilidade de undefined sob strictNullChecks. O genérico deve preservar essa informação e o consumidor precisa tratá-la. Uma assinatura que apaga ausência por assertion devolve uma visão mais conveniente, mas não uma garantia maior. Teste um objeto sem a propriedade opcional para conferir o comportamento que o tipo promete."
          ]
        },
        {
          "title": "Tipos específicos precisam de testes específicos",
          "text": [
            "Use verificações de atribuição para exigir que uma seleção de id seja number e uma seleção de nome seja string. Acrescente @ts-expect-error nas chamadas com chave inexistente e em atribuições de retorno incompatível. Cada expectativa negativa deve mirar um erro concreto. Se a função passar a retornar any, esses testes podem revelar a perda do contrato porque as operações inválidas deixam de ser rejeitadas.",
            "Execute também os exemplos após o apagamento dos tipos. A implementação pode selecionar a chave errada ou modificar o array recebido mesmo que sua assinatura pareça adequada. Nesta aula a análise strict e a comparação de saídas conferem as duas dimensões. Transfira a relação genérica para um seletor de catálogo ou uma biblioteca de coleções, mantendo dados externos unknown até a validação."
          ]
        }
      ],
      "code": "function ler<T,K extends keyof T>(objeto:T,chave:K):T[K] {\n  return objeto[chave];\n}\nconst pessoa={id:7,nome:\"Lia\"};\nconst id:number=ler(pessoa,\"id\");\nconst nome:string=ler(pessoa,\"nome\");\nfunction contratosNegativos():void {\n  // @ts-expect-error a chave não existe em pessoa\n  ler(pessoa,\"idade\");\n  // @ts-expect-error a seleção de id retorna number\n  const errado:string=ler(pessoa,\"id\");\n  void errado;\n}\nvoid contratosNegativos;\nif (id!==7 || nome!==\"Lia\") throw new Error(\"seleção\");\nconsole.log(id,nome);",
      "expectedOutput": [
        "7 Lia"
      ],
      "output": "Saída: 7 Lia. O compilador conserva o tipo de cada propriedade e exige os diagnósticos das duas operações negativas.",
      "trace": [
        "T é inferido da forma do objeto e K do literal da chave.",
        "A constraint impede escolher uma chave que não pertence ao objeto.",
        "T[K] mantém a relação de retorno, em vez de produzir any ou uma union desnecessariamente ampla."
      ],
      "exercise": "Implemente transformar<T,U> que recebe readonly T[] e um callback, retornando uma nova U[]. Transforme números em textos com prefixo, aceite vazio e confira que o array original não muda.",
      "solution": "function transformar<T,U>(valores:readonly T[],mapear:(valor:T)=>U):U[] {\n  const resultado:U[]=[];\n  for (const valor of valores) resultado.push(mapear(valor));\n  return resultado;\n}\nconst original:readonly number[]=[1,2];\nconst textos:string[]=transformar(original,n=>\"n=\"+n);\nif (JSON.stringify(textos)!=='[\"n=1\",\"n=2\"]' || original[0]!==1 || transformar([],x=>x).length!==0)\n  throw new Error(\"transformação\");\nconsole.log(JSON.stringify(textos));",
      "solutionOutput": [
        "[\"n=1\",\"n=2\"]"
      ],
      "bug": "A função promete qualquer T que possua id, mas cria somente o objeto mínimo. Um T concreto também pode exigir nome; uma assertion não cria esse campo em runtime.",
      "bugCode": "function criar<T extends {id:string}>():T {\n  return {id:\"x\"} as T; // promessa sem os campos de um T concreto\n}\nconst pessoa=criar<{id:string;nome:string}>();\nconsole.log(pessoa.nome); // undefined",
      "repair": "Retorne {id:string} se esse é o valor que a função constrói, ou receba uma fábrica () => T do chamador. Não use as T para prometer campos que a implementação não sabe construir.",
      "checks": [
        "A seleção mantém number ou string conforme a chave.",
        "Chaves inexistentes são rejeitadas pelo compilador.",
        "Uma transformação produz outra coleção sem apagar o tipo dos elementos."
      ],
      "project": "Crie uma biblioteca pequena com ler, transformar e buscar por id. Documente ausência na busca e mutação no callback. Inclua testes de tipo que falham se a API for alargada para any, além de testes de resultado e preservação da entrada.",
      "question": "Por que T extends {id:string} não permite construir qualquer T só com {id:'x'}?",
      "answer": "Um T aceito pode exigir outros campos além dos garantidos pela constraint.",
      "distractors": [
        "Extends exige que T seja exatamente o objeto mínimo, sem campos adicionais.",
        "O compilador cria automaticamente os campos restantes quando encontra as T."
      ],
      "practices": [
        {
          "id": "opcional",
          "title": "Problema 1: seleção de propriedade opcional",
          "topics": [
            "indexed access T K",
            "keyof e chave válida",
            "inferência do tipo de retorno",
            "teste negativo de propriedade"
          ],
          "prompt": "Implemente ler e use um tipo com id obrigatório e apelido opcional. A seleção de apelido precisa ser string | undefined, e uma atribuição direta a string deve ser um erro esperado. Execute com o campo ausente.",
          "solution": "function ler<T,K extends keyof T>(objeto:T,chave:K):T[K] {return objeto[chave];}\ntype Perfil={id:number;apelido?:string};\nconst perfil:Perfil={id:1};\nconst nome:string|undefined=ler(perfil,\"apelido\");\nfunction negativo():void {\n  // @ts-expect-error apelido pode estar ausente\n  const obrigatorio:string=ler(perfil,\"apelido\");\n  void obrigatorio;\n}\nvoid negativo;\nif (nome!==undefined || ler(perfil,\"id\")!==1) throw new Error(\"ausência\");\nconsole.log(String(nome));",
          "expectedOutput": [
            "undefined"
          ],
          "explanation": [
            "A relação T[K] preserva a opcionalidade do campo. A declaração do modelo, e não um valor padrão inventado na seleção, determina a possibilidade de undefined.",
            "O caso negativo garante que strictNullChecks continue exigindo tratamento da ausência. A execução mostra que o objeto realmente não tem apelido; a análise estática não substitui esse teste de comportamento."
          ],
          "checks": [
            "O retorno inclui undefined.",
            "A atribuição que apaga ausência exige um diagnóstico.",
            "O id obrigatório continua retornando number."
          ]
        },
        {
          "id": "fabrica",
          "title": "Problema 2: construir T por uma fábrica",
          "topics": [
            "constraint extends",
            "tipo específico não inventado",
            "parâmetro de tipo como relação"
          ],
          "prompt": "Receba uma fábrica () => T para produzir um objeto com id e campos específicos. Preserve o T inferido, exija id string e teste a rejeição de uma fábrica com id numérico. Não use assertions.",
          "solution": "function produzir<T extends {id:string}>(fabrica:()=>T):T {\n  return fabrica();\n}\nconst pessoa=produzir(()=>({id:\"p1\",nome:\"Lia\"}));\nconst nome:string=pessoa.nome;\nfunction negativo():void {\n  // @ts-expect-error id numérico não atende à constraint\n  produzir(()=>({id:1}));\n}\nvoid negativo;\nif (pessoa.id!==\"p1\" || nome!==\"Lia\") throw new Error(\"fábrica\");\nconsole.log(pessoa.id,nome);",
          "expectedOutput": [
            "p1 Lia"
          ],
          "explanation": [
            "Quem chama fornece a construção do tipo concreto e a função genérica preserva o resultado dessa fábrica. A implementação não tenta fabricar campos que desconhece.",
            "A constraint limita o conjunto de fábricas aceitas sem reduzir T ao objeto mínimo. O teste negativo protege a regra de id, e o teste positivo confirma que nome permanece disponível com tipo string."
          ],
          "checks": [
            "O campo específico nome é preservado.",
            "Id numérico é rejeitado no teste de tipos.",
            "A implementação retorna o valor produzido sem assertions."
          ]
        }
      ]
    },
    {
      "id": "ts-variancia-contratos",
      "title": "TypeScript: variância, callbacks e contratos de leitura e escrita",
      "level": "Avançado",
      "summary": "Raciocine sobre substituição a partir das operações que uma API oferece. Compare produtores, consumidores e células de leitura e escrita; examine por que um callback que exige mais dados não pode atender a todos os valores de um contrato amplo. Os exemplos distinguem aceitação pelo compilador, comportamento real e limite das assinaturas de método. Há testes positivos e negativos em strict, exercícios de borda e duas práticas independentes.",
      "source": "https://www.typescriptlang.org/tsconfig/strictFunctionTypes.html",
      "topics": [
        "compatibilidade estrutural",
        "covariância de resultados",
        "contravariância de parâmetros",
        "invariância de leitura e escrita",
        "strictFunctionTypes",
        "método versus propriedade de função",
        "readonly e mutação por alias",
        "contrato de callback",
        "testes negativos com ts-expect-error",
        "limites de anotações in e out"
      ],
      "sections": [
        {
          "title": "Substituir significa cumprir as operações prometidas",
          "text": [
            "Um tipo estrutural descreve as operações disponíveis em um valor. Considere Registro com id e RegistroDetalhado com id e pontos. Um registro detalhado pode atender a quem apenas lê o id; a presença de pontos não atrapalha essa leitura. A direção pode mudar quando o valor é um componente que recebe registros. Antes de comparar duas APIs genéricas, escreva o que cada operação recebe e devolve, depois pergunte quais chamadas o consumidor do contrato pode fazer.",
            "Nomes como Base e Especial não resolvem a substituição sozinhos. Uma API que lê dados, uma que recebe dados e uma que faz as duas coisas têm responsabilidades diferentes. Nesta aula as relações são verificadas com objetos pequenos e funções síncronas. O exemplo mantém uma lista de efeitos observáveis para separar duas perguntas: o compilador aceita a atribuição e a execução atende às entradas que o contrato permite? Nenhuma delas deve ser presumida a partir de uma anotação de tipo."
          ]
        },
        {
          "title": "Uma fonte pode devolver um valor mais específico",
          "text": [
            "Se Fonte<T> oferece apenas uma função ler que devolve T, uma fonte de registros detalhados pode ser vista como fonte de registros básicos. Todo resultado obtido continua oferecendo id. Essa relação acompanha a direção da compatibilidade entre os valores e é chamada covariância. O caminho inverso é inadequado: uma fonte que promete só id não garante pontos. Um consumidor que tentasse somar pontos poderia receber undefined.",
            "Esse raciocínio funciona porque a operação observada só produz T. Adicionar outra operação que receba T pode alterar o contrato. Não escolha uma direção de variância pelo nome do parâmetro genérico ou pela quantidade de campos. Desenhe uma chamada permitida e tente executá-la mentalmente. Para a direção rejeitada, use um registro sem pontos como contraexemplo; para a direção aceita, mostre por que todas as leituras ainda encontram o campo prometido. As funções expostas no exemplo são propriedades readonly: a referência dessa interface não permite substituir ler ou usar. Isso reduz as operações disponíveis nessa vista, sem prometer que todo alias externo esteja protegido ou que o objeto seja congelado em execução."
          ]
        },
        {
          "title": "Um consumidor precisa aceitar todas as entradas do contrato",
          "text": [
            "Se Destino<T> contém usar: (item: T) => void, um destino que atende a todo Registro pode processar também RegistroDetalhado. Assim ele pode ocupar uma posição que receberá apenas registros detalhados. A direção é inversa à dos resultados, recebendo o nome contravariância. Um destino que depende de pontos não pode ocupar uma posição que promete aceitar qualquer Registro, porque id sozinho é uma entrada válida nessa posição.",
            "strictFunctionTypes verifica essa relação para parâmetros em assinaturas de função. O modo strict habilita essa opção, salvo uma configuração explícita em contrário. Um callback amplo pode ignorar campos extras; um callback restrito não pode inventar o que falta. Escreva o tipo da posição que vai chamar o callback, não apenas o tipo de uma entrada usada no primeiro teste. Os exercícios fornecem também uma coleção vazia, para verificar que nenhuma chamada indevida é feita quando não há elementos."
          ]
        },
        {
          "title": "Receber e devolver o mesmo T combina duas exigências",
          "text": [
            "Uma célula que oferece ler: () => T e gravar: (valor: T) => void produz e consome o mesmo tipo. Tratar uma célula detalhada como básica permitiria gravar um registro sem pontos e depois lê-lo pela referência detalhada original. Tratar uma célula básica como detalhada permitiria ler pontos que nunca foram prometidos. Com essas propriedades de função em strict, a célula precisa conservar o mesmo contrato nas duas operações: a relação é invariante.",
            "Separe interfaces quando diferentes clientes só precisam de leitura ou só de escrita. Um leitor pode receber a vista da operação ler sem ganhar a possibilidade de gravar um valor inadequado. Essa separação explicita permissões, mas não cria uma cópia dos dados. Se duas referências alcançam o mesmo objeto, mudanças feitas por uma podem aparecer na outra. O exercício usa uma célula com estado e registra esse compartilhamento; não promete snapshot independente ou congelamento profundo."
          ]
        },
        {
          "title": "Métodos e readonly têm limites que precisam aparecer nos testes",
          "text": [
            "A assinatura processar(item: T): string descreve um método; processar: (item: T) => string descreve uma propriedade de função. O tratamento de parâmetros de métodos permite compatibilidades mais permissivas que as propriedades sob strictFunctionTypes. Portanto reescrever uma propriedade como método pode mudar quais atribuições passam, mesmo que a implementação JavaScript faça a mesma operação. O segundo problema mostra uma atribuição aceita que ainda falha ao receber uma entrada válida do contrato amplo.",
            "readonly restringe certas alterações pela referência tipada. Um readonly Registro[] evita push nessa referência, mas não impede outra referência mutável de alterar a mesma coleção, nem torna campos internos imutáveis. Para um algoritmo que só lê, aceitar readonly reduz permissões necessárias e permite receber fontes congeladas. Uma garantia de imutabilidade em execução exige uma decisão adicional sobre cópias, congelamento e objetos internos, acompanhada por casos que exponham os aliases relevantes."
          ]
        },
        {
          "title": "Teste aceitação, rejeição e execução como evidências distintas",
          "text": [
            "Um teste negativo pode colocar uma atribuição proibida atrás de if (false) e usar @ts-expect-error na linha correspondente. O compilador ainda verifica essa linha; se o erro esperado desaparecer, a diretiva sem erro gera um diagnóstico. O ramo evita executar a operação inválida no programa de referência. Esse mecanismo não comprova qual código específico de diagnóstico apareceu, por isso mantenha a linha simples e use também exemplos positivos com o contrato correto.",
            "in e out são anotações avançadas de variância em parâmetros de certos tipos genéricos; elas não validam JSON ou alteram JavaScript emitido. Seu efeito é limitado a certas comparações de instanciações, e não substitui a definição estrutural das operações. As práticas desta aula usam a estrutura das funções sem depender dessas anotações. Ao desenhar uma biblioteca, comece pelos casos de substituição e pela configuração real de compilação; investigue as anotações quando existir uma necessidade específica de diagnóstico ou desempenho."
          ]
        }
      ],
      "code": "type Registro = {id: string};\ntype Detalhado = Registro & {pontos: number};\ntype Fonte<T> = {readonly ler: () => T};\ntype Destino<T> = {readonly usar: (item: T) => void};\n\nconst observados: string[] = [];\nconst detalhada: Fonte<Detalhado> = {ler: () => ({id: \"A1\", pontos: 7})};\nconst basica: Fonte<Registro> = detalhada;\nconst geral: Destino<Registro> = {usar: item => {observados.push(item.id);}};\nconst especifico: Destino<Detalhado> = geral;\nespecifico.usar(detalhada.ler());\nif (basica.ler().id !== \"A1\") throw new Error(\"leitura divergente\");\n\nif (false) {\n    // @ts-expect-error uma fonte básica não promete pontos\n    const fonteErrada: Fonte<Detalhado> = basica;\n    // @ts-expect-error um destino restrito não aceita todo Registro\n    const destinoErrado: Destino<Registro> = especifico;\n    // @ts-expect-error uma vista de leitura não permite substituir ler\n    basica.ler = () => ({id: \"novo\"});\n    // @ts-expect-error o cliente não pode substituir o callback exposto\n    geral.usar = () => {};\n    void fonteErrada;\n    void destinoErrado;\n}\nconsole.log(JSON.stringify(observados));",
      "expectedOutput": [
        "[\"A1\"]"
      ],
      "output": "Saída: [\"A1\"]. A fonte detalhada atende à leitura básica; o consumidor básico atende ao envio detalhado. As duas direções contrárias têm rejeição esperada em strict, sem executar os ramos inválidos.",
      "trace": [
        "Fonte<Detalhado> devolve um valor que conserva o id prometido por Fonte<Registro>.",
        "Destino<Registro> aceita o registro com pontos recebido pela vista Destino<Detalhado>.",
        "As atribuições contrárias são verificadas pelo compilador dentro de um ramo não executado."
      ],
      "exercise": "Implemente criarCelula<T>(inicial) com ler: () => T e gravar: (novo: T) => void. O estado deve ser separado por chamada da fábrica. Para Registro e Detalhado, escreva dois testes de atribuição rejeitada em strict e obtenha uma vista somente de leitura de uma célula detalhada como fonte básica. Não use any, assertions ou assinatura de método para esconder as rejeições.",
      "solution": "type Registro = {id: string};\ntype Detalhado = Registro & {pontos: number};\ntype Celula<T> = {readonly ler: () => T; readonly gravar: (novo: T) => void};\ntype Leitura<T> = {readonly ler: () => T};\nfunction criarCelula<T>(inicial: T): Celula<T> {\n    let atual = inicial;\n    return {ler: () => atual, gravar: novo => {atual = novo;}};\n}\nconst detalhada = criarCelula<Detalhado>({id: \"A\", pontos: 2});\nconst basica = criarCelula<Registro>({id: \"B\"});\nconst leitura: Leitura<Registro> = detalhada;\ndetalhada.gravar({id: \"C\", pontos: 5});\nif (leitura.ler().id !== \"C\" || basica.ler().id !== \"B\")\n    throw new Error(\"estado compartilhado entre fábricas\");\nif (false) {\n    // @ts-expect-error a escrita ampla quebraria a célula detalhada\n    const escritaAmpla: Celula<Registro> = detalhada;\n    // @ts-expect-error a leitura básica não garante pontos\n    const leituraRestrita: Celula<Detalhado> = basica;\n    void escritaAmpla;\n    void leituraRestrita;\n}\nconsole.log(detalhada.ler().id, detalhada.ler().pontos, basica.ler().id);",
      "solutionOutput": [
        "C 5 B"
      ],
      "bug": "O método aceita uma atribuição mais permissiva e o código passa em strict, mas o contrato amplo pode chamar processar com um objeto sem pontos. toFixed então falha na execução. Aceitação pelo compilador não comprova segurança de toda chamada em estruturas com essa exceção de compatibilidade.",
      "bugCode": "type Registro = {id: string};\ntype Detalhado = Registro & {pontos: number};\ntype Metodo<T> = {processar(item: T): string};\nconst restrito: Metodo<Detalhado> = {\n    processar(item) {return item.pontos.toFixed(0);}\n};\nconst amplo: Metodo<Registro> = restrito;\nconsole.log(amplo.processar({id: \"sem pontos\"}));",
      "repair": "Declare processar como propriedade de função quando o contrato deve exigir a checagem de parâmetros em strict. O consumidor da API precisa atender a qualquer entrada válida da posição em que será chamado. Corrigir o formato da assinatura torna a atribuição inadequada visível; ainda é preciso implementar o callback amplo ou restringir o contrato de quem o chama.",
      "checks": [
        "Justifique as direções de substituição com uma chamada concreta, incluindo a entrada que falha.",
        "Compile casos aceitos e rejeitados com strict e mantenha o erro de tipo distinto do resultado em execução.",
        "Conserve fronteiras de leitura e escrita e explicite o compartilhamento por alias, sem prometer congelamento inexistente."
      ],
      "project": "Crie uma biblioteca pequena de leitura e processamento de registros. Separe Fonte, Destino e Celula por operações; inclua consumidores básicos e detalhados e uma rotina que só lê readonly arrays. Entregue testes positivos de tipos, testes negativos simples, casos de vazio e erro do callback e resultados reais. Uma integração com JSON exige validação separada antes dessa biblioteca. O projeto é revisado manualmente e a compilação da referência no CI não avalia automaticamente sua implementação.",
      "question": "Uma posição promete chamar um callback com qualquer Registro, que oferece apenas id. Qual callback atende ao contrato?",
      "answer": "Um callback que aceita todo Registro; exigir pontos restringe entradas que a posição pode fornecer.",
      "distractors": [
        "Qualquer callback de RegistroDetalhado, pois campos adicionais sempre tornam parâmetros mais seguros.",
        "Somente um callback com any, porque strict impede funções de receber objetos estruturais."
      ],
      "practices": [
        {
          "id": "callbacks",
          "title": "Problema 1: aplicar um consumidor sem restringir a origem",
          "topics": [
            "contravariância de parâmetros",
            "contrato de callback",
            "testes negativos com ts-expect-error"
          ],
          "prompt": "Implemente aplicarTodos<T>(itens: readonly T[], usar: (item: T) => void). Percorra em ordem sem alterar a coleção. Vazio não chama usar; uma exceção do callback deve interromper o processamento e continuar visível. Um consumidor básico deve aceitar itens detalhados; o caminho inverso deve falhar em strict. O callback é síncrono e pode produzir efeitos próprios.",
          "solution": "type Registro = {id: string};\ntype Detalhado = Registro & {pontos: number};\nfunction aplicarTodos<T>(itens: readonly T[], usar: (item: T) => void): void {\n    for (const item of itens) usar(item);\n}\nconst vistos: string[] = [];\nconst consumirBasico = (item: Registro): void => {vistos.push(item.id);};\nconst detalhes: readonly Detalhado[] = Object.freeze([\n    {id: \"A\", pontos: 1}, {id: \"B\", pontos: 2}\n]);\naplicarTodos<Detalhado>(detalhes, consumirBasico);\naplicarTodos<Registro>([], consumirBasico);\nif (JSON.stringify(vistos) !== '[\"A\",\"B\"]' || detalhes.length !== 2)\n    throw new Error(\"ordem, vazio ou origem divergente\");\nconst antesErro: number[] = [];\nconst esperado = new Error(\"callback falhou\");\nlet propagou = false;\ntry {\n    aplicarTodos([1, 2, 3], numero => {\n        antesErro.push(numero);\n        if (numero === 2) throw esperado;\n    });\n} catch (erro) {\n    if (erro !== esperado) throw erro;\n    propagou = true;\n}\nif (!propagou) throw new Error(\"erro foi suprimido\");\nif (JSON.stringify(antesErro) !== \"[1,2]\") throw new Error(\"não interrompeu\");\nif (false) {\n    const bases: readonly Registro[] = [{id: \"sem pontos\"}];\n    const soDetalhe = (item: Detalhado): void => {void item.pontos;};\n    // @ts-expect-error o callback não atende a todos os itens da origem básica\n    aplicarTodos<Registro>(bases, soDetalhe);\n}\nconsole.log(JSON.stringify(vistos), JSON.stringify(antesErro));",
          "expectedOutput": [
            "[\"A\",\"B\"] [1,2]"
          ],
          "explanation": [
            "O parâmetro readonly impede que a rotina precise de operações de escrita na coleção e permite receber uma coleção congelada. A função só percorre e chama o colaborador recebido. Um callback que aceita o registro básico atende a todos os detalhados dessa origem. O teste inverso explicita o argumento genérico para que a rejeição esteja ligada exatamente ao contrato básico.",
            "A coleção vazia não acrescenta observações. Quando o callback falha no segundo elemento, a rotina não captura a exceção e não processa o terceiro. O teste compara a identidade do erro e a sequência de efeitos; ele não promete desfazer os efeitos já realizados pelo callback. readonly também não impede que um colaborador com outra referência modifique campos internos."
          ],
          "checks": [
            "Consumidor básico processa detalhados em ordem; vazio não chama o callback.",
            "Callback restrito para origem básica é rejeitado em strict.",
            "Erro conserva identidade e interrompe antes do próximo elemento, sem mutar a coleção pela rotina."
          ]
        },
        {
          "id": "metodos",
          "title": "Problema 2: detectar a brecha de uma assinatura de método",
          "topics": [
            "strictFunctionTypes",
            "método versus propriedade de função",
            "contrato de callback",
            "testes negativos com ts-expect-error"
          ],
          "prompt": "Construa um caso com um método que usa pontos e pode ser atribuído a um contrato que oferece apenas id. Demonstre o erro em execução usando uma entrada básica. Em seguida substitua a assinatura por propriedade de função, verificando em strict que a mesma atribuição é rejeitada e que um callback amplo continua válido para entradas detalhadas.",
          "solution": "type Registro = {id: string};\ntype Detalhado = Registro & {pontos: number};\ntype Metodo<T> = {processar(item: T): string};\ntype Propriedade<T> = {processar: (item: T) => string};\nconst metodoRestrito: Metodo<Detalhado> = {\n    processar(item) {return item.pontos.toFixed(0);}\n};\nconst metodoAmplo: Metodo<Registro> = metodoRestrito;\nlet falhou = false;\ntry {\n    metodoAmplo.processar({id: \"A\"});\n} catch (erro) {\n    if (!(erro instanceof TypeError)) throw erro;\n    falhou = true;\n}\nif (!falhou) throw new Error(\"falha não demonstrada\");\nconst propriedadeRestrita: Propriedade<Detalhado> = {\n    processar: item => item.pontos.toFixed(0)\n};\nconst propriedadeAmpla: Propriedade<Registro> = {\n    processar: item => item.id\n};\nconst destinoDetalhado: Propriedade<Detalhado> = propriedadeAmpla;\nif (false) {\n    // @ts-expect-error propriedades de função conferem a restrição do parâmetro\n    const invalida: Propriedade<Registro> = propriedadeRestrita;\n    void invalida;\n}\nconst resultado = destinoDetalhado.processar({id: \"B\", pontos: 4});\nif (resultado !== \"B\") throw new Error(\"substituição válida falhou\");\nconsole.log(falhou, resultado);",
          "expectedOutput": [
            "true B"
          ],
          "explanation": [
            "A assinatura de método permite a relação mais permissiva, mas a entrada básica continua sem pontos em JavaScript. O exemplo captura apenas a TypeError esperada e verifica que a falha realmente aconteceu; não transforma toda exceção em sucesso. Essa demonstração liga a aceitação de tipos a uma chamada concreta que ela não protege.",
            "A propriedade de função coloca o parâmetro sob a relação exigida por strictFunctionTypes. O caso negativo é simples e fica num ramo que não executa; uma alteração que torne a atribuição aceita faz a diretiva gerar diagnóstico de erro ausente. O caminho válido mantém a direção oposta: uma implementação que lê apenas id pode atender à posição que recebe registros detalhados."
          ],
          "checks": [
            "Método amplo recebe registro básico e a falha real esperada é observada.",
            "A atribuição restrita via propriedade é rejeitada em strict.",
            "A implementação básica atende à posição detalhada e devolve o id previsto."
          ]
        }
      ]
    },
    {
      "id": "ts-tipos-avancados",
      "title": "TypeScript: transformação e programação de tipos",
      "level": "Avançado",
      "summary": "Explore mapped types, conditional types, infer e template literal types como ferramentas para derivar contratos de uma fonte comum. Entenda distribuição sobre uniões, utilitários e limites de legibilidade, evitando tornar o sistema de tipos um programa complexo que a equipe não consegue manter.",
      "topics": [
        "mapped types modifiers",
        "Pick Omit Partial Required Readonly",
        "Record Exclude Extract",
        "conditional types distribution",
        "infer ReturnType Parameters Awaited",
        "template literal types",
        "key remapping",
        "recursive types limits"
      ],
      "sections": [
        {
          "title": "Derivar contratos sem duplicar campos",
          "text": [
            "Mapped types percorrem chaves de um tipo para produzir outro. Modificadores +? e -? adicionam ou removem opcionalidade; readonly pode ser adicionado ou removido. A transformação opera no modelo de tipos, sem criar objetos em execução.",
            "Pick seleciona campos e Omit os exclui; Partial torna campos opcionais e Required os exige. Partial não representa automaticamente um patch válido: algumas combinações continuam precisando de validação de domínio."
          ]
        },
        {
          "title": "Utilitários e coleções de alternativas",
          "text": [
            "Record<K,V> descreve um mapeamento de chaves K a valores V. Se K é string, a leitura de uma chave inexistente continua sendo um problema em execução; configure noUncheckedIndexedAccess ou use um contrato parcial.",
            "Exclude e Extract filtram alternativas de uniões, não propriedades de objetos. NonNullable remove null e undefined. Saiba se a operação trabalha em chaves, propriedades ou variantes para escolher o utilitário adequado."
          ]
        },
        {
          "title": "Tipos condicionais",
          "text": [
            "T extends U ? A : B escolhe um tipo conforme uma relação. Quando T é um parâmetro de tipo diretamente no teste, um tipo condicional pode distribuir sobre membros de uma união. Isso é útil para transformar cada alternativa separadamente.",
            "Colocar os lados em tuplas, como [T] extends [U], evita a distribuição nesse padrão. A diferença muda resultados de forma significativa; escreva exemplos com string | number para verificar sua intenção antes de usar o tipo em uma API."
          ]
        },
        {
          "title": "infer e extração de relações",
          "text": [
            "infer captura uma parte da estrutura comparada em um tipo condicional. Utilitários como ReturnType, Parameters e Awaited já implementam extrações comuns; use-os antes de escrever um tipo recursivo próprio.",
            "A extração depende da forma disponível e pode perder relações em overloads ou genéricos amplos. O último overload tem papel importante em algumas inferências. Teste contratos com exemplos representativos em vez de assumir que toda assinatura produz a mesma informação."
          ]
        },
        {
          "title": "Chaves remapeadas e strings tipadas",
          "text": [
            "Template literal types combinam literais, como 'alterou:' com chaves de um modelo. Mapped types podem remapear chaves usando as. Assim, nomes de eventos podem acompanhar os campos originais sem duplicação manual.",
            "Essa união finita ajuda a conferir nomes, mas não valida qualquer string recebida pela rede. Muitos produtos de uniões podem gerar grande quantidade de alternativas e diagnósticos lentos; preserve clareza e custo razoável."
          ]
        },
        {
          "title": "Limites e engenharia dos tipos",
          "text": [
            "Tipos recursivos podem descrever estruturas aninhadas, mas transformações profundas devem definir como tratar arrays, funções e objetos especiais. Um DeepReadonly ingênuo pode alterar contratos que não pretendia alterar.",
            "Meça a experiência do editor e a qualidade dos erros. Um tipo curto e uma validação explícita podem ser melhores que uma transformação difícil de explicar. Documente exemplos aceitos e rejeitados para tipos avançados que fazem parte de uma API pública."
          ]
        }
      ],
      "code": "type Modelo={nome:string;pontos:number};\ntype Evento<T>={ [K in keyof T & string]: {nome:`alterou:${K}`;valor:T[K]} }[keyof T & string];\nfunction mostrar(evento:Evento<Modelo>):string {\n  if(evento.nome===\"alterou:pontos\")return String(evento.valor*2);\n  return evento.valor.toUpperCase();\n}\nconsole.log(mostrar({nome:\"alterou:pontos\",valor:4}));\nconsole.log(mostrar({nome:\"alterou:nome\",valor:\"Lia\"}));",
      "output": "A saída é 8 e LIA. A união derivada mantém cada nome de evento ligado ao tipo correto de valor; não permite valor texto no evento de pontos.",
      "trace": [
        "O mapped type cria uma variante para cada chave.",
        "O indexed access transforma o objeto de variantes em uma união.",
        "O teste do nome discrimina e refina também o tipo de valor."
      ],
      "exercise": "Derive um tipo CamposEditaveis<T> que remove id e torna os campos restantes opcionais. Use-o para um modelo com id, nome e pontos e explique por que ainda é necessário validar as regras de atualização.",
      "solution": "type CamposEditaveis<T>=Partial<Omit<T,\"id\">>;\ntype Aluno={id:string;nome:string;pontos:number};\nfunction aplicar(aluno:Aluno,patch:CamposEditaveis<Aluno>):Aluno {\n  if(patch.pontos!==undefined && (!Number.isFinite(patch.pontos)||patch.pontos<0))throw new Error(\"pontos inválidos\");\n  if(patch.nome!==undefined && !patch.nome.trim())throw new Error(\"nome vazio\");\n  return {id:aluno.id,nome:patch.nome??aluno.nome,pontos:patch.pontos??aluno.pontos};\n}\nconsole.log(aplicar({id:\"1\",nome:\"Lia\",pontos:2},{pontos:3}));",
      "bug": "Um tipo genérico de evento com nome e valor independentes aceita pares incompatíveis. A união dos nomes e a união dos valores perdem a relação entre cada chave e seu valor.",
      "bugCode": "type EventoRuim<T>={nome:keyof T;valor:T[keyof T]};\nconst errado:EventoRuim<{nome:string;pontos:number}>={nome:\"pontos\",valor:\"texto\"};",
      "repair": "Crie uma variante por chave com um mapped type e depois extraia a união. Assim cada variante associa a chave literal ao seu tipo correspondente.",
      "checks": [
        "O nome e o valor do evento mantêm a relação do modelo.",
        "O patch não expõe id como campo editável.",
        "As regras de negócio continuam verificadas em execução."
      ],
      "project": "Derive eventos de mudança para um formulário tipado e um tipo de atualização permitido. Mantenha uma lista de exemplos que devem compilar e outra de incompatibilidades esperadas usando @ts-expect-error em testes de tipos.",
      "question": "Um mapped type cria os objetos correspondentes durante a execução?",
      "answer": "Não; ele deriva um contrato de tipos e não produz dados.",
      "distractors": [
        "Sim; ele inicializa automaticamente todos os campos.",
        "Sim; ele valida qualquer JSON recebido."
      ]
    },
    {
      "id": "ts-modulos-configuracao",
      "source": "https://www.typescriptlang.org/docs/handbook/modules/reference.html",
      "title": "TypeScript: módulos, configuração e declarações",
      "level": "Especialização",
      "summary": "Configure TypeScript de acordo com o ambiente onde o JavaScript será executado. Aprenda target, lib, module, moduleResolution, strict, arquivos de declaração e organização de bibliotecas, distinguindo suporte de sintaxe, disponibilidade de APIs e resolução real de arquivos.",
      "topics": [
        "tsconfig strict",
        "target lib module",
        "NodeNext bundler resolution",
        "ESM CommonJS",
        "import type verbatimModuleSyntax",
        "declaration d.ts",
        "ambient declarations",
        "project references",
        "source maps packaging"
      ],
      "sections": [
        {
          "title": "Configuração descreve o ambiente",
          "text": [
            "target influencia a sintaxe emitida; lib informa quais APIs o verificador conhece. Incluir DOM permite tipar document, mas não cria document em Node. Compilar para uma sintaxe antiga também não instala polyfills para APIs modernas.",
            "Use um tsconfig versionado e uma ferramenta de build compatível com seu runtime. Execute o JavaScript gerado no ambiente real: compilar prova uma parte do contrato, não a disponibilidade de toda API."
          ]
        },
        {
          "title": "Módulos e resolução",
          "text": [
            "module define o formato ou a interpretação dos módulos; moduleResolution determina como o compilador procura imports. NodeNext acompanha regras de Node, enquanto bundler modela ambientes com bundlers. A configuração deve refletir como o programa será resolvido em produção.",
            "ESM e CommonJS têm diferenças de exportação, extensão e interoperabilidade. Um alias em paths ajuda o compilador a localizar código, mas não reescreve automaticamente todos os imports emitidos para o runtime. Configure a outra ponta do alias.",
            "Neste laboratório de arquivos, usamos TypeScript 5.9, Node.js 24, package.json com type:module, module e moduleResolution em NodeNext, strict, verbatimModuleSyntax e noEmitOnError. calculo.ts exporta dobrar; entrada.ts escreve import {dobrar} from './calculo.js'. O compilador encontra o .ts correspondente, mas conserva .js no artefato que Node executa. A extensão descreve o destino emitido. Não há loader de TypeScript, bundler ou reescrita de extensões neste exercício.",
            "Investigue em duas etapas: tsc verifica e emite; node dist/entrada.js resolve os arquivos emitidos. Sem extensão, NodeNext aponta TS2835 antes de emitir. moduleResolution:bundler pode aceitar esse mesmo import, mas o JavaScript sem extensão falha no Node ESM direto. A ausência de diagnóstico no ambiente escolhido não demonstra compatibilidade com outro host. Confira a exigência de extensão na documentação ESM do Node: https://nodejs.org/api/esm.html#mandatory-file-extensions."
          ]
        },
        {
          "title": "O alias precisa existir depois do build",
          "text": [
            "O projeto de estudo define paths com @dominio/* apontando para ./*.ts. O verificador encontra calculo.ts para import {dobrar} from '@dominio/calculo', porém dist/entrada.js conserva '@dominio/calculo'. Executá-lo diretamente em Node não cria esse pacote. Abra o artefato antes de concluir que a pasta sumiu: o problema pode ser a regra de resolução que só existia no compilador.",
            "Para este projeto sem ferramenta adicional, troque por './calculo.js', compile e execute novamente. Um bundler ou imports de package.json pode oferecer outros contratos, mas exige configuração própria testada no host e não faz parte desta correção. Não use paths apenas para esconder um erro. Consulte a opção oficial: https://www.typescriptlang.org/tsconfig/paths.html."
          ]
        },
        {
          "title": "Imports de tipo e efeitos",
          "text": [
            "import type declara uma dependência usada apenas pelo verificador e permite apagá-la. Imports de valores podem executar efeitos do módulo importado. verbatimModuleSyntax torna mais explícita essa distinção e exige coerência com o formato de módulos.",
            "Separe arquivos que só descrevem contratos de inicialização com efeitos. Dependências circulares podem produzir valores ainda não inicializados durante a execução; o grafo de tipos não deve esconder um ciclo no grafo real de valores.",
            "contratos.ts pode conter uma interface e também console.log('contratos'). Se entrada.ts usa apenas import type {Medicao} from './contratos.js', esse import inteiro desaparece: executar entrada.js não avalia contratos.js. Emitir o arquivo da dependência não significa carregá-lo. Adicionar import './contratos.js' mantém uma dependência de execução explícita e faz o efeito acontecer antes do corpo da entrada.",
            "Com verbatimModuleSyntax, importar uma interface como valor produz um diagnóstico; não remova a opção para ignorá-lo. Decida se precisa apenas do contrato ou também de inicialização. Evite efeitos escondidos em arquivos de tipos. Esta pausa prevê a execução após a compilação; não compila a resposta do aluno no navegador. Regras oficiais: https://www.typescriptlang.org/tsconfig/verbatimModuleSyntax.html."
          ]
        },
        {
          "title": "Declarações para consumidores",
          "text": [
            "Arquivos .d.ts descrevem a API que existe em outro lugar. Eles não implementam funções. Gerar declarações ao publicar uma biblioteca ajuda consumidores a verificar chamadas, mas declarações incorretas podem prometer comportamentos inexistentes.",
            "Ambient declarations descrevem valores globais ou módulos sem implementação TypeScript disponível. Não declare um global apenas para silenciar um erro se ele não existe no ambiente. Valide as declarações contra a biblioteca real."
          ]
        },
        {
          "title": "Projetos grandes e referências",
          "text": [
            "Project references delimitam unidades de compilação e dependências entre elas. Build mode pode organizar recompilações, mas cada projeto precisa de configuração e artefatos coerentes. Evite introduzir uma divisão em muitos projetos antes de existir uma necessidade concreta.",
            "Source maps relacionam JavaScript gerado ao código de origem para depuração. Verifique como mapas serão publicados e se revelam informação sensível. A depuração deve ser testada com o artefato de produção, não apenas com o servidor de desenvolvimento."
          ]
        },
        {
          "title": "Distribuir uma biblioteca",
          "text": [
            "Defina exports, tipos e formatos realmente suportados no pacote. Teste importação ESM e CommonJS somente quando ambos são prometidos. Um arquivo presente no repositório pode não estar incluído no pacote publicado.",
            "Construa o pacote, instale o artefato em um projeto consumidor mínimo e faça uma chamada real. Isso revela resolução incorreta, tipos ausentes e diferenças entre o workspace de desenvolvimento e a distribuição."
          ]
        }
      ],
      "code": "// Exemplo de um módulo; compile com tsc em um projeto configurado.\nexport interface Medicao { valor:number; unidade:\"ms\"|\"s\"; }\nexport function emMilissegundos(m:Medicao):number {\n  if(!Number.isFinite(m.valor)||m.valor<0)throw new Error(\"medição inválida\");\n  return m.unidade===\"s\"?m.valor*1000:m.valor;\n}\nconsole.log(emMilissegundos({valor:2,unidade:\"s\"}));",
      "output": "Executado em um ambiente que entende o módulo compilado, o exemplo imprime 2000. A interface não aparece no JavaScript, mas a validação numérica permanece.",
      "trace": [
        "export estabelece a fronteira pública do módulo.",
        "A interface descreve o valor recebido sem produzir código de validação.",
        "A função verifica finitude e intervalo porque number também inclui NaN e infinito."
      ],
      "exercise": "Separe o contrato Medicao em um módulo e importe-o com import type no módulo de cálculo. Crie um consumidor que importa o cálculo e configure strict, target e module para o seu ambiente real.",
      "solution": "// contratos.ts\nexport interface Medicao {valor:number;unidade:\"ms\"|\"s\";}\n// calculo.ts: em um projeto real, mova a interface acima e use:\n// import type {Medicao} from \"./contratos.js\";\nexport function converter(m:Medicao):number {\n  if(!Number.isFinite(m.valor)||m.valor<0)throw new Error(\"valor inválido\");\n  return m.unidade===\"s\"?m.valor*1000:m.valor;\n}\n// consumidor.ts: importe converter do arquivo de módulo configurado.\nconsole.log(converter({valor:500,unidade:\"ms\"}));",
      "bug": "Declarar document como um global disponível ou incluir lib DOM não cria uma implementação no ambiente de execução. Uma configuração pode aceitar o código que falhará fora do navegador.",
      "bugCode": "// Aceito quando a biblioteca DOM está incluída:\nconsole.log(document.title);\n// Em Node sem um DOM, document não existe.",
      "repair": "Escolha APIs do ambiente real ou injete uma interface para a dependência. Teste o artefato em Node quando esse for o destino; não confunda uma declaração de tipo com um polyfill.",
      "checks": [
        "O consumidor resolve o JavaScript emitido no ambiente escolhido.",
        "Imports de tipo não criam efeitos inesperados.",
        "O pacote ou build inclui tipos e arquivos necessários, comprovado em um consumidor limpo."
      ],
      "project": "Monte uma pequena biblioteca de conversão com declarações geradas e um projeto consumidor separado. Documente o comando de build, o formato de módulo suportado e a maneira de executar o artefato.",
      "question": "Adicionar DOM à opção lib faz document existir em Node?",
      "answer": "Não; lib informa tipos ao compilador, sem instalar APIs.",
      "distractors": [
        "Sim; TypeScript injeta um navegador inteiro.",
        "Sim; target sempre adiciona todos os polyfills."
      ]
    },
    {
      "id": "ts-fronteiras-qualidade",
      "title": "TypeScript: validação, assíncrono e qualidade",
      "level": "Especialização",
      "summary": "Conecte contratos estáticos a dados recebidos por JSON, formulários e APIs, usando validação explícita e resultados discriminados. Explore promises, cancelamento, testes de tipos e execução, arquitetura de fronteiras e migração gradual de JavaScript sem esconder problemas com casts e any.",
      "topics": [
        "JSON unknown validation",
        "Result discriminated unions",
        "Promise async errors",
        "AbortController",
        "static versus runtime tests",
        "ts-expect-error",
        "gradual migration checkJs JSDoc",
        "domain DTO boundaries",
        "security and serialization"
      ],
      "sections": [
        {
          "title": "Dados externos começam como desconhecidos",
          "text": [
            "JSON não carrega o tipo da aplicação. Trate o resultado como unknown e valide forma, campos, limites e políticas para valores extras. A existência de uma propriedade não basta se seu valor tem tipo ou intervalo inválido.",
            "Na fronteira, converta um DTO de transporte em um modelo interno. Datas em JSON normalmente são strings; classes e métodos não são restaurados automaticamente. Uma função de parse deve explicitar conversões e possíveis falhas."
          ]
        },
        {
          "title": "Resultados que preservam falhas",
          "text": [
            "Uma união {ok:true;valor:T} | {ok:false;erro:string} representa sucesso e falha esperada sem campos ambíguos. Use exceções para erros que interrompem o fluxo de acordo com o contrato; não misture convenções sem justificar.",
            "A mensagem deve permitir corrigir a entrada, mas não expor detalhes internos sensíveis. Preserve causas para diagnóstico quando apropriado. Não transforme uma falha de validação em um objeto vazio que fará o erro aparecer mais tarde."
          ]
        },
        {
          "title": "Assíncrono, erro e cancelamento",
          "text": [
            "Uma função async devolve Promise. O parâmetro de Promise descreve o valor resolvido, não todos os motivos de rejeição. await dentro de try/catch observa a rejeição; esquecer await pode fazer a exceção escapar daquele bloco.",
            "AbortController permite pedir cancelamento a APIs que aceitam signal. O tipo não garante que a operação respeite o pedido. Um identificador de requisição pode impedir que uma resposta antiga substitua o estado de uma consulta mais recente."
          ]
        },
        {
          "title": "Testes estáticos e testes de execução",
          "text": [
            "Um teste de tipos verifica chamadas aceitas e rejeitadas; @ts-expect-error falha quando o erro esperado desaparece. Não use essa diretiva em código de produção para aceitar uma entrada que deveria ser corrigida.",
            "Testes de execução verificam parse, limites, efeitos e falhas reais. Os dois conjuntos têm objetivos complementares: um contrato pode compilar e produzir a soma errada; um exemplo pode funcionar e deixar chamadas incompatíveis disponíveis."
          ]
        },
        {
          "title": "Migrar sem desligar a verificação",
          "text": [
            "allowJs permite incorporar JavaScript e checkJs pode conferir arquivos JS, inclusive com JSDoc. Migre fronteiras de maior impacto primeiro, estabelecendo contratos pequenos e retirando any conforme aparecer informação suficiente.",
            "Não transforme milhares de erros em casts automáticos. Registre decisões e reduza a área não verificada progressivamente. Um módulo legado pode ser adaptado por uma fronteira tipada e validada antes de sua reescrita completa."
          ]
        },
        {
          "title": "Arquitetura e invariantes",
          "text": [
            "Separe acesso externo, validação e regras de domínio. Tipos internos mais precisos reduzem a quantidade de verificações repetidas, desde que a fronteira estabeleça realmente os invariantes.",
            "Não confie em tipagem como defesa contra injeção, autorização incorreta ou dados maliciosos. Parâmetros SQL, políticas de acesso e escape de saída continuam necessários. O sistema de tipos descreve o contrato; o programa executado precisa cumpri-lo."
          ]
        }
      ],
      "code": "type Aluno={nome:string;pontos:number};\ntype Resultado<T>={ok:true;valor:T}|{ok:false;erro:string};\nfunction lerAluno(entrada:unknown):Resultado<Aluno>{\n  if(typeof entrada!==\"object\"||entrada===null)return {ok:false,erro:\"objeto esperado\"};\n  if(!(\"nome\" in entrada)||typeof entrada.nome!==\"string\"||!entrada.nome.trim())return {ok:false,erro:\"nome inválido\"};\n  if(!(\"pontos\" in entrada)||typeof entrada.pontos!==\"number\"||!Number.isFinite(entrada.pontos)||entrada.pontos<0)return {ok:false,erro:\"pontos inválidos\"};\n  return {ok:true,valor:{nome:entrada.nome.trim(),pontos:entrada.pontos}};\n}\nconst resultado=lerAluno(JSON.parse('{\"nome\":\"Lia\",\"pontos\":4}'));\nconsole.log(resultado.ok?resultado.valor.nome:resultado.erro);",
      "output": "A saída é Lia. O parse verifica estrutura e regras antes de produzir Aluno; a decisão por ok refina o resultado para acessar valor ou erro.",
      "trace": [
        "O dado recebido permanece unknown até passar pelas verificações.",
        "Os campos são copiados para um novo objeto interno.",
        "O discriminante ok mantém valor e erro em variantes distintas."
      ],
      "exercise": "Crie lerQuantidade(entrada: unknown) retornando um resultado discriminado. Aceite somente números inteiros entre 0 e 100, rejeite booleanos, texto numérico, NaN e infinito, e teste cada caso.",
      "solution": "type Resultado<T>={ok:true;valor:T}|{ok:false;erro:string};\nfunction lerQuantidade(entrada:unknown):Resultado<number>{\n  if(typeof entrada!==\"number\"||!Number.isInteger(entrada)||entrada<0||entrada>100)return {ok:false,erro:\"esperado inteiro de 0 a 100\"};\n  return {ok:true,valor:entrada};\n}\nfor(const x of [0,100,-1,101,1.5,\"2\",true,NaN,Infinity])console.log(lerQuantidade(x));",
      "bug": "Converter toda entrada com Number pode aceitar valores que o contrato pretendia rejeitar, como string vazia, booleanos e null. Uma conversão permissiva não é validação.",
      "bugCode": "function ler(entrada:unknown):number{\n  return Number(entrada);\n}\nconsole.log(ler(null));\nconsole.log(ler(true));",
      "repair": "Valide o tipo antes de converter quando o contrato exige número. Se texto numérico também for aceito, defina sua gramática e trate texto vazio, espaços, separadores e valores não finitos explicitamente.",
      "checks": [
        "Aceita exatamente os limites 0 e 100.",
        "Rejeita formatos e valores fora do contrato.",
        "Testes de execução cobrem validação, enquanto tsc verifica o refinamento do resultado."
      ],
      "project": "Crie uma camada de entrada para registros de estudo, mantendo DTO, parse e modelo separados. Teste JSON inválido, campo ausente, valor excessivo, cancelamento e uma resposta que chega depois de outra requisição.",
      "question": "Por que validar dados mesmo quando o retorno da API é anotado como Aluno?",
      "answer": "A anotação não garante que o servidor enviou dados compatíveis em execução.",
      "distractors": [
        "Porque toda anotação converte automaticamente strings em números.",
        "Porque unknown dispensa verificar campos individuais."
      ]
    }
  ]
} satisfies DeepCourse;

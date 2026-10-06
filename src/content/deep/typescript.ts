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
            "ESM e CommonJS têm diferenças de exportação, extensão e interoperabilidade. Um alias em paths ajuda o compilador a localizar código, mas não reescreve automaticamente todos os imports emitidos para o runtime. Configure a outra ponta do alias."
          ]
        },
        {
          "title": "Imports de tipo e efeitos",
          "text": [
            "import type declara uma dependência usada apenas pelo verificador e permite apagá-la. Imports de valores podem executar efeitos do módulo importado. verbatimModuleSyntax torna mais explícita essa distinção e exige coerência com o formato de módulos.",
            "Separe arquivos que só descrevem contratos de inicialização com efeitos. Dependências circulares podem produzir valores ainda não inicializados durante a execução; o grafo de tipos não deve esconder um ciclo no grafo real de valores."
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

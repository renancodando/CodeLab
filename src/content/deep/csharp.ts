import type {DeepCourse} from './types';
export default {
  "id": "csharp-completo",
  "title": "C# · do zero à engenharia",
  "description": "Tipos, coleções, LINQ, orientação a objetos, assíncrono, runtime e projetos .NET.",
  "icon": "braces",
  "language": "csharp",
  "source": "https://learn.microsoft.com/pt-br/dotnet/csharp/",
  "lessons": [
    {
      "id": "cs-tipos-controle",
      "title": "C#: tipos, valores e controle de fluxo",
      "level": "Fundamentos",
      "summary": "Compreenda o papel de C# e do runtime .NET, escreva programas com contratos explícitos e diferencie tipos por valor e por referência. Estude números, texto, nullable, conversões, decisões, repetição e tratamento de erros, incluindo limites que a compilação não resolve automaticamente.",
      "topics": [
        "dotnet project build runtime",
        "value reference types",
        "int long double decimal",
        "checked conversions",
        "string char Unicode",
        "nullable reference value types",
        "if switch pattern matching",
        "loops methods parameters",
        "exceptions contracts"
      ],
      "sections": [
        {
          "title": "Projeto, compilador e runtime",
          "text": [
            "C# descreve o programa; ferramentas .NET compilam e executam com o runtime e bibliotecas correspondentes. Um projeto define alvo, opções e dependências. dotnet build verifica e produz artefatos, mas não prova regras de domínio.",
            "Top-level statements permitem um ponto de entrada compacto, e Program.Main é outra forma explícita. Mantenha efeitos de entrada e saída separados das funções de cálculo para reutilizar e testar as regras."
          ]
        },
        {
          "title": "Valor e referência",
          "text": [
            "Um tipo por valor copia seu valor nas operações usuais de atribuição; um tipo por referência copia uma referência ao objeto. Um struct pode conter referências, então sua cópia não faz uma cópia profunda dos objetos internos.",
            "Não transforme essa distinção na frase simplificada de que todo valor está na stack e toda referência na heap. Armazenamento depende do contexto. Pense primeiro no comportamento observável de cópia, identidade e vida."
          ]
        },
        {
          "title": "Números e conversões",
          "text": [
            "int e long têm intervalos finitos; double usa ponto flutuante binário e decimal é apropriado a muitos cálculos decimais, ainda com precisão finita. Escolha a representação e a política de arredondamento conforme o domínio.",
            "checked detecta certos overflows integrais; uma conversão explícita pode perder informação e precisa de validação. TryParse permite tratar texto inválido sem uma exceção de formato como fluxo comum. Cultura afeta separadores e interpretação."
          ]
        },
        {
          "title": "Texto e ausência",
          "text": [
            "string é imutável e char representa uma unidade UTF-16, não necessariamente um símbolo visual completo. Operações de texto e comparação podem ter regras culturais; escolha comparação ordinal ou cultural segundo o contrato.",
            "Nullable de tipos por valor usa Nullable<T>; nullable reference types é principalmente uma análise estática de possíveis ausências. O operador ! suprime um aviso e não cria um objeto. Dados externos ainda precisam de validação real."
          ]
        },
        {
          "title": "Decisões, padrões e laços",
          "text": [
            "if e switch expressam decisões; padrões podem verificar formas e valores de maneira legível. Uma switch expression deve tratar as possibilidades do contrato. Use when e padrões com clareza, sem ocultar regras em uma expressão muito densa.",
            "foreach percorre a coleção; for controla um índice e exige limites válidos. Alterar uma coleção durante sua enumeração pode invalidar o fluxo. Teste zero, um e vários itens e valores exatamente na fronteira de uma condição."
          ]
        },
        {
          "title": "Métodos e falhas",
          "text": [
            "Parâmetros por valor e mecanismos ref, out e in têm contratos diferentes de acesso e alteração. Use-os quando a API realmente precisa dessas capacidades. Uma função pequena que devolve um resultado pode ser mais clara que múltiplas saídas alteradas.",
            "Exceções devem comunicar uma falha com causa e contexto. Capture apenas quando puder tratar ou traduzir adequadamente. finally libera recursos, e using oferece uma forma estruturada para objetos descartáveis."
          ]
        }
      ],
      "code": "using System;\n\nstatic int SomarPositivos(int[] valores)\n{\n    int total = 0;\n    foreach (int valor in valores)\n        if (valor > 0) total = checked(total + valor);\n    return total;\n}\nConsole.WriteLine(SomarPositivos(new[] { -2, 0, 3, 5 }));\nConsole.WriteLine(SomarPositivos(Array.Empty<int>()));",
      "output": "A saída é 8 e 0. checked faz uma soma fora do intervalo falhar em vez de aceitar silenciosamente um resultado integral incorreto.",
      "trace": [
        "A função recebe uma sequência e inicializa seu acumulador.",
        "A condição filtra antes da soma.",
        "O resultado vazio é zero porque o corpo nunca altera o acumulador."
      ],
      "exercise": "Crie ContarIntervalo para int[], limites inclusivos e rejeição de intervalo invertido. Teste vazio e os dois limites sem usar leitura do terminal na função.",
      "solution": "using System;\nstatic int ContarIntervalo(int[] dados,int minimo,int maximo)\n{\n    if(minimo>maximo)throw new ArgumentException(\"Intervalo invertido\");\n    int total=0;\n    foreach(int x in dados)if(x>=minimo&&x<=maximo)total=checked(total+1);\n    return total;\n}\nif(ContarIntervalo(new[]{0,1,2,3},1,2)!=2)throw new Exception(\"Falhou\");\nif(ContarIntervalo(Array.Empty<int>(),1,2)!=0)throw new Exception(\"Falhou\");",
      "bug": "O operador de supressão de nullable não torna um valor não nulo. Uma referência ausente continua falhando quando seu membro é acessado.",
      "bugCode": "string? nome = null;\nConsole.WriteLine(nome!.Length);",
      "repair": "Valide a ausência antes do acesso e defina se ela é permitida ou um erro. Use ?? para um padrão quando esse for o contrato, e não ! apenas para remover o aviso.",
      "checks": [
        "Trata a sequência vazia e ambos os limites.",
        "Rejeita intervalo invertido e overflow quando relevante.",
        "Distingue análise estática de nullable de validação em execução."
      ],
      "project": "Crie uma CLI de análise de medições com parsing separado do cálculo. Teste entrada inválida, overflow, zero e negativos, documentando a cultura usada para interpretar números.",
      "question": "Nullable reference types impede fisicamente que null chegue a um método?",
      "answer": "Não; ajuda a análise estática e não substitui validação em execução.",
      "distractors": [
        "Sim; o runtime converte null automaticamente em um objeto.",
        "Sim; o operador ! sempre cria o valor que falta."
      ]
    },
    {
      "id": "cs-colecoes-linq",
      "title": "C#: genéricos, coleções e LINQ",
      "level": "Intermediário",
      "summary": "Escolha coleções e use genéricos para preservar contratos, depois transforme dados com LINQ entendendo avaliação adiada e materialização. Estude IEnumerable, listas, dicionários, conjuntos, agrupamento, ordenação e IQueryable, reconhecendo quando uma expressão vira trabalho local ou uma consulta de outro provedor.",
      "topics": [
        "List Dictionary HashSet",
        "generic constraints variance",
        "IEnumerable IEnumerator",
        "LINQ Where Select OrderBy GroupBy",
        "deferred execution materialization",
        "First Single Any",
        "IQueryable providers",
        "complexity multiple enumeration"
      ],
      "sections": [
        {
          "title": "Coleções pelo padrão de acesso",
          "text": [
            "List permite acesso sequencial e por índice; Dictionary mapeia chaves e HashSet representa pertencimento. Defina igualdade e política para duplicação. Uma chave cujo hash muda depois de armazenada pode tornar consultas incoerentes.",
            "Genéricos relacionam tipos sem depender de casts em cada uso. Constraints declaram capacidades exigidas pela implementação. Não prometa um tipo mais específico no retorno quando você apenas criou um objeto que satisfaz parte de suas restrições."
          ]
        },
        {
          "title": "Enumeração e variância",
          "text": [
            "IEnumerable<T> descreve uma fonte enumerável; cada enumeração pode fazer trabalho, acessar recurso ou devolver resultados diferentes. Não assuma que é uma lista na memória. IEnumerator representa o avanço de uma enumeração.",
            "Covariância e contravariância permitem compatibilidades específicas em interfaces e delegates com parâmetros in e out. Elas dependem de posições de leitura e escrita e não tornam qualquer coleção mutável intercambiável."
          ]
        },
        {
          "title": "Transformação e agregação",
          "text": [
            "Where filtra e Select transforma; OrderBy define ordem e ThenBy desempate. GroupBy cria grupos segundo uma chave. A sintaxe de consulta e os métodos podem expressar operações equivalentes, com diferenças conforme o provedor.",
            "Any expressa existência sem contar necessariamente todos os elementos. First exige pelo menos um e Single exige exatamente um; variantes OrDefault pedem uma política para ausência. Escolha pela regra do domínio, não só pela chamada que evita uma exceção."
          ]
        },
        {
          "title": "Avaliação adiada",
          "text": [
            "Muitas consultas LINQ executam ao enumerar, não ao declarar a variável. Se a origem muda, uma nova enumeração pode observar outro estado. ToList e ToArray materializam resultados naquele momento e têm custo de memória.",
            "Enumerar duas vezes pode duplicar uma chamada cara ou consumir uma fonte que não reinicia. Materialize quando o contrato exige snapshot ou reutilização estável; mantenha streaming quando ele é adequado e a vida da origem está garantida."
          ]
        },
        {
          "title": "Provedores e IQueryable",
          "text": [
            "IQueryable pode conservar uma expressão para um provedor traduzi-la, por exemplo em SQL. Nem toda função C# pode ser traduzida, e semântica, custo e momento de execução dependem do provedor.",
            "Não confunda uma consulta local em IEnumerable com uma consulta remota. Verifique SQL gerado, quantidade de resultados e fronteiras de materialização. Evite buscar todos os registros para depois filtrar se o contrato e o provedor permitem filtrar na origem."
          ]
        },
        {
          "title": "Complexidade e previsibilidade",
          "text": [
            "Buscas repetidas em uma lista podem crescer quadraticamente; um índice por chave muda o padrão de custo. O índice precisa de construção, memória e atualização coerente. Uma expressão LINQ curta não garante algoritmo eficiente.",
            "Teste duplicação, vazio e empates. Para um relatório, defina ordenação explícita; não use uma ordem incidental do banco ou de uma estrutura como contrato de apresentação."
          ]
        }
      ],
      "code": "using System;\nusing System.Linq;\nvar valores = new[] { 3, 1, 3, 2 };\nvar consulta = valores.Where(x => x >= 2).OrderBy(x => x);\nvar snapshot = consulta.ToArray();\nvalores[0] = 9;\nConsole.WriteLine(string.Join(\",\", snapshot));\nConsole.WriteLine(string.Join(\",\", consulta));",
      "output": "A primeira linha é 2,3,3 e a segunda 2,3,9. O snapshot foi materializado antes da mudança; a consulta adiada observa a origem atual ao enumerar.",
      "trace": [
        "Declarar consulta conserva uma cadeia de operações.",
        "ToArray executa e guarda um resultado separado.",
        "A enumeração posterior refaz a consulta sobre valores alterados."
      ],
      "exercise": "Agrupe palavras por comprimento, conservando a ordem dentro de cada grupo, e produza Dictionary<int,List<string>>. Trate lista vazia e não compartilhe a mesma lista entre grupos.",
      "solution": "using System;\nusing System.Linq;\nusing System.Collections.Generic;\nstatic Dictionary<int,List<string>> Agrupar(IEnumerable<string> palavras) =>\n    palavras.GroupBy(x=>x.Length).ToDictionary(g=>g.Key,g=>g.ToList());\nvar grupos=Agrupar(new[]{\"a\",\"bb\",\"c\"});\nif(string.Join(\",\",grupos[1])!=\"a,c\")throw new Exception(\"Ordem incorreta\");\nif(Agrupar(Array.Empty<string>()).Count!=0)throw new Exception(\"Vazio incorreto\");",
      "bug": "Uma consulta adiada não é uma fotografia da origem. Alterar a coleção antes de enumerar pode mudar o resultado que o programador esperava conservar.",
      "bugCode": "var origem = new List<int>{1,2};\nvar consulta = origem.Where(x=>x>0);\norigem.Add(3);\nConsole.WriteLine(consulta.Count());",
      "repair": "Use materialização quando o contrato exige um snapshot. Se o resultado deve refletir o estado atual, conserve a consulta e documente essa escolha.",
      "checks": [
        "A API distingue fonte enumerável de coleção materializada.",
        "Vazio e duplicação têm resultados definidos.",
        "Consulta remota é verificada no provedor e não tratada como cálculo local sem custo."
      ],
      "project": "Crie um relatório de estudos com filtragem, agrupamento e ranking. Compare a versão streaming com um snapshot e identifique uma enumeração redundante.",
      "question": "Uma consulta Where sempre executa completamente quando é atribuída a uma variável?",
      "answer": "Não; normalmente é adiada até a enumeração.",
      "distractors": [
        "Sim; toda consulta é imediatamente uma List.",
        "Sim; ToArray apenas renomeia a mesma origem."
      ]
    },
    {
      "id": "cs-objetos-contratos",
      "title": "C#: objetos, interfaces, records e padrões",
      "level": "Avançado",
      "summary": "Modele regras com encapsulamento e interfaces, usando composição, records, herança e pattern matching conforme o contrato. Entenda igualdade, imutabilidade, delegates e eventos para criar componentes testáveis sem hierarquias artificiais ou estado interno exposto.",
      "topics": [
        "classes structs records",
        "constructors properties init required",
        "interfaces composition inheritance",
        "virtual override abstract sealed",
        "value equality record copying",
        "pattern matching switch",
        "delegates lambdas events",
        "operator overload contracts"
      ],
      "sections": [
        {
          "title": "Tipos de domínio e construção",
          "text": [
            "Classes representam objetos por referência; structs têm semântica por valor. Records oferecem mecanismos de igualdade e cópia apropriados a modelos de dados, mas não tornam coleções internas profundamente imutáveis.",
            "Construtores, init e required ajudam a expressar inicialização, com garantias específicas. Um campo obrigatório ainda pode receber um valor semanticamente inválido. Estabeleça invariantes e valide fronteiras em vez de depender somente da forma da declaração."
          ]
        },
        {
          "title": "Interfaces e composição",
          "text": [
            "Uma interface descreve operações que o cliente pode pedir. Composição recebe um colaborador que cumpre esse contrato, permitindo substituir política ou recurso em testes. Não crie uma interface para cada classe sem uma necessidade de fronteira.",
            "Herança afirma substituibilidade. virtual e override permitem especialização de comportamento; abstract exige uma implementação e sealed limita extensão. Um derivado não deve invalidar promessas que clientes do base usam."
          ]
        },
        {
          "title": "Igualdade e cópias",
          "text": [
            "Igualdade por valor compara campos segundo regras do tipo; identidade por referência pergunta se é o mesmo objeto. Records podem gerar igualdade, e with cria uma cópia com modificações conforme a semântica de seus membros.",
            "Uma coleção compartilhada continua compartilhada numa cópia superficial. Chaves de dicionário precisam conservar igualdade e hash coerentes. Não altere campos que participam do hash enquanto o objeto estiver sendo usado como chave."
          ]
        },
        {
          "title": "Propriedades e encapsulamento",
          "text": [
            "Propriedades podem calcular ou controlar acesso, mas devem ter custo e efeitos compreensíveis. Retornar uma lista interna mutável pode permitir que o consumidor ignore todas as regras de atualização.",
            "Uma interface de leitura reduz operações disponíveis, mas não garante imutabilidade profunda por si. Defina se o consumidor recebe uma view, snapshot ou estrutura imutável real e teste se aliases podem alterar invariantes."
          ]
        },
        {
          "title": "Padrões e alternativas",
          "text": [
            "Pattern matching pode testar tipo, valor e propriedades, tornando decisões de domínio legíveis. Um switch sobre estados deve tratar todas as possibilidades prometidas e ter uma política para valores inesperados.",
            "Não esconda mutações em condições difíceis de ler. Uma representação com variantes explícitas pode ser melhor que vários campos opcionais. A clareza do estado simplifica tanto a decisão quanto os testes de transição."
          ]
        },
        {
          "title": "Delegates e eventos",
          "text": [
            "Delegates representam chamadas com uma assinatura, e lambdas podem capturar estado externo. Eventos controlam a inscrição de consumidores, mas assinaturas conservam referências que precisam de uma política de remoção.",
            "Um subscriber de vida curta ligado a um publisher duradouro pode continuar vivo além do desejado. Evite eventos para um fluxo que uma chamada ou resultado explícito resolve melhor. Teste quantidade de inscrições e limpeza ao encerrar."
          ]
        }
      ],
      "code": "using System;\nvar pedido = new Pedido(1000);\nvar politica = new DescontoFixo(100);\nConsole.WriteLine(politica.Calcular(pedido));\nrecord Pedido(int TotalCentavos);\ninterface IDesconto { int Calcular(Pedido pedido); }\nsealed class DescontoFixo(int centavos) : IDesconto\n{\n    public int Calcular(Pedido pedido)\n    {\n        if(centavos<0 || pedido.TotalCentavos<0)throw new ArgumentException(\"Valor inválido\");\n        return Math.Max(0,pedido.TotalCentavos-centavos);\n    }\n}",
      "output": "O resultado é 900. A política recebe o pedido por um contrato e devolve o total com desconto, sem alterar o record nem exigir que Pedido herde de uma política.",
      "trace": [
        "Pedido carrega dados e IDesconto descreve comportamento.",
        "A implementação valida valores antes do cálculo.",
        "O resultado não fica negativo quando o desconto excede o total."
      ],
      "exercise": "Crie uma interface IFormatador com Formatar(string), duas implementações e uma classe Relatorio que recebe o formatador no construtor. Teste a substituição sem alterar Relatorio.",
      "solution": "using System;\nvar r=new Relatorio(new Maiusculas());\nif(r.Gerar(\"Lia\")!=\"LIA\")throw new Exception(\"Falhou\");\nif(new Relatorio(new Colchetes()).Gerar(\"Lia\")!=\"[Lia]\")throw new Exception(\"Falhou\");\ninterface IFormatador{string Formatar(string texto);}\nsealed class Maiusculas:IFormatador{public string Formatar(string texto)=>texto.ToUpperInvariant();}\nsealed class Colchetes:IFormatador{public string Formatar(string texto)=>\"[\"+texto+\"]\";}\nsealed class Relatorio(IFormatador formatador){public string Gerar(string texto)=>formatador.Formatar(texto);}",
      "bug": "Uma cópia de record com uma lista não copia automaticamente os elementos nem a lista. Uma mudança pela cópia pode afetar o original.",
      "bugCode": "record Grupo(System.Collections.Generic.List<string> Nomes);\n// a e b compartilham Nomes:\n// var a = new Grupo(new(){\"Lia\"}); var b = a with {}; b.Nomes.Add(\"Ana\");",
      "repair": "Defina uma representação imutável ou faça a cópia necessária conforme o contrato. Não chame uma estrutura de imutável apenas por ser record.",
      "checks": [
        "Colaboradores podem ser substituídos pelo contrato.",
        "Cópia e igualdade têm políticas documentadas.",
        "Inscrições em eventos são removidas quando o consumidor termina."
      ],
      "project": "Modele um planejador com dados por records e políticas por composição. Teste duas políticas e uma cópia com dados aninhados, explicitando quais estruturas são compartilhadas.",
      "question": "Um record com uma List interna é profundamente imutável?",
      "answer": "Não; a lista pode continuar mutável e compartilhada entre cópias.",
      "distractors": [
        "Sim; record congela recursivamente qualquer campo.",
        "Sim; with sempre clona todo o grafo de objetos."
      ]
    },
    {
      "id": "cs-assincrono-recursos",
      "title": "C#: async, cancelamento e recursos",
      "level": "Avançado",
      "summary": "Organize operações assíncronas com Task, await e cancelamento cooperativo, mantendo propagação de falhas e liberação de recursos. Estude composição, limites, IDisposable, IAsyncDisposable, streams assíncronos e o risco de bloquear uma operação assíncrona com Result ou Wait.",
      "topics": [
        "Task async await",
        "Task.WhenAll WhenAny",
        "CancellationToken cooperative",
        "timeouts bounded concurrency",
        "IDisposable using",
        "IAsyncDisposable await using",
        "IAsyncEnumerable await foreach",
        "async void contexts",
        "deadlocks Result Wait"
      ],
      "sections": [
        {
          "title": "Assíncrono não é uma thread por método",
          "text": [
            "async permite escrever uma operação que pode suspender em await e retomar depois. Uma Task representa conclusão, resultado ou falha; não implica uma thread exclusiva. Trabalho de I/O e cálculo têm estratégias diferentes.",
            "Uma chamada pode executar sincronamente até o primeiro await que realmente suspenda. Configure expectativas de contexto conforme o ambiente, especialmente interfaces. ConfigureAwait tem um propósito específico e não deve ser aplicado como uma fórmula universal sem contrato."
          ]
        },
        {
          "title": "Composição e erros",
          "text": [
            "Task.WhenAll aguarda o conjunto e pode comunicar falhas; a ordem dos resultados acompanha a ordem das tasks fornecidas. WhenAny identifica a primeira conclusão, não cancela nem aguarda automaticamente todas as demais.",
            "Observe falhas e defina política de operação parcial. async void normalmente fica restrito a handlers de eventos que exigem essa assinatura; para operações comuns, devolva Task para que o chamador consiga aguardar e observar o erro."
          ]
        },
        {
          "title": "Cancelamento e timeout",
          "text": [
            "CancellationToken comunica um pedido cooperativo. O código precisa verificá-lo ou passá-lo a operações que o aceitam. Cancelar não desfaz automaticamente uma gravação ou requisição que já produziu efeito.",
            "Timeout limita uma espera e precisa de uma política para o trabalho restante. Distinga cancelamento solicitado de outras falhas, e preserve limpeza no encerramento. Não capture OperationCanceledException como sucesso sem justificar o contrato."
          ]
        },
        {
          "title": "Limitar trabalho",
          "text": [
            "Iniciar uma task para cada registro pode saturar conexões ou memória. SemaphoreSlim e outras estruturas podem limitar concorrência; a vaga precisa ser liberada em finally ou por uma estrutura equivalente.",
            "Cancelamento entre aquisição e execução exige cuidado com a contabilidade. Não libere uma vaga que nunca foi adquirida. Em fluxos longos, filas com limites ajudam a aplicar backpressure entre produtor e consumidor."
          ]
        },
        {
          "title": "Descarte e enumeração assíncrona",
          "text": [
            "using chama Dispose no fim do escopo para recursos síncronos. await using usa descarte assíncrono quando o recurso o oferece. Ambos organizam liberação também em saídas por erro, mas não substituem tratar uma falha relevante da operação.",
            "IAsyncEnumerable permite consumir uma sequência com await foreach. A origem pode manter um recurso vivo durante a enumeração; término antecipado e cancelamento devem liberar esse recurso. Não devolva uma sequência que depende de um recurso já descartado."
          ]
        },
        {
          "title": "Bloqueio e testes",
          "text": [
            "Result e Wait bloqueiam e podem causar deadlock ou exaustão de threads em certos contextos. Preserve o fluxo assíncrono até a fronteira adequada e não use Task.Run apenas para esconder uma API bloqueante sem entender o custo.",
            "Teste cancelamento antes e durante o trabalho, falha de uma tarefa e limpeza. Uma espera artificial longa torna testes lentos e frágeis; use operações controladas ou sinais para reproduzir o momento relevante."
          ]
        }
      ],
      "code": "using System;\nusing System.Linq;\nusing System.Threading;\nusing System.Threading.Tasks;\nstatic async Task<int> DobrarAsync(int valor,CancellationToken token)\n{\n    token.ThrowIfCancellationRequested();\n    await Task.Yield();\n    token.ThrowIfCancellationRequested();\n    return checked(valor*2);\n}\nvar tarefas=new[]{1,2,3}.Select(x=>DobrarAsync(x,CancellationToken.None));\nvar resultados=await Task.WhenAll(tarefas);\nConsole.WriteLine(string.Join(\",\",resultados));",
      "output": "A saída é 2,4,6. Cada tarefa verifica cancelamento e o conjunto aguarda todas antes de apresentar resultados na ordem das entradas.",
      "trace": [
        "A operação usa Task<int> para tornar conclusão e falhas observáveis.",
        "Yield oferece um ponto de suspensão sem uma espera longa.",
        "WhenAll materializa a conclusão do conjunto antes da leitura."
      ],
      "exercise": "Implemente ExecutarLimitadoAsync para uma lista pequena de inteiros com SemaphoreSlim e limite positivo. Garanta Release em finally somente após adquirir a vaga e propague cancelamento.",
      "solution": "using System;\nusing System.Linq;\nusing System.Threading;\nusing System.Threading.Tasks;\nstatic async Task<int[]> ExecutarLimitadoAsync(int[] dados,int limite,CancellationToken token)\n{\n    if(limite<1)throw new ArgumentOutOfRangeException(nameof(limite));\n    using var vagas=new SemaphoreSlim(limite);\n    async Task<int> Executar(int x){\n        await vagas.WaitAsync(token);\n        try{token.ThrowIfCancellationRequested();await Task.Yield();token.ThrowIfCancellationRequested();return checked(x*2);}\n        finally{vagas.Release();}\n    }\n    return await Task.WhenAll(dados.Select(Executar));\n}\nConsole.WriteLine(string.Join(\",\",await ExecutarLimitadoAsync(new[]{1,2,3},2,CancellationToken.None)));",
      "bug": "Usar async void para uma operação de domínio impede o chamador de aguardar seu resultado e observar suas falhas por um fluxo de Task.",
      "bugCode": "async void Salvar(){await Task.Yield();throw new Exception(\"Falha\");}\nSalvar();",
      "repair": "Devolva Task e faça o chamador aguardar a operação. Preserve async void somente em fronteiras como handlers exigidos pelo framework, tratando falhas nessa fronteira.",
      "checks": [
        "Toda operação relevante tem conclusão e falha observáveis.",
        "Vagas e recursos são liberados em sucesso, falha e cancelamento.",
        "A ordem de resultados e a política de timeout estão definidas."
      ],
      "project": "Crie um importador simulado com concorrência limitada, token de cancelamento e resumo de falhas. Teste a limpeza sem depender de um serviço externo nem de sleeps longos.",
      "question": "Cancelar um CancellationToken desfaz automaticamente efeitos externos já concluídos?",
      "answer": "Não; é um pedido cooperativo e não uma transação reversível.",
      "distractors": [
        "Sim; todas as gravações são revertidas.",
        "Sim; qualquer código é interrompido imediatamente."
      ]
    },
    {
      "id": "cs-runtime-avancado",
      "title": "C#: runtime, memória e recursos avançados",
      "level": "Avançado",
      "summary": "Estude recursos avançados a partir de um problema medido: boxing, structs, spans, memória, delegates, reflection, attributes, source generators e interoperabilidade. Relacione esses mecanismos a custos e contratos de vida, evitando trocar clareza por uma otimização sem evidência.",
      "topics": [
        "GC allocations boxing",
        "struct readonly ref struct",
        "Span ReadOnlySpan Memory",
        "stackalloc lifetime",
        "generics constraints",
        "reflection attributes",
        "source generators trimming AOT",
        "unsafe pointers interop",
        "profiling benchmarking"
      ],
      "sections": [
        {
          "title": "Alocações e coleta",
          "text": [
            "O coletor recupera memória de objetos que deixaram de ser alcançáveis conforme o runtime; ele não fecha automaticamente todo recurso externo no momento necessário. Dispose e políticas de inscrição continuam importantes.",
            "Boxing envolve representar um valor em um contexto de objeto ou interface apropriado e pode criar alocação. Genéricos ajudam a preservar tipos sem algumas dessas conversões. Meça alocações no fluxo real antes de redesenhar tipos."
          ]
        },
        {
          "title": "Structs e contratos de cópia",
          "text": [
            "Structs são copiados por valor em contextos usuais; um struct grande pode ter custo relevante e conter referências compartilhadas. readonly ajuda a expressar operações e dados que não devem mudar por determinada referência.",
            "ref struct tem restrições que conservam contratos de vida e impede alguns usos em armazenamento gerenciado. Recursos da versão de linguagem alteram casos permitidos; confira regras antes de atravessar fronteiras assíncronas ou de captura."
          ]
        },
        {
          "title": "Span e Memory",
          "text": [
            "Span<T> e ReadOnlySpan<T> representam regiões contíguas com vida restrita e acesso sem necessariamente copiar. Eles não possuem automaticamente o armazenamento. Um slice aponta para uma parte da mesma origem.",
            "Memory<T> atende outros cenários de armazenamento e assíncrono, com contratos diferentes. Não guarde uma referência além da vida da origem ou de um buffer devolvido a um pool. ReadOnly impede escrita pela view, não por todo alias existente."
          ]
        },
        {
          "title": "Stack allocation e código inseguro",
          "text": [
            "stackalloc pode criar armazenamento de vida curta e exige tamanho e período apropriados. Grandes alocações na stack podem falhar. Use somente quando o custo medido e o contrato justificam, não como regra para toda pequena coleção.",
            "unsafe e interoperabilidade permitem operações com ponteiros e APIs nativas, mas acrescentam obrigações de alinhamento, validade e liberação. O compilador não substitui a análise dessas fronteiras. Prefira APIs seguras quando elas atendem à necessidade."
          ]
        },
        {
          "title": "Reflection e geração",
          "text": [
            "Reflection inspeciona metadados e pode acionar membros em execução. Attributes descrevem metadados e não executam lógica automaticamente. Um consumidor precisa interpretá-los. Cache ou geração podem reduzir certos custos quando necessário.",
            "Source generators produzem código durante a compilação e dependem de um contrato de entrada. Trimming e AOT podem afetar caminhos dinâmicos; valide o artefato publicado, não apenas a execução comum de debug."
          ]
        },
        {
          "title": "Medir antes de especializar",
          "text": [
            "Use ferramentas de profiling e benchmarks com carga e configuração comparáveis. Considere custo de JIT, aquecimento, GC e distribuição dos tempos. Um resultado único não representa estabilidade ou impacto para o usuário.",
            "Uma otimização válida conserva resultados, falhas e vida dos recursos. Documente o gargalo e mantenha um teste que protege a regra afetada. Se o ganho não é relevante, a implementação mais clara pode ser a melhor escolha."
          ]
        }
      ],
      "code": "using System;\nint[] origem={1,2,3,4};\nSpan<int> trecho=origem.AsSpan(1,2);\ntrecho[0]=20;\nReadOnlySpan<int> leitura=origem;\nint total=0;\nforeach(int x in leitura)total=checked(total+x);\nConsole.WriteLine(total);\nConsole.WriteLine(origem[1]);",
      "output": "A saída é 28 e 20. O Span é uma view sobre o array e a escrita altera a origem; ReadOnlySpan impede escrita por aquela view, não a mudança feita antes.",
      "trace": [
        "AsSpan escolhe uma faixa sem copiar os elementos.",
        "O índice zero do trecho corresponde ao índice um da origem.",
        "A view de leitura percorre os dados atuais."
      ],
      "exercise": "Escreva Somar(ReadOnlySpan<int>) com soma checked e teste um slice do array, array vazio e a conservação da origem. Não guarde o span em estado de vida incompatível.",
      "solution": "using System;\nstatic int Somar(ReadOnlySpan<int> valores){int total=0;foreach(int x in valores)total=checked(total+x);return total;}\nint[] dados={1,2,3,4};\nif(Somar(dados.AsSpan(1,2))!=5)throw new Exception(\"Slice incorreto\");\nif(Somar(ReadOnlySpan<int>.Empty)!=0)throw new Exception(\"Vazio incorreto\");\nif(dados[1]!=2)throw new Exception(\"Entrada alterada\");",
      "bug": "Uma view somente para leitura não garante que outro alias não modifique o mesmo armazenamento. Ela descreve as operações permitidas por aquela referência.",
      "bugCode": "int[] dados={1,2};\nReadOnlySpan<int> leitura=dados;\ndados[0]=9;\nConsole.WriteLine(leitura[0]);",
      "repair": "Use um snapshot ou uma estrutura com política real de imutabilidade quando o consumidor precisa de estabilidade. Documente quando a view reflete mudanças da origem.",
      "checks": [
        "Views não são confundidas com cópias ou posse.",
        "O código conserva limites e vida dos buffers.",
        "A especialização tem medição e não muda o contrato observável."
      ],
      "project": "Compare uma transformação com cópias e uma com slices, medindo alocações e tempo. Teste limites, entrada vazia e aliases; registre em quais tamanhos a diferença é relevante.",
      "question": "ReadOnlySpan congela o array de origem para todas as referências?",
      "answer": "Não; impede escrita por aquela view, enquanto outros aliases podem alterar o array.",
      "distractors": [
        "Sim; transforma o array inteiro em uma cópia imutável.",
        "Sim; bloqueia automaticamente qualquer outra thread."
      ]
    },
    {
      "id": "cs-engenharia",
      "title": "C#: testes, pacotes e arquitetura .NET",
      "level": "Especialização",
      "summary": "Evolua exemplos em soluções .NET reproduzíveis, com contratos, testes, dependências e publicação verificadas. Estude organização, injeção de dependências, APIs, persistência e observação, mantendo regras de domínio separadas de frameworks e tratando compatibilidade como parte do produto.",
      "topics": [
        "solutions projects references NuGet",
        "unit integration end-to-end tests",
        "dependency injection lifetimes",
        "ASP.NET middleware APIs",
        "EF Core transactions migrations",
        "logging configuration secrets",
        "publish trimming AOT",
        "architecture domain adapters",
        "versioning compatibility"
      ],
      "sections": [
        {
          "title": "Projetos e dependências",
          "text": [
            "Uma solução organiza projetos, mas o grafo de referências define acoplamento real. NuGet fornece pacotes com versões e dependências; registre o que o projeto usa e valide o restore e build em ambiente limpo.",
            "Separe bibliotecas de domínio de aplicações quando houver uma fronteira concreta. Não crie camadas vazias apenas por um diagrama. Um consumidor deve poder entender a API pública e as dependências necessárias à execução."
          ]
        },
        {
          "title": "Testes com propósito",
          "text": [
            "Teste regras isoladas, integração de adaptadores e uma história ponta a ponta. Frameworks de teste automatizam execução e diagnóstico, mas o oráculo precisa vir do contrato. Use dados diferentes e falhas, não só a situação mais simples.",
            "Substitua relógio ou serviço externo por uma fronteira controlada em testes de unidade. Em integração, verifique a dependência que importa: um mock de banco não prova transações ou SQL. Mantenha gates proporcionais ao risco da mudança."
          ]
        },
        {
          "title": "Injeção e vida dos serviços",
          "text": [
            "Injeção de dependências fornece colaboradores ao componente. Contêineres têm vidas como singleton, scoped e transient; uma dependência de vida curta conservada por uma de vida longa pode criar erros de concorrência ou liberação.",
            "Não resolva serviços globalmente em toda função. Declare dependências no contrato do componente e mantenha composição na fronteira da aplicação. Teste descarte, escopo e uso concorrente quando essas vidas afetam comportamento."
          ]
        },
        {
          "title": "APIs e persistência",
          "text": [
            "Em ASP.NET, middleware e endpoints organizam a requisição; ordem e política de tratamento de erro importam. Validação, autenticação e autorização têm responsabilidades distintas. Não exponha detalhes internos só porque o objeto pode ser serializado.",
            "EF Core oferece mapeamento e consultas, mas exige entender SQL, transações, tracking e migrações. Teste queries e limites no provedor escolhido. A trilha ASP.NET e a trilha SQL complementam estes conceitos com seu contexto de plataforma."
          ]
        },
        {
          "title": "Configuração e publicação",
          "text": [
            "Configuração deve ser validada e segredos não devem aparecer em logs ou controle de versão. Logging precisa de contexto útil e limites para dados pessoais. Uma falha de configuração deve ser detectada numa fronteira compreensível.",
            "dotnet publish produz o artefato para o destino configurado. Opções como trimming e AOT podem afetar código dinâmico. Execute um smoke test do artefato publicado em um ambiente compatível, não apenas dotnet run no workspace."
          ]
        },
        {
          "title": "Evoluir contratos",
          "text": [
            "Mudanças em formato, exceções ou comportamento podem quebrar consumidores sem mudar o nome do método. Documente compatibilidade e migração. Uma atualização de pacote exige conferir o fluxo que usa aquele pacote.",
            "Mantenha evidências pequenas e reproduzíveis: comando, entrada, resultado e build testado. Uma arquitetura útil facilita corrigir e publicar sem apagar dados ou alterar a experiência visual inadvertidamente."
          ]
        }
      ],
      "code": "using System;\nvar servico=new ServicoDeEstudo(new RelogioFixo(new DateTimeOffset(2026,10,6,12,0,0,TimeSpan.Zero)));\nConsole.WriteLine(servico.Agendar(2).ToString(\"O\"));\ninterface IRelogio{DateTimeOffset Agora{get;}}\nsealed class RelogioFixo(DateTimeOffset agora):IRelogio{public DateTimeOffset Agora=>agora;}\nsealed class ServicoDeEstudo(IRelogio relogio){\n    public DateTimeOffset Agendar(int dias){if(dias<0)throw new ArgumentOutOfRangeException(nameof(dias));return relogio.Agora.AddDays(dias);}\n}",
      "output": "O agendamento produz 8 de outubro de 2026 às 12:00 UTC. O relógio recebido torna o comportamento determinístico e separa a regra do relógio real do sistema.",
      "trace": [
        "A interface delimita uma dependência externa.",
        "O relógio fixo permite prever o resultado do teste.",
        "A regra valida o intervalo antes de calcular a data."
      ],
      "exercise": "Teste Agendar para zero, dois dias e valor negativo usando um relógio fixo. Mantenha o serviço independente de DateTimeOffset.UtcNow e de frameworks HTTP.",
      "solution": "using System;\nvar agora=new DateTimeOffset(2026,10,6,12,0,0,TimeSpan.Zero);\nvar servico=new Servico(new Relogio(agora));\nif(servico.Agendar(0)!=agora)throw new Exception(\"Zero falhou\");\nif(servico.Agendar(2)!=agora.AddDays(2))throw new Exception(\"Data falhou\");\ntry{servico.Agendar(-1);throw new Exception(\"Negativo aceito\");}catch(ArgumentOutOfRangeException){}\ninterface IRelogio{DateTimeOffset Agora{get;}}\nrecord Relogio(DateTimeOffset Agora):IRelogio;\nclass Servico(IRelogio relogio){public DateTimeOffset Agendar(int dias)=>dias<0?throw new ArgumentOutOfRangeException(nameof(dias)):relogio.Agora.AddDays(dias);}",
      "bug": "Um teste que usa o relógio real e espera uma data exata pode falhar por passagem de tempo, fuso ou momento de execução. Ele não controla a dependência da regra.",
      "bugCode": "var esperado=DateTimeOffset.UtcNow.AddDays(2);\n// Uma segunda leitura do relógio não é necessariamente o mesmo instante.",
      "repair": "Injete uma abstração de relógio e use um instante fixo nos testes. Trate fuso e calendário explicitamente quando a regra é uma data local, e não apenas um intervalo de duração.",
      "checks": [
        "Testes controlam dependências externas e verificam casos de falha.",
        "O domínio não exige iniciar servidor para testar uma regra.",
        "O artefato publicado é executado e sua compatibilidade está documentada."
      ],
      "project": "Organize o planejador em domínio, adaptador de entrada e aplicação. Faça uma composição explícita, uma suíte de testes e um smoke test de publicação; acrescente HTTP somente quando o projeto de estudo exigir.",
      "question": "Por que receber um relógio como dependência?",
      "answer": "Para tornar a regra testável e explicitar de onde vem o tempo.",
      "distractors": [
        "Para impedir qualquer erro de lógica automaticamente.",
        "Para fazer todo serviço virar singleton obrigatoriamente."
      ]
    }
  ]
} satisfies DeepCourse;

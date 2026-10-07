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
      "id": "cs-decimal-limites",
      "title": "C#: valores decimais, arredondamento e overflow",
      "level": "Fundamentos",
      "summary": "Calcule preços com uma política explícita de unidade, precisão e arredondamento. Esta aula compara decimal e double, mostra por que checked deve envolver a operação que pode estourar e usa uma cultura fixa nos exemplos. Os exercícios tratam desconto, limites de inteiros e ausência sem substituir erro por zero ou depender da configuração regional do computador.",
      "source": "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/floating-point-numeric-types",
      "topics": [
        "literal decimal com sufixo m",
        "decimal e double",
        "arredondamento com MidpointRounding",
        "cultura na apresentação",
        "checked no ponto da operação",
        "TryParse e contrato de formato",
        "nullable e ausência",
        "limite numérico antes de converter"
      ],
      "sections": [
        {
          "title": "Unidade e representação vêm antes da fórmula",
          "text": [
            "Um preço pode ser representado em centavos inteiros ou em decimal com uma regra de casas decimais. Uma medida científica costuma usar double. O sufixo m produz um literal decimal, enquanto um literal como 0.1 sem sufixo é double. Decimal representa muitas frações decimais de forma exata, mas continua tendo faixa e precisão finitas; uma divisão como um terço exige aproximação.",
            "Escreva no contrato se preço inclui impostos, qual moeda usa e em que etapa arredonda. Um total em reais somado a um frete em centavos mistura unidades mesmo quando os dois são decimal. Um bom nome de variável reduz essa ambiguidade, mas não valida o domínio. A solução deve também rejeitar valores fora da regra, como preço negativo ou percentual acima de cem."
          ]
        },
        {
          "title": "Arredondar é aplicar uma política",
          "text": [
            "Math.Round permite escolher quantidade de casas e MidpointRounding. ToEven seleciona o vizinho com último dígito par nos empates; AwayFromZero afasta o empate de zero. Para 2.345m com duas casas, os resultados são 2.34m e 2.35m respectivamente. A escolha afeta dados financeiros e não deve ser substituída por um ajuste informal, como somar um pequeno epsilon antes da conversão.",
            "Arredondar cada item e arredondar apenas o total pode produzir valores diferentes. Defina a etapa no contrato e teste uma cesta que exponha essa diferença. Formatar com F2 mostra duas casas sem mudar o valor armazenado. Se o restante do cálculo deve usar o valor arredondado, atribua explicitamente o resultado de Math.Round em vez de presumir que Console.WriteLine atualizou o número."
          ]
        },
        {
          "title": "Cultura pertence à fronteira textual",
          "text": [
            "A cultura controla símbolos de separador decimal e algumas regras de formatação e parsing. Um exemplo executado num CI não deve depender de a máquina usar vírgula ou ponto. CultureInfo.InvariantCulture torna a apresentação reproduzível. Uma interface para pessoas pode usar a cultura escolhida pelo produto, mas um arquivo de intercâmbio precisa ter um formato acordado com quem o lê.",
            "Decimal.TryParse retorna sucesso ou falha em vez de lançar FormatException para texto inválido. NumberStyles define formas textuais aceitas, porém a gramática de negócio ainda pode ser mais restrita. Se o campo exige apenas dígitos ASCII e ponto com duas casas, teste essa estrutura explicitamente. Não aceite separadores de milhar ou sinais por acaso quando o contrato declara uma quantia não negativa."
          ]
        },
        {
          "title": "Overflow deve ser conferido onde acontece",
          "text": [
            "Operações inteiras em contexto checked lançam OverflowException quando o resultado não cabe no tipo, em vez de produzir um valor que se enrola na faixa. O contexto envolve a expressão ou bloco indicado; uma chamada feita dentro de checked não transfere automaticamente o contexto para todo o corpo de outra função. Coloque a verificação junto da soma ou multiplicação que pode exceder a capacidade.",
            "Converter para long antes de multiplicar dois int pode ampliar a faixa da operação. Converter o resultado depois da multiplicação não recupera um overflow que já aconteceu. Para um cálculo final que precisa caber em int, valide ou use checked na conversão final também. Decimal tem comportamento de overflow próprio e não deve ser explicado como se tivesse o mesmo enrolamento de um inteiro unchecked."
          ]
        },
        {
          "title": "Ausência, zero e falha são estados distintos",
          "text": [
            "Um decimal? pode conter uma quantia ou null. Use HasValue ou um pattern para distinguir ausência; zero é um valor presente. O operador ?? oferece um padrão para null, mas só faz sentido quando o domínio aceita essa substituição. Se null significa dado ainda não coletado, transformá-lo em zero altera o significado do relatório e pode esconder um problema de integração.",
            "Um TryParse que falhou não produziu um preço válido apenas porque a variável de saída contém zero. Consuma o valor somente no ramo de sucesso. Essa regra também vale para um resultado de desconto ou conversão de faixa. Uma API mais rica pode informar o motivo da falha com enum ou objeto de resultado; o importante é não permitir que o número padrão seja confundido com um dado validado."
          ]
        },
        {
          "title": "Casos de fronteira conferem a política escolhida",
          "text": [
            "Monte testes com zero, valor negativo, percentual zero, percentual cem, empate de arredondamento, entrada inválida e limite do tipo. Explique a expectativa de cada teste antes da execução. Um conjunto que só calcula 10 menos dez por cento pode passar com várias políticas erradas porque esse caso não exige arredondamento nem confronta ausência ou overflow.",
            "Nos exemplos, condições que lançam Exception servem como verificações de estudo e não são um framework completo de testes. A validação normal da função continua executando em Release. Transfira o contrato para uma proposta de compra: preserve o valor original, calcule o valor final segundo a política e apresente a moeda separadamente do número usado no domínio. Documente como a regra mudaria ao trabalhar com mais casas decimais."
          ]
        }
      ],
      "code": "using System;\nusing System.Globalization;\ndecimal a = 0.1m + 0.2m;\ndecimal par = Math.Round(2.345m,2,MidpointRounding.ToEven);\ndecimal fora = Math.Round(2.345m,2,MidpointRounding.AwayFromZero);\nif (a != 0.3m || par != 2.34m || fora != 2.35m) throw new Exception(\"política decimal\");\nConsole.WriteLine(a.ToString(\"F2\",CultureInfo.InvariantCulture));\nConsole.WriteLine(par.ToString(\"F2\",CultureInfo.InvariantCulture));\nConsole.WriteLine(fora.ToString(\"F2\",CultureInfo.InvariantCulture));\ntry {\n    int limite = int.MaxValue;\n    _ = checked(limite + 1);\n    throw new Exception(\"overflow esperado\");\n} catch (OverflowException) {\n    Console.WriteLine(\"overflow detectado\");\n}",
      "expectedOutput": [
        "0.30",
        "2.34",
        "2.35",
        "overflow detectado"
      ],
      "output": "Saída: 0.30, 2.34, 2.35 e overflow detectado. Os dois arredondamentos têm políticas diferentes para o mesmo empate.",
      "trace": [
        "Os literais com m mantêm o cálculo em decimal.",
        "Math.Round recebe uma política de empate explícita e a apresentação usa cultura invariável.",
        "checked envolve a soma que excede int.MaxValue, e a exceção é detectada."
      ],
      "exercise": "Calcule um desconto percentual sobre preço decimal não negativo, aceitando percentual de zero a cem. Arredonde o resultado final para duas casas com AwayFromZero. Rejeite faixas inválidas e teste preço zero, desconto total e um empate.",
      "solution": "using System;\nusing System.Globalization;\nstatic decimal Descontar(decimal preco, decimal percentual) {\n    if (preco < 0 || percentual < 0 || percentual > 100) throw new ArgumentOutOfRangeException();\n    return Math.Round(preco * (1m - percentual / 100m),2,MidpointRounding.AwayFromZero);\n}\nif (Descontar(0m,10m)!=0m || Descontar(10m,100m)!=0m || Descontar(2.345m,0m)!=2.35m)\n    throw new Exception(\"desconto\");\nbool rejeitou=false;\ntry {Descontar(10m,101m);} catch (ArgumentOutOfRangeException) {rejeitou=true;}\nif (!rejeitou) throw new Exception(\"faixa\");\nConsole.WriteLine(Descontar(2.345m,0m).ToString(\"F2\",CultureInfo.InvariantCulture));",
      "solutionOutput": [
        "2.35"
      ],
      "bug": "O programa converte para long depois de multiplicar dois int. A operação original ainda acontece na largura de int; o cast posterior não evita overflow.",
      "bugCode": "int precoCentavos = 100000;\nint quantidade = 100000;\nlong total = (long)(precoCentavos * quantidade); // cast tarde demais",
      "repair": "Converta um operando antes: checked((long)precoCentavos * quantidade). Se o resultado precisar caber em int, confira essa faixa na conversão final. A posição do cast e do checked faz parte da correção.",
      "checks": [
        "As duas políticas de empate produzem resultados previstos.",
        "A soma fora de int é detectada na operação.",
        "Zero válido não é confundido com falha de parsing ou ausência."
      ],
      "project": "Crie um calculador de orçamento com preço decimal, quantidade inteira e desconto. Separe parsing, domínio, arredondamento e apresentação, documente o formato do arquivo e registre o motivo de rejeição sem produzir total zero para entradas inválidas.",
      "question": "Por que (long)(a * b) pode falhar para dois int grandes?",
      "answer": "A multiplicação ocorre como int antes da conversão do resultado para long.",
      "distractors": [
        "Long sempre tem a mesma faixa de int em C#.",
        "O cast converte ambos os operandos antes de calcular, então não há risco nessa expressão."
      ],
      "practices": [
        {
          "id": "formato",
          "title": "Problema 1: preço com formato de intercâmbio",
          "topics": [
            "TryParse e contrato de formato",
            "cultura na apresentação",
            "literal decimal com sufixo m"
          ],
          "prompt": "Aceite texto de preço com um a seis dígitos ASCII antes do ponto e exatamente duas casas depois dele. Rejeite sinais, vírgula, espaços e casas ausentes. Use TryParse com cultura invariável depois de conferir a gramática.",
          "solution": "using System;\nusing System.Globalization;\nusing System.Text.RegularExpressions;\nstatic bool Preco(string texto,out decimal valor) {\n    valor=0m;\n    return Regex.IsMatch(texto,@\"\\A[0-9]{1,6}\\.[0-9]{2}\\z\") &&\n        decimal.TryParse(texto,NumberStyles.AllowDecimalPoint,CultureInfo.InvariantCulture,out valor);\n}\nif (!Preco(\"0.00\",out var zero) || zero!=0m || !Preco(\"12.50\",out var bom) || bom!=12.50m)\n    throw new Exception(\"preço\");\nforeach (var texto in new[]{\"12,50\",\"-1.00\",\" 1.00\",\"1.0\",\"1.00\\n\"})\n    if (Preco(texto,out _)) throw new Exception(\"formato aceito: \"+texto);\nConsole.WriteLine(bom.ToString(\"F2\",CultureInfo.InvariantCulture));",
          "expectedOutput": [
            "12.50"
          ],
          "explanation": [
            "A expressão usa âncoras de início e fim absolutos para não aceitar uma quebra de linha residual. A gramática define o formato de intercâmbio; TryParse confere a conversão numérica.",
            "O valor de out só é consumido quando o bool indica sucesso. Os limites textuais mantêm o número dentro de uma faixa pequena e documentada, sem depender da cultura do processo."
          ],
          "checks": [
            "0.00 e 12.50 são aceitos.",
            "Cinco formatos inválidos são rejeitados.",
            "Falha não é consumida como preço zero."
          ]
        },
        {
          "id": "inteiro",
          "title": "Problema 2: produto inteiro com faixa final",
          "topics": [
            "checked no ponto da operação",
            "limite numérico antes de converter"
          ],
          "prompt": "Implemente Produto(int a, int b) retornando int com verificação de overflow. Confira 100 * 20 e detecte int.MaxValue * 2. A verificação precisa ocorrer dentro da função.",
          "solution": "using System;\nstatic int Produto(int a,int b) {\n    return checked(a*b);\n}\nif (Produto(100,20)!=2000) throw new Exception(\"produto\");\nbool detectado=false;\ntry {_=Produto(int.MaxValue,2);} catch (OverflowException) {detectado=true;}\nif (!detectado) throw new Exception(\"overflow não detectado\");\nConsole.WriteLine(Produto(100,20));\nConsole.WriteLine(\"limite verificado\");",
          "expectedOutput": [
            "2000",
            "limite verificado"
          ],
          "explanation": [
            "checked fica no corpo que contém a multiplicação. Ele não depende da escolha de contexto do chamador e transforma o resultado fora da faixa em uma falha observável.",
            "A verificação do teste diferencia uma OverflowException esperada de qualquer outra falha. Se a função passar a retornar long, amplie um operando antes da multiplicação e revise o contrato de retorno."
          ],
          "checks": [
            "O caso comum retorna 2000.",
            "O caso extremo lança OverflowException.",
            "Explique por que envolver só a chamada com checked não define o corpo da função."
          ]
        }
      ]
    },
    {
      "id": "cs-metodos-parametros",
      "title": "C#: métodos, parâmetros e estado compartilhado",
      "level": "Fundamentos",
      "summary": "Leia uma assinatura de método como um contrato sobre valores, referências e falhas. Você vai comparar alteração de objeto com troca da referência local, usar out no padrão Try e escrever uma função que valida antes de modificar estado. Os problemas praticam resultado independente e classificação de entrada sem assumir que toda passagem por valor isola um objeto mutável.",
      "source": "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/method-parameters",
      "topics": [
        "passagem por valor",
        "cópia de referência de classe",
        "ref para trocar a variável",
        "out e padrão Try",
        "validação antes da mutação",
        "array copiado versus compartilhado",
        "retorno e efeito observável",
        "exceção como parte do contrato"
      ],
      "sections": [
        {
          "title": "Um método pode devolver valor ou produzir efeito",
          "text": [
            "Um método de cálculo recebe dados e retorna um resultado; um método de comando pode alterar estado. Nome, parâmetros e retorno devem deixar essa escolha clara. Se Total devolve uma soma, quem chama deve poder esperar que os valores recebidos permaneçam iguais. Se Debitar altera uma conta, o contrato deve dizer o que acontece na rejeição e se é possível observar uma alteração parcial.",
            "Escreva pré-condições, pós-condições e falhas antes do corpo. Por exemplo: valor não negativo; no sucesso saldo diminui exatamente valor; na falha saldo permanece igual. Isso permite comparar implementações diferentes e construir testes que não dependem de detalhes internos. Uma assinatura bool TryDebitar comunica uma rejeição esperada, enquanto uma exceção pode representar um argumento fora do contrato."
          ]
        },
        {
          "title": "Passar por valor copia o valor do parâmetro",
          "text": [
            "Para um int, a passagem padrão por valor copia o inteiro. Modificar o parâmetro não modifica a variável do chamador. Para uma classe, o valor copiado é uma referência ao objeto: os dois caminhos apontam para o mesmo objeto. Alterar uma propriedade desse objeto pode ser visto pelo chamador, mesmo que o parâmetro não tenha ref. Esse é um dos motivos para não resumir passagem por valor como sempre cria uma cópia completa.",
            "Reatribuir o parâmetro de classe para new Conta muda apenas a referência local recebida. O chamador continua apontando para o objeto anterior. Para substituir a própria variável do chamador, a assinatura pode usar ref. Não escolha ref só porque quer mudar uma propriedade: o compartilhamento do objeto já permite esse efeito. Escolha a forma que descreve exatamente qual entidade pode ser alterada."
          ]
        },
        {
          "title": "ref e out mudam a relação com a variável",
          "text": [
            "Um parâmetro ref permite ler e escrever a variável fornecida pelo chamador, que deve estar inicializada. out permite entregar um valor por essa variável e exige que o método a atribua em todos os caminhos normais de retorno. A chamada indica ref ou out explicitamente, tornando o efeito na variável visível no local de uso. Essas regras são diferentes da mera mutação de propriedades de um objeto compartilhado.",
            "O padrão Try combina bool com out. No sucesso, o valor de saída tem significado; na falha, o chamador não deve usá-lo como um resultado validado. Uma variável out atribuída a zero por exigência do compilador não torna zero um resultado correto da operação falha. Esse protocolo merece um teste que verifica sucesso com zero, pois ele mostra que o bool e o valor desempenham papéis distintos."
          ]
        },
        {
          "title": "Validação deve preceder a alteração",
          "text": [
            "Se um método altera saldo e só depois descobre uma entrada inválida, o chamador pode receber uma conta parcialmente modificada. Em operações simples, confira todas as pré-condições antes da primeira escrita. Um TryDebitar rejeita valor negativo ou insuficiência sem alterar saldo; somente depois subtrai. Isso estabelece uma propriedade útil de preservação na falha e reduz a necessidade de compensações.",
            "Nem toda operação real pode ser organizada num único passo sem efeitos externos. Arquivos, transações e chamadas de rede podem exigir outras garantias e mecanismos de rollback. Nesta aula o estado é um objeto em memória, com acesso síncrono e sem concorrência. O recorte permite compreender o contrato de mutação; não o apresente como uma solução automática para conta financeira em múltiplas threads ou serviços."
          ]
        },
        {
          "title": "Arrays exigem uma decisão de compartilhamento",
          "text": [
            "Um array é um tipo de referência. Receber int[] por valor copia a referência, portanto alterar um elemento altera o array do chamador. Se a função promete uma nova sequência, copie os elementos para outro array ou construa o resultado sem escrever na entrada. Para um array de inteiros, a cópia separa também os valores de elementos; para um array de objetos, as referências internas continuam compartilhadas.",
            "Retornar uma coleção nova torna a propriedade de independência observável. Depois da chamada, modifique um elemento da saída e confira que a entrada permanece igual. Esse teste distingue cópia de alias. Use uma interface somente leitura quando quer restringir operações disponíveis, mas lembre que ela não congela todas as referências ao objeto. O contrato de compartilhamento vai além dos nomes dos tipos na assinatura."
          ]
        },
        {
          "title": "Testes precisam comparar o antes e o depois",
          "text": [
            "Uma verificação de mutação deve guardar o estado inicial e comparar cada ramo. Teste sucesso, rejeição e um caso limite como débito zero. Para uma substituição com ref, confira que a variável aponta para a nova instância; para uma reatribuição local, confira que ainda aponta para a original. Esses testes mostram a diferença entre mudar o objeto e mudar a referência que uma variável armazena.",
            "Depure com uma tabela de variáveis e objetos: duas variáveis podem conter a mesma referência sem serem a mesma variável. Desenhar essa relação ajuda mais que procurar uma regra genérica de cópia. Transfira o método para um editor de configuração: escolha se a função altera a configuração atual ou devolve uma proposta independente e defina o que a interface deve fazer quando a validação falha."
          ]
        }
      ],
      "code": "using System;\nvar conta=new Conta {Saldo=100};\nstatic bool TryDebitar(Conta conta,int valor) {\n    if (valor<0 || valor>conta.Saldo) return false;\n    conta.Saldo-=valor;\n    return true;\n}\nstatic void TrocarLocal(Conta conta) {\n    conta=new Conta {Saldo=999};\n}\nif (!TryDebitar(conta,30) || conta.Saldo!=70 || TryDebitar(conta,80) || conta.Saldo!=70)\n    throw new Exception(\"débito\");\nTrocarLocal(conta);\nif (conta.Saldo!=70) throw new Exception(\"referência local\");\nConsole.WriteLine(conta.Saldo);\nclass Conta {public int Saldo {get;set;}}",
      "expectedOutput": [
        "70"
      ],
      "output": "Saída: 70. Alterar Saldo alcança o objeto compartilhado; atribuir uma nova Conta ao parâmetro local não troca a variável do chamador.",
      "trace": [
        "O parâmetro contém uma cópia da referência para a mesma instância.",
        "TryDebitar valida antes de modificar a propriedade.",
        "TrocarLocal substitui apenas sua referência local; a conta do chamador conserva 70."
      ],
      "exercise": "Implemente TryMetade(int valor, out int metade). Tenha sucesso apenas para inteiros pares não negativos, inclusive zero. Na falha atribua zero ao out, retorne false e demonstre que o consumidor usa somente o bool para saber se o resultado é válido.",
      "solution": "using System;\nstatic bool TryMetade(int valor,out int metade) {\n    metade=0;\n    if (valor<0 || valor%2!=0) return false;\n    metade=valor/2;\n    return true;\n}\nif (!TryMetade(0,out var zero) || zero!=0 || !TryMetade(8,out var quatro) || quatro!=4 ||\n    TryMetade(3,out _) || TryMetade(-2,out _)) throw new Exception(\"metade\");\nConsole.WriteLine(zero+\" \"+quatro);",
      "solutionOutput": [
        "0 4"
      ],
      "bug": "Uma função recebe int[] e modifica o primeiro elemento, embora prometa devolver uma versão independente. A passagem padrão por valor copia a referência e não o array.",
      "bugCode": "static int[] Preparar(int[] dados) {\n    dados[0]=0;\n    return dados; // entrada e saída compartilham o array\n}",
      "repair": "Construa um array novo, copie os valores e modifique a cópia. Confira também a entrada vazia antes de acessar o índice zero. O teste precisa alterar a saída depois e verificar que a entrada não mudou.",
      "checks": [
        "A falha de débito conserva o saldo.",
        "Sucesso com zero é distinguido de falha com out zero.",
        "Explique a diferença entre alterar uma propriedade e reatribuir o parâmetro."
      ],
      "project": "Crie um preparador de configuração com método de validação e função que devolve uma cópia de valores normalizados. Apresente a proposta antes de substituir a configuração atual e escreva verificações de que falhas conservam o estado original.",
      "question": "O que é copiado ao passar uma instância de classe pelo parâmetro padrão?",
      "answer": "O valor da referência; o objeto continua compartilhado.",
      "distractors": [
        "Uma cópia profunda automática de todo o objeto e de seus campos.",
        "A variável do chamador inteira, permitindo que uma reatribuição local a substitua."
      ],
      "practices": [
        {
          "id": "copia",
          "title": "Problema 1: normalizar sem alterar a entrada",
          "topics": [
            "array copiado versus compartilhado",
            "retorno e efeito observável"
          ],
          "prompt": "Produza um array novo em que números negativos viram zero. Preserve a entrada, aceite array vazio e demonstre independência alterando a saída depois.",
          "solution": "using System;\nstatic int[] Normalizar(int[] dados) {\n    var resultado=new int[dados.Length];\n    for (int i=0;i<dados.Length;i++) resultado[i]=Math.Max(0,dados[i]);\n    return resultado;\n}\nvar entrada=new[]{-2,3};\nvar saida=Normalizar(entrada);\nsaida[1]=9;\nif (entrada[0]!=-2 || entrada[1]!=3 || saida[0]!=0 || saida[1]!=9 || Normalizar(Array.Empty<int>()).Length!=0)\n    throw new Exception(\"independência\");\nConsole.WriteLine(entrada[0]+\" \"+saida[0]+\" \"+saida[1]);",
          "expectedOutput": [
            "-2 0 9"
          ],
          "explanation": [
            "O resultado tem um armazenamento próprio e o laço não escreve em dados. Como os elementos são int, a cópia separa os valores necessários para esse contrato.",
            "A alteração posterior de saida[1] é o teste que revela uma implementação que apenas retornou o array original. O caso vazio também evita acesso ao primeiro elemento sem verificação."
          ],
          "checks": [
            "A entrada conserva -2 e 3.",
            "A saída pode ser alterada independentemente.",
            "A entrada vazia produz saída vazia."
          ]
        },
        {
          "id": "troca",
          "title": "Problema 2: substituir a referência do chamador",
          "topics": [
            "ref para trocar a variável",
            "cópia de referência de classe",
            "passagem por valor"
          ],
          "prompt": "Compare dois métodos que criam uma nova Caixa com Valor 9: um recebe Caixa por valor e outro ref Caixa. Depois da primeira chamada o chamador deve conservar a instância original; depois da segunda deve apontar para uma nova.",
          "solution": "using System;\nstatic void Local(Caixa caixa) {caixa=new Caixa {Valor=9};}\nstatic void Substituir(ref Caixa caixa) {caixa=new Caixa {Valor=9};}\nvar caixa=new Caixa {Valor=1};\nvar original=caixa;\nLocal(caixa);\nif (!ReferenceEquals(caixa,original) || caixa.Valor!=1) throw new Exception(\"local\");\nSubstituir(ref caixa);\nif (ReferenceEquals(caixa,original) || caixa.Valor!=9 || original.Valor!=1) throw new Exception(\"ref\");\nConsole.WriteLine(original.Valor+\" \"+caixa.Valor);\nclass Caixa {public int Valor {get;set;}}",
          "expectedOutput": [
            "1 9"
          ],
          "explanation": [
            "Local recebe uma cópia do valor da referência e altera somente essa cópia. Substituir recebe acesso à variável e pode escrever nela uma referência diferente.",
            "A instância original continua existindo porque original ainda a referencia. Trocar a variável caixa não altera a propriedade Valor do objeto antigo; o teste compara identidade e valor separadamente."
          ],
          "checks": [
            "A chamada por valor preserva a variável do chamador.",
            "A chamada ref substitui sua referência.",
            "O objeto original mantém Valor 1."
          ]
        }
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
      "id": "cs-iteradores-descarte",
      "title": "C#: iteradores, execução adiada e descarte de recursos",
      "level": "Avançado",
      "summary": "Entenda quando uma sequência executa seu código, como MoveNext suspende e retoma um iterador, por que uma nova enumeração pode repetir efeitos e quando recursos são descartados. Separe a validação imediata da produção adiada, escolha conscientemente entre uma coleção viva e um snapshot, e prove a limpeza mesmo quando o consumidor para antes do fim.",
      "source": "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/yield",
      "topics": [
        "chamada de iterador e execução adiada",
        "MoveNext Current e suspensão",
        "IEnumerable e nova enumeração",
        "yield em try finally",
        "Dispose no encerramento do foreach",
        "validação no momento da chamada",
        "LINQ reenumeração e materialização",
        "captura de coleção mutável"
      ],
      "sections": [
        {
          "title": "Uma sequência descreve trabalho que pode acontecer depois",
          "text": [
            "Um método com yield return produz uma sequência por meio de um iterador. Chamar o método não significa percorrer todos os elementos nem executar imediatamente seu corpo. O consumidor pede um enumerador e avança com MoveNext; nesse momento a produção começa ou retoma de onde estava suspensa. Separe três acontecimentos na sua previsão: construir a sequência, avançar o enumerador e obter o valor atual. Confundir esses momentos transforma uma validação aparentemente correta em uma exceção que chega muito depois.",
            "No exemplo, Fonte().Where(...) constrói uma consulta. A mensagem criada aparece antes de abrir porque a produção ainda não começou. O primeiro elemento precisa ser produzido para o filtro examiná-lo, mesmo quando ele não será entregue ao consumidor. Uma consulta não é uma lista já preenchida. Ao revisar desempenho e efeitos, conte quantos elementos a origem precisa visitar para satisfazer a pergunta, além de contar quantos valores o consumidor finalmente recebe."
          ]
        },
        {
          "title": "O enumerador conserva estado entre pedidos",
          "text": [
            "MoveNext devolve true quando foi encontrado um próximo elemento e false quando a sequência terminou. Current só deve ser lido depois de um avanço bem-sucedido e antes de a enumeração terminar. Um yield return entrega um valor e suspende o caminho de execução; no pedido seguinte, o iterador continua após esse ponto. Variáveis locais, a posição do laço e blocos de proteção que ainda não terminaram participam desse estado. A suspensão não equivale a executar uma nova chamada desde a primeira linha.",
            "IEnumerable descreve uma fonte de enumeradores; IEnumerator representa um percurso particular. Um enumerador não deve ser compartilhado como se vários consumidores tivessem posições independentes. Para examinar a mesma fonte novamente, obtenha outro enumerador e entenda se essa origem permite repetição. Uma fonte baseada em estado externo, leitura ou contadores pode produzir resultados diferentes. O tipo da interface não promete que repetir o percurso seja barato, sem efeitos ou equivalente ao anterior."
          ]
        },
        {
          "title": "Sair cedo também exige liberar o recurso",
          "text": [
            "Quando um iterador usa try/finally, o finally deve ser executado ao sair de seu bloco, inclusive quando o enumerador é descartado após uma suspensão. O consumidor pode parar com break antes de pedir todos os elementos. Um foreach que usa um enumerador descartável garante o descarte na saída, seja por término, break ou exceção no corpo. Esse vínculo permite produzir valores enquanto um recurso pertence ao percurso, em vez de abandonar o recurso quando o consumidor perde interesse.",
            "Abrir um recurso antes de yield return e fechar apenas depois do último elemento é insuficiente quando o fechamento não está protegido. O consumidor talvez nunca solicite esse último elemento. Use using ou try/finally conforme o recurso e não dependa do coletor de lixo para uma liberação determinística. Ao controlar IEnumerator manualmente, assuma também a responsabilidade de Dispose. Nas atividades, um contador observável prova que a liberação aconteceu quando o percurso foi encerrado."
          ]
        },
        {
          "title": "Validação imediata pede uma fronteira fora do iterador",
          "text": [
            "Uma verificação escrita no início de um método iterador ainda pertence ao corpo cuja execução é adiada. Se o contrato exige rejeitar um argumento no momento da chamada, escreva um método comum que valide e devolva um iterador interno. O método comum não contém yield: por isso sua validação acontece antes de ele retornar a sequência. A função local ou auxiliar fica responsável somente pela produção. Esse desenho deixa explícito quando um chamador pode esperar a exceção.",
            "Decida também qual dado o iterador conservará. Capturar uma referência a um array significa que mudanças realizadas antes do percurso podem aparecer durante a leitura. Criar uma cópia estabelece um snapshot dos valores copiados e consome memória proporcional ao tamanho. Uma cópia rasa de uma coleção de objetos não congela o estado desses objetos. Na solução usamos inteiros para que a promessa de snapshot seja precisa; para objetos de domínio, o contrato deve definir o que é copiado ou pode mudar."
          ]
        },
        {
          "title": "Materializar muda o momento e a possibilidade de repetição",
          "text": [
            "Muitas operações de LINQ sobre IEnumerable, como Where e Select, montam um processamento que será aplicado ao enumerar. Operações como ToArray e ToList percorrem a fonte e guardam os valores em uma coleção. Materializar pode ser útil quando você precisa repetir a leitura de um resultado estável ou evitar repetir efeitos caros, mas troca execução adiada por trabalho e memória imediatos. Não aplique ToList em todo ponto só para fazer uma falha desaparecer: explique a estabilidade e o custo exigidos.",
            "Uma consulta enumerada duas vezes pode chamar o produtor duas vezes. Considere um produtor que abre arquivo, consulta serviço ou incrementa um contador: contar elementos e depois percorrer novamente pode repetir essas operações. O exemplo usa saída observável para você prever a repetição sem depender de relógio ou rede. Compare guardar a consulta, guardar um único enumerador e guardar um array materializado. As três escolhas conservam coisas diferentes, apesar de todas permitirem ler números."
          ]
        },
        {
          "title": "Teste os momentos e os caminhos de encerramento",
          "text": [
            "Um teste útil confere o estado antes do primeiro avanço, após um valor, após descarte precoce e após uma nova enumeração. Outro teste chama a função com argumento inválido sem enumerar e exige a exceção naquele ponto. Esses casos diferenciam contratos que uma comparação apenas dos valores finais não identifica. Acrescente uma mudança na coleção original entre construção e consumo para verificar se a solução prometeu dados vivos ou um snapshot.",
            "Os programas da aula são completos e executam em .NET; as saídas e invariantes são conferidas pelo CI. Os contadores são uma ferramenta de observação do exemplo, não uma estratégia de gerência de recursos para uma aplicação inteira. Ao transferir para arquivos e conexões reais, mantenha o descarte determinístico e estabeleça quem possui cada recurso. Para origens assíncronas, estude depois IAsyncEnumerable e cancelamento: não acrescente await a um iterador síncrono esperando obter o mesmo contrato."
          ]
        }
      ],
      "code": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nstatic IEnumerable<int> Fonte()\n{\n    Console.WriteLine(\"abrir\");\n    try\n    {\n        for (int i = 1; i <= 4; i++)\n        {\n            Console.WriteLine($\"produzir {i}\");\n            yield return i;\n        }\n    }\n    finally { Console.WriteLine(\"fechar\"); }\n}\nvar consulta = Fonte().Where(x => x % 2 == 0);\nConsole.WriteLine(\"criada\");\nforeach (var valor in consulta)\n{\n    Console.WriteLine($\"ler {valor}\");\n    break;\n}\nConsole.WriteLine(\"fim\");",
      "expectedOutput": [
        "criada",
        "abrir",
        "produzir 1",
        "produzir 2",
        "ler 2",
        "fechar",
        "fim"
      ],
      "output": "A ordem é criada, abrir, produzir 1, produzir 2, ler 2, fechar, fim. O filtro consome 1 e 2 para entregar o primeiro par; break dispara o descarte sem pedir 3 e 4.",
      "trace": [
        "Construir consulta não enumera Fonte e não imprime abrir.",
        "Where precisa examinar o ímpar 1 antes de encontrar o par 2.",
        "Break encerra foreach; o descarte do enumerador executa finally antes de fim."
      ],
      "exercise": "Escreva Positivos(int[] valores) com rejeição de null no momento da chamada. A função precisa devolver uma sequência com os positivos de uma cópia da entrada. Altere o array original antes de enumerar e confira que a sequência preserva os positivos anteriores; percorra o resultado duas vezes.",
      "checks": [
        "Null é rejeitado sem precisar enumerar.",
        "Mudanças no array original não alteram os inteiros do snapshot.",
        "Duas enumerações devolvem os mesmos positivos em ordem."
      ],
      "solution": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nstatic IEnumerable<int> Positivos(int[] valores)\n{\n    ArgumentNullException.ThrowIfNull(valores);\n    var copia = valores.ToArray();\n    return Iterar(copia);\n    static IEnumerable<int> Iterar(int[] entrada)\n    {\n        foreach (var valor in entrada)\n            if (valor > 0) yield return valor;\n    }\n}\nvar entrada = new[] { -1, 2, 0, 4 };\nvar resultado = Positivos(entrada);\nentrada[1] = 99;\nConsole.WriteLine(string.Join(\",\", resultado));\nConsole.WriteLine(string.Join(\",\", resultado));\ntry { _ = Positivos(null!); throw new Exception(\"null aceito\"); }\ncatch (ArgumentNullException) { Console.WriteLine(\"rejeitado-na-chamada\"); }",
      "solutionOutput": [
        "2,4",
        "2,4",
        "rejeitado-na-chamada"
      ],
      "bug": "O produtor valida o limite dentro do corpo de um iterador. Chamar a função com -1 e guardar a sequência não executa essa validação; a exceção só surge quando alguém começa a enumerar.",
      "bugCode": "using System;\nusing System.Collections.Generic;\nstatic IEnumerable<int> Contar(int limite)\n{\n    if (limite < 0) throw new ArgumentOutOfRangeException(nameof(limite));\n    for (int i = 0; i < limite; i++) yield return i;\n}\nvar consulta = Contar(-1);\nConsole.WriteLine(\"a chamada retornou\");\nforeach (var numero in consulta) Console.WriteLine(numero);",
      "repair": "Separe um método comum Contar, sem yield, que valida limite e retorna uma função iteradora interna. Teste só a chamada inválida para provar o momento da rejeição; um teste que enumera sempre pode esconder a diferença de contrato.",
      "project": "Implemente um leitor de registros de um arquivo de estudo que ofereça uma sequência e libere o leitor quando o consumidor termina ou para cedo. Use um recurso descartável instrumentado nos testes para conferir aquisição e liberação. Defina se cada enumeração reabre o arquivo ou se o resultado é um snapshot materializado; teste argumento inválido, arquivo vazio, interrupção no primeiro registro e duas leituras. Não mantenha uma sequência ligada a um leitor que já foi descartado.",
      "question": "Por que o exemplo imprime fechar mesmo sem pedir os valores 3 e 4?",
      "answer": "A saída por break faz foreach descartar o enumerador, e esse descarte executa o finally ativo do iterador.",
      "distractors": [
        "Yield return executa automaticamente todo o resto do laço antes de entregar o primeiro valor.",
        "O coletor de lixo sempre fecha o recurso imediatamente quando break é executado."
      ],
      "practices": [
        {
          "id": "limpeza",
          "title": "Problema 1: provar o descarte após o primeiro valor",
          "topics": [
            "MoveNext Current e suspensão",
            "yield em try finally",
            "Dispose no encerramento do foreach",
            "IEnumerable e nova enumeração"
          ],
          "prompt": "Produza os valores 10 e 20 usando um iterador que incrementa ativo ao iniciar e decrementa no finally. Antes do primeiro MoveNext ativo deve ser zero. Leia só 10, descarte o enumerador e exija ativo zero. Repita por foreach com break e confira que nenhum percurso deixou o recurso ativo.",
          "solution": "using System;\nusing System.Collections.Generic;\nint ativo = 0;\nIEnumerable<int> Valores()\n{\n    ativo++;\n    try { yield return 10; yield return 20; }\n    finally { ativo--; }\n}\nusing (var it = Valores().GetEnumerator())\n{\n    if (ativo != 0) throw new Exception(\"aquisição antecipada\");\n    if (!it.MoveNext() || it.Current != 10 || ativo != 1)\n        throw new Exception(\"primeiro avanço\");\n}\nif (ativo != 0) throw new Exception(\"descarte manual\");\nConsole.WriteLine(\"dispose-ok\");\nforeach (var valor in Valores())\n{\n    if (valor != 10 || ativo != 1) throw new Exception(\"foreach\");\n    break;\n}\nif (ativo != 0) throw new Exception(\"descarte do foreach\");\nConsole.WriteLine(\"foreach-ok\");",
          "expectedOutput": [
            "dispose-ok",
            "foreach-ok"
          ],
          "explanation": [
            "A construção do enumerador não entra no corpo produtor; o primeiro MoveNext inicia o percurso e suspende em 10. O using delimita a responsabilidade de Dispose mesmo sem solicitar 20. A verificação de ativo mostra o caminho de liberação antes de qualquer dependência do coletor de lixo.",
            "O foreach representa outro percurso e sua saída por break também deve executar o finally ativo. A atividade prova os dois caminhos de encerramento e a repetição. Se o decremento ficar apenas depois do segundo yield, as asserções de ativo revelam o recurso que permaneceu aberto."
          ],
          "checks": [
            "Ativo é zero antes de MoveNext e um enquanto o primeiro valor está suspenso.",
            "Dispose deixa ativo zero sem produzir 20.",
            "Foreach com break também encerra a aquisição."
          ]
        },
        {
          "id": "fronteira",
          "title": "Problema 2: validar cedo e conservar um snapshot",
          "topics": [
            "chamada de iterador e execução adiada",
            "validação no momento da chamada",
            "LINQ reenumeração e materialização",
            "captura de coleção mutável"
          ],
          "prompt": "Crie Filtrar(IReadOnlyList<int> valores, int minimo), rejeitando minimo negativo na chamada. Copie os valores nesse momento e devolva por yield somente os inteiros maiores ou iguais ao mínimo. Mude a origem depois da chamada e confira duas enumerações iguais, sem expor a referência original.",
          "solution": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nstatic IEnumerable<int> Filtrar(IReadOnlyList<int> valores, int minimo)\n{\n    ArgumentNullException.ThrowIfNull(valores);\n    if (minimo < 0) throw new ArgumentOutOfRangeException(nameof(minimo));\n    var copia = valores.ToArray();\n    return Produzir();\n    IEnumerable<int> Produzir()\n    {\n        foreach (var valor in copia)\n            if (valor >= minimo) yield return valor;\n    }\n}\nvar origem = new[] { 1, 3, 5 };\nvar consulta = Filtrar(origem, 3);\norigem[1] = 99;\nConsole.WriteLine(string.Join(\",\", consulta));\nConsole.WriteLine(string.Join(\",\", consulta));\ntry { _ = Filtrar(origem, -1); throw new Exception(\"limite aceito\"); }\ncatch (ArgumentOutOfRangeException) { Console.WriteLine(\"rejeitado-na-chamada\"); }",
          "expectedOutput": [
            "3,5",
            "3,5",
            "rejeitado-na-chamada"
          ],
          "explanation": [
            "Filtrar é um método comum porque o yield pertence à função interna Produzir. A validação e a cópia acontecem na chamada, estabelecendo o momento da rejeição e quais inteiros compõem o snapshot. A mudança posterior para 99 afeta a origem, mas não a cópia capturada.",
            "Cada enumeração percorre os mesmos valores copiados e aplica o mínimo validado. A coleção de resultado ainda é produzida de modo adiado; copiar a entrada e materializar toda a saída são decisões diferentes. Com objetos mutáveis no lugar de inteiros, uma cópia rasa exigiria uma promessa de estabilidade mais limitada."
          ],
          "checks": [
            "Minimo negativo lança antes de qualquer enumeração.",
            "A alteração para 99 não aparece no resultado.",
            "Os dois percursos retornam 3 e 5 nessa ordem."
          ]
        }
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

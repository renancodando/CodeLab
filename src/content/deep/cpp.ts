import type {DeepCourse} from './types';
export default {
  "id": "cpp-completo",
  "title": "C++ · do zero ao avançado",
  "description": "Compilação, tipos, funções, RAII, STL, templates, memória, concorrência e desempenho.",
  "icon": "file-code-2",
  "language": "cpp",
  "source": "https://eel.is/c++draft/",
  "lessons": [
    {
      "id": "cpp-fundamentos",
      "title": "C++: compilação, tipos e controle",
      "level": "Fundamentos",
      "summary": "Aprenda a transformar arquivos C++ em um programa executável, compreender diagnósticos de compilação e estabelecer contratos de tipos e entrada. Estude inicialização, conversões, expressões, decisões, repetição e funções, reconhecendo desde o início os limites dos números e o perigo de comportamento indefinido.",
      "topics": [
        "compilação ligação main",
        "headers namespaces",
        "tipos fundamentais auto",
        "inicialização narrowing",
        "signed unsigned overflow",
        "if switch loops",
        "funções parâmetros retorno",
        "const constexpr",
        "entrada e streams"
      ],
      "sections": [
        {
          "title": "Da fonte ao executável",
          "text": [
            "O compilador analisa uma unidade de tradução após o pré-processamento; o linker reúne definições necessárias ao programa. Um erro de sintaxe difere de uma referência não resolvida na ligação. Inclua os headers correspondentes às APIs usadas.",
            "Os exemplos desta trilha usam C++20. Uma referência ao draft da linguagem pode mostrar recursos posteriores: confirme a versão e o suporte do compilador antes de usá-los. main é o ponto de entrada; não escreva lógica com efeitos em inicializações globais sem necessidade."
          ]
        },
        {
          "title": "Tipos e inicialização explícita",
          "text": [
            "Tipos inteiros têm larguras e intervalos dependentes do tipo e da implementação. Use tipos de largura fixa quando o contrato exigir e estiverem disponíveis. auto infere um tipo; não transforma a variável em um recipiente que aceita qualquer tipo depois.",
            "Inicialização com chaves rejeita várias conversões que estreitam valores. Inicialize variáveis antes de ler e use const para expressar que um valor não deve mudar. constexpr exige condições de avaliação constante, mas uma função constexpr também pode ser chamada em execução."
          ]
        },
        {
          "title": "Expressões, conversões e limites",
          "text": [
            "Divisão entre inteiros descarta a parte fracionária em direção a zero. Converta antes da operação quando precisar de ponto flutuante. Conversões entre signed e unsigned podem transformar um negativo em um número positivo grande e afetar comparações.",
            "Overflow de inteiro signed é comportamento indefinido; unsigned tem aritmética modular. Não use overflow como teste de limite para signed. Verifique o intervalo antes de somar ou escolha uma representação cujo contrato acomode os dados."
          ]
        },
        {
          "title": "Condições e laços",
          "text": [
            "if e switch organizam decisões; switch sobre inteiros e enum exige cuidar de fallthrough. Use break ou indique explicitamente um fallthrough intencional. Um enum class impede conversões implícitas que escondem estados de domínio.",
            "for e while exigem invariantes e progresso. Um range-for percorre elementos sem depender de índices. Ao usar índice, mantenha o teste dentro do tamanho; o elemento em posição size não existe. Teste coleção vazia para evitar subtrações unsigned como size - 1."
          ]
        },
        {
          "title": "Funções e passagem de parâmetros",
          "text": [
            "Passagem por valor cria um parâmetro independente; referência permite observar ou alterar o objeto do chamador. const T& pode evitar uma cópia e impedir alteração por essa referência. O objeto referido precisa continuar vivo durante o uso.",
            "Uma função deve declarar entradas válidas, resultado e falhas. Não retorne referência para variável local. Sobrecarga escolhe entre assinaturas; conversões implícitas podem produzir ambiguidades, portanto prefira APIs com intenção clara."
          ]
        },
        {
          "title": "Entrada, saída e diagnóstico",
          "text": [
            "Streams mantêm estado de sucesso e falha. if (cin >> valor) verifica se a leitura conseguiu converter; limpar estado sem descartar a entrada problemática pode repetir a mesma falha. Separe parsing do cálculo para testar sem terminal.",
            "Warnings ajudam a detectar conversões e usos suspeitos, mas não provam segurança. Compile com avisos, execute casos de limite e use sanitizers nas etapas apropriadas. Um programa que compila pode acessar memória inválida ou calcular o resultado errado."
          ]
        }
      ],
      "code": "#include <iostream>\n#include <vector>\n\nint somar_positivos(const std::vector<int>& valores) {\n    int total = 0;\n    for (int valor : valores) {\n        if (valor > 0) total += valor;\n    }\n    return total;\n}\nint main() {\n    std::cout << somar_positivos({-2, 0, 3, 5}) << '\\n';\n    std::cout << somar_positivos({}) << '\\n';\n}",
      "output": "A saída é 8 e 0. O exemplo usa entradas pequenas cujo total cabe em int; uma API geral deve definir e verificar seu limite numérico.",
      "trace": [
        "const referência permite ler o vector sem copiá-lo.",
        "O acumulador é inicializado antes de qualquer leitura.",
        "A coleção vazia não executa o corpo do laço e devolve zero."
      ],
      "exercise": "Implemente contar_intervalo para vector<int>, limites inclusivos e resultado std::size_t. Rejeite limite inferior maior que o superior com std::invalid_argument.",
      "solution": "#include <vector>\n#include <stdexcept>\n#include <cassert>\n#include <cstddef>\nstd::size_t contar_intervalo(const std::vector<int>& dados,int minimo,int maximo) {\n    if(minimo>maximo)throw std::invalid_argument(\"intervalo invertido\");\n    std::size_t total=0;\n    for(int x:dados)if(x>=minimo&&x<=maximo)++total;\n    return total;\n}\nint main(){assert(contar_intervalo({0,1,2,3},1,2)==2);assert(contar_intervalo({},1,2)==0);}",
      "bug": "Ler uma variável antes de inicializá-la não produz um zero confiável. O programa pode apresentar comportamentos diferentes entre builds, e um resultado aparentemente correto não torna a operação válida.",
      "bugCode": "int total;\nfor (int x : {1, 2, 3}) total += x;",
      "repair": "Inicialize total com zero e confira o intervalo das somas. Use avisos do compilador e um teste que executa o caminho sem iterações.",
      "checks": [
        "Conta ambos os limites e ignora valores fora deles.",
        "Não acessa posição inexistente em coleção vazia.",
        "Rejeita intervalo invertido e não depende de conversões signed/unsigned indevidas."
      ],
      "project": "Crie um analisador de números com leitura separada da função de cálculo. Compile com -std=c++20 -Wall -Wextra -Wpedantic e teste leitura inválida, vazio e limites antes de incluir uma interface.",
      "question": "O que significa um programa C++ compilar sem erros?",
      "answer": "Ele passou pela análise exigida pelo compilador; ainda pode conter erros de execução e lógica.",
      "distractors": [
        "Que todo acesso à memória é seguro.",
        "Que overflow signed passa a ser permitido."
      ]
    },
    {
      "id": "cpp-texto-conversao",
      "title": "C++: entrada textual, conversão completa e estados de erro",
      "level": "Fundamentos",
      "summary": "Leia texto sem perder partes da entrada e transforme uma quantidade somente quando o campo inteiro atende ao contrato. Você vai distinguir falha de conversão, texto residual e valor fora da faixa. A aula usa C++20, std::string, getline e from_chars, com programas pequenos que tornam visíveis os estados de erro sem acessar memória inválida.",
      "source": "https://eel.is/c++draft/charconv.from.chars",
      "topics": [
        "string como sequência de unidades char",
        "getline e leitura de linha",
        "extração formatada e texto residual",
        "from_chars e errc",
        "consumo completo da entrada",
        "limites de int",
        "optional para conversão",
        "gramática ASCII e faixa de domínio"
      ],
      "sections": [
        {
          "title": "Um texto precisa ser recebido inteiro",
          "text": [
            "A leitura por operator>> costuma separar tokens pelo espaço; getline recebe o conteúdo até o delimitador de linha. Se um nome pode ter espaço, ler apenas um token perde parte do dado antes da validação. Ao misturar extração formatada e getline no mesmo stream, o delimitador remanescente pode produzir uma linha vazia inesperada. Defina primeiro se o campo é uma linha, um token ou um registro com separadores.",
            "Os exemplos usam istringstream com dados fixos para que o resultado seja reproduzível no CI e no computador do aluno. O mesmo estado de stream existe ao ler cin ou um arquivo. Uma operação pode falhar e marcar failbit; continuar lendo sem entender esse estado não conserta a entrada. Em uma interface interativa, decida se vai rejeitar o registro, limpar o estado e descartar a linha, ou encerrar. Não repita indefinidamente a mesma leitura falha."
          ]
        },
        {
          "title": "char não equivale a letra percebida",
          "text": [
            "std::string é uma sequência contígua de unidades char e mantém seu próprio armazenamento. A biblioteca de strings não escolhe automaticamente uma codificação Unicode. Em um texto UTF-8, uma letra acentuada pode ocupar vários bytes; size informa quantidade de unidades char. Cortar em um índice arbitrário pode dividir uma sequência codificada. Nesta aula os campos numéricos usam ASCII, o que permite uma gramática simples e explícita.",
            "Um índice válido para obter um elemento está entre zero e size() - 1. A função at verifica a faixa e pode lançar out_of_range; operator[] não oferece a mesma verificação de fronteira para índices de elementos. Antes de analisar o primeiro caractere, confira se a string está vazia. Não use o elemento de terminação como se fosse mais um caractere do campo e não suponha que toda leitura produz pelo menos um símbolo."
          ]
        },
        {
          "title": "Conversão parcial não é validação completa",
          "text": [
            "from_chars recebe um intervalo de caracteres e um destino numérico. O resultado contém um ponteiro para o primeiro caractere não consumido e um código de erro. Para aceitar um inteiro que ocupa o campo inteiro, exija código de sucesso e ponteiro igual ao fim do intervalo. Uma conversão que encontra 12 no início de '12kg' não prova que '12kg' seja uma quantidade válida pelo contrato do formulário.",
            "A conversão inteira de from_chars não ignora automaticamente espaços iniciais como certas outras funções e não aceita um sinal de mais inicial nessa interface. Não transforme essas características em uma gramática acidental. Se o domínio exige somente dígitos ASCII, confira essa regra antes e depois confira a faixa do número. Assim a mensagem pode distinguir formato inválido de quantidade proibida."
          ]
        },
        {
          "title": "Largura do tipo e faixa do domínio são limites diferentes",
          "text": [
            "int tem uma faixa de representação dependente da implementação, consultável em numeric_limits<int>. A quantidade permitida pelo produto pode ser muito menor, por exemplo até 500 ingressos. Um valor pode caber em int e ainda ser rejeitado semanticamente. from_chars informa result_out_of_range quando não consegue representar o número no destino; não ignore esse estado nem reutilize o valor do destino como se a conversão tivesse concluído.",
            "A política de erro da função deve ser previsível. std::optional<int> pode representar quantidade válida ou ausência de resultado da conversão, mantendo zero como sucesso. Se precisa diferenciar causas, use um tipo de resultado com um código de erro, em vez de sobrecarregar -1 e zero. Um cast não verifica a faixa e não serve para transformar um texto numérico em um valor validado."
          ]
        },
        {
          "title": "O intervalo de análise depende da vida do texto",
          "text": [
            "Os ponteiros passados a from_chars apontam para o armazenamento de uma string existente. Durante a chamada o texto precisa continuar vivo e seu armazenamento não deve ser invalidado por uma mutação. Faça a conversão dentro do escopo em que a string é válida e retorne o número, não um ponteiro para o texto local. Esse cuidado introduz o conceito de tempo de vida que será aprofundado nas aulas de referências e posse.",
            "Um string_view pode observar um texto sem copiar, mas não mantém o dono vivo. Não o use para devolver uma vista de uma string criada dentro da função. Nesta etapa, uma assinatura const std::string& documenta leitura sem alteração e evita a cópia do campo. Ela não muda a obrigação de o argumento existir durante a chamada. A posse fica com quem chamou, enquanto o resultado é um valor independente."
          ]
        },
        {
          "title": "Rejeições também são resultados de estudo",
          "text": [
            "Para conferir o conversor, use vazio, espaço inicial, espaço final, sinal, sufixo, fração, um valor gigante e o limite exato. Inclua zero e uma sequência com zeros iniciais quando essa forma for aceita. Apenas um teste com '42' não distingue conversão completa de parcial. A matriz de casos mostra qual camada rejeita o dado: gramática, capacidade do tipo ou faixa de negócio.",
            "Compile com avisos e execute as verificações do exemplo. Os asserts servem para conferir o código de estudo e podem ser removidos em builds com NDEBUG; a validação de dados externos precisa estar em condições normais do programa. Transfira o conversor para um importador de estoque e mantenha a separação entre texto bruto, quantidade válida e mensagem de rejeição. Não descarte um erro apenas para produzir um número conveniente."
          ]
        }
      ],
      "code": "#include <charconv>\n#include <optional>\n#include <string>\n#include <iostream>\n#include <cassert>\n\nstd::optional<int> quantidade(const std::string& texto) {\n    if (texto.empty() || texto.size() > 3) return std::nullopt;\n    for (char c : texto) if (c < '0' || c > '9') return std::nullopt;\n    int valor = 0;\n    const auto fim = texto.data() + texto.size();\n    const auto resultado = std::from_chars(texto.data(), fim, valor);\n    if (resultado.ec != std::errc{} || resultado.ptr != fim || valor > 500)\n        return std::nullopt;\n    return valor;\n}\nint main() {\n    const auto zero = quantidade(\"0\"), dez = quantidade(\"010\");\n    assert(zero && *zero == 0 && dez && *dez == 10);\n    assert(!quantidade(\"12kg\") && !quantidade(\"501\") && !quantidade(\"\"));\n    std::cout << *zero << ' ' << *dez << '\\n';\n}",
      "expectedOutput": [
        "0 10"
      ],
      "output": "Saída: 0 10. Texto com sufixo, campo vazio e quantidade maior que 500 são rejeitados; zero continua válido.",
      "trace": [
        "A gramática limita o comprimento e os símbolos antes da conversão.",
        "from_chars precisa indicar sucesso e ter consumido todo o intervalo.",
        "optional com valor zero é presente; !optional testa ausência, sem testar o inteiro."
      ],
      "exercise": "Crie uma função para converter um código ASCII de exatamente quatro dígitos em int, aceitando zeros iniciais. Rejeite qualquer outra forma e retorne optional. Confira 0000, 0042, 123, +123 e 12x4.",
      "solution": "#include <charconv>\n#include <optional>\n#include <string>\n#include <cassert>\n#include <iostream>\nstd::optional<int> codigo(const std::string& texto) {\n    if (texto.size() != 4) return std::nullopt;\n    for (char c : texto) if (c < '0' || c > '9') return std::nullopt;\n    int valor = 0;\n    const auto fim = texto.data() + texto.size();\n    const auto r = std::from_chars(texto.data(), fim, valor);\n    if (r.ec != std::errc{} || r.ptr != fim) return std::nullopt;\n    return valor;\n}\nint main() {\n    assert(codigo(\"0000\") == 0 && codigo(\"0042\") == 42);\n    assert(!codigo(\"123\") && !codigo(\"+123\") && !codigo(\"12x4\"));\n    std::cout << *codigo(\"0042\") << '\\n';\n}",
      "solutionOutput": [
        "42"
      ],
      "bug": "A extração formatada aceita o prefixo 12 de 12kg e o programa apresenta a entrada inteira como válida. A ausência de crash não comprova que todos os caracteres foram consumidos.",
      "bugCode": "#include <sstream>\n#include <iostream>\nint main() {\n    std::istringstream entrada(\"12kg\");\n    int quantidade = 0;\n    if (entrada >> quantidade) std::cout << quantidade << '\\n'; // sufixo não conferido\n}",
      "repair": "Quando o campo precisa ser integralmente numérico, confira sua gramática e o ponteiro final de from_chars. Se escolher um stream, confira também o texto residual e defina uma política de espaços.",
      "checks": [
        "0 e 010 produzem valores presentes.",
        "Campo vazio, sufixo e 501 são rejeitados.",
        "Explique a diferença entre código de sucesso e consumo completo."
      ],
      "project": "Monte um importador de estoque com um campo por linha. Preserve o texto bruto no relatório de rejeição, valide quantidade e limite, e calcule totais apenas com registros aceitos. Documente a gramática ASCII e o que mudaria para campos localizados com separador decimal.",
      "question": "O que precisa ser conferido além de ec == std::errc{} para aceitar o campo inteiro com from_chars?",
      "answer": "Que ptr chegou ao fim do intervalo de caracteres.",
      "distractors": [
        "Que o valor convertido é diferente de zero, porque zero indica erro.",
        "Que a string foi convertida para string_view, pois isso garante sua validade."
      ],
      "practices": [
        {
          "id": "linhas",
          "title": "Problema 1: nome completo e linha vazia",
          "topics": [
            "getline e leitura de linha",
            "string como sequência de unidades char"
          ],
          "prompt": "Leia duas linhas de um istringstream: 'Ana Maria' e uma linha vazia. Preserve o espaço interno, aceite a linha vazia como leitura realizada e detecte o fim do stream na terceira tentativa.",
          "solution": "#include <sstream>\n#include <string>\n#include <cassert>\n#include <iostream>\nint main() {\n    std::istringstream entrada(\"Ana Maria\\n\\n\");\n    std::string nome, vazia, extra;\n    const bool primeira = static_cast<bool>(std::getline(entrada, nome));\n    const bool segunda = static_cast<bool>(std::getline(entrada, vazia));\n    const bool terceira = static_cast<bool>(std::getline(entrada, extra));\n    assert(primeira && nome == \"Ana Maria\" && segunda && vazia.empty() && !terceira);\n    std::cout << nome << '\\n' << vazia.size() << '\\n';\n}",
          "expectedOutput": [
            "Ana Maria",
            "0"
          ],
          "explanation": [
            "getline mantém o espaço interno e remove o delimitador de linha. Uma linha vazia antes de um delimitador é diferente de não conseguir ler nenhum dado no fim do stream.",
            "O estado de sucesso da operação é conferido separadamente do tamanho do texto. Essa distinção também aparece ao validar um CSV: um campo vazio pode existir mesmo que seu contrato depois o rejeite."
          ],
          "checks": [
            "O nome contém o espaço interno.",
            "A segunda leitura tem sucesso com string vazia.",
            "A terceira leitura detecta fim, sem repetir indefinidamente."
          ]
        },
        {
          "id": "inteiro",
          "title": "Problema 2: conversão completa com estouro detectado",
          "topics": [
            "from_chars e errc",
            "consumo completo da entrada",
            "limites de int",
            "optional para conversão"
          ],
          "prompt": "Converta um inteiro com sinal opcional de menos, sem espaços nem sinal de mais. Aceite -12 e 0, rejeite 12x e um número de 40 dígitos. Use os estados de from_chars; não calcule manualmente um int que possa estourar.",
          "solution": "#include <charconv>\n#include <string>\n#include <optional>\n#include <cassert>\n#include <iostream>\nstd::optional<int> inteiro(const std::string& texto) {\n    if (texto.empty()) return std::nullopt;\n    int valor = 0;\n    const auto fim = texto.data() + texto.size();\n    const auto r = std::from_chars(texto.data(), fim, valor);\n    if (r.ec != std::errc{} || r.ptr != fim) return std::nullopt;\n    return valor;\n}\nint main() {\n    assert(inteiro(\"-12\") == -12 && inteiro(\"0\") == 0);\n    assert(!inteiro(\"12x\") && !inteiro(\"+12\") && !inteiro(\" 12\"));\n    assert(!inteiro(std::string(40, '9')));\n    std::cout << *inteiro(\"-12\") << '\\n';\n}",
          "expectedOutput": [
            "-12"
          ],
          "explanation": [
            "O conversor informa falha quando o valor não cabe em int, sem exigir uma multiplicação potencialmente inválida no parser escrito pelo aluno.",
            "O ponteiro final distingue prefixo válido de campo válido. A gramática escolhida admite o sinal de menos suportado pela conversão inteira, mas não adiciona espaços ou sinal de mais implicitamente."
          ],
          "checks": [
            "Aceite -12 e zero.",
            "Rejeite sufixo, espaço e sinal de mais.",
            "O número gigante falha sem overflow aritmético no programa."
          ]
        }
      ]
    },
    {
      "id": "cpp-funcoes-referencias",
      "title": "C++: funções, cópia, referência e tempo de vida",
      "level": "Fundamentos",
      "summary": "Escolha uma assinatura de função que explique quem pode alterar um objeto e por quanto tempo uma referência é válida. Você vai comparar passagem por valor, referência mutável e referência const, proteger um saldo com pré-condições e retornar objetos por valor. Os exercícios mostram cópia de coleções e empréstimo de dados sem devolver referências a variáveis destruídas.",
      "source": "https://eel.is/c++draft/dcl.ref",
      "topics": [
        "parâmetro por valor",
        "referência mutável",
        "referência const",
        "pré-condição e pós-condição",
        "retorno por valor",
        "referência para objeto local",
        "const não significa posse",
        "cópia de vector e dados originais"
      ],
      "sections": [
        {
          "title": "Uma chamada estabelece um contrato observável",
          "text": [
            "Uma função deve dizer o que recebe, o que pode modificar e como representa a falha. A assinatura não precisa listar todas as regras do domínio, mas é o primeiro lugar para indicar valores, observação e mutação. Se a operação promete debitar um saldo, a pós-condição pode ser saldo_final == saldo_inicial - valor no sucesso e saldo inalterado na falha. Essa regra permite conferir o comportamento sem olhar a implementação.",
            "Em C++, tipos fundamentais passados por valor tornam-se valores locais independentes do chamador. Alterar o parâmetro não altera a variável original. Esse isolamento é conveniente para pequenos dados e funções de cálculo. Retornar o resultado por valor torna a transformação explícita. Uma função void que altera uma cópia local e não retorna nada provavelmente não entrega o efeito que seu nome sugere."
          ]
        },
        {
          "title": "Referência mutável permite alterar o argumento",
          "text": [
            "Um parâmetro int& se refere ao objeto do chamador. Uma atribuição ao parâmetro modifica esse objeto; não existe uma cópia independente do inteiro para a escrita. Use essa forma quando o efeito faz parte do contrato e fique atento à possibilidade de dois parâmetros se referirem ao mesmo objeto. Um algoritmo que pressupõe objetos diferentes precisa declarar ou evitar essa hipótese.",
            "Validar antes da primeira alteração simplifica a promessa de deixar o estado intacto na falha. Para debitar, confira valor não negativo e saldo suficiente, depois subtraia. Se a validação vier depois da subtração, você pode precisar desfazer o efeito e ainda lidar com aritmética inválida. Organizar a operação em conferir e então modificar reduz os estados intermediários que o chamador pode observar."
          ]
        },
        {
          "title": "Referência const observa sem adquirir posse",
          "text": [
            "const std::vector<int>& permite observar uma coleção sem copiar o vector e impede certas alterações por essa referência. Ela não mantém o objeto vivo por conta própria e não garante que não exista outra referência mutável. O chamador continua sendo o dono. Durante uma chamada normal e síncrona, ele precisa fornecer um objeto que permanece válido enquanto a função usa o argumento.",
            "Const descreve uma restrição de acesso e deve ser lido junto do tempo de vida. Não é uma garantia geral de imutabilidade profunda, thread safety ou ausência de efeitos. Uma classe pode conter membros mutáveis ou referências a outros objetos. Nesta aula a coleção contém inteiros, o que torna a regra de leitura simples; os módulos de posse e concorrência aprofundam os casos em que observação e validade interagem."
          ]
        },
        {
          "title": "Retornar por valor evita empréstimos de locais mortos",
          "text": [
            "Uma variável local automática é destruída ao terminar seu escopo. Retornar uma referência a essa variável deixa o chamador com uma referência sem um objeto válido para usar. O programa pode compilar com aviso e a falha pode parecer desaparecer em uma execução, mas esse comportamento não estabelece um contrato seguro. O mesmo problema ocorre ao devolver uma vista ou ponteiro para armazenamento pertencente a um objeto local.",
            "Retorne std::vector<int> por valor quando a função produz uma nova coleção. A linguagem e a biblioteca oferecem elisão de cópia e movimentos para evitar cópias desnecessárias em muitos casos. Não introduza uma referência inválida como otimização antecipada. O chamador recebe um objeto com sua própria vida; a função fica livre para encerrar e destruir os dados temporários que não fazem parte do resultado."
          ]
        },
        {
          "title": "Cópia de coleção conserva uma relação de independência",
          "text": [
            "Copiar um vector de inteiros cria uma nova coleção de valores. Alterar um elemento do vector copiado não altera o correspondente no original. Essa propriedade permite funções que recebem uma coleção por valor e a transformam localmente, devolvendo a nova versão. O custo da cópia depende do tamanho, portanto a decisão deve considerar a necessidade de independência e a frequência da operação.",
            "A mesma conclusão não vale automaticamente para um vector de ponteiros ou objetos que compartilham recursos: a coleção pode ser copiada, mas os objetos apontados continuam compartilhados. Especifique o nível de independência que o domínio exige. Nos exemplos com int, os valores não carregam referências internas, de modo que testar o original depois de alterar a cópia confere diretamente a propriedade estudada."
          ]
        },
        {
          "title": "Teste efeitos e vida, além do resultado",
          "text": [
            "Para uma função que modifica estado, confira sucesso, falha e preservação do argumento no ramo de falha. Para uma função que devolve cópia, altere o resultado e confira o original. Esses testes verificam a relação entre objetos; um teste que compara somente a saída inicial pode deixar passar uma assinatura que devolve um empréstimo quando deveria produzir um novo valor.",
            "Ative avisos do compilador e use sanitizers quando estiver estudando acessos e tempo de vida. Uma execução sem diagnóstico não prova que todos os usos possíveis sejam válidos, então a explicação do dono e do escopo continua necessária. Transfira o contrato para um carrinho ou orçamento: escolha se a operação retorna uma proposta nova ou modifica o estado atual, e documente a política de falha antes de escrever a subtração."
          ]
        }
      ],
      "code": "#include <cassert>\n#include <iostream>\nbool debitar(int& saldo, int valor) {\n    if (valor < 0 || valor > saldo) return false;\n    saldo -= valor;\n    return true;\n}\nint dobro(int valor) {\n    valor *= 2;\n    return valor;\n}\nint main() {\n    int saldo = 100;\n    assert(debitar(saldo, 30) && saldo == 70);\n    assert(!debitar(saldo, 80) && saldo == 70);\n    int base = 4;\n    const int resultado = dobro(base);\n    assert(base == 4 && resultado == 8);\n    std::cout << saldo << ' ' << base << ' ' << resultado << '\\n';\n}",
      "expectedOutput": [
        "70 4 8"
      ],
      "output": "Saída: 70 4 8. O débito válido modifica saldo, a tentativa inválida conserva 70 e dobro não altera base.",
      "trace": [
        "int& entrega acesso ao saldo do chamador; a validação vem antes da alteração.",
        "A tentativa de debitar 80 retorna false sem subtrair.",
        "dobro trabalha com uma cópia de base e devolve um valor independente."
      ],
      "exercise": "Escreva creditar(int& saldo, int valor) com saldo e valor não negativos. Rejeite uma soma que exceda numeric_limits<int>::max() sem calcular primeiro a soma perigosa; conserve o saldo na falha.",
      "solution": "#include <limits>\n#include <cassert>\n#include <iostream>\nbool creditar(int& saldo, int valor) {\n    if (saldo < 0 || valor < 0 || valor > std::numeric_limits<int>::max() - saldo)\n        return false;\n    saldo += valor;\n    return true;\n}\nint main() {\n    int saldo = 10;\n    assert(creditar(saldo, 5) && saldo == 15);\n    assert(!creditar(saldo, -1) && saldo == 15);\n    saldo = std::numeric_limits<int>::max();\n    assert(!creditar(saldo, 1) && saldo == std::numeric_limits<int>::max());\n    std::cout << \"crédito verificado\\n\";\n}",
      "solutionOutput": [
        "crédito verificado"
      ],
      "bug": "Uma função devolve const int& apontando para uma variável local. A referência não prolonga a vida dessa variável. Não execute o trecho para tentar descobrir se funciona: explique o escopo do objeto e corrija o tipo de retorno.",
      "bugCode": "const int& resultado() {\n    int local = 42;\n    return local; // referência inválida depois do retorno\n}",
      "repair": "Retorne int por valor. Se a função precisa devolver referência a um objeto do chamador, o contrato deve dizer quem o mantém vivo e por quanto tempo; isso não se aplica ao local criado no trecho.",
      "checks": [
        "O débito inválido preserva o saldo.",
        "A soma que excederia int é rejeitada antes da aritmética.",
        "Explique quem é dono dos objetos recebidos por referência."
      ],
      "project": "Construa um orçamento em memória com funções de crédito e débito. Cada operação precisa documentar suas pré-condições e conservar o saldo na rejeição. Acrescente uma função que cria um relatório por valor e demonstre que ele continua válido depois do retorno.",
      "question": "Por que const T& para um parâmetro não significa que a função passou a ser dona do objeto?",
      "answer": "A referência restringe acesso por ela, mas o dono continua responsável pelo tempo de vida.",
      "distractors": [
        "Toda referência const copia automaticamente o objeto para dentro da função.",
        "Const impede a destruição do objeto até todas as referências serem removidas."
      ],
      "practices": [
        {
          "id": "copia",
          "title": "Problema 1: criar uma coleção independente",
          "topics": [
            "parâmetro por valor",
            "retorno por valor",
            "cópia de vector e dados originais"
          ],
          "prompt": "Receba um vector<int> por valor, substitua os números negativos por zero e devolva a nova coleção. Demonstre que o vector original conserva um valor negativo e que alterar o resultado depois não o modifica.",
          "solution": "#include <vector>\n#include <cassert>\n#include <iostream>\nstd::vector<int> normalizar(std::vector<int> valores) {\n    for (int& valor : valores) if (valor < 0) valor = 0;\n    return valores;\n}\nint main() {\n    const std::vector<int> original{-2, 3};\n    auto copia = normalizar(original);\n    assert((copia == std::vector<int>{0, 3}));\n    copia[1] = 9;\n    assert(original[0] == -2 && original[1] == 3);\n    assert(normalizar({}).empty());\n    std::cout << original[0] << ' ' << copia[0] << ' ' << copia[1] << '\\n';\n}",
          "expectedOutput": [
            "-2 0 9"
          ],
          "explanation": [
            "A passagem por valor cria uma coleção local para a transformação; o retorno entrega o novo valor ao chamador. O caso vazio não faz nenhum acesso a elemento.",
            "A atividade usa vector<int>, portanto a independência inclui os elementos. Se os elementos fossem ponteiros para objetos compartilhados, copiar o vector não copiaria automaticamente os objetos."
          ],
          "checks": [
            "O negativo torna-se zero somente na cópia.",
            "Alterar a cópia não altera o original.",
            "A coleção vazia permanece válida."
          ]
        },
        {
          "id": "observacao",
          "title": "Problema 2: observar o tamanho sem modificar",
          "topics": [
            "referência const",
            "const não significa posse",
            "pré-condição e pós-condição"
          ],
          "prompt": "Receba uma coleção por referência const e conte os valores negativos. Verifique zero ocorrências, duas ocorrências e vazio, garantindo que os elementos não mudam. Explique por que o resultado deve ser um valor, sem referência a um contador local.",
          "solution": "#include <vector>\n#include <cstddef>\n#include <cassert>\n#include <iostream>\nstd::size_t negativos(const std::vector<int>& valores) {\n    std::size_t total = 0;\n    for (int valor : valores) if (valor < 0) ++total;\n    return total;\n}\nint main() {\n    const std::vector<int> valores{-2, 0, -1, 4};\n    assert(negativos(valores) == 2 && negativos({1, 0}) == 0 && negativos({}) == 0);\n    assert((valores == std::vector<int>{-2, 0, -1, 4}));\n    std::cout << negativos(valores) << '\\n';\n}",
          "expectedOutput": [
            "2"
          ],
          "explanation": [
            "A referência const evita copiar a coleção para uma operação de leitura. O contador usa size_t, um tipo capaz de representar contagens de elementos da coleção.",
            "O retorno por valor não depende da vida do contador local. A função não guarda a referência para uso posterior, e o contrato de observação mantém a coleção recebida intacta."
          ],
          "checks": [
            "Duas ocorrências são contadas.",
            "Zero e coleção vazia retornam zero.",
            "Explique por que retornar const size_t& seria incorreto para esse contador."
          ]
        }
      ]
    },
    {
      "id": "cpp-classes-raii",
      "title": "C++: classes, RAII e semântica de valor",
      "level": "Intermediário",
      "summary": "Projete classes que estabelecem invariantes na construção e liberam recursos automaticamente. Aprenda encapsulamento, construtores, destrutores, cópia, movimento, rule of zero, composição e polimorfismo, distinguindo objetos que representam valores daqueles que controlam a posse de um recurso.",
      "topics": [
        "struct class encapsulamento",
        "constructors invariants",
        "RAII destructors",
        "rule of zero five",
        "copy move semantics",
        "composition inheritance",
        "virtual destructor slicing",
        "exceptions guarantees",
        "explicit const methods"
      ],
      "sections": [
        {
          "title": "Construção e invariantes",
          "text": [
            "struct e class diferem nos acessos padrão, não na capacidade de ter métodos e construtores. Um objeto válido deve satisfazer suas invariantes ao terminar a construção. Se não puder construí-lo corretamente, sinalize falha em vez de criar um estado meio pronto.",
            "Inicialize membros na lista de inicialização; a ordem real segue a declaração dos membros. explicit evita conversões implícitas indesejadas por certos construtores. Métodos const descrevem operações que não alteram o estado observável permitido por aquele contrato."
          ]
        },
        {
          "title": "RAII e vida do recurso",
          "text": [
            "RAII associa a posse de um recurso à vida de um objeto. O construtor adquire ou recebe o recurso, e o destrutor o libera. Objetos locais são destruídos ao sair do escopo, inclusive durante a propagação de exceções.",
            "Isso se aplica a memória, arquivos, locks e outros recursos. Um destrutor não deve lançar exceções para comunicar uma falha comum de fechamento. Quando a falha precisa ser observada, ofereça uma operação explícita e preserve a liberação segura."
          ]
        },
        {
          "title": "Cópia e movimento",
          "text": [
            "Copiar um valor cria outra representação conforme seu contrato; mover permite transferir recursos. std::move é uma conversão de categoria de valor que autoriza certas operações de movimento; não move o objeto sozinho.",
            "Um objeto movido continua vivo e deve permanecer em um estado válido segundo o contrato do tipo, que nem sempre especifica seus valores. Não leia um conteúdo presumido após mover. O estado exato depende das garantias da classe."
          ]
        },
        {
          "title": "Rule of zero e operações especiais",
          "text": [
            "Se membros como vector, string e unique_ptr já gerenciam recursos, frequentemente não é preciso escrever destrutor ou operações especiais. Essa rule of zero reduz o risco de dupla liberação e cópias incoerentes.",
            "Quando você implementa gestão manual de recurso, precisa analisar destruição, cópia e movimento em conjunto. Escrever apenas um destrutor pode deixar uma cópia implícita perigosa. Prefira compor tipos que já expressem posse corretamente."
          ]
        },
        {
          "title": "Herança e polimorfismo",
          "text": [
            "Use herança quando o derivado pode cumprir o contrato do base. Polimorfismo por funções virtual permite comportamento escolhido em execução; composição delega sem afirmar substituibilidade. Um base deletado polimorficamente precisa de destrutor virtual apropriado.",
            "Passar um derivado por valor como base pode realizar slicing e perder a parte derivada. Use referências ou ponteiros com posse explícita para polimorfismo. Evite hierarquias em que o cliente precise consultar o tipo concreto para toda operação."
          ]
        },
        {
          "title": "Exceções e consistência",
          "text": [
            "A garantia básica mantém invariantes e evita vazamento; a forte conserva o estado original se a operação falhar; a garantia sem exceção promete que a operação não lança. Não marque noexcept sem entender tudo que a operação chama.",
            "Valide antes de alterar estado quando possível. Uma operação que grava metade dos campos e depois falha pode violar invariantes. Construa o novo estado separadamente e confirme a mudança ao final quando o custo e o contrato justificarem."
          ]
        }
      ],
      "code": "#include <iostream>\n#include <stdexcept>\nclass Saldo {\n    int centavos_;\npublic:\n    explicit Saldo(int centavos):centavos_(centavos){\n        if(centavos<0)throw std::invalid_argument(\"saldo negativo\");\n    }\n    int centavos() const{return centavos_;}\n};\nint main(){Saldo a{250};Saldo b=a;std::cout<<a.centavos()<<' '<<b.centavos()<<'\\n';}",
      "output": "A saída é 250 250. A classe representa um valor, não um recurso exclusivo; a cópia gerada atende ao contrato porque seu único membro é um inteiro.",
      "trace": [
        "O construtor recebe e valida o valor inicial.",
        "O membro privado só é exposto por leitura.",
        "Nenhum destrutor manual é necessário para liberar um int."
      ],
      "exercise": "Crie uma classe Retangulo com dimensões double finitas e não negativas, métodos de leitura e area. Rejeite entradas inválidas no construtor e teste zero e um valor positivo.",
      "solution": "#include <cmath>\n#include <stdexcept>\n#include <cassert>\nclass Retangulo {\n    double largura_,altura_;\npublic:\n    Retangulo(double l,double a):largura_(l),altura_(a){\n        if(!std::isfinite(l)||!std::isfinite(a)||l<0||a<0)throw std::invalid_argument(\"dimensões inválidas\");\n    }\n    double area()const{return largura_*altura_;}\n};\nint main(){assert((Retangulo{3,4}.area()==12));assert((Retangulo{0,4}.area()==0));}",
      "bug": "Uma classe que possui um ponteiro alocado e só escreve destrutor pode copiar o endereço com a cópia padrão. Dois objetos tentarão liberar a mesma alocação.",
      "bugCode": "struct Dono {\n    int* valor = new int(3);\n    ~Dono(){delete valor;}\n};\nDono a;\nDono b = a;",
      "repair": "Prefira int se o objeto representa um valor simples ou unique_ptr se a posse exclusiva é necessária. Defina deliberadamente o contrato de cópia; não adicione operações especiais sem analisar a posse.",
      "checks": [
        "Nenhum objeto válido aceita dimensões negativas ou não finitas.",
        "Cópias de valores têm o comportamento documentado.",
        "Recursos são liberados por objetos de posse e não por convenções manuais espalhadas."
      ],
      "project": "Modele um pedido com itens por valor e um escritor de arquivo por RAII. Faça o pedido não depender do recurso de saída e teste uma falha de escrita sem deixar estado de domínio parcialmente modificado.",
      "question": "std::move por si só transfere um recurso?",
      "answer": "Não; ele altera a categoria da expressão, permitindo uma operação de movimento apropriada.",
      "distractors": [
        "Sim; sempre apaga o conteúdo original imediatamente.",
        "Sim; ele chama automaticamente delete no objeto."
      ]
    },
    {
      "id": "cpp-raii-posse-unica",
      "title": "C++: RAII, posse exclusiva e transferência de recursos",
      "level": "Intermediário",
      "summary": "Associe a duração de um recurso a um objeto e acompanhe o que acontece na saída normal ou por exceção. Esta aula usa RAII e unique_ptr para mostrar aquisição, destruição e transferência de posse, distinguindo mover o ponteiro de copiar o objeto. Os problemas verificam a quantidade de objetos vivos e a preservação de invariantes durante falhas.",
      "source": "https://eel.is/c++draft/unique.ptr",
      "topics": [
        "RAII e duração do recurso",
        "destrutor na saída de escopo",
        "desenrolamento por exceção",
        "unique_ptr não copiável",
        "move transfere a posse",
        "ponteiro movido e estado vazio",
        "rule of zero na composição",
        "observador sem propriedade"
      ],
      "sections": [
        {
          "title": "Um recurso precisa de um dono claro",
          "text": [
            "Memória dinâmica, arquivos e locks têm uma duração que precisa ser controlada. Adquirir um recurso e confiar que cada caminho lembrará de liberá-lo cria uma relação frágil entre trechos distantes. RAII associa o recurso a um objeto: a aquisição estabelece uma instância válida e a destruição libera o recurso quando sua vida termina. O nome histórico menciona inicialização, mas o benefício central é a relação entre vida do objeto e liberação.",
            "Um dono deve ser distinguido de um observador. Um ponteiro bruto pode apontar para um objeto sem assumir sua liberação; isso precisa estar claro no contrato. Se dois trechos acham que são os donos exclusivos, podem tentar liberar duas vezes. Se nenhum é dono, o recurso pode ficar sem liberação. O desenho da API deve tornar a responsabilidade visível antes de qualquer otimização."
          ]
        },
        {
          "title": "O escopo oferece um ponto de destruição previsível",
          "text": [
            "Objetos automáticos já construídos são destruídos na saída do escopo, em ordem inversa à construção conforme as regras da linguagem. Isso acontece também em caminhos de retorno antecipado e no desenrolamento de pilha por exceções. Um gerenciador RAII usa essa relação para manter a liberação próxima da definição de posse, sem repetir limpeza em cada ramo.",
            "Há limites: terminar o processo de certas formas não equivale a um desenrolamento normal, e um construtor que falha não executa o destrutor do objeto completo que nunca terminou de ser construído. Subobjetos já construídos têm suas próprias regras de destruição. Prefira membros que já gerenciam recursos para que uma falha durante a construção não exija uma coleção de ponteiros crus e limpezas manuais."
          ]
        },
        {
          "title": "unique_ptr representa posse exclusiva",
          "text": [
            "std::unique_ptr<T> é um objeto que gerencia um recurso e não pode ser copiado como uma segunda posse exclusiva do mesmo objeto. std::make_unique<T> constrói o objeto gerenciado e entrega o dono. Quando o dono válido é destruído, o deleter correspondente libera o recurso. Não execute delete manual no endereço observado por get, porque a responsabilidade continua com o gerenciador.",
            "Um unique_ptr vazio não possui objeto e pode ser testado antes do acesso. operator* e operator-> exigem que exista um objeto adequado para o uso. O tipo do ponteiro não remove a obrigação de conferir estado vazio após uma operação que pode esvaziá-lo. A regra de posse evita várias falhas de liberação, mas não torna automaticamente qualquer desreferência válida."
          ]
        },
        {
          "title": "Mover transfere o gerenciador, sem copiar o objeto",
          "text": [
            "Mover um unique_ptr para outro transfere sua responsabilidade e deixa o ponteiro de origem vazio, conforme o contrato desse tipo. O objeto gerenciado não precisa ser copiado e pode permanecer no mesmo endereço. std::move é uma conversão de categoria que permite selecionar uma operação de movimento; não é uma função que por si só desloca bytes ou destrói um recurso.",
            "Não generalize o estado vazio para todo objeto movido. Muitos tipos ficam válidos, mas com estado não especificado, e precisam ser usados conforme seus contratos. Nesta aula verificamos o estado definido de unique_ptr depois da transferência. O contador de objetos vivos demonstra que mover o gerenciador não cria uma segunda instância de T nem destrói a instância transferida."
          ]
        },
        {
          "title": "Composição permite seguir a regra de zero",
          "text": [
            "Se uma classe contém string, vector e unique_ptr, seus membros podem gerenciar a própria vida. A classe frequentemente não precisa escrever manualmente destrutor, copy e move para liberar esses recursos. Essa preferência é conhecida como rule of zero. A possibilidade de cópia ou movimento da classe resultante depende dos membros; conter unique_ptr torna a cópia padrão incompatível com posse exclusiva.",
            "Um objeto de domínio pode precisar de uma operação de clone explícita quando copiar significa produzir outro recurso independente. Não transforme uma cópia em compartilhamento silencioso só para compilar. Também não implemente um destrutor sem revisar o efeito sobre operações especiais e invariantes. A aula usa tipos pequenos com posse clara para preparar esse raciocínio antes de cenários de herança e recursos personalizados."
          ]
        },
        {
          "title": "Verifique vida do recurso em caminhos de falha",
          "text": [
            "Um teste de RAII deve observar saída normal, transferência e exceção depois da aquisição. Um contador de instâncias vivas torna essas transições visíveis em um exemplo de estudo. Confira que o contador retorna a zero depois do escopo e que uma transferência conserva uma instância viva, em vez de criar duas. Um teste que só acessa um valor do objeto não demonstra que a limpeza ocorreu.",
            "Observe também a duração de ponteiros não proprietários. Um endereço obtido por get continua válido somente enquanto o objeto gerenciado vive e não foi substituído ou liberado. Guardar esse endereço depois de destruir o dono cria uma referência pendente. Transfira o modelo para arquivos e locks usando gerenciadores da biblioteca e documente a relação entre dono, observador e escopo no desenho da API."
          ]
        }
      ],
      "code": "#include <memory>\n#include <utility>\n#include <cassert>\n#include <iostream>\nstruct Recurso {\n    inline static int vivos = 0;\n    Recurso() {++vivos;}\n    ~Recurso() {--vivos;}\n    Recurso(const Recurso&) = delete;\n    Recurso& operator=(const Recurso&) = delete;\n};\nint main() {\n    {\n        auto origem = std::make_unique<Recurso>();\n        auto* endereco = origem.get();\n        auto destino = std::move(origem);\n        assert(!origem && destino.get() == endereco && Recurso::vivos == 1);\n        std::cout << Recurso::vivos << '\\n';\n    }\n    assert(Recurso::vivos == 0);\n    std::cout << Recurso::vivos << '\\n';\n}",
      "expectedOutput": [
        "1",
        "0"
      ],
      "output": "Saída: 1 e 0. A transferência conserva o objeto e o escopo do novo dono determina sua liberação.",
      "trace": [
        "make_unique cria uma instância gerenciada e um dono.",
        "Mover transfere o dono para destino e deixa origem vazia.",
        "Ao sair do escopo, destino libera o objeto e o contador volta a zero."
      ],
      "exercise": "Crie um recurso RAII com contador de instâncias. Adquira-o com make_unique, lance runtime_error depois da aquisição e confira, no catch externo, que não ficou instância viva.",
      "solution": "#include <memory>\n#include <stdexcept>\n#include <cassert>\n#include <iostream>\nstruct Recurso {\n    inline static int vivos = 0;\n    Recurso() {++vivos;}\n    ~Recurso() {--vivos;}\n};\nint main() {\n    bool capturou = false;\n    try {\n        auto recurso = std::make_unique<Recurso>();\n        assert(Recurso::vivos == 1);\n        throw std::runtime_error(\"falha depois da aquisição\");\n    } catch (const std::runtime_error&) {\n        capturou = true;\n        assert(Recurso::vivos == 0);\n    }\n    assert(capturou);\n    std::cout << \"recurso liberado\\n\";\n}",
      "solutionOutput": [
        "recurso liberado"
      ],
      "bug": "O programa obtém um endereço por get e executa delete nele, embora o unique_ptr continue dono. Ao terminar o escopo haverá uma segunda tentativa de liberação. O trecho deve ser analisado e corrigido, sem executar a falha como demonstração.",
      "bugCode": "auto dono = std::make_unique<int>(42);\nint* observador = dono.get();\ndelete observador; // não transferiu a responsabilidade do dono",
      "repair": "Não libere o observador. Deixe o unique_ptr gerenciar a destruição ou use uma operação de transferência explícita prevista pela API quando realmente necessária. Um endereço observado não equivale a posse adquirida.",
      "checks": [
        "Mover o gerenciador conserva uma única instância.",
        "Saída normal e exceção liberam o recurso.",
        "Um observador não assume responsabilidade de delete."
      ],
      "project": "Crie uma classe que reúne um recurso gerenciado e um relatório em vector. Prefira membros RAII e explique as operações de cópia e movimento permitidas. Simule falha após aquisição e registre o número de recursos vivos antes e depois.",
      "question": "O que ocorre com o objeto gerenciado ao mover um unique_ptr para outro?",
      "answer": "A posse é transferida; não é necessário copiar o objeto e a origem fica vazia.",
      "distractors": [
        "O objeto é copiado e ambos os ponteiros passam a ser donos exclusivos da mesma instância.",
        "Std::move libera imediatamente o objeto, deixando o destino com um endereço inválido."
      ],
      "practices": [
        {
          "id": "composicao",
          "title": "Problema 1: recurso como membro de uma classe",
          "topics": [
            "rule of zero na composição",
            "destrutor na saída de escopo",
            "RAII e duração do recurso"
          ],
          "prompt": "Crie uma classe Caixa que contém unique_ptr<int>, sem destrutor manual. Verifique que não é copiável e é movível, transfira uma instância e preserve o valor 42. Não escreva delete.",
          "solution": "#include <memory>\n#include <utility>\n#include <type_traits>\n#include <cassert>\n#include <iostream>\nstruct Caixa {std::unique_ptr<int> valor = std::make_unique<int>(42);};\nstatic_assert(!std::is_copy_constructible_v<Caixa>);\nstatic_assert(std::is_move_constructible_v<Caixa>);\nint main() {\n    Caixa a;\n    Caixa b = std::move(a);\n    assert(!a.valor && b.valor && *b.valor == 42);\n    std::cout << *b.valor << '\\n';\n}",
          "expectedOutput": [
            "42"
          ],
          "explanation": [
            "O membro unique_ptr gerencia sua própria destruição. A classe não precisa repetir uma limpeza manual; suas operações especiais resultam da composição dos membros.",
            "Os static_assert conferem o contrato de cópia e movimento do tipo, enquanto o assert de execução confere o estado após a transferência. A posse exclusiva é preservada e o valor continua disponível no novo dono."
          ],
          "checks": [
            "A classe não é copiável.",
            "A classe pode ser movida.",
            "O novo dono conserva o valor e nenhum delete manual aparece."
          ]
        },
        {
          "id": "observador",
          "title": "Problema 2: observar enquanto o dono permanece vivo",
          "topics": [
            "observador sem propriedade",
            "unique_ptr não copiável",
            "ponteiro movido e estado vazio"
          ],
          "prompt": "Obtenha um ponteiro observador de um unique_ptr, mova a posse para outro unique_ptr e confira que o observador ainda aponta para o objeto enquanto o novo dono está vivo. Encerre o uso do observador antes de liberar o dono.",
          "solution": "#include <memory>\n#include <utility>\n#include <cassert>\n#include <iostream>\nint main() {\n    auto primeiro = std::make_unique<int>(8);\n    int* observador = primeiro.get();\n    auto segundo = std::move(primeiro);\n    assert(!primeiro && segundo.get() == observador && *observador == 8);\n    *observador = 9;\n    assert(*segundo == 9);\n    std::cout << *segundo << '\\n';\n    observador = nullptr;\n    segundo.reset();\n    assert(!segundo && observador == nullptr);\n}",
          "expectedOutput": [
            "9"
          ],
          "explanation": [
            "Mover o gerenciador não muda o endereço da instância gerenciada neste contrato. O observador continua válido durante a vida do objeto, mas não controla sua liberação.",
            "Antes de reset, o exemplo termina o uso e elimina sua referência observadora. Isso não é um mecanismo geral que limpa todos os aliases automaticamente: outros observadores também precisariam respeitar a mesma duração."
          ],
          "checks": [
            "A origem fica vazia após o movimento.",
            "O observador acessa o mesmo objeto enquanto ele vive.",
            "Nenhum uso acontece depois de reset."
          ]
        }
      ]
    },
    {
      "id": "cpp-stl-algoritmos",
      "title": "C++: STL, iteradores, algoritmos e ranges",
      "level": "Intermediário",
      "summary": "Escolha contêineres pela forma de acesso, conheça invalidação de iteradores e substitua laços frágeis por algoritmos com contratos claros. Estude vector, array, map, unordered_map, set, lambdas, comparadores, ranges e complexidade para transformar dados preservando segurança e previsibilidade.",
      "topics": [
        "vector array deque list",
        "map set unordered_map",
        "iterator categories invalidation",
        "algorithms sort find accumulate",
        "lambdas captures",
        "comparators strict weak ordering",
        "ranges views lifetime",
        "complexity"
      ],
      "sections": [
        {
          "title": "Contêineres e padrões de uso",
          "text": [
            "vector oferece armazenamento contíguo e bom acesso por índice; array tem tamanho fixo. deque permite crescimento nas pontas com propriedades diferentes de contiguidade. list tem nós separados e não é automaticamente mais rápida para inserções que primeiro exigem busca.",
            "map e set mantêm ordem segundo um comparador; unordered_map e unordered_set usam hash. Operações médias rápidas não eliminam custos de memória nem piores casos. Escolha com base em consultas, atualizações, ordem e vida das referências."
          ]
        },
        {
          "title": "Iteradores e invalidação",
          "text": [
            "Um iterador representa uma posição segundo as operações suportadas pelo contêiner. begin inicia e end marca a posição após o último elemento; end não deve ser dereferenciado. Algoritmos normalmente recebem um intervalo semiaberto.",
            "Crescer um vector pode realocar memória e invalidar referências e iteradores. erase também pode invalidar posições. Conheça a regra da operação usada e não guarde uma referência enquanto faz uma mutação capaz de invalidá-la."
          ]
        },
        {
          "title": "Algoritmos expressam contratos",
          "text": [
            "find pesquisa um valor, transform produz valores e accumulate combina uma sequência a partir de um acumulador. O tipo do acumulador inicial pode influenciar o cálculo; um zero inteiro pode truncar resultados que você queria em double.",
            "sort modifica uma sequência e exige acesso aleatório para sua forma usual. stable_sort preserva a ordem relativa de elementos equivalentes. Um algoritmo pronto reduz código, mas ainda exige intervalos válidos, espaço de saída suficiente e um predicado correto."
          ]
        },
        {
          "title": "Lambdas e capturas",
          "text": [
            "Uma lambda é um objeto chamável. Capturar por valor copia valores conforme o contrato; capturar por referência depende da vida do objeto original. Um callback guardado depois que uma variável local morreu pode conter uma referência pendente.",
            "Evite capturas genéricas [&] quando a lambda escapa do escopo ou roda em outra thread. Declare o que precisa e considere se a cópia é apropriada. mutable permite alterar o estado capturado por valor dentro da lambda."
          ]
        },
        {
          "title": "Comparadores e ordenação",
          "text": [
            "Um comparador de ordenação precisa estabelecer uma ordem estrita fraca. a < a deve ser falso e as relações precisam ser consistentes. Usar <= em sort viola o contrato e pode produzir comportamento inválido.",
            "Para desempatar, compare campos em sequência ou use uma representação ordenável como tuple. Valores especiais, como NaN, exigem uma política quando afetam comparações. Teste elementos equivalentes e a mesma entrada repetida."
          ]
        },
        {
          "title": "Ranges e avaliações preguiçosas",
          "text": [
            "Views compõem filtros e transformações sem necessariamente materializar todos os resultados. Isso reduz alocações em certos cenários, mas a origem e os valores referidos precisam continuar válidos enquanto a view é usada.",
            "Uma view não é sempre uma cópia dos dados. Ao retornar uma view, confira se ela mantém posse adequada ou referencia uma origem que morreu. Meça uma composição preguiçosa contra uma versão materializada no padrão real de acesso."
          ]
        }
      ],
      "code": "#include <algorithm>\n#include <iostream>\n#include <numeric>\n#include <vector>\nint main(){\n    std::vector<int> valores{3,1,3,2};\n    std::sort(valores.begin(),valores.end());\n    valores.erase(std::unique(valores.begin(),valores.end()),valores.end());\n    std::cout<<std::accumulate(valores.begin(),valores.end(),0)<<'\\n';\n    for(int x:valores)std::cout<<x<<' ';\n}",
      "output": "A soma é 6 e a sequência é 1 2 3. unique compacta elementos adjacentes diferentes e devolve um novo limite lógico; erase remove fisicamente a cauda.",
      "trace": [
        "sort deixa valores iguais adjacentes.",
        "unique não reduz o tamanho do vector sozinho.",
        "erase usa o iterador devolvido até end para retirar os elementos restantes."
      ],
      "exercise": "Receba um vector de pares nome e pontos, ordenando por pontos decrescentes e nome crescente como desempate. Não use <= no comparador e teste dois registros equivalentes.",
      "solution": "#include <algorithm>\n#include <cassert>\n#include <string>\n#include <vector>\nstruct Aluno{std::string nome;int pontos;};\nint main(){\n    std::vector<Aluno> a{{\"Lia\",5},{\"Ana\",5},{\"Bia\",2}};\n    std::sort(a.begin(),a.end(),[](const Aluno& x,const Aluno& y){\n        if(x.pontos!=y.pontos)return x.pontos>y.pontos;\n        return x.nome<y.nome;\n    });\n    assert(a[0].nome==\"Ana\");assert(a[1].nome==\"Lia\");\n}",
      "bug": "Uma referência a um elemento de vector pode ficar inválida quando push_back realoca o armazenamento. A referência não acompanha automaticamente a nova posição.",
      "bugCode": "std::vector<int> valores{1};\nint& primeiro=valores[0];\nfor(int i=0;i<1000;++i)valores.push_back(i);\nstd::cout<<primeiro;",
      "repair": "Não mantenha a referência durante operações que podem invalidá-la. Reobtenha o elemento por um índice válido depois das mutações ou escolha uma representação cuja estabilidade atenda ao contrato.",
      "checks": [
        "A ordenação respeita os dois critérios e trata equivalentes.",
        "Não dereferencia end nem mantém referências invalidadas.",
        "A escolha do contêiner e a complexidade das operações são justificadas."
      ],
      "project": "Crie um ranking de estudos com busca por identificador e ordenação de exibição. Separe o índice de consulta da lista de apresentação e teste atualização, remoção e empates.",
      "question": "std::unique remove fisicamente a cauda de um vector?",
      "answer": "Não; ele devolve um novo limite lógico, e erase pode retirar a cauda.",
      "distractors": [
        "Sim; ele sempre reduz size sozinho.",
        "Sim; ele também ordena automaticamente a sequência."
      ]
    },
    {
      "id": "cpp-iteradores-invalidacao",
      "title": "C++: iteradores de vector, invalidação e remoção segura",
      "level": "Avançado",
      "summary": "Percorra vector sem acessar o fim, reconheça quando uma alteração invalida posições e remova elementos consecutivos sem saltar candidatos. Separe capacidade de tamanho, compare erase repetido com compactação e reconstrua acessos após reserve. Os programas usam C++20 e casos de borda verificáveis; views e identidade estável são introduzidas para próximos aprofundamentos.",
      "topics": [
        "intervalo [begin,end)",
        "iterador versus identidade",
        "size versus capacity",
        "realocação e invalidação",
        "retorno de erase e avanço",
        "remoções consecutivas",
        "erase-remove e tamanho lógico",
        "ordem dos elementos preservados",
        "custo de remoções repetidas",
        "views e tempo de vida"
      ],
      "source": "https://eel.is/c++draft/vector.modifiers",
      "sections": [
        {
          "title": "Uma posição precisa de uma sequência válida",
          "text": [
            "Um iterador permite observar e percorrer uma sequência, mas não constitui uma promessa de que sua posição existirá para sempre. Pense numa lista de caixas numeradas: deslocar as caixas muda o significado de uma posição guardada. Antes de ler por *it, identifique qual contêiner criou o iterador, se ainda está vivo e quais operações ocorreram desde sua obtenção. Copiar o iterador não amplia o tempo de vida da sequência nem protege contra sua modificação.",
            "O intervalo usado aqui é [begin(), end()): o início participa da sequência e o fim marca a fronteira excluída. Em um vector vazio, os dois coincidem. O teste it != dados.end() deve acontecer antes da desreferência; end() não representa um último elemento. Para {4, 6}, avançar begin uma vez leva ao valor 6, mas avançar outra vez leva ao marcador de fim, que pode ser comparado e não lido.",
            "Rastreie separadamente valor, posição e identidade. Um índice validado pode servir para recuperar um elemento após uma operação que só realoca, pois a ordem permanece. Se houver remoção ou inserção antes dele, o mesmo índice pode designar outro objeto lógico. Para um catálogo editável, um identificador de registro pode ser uma escolha melhor; localizar esse identificador exige outro contrato e não é resolvido apenas pela aritmética de iteradores."
          ]
        },
        {
          "title": "Tamanho não é espaço reservado",
          "text": [
            "size() conta elementos construídos e acessíveis. capacity() descreve espaço disponível para crescimento sem nova realocação. Reservar capacidade não cria valores nas posições restantes. Um vector vazio pode ter capacity() de oito e size() de zero: dados.at(0) continua lançando out_of_range. Trocar at por operator[] não cria um elemento; apenas elimina a checagem de limite e torna o acesso indevido um problema de comportamento indefinido.",
            "Para estudar invalidação por reserve, solicite uma capacidade estritamente maior que a anterior e obtenha os acessos novamente depois do retorno bem-sucedido. Uma solicitação que já cabe não demonstra realocação. O exemplo confere max_size antes de somar um, evitando ultrapassar o limite anunciado pelo contêiner. Uma biblioteca também deve tratar falhas de alocação conforme seu contrato; os programas desta aula não tentam simular falta real de memória.",
            "Não memorize um fator de crescimento como garantia da linguagem. A capacidade exata depois de expandir depende da implementação. Os testes verificam limites e elementos, sem exigir que a capacidade dobre. Também não use shrink_to_fit como prova de que houve redução: a solicitação pode não ser atendida. Os links apontam para o rascunho atual do padrão; embora ele inclua APIs posteriores, todos os programas executáveis desta aula usam recursos disponíveis em C++20."
          ]
        },
        {
          "title": "Remova e receba a próxima posição",
          "text": [
            "erase de vector desloca o trecho posterior para preencher o espaço. Por isso, o cursor usado para apagar e os acessos a partir daquele ponto precisam ser abandonados. A operação oferece uma nova posição: o elemento que segue a remoção, ou o fim quando não há sucessor. Atribua esse retorno a it e teste a condição novamente antes de ler. No ramo que mantém o elemento, avance uma vez.",
            "Considere {0, 0, 1}. Após apagar o primeiro zero, outro zero ocupa a posição inicial. Se o programa avançar também nesse ramo, deixará de examiná-lo. O laço correto mantém um único avanço por decisão: substituir pela posição devolvida ao apagar, incrementar ao conservar. O progresso não depende de que o índice numérico cresça a cada passagem; a redução do tamanho também aproxima a condição de término.",
            "Evite guardar end() fora deste laço e reutilizá-lo depois das remoções. Recalcular a fronteira na condição mantém o teste ligado ao estado atual do vector. A mesma receita não deve ser transferida mecanicamente a todo contêiner: compare os contratos de sua operação de remoção. Aqui trabalhamos com int, sem operações de atribuição que lancem; tipos com estados e exceções próprias exigem analisar as garantias adicionais."
          ]
        },
        {
          "title": "Depure contratos antes de procurar uma saída",
          "text": [
            "O trecho quebrado continua usando o cursor antigo depois de erase. Não existe uma saída específica que uma implementação conforme precise produzir. Um resultado aparentemente correto numa execução não valida esse acesso, pois comportamento indefinido não é um resultado alternativo contratado. A investigação deve marcar a primeira operação que tornou a posição inválida e substituir o uso por um acesso obtido sob as regras atuais.",
            "Faça uma tabela de cada passagem: elementos restantes, elemento examinado, decisão e origem do próximo cursor. Para {0, 0, 1, 0, 2, 0}, quatro remoções devem conservar {1, 2}. Acrescente vazio, todos removidos e nenhum removido. Esses casos confrontam término, tratamento do último elemento e ordem dos sobreviventes, cobrindo falhas que uma entrada sem repetição não revela.",
            "Os asserts dos gabaritos são executados no CI sem NDEBUG e confrontam resultados concretos. Eles não transformam o navegador em um compilador e não corrigem qualquer solução enviada pelo estudante. As pausas desta aula avaliam previsão, reconstrução e escolha de acesso localmente. Para executar sua implementação completa, use ferramentas C++20 nos arquivos exportados ou o executor externo configurado; documente o comando e as entradas utilizadas."
          ]
        },
        {
          "title": "Compacte antes de reduzir o contêiner",
          "text": [
            "remove_if percorre um intervalo e organiza os elementos mantidos em seu prefixo. Seu retorno delimita esse prefixo; o algoritmo não altera o tamanho do vector. Para {0, 1, 0, 2, 0}, remover zero produz um prefixo lógico de dois elementos, embora size continue cinco até erase. A cauda não deve ser tratada como coleção de valores removidos: seus valores não são especificados como esse relatório.",
            "erase do intervalo [novoFim, dados.end()) conclui a redução. Não use novoFim depois dessa alteração. Os elementos preservados continuam na ordem relativa anterior, o que permite conferir {1, 2} sem ordenar artificialmente o resultado. Em C++20, std::erase_if reúne o padrão para vector e devolve a quantidade removida; nosso problema compara as duas implementações sobre cópias da mesma entrada.",
            "Apagar individualmente pode mover repetidas vezes o mesmo sufixo. Para muitas remoções numa coleção grande, esse trabalho pode crescer quadraticamente; uma compactação seguida da remoção da cauda percorre o conjunto de forma linear para o predicado constante desta aula. A instrumentação conta uma chamada de predicado por elemento, inclusive com resultado vazio ou nenhuma remoção. Ela não mede tempo de CPU, custo de alocação nem todos os movimentos de um tipo arbitrário."
          ]
        },
        {
          "title": "Acesso emprestado exige tempo de vida",
          "text": [
            "Uma referência, um ponteiro e uma view emprestam acesso a objetos existentes. Eles não tornam o proprietário imortal e não impedem que uma operação mude a organização do armazenamento. Se uma função devolve um span para seu vector local, o uso posterior ficará sem objetos válidos. Se o vector proprietário realoca enquanto uma view existe, os endereços antigos também não se tornam atuais por compartilharem os mesmos valores.",
            "Desenhe duas fronteiras no projeto: quem possui a coleção e quais operações podem ocorrer enquanto alguém a observa. Uma solução simples para o exercício devolve um int por valor depois da reserva, eliminando o empréstimo no retorno. Para dados maiores, escolher cópia, acesso com prazo explícito ou busca por identificador envolve custo e contrato. Não rotule uma dessas opções como solução universal sem conhecer o comportamento exigido.",
            "Os problemas desta aula verificam remoção, ordem e contagem, e o exercício limita a recuperação por índice a reserve sem reordenar nem remover. span, regras de views e identificadores estáveis são apenas introduzidos: ainda precisam de aulas e problemas próprios. No projeto manual, registre antes e depois de cada modificação, mantenha os testes de borda e explique por que nenhum acesso atravessa uma operação que o invalida."
          ]
        }
      ],
      "code": "#include <cassert>\n#include <cstddef>\n#include <iostream>\n#include <stdexcept>\n#include <vector>\nint main() {\n    std::vector<int> dados{1, 2, 3, 4, 5};\n    for (auto it = dados.begin(); it != dados.end();) {\n        if (*it % 2 == 0) it = dados.erase(it);\n        else ++it;\n    }\n    assert((dados == std::vector<int>{1, 3, 5}));\n    std::cout << dados[0] << \" \" << dados[1] << \" \" << dados[2] << \"\\n\";\n    const std::size_t indice = 1;\n    const auto capacidade = dados.capacity();\n    if (capacidade == dados.max_size()) throw std::length_error(\"capacidade máxima\");\n    dados.reserve(capacidade + 1);\n    assert(dados.size() == 3);\n    std::cout << dados.at(indice) << \" \" << dados.size() << \"\\n\";\n}",
      "expectedOutput": [
        "1 3 5",
        "3 3"
      ],
      "output": "Saída: 1 3 5, seguida por 3 3. A reserva altera a capacidade e conserva os três elementos; o acesso é obtido depois dela.",
      "trace": [
        "Cada par é removido sem incrementar o cursor substituído; os ímpares permanecem na ordem.",
        "reserve solicita mais que a capacidade anterior; nenhum cursor antigo é reutilizado.",
        "O índice 1 ainda existe e recupera 3; size permanece 3."
      ],
      "exercise": "Implemente consultar_apos_reserva(dados, indice, capacidade), retornando int por valor. Valide indice antes de reservar, execute apenas reserve e recupere dados.at(indice) depois. Não insira, apague nem reordene. Demonstre que um índice inválido preserva a capacidade anterior e que capacidade disponível não implica elemento construído.",
      "solution": "#include <cassert>\n#include <cstddef>\n#include <iostream>\n#include <stdexcept>\n#include <vector>\nint consultar_apos_reserva(std::vector<int>& dados, std::size_t indice, std::size_t capacidade) {\n    if (indice >= dados.size()) throw std::out_of_range(\"índice sem elemento\");\n    dados.reserve(capacidade);\n    return dados.at(indice);\n}\nint main() {\n    std::vector<int> dados{10, 20, 30};\n    assert(consultar_apos_reserva(dados, 1, 8) == 20);\n    assert(dados.size() == 3 && dados.capacity() >= 8);\n    assert((dados == std::vector<int>{10, 20, 30}));\n    const auto anterior = dados.capacity();\n    bool rejeitou = false;\n    try { consultar_apos_reserva(dados, dados.size(), 16); }\n    catch (const std::out_of_range&) { rejeitou = true; }\n    assert(rejeitou && dados.capacity() == anterior);\n    std::vector<int> vazio;\n    rejeitou = false;\n    try { consultar_apos_reserva(vazio, 0, 8); }\n    catch (const std::out_of_range&) { rejeitou = true; }\n    assert(rejeitou && vazio.empty());\n    vazio.reserve(8);\n    assert(vazio.size() == 0);\n    rejeitou = false;\n    try { (void)vazio.at(0); }\n    catch (const std::out_of_range&) { rejeitou = true; }\n    assert(rejeitou);\n    std::cout << dados.at(1) << \" \" << dados.size() << \"\\nlimites conferidos\\n\";\n}",
      "solutionOutput": [
        "20 3",
        "limites conferidos"
      ],
      "bug": "O laço usa e incrementa o iterador invalidado por erase. Há comportamento indefinido; não se exige nenhuma saída do programa quebrado e ele não é executado pelo verificador.",
      "bugCode": "std::vector<int> dados{0, 0, 1};\nfor (auto it = dados.begin(); it != dados.end(); ++it) {\n    if (*it == 0) dados.erase(it); // it deixa de ser válido\n}",
      "repair": "Use it = dados.erase(it) no ramo de remoção e ++it somente ao manter o elemento. Teste consecutivos e o último removido; comparar uma saída isolada do código quebrado não estabelece validade.",
      "checks": [
        "Rejeitar índice igual a size e vazio antes de alterar a reserva.",
        "Conservar tamanho, ordem e valores; devolver int após o reserve.",
        "Conferir remoções consecutivas, todas, nenhuma e sequência vazia."
      ],
      "project": "Construa um catálogo C++20 que permita excluir registros por condição e consultar valores após reserva. Guarde identificadores nos registros e trate índices como posições transitórias. Entregue casos de exclusão no começo, meio, fim, todos e nenhum, comparação entre laço e compactação e uma explicação do prazo dos acessos. O projeto tem revisão manual; identidade estável e views precisam de decisões adicionais.",
      "question": "Como continuar um laço de vector após apagar o elemento apontado sem saltar candidatos?",
      "answer": "Atribuir o iterador devolvido por erase e só incrementar na etapa que preserva o elemento.",
      "distractors": [
        "Incrementar sempre o iterador antigo e ignorar zeros consecutivos.",
        "Desreferenciar end() para obter o próximo elemento."
      ],
      "practices": [
        {
          "id": "consecutivos",
          "title": "Problema 1: zeros consecutivos sem saltar candidatos",
          "prompt": "Implemente remover_zeros(vector<int>&), devolvendo a quantidade excluída e conservando a ordem dos valores restantes. Use o retorno de erase, sem guardar iteradores antigos nem uma fronteira anterior às modificações. Confronte uma entrada com zeros no início e fim, vazio, todos zeros e nenhum zero.",
          "topics": [
            "retorno de erase e avanço",
            "remoções consecutivas",
            "ordem dos elementos preservados"
          ],
          "solution": "#include <cassert>\n#include <cstddef>\n#include <iostream>\n#include <vector>\nstd::size_t remover_zeros(std::vector<int>& dados) {\n    std::size_t removidos = 0;\n    for (auto it = dados.begin(); it != dados.end();) {\n        if (*it == 0) { it = dados.erase(it); ++removidos; }\n        else ++it;\n    }\n    return removidos;\n}\nint main() {\n    std::vector<int> dados{0, 0, 1, 0, 2, 0};\n    assert(remover_zeros(dados) == 4);\n    assert((dados == std::vector<int>{1, 2}));\n    std::vector<int> vazio, todos{0, 0, 0}, nenhum{3, 4};\n    assert(remover_zeros(vazio) == 0 && vazio.empty());\n    assert(remover_zeros(todos) == 3 && todos.empty());\n    assert(remover_zeros(nenhum) == 0 && (nenhum == std::vector<int>{3, 4}));\n    std::cout << \"4 \" << dados[0] << \" \" << dados[1] << \"\\n\";\n}",
          "expectedOutput": [
            "4 1 2"
          ],
          "explanation": [
            "A cada remoção, erase fornece a posição válida para examinar o sucessor. O ramo não incrementa essa posição, permitindo que dois zeros consecutivos sejam avaliados. Ao conservar um valor, o incremento é o único avanço necessário. O resultado mantém a ordem original porque não há troca com o último elemento.",
            "Os asserts confrontam contagem e conteúdo, inclusive quando o resultado ou a entrada são vazios. A função opera sobre int e não guarda acessos depois do retorno. O laço pode deslocar repetidamente um sufixo longo; a correção deste contrato não comprova eficiência para grandes coleções."
          ],
          "checks": [
            "Remover quatro zeros de {0,0,1,0,2,0}, conservando {1,2}.",
            "Terminar corretamente com vazio, todos removidos e nenhum removido.",
            "Usar o retorno de erase e incrementar somente no ramo de preservação."
          ]
        },
        {
          "id": "compactacao",
          "title": "Problema 2: prefixo lógico, tamanho e custo",
          "prompt": "Implemente remover_negativos(vector<int>&, size_t& chamadas) por remove_if seguido de erase. Zere e conte chamadas do predicado, devolva a quantidade excluída e conserve a ordem dos não negativos. Demonstre que remove sozinho não muda size e compare o resultado final com std::erase_if em C++20, sem ler valores da cauda como se fossem especificados.",
          "topics": [
            "erase-remove e tamanho lógico",
            "ordem dos elementos preservados",
            "custo de remoções repetidas"
          ],
          "solution": "#include <algorithm>\n#include <cassert>\n#include <cstddef>\n#include <iostream>\n#include <iterator>\n#include <vector>\nstd::size_t remover_negativos(std::vector<int>& dados, std::size_t& chamadas) {\n    chamadas = 0;\n    const auto anterior = dados.size();\n    const auto fim = std::remove_if(dados.begin(), dados.end(), [&chamadas](int n) {\n        ++chamadas; return n < 0;\n    });\n    dados.erase(fim, dados.end());\n    return anterior - dados.size();\n}\nint main() {\n    std::vector<int> exemplo{0, 1, 0, 2, 0};\n    auto fim = std::remove(exemplo.begin(), exemplo.end(), 0);\n    assert(std::distance(exemplo.begin(), fim) == 2 && exemplo.size() == 5);\n    exemplo.erase(fim, exemplo.end());\n    assert((exemplo == std::vector<int>{1, 2}));\n    std::vector<int> dados{-2, 0, -1, 3}, controle = dados;\n    std::size_t chamadas = 99;\n    assert(remover_negativos(dados, chamadas) == 2);\n    assert(chamadas == 4 && (dados == std::vector<int>{0, 3}));\n    assert(std::erase_if(controle, [](int n) { return n < 0; }) == 2);\n    assert(controle == dados);\n    std::cout << \"2 \" << dados[0] << \" \" << dados[1] << \"\\npredicado: \" << chamadas << \"\\n\";\n    std::vector<int> vazio, todos{-1, -2}, nenhum{0, 8};\n    assert(remover_negativos(vazio, chamadas) == 0 && chamadas == 0);\n    assert(remover_negativos(todos, chamadas) == 2 && chamadas == 2 && todos.empty());\n    assert(remover_negativos(nenhum, chamadas) == 0 && chamadas == 2);\n    assert((nenhum == std::vector<int>{0, 8}));\n}",
          "expectedOutput": [
            "2 0 3",
            "predicado: 4"
          ],
          "explanation": [
            "remove_if delimita um prefixo de sobreviventes, mas não destrói a cauda nem muda o tamanho do vector. O erase posterior recebe esse intervalo e conclui a redução. O teste separado distingue distância até o novo fim e size antes de apagar, sem exigir qualquer valor dos elementos posteriores.",
            "A contagem de predicado confronta exatamente o tamanho original para int, sem atribuir a medida a movimentos ou tempo real. A comparação com erase_if usa outra coleção, evitando que uma implementação receba a saída da anterior. Vazio, todos negativos e nenhum negativo verificam a reinicialização da contagem e a conservação da ordem."
          ],
          "checks": [
            "Obter {0,3}, duas remoções e quatro chamadas de predicado.",
            "Conferir prefixo de dois elementos e size cinco antes do erase no exemplo de zeros.",
            "Comparar com erase_if e testar vazio, todos e nenhum, sem usar iteradores após apagar."
          ]
        }
      ]
    },
    {
      "id": "cpp-templates",
      "title": "C++: templates, concepts e avaliação constante",
      "level": "Avançado",
      "summary": "Crie algoritmos genéricos com requisitos explícitos, entenda instanciação e diagnósticos de templates e use concepts para expressar capacidades. Explore dedução, overloads, constexpr, if constexpr, variádicos e type traits, mantendo a abstração proporcional às necessidades do código.",
      "topics": [
        "function class templates",
        "deduction instantiation",
        "concepts requires",
        "constraints overloads",
        "if constexpr type_traits",
        "variadic templates folds",
        "constexpr consteval",
        "specialization ODR headers"
      ],
      "sections": [
        {
          "title": "Templates geram implementações",
          "text": [
            "Um template descreve uma família de funções ou classes que pode ser instanciada para tipos apropriados. Não é o mesmo mecanismo de uma função virtual: seleção e geração de código podem ocorrer na compilação.",
            "A definição normalmente precisa estar disponível onde ocorre a instanciação, frequentemente em headers. Uma declaração isolada sem a definição necessária pode produzir falhas de ligação. Organize headers e dependências para não tornar cada pequena mudança uma recompilação enorme."
          ]
        },
        {
          "title": "Dedução e contratos de tipos",
          "text": [
            "A dedução relaciona os argumentos aos parâmetros do template e tem regras para referências, const e decay. Uma função que recebe T por valor pode perder informação que uma referência preservaria. auto e decltype também seguem regras próprias.",
            "Não generalize uma API apenas para aceitar qualquer tipo. Identifique as operações realmente usadas e teste tipos com propriedades diferentes. Uma implementação que funciona para int não prova que funciona para uma classe que tem cópia cara ou não permite cópia."
          ]
        },
        {
          "title": "Concepts e requires",
          "text": [
            "Concepts nomeiam requisitos; requires pode descrever expressões válidas e relações de tipos. Eles melhoram seleção de overloads e diagnósticos, mas muitos requisitos semânticos, como ordem consistente de um comparador, ainda dependem do código cliente.",
            "Use conceitos da biblioteca padrão quando correspondem ao contrato. Um concept que apenas verifica a existência de operator+ não prova associatividade nem ausência de overflow. Documente requisitos que o compilador não consegue verificar.",
            "Dentro de requires { ... }, escrever std::integral<T>; cria um requisito simples: pergunta se essa expressão é bem formada. Ela também é bem formada para double, embora o valor do conceito seja false. Para exigir esse valor verdadeiro dentro do bloco, escreva requires std::integral<T>;. Outra forma, fora do bloco, é concept Inteiro = std::integral<T>. Não confunda testar uma expressão com exigir sua condição.",
            "Compile provas positivas e negativas: Inteiro<int> e Inteiro<unsigned> devem passar; Inteiro<double> e Inteiro<std::string> devem falhar. std::integral inclui bool; excluir bool exige outro requisito explícito, não faz parte do contrato desta pausa. Referências do rascunho público: https://eel.is/c++draft/expr.prim.req.simple e https://eel.is/c++draft/expr.prim.req.nested. Os programas desta aula são conferidos em C++20."
          ]
        },
        {
          "title": "Decisões na instanciação",
          "text": [
            "if constexpr descarta ramos segundo uma condição constante no contexto apropriado. Isso permite usar operações específicas de um tipo sem instanciar o ramo incompatível. Não confunda com um if comum que decide somente durante a execução.",
            "type_traits descreve propriedades e transformações de tipos. Prefira mecanismos explícitos e pequenos. Um grande conjunto de casos especiais pode indicar que interfaces separadas ficariam mais fáceis de manter do que um template universal.",
            "quantidade recebe um objeto por const T&. Neste contrato, int representa um item e string, vector e array oferecem size(). O teste requires { valor.size(); } inspeciona a expressão sem executá-la. Um if comum ainda instancia o uso de valor.size() ao chamar quantidade(7), causando erro; if constexpr descarta esse ramo na instanciação de int. Para as coleções admitidas, o ramo escolhido chama size normalmente e conserva zero quando a coleção está vazia.",
            "Essa técnica não torna válido qualquer código em um ramo descartado: o trecho continua precisando ser analisável e regras não dependentes do parâmetro continuam relevantes. Também não transforma um if fora de template em um mecanismo geral para esconder erros de tipo. O contrato limita os tipos admitidos; não afirma que qualquer método chamado size possui o mesmo significado ou custo. Consulte https://eel.is/c++draft/stmt.if."
          ]
        },
        {
          "title": "Sobrecargas com requisitos compartilhados",
          "text": [
            "ComTamanho descreve size() convertível para size_t. ComReserva reutiliza ComTamanho<T> e acrescenta a expressão reserva: valor.reserve(n). A família preparar possui uma sobrecarga ComTamanho e outra ComReserva. Para vector, ambas são viáveis e a segunda é mais restrita pelos requisitos compartilhados; array só oferece a primeira. A função especializada reserva espaço para quatro itens adicionais sem mudar size ou os elementos; a primeira conserva a coleção fixa.",
            "Não escolha a sobrecarga contando frases ou supondo que o compilador demonstra qualquer equivalência lógica. A ordenação usa restrições normalizadas e identidade dos requisitos atômicos. Copiar o corpo de ComTamanho para um segundo conceito pode criar requisitos diferentes e uma chamada ambígua, mesmo que o texto pareça equivalente. Reutilize o conceito para representar o refinamento e compile consumidores de cada família. O exemplo usa coleções pequenas e não pretende resolver limites de capacidade ou falha de alocação para entradas arbitrárias. Referência do rascunho público: https://eel.is/c++draft/temp.constr.order."
          ]
        },
        {
          "title": "Variádicos e folds",
          "text": [
            "Parameter packs representam vários tipos ou valores, e fold expressions combinam operações sobre um pack. A operação precisa ser válida e seu comportamento para um pack vazio deve ser definido.",
            "Encaminhamento perfeito usa forwarding references e std::forward para conservar categorias de valor, mas não é necessário em toda função genérica. Encaminhar um valor consumido mais de uma vez pode quebrar expectativas de posse."
          ]
        },
        {
          "title": "Cálculo constante e organização",
          "text": [
            "constexpr permite avaliação constante quando suas condições são satisfeitas; consteval exige avaliação imediata. Avaliação em compilação desloca custo, mas também pode aumentar tempo de build e dificultar diagnósticos.",
            "Especializações e definições precisam respeitar regras de uma definição, ODR. Nem todo código em header pode ser repetidamente definido sem cuidado; inline, templates e objetos constantes têm regras específicas. Verifique build com várias unidades de tradução."
          ]
        }
      ],
      "code": "#include <concepts>\n#include <iostream>\n#include <type_traits>\n\ntemplate<std::integral T>\nconstexpr bool par(T valor){return valor%2==0;}\n\ntemplate<typename... T>\nconstexpr auto somar(T... valores){return (0 + ... + valores);}\n\nstatic_assert(par(4));\nstatic_assert(somar(1,2,3)==6);\nint main(){std::cout<<par(5)<<' '<<somar(2,3)<<'\\n';}",
      "output": "A saída é 0 5. static_assert verifica expressões constantes na compilação; as mesmas funções também podem participar de chamadas em execução.",
      "trace": [
        "std::integral restringe par a tipos integrais.",
        "O fold soma a partir de zero, inclusive no caso de pack vazio.",
        "static_assert falha durante a compilação se a condição for falsa."
      ],
      "exercise": "Crie minimo_de_dois para tipos que satisfaçam std::totally_ordered, recebendo por valor e devolvendo o menor valor por valor. Teste int e string e explique o custo de cópia.",
      "solution": "#include <concepts>\n#include <string>\n#include <cassert>\ntemplate<std::totally_ordered T>\nT minimo_de_dois(T a,T b){return b<a?b:a;}\nint main(){assert(minimo_de_dois(3,2)==2);assert(minimo_de_dois(std::string{\"b\"},std::string{\"a\"})==\"a\");}",
      "bug": "Retornar uma referência a um parâmetro recebido por valor cria uma referência pendente quando a chamada termina. Tornar a função genérica não muda a vida desses objetos.",
      "bugCode": "template<typename T>\nconst T& primeiro(T valor){return valor;}",
      "repair": "Devolva T por valor para esse contrato. Se a API precisar devolver uma referência, receba um objeto cuja vida seja suficiente e documente o vínculo; rejeite ou trate temporários quando necessário.",
      "checks": [
        "Requisitos do template correspondem às operações usadas.",
        "A API não devolve referências para parâmetros locais.",
        "Casos de tipos distintos e valores equivalentes são cobertos."
      ],
      "project": "Escreva uma pequena biblioteca de algoritmos genéricos com concepts, um teste constexpr e testes de execução. Compile consumidores em duas unidades de tradução para verificar headers e ligação.",
      "question": "Um concept prova que um comparador satisfaz todas as leis de ordenação?",
      "answer": "Não; ele verifica requisitos disponíveis ao compilador, e leis semânticas ainda precisam ser cumpridas.",
      "distractors": [
        "Sim; qualquer expressão comparável fica matematicamente consistente.",
        "Sim; ele impede todo comportamento indefinido em qualquer implementação."
      ]
    },
    {
      "id": "cpp-memoria-posse",
      "title": "C++: memória, posse e segurança de vida",
      "level": "Avançado",
      "summary": "Entenda duração de armazenamento, vida de objetos, ponteiros, referências e categorias de valor para evitar acessos pendentes. Use unique_ptr, shared_ptr, weak_ptr, span, string_view, optional e variant com contratos explícitos de posse, reconhecendo custos e condições de validade.",
      "topics": [
        "storage duration lifetime",
        "pointers references nullptr",
        "unique_ptr shared_ptr weak_ptr",
        "ownership cycles",
        "span string_view dangling",
        "value categories move forwarding",
        "optional variant visit",
        "alignment allocation placement",
        "sanitizers UB"
      ],
      "sections": [
        {
          "title": "Armazenamento e vida são conceitos distintos",
          "text": [
            "Um endereço pode continuar existindo depois que a vida do objeto terminou. Objetos locais usualmente vivem até o fim do escopo; objetos alocados precisam de um dono responsável por destruição e liberação. Não deduza validade apenas porque o ponteiro não é null.",
            "Referências normalmente expressam um objeto existente, mas também podem ficar pendentes. Ponteiros crus podem representar observação sem posse; deixe essa intenção clara na API e evite transferir posse por convenções escondidas."
          ]
        },
        {
          "title": "Posse exclusiva",
          "text": [
            "unique_ptr representa posse exclusiva e libera o objeto ao ser destruído. Ele pode ser movido, mas não copiado. make_unique organiza construção e evita espalhar new e delete manualmente.",
            "Um ponteiro obtido com get é uma observação; ele não ganha posse. Se o unique_ptr for resetado, movido e destruído pelo novo dono ou sair de escopo, a observação pode deixar de ser válida. Defina quem conserva o recurso vivo durante a operação."
          ]
        },
        {
          "title": "Posse compartilhada e ciclos",
          "text": [
            "shared_ptr mantém um controle de referências à posse; cópias compartilham o objeto. Isso tem custo e não torna o próprio objeto seguro para acesso concorrente. Use posse compartilhada quando há realmente vários donos com vida independente.",
            "Ciclos de shared_ptr podem conservar recursos para sempre. weak_ptr observa sem aumentar a contagem de donos, e lock tenta obter uma posse temporária se o objeto ainda estiver vivo. Não faça uma verificação separada e depois use um endereço cru sem conservar a posse."
          ]
        },
        {
          "title": "Views sem posse",
          "text": [
            "span oferece uma visão de uma sequência contígua e string_view uma visão de caracteres. Eles não garantem que a origem continue viva nem que ela não seja alterada ou realocada. Retornar uma view de uma string local cria uma referência pendente.",
            "Use views para operações cujo período de uso está claramente dentro da vida da origem. Para armazenar dados além desse período, copie para um tipo com posse. Poupar uma cópia não compensa um contrato de vida impossível de cumprir."
          ]
        },
        {
          "title": "Alternativas e ausência por valor",
          "text": [
            "optional representa presença ou ausência de um valor; verificar antes de dereferenciar faz parte do contrato. variant representa uma de várias alternativas e visit permite tratar o valor ativo. Isso pode substituir ponteiros e hierarquias onde a lista de alternativas é fechada.",
            "std::move não estende a vida de temporários nem torna uma view proprietária. Categorias de valor influenciam seleção de overloads e movimento, mas a regra de validade de cada referência continua precisando ser analisada."
          ]
        },
        {
          "title": "Memória avançada e diagnóstico",
          "text": [
            "Alinhamento, allocators e construção em armazenamento existente são recursos especializados. Antes de usá-los, defina quem destrói objetos, como exceções afetam o estado e quais restrições de aliasing e alinhamento precisam ser satisfeitas.",
            "AddressSanitizer e UndefinedBehaviorSanitizer ajudam a revelar classes de defeitos em caminhos executados. Eles não provam ausência de falhas em todo caminho. Priorize representação segura e teste vida dos recursos, além de medir alocações."
          ]
        }
      ],
      "code": "#include <iostream>\n#include <memory>\n#include <string>\nint main(){\n    auto dono=std::make_unique<std::string>(\"CodeLab\");\n    auto novo=std::move(dono);\n    std::cout<<(dono==nullptr)<<' '<<*novo<<'\\n';\n    auto compartilhado=std::make_shared<int>(7);\n    std::weak_ptr<int> observador=compartilhado;\n    if(auto vivo=observador.lock())std::cout<<*vivo<<'\\n';\n}",
      "output": "A saída começa com 1 CodeLab e depois 7. Para unique_ptr, o movimento transfere a posse e deixa o ponteiro de origem vazio; weak_ptr obtém posse temporária por lock.",
      "trace": [
        "make_unique cria objeto e dono na mesma expressão.",
        "novo passa a liberar a string quando sair do escopo.",
        "lock devolve um shared_ptr que conserva o int vivo durante seu uso."
      ],
      "exercise": "Implemente buscar em um vector<int>, retornando optional<size_t> para a primeira ocorrência. Não devolva um ponteiro para um elemento e teste ausência e coleção vazia.",
      "solution": "#include <optional>\n#include <vector>\n#include <cstddef>\n#include <cassert>\nstd::optional<std::size_t> buscar(const std::vector<int>& dados,int alvo){\n    for(std::size_t i=0;i<dados.size();++i)if(dados[i]==alvo)return i;\n    return std::nullopt;\n}\nint main(){assert(buscar({4,5,4},4)==0);assert(!buscar({},1));assert(!buscar({2},1));}",
      "bug": "string_view de uma string local aponta para caracteres cuja vida termina ao sair da função. O conteúdo pode parecer legível temporariamente, mas a operação não é válida.",
      "bugCode": "std::string_view nome(){\n    std::string local=\"CodeLab\";\n    return local;\n}",
      "repair": "Devolva std::string com posse. Se receber uma view do chamador e devolver parte dela, documente que o retorno depende da mesma origem e não a guarde além da vida permitida.",
      "checks": [
        "Ausência é explícita e não confundida com índice zero.",
        "Nenhum retorno referencia objeto local destruído.",
        "Posse compartilhada não é usada como substituto automático de uma análise de vida."
      ],
      "project": "Modele uma árvore com donos exclusivos e referências observadoras para o pai. Teste destruição do conjunto, remova um ramo e documente quais observações são invalidadas.",
      "question": "shared_ptr torna o objeto apontado seguro para mutação concorrente?",
      "answer": "Não; a posse compartilhada não sincroniza automaticamente o estado do objeto.",
      "distractors": [
        "Sim; qualquer acesso recebe um lock implícito.",
        "Sim; o objeto passa a ser imutável."
      ]
    },
    {
      "id": "cpp-concorrencia-engenharia",
      "title": "C++: concorrência, build e desempenho",
      "level": "Especialização",
      "summary": "Aprenda a organizar trabalho concorrente e medir desempenho sem comprometer correção. Estude threads, jthread, sincronização, atomics, futures e cancelamento, conectando o modelo de memória a testes, sanitizers, sistemas de build, unidades de tradução e escolhas de arquitetura.",
      "topics": [
        "thread jthread stop_token",
        "mutex scoped_lock condition_variable",
        "atomics memory ordering",
        "data races deadlocks",
        "future async",
        "build headers CMake modules",
        "profiling benchmarks",
        "cache locality false sharing",
        "coroutines custom awaitables"
      ],
      "sections": [
        {
          "title": "Threads com vida controlada",
          "text": [
            "Uma thread precisa de uma política de encerramento. jthread participa de um modelo com join automático e pedido cooperativo de parada. Capturas por referência exigem que os objetos capturados sobrevivam ao trabalho.",
            "Um pedido de stop não interrompe arbitrariamente uma operação bloqueante nem desfaz efeitos já ocorridos. Verifique pontos de parada e libere recursos ao encerrar. Não deixe uma thread destacada acessar variáveis locais que podem morrer."
          ]
        },
        {
          "title": "Locks e invariantes compartilhadas",
          "text": [
            "Uma data race em memória comum ocorre quando acessos conflitantes não estão adequadamente sincronizados e tem comportamento indefinido. mutex protege uma região; o contrato deve exigir que todos os acessos relacionados usem a mesma política.",
            "scoped_lock libera locks por RAII e pode ajudar a adquirir vários sem uma ordem ingênua que gere deadlock. condition_variable espera com predicado, pois despertares podem ocorrer sem a condição desejada. Não segure locks durante operações externas lentas sem necessidade."
          ]
        },
        {
          "title": "Atomics e modelo de memória",
          "text": [
            "atomic fornece operações atômicas e relações de sincronização segundo memory order. Não torna uma sequência de várias variáveis uma transação. Um contador independente pode usar uma ordem mais fraca que uma publicação de dados, mas a justificativa precisa ser correta.",
            "Comece com a semântica padrão e simplifique somente quando houver uma análise do modelo de memória e necessidade medida. volatile não substitui atomic para sincronização entre threads. Código lock-free é especializado e não garante automaticamente desempenho melhor."
          ]
        },
        {
          "title": "Futures e corrotinas",
          "text": [
            "future transporta um resultado ou falha de trabalho assíncrono. std::async tem políticas de lançamento que afetam quando e onde a função executa; não suponha uma thread nova sem especificar e compreender a política.",
            "Corrotinas C++ fornecem mecanismos de suspensão e retomada, mas não incluem automaticamente um scheduler universal ou I/O assíncrono. Tipos de retorno, promises e awaitables definem comportamento e vida; use uma biblioteca bem compreendida quando o projeto exigir isso."
          ]
        },
        {
          "title": "Build reproduzível e análise",
          "text": [
            "Um sistema como CMake pode declarar alvos, requisitos de linguagem e dependências. Headers, ligação, bibliotecas e opções por alvo fazem parte do contrato de distribuição. Modules têm suporte variável por ferramenta e exigem uma estratégia de build apropriada.",
            "Teste mais de uma unidade de tradução e configurações de debug e release. Sanitizers e analisadores estáticos detectam problemas diferentes. ThreadSanitizer ajuda com races, mas sua execução e combinações suportadas dependem da plataforma."
          ]
        },
        {
          "title": "Desempenho que preserva resultados",
          "text": [
            "Use um benchmark com carga realista, aquecimento quando necessário e resultados observáveis para evitar que o compilador elimine o trabalho. Compare builds equivalentes e meça dispersão, não só uma execução.",
            "Localidade de cache, alocações e false sharing podem dominar o tempo. Primeiro escolha algoritmos e representação adequados; depois localize gargalos com profiling. Uma otimização que altera o resultado ou adiciona uma race não é válida."
          ]
        }
      ],
      "code": "#include <atomic>\n#include <iostream>\n#include <thread>\n#include <vector>\nint main(){\n    std::atomic<int> total{0};\n    {\n        std::vector<std::jthread> tarefas;\n        for(int t=0;t<4;++t)tarefas.emplace_back([&]{\n            for(int i=0;i<1000;++i)total.fetch_add(1,std::memory_order_relaxed);\n        });\n    }\n    std::cout<<total.load()<<'\\n';\n}",
      "output": "A saída é 4000. O contador é independente e usa incremento atômico; sair do escopo destrói as jthreads e aguarda o trabalho antes da leitura final.",
      "trace": [
        "Cada thread tem mil incrementos.",
        "A operação fetch_add não perde atualizações concorrentes.",
        "O escopo garante join antes de observar o resultado final."
      ],
      "exercise": "Some quatro parciais calculados por threads independentes, escrevendo cada resultado em uma posição diferente de um array. Faça join antes de combinar e não use um acumulador comum não sincronizado.",
      "solution": "#include <array>\n#include <thread>\n#include <vector>\n#include <cassert>\nint main(){\n    std::array<int,4> parciais{};\n    {\n        std::vector<std::jthread> tarefas;\n        for(int t=0;t<4;++t)tarefas.emplace_back([&,t]{parciais[t]=(t+1)*10;});\n    }\n    int total=0;for(int x:parciais)total+=x;\n    assert(total==100);\n}",
      "bug": "Incrementar um int comum em várias threads é uma data race, mesmo que uma execução casual produza o total esperado. ++ envolve leitura e escrita, não uma transação sincronizada.",
      "bugCode": "int total=0;\nstd::jthread a([&]{for(int i=0;i<1000;++i)++total;});\nstd::jthread b([&]{for(int i=0;i<1000;++i)++total;});",
      "repair": "Use um atomic para um contador independente ou parciais isolados combinados depois do join. Se há uma invariante envolvendo vários campos, proteja a operação completa com um mecanismo apropriado.",
      "checks": [
        "Não há leituras simultâneas de estado comum sem sincronização.",
        "Todas as tarefas encerram antes de destruir seus dados.",
        "O benchmark confirma correção e mede uma carga documentada."
      ],
      "project": "Monte um processador de lotes com versão sequencial e concorrente. Compare resultados, use uma ferramenta de análise de races e registre quando o custo de criação e sincronização supera o ganho.",
      "question": "volatile permite compartilhar um contador entre threads sem race?",
      "answer": "Não; volatile não substitui sincronização por mutex ou atomics.",
      "distractors": [
        "Sim; ele torna ++ atomic.",
        "Sim; ele cria uma barreira universal para toda memória."
      ]
    }
  ]
} satisfies DeepCourse;

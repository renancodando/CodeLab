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
            "Use conceitos da biblioteca padrão quando correspondem ao contrato. Um concept que apenas verifica a existência de operator+ não prova associatividade nem ausência de overflow. Documente requisitos que o compilador não consegue verificar."
          ]
        },
        {
          "title": "Decisões na instanciação",
          "text": [
            "if constexpr descarta ramos segundo uma condição constante no contexto apropriado. Isso permite usar operações específicas de um tipo sem instanciar o ramo incompatível. Não confunda com um if comum que decide somente durante a execução.",
            "type_traits descreve propriedades e transformações de tipos. Prefira mecanismos explícitos e pequenos. Um grande conjunto de casos especiais pode indicar que interfaces separadas ficariam mais fáceis de manter do que um template universal."
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

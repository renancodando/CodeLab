/** Conteúdo original: percursos práticos e projetos abertos com revisão por rubrica. */
export type PathAssessment = {prompt:string;options:string[];correct:number;feedback:string[]};
export type LearningPathStage = {
 id:string;title:string;minutes:number;theory:string[];example:string;bug:string;
 exercise:string;solution:string;explanation:string;checkpoints:string[];
 assessment:PathAssessment;references:string[];
};
export type LearningPath = {
 id:string;title:string;description:string;skills:string[];references:string[];stages:LearningPathStage[];
};
export type ProjectLanguage = 'html'|'css'|'javascript'|'typescript'|'python'|'csharp'|'cpp'|'sql';
export type ProjectCriterion = {id:string;label:string};
export type ProjectMilestone = {
 id:string;title:string;goal:string;deliverables:string[];criteria:ProjectCriterion[];
 tests:string[];diagnosis:string;transfer:string;lessonIds:string[];
};
export type CapstoneProject = {
 id:string;language:ProjectLanguage;revision:number;title:string;summary:string;scope:string[];
 constraints:string[];starterFiles:Record<string,string>;milestones:ProjectMilestone[];
 references:string[];execution:'browser'|'local-toolchain';offline:string;
};

export const learningPaths:LearningPath[] = [
  {
    "id": "algoritmos",
    "title": "Algoritmos: decidir, provar e medir",
    "description": "Da especificação ao custo, com invariantes, busca binária e caminhos mínimos sem peso.",
    "skills": [
      "algoritmos-contratos",
      "algoritmos-busca",
      "algoritmos-grafos"
    ],
    "references": [
      "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
    ],
    "stages": [
      {
        "id": "invariantes",
        "title": "O total e a parte já visitada",
        "minutes": 25,
        "theory": [
          "Um algoritmo começa por um contrato: quais entradas existem, qual resultado queremos e quais condições precisam permanecer verdadeiras. No total de uma lista, a coleção vazia não é uma exceção improvisada: seu resultado é zero. Se os valores são inteiros em centavos, mantemos essa unidade durante todo o cálculo; formatar reais pertence à saída.",
          "Um invariante descreve o que sabemos antes de cada repetição. Ao entrar na iteração i, total deve ser a soma dos índices de 0 até i - 1. Inicialmente essa parte é vazia e total vale zero. Somar o item i preserva a afirmação para a próxima iteração. Quando i chega a length, a parte visitada é a lista inteira. Isso também revela por que acessar length quebra o contrato."
        ],
        "example": "function totalCentavos(valores) {\n  let total = 0;\n  for (let i = 0; i < valores.length; i++) total += valores[i];\n  return total;\n}\n// [] -> 0; [2990, 6000] -> 8990",
        "bug": "function totalCentavos(valores) {\n let total;\n for (let i = 0; i <= valores.length; i++) total += valores[i];\n return total;\n}",
        "exercise": "Corrija o total NaN sem fixar 8990. Registre o valor de total e i antes de cada repetição para [], [0] e [2990, 6000].",
        "solution": "function totalCentavos(valores) {\n let total = 0;\n for (let i = 0; i < valores.length; i++) total += valores[i];\n return total;\n}",
        "explanation": "undefined não é o elemento neutro da soma. O último índice válido é length - 1. Corrigir somente a inicialização ainda soma undefined no acesso final; corrigir somente a condição ainda mantém total indefinido. As duas causas são independentes.",
        "checkpoints": [
          "Coleção vazia retorna 0 sem visitar item.",
          "[2990, 6000] retorna 8990 e a entrada não muda.",
          "O registro mostra que i nunca acessa length."
        ],
        "assessment": {
          "prompt": "Para [4, 7, 2], qual é total antes de visitar o índice 2?",
          "options": [
            "11",
            "13",
            "7"
          ],
          "correct": 0,
          "feedback": [
            "Correto: somente índices 0 e 1 já entraram na soma.",
            "13 inclui o índice 2 antes de visitá-lo.",
            "7 é apenas o último item visitado, não a soma parcial."
          ]
        },
        "references": [
          "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
        ]
      },
      {
        "id": "busca-binaria",
        "title": "Uma fronteira que encolhe",
        "minutes": 30,
        "theory": [
          "A busca binária exige uma sequência ordenada conforme a mesma comparação usada na procura. Mantemos uma região semiaberta [inicio, fim): inicio pertence à região e fim fica fora. Em uma lista com n elementos, o começo é 0 e o fim é n. Essa escolha representa naturalmente a lista vazia e permite remover partes sem inventar um índice n - 1 quando n é zero.",
          "Para procurar a primeira posição com valor maior ou igual ao alvo, se lista[meio] for menor descartamos inclusive meio e fazemos inicio = meio + 1. Caso contrário, meio ainda pode ser a resposta e fazemos fim = meio. O intervalo diminui em ambos os caminhos. A resposta pode ser n; nesse caso não existe elemento elegível. Contar comparações ajuda a distinguir esse processo de uma varredura, mas tempo medido também depende do ambiente."
        ],
        "example": "function limiteInferior(lista, alvo) {\n let inicio = 0, fim = lista.length;\n while (inicio < fim) {\n  const meio = Math.floor((inicio + fim) / 2);\n  if (lista[meio] < alvo) inicio = meio + 1;\n  else fim = meio;\n }\n return inicio;\n}\n// [2, 4, 4, 9], 4 -> 1",
        "bug": "// No caso lista[meio] < alvo:\ninicio = meio; // pode manter o intervalo idêntico",
        "exercise": "Repare a atualização e encontre a primeira posição de 4 em [2,4,4,9]. Depois trate [] e um alvo 10. Explique a pré-condição de ordenação.",
        "solution": "if (lista[meio] < alvo) inicio = meio + 1;\nelse fim = meio;\n// [] -> 0; [2,4,4,9], 10 -> 4",
        "explanation": "Quando resta um elemento, meio pode ser igual a inicio. Reatribuir inicio = meio não reduz a região e o loop não termina. Com +1, descartamos um elemento comprovadamente menor. No ramo oposto, preservar meio permite escolher a primeira duplicata.",
        "checkpoints": [
          "Duplicatas retornam a primeira posição elegível.",
          "Lista vazia termina com índice 0.",
          "O índice n é tratado como ausência, sem acessar lista[n]."
        ],
        "assessment": {
          "prompt": "Qual resultado limiteInferior([2,4,4,9], 10) deve devolver?",
          "options": [
            "3: último índice válido",
            "9: último valor",
            "4: posição após todos os itens"
          ],
          "correct": 2,
          "feedback": [
            "3 contém 9, que ainda é menor que 10.",
            "O retorno é um índice, não um valor.",
            "O contrato devolve posição de inserção e permite n."
          ]
        },
        "references": [
          "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
        ]
      },
      {
        "id": "busca-largura",
        "title": "Explorar um grafo por camadas",
        "minutes": 35,
        "theory": [
          "Um grafo de conexões pode ter ciclos, ramificações e vértices isolados. Na busca em largura, uma fila organiza a exploração por distância em número de arestas. O ponto de partida recebe distância zero. Cada vizinho descoberto recebe a distância do vértice atual mais um e entra ao fim da fila. Em arestas sem peso, a primeira descoberta já tem distância mínima.",
          "Marcar visitado ao colocar na fila evita várias entradas para o mesmo vértice. Guardar também o predecessor permite reconstruir um caminho andando de trás para frente. Esse resultado vale para grafos sem peso; trocar uma conexão por custo 100 não mantém a propriedade de mínimo custo. O percurso deve visitar somente a parte alcançável, com custo proporcional a vértices e arestas explorados."
        ],
        "example": "function distancias(grafo, inicio) {\n const distancia = new Map([[inicio, 0]]);\n const fila = [inicio];\n for (let cabeca = 0; cabeca < fila.length; cabeca++) {\n  const atual = fila[cabeca];\n  for (const vizinho of grafo[atual] ?? []) {\n   if (distancia.has(vizinho)) continue;\n   distancia.set(vizinho, distancia.get(atual) + 1);\n   fila.push(vizinho);\n  }\n }\n return distancia;\n}",
        "bug": "// Descoberta sem registro:\nfor (const vizinho of grafo[atual]) fila.push(vizinho);\n// A -> B e B -> A nunca esvaziam a fila.",
        "exercise": "Adicione um conjunto de descobertos e um mapa de predecessores. Reconstrua A -> C -> D em {A:[B,C],B:[A],C:[D],D:[],E:[]}; explique E ausente.",
        "solution": "// No momento de descobrir um vizinho:\nif (!distancia.has(vizinho)) {\n distancia.set(vizinho, distancia.get(atual) + 1);\n predecessor.set(vizinho, atual);\n fila.push(vizinho);\n}\n// predecessor[D]=C; predecessor[C]=A; inverter [D,C,A].",
        "explanation": "O registro precisa acontecer antes de enfileirar outro vértice, pois vários pais podem apontar para o mesmo vizinho. E não tem ligação com A e permanece inalcançável; ausência não equivale a distância zero. A reconstrução para ao alcançar A e inverte a sequência.",
        "checkpoints": [
          "O ciclo A-B-A termina sem repetir a descoberta.",
          "D tem distância 2 e caminho A,C,D.",
          "E fica ausente, sem inventar caminho nem custo."
        ],
        "assessment": {
          "prompt": "A busca em largura garante menor custo quando cada aresta tem um peso diferente?",
          "options": [
            "Sim; basta visitar cada vértice uma vez",
            "Não; garante menos arestas no grafo sem peso",
            "Sim; a fila sempre ordena qualquer custo"
          ],
          "correct": 1,
          "feedback": [
            "Visitar uma vez não basta para minimizar pesos arbitrários.",
            "Os pesos exigem outro algoritmo e outras condições.",
            "A fila ordena descoberta por camada, não soma de pesos."
          ]
        },
        "references": [
          "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
        ]
      }
    ]
  },
  {
    "id": "estruturas-dados",
    "title": "Estruturas de dados: escolher pela operação",
    "description": "Fila, mapa de frequência e índice em árvore com contratos e custo observável.",
    "skills": [
      "estruturas-fila",
      "estruturas-mapas",
      "estruturas-arvores"
    ],
    "references": [
      "https://docs.python.org/3/tutorial/datastructures.html",
      "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
    ],
    "stages": [
      {
        "id": "fila",
        "title": "Uma fila que não perde zero",
        "minutes": 25,
        "theory": [
          "A ordem de atendimento é um contrato: o primeiro valor inserido é o primeiro removido. A estrutura deve separar a existência de um item de seu valor. Zero, false e string vazia podem ser dados válidos. Tratar um valor falso como indicação de vazio muda o comportamento do programa e torna impossível atender certos pedidos.",
          "Em um array, remover o primeiro elemento desloca os restantes. Para uma fila usada repetidamente, podemos manter um índice de cabeça e ler sem deslocamento. O armazenamento cresce até uma compactação planejada; não confunda a quantidade lógica com o tamanho físico do array. No Python, deque oferece operações nas extremidades; no exercício, vamos tornar explícita a fronteira entre ocupação e valor."
        ],
        "example": "const fila = [0, 7, 9];\nlet cabeca = 0;\nfunction retirar() {\n if (cabeca >= fila.length) return {encontrado:false};\n return {encontrado:true, valor:fila[cabeca++]};\n}\n// Primeira retirada: {encontrado:true, valor:0}",
        "bug": "function retirar() {\n const valor = fila[cabeca++];\n if (!valor) return 'vazio';\n return valor;\n}",
        "exercise": "Corrija a fila com retorno discriminado. Atenda 0, false e um texto; faça quatro retiradas. Explique quando compactar o array sem mudar a ordem.",
        "solution": "function retirar() {\n if (cabeca >= fila.length) return {encontrado:false};\n return {encontrado:true, valor:fila[cabeca++]};\n}\n// Compactar com fila.splice(0,cabeca) e cabeca=0 após um limiar medido.",
        "explanation": "A condição de vazio compara a cabeça com a quantidade física, sem olhar o valor. O discriminador encontrado distingue ausência de um item cujo valor é zero. Compactação conserva somente a região não atendida e reinicia o índice; não execute isso a cada retirada se o objetivo é evitar deslocamentos repetidos.",
        "checkpoints": [
          "0 e false são atendidos normalmente.",
          "A retirada vazia não avança o índice.",
          "A compactação preserva a sequência restante."
        ],
        "assessment": {
          "prompt": "A fila contém apenas 0. Qual estado existe antes da primeira retirada?",
          "options": [
            "Um item disponível cujo valor é 0",
            "Fila vazia porque 0 é falso",
            "Dois itens: índice e valor"
          ],
          "correct": 0,
          "feedback": [
            "Existência depende da posição, não da conversão booleana.",
            "Esse teste perderia um item válido.",
            "O índice é metadado da estrutura."
          ]
        },
        "references": [
          "https://docs.python.org/3/tutorial/datastructures.html"
        ]
      },
      {
        "id": "frequencias",
        "title": "Um mapa preserva a identidade das chaves",
        "minutes": 25,
        "theory": [
          "Um mapa associa cada chave a um valor. Para contar ocorrências, o valor é a quantidade vista até agora, não o índice da última posição. O estado inicial de uma chave ausente é zero; cada visita acrescenta um. A tabela resultante permite responder várias consultas sem varrer a coleção inteira de novo.",
          "A definição de igualdade faz parte do problema. As strings 'JS' e 'js' são diferentes até que o domínio escolha normalização. Não normalize silenciosamente nomes em que maiúsculas sejam relevantes. Um objeto JavaScript comum também carrega propriedades herdadas; Map evita tratar 'constructor' ou '__proto__' como contagens pré-existentes. Objetos usados como chaves de Map são comparados por identidade, não por igualdade profunda."
        ],
        "example": "function frequencias(itens) {\n const mapa = new Map();\n for (const item of itens) mapa.set(item, (mapa.get(item) ?? 0) + 1);\n return mapa;\n}\n// ['a','b','a'] -> a:2, b:1",
        "bug": "const contagem = {};\nfor (const nome of ['constructor', 'constructor']) {\n contagem[nome] = (contagem[nome] || 0) + 1;\n}",
        "exercise": "Substitua por Map e conte ['JS','js','JS','constructor']. Depois faça uma versão com normalização explícita toLowerCase e compare os contratos.",
        "solution": "const contagem = new Map();\nfor (const nome of nomes) contagem.set(nome, (contagem.get(nome) ?? 0) + 1);\n// Sem normalização: JS=2, js=1, constructor=1.\n// Com normalização: js=3, constructor=1.",
        "explanation": "O objeto comum já possui constructor por herança, então uma leitura não é uma contagem numérica válida. Map começa sem essas entradas. A versão normalizada representa um requisito diferente e deve ser documentada; não se deve considerá-la uma correção obrigatória para todos os domínios.",
        "checkpoints": [
          "Chaves reservadas recebem contagens numéricas.",
          "A lista vazia produz mapa vazio.",
          "A documentação distingue normalização de preservação literal."
        ],
        "assessment": {
          "prompt": "Sem normalização, quantas chaves ['JS','js','JS'] produz?",
          "options": [
            "1",
            "3",
            "2"
          ],
          "correct": 2,
          "feedback": [
            "Isso só seria correto com normalização explícita.",
            "A repetição de JS atualiza uma chave existente.",
            "Há duas strings distintas, JS e js."
          ]
        },
        "references": [
          "https://docs.python.org/3/tutorial/datastructures.html"
        ]
      },
      {
        "id": "arvore",
        "title": "O índice depende da forma da árvore",
        "minutes": 35,
        "theory": [
          "Uma árvore de busca binária mantém valores menores à esquerda e maiores à direita, segundo uma comparação escolhida. O percurso em ordem visita esquerda, raiz e direita, produzindo a sequência ordenada quando o invariante é respeitado. Repetições precisam de política: guardar um contador no nó é uma opção que evita perder frequência.",
          "O custo de procurar depende da altura. Inserir valores crescentes em uma árvore simples pode criar uma cadeia e exigir n visitas. O nome árvore não garante custo logarítmico. Balanceamento ou outra estrutura é necessário quando esse limite importa. Antes de otimizar, teste nós vazios, uma raiz, duplicatas e uma árvore degenerada; esses casos expõem suposições sobre presença e profundidade."
        ],
        "example": "function buscar(no, alvo) {\n while (no !== null) {\n  if (no.valor === alvo) return no;\n  no = alvo < no.valor ? no.esquerda : no.direita;\n }\n return null;\n}\n// {valor:4, esquerda:{valor:2,...}, direita:{valor:8,...}}",
        "bug": "if (alvo < no.valor) no = no.direita;\nelse no = no.esquerda; // descarta a região onde o alvo pode estar",
        "exercise": "Corrija a direção e registre visitas ao procurar 2, 8 e 7 na árvore de raiz 4. Desenhe a altura criada pelas inserções 1,2,3,4,5 sem balanceamento.",
        "solution": "no = alvo < no.valor ? no.esquerda : no.direita;\n// 2: raiz4 -> esquerda2; 8: raiz4 -> direita8; 7: 4 -> 8 -> null.\n// Inserção crescente forma altura 5 contando nós.",
        "explanation": "O invariante restringe o lugar do alvo, por isso não é necessário visitar os dois lados. Mas cada avanço percorre somente um nível: uma cadeia com cinco nós ainda pede cinco comparações no pior caso. Dizer O(log n) para essa árvore simples seria incorreto sem uma garantia adicional de altura.",
        "checkpoints": [
          "Ausência retorna null e não acessa propriedade de null.",
          "A direção respeita a comparação de inserção.",
          "O relato mede altura e evita prometer balanceamento inexistente."
        ],
        "assessment": {
          "prompt": "Uma árvore simples construída com 1,2,3,4,5 pode ter busca de pior caso com quantas visitas?",
          "options": [
            "Sempre 1",
            "5",
            "Sempre 2"
          ],
          "correct": 1,
          "feedback": [
            "Somente buscar a raiz exige uma visita.",
            "Ela pode degenerar em uma cadeia.",
            "Esse limite exigiria garantia de balanceamento."
          ]
        },
        "references": [
          "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
        ]
      }
    ]
  },
  {
    "id": "redes",
    "title": "Redes: da mensagem ao estado da aplicação",
    "description": "HTTP, estados de erro, cancelamento e identidade de operações com testes simulados offline.",
    "skills": [
      "redes-http",
      "redes-cancelamento",
      "redes-idempotencia"
    ],
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
    ],
    "stages": [
      {
        "id": "http",
        "title": "Sucesso de transporte e sucesso do contrato",
        "minutes": 25,
        "theory": [
          "Uma resposta HTTP tem status, cabeçalhos e um corpo que pode estar vazio ou não ser JSON. Receber uma resposta significa que o transporte completou uma troca; não significa que a operação desejada foi aceita. A aplicação precisa decidir quais status atende, validar o corpo e distinguir ausência de dados de falha. Uma lista vazia com status 200 pode ser sucesso.",
          "Para testar isso sem internet, passe a função de transporte como dependência. Um objeto simulado pode representar status 200, 404 ou JSON inválido sem consultar servidor. O simulador testa o tratamento da aplicação, não prova funcionamento da rede real. Separar esses níveis permite aprender contratos offline e reservar um teste de integração para quando a infraestrutura estiver disponível."
        ],
        "example": "async function lerItens(transporte) {\n const resposta = await transporte('/itens');\n if (!resposta.ok) throw new Error('HTTP ' + resposta.status);\n const dados = await resposta.json();\n if (!Array.isArray(dados)) throw new Error('Lista esperada');\n return dados;\n}\nconst falso = async () => ({ok:true,status:200,json:async()=>[]});",
        "bug": "async function lerItens(transporte) {\n const resposta = await transporte('/itens');\n return resposta.json(); // 404 com JSON vira dados de sucesso\n}",
        "exercise": "Adicione verificação de status e forma. Faça quatro transportes falsos: 200/[], 404/{erro:'ausente'}, 200/{itens:[]}, 200 com json que rejeita.",
        "solution": "if (!resposta.ok) throw new Error('HTTP ' + resposta.status);\nconst dados = await resposta.json();\nif (!Array.isArray(dados)) throw new Error('Lista esperada');\nreturn dados;",
        "explanation": "O status é verificado antes do parse do contrato de sucesso. JSON válido pode ter a forma errada; parse e validação são etapas diferentes. Uma rejeição do parse continua sendo falha e não deve virar silenciosamente []. O estado de erro preserva a diferença entre catálogo vazio e indisponível.",
        "checkpoints": [
          "200/[] apresenta estado vazio de sucesso.",
          "404 não é mostrado como uma lista.",
          "Erro de parse fica distinguível de lista vazia."
        ],
        "assessment": {
          "prompt": "Um transporte devolveu 404 com JSON válido. Qual conclusão é correta?",
          "options": [
            "Houve resposta, mas o contrato de sucesso não foi atendido",
            "A operação sempre foi bem-sucedida porque o JSON é válido",
            "O navegador necessariamente ficou sem conexão"
          ],
          "correct": 0,
          "feedback": [
            "Status e forma devem ser avaliados separadamente.",
            "Sintaxe JSON não confirma a operação pedida.",
            "Uma resposta 404 demonstra uma troca HTTP, não ausência obrigatória de rede."
          ]
        },
        "references": [
          "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
        ]
      },
      {
        "id": "cancelamento",
        "title": "Uma resposta antiga não pode sobrescrever a nova",
        "minutes": 30,
        "theory": [
          "Duas buscas iniciadas em sequência podem terminar na ordem inversa. Se a interface aplicar qualquer resposta que chegar, a busca antiga substitui a escolha atual. A correção precisa associar cada resultado ao pedido que ainda é relevante. Um contador de geração é suficiente para ignorar resultados antigos, mesmo quando o transporte não permite cancelamento.",
          "AbortController pode cancelar uma solicitação e liberar recursos, mas o código também deve proteger o estado depois de await. O cancelamento pode chegar quando a resposta já foi recebida ou durante outro trabalho assíncrono. Cada chamada precisa limpar apenas o carregamento que ela ainda possui. Uma simulação com promises controladas permite reproduzir a corrida sem depender da velocidade da internet."
        ],
        "example": "let geracao = 0;\nasync function pesquisar(termo, carregar) {\n const minha = ++geracao;\n const dados = await carregar(termo);\n if (minha !== geracao) return;\n mostrar(dados);\n}",
        "bug": "const dados = await carregar(termo);\nmostrar(dados); // resultado de 'ca' pode chegar depois de 'café'",
        "exercise": "Simule A='ca' e B='café'. Resolva B primeiro e A depois. Garanta que o estado final contém somente B; repita com A falhando depois de B.",
        "solution": "const minha = ++geracao;\ntry {\n const dados = await carregar(termo);\n if (minha !== geracao) return;\n mostrar(dados);\n} catch (erro) {\n if (minha !== geracao) return;\n mostrarErro(erro);\n}",
        "explanation": "A verificação deve proteger sucesso e falha: uma exceção antiga também pode sobrescrever a interface atual. A geração representa relevância, não tempo de rede. Cancelar A economiza trabalho quando possível, mas ignorar seu resultado ainda é necessário para consistência.",
        "checkpoints": [
          "Resposta antiga não altera os dados atuais.",
          "Falha antiga não troca sucesso atual por erro.",
          "O teste controla a ordem em vez de usar espera arbitrária."
        ],
        "assessment": {
          "prompt": "Cancelar a requisição A dispensa proteger o estado após await?",
          "options": [
            "Sim; qualquer transporte nunca termina após cancelamento",
            "Sim; basta esconder a mensagem de erro",
            "Não; ainda precisamos conferir se o resultado pertence à busca atual"
          ],
          "correct": 2,
          "feedback": [
            "Essa promessa não vale para todo transporte nem para etapas posteriores.",
            "Ocultar mensagens não protege os dados.",
            "Cancelamento e validade do resultado são preocupações complementares."
          ]
        },
        "references": [
          "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
        ]
      },
      {
        "id": "idempotencia",
        "title": "Repetir o transporte sem repetir a cobrança",
        "minutes": 35,
        "theory": [
          "Uma conexão pode falhar depois que o servidor aceitou uma operação. O cliente não sabe se a alteração ocorreu e pode tentar de novo. Repetir uma consulta é diferente de repetir uma cobrança. A identidade da operação precisa sobreviver à tentativa: a mesma chave de idempotência representa a mesma intenção, não uma nova compra.",
          "Um simulador local pode manter um mapa de chave para resultado e outro para o conteúdo da solicitação. A primeira solicitação calcula e guarda o resultado; uma repetição com a mesma chave devolve o resultado guardado. A mesma chave com dados diferentes precisa ser rejeitada. Timeout encerra a espera do cliente, não comprova rollback no servidor. Antes de repetir, investigue o contrato e o efeito possível. 429 pode fornecer Retry-After como espera ou data; o experimento usa dois segundos contados após receber a resposta. 503 não garante ausência de efeito em qualquer API. Uma política de repetição real precisa limitar tentativas e tempo total, considerar backoff e variação entre clientes e evitar repetir uma intenção insegura. Um conflito de conteúdo com 409 exige corrigir a intenção, não insistir no mesmo pedido. Isso exercita o contrato, mas um sistema real ainda precisa persistência, atomicidade, validade da chave e proteção de operações concorrentes. A chave faz parte desse contrato da aplicação: POST não se torna idempotente apenas porque o cliente enviou um identificador. O servidor precisa vincular identidade, conteúdo e resultado de forma consistente. Um processo reiniciado perde um mapa apenas em memória; duas operações concorrentes podem ultrapassar uma verificação separada da gravação."
        ],
        "example": "const operacoes = new Map();\nfunction reservar(chave, quantidade) {\n const anterior = operacoes.get(chave);\n if (anterior) {\n  if (anterior.quantidade !== quantidade) throw new Error('Conflito de chave');\n  return anterior.resultado;\n }\n const resultado = {reservado:quantidade};\n operacoes.set(chave, {quantidade,resultado});\n return resultado;\n}",
        "bug": "// Uma nova chave a cada tentativa representa uma nova operação:\nrepetir(() => reservar(crypto.randomUUID(), 2));",
        "exercise": "Mantenha a chave ao tentar novamente e conte quantas reservas efetivas ocorreram. Depois use a mesma chave com quantidade 3 e registre conflito.",
        "solution": "const chave = 'pedido-123';\n// As tentativas reutilizam a identidade desta intenção:\nreservar(chave, 2);\nreservar(chave, 2);\n// reservar(chave, 3) deve falhar, sem criar nova reserva.",
        "explanation": "A chave é criada uma vez por intenção, antes do ciclo de tentativas. Reutilizar uma chave sem comparar o conteúdo também seria incorreto: o sistema poderia devolver a reserva de 2 para um pedido de 3. O teste verifica efeitos, não apenas a igualdade visual das respostas.",
        "checkpoints": [
          "Duas tentativas da mesma intenção geram um efeito.",
          "Conteúdo diferente com a mesma chave é recusado.",
          "A documentação registra o limite do mapa em memória."
        ],
        "assessment": {
          "prompt": "Após uma resposta perdida, a tentativa da mesma reserva deve usar qual chave?",
          "options": [
            "A mesma chave com qualquer conteúdo",
            "A mesma chave e o mesmo conteúdo",
            "Uma chave nova em toda tentativa"
          ],
          "correct": 1,
          "feedback": [
            "A chave também precisa vincular o conteúdo da intenção.",
            "Assim o servidor pode reconhecer a intenção original.",
            "Isso representa outra operação e permite duplicação."
          ]
        },
        "references": [
          "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2",
          "https://www.rfc-editor.org/rfc/rfc6585.html#section-4",
          "https://www.rfc-editor.org/rfc/rfc9110.html#section-10.2.3"
        ]
      }
    ]
  },
  {
    "id": "git",
    "title": "Git: preservar e revisar mudanças",
    "description": "Área de preparação, branches, conflitos e reversão em um repositório descartável.",
    "skills": [
      "git-preparacao",
      "git-conflitos",
      "git-reversao"
    ],
    "references": [
      "https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository"
    ],
    "stages": [
      {
        "id": "preparacao",
        "title": "Três versões do mesmo arquivo",
        "minutes": 25,
        "theory": [
          "O diretório de trabalho contém os arquivos que você edita. A área de preparação contém o conteúdo escolhido para o próximo commit. HEAD aponta para o commit atual. Essas três versões podem ser diferentes: preparar um arquivo e continuar editando não atualiza automaticamente a preparação. O commit registra o que estava preparado, não tudo que aparece no editor.",
          "Uma mudança pequena precisa ser entendida antes de ser registrada. Examine o diff do trabalho e o diff preparado separadamente. Em um repositório descartável, faça duas alterações no mesmo arquivo e prepare somente a primeira; esse experimento torna visível o modelo. Nomes de commit descrevem a intenção e o comportamento alterado, permitindo localizar uma regressão depois."
        ],
        "example": "git init estudo-git\ncd estudo-git\n# Crie calculo.txt com total=0 e registre a primeira versão.\ngit add calculo.txt\ngit commit -m \"Criar cálculo inicial\"\n# Troque para total=10 e prepare; depois troque para total=20.\ngit diff\ngit diff --cached",
        "bug": "// Suposição quebrada: 'git commit registra a última versão do editor'.\n// Arquivo preparado: total=10; arquivo atual: total=20.",
        "exercise": "No repositório descartável, mostre os três conteúdos após as duas edições. Faça o commit e explique por que ele contém 10 enquanto o trabalho ainda contém 20.",
        "solution": "git show HEAD:calculo.txt\n# Antes do segundo commit: total=0.\ngit diff --cached # 0 -> 10\ngit diff          # 10 -> 20\ngit commit -m \"Ajustar total para dez\"\n# HEAD passa a 10; trabalho mantém 20.",
        "explanation": "add copia o conteúdo do arquivo naquele momento para a preparação. A edição posterior muda somente o trabalho. diff sem opção compara trabalho e preparação; --cached compara preparação e HEAD. Essa distinção permite selecionar alterações e evita commits que juntam assuntos sem revisão.",
        "checkpoints": [
          "O experimento usa um repositório descartável.",
          "Os dois diffs mostram mudanças diferentes.",
          "O commit registra 10 e o trabalho continua com 20."
        ],
        "assessment": {
          "prompt": "Você preparou total=10 e editou para total=20. O commit seguinte registra qual versão?",
          "options": [
            "10, a versão preparada",
            "20, sempre a mais recente no editor",
            "0, porque preparação nunca muda commits"
          ],
          "correct": 0,
          "feedback": [
            "O commit usa a área de preparação.",
            "Editar depois de add não atualiza a preparação.",
            "add escolhe o conteúdo para o próximo commit."
          ]
        },
        "references": [
          "https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository"
        ]
      },
      {
        "id": "conflitos",
        "title": "Resolver a intenção de dois caminhos",
        "minutes": 30,
        "theory": [
          "Uma branch nomeia uma linha de trabalho, não uma segunda cópia independente de todos os arquivos. Ao integrar mudanças, Git usa a versão comum e as alterações de cada lado. Se os dois lados alteram a mesma região de formas incompatíveis, os marcadores exibem alternativas que precisam de uma decisão humana sobre o comportamento desejado.",
          "Resolver um conflito não é apagar automaticamente um lado. Leia a mudança, reproduza o caso e forme um resultado coerente. Depois procure marcadores restantes, confira o diff e execute a verificação pertinente. Um arquivo sem marcadores ainda pode estar logicamente errado. O exercício usa uma regra de desconto para mostrar que combinar duas linhas mecanicamente não preserva a intenção."
        ],
        "example": "// Base: desconto permitido para total >= 100.\n// Branch A: total >= 100 && clienteAtivo.\n// Branch B: total >= 120.\n// Regra combinada acordada: total >= 120 && clienteAtivo.",
        "bug": "<<<<<<< HEAD\nreturn total >= 100 && clienteAtivo;\n=======\nreturn total >= 120;\n>>>>>>> limite-novo",
        "exercise": "Resolva preservando o novo limite e a condição de cliente ativo. Liste resultados para total 119/120 e ativo true/false antes de preparar a resolução.",
        "solution": "return total >= 120 && clienteAtivo;\n// 119,true -> false; 120,true -> true;\n// 119,false -> false; 120,false -> false.\n// Depois: git add regra.js; git diff --cached; concluir merge.",
        "explanation": "Os dois caminhos mudaram aspectos distintos da regra na mesma linha. A decisão combinada precisa das duas condições; selecionar só A perde o limite novo e selecionar só B concede desconto a cliente inativo. A tabela confirma os quatro comportamentos de fronteira.",
        "checkpoints": [
          "Não sobram marcadores de conflito.",
          "As duas intenções aparecem na regra final.",
          "A fronteira 120 e cliente inativo têm testes próprios."
        ],
        "assessment": {
          "prompt": "Remover todos os marcadores garante resolução correta?",
          "options": [
            "Sim; o Git testa automaticamente o comportamento",
            "Sim; basta escolher sempre HEAD",
            "Não; precisamos validar a regra de negócio resultante"
          ],
          "correct": 2,
          "feedback": [
            "Git não executa automaticamente esses testes de domínio.",
            "Um lado pode conter apenas parte da intenção desejada.",
            "A ferramenta integra texto; a regra ainda exige revisão."
          ]
        },
        "references": [
          "https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository"
        ]
      },
      {
        "id": "reversao",
        "title": "Desfazer um efeito mantendo o histórico",
        "minutes": 30,
        "theory": [
          "Quando um commit já é compartilhado, um novo commit de reversão registra a retirada de seu efeito. Isso preserva os identificadores antigos para quem já trabalhou com eles. Reescrever o histórico muda referências e pode exigir coordenação; não é uma etapa necessária para corrigir uma mudança publicada. Comece identificando exatamente qual comportamento deve sair.",
          "Uma reversão pode conflitar com mudanças posteriores que dependem da anterior. Também pode retirar mais do que a regressão se o commit juntou assuntos diferentes. No repositório de estudo, crie commits separados para uma mensagem e uma regra; reverta apenas a regra e observe que a mensagem permanece. Uma verificação do estado final complementa a leitura do histórico."
        ],
        "example": "git log --oneline\n# Identifique no repositório de estudo o commit que alterou a regra.\ngit revert <hash-da-regra>\ngit log --oneline\n# O histórico inclui o commit original e um novo commit de reversão.",
        "bug": "// 'Vou remover o commit remoto para todos sem verificar dependências'.\n// Isso altera o histórico compartilhado e não documenta a correção.",
        "exercise": "Registre mensagem e regra em commits separados. Reverta a regra com git revert; confira que a mensagem continua e que o histórico conserva os commits originais.",
        "solution": "git revert <hash-da-regra>\ngit show --stat HEAD\ngit diff <hash-anterior> HEAD\n// Verifique a mensagem e rode os casos da regra no estado final.",
        "explanation": "revert aplica a alteração inversa em um novo commit. Não apaga trabalho de outras pessoas por definição, mas conflitos ou dependências ainda precisam ser resolvidos. A separação inicial torna a correção localizada; se o commit original misturou comportamentos, revise cuidadosamente o efeito inverso.",
        "checkpoints": [
          "O commit original continua no histórico.",
          "A mensagem independente permanece.",
          "O estado final passa pelos casos da regra anterior."
        ],
        "assessment": {
          "prompt": "Qual operação cria um novo commit que inverte uma mudança compartilhada?",
          "options": [
            "git status",
            "git revert",
            "git diff"
          ],
          "correct": 1,
          "feedback": [
            "status informa o estado do trabalho e preparação.",
            "Ela registra a retirada do efeito em um novo commit.",
            "diff apenas compara versões."
          ]
        },
        "references": [
          "https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository"
        ]
      }
    ]
  },
  {
    "id": "testes",
    "title": "Testes: descobrir regressões de comportamento",
    "description": "Casos de fronteira, oráculos independentes e falhas assíncronas reproduzíveis.",
    "skills": [
      "testes-fronteiras",
      "testes-oraculos",
      "testes-assincronos"
    ],
    "references": [
      "https://nodejs.org/api/test.html"
    ],
    "stages": [
      {
        "id": "fronteiras",
        "title": "Uma tabela antes da implementação",
        "minutes": 25,
        "theory": [
          "Um teste transforma uma expectativa em uma comparação observável. Defina a regra antes de copiar a implementação: um desconto de 10% vale para totais de pelo menos 10000 centavos. Os casos 9999, 10000 e 10001 exercitam a fronteira; zero e valor negativo testam domínio e validação. Decida também o arredondamento dos centavos, pois dinheiro fracionário precisa de política explícita.",
          "Cobrir linhas não demonstra que a comparação é a correta. Uma função com > no lugar de >= pode executar todas as linhas e falhar exatamente no limite. Escreva casos que distinguem mutações plausíveis: trocar comparação, retirar validação ou mudar arredondamento. O teste deve apontar o comportamento errado sem depender do nome de uma variável ou do formato do código."
        ],
        "example": "function pagar(total) {\n if (!Number.isSafeInteger(total) || total < 0) throw new Error('Total inválido');\n return total >= 10000 ? Math.round(total * 0.9) : total;\n}\n// Casos: 0->0; 9999->9999; 10000->9000; 10001->9001.",
        "bug": "return total > 10000 ? Math.round(total * 0.9) : total;",
        "exercise": "Escreva a tabela de entradas e resultados esperados antes de corrigir. Inclua -1 rejeitado. Mostre qual teste falha na implementação com >.",
        "solution": "const casos = [[0,0],[9999,9999],[10000,9000],[10001,9001]];\nfor (const [entrada, esperado] of casos) {\n if (pagar(entrada) !== esperado) throw new Error('Falhou: ' + entrada);\n}\n// Teste separado confirma que pagar(-1) lança erro.",
        "explanation": "10000 é o caso que distingue > de >=. Os outros casos protegem os caminhos próximos e o arredondamento. Validar que -1 lança evita transformar uma entrada fora do domínio em um pagamento aparentemente normal. O erro do teste informa a entrada responsável, facilitando a reprodução.",
        "checkpoints": [
          "O resultado esperado não é calculado copiando pagar.",
          "Existe um teste exclusivo para o limite exato.",
          "Valor negativo é recusado por contrato."
        ],
        "assessment": {
          "prompt": "Qual entrada revela a troca de >= por > no limite 10000?",
          "options": [
            "10000",
            "10001",
            "0"
          ],
          "correct": 0,
          "feedback": [
            "É a igualdade que separa as comparações.",
            "Ambas comparações concedem desconto acima do limite.",
            "Ambas negam desconto para zero."
          ]
        },
        "references": [
          "https://nodejs.org/api/test.html"
        ]
      },
      {
        "id": "oraculos",
        "title": "O teste não pode copiar o mesmo defeito",
        "minutes": 30,
        "theory": [
          "Um oráculo é a regra que decide o resultado esperado. Se teste e função usam a mesma fórmula errada, ambos concordam e a regressão passa. Use exemplos calculados independentemente e propriedades que precisam valer para muitas entradas. Para uma ordenação, o resultado deve estar em ordem, ter o mesmo tamanho e preservar a quantidade de cada valor; verificar apenas o primeiro item é insuficiente.",
          "Propriedades não substituem todos os exemplos: uma função que devolve sempre [] satisfaz a propriedade de estar ordenada, mas perde os dados. Combine invariantes complementares e casos conhecidos. Uma lista com duplicatas detecta remoção acidental; negativos detectam comparação inadequada. Quando houver aleatoriedade, registre a semente ou o caso gerado para repetir a falha."
        ],
        "example": "const entrada = [3, -1, 3, 0];\nconst saida = ordenar(entrada);\n// Esperado independente: [-1,0,3,3].\n// Propriedades: ordem crescente, tamanho 4 e frequência de 3 igual a 2.",
        "bug": "function ordenar(itens) { return [...new Set(itens)].sort((a,b)=>a-b); }\n// Parece ordenado, mas remove a segunda ocorrência de 3.",
        "exercise": "Escreva três verificações separadas para ordem, tamanho e frequências. Dê um contraexemplo para uma implementação que devolve sempre [] e outro para a versão com Set.",
        "solution": "const esperado = [-1,0,3,3];\nconst saida = ordenar([3,-1,3,0]);\nif (JSON.stringify(saida) !== JSON.stringify(esperado)) throw new Error('Valores divergentes');\n// []: falha no tamanho e frequência; Set: perde uma ocorrência.\n// Correção: return [...itens].sort((a,b)=>a-b);",
        "explanation": "A comparação com um exemplo independente encontra a perda de duplicatas. As propriedades explicam por que ela é uma perda: a saída deixou de representar a mesma coleção. Copiar antes de sort preserva o contrato de não alterar a entrada, que também merece uma verificação.",
        "checkpoints": [
          "Duplicatas são preservadas.",
          "A entrada não muda ao ordenar.",
          "Os testes rejeitam tanto [] fixo quanto a deduplicação indevida."
        ],
        "assessment": {
          "prompt": "Estar em ordem crescente basta para provar uma ordenação correta?",
          "options": [
            "Sim; até [] serve para qualquer entrada",
            "Sim; duplicatas não fazem parte do contrato",
            "Não; precisamos preservar os elementos e suas frequências"
          ],
          "correct": 2,
          "feedback": [
            "[] é ordenado, mas perde os dados de uma entrada não vazia.",
            "Remover duplicatas muda a operação pedida.",
            "Ordem e preservação são propriedades complementares."
          ]
        },
        "references": [
          "https://nodejs.org/api/test.html"
        ]
      },
      {
        "id": "assincronos",
        "title": "Esperar o resultado que estamos testando",
        "minutes": 30,
        "theory": [
          "Uma função assíncrona devolve uma promessa. Se o teste termina antes de observar sua resolução ou rejeição, a verificação pode não ter acontecido. O corpo do teste precisa retornar ou aguardar o trabalho pertinente. Para rejeições, use uma asserção que confirme o erro esperado; apenas capturar qualquer erro pode aceitar uma falha totalmente diferente.",
          "Esperas de tempo fixo tornam testes lentos e dependentes da máquina. Para uma corrida de respostas, controle as promises: guarde as funções de resolução e libere cada uma na ordem planejada. Isso testa o comportamento concorrente sem adivinhar quantos milissegundos serão suficientes. Limpe recursos depois do teste para que uma tarefa antiga não contamine o próximo."
        ],
        "example": "import assert from 'node:assert/strict';\nimport test from 'node:test';\ntest('recusa resposta HTTP inválida', async () => {\n await assert.rejects(\n  lerItens(async()=>({ok:false,status:404})),\n  /HTTP 404/\n );\n});",
        "bug": "test('carrega', () => {\n carregar().then(dados => assert.equal(dados.length, 2));\n}); // o teste não aguarda a promessa",
        "exercise": "Reescreva usando async/await. Depois simule duas buscas com promises controladas, resolvendo a segunda antes da primeira, sem setTimeout.",
        "solution": "test('carrega', async () => {\n const dados = await carregar();\n assert.equal(dados.length, 2);\n});\n// Corrida: crie duas promises, chame pesquisar A/B,\n// resolva B, aguarde sua chamada; resolva A, aguarde sua chamada;\n// confira que o estado final continua pertencendo a B.",
        "explanation": "O await vincula a conclusão do teste à operação examinada. A simulação controlada permite observar exatamente a inversão de ordem que gerava o defeito. A asserção final precisa verificar estado e identidade do pedido, não somente contar quantas promises terminaram.",
        "checkpoints": [
          "O teste aguarda a asserção assíncrona.",
          "A rejeição é comparada com o erro esperado.",
          "A corrida é reproduzida sem atraso arbitrário."
        ],
        "assessment": {
          "prompt": "O teste chama uma promise e termina sem retornar nem aguardar. O que está faltando?",
          "options": [
            "Capturar erros e ignorá-los",
            "Vincular a conclusão do teste ao trabalho assíncrono",
            "Um atraso fixo de cinco segundos em qualquer teste"
          ],
          "correct": 1,
          "feedback": [
            "Ignorar erros impede detectar a regressão.",
            "Retornar a promise ou usar await permite acompanhar a verificação.",
            "Um atraso fixo não garante causalidade nem término correto."
          ]
        },
        "references": [
          "https://nodejs.org/api/test.html"
        ]
      }
    ]
  },
  {
    "id": "arquitetura",
    "title": "Arquitetura: proteger regras enquanto o projeto cresce",
    "description": "Fronteiras, adaptadores e decisões documentadas aplicadas a um projeto local.",
    "skills": [
      "arquitetura-fronteiras",
      "arquitetura-adaptadores",
      "arquitetura-decisoes"
    ],
    "references": [
      "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures"
    ],
    "stages": [
      {
        "id": "dominio",
        "title": "Uma regra que funciona sem interface",
        "minutes": 30,
        "theory": [
          "Uma regra de domínio descreve o comportamento da aplicação: transferir uma quantia positiva sem deixar saldo negativo, por exemplo. Sua validade não deveria depender de um botão, de uma mensagem na tela ou de um arquivo particular. Uma função que recebe dados e devolve um resultado pode ser examinada diretamente, com interface e armazenamento ao redor.",
          "Separação não exige dezenas de pastas. Comece com uma fronteira que remove uma dependência concreta. Se calcular o saldo lê o formulário e escreve localStorage, testar a regra exige montar ambos. Passe saldo e quantia como valores e devolva o novo estado; a camada de aplicação decide onde ler e persistir. O contrato define erros esperados e garante que uma operação rejeitada não muda o saldo."
        ],
        "example": "function transferir(saldo, quantia) {\n if (!Number.isSafeInteger(quantia) || quantia <= 0) throw new Error('Quantia inválida');\n if (quantia > saldo) throw new Error('Saldo insuficiente');\n return saldo - quantia;\n}\n// transferir(10000,2500) -> 7500",
        "bug": "function transferir() {\n const valor = Number(document.querySelector('#quantia').value);\n localStorage.setItem('saldo', String(Number(localStorage.getItem('saldo')) - valor));\n}",
        "exercise": "Extraia a regra pura e mantenha a interface como adaptador. Teste 10000/2500, quantia zero e quantia 10001 antes de ligar novamente ao formulário.",
        "solution": "const novoSaldo = transferir(saldoAtual, quantiaValidada);\n// Persistir e renderizar somente depois de a regra aceitar.\n// Rejeições mantêm saldoAtual e apresentam a mensagem pertinente.",
        "explanation": "A função pura separa o cálculo das decisões de leitura e escrita. Isso não torna o aplicativo automaticamente transacional: a persistência ainda pode falhar e precisa de tratamento. O ganho imediato é testar a regra sem DOM, preservando o estado em entradas rejeitadas.",
        "checkpoints": [
          "O domínio não acessa DOM nem localStorage.",
          "Uma quantia inválida não muda o saldo.",
          "A interface só persiste depois da regra aceitar."
        ],
        "assessment": {
          "prompt": "Qual dependência deve a regra de transferência exigir para calcular novo saldo?",
          "options": [
            "Os valores de saldo e quantia segundo o contrato",
            "Um botão específico da tela",
            "A chave concreta de localStorage"
          ],
          "correct": 0,
          "feedback": [
            "Valores permitem verificar a regra em isolamento.",
            "O botão pertence à interface.",
            "A chave é uma decisão de armazenamento."
          ]
        },
        "references": [
          "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures"
        ]
      },
      {
        "id": "adaptadores",
        "title": "Trocar armazenamento sem trocar a regra",
        "minutes": 30,
        "theory": [
          "Um adaptador traduz uma tecnologia para um contrato pequeno da aplicação. Para um caderno local, o contrato pode ser carregar e salvar um documento versionado. Um adaptador usa memória nos testes; outro usa o armazenamento do navegador. O domínio não conhece a forma concreta. Isso reduz acoplamento quando uma falha de quota, uma importação ou uma migração precisam de tratamento.",
          "A abstração deve conter apenas operações necessárias. Não crie uma interface enorme para qualquer banco imaginável. Defina o que salvar significa: pode falhar, mantém a versão anterior e informa a falha. Uma memória falsa que sempre salva não cobre quota ou JSON inválido; injete falhas explicitamente para testar a camada de aplicação."
        ],
        "example": "function criarCaderno(repositorio) {\n return {\n  carregar: () => repositorio.carregar(),\n  salvar: documento => {\n   if (documento.version !== 1) throw new Error('Versão não suportada');\n   return repositorio.salvar(documento);\n  }\n };\n}\n// Teste usa repositorio em memória; produção usa adaptador local.",
        "bug": "try { repositorio.salvar(documento); }\ncatch {}\nreturn 'Salvo'; // a interface afirma sucesso mesmo com falha",
        "exercise": "Modele retorno de sucesso/falha e preserve o último documento válido. Simule falta de espaço e importação com versão 99 sem sobrescrever a versão atual.",
        "solution": "try {\n repositorio.salvar(documento);\n return {ok:true};\n} catch (erro) {\n return {ok:false,motivo:'Não foi possível salvar'};\n}\n// Validar importação inteira antes de chamar salvar.",
        "explanation": "Sucesso precisa corresponder a uma gravação concluída. Capturar e ocultar o erro cria perda silenciosa. Validar a importação antes de substituir dados mantém a jornada atual quando o formato é inválido; manter uma cópia exportável dá um caminho de recuperação.",
        "checkpoints": [
          "Falha de gravação não exibe confirmação de sucesso.",
          "Importação inválida preserva os dados atuais.",
          "Teste em memória cobre também um adaptador que lança erro."
        ],
        "assessment": {
          "prompt": "O adaptador lançou falta de espaço. Qual estado a aplicação deve apresentar?",
          "options": [
            "Salvo, porque a regra de domínio era válida",
            "Apagar a versão anterior e começar vazio",
            "Falha de gravação com trabalho preservado e possibilidade de exportar"
          ],
          "correct": 2,
          "feedback": [
            "Isso seria uma confirmação falsa.",
            "A falha não autoriza descartar a versão anterior.",
            "Validade do documento não garante que foi gravado."
          ]
        },
        "references": [
          "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures"
        ]
      },
      {
        "id": "decisoes",
        "title": "Uma decisão precisa de contexto e consequência",
        "minutes": 35,
        "theory": [
          "Uma decisão de arquitetura registra um problema concreto, as alternativas consideradas, a escolha e suas consequências. Para progresso sem conta, salvar localmente simplifica privacidade e uso offline, mas não sincroniza entre dispositivos e pode ser apagado pelo navegador. Esse limite deve orientar backup e mensagens do produto, não ficar escondido em uma pasta técnica.",
          "Escolher uma tecnologia também define como verificar e reverter a decisão. Escreva um critério de sucesso observável e um sinal que exigiria revisão. Se o projeto crescer para vários arquivos, o formato antigo precisa de migração ou rejeição clara antes de substituição. Um documento curto é suficiente quando contém o motivo e a estratégia de mudança; uma lista de ferramentas sem contexto não registra a decisão."
        ],
        "example": "Decisão: projeto salvo neste navegador, sem conta.\nContexto: continuar estudos offline e evitar cadastro.\nAlternativa: servidor com identidade; exige infraestrutura e política de contas.\nConsequência: sem sincronização; exportação e importação versionadas.\nVerificação: recarregar mantém arquivos; backup inválido preserva a versão atual.",
        "bug": "// Documento incompleto:\n// 'Usamos localStorage porque é moderno'.\n// Não explica limites, falhas, recuperação nem mudança futura.",
        "exercise": "Escreva uma decisão para armazenar um projeto de vários arquivos. Inclua limites de tamanho, comportamento na quota, exportação, teste de retomada e migração de versão.",
        "solution": "Escolha: um documento JSON versionado com arquivos e evidências.\nLimites: recusar excesso antes de substituir, informando exportação separada.\nQuota: manter rascunho em memória e exibir falha, sem afirmar que salvou.\nMigração: validar versão e preservar cópia original.\nTestes: retomada, importação inválida, quota e alteração que invalida evidência.",
        "explanation": "O registro conecta a implementação às expectativas de quem usa. A recuperação e a migração fazem parte da decisão porque o dado do estudante não é descartável. O teste de invalidação protege a honestidade do progresso: uma mudança posterior no arquivo não pode continuar contando como revisão daquele conteúdo.",
        "checkpoints": [
          "O documento registra escolha, alternativa e consequência.",
          "Há um teste de recuperação e um critério para revisar a decisão.",
          "A implantação mantém a promessa de ausência de contas."
        ],
        "assessment": {
          "prompt": "Qual informação falta em 'escolhemos armazenamento local' para orientar produção?",
          "options": [
            "Uma promessa de sincronização automática inexistente",
            "Limites, recuperação e consequências para quem usa",
            "Somente uma lista de marcas de ferramentas"
          ],
          "correct": 1,
          "feedback": [
            "Armazenamento local não oferece essa sincronização por si só.",
            "Esses pontos tornam a decisão verificável e recuperável.",
            "Ferramentas sem contexto não explicam a escolha."
          ]
        },
        "references": [
          "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures"
        ]
      }
    ]
  }
];

export const capstoneProjects:CapstoneProject[] = [
  {
    "id": "html-caderno",
    "language": "html",
    "revision": 1,
    "title": "Caderno de estudos: da página ao aplicativo",
    "summary": "Construa o mesmo produto durante oito marcos: documento, formulário, layout, comportamento, transporte, persistência, testes e entrega. Cada marco conserva o trabalho anterior.",
    "scope": [
      "Catálogo com 40 recursos em quatro temas.",
      "Cadastro, edição, busca e estado de estudo.",
      "Uma versão sem JavaScript permite ler o conteúdo inicial.",
      "Sem conta: dados locais com exportação e importação."
    ],
    "constraints": [
      "Nenhum conteúdo de usuário entra por innerHTML.",
      "Navegação e controles operáveis por teclado, com rótulos e foco visível.",
      "220px a 4000px: sem rolagem horizontal global; texto mantém tamanho legível e largura de leitura limitada.",
      "Transporte falso offline antes de uma integração HTTP opcional."
    ],
    "execution": "browser",
    "offline": "Documento, formulário, desenho de estados e transporte simulado podem ser estudados sem servidor externo. A execução local de módulos exige servidor HTTP local; os arquivos continuam exportáveis.",
    "starterFiles": {
      "index.html": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Meu caderno de estudos</title><link rel=\"stylesheet\" href=\"style.css\"></head><body><header><h1>Meu caderno de estudos</h1><p>Uma descoberta por dia.</p></header><main><section aria-labelledby=\"recursos-titulo\"><h2 id=\"recursos-titulo\">Recursos</h2><ul id=\"recursos\"><li>HTML: estrutura de um documento</li></ul></section></main></body></html>",
      "style.css": ":root{font-family:system-ui,sans-serif;color:#202b22;background:#fafcf8}*{box-sizing:border-box}body{margin:0;padding:1rem}main,header{width:100%;max-width:65ch;margin-inline:auto}input,button{font:inherit}img{max-width:100%;height:auto}:focus-visible{outline:3px solid #395d36;outline-offset:3px}",
      "app.js": "// Marco 4: conecte comportamento a controles já acessíveis.\nconst recursos = [{id:'html-1',titulo:'Estrutura de um documento',tema:'HTML',concluido:false}];\n// Marco 5: injete transporte; use uma resposta simulada antes da rede.\n",
      "dados.json": "{\"version\":1,\"recursos\":[{\"id\":\"html-1\",\"titulo\":\"Estrutura de um documento\",\"tema\":\"HTML\",\"concluido\":false}]}"
    },
    "milestones": [
      {
        "id": "documento",
        "title": "1. Um documento com sentido",
        "goal": "Organize 40 recursos em temas, mantendo a leitura útil sem script.",
        "deliverables": [
          "index.html com landmarks, títulos e links internos.",
          "Mapa dos quatro temas e exemplos de recursos."
        ],
        "criteria": [
          {
            "id": "documento-c1",
            "label": "Há um h1 e uma hierarquia de títulos explicada."
          },
          {
            "id": "documento-c2",
            "label": "A leitura sem JavaScript mantém conteúdo e links úteis."
          },
          {
            "id": "documento-c3",
            "label": "Idioma, título, viewport e descrições de links atendem ao conteúdo real."
          }
        ],
        "tests": [
          "Desative JavaScript e percorra todos os temas.",
          "Navegue pelos títulos e teste links internos com teclado."
        ],
        "diagnosis": "Um título usado só para tamanho de fonte altera a hierarquia. Reorganize o conteúdo antes de ajustar a aparência.",
        "transfer": "Acrescente um quinto tema sem quebrar a estrutura.",
        "lessonIds": [
          "documento",
          "semantica"
        ]
      },
      {
        "id": "formulario",
        "title": "2. O caderno recebe um recurso",
        "goal": "Inclua cadastro e edição com campos nomeados, validação e mensagens associadas.",
        "deliverables": [
          "Formulário com título, tema e URL opcionais.",
          "Roteiro de erro para título vazio e URL inválida."
        ],
        "criteria": [
          {
            "id": "formulario-c1",
            "label": "Cada campo tem label e instrução pertinente."
          },
          {
            "id": "formulario-c2",
            "label": "Erros indicam o campo e preservam o que foi escrito."
          },
          {
            "id": "formulario-c3",
            "label": "Cancelar edição não submete dados nem apaga a versão anterior."
          }
        ],
        "tests": [
          "Submeta título vazio e navegue até o erro.",
          "Confirme envio com Enter e cancelamento com botão próprio."
        ],
        "diagnosis": "Um placeholder não substitui label. Um botão sem type dentro do formulário pode submeter quando deveria cancelar.",
        "transfer": "Adicione descrição opcional sem transformar campo vazio em erro.",
        "lessonIds": [
          "formularios",
          "html-acessivel"
        ]
      },
      {
        "id": "layout",
        "title": "3. O conteúdo se adapta",
        "goal": "Construa cartões e formulário que cabem de 220 a 4000 pixels sem encolher a fonte.",
        "deliverables": [
          "style.css com tokens, Grid e limites de leitura.",
          "Matriz de larguras 220,320,768,1440,2560,4000 e zoom."
        ],
        "criteria": [
          {
            "id": "layout-c1",
            "label": "O documento não cria rolagem horizontal global nessas larguras."
          },
          {
            "id": "layout-c2",
            "label": "URL longa e título extenso quebram linha sem ocultar informação."
          },
          {
            "id": "layout-c3",
            "label": "A ordem visual preserva a ordem de leitura e navegação."
          }
        ],
        "tests": [
          "Use título de 120 caracteres e URL sem espaços.",
          "Teste zoom a 200% e foco sem cortes."
        ],
        "diagnosis": "min-width implícito pode fazer um cartão exceder sua trilha. Investigue min-width:0 e quebra de texto em vez de ocultar o overflow.",
        "transfer": "Inclua um painel lateral somente quando houver espaço suficiente.",
        "lessonIds": [
          "grid-responsivo",
          "box-model"
        ]
      },
      {
        "id": "comportamento",
        "title": "4. O caderno vira uma ferramenta",
        "goal": "Renderize o estado, filtre, edite e marque recursos usando funções separadas do DOM.",
        "deliverables": [
          "app.js com estado e funções de domínio.",
          "Busca por texto e filtro por tema; contagem de resultados."
        ],
        "criteria": [
          {
            "id": "comportamento-c1",
            "label": "Editar um recurso preserva seu identificador."
          },
          {
            "id": "comportamento-c2",
            "label": "Texto como <img onerror=...> aparece literalmente."
          },
          {
            "id": "comportamento-c3",
            "label": "Lista vazia e nenhum resultado têm mensagens distintas."
          }
        ],
        "tests": [
          "Edite título sem duplicar o recurso.",
          "Cadastre texto com sinais HTML e confira exibição literal."
        ],
        "diagnosis": "Guardar o índice filtrado como identidade pode editar outro recurso. Use um id estável.",
        "transfer": "Inclua ordenação sem alterar a coleção original.",
        "lessonIds": [
          "selecionar",
          "eventos",
          "estado-formulario"
        ]
      },
      {
        "id": "transporte",
        "title": "5. Uma fonte de dados com estados",
        "goal": "Implemente um transporte injetável e só depois ofereça consulta HTTP opcional.",
        "deliverables": [
          "Adaptador simulado com sucesso, vazio, 404, JSON inválido e atraso.",
          "Estados inicial, carregando, sucesso e falha."
        ],
        "criteria": [
          {
            "id": "transporte-c1",
            "label": "Resposta antiga não substitui uma consulta recente."
          },
          {
            "id": "transporte-c2",
            "label": "Status HTTP e forma do corpo são verificados."
          },
          {
            "id": "transporte-c3",
            "label": "Falha não apaga os recursos locais nem é confundida com catálogo vazio."
          }
        ],
        "tests": [
          "Resolva a segunda busca antes da primeira.",
          "Simule 404, corpo inválido e cancelamento."
        ],
        "diagnosis": "fetch não rejeita automaticamente todo status de erro. Valide ok/status e o contrato dos dados separadamente.",
        "transfer": "Troque o transporte falso por HTTP local mantendo os mesmos testes.",
        "lessonIds": [
          "async",
          "fetch-estados"
        ]
      },
      {
        "id": "persistencia",
        "title": "6. Retomar sem perder o caderno",
        "goal": "Salve uma versão documentada e ofereça exportação/importação sem contas.",
        "deliverables": [
          "Documento versionado com recursos e preferências.",
          "Importação validada antes de substituir; botão de exportar."
        ],
        "criteria": [
          {
            "id": "persistencia-c1",
            "label": "Recarregar restaura recursos e filtros escolhidos."
          },
          {
            "id": "persistencia-c2",
            "label": "Backup malformado ou acima do limite preserva o estado atual."
          },
          {
            "id": "persistencia-c3",
            "label": "Falha de quota informa que a gravação não ocorreu."
          }
        ],
        "tests": [
          "Importe versão desconhecida e compare os dados anteriores.",
          "Simule armazenamento que lança erro ao salvar."
        ],
        "diagnosis": "Confirmar 'salvo' depois de capturar uma exceção é um defeito de recuperação. Mostre o estado real e permita exportar.",
        "transfer": "Migre uma versão anterior preservando uma cópia original.",
        "lessonIds": [
          "armazenamento"
        ]
      },
      {
        "id": "testes",
        "title": "7. Uma mudança não destrói outra",
        "goal": "Proteja regras e fluxo completo com testes reproduzíveis.",
        "deliverables": [
          "Tabela de casos do domínio e transporte falso.",
          "Roteiro de teclado, retomada, importação e resposta fora de ordem."
        ],
        "criteria": [
          {
            "id": "testes-c1",
            "label": "Os casos cobrem vazio, duplicatas e dados inválidos."
          },
          {
            "id": "testes-c2",
            "label": "Os testes de domínio não dependem de HTML específico."
          },
          {
            "id": "testes-c3",
            "label": "Uma mutação de comparação ou identidade é detectada por um teste."
          }
        ],
        "tests": [
          "Introduza temporariamente o bug de índice filtrado e observe falha.",
          "Execute o fluxo cadastrar, editar, filtrar, exportar, recarregar."
        ],
        "diagnosis": "Uma asserção que somente conta elementos não prova que editou o recurso certo. Compare id e conteúdo.",
        "transfer": "Adicione uma funcionalidade e escreva seu caso de regressão antes de integrá-la.",
        "lessonIds": [
          "fullstack-testes"
        ]
      },
      {
        "id": "entrega",
        "title": "8. A entrega explicada e revisada",
        "goal": "Finalize o produto, registre limites e faça uma demonstração com dados diferentes.",
        "deliverables": [
          "README com execução, uso, limites, decisão de persistência e recuperação.",
          "Demonstração com 40 recursos, arquivo exportado e relatório de acessibilidade."
        ],
        "criteria": [
          {
            "id": "entrega-c1",
            "label": "A instalação local e o fluxo descrito são reproduzíveis."
          },
          {
            "id": "entrega-c2",
            "label": "220 a 4000 pixels, teclado e zoom têm evidências registradas."
          },
          {
            "id": "entrega-c3",
            "label": "A revisão distingue dados simulados, testes aprovados e verificações ainda pendentes."
          }
        ],
        "tests": [
          "Outra pessoa repete o roteiro com seu README.",
          "Restaure o backup numa nova sessão do navegador."
        ],
        "diagnosis": "Um link público sem revisão não demonstra que todos os comportamentos funcionam. Registre o que foi observado e o que depende de ambiente.",
        "transfer": "Reutilize o domínio para um caderno de receitas sem copiar a interface inteira.",
        "lessonIds": [
          "projeto-entrega"
        ]
      }
    ],
    "references": [
      "https://html.spec.whatwg.org/multipage/",
      "https://www.w3.org/TR/css-grid-1/",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"
    ]
  },
  {
    "id": "css-sistema",
    "language": "css",
    "revision": 1,
    "title": "Sistema responsivo de uma biblioteca pública",
    "summary": "Crie um sistema visual documentado com tokens, componentes, estados, grade e auditoria de responsividade para conteúdo real.",
    "scope": [
      "Catálogo de 60 livros, filtros, formulário e página de detalhe.",
      "Tokens de cores, tipografia, espaçamento e componentes.",
      "Tema claro/escuro e movimento reduzido, respeitando preferências."
    ],
    "constraints": [
      "Não reduzir a fonte para esconder overflow.",
      "Testar conteúdo longo, sem imagem e idiomas diferentes.",
      "220px a 4000px com limites de leitura e áreas locais de rolagem identificadas.",
      "Sem framework obrigatório; explique cascata e especificidade."
    ],
    "execution": "browser",
    "offline": "O projeto usa HTML/CSS local. A auditoria conceitual de box model, cascata e ordem visual pode ser feita sem executor externo.",
    "starterFiles": {
      "index.html": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Biblioteca do bairro</title><link rel=\"stylesheet\" href=\"style.css\"></head><body><main><h1>Biblioteca do bairro</h1><section class=\"catalogo\" aria-label=\"Catálogo\"><article class=\"livro\"><h2>Uma história da nossa cidade</h2><p>Disponível para empréstimo.</p><button type=\"button\">Ver detalhes</button></article></section></main></body></html>",
      "style.css": ":root{--cor-texto:#19281e;--cor-fundo:#fffdf6;--espaco:1rem;font-family:system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;color:var(--cor-texto);background:var(--cor-fundo)}main{padding:var(--espaco);max-width:90rem;margin-inline:auto}button{font:inherit}.livro{min-width:0;overflow-wrap:anywhere}"
    },
    "milestones": [
      {
        "id": "tokens",
        "title": "1. Tokens com função",
        "goal": "Defina cores e espaçamentos pelo papel no conteúdo.",
        "deliverables": [
          "Tabela de tokens e amostras de texto/controles."
        ],
        "criteria": [
          {
            "id": "tokens-c1",
            "label": "Cada token tem papel documentado."
          },
          {
            "id": "tokens-c2",
            "label": "Contraste foi medido no texto e em estados."
          },
          {
            "id": "tokens-c3",
            "label": "Alterar um token atualiza componentes sem exceções dispersas."
          }
        ],
        "tests": [
          "Compare tema padrão e foco.",
          "Aumente o espaçamento base e confira os componentes."
        ],
        "diagnosis": "Um token chamado verde1 não explica sua finalidade; nomeie texto, superfície ou ação.",
        "transfer": "Transfira tokens para outro catálogo.",
        "lessonIds": [
          "cascata"
        ]
      },
      {
        "id": "conteudo",
        "title": "2. Tipografia e conteúdo adverso",
        "goal": "Organize leitura com títulos longos, texto real e fallback de imagem.",
        "deliverables": [
          "60 itens com variedade de comprimento.",
          "Estilo de texto, links e imagem ausente."
        ],
        "criteria": [
          {
            "id": "conteudo-c1",
            "label": "Parágrafos têm largura de leitura limitada."
          },
          {
            "id": "conteudo-c2",
            "label": "Palavra longa não cria overflow global."
          },
          {
            "id": "conteudo-c3",
            "label": "Imagem ausente mantém título e ação disponíveis."
          }
        ],
        "tests": [
          "Remova imagens e use nome sem espaços.",
          "Faça zoom a 200%."
        ],
        "diagnosis": "Fixar height em cartão pode cortar traduções ou texto ampliado.",
        "transfer": "Inclua resumo em outro idioma.",
        "lessonIds": [
          "box-model"
        ]
      },
      {
        "id": "grade",
        "title": "3. Grade que cabe",
        "goal": "Defina explicitamente tracks, gaps e o mínimo de cada componente.",
        "deliverables": [
          "Grade e matriz de 220,320,768,1440,2560,4000 pixels."
        ],
        "criteria": [
          {
            "id": "grade-c1",
            "label": "A menor largura mantém controles legíveis."
          },
          {
            "id": "grade-c2",
            "label": "A maior largura usa espaço sem esticar linhas indefinidamente."
          },
          {
            "id": "grade-c3",
            "label": "Cartões longos não impõem mínimo intrínseco indevido."
          }
        ],
        "tests": [
          "Compare auto-fill/auto-fit com dois itens.",
          "Use minmax e conteúdo longo."
        ],
        "diagnosis": "1fr sozinho não remove todo mínimo intrínseco; inspecione a trilha e seus filhos.",
        "transfer": "Adicione painel de filtros adaptativo.",
        "lessonIds": [
          "grid-responsivo"
        ]
      },
      {
        "id": "componentes",
        "title": "4. Componentes e estados",
        "goal": "Crie botões, campos, avisos e navegação consistentes.",
        "deliverables": [
          "Página de componentes e tabela de estados."
        ],
        "criteria": [
          {
            "id": "componentes-c1",
            "label": "Focus-visible não depende somente de cor."
          },
          {
            "id": "componentes-c2",
            "label": "Disabled não é confundido com loading."
          },
          {
            "id": "componentes-c3",
            "label": "Erro, sucesso e vazio têm texto útil."
          }
        ],
        "tests": [
          "Percorra componentes por Tab.",
          "Teste erro longo no formulário."
        ],
        "diagnosis": "Uma regra global com alta especificidade pode impedir estado local.",
        "transfer": "Inclua novo componente com os mesmos tokens.",
        "lessonIds": [
          "formularios",
          "html-acessivel"
        ]
      },
      {
        "id": "preferencias",
        "title": "5. Preferências respeitadas",
        "goal": "Ofereça tema e reduza movimento sem ocultar informação.",
        "deliverables": [
          "Tema escuro e regras de movimento reduzido."
        ],
        "criteria": [
          {
            "id": "preferencias-c1",
            "label": "Tema mantém contraste e foco."
          },
          {
            "id": "preferencias-c2",
            "label": "Reduced motion remove animação não essencial."
          },
          {
            "id": "preferencias-c3",
            "label": "Mensagens não dependem de uma animação para aparecer."
          }
        ],
        "tests": [
          "Ative preferências do sistema.",
          "Examine estados com animação desativada."
        ],
        "diagnosis": "Desligar toda transição não deve remover a indicação de mudança de estado.",
        "transfer": "Inclua impressão legível.",
        "lessonIds": [
          "animacoes"
        ]
      },
      {
        "id": "auditoria",
        "title": "6. Auditoria que encontra uma causa",
        "goal": "Investigue overflow, cascata e ordem de foco antes da entrega.",
        "deliverables": [
          "Relatório com capturas, medidas e causas corrigidas."
        ],
        "criteria": [
          {
            "id": "auditoria-c1",
            "label": "Não há overflow global em 220 a 4000 pixels."
          },
          {
            "id": "auditoria-c2",
            "label": "Ordem visual corresponde ao conteúdo e foco."
          },
          {
            "id": "auditoria-c3",
            "label": "Cada correção explica a causa e tem caso de regressão."
          }
        ],
        "tests": [
          "Insira título de 120 caracteres.",
          "Compare estilos computados em duas larguras."
        ],
        "diagnosis": "overflow:hidden pode esconder o sintoma e o conteúdo. Corrija a restrição responsável.",
        "transfer": "Reproduza um defeito em uma página mínima.",
        "lessonIds": [
          "flex-position"
        ]
      },
      {
        "id": "entrega",
        "title": "7. Documentação e transferência",
        "goal": "Entregue componentes reutilizáveis e um guia para acrescentar conteúdo.",
        "deliverables": [
          "Guia de tokens, componentes, responsividade e limites."
        ],
        "criteria": [
          {
            "id": "entrega-c1",
            "label": "Um novo cartão funciona sem CSS específico."
          },
          {
            "id": "entrega-c2",
            "label": "O guia ensina estados e critérios de tamanho."
          },
          {
            "id": "entrega-c3",
            "label": "A revisão manual não é rotulada como prova automática completa."
          }
        ],
        "tests": [
          "Outra pessoa adiciona um componente pelo guia.",
          "Teste o catálogo com menos e mais itens."
        ],
        "diagnosis": "Uma captura de tela só registra um estado. A entrega precisa dos estados e casos extremos.",
        "transfer": "Aplique o sistema a um mural de eventos.",
        "lessonIds": [
          "projeto-entrega"
        ]
      }
    ],
    "references": [
      "https://www.w3.org/TR/css-grid-1/",
      "https://html.spec.whatwg.org/multipage/"
    ]
  },
  {
    "id": "javascript-kanban",
    "language": "javascript",
    "revision": 1,
    "title": "Quadro de tarefas com histórico e sincronização simulada",
    "summary": "Implemente um quadro com regras puras, filtros, histórico de ações, persistência e conflitos de resposta.",
    "scope": [
      "50 tarefas em três estados e prioridades.",
      "Criação, edição, filtro, desfazer e histórico limitado.",
      "Transporte simulado offline e exportação versionada."
    ],
    "constraints": [
      "Identificadores estáveis e textos literais.",
      "Nenhuma alteração de estado por índice filtrado.",
      "Teste regras sem DOM e assíncronos sem espera arbitrária.",
      "Sem conta ou serviço obrigatório."
    ],
    "execution": "browser",
    "offline": "Todos os estados e conflitos de sincronização são simuláveis localmente. A consulta a servidor é extensão opcional.",
    "starterFiles": {
      "index.html": "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Meu quadro</title></head><body><main><h1>Meu quadro</h1><ul id=\"tarefas\"></ul></main><script type=\"module\" src=\"app.js\"></script></body></html>",
      "dominio.js": "export function criarTarefa(id, titulo) {\n if (!titulo.trim()) throw new Error('Título obrigatório');\n return {id,titulo:titulo.trim(),estado:'pendente',prioridade:1};\n}\n",
      "app.js": "import {criarTarefa} from './dominio.js';\nconst tarefas = [criarTarefa('t1','Experimentar uma ideia')];\nconst lista = document.querySelector('#tarefas');\nfor (const tarefa of tarefas) {\n const li = document.createElement('li');\n li.textContent = tarefa.titulo;\n lista.append(li);\n}\n",
      "casos.json": "{\"version\":1,\"casos\":[{\"titulo\":\"\",\"esperado\":\"erro\"},{\"titulo\":\" Ideia \",\"esperado\":\"Ideia\"}]}"
    },
    "milestones": [
      {
        "id": "dominio",
        "title": "1. Regras e identidade",
        "goal": "Defina estados permitidos, criação e transições como funções puras.",
        "deliverables": [
          "dominio.js e tabela de transições."
        ],
        "criteria": [
          {
            "id": "dominio-c1",
            "label": "Título vazio é rejeitado."
          },
          {
            "id": "dominio-c2",
            "label": "Id não muda ao editar."
          },
          {
            "id": "dominio-c3",
            "label": "Transição inválida não altera a entrada."
          }
        ],
        "tests": [
          "Teste branco, duplicata de id e estado desconhecido.",
          "Congele entrada em um teste de mutação."
        ],
        "diagnosis": "O índice da lista não é identidade duradoura.",
        "transfer": "Adicione um estado arquivado com regra própria.",
        "lessonIds": [
          "funcoes",
          "colecoes"
        ]
      },
      {
        "id": "interface",
        "title": "2. Interface que representa estado",
        "goal": "Renderize colunas, filtros e formulário acessível.",
        "deliverables": [
          "Interface com 50 tarefas e contagem por estado."
        ],
        "criteria": [
          {
            "id": "interface-c1",
            "label": "Texto inserido é literal."
          },
          {
            "id": "interface-c2",
            "label": "Filtro não altera o conjunto original."
          },
          {
            "id": "interface-c3",
            "label": "Lista vazia é informativa e teclado opera ações."
          }
        ],
        "tests": [
          "Filtre e edite a segunda tarefa.",
          "Cadastre texto contendo tags."
        ],
        "diagnosis": "O filtro pode mudar posições; procure pelo id antes da alteração.",
        "transfer": "Inclua filtro por prioridade.",
        "lessonIds": [
          "eventos",
          "estado-formulario"
        ]
      },
      {
        "id": "historico",
        "title": "3. Desfazer uma ação",
        "goal": "Guarde snapshots ou comandos com fronteira definida.",
        "deliverables": [
          "Desfazer até 20 ações e descrição de cada alteração."
        ],
        "criteria": [
          {
            "id": "historico-c1",
            "label": "Desfazer edição restaura valor anterior."
          },
          {
            "id": "historico-c2",
            "label": "O histórico é limitado e não compartilha objetos mutáveis indevidamente."
          },
          {
            "id": "historico-c3",
            "label": "Uma ação rejeitada não entra no histórico."
          }
        ],
        "tests": [
          "Edite duas vezes e desfaça duas vezes.",
          "Altere objeto atual e confira snapshot anterior."
        ],
        "diagnosis": "Spread copia apenas um nível; referência compartilhada pode corromper snapshots.",
        "transfer": "Implemente refazer e explique a invalidação após nova edição.",
        "lessonIds": [
          "objetos-modulos"
        ]
      },
      {
        "id": "persistencia",
        "title": "4. Recuperação local",
        "goal": "Salve documento versionado e importe sem perda silenciosa.",
        "deliverables": [
          "Adaptador local com exportação e validação de esquema."
        ],
        "criteria": [
          {
            "id": "persistencia-c1",
            "label": "Reload retoma tarefas e histórico permitido."
          },
          {
            "id": "persistencia-c2",
            "label": "JSON inválido preserva estado anterior."
          },
          {
            "id": "persistencia-c3",
            "label": "Quota não é exibida como sucesso."
          }
        ],
        "tests": [
          "Importe null, versão 99 e dados com id duplicado.",
          "Simule falha de armazenamento."
        ],
        "diagnosis": "JSON válido ainda pode quebrar o contrato.",
        "transfer": "Migre um formato antigo documentado.",
        "lessonIds": [
          "erros-json",
          "armazenamento"
        ]
      },
      {
        "id": "concorrencia",
        "title": "5. Respostas em ordem inversa",
        "goal": "Injete transporte e proteja relevância dos resultados.",
        "deliverables": [
          "Transporte falso com sucesso, falha e conflito."
        ],
        "criteria": [
          {
            "id": "concorrencia-c1",
            "label": "Resultado antigo é ignorado."
          },
          {
            "id": "concorrencia-c2",
            "label": "Estado de carregamento tem dono definido."
          },
          {
            "id": "concorrencia-c3",
            "label": "Uma falha não elimina tarefas locais."
          }
        ],
        "tests": [
          "Resolva pedido B antes de A.",
          "Rejeite A depois de B bem-sucedido."
        ],
        "diagnosis": "Uma exceção antiga também pode sobrescrever estado atual.",
        "transfer": "Acrescente chave de idempotência a uma intenção de envio.",
        "lessonIds": [
          "async",
          "fetch-estados"
        ]
      },
      {
        "id": "testes",
        "title": "6. Casos que rejeitam atalhos",
        "goal": "Teste domínio, histórico e transporte com entradas independentes.",
        "deliverables": [
          "Casos de fronteira e roteiro de fluxo completo."
        ],
        "criteria": [
          {
            "id": "testes-c1",
            "label": "Teste detecta id trocado durante filtro."
          },
          {
            "id": "testes-c2",
            "label": "Teste detecta snapshot compartilhado."
          },
          {
            "id": "testes-c3",
            "label": "Corrida é determinística e não depende de timeout."
          }
        ],
        "tests": [
          "Introduza os dois defeitos temporariamente.",
          "Teste tarefa inexistente e histórico vazio."
        ],
        "diagnosis": "Contar tarefas não demonstra que o conteúdo certo foi alterado.",
        "transfer": "Adicione uma operação e seu caso antes de implementar.",
        "lessonIds": [
          "fullstack-testes"
        ]
      },
      {
        "id": "entrega",
        "title": "7. Entrega com nova demanda",
        "goal": "Documente decisões, execute roteiro e acrescente uma demanda sem duplicar regras.",
        "deliverables": [
          "README, backup de exemplo e relatório de regressões."
        ],
        "criteria": [
          {
            "id": "entrega-c1",
            "label": "O roteiro de retomada é reproduzível."
          },
          {
            "id": "entrega-c2",
            "label": "Limites de offline e transporte simulado são explícitos."
          },
          {
            "id": "entrega-c3",
            "label": "Uma nova prioridade não exige reescrever todas as telas."
          }
        ],
        "tests": [
          "Restaure backup numa sessão limpa.",
          "Acrescente prioridade urgente e execute os casos existentes."
        ],
        "diagnosis": "Uma extensão que espalha a regra em cada botão revela uma fronteira fraca.",
        "transfer": "Transforme o quadro em organizador de leitura preservando as funções úteis.",
        "lessonIds": [
          "fullstack-arquitetura",
          "projeto-entrega"
        ]
      }
    ],
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
      "https://nodejs.org/api/test.html"
    ]
  },
  {
    "id": "typescript-cliente",
    "language": "typescript",
    "revision": 1,
    "title": "Cliente de API tipado com dados desconhecidos",
    "summary": "Construa um cliente que valida entradas externas, modela estados, pagina, cancela e preserva resultados locais.",
    "scope": [
      "Catálogo de 100 registros e paginação.",
      "Contratos de domínio, validação runtime e adaptador de transporte.",
      "Estados discriminados e erros úteis para interface."
    ],
    "constraints": [
      "strict habilitado, sem any nos contratos.",
      "Dados externos entram como unknown.",
      "Sem asserção de tipo usada para simular validação.",
      "Executar TypeScript requer compilador local; previsão e revisão de contratos funcionam offline."
    ],
    "execution": "local-toolchain",
    "offline": "Antes da compilação local, revise narrowing, estados e casos de entrada em tabelas. O editor do projeto não afirma ter compilado.",
    "starterFiles": {
      "tsconfig.json": "{\"compilerOptions\":{\"target\":\"ES2022\",\"module\":\"ESNext\",\"moduleResolution\":\"Bundler\",\"strict\":true,\"noEmit\":true},\"include\":[\"src\"]}",
      "src/domain.ts": "export type Item = {id:string;titulo:string};\nexport function lerItem(valor:unknown):Item {\n if (!valor || typeof valor !== 'object') throw new Error('Objeto esperado');\n const dado = valor as Record<string,unknown>;\n if (typeof dado.id !== 'string' || typeof dado.titulo !== 'string') throw new Error('Campos inválidos');\n return {id:dado.id,titulo:dado.titulo};\n}\n",
      "src/client.ts": "import {lerItem} from './domain';\nexport function lerPagina(valor:unknown) {\n if (!Array.isArray(valor)) throw new Error('Lista esperada');\n return valor.map(lerItem);\n}\n"
    },
    "milestones": [
      {
        "id": "contratos",
        "title": "1. Tipos que expressam o domínio",
        "goal": "Defina identidade, paginação e estados válidos.",
        "deliverables": [
          "Item, Página e união de estados discriminada."
        ],
        "criteria": [
          {
            "id": "contratos-c1",
            "label": "Estado de falha tem erro e não dados obrigatórios."
          },
          {
            "id": "contratos-c2",
            "label": "Estado de sucesso tem dados e não erro obrigatório."
          },
          {
            "id": "contratos-c3",
            "label": "As invariantes são explicadas sem depender de casts."
          }
        ],
        "tests": [
          "Tente representar sucesso sem dados.",
          "Descreva a falha esperada do compilador."
        ],
        "diagnosis": "Um objeto com todos os campos opcionais permite combinações inválidas.",
        "transfer": "Adicione estado vazio sem perder a distinção de erro.",
        "lessonIds": []
      },
      {
        "id": "validacao",
        "title": "2. A fronteira unknown",
        "goal": "Converta dados externos somente depois de conferir estrutura e campos.",
        "deliverables": [
          "Validadores de item/página com caminhos de erro."
        ],
        "criteria": [
          {
            "id": "validacao-c1",
            "label": "null, array no lugar de objeto e campos errados são recusados."
          },
          {
            "id": "validacao-c2",
            "label": "Erro indica o caminho do campo."
          },
          {
            "id": "validacao-c3",
            "label": "O retorno é um objeto de domínio validado."
          }
        ],
        "tests": [
          "Use id numérico, título ausente e lista com item inválido.",
          "Teste valores extras e registre a política."
        ],
        "diagnosis": "valor as Item muda a visão do compilador, não valida dado real.",
        "transfer": "Valide uma versão de API com campo opcional.",
        "lessonIds": []
      },
      {
        "id": "transporte",
        "title": "3. Transporte como contrato",
        "goal": "Modele status, corpo e cancelamento sem amarrar domínio a fetch.",
        "deliverables": [
          "Adaptador falso e contrato de transporte."
        ],
        "criteria": [
          {
            "id": "transporte-c1",
            "label": "Status de erro não é interpretado como página."
          },
          {
            "id": "transporte-c2",
            "label": "Abort é distinguido de falha visível quando apropriado."
          },
          {
            "id": "transporte-c3",
            "label": "A interface usa resultado validado."
          }
        ],
        "tests": [
          "Simule 404 e corpo inválido.",
          "Cancele solicitação sem apagar dados atuais."
        ],
        "diagnosis": "Tipar response.json como Item[] não prova formato recebido.",
        "transfer": "Ligue HTTP local sem mudar os validadores.",
        "lessonIds": [
          "http",
          "async"
        ]
      },
      {
        "id": "paginacao",
        "title": "4. Paginação sem duplicação",
        "goal": "Acumule páginas por identidade e defina política para dados repetidos.",
        "deliverables": [
          "Algoritmo de merge de páginas e metadados."
        ],
        "criteria": [
          {
            "id": "paginacao-c1",
            "label": "Um id repetido não duplica o catálogo."
          },
          {
            "id": "paginacao-c2",
            "label": "Página fora de ordem não substitui a consulta atual."
          },
          {
            "id": "paginacao-c3",
            "label": "Fim da paginação é separado de erro."
          }
        ],
        "tests": [
          "Simule páginas sobrepostas e resposta tardia.",
          "Troque filtro durante carregamento."
        ],
        "diagnosis": "Concatenar páginas cegamente duplica itens e mistura consultas.",
        "transfer": "Acrescente cursor em vez de número de página.",
        "lessonIds": []
      },
      {
        "id": "cache",
        "title": "5. Cache versionado com validação",
        "goal": "Persista apenas contratos conhecidos e mantenha recuperação.",
        "deliverables": [
          "Cache local e importação/exportação."
        ],
        "criteria": [
          {
            "id": "cache-c1",
            "label": "Dados recuperados passam pelos validadores."
          },
          {
            "id": "cache-c2",
            "label": "Versão desconhecida preserva backup anterior."
          },
          {
            "id": "cache-c3",
            "label": "Falha de gravação tem feedback honesto."
          }
        ],
        "tests": [
          "Corrompa um campo do cache.",
          "Simule quota e retomada."
        ],
        "diagnosis": "Dados salvos antes também podem estar inválidos.",
        "transfer": "Migre cache antigo por função explícita.",
        "lessonIds": [
          "armazenamento"
        ]
      },
      {
        "id": "testes",
        "title": "6. Tipos e runtime são dois contratos",
        "goal": "Combine compilação strict com testes de validadores e concorrência.",
        "deliverables": [
          "Casos de compilação esperada e casos runtime."
        ],
        "criteria": [
          {
            "id": "testes-c1",
            "label": "Contrato inválido é rejeitado no nível adequado."
          },
          {
            "id": "testes-c2",
            "label": "Cast não mascara ausência de validação."
          },
          {
            "id": "testes-c3",
            "label": "Testes usam transportes controlados."
          }
        ],
        "tests": [
          "Teste três casos que compilam mas recebem dados inválidos.",
          "Teste uma combinação de estado impossível."
        ],
        "diagnosis": "Um build verde não prova que um JSON externo é confiável.",
        "transfer": "Adicione uma propriedade e avalie a migração.",
        "lessonIds": []
      },
      {
        "id": "entrega",
        "title": "7. Biblioteca e demonstração",
        "goal": "Documente o cliente, os contratos e uma integração consumidora.",
        "deliverables": [
          "Guia público de API, exemplos e roteiro de recuperação."
        ],
        "criteria": [
          {
            "id": "entrega-c1",
            "label": "Instalação e compilação são reproduzíveis."
          },
          {
            "id": "entrega-c2",
            "label": "Os erros têm exemplos de consumo."
          },
          {
            "id": "entrega-c3",
            "label": "Nenhum teste conceitual é descrito como execução real."
          }
        ],
        "tests": [
          "Consuma o cliente em uma tela mínima.",
          "Reproduza erro de campo com mensagem útil."
        ],
        "diagnosis": "Documentação sem exemplo de falha deixa o contrato incompleto.",
        "transfer": "Troque o catálogo por agenda mantendo fronteiras.",
        "lessonIds": []
      }
    ],
    "references": [
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview",
      "https://nodejs.org/api/test.html"
    ]
  },
  {
    "id": "python-biblioteca",
    "language": "python",
    "revision": 1,
    "title": "Biblioteca de empréstimos com CLI e SQLite",
    "summary": "Construa uma aplicação de linha de comando com catálogo, reservas, empréstimos, importação, transações e relatórios usando biblioteca padrão.",
    "scope": [
      "100 livros, leitores e histórico de empréstimos.",
      "Comandos de cadastro, busca, emprestar, devolver e relatório.",
      "SQLite local, CSV de importação e backup restaurável."
    ],
    "constraints": [
      "Valores monetários, se houver multa, em centavos inteiros.",
      "SQL parametrizado, sem concatenar entrada.",
      "Empréstimo recusado não altera estoque.",
      "Sem serviço externo: Python e SQLite locais; estudo de rastreamento funciona sem executor."
    ],
    "execution": "local-toolchain",
    "offline": "Preveja saídas, reconstrua funções e examine transações antes de instalar Python. Execução de arquivos e banco exige Python local, não Judge0.",
    "starterFiles": {
      "app.py": "import argparse\n\n\ndef montar_parser():\n    parser = argparse.ArgumentParser(description='Biblioteca local')\n    parser.add_argument('comando', choices=['listar'])\n    return parser\n\n\ndef main():\n    args = montar_parser().parse_args()\n    if args.comando == 'listar':\n        print('Catálogo ainda vazio')\n\n\nif __name__ == '__main__':\n    main()\n",
      "dominio.py": "def pode_emprestar(disponiveis, ativos, limite):\n    return disponiveis > 0 and ativos < limite\n",
      "dados.csv": "id,titulo,exemplares\n1,Histórias do bairro,3\n2,Primeiros algoritmos,2\n"
    },
    "milestones": [
      {
        "id": "dominio",
        "title": "1. Regras de empréstimo",
        "goal": "Defina disponibilidade, limite e devolução como funções verificáveis.",
        "deliverables": [
          "Funções de domínio e tabela de casos."
        ],
        "criteria": [
          {
            "id": "dominio-c1",
            "label": "Estoque zero recusa empréstimo."
          },
          {
            "id": "dominio-c2",
            "label": "Limite atingido recusa sem alterar dados."
          },
          {
            "id": "dominio-c3",
            "label": "Devolução duplicada tem política explícita."
          }
        ],
        "tests": [
          "Teste 0/1 exemplar e limite-1/limite.",
          "Rastreie as entradas sem executor."
        ],
        "diagnosis": "Um or pode permitir empréstimo mesmo sem exemplar.",
        "transfer": "Acrescente regra de reserva sem acoplar ao CLI.",
        "lessonIds": []
      },
      {
        "id": "cli",
        "title": "2. CLI com mensagens úteis",
        "goal": "Implemente comandos e erros de entrada sem traceback para falhas esperadas.",
        "deliverables": [
          "Parser, ajuda e códigos de saída documentados."
        ],
        "criteria": [
          {
            "id": "cli-c1",
            "label": "Comando inválido informa uso."
          },
          {
            "id": "cli-c2",
            "label": "Sucesso e falha têm saídas distintas."
          },
          {
            "id": "cli-c3",
            "label": "Importar domínio não executa o CLI."
          }
        ],
        "tests": [
          "Execute ajuda, comando inexistente e catálogo vazio.",
          "Preveja stdout/stderr antes da execução."
        ],
        "diagnosis": "Código no topo do módulo pode rodar durante importação de teste.",
        "transfer": "Adicione opção de formato JSON.",
        "lessonIds": []
      },
      {
        "id": "persistencia",
        "title": "3. Banco com contratos",
        "goal": "Modele livros, leitores e empréstimos com chaves e restrições.",
        "deliverables": [
          "schema.sql, repositório sqlite3 e consultas parametrizadas."
        ],
        "criteria": [
          {
            "id": "persistencia-c1",
            "label": "Chaves estrangeiras são habilitadas e verificadas por conexão."
          },
          {
            "id": "persistencia-c2",
            "label": "Não há SQL construído por concatenação."
          },
          {
            "id": "persistencia-c3",
            "label": "Dados inválidos são recusados por restrição pertinente."
          }
        ],
        "tests": [
          "Tente empréstimo para livro inexistente.",
          "Use título com aspas como dado."
        ],
        "diagnosis": "SQLite exige configuração de foreign_keys por conexão; apenas declarar FK não basta.",
        "transfer": "Inclua índice para uma consulta medida.",
        "lessonIds": []
      },
      {
        "id": "transacoes",
        "title": "4. Emprestar atomicamente",
        "goal": "Associe mudança de estoque ao registro de empréstimo na mesma transação.",
        "deliverables": [
          "Operação transacional com rollback no erro."
        ],
        "criteria": [
          {
            "id": "transacoes-c1",
            "label": "Falha entre as escritas não deixa estoque inconsistente."
          },
          {
            "id": "transacoes-c2",
            "label": "Estoque nunca fica negativo."
          },
          {
            "id": "transacoes-c3",
            "label": "Atualização condicional verifica se realmente alterou um registro."
          }
        ],
        "tests": [
          "Injete erro após atualizar estoque.",
          "Tente duas operações para o último exemplar."
        ],
        "diagnosis": "Ler disponibilidade e atualizar depois sem proteção pode aceitar duas operações.",
        "transfer": "Registre reserva e empréstimo no mesmo contrato.",
        "lessonIds": []
      },
      {
        "id": "importacao",
        "title": "5. Importar sem apagar o que existe",
        "goal": "Valide CSV inteiro, relatórios de erros e política de duplicatas.",
        "deliverables": [
          "Importador, arquivo de teste adverso e backup."
        ],
        "criteria": [
          {
            "id": "importacao-c1",
            "label": "Linha inválida aponta número e motivo."
          },
          {
            "id": "importacao-c2",
            "label": "Duplicata segue política documentada."
          },
          {
            "id": "importacao-c3",
            "label": "Falha de importação preserva dados atuais."
          }
        ],
        "tests": [
          "Use campo faltante, exemplar negativo e id repetido.",
          "Restaure banco em diretório separado."
        ],
        "diagnosis": "Converter int pode lançar antes de informar a linha; mantenha contexto.",
        "transfer": "Aceite um segundo formato via adaptador.",
        "lessonIds": []
      },
      {
        "id": "testes",
        "title": "6. Casos reais com banco temporário",
        "goal": "Use unittest e banco temporário isolado por teste.",
        "deliverables": [
          "Testes do domínio, CLI e transação."
        ],
        "criteria": [
          {
            "id": "testes-c1",
            "label": "Um teste não depende do banco de outro."
          },
          {
            "id": "testes-c2",
            "label": "O rollback é observado por consulta independente."
          },
          {
            "id": "testes-c3",
            "label": "Saída e código de retorno são comparados."
          }
        ],
        "tests": [
          "Rode testes em ordem diferente.",
          "Introduza falha entre duas escritas."
        ],
        "diagnosis": "Testar somente a função pode não detectar uma transação incompleta.",
        "transfer": "Teste uma migração em uma cópia antiga.",
        "lessonIds": []
      },
      {
        "id": "entrega",
        "title": "7. Manual, relatório e recuperação",
        "goal": "Entregue aplicação local, documentação e relatório de empréstimos atrasados.",
        "deliverables": [
          "README, esquema, fixtures e roteiro de backup/restore."
        ],
        "criteria": [
          {
            "id": "entrega-c1",
            "label": "Outro usuário cria banco e executa comandos pelo guia."
          },
          {
            "id": "entrega-c2",
            "label": "O relatório distingue zero resultados de falha."
          },
          {
            "id": "entrega-c3",
            "label": "A restauração é demonstrada com dados conferidos."
          }
        ],
        "tests": [
          "Importe 100 livros e empreste/devolva vários.",
          "Compare totais antes e depois de restaurar."
        ],
        "diagnosis": "Um backup sem teste de restore ainda não demonstra recuperação.",
        "transfer": "Adapte as regras a equipamentos emprestados.",
        "lessonIds": []
      }
    ],
    "references": [
      "https://docs.python.org/3/library/sqlite3.html",
      "https://docs.python.org/3/tutorial/datastructures.html"
    ]
  },
  {
    "id": "csharp-estoque",
    "language": "csharp",
    "revision": 1,
    "title": "Estoque local com comandos e auditoria",
    "summary": "Construa uma aplicação .NET com regras de estoque, reposição, movimentos, persistência JSON, cancelamento e testes.",
    "scope": [
      "100 produtos com identificação e movimentos.",
      "Entrada, saída, reserva, cancelamento e relatório de mínimo.",
      "Repositório local versionado e log auditável de operações."
    ],
    "constraints": [
      "Estoque e valores inválidos recusados antes da persistência.",
      "Domínio independe de Console, arquivos e rede.",
      "ID estável e política de idempotência para comandos.",
      "Sem API obrigatória; .NET local executa o projeto."
    ],
    "execution": "local-toolchain",
    "offline": "Tabelas de saída, análise de tipos, reconstrução e rastreamento dos movimentos funcionam sem Judge0. A compilação real exige .NET local.",
    "starterFiles": {
      "Estoque.csproj": "<Project Sdk=\"Microsoft.NET.Sdk\"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable></PropertyGroup></Project>",
      "Program.cs": "var produto = new Produto(\"p1\", \"Caderno\", 10);\nConsole.WriteLine($\"{produto.Nome}: {produto.Quantidade}\");\n",
      "Produto.cs": "public sealed record Produto(string Id, string Nome, int Quantidade);\n",
      "dados.json": "{\"version\":1,\"produtos\":[{\"id\":\"p1\",\"nome\":\"Caderno\",\"quantidade\":10}]}"
    },
    "milestones": [
      {
        "id": "dominio",
        "title": "1. Produtos e invariantes",
        "goal": "Modele produtos e operações que não permitem estoque negativo.",
        "deliverables": [
          "Tipos de domínio e resultado de operação."
        ],
        "criteria": [
          {
            "id": "dominio-c1",
            "label": "Quantidade negativa é recusada."
          },
          {
            "id": "dominio-c2",
            "label": "Saída maior que estoque não altera o produto."
          },
          {
            "id": "dominio-c3",
            "label": "Entrada válida preserva identidade."
          }
        ],
        "tests": [
          "Rastreie 10-3 e tentativa 10-11.",
          "Teste quantidade zero conforme política."
        ],
        "diagnosis": "Uma propriedade pública gravável pode bypassar invariantes.",
        "transfer": "Acrescente unidade de medida.",
        "lessonIds": []
      },
      {
        "id": "comandos",
        "title": "2. Aplicação de comandos",
        "goal": "Traduza entrada do usuário para comandos tipados.",
        "deliverables": [
          "Parser de comandos e respostas de erro."
        ],
        "criteria": [
          {
            "id": "comandos-c1",
            "label": "Parse inválido é distinguido de regra recusada."
          },
          {
            "id": "comandos-c2",
            "label": "Falha esperada não encerra o programa abruptamente."
          },
          {
            "id": "comandos-c3",
            "label": "Domínio não escreve no Console."
          }
        ],
        "tests": [
          "Use número fora da faixa e id desconhecido.",
          "Preveja mensagens e estado final."
        ],
        "diagnosis": "int.Parse sem tratamento pode converter falha de entrada em encerramento.",
        "transfer": "Inclua comando em lote sem duplicar regras.",
        "lessonIds": []
      },
      {
        "id": "movimentos",
        "title": "3. Histórico e identidade de operação",
        "goal": "Registre movimento junto da alteração com uma intenção estável.",
        "deliverables": [
          "Movimentos com id, produto, quantidade e razão."
        ],
        "criteria": [
          {
            "id": "movimentos-c1",
            "label": "Uma repetição da mesma operação não duplica a saída."
          },
          {
            "id": "movimentos-c2",
            "label": "Mesma chave com conteúdo diferente é recusada."
          },
          {
            "id": "movimentos-c3",
            "label": "Histórico explica toda mudança aceita."
          }
        ],
        "tests": [
          "Repita retirada com a mesma chave.",
          "Tente reusar chave com quantidade diferente."
        ],
        "diagnosis": "Gerar id dentro de cada tentativa elimina a identidade da intenção.",
        "transfer": "Acrescente reserva/cancelamento com histórico.",
        "lessonIds": []
      },
      {
        "id": "arquivos",
        "title": "4. Persistência e recuperação",
        "goal": "Implemente repositório JSON versionado e escrita recuperável.",
        "deliverables": [
          "Adaptador de arquivo e formato documentado."
        ],
        "criteria": [
          {
            "id": "arquivos-c1",
            "label": "Arquivo corrompido não substitui o estado válido."
          },
          {
            "id": "arquivos-c2",
            "label": "Falha de gravação não é anunciada como sucesso."
          },
          {
            "id": "arquivos-c3",
            "label": "Exportação mantém dados e versão."
          }
        ],
        "tests": [
          "Simule repositório que lança exceção.",
          "Importe versão desconhecida."
        ],
        "diagnosis": "Capturar e ignorar IOException gera falsa confirmação.",
        "transfer": "Adicione adaptador em memória para testes.",
        "lessonIds": []
      },
      {
        "id": "assincrono",
        "title": "5. Cancelar antes de confirmar",
        "goal": "Use async e cancelamento com fronteira clara de confirmação.",
        "deliverables": [
          "Operação assíncrona e política de cancelamento."
        ],
        "criteria": [
          {
            "id": "assincrono-c1",
            "label": "Cancelamento anterior à confirmação não registra movimento."
          },
          {
            "id": "assincrono-c2",
            "label": "Depois da confirmação, o resultado reflete operação realizada."
          },
          {
            "id": "assincrono-c3",
            "label": "Recursos descartáveis são liberados."
          }
        ],
        "tests": [
          "Cancele durante carregamento e antes da gravação.",
          "Preveja sequência de using/finally."
        ],
        "diagnosis": "Cancelar UI não desfaz automaticamente uma escrita concluída.",
        "transfer": "Inclua importação em lote cancelável.",
        "lessonIds": []
      },
      {
        "id": "testes",
        "title": "6. Verificar comportamento e descarte",
        "goal": "Teste domínio, idempotência e repositório falso com falhas.",
        "deliverables": [
          "Projeto de testes e casos de recursos."
        ],
        "criteria": [
          {
            "id": "testes-c1",
            "label": "Teste rejeita operação duplicada."
          },
          {
            "id": "testes-c2",
            "label": "Falha de repositório preserva estado esperado."
          },
          {
            "id": "testes-c3",
            "label": "Sequência descartada cedo libera o recurso."
          }
        ],
        "tests": [
          "Interrompa um foreach no primeiro item.",
          "Injete falha de persistência."
        ],
        "diagnosis": "Uma contagem correta sem histórico consistente não prova atomicidade.",
        "transfer": "Teste nova regra de estoque mínimo.",
        "lessonIds": []
      },
      {
        "id": "entrega",
        "title": "7. Relatórios e manual local",
        "goal": "Entregue comandos, relatório e guia de recuperação.",
        "deliverables": [
          "README, fixtures e relatório de produtos abaixo do mínimo."
        ],
        "criteria": [
          {
            "id": "entrega-c1",
            "label": "Build e execução estão descritos com SDK requerido."
          },
          {
            "id": "entrega-c2",
            "label": "Restaurar backup preserva movimentos e totais."
          },
          {
            "id": "entrega-c3",
            "label": "As verificações executadas são separadas das conceituais."
          }
        ],
        "tests": [
          "Carregue 100 produtos e 300 movimentos.",
          "Compare relatório e totais após restauração."
        ],
        "diagnosis": "Um backup apenas exportado precisa de restauração para ser demonstrado.",
        "transfer": "Adapte o aplicativo a almoxarifado com lotes.",
        "lessonIds": []
      }
    ],
    "references": [
      "https://learn.microsoft.com/en-us/dotnet/core/testing/",
      "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures"
    ]
  },
  {
    "id": "cpp-rotas",
    "language": "cpp",
    "revision": 1,
    "title": "Planejador de rotas com grafo e recursos seguros",
    "summary": "Construa uma ferramenta C++ que lê uma rede de conexões, encontra caminhos, explica custos e resiste a entradas inválidas.",
    "scope": [
      "Grafo com 100 vértices e 500 arestas.",
      "Busca em largura para menos conexões e Dijkstra para pesos não negativos.",
      "CLI, parser, relatórios, testes e medição de operações."
    ],
    "constraints": [
      "Sem new/delete manual quando contêiner ou RAII resolve.",
      "Pesos negativos recusados para Dijkstra.",
      "Soma de custos protege overflow.",
      "Sem infraestrutura externa; compilador local executa, rastreamento funciona offline."
    ],
    "execution": "local-toolchain",
    "offline": "Rastreie fila, visitados, predecessor e compilação conceitual sem Judge0. O editor não anuncia compilação executada; exporte para compilador C++ local.",
    "starterFiles": {
      "main.cpp": "#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <vector>\n\nint main() {\n    const std::unordered_map<std::string, std::vector<std::string>> grafo{\n        {\"A\", {\"B\", \"C\"}}, {\"B\", {\"D\"}}, {\"C\", {\"D\"}}, {\"D\", {}}\n    };\n    std::cout << \"Vertices: \" << grafo.size() << '\\n';\n}\n",
      "rede.txt": "A B 5\nA C 2\nC D 3\nB D 1\n",
      "casos.txt": "A D: menos conexoes = 2; menor custo = 5 por A-C-D\nD A: sem caminho no grafo direcionado\nA A: custo 0, caminho A\n"
    },
    "milestones": [
      {
        "id": "modelo",
        "title": "1. Grafo e contratos",
        "goal": "Defina direção, peso, identidade e ausência de caminho.",
        "deliverables": [
          "Tipos de vértice, aresta e resultado."
        ],
        "criteria": [
          {
            "id": "modelo-c1",
            "label": "Grafo direcionado não inventa aresta inversa."
          },
          {
            "id": "modelo-c2",
            "label": "Peso negativo é rejeitado no contrato de Dijkstra."
          },
          {
            "id": "modelo-c3",
            "label": "Ausência não usa custo zero como sentinela."
          }
        ],
        "tests": [
          "Compare A->D e D->A.",
          "Rastreie grafo vazio e início igual ao destino."
        ],
        "diagnosis": "Usar zero para ausência confunde com caminho válido de custo zero.",
        "transfer": "Inclua modo não direcionado explicitamente.",
        "lessonIds": []
      },
      {
        "id": "parser",
        "title": "2. Ler sem corromper estado",
        "goal": "Leia linhas com diagnóstico e construa uma rede validada.",
        "deliverables": [
          "Parser e conjunto de arquivos adversos."
        ],
        "criteria": [
          {
            "id": "parser-c1",
            "label": "Erro informa a linha e o motivo."
          },
          {
            "id": "parser-c2",
            "label": "Entrada inválida não deixa grafo parcialmente ativo."
          },
          {
            "id": "parser-c3",
            "label": "Vértices repetidos seguem identidade consistente."
          }
        ],
        "tests": [
          "Use peso não numérico, negativo e linha incompleta.",
          "Teste arquivo ausente."
        ],
        "diagnosis": "Continuar silenciosamente após parse parcial cria rede diferente da pedida.",
        "transfer": "Aceite comentários documentados.",
        "lessonIds": []
      },
      {
        "id": "bfs",
        "title": "3. Menos conexões",
        "goal": "Implemente BFS com fila e predecessores.",
        "deliverables": [
          "Busca em largura e reconstrução de caminho."
        ],
        "criteria": [
          {
            "id": "bfs-c1",
            "label": "Ciclo termina sem descoberta duplicada."
          },
          {
            "id": "bfs-c2",
            "label": "O caminho tem menos arestas no grafo sem peso."
          },
          {
            "id": "bfs-c3",
            "label": "Vértice inalcançável retorna ausência explícita."
          }
        ],
        "tests": [
          "Teste ciclo, duplicatas e vértice isolado.",
          "Rastreie estado da fila a cada camada."
        ],
        "diagnosis": "Marcar somente ao retirar permite enfileirar duplicatas.",
        "transfer": "Inclua múltiplas origens com contrato próprio.",
        "lessonIds": []
      },
      {
        "id": "dijkstra",
        "title": "4. Menor custo não negativo",
        "goal": "Use prioridade e relaxamento com distância conhecida.",
        "deliverables": [
          "Dijkstra com proteção de overflow e caminho."
        ],
        "criteria": [
          {
            "id": "dijkstra-c1",
            "label": "Entrada obsoleta na fila é ignorada."
          },
          {
            "id": "dijkstra-c2",
            "label": "O custo mínimo difere corretamente do menor número de arestas."
          },
          {
            "id": "dijkstra-c3",
            "label": "Somar custos não estoura o tipo silenciosamente."
          }
        ],
        "tests": [
          "Crie rota curta cara e rota longa barata.",
          "Teste custo no limite do tipo."
        ],
        "diagnosis": "Uma fila FIFO não ordena soma de pesos. Uma entrada antiga de prioridade não deve refazer trabalho indiscriminado.",
        "transfer": "Adicione comparação de BFS e Dijkstra no relatório.",
        "lessonIds": []
      },
      {
        "id": "recursos",
        "title": "5. Recursos e iteradores",
        "goal": "Organize arquivos e coleções com RAII e regras de invalidação.",
        "deliverables": [
          "Leitura por objetos de escopo e documentação de ownership."
        ],
        "criteria": [
          {
            "id": "recursos-c1",
            "label": "Saída por exceção libera arquivo e memória."
          },
          {
            "id": "recursos-c2",
            "label": "Nenhum iterador é usado após operação invalidante."
          },
          {
            "id": "recursos-c3",
            "label": "Referências devolvidas não apontam para temporários."
          }
        ],
        "tests": [
          "Introduza reallocation e identifique iterador inválido.",
          "Preveja destrutores na falha de parse."
        ],
        "diagnosis": "Guardar referência a elemento de vector e depois aumentar capacidade pode invalidá-la.",
        "transfer": "Troque representação mantendo o contrato público.",
        "lessonIds": []
      },
      {
        "id": "testes",
        "title": "6. Provar casos e medir custo",
        "goal": "Separe testes de correção de medições de desempenho.",
        "deliverables": [
          "Casos unitários, integração do parser e contagem de operações."
        ],
        "criteria": [
          {
            "id": "testes-c1",
            "label": "Uma solução de custo fixo falha em nova rede."
          },
          {
            "id": "testes-c2",
            "label": "Testes cobrem isolados, ciclos, zero e overflow."
          },
          {
            "id": "testes-c3",
            "label": "Medição identifica tamanho e distribuição dos dados."
          }
        ],
        "tests": [
          "Execute 100 vértices/500 arestas e uma cadeia longa.",
          "Compare operações sem prometer tempo universal."
        ],
        "diagnosis": "Tempo de uma máquina não prova complexidade; relate também operações e pré-condições.",
        "transfer": "Teste uma representação alternativa.",
        "lessonIds": []
      },
      {
        "id": "entrega",
        "title": "7. Ferramenta reproduzível",
        "goal": "Entregue CLI, redes de exemplo e relatório de decisões.",
        "deliverables": [
          "README com padrão C++, comando de compilação e exemplos.",
          "Relatório com contratos, limites e recuperação de entrada."
        ],
        "criteria": [
          {
            "id": "entrega-c1",
            "label": "Outro usuário reproduz rotas esperadas."
          },
          {
            "id": "entrega-c2",
            "label": "Erros de entrada não aparecem como caminho inexistente."
          },
          {
            "id": "entrega-c3",
            "label": "Somente execução realmente realizada é marcada como executada."
          }
        ],
        "tests": [
          "Compile e compare saídas com casos.txt.",
          "Transfira algoritmo para uma rede diferente."
        ],
        "diagnosis": "A demonstração precisa separar erro de arquivo e ausência matemática de caminho.",
        "transfer": "Adapte para dependências de tarefas e detecção de ciclos.",
        "lessonIds": []
      }
    ],
    "references": [
      "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines",
      "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
    ]
  },
  {
    "id": "sql-reservas",
    "language": "sql",
    "revision": 1,
    "title": "Reservas com integridade, concorrência e recuperação",
    "summary": "Construa um banco de reservas com restrições, relatórios, transações de várias sessões, índices medidos e restauração.",
    "scope": [
      "Clientes, recursos, reservas e histórico.",
      "Fixtures com 100 clientes e 1000 reservas.",
      "Concorrência real em PostgreSQL local e plano de migração/backup."
    ],
    "constraints": [
      "Toda regra tem local explícito: constraint, transação ou aplicação.",
      "Operações com parâmetro na aplicação; sem concatenação.",
      "Múltiplas sessões são necessárias para demonstrar isolamento real.",
      "Tabelas de cronograma e diagnóstico funcionam offline, mas não são execução SQL."
    ],
    "execution": "local-toolchain",
    "offline": "Modele esquema, preveja JOINs e reconstrua cronogramas sem servidor. Executar SQL e comprovar bloqueios exige PostgreSQL local; não depende obrigatoriamente de Judge0.",
    "starterFiles": {
      "schema.sql": "CREATE TABLE recurso (\n id bigint PRIMARY KEY,\n nome text NOT NULL,\n capacidade integer NOT NULL CHECK (capacidade >= 0)\n);\nCREATE TABLE cliente (\n id bigint PRIMARY KEY,\n nome text NOT NULL\n);\nCREATE TABLE reserva (\n id bigint PRIMARY KEY,\n cliente_id bigint NOT NULL REFERENCES cliente(id),\n recurso_id bigint NOT NULL REFERENCES recurso(id),\n quantidade integer NOT NULL CHECK (quantidade > 0)\n);\n",
      "fixtures.sql": "INSERT INTO recurso VALUES (1, 'Sala de estudo', 10);\nINSERT INTO cliente VALUES (1, 'Lia'), (2, 'Bia');\nINSERT INTO reserva VALUES (1, 1, 1, 2);\n",
      "consultas.sql": "SELECT r.nome, COALESCE(SUM(v.quantidade), 0) AS reservado\nFROM recurso r LEFT JOIN reserva v ON v.recurso_id = r.id\nGROUP BY r.id, r.nome;\n"
    },
    "milestones": [
      {
        "id": "modelo",
        "title": "1. Entidades e integridade",
        "goal": "Escolha chaves, relacionamentos e domínio de cada campo.",
        "deliverables": [
          "Modelo e schema.sql com restrições."
        ],
        "criteria": [
          {
            "id": "modelo-c1",
            "label": "Chaves estrangeiras impedem referência inexistente."
          },
          {
            "id": "modelo-c2",
            "label": "Quantidade zero/negativa é rejeitada."
          },
          {
            "id": "modelo-c3",
            "label": "A política de exclusão é documentada e testada."
          }
        ],
        "tests": [
          "Insira reserva de cliente ausente.",
          "Tente excluir recurso com reserva."
        ],
        "diagnosis": "Um comentário de regra não equivale a constraint; indique o que é realmente imposto.",
        "transfer": "Inclua categoria de recurso sem repetir dados.",
        "lessonIds": []
      },
      {
        "id": "consultas",
        "title": "2. Relatórios com cardinalidade",
        "goal": "Calcule ocupação e clientes com preservação de recursos vazios.",
        "deliverables": [
          "Relatórios e dados que multiplicam JOINs."
        ],
        "criteria": [
          {
            "id": "consultas-c1",
            "label": "Recurso sem reserva aparece com zero."
          },
          {
            "id": "consultas-c2",
            "label": "JOIN não multiplica quantidade por outro relacionamento."
          },
          {
            "id": "consultas-c3",
            "label": "NULL e zero têm significados explicados."
          }
        ],
        "tests": [
          "Inclua dois relacionamentos 1:N.",
          "Compare agregação antes/depois do JOIN."
        ],
        "diagnosis": "Somar depois de duas junções 1:N pode duplicar cada reserva.",
        "transfer": "Inclua relatório mensal com faixa de datas.",
        "lessonIds": []
      },
      {
        "id": "transacao",
        "title": "3. Capacidade como operação",
        "goal": "Reserve de forma atômica, validando a capacidade disponível.",
        "deliverables": [
          "Transação e política de cancelamento."
        ],
        "criteria": [
          {
            "id": "transacao-c1",
            "label": "Uma falha intermediária desfaz toda alteração."
          },
          {
            "id": "transacao-c2",
            "label": "Capacidade nunca é excedida por operação aceita."
          },
          {
            "id": "transacao-c3",
            "label": "A transação verifica o resultado da atualização condicional."
          }
        ],
        "tests": [
          "Force erro entre atualização e inserção.",
          "Reserve exatamente a capacidade restante."
        ],
        "diagnosis": "Um SELECT seguido de INSERT não protege a regra contra concorrência sozinho.",
        "transfer": "Inclua cancelamento que restitui disponibilidade.",
        "lessonIds": []
      },
      {
        "id": "concorrencia",
        "title": "4. Duas sessões, uma última vaga",
        "goal": "Execute ou preveja cronogramas com bloqueio e isolamento.",
        "deliverables": [
          "Roteiro A/B com início, comandos, resultados e commits."
        ],
        "criteria": [
          {
            "id": "concorrencia-c1",
            "label": "O cronograma distingue previsão de execução real."
          },
          {
            "id": "concorrencia-c2",
            "label": "Duas reservas não aceitam a mesma última vaga."
          },
          {
            "id": "concorrencia-c3",
            "label": "Falha 40001 reinicia transação inteira segundo política."
          }
        ],
        "tests": [
          "Inicie duas sessões e altere o mesmo recurso.",
          "Compare Read Committed e Repeatable Read."
        ],
        "diagnosis": "Repetir só a instrução falha pode manter snapshot e decisão antigos.",
        "transfer": "Teste Serializable e explique retry idempotente.",
        "lessonIds": []
      },
      {
        "id": "indices",
        "title": "5. Plano antes e depois",
        "goal": "Meça consultas com dados representativos e índices escolhidos.",
        "deliverables": [
          "Planos EXPLAIN e comparação de cardinalidade/tempo."
        ],
        "criteria": [
          {
            "id": "indices-c1",
            "label": "Índice atende filtro/junção concreta."
          },
          {
            "id": "indices-c2",
            "label": "Há comparação antes/depois com mesmos dados."
          },
          {
            "id": "indices-c3",
            "label": "Custo de escrita e espaço entram na decisão."
          }
        ],
        "tests": [
          "Use 1000 reservas com distribuição desigual.",
          "Compare seletividade pequena/grande."
        ],
        "diagnosis": "Índice existente não garante uso; a decisão depende do plano e dos dados.",
        "transfer": "Revise um índice redundante com evidência.",
        "lessonIds": []
      },
      {
        "id": "migracao",
        "title": "6. Evoluir e restaurar",
        "goal": "Escreva migração e restauração verificadas em banco separado.",
        "deliverables": [
          "Migração versionada, backup e roteiro de restore."
        ],
        "criteria": [
          {
            "id": "migracao-c1",
            "label": "Migração trata dados antigos incompatíveis."
          },
          {
            "id": "migracao-c2",
            "label": "Restore recompõe contagens e relações conferidas."
          },
          {
            "id": "migracao-c3",
            "label": "Falha preserva uma cópia recuperável."
          }
        ],
        "tests": [
          "Restaure em novo banco e compare relatórios.",
          "Execute migração em fixture antiga."
        ],
        "diagnosis": "Um arquivo de dump sem restauração ainda não demonstra recuperação.",
        "transfer": "Inclua coluna nova com backfill explícito.",
        "lessonIds": []
      },
      {
        "id": "entrega",
        "title": "7. Operação documentada",
        "goal": "Entregue esquema, fixtures, cronogramas, planos e decisões.",
        "deliverables": [
          "README de instalação, execução, manutenção e limites."
        ],
        "criteria": [
          {
            "id": "entrega-c1",
            "label": "Outra pessoa reproduz consultas e roteiro de concorrência."
          },
          {
            "id": "entrega-c2",
            "label": "Resultados previstos são separados de logs executados."
          },
          {
            "id": "entrega-c3",
            "label": "Regras externas ao banco estão identificadas."
          }
        ],
        "tests": [
          "Reproduza reserva/cancelamento/relatório/restore.",
          "Teste falha de conexão sem duplicar intenção."
        ],
        "diagnosis": "O banco não conhece automaticamente a identidade de uma tentativa externa; documente idempotência da aplicação.",
        "transfer": "Adapte para reservas por intervalo de tempo.",
        "lessonIds": []
      }
    ],
    "references": [
      "https://www.postgresql.org/docs/current/tutorial.html",
      "https://www.postgresql.org/docs/current/transaction-iso.html"
    ]
  }
];

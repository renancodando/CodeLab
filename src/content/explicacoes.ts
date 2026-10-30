export type CapituloAula={
 id:string;
 titulo:string;
 subtitulo:string;
 paragrafos:string[];
 pontos?:string[];
 codigo?:string;
 destaque?:string;
};

export type BaseAulaProfunda={
 id:string;
 track:string;
 title:string;
 body:string;
 code:string;
 exercise:string;
 solution:string;
 error:string;
 question:string;
 language:string;
 anterior?:string;
 proxima?:string;
};

type Roteiro={
 contexto:string;
 modelo:string;
 passos:string[];
 experimentos:string[];
 projeto:string;
 conexao:string;
};

const roteiros:Record<string,Roteiro>={
  "programar": {
    "contexto": "Programar começa muito antes de escolher uma linguagem: começa quando você transforma uma intenção vaga em instruções observáveis. Nesta aula, o objetivo é perceber por que o computador executa exatamente o que foi escrito, sem completar mentalmente aquilo que ficou implícito.",
    "modelo": "Imagine o programa como uma sequência de mudanças de estado. Cada instrução recebe um estado anterior, faz uma ação permitida pela linguagem e deixa um novo estado para a próxima instrução. Ler código bem é acompanhar essa transformação, e não apenas reconhecer palavras. Uma chamada console.log registra uma saída; repetir a chamada repete a saída. As aspas delimitam o texto, enquanto um nome sem aspas precisa ter sido definido. Registrar Aquecer água não aquece água nem controla um aparelho: o efeito implementado aqui é apresentar texto.",
    "passos": [
      "Defina em uma frase o resultado que deve existir no final.",
      "Liste as ações mínimas necessárias para chegar ao resultado.",
      "Coloque as ações em uma ordem que não dependa de algo que ainda não existe.",
      "Associe cada ação a uma saída observável ou a uma mudança de valor.",
      "Execute, compare com a previsão e altere somente uma coisa por vez."
    ],
    "experimentos": [
      "Troque a ordem dos console.log e descreva por que a saída muda sem que nenhuma linha isolada tenha mudado.",
      "Crie uma variável entre duas instruções e observe como ela passa a fazer parte do estado do programa.",
      "Remova intencionalmente as aspas de um texto para distinguir uma string de um identificador."
    ],
    "projeto": "Escreva um pequeno roteiro executável para uma rotina real, como preparar café, organizar uma mochila ou calcular o material de uma tarefa. Primeiro faça em português; depois converta apenas as ações observáveis para código.",
    "conexao": "A próxima aula usa essa mesma ideia para separar claramente o que entra no programa, o que ele transforma e o que sai."
  },
  "entrada-saida": {
    "contexto": "Quase todo software pode ser entendido como um fluxo de dados: alguma informação entra, regras transformam essa informação e um resultado aparece. Separar essas três etapas evita misturar leitura, cálculo e apresentação no mesmo raciocínio.",
    "modelo": "Pense em uma caixa com três lados visíveis. À esquerda estão as entradas; dentro da caixa estão as regras; à direita estão as saídas. Quando um resultado está errado, essa imagem ajuda a perguntar se o dado entrou errado, se a transformação está errada ou se apenas a apresentação está errada. No mini caixa, quantidade multiplica preço por unidade; frete é custo fixo e entra depois, uma única vez. Quantidade zero zera o subtotal, mas não elimina esse custo no contrato da atividade. Na correção usamos centavos inteiros: 1200 representa 12 reais, sem conversão de moeda ou arredondamento. O molde function calcularTotal(quantidade, precoUnitario, frete) já recebe as entradas; return devolve o resultado do cálculo para a verificação. Por enquanto concentre a alteração nessa transformação; a aula de funções retoma o mecanismo com profundidade.",
    "passos": [
      "Nomeie todas as entradas antes de calcular.",
      "Confirme o tipo e a unidade de cada entrada.",
      "Escreva a transformação sem se preocupar ainda com a interface.",
      "Guarde resultados intermediários quando eles ajudam a explicar o raciocínio.",
      "Mostre a saída e teste valores pequenos que você consegue calcular mentalmente."
    ],
    "experimentos": [
      "Altere somente quantidade e mantenha preço fixo para observar qual parte da saída depende dessa entrada.",
      "Troque um número por texto numérico e compare multiplicação com adição para perceber conversões implícitas.",
      "Teste entrada vazia e decida se zero representa realmente a intenção da pessoa."
    ],
    "projeto": "Monte um mini caixa que recebe quantidade, preço unitário e desconto e produz subtotal, desconto aplicado e total. Cada uma dessas grandezas deve poder ser explicada separadamente.",
    "conexao": "Depois de entender o fluxo de dados, a próxima aula divide transformações maiores em etapas pequenas e verificáveis."
  },
  "passos": {
    "contexto": "Problemas parecem difíceis quando várias decisões são tratadas como uma única coisa. Decompor significa transformar um objetivo grande em resultados menores que podem ser compreendidos, testados e combinados.",
    "modelo": "Visualize o problema como um mapa de dependências. O resultado final depende de resultados intermediários; cada resultado intermediário depende de dados menores. Quando você consegue desenhar essas dependências, a implementação deixa de ser um salto e vira uma sequência. As notas precisam existir antes de calcular a soma, e a soma antes de calcular a média: ler uma const antes de sua inicialização falha durante a execução. Acrescentar uma nota muda tanto a soma quanto a quantidade usada na divisão. Na atividade de correção, mediaTres já recebe três notas; acompanhe soma e return sem trocar a média por uma resposta fixa. Zero participa da média, frações não devem ser arredondadas e cada chamada começa com suas próprias entradas.",
    "passos": [
      "Escreva qual é a pergunta final que o programa precisa responder.",
      "Liste os dados indispensáveis para responder a essa pergunta.",
      "Crie resultados intermediários com nomes que expliquem o domínio.",
      "Resolva e teste cada transformação isoladamente.",
      "Só depois una as etapas e verifique o fluxo completo."
    ],
    "experimentos": [
      "Calcule a média primeiro em uma expressão única e depois em variáveis intermediárias; compare qual versão é mais fácil de inspecionar.",
      "Adicione uma terceira nota e procure todos os lugares em que a quantidade de notas influencia o cálculo.",
      "Extraia uma etapa para uma função e veja como isso muda a leitura do problema."
    ],
    "projeto": "Crie um analisador simples de notas que calcula soma, média, maior nota e situação final. Faça cada resultado surgir de uma etapa explicitamente nomeada.",
    "conexao": "Com o problema dividido, a próxima aula mostra como distinguir quando uma falha está na escrita, na execução ou na própria lógica."
  },
  "tipos-erros": {
    "contexto": "Nem todo erro significa a mesma coisa. Um programa pode nem ser entendido pela linguagem, pode falhar durante a execução ou pode executar perfeitamente e ainda responder algo errado. Misturar essas categorias faz a investigação ficar lenta.",
    "modelo": "Pense em três portas: leitura, execução e significado. O código precisa atravessar a sintaxe para ser entendido; precisa sobreviver às condições de execução; e finalmente precisa produzir um resultado coerente com o problema real. Uma aspa sem fechamento impede analisar o trecho. Ler um nome que nunca foi definido causa ReferenceError quando aquela instrução é alcançada: saídas anteriores podem existir, mas as seguintes não são executadas. Somar base e altura de um retângulo é sintaticamente válido e pode terminar normalmente; a área, porém, depende do produto. Conferir o resultado é uma etapa diferente de procurar uma exceção. Testar uma dimensão zero, frações e dimensões distintas ajuda a distinguir operações que coincidem por acaso em um exemplo.",
    "passos": [
      "Reproduza o problema antes de alterar qualquer linha.",
      "Pergunte se o código sequer consegue ser analisado pela linguagem.",
      "Se executa, identifique a primeira operação que falha em tempo de execução.",
      "Se termina sem exceção, compare saída observada e saída esperada.",
      "Registre a causa, a correção e um teste que impediria o mesmo erro de voltar."
    ],
    "experimentos": [
      "Crie uma aspa sem fechamento e observe a diferença para um nome de variável inexistente.",
      "Troque uma multiplicação por soma em um cálculo de área e perceba por que nenhum erro técnico é lançado.",
      "Corrija cada falha separadamente para treinar a classificação antes da solução."
    ],
    "projeto": "Monte um pequeno 'museu de bugs' com um exemplo de erro sintático, um de execução e um lógico. Ao lado de cada um, escreva como você provou a categoria.",
    "conexao": "A aula seguinte transforma essa classificação em um processo sistemático de depuração."
  },
  "investigar": {
    "contexto": "Depurar não é tentar mudanças até funcionar. É formular hipóteses pequenas, observar evidências e reduzir o espaço do problema até localizar a primeira divergência entre o esperado e o real.",
    "modelo": "Trate cada bug como um experimento científico. Você tem uma hipótese, uma observação, uma alteração controlada e um novo resultado. Quanto menos coisas você muda de uma vez, mais informação cada tentativa produz. Por exemplo, valor || 1 escolhe o primeiro operando quando ele é truthy e escolhe 1 quando valor é zero. Isso não converte zero em texto: substitui uma entrada numérica válida por outro número. Se dobro(4) produz 8, dobro(-3) produz -6 e dobro(0) produz 2, o último caso é um contraexemplo suficiente para investigar essa escolha. Observe entrada e valor intermediário; altere somente a causa e repita também os casos que já funcionavam. Esse teste de regressão impede que uma correção especial para zero quebre negativos ou frações.",
    "passos": [
      "Defina exatamente o comportamento esperado e o observado.",
      "Crie o menor caso que ainda reproduz a falha.",
      "Observe entradas e valores intermediários no ponto mais próximo do problema.",
      "Formule uma hipótese que possa ser refutada por um teste pequeno.",
      "Corrija a causa e repita também casos que já funcionavam."
    ],
    "experimentos": [
      "Adicione logs antes e depois de uma transformação para localizar onde o valor muda.",
      "Crie casos para zero, positivo e negativo e compare quais hipóteses sobrevivem aos três.",
      "Remova temporariamente partes não relacionadas até ficar com o menor código que falha."
    ],
    "projeto": "Mantenha um diário de depuração com cinco colunas: sintoma, hipótese, experimento, evidência e conclusão. Use-o em um bug real de algum projeto seu.",
    "conexao": "Esse método de investigação será usado em todas as trilhas seguintes, começando por valores, tipos e variáveis."
  },
  "valores": {
    "contexto": "Variáveis não são apenas 'caixinhas': são nomes que permitem acompanhar estado ao longo do tempo. O tipo do valor determina quais operações fazem sentido e quais resultados podem surgir.",
    "modelo": "Imagine um quadro de estado. Cada nome aponta para um valor atual; uma instrução pode ler esse valor, produzir outro e eventualmente reatribuir o nome. const protege a associação do nome, enquanto o conteúdo de objetos ainda pode mudar. Uma declaração let sem valor inicial começa com undefined; atribuir zero depois muda o estado, e === compara sem converter esses valores. O operador + soma dois números, mas concatena quando um dos valores primitivos envolvidos é uma string. String(100) produz texto, portanto mudar o nome para let não transforma esse texto em número. Para atualizar um valor numérico, confira tanto a declaração quanto os operandos da operação.",
    "passos": [
      "Identifique o tipo de cada dado antes de escolher a operação.",
      "Use nomes que descrevam o papel, não apenas a forma do valor.",
      "Prefira const quando a referência não precisa ser reatribuída.",
      "Acompanhe explicitamente cada ponto em que um valor muda.",
      "Teste undefined, zero, string vazia e booleanos sem tratá-los como equivalentes."
    ],
    "experimentos": [
      "Compare let e const tentando reatribuir ambos.",
      "Use typeof em números, strings, booleanos, arrays e objetos e discuta os resultados inesperados.",
      "Comece uma variável sem valor e observe como undefined se propaga em operações."
    ],
    "projeto": "Crie um painel textual de energia com valor atual, limite máximo e estado 'pronto'. Faça cada mudança de energia ser explícita e validada.",
    "conexao": "Com valores bem definidos, a próxima aula mostra como comparações transformam estado em caminhos diferentes."
  },
  "decisoes": {
    "contexto": "Uma decisão em código é uma pergunta cujo resultado precisa ser reduzido a verdadeiro ou falso. Bugs aparecem quando fronteiras ficam ambíguas ou quando duas condições são combinadas sem uma regra clara.",
    "modelo": "Pense em uma árvore de caminhos. Cada condição abre ramos; cada ramo possui um conjunto de entradas que deve chegar até ele. Projetar as fronteiras antes de escrever o if reduz sobreposição e buracos. >= inclui o valor limite; > deixa esse valor de fora. Com entradas booleanas, && exige as duas condições e || aceita uma delas. Em uma sequência de retornos, a primeira condição satisfeita encerra a chamada: depois de recusar energia < 20, o próximo teste energia < 80 já representa a faixa de 20 até antes de 80. Teste cada limite, um valor logo abaixo e outro logo acima, sem arredondar a entrada.",
    "passos": [
      "Escreva a regra em português antes da expressão booleana.",
      "Defina os valores de fronteira, como exatamente 18 ou exatamente 80.",
      "Monte exemplos que devem cair em cada ramo.",
      "Só então traduza as regras para if, else if ou switch.",
      "Verifique se todas as entradas relevantes chegam a algum caminho."
    ],
    "experimentos": [
      "Troque >= por > e teste exatamente o valor limite.",
      "Monte uma pequena tabela verdade para && e || antes de executar.",
      "Reordene duas condições sobrepostas e veja como a ordem altera o ramo alcançado."
    ],
    "projeto": "Implemente um classificador de acesso que combine idade, ingresso e horário. Escreva primeiro a tabela de casos e depois o código.",
    "conexao": "Quando a mesma decisão precisa ser aplicada várias vezes, entram as estruturas de repetição da próxima aula."
  },
  "repeticoes": {
    "contexto": "Loops automatizam trabalho repetido, mas introduzem uma responsabilidade: o estado precisa se aproximar de uma condição de parada. Um loop correto deixa claro o que muda a cada iteração e quando termina.",
    "modelo": "Veja um loop como uma máquina de estados em ciclos. Existe um estado inicial, uma condição verificada, uma transformação e um próximo estado. Se a transformação não aproxima a condição de falso, o ciclo pode nunca terminar. Em for, a inicialização acontece uma vez; depois vêm condição, corpo, avanço e nova condição. Para somar de 1 até n incluindo n, a última comparação precisa permitir esse termo; com n igual a zero, o intervalo está vazio. Um acumulador declarado dentro da função recomeça em cada chamada. Em while, confira uma variável que realmente muda: testar apenas a entrada inicial pode deixar a condição sempre verdadeira.",
    "passos": [
      "Defina o estado inicial antes do loop.",
      "Escreva a condição de continuação em uma frase.",
      "Identifique qual variável muda a cada passagem.",
      "Confirme limites de índice e casos de coleção vazia.",
      "Simule manualmente as primeiras e a última iteração."
    ],
    "experimentos": [
      "Troque < por <= num loop sobre array e observe o acesso após o último índice.",
      "Execute o mesmo algoritmo com n igual a 0, 1 e 4.",
      "Crie intencionalmente uma condição que nunca muda e use-a para reconhecer um loop infinito."
    ],
    "projeto": "Faça um gerador de relatório que percorre uma lista de gastos, calcula total, maior valor e quantidade acima de um limite.",
    "conexao": "A próxima aula encapsula transformações repetíveis em funções com contratos claros de entrada e saída."
  },
  "funcoes": {
    "contexto": "Funções servem para dar nome a uma transformação e estabelecer uma fronteira. A qualidade de uma função depende menos de ser curta e mais de ter uma responsabilidade compreensível e um contrato previsível.",
    "modelo": "Pense em uma função como uma pequena máquina: argumentos entram, regras internas operam e um resultado sai. Um parâmetro numérico recebe o valor daquela chamada; ter o mesmo nome de uma variável externa não a reatribui. return entrega o resultado ao chamador, enquanto console.log apenas o mostra. Efeitos externos existem, mas quanto mais explícitos forem, mais fácil fica testar.",
    "passos": [
      "Defina a responsabilidade da função em uma frase curta.",
      "Liste entradas necessárias e o tipo esperado de cada uma.",
      "Defina o que será retornado e em quais casos especiais.",
      "Evite depender de estado externo quando não for necessário.",
      "Teste a função isoladamente com entradas normais e limites. Na conversão de minutos, confira zero, frações e duas chamadas somadas; não acumule uma chamada na seguinte."
    ],
    "experimentos": [
      "Troque console.log por return e use o resultado em outro cálculo. Mantenha a expressão na mesma linha de return ou abra o parêntese nessa linha: uma quebra logo após a palavra pode encerrar a instrução sem valor.",
      "Crie duas chamadas com argumentos diferentes para provar que a função não depende de um valor fixo.",
      "Introduza uma variável externa e compare a dificuldade de testar antes e depois."
    ],
    "projeto": "Crie uma biblioteca pequena de conversões — minutos para segundos, Celsius para Fahrenheit e percentual de desconto — com testes de casos limites.",
    "conexao": "Funções ficam ainda mais úteis quando trabalham sobre coleções estruturadas, tema da próxima aula."
  },
  "colecoes": {
    "contexto": "Coleções aparecem quando um programa deixa de trabalhar com um único valor e precisa lidar com muitos itens relacionados. Arrays representam ordem; objetos representam propriedades nomeadas; combiná-los permite modelar dados reais.",
    "modelo": "Imagine um inventário físico: a prateleira é o array e cada ficha de produto é um objeto. Algoritmos percorrem a prateleira e leem ou transformam propriedades das fichas. length conta fichas; somar item.quantidade conta unidades. Duas fichas com a mesma quantidade continuam contribuindo separadamente. O último índice de uma lista não vazia é length - 1; a condição indice < length também evita entrar em uma lista vazia. Uma acumulação começa em zero e incorpora cada contribuição, enquanto total = item.quantidade substitui a soma pela última ficha. Produzir um resumo não exige alterar, consumir ou ordenar a entrada. Confira o estoque antes e depois, além de repetir a função com listas diferentes.",
    "passos": [
      "Decida se a ordem dos itens importa.",
      "Defina quais propriedades pertencem a cada item.",
      "Escolha um identificador estável quando itens precisam ser atualizados.",
      "Percorra a coleção sem assumir que sempre haverá elementos.",
      "Separe busca, transformação e acumulação para tornar o algoritmo legível."
    ],
    "experimentos": [
      "Teste o total de estoque com lista vazia, um item e itens repetidos.",
      "Procure um produto por nome e depois por id; compare as limitações.",
      "Altere uma propriedade de um objeto e observe que o array continua contendo a mesma referência."
    ],
    "projeto": "Modele um estoque com id, nome, quantidade e preço. Implemente total de unidades, valor total e busca por id.",
    "conexao": "Na trilha de JavaScript, essas coleções passam a ser transformadas com métodos e callbacks mais expressivos."
  },
  "strings-numbers": {
    "contexto": "Interfaces recebem muitos dados como texto, mesmo quando parecem números. A fronteira entre string e number é uma fonte clássica de bugs porque algumas operações convertem implicitamente e outras não.",
    "modelo": "Pense na entrada como texto ainda não validado. O sinal + pode concatenar quando recebe uma string: '2' + 3 produz texto; Number('2') + 3 calcula com números. Number('') e Number('   ') produzem zero, mas ausência e o texto '0' continuam sendo entradas diferentes para a regra do formulário. Number('abc') produz NaN, que não passa por Number.isFinite. Primeiro decida o que fazer com ausência, depois converta e confira finitude. Métodos de string devolvem outro texto: nome.trim() não reatribui nome. Guarde o retorno quando precisar da versão normalizada; trim conserva o espaço interno de Ana Maria. Number exige uma conversão completa: '3px' é inválido, enquanto parseFloat lê o prefixo 3. Notação científica, como '1e2', e hexadecimal, como '0x10', são aceitas por Number; uma vírgula decimal pede outro contrato, não uma troca silenciosa de caracteres. No exercício dobroTexto, uma rejeição lança Error e interrompe a chamada; o retorno válido é um número utilizável. Não confunda devolver uma mensagem com sinalizar essa rejeição.",
    "passos": [
      "Preserve o texto original enquanto valida.",
      "Remova apenas espaços que não carregam significado.",
      "Decida a política de ausência antes da conversão: rejeitar vazio não impede aceitar o texto '0'.",
      "Converta com Number e confirme Number.isFinite.",
      "Somente depois faça operações matemáticas."
    ],
    "experimentos": [
      "Compare '2' + 3 com Number('2') + 3.",
      "Teste Number(''), Number('   ') e Number('abc') e discuta por que validação precisa vir antes ou depois da conversão conforme a regra.",
      "Normalize textos com trim e toLowerCase antes de comparações."
    ],
    "projeto": "Crie um leitor de preço digitado que rejeita vazio, texto inválido, negativo e valores acima de um limite definido.",
    "conexao": "Depois de dominar conversões individuais, a próxima aula trata transformações sobre arrays inteiros."
  },
  "array-metodos": {
    "contexto": "map, filter e reduce expressam intenções diferentes sobre coleções. Usá-los bem depende de saber se você quer transformar cada item, selecionar alguns ou condensar muitos valores em um resultado.",
    "modelo": "Imagine uma linha de produção: filter decide quem entra, map transforma cada item aprovado e reduce combina o fluxo em uma medida final. Com [1,2,3,4], selecionar pares produz [2,4]; dobrar essa seleção produz outra lista, [4,8]; somar a seleção original ainda produz 6. map não substitui a variável que guardava a entrada. A callback n => { n % 2 === 0; } calcula uma comparação e termina devolvendo undefined: com chaves, escreva return para fornecer a decisão ao filter. A lista filtrada pode ficar vazia mesmo quando a entrada não estava vazia. reduce sem valor inicial lança TypeError nesse caso; para soma, zero é o ponto inicial que também descreve nenhum item. Pares negativos continuam pares, repetições continuam contribuindo e a posição do item não decide seu valor. Não escolha o método pelo tamanho do código; escolha pela operação conceitual. Um loop correto também pode expressar o mesmo contrato.",
    "passos": [
      "Defina a forma da coleção antes e depois da operação.",
      "Use filter quando a quantidade de itens pode diminuir.",
      "Use map quando cada entrada produz exatamente uma saída correspondente.",
      "Use reduce quando muitos valores precisam virar um acumulado.",
      "Verifique comportamento com array vazio e se algum método altera o original."
    ],
    "experimentos": [
      "Resolva o mesmo problema com loop e depois com filter + reduce; compare legibilidade.",
      "Use sort diretamente e depois sobre [...lista] para observar mutação.",
      "Escreva uma callback com chaves sem return e investigue o array resultante."
    ],
    "projeto": "Construa um resumo de compras que filtra itens disponíveis, aplica desconto e calcula o total final sem alterar a lista original.",
    "conexao": "A próxima aula organiza dados e comportamento entre objetos e módulos, ampliando a escala do código."
  },
  "objetos-modulos": {
    "contexto": "Objetos agrupam dados relacionados; módulos agrupam responsabilidades relacionadas. Os dois recursos combatem o mesmo problema em escalas diferentes: código que perde estrutura à medida que cresce.",
    "modelo": "Pense no objeto como uma ficha com campos nomeados e no módulo como uma gaveta com recursos públicos e detalhes internos. export define o que outras partes podem usar; import declara uma dependência. {...pessoa} cria outra ficha externa, mas copia o valor de cada propriedade: se endereco aponta para um objeto, ambas as fichas ainda apontam para ele. Para mudar somente a cidade sem atingir o cadastro anterior, reconstrua também endereco e conserve seus outros campos. Não é obrigatório copiar profundamente propriedades que esse contrato não altera. Teste a independência alterando o resultado depois de recebê-lo; conferir apenas o nome inicial pode esconder o compartilhamento. Em const {pontos = 5} = dado, o padrão vale para undefined, não para null. Quando a regra aceita zero e trata null e undefined como ausência, pontos ?? 5 expressa essa distinção; pontos || 5 substituiria também zero. Contrato e regra de negócio decidem quais valores são permitidos.",
    "passos": [
      "Defina as propriedades que realmente pertencem ao mesmo conceito.",
      "Use destructuring quando nomes importantes precisam ficar explícitos.",
      "Entenda que spread copia apenas o primeiro nível.",
      "Separe funções por responsabilidade antes de separá-las por arquivo.",
      "Exporte uma API pequena e mantenha detalhes internos fora do contrato."
    ],
    "experimentos": [
      "Copie um objeto com spread e altere uma propriedade simples.",
      "Repita com um objeto aninhado para observar referência compartilhada.",
      "Crie dois módulos mínimos, um exportando soma e outro importando, e execute por HTTP."
    ],
    "projeto": "Separe um pequeno app de tarefas em módulo de dados, módulo de regras e módulo de interface, mesmo que cada arquivo comece pequeno.",
    "conexao": "Quando módulos trocam dados externos, JSON e tratamento de exceções tornam-se essenciais."
  },
  "erros-json": {
    "contexto": "JSON é apenas uma representação textual de dados. Um texto pode ser JSON válido e ainda violar completamente o contrato que sua aplicação espera. Parsear e validar são etapas diferentes.",
    "modelo": "Imagine duas barreiras: a primeira pergunta 'isto é JSON sintaticamente válido?'; a segunda pergunta 'este dado possui a estrutura e os tipos necessários para o meu domínio?'. JSON.parse('null') passa pela primeira e produz null; typeof null é object, mas acessar null.nome falha. Arrays e primitivos também são valores JSON válidos. Para o contrato de lerNome, confira um objeto não nulo, exclua arrays e exija nome do tipo string antes de devolvê-lo. Uma string vazia continua sendo string: rejeitá-la seria uma regra adicional que precisa estar no contrato. Não transforme 3 em '3' nem apare espaços sem autorização do consumidor. JSON inválido lança SyntaxError; uma validação pode lançar outro Error. A exceção abandona o restante do try, o catch pode tratá-la e o código posterior continua. Capturar e devolver null muda o contrato de falha e pode esconder a causa. Preserve o dado como texto ao exibi-lo; um nome com marcação não autoriza executar HTML.",
    "passos": [
      "Receba o texto sem assumir que ele é confiável.",
      "Faça JSON.parse dentro de um ponto onde a falha possa ser tratada.",
      "Valide null, arrays e tipos de propriedades esperadas.",
      "Transforme dados válidos para uma representação interna previsível.",
      "Mostre erro útil sem expor conteúdo sensível ou inserir HTML não confiável."
    ],
    "experimentos": [
      "Tente parsear JSON com vírgula final e compare com um objeto válido sem o campo necessário.",
      "Passe null, array e objeto para a mesma função de validação.",
      "Serialize um objeto com JSON.stringify e compare o que acontece com funções e undefined."
    ],
    "projeto": "Crie um importador de configurações que valida versão, tema e tamanho de fonte e mantém a configuração antiga quando a importação falha.",
    "conexao": "A próxima aula adiciona tempo e rede ao problema: Promises e fetch fazem resultados chegarem no futuro."
  },
  "async": {
    "contexto": "Código assíncrono separa o momento em que uma operação começa do momento em que seu resultado fica disponível. Bugs surgem quando a interface continua como se o dado já existisse ou quando resultados antigos chegam depois de uma ação mais recente.",
    "modelo": "Pense em cada Promise como um comprovante de uma operação em andamento. Uma função async começa executando seu corpo na chamada e sempre devolve uma Promise. await suspende a continuação daquela função, mesmo quando recebe uma Promise já resolvida; o código que chamou a função continua e a retomada ocorre em uma microtarefa. Isso não torna trabalho pesado de CPU automaticamente paralelo. Primeiro aguarde a resposta de fetch; depois confira ok (status de 200 a 299); só então leia o corpo com json, que também devolve uma Promise. Um 404 com JSON válido pode resolver fetch e json sem rejeição: a regra HTTP é responsabilidade do consumidor. Para devolver o corpo ao chamador, return resposta.json() e return await resposta.json() propagam seu resultado. Sem return, a função pode resolver com undefined. Falha de rede, falha de status e falha de interpretação são situações diferentes. Não transforme todas em lista vazia: vazio pode ser um sucesso legítimo. Se não há tratamento apropriado, deixe o erro original se propagar, inclusive cancelamento. Nas pausas desta aula, obter e json são funções de teste locais com Promises reais, sem rede; isso exercita o fluxo de espera e propagação, sem comprovar HTTP, CORS ou um AbortController real. Os cenários incluem corpos null, zero e vazios, status de erro com corpo válido, falha do corpo e duas chamadas concluídas em ordem inversa. Cada chamada devolve seu próprio resultado; decidir qual pode atualizar a tela pertence à aplicação que iniciou as buscas.",
    "passos": [
      "Modele estados inicial, carregando, sucesso, vazio, erro e cancelado.",
      "Inicie a operação e marque explicitamente o estado de carregamento.",
      "Use await no ponto em que o resultado realmente é necessário.",
      "Valide response.ok antes de interpretar o corpo.",
      "Cancele trabalho obsoleto e limpe indicadores em finally quando apropriado."
    ],
    "experimentos": [
      "Remova await e observe o que passa a ser uma Promise em vez do dado final.",
      "Simule 404 para provar que fetch não rejeita apenas por status HTTP.",
      "Dispare duas buscas rápidas e use AbortController para impedir que a primeira sobrescreva a segunda."
    ],
    "projeto": "Construa uma busca com campo de texto, estado de carregamento, cancelamento da consulta anterior e mensagens distintas para vazio, erro e sucesso.",
    "conexao": "Essa combinação de dados e interface prepara a trilha de HTML, onde a estrutura do documento dá significado ao que será manipulado."
  },
  "documento": {
    "contexto": "Um documento HTML não é apenas uma coleção de tags. Ele fornece idioma, metadados, hierarquia e uma árvore que navegadores, mecanismos de busca e tecnologias assistivas interpretam antes de qualquer CSS.",
    "modelo": "Pense no HTML como a planta sem acabamento de uma construção. head descreve o documento; body contém a experiência visível; títulos criam hierarquia; elementos semânticos definem regiões e relações. title fornece o texto da aba e pode ser diferente do h1 apresentado no conteúdo. lang na raiz declara o idioma principal; pt-BR identifica português brasileiro, enquanto charset UTF-8 informa a codificação e não o idioma. Na estrutura escrita nesta aula, o doctype vem primeiro, html envolve head e body, e os metadados antecedem o conteúdo. O navegador pode recuperar marcação inadequada e ainda mostrar algo; aparecer na tela não prova que a organização pretendida foi expressa corretamente.",
    "passos": [
      "Declare o doctype e o idioma corretamente.",
      "Configure charset e viewport antes do conteúdo.",
      "Escreva title e description que descrevam aquela página específica.",
      "Estruture body começando pelo conteúdo principal, não pela aparência.",
      "Revise a hierarquia de títulos como um sumário."
    ],
    "experimentos": [
      "Remova a meta viewport e compare em uma tela estreita.",
      "Troque lang e observe como isso afeta ferramentas de leitura e correção.",
      "Liste os headings da página e verifique se a ordem ainda explica o conteúdo sem CSS."
    ],
    "projeto": "Crie a estrutura documental de uma página de portfólio com metadados, navegação, conteúdo principal e rodapé antes de escrever qualquer estilo.",
    "conexao": "Com a base do documento pronta, a próxima aula aprofunda a semântica das regiões e controles."
  },
  "semantica": {
    "contexto": "Semântica descreve o papel de um conteúdo, não sua aparência. Um button e um link podem parecer iguais, mas carregam comportamentos, expectativas de teclado e significado completamente diferentes.",
    "modelo": "Imagine que o CSS foi desligado. A página ainda deve contar uma história coerente pela ordem e pelos elementos escolhidos. Se o significado depende apenas de cor ou posição, a estrutura está frágil. Um catálogo pode ter uma região principal visível e vários artigos dentro dela; cada artigo não precisa virar outro main. O h1 identifica o catálogo e h2 pode identificar cada artigo, conforme a hierarquia desse documento. Para a ação Salvar, button oferece ativação nativa por Enter e Espaço; div com role=button e tabindex apenas descreve o papel e permite foco, sem instalar essa ativação. Um link navega para um destino. O botão ainda precisa da lógica de salvar, e type=button evita que uma ação auxiliar envie um formulário por padrão.",
    "passos": [
      "Identifique a região principal e mantenha um único main.",
      "Use nav para grupos reais de navegação, não para qualquer conjunto de links.",
      "Escolha button para ações e a para navegação.",
      "Dê textos de link que façam sentido fora do contexto visual.",
      "Teste a ordem do documento apenas com teclado."
    ],
    "experimentos": [
      "Troque um button por div com click e compare teclado e foco.",
      "Leia apenas os textos dos links e veja se ainda é possível prever o destino.",
      "Adicione um link 'pular para o conteúdo' e teste como primeira interação de teclado."
    ],
    "projeto": "Estruture semanticamente a página de um artigo com cabeçalho, navegação, artigo, seções relacionadas e rodapé, sem usar div quando existe elemento adequado.",
    "conexao": "A próxima aula aplica a mesma preocupação semântica aos formulários, onde nomes, rótulos e validação são críticos."
  },
  "formularios": {
    "contexto": "Formulários conectam intenção humana a dados que o programa recebe. Um campo visualmente óbvio pode ser ambíguo para teclado, leitor de tela ou servidor se label, name, tipo e regras não estiverem definidos.",
    "modelo": "Pense em cada controle como parte de um contrato: label explica a pergunta, value contém a resposta, name define a chave enviada e as restrições descrevem o formato aceitável. O servidor ainda precisa validar novamente. Na associação explícita, for do label corresponde ao id do campo, não ao name. Clicar nesse rótulo deve focar o controle associado; acrescentar placeholder não corrige um for apontando para outro identificador. Em um campo habilitado com type=email e required, checkValidity devolve false para vazio, true para ana@example.com e false para texto sem formato de e-mail. Isso não verifica a existência do endereço. Um formulário precisa conter os controles e o botão de envio; id permite identificar o campo, enquanto name fornece a chave dos dados, inclusive ao construir FormData sem enviar nenhuma requisição.",
    "passos": [
      "Associe cada controle a um label persistente.",
      "Escolha type conforme o dado e o teclado esperado.",
      "Defina name para dados que serão enviados.",
      "Use required, min, max e maxlength como ajuda de entrada, não como segurança.",
      "Apresente erros próximos ao campo e preserve dados válidos já digitados."
    ],
    "experimentos": [
      "Clique no label e confirme que o foco vai ao campo correspondente.",
      "Teste email inválido, campo vazio e limites numéricos.",
      "Envie a mesma requisição fora do formulário para perceber por que o servidor não pode confiar na validação do navegador."
    ],
    "projeto": "Crie um formulário de cadastro de tarefa com título, prioridade, data e descrição, incluindo mensagens de erro acessíveis e preservação dos valores após uma falha.",
    "conexao": "A aula seguinte trata conteúdo visual e tabular, onde descrição, dimensões e relações de dados precisam ficar explícitas."
  },
  "imagens-tabelas": {
    "contexto": "Imagens e tabelas têm funções específicas: imagens carregam informação visual e tabelas expressam relações entre linhas e colunas. Usá-las apenas para decorar ou montar layout cria problemas de acessibilidade e responsividade.",
    "modelo": "Pergunte o que se perde se a imagem não carregar e qual pergunta uma tabela responde. A alternativa depende do contexto: alt vazio é adequado para decoração ou para uma imagem redundante com o texto do mesmo link. Quando a imagem é o único conteúdo de um link, sua alternativa deve comunicar o destino ou a ação; repetir o nome do arquivo não ajuda a escolher a navegação. loading controla carregamento, não fornece um nome. width e height reservam proporções, mas ainda é preciso evitar distorção ao dimensionar por CSS. Numa tabela simples com cabeçalhos de linha e coluna, caption nomeia o conjunto, th identifica um cabeçalho e scope aponta sua direção: col para os dados da coluna, row para os da linha. Para entender uma quantidade, combine esses dois cabeçalhos; zero é uma quantidade informada, não uma célula ausente. thead agrupa o cabeçalho e tbody agrupa as linhas de dados. Na reconstrução proposta, table e caption vêm primeiro, seguidos por thead, tbody e seus fechamentos. Uma tabela que parece correta após a recuperação do navegador ainda pode ter estrutura inadequada no código. As pausas conferem relações e fragmentos fixos, não HTML livre nem a fala de um leitor de tela. O projeto deve aplicar essas decisões a outros dados e verificar a navegação, as alternativas e a rolagem em tela estreita.",
    "passos": [
      "Decida se a imagem é informativa ou decorativa.",
      "Escreva alt sobre a função da imagem naquele contexto, não sobre cada detalhe visual.",
      "Reserve dimensões para evitar deslocamento de layout.",
      "Em tabelas, forneça caption e cabeçalhos com scope quando necessário.",
      "Em telas estreitas, contenha a rolagem na região da tabela."
    ],
    "experimentos": [
      "Use alt vazio numa imagem decorativa e um alt informativo em outra.",
      "Remova width e height e observe potencial de mudança de layout durante carregamento.",
      "Navegue por uma tabela com estrutura correta e compare com dados montados usando divs."
    ],
    "projeto": "Monte uma tabela de comparação de três projetos com tecnologia, objetivo e estado, acompanhada por uma imagem realmente informativa para um deles.",
    "conexao": "A próxima aula reúne estrutura, teclado, foco, contraste e nomes acessíveis numa revisão prática de acessibilidade."
  },
  "html-acessivel": {
    "contexto": "Acessibilidade não é uma camada aplicada depois. Ela emerge de decisões básicas: HTML semântico, ordem lógica, nomes de controles, foco visível, mensagens anunciáveis e conteúdo compreensível.",
    "modelo": "Pense em múltiplas formas de perceber e operar a mesma interface. Uma pessoa pode usar mouse, teclado, voz, leitor de tela ou ampliação. Na navegação sequencial usual, links com href e botões habilitados participam de Tab; um botão disabled não participa da interação normal. tabindex negativo permite foco programático, mas não coloca um elemento na sequência; tabindex zero pode incluí-lo na ordem do documento. Evite valores positivos que reorganizam essa ordem. Ser focalizável não implementa sozinho uma ação: prefira o controle nativo e teste Enter/Espaço. O nome acessível também precisa corresponder ao que a pessoa percebe: aria-label pode substituir o texto de um botão, e dizer Salvar num controle visível Excluir cria um desacordo que cor ou role não corrigem. Quando o texto visível já nomeia a ação, use esse texto em vez de sobrescrevê-lo sem necessidade. Para uma mensagem rotineira de resultado, prepare uma região aria-live polite antes das alterações e atualize seu texto quando a ação terminar, mantendo o foco no controle. A região não substitui mensagens visíveis nem garante uma sequência de fala idêntica em todos os leitores de tela. No exemplo reconstruído, os elementos existem antes de querySelector, os nomes antes do listener e a atualização acontece por textContent. Testes de DOM, nomes e teclado conferem essas propriedades; a experiência anunciada também exige revisão manual com tecnologia assistiva. O objetivo é preservar informação e ação nas diferentes formas de uso.",
    "passos": [
      "Percorra toda a página usando apenas Tab, Shift+Tab, Enter, Espaço e setas quando aplicável.",
      "Confirme que cada controle tem nome acessível e foco visível.",
      "Verifique títulos, landmarks e ordem de leitura.",
      "Não dependa apenas de cor para comunicar estado.",
      "Teste mensagens dinâmicas importantes com regiões live apropriadas."
    ],
    "experimentos": [
      "Desligue o mouse e conclua o principal fluxo da página.",
      "Amplie o zoom e verifique se conteúdo continua disponível sem sobreposição destrutiva.",
      "Remova temporariamente ícones e cores e veja se textos ainda comunicam ações e estados."
    ],
    "projeto": "Faça uma auditoria manual de uma página sua e registre pelo menos dez verificações de teclado, estrutura, nomes, foco e mensagens.",
    "conexao": "Com a estrutura correta, a trilha de CSS passa a controlar aparência e layout sem destruir essa base."
  },
  "cascata": {
    "contexto": "CSS não escolhe estilos pela última linha de forma simples. Origem, importância, camada, especificidade, escopo e ordem formam um processo de decisão. Entender a cascata evita responder a conflitos com !important aleatório.",
    "modelo": "Imagine várias regras concorrendo para fornecer o valor final de cada propriedade. O navegador compara a prioridade de cada candidata e somente depois aplica herança e valores iniciais quando necessário. Nas primeiras pausas, as declarações são normais, da mesma origem e sem camadas: um ID tem maior especificidade que uma classe; a ordem desempata as regras de mesma prioridade que correspondem ao elemento. Essa simplificação não substitui origem, importância e camadas nos outros casos. Custom properties sem registro por @property aceitam sequências como red; isso não garante que sejam válidas numa propriedade que espera comprimento. var usa seu fallback quando a variável está ausente ou tem um valor garantidamente inválido, não quando qualquer substituição torna padding inválido. Nesse último caso, a declaração já venceu a cascata e não recupera simplesmente o padding anterior. Confira o token no componente e o valor computado no DevTools. O projeto aplica essas decisões a tokens de espaço, fonte e superfície em outros componentes.",
    "passos": [
      "Descubra qual regra está realmente vencendo no DevTools.",
      "Compare especificidade somente entre regras que já estão no mesmo nível relevante da cascata.",
      "Prefira seletores simples ligados à estrutura real.",
      "Use custom properties para valores que representam decisões de design reutilizadas.",
      "Evite aumentar especificidade como resposta automática a um conflito."
    ],
    "experimentos": [
      "Crie duas regras para o mesmo elemento com especificidades diferentes e inverta a ordem.",
      "Defina uma custom property no :root e sobrescreva dentro de um componente.",
      "Remova !important de um exemplo e corrija a arquitetura da regra em vez de aumentar a força."
    ],
    "projeto": "Crie um pequeno sistema de tokens para espaço, tipografia, superfície e borda e use-o em uma página sem repetir valores centrais.",
    "conexao": "Depois de saber qual regra vence, a próxima aula mostra como o navegador calcula o tamanho físico de cada caixa."
  },
  "box-model": {
    "contexto": "Todo elemento ocupa uma caixa calculada a partir de conteúdo, padding, border e margin. Muitos problemas de largura surgem porque o tamanho declarado não corresponde ao tamanho total percebido.",
    "modelo": "Pense na caixa em camadas concêntricas. box-sizing define se width mede apenas conteúdo ou já inclui padding e borda. Unidades relativas conectam essa caixa ao contexto em vez de fixá-la cegamente. Numa largura, rem usa a fonte da raiz e em usa a fonte do próprio elemento; em numa declaração de font-size tem outra referência, a fonte herdada. Sempre identifique qual propriedade está sendo calculada. line-height sem unidade herda um fator, recalculado pela fonte de cada descendente. Um comprimento em em ou um percentual declarado no pai é calculado ali e herdado como comprimento, podendo ficar curto num título com fonte maior. Escolher um fator não encerra a revisão visual: confira quebra de linhas, zoom e fontes reais. box-sizing não é herdado automaticamente. Uma regra universal com inherit, incluindo ::before e ::after, permite que o padrão border-box da raiz e exceções locais se propaguem. A borda inclui padding e border; margin fica fora dessa medida. As pausas diferenciam referências, entrelinha e herança, enquanto o projeto ainda exige construir e testar o cartão editorial com conteúdo imprevisível.",
    "passos": [
      "Inspecione content box, padding, border e margin separadamente.",
      "Use box-sizing:border-box como base quando width precisa representar o tamanho externo previsível.",
      "Escolha rem para escala tipográfica global e unidades relativas quando o contexto importa.",
      "Use min/max/clamp para expressar limites em vez de valores mágicos.",
      "Teste texto maior e conteúdo inesperadamente longo."
    ],
    "experimentos": [
      "Compare duas caixas de width 300px com content-box e border-box.",
      "Troque px por rem na tipografia e altere o tamanho raiz.",
      "Use clamp em um título e redimensione gradualmente para observar crescimento contínuo."
    ],
    "projeto": "Construa um cartão editorial cujo espaçamento e tipografia se adaptem entre uma coluna estreita e uma larga sem media query para cada aparelho.",
    "conexao": "A próxima aula organiza várias caixas em eixos, usando Flexbox e posicionamento."
  },
  "flex-position": {
    "contexto": "Flexbox resolve distribuição em um eixo principal e um eixo transversal. Posicionamento altera a relação de um elemento com o fluxo. Misturar os dois sem entender o fluxo costuma gerar sobreposições e hacks.",
    "modelo": "Primeiro pense no fluxo normal. Flex cria regras de distribuição entre irmãos. Identifique flex-direction e o modo de escrita antes de chamar um alinhamento de horizontal ou vertical: justify-content atua no eixo principal e align-items no transversal. Numa coluna com escrita horizontal, centralizar o conjunto distribui o espaço livre na vertical; flex-end no outro eixo pode levar os itens à direita. Calcule primeiro o espaço ocupado pelos itens e pelos gaps. nowrap mantém uma linha; wrap permite linhas normais e wrap-reverse inverte seu empilhamento. Não use quebra de linha para esconder um mínimo que já é maior que o contêiner: teste conteúdo e larguras independentes. position relative conserva o elemento no fluxo e pode fornecer referência para um descendente absoluto. absolute deixa de reservar espaço no fluxo; uma compensação numérica não substitui escolher o ancestral correto. fixed costuma usar a viewport, mas propriedades como transform em ancestrais podem mudar o bloco de referência. Os exemplos delimitam esses casos; o projeto exige combinar distribuição, posicionamento e teste da barra real sem alterar a ordem semântica.",
    "passos": [
      "Escolha qual é o eixo principal do componente.",
      "Defina como espaço livre deve ser distribuído.",
      "Permita que itens encolham e cresçam conscientemente.",
      "Use gap para relações entre irmãos em vez de margens compensatórias.",
      "Antes de position:absolute, pergunte o que ocupará o espaço deixado."
    ],
    "experimentos": [
      "Troque flex-direction e observe como justify-content muda de eixo.",
      "Dê min-width:0 a um item com texto longo e compare overflow.",
      "Remova absolute de um badge e veja como o fluxo volta a reservar espaço."
    ],
    "projeto": "Implemente uma barra de ferramentas que acomoda título, ações e estado, reorganizando-se naturalmente quando o espaço diminui.",
    "conexao": "Quando o layout precisa controlar linhas e colunas ao mesmo tempo, Grid e consultas de contêiner entram na próxima aula."
  },
  "grid-responsivo": {
    "contexto": "Responsividade forte não é memorizar larguras de celulares. É definir restrições que permitem ao layout descobrir quando precisa mudar. Grid, minmax, auto-fit, clamp e container queries ajudam a reagir ao espaço realmente disponível.",
    "modelo": "Veja o layout como um sistema elástico com limites. Cada região tem um mínimo aceitável, um máximo útil e uma regra de distribuição. O breakpoint ideal aparece quando essas restrições deixam de caber. repeat com auto-fit calcula quantas trilhas cabem e depois pode colapsar as vazias; auto-fill conserva as trilhas vazias previstas. A quantidade de conteúdo também muda o resultado: duas colunas ocupadas repartem o espaço restante depois do gap, mas um terceiro projeto pode ocupar a trilha que antes estava vazia. Minmax não garante sozinho que todo conteúdo caiba; confira mínimos, texto longo e dimensões internas. Uma consulta de tamanho observa um contêiner elegível entre os ancestrais do elemento estilizado. O cartão não consulta seu próprio tamanho por declarar container-type em si mesmo. Um invólucro pode oferecer a referência local, enquanto o cartão permanece livre para mudar seu layout. Uma media query observa a viewport e não distingue duas instâncias em espaços diferentes da mesma página. Teste essas instâncias juntas, além de mudar conteúdo e larguras; considere suporte e fallback. As pausas conferem decisões e referências fixas. A aplicação independente continua no projeto de área de projetos, com conteúdo preservado e limites reais.",
    "passos": [
      "Defina o menor tamanho em que cada conteúdo continua legível e operável.",
      "Use Grid/Flex para distribuir espaço antes de criar breakpoints.",
      "Expresse limites com min(), max(), minmax() e clamp().",
      "Use container queries quando o componente deve responder ao próprio contêiner.",
      "Redimensione continuamente para descobrir rupturas naturais entre pontos tradicionais."
    ],
    "experimentos": [
      "Crie grid com repeat(auto-fit,minmax(...)) e observe quantas colunas surgem sem breakpoint.",
      "Coloque o mesmo componente em dois contêineres diferentes e use container query.",
      "Teste 583px ou outra largura intermediária, não apenas 320/768/1440."
    ],
    "projeto": "Crie uma área de projetos que funcione de 280px a ultrawide preservando conteúdo, ordem e identidade sem esconder itens como primeira solução.",
    "conexao": "A última aula de CSS adiciona movimento respeitando desempenho, intenção e preferência de movimento reduzido."
  },
  "animacoes": {
    "contexto": "Animação deve explicar mudança, continuidade ou resposta — não competir com o conteúdo. Movimentos pequenos e consistentes podem aumentar sensação de qualidade justamente porque não chamam atenção para si.",
    "modelo": "Pense em animação como diferença de estado ao longo do tempo. Escolha o que muda, por que muda, quanto muda e por quanto tempo. Uma transição precisa de dois valores computados distintos: adicionar uma classe depois da primeira renderização pode mudar o destino, enquanto a transição interpola o valor apresentado. Com avanço linear, sem atraso nem interrupção, metade da duração percorre metade da diferença; outras curvas não seguem essa proporção. Transform e opacity geralmente custam menos que propriedades que obrigam novo layout, mas isso não garante aceleração ou bom desempenho. Uma transformação muda a apresentação sem reorganizar o espaço de layout dos vizinhos; deslocamentos podem sobrepor conteúdo. Transições e animações por keyframes são mecanismos diferentes: transition:none não cancela animation. Ao mudar prefers-reduced-motion para reduce, animation:none remove os keyframes e permite usar o transform da regra base. animation-play-state:paused conserva o instante atual, inclusive uma escala intermediária. A preferência pode mudar durante o uso; texto, estado final e foco devem continuar compreensíveis sem depender do movimento ou esconder informação.",
    "passos": [
      "Defina a função da animação antes de escolher duração.",
      "Prefira amplitudes pequenas para estados frequentes.",
      "Use transform e opacity quando possível.",
      "Evite iniciar muitas animações independentes sem coordenação.",
      "Respeite prefers-reduced-motion e mantenha a informação mesmo sem movimento; confira separadamente transition e animation e preserve o indicador estático."
    ],
    "experimentos": [
      "Reduza pela metade a distância de uma animação e compare qual versão parece mais natural.",
      "Anime width e depois transform:scaleX, observando impacto de layout no DevTools.",
      "Ative reduced motion antes do carregamento e no meio de uma animação. Compare remover a animação com pausá-la: o selo deve voltar à escala base sem perder o texto nem o foco do botão."
    ],
    "projeto": "Adicione microinterações discretas a uma lista de tarefas: foco, inclusão, conclusão e remoção, com versão reduzida sem perder feedback. A conclusão deve permanecer identificável por texto, não apenas por deslocamento ou cor. Verifique o foco pelo teclado, a preferência ativada antes e durante o uso e a ausência de sobreposição em telas estreitas. Compare a transição normal com o estado estático; não condicione a mudança dos dados ao término da animação.",
    "conexao": "A trilha de DOM usa essa base visual para reagir a eventos e transformar a página em uma interface viva."
  },
  "selecionar": {
    "contexto": "Manipular o DOM começa por identificar exatamente qual elemento representa a informação ou ação desejada. Seletores frágeis acoplam JavaScript ao visual e tornam pequenas mudanças de HTML capazes de quebrar comportamento.",
    "modelo": "Veja o DOM como uma árvore de nós com relações. document.querySelector devolve o primeiro correspondente no documento ou null; painel.querySelector retorna um descendente correspondente daquele painel. Um seletor composto ainda pode mencionar ancestrais externos; :scope fixa a referência local quando isso for necessário. Dois cartões com a mesma classe não são a mesma instância. querySelectorAll devolve uma NodeList estática: inserir outro correspondente depois não aumenta a lista já obtida, mas repetir a busca observa a árvore atual. Estática descreve a composição da lista, não uma cópia congelada dos elementos; uma referência ainda permite observar mudanças no próprio nó. textContent insere texto sem interpretar marcação, mas substitui todos os filhos do nó que o recebe. Por isso, atualizar o texto no painel inteiro pode remover o botão e seu foco; selecione a mensagem dentro do painel. innerHTML interpreta marcação e também reconstrói descendentes. classList.add acrescenta uma classe sem apagar as anteriores; atribuir className substitui a lista completa. Faça as buscas depois de o HTML existir e trate a ausência do painel ou da mensagem antes de modificar o estado.",
    "passos": [
      "Escolha seletores baseados em significado ou papéis estáveis.",
      "Confirme se a busca pode retornar null.",
      "Prefira textContent para texto não confiável.",
      "Faça a menor alteração necessária no nó correto: preserve controles e use classList quando quiser acrescentar um estado visual.",
      "Evite consultar repetidamente a árvore quando a referência já pode ser mantida."
    ],
    "experimentos": [
      "Selecione por id, classe e atributo data-* e compare acoplamento.",
      "Tente selecionar algo inexistente e trate null conscientemente.",
      "Compare textContent e innerHTML com uma entrada contendo tags. Aplique depois textContent ao painel inteiro e observe o botão removido; repita somente na mensagem e confira o mesmo botão e seu foco."
    ],
    "projeto": "Construa um contador com valor, mensagem de estado e classes visuais, mantendo referências claras aos elementos que realmente mudam. Coloque dois contadores na mesma página e atualize cada um sem mudar o outro. Preserve os botões, o foco do teclado e as classes de apresentação; trate a ausência da região consultada. Teste mensagem vazia, zero e um texto que contenha marcação literal.",
    "conexao": "A próxima aula faz essas mudanças acontecerem em resposta a eventos do usuário e do navegador."
  },
  "eventos": {
    "contexto": "Eventos descrevem coisas que aconteceram: clique, digitação, envio, mudança, foco. O código não deve perguntar continuamente se algo aconteceu; ele registra uma reação e recebe o evento quando necessário.",
    "modelo": "Pense em eventos como mensagens que percorrem a árvore do DOM. Captura e bubbling definem o caminho; delegação usa esse percurso para tratar muitos elementos por meio de um ancestral estável. No DOM comum deste exemplo, target identifica o alvo do click; clicar no span de um botão pode produzir um alvo diferente de acionar o próprio botão pelo teclado. Durante cada callback, currentTarget identifica o elemento onde aquele listener foi registrado. preventDefault cancela o comportamento padrão de um evento cancelável, como a navegação de um link, mas não interrompe a propagação. stopPropagation impede continuar o percurso, mas não cancela por si só a ação padrão. Nem todo evento pode ser cancelado ou sobe pelos ancestrais. Para delegar click, confirme que o alvo é um Element, procure a ação com closest e trate a ausência. closest também pode encontrar um ancestral externo ao componente; contains confere a fronteira antes de agir. Testar só target.matches perde conteúdo interno. Um listener no contêiner continua atendendo descendentes criados depois, sem registrar um handler para cada botão. Isso não dispensa remover listeners quando o componente é descartado nem justifica duplicar o registro a cada renderização.",
    "passos": [
      "Escolha o evento que representa a intenção real, como submit em vez de click no botão.",
      "Registre o listener no elemento com responsabilidade pelo comportamento.",
      "Use event.target e closest com validação quando delegar; confirme que a ação encontrada pertence ao contêiner e ignore cliques neutros.",
      "Remova listeners globais quando o componente deixa de existir.",
      "Evite criar um listener novo a cada render sem necessidade."
    ],
    "experimentos": [
      "Escute click no item e no contêiner para observar bubbling.",
      "Adicione itens depois do carregamento e compare listener individual com delegação.",
      "Use preventDefault em um link e confira que a navegação é cancelada, mas o listener ancestral ainda recebe o click. Compare com stopPropagation e teste também a ativação pelo teclado."
    ],
    "projeto": "Crie uma lista dinâmica em que um único listener no contêiner trata concluir, editar e remover itens identificados por data-*. Teste botões com texto interno, itens acrescentados depois e ativação por Enter e Espaço. Cliques sem ação ou em outro componente não devem mudar a lista. Cada ativação deve executar a intenção uma única vez, inclusive após várias renderizações; preserve o teclado e defina a recuperação do foco ao remover o item ativo.",
    "conexao": "A próxima aula organiza eventos de formulário em um estado consistente antes de renderizar."
  },
  "estado-formulario": {
    "contexto": "Quando um formulário cresce, ler diretamente o DOM em cada lugar cria múltiplas fontes de verdade. Um estado explícito concentra os dados atuais e permite validar, transformar e renderizar de forma previsível.",
    "modelo": "Use o fluxo evento → validar → atualizar estado → renderizar. O DOM mostra o estado; ele não precisa ser o único lugar onde a regra de negócio vive. Um campo text com required rejeita a string vazia, mas espaços ainda contam como valor. Normalize com trim e aplique a regra do domínio antes de alterar a lista. requestSubmit percorre a validação nativa antes do evento submit; submit() não é um substituto equivalente. No listener, preventDefault impede a navegação padrão, não desfaz uma mutação já feita. Em uma entrada inválida, preserve os dados e os campos válidos; limpe o campo somente depois de aceitar a nota. A quantidade de notas é derivada de lista.length: manter um contador separado exige sincronizá-lo também ao remover ou restaurar dados. Renderizar novamente o mesmo estado deve mostrar o mesmo resultado, sem acumular contagens. O exemplo inicial usa uma lista local mutável; quando o histórico precisa conservar versões anteriores, uma função de estado pode receber a lista e devolver um novo array ao aceitar a nota. Nesse contrato, não normalize as notas antigas nem remova repetições: só a nova entrada é normalizada. Isso separa a regra JavaScript, executável sem DOM, da leitura e renderização do formulário. Texto que contém marcação continua sendo texto; na interface, use textContent no destino correto. Reconstruir o formulário inteiro pode destruir foco, valores e listeners.",
    "passos": [
      "Defina a estrutura do estado antes dos handlers.",
      "Normalize o valor recebido do formulário.",
      "Valide sem alterar estado quando a entrada é inválida.",
      "Atualize o estado em uma operação previsível.",
      "Renderize a interface a partir do novo estado e preserve foco quando necessário."
    ],
    "experimentos": [
      "Crie uma entrada inválida e confirme que o estado anterior permanece intacto.",
      "Derive um contador a partir da lista em vez de manter duas fontes de verdade. Remova uma nota, restaure outra lista e renderize duas vezes: a quantidade deve continuar seguindo o estado atual.",
      "Recarregue a renderização várias vezes e verifique se handlers não duplicam."
    ],
    "projeto": "Implemente um formulário de despesas com descrição, valor e categoria, exibindo total derivado e erros sem perder os campos válidos. Separe a regra de atualização da manipulação do DOM. Teste entrada só com espaços, remoção, restauração, repetição de renderização e duas instâncias independentes. Preserve o foco e anuncie o resultado; o envio inválido não pode alterar dados nem apagar campos válidos. Se conservar histórico, demonstre que aceitar uma despesa não muda uma versão anterior. Escreva testes da regra e confira o formulário real pelo teclado; acertar as pausas não substitui construir o projeto.",
    "conexao": "A aula seguinte transforma esse fluxo em componentes com montagem, atualização e desmontagem explícitas."
  },
  "componentes": {
    "contexto": "Um componente saudável possui uma fronteira: recebe dados ou dependências, cria recursos que controla e sabe liberá-los quando deixa de existir. Sem ciclo de vida, timers, observers e listeners podem continuar vivos invisivelmente. Cada montagem tem seu próprio estado no escopo da função. Remover o nó não apaga seu listener se ainda guardamos uma referência ao objeto: um click programático pode continuar acionando esse callback.",
    "modelo": "Pense no componente como um pequeno sistema com nascimento, vida e descarte. Tudo que ele cria e que pode continuar executando precisa ter um dono e um caminho de limpeza. Para remover um listener, conserve o mesmo callback, tipo e capture usados no registro; uma nova função de mesmo corpo não é a mesma referência. Remover a raiz não cancela um listener no window, um intervalo ou a observação de tamanho.",
    "passos": [
      "Defina o elemento raiz e os dados recebidos.",
      "Crie listeners, observers e timers apenas durante montagem.",
      "Mantenha referências aos recursos que precisarão ser removidos.",
      "Atualize somente o necessário quando o estado muda.",
      "Na desmontagem, cancele e desconecte tudo que o componente criou. Guarde o identificador para clearInterval e o observer para disconnect. Se a limpeza de um recurso depende de outro ainda existir, libere em ordem inversa à aquisição, deixando a raiz por último."
    ],
    "experimentos": [
      "Monte e desmonte o mesmo componente vinte vezes observando contagem de listeners ou timers.",
      "Crie ResizeObserver e esqueça de disconnect; depois corrija e compare.",
      "Use AbortController para cancelar múltiplos listeners compatíveis; isso não substitui clearInterval ou disconnect. Para callbacks síncronos que não lançam exceções, escreva um descarte único que marque seu estado antes dos callbacks e tolere repetição ou reentrada. Erros de limpeza exigem uma política própria; esta prática não a implementa."
    ],
    "projeto": "Crie um painel reutilizável que observa tamanho, atualiza um relógio e responde a um botão, retornando uma função dispose que elimina todos os recursos. Preserve dois painéis independentes: descartar um não pode parar o outro. Monte e desmonte vinte vezes, descarte duas vezes e teste resize, avanço do relógio e click programático num botão guardado após remover a raiz. O descartado não deve mais produzir efeitos. Documente a ordem das aquisições e limpezas, teste funções repetidas e declare o que ocorre se uma limpeza falhar. Conferir callbacks da pausa não substitui demonstrar timers e observers reais no painel.",
    "conexao": "Depois de controlar o ciclo de vida, a próxima aula persiste parte do estado entre sessões com armazenamento local."
  },
  "armazenamento": {
    "contexto": "localStorage parece simples, mas dados persistidos sobrevivem ao código que os criou. Versões futuras da aplicação precisam ler formatos antigos, rejeitar dados corrompidos e respeitar limites de espaço.",
    "modelo": "Considere armazenamento como uma fronteira externa, mesmo estando no navegador. JSON.stringify cria um texto do estado naquele instante; mudar o objeto depois não atualiza esse texto. JSON.parse cria outro valor em memória, sem vínculo vivo com a chave. Compare estado atual, texto salvo e valor restaurado separadamente. Uma gravação que falha não deve apagar a versão persistida nem substituir o trabalho em memória. Mantenha um aviso e uma pendência, permita exportar e tente salvar de novo quando houver condições. O exemplo introdutório ilustra leitura de notas, mas seu catch genérico não é um fluxo completo de recuperação: na aplicação, separe erro de leitura, validação e escrita; não grave padrões automaticamente sobre dados inválidos ou de versão desconhecida.",
    "passos": [
  "Defina uma chave estável e uma versão numérica do formato. O formato da pausa usa tema claro ou escuro; versão 1 só conhece tema. Versão 2 acrescenta compacto booleano.",
  "Serialize somente os dados necessários. setItem recebe texto; um parse posterior não acompanha alterações feitas depois da gravação.",
  "Trate ausência e JSON inválido antes de acessar propriedades. JSON válido pode ser null, array ou outro primitivo. Valide tipos e valores: false é um booleano válido.",
  "Migre somente versões conhecidas. Na função da pausa, versão 1 vira versão 2 com compacto false, ignorando campos extras antigos. Versão 2 exige compacto booleano. Strings como false não são booleanos; não use coerção para aceitar o formato.",
  "Reconstrua só os três campos conhecidos num objeto novo. A função de leitura/validação da pausa não grava nada: null sinaliza que a interface deve oferecer recuperação, mantendo o original disponível. Limite tamanho antes de importar arquivos; não processe cargas ilimitadas.",
  "Comunique a falha de gravação sem apagar o estado atual nem anunciar sucesso. setItem que lança por falta de espaço não substitui o valor anterior nessa operação. Isso não garante backup contra limpeza do navegador, falha do dispositivo nem atualização concorrente por outra aba."
],
    "experimentos": [
  "Compare o texto salvo antes e depois de mudar uma propriedade em memória. Faça uma nova gravação explícita e repita a leitura.",
  "Experimente JSON inválido, array, versão desconhecida e compacto false. Depois migre a versão 1. O validador devolve null nos formatos recusados sem escrever sobre o original.",
  "Simule a falha de setItem num documento descartável servido por HTTP. Confira separadamente o trabalho em memória, o valor anterior da chave e o aviso de pendência. Depois exporte e recupere a gravação."
],
    "projeto": "Implemente preferências locais versionadas com tema, densidade e filtros, incluindo função de migração e opção de exportar/importar. A função praticada cobre apenas tema e compacto; defina também o contrato dos filtros no projeto. Separe validar/migrar de ler/gravar. Critérios: uma gravação bem-sucedida sobrevive ao reload; JSON inválido ou versão desconhecida não apaga o original; a falha de escrita conserva o trabalho em memória e permite exportá-lo, mantendo o checkpoint anterior. Teste campos ausentes, false, duas leituras independentes e importação rejeitada sem mutação do estado atual. Revise por teclado o aviso e a recuperação. Esta etapa não implementa transação entre abas nem backup remoto.",
    "conexao": "A trilha de APIs leva essa noção de fronteira para comunicação HTTP com sistemas externos."
  },
  "http": {
    "contexto": "HTTP é um protocolo de mensagens. Uma requisição descreve método, destino, headers e eventualmente corpo; a resposta traz status, headers e corpo. Entender essas peças impede tratar toda falha como 'a API não funcionou'.",
    "modelo": "Pense em cada interação como um envelope de ida e outro de volta. Receber uma resposta HTTP não equivale a aceitar seu resultado: Fetch pode resolver normalmente com 404, e ok resume os status de 200 a 299. Falha de rede é outra fronteira. Depois de interpretar o status, confira se existe corpo: 204 não contém representação e tentar decodificá-lo como JSON falha. Nesta aula, o leitor combina null para ausência de corpo com os valores JSON dos demais sucessos. O contrato do endpoint define o que esses dados significam. Uma criação de nota pode ser descrita por status 201, Location do recurso criado, Content-Type application/json e corpo com id/titulo. Nomes dos cabeçalhos HTTP não diferenciam maiúsculas; parâmetros de mídia não mudam o tipo principal. Cabeçalhos precisam de nomes e valores válidos; texto livre Unicode pertence ao corpo JSON. A função de produção prepara esse descritor em JavaScript, sem enviar HTTP nem persistir a nota. O servidor ainda precisa validar, serializar e enviar; um objeto local não é prova de API funcionando.",
    "passos": ["Identifique recurso, método e rota. Na previsão, a consulta a uma nota ausente recebe uma resposta 404 legível, e nenhum erro de rede é lançado.", "Separe transporte, status e corpo. Inspecione status/ok antes de interpretar JSON; o catch de uma Promise não detecta sozinho todos os status HTTP de erro.", "Respeite a ausência de conteúdo. Para o contrato do leitor desta aula, 204 vira null sem chamar json; 200/201 podem trazer JSON que também pode ser false, zero ou null. Outros métodos/status precisam de contratos próprios.", "Para criar uma nota já validada, prepare um descritor novo com status 201, cabecalhos contendo Location /notas/id e Content-Type JSON, e corpo contendo os mesmos id/titulo. Não fixe a nota do primeiro exemplo.", "Preserve os valores da nota e de respostas anteriores. Um objeto de cabeçalhos reutilizado pode trocar o destino de uma resposta já preparada. O projeto continua responsável por persistência, serialização JSON e envio real."],
    "experimentos": ["Compare uma resposta 404 com uma falha de rede controlada. Registre separadamente a resolução de Fetch e o valor de ok.", "Tente decodificar uma Response 204 sem corpo; depois compare com 201 trazendo JSON false e null. Nenhum desses casos autoriza tratar todos os sucessos como apenas 200.", "Prepare respostas para duas notas diferentes e serialize seus corpos num servidor ou documento descartável. Confira Location, Content-Type e representação sem alterar a nota original."],
    "projeto": "Desenhe o contrato HTTP de uma API de tarefas com rotas, métodos, respostas de sucesso e pelo menos quatro falhas relevantes. Implemente e teste um fluxo local de criação/consulta: valide a entrada, persista a nota e devolva 201 com localização que possa ser consultada. Confira nota ausente, corpo inesperado e uma operação 204 sem JSON. O descritor praticado não substitui esse servidor; a referência de Fetch nos testes usa respostas controladas e não comprova DNS/TLS, CORS de outro host ou persistência real.",
    "conexao": "A próxima aula aprofunda a semântica dos métodos usados para consultar e modificar recursos."
  },
  "metodos": {
    "contexto": "GET, POST, PUT, PATCH e DELETE não são nomes decorativos: comunicam semântica de leitura e mudança. Escolher corretamente melhora previsibilidade, cache, repetição segura e documentação.",
    "modelo": "Veja o recurso como um estado no servidor. GET observa; POST normalmente cria ou dispara uma operação; PUT substitui uma representação; PATCH descreve mudanças; DELETE solicita remoção. Idempotência compara o efeito pretendido de repetir uma requisição, não a igualdade de cada resposta: excluir uma nota pode produzir 204 e depois 404, mantendo-a ausente. O método PATCH não garante sozinho idempotência; definir um booleano pode ser repetível, mas uma instrução de incrementar pode acumular efeitos. Seu formato depende do contrato e do tipo de mídia. Na API didática desta aula, PUT exige a representação inteira e PATCH application/json próprio aceita somente campos enviados; isso não é o formato universal de PATCH. Ao aplicar a alteração em memória, diferencie propriedade ausente de false explícito, preserve id/título omitidos e selecione só campos editáveis. Essa seleção não autentica o cliente nem resolve concorrência no servidor.",
    "passos": ["Defina o recurso e o estado anterior. No modelo de exclusão, presente começa true; a primeira operação o torna false e as demais conservam a ausência.", "Decida se a intenção apenas consulta ou muda estado. GET não deve ser usado para provocar uma atualização; prefetch e robôs também podem consultar URLs.", "Escolha substituição ou mudança parcial de acordo com o contrato. Nesta API, PUT exige titulo/concluida; PATCH pode enviar apenas concluida false, preservando o título. Cada API deve documentar seus formatos aceitos.", "Na regra aplicarAlteracao, teste a presença de titulo/concluida com Object.hasOwn ou mecanismo equivalente para objetos JSON. || substitui false pelo valor anterior e esconde uma alteração válida.", "Crie o próximo estado sem modificar tarefa ou alteracao. A tarefa didática tem somente id, titulo e concluida; apenas os dois últimos são editáveis. Campos extras do patch não são aplicados. Validação de tipos/regras, autorização e transação do endpoint continuam responsabilidades separadas."],
    "experimentos": ["Execute o modelo de exclusão duas vezes e compare respostas com estado. Depois confira um servidor descartável com a política 204/404 documentada; isso não torna todas as implementações obrigadas a responder igual.", "Envie a mesma alteração de booleano duas vezes; compare com uma API que recebe uma instrução de incrementar. O nome PATCH não torna ambas idempotentes.", "Tente desmarcar uma tarefa, alterar só o título, aplicar patch vazio e incluir outro id. Confira entradas congeladas, resultado novo e preservação de chamadas anteriores."],
    "projeto": "Especifique e implemente em uma API local CRUD de notas com métodos e status coerentes, incluindo validação e recurso inexistente. Documente o formato de PATCH e sua política de campos ausentes/permitidos; não confunda um DTO parcial com todos os formatos de patch. Teste repetição de DELETE, PUT incompleto, mudança para false e preservação do título omitido. A regra praticada muda um objeto em memória; no servidor, complemente validação, autorização e controle de concorrência. Registre requisição, resposta e estado do banco como evidências diferentes.",
    "conexao": "A próxima aula mostra como o navegador chama esses contratos com fetch e como cancela requisições obsoletas."
  },
  "fetch-estados": {
    "contexto": "fetch resolve transporte, não toda a experiência. Uma interface precisa representar tempo de espera, falha de rede, erro HTTP, corpo inválido, ausência de resultados e cancelamento sem confundir esses estados.",
    "modelo": "Separe a máquina de estados da interface da Promise de rede. A Promise termina uma operação; o estado informa o que a pessoa deve ver e fazer em cada momento. Cancelar tenta economizar trabalho; o identificador da intenção protege a tela. Uma operação antiga pode entrar em catch/finally quando outra já começou. A mesma regra de identidade deve proteger dados, erro e carregamento.",
    "passos": [
      "Crie um AbortController novo para cada intenção e cancele o anterior. Um sinal abortado não pode ser reiniciado. Sem motivo personalizado, abort() usa AbortError; um motivo fornecido pode ser outro valor.",
      "Associe um identificador à busca e marque carregamento, preservando os últimos dados quando isso fizer sentido. Não troque uma lista vazia válida por dados antigos.",
      "Envie Accept como preferência, cheque response.ok e Content-Type, leia o corpo e valide sua forma. O cabeçalho sozinho não garante JSON válido nem o contrato de cidades esperado.",
      "Aplique sucesso e erro somente se o identificador ainda for o atual. Diferencie falha de transporte, status HTTP, corpo inválido, nenhum resultado e cancelamento esperado.",
      "Em finally, libere estados transitórios somente se aquela requisição ainda for a atual. A condição deve funcionar com uma única busca, sobreposição e rejeição.",
      "Separe transporte, validação do resultado e transformação do estado. A função praticada recebe um resultado já validado e não decide se um status HTTP ou corpo é aceitável."
    ],
    "experimentos": [
      "Atrase artificialmente uma resposta e inicie outra mais recente.",
      "Retorne HTML onde JSON era esperado e trate a falha de parsing.",
      "Interrompa a rede e verifique se existe caminho de tentar novamente.",
      "Libere a primeira Promise enquanto a segunda aguarda. Antes de executar, preveja carregando; depois inverta a ordem de conclusão e provoque rejeição da atual.",
      "Use um sinal já abortado e repita abort(). Conte eventos e compare com um controller novo; não generalize AbortError para motivos personalizados.",
      "Produza a função de estado sem consultar a solução. Teste pedido zero, sucesso vazio, erro preservando dados, cancelamento esperado e conclusões de pedidos antigos ou desconhecidos."
    ],
    "projeto": "Crie uma busca de cidades que cancela a consulta anterior, mantém última resposta válida e diferencia 'nenhum resultado' de 'falha ao consultar'. Construa a integração em um projeto servido por HTTP, fora do sandbox sem rede do CodeLab. Separe transporte, validação do corpo e regra de estado; crie um controller por intenção e proteja sucesso, erro e finally com a identidade. Exercite duas buscas sobrepostas em ambas as ordens, rejeição da atual, HTML em vez de JSON, lista vazia e nova tentativa. Renderize textos recebidos com textContent, anuncie o estado sem mover o foco e mantenha uso por teclado. Registre entrada, ordem de conclusão, estado esperado e resultado observado; passar na função isolada não comprova essa integração.",
    "conexao": "Quando chamadas passam a depender de identidade e permissões, entra a distinção entre autenticação e autorização."
  },
  "identidade-api": {
    "contexto": "Autenticação verifica a identidade apresentada; autorização decide uma ação sobre um recurso. Na API de notas privadas, saber quem chegou não permite devolver qualquer nota. O corpo, a URL e a interface pertencem à entrada do solicitante: informar usuarioId não troca a identidade que o servidor verificou.",
    "modelo": "Separe três coisas na mesa: identidade verificada, nota obtida do armazenamento e ação pedida. O dono da nota pode consultar seu conteúdo. Neste recorte, alterar também exige papel editor e nota não arquivada; ler uma nota arquivada continua permitido ao dono. Papéis e vínculos precisam vir de dados confiáveis do servidor, não de uma cópia enviada no corpo. Não existe liberação implícita de admin nesta política didática.",
    "passos": [
        "Defina quais rotas são públicas e quais exigem identidade. Na prática desta aula, identidade já foi verificada ou é null; não estamos implementando senhas, sessões, assinatura de tokens ou um provedor de autenticação.",
        "Valide credenciais no servidor e separe a identidade verificada dos campos do corpo. No programa de previsão, mudar corpo.usuarioId não altera identidade.id, mas o código defeituoso pode usar a origem errada e expor a nota.",
        "Expresse a política como uma tabela de decisões: sem identidade nega; pessoa diferente do dono nega; o dono lê; o dono com editor altera uma nota ativa. Um papel isolado não concede acesso à nota de outra pessoa. Compare o dono sem papel com o editor de outra pessoa antes de escolher entre && e ||.",
        "Aplique a autorização por ação e recurso antes de devolver dados ou persistir mudanças. Na função autorizarNota, cada chamada retorna booleano, sem mudar entradas. Ações desconhecidas são negadas, e identificadores como 01 e 1 continuam diferentes. Essa função pura exercita a regra; executá-la no navegador não protege um servidor real.",
        "Evite segredos em logs, URLs e mensagens de erro. Teste também requisições construídas fora da interface: ocultar um botão pode orientar a pessoa, mas não impede que alguém envie a ação diretamente. Não use a resposta de uma nota privada como cache compartilhado entre identidades."
    ],
    "experimentos": [
        "Preveja a leitura com corpo.usuarioId forjado e registre separadamente o retorno e a identidade que permanece verificada. Depois confronte uma função que verifica propriedade com outra que confia somente no corpo; os modelos rodam em memória, sem autenticação ou HTTP reais.",
        "Monte a tabela de leitura e alteração para pessoa ausente, dono leitor, dono editor e editor de outra pessoa, com a nota ativa e arquivada. Acrescente ação excluir, papel EDITOR e IDs com espaços: somente as concessões explícitas da política podem passar.",
        "Execute a política com dados diferentes em chamadas independentes. Preserve os objetos e papéis recebidos; altere uma entrada como chamador entre chamadas e confira que a próxima decisão considera o novo valor. Na integração externa, repita as mesmas regras pelos endpoints, com duas identidades de teste."
    ],
    "projeto": "Modele uma API de anotações privadas em que cada pessoa só consulta e altera seus próprios registros. Escreva requisitos, tabela de decisões e testes antes dos endpoints. Implemente separadamente a política pura, a autenticação no servidor e sua aplicação antes da leitura ou gravação. Inclua nota arquivada, dono sem editor, editor de outra pessoa, ação desconhecida e corpo com id forjado; uma recusa deve preservar os dados. Defina o contrato HTTP e como evitar revelar detalhes privados, documente as decisões e revise logs sem credenciais. A função do sandbox cobre somente a política em memória: não comprova autenticação, HTTP, concorrência, persistência ou segurança da API inteira. O projeto é construído externamente e tem revisão manual; o sandbox desta aula não oferece rede e o CodeLab permanece sem contas.",
    "conexao": "Mesmo uma API autorizada precisa lidar com volume, cache e falhas externas, assunto da próxima aula."
},
  "limites-cache": {
    "contexto": "Sistemas reais têm latência, limites de requisição e indisponibilidade. Cache mantém uma cópia com contexto e relógio; não transforma uma resposta antiga em informação atual. A cópia precisa pertencer à mesma consulta e ter uma política explícita de uso quando expira. Um resultado vazio, zero, false ou null pode ser conteúdo válido: ausência de entrada e valor dos dados são coisas diferentes.",
    "modelo": "Pense em três etiquetas: atual, antigo e ausente. Neste modelo em memória, idade é agora menos salvoEm, com os dois tempos em milissegundos. A cópia é atual somente quando idade não é negativa e é menor que ttl. No limite exato ela expirou; ttl zero nunca é atual. A política didática permite recuperar uma cópia expirada somente após uma falha explícita e com etiqueta antigo, sem trocar sua data. Isso não implementa todas as regras de cache HTTP.",
    "passos": [
        "Defina a chave com todos os fatores que alteram a resposta. Se uma busca depende de pessoa e filtro, não use só a rota, um único fator ou uma concatenação ambígua. Strings opacas podem conter o separador escolhido; representar o par com JSON.stringify([pessoa, filtro]) conserva seus limites sem aparar ou mudar os valores.",
        "Estabeleça validade, unidade e limite de quantidade armazenada. Calcule idade = agora - salvoEm no mesmo relógio; idade < ttl é atual, enquanto igualdade já é expiração. Neste contrato, uma data no futuro é inutilizável, inclusive como fallback. TTL não prova que o dado continua verdadeiro: ele é a validade escolhida para a cópia.",
        "Deduplique requisições simultâneas iguais guardando a operação pendente por chave. Depois de sucesso ou falha, libere a pendência correspondente, sem apagar uma operação mais nova. Não guarde indefinidamente uma Promise rejeitada. A função selecionarCache só decide sobre uma entrada recebida: não faz rede nem executa essa deduplicação.",
        "Respeite rate limit e cancelamento. Uma resposta 429 pode trazer Retry-After; avalie o contrato antes de repetir, estabeleça limite de tentativas e permita cancelar a espera. Não faça retry recursivo imediato nem repita efeitos sem uma estratégia de idempotência. O exercício de seleção não implementa espera, jitter, Retry-After ou comunicação HTTP.",
        "Quando uma consulta falhar, use uma cópia antiga apenas se a política permitir e ela pertencer à mesma chave. Mostre a condição desatualizada e o instante de origem. Não renove salvoEm para esconder a idade nem transforme erro em sucesso vazio. As regras de Cache-Control, Vary, autorização e revalidação HTTP precisam de tratamento próprio na integração."
    ],
    "experimentos": [
        "Antes de executar, monte uma linha do tempo com salvoEm 1000 e TTL 50: compare 1049, 1050 e um relógio anterior à gravação. Acrescente TTL zero, dados false/null e uma cópia de outra chave; use números fornecidos, sem depender de esperar o relógio real.",
        "Construa duas consultas com componentes diferentes que colidem ao concatenar com |. Execute a chave corrigida e confira que pessoa e filtro continuam distinguíveis. Depois teste a política com JSON em diferentes ordens de propriedades, sem modificar a entrada nem respostas anteriores.",
        "No projeto externo, faça duas consultas iguais simultâneas e comprove uma chamada ao serviço. Avance um relógio controlado além do TTL, simule falha e confira o rótulo antigo. Simule 429 com e sem Retry-After, limite as repetições e cancele uma espera; falhas devem liberar a pendência para uma próxima tentativa."
    ],
    "projeto": "Construa uma camada de cache para clima ou catálogo com TTL, limite de entradas, deduplicação, cancelamento e fallback antigo rotulado. Especifique a unidade do relógio, a chave por contexto e quando um fallback antigo é aceitável. Separe seleção da cópia, transporte, armazenamento das pendências e renderização. Use relógio controlado e um serviço de teste para conferir prazo exato, TTL zero, dados vazios/falsy, consultas de pessoas diferentes, duas chamadas simultâneas, 429, cancelamento e recuperação após falha. Não sobrescreva uma cópia válida com uma resposta de erro; limite entradas e documente a política de descarte. A função do sandbox executa somente a seleção em memória, sem HTTP, deduplicação, retry ou persistência. Construa a integração externamente e use a rubrica manual do projeto.",
    "conexao": "A trilha seguinte leva essas ideias para C# e .NET, começando pelo ambiente de execução e sistema de tipos."
},
  "dotnet": {
    "contexto": "O .NET SDK reúne compilador, runtime e ferramentas de projeto. C# é a linguagem; .NET é a plataforma. Comece conferindo dotnet --info e o TargetFramework net10.0 do .csproj. Um SDK capaz de compilar o projeto não significa que um trecho com erro de tipo pode ser executado: restauração, compilação e execução são etapas distintas.",
    "modelo": "A declaração associa um nome a um tipo conhecido pelo compilador. var pede inferência a partir do inicializador, sem adiar a escolha para uma atribuição posterior: var pontos = 3 produz int; pontos = \"3\" não compila. Na divisão, os tipos dos operandos decidem a operação antes do destino: 5 / 2 é 2; atribuir esse resultado a decimal produz 2, não 2.5. Com 5 / 2m, um operando já é decimal e a fração é preservada. decimal é apropriado para muitos cálculos decimais monetários, mas não substitui definir unidade, limites e arredondamento quando o domínio exigir.",
    "passos": [
        "Confira o SDK com dotnet --info e crie um console com dotnet new console -n MeuPrograma -f net10.0. Inspecione o .csproj antes de alterar Program.cs.",
        "Identifique o ponto de entrada em top-level statements: neste exemplo, as instruções de Program.cs rodam na ordem escrita. Uma variável local só pode ser lida depois de declarada.",
        "Marque o tipo e a unidade de cada valor. 725 centavos são inteiros; centavos / 100m calcula o preço decimal em reais. centavos / 100 calcula primeiro um inteiro truncado e só depois pode ser convertido.",
        "Preveja as saídas antes de dotnet build. Se o build falhar, leia o primeiro diagnóstico e a linha: um literal 7.25 é double; 7.25m é decimal. Não houve resultado do programa se a compilação falhou.",
        "Depois de compilar, execute dotnet run --project MeuPrograma. Para comparar saídas numéricas, ToString(\"F2\", System.Globalization.CultureInfo.InvariantCulture) fixa duas casas e ponto; formatação não corrige um cálculo errado nem define a política de arredondamento do domínio."
    ],
    "experimentos": [
        "Compare 5 / 2, (decimal)(5 / 2), (decimal)5 / 2 e 5 / 2m no console .NET 10. Escreva os resultados antes de executar e explique em qual momento cada conversão acontece.",
        "Declare var preco = 7.25 e tente atribuir preco * 4 a decimal. Leia CS0266 no build. Troque apenas o inicializador para 7.25m, compile novamente e compare com trocar o preço por um inteiro: remover o erro não basta se o valor mudou.",
        "Reordene declarações independentes sem alterar o resultado. Depois coloque uma leitura antes da declaração e confirme o diagnóstico do compilador. Varie o preço em centavos entre 0, 1, 99, 100 e 725 e a quantidade entre 0 e 4; compare com a conta manual, sem depender da cultura para o separador."
    ],
    "projeto": "Crie um console .NET 10 que recebe dados simples, valida, calcula um resultado e possui uma função separada para a regra principal. Comece com valores fixos: mantenha preço em centavos e quantidade inteira, converta para decimal antes de dividir e declare a saída esperada para zero itens e para um item de um centavo. Depois introduza entrada textual, definindo explicitamente o formato aceito e o comportamento para texto inválido; não confunda texto com número nem uma exceção de entrada com erro de compilação. Entregue .csproj, Program.cs e instruções de build/run, junto de casos de teste e uma explicação do erro de tipo corrigido. A integração com leitura e validação é construída fora das pausas e tem revisão manual; a reconstrução conceitual não comprova esse projeto executado.",
    "conexao": "A próxima aula aplica condições, loops e métodos a entradas e regras explícitas. Aqui o critério é explicar o tipo de cada expressão, prever quando ocorre a divisão, localizar a etapa do erro e reconstruir dependências sem copiar uma única ordem. As pausas funcionam offline como decisões conceituais; os verificadores compilam e executam referências em .NET 10, mas não fingem compilar código do aluno no navegador."
},
  "csharp-controle": {
    "contexto": "Depois de escolher tipos e unidades, o programa precisa decidir quais valores processar, quando repetir e o que devolver. Em C#, condições de if e for são booleanas; um método declara parâmetros e tipo de retorno. Separar cálculo da apresentação permite testar uma regra sem interpretar mensagens do console. if, switch e pattern matching ajudam a expressar decisões, mas uma regra curta também precisa ter contrato e casos de fronteira claros.",
    "modelo": "Acompanhe uma tabela com elemento, condição, acumulador e próximo passo. continue ignora o restante da iteração atual; em um for, o iterador ainda ocorre antes da próxima avaliação da condição. break encerra o laço mais próximo; return encerra o método. As chaves delimitam onde variáveis existem e onde uma interrupção atua. Uma coleção pode estar vazia, portanto um retorno dentro de foreach não garante resultado em todos os caminhos de um método int. O acumulador local começa novamente a cada chamada; escrever no console não substitui devolver o resultado.",
    "passos": [
        "Defina a assinatura e o domínio antes do corpo: SomarAte recebe limite entre 0 e 1000 e devolve a soma inclusiva de 1 até esse limite; fora desse recorte, é preciso definir validação e limites numéricos adicionais.",
        "Escolha foreach para visitar elementos e for quando o contador participa da regra. Diferencie 1 até limite, inclusivo, de índices de array: estes vão de 0 até Length - 1 e normalmente usam i < Length.",
        "Registre o estado antes e depois de cada iteração. Em SomarAntesDoZero, um negativo não soma; o primeiro zero encerra o laço, mesmo que existam positivos depois dele.",
        "Coloque o filtro antes da alteração do acumulador. numero % 2 != 0 identifica ímpares positivos e negativos; comparar apenas com 1 deixaria passar restos negativos. Zero é par e somá-lo não muda o total.",
        "Confira o caminho sem iterações e o ponto em que o método retorna. Um resultado calculado deve ser retornado depois de visitar todos os itens pertinentes, sem modificar a entrada ou depender da chamada anterior."
    ],
    "experimentos": [
        "Faça a previsão de SomarAntesDoZero para [2, -1, 3, 0, 9], [-1, 0, 8] e []. Troque apenas o break do zero por continue; depois troque apenas o continue do negativo por break. Execute cada versão em .NET 10 e explique a primeira diferença, sem misturar as duas alterações.",
        "Compare i < limite, i <= limite, i <= limite + 1 e i == limite mantendo o mesmo início e incremento. Faça uma tabela para limites 0, 1 e 4, depois confira 1000. Escolha uma condição pela regra inteira, e não apenas por coincidir com o exemplo.",
        "Reconstrua SomarPares, teste [], [1, 3], [-4, -3, 0, 2] e chamadas sucessivas. Depois mova return para dentro do foreach e leia o diagnóstico do compilador sobre caminhos sem retorno. Retorne à versão correta antes de investigar uma alteração da regra; preserve a entrada para comparar os resultados."
    ],
    "projeto": "Implemente um calculador de frete com método que recebe peso, distância e categoria, retornando um resultado tipado e testável. Escreva primeiro uma tabela de regras com unidades e faixas explícitas: pesos e distâncias aceitos, categorias conhecidas, fronteiras inclusivas e comportamento para dados inválidos. Separe cálculo, validação e Console.WriteLine; mantenha o preço decimal. Entregue casos no limite de cada faixa, abaixo/acima dele, categoria desconhecida e chamadas consecutivas com entradas diferentes. Inclua o .csproj net10.0, código, instruções para compilar/executar e uma investigação curta de uma condição errada. O aluno define e implementa as regras; as pausas não entregam o projeto pronto. Integração, entrada textual e rubrica do projeto continuam com revisão manual.",
    "conexao": "A aula de objetos passa de métodos isolados para estado e contratos por interfaces. Antes disso, consiga explicar cada caminho de saída, localizar uma parcela omitida, reconstruir o escopo e inventar um caso de borda para sua regra. O exercício EhPar continua aplicável a zero, pares e ímpares, incluindo negativos. As pausas são conceituais offline; referências compiladas em .NET 10 não significam execução do código do aluno ou conclusão do projeto."
},
  "csharp-objetos": {
    "contexto": "Uma classe é útil quando precisa conservar regras ao longo de várias operações. A aula mantém Produto e o exercício IForma/Retangulo, e acrescenta três investigações: quem compartilha um objeto, quem pode escrever seu estado e o que uma operação recusada deve preservar. Não é necessário criar uma hierarquia para cada regra.",
    "modelo": "Separe variável, objeto e contrato. new Contador() cria uma instância; atribuir essa referência a ILeitura não cria outra. Duas variáveis podem observar o mesmo estado, enquanto outro new começa com estado independente. Uma interface com get limita as operações oferecidas por aquela referência, mas não congela o objeto nem impede que seu dono o altere.",
    "passos": [
        "Desenhe uma caixa por new e setas das variáveis até essas caixas. Depois de uma mudança, atualize a caixa antes de prever o que cada referência lê. ReferenceEquals compara identidade, não igualdade de valores.",
        "No exemplo original, Produto implementa IDescritivel: um cliente pode pedir Descrever sem exigir a classe concreta. A interface não produz uma cópia nem garante por si só que preço ou nome sejam válidos.",
        "Liste os caminhos que escrevem estado. Um método Depositar validado não protege uma propriedade com setter público. get público e private set conservam a leitura externa e permitem que a própria classe atualize o saldo; a atribuição direta do cliente passa a falhar na compilação.",
        "get com init permite inicialização, mas não uma atribuição comum em Depositar depois dela. get sem setter também não permite essa atualização no método. Encapsular exige escolher acessibilidade conforme as operações reais, não apenas esconder tudo.",
        "Para a Conta deste exercício, use inteiros em centavos, saldo inicial entre 0 e 1000000 e pedido de saque de qualquer int. Uma tentativa válida é positiva e no máximo igual ao saldo. Verifique essas condições no estado anterior; só então desconte e devolva sucesso.",
        "Registre estado antes, pedido, retorno e estado depois. Zero, negativo e pedido acima do saldo devem recusar sem alteração; retirar exatamente o saldo deixa zero. Teste chamadas seguidas e duas contas para descobrir estado compartilhado indevidamente.",
        "Preserve IForma.Area e implemente Retangulo como no exercício original. Depois escreva um consumidor que recebe IForma e teste outra implementação com o mesmo contrato. Uma interface não exige herança entre as classes concretas. Use composição para colaboradores; herança exige uma relação de substituição que mantenha as promessas do tipo base."
    ],
    "experimentos": [
        "Antes da primeira pausa, preveja as três saídas do contador. Troque apenas ILeitura leitura = original por ILeitura leitura = separado, faça nova previsão e compile em um projeto .NET 10. Compare identidade e valor sem atribuir à interface uma cópia que não aconteceu.",
        "No diagnóstico, conserve a atribuição externa e use a declaração escolhida: confira a recusa real do compilador. Depois remova essa atribuição do cliente e confirme que Depositar válido ainda funciona. Experimente init e get sem setter separadamente para localizar a diferença.",
        "Na reconstrução, investigue o erro de descontar antes de validar e registre o saldo após uma recusa. Teste saldo zero, pedido negativo, valor insuficiente, retirada exata e chamadas consecutivas. As pausas são conceituais offline; referências são compiladas em .NET 10 nos verificadores. Código livre deve ser compilado no seu projeto ou no executor configurado."
    ],
    "projeto": "Construa a Conta do projeto, sem receber uma implementação pronta: saldo em centavos entre 0 e 1000000, construtor que recusa saldo inicial inválido, leitura pública, depósito positivo sem exceder o teto e TentarSacar que retorna false sem mutar quando recusa. Separe Conta.cs, Program.cs e casos de teste. Defina um contrato de consulta pequeno quando um consumidor precisar somente ler, sem afirmar que a referência torna o objeto imutável. Registre entradas, estado anterior, retorno e estado posterior para zero, negativos, limite, insuficiência, retirada exata, chamadas seguidas e duas instâncias. Inclua um cliente que tenta escrever o saldo e documente a recusa do compilador. Entregue dotnet build/dotnet run, testes reproduzíveis e uma explicação de um defeito investigado. Rubrica de revisão manual: invariantes em todos os caminhos, instâncias independentes, recusa sem mutação, contrato acessível e legibilidade; a pausa não aprova automaticamente o projeto.",
    "conexao": "As operações e os contratos de cada objeto sustentam a próxima aula: generics e coleções organizam muitas instâncias sem apagar seus tipos ou as regras que cada uma precisa preservar."
},
  "csharp-colecoes": {
    "contexto": "Coleções expressam contratos diferentes. List<T> organiza uma sequência editável por posição; Dictionary<TKey,TValue> associa uma chave a um valor; IEnumerable<T> oferece uma sequência para percorrer. A aula conserva o exemplo de filtrar, projetar e materializar, além do exercício de somar pares. As pausas investigam presença de chave, cópia filtrada e composição de um total.",
    "modelo": "Mantenha o tipo em cada seta: IEnumerable<Pedido> passa por um filtro e continua sendo uma sequência de pedidos; uma projeção de TotalCentavos produz IEnumerable<int>; a soma termina a consulta e produz int. var preserva o tipo inferido, não transforma a sequência em uma coleção dinâmica com qualquer método. Um dicionário tem outra pergunta: essa chave existe, e qual valor está associado a ela?",
    "passos": [
      "Leia os parâmetros genéricos: List<int> admite inteiros; Dictionary<string, int> recebe chaves string e valores int. O tipo faz parte do contrato mesmo quando a variável foi declarada com var. IEnumerable<int> permite percorrer valores, mas não promete Add ou acesso por índice.",
      "No estoque da primeira pausa, a chave lapis existe com quantidade zero. TryGetValue devolve um bool de presença e escreve o resultado em out. Se a chave não existir, o bool será false e o out receberá o padrão de int, que é zero; uma variável anterior com 99 não conserva esse valor.",
      "Consultar com TryGetValue não cria uma entrada. Já ler o indexador de uma chave ausente lança KeyNotFoundException. O comparador StringComparer.Ordinal usa comparação literal; escolha o comparador conforme o contrato das chaves em vez de alterar nomes silenciosamente.",
      "Where retém itens que passam no predicado; Select transforma cada item. No exemplo original, 4 e 7 são removidos, enquanto 12 e 20 são projetados para 24 e 40. A ordem da origem continua visível nesse resultado; filtrar não é ordenar nem remover duplicações.",
      "Muitos operadores LINQ são adiados. Criar uma consulta não a torna List<T>; ToList percorre o resultado naquele momento e cria uma lista. No diagnóstico, é preciso poder acrescentar um item ao resultado sem alterar a lista de origem, preservando o filtro.",
      "Uma nova lista não significa cópia profunda. Int é um tipo por valor, então os números ficam em listas independentes; se os elementos forem objetos mutáveis, as referências internas ainda podem apontar para os mesmos objetos. Use a distinção da aula anterior e não prometa isolamento profundo só por chamar ToList.",
      "Quando basta agregar, não é necessário materializar antes. Em SomarValidos, filtre os pedidos, projete seus totais e deixe Sum consumir a sequência. A sobrecarga de int devolve zero para sequência vazia. O recorte recebe totais não negativos até 1000000 por pedido e assume que a soma cabe em int; fora desse limite, não se deve prometer uma soma válida sem tratar overflow.",
      "Faça uma tabela com entrada, itens selecionados e resultado. Inclua a borda 10 no filtro da segunda pausa, origem vazia, valores repetidos, pedidos inválidos com total positivo, pedidos válidos de total zero e duas chamadas independentes. Não use apenas o caso demonstrado como evidência."
    ],
    "experimentos": [
      "Antes da primeira pausa, acompanhe o bool e o out em duas colunas. Depois compare uma leitura de chave ausente pelo indexador com TryGetValue e confira Count antes/depois. Explique por que quantidade zero, ausência e inclusão de uma nova chave são estados diferentes.",
      "No diagnóstico, compile o programa original em um projeto .NET 10 e leia o tipo que não possui Add. Depois compare cada alternativa pelo resultado e pela lista de origem. Teste 9, 10, valores fora de ordem, duplicações e lista vazia; uma cópia sem filtro e um alias da origem falham por motivos diferentes.",
      "Na reconstrução, desenhe os tipos entre filtro, projeção e soma antes de mover as linhas. Use uma sequência vazia, pedidos sem participação, totais zero e duas referências ao mesmo pedido válido. Some valores, não quantidades de elementos. As pausas são conceituais offline; as referências são compiladas e executadas nos verificadores, sem alegar execução do aluno."
    ],
    "projeto": "Construa o relatório de pedidos original: filtrar um período, agrupar por cliente e calcular quantidade e total com LINQ. Defina Pedido com cliente, instante, participação no relatório e total em centavos; valide as entradas na fronteira e documente os limites numéricos. Declare o início incluído e o fim excluído do período para não contar a fronteira em dois relatórios. Separe Pedido.cs, Relatorio.cs, Program.cs e testes. Preserve a origem e defina se cada resultado é uma consulta adiada ou uma fotografia; não use ToList por hábito nem exponha uma coleção interna para contornar regras. Teste origem vazia, cliente sem pedidos no período, mesmo cliente repetido, pedidos fora do período, total zero, itens sem participação e chamadas consecutivas. Compare os totais com um cálculo manual pequeno e justifique o comparador de clientes. Entregue dotnet build/dotnet run, casos reproduzíveis e uma análise de um defeito. Rubrica de revisão manual: filtro temporal correto, agrupamento coerente, agregação dos valores certos, origem preservada e limites documentados. As pausas não aprovam automaticamente o relatório completo.",
    "conexao": "A próxima aula junta falhas, arquivos, assincronismo e testes. As coleções e consultas precisam continuar com contratos claros quando seus dados chegam de I/O e podem falhar, chegar vazios ou ser cancelados."
  },
  "csharp-async": {
    "contexto": "Exceções, arquivos e async aparecem juntas porque operações externas falham e levam tempo. Uma Task pode já estar concluída ou ainda representar trabalho pendente; await obtém seu resultado sem bloquear a thread durante uma espera. Ele não torna um cálculo de CPU automaticamente paralelo.",
    "modelo": "Siga três caminhos separados: resultado normal, falha e cancelamento. Um return no try ou no catch escolhe o resultado, mas finally ainda roda antes da saída. A suspensão temporária em await não encerra o escopo. using organiza o descarte de IDisposable; aguardar a leitura dentro dele conserva o recurso até a conclusão. Neste exercício, o chamador entrega um TextReader não nulo exclusivamente ao método, que assume seu descarte. Nem todo método que recebe um recurso é dono dele: o contrato deve dizer quem descarta. IAsyncDisposable exige await using, um contrato diferente. Não transforme uma falha técnica em texto vazio nem trate cancelamento esperado como sucesso.",
    "passos": [
      "Antes de executar Calcular, escreva a saída de cada caminho. No caso normal, finally escreve antes do chamador receber o número; no caso de divisor zero, o catch específico também escreve. Isso não desfaz mudanças já feitas.",
      "Em testes de exceção, mantenha uma falha explícita depois da chamada que deveria recusar a entrada. Capture apenas a exceção esperada. catch(Exception) pode capturar a própria falha do teste e aprovar uma função quebrada.",
      "Confira quem possui o leitor e quando o using termina. Em async Task<string>, return espera uma string; ReadToEndAsync(token) oferece Task<string>. A expressão aguardada precisa permanecer dentro da posse do leitor.",
      "Passe o CancellationToken recebido à operação. Propague falhas e cancelamento quando não houver recuperação útil; Result e Wait bloqueiam e podem mudar a forma de observar exceções.",
      "Teste texto vazio, espaços e caracteres Unicode sem alterá-los, sucesso, falha depois de suspender, cancelamento antes/durante a espera e descarte uma vez. Use sinais controlados em testes; dormir por um tempo fixo não prova a ordem.",
      "Separe a atividade conceitual offline da execução externa: a pausa reconhece a expressão pedida; as referências compilam em .NET 10. Um TextReader controlado é um dublê que verifica ciclo de vida, complementado por leitura real de arquivo nos verificadores."
    ],
    "experimentos": [
      "Conserve Dividir e seus testes: confira divisor negativo e exija a ArgumentException para zero. Introduza a falha de retornar zero nesse caso e observe se o teste passa indevidamente; não capture a falha do próprio teste.",
      "Complete LerTextoAsync e teste um StringReader vazio e outro com espaços/acentos. Em projeto local .NET 10, use também StreamReader num arquivo temporário e confira seu fechamento.",
      "Num teste com leitura controlada por TaskCompletionSource, confirme que a tarefa continua pendente e o leitor vivo antes de liberar o resultado. Depois force falha e cancelamento, sem usar rede ou atrasos arbitrários.",
      "Compare aguardar a leitura dentro do using com devolver uma Task de um método sem async. A segunda forma pode descartar o recurso antes da conclusão; arquivos pequenos que terminam imediatamente podem esconder esse defeito."
    ],
    "projeto": "Continue o importador assíncrono de arquivo JSON: mantenha validação, cancelamento e testes para arquivo válido, ausente e inválido. Separe leitura, análise e validação; documente encoding, limite de tamanho, dono do recurso e formato aceito. Teste também arquivo vazio, espaços/Unicode, erro de leitura e cancelamento sem registrar sucesso ou gravar estado parcial. Use diretório temporário nos testes e confira liberação dos recursos. Acrescente README com dotnet build, dotnet test e decisões; exporte os arquivos do projeto. Revisão manual por rubrica: a pausa não executa o importador nem certifica sua integração.",
    "conexao": "A trilha ASP.NET Core usa esses contratos ao receber requisições e cancelar trabalho. Revise novamente os caminhos de erro, quem possui cada recurso e como um teste detecta uma implementação defeituosa antes de avançar."
  },
  "aspnet-projeto": {
    "contexto": "Uma aplicação ASP.NET Core moderna é montada em Program.cs: serviços são registrados, o pipeline é configurado e rotas são mapeadas. Entender essa composição evita tratar o framework como magia. Nos exemplos desta aula o contrato é .NET 10, com o SDK Web e um projeto local; o navegador do CodeLab não hospeda a API do aluno.",
    "modelo": "Pense na construção e na execução como momentos distintos. WebApplication.CreateBuilder prepara configuração e serviços; Build cria a aplicação; MapGet e MapPost registram endpoints; Run mantém o host atendendo até encerrar. Um endpoint considera caminho e método. Na rota /dobro/{numero:int}, a restrição participa da correspondência: abc não corresponde. Isso é diferente de converter uma entrada da query num handler (int numero), em que uma entrada ausente ou não conversível gera falha de binding. Não use restrições de rota para esconder validações de domínio: elas podem transformar entrada inválida em 404. Uma regra de faixa pode responder 400 explicitamente dentro do handler. Results.Ok define uma resposta quando o handler executa; não libera outros métodos. Neste recorte sem fallback, um caminho desconhecido retorna 404 e um método recusado no caminho existente retorna 405. Essas respostas não demonstram autenticação, persistência ou disponibilidade de banco.",
    "passos": [
      "Leia o .csproj e confirme Microsoft.NET.Sdk.Web e net10.0. O exemplo original de /saude e o exercício /dobro/{numero:int} continuam disponíveis; execute num projeto local e use a URL exibida pelo servidor, sem confundir a porta do front-end.",
      "Localize CreateBuilder, registro de serviços, Build, middleware, endpoints e Run. Configure o pipeline na ordem em que as requisições devem atravessá-lo. Registros de dois endpoints independentes podem trocar de posição; isso não autoriza mover um registro para dentro do handler do outro.",
      "Antes de executar, monte uma tabela de método, caminho e resultado esperado. Compare GET /dobro/5, GET /dobro/abc e POST /dobro/5. A restrição :int não é uma validação completa do número de negócio.",
      "Quando o monitor recebe 405, investigue o método registrado antes de mudar corpo, cliente ou porta. Verifique também o método que deve permanecer recusado; aceitar todos pode quebrar o contrato sem causar erro de compilação.",
      "Na reconstrução, /dobro recebe numero da query. Confira -1000000, zero, 1000000 e os valores imediatamente externos. Valide antes de calcular e retornar. O exemplo original usa multiplicação de int; fora de uma faixa segura, uma conta pode transbordar mesmo que a entrada caiba em int.",
      "Teste HTTP de verdade: status, JSON, métodos recusados, binding, caminhos ausentes e chamadas independentes. As referências usam Kestrel em porta dinâmica somente no loopback e encerram cada host. O verificador não roda um servidor enviado pelo estudante, e as pausas offline continuam conceituais."
    ],
    "experimentos": [
      "Crie uma Minimal API com /saude e /tarefas.",
      "Mude a ordem de dois middleware simples e registre o caminho da requisição.",
      "Leia configuração por ambiente sem colocar segredo no código.",
      "Compare o exercício original /dobro/{numero:int} com /dobro?numero=5 da reconstrução. Teste texto, ausência, int fora da representação e número fora da faixa de negócio; anote onde a requisição foi recusada.",
      "Troque a ordem dos dois registros completos e comprove o mesmo contrato HTTP. Depois introduza um método errado ou uma resposta fixa: os testes devem detectar o defeito, não apenas confirmar um caso feliz."
    ],
    "projeto": "Monte a API .NET 10 mínima original com health check, endpoint de leitura e endpoint de criação validado em memória. Documente caminhos, métodos, JSON e status; diferencie ausência de rota, binding e regra de domínio. Acrescente casos de borda, métodos recusados e uma tentativa defeituosa que a suíte precisa detectar. Use dados descartáveis nos testes, confira o encerramento do host e registre que o armazenamento em memória se perde ao reiniciar. Entregue Program.cs, .csproj, testes e README com dotnet build e comandos de execução, exportando os arquivos. Revisão manual por rubrica: a pausa não constrói nem certifica o projeto ou sua implantação.",
    "conexao": "A próxima aula explica como serviços registrados entram nos endpoints sem criação manual espalhada pelo código. Revise antes o contrato HTTP e a ordem de construção; leitura da teoria não comprova que uma API foi construída e testada."
  },
  "aspnet-di": {
    "contexto": "Injeção de dependência separa o que uma classe precisa de como essa dependência é construída. O contêiner do ASP.NET Core gerencia criação e ciclo de vida, mas escolhas erradas de lifetime podem compartilhar ou reter estado indevidamente.",
    "modelo": "Veja o construtor ou parâmetro de endpoint como uma lista explícita de necessidades. O contêiner possui receitas para fornecer cada contrato. Singleton, scoped e transient definem por quanto tempo cada instância deve viver. Nas pausas, escopos manuais tornam a identidade observável; uma requisição da API tem seu próprio escopo. Scoped compartilha uma instância dentro dele, sem tornar o objeto seguro para uso concorrente. Um serviço sem estado, como a calculadora do exemplo, pode admitir outra vida conforme seus colaboradores e contrato. Os experimentos de contêiner manual usam um console isolado. Na API, registre no builder e use o provedor do host; construir outro contêiner dentro da aplicação pode duplicar singletons.",
    "passos": [
      "Dependa de abstrações quando isso reduz acoplamento real.",
      "Registre a implementação em um único ponto de composição.",
      "Escolha scoped para dependências ligadas à requisição, quando apropriado.",
      "Evite capturar serviço scoped dentro de singleton.",
      "Nos testes, substitua implementações por fakes focados no contrato.",
      "Use validação de escopos explicitamente ao investigar dependências. Uma configuração que passa nessa validação ainda pode compartilhar estado de negócio indevidamente.",
      "Descarte o escopo quando seu trabalho terminar; o contêiner libera os serviços descartáveis que criou. A memória continua gerenciada pelo GC.",
      "Para executar os experimentos fora da API, crie um console .NET 10 e inclua <FrameworkReference Include=\"Microsoft.AspNetCore.App\" /> em um ItemGroup do .csproj. O endpoint original continua no projeto web."
    ],
    "experimentos": [
      "Registre um serviço transient e conte quantas instâncias aparecem na mesma requisição.",
      "Compare com scoped em dois pontos da mesma requisição e em duas requisições diferentes.",
      "Tente criar dependência de lifetime incompatível e entenda o risco antes de apenas corrigir.",
      "Desative apenas a validação de uma captura inválida e compare dois pedidos: iniciar sem erro não prova isolamento.",
      "Construa o provedor antes de registrar o relatório e investigue por que o registro tardio não aparece nele."
    ],
    "projeto": "Extraia a regra de tarefas para ITarefaService e injete uma implementação em memória nos endpoints, preparando substituição futura por persistência. Separe estado temporário do pedido do armazenamento das tarefas: dados que precisam sobreviver a várias requisições exigem armazenamento definido e seguro para concorrência. Não escolha scoped esperando persistir uma lista entre pedidos. Revisão manual: demonstre duas requisições independentes, explique onde as tarefas são armazenadas e teste como o serviço reage a uma entrada inválida. A pausa conceitual não executa nem aprova esta API.",
    "conexao": "Com regras separadas em serviços, a próxima aula define contratos de entrada e saída usando DTOs e validação."
  },
  "aspnet-dto": {
    "contexto": "Entidades internas e contratos HTTP têm motivos diferentes para mudar. DTOs criam uma fronteira onde você decide exatamente o que recebe e devolve, reduzindo acoplamento e exposição acidental.",
    "modelo": "Trate o DTO de entrada como dado não confiável que precisa virar uma operação válida do domínio. O DTO de saída é uma representação escolhida para o cliente, não um espelho automático de toda a entidade.",
    "passos": [
      "Defina apenas campos necessários para a operação.",
      "Valide formato e regras simples na fronteira.",
      "Converta DTO para comandos ou modelos internos conscientemente.",
      "Use status coerentes para sucesso, validação e recurso inexistente.",
      "Não devolva propriedades internas ou sensíveis apenas porque existem na entidade."
    ],
    "experimentos": [
      "No contrato do exemplo, Length conta unidades UTF-16 recebidas antes de Trim. Teste null, espaços, 80 e 81 unidades, inclusive texto com espaços nas pontas; dois símbolos iguais para a pessoa podem ocupar quantidades diferentes de unidades.",
      "Compare ||, && e | na guarda. Teste null separadamente: uma tabela de verdadeiro e falso não basta quando avaliar o segundo operando pode lançar exceção.",
      "Adicione uma propriedade interna e confirme que ela não aparece no DTO de saída.",
      "Envie título vazio, longo e null e padronize a resposta de validação.",
      "Compare retornar entidade diretamente com mapear explicitamente."
    ],
    "projeto": "Implemente CreateTarefaRequest e TarefaResponse separados e um endpoint que devolve 201 com Location após criação. Revisão manual: documente se o limite mede unidades UTF-16 ou caracteres percebidos; cubra null, espaços, limites e tipo JSON inválido. Confira que campos internos não são aceitos nem devolvidos. DTO não substitui autorização: autoria e privilégios vêm de contexto confiável. Só prometa recuperar a tarefa depois de implementar e testar armazenamento e GET; o exemplo desta aula apenas monta a resposta.",
    "conexao": "A próxima aula acompanha a requisição além do endpoint, pela cadeia de middleware, logging e configuração."
  },
  "aspnet-pipeline": {
    "contexto": "Middleware envolve requisições e respostas. A ordem importa porque cada componente decide o que acontece antes e depois do próximo. Logging e tratamento de erro ganham poder quando ficam em pontos centrais do pipeline.",
    "modelo": "Imagine camadas concêntricas. A requisição atravessa middleware na ordem de registro; a resposta volta no sentido inverso. Um middleware pode continuar, modificar contexto ou encerrar o fluxo.",
    "passos": [
      "Liste responsabilidades transversais como erros, HTTPS, autenticação e logging.",
      "Ordene middleware conforme as dependências entre essas responsabilidades.",
      "Gere um identificador de correlação sem registrar dados sensíveis.",
      "Leia configuração por providers e ambientes apropriados.",
      "Transforme exceções não tratadas em respostas consistentes no ponto central."
    ],
    "experimentos": [
      "Compare a volta normal do await com uma exceção no componente interno: o trecho posterior ao await não é um finally. Se um tratador externo só decidir o status depois, um logger interno pode ainda não conhecer esse status final.",
      "Inspecione o estado estruturado recebido pelo provedor, além da mensagem formatada. Trocar o nome Credencial por Status ou usar Debug não remove o valor confidencial. Use dados fictícios nos testes e uma lista explícita de metadados permitidos.",
      "Monte dois provedores em memória para a mesma chave e para uma chave ausente no ajuste. O último provedor que fornece uma chave vence; trocar a ordem muda a configuração. Este experimento não modifica as variáveis de ambiente do computador.",
      "Crie dois middleware que registram antes/depois e observe a ordem de retorno.",
      "Lance uma exceção num endpoint e trate-a globalmente.",
      "Mude uma configuração por variável de ambiente e confirme precedência."
    ],
    "projeto": "Adicione logging estruturado, identificador de correlação e tratamento global de erro à API de tarefas sem duplicar try/catch em cada endpoint. Revisão manual: envie requisições normais, inexistentes e com falha controlada; confira a ordem real do middleware e de quem decide a resposta. Não altere headers depois de a resposta começar. Teste a precedência e valide limites de configuração na inicialização. Registre somente metadados permitidos, verificando mensagem e campos; não copie Authorization, cookies ou corpos privados. Documente quais falhas o exemplo simples não registra e como sua implementação as observa sem devolver stack trace ao cliente.",
    "conexao": "A última aula combina identidade, autorização e limites para proteger a aplicação sem confiar no cliente."
  },
  "aspnet-protecao": {
    "contexto": "Proteção de uma API combina autenticação, autorização, validação, limites e configuração segura. Nenhuma camada isolada resolve tudo, e controles precisam ficar no servidor porque clientes podem ser modificados.",
    "modelo": "Use defesa em profundidade: transporte seguro, identidade verificada, política de acesso, validação de entrada, limites de recurso e observabilidade. Cada camada reduz uma classe diferente de risco.",
    "passos": [
      "Exija HTTPS no ambiente público e mantenha segredos fora do repositório.",
      "Autentique por mecanismo apropriado e valide tokens no servidor.",
      "Autorize cada ação conforme recurso e identidade.",
      "Limite tamanho, frequência e tempo de operações custosas.",
      "Registre eventos úteis sem incluir credenciais ou dados desnecessários."
    ],
    "experimentos": [
      "Separe o challenge de uma pessoa não autenticada da recusa de uma pessoa autenticada sem permissão. O esquema define a resposta concreta; no exercício ele usa 401/403 sem redirects. As identidades do verificador são sintéticas, não uma validação de tokens reais.",
      "Teste autorização com uma nota de outro autor, um proprietário sem papel de editor, um identificador ausente e um autor falsificado no JSON. Use o autor persistido e a identidade validada; uma política geral de endpoint não resolve sozinha a permissão sobre cada recurso.",
      "Mantenha a primeira operação pendente com uma barreira de teste, faça uma segunda chamada e depois libere a primeira. Diferencie limite de concorrência de taxa por segundo. Um limiter em memória de um processo não substitui coordenação entre réplicas nem isolamento do executor.",
      "Tente acessar rota protegida sem credencial, com credencial inválida e sem permissão.",
      "Envie corpo acima do limite e observe rejeição controlada.",
      "Revise logs de falha e procure qualquer token ou segredo exposto."
    ],
    "projeto": "Em um projeto separado que realmente precise de usuários, proteja endpoints e recursos, acrescente limites e testes de integração. Revisão manual: justifique autenticação e validação das credenciais; cubra 401/403, autoria por recurso e dados falsificados. Teste limite de entrada, concorrência, cancelamento, tempo e tamanho da saída sem executar código não confiável no processo da API. Confira acesso após liberar uma vaga e documente limites por instância. Identidades de teste e headers sintéticos não são um esquema de autenticação de produção. O CodeLab continua sem contas e com progresso local.",
    "conexao": "A trilha de banco de dados mostra como persistir esse estado preservando relações e consistência."
  },
  "sql-modelagem": {
    "contexto": "Modelagem define o significado dos dados antes das consultas. Uma tabela precisa representar uma entidade ou relação coerente; chaves e restrições transformam regras do domínio em garantias do banco.",
    "modelo": "Pense no banco como guardião de invariantes compartilhados por todos os clientes. A aplicação ajuda o usuário, mas constraints impedem que outra conexão grave estados impossíveis.",
    "passos": [
      "Defina o que cada linha representa em uma frase.",
      "Escolha uma chave primária estável.",
      "Separe entidades quando grupos de dados possuem ciclos de vida diferentes.",
      "Use REFERENCES para exigir existência e NOT NULL quando a relação também for obrigatória. Só REFERENCES permite ausência.",
      "Adicione NOT NULL, UNIQUE e CHECK quando a regra pertence aos dados."
    ],
    "experimentos": [
      "Tente inserir duas linhas com a mesma chave única.",
      "Crie uma foreign key e tente apontar para registro inexistente.",
      "Compare armazenar lista separada por vírgulas com modelar uma relação própria.",
      "Num SQLite descartável, habilite foreign_keys antes da transação e confira PRAGMA foreign_keys. Crie um autor e tente gravar livro sem autor, com autor inexistente e dois livros válidos do mesmo autor. Faça cada tentativa em uma base nova para separar causa e efeito.",
      "Adicione UNIQUE somente em autor_id e reproduza a falha do segundo livro. Explique por que essa restrição muda uma relação de um para muitos. Remova-a na definição de um novo banco de exercício, conservando presença e referência.",
      "Reconstrua as peças da relação. No SQLite, criar a tabela filha antes do pai pode funcionar, mas inserir a filha exige o pai já existente. No PostgreSQL, declare primeiro a tabela referenciada; PRAGMA e a geração automática de INTEGER PRIMARY KEY não são um contrato portátil."
    ],
    "projeto": "Modele usuários, projetos e tarefas com chaves, relações e restrições suficientes para impedir tarefas sem projeto válido. Construa o esquema num banco descartável e documente o dialeto. Revisão manual: mostre dois projetos do mesmo usuário, duas tarefas do mesmo projeto, chaves repetidas recusadas e tarefas com projeto ausente ou inexistente recusadas. Inclua outra conexão com as restrições configuradas e preserve os dados após uma operação rejeitada. Não entregue apenas um desenho: exporte o SQL de criação e os comandos de verificação. Compare suas tentativas com as garantias do esquema; as pausas conceituais não executam esse projeto nem comprovam sua correção completa.",
    "conexao": "Com o esquema definido, a próxima aula manipula linhas usando SELECT, INSERT, UPDATE e DELETE."
  },
  "sql-crud": {
    "contexto": "CRUD descreve operações básicas, mas SQL trabalha com conjuntos. Um UPDATE ou DELETE sem filtro pode afetar muitas linhas de uma vez; por isso cada comando deve começar com uma pergunta clara sobre o conjunto alvo.",
    "modelo": "Leia uma instrução em duas partes: qual conjunto de linhas é selecionado e o que será feito com ele. WHERE define o alvo; SELECT projeta; INSERT cria; UPDATE transforma; DELETE remove.",
    "passos": [
      "Escreva primeiro um SELECT que identifique exatamente as linhas alvo de uma alteração.",
      "Use colunas explícitas em INSERT.",
      "Atualize apenas campos necessários e mantenha a condição visível.",
      "Verifique quantidade de linhas afetadas.",
      "Use transação quando múltiplas mudanças dependem umas das outras."
    ],
    "experimentos": [
      "Execute SELECT com o mesmo WHERE de um UPDATE antes da alteração.",
      "Remova o WHERE em um banco descartável para entender o alcance do comando.",
      "Compare DELETE com marcar um estado de arquivado quando histórico precisa ser preservado.",
      "Preveja as linhas após INSERT, UPDATE e DELETE antes de consultar. Use uma base nova para repetir o roteiro; identificadores e ORDER BY precisam estar explícitos para comparar resultados.",
      "Reproduza um UPDATE cujo OR inclui outras tarefas. Teste a tarefa-alvo pendente, já concluída e ausente. Acrescente um contador de edições e repita a chamada para detectar uma gravação que mantém o status, mas altera outro campo. Essa proteção simples de estado não é uma solução geral de concorrência ou idempotência distribuída.",
      "Corrija o filtro de pendências no SQLite local. Investigue o caso visível e depois as bases variadas; títulos iguais não autorizam eliminar tarefas distintas. A conferência usa só leitura e mantém a base protegida contra alterações."
    ],
    "projeto": "Crie operações CRUD para tarefas e um roteiro de teste que prova criação, consulta, edição restrita a um id e remoção. Trabalhe em um banco descartável e exporte criação, dados de teste, comandos e resultados esperados. Revisão manual: inclua alvo ausente, alvo já concluído, outras tarefas pendentes, lista sem pendências e tabela vazia; confira todas as colunas das linhas que deveriam continuar intactas. Faça um SELECT com o mesmo filtro antes de gravar, explicando que outra conexão pode mudar os dados depois dessa leitura: a prévia não substitui transação ou controle de concorrência. A correção automática da consulta de leitura não executa nem aprova o CRUD inteiro. Retome os erros da tentativa antes de refazer o projeto.",
    "conexao": "A próxima aula combina tabelas e resume conjuntos com JOIN, GROUP BY e agregações."
  },
  "sql-join": {
    "contexto": "JOIN reconstrói relações que foram normalizadas em tabelas separadas. O desafio não é decorar sintaxe, mas saber qual conjunto deve existir antes e depois da junção e como cardinalidade pode multiplicar linhas.",
    "modelo": "Imagine duas tabelas como conjuntos com chaves de ligação. INNER JOIN mantém pares encontrados; LEFT JOIN preserva todas as linhas da esquerda e preenche ausência do lado direito com NULL.",
    "passos": [
      "Defina qual tabela representa a pergunta principal.",
      "Identifique a chave que conecta as duas fontes.",
      "Escolha INNER ou LEFT conforme linhas sem correspondência devem desaparecer ou permanecer.",
      "Antes de agregar, confira quantas linhas a junção produz.",
      "Agrupe somente depois de entender a granularidade do conjunto resultante."
    ],
    "experimentos": [
      "Compare INNER e LEFT JOIN com um registro sem relação.",
      "Crie relação um-para-muitos e observe como a linha do lado um se repete.",
      "Calcule COUNT(*) e COUNT(coluna) em presença de NULL.",
      "Desenhe a linha que LEFT JOIN preserva para uma categoria sem notas. Preveja COUNT(*) e COUNT(n.id) separadamente antes de executar: uma linha presente não garante uma chave de nota presente.",
      "Tente filtrar COUNT em WHERE e reproduza a recusa do banco. Mova o teste do agregado para HAVING e compare os grupos com zero, uma, duas e três notas. Essa ordem lógica ajuda a raciocinar; não descreve obrigatoriamente o plano físico do otimizador.",
      "Reproduza um relatório que conta títulos distintos em vez de registros. Inclua duas notas diferentes com o mesmo título e compare a quantidade exibida e os grupos que passam no limite. Use uma chave estável para desempatar quantidades iguais.",
      "Investigue duas soluções equivalentes para o relatório com mínimo de duas notas: agrupar a tabela de notas diretamente ou contar linhas após a junção. COUNT(*) pode produzir o mesmo resultado nesse recorte; no relatório geral que preserva categorias vazias, ele volta a diferir de COUNT(n.id)."
    ],
    "projeto": "Gere relatório por projeto com quantidade de tarefas, concluídas e última atualização, preservando projetos sem tarefas. Revisão manual: entregue esquema, dados de teste e consultas exportáveis com resultados esperados. Inclua projeto sem tarefa, tarefas diferentes com o mesmo título, duas tarefas no limite e empates de contagem com desempate estável. Defina como a última atualização ausente aparece. Compare esse relatório geral com um segundo recorte que aceita somente projetos acima de um mínimo: não apague zeros do primeiro só porque o segundo os exclui. Justifique a identidade contada e a fase dos filtros; a pausa corrigível não aprova automaticamente todo o relatório ou sua performance.",
    "conexao": "Quando várias alterações precisam ser tratadas como uma unidade, entram transações e consistência."
  },
  "sql-transacao": {
    "contexto": "Transações protegem invariantes quando uma operação lógica envolve múltiplas mudanças. Sem atomicidade, uma falha no meio pode deixar metade do trabalho gravada e metade ausente.",
    "modelo": "Pense numa transação como uma decisão indivisível: ou todas as mudanças confirmam com commit, ou o conjunto retorna ao estado anterior com rollback. Isolamento define como transações concorrentes enxergam mudanças umas das outras.",
    "passos": [
      "Identifique quais instruções pertencem à mesma operação de negócio.",
      "Inicie a transação o mais perto possível dessas mudanças.",
      "Valide condições necessárias antes de confirmar.",
      "Faça commit apenas quando todo o conjunto estiver correto.",
      "Em erro, rollback e deixe a conexão em estado conhecido."
    ],
    "experimentos": [
      "Simule falha entre débito e crédito em uma transferência com e sem transação.",
      "Execute duas atualizações concorrentes em um banco de teste e observe conflitos.",
      "Diferencie falha de instrução de rollback total: em SQLite, uma violação de CHECK com o comportamento ABORT padrão desfaz a instrução que falhou, mantém alterações anteriores e deixa a transação ativa. O controlador deve executar ROLLBACK no caminho de erro; não confirmar em finally. PostgreSQL deixa a transação em estado abortado até recuperação por rollback ou savepoint apropriado. Confira o comportamento do seu driver.",
      "Marque o primeiro COMMIT e depois uma segunda transação desfeita: ROLLBACK não desfaz uma unidade já confirmada. Cada execução no laboratório usa um banco descartável novo; comandos enviados em execuções diferentes não compartilham a mesma transação.",
      "UPDATE que não encontra a conta pode afetar zero linhas sem erro. Simule destino ausente e saldo insuficiente; exigir uma linha em cada etapa é uma regra do controlador deste exemplo, não uma propriedade automática de BEGIN/COMMIT.",
      "Audite lançamentos por transferência: soma zero, exatamente dois registros e contas distintas são três regras separadas. Um lançamento duplicado pode conservar o total. A auditoria encontra essas violações no recorte, mas não comprova como os registros foram gravados nem garante isolamento."
    ],
    "projeto": "Construa uma transferência de pontos fictícios usando inteiros, em banco descartável. Entregue esquema, controlador, testes e instruções de reprodução. Exija valor positivo, contas distintas e existentes, saldo suficiente, uma linha afetada por etapa e fechamento correto da transação. Provoque falha entre débito e crédito e registre os saldos antes/depois de rollback; confira também destino ausente e primeira transferência já confirmada. Acrescente a consulta de auditoria e mostre um exemplo em que soma zero não basta. Revisão manual: preservar saldos em toda falha, não confirmar em finally, tratar o estado da conexão e explicar os limites dos testes com uma única conexão. A prática desta aula não certifica concorrência ou um sistema financeiro real; os conflitos entre sessões pertencem à aula própria de isolamento.",
    "conexao": "A última aula trata desempenho por índices e segurança por consultas parametrizadas, incluindo SQL Injection."
  },
  "sql-indices": {
    "contexto": "Índices aceleram determinados caminhos de leitura ao custo de espaço e trabalho adicional em escrita. Parâmetros, por outro lado, separam código SQL de valores externos e são essenciais para evitar SQL Injection.",
    "modelo": "Um índice é uma estrutura auxiliar que ajuda o banco a localizar linhas sem percorrer tudo, mas só é útil quando combina com filtros, junções e ordenações reais. Uma consulta parametrizada envia a estrutura da instrução separada dos dados.",
    "passos": [
      "Meça uma consulta real antes de criar índice.",
      "Observe colunas usadas em filtros, joins e ordenações frequentes.",
      "Evite índices redundantes ou em toda coluna por padrão.",
      "Nunca concatene entrada externa para formar a estrutura SQL.",
      "Use parâmetros tipados e valide regras de domínio separadamente."
    ],
    "experimentos": [
      "Compare plano de execução antes e depois de um índice relevante.",
      "Crie um índice que não ajuda uma consulta e entenda por que o otimizador pode ignorá-lo.",
      "Em um banco descartável, prepare WHERE titulo=$titulo e vincule valores como D'água e o texto ' OR 1=1 --. O parâmetro ocupa uma posição de valor; ele não deve ser concatenado nem usado para substituir nomes de tabela, coluna ou direção de ordenação. Para essas escolhas, mapeie uma opção conhecida para uma consulta fixa controlada pelo programa. Para testar a vinculação interativamente, use um projeto com driver: a bancada atual recebe SQL puro, sem interface para esses parâmetros.",
      "Títulos iguais devem retornar todas as notas correspondentes. Vincular parâmetros não cria unicidade, não valida autorização e não altera automaticamente a semântica de LIKE: curingas continuam sendo parte da linguagem do operador.",
      "Crie o índice comum de categoria e insira outra nota na mesma categoria. Depois compare com UNIQUE em uma cópia: uma restrição de unicidade muda quais dados são aceitos, não apenas o caminho de leitura. Não apague notas válidas para fazer a criação do índice passar.",
      "Compare resultados antes/depois do índice e examine EXPLAIN QUERY PLAN com dados representativos. A consulta deve conservar seu contrato e ORDER BY; o plano não substitui uma medição, e seu texto pode variar entre versões. Não presuma que um índice pequeno será escolhido ou que toda consulta ficará mais rápida."
    ],
    "projeto": "Revise um CRUD local em banco descartável. Entregue consultas e vinculação de parâmetros pelo driver, testes para apóstrofos, títulos iguais, texto que lembra SQL e nenhum resultado. Identificadores dinâmicos devem vir de opções permitidas mapeadas para SQL controlado; vincular um valor não substitui esse mapeamento. Crie somente os índices justificados pela consulta e pelos dados medidos, preservando todas as linhas e novas notas por categoria. Revisão manual: comparar resultados antes/depois, guardar esquema e scripts de dados, informar versão, plano observado, volume, condições e medições de leitura/escrita sem prometer aceleração por existir um índice. As duas pausas desta aula são conceituais para o aluno, com referências executadas nos testes; a produção independente e a medição pertencem ao projeto, não a uma aprovação automática.",
    "conexao": "A trilha full stack conecta banco, API e navegador numa única jornada de dados."
  },
  "fullstack-arquitetura": {
    "contexto": "Uma aplicação full stack é um conjunto de fronteiras. O navegador cuida de interação; a API aplica regras e controla acesso; o banco preserva dados e constraints. Problemas surgem quando uma camada assume responsabilidades que pertencem a outra.",
    "modelo": "Acompanhe uma ação como uma viagem: intenção no navegador, mensagem HTTP, regra no servidor, mudança persistida e resposta de volta. Em cada fronteira existe um contrato e uma possibilidade de falha.",
    "passos": [
      "Descreva a jornada completa antes de escolher detalhes de implementação.",
      "Defina contratos de entrada e saída entre navegador e API.",
      "Coloque validação amigável no cliente e validação autoritativa no servidor.",
      "Use o banco para garantias estruturais dos dados.",
      "Mantenha observabilidade suficiente para localizar em qual fronteira a jornada falhou."
    ],
    "experimentos": [
      "Remova temporariamente a API e veja quais responsabilidades o navegador não deve assumir.",
      "Envie uma requisição válida fora da interface e confirme que regras continuam protegidas.",
      "Quebre a conexão com o banco e observe como a API traduz a falha."
    ],
    "projeto": "Desenhe a arquitetura de um app de tarefas com diagrama de responsabilidades, contratos HTTP e regras persistidas antes de implementar.",
    "conexao": "A próxima aula detalha como a interface representa os estados dessa integração ao longo do tempo."
  },
  "fullstack-integracao": {
    "contexto": "Integração não termina quando a requisição retorna 200. A interface precisa permanecer consistente durante carregamento, sucesso, falha, conflito e atualização concorrente, sem inventar estado que o servidor não confirmou.",
    "modelo": "Pense no servidor como autoridade sobre dados persistidos e no cliente como uma visão local. Mudanças otimistas são possíveis, mas precisam de estratégia para desfazer ou reconciliar quando o servidor discorda.",
    "passos": [
      "Modele estados da ação antes de escrever handlers.",
      "Desabilite ou deduplique operações quando repetição acidental causaria problema.",
      "Atualize a interface com a resposta confirmada do servidor.",
      "Trate conflitos e erros preservando dados que a pessoa digitou.",
      "Revalide ou sincronize quando outra operação puder ter alterado o mesmo recurso."
    ],
    "experimentos": [
      "Simule resposta lenta e clique duas vezes para testar deduplicação.",
      "Faça o servidor alterar um campo calculado e use a resposta real em vez de inventar no cliente.",
      "Retorne conflito de versão e escolha como a interface permite recarregar ou reconciliar."
    ],
    "projeto": "Integre uma tela de tarefas a uma API real local com estados explícitos de carregamento, salvamento, erro e sincronização.",
    "conexao": "Depois de integrar, a próxima aula prova a jornada em diferentes níveis de teste."
  },
  "fullstack-testes": {
    "contexto": "Testes bons verificam comportamento em fronteiras diferentes. Unidade dá feedback rápido sobre regras; integração revela contratos reais; jornada confirma que componentes separados funcionam juntos pela interface.",
    "modelo": "Use uma pirâmide como distribuição de custo, não como dogma. Coloque a regra no nível mais barato que consegue prová-la e reserve E2E para jornadas cuja integração realmente importa.",
    "passos": [
      "Liste riscos e comportamentos antes de escolher ferramentas.",
      "Teste regras puras isoladamente.",
      "Use banco e servidor descartáveis para integrações importantes.",
      "No navegador, exercite fluxos completos com seletores acessíveis.",
      "Inclua falhas e condições de fronteira, não apenas o caminho feliz."
    ],
    "experimentos": [
      "Pegue um teste E2E lento e veja se parte da garantia pode virar teste de unidade.",
      "Crie um bug no contrato JSON e observe qual nível detecta primeiro.",
      "Execute duas operações concorrentes para testar uma condição que não aparece em testes sequenciais."
    ],
    "projeto": "Monte uma suíte para criar tarefa: unidade da validação, integração API+banco e jornada do navegador até persistência.",
    "conexao": "A próxima aula leva o mesmo rigor para configuração, publicação e observação depois do deploy."
  },
  "fullstack-config": {
    "contexto": "Produção é outro ambiente, não apenas o mesmo código em outro endereço. Variáveis, domínio, HTTPS, permissões, build, migrações e serviços externos podem divergir mesmo quando o código compila perfeitamente.",
    "modelo": "Separe artefato e configuração. O mesmo código construído deve receber valores específicos do ambiente sem versionar segredos. Depois do deploy, verifique o sistema como um usuário e como um operador.",
    "passos": [
      "Execute instalação limpa, testes e build antes da publicação.",
      "Valide variáveis obrigatórias sem registrar seus valores secretos.",
      "Planeje migrações compatíveis e possibilidade de rollback.",
      "Teste health check, assets, rotas e integrações no ambiente real.",
      "Observe logs, métricas e erros após a mudança."
    ],
    "experimentos": [
      "Remova uma variável obrigatória e faça o app falhar cedo com mensagem clara.",
      "Publique em ambiente de preview e execute uma smoke test automatizada.",
      "Simule rollback do código quando o banco já recebeu uma migração e avalie compatibilidade."
    ],
    "projeto": "Crie um checklist de release reproduzível para um projeto seu, com build, teste, migração, smoke test, observabilidade e rollback.",
    "conexao": "A última aula observa recursos que continuam vivos e desempenho ao longo do ciclo de vida da aplicação."
  },
  "fullstack-memoria": {
    "contexto": "Desempenho não é sensação isolada; é medição de uma tarefa repetível. Vazamentos aparecem quando recursos que deveriam morrer continuam alcançáveis: listeners, timers, modelos de editor, workers, buffers gráficos e caches.",
    "modelo": "Pense em propriedade de recursos. Tudo que é criado deve ter um dono e uma condição de descarte. Heap pode oscilar por coleta de lixo, então procure tendências e contagens estáveis após repetir o mesmo ciclo.",
    "passos": [
      "Defina um cenário repetível antes de abrir ferramentas de perfil.",
      "Meça baseline e repita o ciclo várias vezes.",
      "Conte recursos específicos além de observar heap total.",
      "Force ou aguarde coleta quando a ferramenta permitir e compare patamares.",
      "Corrija a retenção e crie teste de regressão para o ciclo de vida."
    ],
    "experimentos": [
      "Monte e desmonte um editor repetidamente observando modelos ativos.",
      "Inicie e encerre workers em vinte execuções e confirme zero restantes.",
      "Crie cache sem limite, observe crescimento e depois aplique tamanho e expiração."
    ],
    "projeto": "Instrumente uma aplicação com contagem de recursos e escreva um teste de vinte trocas de tela que falha se modelos, workers ou geometrias acumularem.",
    "conexao": "A última trilha usa todo esse conhecimento em projetos completos e entregáveis."
  },
  "projeto-diario": {
    "contexto": "Um diário de ideias é pequeno o suficiente para terminar e grande o suficiente para exigir estado, formulário, lista, busca e persistência. Ele funciona como laboratório para decisões reais de produto e engenharia.",
    "modelo": "Trate nota como entidade com id estável, texto, categoria e data. A interface deriva lista visível do estado; filtros não devem destruir nem reordenar silenciosamente a fonte original.",
    "passos": [
      "Defina o modelo da nota e limites de entrada.",
      "Implemente criação e renderização antes de persistência.",
      "Adicione remoção e busca usando id, não índice filtrado.",
      "Versione o formato salvo e trate dados corrompidos.",
      "Exporte/importa somente depois de validar todo o fluxo local."
    ],
    "experimentos": [
      "Filtre a lista e remova um item para provar por que id estável é necessário.",
      "Corrompa o JSON salvo e preserve um estado padrão seguro.",
      "Crie muitas notas e observe comportamento de busca e renderização."
    ],
    "projeto": "Entregue o diário com inclusão, categorias, busca, exclusão, persistência versionada, exportação e uma pequena suíte de testes dos comportamentos críticos.",
    "conexao": "O próximo projeto trabalha com tarefas e estados derivados como concluída e pendente."
  },
  "projeto-tarefas": {
    "contexto": "Uma lista de tarefas parece trivial até incluir edição, filtros, persistência, acessibilidade e consistência. O exercício ensina a não guardar dados derivados que podem ser calculados do estado principal.",
    "modelo": "A coleção de tarefas é a fonte de verdade. Contagem de pendentes, filtros e mensagens são projeções calculadas dessa coleção. Cada ação identifica uma tarefa por id e produz um novo estado coerente.",
    "passos": [
      "Modele id, título e concluída antes da interface.",
      "Implemente adicionar e renderizar com uma única fonte de verdade.",
      "Derive contadores e filtros a cada renderização relevante.",
      "Implemente alternância e remoção por id.",
      "Preserve foco e feedback de teclado após mudanças."
    ],
    "experimentos": [
      "Conclua e reabra o mesmo item várias vezes e compare o contador.",
      "Filtre concluídas e remova uma delas para testar identidade.",
      "Recarregue com todas concluídas, nenhuma tarefa e muitas tarefas."
    ],
    "projeto": "Entregue um organizador com filtros, persistência, ações por teclado, estado vazio e testes para contador derivado e identidade estável.",
    "conexao": "O próximo projeto adiciona rede, cache, tempo e condições meteorológicas reais."
  },
  "projeto-clima": {
    "contexto": "Um painel de clima reúne quase todos os problemas de uma interface conectada: consentimento de localização, dados externos, cache, cancelamento, staleness, unidades e diferença entre observação atual e previsão.",
    "modelo": "Separe três camadas: seleção de local, serviço de dados e apresentação. O serviço decide cache e rede; a apresentação recebe um estado normalizado sem precisar conhecer detalhes da API externa.",
    "passos": [
      "Permita escolha manual antes de solicitar localização.",
      "Normalize resposta externa para um modelo interno controlado.",
      "Use chave de cache por local com validade explícita.",
      "Cancele consulta anterior quando a seleção muda.",
      "Rotule dado antigo e nunca transforme previsão futura em condição atual."
    ],
    "experimentos": [
      "Alterne cidades rapidamente e garanta que resposta antiga não vence a nova.",
      "Desligue a rede com cache recente, cache antigo aceitável e cache expirado.",
      "Simule chuva futura sem chuva atual e confirme que a interface não mente."
    ],
    "projeto": "Construa um painel com cidade, temperatura, umidade, vento, condição, horário de observação, cache de cinco minutos e fallback rotulado.",
    "conexao": "O próximo projeto leva os dados para uma API e banco próprios em ASP.NET."
  },
  "projeto-api": {
    "contexto": "Um catálogo com ASP.NET e SQLite conecta HTTP, DTOs, regras, persistência e testes. O objetivo não é apenas fazer CRUD, mas manter contratos claros e dados consistentes entre camadas.",
    "modelo": "Use fluxo endpoint → DTO → serviço → persistência → resposta. Cada etapa traduz responsabilidades: HTTP não deve conhecer detalhes de SQL; persistência não deve decidir mensagens de interface.",
    "passos": [
      "Modele tabela e constraints antes dos endpoints.",
      "Defina DTOs de criação e resposta separados.",
      "Implemente serviço com operações e validações do domínio.",
      "Use parâmetros em toda consulta SQL.",
      "Teste API com banco temporário cobrindo sucesso e falha."
    ],
    "experimentos": [
      "Tente criar item inválido e confirme que nenhuma linha é gravada.",
      "Apague item inexistente e padronize a resposta.",
      "Execute duas criações e confirme ids e restrições no banco."
    ],
    "projeto": "Entregue catálogo local com listar, detalhar, criar, editar e remover, documentação do contrato e testes de integração sobre SQLite descartável.",
    "conexao": "O último projeto transforma código funcionando em uma entrega revisada, documentada e verificável."
  },
  "projeto-entrega": {
    "contexto": "Terminar um projeto exige mais do que parar de programar. Revisão final verifica comportamento, acessibilidade, responsividade, segurança, desempenho, documentação e um caminho de recuperação quando algo falha.",
    "modelo": "Pense na entrega como evidência. Cada afirmação — 'funciona no mobile', 'não vaza recurso', 'API valida entrada' — deve ter um teste, uma inspeção ou uma medição que a sustente.",
    "passos": [
      "Congele o escopo e liste critérios de aceite verificáveis.",
      "Execute testes limpos e percorra manualmente as jornadas principais.",
      "Teste larguras e alturas intermediárias, teclado e estados de erro.",
      "Revise configuração, segredos, logs e dependências externas.",
      "Escreva README com execução, limitações conhecidas e decisões importantes."
    ],
    "experimentos": [
      "Faça uma instalação limpa em outra pasta e siga apenas o README.",
      "Teste o projeto com rede lenta ou indisponível onde isso for relevante.",
      "Escolha uma afirmação de qualidade e produza uma evidência objetiva para ela."
    ],
    "projeto": "Prepare uma versão de portfólio com checklist assinado por evidências: testes, screenshots de estados importantes, medições, instruções de execução e limitações honestas.",
    "conexao": "Daqui em diante, novas funcionalidades voltam ao mesmo ciclo: compreender, decompor, implementar, medir, testar e revisar."
  }
};

const guias:Record<string,{fundamento:string;depuracao:string}>={
  "comecando": {
    "fundamento": "Nesta trilha, o mais importante é construir um método mental. Antes de sintaxe, você aprende a transformar intenções em passos, acompanhar dados e investigar diferenças entre o que esperava e o que aconteceu.",
    "depuracao": "Volte ao menor exemplo possível. Escreva a previsão, execute e localize a primeira linha em que realidade e previsão divergem. A meta não é adivinhar a correção; é produzir evidência."
  },
  "logica": {
    "fundamento": "Lógica trata de estados possíveis e transições entre eles. Tipos definem quais valores existem, condições dividem caminhos, loops repetem transições e funções dão nome a regras reutilizáveis.",
    "depuracao": "Faça uma tabela manual com entradas, valor antes, condição, valor depois e saída. Casos de fronteira devem aparecer explicitamente; muitos bugs vivem exatamente em igualdades e coleções vazias."
  },
  "javascript": {
    "fundamento": "JavaScript é dinâmico: valores podem chegar de formulários, JSON, módulos e Promises. Por isso, acompanhar tipos reais, mutação e momento de execução é tão importante quanto conhecer a sintaxe.",
    "depuracao": "Inspecione primeiro o tipo e o valor reais, depois descubra se a operação é síncrona ou assíncrona e por fim verifique mutação de dados. Reduza o código até a menor expressão que ainda demonstra o comportamento."
  },
  "html": {
    "fundamento": "HTML descreve estrutura e significado. Uma base semântica forte melhora teclado, tecnologias assistivas, SEO, manutenção e reduz a quantidade de JavaScript necessária para imitar comportamentos nativos.",
    "depuracao": "Desligue CSS mentalmente ou de fato. Percorra a ordem do documento e o teclado. Quando algo parece certo visualmente mas funciona mal, procure primeiro elemento semântico, nome acessível, relação label/controle e hierarquia."
  },
  "css": {
    "fundamento": "CSS é um sistema de restrições que resolve valores em contexto. Cascata escolhe regras, box model calcula dimensões, algoritmos de layout distribuem espaço e media/container queries alteram restrições quando necessário.",
    "depuracao": "Use o DevTools para descobrir o valor calculado e a origem da regra. Em layout, procure a primeira restrição que impede o conteúdo de caber; não comece escondendo overflow ou adicionando um breakpoint arbitrário."
  },
  "dom": {
    "fundamento": "DOM conecta estado da aplicação à árvore da interface. Eventos representam intenção, estado representa dados atuais e renderização reflete esse estado. Ciclo de vida garante que recursos parem quando deixam de ser necessários.",
    "depuracao": "Verifique se o handler dispara uma única vez, qual estado existia antes, qual estado existe depois e quais nós foram atualizados. Em bugs após navegação repetida, procure listeners, observers, timers e referências que não foram descartados."
  },
  "apis": {
    "fundamento": "APIs são fronteiras falíveis. Método, URL, status, headers e corpo formam o contrato de transporte; validação de dados, identidade, cache e limites completam o comportamento que a aplicação precisa assumir.",
    "depuracao": "Separe falha de rede, erro HTTP, corpo inválido e regra de domínio. Registre status e estrutura, não segredos. Reproduza com uma requisição mínima antes de mexer na interface."
  },
  "csharp": {
    "fundamento": "C# usa tipos e compilação para transformar parte das suposições em contratos verificáveis antes da execução. Métodos, classes, interfaces, generics e Task permitem expressar responsabilidades com fronteiras claras.",
    "depuracao": "Leia a primeira mensagem do compilador inteira e localize o tipo esperado e recebido. Em runtime, reduza para o método menor que falha e escreva um teste que reproduz exatamente aquela entrada."
  },
  "aspnet": {
    "fundamento": "ASP.NET Core compõe serviços e um pipeline de requisições. Endpoints recebem contratos HTTP, serviços concentram regras, middleware trata preocupações transversais e configuração muda por ambiente sem reescrever o código.",
    "depuracao": "Siga uma requisição completa: rota, binding, validação, dependência, regra, persistência e resposta. Use logs estruturados e testes de integração para localizar em qual fronteira o comportamento diverge."
  },
  "banco": {
    "fundamento": "Banco de dados protege relações e invariantes compartilhados. SQL opera sobre conjuntos; constraints garantem estados válidos; transações agrupam mudanças; índices influenciam caminhos de acesso; parâmetros separam dados de código.",
    "depuracao": "Comece por um SELECT que mostre o conjunto exato envolvido. Verifique chaves e cardinalidade antes de agregações. Em escrita, confirme linhas afetadas e use banco descartável para reproduzir sem risco."
  },
  "fullstack": {
    "fundamento": "Full stack exige raciocinar sobre fronteiras e tempo: interface, rede, servidor, banco e ambiente de produção podem falhar separadamente. Contratos e observabilidade tornam essas falhas localizáveis.",
    "depuracao": "Siga a jornada de ponta a ponta e coloque uma evidência em cada fronteira. Não altere três camadas simultaneamente; descubra primeiro onde o valor ou estado deixa de corresponder ao contrato."
  },
  "projetos": {
    "fundamento": "Projeto real é integração com escopo. Uma versão pequena de ponta a ponta fornece feedback melhor que muitas telas incompletas. Cada incremento deve funcionar, ser testável e deixar o próximo passo claro.",
    "depuracao": "Reproduza pela jornada da pessoa, depois desça pelas camadas até a primeira divergência. Registre a correção como teste, checklist ou decisão de arquitetura para que o mesmo problema não volte silenciosamente."
  }
};

const recortar=(texto:string,limite=92)=>texto.replace(/\s+/g,' ').trim().slice(0,limite)+(texto.replace(/\s+/g,' ').trim().length>limite?'…':'');

function explicarLinha(linha:string,indice:number,linguagem:string):string{
 const limpa=linha.trim();
 if(!limpa)return `Linha ${indice}: espaço visual que separa etapas e ajuda a enxergar blocos.`;
 if(linguagem==='html'){
  if(/^<!doctype/i.test(limpa))return `Linha ${indice}: ativa o modo de padrões do navegador para que o documento seja interpretado pelas regras modernas do HTML.`;
  const tag=limpa.match(/<\/?([a-z0-9-]+)/i)?.[1];
  if(tag)return `Linha ${indice}: trabalha com o elemento <${tag}>. Pergunte qual papel semântico ele possui, quais atributos alteram seu contrato e onde ele se encaixa na árvore do documento.`;
 }
 if(linguagem==='css'){
  if(limpa.includes('{'))return `Linha ${indice}: inicia uma regra ou bloco de CSS. O ponto principal é identificar qual conjunto de elementos ou condição passa a receber as declarações seguintes.`;
  if(limpa.includes(':'))return `Linha ${indice}: declara uma propriedade e um valor. No DevTools, confirme o valor calculado, a unidade e qual regra venceu a cascata.`;
 }
 if(linguagem==='sql'){
  const palavra=limpa.split(/\s+/)[0].toUpperCase();
  if(['SELECT','INSERT','UPDATE','DELETE','CREATE','ALTER','JOIN','LEFT','INNER','WHERE','GROUP','ORDER','BEGIN','COMMIT','ROLLBACK'].includes(palavra))return `Linha ${indice}: começa com ${palavra}, portanto altera a forma do conjunto ou a operação sobre ele. Antes de executar, descreva quais linhas entram e quais devem sair ou ser modificadas.`;
 }
 if(linguagem==='csharp'){
  if(/\b(class|record|interface)\b/.test(limpa))return `Linha ${indice}: declara um tipo e, com ele, um contrato estrutural que o compilador passa a conhecer. Observe responsabilidade, visibilidade e invariantes.`;
  if(/\b(async|await|Task)\b/.test(limpa))return `Linha ${indice}: participa de um fluxo assíncrono. Acompanhe o tipo Task, o ponto de espera e o que pode acontecer enquanto a operação ainda não terminou.`;
  if(/\b(var|int|string|bool|double|decimal)\b/.test(limpa))return `Linha ${indice}: introduz ou usa um valor tipado. Confira qual tipo o compilador conhece e quais operações esse tipo permite.`;
 }
 if(/^(const|let|var)\b/.test(limpa))return `Linha ${indice}: cria ou associa um nome a um valor. Registre mentalmente o tipo, o valor inicial e se esse nome poderá ser reatribuído.`;
 if(/^function\b|=>/.test(limpa))return `Linha ${indice}: define comportamento reutilizável. Identifique entradas, saída e qualquer efeito externo antes de continuar.`;
 if(/^if\b|else\b/.test(limpa))return `Linha ${indice}: divide o fluxo. Escreva um exemplo que torna a condição verdadeira e outro que a torna falsa, incluindo o valor de fronteira.`;
 if(/^(for|while)\b/.test(limpa))return `Linha ${indice}: inicia repetição. Localize estado inicial, condição de parada e a mudança que aproxima o loop do término.`;
 if(/^return\b/.test(limpa))return `Linha ${indice}: encerra a chamada atual devolvendo um valor. A partir daqui, quem chamou a função passa a ser responsável por esse resultado.`;
 if(/console\.log/.test(limpa))return `Linha ${indice}: torna um valor observável no console. Use a saída como evidência, não como substituto para um retorno quando outra parte do programa precisa do dado.`;
 if(/fetch\(/.test(limpa))return `Linha ${indice}: inicia uma operação de rede. A resposta chegará depois e ainda precisará ter status e corpo validados.`;
 return `Linha ${indice}: observe “${recortar(limpa)}”. Pergunte quais valores esta instrução lê, o que ela pode modificar e qual evidência permitiria provar que fez o esperado.`;
}

export function criarCapitulosAula(base:BaseAulaProfunda):CapituloAula[]{
 const roteiro=roteiros[base.id];
 const guia=guias[base.track];
 if(!roteiro||!guia)throw new Error('Conteúdo profundo ausente para '+base.id);
 const linhas=base.code.split('\n').filter(l=>l.trim()).map((linha,i)=>explicarLinha(linha,i+1,base.language));
 const sequencia=[
  base.anterior?`Você chega aqui depois de “${base.anterior}”. Reaproveite esse conhecimento em vez de tratar esta aula como um assunto isolado.`:'Esta é a abertura da trilha. O objetivo é estabelecer uma base que será reutilizada explicitamente nas próximas aulas.',
  base.proxima?`Ao final, “${base.proxima}” será o próximo passo. A conexão existe porque o conceito atual fornece uma ferramenta necessária para compreender o seguinte.`:'Esta aula fecha a trilha. Use o projeto e o checklist final para integrar o que veio antes.'
 ];
 const pratica=[
  `Nível 1 · Reconstrução: refaça o exemplo sem copiar. Pare antes de cada linha e escreva o valor ou efeito que você prevê.`,
  `Nível 2 · Variação: altere uma entrada, regra ou estrutura sem mudar o objetivo central. Explique por que sua alteração continua correta.`,
  `Nível 3 · Fronteira: escolha uma entrada mínima, vazia, limite ou inválida compatível com o tema e defina qual comportamento deveria acontecer.`,
  `Nível 4 · Transferência: aplique o mesmo conceito em um problema diferente do exemplo da aula. Se você só consegue repetir a forma original, ainda falta abstrair a ideia.`
 ];
 return [
  {id:'conexao',titulo:'Onde esta aula entra na jornada',subtitulo:'Nada começa do zero',paragrafos:[...sequencia,roteiro.conexao]},
  {id:'contexto',titulo:'Por que este assunto existe',subtitulo:'O problema antes da sintaxe',paragrafos:[roteiro.contexto,base.body,`A meta não é memorizar “${base.title}”. A meta é conseguir reconhecer quando esse conceito é a ferramenta certa, explicar por que funciona e identificar quando está sendo usado de forma inadequada.`]},
  {id:'modelo-mental',titulo:'Modelo mental',subtitulo:'Uma imagem para raciocinar sem decorar',paragrafos:[roteiro.modelo,guia.fundamento,`Use esse modelo enquanto lê o exemplo. Sempre que uma linha parecer apenas sintaxe, volte à pergunta: qual estado, relação ou contrato ela está representando?`]},
  {id:'passo-a-passo',titulo:'Raciocínio passo a passo',subtitulo:'Como chegar à solução sem saltos',paragrafos:[`Antes de abrir o editor, transforme o problema em decisões observáveis. O caminho abaixo é específico para esta aula e deve ser seguido como raciocínio, não como receita imutável.`],pontos:roteiro.passos},
  {id:'codigo',titulo:'Leia o código como uma execução',subtitulo:'Linha por linha, sem pular intenção',paragrafos:[`Não leia o exemplo apenas procurando palavras conhecidas. Percorra as linhas na ordem em que a linguagem as interpreta e acompanhe entradas, estado e resultado.`],pontos:linhas,codigo:base.code},
  {id:'previsao',titulo:'Preveja antes de executar',subtitulo:'Transforme execução em teste da sua compreensão',paragrafos:[`Antes de clicar em Executar, escreva a saída ou o efeito que você espera. Depois compare. Quando previsão e realidade diferirem, essa diferença mostra exatamente onde existe algo para aprender.`,`Se o resultado coincidir, mude uma única entrada e faça uma nova previsão. Repetir esse ciclo constrói compreensão muito mais sólida que copiar um exemplo que já funciona.`]},
  {id:'experimentos',titulo:'Experimentos controlados',subtitulo:'Mude uma coisa por vez',paragrafos:[`Os três experimentos abaixo não são enfeites. Cada um isola uma propriedade importante de “${base.title}”. Faça a mudança, preveja, execute e explique o resultado.`],pontos:roteiro.experimentos},
  {id:'erro',titulo:'Quando dá errado',subtitulo:'Sintoma, causa e evidência',paragrafos:[base.error,guia.depuracao,`Não corrija pelo sintoma visual. Procure a primeira etapa em que o estado real diverge daquilo que você havia previsto. Essa primeira divergência costuma estar muito mais perto da causa.`],pontos:[`Reproduza com a menor entrada possível.`,`Registre o valor imediatamente antes do ponto suspeito.`,`Formule uma hipótese que possa ser provada falsa.`,`Mude somente o necessário para testar essa hipótese.`,`Depois da correção, repita casos que já funcionavam para evitar regressão.`]},
  {id:'pratica',titulo:'Prática em camadas',subtitulo:'Do entendimento à autonomia',paragrafos:[base.exercise,`Não abra a solução na primeira dificuldade. Volte ao modelo mental, reduza o problema e use o erro como informação. A solução só é útil depois que você consegue dizer onde exatamente ficou bloqueado.`],pontos:pratica},
  {id:'projeto',titulo:'Aplicação real pequena',subtitulo:'Faça o conceito sair do exemplo',paragrafos:[roteiro.projeto,`Defina antes três critérios de aceite observáveis. Quando terminar, tente quebrar sua própria implementação com uma entrada que você não usou durante o desenvolvimento.`]},
  {id:'solucao',titulo:'Compare raciocínios, não apenas linhas',subtitulo:'A solução é uma referência, não um gabarito para copiar',paragrafos:[`Depois de tentar, compare sua abordagem com a solução disponível. Procure diferenças de responsabilidade, tratamento de fronteira e clareza dos nomes. Duas soluções podem ser corretas e ainda possuir qualidades diferentes.`,`Pergunte por que cada parte da solução existe. Se remover uma linha não altera nenhum caso relevante, talvez ela seja desnecessária; se uma regra depende de um caso não testado, crie o teste.`],codigo:base.solution},
  {id:'dominio',titulo:'Como saber se você realmente aprendeu',subtitulo:'Critérios de domínio',paragrafos:[`Você não precisa decorar o exemplo. Considere a aula dominada quando consegue explicar o conceito sem olhar, reconhecer onde ele se aplica, construir uma solução nova e depurar um caso que falha.`],pontos:[`Explico “${base.title}” com minhas próprias palavras e sem repetir a definição da tela.`,`Consigo prever o comportamento do exemplo antes de executar.`,`Consigo alterar o exemplo sem perder o objetivo central.`,`Consigo criar um caso de fronteira relevante e justificar o resultado esperado.`,`Consigo localizar um erro usando evidência em vez de tentativa aleatória.`,`Consigo relacionar esta aula com a anterior e com o próximo assunto da trilha.`]}
 ];
}

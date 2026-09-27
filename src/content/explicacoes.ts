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
    "modelo": "Imagine o programa como uma sequência de mudanças de estado. Cada instrução recebe um estado anterior, faz uma ação permitida pela linguagem e deixa um novo estado para a próxima instrução. Ler código bem é acompanhar essa transformação, e não apenas reconhecer palavras.",
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
    "modelo": "Pense em uma caixa com três lados visíveis. À esquerda estão as entradas; dentro da caixa estão as regras; à direita estão as saídas. Quando um resultado está errado, essa imagem ajuda a perguntar se o dado entrou errado, se a transformação está errada ou se apenas a apresentação está errada.",
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
    "modelo": "Visualize o problema como um mapa de dependências. O resultado final depende de resultados intermediários; cada resultado intermediário depende de dados menores. Quando você consegue desenhar essas dependências, a implementação deixa de ser um salto e vira uma sequência.",
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
    "modelo": "Pense em três portas: leitura, execução e significado. O código precisa atravessar a sintaxe para ser entendido; precisa sobreviver às condições de execução; e finalmente precisa produzir um resultado coerente com o problema real.",
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
    "modelo": "Trate cada bug como um experimento científico. Você tem uma hipótese, uma observação, uma alteração controlada e um novo resultado. Quanto menos coisas você muda de uma vez, mais informação cada tentativa produz.",
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
    "modelo": "Imagine um quadro de estado. Cada nome aponta para um valor atual; uma instrução pode ler esse valor, produzir outro e eventualmente reatribuir o nome. const protege a associação do nome, enquanto o conteúdo de objetos ainda pode mudar.",
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
    "modelo": "Pense em uma árvore de caminhos. Cada condição abre ramos; cada ramo possui um conjunto de entradas que deve chegar até ele. Projetar as fronteiras antes de escrever o if reduz sobreposição e buracos.",
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
    "modelo": "Veja um loop como uma máquina de estados em ciclos. Existe um estado inicial, uma condição verificada, uma transformação e um próximo estado. Se a transformação não aproxima a condição de falso, o ciclo pode nunca terminar.",
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
    "modelo": "Pense em uma função como uma pequena máquina: argumentos entram, regras internas operam e um resultado sai. Efeitos externos existem, mas quanto mais explícitos forem, mais fácil fica testar.",
    "passos": [
      "Defina a responsabilidade da função em uma frase curta.",
      "Liste entradas necessárias e o tipo esperado de cada uma.",
      "Defina o que será retornado e em quais casos especiais.",
      "Evite depender de estado externo quando não for necessário.",
      "Teste a função isoladamente com entradas normais e limites."
    ],
    "experimentos": [
      "Troque console.log por return e use o resultado em outro cálculo.",
      "Crie duas chamadas com argumentos diferentes para provar que a função não depende de um valor fixo.",
      "Introduza uma variável externa e compare a dificuldade de testar antes e depois."
    ],
    "projeto": "Crie uma biblioteca pequena de conversões — minutos para segundos, Celsius para Fahrenheit e percentual de desconto — com testes de casos limites.",
    "conexao": "Funções ficam ainda mais úteis quando trabalham sobre coleções estruturadas, tema da próxima aula."
  },
  "colecoes": {
    "contexto": "Coleções aparecem quando um programa deixa de trabalhar com um único valor e precisa lidar com muitos itens relacionados. Arrays representam ordem; objetos representam propriedades nomeadas; combiná-los permite modelar dados reais.",
    "modelo": "Imagine um inventário físico: a prateleira é o array e cada ficha de produto é um objeto. Algoritmos percorrem a prateleira e leem ou transformam propriedades das fichas.",
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
    "modelo": "Pense na entrada como dado ainda não confiável. Antes de calcular, normalize o texto, converta conscientemente, valide o resultado e só então permita que ele entre no restante da aplicação.",
    "passos": [
      "Preserve o texto original enquanto valida.",
      "Remova apenas espaços que não carregam significado.",
      "Rejeite entrada vazia quando zero não for uma resposta válida.",
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
    "modelo": "Imagine uma linha de produção: filter decide quem entra, map transforma cada item aprovado e reduce combina o fluxo em uma medida final. Não escolha o método pelo tamanho do código; escolha pela operação conceitual.",
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
    "modelo": "Pense no objeto como uma ficha com campos nomeados e no módulo como uma gaveta com recursos públicos e detalhes internos. export define o que outras partes podem usar; import declara uma dependência.",
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
    "modelo": "Imagine duas barreiras: a primeira pergunta 'isto é JSON sintaticamente válido?'; a segunda pergunta 'este dado possui a estrutura e os tipos necessários para o meu domínio?'. try/catch cuida da primeira falha; validação explícita cuida da segunda.",
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
    "modelo": "Pense em cada Promise como um comprovante de uma operação em andamento. await espera aquele comprovante ser resolvido dentro da função assíncrona, enquanto o navegador continua processando outras tarefas.",
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
    "modelo": "Pense no HTML como a planta sem acabamento de uma construção. head descreve o documento; body contém a experiência visível; títulos criam hierarquia; elementos semânticos definem regiões e relações.",
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
    "modelo": "Imagine que o CSS foi desligado. A página ainda deve contar uma história coerente pela ordem e pelos elementos escolhidos. Se o significado depende apenas de cor ou posição, a estrutura está frágil.",
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
    "modelo": "Pense em cada controle como parte de um contrato: label explica a pergunta, value contém a resposta, name define a chave enviada e as restrições descrevem o formato aceitável. O servidor ainda precisa validar novamente.",
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
    "modelo": "Pergunte o que se perde se a imagem não carregar e qual pergunta uma tabela responde. alt comunica a informação perdida; caption e cabeçalhos explicam como ler os dados.",
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
    "modelo": "Pense em múltiplas formas de perceber e operar a mesma interface. Uma pessoa pode usar mouse, teclado, voz, leitor de tela ou ampliação. O objetivo é preservar informação e ação, não produzir experiências idênticas.",
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
    "modelo": "Imagine várias regras concorrendo para fornecer o valor final de cada propriedade. O navegador compara a prioridade de cada candidata e somente depois aplica herança e valores iniciais quando necessário.",
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
    "modelo": "Pense na caixa em camadas concêntricas. box-sizing define se width mede apenas conteúdo ou já inclui padding e borda. Unidades relativas conectam essa caixa ao contexto em vez de fixá-la cegamente.",
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
    "modelo": "Primeiro pense no fluxo normal. Flex cria regras de distribuição entre irmãos; position relative cria uma referência; absolute retira o elemento do fluxo; fixed o relaciona à viewport. Só retire algo do fluxo quando isso for parte real do design.",
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
    "modelo": "Veja o layout como um sistema elástico com limites. Cada região tem um mínimo aceitável, um máximo útil e uma regra de distribuição. O breakpoint ideal aparece quando essas restrições deixam de caber, não quando um aparelho famoso começa.",
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
    "modelo": "Pense em animação como diferença de estado ao longo do tempo. Escolha o que muda, por que muda, quanto muda e por quanto tempo. Transform e opacity geralmente custam menos que propriedades que obrigam novo layout.",
    "passos": [
      "Defina a função da animação antes de escolher duração.",
      "Prefira amplitudes pequenas para estados frequentes.",
      "Use transform e opacity quando possível.",
      "Evite iniciar muitas animações independentes sem coordenação.",
      "Respeite prefers-reduced-motion e mantenha a informação mesmo sem movimento."
    ],
    "experimentos": [
      "Reduza pela metade a distância de uma animação e compare qual versão parece mais natural.",
      "Anime width e depois transform:scaleX, observando impacto de layout no DevTools.",
      "Ative reduced motion e confirme que a interface continua compreensível."
    ],
    "projeto": "Adicione microinterações discretas a uma lista de tarefas: foco, inclusão, conclusão e remoção, com versão reduzida sem perder feedback.",
    "conexao": "A trilha de DOM usa essa base visual para reagir a eventos e transformar a página em uma interface viva."
  },
  "selecionar": {
    "contexto": "Manipular o DOM começa por identificar exatamente qual elemento representa a informação ou ação desejada. Seletores frágeis acoplam JavaScript ao visual e tornam pequenas mudanças de HTML capazes de quebrar comportamento.",
    "modelo": "Veja o DOM como uma árvore de nós com relações. querySelector localiza um ponto dessa árvore; propriedades como textContent, classList e atributos alteram uma parte específica sem exigir reconstruir tudo.",
    "passos": [
      "Escolha seletores baseados em significado ou papéis estáveis.",
      "Confirme se a busca pode retornar null.",
      "Prefira textContent para texto não confiável.",
      "Faça a menor alteração necessária no nó correto.",
      "Evite consultar repetidamente a árvore quando a referência já pode ser mantida."
    ],
    "experimentos": [
      "Selecione por id, classe e atributo data-* e compare acoplamento.",
      "Tente selecionar algo inexistente e trate null conscientemente.",
      "Compare textContent e innerHTML com uma entrada contendo tags."
    ],
    "projeto": "Construa um contador com valor, mensagem de estado e classes visuais, mantendo referências claras aos elementos que realmente mudam.",
    "conexao": "A próxima aula faz essas mudanças acontecerem em resposta a eventos do usuário e do navegador."
  },
  "eventos": {
    "contexto": "Eventos descrevem coisas que aconteceram: clique, digitação, envio, mudança, foco. O código não deve perguntar continuamente se algo aconteceu; ele registra uma reação e recebe o evento quando necessário.",
    "modelo": "Pense em eventos como mensagens que percorrem a árvore do DOM. Captura e bubbling definem o caminho; delegação usa esse percurso para tratar muitos elementos por meio de um ancestral estável.",
    "passos": [
      "Escolha o evento que representa a intenção real, como submit em vez de click no botão.",
      "Registre o listener no elemento com responsabilidade pelo comportamento.",
      "Use event.target e closest com validação quando delegar.",
      "Remova listeners globais quando o componente deixa de existir.",
      "Evite criar um listener novo a cada render sem necessidade."
    ],
    "experimentos": [
      "Escute click no item e no contêiner para observar bubbling.",
      "Adicione itens depois do carregamento e compare listener individual com delegação.",
      "Use preventDefault em submit e explique exatamente qual comportamento padrão foi impedido."
    ],
    "projeto": "Crie uma lista dinâmica em que um único listener no contêiner trata concluir, editar e remover itens identificados por data-*.",
    "conexao": "A próxima aula organiza eventos de formulário em um estado consistente antes de renderizar."
  },
  "estado-formulario": {
    "contexto": "Quando um formulário cresce, ler diretamente o DOM em cada lugar cria múltiplas fontes de verdade. Um estado explícito concentra os dados atuais e permite validar, transformar e renderizar de forma previsível.",
    "modelo": "Use o fluxo evento → validar → atualizar estado → renderizar. O DOM mostra o estado; ele não precisa ser o único lugar onde a regra de negócio vive.",
    "passos": [
      "Defina a estrutura do estado antes dos handlers.",
      "Normalize o valor recebido do formulário.",
      "Valide sem alterar estado quando a entrada é inválida.",
      "Atualize o estado em uma operação previsível.",
      "Renderize a interface a partir do novo estado e preserve foco quando necessário."
    ],
    "experimentos": [
      "Crie uma entrada inválida e confirme que o estado anterior permanece intacto.",
      "Derive um contador a partir da lista em vez de manter duas fontes de verdade.",
      "Recarregue a renderização várias vezes e verifique se handlers não duplicam."
    ],
    "projeto": "Implemente um formulário de despesas com descrição, valor e categoria, exibindo total derivado e erros sem perder os campos válidos.",
    "conexao": "A aula seguinte transforma esse fluxo em componentes com montagem, atualização e desmontagem explícitas."
  },
  "componentes": {
    "contexto": "Um componente saudável possui uma fronteira: recebe dados ou dependências, cria recursos que controla e sabe liberá-los quando deixa de existir. Sem ciclo de vida, timers, observers e listeners podem continuar vivos invisivelmente.",
    "modelo": "Pense no componente como um pequeno sistema com nascimento, vida e descarte. Tudo que ele cria e que pode continuar executando precisa ter um dono e um caminho de limpeza.",
    "passos": [
      "Defina o elemento raiz e os dados recebidos.",
      "Crie listeners, observers e timers apenas durante montagem.",
      "Mantenha referências aos recursos que precisarão ser removidos.",
      "Atualize somente o necessário quando o estado muda.",
      "Na desmontagem, cancele e desconecte tudo que o componente criou."
    ],
    "experimentos": [
      "Monte e desmonte o mesmo componente vinte vezes observando contagem de listeners ou timers.",
      "Crie ResizeObserver e esqueça de disconnect; depois corrija e compare.",
      "Use AbortController como mecanismo único para cancelar múltiplos listeners compatíveis."
    ],
    "projeto": "Crie um painel reutilizável que observa tamanho, atualiza um relógio e responde a um botão, retornando uma função dispose que elimina todos os recursos.",
    "conexao": "Depois de controlar o ciclo de vida, a próxima aula persiste parte do estado entre sessões com armazenamento local."
  },
  "armazenamento": {
    "contexto": "localStorage parece simples, mas dados persistidos sobrevivem ao código que os criou. Versões futuras da aplicação precisam ler formatos antigos, rejeitar dados corrompidos e respeitar limites de espaço.",
    "modelo": "Considere armazenamento como uma fronteira externa, mesmo estando no navegador. Serialize conscientemente, inclua versão, valide ao ler e tenha sempre um estado padrão seguro.",
    "passos": [
      "Defina uma chave estável e uma versão do formato.",
      "Serialize somente dados necessários.",
      "Trate JSON inválido e tipos inesperados na leitura.",
      "Migre versões antigas de maneira explícita.",
      "Limite tamanho e comunique falhas de cota sem apagar o estado atual."
    ],
    "experimentos": [
      "Grave JSON inválido manualmente e verifique recuperação.",
      "Adicione um campo novo mantendo compatibilidade com uma versão antiga.",
      "Simule exceção de quota e confirme que a interface continua usando os dados em memória."
    ],
    "projeto": "Implemente preferências locais versionadas com tema, densidade e filtros, incluindo função de migração e opção de exportar/importar.",
    "conexao": "A trilha de APIs leva essa noção de fronteira para comunicação HTTP com sistemas externos."
  },
  "http": {
    "contexto": "HTTP é um protocolo de mensagens. Uma requisição descreve método, destino, headers e eventualmente corpo; a resposta traz status, headers e corpo. Entender essas peças impede tratar toda falha como 'a API não funcionou'.",
    "modelo": "Pense em cada interação como um envelope de ida e outro de volta. O status resume o resultado do protocolo, mas o corpo carrega detalhes do contrato da aplicação.",
    "passos": [
      "Identifique recurso e rota sem misturar ação no nome quando o método já expressa a operação.",
      "Escolha o método de acordo com a intenção.",
      "Envie Content-Type quando o corpo realmente possui aquele formato.",
      "Interprete classes 2xx, 4xx e 5xx sem reduzir tudo a 200 ou erro.",
      "Valide o corpo separadamente do status."
    ],
    "experimentos": [
      "Compare 200, 201, 204, 400, 404 e 500 em uma API de teste local.",
      "Envie JSON sem Content-Type e observe como o servidor interpreta.",
      "Receba 200 com corpo inesperado para provar que status correto não garante contrato correto."
    ],
    "projeto": "Desenhe o contrato HTTP de uma API de tarefas com rotas, métodos, respostas de sucesso e pelo menos quatro falhas relevantes.",
    "conexao": "A próxima aula aprofunda a semântica dos métodos usados para consultar e modificar recursos."
  },
  "metodos": {
    "contexto": "GET, POST, PUT, PATCH e DELETE não são nomes decorativos: comunicam semântica de leitura e mudança. Escolher corretamente melhora previsibilidade, cache, repetição segura e documentação.",
    "modelo": "Veja o recurso como um estado no servidor. GET observa; POST normalmente cria ou dispara uma operação; PUT substitui uma representação; PATCH altera parte; DELETE solicita remoção.",
    "passos": [
      "Defina qual recurso está sendo manipulado.",
      "Decida se a operação apenas lê ou muda estado.",
      "Escolha se a atualização representa substituição completa ou parcial.",
      "Pense no que acontece se a mesma requisição for repetida.",
      "Defina status e corpo coerentes para sucesso e falha."
    ],
    "experimentos": [
      "Repita um PUT idêntico e compare com repetir um POST de criação.",
      "Envie PATCH com apenas um campo e defina o que acontece com os demais.",
      "Tente DELETE duas vezes e escolha uma resposta consistente para a segunda tentativa."
    ],
    "projeto": "Especifique e implemente em uma API local CRUD de notas com métodos e status coerentes, incluindo validação e recurso inexistente.",
    "conexao": "A próxima aula mostra como o navegador chama esses contratos com fetch e como cancela requisições obsoletas."
  },
  "fetch-estados": {
    "contexto": "fetch resolve transporte, não toda a experiência. Uma interface precisa representar tempo de espera, falha de rede, erro HTTP, corpo inválido, ausência de resultados e cancelamento sem confundir esses estados.",
    "modelo": "Separe a máquina de estados da interface da Promise de rede. A Promise termina uma operação; o estado informa o que a pessoa deve ver e fazer em cada momento.",
    "passos": [
      "Crie AbortController antes da requisição quando cancelamento for possível.",
      "Marque carregamento e preserve dados antigos quando isso fizer sentido.",
      "Cheque response.ok e depois valide o formato do corpo.",
      "Ignore cancelamentos esperados sem exibi-los como erro.",
      "Em finally, libere estados transitórios somente se aquela requisição ainda for a atual."
    ],
    "experimentos": [
      "Atrase artificialmente uma resposta e inicie outra mais recente.",
      "Retorne HTML onde JSON era esperado e trate a falha de parsing.",
      "Interrompa a rede e verifique se existe caminho de tentar novamente."
    ],
    "projeto": "Crie uma busca de cidades que cancela a consulta anterior, mantém última resposta válida e diferencia 'nenhum resultado' de 'falha ao consultar'.",
    "conexao": "Quando chamadas passam a depender de identidade e permissões, entra a distinção entre autenticação e autorização."
  },
  "identidade-api": {
    "contexto": "Autenticação responde quem é a identidade; autorização responde o que essa identidade pode fazer. Confundir as duas produz APIs que aceitam ações apenas porque alguém conseguiu provar quem é.",
    "modelo": "Imagine duas catracas. A primeira valida uma credencial e associa uma identidade à requisição. A segunda compara essa identidade, o recurso e a ação com uma política de acesso.",
    "passos": [
      "Defina quais rotas realmente precisam de identidade.",
      "Valide credenciais no servidor, nunca por confiança em campos enviados pelo cliente.",
      "Associe identidade autenticada à requisição de forma verificável.",
      "Aplique autorização por ação e recurso.",
      "Evite expor segredos em logs, URLs ou armazenamento inadequado do cliente."
    ],
    "experimentos": [
      "Compare uma requisição não autenticada, autenticada sem permissão e autenticada com permissão.",
      "Tente enviar manualmente um id de usuário diferente e confirme que o servidor usa a identidade autenticada, não o campo do corpo.",
      "Revise logs e mensagens de erro para garantir que tokens não aparecem."
    ],
    "projeto": "Modele uma API de anotações privadas em que cada pessoa só pode consultar e alterar os próprios registros, documentando os pontos de autenticação e autorização.",
    "conexao": "Mesmo uma API autorizada precisa lidar com volume, cache e falhas externas, assunto da próxima aula."
  },
  "limites-cache": {
    "contexto": "Sistemas reais têm latência, limites de requisição e indisponibilidade. Cache e rate limit são mecanismos de controle, não atalhos: precisam de validade, escopo e comportamento claro quando os dados envelhecem.",
    "modelo": "Pense em cache como uma cópia com relógio e identidade. Antes de reutilizar, você precisa saber de qual recurso ela é, quando foi obtida e por quanto tempo continua aceitável.",
    "passos": [
      "Defina a chave de cache com todos os fatores que alteram a resposta.",
      "Estabeleça validade e limite de quantidade armazenada.",
      "Deduplique requisições simultâneas iguais.",
      "Respeite sinais de rate limit e use espera apropriada.",
      "Ao usar dado antigo, identifique explicitamente que ele pode estar desatualizado."
    ],
    "experimentos": [
      "Faça duas consultas iguais simultâneas e garanta uma única chamada externa.",
      "Avance o relógio além da validade e confirme nova consulta.",
      "Simule 429 e implemente uma espera sem criar tempestade de retries."
    ],
    "projeto": "Construa uma camada de cache para clima ou catálogo com TTL, limite de entradas, deduplicação, cancelamento e fallback antigo rotulado.",
    "conexao": "A trilha seguinte leva essas ideias para C# e .NET, começando pelo ambiente de execução e sistema de tipos."
  },
  "dotnet": {
    "contexto": "O .NET SDK reúne compilador, runtime, ferramentas de projeto e comandos. C# é a linguagem; .NET é a plataforma que compila e executa o programa. Separar essas ideias ajuda a interpretar erros de build, runtime e dependências.",
    "modelo": "Pense no projeto como uma unidade descrita pelo .csproj. O SDK lê essa descrição, restaura dependências, compila código C# para IL e o runtime executa o resultado conforme o framework alvo.",
    "passos": [
      "Confirme versão do SDK e TargetFramework do projeto.",
      "Entenda onde o ponto de entrada começa no modelo moderno de top-level statements.",
      "Use tipos adequados e deixe o compilador ajudar a encontrar combinações inválidas.",
      "Compile frequentemente para reduzir o conjunto de mudanças entre erros.",
      "Diferencie erro de restauração, compilação e execução."
    ],
    "experimentos": [
      "Execute dotnet --info e compare com o TargetFramework.",
      "Troque int por string em um cálculo e leia a mensagem do compilador sem corrigi-la de imediato.",
      "Crie um projeto console mínimo e observe arquivos gerados por build."
    ],
    "projeto": "Crie um console .NET 10 que recebe dados simples, valida, calcula um resultado e possui uma função separada para a regra principal.",
    "conexao": "Com o ambiente entendido, a próxima aula usa condições, loops e métodos na sintaxe e no sistema de tipos do C#."
  },
  "csharp-controle": {
    "contexto": "C# oferece estruturas de controle familiares, mas o compilador e os tipos tornam muitas intenções mais explícitas. Métodos ajudam a isolar regras e pattern matching pode tornar decisões sobre dados mais legíveis.",
    "modelo": "Acompanhe estado e fluxo como na lógica geral, mas use assinaturas de métodos para declarar contrato. O tipo de retorno e dos parâmetros já elimina várias classes de ambiguidade antes da execução.",
    "passos": [
      "Defina assinatura do método antes do corpo.",
      "Use condições que expressem diretamente as regras do domínio.",
      "Escolha foreach quando o objetivo é visitar itens e for quando o índice realmente importa.",
      "Garanta que todos os caminhos retornem valor quando o método exige.",
      "Teste limites usando chamadas pequenas e previsíveis."
    ],
    "experimentos": [
      "Converta um if encadeado em switch expression quando os casos forem discretos.",
      "Compare for e foreach sobre a mesma coleção.",
      "Faça o compilador apontar um caminho sem return e leia a mensagem completa."
    ],
    "projeto": "Implemente um calculador de frete com método que recebe peso, distância e categoria, retornando um resultado tipado e testável.",
    "conexao": "A próxima aula passa de métodos isolados para objetos que mantêm estado e cumprem contratos por interfaces."
  },
  "csharp-objetos": {
    "contexto": "Orientação a objetos é útil quando dados e regras pertencem ao mesmo conceito com ciclo de vida próprio. Classes não devem existir apenas para embrulhar funções; elas devem proteger invariantes e expor operações coerentes.",
    "modelo": "Veja uma classe como guardiã de um estado válido. Construtores estabelecem condições iniciais, propriedades expõem apenas o necessário e métodos realizam transições permitidas. Interfaces descrevem capacidades sem exigir uma implementação específica.",
    "passos": [
      "Defina quais invariantes o objeto deve sempre preservar.",
      "Receba dados necessários no construtor quando o objeto não faz sentido sem eles.",
      "Evite setters públicos para estados que exigem validação.",
      "Use composição antes de herança quando a relação não for realmente 'é um'.",
      "Extraia interface quando consumidores precisam do contrato e múltiplas implementações são plausíveis."
    ],
    "experimentos": [
      "Transforme uma propriedade pública mutável em operação validada.",
      "Compare herança e composição em um exemplo de notificação.",
      "Substitua uma implementação por fake através de interface num teste."
    ],
    "projeto": "Modele uma Conta simples que não permite saldo inválido por atribuição direta e oferece operações Depositar e Sacar com regras explícitas.",
    "conexao": "Objetos normalmente vivem em coleções; a próxima aula usa generics e LINQ para trabalhar com conjuntos tipados."
  },
  "csharp-colecoes": {
    "contexto": "Generics preservam informação de tipo enquanto estruturas e algoritmos são reutilizados. LINQ cria uma linguagem de consulta sobre coleções, mas cada operação ainda possui custo e semântica que precisam ser entendidos.",
    "modelo": "Pense em IEnumerable<T> como uma sequência que pode ser percorrida. Operadores LINQ compõem uma consulta; muitos são avaliados apenas quando a sequência é enumerada, o que torna execução adiada importante.",
    "passos": [
      "Escolha a coleção pela operação dominante, não apenas por hábito.",
      "Mantenha T explícito no modelo mental mesmo quando var aparece no código.",
      "Diferencie filtrar, projetar, agrupar e agregar.",
      "Saiba quando a consulta é executada e se será enumerada mais de uma vez.",
      "Materialize com ToList quando uma fotografia dos resultados é realmente necessária."
    ],
    "experimentos": [
      "Crie uma consulta LINQ, altere a fonte antes de enumerar e observe execução adiada.",
      "Compare First, FirstOrDefault e Single em coleções com zero, um e vários itens.",
      "Agrupe dados e calcule agregações por chave."
    ],
    "projeto": "Construa um relatório de pedidos que filtra período, agrupa por cliente e calcula quantidade e total usando LINQ.",
    "conexao": "A última aula de C# junta falhas, arquivos, assincronismo e testes para tornar programas mais robustos."
  },
  "csharp-async": {
    "contexto": "Exceções, I/O e async aparecem juntas porque operações externas falham e levam tempo. Em C#, Task representa trabalho assíncrono; await preserva fluxo legível sem bloquear uma thread enquanto a operação espera.",
    "modelo": "Separe falhas esperadas do domínio de falhas técnicas. Use exceções quando não há resultado normal para continuar; capture apenas onde existe uma decisão útil. Em I/O assíncrono, propague Task até a fronteira adequada.",
    "passos": [
      "Valide condições de domínio antes de iniciar I/O quando possível.",
      "Use await em APIs assíncronas em vez de bloquear com .Result ou .Wait().",
      "Capture exceções específicas somente onde há recuperação, tradução ou registro útil.",
      "Use using/await using para recursos descartáveis.",
      "Escreva testes sobre comportamento observável, incluindo falhas."
    ],
    "experimentos": [
      "Compare File.ReadAllText e ReadAllTextAsync numa operação simulada maior.",
      "Crie um método async que lança e teste com Assert.ThrowsAsync.",
      "Introduza CancellationToken e cancele uma operação cooperativa."
    ],
    "projeto": "Crie um importador assíncrono de arquivo JSON que valida conteúdo, suporta cancelamento e possui testes para arquivo válido, ausente e inválido.",
    "conexao": "A trilha ASP.NET Core usa esses fundamentos para receber requisições HTTP em uma aplicação real."
  },
  "aspnet-projeto": {
    "contexto": "Uma aplicação ASP.NET Core moderna é montada em Program.cs: serviços são registrados, o pipeline é configurado e rotas são mapeadas. Entender essa composição evita tratar o framework como magia.",
    "modelo": "Pense na aplicação em duas fases. Na construção, você registra capacidades no contêiner; em execução, cada requisição atravessa middleware e chega a um endpoint que usa as dependências necessárias.",
    "passos": [
      "Leia o .csproj para saber framework e pacotes.",
      "Identifique WebApplication.CreateBuilder e o registro de serviços.",
      "Observe WebApplication.Build como a transição para o app executável.",
      "Mapeie middleware na ordem em que requisições devem atravessá-lo.",
      "Mapeie endpoints e teste cada rota pelo contrato HTTP."
    ],
    "experimentos": [
      "Crie uma Minimal API com /saude e /tarefas.",
      "Mude a ordem de dois middleware simples e registre o caminho da requisição.",
      "Leia configuração por ambiente sem colocar segredo no código."
    ],
    "projeto": "Monte uma API .NET 10 mínima com health check, endpoint de leitura e endpoint de criação validado em memória.",
    "conexao": "A próxima aula explica como serviços registrados entram nos endpoints sem criação manual espalhada pelo código."
  },
  "aspnet-di": {
    "contexto": "Injeção de dependência separa o que uma classe precisa de como essa dependência é construída. O contêiner do ASP.NET Core gerencia criação e ciclo de vida, mas escolhas erradas de lifetime podem compartilhar ou reter estado indevidamente.",
    "modelo": "Veja o construtor ou parâmetro de endpoint como uma lista explícita de necessidades. O contêiner possui receitas para fornecer cada contrato. Singleton, scoped e transient definem por quanto tempo cada instância deve viver.",
    "passos": [
      "Dependa de abstrações quando isso reduz acoplamento real.",
      "Registre a implementação em um único ponto de composição.",
      "Escolha scoped para dependências ligadas à requisição, quando apropriado.",
      "Evite capturar serviço scoped dentro de singleton.",
      "Nos testes, substitua implementações por fakes focados no contrato."
    ],
    "experimentos": [
      "Registre um serviço transient e conte quantas instâncias aparecem na mesma requisição.",
      "Compare com scoped em dois pontos da mesma requisição e em duas requisições diferentes.",
      "Tente criar dependência de lifetime incompatível e entenda o risco antes de apenas corrigir."
    ],
    "projeto": "Extraia a regra de tarefas para ITarefaService e injete uma implementação em memória nos endpoints, preparando substituição futura por persistência.",
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
      "Adicione uma propriedade interna e confirme que ela não aparece no DTO de saída.",
      "Envie título vazio, longo e null e padronize a resposta de validação.",
      "Compare retornar entidade diretamente com mapear explicitamente."
    ],
    "projeto": "Implemente CreateTarefaRequest e TarefaResponse separados e um endpoint que devolve 201 com Location após criação.",
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
      "Crie dois middleware que registram antes/depois e observe a ordem de retorno.",
      "Lance uma exceção num endpoint e trate-a globalmente.",
      "Mude uma configuração por variável de ambiente e confirme precedência."
    ],
    "projeto": "Adicione logging estruturado, correlation id e tratamento global de erro à API de tarefas sem duplicar try/catch em cada endpoint.",
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
      "Tente acessar rota protegida sem credencial, com credencial inválida e sem permissão.",
      "Envie corpo acima do limite e observe rejeição controlada.",
      "Revise logs de falha e procure qualquer token ou segredo exposto."
    ],
    "projeto": "Proteja um conjunto de endpoints por usuário, acrescente rate limit e escreva testes de integração para acesso permitido, negado e entrada inválida.",
    "conexao": "A trilha de banco de dados mostra como persistir esse estado preservando relações e consistência."
  },
  "sql-modelagem": {
    "contexto": "Modelagem define o significado dos dados antes das consultas. Uma tabela precisa representar uma entidade ou relação coerente; chaves e restrições transformam regras do domínio em garantias do banco.",
    "modelo": "Pense no banco como guardião de invariantes compartilhados por todos os clientes. A aplicação ajuda o usuário, mas constraints impedem que outra conexão grave estados impossíveis.",
    "passos": [
      "Defina o que cada linha representa em uma frase.",
      "Escolha uma chave primária estável.",
      "Separe entidades quando grupos de dados possuem ciclos de vida diferentes.",
      "Use chaves estrangeiras para relações que precisam existir.",
      "Adicione NOT NULL, UNIQUE e CHECK quando a regra pertence aos dados."
    ],
    "experimentos": [
      "Tente inserir duas linhas com a mesma chave única.",
      "Crie uma foreign key e tente apontar para registro inexistente.",
      "Compare armazenar lista separada por vírgulas com modelar uma relação própria."
    ],
    "projeto": "Modele usuários, projetos e tarefas com chaves, relações e restrições suficientes para impedir tarefas sem projeto válido.",
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
      "Compare DELETE com marcar um estado de arquivado quando histórico precisa ser preservado."
    ],
    "projeto": "Crie operações CRUD para tarefas e um roteiro de teste que prova criação, consulta, edição restrita a um id e remoção.",
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
      "Calcule COUNT(*) e COUNT(coluna) em presença de NULL."
    ],
    "projeto": "Gere relatório por projeto com quantidade de tarefas, concluídas e última atualização, preservando projetos sem tarefas.",
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
      "Use uma constraint dentro da transação para provocar rollback."
    ],
    "projeto": "Implemente transferência de pontos entre duas contas garantindo que saldo não fique negativo e que nenhuma metade da operação seja persistida sozinha.",
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
      "Num banco local de laboratório, compare uma consulta concatenada vulnerável com a equivalente parametrizada sem usar o exemplo contra sistemas de terceiros."
    ],
    "projeto": "Revise um CRUD local: parametrize todas as entradas, adicione somente os índices justificados por consultas medidas e documente a razão de cada um.",
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

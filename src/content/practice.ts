import type {Capability} from '../learning/types';

export type PracticeLanguage = 'html'|'css'|'javascript'|'typescript'|'python'|'csharp'|'cpp'|'sql';
export type PracticeKind = 'debug'|'predict'|'order'|'fill'|'choice';
export type PracticeActivity = {
 id:string; language:PracticeLanguage; lessonIds:string[]; skillIds:string[];
 afterBlock:number; kind:PracticeKind; capability:Capability; requiresConcept?:boolean;
 title:string; prompt:string; code?:string; options?:{id:string;text:string}[];
 lines?:{id:string;code:string}[]; hint:string; minutes:number;
};
/** Display metadata only. Local verification data are inspectable in the downloaded bundle;
 * "reserved" cases means withheld during the attempt, never secret or tamper proof. */
export const practiceActivities:PracticeActivity[]=[
 {
  id:'erros-prever-area',language:'javascript',lessonIds:['tipos-erros'],skillIds:['javascript.erros.contrato'],afterBlock:3,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'Terminar não comprova o cálculo',prompt:'Preveja as duas linhas. O programa termina normalmente; depois compare qual operação corresponde à área de um retângulo de base 4 e altura 3.',
  code:'const base = 4, altura = 3;\nconsole.log(base + altura);\nconsole.log(base * altura);',hint:'A saída é o que a instrução calcula, mesmo quando a intenção escrita pede outra operação.',minutes:2
 },
 {
  id:'erros-localizar-interrupcao',language:'javascript',lessonIds:['tipos-erros'],skillIds:['javascript.erros.interrupcao'],afterBlock:6,kind:'choice',capability:'depuracao',requiresConcept:true,
  title:'Em qual etapa a execução para?',prompt:'Não existe uma definição de altura neste programa. Escolha a descrição do comportamento. A escolha é conceitual; ela não executa seu código.',
  code:'console.log("Antes");\nconsole.log(altura);\nconsole.log("Depois");',hint:'Um identificador válido na sintaxe ainda precisa encontrar uma definição quando é lido. Acompanhe a primeira chamada antes dessa leitura.',minutes:3,
  options:[{id:'execucao',text:'Mostra Antes e lança ReferenceError ao ler altura; não chega a Depois.'},{id:'sintaxe',text:'O nome altura torna o programa sintaticamente inválido, antes de qualquer saída.'},{id:'logica',text:'Mostra Antes, undefined e Depois, sem interromper a execução.'}]
 },
 {
  id:'erros-corrigir-area',language:'javascript',lessonIds:['tipos-erros'],skillIds:['javascript.erros.correcao'],afterBlock:8,kind:'debug',capability:'depuracao',requiresConcept:true,
  title:'Corrija a regra e prove com outras dimensões',prompt:'Corrija area(base, altura) para devolver a área numérica do retângulo. As dimensões são números finitos entre 0 e 100, inclusive frações; zero produz área zero. Não arredonde, não devolva texto e não acumule chamadas. Mantenha os dois parâmetros. O corretor executa seu código em JavaScript isolado; validar entradas fora desse contrato não é parte desta atividade.',
  code:'function area(base, altura) {\n  return base + altura;\n}',hint:'Uma operação pode ser válida para a linguagem e errada para o domínio. Compare dimensões diferentes, uma dimensão zero e um quadrado.',minutes:5
 },
 {
  id:'investigar-prever-padrao',language:'javascript',lessonIds:['investigar'],skillIds:['javascript.investigacao.rastreamento'],afterBlock:3,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'O caso comum esconde a fronteira',prompt:'Preveja as três linhas. Neste trecho, valor || 1 escolhe 1 quando valor é zero. Registre o comportamento escrito antes de decidir como corrigi-lo.',
  code:'function dobro(valor) {\n  return (valor || 1) * 2;\n}\nconsole.log(dobro(4));\nconsole.log(dobro(-3));\nconsole.log(dobro(0));',hint:'Positivo e negativo não zero passam pela multiplicação com o próprio valor; acompanhe separadamente a escolha feita para zero.',minutes:3
 },
 {
  id:'investigar-isolar-fronteira',language:'javascript',lessonIds:['investigar'],skillIds:['javascript.investigacao.hipoteses'],afterBlock:6,kind:'choice',capability:'depuracao',requiresConcept:true,
  title:'Qual evidência sustenta uma hipótese?',prompt:'O contrato exige o dobro de qualquer número entre −100 e 100. Os testes de 4 e −3 passaram, mas 0 produziu 2. Escolha o próximo diagnóstico útil, sem mudar várias partes ao mesmo tempo. Esta decisão é conceitual.',
  code:'function dobro(valor) {\n  return (valor || 1) * 2;\n}',hint:'Diferencie o que foi observado de uma causa ainda não demonstrada. Um caso aprovado não elimina a fronteira que já falhou.',minutes:3,
  options:[{id:'isolar',text:'Reproduzir somente dobro(0), comparar 0 com o valor escolhido por (valor || 1), alterar essa escolha e repetir os três casos.'},{id:'tipo',text:'Concluir que 0 virou string e adicionar Number em todas as operações, sem observar os valores.'},{id:'ignorar',text:'Ignorar zero: dois testes aprovados bastam para cumprir o contrato inteiro.'}]
 },
 {
  id:'investigar-corrigir-dobro',language:'javascript',lessonIds:['investigar'],skillIds:['javascript.investigacao.regressao'],afterBlock:8,kind:'debug',capability:'depuracao',requiresConcept:true,
  title:'Corrigir a fronteira sem quebrar os casos anteriores',prompt:'Altere dobro(valor) para devolver numericamente o dobro de cada número finito entre −100 e 100, inclusive zero e frações. Não arredonde nem use estado de chamadas anteriores. O corretor executa o código e repete casos comuns e de fronteira. Entradas fora desse intervalo não fazem parte do contrato.',
  code:'function dobro(valor) {\n  return (valor || 1) * 2;\n}',hint:'Zero é uma entrada válida. Remover seu valor com um padrão muda a entrada antes mesmo da multiplicação; depois da correção, confira também positivo e negativo.',minutes:5
 },
 {
  id:'colecoes-prever-unidades',language:'javascript',lessonIds:['colecoes'],skillIds:['javascript.colecoes.quantidade'],afterBlock:3,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'Quantidade de registros ou quantidade de unidades?',prompt:'Preveja as duas linhas: primeiro o total de unidades, depois o número de fichas. Fichas distintas podem ter o mesmo nome e a mesma quantidade; cada uma continua contribuindo.',
  code:'const itens = [{nome:"Lápis",quantidade:2},{nome:"Caderno",quantidade:0},{nome:"Lápis",quantidade:2}];\nlet total = 0;\nfor (const item of itens) total += item.quantidade;\nconsole.log(total);\nconsole.log(itens.length);',hint:'length conta fichas; a acumulação soma a propriedade quantidade, inclusive de registros repetidos.',minutes:3
 },
 {
  id:'colecoes-diagnosticar-limite',language:'javascript',lessonIds:['colecoes'],skillIds:['javascript.lacos.fronteiras'],afterBlock:6,kind:'choice',capability:'depuracao',requiresConcept:true,
  title:'A posição depois do último item',prompt:'A lista possui dois itens, nas posições 0 e 1. O laço falha quando tenta ler quantidade da posição 2. Qual condição visita todos os itens e também não entra no corpo para uma lista vazia? Escolha conceitual, sem executar código do aluno.',
  code:'let total = 0;\nfor (let indice = 0; indice <= itens.length; indice++) {\n  total += itens[indice].quantidade;\n}',hint:'Compare o último índice válido com a quantidade de itens. Teste mentalmente também length igual a zero.',minutes:3,
  options:[{id:'menor',text:'indice < itens.length'},{id:'ultimo-fora',text:'indice < itens.length - 1'},{id:'igual',text:'indice <= itens.length'}]
 },
 {
  id:'colecoes-corrigir-acumulacao',language:'javascript',lessonIds:['colecoes'],skillIds:['javascript.colecoes.acumulacao'],afterBlock:8,kind:'debug',capability:'depuracao',requiresConcept:true,
  title:'Conserve cada contribuição do estoque',prompt:'Corrija totalEstoque(itens): devolva um número com a soma de todas as quantidades; lista vazia devolve 0. Cada item tem nome textual e quantidade inteira de 0 a 1000; a lista tem até 100 itens. Nomes e quantidades podem repetir e todos contribuem. Preserve a lista, a ordem e os objetos recebidos. Chamadas são independentes. O corretor executa JavaScript isolado; não é preciso validar dados fora deste contrato.',
  code:'function totalEstoque(itens) {\n  let total = 0;\n  for (const item of itens) {\n    total = item.quantidade;\n  }\n  return total;\n}',hint:'A atribuição atual substitui o que já havia sido acumulado. Acompanhe o total após cada ficha e confira se os dados originais continuam iguais.',minutes:6
 },
{
 "id": "inicio-prever-ordem",
 "language": "javascript",
 "lessonIds": [
  "programar"
 ],
 "skillIds": [
  "javascript.instrucoes.ordem"
 ],
 "afterBlock": 3,
 "kind": "predict",
 "capability": "leitura",
 "requiresConcept": true,
 "title": "A ordem também é parte do programa",
 "prompt": "Preveja as três linhas, sem aspas. Não execute antes de registrar: uma instrução repetida continua sendo executada; o computador não elimina etapas por parecerem iguais.",
 "code": "console.log(\"Preparar\");\nconsole.log(\"Testar\");\nconsole.log(\"Preparar\");",
 "hint": "Percorra de cima para baixo e registre cada chamada, incluindo a repetida.",
 "minutes": 2
},
{
 "id": "inicio-diagnosticar-texto",
 "language": "javascript",
 "lessonIds": [
  "programar"
 ],
 "skillIds": [
  "javascript.instrucoes.texto"
 ],
 "afterBlock": 6,
 "kind": "choice",
 "capability": "depuracao",
 "requiresConcept": true,
 "title": "Texto ou nome que o programa deveria procurar?",
 "prompt": "O objetivo é mostrar Café. Não existe variável chamada cafe. Escolha a alteração que expressa diretamente esse texto e mantém uma instrução válida. Esta escolha é conceitual; não executa o programa do aluno.",
 "code": "console.log(cafe);",
 "hint": "Aspas delimitam o texto. Sem elas, o programa tenta resolver um nome; dizer a intenção no console não cria esse nome.",
 "minutes": 3,
 "options": [
  {
   "id": "texto",
   "text": "console.log(\"Café\");"
  },
  {
   "id": "nome",
   "text": "console.log(Café);"
  },
  {
   "id": "incompleto",
   "text": "console.log(\"Café);"
  }
 ]
},
{
 "id": "inicio-reconstruir-roteiro",
 "language": "javascript",
 "lessonIds": [
  "programar"
 ],
 "skillIds": [
  "javascript.instrucoes.sequencia"
 ],
 "afterBlock": 8,
 "kind": "order",
 "capability": "alteracao",
 "requiresConcept": true,
 "title": "Reconstrua a sequência observável",
 "prompt": "Organize as três instruções para registrar Abrir, Testar e Fechar, nessa ordem. O contrato exige uma linha para cada ação. Isto registra texto: não abre nem fecha um arquivo real.",
 "code": "",
 "hint": "Compare a primeira saída desejada com a primeira chamada; uma linha válida no lugar errado ainda quebra o roteiro.",
 "minutes": 3,
 "lines": [
  {
   "id": "fechar",
   "code": "console.log(\"Fechar\");"
  },
  {
   "id": "abrir",
   "code": "console.log(\"Abrir\");"
  },
  {
   "id": "testar",
   "code": "console.log(\"Testar\");"
  }
 ]
},
{
 "id": "entrada-prever-zero",
 "language": "javascript",
 "lessonIds": [
  "entrada-saida"
 ],
 "skillIds": [
  "javascript.fluxo.zero"
 ],
 "afterBlock": 3,
 "kind": "predict",
 "capability": "leitura",
 "requiresConcept": true,
 "title": "Quantidade zero não apaga o frete",
 "prompt": "Preveja as duas linhas de saída, sem unidade. Neste contrato o frete é fixo e é cobrado mesmo quando a quantidade vale zero; o programa não implementa a política comercial de nenhuma loja.",
 "code": "const quantidade = 0;\nconst precoUnitario = 12;\nconst frete = 7;\nconst subtotal = quantidade * precoUnitario;\nconsole.log(subtotal);\nconsole.log(subtotal + frete);",
 "hint": "Separe subtotal e total. Zero é uma entrada numérica válida; a regra ainda soma o frete uma vez.",
 "minutes": 3
},
{
 "id": "entrada-diagnosticar-unidade",
 "language": "javascript",
 "lessonIds": [
  "entrada-saida"
 ],
 "skillIds": [
  "javascript.fluxo.unidades"
 ],
 "afterBlock": 6,
 "kind": "choice",
 "capability": "depuracao",
 "requiresConcept": true,
 "title": "O frete foi cobrado uma vez por item",
 "prompt": "São três unidades de 1200 centavos e frete fixo de 700 centavos. O esperado é 4300, mas o código produz 5700. Escolha a expressão que mantém as unidades e aplica o frete exatamente uma vez.",
 "code": "const total = quantidade * (precoUnitario + frete);",
 "hint": "Multiplicar o grupo inteiro pela quantidade também multiplica o frete. Desenhe primeiro o subtotal e depois o custo fixo.",
 "minutes": 4,
 "options": [
  {
   "id": "separar",
   "text": "quantidade * precoUnitario + frete"
  },
  {
   "id": "somar",
   "text": "quantidade + precoUnitario + frete"
  },
  {
   "id": "ignorar",
   "text": "quantidade * precoUnitario"
  }
 ]
},
{
 "id": "entrada-corrigir-total",
 "language": "javascript",
 "lessonIds": [
  "entrada-saida"
 ],
 "skillIds": [
  "javascript.fluxo.transformacao"
 ],
 "afterBlock": 8,
 "kind": "debug",
 "capability": "producao",
 "requiresConcept": true,
 "title": "Faça a transformação funcionar com outras entradas",
 "prompt": "Corrija calcularTotal(quantidade, precoUnitario, frete). Receba números inteiros: quantidade de 0 a 100; preço unitário de 0 a 100000 centavos; frete de 0 a 50000 centavos. Devolva um número de centavos, com o frete fixo somado uma única vez, inclusive para quantidade zero. Não arredonde nem converta em texto. O molde da função já está dado: altere a transformação após return. A verificação executa entradas variadas; não exige validação fora dessas faixas.",
 "code": "function calcularTotal(quantidade, precoUnitario, frete) {\n  return quantidade * (precoUnitario + frete);\n}",
 "hint": "Comece pelo resultado da multiplicação em centavos. Depois combine o custo que não depende da quantidade. Confira zero e chamadas consecutivas.",
 "minutes": 5
},
{
 "id": "passos-prever-media",
 "language": "javascript",
 "lessonIds": [
  "passos"
 ],
 "skillIds": [
  "javascript.decomposicao.rastreamento"
 ],
 "afterBlock": 3,
 "kind": "predict",
 "capability": "leitura",
 "requiresConcept": true,
 "title": "A terceira entrada muda duas etapas",
 "prompt": "Preveja as duas linhas. A soma inclui três notas; a quantidade do divisor precisa corresponder ao mesmo conjunto.",
 "code": "const primeira = 7, segunda = 9, terceira = 5;\nconst soma = primeira + segunda + terceira;\nconst media = soma / 3;\nconsole.log(soma);\nconsole.log(media);",
 "hint": "Registre a soma primeiro e depois conte quantas notas contribuíram para ela.",
 "minutes": 3
},
{
 "id": "passos-ordenar-dependencias",
 "language": "javascript",
 "lessonIds": [
  "passos"
 ],
 "skillIds": [
  "javascript.decomposicao.dependencias"
 ],
 "afterBlock": 6,
 "kind": "order",
 "capability": "leitura",
 "requiresConcept": true,
 "title": "Uma etapa precisa receber o resultado anterior",
 "prompt": "Ordene todas as linhas para calcular e mostrar a média das três notas. As declarações const não podem ser lidas antes de serem inicializadas. Cada linha do conjunto deve aparecer uma vez.",
 "code": "",
 "hint": "Identifique o que cada linha lê e o que ela define. A saída depende da média; a média depende da soma.",
 "minutes": 4,
 "lines": [
  {
   "id": "mostrar",
   "code": "console.log(media);"
  },
  {
   "id": "dividir",
   "code": "const media = soma / 3;"
  },
  {
   "id": "entradas",
   "code": "const primeira = 7, segunda = 9, terceira = 5;"
  },
  {
   "id": "somar",
   "code": "const soma = primeira + segunda + terceira;"
  }
 ]
},
{
 "id": "passos-corrigir-media",
 "language": "javascript",
 "lessonIds": [
  "passos"
 ],
 "skillIds": [
  "javascript.decomposicao.conservacao"
 ],
 "afterBlock": 8,
 "kind": "debug",
 "capability": "depuracao",
 "requiresConcept": true,
 "title": "A soma cresceu, mas o divisor ficou antigo",
 "prompt": "Corrija mediaTres(primeira, segunda, terceira) para devolver a média aritmética das três entradas. As notas são números finitos de 0 a 10, inclusive frações. Preserve zero, não arredonde e não dependa das notas do exemplo. O molde está dado: acompanhe soma e quantidade. Várias chamadas devem ser independentes; a verificação executa JavaScript real.",
 "code": "function mediaTres(primeira, segunda, terceira) {\n  const soma = primeira + segunda + terceira;\n  return soma / 2;\n}",
 "hint": "Uma etapa intermediária pode estar correta e o resultado final continuar errado. Compare o conjunto somado com a quantidade usada na divisão.",
 "minutes": 5
},
{
 "id": "sql-depurar-clientes-pagos",
 "language": "sql",
 "lessonIds": [
  "sql-joins-cardinalidade"
 ],
 "skillIds": [
  "sql.joins.preservacao"
 ],
 "afterBlock": 3,
 "kind": "debug",
 "capability": "depuracao",
 "requiresConcept": true,
 "title": "O relatório apagou clientes sem pedido pago",
 "prompt": "Corrija a consulta para retornar uma linha por cliente, ordenada por id, com colunas cliente_id e pagos. clientes(id INTEGER PRIMARY KEY) e pedidos(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, status TEXT NOT NULL) já existem. Na base visível, clientes 1/2/3 têm respectivamente pedidos [pago, aberto], [aberto] e nenhum: o resultado deve ser 1|1, 2|0, 3|0. Outras bases verificam vários pagos, chaves diferentes e tabelas vazias. Envie somente sua consulta; não recrie tabelas nem fixe os resultados. Execução real em SQLite local, não PostgreSQL; após o primeiro carregamento pode funcionar offline.",
 "code": "SELECT c.id AS cliente_id,count(p.id) AS pagos\nFROM clientes c LEFT JOIN pedidos p ON p.cliente_id=c.id\nWHERE p.status='pago'\nGROUP BY c.id ORDER BY c.id;",
 "hint": "Compare quais linhas existem antes e depois de WHERE. Um cliente sem correspondência não possui um pedido pago com id nulo; conte a chave de um pedido existente.",
 "minutes": 6
},
{
 "id": "sql-depurar-totais-colecoes",
 "language": "sql",
 "lessonIds": [
  "sql-joins-cardinalidade"
 ],
 "skillIds": [
  "sql.joins.granularidade"
 ],
 "afterBlock": 5,
 "kind": "debug",
 "capability": "aplicacao",
 "requiresConcept": true,
 "title": "Duas coleções duplicaram os valores do pedido",
 "prompt": "Retorne uma linha por pedido, ordenada por id, com colunas pedido_id, itens e pagamentos. pedidos(id INTEGER PRIMARY KEY), itens(pedido_id INTEGER NOT NULL, centavos INTEGER NOT NULL) e pagamentos(pedido_id INTEGER NOT NULL, centavos INTEGER NOT NULL) já existem; centavos é inteiro não negativo. O pedido 7 tem itens de 10 e 10, e pagamentos de 5 e 7: precisa produzir 7|20|12. Preserve pedidos sem itens, sem pagamentos ou sem ambas as coleções, usando zero para a contribuição ausente. Registros distintos com o mesmo valor contam separadamente. Envie a consulta, sem recriar tabelas. Bases variadas são executadas em SQLite local; isso não valida extensões de PostgreSQL nem mede performance.",
 "code": "SELECT p.id AS pedido_id,coalesce(sum(i.centavos),0) AS itens,\n       coalesce(sum(pg.centavos),0) AS pagamentos\nFROM pedidos p LEFT JOIN itens i ON i.pedido_id=p.id\nLEFT JOIN pagamentos pg ON pg.pedido_id=p.id\nGROUP BY p.id ORDER BY p.id;",
 "hint": "Descreva o que uma linha representa ao combinar cada coleção. Itens iguais podem ser legítimos; eliminar duplicatas por valor pode apagar contribuições. Você pode consultar cada coleção separadamente antes de combinar os resultados.",
 "minutes": 9
},
{
 "id": "cs-prever-igualdade-conjunto",
 "language": "csharp",
 "lessonIds": [
  "cs-colecoes-linq"
 ],
 "skillIds": [
  "csharp.colecoes.igualdade"
 ],
 "afterBlock": 1,
 "kind": "predict",
 "capability": "leitura",
 "requiresConcept": true,
 "title": "Duas grafias entram como duas chaves?",
 "prompt": "Preveja as três linhas. O conjunto usa comparação ordinal sem diferenciar maiúsculas e minúsculas. Considere somente as strings ASCII mostradas; esta pausa não compila sua resposta.",
 "code": "using System;\nusing System.Linq;\nusing System.Collections.Generic;\nvar linguagens = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { \"sql\", \"SQL\", \"js\" };\nConsole.WriteLine(linguagens.Count);\nConsole.WriteLine(linguagens.Contains(\"Sql\"));\nConsole.WriteLine(linguagens.Add(\"sQl\"));",
 "hint": "A política de igualdade também vale para Contains e Add. Add informa se uma entrada nova foi realmente acrescentada, não apenas se a chamada terminou.",
 "minutes": 3
},
{
 "id": "cs-agrupar-chaves-repetidas",
 "language": "csharp",
 "lessonIds": [
  "cs-colecoes-linq"
 ],
 "skillIds": [
  "csharp.colecoes.agrupamento"
 ],
 "afterBlock": 3,
 "kind": "choice",
 "capability": "depuracao",
 "requiresConcept": true,
 "title": "O relatório falhou na segunda palavra do mesmo tamanho",
 "prompt": "A entrada contém somente strings não nulas. Agrupar deve conservar todas as palavras, repetições e ordem dentro de cada comprimento, com listas independentes entre grupos. A implementação lança ArgumentException para chaves repetidas. Qual corpo corrige o contrato, incluindo entrada vazia, sem descartar palavras? A decisão é conceitual, não executa C# do aluno.",
 "code": "using System;\nusing System.Linq;\nusing System.Collections.Generic;\nstatic Dictionary<int, List<string>> Agrupar(IEnumerable<string> palavras)\n{\n    return palavras.ToDictionary(palavra => palavra.Length, palavra => new List<string> { palavra });\n}\nvar grupos = Agrupar(new[] { \"a\", \"bb\", \"c\", \"bb\" });\nConsole.WriteLine(string.Join(\",\", grupos[1]));",
 "options": [
  {
   "id": "agrupar",
   "text": "return palavras.GroupBy(palavra => palavra.Length)\n    .ToDictionary(grupo => grupo.Key, grupo => grupo.ToList());"
  },
  {
   "id": "descartar",
   "text": "return palavras.DistinctBy(palavra => palavra.Length)\n    .ToDictionary(palavra => palavra.Length, palavra => new List<string> { palavra });"
  },
  {
   "id": "reutilizar",
   "text": "var lista = new List<string>();\nreturn palavras.GroupBy(palavra => palavra.Length)\n    .ToDictionary(grupo => grupo.Key, grupo => { lista.AddRange(grupo); return lista; });"
  }
 ],
 "hint": "Uma chave de dicionário guarda um valor. Quando vários itens têm a mesma chave, esse valor precisa representar o grupo completo; deduplicar a chave perde itens, e uma lista compartilhada mistura os grupos.",
 "minutes": 5
},
{
 "id": "cs-copiar-linhas-array",
 "language": "csharp",
 "lessonIds": [
  "cs-colecoes-linq"
 ],
 "skillIds": [
  "csharp.colecoes.copia-interna"
 ],
 "afterBlock": 4,
 "kind": "fill",
 "capability": "alteracao",
 "requiresConcept": true,
 "title": "O array externo novo ainda compartilha as linhas",
 "prompt": "Complete com a chamada LINQ sem argumentos que copia os inteiros de linha para um array. Cada linha é int[] não nulo; origem pode ser vazia e as linhas podem ter tamanhos diferentes. A alteração de um elemento da cópia não deve alcançar origem nem outra linha copiada. Escreva somente a expressão sobre linha, sem Select ou ponto e vírgula. Esta avaliação é conceitual.",
 "code": "using System;\nusing System.Linq;\nusing System.Collections.Generic;\nint[][] origem = { new[] { 1, 2 }, new[] { 3 } };\nvar copia = origem.Select(linha => ____).ToArray();\ncopia[0][0] = 9;\nConsole.WriteLine(origem[0][0]);\nConsole.WriteLine(copia[0][0]);",
 "hint": "Materializar só o array externo copia as referências das linhas. Aqui os elementos internos são inteiros; a cópia precisa acontecer dentro da transformação de cada linha.",
 "minutes": 4
},
{
 "id": "js-prever-parametro-local",
 "language": "javascript",
 "lessonIds": [
  "funcoes"
 ],
 "skillIds": [
  "javascript.funcoes.parametros"
 ],
 "afterBlock": 3,
 "kind": "predict",
 "capability": "leitura",
 "requiresConcept": true,
 "title": "O argumento mudou a variável externa?",
 "prompt": "Preveja as três linhas. O parâmetro valor tem o mesmo nome de uma variável externa, mas cada chamada recebe seu próprio número. Esta pausa compara a previsão; não executa sua resposta.",
 "code": "let valor = 4;\nfunction dobro(valor) {\n  return valor * 2;\n}\nconsole.log(dobro(3));\nconsole.log(valor);\nconsole.log(dobro(0));",
 "hint": "Siga o valor recebido pela chamada, depois confira qual nome está disponível fora da função. O retorno não reatribui a variável externa.",
 "minutes": 3
},
{
 "id": "js-debug-conversao-retorno",
 "language": "javascript",
 "lessonIds": [
  "funcoes"
 ],
 "skillIds": [
  "javascript.funcoes.composicao"
 ],
 "afterBlock": 5,
 "kind": "debug",
 "capability": "depuracao",
 "requiresConcept": true,
 "title": "A conversão aparece no console, mas não pode ser somada",
 "prompt": "Corrija segundos(minutos) para devolver o número de segundos. A entrada é um número finito de 0 a 1440, inclusive frações de minuto. O resultado precisa servir em outras contas, sem depender da chamada anterior. Não é necessário validar entradas fora desse contrato. Mostrar um número no console não o entrega ao chamador.",
 "code": "function segundos(minutos) {\n  const resultado = minutos * 60;\n  console.log(resultado);\n}",
 "hint": "Observe o valor recebido por quem chamou a função, além do que aparece no console. Teste zero, meio minuto e a soma de duas conversões.",
 "minutes": 5
},
{
 "id": "js-manter-expressao-retorno",
 "language": "javascript",
 "lessonIds": [
  "funcoes"
 ],
 "skillIds": [
  "javascript.funcoes.retorno-linha"
 ],
 "afterBlock": 7,
 "kind": "choice",
 "capability": "alteracao",
 "requiresConcept": true,
 "title": "A quebra de linha encerrou o retorno",
 "prompt": "A conversão abaixo devolve undefined. Qual substituição do corpo permite que segundos(3) + 10 resulte em 190? A decisão é conceitual; não executa o código enviado.",
 "code": "function segundos(minutos) {\n  return\n    minutos * 60;\n}",
 "options": [
  {
   "id": "mesma-linha",
   "text": "return minutos * 60;"
  },
  {
   "id": "so-console",
   "text": "console.log(minutos * 60);"
  },
  {
   "id": "expressao-solta",
   "text": "return;\nminutos * 60;"
  }
 ],
 "hint": "Uma quebra de linha logo após return pode encerrar a instrução. Uma expressão posterior ou uma saída no console não passa a ser o retorno.",
 "minutes": 3
},
{
  "id": "py-prever-anotacao",
  "language": "python",
  "lessonIds": [
    "py-engenharia"
  ],
  "skillIds": [
    "python.engenharia.tipos-runtime"
  ],
  "afterBlock": 3,
  "kind": "predict",
  "capability": "leitura",
  "requiresConcept": true,
  "title": "A anotação bloqueia a entrada textual?",
  "prompt": "Preveja as duas linhas ao executar com Python comum, sem verificador estático nem biblioteca de validação. A segunda chamada viola a anotação; a pergunta é sobre o comportamento em execução. Esta pausa compara a previsão, sem executar sua resposta.",
  "code": "def dobrar(valor: int) -> int:\n    return valor * 2\n\nprint(dobrar(3))\nprint(dobrar(\"3\"))",
  "hint": "Anotar um parâmetro não acrescenta uma conversão nem uma verificação ao corpo. Investigue o significado de * para cada valor recebido.",
  "minutes": 3
},
{
  "id": "py-testar-excecao-vazia",
  "language": "python",
  "lessonIds": [
    "py-engenharia"
  ],
  "skillIds": [
    "python.engenharia.testes"
  ],
  "afterBlock": 4,
  "kind": "choice",
  "capability": "depuracao",
  "requiresConcept": true,
  "title": "O teste passou sem chamar a função quebrada",
  "prompt": "media deveria lançar ValueError para lista vazia, mas retorna zero. O teste imprime 1 True e não detecta o defeito. Escolha o corpo de test_vazia que deve falhar enquanto media estiver quebrada e passar quando ela rejeitar a lista vazia. Preserve a função para provar que o teste a detecta. A decisão é conceitual; não executa Python do aluno.",
  "code": "import unittest\n\ndef media(valores):\n    return 0\n\nclass TestMedia(unittest.TestCase):\n    def test_vazia(self):\n        self.assertTrue(ValueError)\n\nresultado = unittest.TestResult()\nunittest.defaultTestLoader.loadTestsFromTestCase(TestMedia).run(resultado)\nprint(resultado.testsRun, resultado.wasSuccessful())",
  "options": [
    {
      "id": "contexto",
      "text": "with self.assertRaises(ValueError):\n    media([])"
    },
    {
      "id": "sem-chamada",
      "text": "self.assertRaises(ValueError)"
    },
    {
      "id": "confirma-bug",
      "text": "self.assertEqual(media([]), 0)"
    }
  ],
  "hint": "O teste precisa executar a operação e exigir a exceção. Criar um contexto sem usá-lo não verifica nada; afirmar o retorno incorreto transforma o defeito em expectativa.",
  "minutes": 5
},
{
  "id": "py-preservar-primeira-ordem",
  "language": "python",
  "lessonIds": [
    "py-engenharia"
  ],
  "skillIds": [
    "python.engenharia.indice"
  ],
  "afterBlock": 5,
  "kind": "fill",
  "capability": "alteracao",
  "requiresConcept": true,
  "title": "Remover repetições sem reordenar o relatório",
  "prompt": "Complete a condição usando valor e vistos: cada string deve entrar apenas na primeira ocorrência. Preserve a ordem, a entrada e a lista de saída; não use sorted nem altere o restante. Escreva a condição, sem if ou dois-pontos. O set serve como índice de pertencimento; esta avaliação é conceitual e não mede performance.",
  "code": "def unicos(valores):\n    vistos = set()\n    resultado = []\n    for valor in valores:\n        if ____:\n            vistos.add(valor)\n            resultado.append(valor)\n    return resultado\n\nprint(unicos([\"b\", \"a\", \"b\"]))",
  "hint": "A lista conserva a ordem de chegada; o conjunto registra quem já entrou. Só acrescente à saída quando o índice ainda não contiver o valor.",
  "minutes": 4
},
{
  "id": "py-prever-corrotina",
  "language": "python",
  "lessonIds": [
    "py-concorrencia"
  ],
  "skillIds": [
    "python.concorrencia.inicio"
  ],
  "afterBlock": 2,
  "kind": "predict",
  "capability": "leitura",
  "requiresConcept": true,
  "title": "Criar a corrotina já executou a função?",
  "prompt": "Preveja as três linhas, incluindo a representação das listas. A corrotina é criada diretamente e depois aguardada, sem create_task nem fábrica personalizada. Esta pausa compara sua previsão, sem executar Python.",
  "code": "import asyncio\n\nasync def dobrar(eventos):\n    eventos.append(\"executou\")\n    return 4\n\nasync def principal():\n    eventos = []\n    operacao = dobrar(eventos)\n    print(eventos)\n    print(await operacao)\n    print(eventos)\n\nasyncio.run(principal())",
  "hint": "Separe chamar async def de entrar no corpo da função. Localize o instante em que eventos recebe seu primeiro elemento.",
  "minutes": 3
},
{
  "id": "py-propagar-cancelamento",
  "language": "python",
  "lessonIds": [
    "py-concorrencia"
  ],
  "skillIds": [
    "python.concorrencia.cancelamento"
  ],
  "afterBlock": 3,
  "kind": "choice",
  "capability": "depuracao",
  "requiresConcept": true,
  "title": "A tarefa cancelada informou sucesso",
  "prompt": "O programa exibe ok e True. O contrato exige cancelado e True: liberar o recurso e conservar CancelledError para quem aguarda. Qual instrução substitui somente return \"ok\"? A decisão é conceitual, sem executar sua resposta.",
  "code": "import asyncio\n\nasync def atender(iniciou, fechou):\n    iniciou.set()\n    try:\n        await asyncio.Event().wait()\n    except asyncio.CancelledError:\n        return \"ok\"\n    finally:\n        fechou.set()\n\nasync def principal():\n    iniciou, fechou = asyncio.Event(), asyncio.Event()\n    tarefa = asyncio.create_task(atender(iniciou, fechou))\n    await iniciou.wait()\n    tarefa.cancel()\n    try:\n        print(await tarefa)\n    except asyncio.CancelledError:\n        print(\"cancelado\")\n    print(fechou.is_set())\n\nasyncio.run(principal())",
  "options": [
    {
      "id": "propagar",
      "text": "raise"
    },
    {
      "id": "falso",
      "text": "return False"
    },
    {
      "id": "ignorar",
      "text": "pass"
    }
  ],
  "hint": "Executar finally não garante que o chamador receba o cancelamento. Um retorno comum, inclusive False ou None, ainda encerra a tarefa como resultado normal.",
  "minutes": 4
},
{
  "id": "py-esperar-vaga-fila",
  "language": "python",
  "lessonIds": [
    "py-concorrencia"
  ],
  "skillIds": [
    "python.concorrencia.pressao"
  ],
  "afterBlock": 4,
  "kind": "fill",
  "capability": "alteracao",
  "requiresConcept": true,
  "title": "A fila cheia precisa suspender o produtor",
  "prompt": "Complete enviar com uma instrução await que usa fila.put e item. Não descarte itens nem crie outra tarefa. A fila tem uma vaga: o segundo envio deve esperar a retirada do primeiro, produzindo False e depois a b. Escreva somente a linha de envio. Esta pausa avalia a expressão conceitualmente; não executa Python do aluno.",
  "code": "import asyncio\n\nasync def enviar(fila, item):\n    ____\n\nasync def principal():\n    fila = asyncio.Queue(maxsize=1)\n    await enviar(fila, \"a\")\n    pendente = asyncio.create_task(enviar(fila, \"b\"))\n    await asyncio.sleep(0)\n    print(pendente.done())\n    primeiro = await fila.get()\n    fila.task_done()\n    await pendente\n    segundo = await fila.get()\n    fila.task_done()\n    await fila.join()\n    print(primeiro, segundo)\n\nasyncio.run(principal())",
  "hint": "put_nowait recusa a fila cheia; apenas criar a corrotina de put também não envia. O produtor precisa aguardar uma vaga antes de continuar.",
  "minutes": 4
},
{
  "id": "py-prever-piso-resto",
  "language": "python",
  "lessonIds": [
    "py-numeros-texto"
  ],
  "skillIds": [
    "python.numeros.piso-resto"
  ],
  "afterBlock": 2,
  "kind": "predict",
  "capability": "leitura",
  "requiresConcept": true,
  "title": "O resto continua conservando o dividendo",
  "prompt": "Preveja as duas linhas, respeitando os espaços entre valores. O divisor é positivo; // arredonda para menos infinito, inclusive com dividendo negativo. Esta pausa compara sua previsão, sem executar Python.",
  "code": "dividendo, divisor = -7, 3\nquociente, resto = divmod(dividendo, divisor)\nprint(quociente, resto)\nprint(quociente * divisor + resto == dividendo)",
  "hint": "Localize o inteiro imediatamente abaixo do quociente real. Depois encontre o resto que mantém a igualdade, sem trocar piso por truncamento.",
  "minutes": 3
},
{
  "id": "py-conservar-centavos",
  "language": "python",
  "lessonIds": [
    "py-numeros-texto"
  ],
  "skillIds": [
    "python.numeros.conservacao"
  ],
  "afterBlock": 3,
  "kind": "choice",
  "capability": "depuracao",
  "requiresConcept": true,
  "title": "A divisão perdeu um centavo",
  "prompt": "distribuir(1000, 3) devolve [333, 333, 333]: a soma perdeu um centavo. Escolha a correção que funciona para inteiros não negativos, inclusive zero, sem passar por float. A diferença entre parcelas deve ser no máximo 1; as maiores ficam primeiro. total e pessoas já são int; total negativo ou pessoas menor que 1 devem lançar ValueError. A decisão é conceitual, sem executar sua resposta.",
  "code": "def distribuir(total, pessoas):\n    if total < 0 or pessoas < 1:\n        raise ValueError(\"distribuição inválida\")\n    return [round(total / pessoas)] * pessoas\n\nprint(distribuir(1000, 3))",
  "options": [
    {
      "id": "resto",
      "text": "Manter a validação; obter cota e resto com divmod; acrescentar 1 às primeiras resto parcelas e retornar a lista."
    },
    {
      "id": "formato",
      "text": "Manter a divisão real; formatar cada parcela com duas casas e converter o resultado para int."
    },
    {
      "id": "ultima",
      "text": "Usar total // pessoas nas parcelas; colocar todo o resto apenas na última parcela."
    }
  ],
  "hint": "Confira duas invariantes: a soma precisa conservar o total e nenhuma parcela pode se afastar mais de 1 das demais. Teste também menos centavos que pessoas.",
  "minutes": 5
},
{
  "id": "py-validar-digitos-ascii",
  "language": "python",
  "lessonIds": [
    "py-numeros-texto"
  ],
  "skillIds": [
    "python.numeros.entrada-ascii"
  ],
  "afterBlock": 5,
  "kind": "fill",
  "capability": "alteracao",
  "requiresConcept": true,
  "title": "Um dígito Unicode passou pela fronteira",
  "prompt": "Complete apenas uma comparação encadeada entre os limites ASCII e caractere, sem chamadas de função. Use aspas simples ou duplas nos limites. O contrato aceita de 1 a 3 dígitos ASCII e quantidade de 0 a 500; espaços, sinais e outros alfabetos numéricos são rejeitados com ValueError. Comprimento e limite numérico já estão conferidos. A pausa avalia a expressão conceitualmente, sem executar Python.",
  "code": "def quantidade(texto):\n    if not 1 <= len(texto) <= 3:\n        raise ValueError(\"comprimento inválido\")\n    if not all(____ for caractere in texto):\n        raise ValueError(\"use dígitos ASCII\")\n    valor = int(texto)\n    if valor > 500:\n        raise ValueError(\"máximo 500\")\n    return valor\n\nprint(quantidade(\"0\"))\nprint(quantidade(\"050\"))",
  "hint": "isdigit e int reconhecem mais caracteres que os dez permitidos neste contrato. Compare o próprio caractere antes da conversão; zero continua sendo válido.",
  "minutes": 4
},
 {
  id:'js-prever-acesso',language:'javascript',lessonIds:['decisoes'],skillIds:['javascript.decisoes.combinacao'],afterBlock:3,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'Um ingresso sozinho permite entrar?',prompt:'Escreva as três linhas exibidas. A regra exige idade mínima e ingresso ao mesmo tempo. Esta pausa confere sua previsão, sem executar sua resposta.',code:'function acesso(idade, ingresso) {\n  if (idade >= 18 && ingresso) return "entrar";\n  return "aguardar";\n}\nconsole.log(acesso(18, true));\nconsole.log(acesso(18, false));\nconsole.log(acesso(17, true));',hint:'Faça uma coluna para cada condição e só depois combine os resultados. Inclua o valor exatamente na fronteira.',minutes:3
 },
 {
  id:'js-debug-faixas-energia',language:'javascript',lessonIds:['decisoes'],skillIds:['javascript.decisoes.fronteiras'],afterBlock:5,kind:'debug',capability:'depuracao',requiresConcept:true,
  title:'A energia 20 caiu na faixa baixa',prompt:'Corrija nivel(energia): abaixo de 20 retorna "baixa"; de 20 até antes de 80 retorna "média"; de 80 em diante retorna "alta". A entrada já é um número finito entre 0 e 100, inclusive; pode conter casas decimais. Cada chamada é independente e deve devolver a string exata, sem depender de console.log. Os testes executam sua correção no JavaScript isolado.',code:'function nivel(energia) {\n  if (energia <= 20) return "baixa";\n  if (energia <= 80) return "média";\n  return "alta";\n}',hint:'Compare cada fronteira com um valor logo abaixo e anote o primeiro ramo alcançado. O retorno encerra a chamada.',minutes:5
 },
 {
  id:'js-exigir-duas-condicoes',language:'javascript',lessonIds:['decisoes'],skillIds:['javascript.decisoes.conjuncao'],afterBlock:7,kind:'choice',capability:'alteracao',requiresConcept:true,
  title:'A correção precisa valer além deste visitante',prompt:'idade já é um inteiro não negativo e ingresso já é booleano. Escolha a condição que permite entrar somente com idade de pelo menos 18 e ingresso verdadeiro. Deve funcionar para todos esses valores, não só para o exemplo. A escolha é conceitual; não executa sua resposta.',code:'const idade = 17;\nconst ingresso = true;\nif (____) console.log("entrar");\nelse console.log("aguardar");',options:[{id:'ambas',text:'idade >= 18 && ingresso'},{id:'uma',text:'idade >= 18 || ingresso'},{id:'estrita',text:'idade > 18 && ingresso'}],hint:'Um operador aceita só uma condição verdadeira; outro exige ambas. Confira também a pessoa com exatamente 18.',minutes:3
 },

 {
  id:'js-prever-ausencia-zero',language:'javascript',lessonIds:['valores'],skillIds:['javascript.valores.ausencia'],afterBlock:3,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'Sem valor não é o mesmo que zero',prompt:'Escreva as duas linhas. === compara sem converter os valores; a variável começa sem valor inicial. A pausa confere sua previsão, sem executar sua resposta.',code:'let energia;\nconsole.log(energia === 0);\nenergia = 0;\nconsole.log(energia === 0);',hint:'Acompanhe o valor antes e depois da atribuição. Zero é um número conhecido; ausência ainda não informa esse número.',minutes:2
 },
 {
  id:'js-debug-saldo-textual',language:'javascript',lessonIds:['valores'],skillIds:['javascript.valores.operacoes'],afterBlock:5,kind:'debug',capability:'depuracao',requiresConcept:true,
  title:'O saldo 100 com ajuste 25 virou 10025',prompt:'Corrija somarSaldo(saldo, variacao) para devolver a soma numérica. As duas entradas já são inteiros de -10000 a 10000; zero e ajustes negativos são válidos. Cada chamada deve ser independente. Não precisa ler formulário, converter texto nem validar outros tipos. Os testes executam sua correção no JavaScript isolado.',code:'function somarSaldo(saldo, variacao) {\n  return String(saldo) + variacao;\n}',hint:'Confira o tipo de cada operando no instante do +, antes de mudar valores ou acrescentar conversões.',minutes:4
 },
 {
  id:'js-permitir-reatribuicao',language:'javascript',lessonIds:['valores'],skillIds:['javascript.valores.reatribuicao'],afterBlock:7,kind:'choice',capability:'alteracao',requiresConcept:true,
  title:'A atualização precisa mudar o valor do nome',prompt:'O restante do programa precisa conservar estas linhas e exibir 50. Qual declaração ocupa a lacuna sem erro de reatribuição? A escolha é conceitual e não executa sua resposta.',code:'____\nenergia = energia + 10;\nconsole.log(energia);',options:[{id:'mutavel',text:'let energia = 40;'},{id:'fixa',text:'const energia = 40;'},{id:'texto',text:'let energia = "40";'}],hint:'Separe a possibilidade de reatribuir o nome do tipo de valor usado pela soma.',minutes:2
 },

 {
  id:'js-prever-ciclos',language:'javascript',lessonIds:['repeticoes'],skillIds:['javascript.lacos.rastreamento'],afterBlock:3,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'Quando a condição é conferida?',
  prompt:'Escreva as três linhas exibidas. A condição é conferida antes de cada passagem e o avanço vem depois do corpo. A pausa confere sua previsão, sem executar sua resposta.',
  code:'let total = 0;\nfor (let i = 1; i <= 3; i++) {\n  total += i;\n  console.log(i, total);\n}',
  hint:'Anote i e total antes e depois de cada soma. A próxima comparação usa o i já atualizado.',minutes:3
 },
 {
  id:'js-debug-soma-inclusiva',language:'javascript',lessonIds:['repeticoes'],skillIds:['javascript.lacos.fronteiras'],afterBlock:5,kind:'debug',capability:'depuracao',requiresConcept:true,
  title:'O relatório esqueceu o último número',
  prompt:'Corrija somarAte(n) para retornar a soma de 1 até n, incluindo n. A entrada já é um inteiro entre 0 e 1000; zero deve retornar zero. Cada chamada precisa ser independente e devolver um número, sem depender de console.log. O JavaScript isolado executa os casos de teste da sua correção.',
  code:'function somarAte(n) {\n  let total = 0;\n  for (let i = 1; i < n; i++) {\n    total += i;\n  }\n  return total;\n}',
  hint:'Simule n igual a 1 e compare a condição de continuação com o intervalo pedido.',minutes:5
 },
 {
  id:'js-parar-contagem',language:'javascript',lessonIds:['repeticoes'],skillIds:['javascript.lacos.terminacao'],afterBlock:7,kind:'choice',capability:'alteracao',requiresConcept:true,
  title:'A contagem chegou a zero e continuou',
  prompt:'inicio já é um inteiro de 0 a 1000. O programa deve contar exatamente inicio passagens e terminar, inclusive com zero. Qual condição substitui a lacuna? Esta escolha é conceitual; não executa sua resposta.',
  code:'let restantes = inicio;\nlet passagens = 0;\nwhile (____) {\n  passagens += 1;\n  restantes -= 1;\n}\nconsole.log(passagens);',
  options:[{id:'positivo',text:'restantes > 0'},{id:'inclusivo',text:'restantes >= 0'},{id:'inicio',text:'inicio > 0'}],
  hint:'Acompanhe restantes quando ele chega a zero. Confira também se a variável da condição muda dentro do corpo.',minutes:3
 },
{
  "id": "js-prever-transporte",
  "language": "javascript",
  "lessonIds": [
    "js-modulos-engenharia"
  ],
  "skillIds": [
    "javascript.importacao.transporte"
  ],
  "afterBlock": 3,
  "kind": "predict",
  "capability": "leitura",
  "requiresConcept": true,
  "title": "O que realmente chegou pelo JSON?",
  "prompt": "Escreva a linha exibida depois da ida e volta. A pausa confere sua previsão; não executa sua resposta.",
  "code": "const dados = {nome: undefined, itens: [undefined], numero: NaN};\nconst copia = JSON.parse(JSON.stringify(dados));\nconsole.log(Object.hasOwn(copia, \"nome\"), copia.itens[0] === null, copia.numero === null);",
  "hint": "Compare a ausência em uma propriedade de objeto com a posição de um array; o transporte também precisa representar um número não finito.",
  "minutes": 2
},
{
  "id": "js-debug-importacao-atomica",
  "language": "javascript",
  "lessonIds": [
    "js-modulos-engenharia"
  ],
  "skillIds": [
    "javascript.importacao.atomicidade"
  ],
  "afterBlock": 4,
  "kind": "debug",
  "capability": "depuracao",
  "requiresConcept": true,
  "title": "O arquivo inválido apagou a lista anterior",
  "prompt": "Corrija importarNomes(estado, texto) sem mudar seu contrato: JSON com até 100 registros, cada nome textual não vazio após trim, campos extras ignorados. Substitua o conteúdo do mesmo array e retorne a quantidade somente quando tudo for válido. Lista vazia limpa o array. Registro inválido lança TypeError; JSON malformado mantém SyntaxError. Toda falha conserva o estado anterior. O estado recebido é um array ordinário e modificável de strings. Testes executam sua correção no JavaScript isolado.",
  "code": "function importarNomes(estado, texto) {\n  const dados = JSON.parse(texto);\n  if (!Array.isArray(dados) || dados.length > 100) throw new TypeError(\"lista inválida\");\n  estado.length = 0;\n  for (const item of dados) {\n    if (!item || typeof item !== \"object\" || Array.isArray(item) || typeof item.nome !== \"string\" || !item.nome.trim()) throw new TypeError(\"registro inválido\");\n    estado.push(item.nome.trim());\n  }\n  return estado.length;\n}",
  "hint": "Compare o instante em que a lista antiga é apagada com o instante em que o último registro foi validado.",
  "minutes": 6
},
{
  "id": "js-inserir-texto-dados",
  "language": "javascript",
  "lessonIds": [
    "js-modulos-engenharia"
  ],
  "skillIds": [
    "javascript.importacao.apresentacao"
  ],
  "afterBlock": 5,
  "kind": "choice",
  "capability": "aplicacao",
  "requiresConcept": true,
  "title": "O nome contém sinais de HTML",
  "prompt": "nome já é uma string validada, mas pode conter <img src=x>. Você deve acrescentar um li cujo texto seja exatamente nome. Qual trecho atende ao contrato sem interpretar o nome como HTML? Esta escolha é conceitual e não executa DOM.",
  "options": [
    {
      "id": "texto",
      "text": "const item = document.createElement(\"li\"); item.textContent = nome; lista.append(item);"
    },
    {
      "id": "html",
      "text": "lista.insertAdjacentHTML(\"beforeend\", \"<li>\" + nome + \"</li>\");"
    },
    {
      "id": "filtro",
      "text": "lista.innerHTML += \"<li>\" + nome.replace(/<script.*?>/gi, \"\") + \"</li>\";"
    }
  ],
  "hint": "O contrato pede caracteres literais. Validação de nome não transforma a string em HTML confiável.",
  "minutes": 2
},

 {
  id:"html-prever-controles",language:"html",lessonIds:["html-dados-formulario"],skillIds:["html.formularios.presenca"],afterBlock:3,kind:"predict",capability:"leitura",requiresConcept:true,
  title:"Campo visível não é uma entrada garantida",
  prompt:"Preveja as três linhas. disabled é um atributo booleano: o texto false não o remove. O código só constrói os dados, sem enviar uma requisição; esta pausa confere raciocínio, sem executar seu HTML.",
  code:"<form id=\"inscricao\">\n  <input name=\"fixo\" value=\"A\" readonly>\n  <input name=\"off\" value=\"B\" disabled=\"false\">\n  <input type=\"checkbox\" name=\"linguagem\" value=\"html\" checked>\n  <input type=\"checkbox\" name=\"linguagem\" value=\"css\" checked>\n  <input type=\"checkbox\" name=\"linguagem\" value=\"sql\">\n</form>\n<script>\nconst dados = new FormData(document.querySelector(\"#inscricao\"));\nconsole.log(dados.get(\"fixo\"));\nconsole.log(dados.get(\"off\"));\nconsole.log(dados.getAll(\"linguagem\").join(\",\"));\n</script>",
  hint:"Separe participação nos dados e possibilidade de edição. Depois percorra as escolhas na ordem do documento, mantendo somente as marcadas.",minutes:4
 },
 {
  id:"html-preservar-selecoes",language:"html",lessonIds:["html-dados-formulario"],skillIds:["html.formularios.multiplicidade"],afterBlock:4,kind:"choice",capability:"depuracao",requiresConcept:true,
  title:"Uma conversão para objeto perdeu uma escolha",
  prompt:"O formulário possui checkboxes com name=\"linguagem\". Duas marcadas devem produzir [\"html\",\"css\"], uma marcada só seu valor e nenhuma deve produzir []. Qual substituição conserva esse contrato sem inventar seleções?",
  code:"const dados = new FormData(formulario);\nconst selecionadas = Object.fromEntries(dados).linguagem;",
  options:[{"id":"primeiro","text":"Usar dados.get(\"linguagem\") e envolver o resultado em um array."},{"id":"colecao","text":"Usar dados.getAll(\"linguagem\") para manter todas as entradas desse nome."},{"id":"controles","text":"Ler o value de todos os inputs com esse name, inclusive os desmarcados."}],
  hint:"Compare o contrato de uma propriedade escalar com o de uma coleção. Verifique também o que sua escolha devolve quando a chave não aparece.",minutes:3
 },
 {
  id:"html-limpar-validacao",language:"html",lessonIds:["html-dados-formulario"],skillIds:["html.formularios.validade-personalizada"],afterBlock:6,kind:"fill",capability:"alteracao",requiresConcept:true,
  title:"A pessoa corrigiu o campo, mas ele continua inválido",
  prompt:"Complete somente o literal de string que retira o erro personalizado quando o apelido é válido. Nesta atividade os apelidos contêm apenas caracteres ASCII. Preserve required, a regra de três caracteres após trim e a validação nativa; não desabilite o controle nem o formulário.",
  code:"<label for=\"apelido\">Apelido</label>\n<input id=\"apelido\" name=\"apelido\" required>\n<script>\nconst campo = document.querySelector(\"#apelido\");\ncampo.addEventListener(\"input\", () => {\n  campo.setCustomValidity(campo.value.trim().length < 3\n    ? \"Use pelo menos três caracteres.\"\n    : ____);\n});\n</script>",
  hint:"Uma mensagem personalizada é estado do controle. Corrigir o valor ou chamar checkValidity não apaga esse estado por conta própria.",minutes:4
 },
 {
  id:'cpp-mover-constante',language:'cpp',lessonIds:['cpp-memoria-posse'],skillIds:['cpp.posse.movimento-const'],afterBlock:2,kind:'choice',capability:'depuracao',requiresConcept:true,
  title:'Autorizar movimento não remove const',
  prompt:'O programa deve transferir a posse sem copiar o int. A inicialização de destino não compila. Qual mudança resolve esse contrato mantendo unique_ptr e sem casts? Esta pausa analisa compilação, sem executar C++.',
  code:'#include <memory>\n#include <utility>\nint main() {\n    const auto origem = std::make_unique<int>(7);\n    auto destino = std::move(origem);\n}',
  options:[{id:'copiar',text:'Trocar std::move(origem) por origem para selecionar uma cópia.'},{id:'mutavel',text:'Retirar const da declaração de origem, permitindo que a transferência esvazie esse dono.'},{id:'mover-valor',text:'Usar std::move(*origem), conservando const e transferindo assim o unique_ptr.'}],
  hint:'Identifique o tipo e a categoria da expressão, depois o parâmetro exigido pelo construtor. Transferir a responsabilidade também modifica o dono de origem.',minutes:4
 },
 {
  id:'cpp-prever-posse-temporaria',language:'cpp',lessonIds:['cpp-memoria-posse'],skillIds:['cpp.posse.weak-lock'],afterBlock:3,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'A observação não é dona, mas o resultado de lock pode ser',
  prompt:'Preveja as duas linhas, respeitando boolalpha e os espaços. O programa tem uma única thread e lock inicialmente encontra um objeto vivo. Acompanhe os donos, sem confundir o weak_ptr com o shared_ptr retornado.',
  code:'#include <iostream>\n#include <memory>\nint main() {\n    auto dono = std::make_shared<int>(7);\n    std::weak_ptr<int> observador = dono;\n    auto temporario = observador.lock();\n    dono.reset();\n    std::cout << std::boolalpha << observador.expired() << " " << *temporario << "\\n";\n    temporario.reset();\n    std::cout << observador.expired() << " " << bool(observador.lock()) << "\\n";\n}',
  hint:'Marque quem conserva posse após cada reset. Não confunda a ausência do primeiro dono com a ausência de todos os donos.',minutes:4
 },
 {
  id:'cpp-devolver-texto-dono',language:'cpp',lessonIds:['cpp-memoria-posse'],skillIds:['cpp.posse.retorno-texto'],afterBlock:4,kind:'fill',capability:'alteracao',requiresConcept:true,
  title:'O resultado precisa sobreviver ao texto local',
  prompt:'Complete somente o tipo de retorno, qualificado com std::. O chamador deve receber uma string com posse, que possa guardar e alterar após o retorno. Preserve o corpo e não use referência, ponteiro, view nem armazenamento estático.',
  code:'#include <string>\n____ nome() {\n    std::string local = "CodeLab";\n    return local;\n}',
  hint:'A vida do objeto local termina na saída da função. Escolha um resultado que possua seus caracteres; auto não comunica o tipo pedido nesta pausa.',minutes:3
 },
 {
  id:'py-prever-atributo',language:'python',lessonIds:['py-objetos-protocolos'],skillIds:['python.descritores.precedencia'],afterBlock:3,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'O dicionário da instância vence toda leitura?',
  prompt:'Preveja as três linhas. As classes usam a busca padrão de atributos, sem sobrescrever __getattribute__. cache tem apenas __get__; total é uma property sem setter. Esta pausa compara raciocínio, sem executar Python.',
  code:'class Origem:\n    def __get__(self, instancia, dono=None):\n        return self if instancia is None else "calculado"\n\nclass Registro:\n    cache = Origem()\n\n    @property\n    def total(self):\n        return 10\n\nitem = Registro()\nitem.__dict__.update(cache="guardado", total=99)\nprint(item.cache)\nprint(item.total)\nprint(isinstance(Registro.cache, Origem))',
  hint:'Classifique os dois atributos da classe antes de consultar o dicionário da instância. Acesso pela classe também pode chamar __get__, com outra entrada.',minutes:4
 },
 {
  id:'py-isolar-descritor',language:'python',lessonIds:['py-objetos-protocolos'],skillIds:['python.descritores.armazenamento'],afterBlock:4,kind:'choice',capability:'depuracao',requiresConcept:true,
  title:'Dois pedidos disputam o mesmo valor',
  prompt:'A saída é 20 e 20, mas os pedidos devem conservar 10 e 20. Escolha a correção que mantém a validação antes de gravar e separa o estado por instância. São objetos com __dict__; esta solução não cobre classes apenas com slots.',
  code:'class Quantidade:\n    def __set_name__(self, dono, nome):\n        self.chave = "_" + nome\n\n    def __get__(self, instancia, dono=None):\n        if instancia is None:\n            return self\n        return self.valor\n\n    def __set__(self, instancia, valor):\n        if type(valor) is not int or valor < 0:\n            raise ValueError("quantidade inválida")\n        self.valor = valor\n\nclass Pedido:\n    quantidade = Quantidade()\n\n    def __init__(self, quantidade):\n        self.quantidade = quantidade\n\nprimeiro = Pedido(10)\nsegundo = Pedido(20)\nprint(primeiro.quantidade)\nprint(segundo.quantidade)',
  options:[{id:'compartilhar',text:'Trocar self.valor por self.chave em ambas as operações, guardando o número no descritor.'},{id:'separar',text:'Ler e gravar instancia.__dict__[self.chave], conservando a guarda de classe e a validação antes da gravação.'},{id:'reatribuir',text:'Gravar instancia.quantidade = valor dentro de __set__, mantendo __get__ como está.'}],
  hint:'self é o descritor instalado na classe. Investigue a quem pertence o valor: mudar o nome do campo compartilhado não separa os pedidos.',minutes:4
 },
 {
  id:'py-acessar-classe',language:'python',lessonIds:['py-objetos-protocolos'],skillIds:['python.descritores.acesso-classe'],afterBlock:5,kind:'fill',capability:'alteracao',requiresConcept:true,
  title:'Uma instância falsa ainda é uma instância',
  prompt:'Complete a condição usando identidade com None. O acesso Pedido.quantidade deve devolver o descritor; uma instância cujo __bool__ devolve False deve continuar devolvendo seu número. Preserve o retorno pelo dicionário e a validação. Escreva só a condição, sem if nem dois-pontos.',
  code:'class Quantidade:\n    def __set_name__(self, dono, nome):\n        self.chave = "_" + nome\n\n    def __get__(self, instancia, dono=None):\n        if ____:\n            return self\n        return instancia.__dict__[self.chave]\n\n    def __set__(self, instancia, valor):\n        if type(valor) is not int or valor < 0:\n            raise ValueError("quantidade inválida")\n        instancia.__dict__[self.chave] = valor\n\nclass Pedido:\n    quantidade = Quantidade()\n\n    def __init__(self, quantidade):\n        self.quantidade = quantidade\n\n    def __bool__(self):\n        return False\n\nprint(isinstance(Pedido.quantidade, Quantidade))\nprint(Pedido(0).quantidade)',
  hint:'Ausência de instância e falsidade lógica são situações diferentes. Igualdade também pode executar um método definido pelo objeto.',minutes:4
 },
 {
  id:'css-prever-bordas',language:'css',lessonIds:['css-caixas-intrinseco'],skillIds:['css.caixas.dimensao'],afterBlock:1,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'O conteúdo não pode ter tamanho negativo',
  prompt:'Em escrita horizontal, sem outras regras ou transformações, preveja a largura da borda de conteudo, borda e estreita. Digite só os três números em pixels, um por linha, na ordem dos elementos. Padding e bordas continuam existindo mesmo na caixa muito estreita.',
  code:'<style>\n.caixa { inline-size: 120px; padding-inline: 12px; border-inline: 3px solid; }\n#conteudo { box-sizing: content-box; }\n#borda { box-sizing: border-box; }\n#estreita { box-sizing: border-box; inline-size: 20px; }\n</style>\n<div id="conteudo" class="caixa"></div>\n<div id="borda" class="caixa"></div>\n<div id="estreita" class="caixa"></div>',
  hint:'Some os extras dos dois lados e confira o piso zero do conteúdo. A borda não pode ficar menor que os extras sem que eles também mudem.',minutes:4
 },
 {
  id:'css-reduzir-minimo',language:'css',lessonIds:['css-caixas-intrinseco'],skillIds:['css.caixas.encolhimento'],afterBlock:3,kind:'fill',capability:'alteracao',requiresConcept:true,
  title:'Flex pode encolher, mas o mínimo impede',
  prompt:'Complete com zero sem unidade ou em px para permitir que texto encolha no eixo em linha. A política de quebra já está definida e precisa permanecer; não recorte o identificador nem altere o rótulo.',
  code:'<style>\nbody { margin: 0; font: 16px/20px monospace; }\n.linha { display: flex; gap: 8px; inline-size: min(240px, 100%); }\n.rotulo { flex: 0 0 48px; }\n.texto { flex: 1; min-inline-size: ____; overflow-wrap: break-word; }\n</style>\n<div class="linha"><span class="rotulo">ID</span><span class="texto">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</span></div>',
  hint:'O tamanho mínimo automático ainda considera o identificador. Remova esse piso do item; flex-shrink e quebra de texto resolvem partes diferentes do comportamento.',minutes:4
 },
 {
  id:'css-corrigir-rolagem',language:'css',lessonIds:['css-caixas-intrinseco'],skillIds:['css.caixas.rolagem'],afterBlock:5,kind:'choice',capability:'depuracao',requiresConcept:true,
  title:'O cabeçalho está preso à referência errada',
  prompt:'O cabeçalho aparece no topo da janela. Ele deve continuar no fluxo da seção e aderir ao topo da região rolável, inclusive após scrollTop = 80. Qual mudança de position resolve esse contrato sem esconder conteúdo ou usar JavaScript?',
  code:'<style>\nbody { margin: 0; }\n#rolagem { margin-block-start: 60px; block-size: 120px; inline-size: min(240px, 100%); overflow: auto; }\n#cabecalho { position: fixed; inset-block-start: 0; margin: 0; block-size: 24px; background: white; }\n.conteudo { block-size: 400px; }\n</style>\n<section id="rolagem" aria-label="Registros"><h2 id="cabecalho">Registros</h2><div class="conteudo">Conteúdo da seção.</div></section>',
  options:[{id:'relativo',text:'Usar position: relative, mantendo o inset zero.'},{id:'aderir',text:'Usar position: sticky, mantendo o inset zero e a região com overflow auto.'},{id:'absoluto',text:'Usar position: absolute para retirar o cabeçalho do fluxo.'}],
  hint:'Identifique o ancestral que rola e a posição que conserva espaço no fluxo enquanto responde a essa rolagem.',minutes:4
 },
 {
  id:'cs-prever-percurso',language:'csharp',lessonIds:['cs-iteradores-descarte'],skillIds:['csharp.iteradores.avanco'],afterBlock:2,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'Cada avanço produz só o próximo valor',
  prompt:'Preveja as seis linhas. A sequência tem três valores, mas o consumidor pede apenas dois. Produzir e devolver um valor são acontecimentos diferentes de construir a sequência.',
  code:'int produzidos = 0;\nIEnumerable<int> Fonte()\n{\n    for (int valor = 1; valor <= 3; valor++)\n    {\n        produzidos++;\n        yield return valor;\n    }\n}\nvar sequencia = Fonte();\nConsole.WriteLine(produzidos);\nusing (var percurso = sequencia.GetEnumerator())\n{\n    Console.WriteLine(percurso.MoveNext());\n    Console.WriteLine($"{percurso.Current}|{produzidos}");\n    Console.WriteLine(percurso.MoveNext());\n    Console.WriteLine($"{percurso.Current}|{produzidos}");\n}\nConsole.WriteLine(produzidos);',
  hint:'Marque a posição de suspensão em cada yield. Criar o enumerador não consome os três valores, e descartá-lo não precisa pedir o último.',minutes:4
 },
 {
  id:'cs-descartar-percurso',language:'csharp',lessonIds:['cs-iteradores-descarte'],skillIds:['csharp.iteradores.descarte'],afterBlock:3,kind:'choice',capability:'depuracao',requiresConcept:true,
  title:'O consumidor abandona um recurso ativo',
  prompt:'O programa imprime 10 e depois 1: o recurso ainda está ativo. Escolha a correção que processa no máximo o primeiro valor e garante descarte também se Processar lançar. Não percorra o restante só para tentar fechar a origem.',
  code:'int ativos = 0;\nIEnumerable<int> Fonte()\n{\n    ativos++;\n    try { yield return 10; yield return 20; }\n    finally { ativos--; }\n}\nvoid Processar(int valor) => Console.WriteLine(valor);\nvar percurso = Fonte().GetEnumerator();\nif (percurso.MoveNext()) Processar(percurso.Current);\nConsole.WriteLine(ativos);',
  options:[{id:'continuar',text:'Avançar até MoveNext retornar false após Processar.'},{id:'delimitar',text:'Envolver a aquisição do enumerador e o processamento em um bloco using, antes de consultar ativos.'},{id:'coletar',text:'Zerar a referência do enumerador e chamar GC.Collect antes de consultar ativos.'}],
  hint:'O produtor já tem finally. Investigue quem deve encerrar o enumerador manual quando o consumidor sai cedo ou falha.',minutes:4
 },
 {
  id:'cs-materializar-consulta',language:'csharp',lessonIds:['cs-iteradores-descarte'],skillIds:['csharp.iteradores.materializacao'],afterBlock:5,kind:'fill',capability:'alteracao',requiresConcept:true,
  title:'Duas leituras, uma produção',
  prompt:'Complete com uma chamada LINQ sem argumentos. Esta origem finita incrementa um contador; o contrato exige produzi-la uma única vez, guardar os inteiros e ler o mesmo resultado duas vezes. A saída deve ser 2,4; 2,4; 4, uma linha por expressão.',
  code:'int produzidos = 0;\nIEnumerable<int> Fonte()\n{\n    for (int valor = 1; valor <= 4; valor++)\n    {\n        produzidos++;\n        yield return valor;\n    }\n}\nvar consulta = Fonte().Where(valor => valor % 2 == 0);\nvar guardados = consulta.____;\nConsole.WriteLine(string.Join(",", guardados));\nConsole.WriteLine(string.Join(",", guardados));\nConsole.WriteLine(produzidos);',
  hint:'Guardar a consulta conserva uma receita. Escolha uma operação que percorra a origem agora e armazene os resultados; não é uma regra para fontes infinitas.',minutes:4
 },
 {
  id:'html-imagem-destino',language:'html',lessonIds:['html-midia'],skillIds:['html.imagens.alternativas'],afterBlock:1,kind:'choice',capability:'depuracao',requiresConcept:true,
  title:'O link contém apenas uma imagem',
  prompt:'A imagem é o único conteúdo de um link que abre o relatório de estudo. Não há aria-label nem outro texto no link. Qual alt fornece o nome necessário para essa ação? O gráfico completo continua disponível no relatório. Decisão conceitual offline; não é auditoria automática de toda a acessibilidade.',
  code:'<a href="#relatorio"><img src="/exemplos/imagens/fluxo-amplo.svg" alt="" width="720" height="240"></a>',
  options:[{id:'arquivo',text:'alt="fluxo-amplo.svg"'},{id:'destino',text:'alt="Abrir relatório de estudo"'},{id:'decorativa',text:'alt="" porque o arquivo já tem um nome'}],
  hint:'Substitua mentalmente a imagem pelo texto. A pessoa conseguiria decidir o que o link faz?',minutes:3
 },
 {
  id:'html-completar-sizes',language:'html',lessonIds:['html-midia'],skillIds:['html.imagens.tamanho'],afterBlock:2,kind:'fill',capability:'alteracao',requiresConcept:true,
  title:'Declare o espaço da imagem, não a largura do arquivo',
  prompt:'Complete apenas o tamanho em vw. Até 600 px inclusive, a imagem ocupa 100% da viewport; acima disso, 50%. Não há margens, padding ou bordas. O CSS já define o layout. sizes deve descrevê-lo para os candidatos w, sem prometer qual arquivo o navegador escolherá. Avaliação conceitual offline.',
  code:'<style>body { margin: 0; } img { display: block; width: 50vw; height: auto; }\n@media (max-width: 600px) { img { width: 100vw; } }</style>\n<img src="/exemplos/imagens/fluxo-amplo.svg"\n     srcset="/exemplos/imagens/fluxo-360.svg 360w, /exemplos/imagens/fluxo-amplo.svg 720w"\n     sizes="(max-width: 600px) ____, 50vw"\n     width="720" height="240" alt="Etapas: escrever, executar e revisar">',
  hint:'sizes informa o espaço em pixels CSS. O descritor w informa a largura intrínseca do recurso; um não substitui o outro.',minutes:3
 },
 {
  id:'html-ordenar-picture',language:'html',lessonIds:['html-midia'],skillIds:['html.imagens.fontes'],afterBlock:5,kind:'order',capability:'aplicacao',requiresConcept:true,
  title:'Uma fonte genérica esconde o recorte compacto',
  prompt:'Ordene todas as linhas. Até 600 px, inclusive, use o diagrama vertical; em larguras maiores, o horizontal. As duas fontes SVG são suportadas neste cenário. picture usa a primeira source aplicável, e img mantém a alternativa textual e o fallback. Cada diagrama preserva as três etapas. A escolha é conceitual; a plataforma não executa sua marcação nesta pausa.',
  lines:[{id:'abrir',code:'<picture>'},{id:'ampla',code:'  <source type="image/svg+xml" srcset="/exemplos/imagens/fluxo-amplo.svg" width="720" height="240">'},{id:'compacta',code:'  <source type="image/svg+xml" media="(max-width: 600px)" srcset="/exemplos/imagens/fluxo-compacto.svg" width="240" height="360">'},{id:'fallback',code:'  <img src="/exemplos/imagens/fluxo-amplo.svg" width="720" height="240" alt="Etapas: escrever, executar e revisar">'},{id:'fechar',code:'</picture>'}],
  hint:'Uma condição genérica antes da específica pode impedir que a segunda seja considerada. O img continua necessário dentro de picture.',minutes:4
 },
 {
  id:'sql-prever-desconhecido',language:'sql',lessonIds:['sql-null-logica'],skillIds:['sql.null.comparacoes'],afterBlock:2,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'Negar uma comparação não recupera o valor ausente',
  prompt:'Preveja as três linhas no formato id|diferente. O cast ::text transforma booleanos conhecidos em true/false; COALESCE apresenta unknown quando a comparação retorna NULL. Zero, ausência e cinco devem continuar distintos. Avaliação conceitual offline, sem executar sua consulta.',
  code:"SELECT id, COALESCE((saldo <> 0)::text, 'unknown') AS diferente\nFROM (VALUES (1, NULL::integer), (2, 0), (3, 5)) AS dados(id, saldo)\nORDER BY id;",
  hint:'Resolva a comparação antes da apresentação. Ausência não é um número diferente de zero.',minutes:3
 },
 {
  id:'sql-corrigir-obrigatoriedade',language:'sql',lessonIds:['sql-null-logica'],skillIds:['sql.null.obrigatoriedade'],afterBlock:4,kind:'choice',capability:'depuracao',requiresConcept:true,
  title:'O estoque aceita um saldo não informado',
  prompt:'O contrato exige quantidade inteira presente e não negativa: 0 e 5 entram; NULL e -1 são rejeitados. A tabela abaixo aceita NULL. Qual definição cumpre as duas regras para qualquer caminho de escrita? A escolha é conceitual; não altera um banco no navegador.',
  code:'CREATE TEMP TABLE estoque_null (valor integer CHECK (valor >= 0));',
  options:[{id:'somente-presenca',text:'valor integer NOT NULL'},{id:'presenca-faixa',text:'valor integer NOT NULL CHECK (valor >= 0)'},{id:'substituir-ausencia',text:'valor integer CHECK (COALESCE(valor, 0) >= 0)'}],
  hint:'Separe presença de faixa. Confira quais resultados lógicos CHECK aceita antes de trocar NULL por zero.',minutes:3
 },
 {
  id:'sql-correlacionar-ausentes',language:'sql',lessonIds:['sql-null-logica'],skillIds:['sql.null.correspondencia'],afterBlock:5,kind:'fill',capability:'alteracao',requiresConcept:true,
  title:'A exclusão também precisa de uma política para NULL',
  prompt:'Complete apenas o predicado entre as duas chaves. Neste exercício, duas ausências devem corresponder para fins de exclusão; NULL não vira zero. O resultado deve conter as ordens 2 e 4, preservando zero e a chave 3. Use o predicado de igualdade que trata duas ausências como correspondentes. Essa política é explícita do exercício, não prova de que pessoas com chaves desconhecidas sejam iguais. Resposta conceitual offline.',
  code:'WITH candidatos(ordem, chave) AS (\n  VALUES (1, NULL::integer), (2, 0), (3, 2), (4, 3)\n), bloqueios(chave) AS (VALUES (2), (NULL::integer), (2))\nSELECT c.ordem FROM candidatos c\nWHERE NOT EXISTS (SELECT 1 FROM bloqueios b WHERE b.chave ____ c.chave)\nORDER BY c.ordem;',
  hint:'NOT EXISTS só procura uma correspondência verdadeira. Decida como a comparação se comporta quando ambas as chaves estão ausentes.',minutes:4
 },
 {
  id:'js-debug-contadores',language:'javascript',lessonIds:['js-closures-estado'],skillIds:['javascript.closures.instancias'],afterBlock:2,kind:'debug',capability:'depuracao',requiresConcept:true,
  title:'Criar outro contador altera o primeiro',
  prompt:'Corrija criarContador(inicial=0). Cada instância começa no inteiro seguro não negativo recebido; inicial inválido lança TypeError. somar aceita apenas inteiro seguro positivo, retorna true ao somar e false ao rejeitar, preservando o estado inclusive em overflow. ler devolve o total. Os métodos devem funcionar também destacados do objeto. Investigue por que criar b modifica a. O código será executado no ambiente isolado, sem rede.',
  code:'let total = 0;\nfunction criarContador(inicial = 0) {\n  if (!Number.isSafeInteger(inicial) || inicial < 0) throw new TypeError("inicial inválido");\n  total = inicial;\n  return {\n    somar(valor) {\n      if (!Number.isSafeInteger(valor) || valor <= 0 || !Number.isSafeInteger(total + valor)) return false;\n      total += valor;\n      return true;\n    },\n    ler() { return total; }\n  };\n}',
  hint:'Desenhe o binding que cada método lê. Criar um objeto novo não garante um estado novo.',minutes:5
 },
 {
  id:'js-debug-callbacks',language:'javascript',lessonIds:['js-closures-estado'],skillIds:['javascript.closures.iteracoes'],afterBlock:4,kind:'debug',capability:'depuracao',requiresConcept:true,
  title:'Os callbacks só serão chamados depois do laço',
  prompt:'Corrija criarCallbacks(quantidade). Para um inteiro seguro entre 0 e 32, devolva quantidade funções que retornam seus índices de criação. A execução acontece depois da fábrica terminar, em qualquer ordem e mais de uma vez. Chamadas distintas da fábrica são independentes. Quantidade inválida lança RangeError. Não devolva índices já calculados no lugar das funções.',
  code:'function criarCallbacks(quantidade) {\n  if (!Number.isSafeInteger(quantidade) || quantidade < 0 || quantidade > 32) throw new RangeError("quantidade inválida");\n  const callbacks = [];\n  for (var indice = 0; indice < quantidade; indice++) {\n    callbacks.push(() => indice);\n  }\n  return callbacks;\n}',
  hint:'Compare executar dentro do laço com executar depois. Qual variável ainda existe quando os callbacks finalmente são chamados?',minutes:5
 },
 {
  id:'js-debug-snapshot',language:'javascript',lessonIds:['js-closures-estado'],skillIds:['javascript.closures.snapshots'],afterBlock:5,kind:'debug',capability:'depuracao',requiresConcept:true,
  title:'Uma cópia de strings que não abre o estado interno',
  prompt:'Corrija criarLista(iniciais=[]). iniciais deve ser um array de strings não vazias após trim; rejeite outro formato com TypeError sem alterar a entrada. Guarde as strings aparadas. adicionar(texto) retorna true ao adicionar string válida e false sem mudança nos demais casos. snapshot() devolve um array novo e mutável: mudar a entrada ou qualquer snapshot não pode modificar a instância. Preserve ordem e duplicatas. Os itens são somente strings; não é uma promessa de cópia profunda de objetos.',
  code:'function criarLista(iniciais = []) {\n  if (!Array.isArray(iniciais) || !Array.from(iniciais).every(texto => typeof texto === "string" && texto.trim() !== "")) throw new TypeError("lista inválida");\n  const itens = iniciais;\n  for (let indice = 0; indice < itens.length; indice++) itens[indice] = itens[indice].trim();\n  return {\n    adicionar(texto) {\n      if (typeof texto !== "string" || texto.trim() === "") return false;\n      itens.push(texto.trim());\n      return true;\n    },\n    snapshot() { return itens; }\n  };\n}',
  hint:'Liste todas as referências ao array: entrada, coleção interna e cada saída. Separar só uma dessas fronteiras pode deixar outro caminho de escrita.',minutes:6
 },
 {
  id:'cpp-requisito-verdadeiro',language:'cpp',lessonIds:['cpp-templates'],skillIds:['cpp.templates.requisitos'],afterBlock:3,kind:'fill',capability:'alteracao',requiresConcept:true,
  title:'A expressão é válida, mas o conceito é falso',
  prompt:'Em C++20, complete apenas o requisito dentro do bloco. Inteiro deve aceitar os tipos integrais da biblioteca, incluindo bool, e recusar double/string. Use um requisito aninhado, conservando std::integral<T>. A expressão simples abaixo aceitava double por estar bem formada. Avaliação conceitual offline; não compila sua resposta.',
  code:'#include <concepts>\ntemplate<class T>\nconcept Inteiro = requires {\n    ____\n};',
  hint:'Há diferença entre a validade de uma expressão e a exigência de que sua condição seja satisfeita.',minutes:3
 },
 {
  id:'cpp-ramo-descartado',language:'cpp',lessonIds:['cpp-templates'],skillIds:['cpp.templates.instanciacao'],afterBlock:4,kind:'fill',capability:'depuracao',requiresConcept:true,
  title:'O ramo que int não pode instanciar',
  prompt:'Complete apenas a palavra depois de if para descartar o ramo incompatível durante a instanciação. Entradas admitidas: int, std::string, std::vector<int> e std::array<int,N>. Coleção vazia tem quantidade zero; int representa um item. A condição requires verifica a existência de size sem executá-lo. Decisão conceitual, sem compilador C++ no navegador.',
  code:'template<class T>\nstd::size_t quantidade(const T& valor) {\n    if ____ (requires { valor.size(); }) {\n        return valor.size();\n    } else {\n        return 1;\n    }\n}',
  hint:'Um if comum não impede a instanciação do código que chama size em int.',minutes:3
 },
 {
  id:'cpp-prever-sobrecarga',language:'cpp',lessonIds:['cpp-templates'],skillIds:['cpp.templates.subsuncao'],afterBlock:5,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'A coleção tem tamanho e também permite reserva',
  prompt:'Preveja as duas linhas em C++20. ComReserva reutiliza ComTamanho, acrescentando reserve. As coleções são pequenas; alocação bem-sucedida é pressuposta. reserve não altera size nem os elementos. Esta previsão conceitual não compila ou executa sua resposta.',
  code:'#include <array>\n#include <concepts>\n#include <cstddef>\n#include <iostream>\n#include <vector>\n\ntemplate<class T>\nconcept ComTamanho = requires(const T& valor) {\n    { valor.size() } -> std::convertible_to<std::size_t>;\n};\ntemplate<class T>\nconcept ComReserva = ComTamanho<T> && requires(T& valor, std::size_t n) {\n    valor.reserve(n);\n};\ntemplate<ComTamanho T>\nconst char* preparar(T&) { return "fixo"; }\ntemplate<ComReserva T>\nconst char* preparar(T& valor) {\n    valor.reserve(valor.size() + 4);\n    return "reserva";\n}\nint main() {\n    std::vector<int> dinamico{1, 2};\n    std::array<int, 2> fixo{1, 2};\n    std::cout << preparar(dinamico) << "\\n";\n    std::cout << preparar(fixo) << "\\n";\n}',
  hint:'Descubra quais sobrecargas são viáveis para cada tipo e qual reutiliza os requisitos da outra.',minutes:4
 },
 {
  id:'ts-import-extensao',language:'typescript',lessonIds:['ts-modulos-configuracao'],skillIds:['typescript.modulos.resolucao-node'],afterBlock:2,kind:'fill',capability:'alteracao',requiresConcept:true,
  title:'O import precisa encontrar o JavaScript emitido',
  prompt:'TypeScript 5.9, Node.js 24 ESM direto, package.json com type:module e NodeNext. Não há bundler, loader ou reescrita de extensões. calculo.ts exporta dobrar. Complete apenas o caminho entre aspas para que entrada.ts compile e dist/entrada.js encontre dist/calculo.js. Avaliação conceitual offline, sem compilar sua resposta.',
  code:'import {dobrar} from "____";\nconsole.log(dobrar(3));',
  hint:'O arquivo encontrado pelo verificador e a extensão necessária no JavaScript emitido cumprem funções diferentes.',minutes:3
 },
 {
  id:'ts-alias-emitido',language:'typescript',lessonIds:['ts-modulos-configuracao'],skillIds:['typescript.modulos.alias-runtime'],afterBlock:3,kind:'choice',capability:'depuracao',requiresConcept:true,
  title:'Compilou, mas Node não encontrou o pacote',
  prompt:'paths mapeia @dominio/* para ./*.ts. tsc passou, mas node dist/entrada.js falhou com ERR_MODULE_NOT_FOUND. O artefato conserva o import abaixo; dist/calculo.js existe. Sem bundler ou configuração de pacotes adicional, qual alteração corrige o contrato de resolução? Diagnóstico conceitual, sem executar Node no navegador.',
  code:'import {dobrar} from "@dominio/calculo";\nconsole.log(dobrar(3));',
  options:[{id:'relativo',text:'Usar ./calculo.js na origem, recompilar e executar o artefato emitido.'},{id:'paths',text:'Repetir o mesmo paths no tsconfig e executar o mesmo JavaScript.'},{id:'declarar',text:'Adicionar declare module para prometer que o pacote existe.'}],
  hint:'Inspecione o texto do import no artefato, além da presença do arquivo. Uma declaração de tipos não instala um módulo.',minutes:3
 },
 {
  id:'ts-import-tipo-efeito',language:'typescript',lessonIds:['ts-modulos-configuracao'],skillIds:['typescript.modulos.efeitos'],afterBlock:5,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'Emitir uma dependência não é executá-la',
  prompt:'Os dois arquivos são compilados com strict, NodeNext, verbatimModuleSyntax e noEmitOnError em pacote type:module. Execute somente node dist/entrada.js. Preveja as linhas impressas; não há outros imports ou código. Esta previsão é conceitual e não executa sua resposta.',
  code:'// contratos.ts\nconsole.log("contratos");\nexport interface Medicao { valor: number; }\n\n// entrada.ts\nimport type {Medicao} from "./contratos.js";\nconst medicao: Medicao = {valor: 2};\nconsole.log(medicao.valor);',
  hint:'Desenhe o grafo dos imports que sobrevivem ao apagamento dos tipos. Ter um .js no disco não o inclui nesse grafo.',minutes:3
 },
 {
  id:'py-csv-prever-registro',language:'python',lessonIds:['py-biblioteca-dados'],skillIds:['python.csv.registros'],afterBlock:3,kind:'predict',capability:'leitura',requiresConcept:true,
  title:'Uma quebra de linha encerra o registro?',
  prompt:'Preveja as três linhas: quantidade de campos, quantidade recebida como texto e linhas físicas consumidas. As aspas pertencem ao formato CSV. Esta pausa compara sua previsão, sem executar Python no navegador.',
  code:'import csv\nfrom io import StringIO\n\ntexto = \'produto,quantidade\\n"caderno,\\nazul",2\\n\'\nleitor = csv.reader(StringIO(texto, newline=""), strict=True)\nnext(leitor)\nregistro = next(leitor)\nprint(len(registro))\nprint(registro[1])\nprint(leitor.line_num)',
  hint:'Separe campo, registro lógico e linha física. O leitor conserva a quebra que está dentro das aspas.',minutes:3
 },
 {
  id:'py-csv-cabecalho',language:'python',lessonIds:['py-biblioteca-dados'],skillIds:['python.csv.cabecalho'],afterBlock:4,kind:'choice',capability:'depuracao',requiresConcept:true,
  title:'O primeiro produto desapareceu na importação',
  prompt:'O contrato exige exatamente produto,quantidade nessa ordem. O arquivo tem um nome repetido e o primeiro valor desaparece do dicionário. Qual verificação deve acontecer antes de consumir os registros? Diagnóstico conceitual; não há execução local de Python.',
  code:'import csv\nfrom io import StringIO\n\ntexto = "produto,produto,quantidade\\ncaneta,caderno,2\\n"\nleitor = csv.DictReader(StringIO(texto, newline=""))\nregistro = next(leitor)\nprint(registro["produto"])',
  options:[
   {id:'conjunto',text:'Comparar somente set(leitor.fieldnames) com o conjunto dos nomes esperados.'},
   {id:'sequencia',text:'Comparar a sequência completa de fieldnames com os dois nomes esperados na ordem exigida.'},
   {id:'preencher',text:'Preencher produtos vazios depois de converter cada registro em dicionário.'}
  ],hint:'Um conjunto apaga repetições. Quando duas colunas viram a mesma chave, conferir somente o valor final já é tarde.',minutes:3
 },
 {
  id:'py-csv-lote',language:'python',lessonIds:['py-biblioteca-dados'],skillIds:['python.csv.validacao-lote'],afterBlock:5,kind:'order',capability:'aplicacao',requiresConcept:true,
  title:'Uma linha inválida não pode deixar meia importação',
  prompt:'Ordene a função. registros vem do leitor CSV depois de validar o cabeçalho; destino é uma lista existente. Se a leitura ou validação falhar, destino deve conservar o conteúdo anterior. validar_registro aceita dois campos, produto não vazio e quantidade de 1 a 9 algarismos ASCII (zero permitido). O número identifica o registro lógico, incluindo o cabeçalho como primeiro. Ordenação conceitual, sem executar Python; não simula transação de banco.',
  code:'def validar_registro(registro, numero):\n    if len(registro) != 2:\n        raise ValueError(f"registro {numero}: esperados dois campos")\n    produto, quantidade = registro\n    if not produto.strip():\n        raise ValueError(f"registro {numero}: produto vazio")\n    if not (1 <= len(quantidade) <= 9 and quantidade.isascii() and quantidade.isdecimal()):\n        raise ValueError(f"registro {numero}: quantidade inválida")\n    return produto.strip(), int(quantidade)',
  lines:[
   {id:'funcao',code:'def importar_registros(registros, destino):'},
   {id:'lote',code:'    lote = []'},
   {id:'percorrer',code:'    for numero, registro in enumerate(registros, start=2):'},
   {id:'validar',code:'        produto, quantidade = validar_registro(registro, numero)'},
   {id:'gravar',code:'    destino.extend(lote)'},
   {id:'acumular',code:'        lote.append((produto, quantidade))'},
   {id:'retornar',code:'    return len(lote)'}
  ],hint:'Separe a lista temporária da lista que já existe. A mudança no destino depende de todo o lote ter passado pela leitura e validação.',minutes:4
 },
  {
    "id": "cs-prever-cancelamento",
    "language": "csharp",
    "lessonIds": [
      "cs-assincrono-recursos"
    ],
    "skillIds": [
      "csharp.assincrono.cancelamento"
    ],
    "afterBlock": 3,
    "kind": "predict",
    "capability": "leitura",
    "requiresConcept": true,
    "title": "O pedido de cancelamento desfaz o que já terminou?",
    "prompt": "Preveja as duas linhas. A primeira gravação termina antes de Cancel. A segunda verifica o token antes de alterar gravados. Esta pausa compara raciocínio; não executa .NET no navegador.",
    "code": "using var fonte = new CancellationTokenSource();\nint gravados = 0;\nTask GravarAsync(CancellationToken token) {\n    token.ThrowIfCancellationRequested();\n    gravados++;\n    return Task.CompletedTask;\n}\nawait GravarAsync(fonte.Token);\nfonte.Cancel();\ntry { await GravarAsync(fonte.Token); }\ncatch (OperationCanceledException) when (fonte.IsCancellationRequested) {\n    Console.WriteLine(\"cancelado\");\n}\nConsole.WriteLine(gravados);",
    "hint": "Separe o efeito que já ocorreu da próxima operação que ainda precisa aceitar o pedido.",
    "minutes": 3
  },
  {
    "id": "cs-vaga-sem-posse",
    "language": "csharp",
    "lessonIds": [
      "cs-assincrono-recursos"
    ],
    "skillIds": [
      "csharp.assincrono.vagas"
    ],
    "afterBlock": 4,
    "kind": "choice",
    "capability": "depuracao",
    "requiresConcept": true,
    "title": "Uma vaga foi liberada por quem nunca entrou",
    "prompt": "Outro consumidor já ocupa a única vaga. O token está cancelado antes da segunda espera. Mesmo sem adquirir, o programa libera uma vaga no finally. Qual alteração conserva o limite em sucesso, erro e cancelamento?",
    "code": "using var vagas = new SemaphoreSlim(1, 1);\nawait vagas.WaitAsync();\nusing var fonte = new CancellationTokenSource();\nfonte.Cancel();\ntry {\n    try { await vagas.WaitAsync(fonte.Token); }\n    finally { vagas.Release(); }\n}\ncatch (OperationCanceledException) { }\nConsole.WriteLine(vagas.CurrentCount);",
    "options": [
      {
        "id": "adquirir",
        "text": "Aguardar a aquisição antes do try; envolver somente o trabalho adquirido em try/finally com Release."
      },
      {
        "id": "duplicar",
        "text": "Adicionar outro Release no catch para compensar o cancelamento."
      },
      {
        "id": "suprimir",
        "text": "Remover o token de WaitAsync para a espera nunca ser cancelada."
      }
    ],
    "hint": "O finally executa também quando a espera falha. Identifique o instante em que esta chamada passa a possuir uma vaga.",
    "minutes": 3
  },
  {
    "id": "cs-token-vinculado",
    "language": "csharp",
    "lessonIds": [
      "cs-assincrono-recursos"
    ],
    "skillIds": [
      "csharp.assincrono.propagacao"
    ],
    "afterBlock": 5,
    "kind": "fill",
    "capability": "alteracao",
    "requiresConcept": true,
    "title": "Escutar o usuário e o encerramento da aplicação",
    "prompt": "Complete somente o argumento de EsperarAsync. A operação deve atender tanto usuario quanto aplicacao; nenhuma dessas duas fontes pertence ao método chamado. A fonte vinculada permanece viva até a operação terminar. Não há execução .NET nesta pausa.",
    "code": "using var usuario = new CancellationTokenSource();\nusing var aplicacao = new CancellationTokenSource();\nusing var vinculada = CancellationTokenSource.CreateLinkedTokenSource(\n    usuario.Token, aplicacao.Token);\nvar tarefa = EsperarAsync(____);\naplicacao.Cancel();\ntry { await tarefa; }\ncatch (OperationCanceledException) when (vinculada.IsCancellationRequested) {\n    Console.WriteLine(\"cancelado\");\n}\nConsole.WriteLine(usuario.IsCancellationRequested);\nstatic async Task EsperarAsync(CancellationToken token) {\n    await Task.Delay(Timeout.Infinite, token);\n}",
    "hint": "A operação precisa receber o token que escuta os dois pedidos. Encerrar a aplicação não deve cancelar a fonte do usuário.",
    "minutes": 3
  },
 {
   "id": "css-prever-contexto",
   "language": "css",
   "lessonIds": [
     "css-containers-contexto"
   ],
   "skillIds": [
     "css.componentes.contexto"
   ],
   "afterBlock": 1,
   "kind": "predict",
   "capability": "leitura",
   "requiresConcept": true,
   "title": "A condição e a unidade medem a mesma caixa?",
   "prompt": "Considere painel externo de 600 px e coluna interna de 220 px, ambos com inline-size definido e sem bordas ou padding. O título está dentro da coluna. Escreva em duas linhas o indicador (amplo ou compacto) e o tamanho da fonte em pixels (só o número).",
   "code": ".painel { container: painel / inline-size; width: 600px; }\n.coluna { container: coluna / inline-size; width: 220px; }\nh2 { font-size: 16px; }\n@container painel (min-width: 500px) {\n  .indicador::after { content: \"amplo\"; }\n  h2 { font-size: 10cqi; }\n}",
   "hint": "Separe a caixa que torna a condição verdadeira da referência usada pela unidade cqi.",
   "minutes": 3
 },
 {
   "id": "css-corrigir-ancestral",
   "language": "css",
   "lessonIds": [
     "css-containers-contexto"
   ],
   "skillIds": [
     "css.componentes.ancestrais"
   ],
   "afterBlock": 3,
   "kind": "choice",
   "capability": "depuracao",
   "requiresConcept": true,
   "title": "O cartão não encontra um contexto",
   "prompt": "O cartão é o único elemento com container-type. Ele mede 600 px, mas a regra abaixo não ativa duas colunas. Não existe outro contêiner ancestral. Qual mudança corrige a causa mantendo a medida local?",
   "code": ".cartao { container-type: inline-size; width: 600px; display: grid; }\n@container (min-width: 480px) {\n  .cartao { grid-template-columns: 1fr 1fr; }\n}",
   "options": [
     {
       "id": "viewport",
       "text": "Trocar por @media para medir a janela."
     },
     {
       "id": "envolver",
       "text": "Criar uma região ancestral com container-type e deixar o cartão como descendente."
     },
     {
       "id": "limiar",
       "text": "Reduzir o limite para 1 px sem mudar o contêiner."
     }
   ],
   "hint": "A regra aplica estilos ao cartão. Verifique onde ele procuraria o contêiner que fornece a medida.",
   "minutes": 3
 },
 {
   "id": "css-completar-limite",
   "language": "css",
   "lessonIds": [
     "css-containers-contexto"
   ],
   "skillIds": [
     "css.componentes.limites"
   ],
   "afterBlock": 5,
   "kind": "fill",
   "capability": "alteracao",
   "requiresConcept": true,
   "title": "A mudança inclui exatamente 480 px",
   "prompt": "Complete apenas a condição entre parênteses. O painel já é um ancestral elegível chamado painel. O contrato exige uma coluna em 479 px e duas ao atingir 480 px; use a sintaxe min-width em pixels.",
   "code": "@container painel (____) {\n  .cartao { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n}",
   "hint": "Diferencie atingir o limite de ultrapassá-lo. Não troque a medida local por uma media query.",
   "minutes": 2
 },
 {
  id:'js-debug-carrinho',language:'javascript',lessonIds:['js-conversao-limites','js-semantica'],skillIds:['javascript.conversao'],afterBlock:3,kind:'debug',capability:'depuracao',
  title:'O carrinho virou NaN',
  prompt:'totalizar recebe itens com preco numérico finito não negativo e quantidade inteira segura não negativa. O exemplo deveria retornar o número 89.9 (R$ 89,90), mas retorna NaN. Corrija o comportamento para qualquer carrinho válido: vazio retorna 0; arredonde o total a dois decimais; o total arredondado em centavos precisa ser um inteiro seguro (até Number.MAX_SAFE_INTEGER); valores que excedem essa faixa ou produzem total não finito lançam TypeError, assim como dados fora do contrato; preserve a entrada. Não devolva apenas o total deste exemplo.',
  code:'function totalizar(itens) {\n  let total = 0;\n  for (const item of itens) {\n    total += item.preco * item.qtd;\n  }\n  return total;\n}\n// Exemplo: totalizar([{preco:29.95,quantidade:2},{preco:30,quantidade:1}])',
  hint:'Compare os nomes do contrato com a propriedade lida no cálculo. Depois investigue vazio, quantidade zero e dados inválidos.',minutes:5
 },
 {
  id:'js-debug-soma-vazia',language:'javascript',lessonIds:['js-colecoes-iteracao'],skillIds:['javascript.arrays.reduce'],afterBlock:1,kind:'debug',capability:'depuracao',
  title:'A soma quebra com uma lista vazia',
  prompt:'somaLista recebe apenas uma lista de números finitos. Ela deve devolver sua soma, incluindo 0 quando a lista está vazia, sem mudar a lista. [2, 3] funciona; [] lança um erro. Corrija a regra e teste valores negativos.',
  code:'function somaLista(valores) {\n  return valores.reduce((total, valor) => total + valor);\n}',hint:'Pergunte qual é o elemento neutro da soma e como a primeira chamada do acumulador recebe seu valor.',minutes:3
 },
 {
  id:'js-debug-maior-negativo',language:'javascript',lessonIds:['js-colecoes-iteracao','js-funcoes-this'],skillIds:['javascript.arrays.limites'],afterBlock:3,kind:'debug',capability:'depuracao',
  title:'O maior valor nunca pode ser inventado',
  prompt:'maior recebe uma lista de números finitos e retorna seu maior elemento; [] retorna null. O programa retorna 0 para [-8, -3], mesmo sem zero na entrada. Corrija a inicialização e a fronteira vazia, preservando a lista.',
  code:'function maior(valores) {\n  let atual = 0;\n  for (const valor of valores) {\n    if (valor > atual) atual = valor;\n  }\n  return atual;\n}',hint:'O candidato inicial precisa vir dos dados ou de uma regra que não esconda números negativos.',minutes:4
 },
 {
  id:'js-debug-filtro-mutacao',language:'javascript',lessonIds:['js-colecoes-iteracao','js-objetos-modelos'],skillIds:['javascript.arrays.filter'],afterBlock:5,kind:'debug',capability:'depuracao',
  title:'Filtrar ativou todos os cadastros',
  prompt:'selecionarAtivos devolve somente objetos cujo ativo é exatamente o booleano true. O texto "true" não conta. Preserve a ordem e todos os campos da entrada. O código abaixo muda os cadastros e aceita todo mundo; corrija os dois efeitos.',
  code:'function selecionarAtivos(pessoas) {\n  return pessoas.filter(pessoa => pessoa.ativo = "true");\n}',hint:'Compare atribuição e comparação. Verifique também se texto e booleano representam o mesmo contrato.',minutes:4
 },
 {
  id:'html-label-vinculo',language:'html',lessonIds:['html-formularios','html-dados-formulario'],skillIds:['html.formularios'],afterBlock:1,kind:'fill',capability:'alteracao',
  title:'Um rótulo que realmente aponta para o campo',
  prompt:'Complete apenas o valor de for. Clicar no rótulo deve focar o input abaixo; esse vínculo usa o id do controle.',
  code:'<label for="___">E-mail</label>\n<input id="email-contato" name="email" type="email">',hint:'name participa dos dados enviados; id identifica o elemento para o rótulo.',minutes:1
 },
 {
  id:'html-dialogo-foco',language:'html',lessonIds:['html-dialogo-foco','html-acessibilidade'],skillIds:['html.dialogo.foco'],afterBlock:3,kind:'choice',capability:'depuracao',
  title:'Evite uma confirmação destrutiva por acidente',
  prompt:'Um diálogo modal curto pergunta se um arquivo será removido. Ao abrir, o foco inicial deve permitir desistir sem disparar a remoção. Qual trecho coloca o foco no botão apropriado sem inventar tabindex positivo?',
  options:[{id:'cancelar',text:'<button autofocus type="button">Cancelar</button>'},{id:'remover',text:'<button autofocus type="button">Remover arquivo</button>'},{id:'positivo',text:'<button tabindex="99" type="button">Cancelar</button>'}],
  hint:'A escolha de foco precisa combinar a ação, o risco e a ordem natural de teclado.',minutes:2
 },
 {
  id:'css-grid-minimo',language:'css',lessonIds:['css-grid-trilhas','css-flex-grid'],skillIds:['css.grid'],afterBlock:1,kind:'fill',capability:'alteracao',
  title:'Duas colunas sem largura intrínseca escondida',
  prompt:'Complete a função no lugar de ___ para obter duas trilhas flexíveis iguais com mínimo zero. O conteúdo longo deve poder encolher na trilha; use a função CSS e seus dois argumentos.',
  code:'.painel { display:grid; grid-template-columns:repeat(2, ___); }\n.item { min-width:0; overflow-wrap:anywhere; }',hint:'Uma trilha 1fr isolada conserva um mínimo automático. Declare explicitamente o limite inferior.',minutes:2
 },
 {
  id:'css-grade-estreita',language:'css',lessonIds:['css-responsivo','css-grid-trilhas'],skillIds:['css.responsividade'],afterBlock:3,kind:'choice',capability:'aplicacao',
  title:'A grade precisa caber em 220 px',
  prompt:'O contêiner tem 196 px úteis dentro de uma tela de 220 px. Qual regra permite uma única coluna menor que 14rem quando necessário e cria mais colunas quando houver espaço? Conteúdo interno também precisa permitir quebra.',
  options:[{id:'adaptar',text:'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))'},{id:'fixar',text:'repeat(3, 14rem)'},{id:'minimo',text:'repeat(auto-fit, minmax(14rem, 1fr))'}],
  hint:'Um mínimo fixo maior que o contêiner continua causando transbordamento mesmo com auto-fit.',minutes:2
 },
 {
  id:'ts-unknown-validacao',language:'typescript',lessonIds:['ts-validacao-aninhada','ts-contratos'],skillIds:['typescript.narrowing'],afterBlock:1,kind:'choice',capability:'depuracao',
  title:'Uma anotação não valida a resposta',
  prompt:'valor: unknown veio de JSON externo e precisa virar um número finito. Qual trecho verifica o contrato em tempo de execução antes de usá-lo?',
  options:[{id:'validar',text:'if (typeof valor === "number" && Number.isFinite(valor)) { usar(valor); }'},{id:'afirmar',text:'usar(valor as number);'},{id:'ignorar',text:'const numero: any = valor; usar(numero);'}],
  hint:'Assertion e any alteram a verificação estática; não examinam os dados recebidos.',minutes:2
 },
 {
  id:'ts-zero-ausencia',language:'typescript',lessonIds:['ts-inferencia-ausencia','ts-fundamentos'],skillIds:['typescript.ausencia'],afterBlock:3,kind:'fill',capability:'depuracao',
  title:'Zero é uma configuração válida',
  prompt:'limite é number | undefined. Complete apenas o operador: indefinido usa 10, mas limite igual a zero precisa continuar zero.',
  code:'const quantidade = limite ___ 10;',hint:'A falta de um valor e um valor falsy não são a mesma condição.',minutes:1
 },
 {
  id:'py-prever-range',language:'python',lessonIds:['py-controle-invariantes','py-fundamentos'],skillIds:['python.controle.range'],afterBlock:1,kind:'predict',capability:'leitura',
  title:'Preveja antes do interpretador',
  prompt:'Digite as três linhas da saída, na ordem, sem aspas. Esta verificação compara uma previsão; não executa Python.',
  code:'for numero in range(0, 6, 2):\n    print(numero)',hint:'O limite final não faz parte de range. Avance pelo passo indicado.',minutes:2
 },
 {
  id:'py-ordenar-default',language:'python',lessonIds:['py-funcoes-contratos','py-colecoes-funcoes'],skillIds:['python.funcoes.defaults'],afterBlock:3,kind:'order',capability:'alteracao',
  title:'Reconstrua uma função sem lista compartilhada',
  prompt:'Ordene todas as linhas para que cada chamada sem lista receba uma nova lista; uma lista fornecida continua recebendo append. Use os identificadores das linhas, um por linha. A indentação exibida pertence à linha. Esta atividade verifica a reconstrução, sem interpretar Python.',
  lines:[{id:'retornar',code:'    return lista'},{id:'alocar',code:'        lista = []'},{id:'declarar',code:'def adicionar(item, lista=None):'},{id:'anexar',code:'    lista.append(item)'},{id:'testar',code:'    if lista is None:'}],hint:'A assinatura vem antes do corpo; o bloco condicional deve criar a lista antes do primeiro uso.',minutes:3
 },
 {
  id:'py-keyword-contrato',language:'python',lessonIds:['py-funcoes-contratos'],skillIds:['python.funcoes.contratos'],afterBlock:5,kind:'choice',capability:'depuracao',
  title:'O argumento existe, mas foi passado no lugar errado',
  prompt:'def registrar(nome, *, ativo=False): return (nome, ativo). A chamada registrar("Lia", True) falha. Qual mudança corrige a chamada mantendo o contrato keyword-only? Diagnóstico conceitual: nenhum interpretador foi executado.',
  options:[{id:'nomeado',text:'registrar("Lia", ativo=True)'},{id:'trocar',text:'registrar(True, "Lia")'},{id:'lista',text:'registrar(["Lia", True])'}],hint:'O asterisco separa parâmetros posicionais dos que precisam aparecer pelo nome.',minutes:2
 },
 {
  id:'cs-prever-decimal',language:'csharp',lessonIds:['cs-decimal-limites','cs-tipos-controle'],skillIds:['csharp.tipos.decimal'],afterBlock:1,kind:'predict',capability:'leitura',
  title:'Dinheiro com tipo decimal',
  prompt:'Digite a linha impressa, respeitando True ou False de C#. O sufixo m cria decimal. Esta é uma previsão, sem executar .NET.',
  code:'decimal total = 0.1m + 0.2m;\nConsole.WriteLine(total == 0.3m);',hint:'Os três literais usam a mesma representação decimal, sem conversão intermediária para double.',minutes:2
 },
 {
  id:'cs-ordenar-using',language:'csharp',lessonIds:['cs-iteradores-descarte','cs-assincrono-recursos'],skillIds:['csharp.iteradores.descarte'],afterBlock:3,kind:'order',capability:'alteracao',
  title:'Reconstrua a fronteira de descarte',
  prompt:'Ordene os identificadores para abrir o recurso, usá-lo no bloco e sair dele antes de imprimir fim. A variável pertence ao bloco using. Isto verifica a estrutura do código, sem compilar C#.',
  lines:[{id:'fim',code:'Console.WriteLine("fim");'},{id:'fechar',code:'}'},{id:'abrir',code:'using (var recurso = new Recurso())'},{id:'usar',code:'    recurso.Usar();'},{id:'bloco',code:'{'}],
  hint:'O bloco delimita a vida do recurso, e o uso precisa ocorrer dentro dessa fronteira.',minutes:3
 },
 {
  id:'cs-nullable-guard',language:'csharp',lessonIds:['cs-tipos-controle','cs-metodos-parametros'],skillIds:['csharp.tipos.nullable'],afterBlock:5,kind:'choice',capability:'depuracao',
  title:'Valor ausente não tem Value',
  prompt:'int? idade pode ser null. idade.Value + 1 lança InvalidOperationException nesse caso. Qual trecho calcula o próximo valor somente quando existe idade? Diagnóstico conceitual; não comprova compilação ou execução .NET.',
  options:[{id:'padrao',text:'if (idade is int valor) Console.WriteLine(valor + 1);'},{id:'forcar',text:'Console.WriteLine(idade!.Value + 1);'},{id:'texto',text:'if (idade.ToString() != "null") Console.WriteLine(idade.Value + 1);'}],
  hint:'O operador de supressão de aviso não fabrica um valor que esteja ausente.',minutes:2
 },
 {
  id:'cpp-prever-referencia',language:'cpp',lessonIds:['cpp-funcoes-referencias','cpp-fundamentos'],skillIds:['cpp.referencias'],afterBlock:1,kind:'predict',capability:'leitura',
  title:'A referência acompanha o original',
  prompt:'Digite a saída da sequência abaixo, sem espaços extras. A referência aponta para o mesmo int. Esta é uma previsão, sem invocar um compilador C++.',
  code:'int n = 4;\nint& alias = n;\nalias += 3;\nstd::cout << n << "," << alias;',hint:'alias não recebeu uma cópia independente do número.',minutes:2
 },
 {
  id:'cpp-ordenar-raii',language:'cpp',lessonIds:['cpp-raii-posse-unica','cpp-classes-raii'],skillIds:['cpp.raii'],afterBlock:3,kind:'order',capability:'alteracao',
  title:'Faça a posse acompanhar o escopo',
  prompt:'Ordene os identificadores: abra o escopo, crie a posse única, use-a, encerre o escopo e imprima fim. A liberação ocorre pela vida de unique_ptr. Verificação estrutural offline; sem compilação C++.',
  lines:[{id:'usar',code:'    std::cout << *valor << "\\n";'},{id:'fim',code:'std::cout << "fim\\n";'},{id:'fechar',code:'}'},{id:'criar',code:'    auto valor = std::make_unique<int>(7);'},{id:'abrir',code:'{'}],hint:'O objeto que controla a posse precisa existir antes de ser desreferenciado e ser destruído na saída do escopo.',minutes:3
 },
 {
  id:'cpp-iterador-invalidado',language:'cpp',lessonIds:['cpp-stl-algoritmos','cpp-memoria-posse'],skillIds:['cpp.stl.iteradores'],afterBlock:5,kind:'choice',capability:'depuracao',
  title:'Não adivinhe a saída de comportamento indefinido',
  prompt:'v é std::vector<int>{1,2}. it = v.begin(). Uma chamada reserve(v.capacity()+10) realoca o armazenamento; depois ocorre std::cout << *it. Qual diagnóstico está correto? Análise conceitual, sem compilador.',
  options:[{id:'invalidado',text:'A realocação invalidou it; obtenha um novo iterador antes de desreferenciar.'},{id:'um',text:'A saída é obrigatoriamente 1 porque o primeiro elemento não mudou.'},{id:'zero',text:'A saída é obrigatoriamente 0 porque reserve zera iteradores.'}],
  hint:'Um elemento conservar seu valor não garante que o endereço antigo continue válido.',minutes:2
 },
 {
  id:'sql-null-filtro',language:'sql',lessonIds:['sql-null-logica','sql-modelagem-completa'],skillIds:['sql.null'],afterBlock:1,kind:'choice',capability:'depuracao',
  title:'A comparação que não encontra ausência',
  prompt:'A coluna apelido contém NULL e textos. WHERE apelido = NULL não seleciona os registros ausentes. Qual predicado expressa essa intenção? Esta atividade verifica a decisão, sem executar um banco.',
  options:[{id:'isnull',text:'apelido IS NULL'},{id:'igual',text:'apelido = NULL'},{id:'texto',text:'apelido = "NULL"'}],hint:'Uma comparação com valor desconhecido não se torna true por comparar duas ausências.',minutes:2
 },
 {
  id:'sql-prever-fanout',language:'sql',lessonIds:['sql-joins-cardinalidade','sql-consultas-joins'],skillIds:['sql.joins.cardinalidade'],afterBlock:3,kind:'predict',capability:'leitura',
  title:'Conte as combinações antes de somar',
  prompt:'Um único pedido tem 2 itens e 3 pagamentos. Um INNER JOIN de pedidos com as duas tabelas, cada uma apenas por pedido_id, gera quantas linhas para esse pedido? Digite o número. Previsão conceitual sem servidor SQL.',
  code:'SELECT p.id, i.id, pg.id\nFROM pedidos p\nJOIN itens i ON i.pedido_id = p.id\nJOIN pagamentos pg ON pg.pedido_id = p.id;',
  hint:'Cada linha de uma coleção combina com todas as correspondentes da outra.',minutes:2
 }
 ,{
  id:'html-ordenar-formulario',language:'html',lessonIds:['html-dados-formulario','html-formularios'],skillIds:['html.formularios'],afterBlock:5,kind:'order',capability:'alteracao',
  title:'Reconstrua um formulário nomeado',
  prompt:'Ordene os identificadores para abrir form, associar o rótulo, criar o controle, criar o botão e fechar form. A ordem pedida mantém o rótulo antes do controle. Esta atividade confere a estrutura escolhida, sem executar o envio.',
  lines:[{id:'botao',code:'  <button type="submit">Enviar</button>'},{id:'campo',code:'  <input id="nome" name="nome" required>'},{id:'fim',code:'</form>'},{id:'rotulo',code:'  <label for="nome">Nome</label>'},{id:'inicio',code:'<form action="/contato" method="post">'}],
  hint:'Um controle enviado precisa estar no form, ter name e ser identificado pelo rótulo.',minutes:3
 },
 {
  id:'css-prever-cascata',language:'css',lessonIds:['css-cascata-camadas','css-cascata'],skillIds:['css.cascata'],afterBlock:5,kind:'choice',capability:'leitura',
  title:'Preveja qual cor vence',
  prompt:'O botão tem class="acao" e id="salvar". Todas as regras abaixo são de autor, normais, sem camadas. Qual cor vence? Esta é uma previsão da cascata, sem renderização.',
  code:'.acao { color:blue; }\n#salvar { color:green; }\nbutton.acao { color:red; }',
  options:[{id:'green',text:'green'},{id:'red',text:'red'},{id:'blue',text:'blue'}],hint:'A ordem só decide um empate depois das regras de prioridade e especificidade.',minutes:2
 },
 {
  id:'ts-tipo-apagado',language:'typescript',lessonIds:['ts-fundamentos','ts-fronteiras-qualidade'],skillIds:['typescript.runtime'],afterBlock:5,kind:'choice',capability:'depuracao',
  title:'Compilar não instala uma validação',
  prompt:'const resposta = JSON.parse(\'{"idade":"20"}\') as {idade:number}; O TypeScript pode aceitar resposta.idade + 1. Qual resultado JavaScript ocorre com esse JSON? Previsão conceitual: o compilador e o runtime não foram executados nesta atividade.',
  options:[{id:'texto',text:'O texto "201", porque a assertion não converte a string recebida.'},{id:'numero',text:'O número 21, porque as {idade:number} converte os dados.'},{id:'compila',text:'Uma exceção automática de validação de tipos emitida pelo TypeScript.'}],
  hint:'As anotações e assertions são apagadas na emissão do JavaScript.',minutes:2
 },
 {
  id:'sql-ordenar-transacao',language:'sql',lessonIds:['sql-transacoes','sql-isolamento-sessoes'],skillIds:['sql.transacoes.atomicidade'],afterBlock:5,kind:'order',capability:'alteracao',
  title:'Uma transferência tem uma fronteira só',
  prompt:'Uma operação já validou saldo e destinatário. Ordene o cronograma exigido: iniciar, debitar, creditar, confirmar. Os dois UPDATE devem ficar na mesma transação. É uma reconstrução conceitual; não verifica concorrência, saldo nem executor SQL.',
  lines:[{id:'credito',code:'UPDATE contas SET saldo = saldo + 10 WHERE id = 2;'},{id:'confirmar',code:'COMMIT;'},{id:'iniciar',code:'BEGIN;'},{id:'debito',code:'UPDATE contas SET saldo = saldo - 10 WHERE id = 1;'}],
  hint:'COMMIT só confirma as alterações realizadas depois do BEGIN correspondente.',minutes:3
 }
,
{
  "id": "py-prever-esgotamento",
  "requiresConcept": true,
  "language": "python",
  "lessonIds": [
    "py-iteracao-recursos"
  ],
  "skillIds": [
    "python.iteradores.consumo"
  ],
  "afterBlock": 1,
  "kind": "predict",
  "capability": "leitura",
  "title": "O cursor já avançou",
  "prompt": "Escreva as três linhas impressas, usando a representação de listas de Python. Esta pausa compara sua previsão e não executa Python.",
  "code": "origem = iter([0, 1, 2])\nprint(next(origem))\nprint(list(origem))\nprint(list(origem))",
  "hint": "Cada operação recebe o mesmo cursor. A primeira lista começa na posição atual e a segunda encontra o fim.",
  "minutes": 2
},
{
  "id": "py-ordenar-lote",
  "requiresConcept": true,
  "language": "python",
  "lessonIds": [
    "py-iteracao-recursos"
  ],
  "skillIds": [
    "python.iteradores.lotes"
  ],
  "afterBlock": 3,
  "kind": "order",
  "capability": "alteracao",
  "title": "Um lote e nenhuma leitura extra",
  "prompt": "islice já foi importado. Ordene as linhas da função que entrega uma única tupla de até tamanho elementos, sem ler o seguinte. Assume-se tamanho int positivo já validado; esta pausa não avalia validação nem fechamento da origem.",
  "lines": [
    {
      "id": "retornar",
      "code": "    return lote"
    },
    {
      "id": "consumir",
      "code": "    lote = tuple(islice(origem, tamanho))"
    },
    {
      "id": "declarar",
      "code": "def primeiro_lote(fonte, tamanho):"
    },
    {
      "id": "cursor",
      "code": "    origem = iter(fonte)"
    }
  ],
  "hint": "A declaração vem antes do corpo. Obtenha o cursor antes de consumi-lo e devolva a tupla somente depois de construí-la.",
  "minutes": 3
},
{
  "id": "py-fechar-consumo",
  "requiresConcept": true,
  "language": "python",
  "lessonIds": [
    "py-iteracao-recursos"
  ],
  "skillIds": [
    "python.iteradores.recursos"
  ],
  "afterBlock": 5,
  "kind": "choice",
  "capability": "depuracao",
  "title": "Quem fecha a fonte interrompida?",
  "prompt": "fonte é um iterador de posse do consumidor com close que termina normalmente. O consumidor lê um elemento e pode falhar logo depois. Qual trecho garante close na saída sem percorrer o restante? Diagnóstico conceitual, sem executar Python. closing já foi importado.",
  "options": [
    {
      "id": "closing",
      "text": "with closing(fonte) as origem: processar(next(origem))"
    },
    {
      "id": "break",
      "text": "for item in fonte: processar(item); break"
    },
    {
      "id": "lista",
      "text": "processar(list(fonte)[0])"
    }
  ],
  "hint": "Interromper um for não define o fechamento da origem; procure a fronteira que libera o recurso também quando processar falha.",
  "minutes": 2
}
,
{
  "id": "ts-fonte-covariancia",
  "requiresConcept": true,
  "language": "typescript",
  "lessonIds": [
    "ts-variancia-contratos"
  ],
  "skillIds": [
    "typescript.variancia.resultados"
  ],
  "afterBlock": 1,
  "kind": "choice",
  "capability": "reconhecimento",
  "title": "O resultado conserva a promessa",
  "prompt": "Registro tem id; Detalhado tem id e pontos. Fonte<T> oferece apenas ler: () => T. Qual substituição conserva o contrato de leitura? Decisão conceitual, sem compilar código do aluno.",
  "options": [
    {
      "id": "detalhada",
      "text": "Usar Fonte<Detalhado> como Fonte<Registro>."
    },
    {
      "id": "basica",
      "text": "Usar Fonte<Registro> como Fonte<Detalhado>."
    },
    {
      "id": "ambas",
      "text": "As duas direções sempre garantem pontos."
    }
  ],
  "hint": "A pessoa que só pediu id pode receber mais campos; quem pediu pontos precisa que eles existam.",
  "minutes": 2
},
{
  "id": "ts-callback-entrada",
  "requiresConcept": true,
  "language": "typescript",
  "lessonIds": [
    "ts-variancia-contratos"
  ],
  "skillIds": [
    "typescript.variancia.parametros"
  ],
  "afterBlock": 3,
  "kind": "choice",
  "capability": "depuracao",
  "title": "O callback não pode exigir o que falta",
  "prompt": "Com strictFunctionTypes habilitado, a posição (item: Registro) => void pode chamar com qualquer Registro de apenas id. Qual callback atende a todas as entradas permitidas? Pausa conceitual, sem executar compilador.",
  "options": [
    {
      "id": "geral",
      "text": "Um callback que aceita Registro e lê somente id."
    },
    {
      "id": "restrito",
      "text": "Um callback que exige Detalhado e chama pontos.toFixed()."
    },
    {
      "id": "assertion",
      "text": "O callback restrito, desde que seja forçado por uma assertion."
    }
  ],
  "hint": "Construa uma entrada válida sem pontos e acompanhe o campo que cada implementação tenta usar.",
  "minutes": 2
},
{
  "id": "ts-propriedade-funcao",
  "requiresConcept": true,
  "language": "typescript",
  "lessonIds": [
    "ts-variancia-contratos"
  ],
  "skillIds": [
    "typescript.variancia.metodos"
  ],
  "afterBlock": 5,
  "kind": "choice",
  "capability": "alteracao",
  "title": "Escolha a assinatura que confere parâmetros",
  "prompt": "Uma API precisa da relação de parâmetros exigida por strictFunctionTypes em callbacks. Qual forma descreve uma propriedade de função? Nenhum compilador é executado nesta pausa. A atividade não comprova validação de dados externos.",
  "options": [
    {
      "id": "propriedade",
      "text": "processar: (item: T) => string"
    },
    {
      "id": "metodo",
      "text": "processar(item: T): string"
    },
    {
      "id": "any",
      "text": "processar: any"
    }
  ],
  "hint": "Observe onde estão os dois pontos e a seta; assinaturas de método recebem tratamento mais permissivo.",
  "minutes": 2
}
,{
  "id": "cpp-prever-intervalo",
  "requiresConcept": true,
  "language": "cpp",
  "lessonIds": [
    "cpp-iteradores-invalidacao"
  ],
  "skillIds": [
    "cpp.vector.iteracao"
  ],
  "afterBlock": 1,
  "kind": "predict",
  "capability": "leitura",
  "title": "A fronteira fica fora do intervalo",
  "prompt": "Escreva a saída, incluindo a vírgula. Todos os acessos abaixo são válidos. Esta pausa compara uma previsão; nenhum compilador é executado.",
  "code": "std::vector<int> dados{4, 6};\nauto it = dados.begin();\n++it;\nstd::cout << *it << \",\" << dados.size();",
  "hint": "Um avanço chega ao segundo elemento; size conta elementos construídos.",
  "minutes": 2
},
{
  "id": "cpp-ordenar-erase",
  "requiresConcept": true,
  "language": "cpp",
  "lessonIds": [
    "cpp-iteradores-invalidacao"
  ],
  "skillIds": [
    "cpp.vector.remocao"
  ],
  "afterBlock": 3,
  "kind": "order",
  "capability": "alteracao",
  "title": "O sucessor precisa ser examinado",
  "prompt": "dados é um vector<int> válido. Ordene o laço que apaga todos os zeros e conserva os demais na ordem. Incremente somente quando conservar o elemento. As linhas indicam o fechamento de cada bloco; esta pausa não compila código.",
  "lines": [
    {
      "id": "avancar",
      "code": "        ++it;"
    },
    {
      "id": "fimfor",
      "code": "} // fim do for"
    },
    {
      "id": "apagar",
      "code": "        it = dados.erase(it);"
    },
    {
      "id": "for",
      "code": "for (auto it = dados.begin(); it != dados.end();) {"
    },
    {
      "id": "fimif",
      "code": "    } // fim do if"
    },
    {
      "id": "senao",
      "code": "    } else {"
    },
    {
      "id": "testar",
      "code": "    if (*it == 0) {"
    }
  ],
  "hint": "Depois de erase, seu retorno já aponta para o próximo candidato. O outro ramo precisa avançar.",
  "minutes": 3
},
{
  "id": "cpp-reobter-reserva",
  "requiresConcept": true,
  "language": "cpp",
  "lessonIds": [
    "cpp-iteradores-invalidacao"
  ],
  "skillIds": [
    "cpp.vector.realocacao"
  ],
  "afterBlock": 5,
  "kind": "choice",
  "capability": "depuracao",
  "title": "Recupere o acesso após reservar",
  "prompt": "dados tem três elementos e indice=1 foi validado. reserve solicita mais que a capacidade anterior e termina normalmente; nenhuma inserção, remoção ou reordenação ocorre. Como ler o mesmo valor depois? Diagnóstico conceitual sem executar C++.",
  "options": [
    {
      "id": "reobter",
      "text": "Obter o valor novamente com dados.at(indice) depois de reserve."
    },
    {
      "id": "antigo",
      "text": "Desreferenciar o iterador guardado antes de reserve."
    },
    {
      "id": "fim",
      "text": "Desreferenciar dados.end(), pois ele aponta para o último valor."
    }
  ],
  "hint": "Os valores foram preservados, mas os endereços anteriores não são um contrato válido depois da realocação.",
  "minutes": 2
}
,{
  "id": "js-prever-propriedade",
  "requiresConcept": true,
  "language": "javascript",
  "lessonIds": [
    "js-propriedades-prototipos"
  ],
  "skillIds": [
    "javascript.objetos.propriedades"
  ],
  "afterBlock": 1,
  "kind": "predict",
  "capability": "leitura",
  "title": "O campo está no registro?",
  "prompt": "Escreva as duas linhas. hasOwn verifica o objeto inicial; in pode alcançar sua cadeia. Esta pausa compara uma previsão e não executa o programa.",
  "code": "const base = { nivel: \"base\" };\nconst registro = Object.create(base);\nconsole.log(Object.hasOwn(registro, \"nivel\"), \"nivel\" in registro);\nconsole.log(registro.nivel);",
  "hint": "Separe a existência na cadeia da posse da propriedade no registro.",
  "minutes": 2
},
{
  "id": "js-descritor-sem-getter",
  "requiresConcept": true,
  "language": "javascript",
  "lessonIds": [
    "js-propriedades-prototipos"
  ],
  "skillIds": [
    "javascript.objetos.descritores"
  ],
  "afterBlock": 3,
  "kind": "choice",
  "capability": "reconhecimento",
  "title": "Inspecione antes de ler",
  "prompt": "entrada é um objeto ordinário, sem Proxy. nome pode ser getter. Qual operação consulta seu descritor próprio sem chamar esse getter? Decisão conceitual; nenhuma promessa de controlar objetos interceptados.",
  "options": [
    {
      "id": "descriptor",
      "text": "Object.getOwnPropertyDescriptor(entrada, \"nome\")"
    },
    {
      "id": "leitura",
      "text": "entrada.nome"
    },
    {
      "id": "copia",
      "text": "Object.assign({}, entrada)"
    }
  ],
  "hint": "Ler o valor e copiar valores podem executar um acessor. Procure a operação que fornece a forma da propriedade.",
  "minutes": 2
},
{
  "id": "js-debug-numero-proprio",
  "requiresConcept": true,
  "language": "javascript",
  "lessonIds": [
    "js-propriedades-prototipos"
  ],
  "skillIds": [
    "javascript.objetos.validacao"
  ],
  "afterBlock": 5,
  "kind": "debug",
  "capability": "depuracao",
  "title": "O saldo veio do protótipo",
  "prompt": "Implemente lerNumeroProprio(objeto, chave). As entradas de estudo pressupõem objetos ordinários sem Proxy; a função não detecta Proxy. Confira objeto não nulo, não array, e chave string. Exija uma propriedade própria de dados com number finito e devolva seu valor sem conversão, leitura de getter ou mutação. Rejeite fora do contrato com TypeError; Proxy não faz parte das entradas admitidas. O programa quebrado também converte strings e inventa zero. Corrija a função inteira: os casos conferem ausência, herança, acessores, chaves especiais e não mutação. Os verificadores locais são inspecionáveis e não comprovam autoria.",
  "code": "function lerNumeroProprio(objeto, chave) {\n  return Number(objeto[chave] ?? 0);\n}",
  "hint": "Inspecione o descritor próprio antes de obter valor; uma leitura direta já pode chamar código.",
  "minutes": 4
}
];
export function practicesForLesson(id:string):PracticeActivity[]{
 return practiceActivities.filter(activity=>activity.lessonIds.includes(id));
}

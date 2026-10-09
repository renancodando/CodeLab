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

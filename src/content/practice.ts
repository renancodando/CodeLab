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

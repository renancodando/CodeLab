import {practiceActivities,type PracticeActivity} from '../content/practice';
import type {CodeCheck} from './types';
import type {RunResult} from '../types';

export type PracticeAnswer = string|string[];
export type PracticeTest = {label:string;passed:boolean};
export type PracticeResult = {
 passed:boolean; status:'evaluated'|'cancelled'|'unavailable';
 feedback:string; tests:PracticeTest[]; evidence:'conceptual'|'executed';
 execution:'quickjs'|'not-run'; skillIds:string[]; capability:PracticeActivity['capability'];
};
type ConceptSpec={accepted:string[];failure:string;solution:string;order?:string[]};
type JSCheck=CodeCheck&{feedback:string};
type JSSpec={checks:JSCheck[];solution:string};
const concepts:Record<string,ConceptSpec>={
 'css-prever-bordas':{accepted:['150\n120\n30'],failure:'Separe a dimensão declarada dos extras em cada modelo. O espaço de conteúdo tem piso zero, portanto não absorve padding e bordas além desse limite.',solution:'150\n120\n30'},
 'css-reduzir-minimo':{accepted:['0','0px'],failure:'O mínimo automático pode impedir o item de encolher. Alterar apenas flex não remove esse piso, e cortar o texto não atende ao contrato.',solution:'0'},
 'css-corrigir-rolagem':{accepted:['aderir'],failure:'Relative acompanha o conteúdo ao rolar, e absolute sai do fluxo. O cabeçalho deve responder à região rolável sem perder seu lugar no documento.',solution:'position: sticky;'},
 'cs-prever-percurso':{accepted:['0\nTrue\n1|1\nTrue\n2|2\n2'],failure:'A construção não percorre a fonte. Acompanhe cada MoveNext até o próximo yield, sem produzir o terceiro elemento no descarte.',solution:'0\nTrue\n1|1\nTrue\n2|2\n2'},
 'cs-descartar-percurso':{accepted:['delimitar'],failure:'Consumir até o fim pode executar trabalho extra e nem ser possível. A liberação precisa acontecer também quando Processar falha; coleta de lixo não estabelece esse contrato.',solution:'using (var percurso = Fonte().GetEnumerator())\n{\n    if (percurso.MoveNext()) Processar(percurso.Current);\n}\nConsole.WriteLine(ativos);'},
 'cs-materializar-consulta':{accepted:['ToArray()','ToList()'],failure:'Guardar IEnumerable não armazena necessariamente os valores. A segunda enumeração pode repetir os efeitos; escolha uma materialização adequada à origem finita.',solution:'ToArray()'},
 'html-imagem-destino':{accepted:['destino'],failure:'Neste contexto, a imagem participa do nome do link. Um nome de arquivo não comunica a ação, e alt vazio deixa o link sem o texto necessário.',solution:'<a href="#relatorio"><img src="/exemplos/imagens/fluxo-amplo.svg" alt="Abrir relatório de estudo" width="720" height="240"></a>'},
 'html-completar-sizes':{accepted:['100vw'],failure:'Compare o espaço ocupado até 600 px com o valor declarado. sizes não cria o layout nem recebe o descritor w do arquivo.',solution:'100vw'},
 'html-ordenar-picture':{accepted:[],order:['abrir','compacta','ampla','fallback','fechar'],failure:'Confira qual source aplicável aparece primeiro. Uma fonte sem media também atende a janela estreita e pode impedir o recorte; preserve o img de fallback.',solution:'<picture>\n  <source type="image/svg+xml" media="(max-width: 600px)" srcset="/exemplos/imagens/fluxo-compacto.svg" width="240" height="360">\n  <source type="image/svg+xml" srcset="/exemplos/imagens/fluxo-amplo.svg" width="720" height="240">\n  <img src="/exemplos/imagens/fluxo-amplo.svg" width="720" height="240" alt="Etapas: escrever, executar e revisar">\n</picture>'},
 'sql-prever-desconhecido':{accepted:['1|unknown\n2|false\n3|true'],failure:'Resolva cada comparação separadamente: NULL não produz true nem false. O COALESCE só apresenta o resultado desconhecido; não compara saldo com zero.',solution:'1|unknown\n2|false\n3|true'},
 'sql-corrigir-obrigatoriedade':{accepted:['presenca-faixa'],failure:'Um campo presente ainda pode ser negativo; uma faixa válida ainda pode aceitar ausência. CHECK aceita true ou unknown, e COALESCE pode ocultar NULL.',solution:'CREATE TEMP TABLE estoque_null (valor integer NOT NULL CHECK (valor >= 0));'},
 'sql-correlacionar-ausentes':{accepted:[],failure:'Trocar NOT IN por NOT EXISTS não define sozinho a igualdade. Compare duas ausências, ausência com zero e duas chaves conhecidas conforme o contrato.',solution:'IS NOT DISTINCT FROM'},
 'cpp-requisito-verdadeiro':{accepted:['requires std::integral<T>;','requires std::integral<T> ;'],failure:'A expressão simples pode ser válida mesmo com valor false. Exija que a condição dependente de T seja satisfeita dentro do bloco.',solution:'requires std::integral<T>;'},
 'cpp-ramo-descartado':{accepted:['constexpr'],failure:'O ramo inválido para int precisa ser descartado na instanciação. Uma decisão comum de execução não elimina esse requisito de compilação.',solution:'constexpr'},
 'cpp-prever-sobrecarga':{accepted:['reserva\nfixo'],failure:'vector oferece reserva e tamanho; array oferece apenas tamanho. A escolha depende dos requisitos compartilhados, não da posição das funções no arquivo.',solution:'reserva\nfixo'},
 'ts-import-extensao':{accepted:['./calculo.js'],failure:'Confira o caminho relativo no JavaScript emitido. Neste contrato não há loader, bundler ou reescrita de extensão para completar o trabalho do Node ESM.',solution:'./calculo.js'},
 'ts-alias-emitido':{accepted:['relativo'],failure:'O alias continua no artefato. Uma configuração de tipos ou declaração não cria a resolução desse pacote no Node.',solution:'import {dobrar} from "./calculo.js";\nconsole.log(dobrar(3));'},
 'ts-import-tipo-efeito':{accepted:['2'],failure:'O arquivo de contratos foi emitido, mas o import da entrada é apenas de tipo. Acompanhe quais dependências restam no JavaScript antes de prever os efeitos.',solution:'2'},
 'py-csv-prever-registro':{accepted:['2\n2\n3'],failure:'Contar campos não equivale a contar linhas físicas. Acompanhe as aspas e a posição alcançada pelo leitor depois de consumir o registro.',solution:'2\n2\n3'},
 'py-csv-cabecalho':{accepted:['sequencia'],failure:'O cabeçalho define quais valores serão preservados. Um conjunto não conserva repetição nem ordem; preencher campos depois não recupera um valor que perdeu sua chave.',solution:'def validar_cabecalho(leitor):\n    if leitor.fieldnames != ["produto", "quantidade"]:\n        raise ValueError("cabeçalho inválido")'},
 'py-csv-lote':{accepted:[],order:['funcao','lote','percorrer','validar','acumular','gravar','retornar'],failure:'A leitura também pode falhar depois do primeiro registro. Prepare o lote sem modificar destino e confira a indentação que separa coleta e gravação.',solution:'def importar_registros(registros, destino):\n    lote = []\n    for numero, registro in enumerate(registros, start=2):\n        produto, quantidade = validar_registro(registro, numero)\n        lote.append((produto, quantidade))\n    destino.extend(lote)\n    return len(lote)'},
"cs-prever-cancelamento":{"accepted":["cancelado\n1"],"failure":"A gravação concluída não é desfeita. Acompanhe a verificação antes do próximo incremento, sem tratar Cancel como rollback.","solution":"cancelado\n1"},
"cs-vaga-sem-posse":{"accepted":["adquirir"],"failure":"A contagem representa vagas disponíveis, não tentativas de entrada. Uma chamada cancelada antes de adquirir não deve alterar essa contagem.","solution":"static async Task UsarVagaAsync(SemaphoreSlim vagas, Func<CancellationToken, Task> executar, CancellationToken token)\n{\n    await vagas.WaitAsync(token);\n    try { await executar(token); }\n    finally { vagas.Release(); }\n}"},
"cs-token-vinculado":{"accepted":["vinculada.Token"],"failure":"Receber apenas um dos tokens ignora a outra origem. Descarte de fonte não equivale a pedido de cancelamento.","solution":"vinculada.Token"},
"css-prever-contexto":{"accepted":["amplo\n22"],"failure":"Investigue separadamente o nome selecionado pela condição e o ancestral elegível da unidade. Não há obrigação de serem a mesma caixa.","solution":"amplo\n22"},
"css-corrigir-ancestral":{"accepted":["envolver"],"failure":"Mudar o limite não cria um ancestral. A medida precisa vir de um contexto elegível fora do elemento que a regra está estilizando.","solution":"A região ancestral define container-type:inline-size; o cartão descendente recebe o layout."},
"css-completar-limite":{"accepted":["min-width: 480px","min-width:480px"],"failure":"Teste a igualdade: o contrato muda ao atingir 480, não somente depois. A condição continua consultando o painel.","solution":"min-width: 480px"},
"js-prever-propriedade":{"accepted":["false true\nbase"],"failure":"O registro encontra nivel na cadeia, mas não possui esse campo. Confira a diferença entre hasOwn e in.","solution":"false true\nbase"},
"js-descritor-sem-getter":{"accepted":["descriptor"],"failure":"Ler entrada.nome já pode executar o getter. Copiar valores também pode executar leituras; inspecione a propriedade antes.","solution":"Object.getOwnPropertyDescriptor(entrada, \"nome\")"},
"cpp-prever-intervalo":{"accepted":["6,2"],"failure":"Confira o valor da segunda posição e conte elementos, sem confundir end com o último valor.","solution":"6,2"},
"cpp-ordenar-erase":{"accepted":[],"order":["for","testar","apagar","senao","avancar","fimif","fimfor"],"failure":"Receba o retorno de erase no ramo de remoção e incremente apenas no outro ramo; feche cada bloco correspondente.","solution":"for (auto it = dados.begin(); it != dados.end();) {\n    if (*it == 0) {\n        it = dados.erase(it);\n    } else {\n        ++it;\n    } // fim do if\n} // fim do for"},
"cpp-reobter-reserva":{"accepted":["reobter"],"failure":"O acesso antigo foi invalidado. Obtenha a posição novamente; end não representa um elemento.","solution":"const int valor = dados.at(indice); // após reserve e sem alterar a ordem"},
"ts-fonte-covariancia":{"accepted":["detalhada"],"failure":"Uma fonte básica não promete pontos. Examine o campo que a posição de destino pode solicitar.","solution":"Fonte<Detalhado> pode atender à posição Fonte<Registro>, que só promete ler id."},
"ts-callback-entrada":{"accepted":["geral"],"failure":"O chamador pode fornecer apenas id. O callback não pode exigir pontos e uma assertion não acrescenta esse campo.","solution":"Um callback que aceita Registro pode processar qualquer entrada permitida; exigir Detalhado restringe o contrato."},
"ts-propriedade-funcao":{"accepted":["propriedade"],"failure":"A assinatura de método não recebe a mesma checagem de parâmetros. Procure a propriedade cuja informação de tipo é uma função.","solution":"processar: (item: T) => string"},
"py-prever-esgotamento":{"accepted":["0\n[1, 2]\n[]"],"failure":"O cursor não reinicia. Acompanhe qual elemento next retirou e quantos restam para cada list.","solution":"0\n[1, 2]\n[]"},
"py-ordenar-lote":{"accepted":[],"order":["declarar","cursor","consumir","retornar"],"failure":"Crie o cursor antes de passá-lo a islice e devolva apenas a tupla produzida; cada linha deve aparecer uma vez.","solution":"def primeiro_lote(fonte, tamanho):\n    origem = iter(fonte)\n    lote = tuple(islice(origem, tamanho))\n    return lote"},
"py-fechar-consumo":{"accepted":["closing"],"failure":"O trecho deve definir a liberação inclusive em exceção e evitar ler a fonte inteira. break não chama close genericamente.","solution":"with closing(fonte) as origem:\n    processar(next(origem))"},
 'html-label-vinculo':{accepted:['email-contato'],failure:'Compare o atributo for com o id do controle; name tem outra função.',solution:'email-contato'},
 'html-dialogo-foco':{accepted:['cancelar'],failure:'Revise qual ação recebe foco inicialmente e se o trecho mantém a navegação natural de teclado.',solution:'<button autofocus type="button">Cancelar</button>'},
 'html-ordenar-formulario':{accepted:[],order:['inicio','rotulo','campo','botao','fim'],failure:'Mantenha o form externo, o rótulo antes do campo e o botão antes do fechamento.',solution:'<form action="/contato" method="post">\n  <label for="nome">Nome</label>\n  <input id="nome" name="nome" required>\n  <button type="submit">Enviar</button>\n</form>'},
 'css-grid-minimo':{accepted:['minmax(0, 1fr)','minmax(0,1fr)'],failure:'O mínimo da trilha ainda precisa permitir encolher a zero; confira a função e seus dois limites.',solution:'minmax(0, 1fr)'},
 'css-grade-estreita':{accepted:['adaptar'],failure:'O mínimo escolhido ainda precisa caber quando a largura disponível é menor que 14rem.',solution:'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))'},
 'css-prever-cascata':{accepted:['green'],failure:'Compare a especificidade dos seletores antes de usar a posição da regra no arquivo.',solution:'green: #salvar tem maior especificidade que os outros dois seletores no contexto descrito.'},
 'ts-unknown-validacao':{accepted:['validar'],failure:'O trecho precisa examinar o dado real; mudar a informação de tipo não altera seu valor.',solution:'if (typeof valor === "number" && Number.isFinite(valor)) { usar(valor); }'},
 'ts-zero-ausencia':{accepted:['??'],failure:'A regra escolhida não deve substituir zero; verifique a distinção entre ausência e falsy.',solution:'const quantidade = limite ?? 10;'},
 'ts-tipo-apagado':{accepted:['texto'],failure:'Acompanhe o tipo recebido no JSON depois que a assertion é apagada.',solution:'"201". A propriedade continua sendo string; o operador + concatena "20" e 1.'},
 'py-prever-range':{accepted:['0\n2\n4'],failure:'Revise o primeiro valor, o passo e o limite final excluído de range. Escreva uma saída por linha.',solution:'0\n2\n4'},
 'py-ordenar-default':{accepted:[],order:['declarar','testar','alocar','anexar','retornar'],failure:'A criação da lista deve depender da ausência e vir antes de append; preserve a indentação das linhas.',solution:'def adicionar(item, lista=None):\n    if lista is None:\n        lista = []\n    lista.append(item)\n    return lista'},
 'py-keyword-contrato':{accepted:['nomeado'],failure:'O segundo parâmetro fica depois de * e deve aparecer pelo nome na chamada.',solution:'registrar("Lia", ativo=True)'},
 'cs-prever-decimal':{accepted:['True'],failure:'Os literais têm sufixo decimal. Confira também como Console.WriteLine imprime um booleano.',solution:'True'},
 'cs-ordenar-using':{accepted:[],order:['abrir','bloco','usar','fechar','fim'],failure:'O uso precisa ficar dentro do bloco e fim depois da saída que descarta o recurso.',solution:'using (var recurso = new Recurso())\n{\n    recurso.Usar();\n}\nConsole.WriteLine("fim");'},
 'cs-nullable-guard':{accepted:['padrao'],failure:'A supressão de aviso não protege Value quando o nullable está ausente; refine antes de ler.',solution:'if (idade is int valor) Console.WriteLine(valor + 1);'},
 'cpp-prever-referencia':{accepted:['7,7'],failure:'A alteração pela referência também modifica o objeto original; ambos os nomes observam o mesmo int.',solution:'7,7'},
 'cpp-ordenar-raii':{accepted:[],order:['abrir','criar','usar','fechar','fim'],failure:'A posse deve nascer dentro do escopo, existir no uso e terminar antes da mensagem final.',solution:'{\n    auto valor = std::make_unique<int>(7);\n    std::cout << *valor << "\\n";\n}\nstd::cout << "fim\\n";'},
 'cpp-iterador-invalidado':{accepted:['invalidado'],failure:'A realocação pode conservar os valores, mas não conserva a validade dos iteradores antigos.',solution:'Depois da realocação, obtenha it = v.begin() antes de desreferenciar. O uso do iterador invalidado tem comportamento indefinido; nenhuma saída específica é garantida.'},
 'sql-null-filtro':{accepted:['isnull'],failure:'WHERE só aceita true; uma comparação comum com NULL não produz esse resultado.',solution:'apelido IS NULL'},
 'sql-prever-fanout':{accepted:['6'],failure:'Conte todas as combinações entre as duas coleções relacionadas ao mesmo pedido.',solution:'6: cada um dos 2 itens combina com cada um dos 3 pagamentos.'},
 'sql-ordenar-transacao':{accepted:[],order:['iniciar','debito','credito','confirmar'],failure:'A fronteira da transação precisa envolver as duas alterações e respeitar o cronograma solicitado.',solution:'BEGIN;\nUPDATE contas SET saldo = saldo - 10 WHERE id = 1;\nUPDATE contas SET saldo = saldo + 10 WHERE id = 2;\nCOMMIT;'}
};
const check=(label:string,expression:string,feedback:string):JSCheck=>({label,expression:'(()=>{try{return ('+expression+');}catch{return false;}})()',expected:true,feedback});
const javascript:Record<string,JSSpec>={
 'js-debug-contadores':{checks:[
  check('Uma instância soma e informa seu total.','(()=>{const contador=criarContador(2);return contador.ler()===2 && contador.somar(3)===true && contador.ler()===5;})()','Confira o valor inicial, o retorno booleano de somar e o total depois da operação.'),
  check('Criar e alterar outra instância preserva a anterior.','(()=>{const a=criarContador(2),b=criarContador(10);if(a.ler()!==2||b.ler()!==10)return false;a.somar(3);b.somar(7);const c=criarContador();return a.ler()===5&&b.ler()===17&&c.ler()===0;})()','O caso isolado funciona, mas criar ou alterar outra instância ainda muda o primeiro contador. Investigue o binding compartilhado.'),
  check('Incremento inválido não altera o total.','(()=>{const contador=criarContador(4);for(const valor of [0,-1,1.5,"2",null,undefined,NaN,Infinity,Number.MAX_SAFE_INTEGER+1]){if(contador.somar(valor)!==false||contador.ler()!==4)return false;}return contador.somar(2)===true&&contador.ler()===6;})()','Rejeite incrementos fora do contrato antes de escrever; uma recusa deve conservar o total e permitir operações seguintes.'),
  check('A fronteira segura rejeita overflow sem perder o estado.','(()=>{const contador=criarContador(Number.MAX_SAFE_INTEGER-1);return contador.somar(1)===true&&contador.ler()===Number.MAX_SAFE_INTEGER&&contador.somar(1)===false&&contador.ler()===Number.MAX_SAFE_INTEGER;})()','O incremento pode ser válido e ainda produzir um próximo total inseguro. Confira a condição antes da escrita.'),
  check('Inicial inválido é recusado e métodos destacados conservam a instância.','(()=>{for(const valor of [-1,1.5,"2",null,NaN,Infinity,Number.MAX_SAFE_INTEGER+1]){try{criarContador(valor);return false;}catch(erro){if(!(erro instanceof TypeError))return false;}}const contador=criarContador(7),ler=contador.ler,somar=contador.somar;return somar(2)===true&&ler()===9&&contador.ler()===9;})()','Confira a criação inválida e o acesso pelos métodos destacados; o contrato não depende do receptor da chamada.')
 ],solution:'function criarContador(inicial = 0) {\n  if (!Number.isSafeInteger(inicial) || inicial < 0) throw new TypeError("inicial inválido");\n  let total = inicial;\n  return {\n    somar(valor) {\n      if (!Number.isSafeInteger(valor) || valor <= 0 || !Number.isSafeInteger(total + valor)) return false;\n      total += valor;\n      return true;\n    },\n    ler() { return total; }\n  };\n}'},
 'js-debug-callbacks':{checks:[
  check('Três callbacks executados depois retornam seus índices.','(()=>{const callbacks=criarCallbacks(3);return Array.isArray(callbacks)&&callbacks.length===3&&callbacks.every(funcao=>typeof funcao==="function")&&JSON.stringify(callbacks.map(funcao=>funcao()))==="[0,1,2]";})()','Depois do laço, os callbacks ainda leem o mesmo binding terminal. Investigue qual variável cada função conserva.'),
  check('Zero, um e outras quantidades preservam tamanho e ordem.','[0,1,7,32].every(quantidade=>{const callbacks=criarCallbacks(quantidade);return Array.isArray(callbacks)&&callbacks.length===quantidade&&callbacks.every((funcao,indice)=>typeof funcao==="function"&&funcao()===indice);})','A correção precisa acompanhar a quantidade recebida, inclusive zero, sem fixar as três saídas do exemplo.'),
  check('A chamada pode ocorrer fora de ordem e repetidamente.','(()=>{const callbacks=criarCallbacks(5);return [4,0,2,4,1,0].every(indice=>callbacks[indice]()===indice);})()','Cada callback deve conservar seu próprio índice, sem depender da ordem ou do número de chamadas.'),
  check('Outra fábrica não modifica callbacks anteriores.','(()=>{const anteriores=criarCallbacks(4),novos=criarCallbacks(2);return anteriores[3]()===3&&novos[1]()===1&&anteriores[0]()===0;})()','Chamadas distintas ainda compartilham estado. Investigue onde nascem os bindings capturados.'),
  check('Quantidade fora do contrato lança RangeError.','[-1,33,1.5,"3",null,undefined,NaN,Infinity].every(valor=>{try{criarCallbacks(valor);return false;}catch(erro){return erro instanceof RangeError;}})','Rejeite quantidade inválida antes de construir a coleção; conversão implícita não faz parte deste contrato.')
 ],solution:'function criarCallbacks(quantidade) {\n  if (!Number.isSafeInteger(quantidade) || quantidade < 0 || quantidade > 32) throw new RangeError("quantidade inválida");\n  const callbacks = [];\n  for (let indice = 0; indice < quantidade; indice++) callbacks.push(() => indice);\n  return callbacks;\n}'},
 'js-debug-snapshot':{checks:[
  check('Strings válidas são aparadas, mantendo ordem e duplicatas.','(()=>{const lista=criarLista([" HTML ","CSS","HTML"]);return lista.adicionar(" JS ")===true&&JSON.stringify(lista.snapshot())===\'["HTML","CSS","HTML","JS"]\';})()','Confira trim, retorno da inclusão, ordem e duplicatas; a lista não é um conjunto.'),
  check('Construção e alterações externas preservam as duas coleções.','(()=>{const entrada=[" HTML ","CSS"],lista=criarLista(entrada);if(JSON.stringify(entrada)!==\'[" HTML ","CSS"]\')return false;entrada[0]="mudou";entrada.push("extra");return JSON.stringify(lista.snapshot())===\'["HTML","CSS"]\';})()','A primeira saída funciona, mas a entrada e o estado interno ainda se afetam. Confira a fronteira da construção.'),
  check('Snapshots novos e mutáveis não permitem escrever na instância.','(()=>{const lista=criarLista(["A","B"]),primeiro=lista.snapshot(),segundo=lista.snapshot();if(primeiro===segundo)return false;primeiro[0]="X";primeiro.push("C");segundo.pop();return JSON.stringify(lista.snapshot())===\'["A","B"]\'&&JSON.stringify(primeiro)===\'["X","B","C"]\';})()','Uma saída ainda permite escrever no estado interno ou reutiliza outra saída. Investigue cada referência devolvida.'),
  check('Recusas preservam estado e snapshots antigos.','(()=>{const lista=criarLista(["A"]),antes=lista.snapshot();for(const valor of ["","  ",null,undefined,2,{},[]])if(lista.adicionar(valor)!==false)return false;if(JSON.stringify(lista.snapshot())!==\'["A"]\')return false;return lista.adicionar("B")===true&&JSON.stringify(antes)===\'["A"]\';})()','Recusar uma entrada deve conservar o estado; uma inclusão posterior também não deve reescrever um snapshot anterior.'),
  check('Listas vazias e instâncias distintas são independentes.','(()=>{const a=criarLista(),b=criarLista();a.adicionar("A");return JSON.stringify(a.snapshot())===\'["A"]\'&&Array.isArray(b.snapshot())&&b.snapshot().length===0;})()','Confira o caso vazio e a independência entre duas chamadas da fábrica.'),
  check('Inicial inválido lança TypeError sem modificar a entrada.','[null,{},"A",[" A ",2],[" A "," "],Array(2)].every(entrada=>{const antes=JSON.stringify(entrada);try{criarLista(entrada);return false;}catch(erro){return erro instanceof TypeError&&JSON.stringify(entrada)===antes;}})','Valide todo o formato antes de modificar dados; uma falha na segunda posição não autoriza alterar a primeira.')
 ],solution:'function criarLista(iniciais = []) {\n  if (!Array.isArray(iniciais) || !Array.from(iniciais).every(texto => typeof texto === "string" && texto.trim() !== "")) throw new TypeError("lista inválida");\n  const itens = iniciais.map(texto => texto.trim());\n  return {\n    adicionar(texto) {\n      if (typeof texto !== "string" || texto.trim() === "") return false;\n      itens.push(texto.trim());\n      return true;\n    },\n    snapshot() { return [...itens]; }\n  };\n}'},
 'js-debug-numero-proprio':{checks:[
check("Números próprios finitos preservam zero e negativos.","lerNumeroProprio({saldo:0},\"saldo\")===0 && lerNumeroProprio({saldo:-3},\"saldo\")===-3 && lerNumeroProprio({saldo:Number.MAX_VALUE},\"saldo\")===Number.MAX_VALUE","Confira o retorno numérico, inclusive zero e negativo, sem depender de um valor fixo."),
check("Ausência e herança não são aceitas como dados próprios.","(()=>{return [Object.create({saldo:20}),{}, {saldo:undefined}].every(obj=>{try{lerNumeroProprio(obj,\"saldo\");return false;}catch(e){return e instanceof TypeError;}});})()","O caso comum funciona, mas herança ou ausência ainda entram como se fossem um dado próprio. Confira o descritor do objeto inicial."),
check("Getters são rejeitados sem executar código.","(()=>{let leituras=0;const obj={get saldo(){leituras++;return 20;}};let rejeitou=false;try{lerNumeroProprio(obj,\"saldo\");}catch(e){rejeitou=e instanceof TypeError;}return rejeitou&&leituras===0;})()","A inspeção ainda chama o getter ou o aceita como dado. A validação deve anteceder a leitura do valor."),
check("Tipos inválidos e números não finitos são recusados.","(()=>{const casos=[[{saldo:\"20\"},\"saldo\"],[{saldo:NaN},\"saldo\"],[{saldo:Infinity},\"saldo\"],[null,\"saldo\"],[[],\"length\"],[()=>0,\"saldo\"],[{saldo:1},1],[{saldo:1},Symbol(\"saldo\")]];return casos.every(([obj,chave])=>{try{lerNumeroProprio(obj,chave);return false;}catch(e){return e instanceof TypeError;}});})()","O contrato não permite conversão nem número não finito. Valide também objeto não nulo, não array e chave string."),
check("Chaves próprias especiais e campos não enumeráveis funcionam.","(()=>{const obj=Object.create(null);Object.defineProperty(obj,\"__proto__\",{value:4});Object.defineProperty(obj,\"constructor\",{value:12});Object.defineProperty(obj,\"hasOwnProperty\",{value:7});Object.defineProperty(obj,\"\",{value:0});return lerNumeroProprio(obj,\"__proto__\")===4&&lerNumeroProprio(obj,\"constructor\")===12&&lerNumeroProprio(obj,\"hasOwnProperty\")===7&&lerNumeroProprio(obj,\"\")===0;})()","O nome da chave não cria herança nesse objeto. Use o descritor próprio, sem chamar um método fornecido pela entrada nem exigir enumeração."),
check("A leitura conserva a entrada e as permissões.","(()=>{const obj={saldo:8},antes=JSON.stringify(Object.getOwnPropertyDescriptors(obj)),proto=Object.getPrototypeOf(obj);const valor=lerNumeroProprio(obj,\"saldo\");return valor===8&&JSON.stringify(Object.getOwnPropertyDescriptors(obj))===antes&&Object.getPrototypeOf(obj)===proto;})()","O valor pode estar certo, mas consultar não deve reescrever campos, permissões ou protótipo.")
],solution:"function lerNumeroProprio(objeto, chave) {\n  if (objeto === null || typeof objeto !== \"object\" || Array.isArray(objeto) || typeof chave !== \"string\") {\n    throw new TypeError(\"Objeto e chave fora do contrato\");\n  }\n  const descriptor = Object.getOwnPropertyDescriptor(objeto, chave);\n  if (!descriptor || !Object.hasOwn(descriptor, \"value\") ||\n      typeof descriptor.value !== \"number\" || !Number.isFinite(descriptor.value)) {\n    throw new TypeError(\"Propriedade própria de número finito exigida\");\n  }\n  return descriptor.value;\n}"},
 'js-debug-carrinho':{
  checks:[
   check('O total do carrinho de exemplo é numérico e correto.','typeof totalizar([{preco:29.95,quantidade:2},{preco:30,quantidade:1}]) === "number" && totalizar([{preco:29.95,quantidade:2},{preco:30,quantidade:1}]) === 89.9','O exemplo ainda produz um valor incorreto. Confira o nome das propriedades e o tipo do retorno.'),
   check('Um carrinho vazio tem total zero.','totalizar([]) === 0','O caso comum pode funcionar, mas um carrinho vazio precisa retornar zero.'),
   check('Outros preços, quantidades e quantidade zero funcionam.','totalizar([{preco:7.5,quantidade:3},{preco:999,quantidade:0}]) === 22.5 && totalizar([{preco:0.1,quantidade:3},{preco:0.2,quantidade:1}]) === 0.5','O total precisa acompanhar novas entradas e o arredondamento, sem depender do exemplo inicial.'),
   check('Dados fora do contrato são recusados.','(()=>{ const dados=[[{preco:"10",quantidade:2}],[{preco:4,quantidade:-1}],[{preco:4,quantidade:1.5}],[{preco:Infinity,quantidade:1}],[{preco:NaN,quantidade:1}],[{preco:-1,quantidade:2}],[null],null]; return dados.every(itens=>{try{totalizar(itens);return false;}catch(erro){return erro instanceof TypeError;}}); })()','O cálculo ainda aceita dados fora do contrato. Valide número finito e quantidade inteira não negativa antes de somar.'),
   check('Faixa numérica segura é respeitada.','(()=>{const dados=[[{preco:1,quantidade:Number.MAX_SAFE_INTEGER+1}],[{preco:Number.MAX_VALUE,quantidade:2}],[{preco:Number.MAX_VALUE,quantidade:1},{preco:Number.MAX_VALUE,quantidade:1}],[{preco:Number.MAX_SAFE_INTEGER,quantidade:1}]];return dados.every(itens=>{try{totalizar(itens);return false;}catch(erro){return erro instanceof TypeError;}});})()','A correção ainda ultrapassa a faixa de precisão numérica. Quantidades precisam ser inteiros seguros, e o total arredondado em centavos deve continuar finito e seguro.'),
   check('Os dados de entrada permanecem intactos.','(()=>{const itens=[{preco:9.25,quantidade:2,nome:"A"},{preco:0,quantidade:1}];const antes=JSON.stringify(itens);totalizar(itens);return JSON.stringify(itens)===antes;})()','O retorno pode estar certo, mas calcular o total não deve reescrever o carrinho.')
  ],
  solution:'function totalizar(itens) {\n  if (!Array.isArray(itens)) throw new TypeError("Carrinho deve ser uma lista");\n  let total = 0;\n  for (const item of itens) {\n    if (item === null || typeof item !== "object" ||\n        typeof item.preco !== "number" || !Number.isFinite(item.preco) || item.preco < 0 ||\n        !Number.isSafeInteger(item.quantidade) || item.quantidade < 0) {\n      throw new TypeError("Item fora do contrato");\n    }\n    total += item.preco * item.quantidade;\n  }\n  const centavos = Math.round(total * 100);\n  if (!Number.isFinite(total) || !Number.isSafeInteger(centavos)) {\n    throw new TypeError("Total fora da faixa segura");\n  }\n  return centavos / 100;\n}'
 },
 'js-debug-soma-vazia':{
  checks:[
   check('Uma soma comum funciona.','somaLista([2,3]) === 5','A soma comum ainda está incorreta. Acompanhe o acumulador e cada valor.'),
   check('A lista vazia retorna o elemento neutro.','somaLista([]) === 0','Funciona no caso comum, mas a lista vazia ainda falha. Revise o valor inicial do acumulador.'),
   check('Novos números, negativos e zero são somados.','somaLista([-8,3,0,10]) === 5 && somaLista([0]) === 0 && somaLista([12,7]) === 19','A solução precisa somar os valores recebidos, inclusive negativos, sem fixar o resultado do exemplo.'),
   check('Somar não modifica a lista.','(()=>{const valores=[2,-4,9];const antes=JSON.stringify(valores);somaLista(valores);return JSON.stringify(valores)===antes;})()','O resultado pode estar correto, mas a lista foi modificada.')
  ],solution:'function somaLista(valores) {\n  return valores.reduce((total, valor) => total + valor, 0);\n}'
 },
 'js-debug-maior-negativo':{
  checks:[
   check('O maior elemento funciona no caso comum.','maior([2,9,4]) === 9','O resultado precisa ser o maior elemento recebido.'),
   check('Uma lista de negativos não inventa zero.','maior([-8,-3,-11]) === -3','Funciona com positivos, mas falha quando todos os elementos são negativos. Reveja a inicialização.'),
   check('A lista vazia tem retorno explícito.','maior([]) === null','A lista vazia precisa retornar null, conforme o contrato.'),
   check('Elemento único e novas ordens funcionam.','maior([-9]) === -9 && maior([4,4,1]) === 4 && maior([0,-1]) === 0','Confira um único elemento, empates e a posição do maior valor.'),
   check('Buscar o maior preserva a entrada.','(()=>{const valores=[3,1,7];const antes=JSON.stringify(valores);maior(valores);return JSON.stringify(valores)===antes;})()','A busca não precisa reorganizar nem apagar a lista recebida.')
  ],solution:'function maior(valores) {\n  if (valores.length === 0) return null;\n  let atual = valores[0];\n  for (const valor of valores) {\n    if (valor > atual) atual = valor;\n  }\n  return atual;\n}'
 },
 'js-debug-filtro-mutacao':{
  checks:[
   check('Somente o booleano true passa no filtro.','JSON.stringify(selecionarAtivos([{id:1,ativo:true},{id:2,ativo:false},{id:3,ativo:"true"}]).map(p=>p.id)) === "[1]"','O filtro ainda aceita cadastros cujo ativo não é o booleano true. Revise a comparação.'),
   check('Uma lista vazia continua vazia.','Array.isArray(selecionarAtivos([])) && selecionarAtivos([]).length === 0','Uma entrada vazia precisa devolver uma lista vazia.'),
   check('A seleção acompanha novos dados e preserva a ordem.','JSON.stringify(selecionarAtivos([{id:8,ativo:false},{id:4,ativo:true},{id:2,ativo:true},{id:9}]).map(p=>p.id)) === "[4,2]"','A seleção deve acompanhar outras entradas e manter a ordem original.'),
   check('A filtragem não muda objetos nem a lista.','(()=>{const pessoas=[{id:1,ativo:false,nome:"A"},{id:2,ativo:true,nome:"B"}];const antes=JSON.stringify(pessoas);selecionarAtivos(pessoas);return JSON.stringify(pessoas)===antes;})()','O resultado pode parecer correto, mas o filtro está alterando os cadastros recebidos.')
  ],solution:'function selecionarAtivos(pessoas) {\n  return pessoas.filter(pessoa => pessoa.ativo === true);\n}'
 }
};
export function getPracticeSolution(id:string):string|undefined{
 return concepts[id]?.solution??javascript[id]?.solution;
}
function normalized(value:string):string{return value.replace(/\r\n?/g,'\n').trim();}
function base(activity?:PracticeActivity):PracticeResult{
 return {passed:false,status:'evaluated',feedback:'',tests:[],evidence:'conceptual',execution:'not-run',skillIds:activity?[...activity.skillIds]:[],capability:activity?.capability??'reconhecimento'};
}
function cancelled(activity?:PracticeActivity):PracticeResult{
 return {...base(activity),status:'cancelled',feedback:'Verificação cancelada. Seu trabalho continua preservado.'};
}
/** JS is executed in the existing bounded QuickJS worker. Other languages here are
 * conceptual practice, not proof of compilation/execution and never sent to Judge0.
 * Reserved cases are withheld during an attempt, but remain inspectable locally. */
export async function evaluatePractice(id:string,answer:PracticeAnswer,signal?:AbortSignal):Promise<PracticeResult>{
 const activity=practiceActivities.find(item=>item.id===id);
 if(signal?.aborted)return cancelled(activity);
 if(!activity)return {...base(),status:'unavailable',feedback:'Esta atividade não está disponível nesta versão.'};
 const result=base(activity);
 if(typeof answer!=='string'&&(!Array.isArray(answer)||answer.some(line=>typeof line!=='string')))return {...result,status:'unavailable',feedback:'O formato da resposta não pôde ser lido. Seu trabalho está preservado; isso não conta como erro de aprendizagem.'};
 if((typeof answer==='string'&&answer.length>30000)||(Array.isArray(answer)&&(answer.length>100||answer.some(line=>typeof line!=='string'||line.length>30000)))){
  return {...result,feedback:'A resposta ultrapassou o limite da atividade. Reduza o texto antes de conferir.',tests:[{label:'Resposta dentro do limite.',passed:false}]};
 }
 const concept=concepts[id];
 if(concept){
  let passed=false;
  if(concept.order){
   let submitted:string[];
   if(Array.isArray(answer))submitted=answer.map(normalized);
   else submitted=normalized(answer).split('\n').map(normalized).filter(Boolean);
   // Require every line exactly once; a prefix, duplicate or injected line cannot pass.
   passed=submitted.length===concept.order.length&&submitted.every((line,index)=>line===concept.order![index]);
  }else if(id==='cs-materializar-consulta')passed=typeof answer==='string'&&/^To(?:Array|List)\s*\(\s*\)$/.test(normalized(answer));
  else if(id==='sql-correlacionar-ausentes')passed=typeof answer==='string'&&/^IS\s+NOT\s+DISTINCT\s+FROM$/i.test(normalized(answer));
  else passed=typeof answer==='string'&&concept.accepted.includes(normalized(answer));
  result.passed=passed;
  result.tests=[{label:concept.order?'Todas as linhas respeitam a estrutura solicitada.':'A resposta corresponde ao contrato da atividade.',passed}];
  result.feedback=(passed?'Sua resposta está correta. ':concept.failure+' ')+'Esta atividade comprova uma decisão conceitual; não houve execução de '+activity.language+'.';
  return result;
 }
 const spec=javascript[id];
 if(!spec||typeof answer!=='string')return {...result,feedback:'Envie o código completo como texto para conferir o comportamento.',tests:[{label:'Código completo recebido.',passed:false}]};
 let stop:(()=>void)|undefined;
 const abort=()=>stop?.();
 signal?.addEventListener('abort',abort,{once:true});
 try{
  let run:RunResult;
  if(typeof window!=='undefined'&&typeof Worker!=='undefined'){
   const {execute}=await import('../execution/runner');
   if(signal?.aborted)return cancelled(activity);
   const job=execute(answer,'aula',spec.checks);stop=job.cancel;
   run=await job.result;
  }else{
   // Node unit tests have no browser worker; the same isolated WASM evaluator runs.
   const {evaluate}=await import('../execution/evaluate');
   if(signal?.aborted)return cancelled(activity);
   run=await evaluate(answer,'aula',spec.checks);
  }
  if(signal?.aborted)return cancelled(activity);
  if(run.error&&['O executor não carregou. Verifique sua conexão e tente novamente.','Não foi possível iniciar o ambiente de execução. Tente novamente.'].includes(run.error)){
   return {...result,status:'unavailable',feedback:'O ambiente de execução não iniciou. Seu código foi preservado; este problema não conta como erro de aprendizagem.'};
  }
  const tests=run.tests.length?run.tests:[{label:'O programa precisa terminar sem erro.',passed:false}];
  const failed=tests.find(test=>!test.passed);
  const feedback=run.error??spec.checks.find(item=>item.label===failed?.label)?.feedback;
  return {...result,passed:run.passed,evidence:'executed',execution:'quickjs',tests,
   feedback:run.passed?'A correção passou no exemplo e nos casos adicionais deste exercício. Isso comprova os comportamentos testados; não é uma prova formal para todas as entradas.':feedback??'Ainda há uma diferença de comportamento. Investigue a primeira verificação que falhou; a solução continua disponível apenas quando você solicitar.'};
 }catch{
  if(signal?.aborted)return cancelled(activity);
  return {...result,status:'unavailable',feedback:'Não foi possível iniciar a verificação. Seu código está preservado; isso não conta como erro de aprendizagem.'};
 }finally{signal?.removeEventListener('abort',abort);}
}

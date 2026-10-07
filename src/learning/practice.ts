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
  }else passed=typeof answer==='string'&&concept.accepted.includes(normalized(answer));
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

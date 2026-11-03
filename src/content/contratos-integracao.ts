import type {CodeCheck} from '../learning/types';

type Conferencia=CodeCheck&{feedback:string};
type ContratoIntegracao={checks:Conferencia[];solution:string};
const conferir=(rotulo:string,corpo:string,pista:string):Conferencia=>({label:rotulo,expression:'(()=>{try{'+corpo+'}catch{return false;}})()',expected:true,feedback:pista});
const conferirPreparacoes=(casos:string)=>`(${casos}).every(([entrada,titulo])=>{
 const antes=JSON.stringify(entrada),obtido=prepararCadastro(entrada);
 return obtido!==null&&typeof obtido==='object'&&!Array.isArray(obtido)&&obtido!==entrada&&Object.keys(obtido).join(',')==='titulo'&&obtido.titulo===titulo&&JSON.stringify(entrada)===antes;
})`;
const conferirConfirmacoes=(casos:string)=>`
 const iguais=(a,b)=>{
  if(a===b)return true;
  if(a===null||b===null||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
  if(Array.isArray(a)&&a.length!==b.length)return false;
  const chaves=Object.keys(a);
  return chaves.length===Object.keys(b).length&&chaves.every(chave=>Object.prototype.hasOwnProperty.call(b,chave)&&iguais(a[chave],b[chave]));
 };
 return (${casos}).every(({estado,enviado,criado,esperado})=>{
  const antes=JSON.stringify([estado,criado]),obtido=aplicarConfirmacao(estado,enviado,criado);
  if(obtido===null||typeof obtido!=='object'||Array.isArray(obtido)||obtido===estado)return false;
  const {erro,...semErro}=obtido;
  const erroCorreto=criado===null?typeof erro==='string'&&erro.trim().length>0:erro==='';
  return erroCorreto&&iguais(semErro,esperado)&&JSON.stringify([estado,criado])===antes;
 });`;


const gabaritoCadastro=`function prepararCadastro(entrada) {
 if(entrada===null||typeof entrada!=='object'||Array.isArray(entrada)||typeof entrada.titulo!=='string')throw new TypeError('Entrada inválida');
 const titulo=entrada.titulo.trim();
 if(titulo.length<1||titulo.length>80)throw new TypeError('Título fora do limite');
 return {titulo};
}`;
const executarSuite=(codigo:string)=>`(()=>{const implementar=(()=>{${codigo};return prepararCadastro;})();const candidata=entrada=>implementar(entrada);return testarCadastro(candidata);})()`;
const conferirVariantes=(codigos:string[],esperado:boolean)=>'return '+codigos.map(codigo=>executarSuite(codigo)+'==='+esperado).join('&&')+';';

export const contratosIntegracao:Record<string,ContratoIntegracao>={
 'fullstack-preparar-cadastro':{
  checks:[
   conferir('Normaliza somente as extremidades e preserva o texto interno.','return '+conferirPreparacoes(`[[{titulo:'  Estudar  '},'Estudar'],[{titulo:'  Ação & código  '},'Ação & código'],[{titulo:'A  B'},'A  B']]`)+';','Confira o título inteiro depois de trim e preserve a entrada recebida. Uma resposta fixa, remover espaços internos ou alterar o objeto original viola o contrato.'),
   conferir('O limite é aplicado após trim e inclui exatamente 80 unidades.',`const limite='A'.repeat(80);if(prepararCadastro({titulo:'  '+limite+'  '}).titulo!==limite||prepararCadastro({titulo:'😀'.repeat(40)}).titulo!=='😀'.repeat(40))return false;for(const titulo of ['', '   ', 'B'.repeat(81),'😀'.repeat(41)]){const entrada={titulo},antes=JSON.stringify(entrada);try{prepararCadastro(entrada);return false;}catch(erro){if(!(erro instanceof TypeError)||JSON.stringify(entrada)!==antes)return false;}}return true;`,'O limite pertence ao título normalizado. Zero e 81 unidades são recusados sem alterar a entrada; 80 não deve ser perdido por espaços externos.'),
   conferir('Recusa formatos JSON inválidos sem coerção para texto.',`for(const entrada of [null,true,false,42,'texto',[],[{titulo:'X'}],{},{titulo:null},{titulo:7},{titulo:[]},{titulo:{}}]){const antes=JSON.stringify(entrada);try{prepararCadastro(entrada);return false;}catch(erro){if(!(erro instanceof TypeError)||JSON.stringify(entrada)!==antes)return false;}}return true;`,'Transformar qualquer valor em string aceita entradas que o contrato não permite. Diferencie objeto, array e título textual; a recusa deve ser TypeError e preservar a entrada.'),
   conferir('Seleciona campos próprios da entrada sem alterá-la ou compartilhar saídas.','if(!('+conferirPreparacoes(`[[{titulo:'  Ler  ',id:99,concluida:true,administrador:true},'Ler']]`)+'))return false;'+`const a=prepararCadastro({titulo:'Primeira'}),b=prepararCadastro({titulo:'Segunda'});return a!==b&&a.titulo==='Primeira'&&b.titulo==='Segunda';`,'O pedido preparado só contém título. Preserve o objeto recebido e devolva uma saída nova que não seja modificada pela chamada seguinte.')
  ],
  solution:gabaritoCadastro
 },
 'fullstack-aplicar-confirmacao':{
  checks:[
   conferir('Uma confirmação nova usa o ID real e encerra o carregamento.',conferirConfirmacoes(`[
    {estado:{rascunho:'Estudar',carregando:true,tarefas:[{id:7,titulo:'Ler',concluida:false}],erro:'Anterior'},enviado:'Estudar',criado:{id:42,titulo:'Estudar',concluida:false},esperado:{rascunho:'',carregando:false,tarefas:[{id:7,titulo:'Ler',concluida:false},{id:42,titulo:'Estudar',concluida:false}]}},
    {estado:{rascunho:'  Ação  ',carregando:true,tarefas:[],erro:''},enviado:'  Ação  ',criado:{id:73,titulo:'Ação',concluida:true},esperado:{rascunho:'',carregando:false,tarefas:[{id:73,titulo:'Ação',concluida:true}]}}
   ]`),'Use os dados confirmados pelo servidor, inclusive ID e concluida, sem alterar o estado recebido. Comparar o rascunho com o título normalizado da resposta pode impedir uma limpeza legítima.'),
   conferir('Falha conserva rascunho, tarefas e campos alheios à operação.',conferirConfirmacoes(`[
    {estado:{rascunho:'  Nova edição  ',carregando:true,tarefas:[{id:9,titulo:'Anterior',concluida:true}],erro:'',filtro:'pendentes'},enviado:'Texto enviado',criado:null,esperado:{rascunho:'  Nova edição  ',carregando:false,tarefas:[{id:9,titulo:'Anterior',concluida:true}],filtro:'pendentes'}},
    {estado:{rascunho:'',carregando:true,tarefas:[],erro:'Anterior'},enviado:'Enviar',criado:null,esperado:{rascunho:'',carregando:false,tarefas:[]}}
   ]`),'Uma falha não confirma criação. Preserve o texto e a lista, encerre o indicador e informe erro não vazio sem reconstruir o estado perdendo outros campos.'),
   conferir('Uma edição posterior permanece e o erro anterior é limpo no sucesso.',conferirConfirmacoes(`[
    {estado:{rascunho:'Estudar CSS',carregando:true,tarefas:[],erro:'Anterior',filtro:'todas'},enviado:'Estudar',criado:{id:5,titulo:'ESTUDAR',concluida:false},esperado:{rascunho:'Estudar CSS',carregando:false,tarefas:[{id:5,titulo:'ESTUDAR',concluida:false}],filtro:'todas'}},
    {estado:{rascunho:'',carregando:true,tarefas:[],erro:'Anterior'},enviado:'Título enviado',criado:{id:18,titulo:'Confirmado',concluida:false},esperado:{rascunho:'',carregando:false,tarefas:[{id:18,titulo:'Confirmado',concluida:false}]}}
   ]`),'A pessoa pode ter digitado outro texto ou apagado o campo enquanto aguardava. Limpe somente o snapshot ainda igual, preservando o valor que o servidor confirmou.'),
   conferir('Repetir uma confirmação substitui pelo ID sem duplicar ou mudar a ordem.',conferirConfirmacoes(`[
    {estado:{rascunho:'Continuar',carregando:true,tarefas:[{id:42,titulo:'Antiga',concluida:false},{id:7,titulo:'Outra',concluida:true}],erro:''},enviado:'Antes',criado:{id:42,titulo:'Atualizada',concluida:true},esperado:{rascunho:'Continuar',carregando:false,tarefas:[{id:42,titulo:'Atualizada',concluida:true},{id:7,titulo:'Outra',concluida:true}]}},
    {estado:{rascunho:'',carregando:false,tarefas:[{id:73,titulo:'Ação',concluida:true}],erro:''},enviado:'  Ação  ',criado:{id:73,titulo:'Ação',concluida:true},esperado:{rascunho:'',carregando:false,tarefas:[{id:73,titulo:'Ação',concluida:true}]}}
   ]`),'O ID identifica a tarefa, não sua posição. Acrescentar toda resposta duplica dados; remover e acrescentar ao fim muda a ordem de um item já existente.'),
   conferir('Chamadas independentes devolvem estados que não se sobrescrevem.',`const a=aplicarConfirmacao({rascunho:'A',carregando:true,tarefas:[],erro:''},'A',{id:11,titulo:'A',concluida:false});const antes=JSON.stringify(a);const b=aplicarConfirmacao({rascunho:'B',carregando:true,tarefas:[],erro:''},'B',{id:82,titulo:'B',concluida:true});return a!==b&&JSON.stringify(a)===antes&&a.tarefas[0].id===11&&b.tarefas[0].id===82;`,'Uma saída compartilhada pode parecer correta na primeira chamada e mudar depois. Preserve o estado já devolvido quando outra operação conclui.')
  ],
  solution:`function aplicarConfirmacao(estado, tituloEnviado, criado) {
 if(criado===null)return {...estado,carregando:false,erro:'Não foi possível salvar.'};
 const existe=estado.tarefas.some(tarefa=>tarefa.id===criado.id);
 const tarefas=existe?estado.tarefas.map(tarefa=>tarefa.id===criado.id?criado:tarefa):[...estado.tarefas,criado];
 return {...estado,tarefas,carregando:false,erro:'',rascunho:estado.rascunho===tituloEnviado?'':estado.rascunho};
}`
 },
 'fullstack-testar-cadastro':{
  checks:[
   conferir('Sua suíte aceita implementações corretas equivalentes.',conferirVariantes([gabaritoCadastro,`function prepararCadastro(valor){if(!valor||typeof valor!=='object'||Array.isArray(valor)||typeof valor.titulo!=='string')throw new TypeError();const texto=valor.titulo.trim();if(!texto.length||texto.length>=81)throw new TypeError();return Object.fromEntries([['titulo',texto]]);}`],true),'Recusar tudo também é um defeito. A suíte deve aceitar implementações que cumprem o contrato, sem depender do texto, nome ou estilo da função recebida.'),
   conferir('Encontra respostas fixas, espaços não normalizados e limite incorreto.',conferirVariantes([`function prepararCadastro(){return {titulo:'Estudar'};}`,gabaritoCadastro.replace('entrada.titulo.trim()','entrada.titulo'),gabaritoCadastro.replace('titulo.length>80','titulo.length>81'),gabaritoCadastro.replace('titulo.length>80','[...titulo].length>80')],false),'Use títulos diferentes e confira o valor inteiro. Teste o comprimento após trim, incluindo exatamente 80 e a primeira entrada acima do limite.'),
   conferir('Encontra formato inválido e tipo errado de exceção.',conferirVariantes([`function prepararCadastro(entrada){const titulo=String(entrada?.titulo??'').trim();if(!titulo||titulo.length>80)throw new TypeError();return {titulo};}`,gabaritoCadastro.replaceAll('new TypeError','new Error')],false),'Uma recusa qualquer não basta quando o contrato exige TypeError. Inclua valores que não sejam objetos e títulos que não sejam strings, sem coerção.'),
   conferir('Encontra campos extras e alteração de entrada, inclusive na recusa.',conferirVariantes([gabaritoCadastro.replace('return {titulo};','return {...entrada,titulo};'),gabaritoCadastro.replace('return {titulo};','entrada.titulo=titulo;return {titulo};'),gabaritoCadastro.replace("throw new TypeError('Título fora do limite');","{entrada.titulo=titulo;throw new TypeError('Título fora do limite');}")],false),'Compare as chaves e preserve uma fotografia da entrada antes da chamada. Confira também a entrada quando a função lança, não apenas quando retorna.'),
   conferir('Encontra uma saída reutilizada por chamadas distintas.',conferirVariantes([`const salvo={};`+gabaritoCadastro.replace('return {titulo};','salvo.titulo=titulo;return salvo;')],false),'Guarde a primeira saída e só então faça outra chamada com outro título. Uma função pode acertar cada valor isolado e sobrescrever resultados já entregues.')
  ],
  solution:`function testarCadastro(candidata) {
 try {
  const casos=[[{titulo:'  Estudar  ',id:99,concluida:true},'Estudar'],[{titulo:'A  B'},'A  B'],[{titulo:'  '+ 'X'.repeat(80)+'  '},'X'.repeat(80)]];
  for(const [entrada,titulo] of casos){
   const antes=JSON.stringify(entrada),saida=candidata(entrada);
   if(!saida||typeof saida!=='object'||Array.isArray(saida)||saida===entrada||Object.keys(saida).join(',')!=='titulo'||saida.titulo!==titulo||JSON.stringify(entrada)!==antes)return false;
  }
  for(const entrada of [null,[],true,42,'texto',{},{titulo:7},{titulo:null},{titulo:[]},{titulo:{}},{titulo:''},{titulo:'   '},{titulo:'  '+ 'X'.repeat(81)+'  '},{titulo:'😀'.repeat(41)}]){
   const antes=JSON.stringify(entrada);let recusou=false;
   try{candidata(entrada);}catch(erro){recusou=erro instanceof TypeError;}
   if(!recusou||JSON.stringify(entrada)!==antes)return false;
  }
  const a=candidata({titulo:'Primeira'}),b=candidata({titulo:'Segunda'});
  return a!==b&&a.titulo==='Primeira'&&b.titulo==='Segunda';
 }catch{return false;}
}`
 },
 'fullstack-configuracao-publica':{
  checks:[
   conferir('Seleciona textos públicos e interpreta a opção booleana literalmente.',`for(const [entrada,esperado] of [[{API_BASE:' /api ',VERSAO:' v1 '},{apiBase:'/api',versao:'v1',depuracao:false}],[{API_BASE:'https://servico.invalid/api',VERSAO:'2',DEPURACAO:'false'},{apiBase:'https://servico.invalid/api',versao:'2',depuracao:false}],[{API_BASE:'/v2',VERSAO:'3',DEPURACAO:'true'},{apiBase:'/v2',versao:'3',depuracao:true}]]){const saida=montarConfiguracaoPublica(entrada);if(!saida||typeof saida!=='object'||Array.isArray(saida)||Object.keys(saida).sort().join(',')!=='apiBase,depuracao,versao'||Object.entries(esperado).some(([chave,valor])=>saida[chave]!==valor))return false;}return true;`,'Valide os textos e selecione as chaves públicas. A string false é não vazia: Boolean não interpreta seu significado.'),
   conferir('Recusa campos obrigatórios e formato sem divulgar o valor.',`const casos=[[null,'AMBIENTE'],[[],'AMBIENTE'],[7,'AMBIENTE'],['texto','AMBIENTE'],[{VERSAO:'1'},'API_BASE'],[{API_BASE:'  ',VERSAO:'1'},'API_BASE'],[{API_BASE:19,VERSAO:'1'},'API_BASE'],[{API_BASE:'/api'},'VERSAO'],[{API_BASE:'/api',VERSAO:''},'VERSAO'],[{API_BASE:'/api',VERSAO:false},'VERSAO']];for(const [entrada,nome] of casos){const antes=JSON.stringify(entrada);try{montarConfiguracaoPublica(entrada);return false;}catch(erro){if(!(erro instanceof Error)||erro.message!==nome||JSON.stringify(entrada)!==antes)return false;}}return true;`,'Não substitua configuração obrigatória inválida por um padrão silencioso. A mensagem identifica somente a variável, sem imprimir a entrada ou seu valor.'),
   conferir('A depuração só aceita os literais contratados ou ausência.',`for(const valor of ['', 'TRUE', ' true ',true,false,0,null,'segredo-ficticio']){const entrada={API_BASE:'/api',VERSAO:'1',DEPURACAO:valor},antes=JSON.stringify(entrada);try{montarConfiguracaoPublica(entrada);return false;}catch(erro){if(!(erro instanceof Error)||erro.message!=='DEPURACAO'||JSON.stringify(entrada)!==antes)return false;}}return montarConfiguracaoPublica({API_BASE:'/api',VERSAO:'1',DEPURACAO:undefined}).depuracao===false;`,'Ausência é diferente de texto vazio. Converter ou aparar qualquer valor da opção pode aceitar uma configuração que deveria ser recusada.'),
   conferir('Não copia dados privados, altera entradas ou compartilha saídas.',`const entrada={API_BASE:' /api ',VERSAO:' v1 ',TOKEN_SERVIDOR:'privado-ficticio',OUTRO:'extra'};const antes=JSON.stringify(entrada),a=montarConfiguracaoPublica(entrada),salvo=JSON.stringify(a),b=montarConfiguracaoPublica({API_BASE:'/nova',VERSAO:'2'});return a!==entrada&&a!==b&&JSON.stringify(entrada)===antes&&JSON.stringify(a)===salvo&&Object.keys(a).sort().join(',')==='apiBase,depuracao,versao'&&a.apiBase==='/api'&&b.apiBase==='/nova';`,'Monte uma projeção explícita. Espalhar o ambiente conserva chaves privadas, e normalizar o próprio argumento ou reutilizar um objeto altera dados de outras chamadas.'),
   conferir('Não registra configurações, inclusive quando a validação falha.',`const original=console.log;let registros=0;console.log=()=>{registros++;};try{montarConfiguracaoPublica({API_BASE:'/api',VERSAO:'1',TOKEN_SERVIDOR:'privado-ficticio'});try{montarConfiguracaoPublica({API_BASE:'/api',VERSAO:'1',DEPURACAO:'privado-ficticio'});}catch{}return registros===0;}finally{console.log=original;}`,'A validação não precisa registrar o ambiente. Examine também caminhos de erro: valores privados não pertencem ao console nem à mensagem lançada.')
  ],
  solution:`function montarConfiguracaoPublica(ambiente) {
 if(ambiente===null||typeof ambiente!=='object'||Array.isArray(ambiente))throw new Error('AMBIENTE');
 const textos={};
 for(const nome of ['API_BASE','VERSAO']){
  if(typeof ambiente[nome]!=='string'||ambiente[nome].trim()==='')throw new Error(nome);
  textos[nome]=ambiente[nome].trim();
 }
 const opcao=ambiente.DEPURACAO;
 if(opcao!==undefined&&opcao!=='true'&&opcao!=='false')throw new Error('DEPURACAO');
 return {apiBase:textos.API_BASE,versao:textos.VERSAO,depuracao:opcao==='true'};
}`
 },
 'fullstack-criar-descarte':{
  checks:[
   conferir('Libera todos os recursos em ordem inversa, inclusive uma lista vazia.',`const chamadas=[];const descartar=criarDescarte([()=>chamadas.push('modelo'),()=>chamadas.push('editor'),()=>chamadas.push('evento')]);const erros=descartar(),vazio=criarDescarte([])();return JSON.stringify(chamadas)==='["evento","editor","modelo"]'&&Array.isArray(erros)&&erros.length===0&&Array.isArray(vazio)&&vazio.length===0;`,'A última aquisição deve ser a primeira liberação. Chame cada função e devolva uma lista de falhas, mesmo quando não houver recursos.'),
   conferir('Continua após falhas e preserva a identidade de cada valor lançado.',`const chamadas=[],falha={motivo:'simulada'};const descartar=criarDescarte([()=>{chamadas.push(1);throw undefined;},()=>{chamadas.push(2);throw false;},()=>{chamadas.push(3);throw 0;},()=>{chamadas.push(4);throw falha;}]);const erros=descartar();return JSON.stringify(chamadas)==='[4,3,2,1]'&&Array.isArray(erros)&&erros.length===4&&erros[0]===falha&&erros[1]===0&&erros[2]===false&&erros[3]===undefined;`,'Um catch precisa registrar até valores falsy e seguir para o próximo recurso. Não converta as falhas para string nem pare na primeira exceção.'),
   conferir('Repetição e reentrada não liberam nada novamente.',`let chamadas=0,reentrada,contagemDurante;const descartar=criarDescarte([()=>{chamadas++;},()=>{chamadas++;reentrada=descartar();contagemDurante=chamadas;}]);const primeira=descartar(),segunda=descartar();return chamadas===2&&contagemDurante===1&&Array.isArray(reentrada)&&reentrada.length===0&&Array.isArray(primeira)&&primeira.length===0&&Array.isArray(segunda)&&segunda.length===0;`,'Marque o dono como encerrado antes de executar o primeiro callback. Marcar apenas no fim permite reentrada ou dupla liberação.'),
   conferir('Captura a lista inicial sem alterar o array recebido.',`const chamadas=[],a=()=>chamadas.push('a'),b=()=>chamadas.push('b'),recursos=[a,b];const descartar=criarDescarte(recursos);if(recursos.length!==2||recursos[0]!==a||recursos[1]!==b)return false;recursos[0]=()=>chamadas.push('intruso');recursos.push(()=>chamadas.push('tardio'));descartar();return JSON.stringify(chamadas)==='["b","a"]'&&recursos.length===3&&recursos[1]===b;`,'A lista pertence a quem chamou. Faça uma cópia ao adquirir os recursos; copiar somente quando descartar permite que mudanças posteriores alterem o dono.'),
   conferir('Donos distintos e seus resultados não se sobrescrevem.',`const chamadas=[],falha={id:1};const a=criarDescarte([()=>{chamadas.push('a');throw falha;}]),b=criarDescarte([()=>chamadas.push('b')]);const primeiro=a(),segundo=b(),repetido=a();return JSON.stringify(chamadas)==='["a","b"]'&&primeiro!==segundo&&primeiro!==repetido&&primeiro.length===1&&primeiro[0]===falha&&segundo.length===0&&repetido.length===0;`,'O estado de encerramento e a lista de falhas pertencem a cada dono. Guardá-los globalmente mistura aquisições e altera resultados já devolvidos.')
  ],
  solution:`function criarDescarte(recursos) {
 const pendentes=[...recursos];let encerrado=false;
 return ()=>{
  if(encerrado)return [];
  encerrado=true;
  const falhas=[];
  while(pendentes.length){
   const liberar=pendentes.pop();
   try{liberar();}catch(erro){falhas.push(erro);}
  }
  return falhas;
 };
}`
 }

};

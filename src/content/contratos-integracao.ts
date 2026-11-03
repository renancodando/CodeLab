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

export const contratosIntegracao:Record<string,ContratoIntegracao>={
 'fullstack-preparar-cadastro':{
  checks:[
   conferir('Normaliza somente as extremidades e preserva o texto interno.','return '+conferirPreparacoes(`[[{titulo:'  Estudar  '},'Estudar'],[{titulo:'  Ação & código  '},'Ação & código'],[{titulo:'A  B'},'A  B']]`)+';','Confira o título inteiro depois de trim e preserve a entrada recebida. Uma resposta fixa, remover espaços internos ou alterar o objeto original viola o contrato.'),
   conferir('O limite é aplicado após trim e inclui exatamente 80 unidades.',`const limite='A'.repeat(80);if(prepararCadastro({titulo:'  '+limite+'  '}).titulo!==limite)return false;for(const titulo of ['', '   ', 'B'.repeat(81)]){try{prepararCadastro({titulo});return false;}catch(erro){if(!(erro instanceof TypeError))return false;}}return true;`,'O limite pertence ao título normalizado. Zero e 81 unidades são recusados; 80 não deve ser perdido por espaços externos.'),
   conferir('Recusa formatos JSON inválidos sem coerção para texto.',`for(const entrada of [null,true,false,42,'texto',[],[{titulo:'X'}],{},{titulo:null},{titulo:7},{titulo:[]},{titulo:{}}]){try{prepararCadastro(entrada);return false;}catch(erro){if(!(erro instanceof TypeError))return false;}}return true;`,'Transformar qualquer valor em string aceita entradas que o contrato não permite. Diferencie objeto, array e título textual; a recusa deve ser TypeError.'),
   conferir('Seleciona campos próprios da entrada sem alterá-la ou compartilhar saídas.','if(!('+conferirPreparacoes(`[[{titulo:'  Ler  ',id:99,concluida:true,administrador:true},'Ler']]`)+'))return false;'+`const a=prepararCadastro({titulo:'Primeira'}),b=prepararCadastro({titulo:'Segunda'});return a!==b&&a.titulo==='Primeira'&&b.titulo==='Segunda';`,'O pedido preparado só contém título. Preserve o objeto recebido e devolva uma saída nova que não seja modificada pela chamada seguinte.')
  ],
  solution:`function prepararCadastro(entrada) {
 if(entrada===null||typeof entrada!=='object'||Array.isArray(entrada)||typeof entrada.titulo!=='string')throw new TypeError('Entrada inválida');
 const titulo=entrada.titulo.trim();
 if(titulo.length<1||titulo.length>80)throw new TypeError('Título fora do limite');
 return {titulo};
}`
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
 }
};

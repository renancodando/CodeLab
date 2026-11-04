import type {CodeCheck} from '../learning/types';

type ContratoProjeto={checks:(CodeCheck&{feedback:string})[];solution:string};
const comparacao=`const iguais=(a,b)=>{if(a===b)return true;if(a===null||b===null||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;if(Array.isArray(a)&&a.length!==b.length)return false;const chaves=Object.keys(a);return chaves.length===Object.keys(b).length&&chaves.every(chave=>Object.prototype.hasOwnProperty.call(b,chave)&&iguais(a[chave],b[chave]));};`;
const conferir=(rotulo:string,corpo:string,pista:string)=>({label:rotulo,expression:'(()=>{try{'+comparacao+corpo+'}catch{return false;}})()',expected:true,feedback:pista});
const casos=(funcao:string,entradas:string)=>`return (${entradas}).every(caso=>{const antes=JSON.stringify(caso.argumentos),entrada=caso.argumentos[0],obtido=${funcao}(...caso.argumentos);return(caso.novo===false||obtido!==entrada)&&iguais(obtido,caso.esperado)&&JSON.stringify(caso.argumentos)===antes;});`;
const nota=(id:string,texto:string)=>({id,texto,categoria:'estudo',criadaEm:'2026-11-04'});
const dados=(temperatura:number|null,origem='previsao',capturadoEm=1000)=>({temperatura,origem,capturadoEm});

export const contratosProjetos:Record<string,ContratoProjeto>={
 'diario-mesclar-backup':{
  checks:[
   conferir('Mescla por ID mantendo posições e ordem dos novos itens.',casos('mesclarDiario',JSON.stringify([
    {argumentos:[[nota('a','Anterior'),nota('b','Manter')],JSON.stringify({versao:1,notas:[nota('c','Terceira'),nota('a','Atualizada'),nota('d','Quarta')]})],esperado:[nota('a','Atualizada'),nota('b','Manter'),nota('c','Terceira'),nota('d','Quarta')]},
    {argumentos:[[],JSON.stringify({versao:1,notas:[nota('x','  <ideia> & texto  ')]})],esperado:[nota('x','  <ideia> & texto  ')]},
    {argumentos:[[nota('constructor','Manter')],JSON.stringify({versao:1,notas:[nota('__proto__','Dado literal'),nota('constructor','Atualizar')]})],esperado:[nota('constructor','Atualizar'),nota('__proto__','Dado literal')]},
    {argumentos:[[],JSON.stringify({versao:1,notas:[{id:' x ',texto:'  Ideia  ',categoria:' estudo ',criadaEm:' hoje '}]})],esperado:[{id:' x ',texto:'  Ideia  ',categoria:' estudo ',criadaEm:' hoje '}]}
   ])),'O ID substitui a posição de origem; notas ausentes do arquivo não desaparecem. Preserve também os textos originais, inclusive espaços e marcação que a interface mostrará como texto.'),
   conferir('Backup vazio conserva a coleção e campos extras importados ficam fora.',casos('mesclarDiario',JSON.stringify([
    {argumentos:[[nota('a','Manter')],JSON.stringify({versao:1,notas:[]})],esperado:[nota('a','Manter')]},
    {argumentos:[[nota('a','Trocar')],JSON.stringify({versao:1,notas:[{...nota('a','Nova'),extra:'ignorar',administrador:true}]})],esperado:[nota('a','Nova')]}
   ])),'Uma importação não é a ordem para apagar o diário. Projete somente os quatro campos da nota importada e devolva uma coleção nova.'),
   conferir('Distingue erro de JSON e formato inválido, sem alterar a coleção.',`const atuais=[{id:'a',texto:'Atual',categoria:'casa',criadaEm:'ontem'}],antes=JSON.stringify(atuais);for(const [texto,tipo] of [['{',SyntaxError],['',SyntaxError],[null,TypeError],[{},TypeError],['null',TypeError],['[]',TypeError],['{}',TypeError],['{"versao":"1","notas":[]}',TypeError],['{"versao":1,"notas":{}}',TypeError]]){try{mesclarDiario(atuais,texto);return false;}catch(erro){if(!(erro instanceof tipo)||JSON.stringify(atuais)!==antes)return false;}}return true;`,'JSON malformado e documento de versão/formato errado falham por motivos diferentes. Nenhuma recusa deve apagar ou alterar as notas já existentes.'),
   conferir('Valida todas as notas e rejeita IDs duplicados antes de aplicar qualquer uma.',`const atuais=[${JSON.stringify(nota('a','Original'))}],antes=JSON.stringify(atuais),valida=${JSON.stringify(nota('a','Substituta'))};const outra={...valida,id:'b'};const invalidas=[null,[],{}, {...valida,id:7},{...valida,id:' '},{...outra,texto:''},{...outra,texto:7},{...outra,texto:'  '},{...outra,categoria:false},{...outra,categoria:' '},{...outra,criadaEm:null},{...outra,criadaEm:' '}];for(const invalida of invalidas){try{mesclarDiario(atuais,JSON.stringify({versao:1,notas:[valida,invalida]}));return false;}catch(erro){if(!(erro instanceof TypeError)||JSON.stringify(atuais)!==antes)return false;}}try{mesclarDiario(atuais,JSON.stringify({versao:1,notas:[valida,valida]}));return false;}catch(erro){return erro instanceof TypeError&&JSON.stringify(atuais)===antes;}`,'A primeira nota pode ser válida e uma posterior quebrar o arquivo. Validar enquanto grava na própria coleção aplica uma importação parcial e viola a recuperação.'),
   conferir('Chamadas independentes não sobrescrevem resultados entregues.',`const a=mesclarDiario([],JSON.stringify({versao:1,notas:[${JSON.stringify(nota('a','Primeira'))}]})),antes=JSON.stringify(a),b=mesclarDiario([],JSON.stringify({versao:1,notas:[${JSON.stringify(nota('b','Segunda'))}]}));return a!==b&&JSON.stringify(a)===antes&&a[0].id==='a'&&b[0].id==='b';`,'Guarde o resultado da primeira importação. Outra chamada não pode reutilizar e sobrescrever o mesmo array ou as mesmas notas importadas.')
  ],
  solution:`function mesclarDiario(atuais, texto) {
 if(typeof texto!=='string')throw new TypeError('Texto esperado');
 const documento=JSON.parse(texto);
 if(!documento||typeof documento!=='object'||Array.isArray(documento)||documento.versao!==1||!Array.isArray(documento.notas))throw new TypeError('Formato inválido');
 const ids=new Set();
 const importadas=documento.notas.map(nota=>{
  if(!nota||typeof nota!=='object'||Array.isArray(nota)||['id','texto','categoria','criadaEm'].some(chave=>typeof nota[chave]!=='string'||!nota[chave].trim())||ids.has(nota.id))throw new TypeError('Nota inválida');
  ids.add(nota.id);return {id:nota.id,texto:nota.texto,categoria:nota.categoria,criadaEm:nota.criadaEm};
 });
 const saida=atuais.slice();
 for(const nota of importadas){const indice=saida.findIndex(atual=>atual.id===nota.id);if(indice<0)saida.push(nota);else saida[indice]=nota;}
 return saida;
}`
 },
 'tarefas-reduzir-acao':{
  checks:[
   conferir('Alterna pelo ID, preserva ordem, texto e campos adicionais.',casos('reduzirTarefas',JSON.stringify([
    {argumentos:[[{id:9,titulo:'Nove',concluida:false},{id:3,titulo:'Três',concluida:true,prioridade:2}],{tipo:'alternar',id:3}],esperado:[{id:9,titulo:'Nove',concluida:false},{id:3,titulo:'Três',concluida:false,prioridade:2}]},
    {argumentos:[[{id:17,titulo:'Voltar',concluida:false}],{tipo:'alternar',id:17}],esperado:[{id:17,titulo:'Voltar',concluida:true}]}
   ])),'Identifique o item pela propriedade id. Copiar só o array e alterar seu objeto também muda a entrada; mantenha título e metadados do item.'),
   conferir('Remove somente o ID solicitado, inclusive no meio da lista.',casos('reduzirTarefas',JSON.stringify([
    {argumentos:[[{id:8,titulo:'A',concluida:false},{id:2,titulo:'B',concluida:true},{id:5,titulo:'C',concluida:false}],{tipo:'remover',id:2}],esperado:[{id:8,titulo:'A',concluida:false},{id:5,titulo:'C',concluida:false}]},
    {argumentos:[[{id:19,titulo:'Única',concluida:true}],{tipo:'remover',id:19}],esperado:[]}
   ])),'O ID não é uma posição nem a quantidade de itens. Excluir um item não muda a ordem dos demais nem descarta outras tarefas.'),
   conferir('Lista vazia e ID ausente devolvem coleção nova sem mudanças.',casos('reduzirTarefas',JSON.stringify([
    {argumentos:[[],{tipo:'alternar',id:1}],esperado:[]},
    {argumentos:[[],{tipo:'remover',id:1}],esperado:[]},
    {argumentos:[[{id:7,titulo:'Preservar',concluida:false}],{tipo:'alternar',id:99}],esperado:[{id:7,titulo:'Preservar',concluida:false}]},
    {argumentos:[[{id:7,titulo:'Preservar',concluida:true}],{tipo:'remover',id:99}],esperado:[{id:7,titulo:'Preservar',concluida:true}]}
   ])),'Ausência não autoriza modificar o primeiro ou o último item. O contrato pede um array novo até quando a ação não encontra um ID.'),
   conferir('Alternar duas vezes restaura o valor e os contadores continuam derivados.',`const origem=[{id:1,titulo:'Estudar',concluida:false},{id:2,titulo:'Praticar',concluida:true}],antes=JSON.stringify(origem),uma=reduzirTarefas(origem,{tipo:'alternar',id:1}),foto=JSON.stringify(uma),duas=reduzirTarefas(uma,{tipo:'alternar',id:1});return iguais(duas,origem)&&JSON.stringify(origem)===antes&&JSON.stringify(uma)===foto&&uma.filter(t=>!t.concluida).length===0&&duas.filter(t=>!t.concluida).length===1;`,'Alternar não significa sempre concluir. Calcule a quantidade de pendentes da coleção devolvida e preserve cada estado anterior.'),
   conferir('Listas e ações independentes não compartilham uma saída mutável.',`const a=reduzirTarefas([{id:1,titulo:'A',concluida:false}],{tipo:'alternar',id:1}),antes=JSON.stringify(a),b=reduzirTarefas([{id:2,titulo:'B',concluida:true}],{tipo:'remover',id:2});return a!==b&&JSON.stringify(a)===antes&&a[0].id===1&&a[0].concluida===true&&b.length===0;`,'Outra lista não pode substituir os itens do resultado anterior. O estado pertence a cada coleção e transição.')
  ],
  solution:`function reduzirTarefas(tarefas, acao) {
 if(acao.tipo==='remover')return tarefas.filter(tarefa=>tarefa.id!==acao.id);
 return tarefas.map(tarefa=>tarefa.id===acao.id?{...tarefa,concluida:!tarefa.concluida}:tarefa);
}`
 },
 'clima-concluir-consulta':{
  checks:[
   conferir('Aceita a conclusão correspondente preservando zero e origem estimada.',casos('concluirLeitura',JSON.stringify([
    {argumentos:[{local:'B',consulta:2,carregando:true,dados:null,erro:'Anterior'},{local:'B',consulta:2,tipo:'sucesso',dados:dados(0)}],esperado:{local:'B',consulta:2,carregando:false,dados:dados(0),erro:''}},
    {argumentos:[{local:'A',consulta:5,carregando:true,dados:dados(12),erro:''},{local:'A',consulta:5,tipo:'sucesso',dados:dados(null,'observacao',750)}],esperado:{local:'A',consulta:5,carregando:false,dados:dados(null,'observacao',750),erro:''}}
   ])),'Zero é uma temperatura válida; null representa ausência. Preserve a origem e o instante recebidos, encerre a espera e limpe um erro anterior sem fabricar observação atual.'),
   conferir('Falha correspondente mantém os últimos dados e informa a mensagem.',casos('concluirLeitura',JSON.stringify([
    {argumentos:[{local:'A',consulta:3,carregando:true,dados:dados(18,'previsao',200),erro:'',unidade:'C'},{local:'A',consulta:3,tipo:'falha',mensagem:'Rede indisponível'}],esperado:{local:'A',consulta:3,carregando:false,dados:dados(18,'previsao',200),erro:'Rede indisponível',unidade:'C'}},
    {argumentos:[{local:'B',consulta:1,carregando:true,dados:null,erro:''},{local:'B',consulta:1,tipo:'falha',mensagem:'Sem dados'}],esperado:{local:'B',consulta:1,carregando:false,dados:null,erro:'Sem dados'}}
   ])),'Falhar não atualiza o horário dos últimos dados nem autoriza apagá-los. Guarde a mensagem da falha atual e preserve configurações alheias à consulta.'),
   conferir('Ignora cidade antiga mesmo quando o número coincide.',casos('concluirLeitura',JSON.stringify(['sucesso','falha'].map(tipo=>({argumentos:[{local:'B',consulta:1,carregando:true,dados:dados(0),erro:'',unidade:'C'},{local:'A',consulta:1,tipo,dados:dados(28),mensagem:'Falha antiga'}],esperado:{local:'B',consulta:1,carregando:true,dados:dados(0),erro:'',unidade:'C'},novo:false})))),'A/1 e B/1 são consultas diferentes. Descarte o retorno antes de mudar dados, erro ou o indicador que pertence à outra cidade.'),
   conferir('Ignora consulta anterior da mesma cidade e conclusões já encerradas.',casos('concluirLeitura',JSON.stringify([
    {argumentos:[{local:'A',consulta:3,carregando:true,dados:dados(10),erro:''},{local:'A',consulta:2,tipo:'falha',mensagem:'Antiga'}],esperado:{local:'A',consulta:3,carregando:true,dados:dados(10),erro:''},novo:false},
    {argumentos:[{local:'A',consulta:3,carregando:false,dados:dados(8),erro:''},{local:'A',consulta:3,tipo:'falha',mensagem:'Repetida'}],esperado:{local:'A',consulta:3,carregando:false,dados:dados(8),erro:''},novo:false},
    {argumentos:[{local:'A',consulta:3,carregando:true,dados:dados(10),erro:''},{local:'A',consulta:2,tipo:'sucesso',dados:dados(99)}],esperado:{local:'A',consulta:3,carregando:true,dados:dados(10),erro:''},novo:false},
    {argumentos:[{local:'A',consulta:3,carregando:false,dados:dados(8),erro:''},{local:'A',consulta:3,tipo:'sucesso',dados:dados(99)}],esperado:{local:'A',consulta:3,carregando:false,dados:dados(8),erro:''},novo:false}
   ])),'Conferir só a cidade permite que uma espera antiga vença a nova. Uma conclusão repetida também não deve converter um sucesso encerrado em erro.'),
   conferir('Saídas independentes e entradas não são alteradas.',`const estado={local:'A',consulta:1,carregando:true,dados:null,erro:'',unidade:'C'},retorno={local:'A',consulta:1,tipo:'sucesso',dados:{temperatura:17,origem:'previsao',capturadoEm:500}},antes=JSON.stringify([estado,retorno]),a=concluirLeitura(estado,retorno),foto=JSON.stringify(a),b=concluirLeitura({local:'B',consulta:2,carregando:true,dados:null,erro:''},{local:'B',consulta:2,tipo:'sucesso',dados:{temperatura:0,origem:'observacao',capturadoEm:900}});return a!==estado&&a!==b&&JSON.stringify([estado,retorno])===antes&&JSON.stringify(a)===foto&&a.unidade==='C'&&a.dados.temperatura===17&&b.dados.temperatura===0;`,'Não use um objeto global para guardar a última resposta. Uma conclusão não pode modificar o estado original, o retorno recebido ou o resultado já entregue para outra seleção.')
  ],
  solution:`function concluirLeitura(estado, retorno) {
 if(retorno.local!==estado.local||retorno.consulta!==estado.consulta||!estado.carregando)return estado;
 if(retorno.tipo==='falha')return {...estado,carregando:false,erro:retorno.mensagem};
 return {...estado,carregando:false,dados:retorno.dados,erro:''};
}`
 }
};

import type {ResultadoSql,CelulaSql} from '../execution/motor-sql';
import {executarSqlLocal} from '../execution/sql-local';
import type {PracticeResult} from './practice';

type CenarioSql={rotulo:string;preparacao:string;colunas:string[];linhas:(number|string|null)[][];falha:string};
type ConferenciaSql={aprovado:boolean;verificacoes:{label:string;passed:boolean}[];mensagem:string};
const inserir=(tabela:string,linhas:(number|string)[][])=>linhas.length?'INSERT INTO '+tabela+' VALUES '+linhas.map(linha=>'('+linha.map(valor=>typeof valor==='number'?String(valor):"'"+valor.replaceAll("'","''")+"'").join(',')+')').join(',')+';':'';
function contagem(rotulo:string,clientes:number[],pedidos:(number|string)[][],linhas:number[][],falha:string):CenarioSql{
 return {rotulo,preparacao:'CREATE TABLE clientes(id INTEGER PRIMARY KEY); CREATE TABLE pedidos(id INTEGER PRIMARY KEY,cliente_id INTEGER NOT NULL REFERENCES clientes(id),status TEXT NOT NULL);'+inserir('clientes',clientes.map(id=>[id]))+inserir('pedidos',pedidos),colunas:['cliente_id','pagos'],linhas,falha};
}
function totais(rotulo:string,pedidos:number[],itens:number[][],pagamentos:number[][],linhas:number[][],falha:string):CenarioSql{
 return {rotulo,preparacao:'CREATE TABLE pedidos(id INTEGER PRIMARY KEY); CREATE TABLE itens(pedido_id INTEGER NOT NULL REFERENCES pedidos(id),centavos INTEGER NOT NULL CHECK(centavos>=0)); CREATE TABLE pagamentos(pedido_id INTEGER NOT NULL REFERENCES pedidos(id),centavos INTEGER NOT NULL CHECK(centavos>=0));'+inserir('pedidos',pedidos.map(id=>[id]))+inserir('itens',itens)+inserir('pagamentos',pagamentos),colunas:['pedido_id','itens','pagamentos'],linhas,falha};
}
export const cenariosSql:Record<string,CenarioSql[]>={
 'sql-depurar-clientes-pagos':[
  contagem('Clientes com pago, aberto e nenhum pedido permanecem.',[1,2,3],[[10,1,'pago'],[11,1,'aberto'],[12,2,'aberto']],[[1,1],[2,0],[3,0]],'Um cliente sem pedido pago desapareceu ou recebeu uma contagem indevida. Investigue quais linhas sobrevivem à junção e ao filtro.'),
  contagem('Outras chaves, ordem de inserção e múltiplos pagos funcionam.',[8,2,15],[[1,8,'pago'],[2,8,'pago'],[3,2,'cancelado'],[4,15,'pago']],[[2,0],[8,2],[15,1]],'O exemplo funciona, mas outras chaves, vários pedidos ou a ordenação ainda falham. Não fixe as contagens do primeiro conjunto.'),
  contagem('Clientes sem qualquer pedido têm zero.',[4,9],[],[[4,0],[9,0]],'Quando a tabela de pedidos está vazia, os clientes ainda devem aparecer com zero. A linha preservada não representa um pedido existente.'),
  contagem('Sem clientes, não há linha de resumo.',[],[],[],'O conjunto vazio deve produzir zero linhas, com os mesmos dois cabeçalhos. Uma agregação global pode fabricar uma linha sem cliente.')
 ],
 'sql-depurar-totais-colecoes':[
  totais('Itens iguais e vários pagamentos não multiplicam totais.',[7],[[7,10],[7,10]],[[7,5],[7,7]],[[7,20,12]],'As duas coleções ainda multiplicam valores, ou itens iguais foram descartados. Descreva a granularidade antes de somar.'),
  totais('Pedidos com uma ou nenhuma coleção permanecem, inclusive zero.',[4,2,9,6],[[2,120],[2,30],[4,0],[4,20]],[[2,100],[2,25],[6,7]],[[2,150,125],[4,20,0],[6,0,7],[9,0,0]],'O caso comum funciona, mas um pedido sem itens, sem pagamentos ou sem ambas as coleções foi perdido. Ausência de contribuição deve produzir zero, e não NULL.'),
  totais('Outras chaves e repetições legítimas conservam cada contribuição.',[20,3],[[20,5],[20,5],[20,15],[3,9]],[[20,2],[20,2],[20,6],[3,9],[3,0]],[[3,9,9],[20,25,10]],'Valores repetidos de registros diferentes continuam sendo contribuições. Confira também a ordem por pedido e não dependa dos números do exemplo.'),
  totais('Nenhum pedido produz zero linhas.',[],[],[],[],'Sem pedidos, o relatório deve ficar vazio com os três cabeçalhos. Não retorne uma linha fixa ou um total global.')
 ]
};
function mesmoValor(valor:CelulaSql,esperado:number|string|null){
 return valor===esperado||(typeof valor==='bigint'&&typeof esperado==='number'&&Number.isSafeInteger(esperado)&&valor===BigInt(esperado));
}
export async function conferirConsultaSql(id:string,codigo:string,consultar:(codigo:string,preparacao:string)=>Promise<ResultadoSql>,sinal?:AbortSignal):Promise<ConferenciaSql>{
 if(!Object.hasOwn(cenariosSql,id))throw new Error('Atividade SQL indisponível.');
 const verificacoes:{label:string;passed:boolean}[]=[];
 for(const cenario of cenariosSql[id]??[]){
  if(sinal?.aborted)throw new Error('Consulta cancelada.');
  const resposta=await consultar(codigo,cenario.preparacao);
  if(sinal?.aborted)throw new Error('Consulta cancelada.');
  if(resposta.erro)throw new Error(resposta.erro);
  const tabela=resposta.tabelas[0];
  const cabecalhos=resposta.tabelas.length===1&&tabela.colunas.length===cenario.colunas.length&&tabela.colunas.every((coluna,indice)=>coluna.toLowerCase()===cenario.colunas[indice]);
  const aprovado=cabecalhos&&tabela.linhas.length===cenario.linhas.length&&tabela.linhas.every((linha,indice)=>linha.length===cenario.colunas.length&&linha.every((valor,coluna)=>mesmoValor(valor,cenario.linhas[indice][coluna])));
  verificacoes.push({label:cenario.rotulo,passed:aprovado});
  if(!aprovado)return {aprovado:false,verificacoes,mensagem:!cabecalhos?'Retorne uma única tabela, com os cabeçalhos e a ordem de colunas pedidos. Consultas extras também criam resultados.':cenario.falha};
 }
 return {aprovado:verificacoes.length>0,verificacoes,mensagem:'A consulta passou nas bases e bordas deste exercício em SQLite. Isso comprova os comportamentos testados; não valida recursos específicos de PostgreSQL nem todos os dados possíveis.'};
}
export async function avaliarPraticaSql(id:string,codigo:string,base:PracticeResult,sinal?:AbortSignal,prazoCarregamento=20000):Promise<PracticeResult>{
 let cancelarConsulta:(()=>void)|undefined,carregamentoFalhou=true;
 const cancelar=()=>cancelarConsulta?.();
 sinal?.addEventListener('abort',cancelar,{once:true});
 try{
  let consultar:(codigo:string,preparacao:string)=>Promise<ResultadoSql>;
  if(typeof window==='undefined'){
   const [{default:iniciarSql},{executarConsultaSql}]=await Promise.all([import('sql.js'),import('../execution/motor-sql')]);
   const SQL=await iniciarSql();carregamentoFalhou=false;
   consultar=async(codigo,preparacao)=>executarConsultaSql(SQL,codigo,preparacao);
  }else{
   if(typeof Worker==='undefined')throw new Error('O navegador não oferece o isolamento necessário para SQLite.');
   consultar=async(codigo,preparacao)=>{
    carregamentoFalhou=true;
    const consulta=executarSqlLocal(codigo,prazoCarregamento,preparacao);cancelarConsulta=consulta.cancelar;
    try{const resposta=await consulta.resultado;carregamentoFalhou=resposta.faseErro==='carregamento';return resposta;}
    finally{cancelarConsulta=undefined;}
   };
  }
  const conferencia=await conferirConsultaSql(id,codigo,consultar,sinal);
  return {...base,passed:conferencia.aprovado,evidence:'executed',execution:'sqlite',tests:conferencia.verificacoes,feedback:conferencia.mensagem};
 }catch(erro){
  if(sinal?.aborted)return {...base,status:'cancelled',feedback:'Verificação cancelada. Seu SQL continua preservado.'};
  const mensagem=erro instanceof Error?erro.message:String(erro);
  if(carregamentoFalhou)return {...base,status:'unavailable',feedback:'SQLite não carregou. Sua resposta foi preservada e isso não conta como erro de aprendizagem. Conecte à internet para o primeiro carregamento e tente novamente.'};
  return {...base,evidence:'executed',execution:'sqlite',tests:[{label:'A consulta termina sem erro no banco descartável.',passed:false}],feedback:mensagem+' Investigue a sintaxe, as tabelas e os limites antes de conferir novamente. A solução continua disponível apenas quando solicitada.'};
 }finally{sinal?.removeEventListener('abort',cancelar);cancelarConsulta?.();}
}

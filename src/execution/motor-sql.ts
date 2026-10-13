import type {SqlJsStatic,Statement} from 'sql.js';

export type CelulaSql=string|number|bigint|null|{bytes:number};
export type TabelaSql={comando:number;colunas:string[];linhas:CelulaSql[][]};
export type ResultadoSql={comandos:number;tabelas:TabelaSql[];erro?:string;faseErro?:'carregamento'|'consulta'};

export function executarConsultaSql(SQL:SqlJsStatic,codigo:string,preparacao?:string):ResultadoSql{
 if(typeof codigo!=='string'||(preparacao!==undefined&&typeof preparacao!=='string')||codigo.length+(preparacao?.length??0)>30000)throw new Error('Limite de 30.000 caracteres de SQL.');
 const banco=new SQL.Database(),tabelas:TabelaSql[]=[];
 let comandos=0,tamanho=0,celulas=0,iterador:ReturnType<typeof banco.iterateStatements>|undefined;
 function conferirTexto(texto:string){
  tamanho+=texto.length;
  if(texto.length>2000||tamanho>200000)throw new Error('Resultado muito grande. Limite os textos retornados e a quantidade de dados.');
  return texto;
 }
 try{
  banco.run('PRAGMA hard_heap_limit=8388608; PRAGMA max_page_count=256; PRAGMA foreign_keys=ON; PRAGMA temp_store=MEMORY;');
  if(preparacao!==undefined){
   banco.run(preparacao);
   banco.run('PRAGMA query_only=ON;');
   let consultas=0;
   iterador=banco.iterateStatements(codigo);
   for(const instrucao of iterador){
    const inicio=instrucao.getSQL().replace(/^(?:\s|--[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)+/,'');
    if(++consultas>1||!/^(?:SELECT|WITH)\b/i.test(inicio))throw new Error('Envie uma única consulta SELECT ou WITH, sem alterar a base ou configurar o banco.');
   }
   if(consultas!==1)throw new Error('Envie uma única consulta SELECT ou WITH, sem alterar a base ou configurar o banco.');
  }
  iterador=banco.iterateStatements(codigo);
  for(const instrucao of iterador){
   if(++comandos>100)throw new Error('Limite de 100 comandos por execução.');
   const colunas=instrucao.getColumnNames().map(conferirTexto),linhas:CelulaSql[][]=[];
   if(colunas.length>40)throw new Error('Limite de 40 colunas por resultado.');
   if(colunas.length&&tabelas.length>=10)throw new Error('Limite de dez tabelas de resultado por execução.');
   while(instrucao.step()){
    if(linhas.length>=100)throw new Error('Limite de 100 linhas por resultado. Use LIMIT para escolher o recorte.');
    celulas+=colunas.length;
    if(celulas>1000)throw new Error('Limite de 1.000 valores por execução. Selecione menos linhas ou colunas.');
    const consulta=instrucao as Statement&{get(parametros:null,configuracao:{useBigInt:true}):unknown[]};
    const valores=consulta.get(null,{useBigInt:true});
    linhas.push(valores.map(valor=>{
     if(valor instanceof Uint8Array)return{bytes:valor.byteLength};
     if(valor===null||typeof valor==='number'||typeof valor==='bigint')return valor;
     if(typeof valor==='string')return conferirTexto(valor);
     throw new Error('Tipo de resultado SQL não reconhecido.');
    }));
   }
   if(colunas.length)tabelas.push({comando:comandos,colunas,linhas});
  }
  return{comandos,tabelas};
 }finally{
  // libera o iterador sem executar o restante
  if(iterador)try{while(!iterador.next().done){}}catch{}
  banco.close();
 }
}

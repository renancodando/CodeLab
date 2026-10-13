import iniciarSql from 'sql.js';
import arquivoWasm from 'sql.js/dist/sql-wasm-browser.wasm?url';
import {executarConsultaSql} from './motor-sql';

self.onmessage=async(evento:MessageEvent<{codigo:string;preparacao?:string}>)=>{
 let pronto=false;
 try{
  const SQL=await iniciarSql({locateFile:()=>arquivoWasm});
  pronto=true;self.postMessage({tipo:'pronto'});
  self.postMessage({tipo:'resultado',resultado:executarConsultaSql(SQL,evento.data.codigo,evento.data.preparacao)});
 }catch(erro){
  self.postMessage({tipo:'resultado',resultado:{comandos:0,tabelas:[],erro:'SQLite: '+(erro instanceof Error?erro.message:String(erro)),faseErro:pronto?'consulta':'carregamento'}});
 }
};

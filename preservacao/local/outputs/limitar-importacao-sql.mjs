import {readFileSync,writeFileSync} from 'node:fs';
let arquivo='src/laboratory.ts',texto=readFileSync(arquivo,'utf8');
texto=texto.replace("let consultaSql:ReturnType", "let cancelarCargaSql:(()=>void)|undefined;\n let consultaSql:ReturnType");
texto=texto.replace('version++;execution?.cancel();','version++;cancelarCargaSql?.();cancelarCargaSql=undefined;execution?.cancel();');
texto=texto.replace(" let modulo:typeof import('./execution/sql-local');\n try{modulo=await import('./execution/sql-local');}catch{if(!disposed&&revision===version)message('Não foi possível carregar SQLite. Seu SQL continua salvo. Conecte à internet para o primeiro carregamento e tente novamente.');return;}\n if(disposed||revision!==version)return;\n const consulta=modulo.executarSqlLocal(code);",` const inicioCarga=performance.now();let prazoCarga:ReturnType<typeof setTimeout>|undefined,cancelarEstaCarga:(()=>void)|undefined;
 let modulo:typeof import('./execution/sql-local');
 try{
  const limite=new Promise<never>((_,rejeitar)=>{
   cancelarEstaCarga=()=>rejeitar(new Error('Carregamento cancelado.'));cancelarCargaSql=cancelarEstaCarga;
   prazoCarga=setTimeout(()=>rejeitar(new Error('Carregamento expirado.')),20000);
  });
  modulo=await Promise.race([import('./execution/sql-local'),limite]);
 }catch{if(!disposed&&revision===version)message('Não foi possível carregar SQLite no prazo. Seu SQL continua salvo. Conecte à internet para o primeiro carregamento e tente novamente.');return;}
 finally{clearTimeout(prazoCarga);if(cancelarCargaSql===cancelarEstaCarga)cancelarCargaSql=undefined;}
 if(disposed||revision!==version)return;
 const consulta=modulo.executarSqlLocal(code,Math.max(1,20000-(performance.now()-inicioCarga)));`);
writeFileSync(arquivo,texto);
arquivo='src/execution/sql-local.ts';texto=readFileSync(arquivo,'utf8').replace('executarSqlLocal(codigo:string)','executarSqlLocal(codigo:string,prazoCarregamento=20000)').replace("e tente novamente.'),20000)","e tente novamente.'),prazoCarregamento)");writeFileSync(arquivo,texto);

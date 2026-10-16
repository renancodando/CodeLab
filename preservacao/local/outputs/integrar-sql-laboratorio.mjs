import {readFile,writeFile} from 'node:fs/promises';
const arquivo='src/laboratory.ts';let texto=await readFile(arquivo,'utf8');
function trocar(anterior,novo){if(!texto.includes(anterior))throw new Error('Trecho ausente: '+anterior.slice(0,70));texto=texto.replace(anterior,novo);}
trocar("import { execute } from './execution/runner';","import { execute } from './execution/runner';\nimport type {ResultadoSql} from './execution/motor-sql';");
trocar(" let moduloEditor:typeof import('./editor')|undefined;"," let moduloEditor:typeof import('./editor')|undefined;\n let consultaSql:ReturnType<typeof import('./execution/sql-local')['executarSqlLocal']>|undefined;");
trocar("sql:progress.drafts['lab-sql']??'SELECT 1 AS descoberta;'",String.raw`sql:progress.drafts['lab-sql']??'CREATE TABLE pedidos (id INTEGER PRIMARY KEY, centavos INTEGER NOT NULL CHECK (centavos >= 0));\nINSERT INTO pedidos VALUES (1, 2995), (2, 3000);\nSELECT count(*) AS pedidos, sum(centavos) AS total_centavos FROM pedidos;'`);
trocar("['sql','SQL · escrever e exportar']","['sql','SQL · SQLite local']");
trocar('<pre id="lab-console" aria-live="polite" hidden></pre>','<pre id="lab-console" aria-live="polite" hidden></pre><div id="lab-sql-results" class="lab-sql-results" hidden></div>');
trocar(" const persist=()=>", " const tabelasEl=main.querySelector<HTMLElement>('#lab-sql-results')!;\n const persist=()=>");
trocar('version++;execution?.cancel();execution=undefined;controller?.abort();','version++;execution?.cancel();execution=undefined;consultaSql?.cancelar();consultaSql=undefined;controller?.abort();');
trocar('const message=(text:string)=>{iframe.hidden=true;consoleEl.hidden=false;consoleEl.textContent=text;};','const message=(text:string)=>{iframe.hidden=true;consoleEl.hidden=false;consoleEl.textContent=text;tabelasEl.hidden=true;tabelasEl.replaceChildren();};');
trocar(' const note=()=>',String.raw` function exibirSql(resposta:ResultadoSql){
  message(resposta.erro||'SQLite · '+resposta.comandos+' comando'+(resposta.comandos===1?'':'s')+' concluído'+(resposta.comandos===1?'':'s')+'. Banco descartado; o script continua salvo.');
  if(resposta.erro)return;
  tabelasEl.hidden=false;
  for(const resultado of resposta.tabelas){
   const recipiente=document.createElement('div'),tabela=document.createElement('table'),legenda=document.createElement('caption'),cabecalho=document.createElement('thead'),titulos=document.createElement('tr'),corpo=document.createElement('tbody');
   recipiente.className='lab-sql-tabela';recipiente.tabIndex=0;recipiente.setAttribute('role','region');recipiente.setAttribute('aria-label','Resultado do comando '+resultado.comando);
   legenda.textContent='Comando '+resultado.comando+' · '+resultado.linhas.length+' linha'+(resultado.linhas.length===1?'':'s');tabela.append(legenda);
   for(const nome of resultado.colunas){const coluna=document.createElement('th');coluna.scope='col';coluna.textContent=nome;titulos.append(coluna);}
   cabecalho.append(titulos);tabela.append(cabecalho);
   for(const valores of resultado.linhas){
    const linha=document.createElement('tr');
    for(const valor of valores){
     const celula=document.createElement('td');
     if(valor===null){celula.textContent='NULL';celula.dataset.tipo='nulo';celula.setAttribute('aria-label','Valor nulo');}
     else if(typeof valor==='object'){celula.textContent='BLOB ('+valor.bytes+' bytes)';celula.setAttribute('aria-label','Conteúdo binário de '+valor.bytes+' bytes');}
     else{celula.textContent=String(valor);celula.dataset.tipo=typeof valor;celula.setAttribute('aria-label','Valor '+(typeof valor==='string'?'textual':'numérico')+': '+String(valor));}
     linha.append(celula);
    }
    corpo.append(linha);
   }
   tabela.append(corpo);recipiente.append(tabela);tabelasEl.append(recipiente);
  }
 }
 const note=()=>`);
trocar('SQL pode ser escrito e exportado. Use uma base descartável no dialeto indicado na aula. A expansão usa PostgreSQL e os exemplos originais podem usar SQLite; esta bancada não contém um motor SQL.','SQL pode ser escrito, exportado e executado localmente em SQLite. Cada execução cria um banco novo: inclua criação e dados no script. PostgreSQL tem recursos e regras diferentes; use o ambiente indicado na aula. O motor carrega ao executar; consultas offline dependem desse primeiro carregamento e do cache disponível.');
trocar("if(language==='sql'||language==='text')","if(language==='text')");
trocar("try{if(language==='javascript'){",String.raw`try{if(language==='sql'){
 const modulo=await import('./execution/sql-local');if(disposed||revision!==version)return;
 const consulta=modulo.executarSqlLocal(code);consultaSql=consulta;
 const resultado=await consulta.resultado;if(disposed||revision!==version)return;
 exibirSql(resultado);if(!resultado.erro)snapshot('lab-sql',code);
 }else if(language==='javascript'){`);
trocar('if(!disposed&&revision===version){execution=undefined;button.disabled=false;}','if(!disposed&&revision===version){execution=undefined;consultaSql=undefined;button.disabled=false;}');
await writeFile(arquivo,texto);

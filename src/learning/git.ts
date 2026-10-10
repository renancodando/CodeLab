export type RegistroGit={id:number;mensagem:string;conteudo:string};
export type RepositorioGit={iniciado:boolean;trabalho:string;preparacao:string|null;historico:RegistroGit[]};

export function novoRepositorioGit():RepositorioGit{
 return {iniciado:false,trabalho:'total=0\n',preparacao:null,historico:[]};
}
function limitarRepositorio(estado:RepositorioGit):RepositorioGit{
 if(JSON.stringify(estado).length>28000)throw new Error('Esta bancada chegou ao limite do rascunho. Exporte a jornada antes de reiniciar.');
 return estado;
}
export function restaurarRepositorioGit(texto:unknown):RepositorioGit|undefined{
 if(typeof texto!=='string'||texto.length>28000)return;
 try{
  const dado=JSON.parse(texto),conteudo=(valor:unknown):valor is string=>typeof valor==='string'&&valor.length<=600;
  if(!dado||typeof dado.iniciado!=='boolean'||!conteudo(dado.trabalho)||!(dado.preparacao===null||conteudo(dado.preparacao))||!Array.isArray(dado.historico)||dado.historico.length>16)return;
  const historico:RegistroGit[]=[];
  for(const [indice,registro] of dado.historico.entries()){
   if(!registro||registro.id!==indice+1||!conteudo(registro.conteudo)||typeof registro.mensagem!=='string'||!registro.mensagem.trim()||registro.mensagem.length>80)return;
   historico.push({id:registro.id,conteudo:registro.conteudo,mensagem:registro.mensagem});
  }
  if(!dado.iniciado&&(historico.length||dado.preparacao!==null))return;
  if(historico.length&&dado.preparacao===null)return;
  return {iniciado:dado.iniciado,trabalho:dado.trabalho,preparacao:dado.preparacao,historico};
 }catch{return;}
}
export function iniciarRepositorioGit(estado:RepositorioGit):RepositorioGit{
 return {...estado,iniciado:true};
}
export function editarArquivoGit(estado:RepositorioGit,texto:string):RepositorioGit{
 if(texto.length>600)throw new Error('Use até 600 caracteres neste arquivo didático. O texto maior não foi salvo.');
 return limitarRepositorio({...estado,trabalho:texto});
}
export function prepararArquivoGit(estado:RepositorioGit):RepositorioGit{
 if(!estado.iniciado)throw new Error('Inicialize o repositório antes de preparar o arquivo.');
 return limitarRepositorio({...estado,preparacao:estado.trabalho});
}
export function registrarCommitGit(estado:RepositorioGit,mensagem:string):RepositorioGit{
 if(!estado.iniciado)throw new Error('Inicialize o repositório antes de registrar um commit.');
 if(estado.preparacao===null)throw new Error('Nenhum conteúdo foi preparado. Editar o arquivo não o prepara.');
 if(!mensagem.trim()||mensagem.length>80)throw new Error('Escreva uma mensagem de até 80 caracteres.');
 if(estado.historico.at(-1)?.conteudo===estado.preparacao)throw new Error('A preparação coincide com HEAD. Não há mudança preparada para este commit.');
 if(estado.historico.length>=16)throw new Error('Limite de 16 commits nesta bancada. Exporte a jornada antes de reiniciar.');
 const registro={id:estado.historico.length+1,mensagem:mensagem.trim(),conteudo:estado.preparacao};
 return limitarRepositorio({...estado,historico:[...estado.historico,registro]});
}
export function conferirPreparacaoGit(estado:RepositorioGit){
 return [
  {label:'O histórico tem duas versões, começando com total=0.',passed:estado.iniciado&&estado.historico.length===2&&estado.historico[0].conteudo==='total=0\n'},
  {label:'HEAD registra total=10, e a preparação acompanha esse conteúdo.',passed:estado.historico.at(-1)?.conteudo==='total=10\n'&&estado.preparacao==='total=10\n'},
  {label:'O arquivo de trabalho conserva total=20 sem virar um terceiro commit.',passed:estado.trabalho==='total=20\n'&&estado.historico.length===2}
 ];
}

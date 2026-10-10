import {describe,it,expect} from 'vitest';
import {novoRepositorioGit,restaurarRepositorioGit,iniciarRepositorioGit,editarArquivoGit,prepararArquivoGit,registrarCommitGit,conferirPreparacaoGit} from '../../src/learning/git';
import {emptyPracticeAnswer,preparePracticeAnswers} from '../../src/learning/activity-state';

function primeiroCommit(){return registrarCommitGit(prepararArquivoGit(iniciarRepositorioGit(novoRepositorioGit())),'Criar cálculo');}
describe('bancada Git de preparação',()=>{
 it('preparar captura o trabalho e commit não captura edições posteriores',()=>{
  const inicial=primeiroCommit(),editado=editarArquivoGit(inicial,'total=10\n'),preparado=prepararArquivoGit(editado),posterior=editarArquivoGit(preparado,'total=20\n'),final=registrarCommitGit(posterior,'Ajustar cálculo');
  expect(final.historico.map(c=>c.conteudo)).toEqual(['total=0\n','total=10\n']);expect(final.preparacao).toBe('total=10\n');expect(final.trabalho).toBe('total=20\n');expect(conferirPreparacaoGit(final).every(t=>t.passed)).toBe(true);
  expect(inicial.trabalho).toBe('total=0\n');expect(inicial.historico).toHaveLength(1);expect(preparado.trabalho).toBe('total=10\n');
 });
 it('editar antes de iniciar é permitido e init repetido preserva histórico',()=>{
  const estado=editarArquivoGit(novoRepositorioGit(),'minha ideia');expect(iniciarRepositorioGit(estado).trabalho).toBe('minha ideia');expect(iniciarRepositorioGit(primeiroCommit())).toEqual(primeiroCommit());
 });
 it('não confunde ausência de preparação com arquivo vazio preparado',()=>{
  const inicial=iniciarRepositorioGit(novoRepositorioGit());expect(()=>registrarCommitGit(inicial,'Criar')).toThrow('Nenhum conteúdo');
  const vazio=registrarCommitGit(prepararArquivoGit(editarArquivoGit(inicial,'')),'Arquivo vazio');expect(vazio.historico[0].conteudo).toBe('');expect(restaurarRepositorioGit(JSON.stringify(vazio))).toEqual(vazio);
 });
 it('não registra mudança não preparada nem commit igual ao HEAD',()=>{
  expect(()=>prepararArquivoGit(novoRepositorioGit())).toThrow('Inicialize');expect(()=>registrarCommitGit(novoRepositorioGit(),'Criar')).toThrow('Inicialize');
  expect(()=>registrarCommitGit(editarArquivoGit(primeiroCommit(),'total=99\n'),'Não preparado')).toThrow('Não há mudança');
 });
 it('preparar novamente substitui o snapshot sem alterar commits anteriores',()=>{
  const inicial=primeiroCommit(),alterado=prepararArquivoGit(editarArquivoGit(inicial,'total=20\n')),final=registrarCommitGit(alterado,'Vinte');expect(final.historico[0].conteudo).toBe('total=0\n');expect(final.historico[1].conteudo).toBe('total=20\n');expect(conferirPreparacaoGit(final).some(t=>!t.passed)).toBe(true);
 });
 it('rejeita mensagens vazias e limites sem modificar o estado',()=>{
  const inicial=prepararArquivoGit(iniciarRepositorioGit(novoRepositorioGit()));for(const mensagem of ['','  ','a'.repeat(81)])expect(()=>registrarCommitGit(inicial,mensagem)).toThrow('mensagem');
  expect(()=>editarArquivoGit(inicial,'a'.repeat(601))).toThrow('600');expect(inicial.historico).toEqual([]);
 });
 it('guarda mensagens como dados e não como comandos',()=>{
  const mensagem='<img src=x onerror=alert(1)>',estado=registrarCommitGit(prepararArquivoGit(iniciarRepositorioGit(novoRepositorioGit())),mensagem);expect(restaurarRepositorioGit(JSON.stringify(estado))?.historico[0].mensagem).toBe(mensagem);
 });
 it('limita histórico sem truncar silenciosamente o backup',()=>{
  let estado=iniciarRepositorioGit(novoRepositorioGit());for(let i=0;i<16;i++)estado=registrarCommitGit(prepararArquivoGit(editarArquivoGit(estado,String(i))),'Commit '+i);
  expect(restaurarRepositorioGit(JSON.stringify(estado))).toEqual(estado);expect(()=>registrarCommitGit(prepararArquivoGit(editarArquivoGit(estado,'outro')),'Extra')).toThrow('16 commits');
 });
 it('preserva rascunho no contrato de importação e exportação da jornada',()=>{
  const estado=primeiroCommit(),respostas={'git-bancada-preparacao-v1':{...emptyPracticeAnswer(),value:JSON.stringify(estado)}};expect(restaurarRepositorioGit(preparePracticeAnswers(JSON.parse(JSON.stringify(respostas)))['git-bancada-preparacao-v1'].value)).toEqual(estado);
 });
 it.each([null,[],{},'incompleto','null','[]',JSON.stringify({...novoRepositorioGit(),trabalho:12}),JSON.stringify({...novoRepositorioGit(),preparacao:''}),JSON.stringify({...primeiroCommit(),iniciado:false}),JSON.stringify({...primeiroCommit(),preparacao:null}),JSON.stringify({...primeiroCommit(),historico:[{id:2,conteudo:'x',mensagem:'M'}]})])('não inventa um rascunho válido a partir de %j',texto=>{expect(restaurarRepositorioGit(texto)).toBeUndefined();});
 it('remove propriedades externas ao restaurar e rejeita texto acima do limite',()=>{
  const estado=primeiroCommit();expect(restaurarRepositorioGit(JSON.stringify({...estado,comando:'rm',__proto__:{extra:true}}))).toEqual(estado);expect(restaurarRepositorioGit('a'.repeat(28001))).toBeUndefined();
 });
 it('limite serializado protege caracteres com escape sem truncar o arquivo',()=>{
  let estado=iniciarRepositorioGit(novoRepositorioGit());let atingiu=false;
  for(let i=0;i<16;i++){const anterior=estado;try{estado=registrarCommitGit(prepararArquivoGit(editarArquivoGit(estado,'\u0000'.repeat(599)+i.toString(16))),'Estado '+i);}catch(erro){expect(String(erro)).toContain('limite do rascunho');expect(restaurarRepositorioGit(JSON.stringify(anterior))).toEqual(anterior);atingiu=true;break;}}
  expect(atingiu).toBe(true);
 });
});

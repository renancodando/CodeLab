import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';
import ts from 'typescript';
import {verificarLinqCsharp} from './csharp-linq.mjs';

export async function verificarColecoesCsharp(raiz,atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('cs-colecoes-prever-busca'),diagnostico=atividade('cs-colecoes-materializar-filtro'),producao=atividade('cs-colecoes-reconstruir-total');
 const fonte=ts.createSourceFile('curriculum.ts',await readFile('src/content/curriculum.ts','utf8'),ts.ScriptTarget.ESNext,true);
 let aula;
 function visitar(no){
  if(ts.isArrayLiteralExpression(no)&&no.elements.length>0&&ts.isStringLiteral(no.elements[0])&&no.elements[0].text==='csharp-colecoes')aula=no;
  ts.forEachChild(no,visitar);
 }
 visitar(fonte);assert(aula&&ts.isStringLiteralLike(aula.elements[3])&&ts.isStringLiteralLike(aula.elements[5]),'exemplo e solução originais precisam ser literais');
 const expressao=diagnostico.options.find(opcao=>opcao.id==='copiar').text;
 const trocar=id=>diagnostico.code.replace('valores.Where(n => n >= 10)',diagnostico.options.find(opcao=>opcao.id===id).text);
 const metodo=obterSolucao(producao.id);
 const tipos=producao.code+'\n'+"sealed class SequenciaUnica(Pedido[] pedidos) : IEnumerable<Pedido> {\n    public int Percursos { get; private set; }\n    public IEnumerator<Pedido> GetEnumerator() {\n        if (++Percursos > 1) throw new InvalidOperationException(\"origem percorrida novamente\");\n        foreach (var pedido in pedidos) yield return pedido;\n    }\n    System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => GetEnumerator();\n}";
 const inicioConsulta=previsao.code.indexOf('\nbool encontrouLapis');assert(inicioConsulta>0);
 const lerAusente=previsao.code.slice(0,inicioConsulta)+'\ntry { Console.WriteLine(estoque["caderno"]); }\ncatch (KeyNotFoundException) { Console.WriteLine("ausente"); }\nConsole.WriteLine(estoque.Count);';
 const entrada='Console.WriteLine(SomarValidos(new[] { new Pedido(true, 12), new Pedido(false, 500), new Pedido(true, 0), new Pedido(true, 3) }));';
 const casos=[
  {id:'exemplo-original-colecoes',codigo:aula.elements[3].text,saida:['24, 40']},
  {id:'gabarito-original-pares',codigo:aula.elements[5].text,saida:['6','0']},
  {id:'presenca-zero-e-ausencia',codigo:previsao.code,saida:['True:0','False:0','2']},
  {id:'indexador-ausente-nao-cadastra',codigo:lerAusente,saida:['ausente','2']},
  {id:'resultado-filtrado-independente',codigo:obterSolucao(diagnostico.id),saida:['12, 20, 30','4, 12, 7, 20']},
  {id:'alias-altera-origem-e-perde-filtro',codigo:trocar('origem'),saida:['4, 12, 7, 20, 30','4, 12, 7, 20, 30']},
  {id:'copia-sem-filtro-inclui-itens-indevidos',codigo:trocar('copiar-tudo'),saida:['4, 12, 7, 20, 30','4, 12, 7, 20']},
  {id:'listas-vazias-bordas-ordem-e-chamadas',codigo:"static List<int> Preparar(List<int> valores) => @EXPRESSAO@;\nvar entradas = new[] {\n    new List<int>(),\n    new List<int> { 9, 10, int.MaxValue, 10, 0, -1 },\n    new List<int> { 20, 10, 11 }\n};\nvar esperadas = new[] {\n    new[] { 30 },\n    new[] { 10, int.MaxValue, 10, 30 },\n    new[] { 20, 10, 11, 30 }\n};\nfor (int indice = 0; indice < entradas.Length; indice++) {\n    var antes = entradas[indice].ToArray();\n    var resultado = Preparar(entradas[indice]);\n    if (ReferenceEquals(resultado, entradas[indice])) throw new Exception(\"lista compartilhada\");\n    resultado.Add(30);\n    if (!resultado.SequenceEqual(esperadas[indice]) || !entradas[indice].SequenceEqual(antes)) throw new Exception(\"filtro, ordem ou origem\");\n}\nvar origem = new List<int> { 10 };\nvar primeira = Preparar(origem);\nvar segunda = Preparar(origem);\nprimeira.Add(40);\nif (!segunda.SequenceEqual(new[] { 10 }) || !origem.SequenceEqual(new[] { 10 })) throw new Exception(\"chamadas compartilham resultado\");\nConsole.WriteLine(\"listas conferidas\");\n".replace('@EXPRESSAO@',expressao),saida:['listas conferidas']},
  {id:'composicao-vazio-validade-zero-e-repeticao',codigo:metodo+'\n'+"var casos = new[] {\n    (Array.Empty<Pedido>(), 0),\n    (new[] { new Pedido(false, 10), new Pedido(false, 20) }, 0),\n    (new[] { new Pedido(true, 0) }, 0),\n    (new[] { new Pedido(true, 12), new Pedido(false, 500), new Pedido(true, 0), new Pedido(true, 3) }, 15),\n    (new[] { new Pedido(true, 1000000), new Pedido(true, 1000000) }, 2000000)\n};\nforeach (var caso in casos) {\n    var antes = caso.Item1.ToArray();\n    if (SomarValidos(caso.Item1) != caso.Item2) throw new Exception(\"total incorreto\");\n    if (!caso.Item1.SequenceEqual(antes)) throw new Exception(\"entrada alterada\");\n}\nvar repetido = new Pedido(true, 5);\nif (SomarValidos(new[] { repetido, repetido }) != 10) throw new Exception(\"repetição removida\");\nif (SomarValidos(Array.Empty<Pedido>()) != 0 || SomarValidos(new[] { new Pedido(true, 7) }) != 7) throw new Exception(\"chamadas dependentes\");\nConsole.WriteLine(\"totais conferidos\");\n",saida:['totais conferidos']},
  {id:'composicao-enumera-origem-uma-vez',codigo:metodo+'\n'+"var origem = new SequenciaUnica(new[] { new Pedido(true, 12), new Pedido(false, 500), new Pedido(true, 3) });\nif (SomarValidos(origem) != 15 || origem.Percursos != 1) throw new Exception(\"enumeração repetida\");\nConsole.WriteLine(\"uma passagem\");\n",saida:['uma passagem']},
  {id:'mutante-ignora-participacao',codigo:metodo.replace('pedidos.Where(pedido => pedido.Valido)','pedidos')+'\n'+entrada,saida:['515']},
  {id:'mutante-conta-em-vez-de-somar',codigo:metodo.replace('pedido => pedido.TotalCentavos','pedido => 1')+'\n'+entrada,saida:['3']},
  {id:'mutante-inverte-participacao',codigo:metodo.replace('pedido => pedido.Valido','pedido => !pedido.Valido')+'\n'+entrada,saida:['500']}
 ];
 const pasta=join(raiz,'csharp-colecoes');await mkdir(pasta);
 const conferidos=await verificarLinqCsharp(pasta,casos,tipos);
 const projeto=join(pasta,'csharp-linq');
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_CLI_HOME:projeto,DOTNET_ADD_GLOBAL_TOOLS_TO_PATH:'false'};
 const cabecalho='using System;\nusing System.Collections.Generic;\nusing System.Linq;\n';
 const ordemInicial=producao.lines.map(linha=>linha.code).join('\n');
 const rejeicoes=[
  {id:'consulta-sem-add',codigo:diagnostico.code,erro:'CS1061'},
  {id:'total-antes-da-projecao',codigo:'Console.WriteLine(SomarValidos(Array.Empty<Pedido>()));\n'+ordemInicial+'\n'+producao.code,erro:'CS0841'}
 ];
 for(const caso of rejeicoes){
  await writeFile(join(projeto,'Program.cs'),cabecalho+caso.codigo);
  const resultado=spawnSync('dotnet',['build',join(projeto,'Linq.csproj'),'--configuration','Release','--nologo','--verbosity','quiet','--configfile',join(projeto,'NuGet.Config')],{encoding:'utf8',timeout:90000,maxBuffer:256*1024,env:ambiente});
  if(resultado.error)throw resultado.error;
  assert.notEqual(resultado.status,0,caso.id+' foi aceito');
  assert.match(resultado.stdout+resultado.stderr,new RegExp('error '+caso.erro+':'));
  console.log('OK coleções C# '+caso.id+' '+caso.erro);
 }
 return conferidos+rejeicoes.length;
}

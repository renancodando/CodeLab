import {mkdir,writeFile,access} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

export async function verificarConceitosCpp(raiz,atividades,obterSolucao){
 const atividade=id=>atividades.find(atividade=>atividade.id===id);
 const requisito=atividade('cpp-requisito-verdadeiro').code;
 const ramo=atividade('cpp-ramo-descartado').code;
 const sobrecarga=atividade('cpp-prever-sobrecarga').code;
 const cabecalho='#include <concepts>\n#include <cstddef>\n#include <iostream>\n#include <string>\n#include <vector>\n#include <array>\n#include <cassert>\n';
 const provasRequisito='\nstatic_assert(Inteiro<int> && Inteiro<unsigned> && Inteiro<bool> && Inteiro<const long>);\nstatic_assert(!Inteiro<double> && !Inteiro<std::string>);\nint main(){ std::cout << "requisitos conferidos\\n"; }';
 const casos=[
  {id:'requisito-aninhado',codigo:requisito.replace('____',obterSolucao('cpp-requisito-verdadeiro'))+provasRequisito,saida:['requisitos conferidos']},
  {id:'expressao-falsa-bem-formada',codigo:requisito.replace('____','std::integral<T>;')+'\nint main(){ std::cout << std::boolalpha << Inteiro<int> << " " << Inteiro<double> << "\\n"; }',saida:['true true']},
  {id:'ramo-descartado',codigo:ramo.replace('____',obterSolucao('cpp-ramo-descartado'))+`
int main(){
    std::vector<int> vazio, dados{3, 4};
    const auto antes = dados;
    assert(quantidade(vazio) == 0 && quantidade(dados) == 2 && dados == antes);
    assert(quantidade(std::string{}) == 0 && quantidade(std::string{"sol"}) == 3);
    assert(quantidade(std::array<int, 0>{}) == 0 && quantidade(std::array<int, 2>{1, 2}) == 2);
    assert(quantidade(0) == 1 && quantidade(-7) == 1);
    std::cout << "instanciacoes conferidas\\n";
}`,saida:['instanciacoes conferidas']},
  {id:'if-comum-instancia-size',codigo:ramo.replace('____','')+'\nint main(){ return static_cast<int>(quantidade(7)); }',erro:'size'},
  {id:'sobrecarga-prevista',codigo:sobrecarga,saida:obterSolucao('cpp-prever-sobrecarga').split('\n')},
  {id:'sobrecarga-preserva-elementos',codigo:sobrecarga.split('int main() {')[0]+`
int main(){
    std::vector<int> vazio, dados{3, 4};
    const auto antes = dados;
    assert(std::string{preparar(vazio)} == "reserva" && vazio.empty() && vazio.capacity() >= 4);
    assert(std::string{preparar(dados)} == "reserva" && dados == antes && dados.capacity() >= 6);
    std::array<int, 0> sem_itens{};
    std::array<int, 2> fixa{3, 4};
    assert(std::string{preparar(sem_itens)} == "fixo" && sem_itens.empty());
    assert(std::string{preparar(fixa)} == "fixo" && fixa[0] == 3 && fixa[1] == 4);
    std::string texto{"sol"};
    assert(std::string{preparar(texto)} == "reserva" && texto == "sol" && texto.capacity() >= 7);
    std::cout << "colecoes preservadas\\n";
}`,saida:['colecoes preservadas']},
  {id:'requisito-copiado-ambiguo',codigo:sobrecarga.replace('ComTamanho<T> &&','requires(const T& valor) { { valor.size() } -> std::convertible_to<std::size_t>; } &&'),erro:'ambiguous'}
 ];
 for(const caso of casos){
  const pasta=join(raiz,'conceitos-'+caso.id);await mkdir(pasta);
  const fonte=join(pasta,'entrada.cpp'),executavel=join(pasta,process.platform==='win32'?'programa.exe':'programa');
  await writeFile(fonte,cabecalho+caso.codigo);
  const compilacao=spawnSync('g++',['-std=c++20','-Wall','-Wextra','-Wpedantic',fonte,'-o',executavel],{encoding:'utf8',timeout:20000,maxBuffer:256*1024,env:{...process.env,LC_ALL:'C'}});
  assert.ifError(compilacao.error);
  if(caso.erro){
   assert.notEqual(compilacao.status,0,caso.id);assert.ok(compilacao.stderr.includes(caso.erro),caso.id+': '+compilacao.stderr);
   await assert.rejects(access(executavel),{code:'ENOENT'});
  }else{
   assert.equal(compilacao.status,0,caso.id+': '+compilacao.stderr);
   const execucao=spawnSync(executavel,[],{encoding:'utf8',timeout:5000,maxBuffer:256*1024});
   assert.ifError(execucao.error);assert.equal(execucao.status,0,caso.id+': '+execucao.stderr);
   assert.deepEqual(execucao.stdout.trimEnd().split(/\r?\n/),caso.saida,caso.id);
  }
  console.log('OK conceitos C++ '+caso.id+' — '+(caso.erro?'compilação recusada como previsto':'programa executado'));
 }
 return casos.length;
}

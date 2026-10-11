import {mkdir,writeFile,access} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

export async function verificarPosseCpp(raiz,atividades,obterSolucao){
 const atividade=id=>atividades.find(atividade=>atividade.id===id);
 const constante=atividade('cpp-mover-constante').code;
 const previsao=atividade('cpp-prever-posse-temporaria').code;
 const retorno=atividade('cpp-devolver-texto-dono').code;
 const cabecalho='#include <cassert>\n#include <memory>\n#include <utility>\n#include <string>\n#include <string_view>\n#include <type_traits>\n#include <iostream>\n';
 const casos=[
  {id:'dono-constante',codigo:constante,erro:'deleted'},
  {id:'dono-modificavel',codigo:'int main(){\n'+obterSolucao('cpp-mover-constante')+'\nassert(!origem && destino && *destino == 7);\nstd::cout << *destino << "\\n";\n}',saida:['7']},
  {id:'conversao-sem-transferencia',codigo:`int main(){
    auto dono = std::make_unique<int>(0);
    const auto* endereco = dono.get();
    static_cast<void>(std::move(dono));
    assert(dono.get() == endereco && *dono == 0);
    auto destino = std::move(dono);
    assert(!dono && destino.get() == endereco && *destino == 0);
    std::unique_ptr<int> vazio;
    auto outro = std::move(vazio);
    assert(!vazio && !outro);
    std::cout << "transferencia conferida\\n";
}`,saida:['transferencia conferida']},
  {id:'posse-temporaria',codigo:previsao,saida:obterSolucao('cpp-prever-posse-temporaria').split('\n')},
  {id:'observacao-vazia',codigo:`int main(){
    std::weak_ptr<int> vazio;
    assert(vazio.expired() && !vazio.lock());
    std::weak_ptr<int> encerrado;
    { auto dono = std::make_shared<int>(0); encerrado = dono; }
    assert(encerrado.expired() && !encerrado.lock());
    std::cout << "ausencia conferida\\n";
}`,saida:['ausencia conferida']},
  {id:'ultima-posse',codigo:`struct Recurso {
    inline static int vivos = 0;
    Recurso(){ ++vivos; }
    ~Recurso(){ --vivos; }
    Recurso(const Recurso&) = delete;
};
int main(){
    auto dono = std::make_shared<Recurso>();
    std::weak_ptr<Recurso> observador = dono;
    auto temporario = observador.lock();
    dono.reset();
    assert(Recurso::vivos == 1 && !observador.expired());
    auto segunda = observador.lock();
    temporario.reset();
    assert(Recurso::vivos == 1 && segunda);
    segunda.reset();
    assert(Recurso::vivos == 0 && observador.expired() && !observador.lock());
    std::cout << "vida conferida\\n";
}`,saida:['vida conferida']},
  {id:'texto-com-posse',codigo:retorno.replace('____',obterSolucao('cpp-devolver-texto-dono'))+`
static_assert(std::is_same_v<decltype(nome()), std::string>);
std::string copiar(std::string_view entrada){ std::string local{entrada}; return local; }
int main(){
    auto resultado = nome();
    assert(resultado == "CodeLab"); resultado[0] = 'c';
    assert(resultado == "codeLab" && nome() == "CodeLab");
    for (const auto& entrada : {std::string{}, std::string{"sol"}, std::string(4096, 'x')}) {
        auto origem = entrada;
        auto copia = copiar(origem);
        origem.clear();
        assert(copia == entrada);
        copia += "!";
        assert(copia.size() == entrada.size() + 1);
    }
    std::cout << "texto independente\\n";
}`,saida:['texto independente']},
  {id:'view-nao-cumpre-contrato',codigo:retorno.replace('____','std::string_view')+'\nstatic_assert(std::is_same_v<decltype(nome()), std::string>);\nint main() {}',erro:'static assertion failed'}
 ];
 for(const caso of casos){
  const pasta=join(raiz,'posse-'+caso.id);await mkdir(pasta);
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
  console.log('OK posse C++ '+caso.id+' — '+(caso.erro?'contrato recusado na compilacao':'programa executado'));
 }
 return casos.length;
}

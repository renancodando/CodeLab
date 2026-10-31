import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

export async function verificarTextoCpp(raiz,atividades,obterSolucao,aula){
 assert.ok(aula,'A aula de texto precisa permanecer no catálogo.');
 const atividade=id=>atividades.find(atividade=>atividade.id===id);
 const previsao=atividade('cpp-texto-prever-conversao');
 const diagnostico=atividade('cpp-texto-corrigir-inteiro');
 const linhaOriginal='if (r.ec != std::errc{}) return std::nullopt;';
 assert.ok(diagnostico.code.includes(linhaOriginal));
 const matriz=String.raw`
#include <iostream>
#include <limits>
#include <utility>
#include <vector>
int main() {
    const auto maior = std::numeric_limits<int>::max();
    const auto menor = std::numeric_limits<int>::min();
    const std::vector<std::pair<std::string,std::optional<int>>> casos{
        {"0",0}, {"-0",0}, {"0042",42}, {"00012",12}, {"-12",-12},
        {std::to_string(maior),maior}, {std::to_string(menor),menor},
        {"",std::nullopt}, {"12kg",std::nullopt}, {"x12",std::nullopt},
        {"+12",std::nullopt}, {" 12",std::nullopt}, {"12 ",std::nullopt},
        {"12.0",std::nullopt}, {"-",std::nullopt}, {"0x10",std::nullopt},
        {std::to_string(maior)+"0",std::nullopt},
        {std::to_string(menor)+"0",std::nullopt},
        {std::string{"12\0x",4},std::nullopt},
        {std::string{"\xD9\xA1\xD9\xA2"},std::nullopt}
    };
    bool correto = true;
    for (const auto& [texto,esperado] : casos) {
        const auto antes = texto;
        const auto primeiro = inteiroCompleto(texto);
        const auto segundo = inteiroCompleto(texto);
        if (primeiro != esperado || segundo != esperado || texto != antes) correto = false;
    }
    std::cout << (correto ? "correto" : "divergente") << '\n';
}
`;
 const inicio=aula.code.indexOf('int main() {');assert.ok(inicio>0);
 const casos=[
  {id:'previsao',codigo:previsao.code,saida:obterSolucao(previsao.id).split('\n')},
  {id:'conversor-completo',codigo:diagnostico.code.replace(linhaOriginal,obterSolucao(diagnostico.id))+matriz,saida:['correto']},
  ...diagnostico.options.filter(opcao=>opcao.id!=='ambos').map(opcao=>({id:'alternativa-'+opcao.id,codigo:diagnostico.code.replace(linhaOriginal,opcao.text)+matriz,saida:['divergente']})),
  {id:'exemplo-original',codigo:aula.code,saida:aula.expectedOutput},
  {id:'solucao-original',codigo:aula.solution,saida:aula.solutionOutput},
  ...aula.practices.map(problema=>({id:'problema-'+problema.id,codigo:problema.solution,saida:problema.expectedOutput})),
  {id:'prefixo-do-stream',codigo:aula.bugCode,saida:['12']},
  {id:'quantidade-e-gramatica',codigo:aula.code.slice(0,inicio)+String.raw`
int main() {
    assert(quantidade("0") == 0 && quantidade("000") == 0);
    assert(quantidade("010") == 10 && quantidade("500") == 500);
    const std::string invalidos[]{"", "0000", "501", "12kg", "+12", "-1", " 12", "12 ", "1.5", std::string{"1\0",2}};
    for (const auto& texto : invalidos) {
        const auto antes = texto;
        assert(!quantidade(texto) && !quantidade(texto) && texto == antes);
    }
    std::cout << "quantidades conferidas\n";
}
`,saida:['quantidades conferidas']}
 ];
 for(const caso of casos){
  const pasta=join(raiz,'texto-'+caso.id);await mkdir(pasta);
  const fonte=join(pasta,'entrada.cpp'),executavel=join(pasta,process.platform==='win32'?'programa.exe':'programa');
  await writeFile(fonte,caso.codigo);
  const compilacao=spawnSync('g++',['-std=c++20','-Wall','-Wextra','-Wpedantic',fonte,'-o',executavel],{encoding:'utf8',timeout:20000,maxBuffer:256*1024,env:{...process.env,LC_ALL:'C'}});
  assert.ifError(compilacao.error);assert.equal(compilacao.status,0,caso.id+': '+compilacao.stderr);
  const execucao=spawnSync(executavel,[],{encoding:'utf8',timeout:5000,maxBuffer:256*1024});
  assert.ifError(execucao.error);assert.equal(execucao.status,0,caso.id+': '+execucao.stderr);
  assert.deepEqual(execucao.stdout.trimEnd().split(/\r?\n/),caso.saida,caso.id);
  console.log('OK texto C++ '+caso.id+' — programa compilado e executado');
 }
 return casos.length;
}

import {strict as assert} from 'node:assert';

export function montarCasosEngenharia(atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const teste=atividade('py-testar-excecao-vazia').code;
 const corpo=obterSolucao('py-testar-excecao-vazia').replaceAll('\n','\n        ');
 const forte=teste.replace('self.assertTrue(ValueError)',corpo);
 const unicos=atividade('py-preservar-primeira-ordem').code;
 const correto=unicos.replace('____',obterSolucao('py-preservar-primeira-ordem'));
 const conferir=`
from itertools import product
for tamanho in range(5):
    for valores in product(["", "a", "b", "A"], repeat=tamanho):
        entrada = list(valores)
        antes = entrada.copy()
        esperado = list(dict.fromkeys(entrada))
        saida = unicos(entrada)
        assert saida == esperado and entrada == antes
        assert type(saida) is list and saida is not entrada
        saida.append("extra")
        assert entrada == antes and unicos(entrada) == esperado
assert unicos(["é", "e\\u0301", "é"]) == ["é", "e\\u0301"]
print("primeira ocorrência, entrada e chamadas independentes")
`;
 return [
  {id:'py-engenharia-anotacao-runtime',key:'python',source:atividade('py-prever-anotacao').code,expected:['6','33']},
  {id:'py-engenharia-teste-vazio-fraco',key:'python',source:teste+'\nassert resultado.wasSuccessful() and resultado.testsRun == 1',expected:['1 True']},
  {id:'py-engenharia-teste-detecta-mutante',key:'python',source:forte+'\nassert len(resultado.failures) == 1 and not resultado.errors',expected:['1 False']},
  {id:'py-engenharia-implementacao-corrigida',key:'python',source:forte.replace('def media(valores):\n    return 0','def media(valores):\n    if not valores:\n        raise ValueError("lista vazia")\n    return sum(valores) / len(valores)')+'\nassert resultado.wasSuccessful() and resultado.testsRun == 1',expected:['1 True']},
  {id:'py-engenharia-contexto-nao-usado',key:'python',source:teste.replace('self.assertTrue(ValueError)','self.assertRaises(ValueError)')+'\nassert resultado.wasSuccessful()',expected:['1 True']},
  {id:'py-engenharia-excecao-errada',key:'python',source:forte.replace('def media(valores):\n    return 0','def media(valores):\n    raise TypeError("tipo errado")')+'\nassert len(resultado.errors) == 1 and not resultado.failures\nprint("outro tipo de exceção não atende ao contrato")',expected:['1 False','outro tipo de exceção não atende ao contrato']},
  {id:'py-engenharia-ordem-estavel',key:'python',source:correto+conferir,expected:["['b', 'a']",'primeira ocorrência, entrada e chamadas independentes']},
  {id:'py-engenharia-negacao-equivalente',key:'python',source:unicos.replace('____','not (valor in vistos)')+conferir,expected:["['b', 'a']",'primeira ocorrência, entrada e chamadas independentes']},
  {id:'py-engenharia-condicao-invertida',key:'python',source:unicos.replace('____','valor in vistos')+'\nassert unicos(["b", "a", "b"]) == []',expected:['[]']}
 ].map(caso=>{assert(!caso.source.includes('____'),caso.id);return caso;});
}

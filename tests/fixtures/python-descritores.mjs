import {strict as assert} from 'node:assert';

export function montarCasosDescritores(atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('py-prever-atributo').code;
 const quebrado=atividade('py-isolar-descritor').code;
 const classe=obterSolucao('py-isolar-descritor');
 const fronteira=quebrado.indexOf('class Pedido:');assert(fronteira>0);
 const consumidor=quebrado.slice(fronteira);
 const guarda=atividade('py-acessar-classe').code;
 const correto=guarda.replace('____',obterSolucao('py-acessar-classe'));
 return [
  {id:'py-descritores-precedencia',key:'python',source:previsao,expected:['guardado','10','True']},
  {id:'py-descritores-compartilhado',key:'python',source:quebrado,expected:['20','20']},
  {id:'py-descritores-instancias-campos',key:'python',source:classe+'\n'+consumidor+`
class Estoque:
    entrada = Quantidade()
    saida = Quantidade()

primeiro = Estoque()
segundo = Estoque()
primeiro.entrada, primeiro.saida = 0, 7
segundo.entrada, segundo.saida = 12, 0
assert (primeiro.entrada, primeiro.saida, segundo.entrada, segundo.saida) == (0, 7, 12, 0)
for valor in [-1, True, False, 1.5, "2", None]:
    antes = vars(primeiro).copy()
    try:
        primeiro.entrada = valor
    except ValueError as erro:
        assert str(erro) == "quantidade inválida"
    else:
        raise AssertionError("valor fora do contrato aceito")
    assert vars(primeiro) == antes, "validação alterou o estado anterior"
primeiro.entrada = 10 ** 30
assert primeiro.entrada == 10 ** 30 and segundo.entrada == 12
assert Estoque.entrada is vars(Estoque)["entrada"]
assert Estoque.saida is vars(Estoque)["saida"]
assert Estoque.entrada is not Estoque.saida
print("instâncias, campos e rejeição sem mutação")
`,expected:['10','20','instâncias, campos e rejeição sem mutação']},
  {id:'py-descritores-classe-instancia-falsa',key:'python',source:correto,expected:['True','0']},
  {id:'py-descritores-identidade-invertida',key:'python',source:guarda.replace('____','None is instancia'),expected:['True','0']},
  {id:'py-descritores-falsidade-quebrada',key:'python',source:guarda.replace('____','not instancia').replace('print(Pedido(0).quantidade)','print(isinstance(Pedido(0).quantidade, Quantidade))')+`
assert isinstance(Pedido(0).quantidade, Quantidade)
print("a instância falsa devolveu o descritor")
`,expected:['True','True','a instância falsa devolveu o descritor']},
  {id:'py-descritores-identidade-sem-igualdade',key:'python',source:correto+`
class PedidoComparavel(Pedido):
    def __eq__(self, outro):
        raise AssertionError("igualdade não deve ser chamada")

pedido = PedidoComparavel(3)
assert pedido.quantidade == 3
assert PedidoComparavel.quantidade is Pedido.quantidade
print("identidade sem executar igualdade")
`,expected:['True','0','identidade sem executar igualdade']},
  {id:'py-descritores-heranca-isolada',key:'python',source:classe+'\n'+consumidor+`
class PedidoEspecial(Pedido):
    pass

especial = PedidoEspecial(4)
assert especial.quantidade == 4 and primeiro.quantidade == 10 and segundo.quantidade == 20
especial.quantidade = 0
assert especial.quantidade == 0 and primeiro.quantidade == 10
assert PedidoEspecial.quantidade is Pedido.quantidade
print("herança preserva valores independentes")
`,expected:['10','20','herança preserva valores independentes']},
  {id:'py-descritores-property-sombra-removida',key:'python',source:previsao+`
try:
    item.total = 99
except AttributeError:
    pass
else:
    raise AssertionError("property somente leitura aceitou atribuição")
assert item.total == 10 and vars(item)["total"] == 99
del item.cache
assert item.cache == "calculado"
print("property e remoção da sombra conferidas")
`,expected:['guardado','10','True','property e remoção da sombra conferidas']}
 ].map(caso=>{
  assert(!caso.source.includes('____'),caso.id);return caso;
 });
}

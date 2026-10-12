import {strict as assert} from 'node:assert';

export function montarCasosNumeros(atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const previsao=atividade('py-prever-piso-resto').code;
 const quebrado=atividade('py-conservar-centavos').code;
 const distribuicao=obterSolucao('py-conservar-centavos');
 const entrada=atividade('py-validar-digitos-ascii').code;
 const correto=entrada.replace('____',obterSolucao('py-validar-digitos-ascii'));
 const conferirEntrada=`
for valor in range(501):
    assert quantidade(str(valor)) == valor
    assert quantidade(str(valor).zfill(3)) == valor
for texto in ["", " 1", "1 ", "+1", "-1", "1.0", "1_0", "501", "999", "0000", "１２", "١٢", "²", "0\\n", "0\\t"]:
    try:
        quantidade(texto)
    except ValueError:
        pass
    else:
        raise AssertionError(repr(texto) + " aceito fora do contrato")
print("entrada, zero e fronteiras conferidos")
`;
 return [
  {id:'py-numeros-piso-negativo',key:'python',source:previsao,expected:['-3 2','True']},
  {id:'py-numeros-rateio-quebrado',key:'python',source:quebrado,expected:['[333, 333, 333]']},
  {id:'py-numeros-rateio-invariantes',key:'python',source:distribuicao+`
assert distribuir(1000, 3) == [334, 333, 333]
assert distribuir(17, 5) == [4, 4, 3, 3, 3]
assert distribuir(2, 5) == [1, 1, 0, 0, 0]
for total in [*range(131), 10 ** 30 + 7]:
    for pessoas in range(1, 18):
        parcelas = distribuir(total, pessoas)
        assert len(parcelas) == pessoas and all(type(valor) is int for valor in parcelas)
        assert sum(parcelas) == total
        assert max(parcelas) - min(parcelas) <= 1
        assert parcelas == sorted(parcelas, reverse=True)
        assert all(valor >= 0 for valor in parcelas)
for total, pessoas in [(-1, 3), (1, 0), (0, -1)]:
    try:
        distribuir(total, pessoas)
    except ValueError:
        pass
    else:
        raise AssertionError("distribuição inválida aceita")
primeira = distribuir(2, 5)
primeira[0] = 99
assert distribuir(2, 5) == [1, 1, 0, 0, 0]
print("soma, diferença, ordem e independência conferidas")
`,expected:['soma, diferença, ordem e independência conferidas']},
  {id:'py-numeros-resto-concentrado',key:'python',source:`
total, pessoas = 17, 5
cota, resto = divmod(total, pessoas)
parcelas = [cota] * pessoas
parcelas[-1] += resto
assert sum(parcelas) == total
assert max(parcelas) - min(parcelas) > 1
assert parcelas != sorted(parcelas, reverse=True)
assert sum([round(4 / 6)] * 6) != 4
print("conservar a soma não garante o rateio")
`,expected:['conservar a soma não garante o rateio']},
  {id:'py-numeros-ascii',key:'python',source:correto+conferirEntrada,expected:['0','50','entrada, zero e fronteiras conferidos']},
  {id:'py-numeros-ascii-aspas-simples',key:'python',source:entrada.replace('____',"'0'<=caractere<='9'")+conferirEntrada,expected:['0','50','entrada, zero e fronteiras conferidos']},
  {id:'py-numeros-isdigit-fora-contrato',key:'python',source:entrada.replace('____','caractere.isdigit()')+`
assert quantidade("１２") == 12 and quantidade("١٢") == 12
print("dígitos fora de ASCII aceitos indevidamente")
`,expected:['0','50','dígitos fora de ASCII aceitos indevidamente']},
  {id:'py-numeros-conversao-sem-lexico',key:'python',source:entrada.replace('____','True')+`
assert quantidade(" 1") == 1 and quantidade("+1") == 1 and quantidade("-1") == -1
print("conversão não aplica o contrato lexical")
`,expected:['0','50','conversão não aplica o contrato lexical']}
 ].map(caso=>{assert(!caso.source.includes('____'),caso.id);return caso;});
}

export function montarCasosCsv(atividades,obterSolucao) {
 const atividade=id=>atividades.find(atividade=>atividade.id===id);
 const cabecalho='import csv\nfrom io import StringIO\n';
 const validar=atividade('py-csv-lote').code+'\n';
 const lote=obterSolucao('py-csv-lote');
 return [
  {id:'py-csv-prever-registro',key:'python',source:atividade('py-csv-prever-registro').code,expected:['2','2','3']},
  {id:'py-csv-cabecalho-quebrado',key:'python',source:atividade('py-csv-cabecalho').code,expected:['caderno']},
  {id:'py-csv-cabecalho-corrigido',key:'python',source:cabecalho+obterSolucao('py-csv-cabecalho')+`
leitor = csv.DictReader(StringIO("produto,quantidade\\ncaneta,2\\n", newline=""))
validar_cabecalho(leitor)
assert list(leitor) == [{"produto": "caneta", "quantidade": "2"}]
for texto in ["", "produto,produto,quantidade\\n", "quantidade,produto\\n", "produto\\n", "produto,quantidade,extra\\n"]:
    leitor = csv.DictReader(StringIO(texto, newline=""))
    try:
        validar_cabecalho(leitor)
    except ValueError as erro:
        assert str(erro) == "cabeçalho inválido"
    else:
        raise AssertionError("cabeçalho inválido aceito")
print("cabeçalhos conferidos")
`,expected:['cabeçalhos conferidos']},
  {id:'py-csv-lote-corrigido',key:'python',source:cabecalho+validar+lote+`
destino = [("anterior", 7)]
assert importar_registros([], destino) == 0
assert destino == [("anterior", 7)]
texto = 'produto,quantidade\\n" caderno,\\nazul ",2\\nzero,0\\n'
leitor = csv.reader(StringIO(texto, newline=""), strict=True)
assert next(leitor) == ["produto", "quantidade"]
assert importar_registros(leitor, destino) == 2
assert destino == [("anterior", 7), ("caderno,\\nazul", 2), ("zero", 0)]
originais = [[" novo ", "999999999"]]
assert importar_registros(originais, destino) == 1
assert originais == [[" novo ", "999999999"]]
assert destino[-1] == ("novo", 999999999)
invalidos = [[], ["produto"], ["produto", "1", "extra"], ["", "1"], ["  ", "1"], ["produto", ""], ["produto", "-1"], ["produto", "1.0"], ["produto", " 1"], ["produto", "١"], ["produto", "1000000000"]]
for invalido in invalidos:
    destino = [("anterior", 7)]
    try:
        importar_registros([["válido", "2"], invalido], destino)
    except ValueError as erro:
        assert "registro 3:" in str(erro)
    else:
        raise AssertionError("registro inválido aceito")
    assert destino == [("anterior", 7)], "gravou antes de validar tudo"
def leitura_com_falha():
    yield ["válido", "2"]
    raise OSError("leitura interrompida")
destino = [("anterior", 7)]
try:
    importar_registros(leitura_com_falha(), destino)
except OSError as erro:
    assert str(erro) == "leitura interrompida"
else:
    raise AssertionError("erro de leitura suprimido")
assert destino == [("anterior", 7)]
leitor = csv.reader(StringIO('produto,quantidade\\nválido,2\\n"aberto,3', newline=""), strict=True)
next(leitor)
try:
    importar_registros(leitor, destino)
except csv.Error:
    pass
else:
    raise AssertionError("CSV malformado aceito")
assert destino == [("anterior", 7)]
print("lote, limites e falhas conferidos")
`,expected:['lote, limites e falhas conferidos']},
  {id:'py-csv-lote-quebrado',key:'python',source:validar+lote.replace('        lote.append((produto, quantidade))','        destino.append((produto, quantidade))').replace('    destino.extend(lote)\n','')+`
destino = [("anterior", 7)]
try:
    importar_registros([["válido", "2"], ["inválido", "-1"]], destino)
except ValueError:
    pass
else:
    raise AssertionError("deveria rejeitar o segundo registro")
assert destino == [("anterior", 7), ("válido", 2)]
print("gravação parcial reproduzida")
`,expected:['gravação parcial reproduzida']}
 ];
}

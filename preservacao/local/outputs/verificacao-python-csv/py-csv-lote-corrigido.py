import csv
from io import StringIO
def validar_registro(registro, numero):
    if len(registro) != 2:
        raise ValueError(f"registro {numero}: esperados dois campos")
    produto, quantidade = registro
    if not produto.strip():
        raise ValueError(f"registro {numero}: produto vazio")
    if not (1 <= len(quantidade) <= 9 and quantidade.isascii() and quantidade.isdecimal()):
        raise ValueError(f"registro {numero}: quantidade inválida")
    return produto.strip(), int(quantidade)
def importar_registros(registros, destino):
    lote = []
    for numero, registro in enumerate(registros, start=2):
        produto, quantidade = validar_registro(registro, numero)
        lote.append((produto, quantidade))
    destino.extend(lote)
    return len(lote)
destino = [("anterior", 7)]
assert importar_registros([], destino) == 0
assert destino == [("anterior", 7)]
texto = 'produto,quantidade\n" caderno,\nazul ",2\nzero,0\n'
leitor = csv.reader(StringIO(texto, newline=""), strict=True)
assert next(leitor) == ["produto", "quantidade"]
assert importar_registros(leitor, destino) == 2
assert destino == [("anterior", 7), ("caderno,\nazul", 2), ("zero", 0)]
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
leitor = csv.reader(StringIO('produto,quantidade\nválido,2\n"aberto,3', newline=""), strict=True)
next(leitor)
try:
    importar_registros(leitor, destino)
except csv.Error:
    pass
else:
    raise AssertionError("CSV malformado aceito")
assert destino == [("anterior", 7)]
print("lote, limites e falhas conferidos")

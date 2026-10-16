import csv
from io import StringIO
def validar_cabecalho(leitor):
    if leitor.fieldnames != ["produto", "quantidade"]:
        raise ValueError("cabeçalho inválido")
leitor = csv.DictReader(StringIO("produto,quantidade\ncaneta,2\n", newline=""))
validar_cabecalho(leitor)
assert list(leitor) == [{"produto": "caneta", "quantidade": "2"}]
for texto in ["", "produto,produto,quantidade\n", "quantidade,produto\n", "produto\n", "produto,quantidade,extra\n"]:
    leitor = csv.DictReader(StringIO(texto, newline=""))
    try:
        validar_cabecalho(leitor)
    except ValueError as erro:
        assert str(erro) == "cabeçalho inválido"
    else:
        raise AssertionError("cabeçalho inválido aceito")
print("cabeçalhos conferidos")

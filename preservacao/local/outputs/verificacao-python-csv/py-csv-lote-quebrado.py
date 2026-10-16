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
        destino.append((produto, quantidade))
    return len(lote)
destino = [("anterior", 7)]
try:
    importar_registros([["válido", "2"], ["inválido", "-1"]], destino)
except ValueError:
    pass
else:
    raise AssertionError("deveria rejeitar o segundo registro")
assert destino == [("anterior", 7), ("válido", 2)]
print("gravação parcial reproduzida")

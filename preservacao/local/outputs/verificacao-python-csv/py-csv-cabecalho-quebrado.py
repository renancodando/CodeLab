import csv
from io import StringIO

texto = "produto,produto,quantidade\ncaneta,caderno,2\n"
leitor = csv.DictReader(StringIO(texto, newline=""))
registro = next(leitor)
print(registro["produto"])
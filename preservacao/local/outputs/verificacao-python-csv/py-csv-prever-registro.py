import csv
from io import StringIO

texto = 'produto,quantidade\n"caderno,\nazul",2\n'
leitor = csv.reader(StringIO(texto, newline=""), strict=True)
next(leitor)
registro = next(leitor)
print(len(registro))
print(registro[1])
print(leitor.line_num)
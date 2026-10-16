import json
import sys
import zipfile

with zipfile.ZipFile(sys.argv[1]) as arquivo:
    for nome in arquivo.namelist():
        if nome.endswith('.trace'):
            for linha in arquivo.read(nome).splitlines():
                try:
                    evento = json.loads(linha)
                except ValueError:
                    continue
                if evento.get('error'):
                    print(json.dumps(evento['error'], ensure_ascii=False)[:12000])

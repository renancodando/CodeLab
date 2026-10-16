import json,zipfile,pathlib
raiz=pathlib.Path(r'C:\Users\perei\Documents\Codex\2026-10-03\nao-m\outputs\diagnostico-html-main43')
arquivo=next(raiz.rglob('trace.zip'))
with zipfile.ZipFile(arquivo) as pacote:
 for nome in pacote.namelist():
  if nome.endswith('.trace'):
   eventos=[json.loads(linha) for linha in pacote.read(nome).decode().splitlines()]
   print('TRACE',nome)
   for evento in eventos:
    if evento.get('type')=='after' and evento.get('error'):
     print(json.dumps(evento,ensure_ascii=False)[:5000])
   ultimos=[e for e in eventos if e.get('type') in ('before','after','log')]
   for evento in ultimos[-28:]:
    print(json.dumps(evento,ensure_ascii=False)[:1800])
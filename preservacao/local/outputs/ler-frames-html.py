import json,zipfile,pathlib
arquivo=next(pathlib.Path(r'C:\Users\perei\Documents\Codex\2026-10-03\nao-m\outputs\diagnostico-html-main43').rglob('trace.zip'))
with zipfile.ZipFile(arquivo) as pacote:
 for nome in pacote.namelist():
  if nome.endswith('.trace'):
   for linha in pacote.read(nome).decode().splitlines():
    e=json.loads(linha)
    if e.get('type') in ('event','console','frame-snapshot') and any(t in linha for t in ('about:blank','about:srcdoc','error','isolado','parent.document')):
     print(nome,json.dumps(e,ensure_ascii=False)[:2500])
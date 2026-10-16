import {readFileSync,writeFileSync} from 'node:fs';
const caminho='src/execution/compilador-ts.ts';let texto=readFileSync(caminho,'utf8').replace('ts.getModifiers(no as ts.HasModifiers)?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)','(ts.canHaveModifiers(no)&&ts.getModifiers(no)?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword))');writeFileSync(caminho,texto);

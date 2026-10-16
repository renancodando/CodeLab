import {readFileSync,writeFileSync} from 'node:fs';
const caminho='src/laboratory.ts';let texto=readFileSync(caminho,'utf8');
function trocar(antigo,novo){if(!texto.includes(antigo))throw Error('Trecho ausente: '+antigo.slice(0,70));texto=texto.replace(antigo,novo);}
trocar('let cancelarCargaSql:(()=>void)|undefined,cancelarCargaTs:(()=>void)|undefined;','let cancelarCargaSql:(()=>void)|undefined,cancelarCargaTs:(()=>void)|undefined,cancelarCargaEditor:(()=>void)|undefined;');
trocar("iframe.src='about:blank';button.disabled=false;","iframe.src='about:blank';button.disabled=!editor;");
trocar("main.querySelector('#export')!.addEventListener('click',()=>{if(!editor)return;","main.querySelector('#export')!.addEventListener('click',()=>{");
trocar("download('projeto.'+extension[language],editor.getValue(),'text/plain');","download('projeto.'+extension[language],editor?.getValue()??drafts[language]??'','text/plain');");
trocar("if(disposed||!editor||!moduloEditor)return;moduloEditor.alterarLinguagem","if(disposed||!editor||!moduloEditor)return;moduloEditor.atualizarDiagnosticosTs(editor,[]);moduloEditor.alterarLinguagem");
trocar(" void import('./editor').then(module=>{"," let prazoEditor:ReturnType<typeof setTimeout>|undefined;\n const limiteEditor=new Promise<never>((_,rejeitar)=>{cancelarCargaEditor=()=>rejeitar(new Error('Tela encerrada.'));prazoEditor=setTimeout(()=>rejeitar(new Error('Carregamento expirado.')),20000);});\n message('Carregando o editor. Seu código continua salvo e pode ser exportado.');\n void Promise.race([import('./editor'),limiteEditor]).then(module=>{");
trocar(".catch(()=>{if(!disposed)message('Não foi possível carregar o editor. Recarregue a página.');});icons();",".catch(()=>{if(!disposed){button.disabled=true;message('Não foi possível carregar o editor no prazo. Seu código continua salvo e pode ser exportado. Recarregue a página para tentar novamente.');}}).finally(()=>{clearTimeout(prazoEditor);cancelarCargaEditor=undefined;});icons();");
trocar("return()=>{persist();disposed=true;clearTimeout(saveTimer);","return()=>{persist();disposed=true;cancelarCargaEditor?.();cancelarCargaEditor=undefined;clearTimeout(prazoEditor);clearTimeout(saveTimer);");
trocar('Servidor de execução indisponível. HTML e JavaScript funcionam no navegador.','Servidor de execução indisponível. HTML, JavaScript, TypeScript e SQLite funcionam no navegador.');
writeFileSync(caminho,texto);
const teste='tests/e2e/typescript-local.spec.ts';texto=readFileSync(teste,'utf8').replace("await pagina.goto('/#/laboratorio');await expect(pagina.locator('#lab-run')).toBeEnabled();","await pagina.goto('/#/laboratorio');await expect(pagina.locator('#lab-run')).toBeEnabled({timeout:20000});");writeFileSync(teste,texto);

import {readFileSync,writeFileSync} from 'node:fs';
const caminho='src/learning/http-ui.ts',texto=readFileSync(caminho,'utf8');
const antigo=" const solucao=alvo.closest('[data-stage]')?.querySelector('details');solucao?.addEventListener('toggle',()=>{if(solucao.open&&!incompativel){resposta.assisted=true;salvar();}},opcoes);";
const novo=" const solucao=alvo.closest('[data-stage]')?.querySelector('details');\n function registrarAssistencia(){if(!incompativel&&!resposta.assisted){resposta.assisted=true;salvar();}}\n solucao?.querySelector('summary')?.addEventListener('click',()=>{if(!solucao.open)registrarAssistencia();},opcoes);\n solucao?.addEventListener('toggle',()=>{if(solucao.open)registrarAssistencia();},opcoes);";
if(!texto.includes(antigo))throw Error('Trecho HTTP ausente');writeFileSync(caminho,texto.replace(antigo,novo));

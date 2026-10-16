import {readFileSync,writeFileSync} from 'node:fs';
const caminho='tests/e2e/http-bancada.spec.ts',texto=readFileSync(caminho,'utf8');
const antigo=`await pagina.locator('[data-stage="idempotencia"] details summary').click();await pagina.reload({waitUntil:'domcontentloaded'});`;
const novo=`const assistidaAntesDeSair=await pagina.evaluate(chave=>{document.querySelector<HTMLElement>('[data-stage="idempotencia"] details summary')!.click();return JSON.parse(localStorage.getItem('codelab.progress.v2')!).practiceAnswers[chave].assisted;},chave);expect(assistidaAntesDeSair).toBe(true);await pagina.reload({waitUntil:'domcontentloaded'});`;
if(!texto.includes(antigo))throw Error('Trecho de teste ausente');writeFileSync(caminho,texto.replace(antigo,novo));
const config=readFileSync('../../outputs/playwright-http-publicado.config.mjs','utf8').replace('https://code-lab-omega.vercel.app','http://127.0.0.1:5173').replace('resultados-http-publicado/','resultados-http-assistencia/');writeFileSync('../../outputs/playwright-http-assistencia.config.mjs',config);

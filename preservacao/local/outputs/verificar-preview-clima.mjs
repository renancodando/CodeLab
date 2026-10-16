import {chromium, expect} from '../work/CodeLab/node_modules/@playwright/test/index.mjs';
const origem = 'https://code-lab-git-clima-motor-atmosfer-4778ba-renancodandos-projects.vercel.app';
const credencial = process.env.VERCEL_OIDC_TOKEN;
if (!credencial) throw new Error('Credencial temporária de desenvolvimento não disponível.');
const navegador = await chromium.launch({channel:'msedge',headless:true});
try {
 const contexto = await navegador.newContext({viewport:{width:375,height:812}});
 await contexto.route('**/*', async rota => {
  const requisicao = rota.request();
  if(new URL(requisicao.url()).origin === origem) await rota.continue({headers:{...requisicao.headers(),'x-vercel-trusted-oidc-idp-token':credencial}});
  else await rota.continue();
 });
 const pagina = await contexto.newPage(), erros = [];
 pagina.on('pageerror',erro=>erros.push(erro.message));
 pagina.on('console',mensagem=>{if(mensagem.type()==='error'&&/WebGL|shader|THREE/i.test(mensagem.text()))erros.push(mensagem.text());});
 await pagina.goto(origem,{waitUntil:'domcontentloaded',timeout:45000});
 await pagina.getByRole('button',{name:'Configurar ambiente',exact:true}).click({timeout:15000});
 const respostaPendente = pagina.waitForResponse(r=>r.url().includes('/api/meteorologia/observacao?'),{timeout:20000});
 await pagina.locator('#apply-city').click();
 const resposta = await respostaPendente, boletim = await resposta.json();
 expect(resposta.status()).toBe(200);
 expect(boletim.dados[0].icaoId).toBe('SBSP');
 expect(boletim.recebidoEm).toBeGreaterThan(0);
 await pagina.getByText('Detalhes do clima',{exact:true}).click();
 await expect(pagina.locator('#weather-details')).toContainText('NOAA/AWC METAR SBSP');
 const resumo = await pagina.locator('#weather-message').textContent();
 await pagina.getByRole('button',{name:'Fechar',exact:true}).click();
 await expect(pagina.locator('#world')).toHaveAttribute('data-massas','42');
 await expect(pagina.locator('#world')).toHaveAttribute('data-chuva','0');
 await pagina.screenshot({path:new URL('./preview-clima-375.png',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),fullPage:true});
 console.log(JSON.stringify({status:resposta.status(),estacao:boletim.dados[0].icaoId,capturadoEm:boletim.dados[0].obsTime,recebidoEm:boletim.recebidoEm,resumo,chuva:await pagina.locator('#world').getAttribute('data-chuva'),erros}));
 expect(erros).toEqual([]);
} finally {await navegador.close();}

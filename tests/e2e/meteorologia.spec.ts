import {test,expect} from '@playwright/test';
test('modelo prevê tempestade, interface informa estimativa e o mundo permanece sem chuva local',async({page})=>{
 const erros:string[]=[];page.on('pageerror',e=>erros.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/THREE|shader|WebGL/i.test(m.text()))erros.push(m.text());});
 await page.route('https://api.open-meteo.com/**',route=>route.fulfill({json:{current:{time:Date.now()/1000,interval:900,temperature_2m:22,relative_humidity_2m:90,dew_point_2m:20,wind_speed_10m:10,wind_gusts_10m:25,weather_code:95,cloud_cover:95,cloud_cover_low:90,rain:3,showers:0}}}));
 await page.route('**/api/meteorologia/observacao?*',route=>route.fulfill({json:{dados:[],recebidoEm:Date.now()}}));
 await page.goto('/');await page.getByRole('button',{name:'Configurar ambiente',exact:true}).click();await page.locator('#apply-city').click();
 await expect(page.locator('#weather-message')).toContainText('Possibilidade de chuva');
 await page.getByText('Detalhes do clima',{exact:true}).click();await expect(page.locator('#weather-details')).toContainText('estimativa de modelo');
 await expect(page.locator('#weather-details')).toContainText('Uma previsão não confirma chuva');
 await page.getByRole('button',{name:'Fechar',exact:true}).click();await expect(page.locator('#world')).toHaveAttribute('data-situacao','possibilidade');
 await expect(page.locator('#world')).toHaveAttribute('data-chuva','0');await expect(page.locator('#world')).toHaveAttribute('data-massas','42');
 expect(erros).toEqual([]);
});
test('observação próxima é apresentada sem afirmar chuva no ponto',async({page})=>{
 await page.route('https://api.open-meteo.com/**',route=>route.fulfill({json:{current:{time:Date.now()/1000,interval:900,temperature_2m:22,wind_speed_10m:10,rain:0,cloud_cover:60}}}));
 await page.route('**/api/meteorologia/observacao?*',route=>route.fulfill({json:{dados:[{icaoId:'SBSP',obsTime:Date.now()/1000,wxString:'RA',qcField:12,wspd:10}],recebidoEm:Date.now()}}));
 await page.goto('/');await page.getByRole('button',{name:'Configurar ambiente',exact:true}).click();await page.locator('#apply-city').click();
 await expect(page.locator('#weather-message')).toContainText('Chuva nas proximidades');
 await page.getByText('Detalhes do clima',{exact:true}).click();await expect(page.locator('#weather-details')).toContainText('NOAA/AWC METAR SBSP');
 await expect(page.locator('#weather-details')).toContainText('estação a ≈');
 await page.getByRole('button',{name:'Fechar',exact:true}).click();await expect(page.locator('#world')).toHaveAttribute('data-chuva','0');
});

test('observação expirada não reativa chuva e informa a idade real do boletim',async({page})=>{
 await page.route('https://api.open-meteo.com/**',route=>route.fulfill({json:{current:{time:Date.now()/1000,interval:900,temperature_2m:22,wind_speed_10m:10,rain:0,cloud_cover:60}}}));
 await page.route('**/api/meteorologia/observacao?*',route=>route.fulfill({json:{dados:[{icaoId:'SBSP',obsTime:(Date.now()-14400000)/1000,wxString:'+TSRA',qcField:0}],recebidoEm:Date.now()}}));
 await page.goto('/');await page.getByRole('button',{name:'Configurar ambiente',exact:true}).click();await page.locator('#apply-city').click();
 await expect(page.locator('#weather-message')).toContainText('Condição estimada');
 await page.getByText('Detalhes do clima',{exact:true}).click();await expect(page.locator('#weather-details')).toContainText('sem validade atual');
 await expect(page.locator('#weather-details')).toContainText('240 min');
 await page.getByRole('button',{name:'Fechar',exact:true}).click();await expect(page.locator('#world')).toHaveAttribute('data-chuva','0');
});
test('rede indisponível preserva navegação, detalhes e a jornada em telas estreitas',async({page,request})=>{
 const resposta=await request.get('http://127.0.0.1:5080/api/meteorologia/observacao?estacao=https://localhost');expect(resposta.status()).toBe(400);
 await page.route('https://api.open-meteo.com/**',route=>route.abort());
 await page.route('**/api/meteorologia/observacao?*',route=>route.fulfill({status:503,json:{erro:'indisponível'}}));
 await page.setViewportSize({width:220,height:720});await page.goto('/');await page.getByRole('button',{name:'Configurar ambiente',exact:true}).click();await page.locator('#apply-city').click();
 await expect(page.locator('#weather-message')).toContainText('Dados temporariamente insuficientes');
 await page.getByText('Detalhes do clima',{exact:true}).click();await expect(page.locator('#weather-details')).toBeVisible();
 expect(await page.locator('#dialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
 await page.getByRole('button',{name:'Fechar',exact:true}).click();await page.goto('/#/aprender');await expect(page.locator('.trail-grid .trail')).toHaveCount(20);
});

for(const [codigo,descricao,particula] of [['SN','Neve','neve'],['GR','Precipitação de granizo','granizo']]){
 test('METAR '+codigo+' recente ativa partículas sólidas sem chuva líquida',async({page,context})=>{
  await context.grantPermissions(['geolocation']);await context.setGeolocation({latitude:-23.627,longitude:-46.655});
  await page.route('https://api.open-meteo.com/**',route=>route.fulfill({json:{current:{time:Date.now()/1000,interval:900,temperature_2m:0,wind_speed_10m:10,rain:0,cloud_cover:90}}}));
  await page.route('**/api/meteorologia/observacao?*',route=>route.fulfill({json:{dados:[{icaoId:'SBSP',obsTime:Date.now()/1000,wxString:codigo,qcField:12}],recebidoEm:Date.now()}}));
  await page.goto('/');await page.getByRole('button',{name:'Configurar ambiente',exact:true}).click();await page.locator('#geolocate').click();
  await expect(page.locator('#weather-message')).toContainText(descricao+' observada na região');
  await page.getByRole('button',{name:'Fechar',exact:true}).click();
  await expect.poll(async()=>Number(await page.locator('#world').getAttribute('data-'+particula))).toBeGreaterThan(.02);
  await expect(page.locator('#world')).toHaveAttribute('data-chuva','0');
 });
}

import {describe,it,expect,vi} from 'vitest';
import {combinarMeteorologia,qualidadeAtual} from '../../src/environment/meteorologia/confianca';
import {normalizarEvidencia,normalizarModelo} from '../../src/environment/meteorologia/normalizacao';
import type {LeituraMeteorologica,TipoFonte} from '../../src/environment/meteorologia/modelo';
import {normalizarMetar,distanciaEstacao,criarObservacao} from '../../src/environment/meteorologia/observacao';
import {CampoNuvens} from '../../src/environment/meteorologia/campo-nuvens';
import {criarCenario,cenariosAtmosfericos} from '../../src/environment/meteorologia/cenarios';
import {transmissaoAtmosferica} from '../../src/environment/meteorologia/iluminacao';
import {initialFrame,stepEnvironment} from '../../src/environment/simulation';
import {defaultEnvironment,WeatherService} from '../../src/environment/weather';
import {rainIntensity} from '../../src/environment/weather-state';
import {resumoMeteorologico} from '../../src/environment/meteorologia/apresentacao';
const agora=Date.parse('2026-10-08T12:00:00Z');
const leitura=(tipo:TipoFonte,chuva:number,extra:Partial<LeituraMeteorologica>={}):LeituraMeteorologica=>({fonte:tipo,tipo,capturadoEm:agora,recebidoEm:agora,validade:900000,qualidade:1,distanciaKm:0,cobertura:'ponto',variaveis:{precipitacao:chuva},...extra});
describe('evidência e chuva local',()=>{
 it('modelo molhado, radar sem eco e pluviômetro seco não produzem chuva local',()=>{
  const resultado=combinarMeteorologia([leitura('modelo',8),leitura('radar',0),leitura('pluviometro',0)],agora);
  expect(resultado.situacao).toBe('nao-detectada');expect(resultado.intensidadeLocal).toBe(0);expect(resultado.divergencia).toBe(true);
 });
 it('radar e pluviômetro concordantes geram observação recente com confiança alta',()=>{
  const resultado=combinarMeteorologia([leitura('radar',4),leitura('pluviometro',6)],agora);
  expect(resultado.situacao).toBe('observada');expect(resultado.confiancaChuva).toBeGreaterThan(.9);expect(resultado.intensidadeLocal).toBe(5);
 });
 it('célula próxima permanece distante e não molha o local',()=>{
  const resultado=combinarMeteorologia([leitura('radar',8,{cobertura:'proximidades'})],agora);
  expect(resultado.situacao).toBe('proximidades');expect(resultado.intensidadeLocal).toBe(0);expect(resultado.intensidadeDistante).toBe(8);
 });
 it('somente previsão nunca confirma chuva nem convectividade',()=>{
  const resultado=combinarMeteorologia([leitura('modelo',25,{tempestade:true})],agora);
  expect(resultado.situacao).toBe('possibilidade');expect(resultado.intensidadeLocal).toBe(0);expect(resultado.tempestade).toBe(0);
  expect(rainIntensity(0,95)).toBe(0);
 });
 it('conflito observacional reduz a força da representação e informa divergência',()=>{
  const resultado=combinarMeteorologia([leitura('radar',8),leitura('pluviometro',0)],agora);
  expect(resultado.situacao).toBe('provavel');expect(resultado.confiancaChuva).toBeLessThan(.5);expect(resultado.intensidadeLocal).toBeLessThan(8);
 });
 it('a confiança envelhece pela captura, mesmo quando a resposta acaba de chegar',()=>{
  const recente=leitura('radar',2),antiga={...recente,capturadoEm:agora-1800000};
  expect(qualidadeAtual(antiga,agora)).toBeLessThan(qualidadeAtual(recente,agora));
  expect(combinarMeteorologia([antiga],agora).intensidadeLocal).toBe(0);
  expect(combinarMeteorologia([recente],agora+2700001).situacao).toBe('insuficiente');
 });
 it('horário ausente ou futuro não vira dado novo ao receber',()=>{
  for(const capturadoEm of [null,NaN,agora+600000])expect(qualidadeAtual(leitura('radar',8,{capturadoEm}),agora)).toBe(0);
  for(const campo of ['recebidoEm','validade','qualidade'])expect(qualidadeAtual({...leitura('radar',8),[campo]:NaN},agora)).toBe(0);
 });
 it('estação distante e distância desconhecida não provam chuva no ponto',()=>{
  for(const distanciaKm of [null,30])expect(combinarMeteorologia([leitura('observacao',10,{distanciaKm})],agora).intensidadeLocal).toBe(0);
 });
 it('duplicar uma fonte não aumenta a confiança nem duplica intensidade',()=>{
  const radar=leitura('radar',4);expect(combinarMeteorologia([radar,radar],agora)).toEqual(combinarMeteorologia([radar],agora));
 });
 it('direções ao redor do norte são combinadas circularmente',()=>{
  const fontes=[leitura('observacao',0,{fonte:'A',variaveis:{direcao:350}}),leitura('observacao',0,{fonte:'B',variaveis:{direcao:10}})];
  const direcao=combinarMeteorologia(fontes,agora).direcao!;expect(Math.min(direcao,360-direcao)).toBeLessThan(.01);
 });
});
describe('normalização e observação oficial',()=>{
 it.each([true,false])('modelo mantém intervalo próprio durante falha, cache anterior: %s',async(comCache)=>{
  vi.useFakeTimers();vi.setSystemTime(agora);
  const modelo=vi.fn(async()=>{if(!comCache||modelo.mock.calls.length>1)throw new Error('offline');return new Response(JSON.stringify({current:{time:agora/1000,interval:900,temperature_2m:22,wind_speed_10m:10,rain:0}}));});
  const consultar=vi.fn(async()=>[]),servico=new WeatherService(()=>{},modelo,()=>Date.now(),[{nome:'observacao',intervalo:600000,consultar}]);
  try{
   const inicial=await servico.select(1,1,'A');
   await vi.advanceTimersByTimeAsync(3000000);
   expect(modelo).toHaveBeenCalledTimes(2);expect(consultar).toHaveBeenCalledTimes(6);
   const retomada=await servico.select(1,1,'A');expect(modelo).toHaveBeenCalledTimes(2);expect(retomada.updatedAt).toBe(inicial.updatedAt);
   if(comCache)expect(retomada.fontes?.[0].capturadoEm).toBe(agora);
   await vi.advanceTimersByTimeAsync(600000);expect(modelo).toHaveBeenCalledTimes(3);expect(consultar).toHaveBeenCalledTimes(7);
  }finally{servico.dispose();vi.useRealTimers();}
 });
 it.each([0,1,4,12,128,undefined])('qcField %s não é interpretado como boletim inválido',qcField=>{
  const fontes=normalizarMetar([{icaoId:'SBSP',obsTime:agora/1000,wxString:'RA',qcField}],'SBSP',0,agora),resultado=combinarMeteorologia(fontes,agora);
  expect(resultado.situacao).toBe('observada');expect(resultado.intensidadeLiquida).toBeGreaterThan(0);
  expect(fontes[0].controleQualidade).toBe(qcField);
 });
 it('sensor de tempo presente indisponível não confirma nem nega precipitação',()=>{
  const fontes=normalizarMetar([{icaoId:'SBSP',obsTime:agora/1000,wxString:'RA',cover:'CAVOK',rawOb:'METAR SBSP RMK PWINO',temp:18}],'SBSP',0,agora);
  const resultado=combinarMeteorologia(fontes,agora);expect(resultado.intensidadeLocal).toBe(0);expect(resultado.situacao).toBe('estimada');expect(resultado.temperatura).toBe(18);
 });
 it.each(['SN','SHSN','-SN','GR','+TSGR','SHGS','PL'])('precipitação sólida %s ativa partículas próprias sem fabricar chuva líquida',wxString=>{
  const fontes=normalizarMetar([{icaoId:'SBSP',obsTime:agora/1000,wxString}],'SBSP',0,agora),resultado=combinarMeteorologia(fontes,agora);
  expect(resultado.situacao).toBe('observada');expect(resultado.intensidadeLocal).toBeGreaterThan(0);expect(resultado.intensidadeLiquida).toBe(0);
  const estado={...defaultEnvironment,fontes},frame=initialFrame(estado);
  for(let i=0;i<180;i++)stepEnvironment(frame,estado,1,agora);
  expect(frame.rain).toBe(0);expect(frame.snow+frame.hail).toBeGreaterThan(.05);
  expect(frame.storm>0).toBe(wxString.includes('TS'));
  expect(resumoMeteorologico(estado,agora)).not.toContain('Chuva');
 });
 it('chuva e neve mistas preservam ambas as formas e o rótulo correspondente',()=>{
  const fontes=normalizarMetar([{icaoId:'SBSP',obsTime:agora/1000,wxString:'RASN'}],'SBSP',0,agora),resultado=combinarMeteorologia(fontes,agora);
  expect(resultado.neve).toBeGreaterThan(0);expect(resultado.intensidadeLiquida).toBeGreaterThan(0);expect(resumoMeteorologico({...defaultEnvironment,fontes},agora)).toContain('Precipitação mista');
 });
 it.each(['BLSN','DRSN','VCSN'])('%s não gera neve ou chuva local',wxString=>{
  const fontes=normalizarMetar([{icaoId:'SBSP',obsTime:agora/1000,wxString}],'SBSP',0,agora),resultado=combinarMeteorologia(fontes,agora);
  expect(resultado.intensidadeLocal).toBe(0);expect(resultado.neve).toBe(0);expect(resultado.granizo).toBe(0);
  if(wxString==='VCSN')expect(resumoMeteorologico({...defaultEnvironment,fontes},agora)).toContain('Neve nas proximidades');
 });
 it('precipitação desconhecida informa o fenômeno sem inventar fase líquida',()=>{
  const fontes=normalizarMetar([{icaoId:'SBSP',obsTime:agora/1000,wxString:'UP'}],'SBSP',0,agora),resultado=combinarMeteorologia(fontes,agora);
  expect(resultado.intensidadeLiquida).toBe(0);expect(resumoMeteorologico({...defaultEnvironment,fontes},agora)).toBe('Precipitação observada na região');
 });
 it.each(['RA VCTS','RA VCSN'])('chuva local em %s não herda fenômenos sólidos ou convectivos próximos',wxString=>{
  const fontes=normalizarMetar([{icaoId:'SBSP',obsTime:agora/1000,wxString}],'SBSP',0,agora),resultado=combinarMeteorologia(fontes,agora);
  expect(resultado.situacao).toBe('observada');expect(resultado.intensidadeLiquida).toBeGreaterThan(0);
  expect(resultado.tempestade).toBe(0);expect(resultado.neve).toBe(0);expect(resultado.tipoPrecipitacao).toBe('chuva');
 });
 it('observação falha sem derrubar o modelo e cada fonte mantém sua cadência',async()=>{
  vi.useFakeTimers();vi.setSystemTime(agora);
  const modelo=vi.fn(async()=>new Response(JSON.stringify({current:{time:agora/1000,interval:900,temperature_2m:22,wind_speed_10m:10,rain:8}})));
  const consultar=vi.fn(async()=>[leitura('radar',0)]),servico=new WeatherService(()=>{},modelo,()=>Date.now(),[{nome:'radar-teste',intervalo:60000,consultar}]);
  try{
   const primeiro=await servico.select(1,1,'A');expect(primeiro.fontes).toHaveLength(2);
   await vi.advanceTimersByTimeAsync(60000);expect(modelo).toHaveBeenCalledTimes(1);expect(consultar).toHaveBeenCalledTimes(2);
   consultar.mockRejectedValueOnce(new Error('offline'));
   await vi.advanceTimersByTimeAsync(60000);const cache=await servico.select(1,1,'A');
   expect(cache.fontes?.find(f=>f.tipo==='radar')?.capturadoEm).toBe(agora);
   expect(combinarMeteorologia(cache.fontes!,Date.now()).intensidadeLocal).toBe(0);
  }finally{servico.dispose();vi.useRealTimers();}
 });
 it('fonte que não responde expira sem congelar o serviço',async()=>{
  vi.useFakeTimers();vi.setSystemTime(agora);
  const modelo=vi.fn(async()=>new Response(JSON.stringify({current:{time:agora/1000,interval:900,temperature_2m:22,wind_speed_10m:10,rain:8}})));
  const servico=new WeatherService(()=>{},modelo,()=>Date.now(),[{nome:'indisponivel',intervalo:60000,consultar:()=>new Promise(()=>{})}]);
  try{const consulta=servico.select(1,1,'A');await vi.advanceTimersByTimeAsync(8001);const resultado=await consulta;
   expect(resultado.fontes).toHaveLength(1);expect(combinarMeteorologia(resultado.fontes!,Date.now()).situacao).toBe('possibilidade');
  }finally{servico.dispose();vi.useRealTimers();}
 });
 it('converte acumulado de quinze minutos para taxa e preserva campos ausentes',()=>{
  const resultado=normalizarModelo({current:{time:agora/1000,interval:900,rain:2,showers:.5,cloud_cover_low:80,wind_speed_10m:10}},agora);
  expect(resultado.tipo).toBe('modelo');expect(resultado.variaveis.precipitacao).toBe(10);expect(resultado.variaveis.pontoDeOrvalho).toBeNull();
  expect(normalizarModelo({current:{rain:2}},agora).variaveis.precipitacao).toBeNull();
 });
 it('normaliza dados incompletos sem fabricar intensidade ou distância',()=>{
  const resultado=normalizarEvidencia('pluviometro',{fonte:'Fixture',capturadoEm:agora,recebidoEm:agora,qualidade:NaN,distanciaKm:null,cobertura:'ponto',variaveis:{precipitacao:NaN,umidade:150}});
  expect(resultado.variaveis.precipitacao).toBeNull();expect(resultado.qualidade).toBe(0);expect(resultado.variaveis.umidade).toBe(100);
 });
 it('METAR distingue chuva local, proximidade, vento em nós e chuva qualitativa',()=>{
  const raw=[{icaoId:'SBSP',obsTime:agora/1000,wxString:'-RA',wspd:10,wdir:'VRB',visib:'6+',temp:18,dewp:17}];
  const resultado=normalizarMetar(raw,'SBSP',1,agora)[0];
  expect(resultado.detectouChuva).toBe(true);expect(resultado.variaveis.vento).toBeCloseTo(18.52);expect(resultado.variaveis.direcao).toBeNull();
  expect(resultado.variaveis.precipitacao).toBeUndefined();expect(resultado.intensidadeIndicativa).toBe(.3);
  expect(normalizarMetar([{...raw[0],wxString:'VCSH'}],'SBSP',1,agora)[0].cobertura).toBe('proximidades');
 });
 it('boletim sem fenômeno informado não afirma ausência de chuva, e estação errada é ignorada',()=>{
  expect(normalizarMetar([{icaoId:'SBSP',obsTime:agora/1000}],'SBSP',0,agora)[0].detectouChuva).toBeUndefined();
  expect(normalizarMetar([{icaoId:'SBSP',cover:'CAVOK',obsTime:agora/1000}],'SBSP',0,agora)[0].detectouChuva).toBe(false);
  expect(normalizarMetar([{icaoId:'SBRJ'}],'SBSP',0,agora)).toEqual([]);
 });
 it('o conector envia somente código de estação e não consulta fora da cobertura',async()=>{
  const request=vi.fn(async()=>new Response(JSON.stringify({dados:[],recebidoEm:agora}))),fonte=criarObservacao(request);
  await fonte.consultar({latitude:-23.627,longitude:-46.655,city:'A'},new AbortController().signal);
  expect(request.mock.calls[0][0]).toBe('/api/meteorologia/observacao?estacao=SBSP');
  await fonte.consultar({latitude:0,longitude:0,city:'B'},new AbortController().signal);expect(request).toHaveBeenCalledTimes(1);
  expect(distanciaEstacao({latitude:0,longitude:0},{latitude:0,longitude:1})).toBeCloseTo(111.19,1);
 });
});
describe('continuidade, vento, solo e nuvens',()=>{
 it('0 para 8 mm/h é progressivo e o fim da chuva preserva água e chão molhado',()=>{
  const estado={...defaultEnvironment,fontes:[leitura('observacao',8,{variaveis:{precipitacao:8,nebulosidade:100}})]},frame=initialFrame(defaultEnvironment);
  stepEnvironment(frame,estado,1,agora);expect(frame.rain).toBeLessThan(.1);
  for(let i=0;i<300;i++)stepEnvironment(frame,estado,1,agora);
  expect(frame.rain).toBeGreaterThan(.7);expect(frame.wetness).toBeGreaterThan(.5);const agua=frame.aguaAcumulada;
  stepEnvironment(frame,defaultEnvironment,1,agora);expect(frame.rain).toBeGreaterThan(.5);expect(frame.wetness).toBeGreaterThan(.5);expect(frame.aguaAcumulada).toBeGreaterThan(agua*.95);
 });
 it('umidade alta isolada não impõe neblina e saturação com baixa visibilidade contribui',()=>{
  const frame=initialFrame(defaultEnvironment);for(let i=0;i<300;i++)stepEnvironment(frame,{...defaultEnvironment,humidity:99},1,agora);expect(frame.fog).toBeLessThan(.003);
  const neblina=criarCenario('neblina',defaultEnvironment,agora);for(let i=0;i<300;i++)stepEnvironment(frame,neblina,1,agora);expect(frame.fog).toBeGreaterThan(.008);
 });
 it('rajada cresce e retorna, sem ultrapassar velocidade disponível',()=>{
  const frame=initialFrame(defaultEnvironment),estado=criarCenario('rajada',defaultEnvironment,agora),velocidades:number[]=[];
  for(let i=0;i<900;i++){stepEnvironment(frame,estado,1,agora);velocidades.push(frame.ventoEfetivo);}
  expect(Math.max(...velocidades)).toBeGreaterThan(25);expect(Math.max(...velocidades)).toBeLessThanOrEqual(65);
  expect(Math.max(...velocidades.slice(100))-Math.min(...velocidades.slice(100))).toBeGreaterThan(8);
 });
 it('campo mantém identidade em atualizações, evolui sem realocar pool e distingue camadas',()=>{
  const campo=new CampoNuvens(10),frame=initialFrame(defaultEnvironment),massas=[...campo.massas],sementes=massas.map(m=>m.semente);
  for(let i=0;i<60;i++)campo.avancar(frame,1);
  frame.nuvensBaixas=1;campo.avancar(frame,1);
  expect(campo.massas).toEqual(massas);expect(campo.massas.map(m=>m.semente)).toEqual(sementes);expect(campo.massas).toHaveLength(42);
  expect(new Set(campo.massas.map(m=>m.semente)).size).toBe(42);
  expect(campo.massas.find(m=>m.camada===2)!.altura).toBeLessThan(campo.massas.find(m=>m.camada===0)!.altura);
 });
 it('mesma semente e passos produzem o mesmo campo, e uma massa morre gradualmente',()=>{
  const a=new CampoNuvens(42),b=new CampoNuvens(42),frame=initialFrame(defaultEnvironment);
  for(let i=0;i<100;i++){a.avancar(frame,1);b.avancar(frame,1);}expect(a.massas).toEqual(b.massas);
  a.massas[0].idade=a.massas[0].vida-1;a.massas[0].densidade=.5;const semente=a.massas[0].semente;
  a.avancar(frame,1);expect(a.massas[0].semente).toBe(semente);expect(a.massas[0].densidade).toBeGreaterThan(.4);
 });
 it('máscara espacial oculta a região coberta e deixa outra região livre',()=>{
  const campo=new CampoNuvens(1);for(const massa of campo.massas)massa.densidade=0;
  Object.assign(campo.massas[0],{x:0,y:30,z:-50,largura:50,altura:20,densidade:1});
  expect(campo.ocultacao(0,60,-100,{x:0,y:0,z:0})).toBeGreaterThan(.5);
  expect(campo.ocultacao(150,60,-100,{x:0,y:0,z:0})).toBe(0);
 });
 it('nuvens altas deixam passar mais luz que baixas densas e a máscara afeta o Sol',()=>{
  const alto={...initialFrame(defaultEnvironment),nuvensBaixas:0,nuvensMedias:0,nuvensAltas:1},baixo={...alto,nuvensBaixas:1,nuvensAltas:0};
  expect(transmissaoAtmosferica(alto,0).direta).toBeGreaterThan(transmissaoAtmosferica(baixo,0).direta);
  expect(transmissaoAtmosferica(alto,1).direta).toBeLessThan(transmissaoAtmosferica(alto,0).direta);
  expect(transmissaoAtmosferica({...alto,visibility:300},0).direta).toBeLessThan(transmissaoAtmosferica(alto,0).direta);
 });
 it.each(cenariosAtmosfericos)('cenário %s permanece finito e limitado',nome=>{
  const frame=initialFrame(defaultEnvironment),estado=criarCenario(nome,defaultEnvironment,agora),campo=new CampoNuvens();
  if(nome.startsWith('noite'))frame.daylight=0;
  if(nome==='pos-chuva'){frame.wetness=.8;frame.aguaAcumulada=2;}
  for(let i=0;i<180;i++){stepEnvironment(frame,estado,1,agora);campo.avancar(frame,1);}
  for(const valor of Object.values(frame))if(valor!==null)expect(Number.isFinite(valor)).toBe(true);
  expect(frame.rain).toBeGreaterThanOrEqual(0);expect(frame.rain).toBeLessThanOrEqual(1);expect(frame.wetness).toBeLessThanOrEqual(1);
  if(nome==='pos-chuva')expect(frame.wetness).toBeGreaterThan(.5);
 });
});

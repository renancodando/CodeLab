import { afterEach, describe, expect, it, vi } from 'vitest';
import { criarConsultaObservacional } from '../../server/observacao-meteorologica';
import rota from '../../api/meteorologia/observacao';
import { criarObservacao } from '../../src/environment/meteorologia/observacao';
import { combinarMeteorologia } from '../../src/environment/meteorologia/confianca';

const instante = Date.parse('2026-10-08T20:00:00Z');
const boletim = [{ icaoId: 'SBSP', obsTime: instante / 1000, temp: 18, dewp: 17, wxString: 'RA', qcField: 12, wspd: 8 }];
const requisicao = (consulta = 'estacao=SBSP', method = 'GET') => new Request('https://codelab.example/api/meteorologia/observacao?' + consulta, { method });
afterEach(() => vi.useRealTimers());

describe('observação no hosting', () => {
 it('deduplica 30 consultas concorrentes e conserva captura e recepção no cache', async () => {
  let agora = instante;
  const remoto = vi.fn(async () => Response.json(boletim));
  const consultar = criarConsultaObservacional(remoto, () => agora);
  const respostas = await Promise.all(Array.from({ length: 30 }, () => consultar(requisicao())));
  expect(remoto).toHaveBeenCalledTimes(1);
  for (const resposta of respostas) {
   expect(resposta.status).toBe(200);
   expect(resposta.headers.get('Cache-Control')).toBe('public, max-age=0, s-maxage=600');
   expect(await resposta.json()).toEqual({ recebidoEm: instante, dados: boletim });
  }
  agora += 9 * 60000;
  expect(await (await consultar(requisicao())).json()).toEqual({ recebidoEm: instante, dados: boletim });
  expect(remoto).toHaveBeenCalledTimes(1);
 });

 it('separa estações e consulta somente a URL oficial sem encaminhar cabeçalhos pessoais', async () => {
  const remoto = vi.fn(async () => Response.json([]));
  const consultar = criarConsultaObservacional(remoto, () => instante);
  for (const estacao of ['SBSP', 'SBRJ', 'SBCT', 'SBPA', 'SBRF', 'SBEG', 'LPPT']) {
   const entrada = requisicao('estacao=' + estacao);
   entrada.headers.set('Cookie', 'privado');
   expect((await consultar(entrada)).status).toBe(200);
   expect(remoto).toHaveBeenLastCalledWith('https://aviationweather.gov/api/data/metar?ids=' + estacao + '&format=json', {
    signal: expect.any(AbortSignal), redirect: 'error', headers: { 'User-Agent': 'CodeLab/0.1', Accept: 'application/json' }
   });
  }
  expect(remoto).toHaveBeenCalledTimes(7);
 });

 it.each(['', 'estacao=ZZZZ', 'estacao=sbsp', 'estacao=SBSP&estacao=SBRJ', 'estacao=SBSP&latitude=-23.627', 'estacao=https://example.com'])('rejeita parâmetros não permitidos: %s', async consulta => {
  const remoto = vi.fn();
  const resposta = await criarConsultaObservacional(remoto)(requisicao(consulta));
  expect(resposta.status).toBe(400);
  expect(resposta.headers.get('Cache-Control')).toBe('no-store');
  expect(remoto).not.toHaveBeenCalled();
 });

 it('rejeita escrita antes de consultar a fonte e conecta a entrada pública ao handler', async () => {
  const remoto = vi.fn();
  const resposta = await criarConsultaObservacional(remoto)(requisicao('estacao=SBSP', 'POST'));
  expect(resposta.status).toBe(405);
  expect(resposta.headers.get('Allow')).toBe('GET');
  expect(remoto).not.toHaveBeenCalled();
  expect((await rota.fetch(requisicao('estacao=ZZZZ'))).status).toBe(400);
 });

 it('expira por estação e conserva a idade durante falhas, com backoff independente', async () => {
  let agora = instante;
  const remoto = vi.fn().mockResolvedValueOnce(Response.json(boletim)).mockRejectedValueOnce(new Error('sem rede'))
   .mockResolvedValueOnce(Response.json([{ ...boletim[0], obsTime: (instante + 20 * 60000) / 1000 }]));
  const consultar = criarConsultaObservacional(remoto, () => agora);
  await consultar(requisicao());
  agora += 10 * 60000;
  expect(await (await consultar(requisicao())).json()).toEqual({ recebidoEm: instante, dados: boletim });
  agora += 9 * 60000;
  expect(await (await consultar(requisicao())).json()).toEqual({ recebidoEm: instante, dados: boletim });
  expect(remoto).toHaveBeenCalledTimes(2);
  agora += 60000;
  expect((await (await consultar(requisicao())).json()).recebidoEm).toBe(agora);
  expect(remoto).toHaveBeenCalledTimes(3);
 });

 it('não repete falha inicial a cada chamada nem vaza mensagem da fonte', async () => {
  let agora = instante;
  const remoto = vi.fn(async () => { throw new Error('detalhe privado'); });
  const consultar = criarConsultaObservacional(remoto, () => agora);
  for (let i = 0; i < 10; i++) {
   const resposta = await consultar(requisicao());
   expect(resposta.status).toBe(503);
   expect(resposta.headers.get('Cache-Control')).toBe('no-store');
   expect(await resposta.json()).toEqual({ recebidoEm: 0, dados: [] });
   agora += 50000;
  }
  expect(remoto).toHaveBeenCalledTimes(1);
  agora = instante + 600000;
  await consultar(requisicao());
  expect(remoto).toHaveBeenCalledTimes(2);
 });

 it.each([() => new Response(null, { status: 429 }), () => new Response('<html>erro</html>'), () => Response.json({ dados: [] }), () => Response.json([1, 2, 3, 4, 5])])('usa fallback diante de HTTP/JSON inválido', async fabricar => {
  const remoto = vi.fn(async () => fabricar());
  const resposta = await criarConsultaObservacional(remoto)(requisicao());
  expect(resposta.status).toBe(503);
  expect(await resposta.json()).toEqual({ recebidoEm: 0, dados: [] });
 });

 it('aceita ausência de boletim oficial sem inventar observação', async () => {
  const resposta = await criarConsultaObservacional(vi.fn(async () => new Response(null, { status: 204 })), () => instante)(requisicao());
  expect(resposta.status).toBe(200);
  expect(await resposta.json()).toEqual({ recebidoEm: instante, dados: [] });
 });

 it('limita bytes recebidos sem depender de Content-Length e cancela leitura', async () => {
  const cancelar = vi.fn();
  const corpo = new ReadableStream<Uint8Array>({ start(controlador) {
   controlador.enqueue(new Uint8Array(60000)); controlador.enqueue(new Uint8Array(50000));
  }, cancel: cancelar });
  const resposta = await criarConsultaObservacional(vi.fn(async () => new Response(corpo)))(requisicao());
  expect(resposta.status).toBe(503);
  expect(cancelar).toHaveBeenCalledTimes(1);
 });

 it('encerra a espera em seis segundos e aborta a fonte mesmo sem resposta', async () => {
  vi.useFakeTimers();
  let sinal: AbortSignal | undefined;
  const remoto = vi.fn((_url, opcoes) => { sinal = opcoes.signal; return new Promise<Response>(() => {}); });
  const pendente = criarConsultaObservacional(remoto)(requisicao());
  await vi.advanceTimersByTimeAsync(6000);
  expect((await pendente).status).toBe(503);
  expect(sinal?.aborted).toBe(true);
 });

 it('entrega o mesmo contrato ao cliente e à fusão sem transformar previsão em observação', async () => {
  const consultar = criarConsultaObservacional(vi.fn(async () => Response.json(boletim)), () => instante);
  const cliente = criarObservacao(vi.fn(async url => consultar(new Request('https://codelab.example' + url))));
  const leituras = await cliente.consultar({ latitude: -23.627, longitude: -46.655 }, new AbortController().signal);
  const resultado = combinarMeteorologia(leituras, instante);
  expect(resultado.situacao).toBe('observada');
  expect(resultado.intensidadeLiquida).toBeGreaterThan(0);
  expect(leituras[0].capturadoEm).toBe(instante);
  expect(leituras[0].recebidoEm).toBe(instante);
 });
});

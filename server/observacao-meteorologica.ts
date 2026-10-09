const estacoes = new Set(['SBSP', 'SBRJ', 'SBCT', 'SBPA', 'SBRF', 'SBEG', 'LPPT']);
const intervalo = 600000;
const limiteResposta = 100000;
type Boletim = { recebidoEm: number; dados: unknown[] };
type Consulta = { tentativa: number; boletim?: Boletim; pendente?: Promise<Boletim | undefined> };

async function lerBoletim(resposta: Response): Promise<unknown[]> {
 if (resposta.status === 204) return [];
 if (!resposta.ok || !resposta.body) throw new Error('Observação indisponível.');
 const leitor = resposta.body.getReader(), partes: Uint8Array[] = [];
 let tamanho = 0;
 try {
  while (true) {
   const parte = await leitor.read();
   if (parte.done) break;
   tamanho += parte.value.byteLength;
   if (tamanho > limiteResposta) throw new Error('Boletim acima do limite.');
   partes.push(parte.value);
  }
 } finally { await leitor.cancel().catch(() => {}); leitor.releaseLock(); }
 const bytes = new Uint8Array(tamanho);
 let posicao = 0;
 for (const parte of partes) { bytes.set(parte, posicao); posicao += parte.byteLength; }
 const dados: unknown = JSON.parse(new TextDecoder().decode(bytes));
 if (!Array.isArray(dados) || dados.length > 4) throw new Error('Boletim inválido.');
 return dados;
}

export function criarConsultaObservacional(request: typeof fetch = fetch, agora = () => Date.now()) {
 const consultas = new Map<string, Consulta>();
 async function atualizar(estacao: string, consulta: Consulta) {
  const cancelamento = new AbortController();
  let temporizador: ReturnType<typeof setTimeout> | undefined;
  try {
   const expiracao = new Promise<never>((_, rejeitar) => {
    temporizador = setTimeout(() => { cancelamento.abort(); rejeitar(new Error('Tempo esgotado.')); }, 6000);
   });
   const consultaRemota = async () => {
    const resposta = await request('https://aviationweather.gov/api/data/metar?ids=' + estacao + '&format=json', {
     signal: cancelamento.signal, redirect: 'error', headers: { 'User-Agent': 'CodeLab/0.1', Accept: 'application/json' }
    });
    const dados = await lerBoletim(resposta);
    return { recebidoEm: agora(), dados };
   };
   consulta.boletim = await Promise.race([consultaRemota(), expiracao]);
  } catch { }
  finally { clearTimeout(temporizador); consulta.pendente = undefined; }
  return consulta.boletim;
 }
 return async function consultar(requisicao: Request): Promise<Response> {
  const responder = (dados: unknown, status: number, cache = 'no-store', cabecalhos = {}) => Response.json(dados, {
   status, headers: { 'Cache-Control': cache, 'X-Content-Type-Options': 'nosniff', ...cabecalhos }
  });
  if (requisicao.method !== 'GET') return responder({ erro: 'Use GET.' }, 405, 'no-store', { Allow: 'GET' });
  const parametros = new URL(requisicao.url).searchParams, codigos = parametros.getAll('estacao');
  if (codigos.length !== 1 || !estacoes.has(codigos[0]) || [...parametros.keys()].some(chave => chave !== 'estacao')) {
   return responder({ erro: 'Estação não disponível.' }, 400);
  }
  const estacao = codigos[0], instante = agora();
  let consulta = consultas.get(estacao);
  if (!consulta || (!consulta.pendente && instante - consulta.tentativa >= intervalo)) {
   consulta = { tentativa: instante, boletim: consulta?.boletim };
   consultas.set(estacao, consulta);
   consulta.pendente = atualizar(estacao, consulta);
  }
  const boletim = consulta.pendente ? await consulta.pendente : consulta.boletim;
  return boletim ? responder(boletim, 200, 'public, max-age=0, s-maxage=600') : responder({ recebidoEm: 0, dados: [] }, 503);
 };
}

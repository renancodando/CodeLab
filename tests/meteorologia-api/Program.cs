using System.Net;
using System.Text.Json;
using CodeLab;

var relogio = new Relogio();
var respostas = new Respostas();
var clima = new Meteorologia(respostas, relogio);
var lote = await Task.WhenAll(Enumerable.Range(0, 30).Select(_ => clima.Consultar("SBSP", CancellationToken.None)));
Conferir(respostas.Chamadas == 1, "Consultas concorrentes precisam compartilhar cache.");
Conferir(lote.All(item => ReferenceEquals(item, lote[0])), "O cache deve preservar a resposta.");
var antes = JsonSerializer.Serialize(lote[0]);
await clima.Consultar("SBRJ", CancellationToken.None);
Conferir(respostas.Chamadas == 2, "Estações têm caches separados.");
relogio.Agora += TimeSpan.FromMinutes(11);
respostas.Falhar = true;
var antiga = await clima.Consultar("SBSP", CancellationToken.None);
Conferir(JsonSerializer.Serialize(antiga) == antes, "Falha não pode rejuvenecer recebidoEm.");
await clima.Consultar("SBSP", CancellationToken.None);
Conferir(respostas.Chamadas == 3, "Falha deve respeitar intervalo de nova tentativa.");
relogio.Agora += TimeSpan.FromMinutes(11);
respostas.Falhar = false;
var atual = await clima.Consultar("SBSP", CancellationToken.None);
Conferir(JsonSerializer.Serialize(atual) != antes, "Cache expirado precisa consultar novamente.");
var chamadas = respostas.Chamadas;
try { await clima.Consultar("https://localhost/", CancellationToken.None); throw new Exception("Estação inválida aceita."); }
catch (ArgumentException) { }
Conferir(respostas.Chamadas == chamadas, "Entrada inválida não pode alcançar rede.");
using var cancelamento = new CancellationTokenSource();
cancelamento.Cancel();
try { await clima.Consultar("SBSP", cancelamento.Token); throw new Exception("Cancelamento ignorado."); }
catch (OperationCanceledException) { }
Console.WriteLine("Cache observacional: concorrência, expiração, falha, idade, estações e cancelamento aprovados.");
static void Conferir(bool condicao, string mensagem) { if (!condicao) throw new Exception(mensagem); }
sealed class Relogio : TimeProvider { public DateTimeOffset Agora = DateTimeOffset.Parse("2026-10-08T12:00:00Z"); public override DateTimeOffset GetUtcNow() => Agora; }
sealed class Respostas : HttpMessageHandler, IHttpClientFactory
{
    public int Chamadas;
    public bool Falhar;
    public HttpClient CreateClient(string nome) => new(this, false);
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage pedido, CancellationToken cancelamento)
    {
        Chamadas++;
        if (pedido.RequestUri?.Host != "aviationweather.gov") throw new Exception("Destino inesperado.");
        if (Falhar) throw new HttpRequestException("offline");
        return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent("[{\"icaoId\":\"SBSP\",\"obsTime\":1791460800}]") });
    }
}

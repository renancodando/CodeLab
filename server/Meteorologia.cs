using System.Collections.Concurrent;
using System.Text.Json;
namespace CodeLab;

public sealed class Meteorologia(IHttpClientFactory clientes, TimeProvider? relogio = null)
{
    public static readonly HashSet<string> Estacoes = new(StringComparer.Ordinal) { "SBSP", "SBRJ", "SBCT", "SBPA", "SBRF", "SBEG", "LPPT" };
    private readonly ConcurrentDictionary<string, (DateTimeOffset Tentativa, object Resposta)> cache = new();
    private readonly SemaphoreSlim fila = new(1);
    public async Task<object> Consultar(string estacao, CancellationToken cancelamento)
    {
        if (!Estacoes.Contains(estacao)) throw new ArgumentException("Estação não disponível.");
        await fila.WaitAsync(cancelamento);
        try
        {
            var agora = (relogio ?? TimeProvider.System).GetUtcNow();
            if (cache.TryGetValue(estacao, out var anterior) && agora - anterior.Tentativa < TimeSpan.FromMinutes(10)) return anterior.Resposta;
            object resposta;
            try
            {
                using var cliente = clientes.CreateClient("meteorologia");
                using var documento = JsonDocument.Parse(await cliente.GetStringAsync("https://aviationweather.gov/api/data/metar?ids=" + estacao + "&format=json", cancelamento));
                if (documento.RootElement.ValueKind != JsonValueKind.Array || documento.RootElement.GetArrayLength() > 4) throw new JsonException();
                resposta = new { recebidoEm = (relogio ?? TimeProvider.System).GetUtcNow().ToUnixTimeMilliseconds(), dados = documento.RootElement.Clone() };
            }
            catch (Exception erro) when (!cancelamento.IsCancellationRequested && erro is HttpRequestException or JsonException or TaskCanceledException)
            {
                resposta = anterior.Resposta ?? new { recebidoEm = 0L, dados = Array.Empty<object>() };
            }
            cache[estacao] = (agora, resposta);
            return resposta;
        }
        finally { fila.Release(); }
    }
}

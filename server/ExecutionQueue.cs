using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;
using System.Threading.Channels;

namespace CodeLab;

public sealed record ExecutionRequest(string Language, string Code);
public sealed class ExecutionJob(string owner, ExecutionRequest request)
{
    public string Id { get; } = Guid.NewGuid().ToString("N");
    public string Owner { get; } = owner;
    public ExecutionRequest Request { get; } = request;
    public string Status { get; set; } = "queued";
    public string? Output { get; set; }
    public string? Error { get; set; }
    public DateTimeOffset Created { get; } = DateTimeOffset.UtcNow;
    public CancellationTokenSource Cancellation { get; } = new();
    public object Public() => new { Id, Status, Output, Error };
}

public sealed class ExecutionQueue(IConfiguration configuration, IHttpClientFactory clients, ILogger<ExecutionQueue> logger) : BackgroundService
{
    private readonly Channel<ExecutionJob> queue = Channel.CreateBounded<ExecutionJob>(new BoundedChannelOptions(20) { FullMode = BoundedChannelFullMode.Wait });
    private readonly ConcurrentDictionary<string, ExecutionJob> jobs = new();
    private readonly object gate = new();
    public bool Configured => Uri.TryCreate(configuration["Judge0:Url"], UriKind.Absolute, out var uri) && (uri.Scheme == "https" || (uri.Scheme == "http" && uri.IsLoopback));
    public ExecutionJob? Enqueue(string owner, ExecutionRequest request)
    {
        lock (gate)
        {
            foreach (var stale in jobs.Values.Where(j => j.Created < DateTimeOffset.UtcNow.AddMinutes(-30) && j.Status is not ("queued" or "running"))) if (jobs.TryRemove(stale.Id, out var removed)) removed.Cancellation.Dispose();
            if (jobs.Values.Count(j => j.Owner == owner && j.Status is "queued" or "running") >= 2) return null;
            var job = new ExecutionJob(owner,request);
            jobs[job.Id] = job;
            if (queue.Writer.TryWrite(job)) return job;
            jobs.TryRemove(job.Id, out _); job.Cancellation.Dispose(); return null;
        }
    }
    public ExecutionJob? Find(string id, string owner) => jobs.TryGetValue(id,out var job) && job.Owner == owner ? job : null;
    public override Task StopAsync(CancellationToken token) { queue.Writer.TryComplete(); return base.StopAsync(token); }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var job in queue.Reader.ReadAllAsync(stoppingToken))
        {
            if (job.Cancellation.IsCancellationRequested) { job.Status = "cancelled"; continue; }
            using var timeout = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken,job.Cancellation.Token);
            timeout.CancelAfter(TimeSpan.FromSeconds(25));
            job.Status = "running";
            try
            {
                var client = clients.CreateClient("judge0");
                client.BaseAddress = new Uri(configuration["Judge0:Url"]!.TrimEnd('/') + "/");
                if (!string.IsNullOrEmpty(configuration["Judge0:Token"])) client.DefaultRequestHeaders.TryAddWithoutValidation("X-Auth-Token",configuration["Judge0:Token"]);
                // Os IDs variam conforme a instalação do Judge0.
                var languageId = configuration.GetValue<int?>($"Judge0:Languages:{job.Request.Language}");
                if (languageId is null) throw new InvalidOperationException("Linguagem não configurada nesta instância.");
                var payload = new { source_code = Convert.ToBase64String(Encoding.UTF8.GetBytes(job.Request.Code)), language_id = languageId, cpu_time_limit = 2, wall_time_limit = 4, memory_limit = 65536, max_processes_and_or_threads = 20, max_file_size = 256, enable_network = false };
                var submitted = await client.PostAsJsonAsync("submissions?base64_encoded=true&wait=false",payload,timeout.Token);
                submitted.EnsureSuccessStatusCode();
                using var submission = JsonDocument.Parse(await submitted.Content.ReadAsStringAsync(timeout.Token));
                var token = submission.RootElement.GetProperty("token").GetString()!;
                while (true)
                {
                    await Task.Delay(600,timeout.Token);
                    using var response = await client.GetAsync($"submissions/{Uri.EscapeDataString(token)}?base64_encoded=true&fields=stdout,stderr,compile_output,status",HttpCompletionOption.ResponseHeadersRead,timeout.Token);
                    response.EnsureSuccessStatusCode();
                    if (response.Content.Headers.ContentLength > 1_000_000) throw new InvalidOperationException("Saída acima do limite.");
                    using var result = JsonDocument.Parse(await response.Content.ReadAsStringAsync(timeout.Token));
                    var root = result.RootElement;
                    var status = root.GetProperty("status").GetProperty("id").GetInt32();
                    if (status <= 2) continue;
                    string Decode(string key) => root.TryGetProperty(key,out var value) && value.ValueKind == JsonValueKind.String ? Encoding.UTF8.GetString(Convert.FromBase64String(value.GetString()!)) : "";
                    var output = Decode("stdout") + Decode("compile_output") + Decode("stderr");
                    job.Output = output[..Math.Min(output.Length,32000)];
                    job.Status = status == 3 ? "completed" : "failed";
                    if (status != 3) job.Error = root.GetProperty("status").GetProperty("description").GetString();
                    break;
                }
            }
            catch (OperationCanceledException) { job.Status = job.Cancellation.IsCancellationRequested ? "cancelled" : "timeout"; job.Error = "A execução foi interrompida. Confira limites e loops."; }
            catch (Exception error) { job.Status = "failed"; job.Error = "O executor está indisponível ou a linguagem não foi configurada. Tente novamente mais tarde."; logger.LogWarning("Falha Judge0: {Kind}",error.GetType().Name); }
            logger.LogInformation("Execução {Id}: {Status}; duração {Duration}ms",job.Id,job.Status,(DateTimeOffset.UtcNow-job.Created).TotalMilliseconds);
        }
    }
}

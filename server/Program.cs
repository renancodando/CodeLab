using System.Text.Json;
using System.Threading.RateLimiting;
using CodeLab;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = 2_000_000);

builder.Services.AddSingleton<ExecutionQueue>();
builder.Services.AddHostedService(provider => provider.GetRequiredService<ExecutionQueue>());
builder.Services.AddHttpClient("judge0",client => client.Timeout = TimeSpan.FromSeconds(20));
builder.Services.AddSingleton<Meteorologia>();
builder.Services.AddHttpClient("meteorologia",cliente => { cliente.Timeout=TimeSpan.FromSeconds(6);cliente.MaxResponseContentBufferSize=100_000;cliente.DefaultRequestHeaders.UserAgent.ParseAdd("CodeLab/0.1"); });
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;
    options.AddPolicy("meteorologia",context => RateLimitPartition.GetFixedWindowLimiter(context.Connection.RemoteIpAddress?.ToString() ?? "unknown",_ => new FixedWindowRateLimiterOptions { PermitLimit = 12, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
    options.AddPolicy("execution",context => RateLimitPartition.GetFixedWindowLimiter(context.Connection.RemoteIpAddress?.ToString() ?? "unknown",_ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
});
var app = builder.Build();
app.UseExceptionHandler(handler => handler.Run(async context => { context.Response.StatusCode=500; await context.Response.WriteAsJsonAsync(new { error="Não foi possível concluir a operação. Tente novamente." }); }));
app.Use(async (context,next) =>
{
    context.Response.Headers.XContentTypeOptions = "nosniff";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["Permissions-Policy"] = "geolocation=(self), camera=(), microphone=()";
    context.Response.Headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://api.open-meteo.com; frame-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
    if (context.Request.Path.StartsWithSegments("/api") && !HttpMethods.IsGet(context.Request.Method))
    {
        var site = context.Request.Headers["Sec-Fetch-Site"].ToString();
        var origin = context.Request.Headers.Origin.ToString();
        var allowedOrigin = app.Configuration["Frontend:Origin"] ?? $"{context.Request.Scheme}://{context.Request.Host}";
        if (site == "cross-site" || (!string.IsNullOrEmpty(origin) && !string.Equals(origin,allowedOrigin,StringComparison.OrdinalIgnoreCase) && !string.Equals(origin,$"{context.Request.Scheme}://{context.Request.Host}",StringComparison.OrdinalIgnoreCase))) { context.Response.StatusCode=403; await context.Response.WriteAsJsonAsync(new {error="Origem não permitida."}); return; }
    }
    await next();
});
app.UseRateLimiter();
app.MapGet("/api/health",() => Results.Ok(new {status="ok",version="0.1.0"}));
app.MapGet("/api/meteorologia/observacao",async (string estacao,Meteorologia meteorologia,HttpContext contexto) => {
    if(!Meteorologia.Estacoes.Contains(estacao))return Results.BadRequest(new {erro="Estação não disponível."});
    contexto.Response.Headers.CacheControl="no-store";
    return Results.Ok(await meteorologia.Consultar(estacao,contexto.RequestAborted));
}).RequireRateLimiting("meteorologia");
app.MapGet("/api/capabilities",(ExecutionQueue queue) => Results.Ok(new {accounts=false,progress=false,judge0=queue.Configured,storage="browser-only"}));
var curriculumPath=Path.Combine(app.Environment.ContentRootPath,"Content","curriculum.json");
app.MapGet("/api/trilhas",() => Results.Json(ReadContent("trails")));
app.MapGet("/api/trilhas/{slug}",(string slug) => { var course=ReadContent("trails").EnumerateArray().FirstOrDefault(c=>c.GetProperty("id").GetString()==slug);return course.ValueKind==JsonValueKind.Undefined?Results.NotFound():Results.Json(course); });
app.MapGet("/api/missoes",() => Results.Json(ReadContent("missions")));
app.MapGet("/api/licoes",() => Results.Json(ReadContent("lessons")));
app.MapGet("/api/licoes/{slug}",(string slug) => { var lesson=ReadContent("lessons").EnumerateArray().FirstOrDefault(m=>m.GetProperty("id").GetString()==slug); return lesson.ValueKind==JsonValueKind.Undefined?Results.NotFound():Results.Json(lesson); });
app.MapGet("/api/referencias",() => Results.Json(ReadContent("articles")));
app.MapPost("/api/executions",(ExecutionRequest input,ExecutionQueue queue,HttpContext context) =>
{
    if(!queue.Configured)return Results.Json(new {error="O Judge0 ainda não foi configurado. HTML e JavaScript continuam disponíveis no navegador."},statusCode:503);
    if(input.Language is not ("python" or "csharp" or "cpp") || string.IsNullOrWhiteSpace(input.Code) || input.Code.Length>30000)return Results.BadRequest(new {error="Linguagem ou código inválido. Limite: 30.000 caracteres."});
    var job=queue.Enqueue(context.Connection.RemoteIpAddress?.ToString() ?? "unknown",input);
    return job is null ? Results.Json(new {error="Fila cheia ou limite de duas execuções simultâneas atingido."},statusCode:429) : Results.Accepted($"/api/executions/{job.Id}",job.Public());
}).RequireRateLimiting("execution");
app.MapGet("/api/executions/{id}",(string id,ExecutionQueue queue,HttpContext context) => {var job=queue.Find(id);return job is null?Results.NotFound():Results.Ok(job.Public());});
app.MapDelete("/api/executions/{id}",(string id,ExecutionQueue queue) => queue.Cancel(id) ? Results.Accepted() : Results.NotFound());
var frontend=Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath,"..","dist"));
if(Directory.Exists(frontend))
{
    var files=new Microsoft.Extensions.FileProviders.PhysicalFileProvider(frontend);
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider=files });
    app.UseStaticFiles(new StaticFileOptions { FileProvider=files });
}
app.Run();
JsonElement ReadContent(string property) { using var doc=JsonDocument.Parse(File.ReadAllText(curriculumPath));return doc.RootElement.GetProperty(property).Clone(); }

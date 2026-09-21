using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.RateLimiting;
using CodeLab;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = 2_000_000);
builder.Services.AddSingleton<Store>();
builder.Services.AddSingleton<ExecutionQueue>();
builder.Services.AddHostedService(provider => provider.GetRequiredService<ExecutionQueue>());
builder.Services.AddHttpClient("judge0",client => client.Timeout = TimeSpan.FromSeconds(20));
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
{
    options.Cookie.Name = "codelab.session";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.Events.OnRedirectToLogin = context => { context.Response.StatusCode = 401; return Task.CompletedTask; };
    options.Events.OnRedirectToAccessDenied = context => { context.Response.StatusCode = 403; return Task.CompletedTask; };
});
builder.Services.AddAuthorization();
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;
    options.AddPolicy("auth",context => RateLimitPartition.GetFixedWindowLimiter(context.Connection.RemoteIpAddress?.ToString() ?? "unknown",_ => new FixedWindowRateLimiterOptions { PermitLimit = 12, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
    options.AddPolicy("execution",context => RateLimitPartition.GetFixedWindowLimiter(context.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? context.Connection.RemoteIpAddress?.ToString() ?? "unknown",_ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
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
        if (site == "cross-site" || (!string.IsNullOrEmpty(origin) && !string.Equals(origin,allowedOrigin,StringComparison.OrdinalIgnoreCase))) { context.Response.StatusCode=403; await context.Response.WriteAsJsonAsync(new {error="Origem não permitida."}); return; }
    }
    await next();
});
app.UseAuthentication(); app.UseAuthorization(); app.UseRateLimiter();
app.MapGet("/api/health",() => Results.Ok(new {status="ok",version="0.1.0"}));
app.MapGet("/api/capabilities",(ExecutionQueue queue) => Results.Ok(new {accounts=true,progress=true,judge0=queue.Configured,storage="sqlite"}));
app.MapGet("/api/auth/me",(HttpContext context) => Results.Ok(new {name=context.User.Identity!.Name})).RequireAuthorization();
app.MapPost("/api/auth/register",async (Credentials input,Store store,HttpContext context) =>
{
    var email = input.Email?.Trim().ToLowerInvariant() ?? "";
    var name = input.Name?.Trim() ?? "";
    if (name.Length is < 1 or > 40 || email.Length is < 3 or > 254 || !System.Net.Mail.MailAddress.TryCreate(email,out _) || input.Password?.Length is < 12 or > 128 || input.Password is null) return Results.BadRequest(new {error="Informe nome, e-mail válido e senha de 12 a 128 caracteres."});
    var salt=RandomNumberGenerator.GetBytes(32);
    var hash=Rfc2898DeriveBytes.Pbkdf2(input.Password,salt,210000,HashAlgorithmName.SHA512,64);
    var account=new Account(Guid.NewGuid().ToString("N"),name,email,Convert.ToBase64String(hash),Convert.ToBase64String(salt));
    if(!store.Create(account)) return Results.Conflict(new {error="Não foi possível cadastrar este e-mail. Se já possui conta, use Entrar."});
    await SignIn(context,account);
    return Results.Ok(new {account.Name});
}).RequireRateLimiting("auth");
app.MapPost("/api/auth/login",async (Credentials input,Store store,HttpContext context) =>
{
    if (input.Password is null || input.Password.Length > 128 || input.Email is null || input.Email.Length > 254) return Results.BadRequest(new {error="Credenciais inválidas."});
    var account=store.Find(input.Email.Trim().ToLowerInvariant());
    var salt=account is null ? new byte[32] : Convert.FromBase64String(account.Salt);
    var expected=account is null ? new byte[64] : Convert.FromBase64String(account.Hash);
    var hash=Rfc2898DeriveBytes.Pbkdf2(input.Password,salt,210000,HashAlgorithmName.SHA512,64);
    if (!CryptographicOperations.FixedTimeEquals(hash,expected) || account is null) return Results.Json(new {error="E-mail ou senha não conferem."},statusCode:401);
    await SignIn(context,account); return Results.Ok(new {account.Name});
}).RequireRateLimiting("auth");
app.MapPost("/api/auth/logout",async (HttpContext context) => { await context.SignOutAsync(); return Results.NoContent(); });
app.MapGet("/api/progress",(Store store,HttpContext context) => { var data=store.ReadProgress(context.User.FindFirstValue(ClaimTypes.NameIdentifier)!); return data is null ? Results.NotFound(new {error="Esta conta ainda não possui uma jornada salva."}) : Results.Content(data,"application/json"); }).RequireAuthorization();
app.MapPut("/api/progress",(JsonElement data,Store store,HttpContext context) =>
{
    if(data.ValueKind!=JsonValueKind.Object || !data.TryGetProperty("version",out var version) || !version.TryGetInt32(out var value) || value!=1 || !data.TryGetProperty("completed",out var completed) || completed.ValueKind!=JsonValueKind.Array || completed.GetArrayLength()>1000) return Results.BadRequest(new {error="Formato de jornada inválido."});
    var json=data.GetRawText();if(json.Length>1_000_000)return Results.BadRequest(new {error="Jornada acima do limite de tamanho."});
    store.SaveProgress(context.User.FindFirstValue(ClaimTypes.NameIdentifier)!,json);return Results.NoContent();
}).RequireAuthorization();
var curriculumPath=Path.Combine(app.Environment.ContentRootPath,"Content","curriculum.json");
app.MapGet("/api/trilhas",() => Results.Json(ReadContent("trails")));
app.MapGet("/api/licoes",() => Results.Json(ReadContent("missions")));
app.MapGet("/api/licoes/{slug}",(string slug) => { var lesson=ReadContent("missions").EnumerateArray().FirstOrDefault(m=>m.GetProperty("id").GetString()==slug); return lesson.ValueKind==JsonValueKind.Undefined?Results.NotFound():Results.Json(lesson); });
app.MapGet("/api/referencias",() => Results.Json(ReadContent("articles")));
app.MapPost("/api/executions",(ExecutionRequest input,ExecutionQueue queue,HttpContext context) =>
{
    if(!queue.Configured)return Results.Json(new {error="O Judge0 ainda não foi configurado. HTML e JavaScript continuam disponíveis no navegador."},statusCode:503);
    if(input.Language is not ("python" or "csharp" or "cpp") || string.IsNullOrWhiteSpace(input.Code) || input.Code.Length>30000)return Results.BadRequest(new {error="Linguagem ou código inválido. Limite: 30.000 caracteres."});
    var job=queue.Enqueue(context.User.FindFirstValue(ClaimTypes.NameIdentifier)!,input);
    return job is null ? Results.Json(new {error="Fila cheia ou limite de duas execuções simultâneas atingido."},statusCode:429) : Results.Accepted($"/api/executions/{job.Id}",job.Public());
}).RequireAuthorization().RequireRateLimiting("execution");
app.MapGet("/api/executions/{id}",(string id,ExecutionQueue queue,HttpContext context) => {var job=queue.Find(id,context.User.FindFirstValue(ClaimTypes.NameIdentifier)!);return job is null?Results.NotFound():Results.Ok(job.Public());}).RequireAuthorization();
app.MapDelete("/api/executions/{id}",(string id,ExecutionQueue queue,HttpContext context) => {var job=queue.Find(id,context.User.FindFirstValue(ClaimTypes.NameIdentifier)!);if(job is null)return Results.NotFound();job.Cancellation.Cancel();return Results.Accepted();}).RequireAuthorization();
var frontend=Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath,"..","dist"));
if(Directory.Exists(frontend))
{
    var files=new Microsoft.Extensions.FileProviders.PhysicalFileProvider(frontend);
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider=files });
    app.UseStaticFiles(new StaticFileOptions { FileProvider=files });
}
app.Run();
JsonElement ReadContent(string property) { using var doc=JsonDocument.Parse(File.ReadAllText(curriculumPath));return doc.RootElement.GetProperty(property).Clone(); }
static Task SignIn(HttpContext context,Account account) => context.SignInAsync(new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier,account.Id),new Claim(ClaimTypes.Name,account.Name)],CookieAuthenticationDefaults.AuthenticationScheme)),new AuthenticationProperties { IsPersistent=true });
public sealed record Credentials(string? Name,string? Email,string? Password);

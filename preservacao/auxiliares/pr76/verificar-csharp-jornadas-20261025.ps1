param([Parameter(Mandatory=$true)][ValidateSet('especificos','referencias','compilacao','navegador')][string]$Etapa)
$ErrorActionPreference='Stop'
if ((Get-PSDrive -Name C).Free -lt 300MB) { throw 'Espaço abaixo da margem para validar rotas ASP.NET.' }
Add-Type -TypeDefinition @'
using System.Runtime.InteropServices;
public static class AtividadeAspnet {
    [DllImport("kernel32.dll", EntryPoint="SetThreadExecutionState", SetLastError=true)]
    public static extern uint Definir(uint estado);
}
'@
$anterior=[AtividadeAspnet]::Definir([uint32]2147483649)
if ($anterior -eq 0) { throw 'Não foi possível solicitar atividade temporária.' }
$codigoSaida=1
try {
    switch ($Etapa) {
        'especificos' { npx vitest run --configLoader runner tests/unit/aspnet-rotas.test.ts tests/unit/csharp-excecoes.test.ts > '../../outputs/aspnet-rotas-especificos-final-20261025.log' 2>&1 }
        'referencias' { node '../../outputs/verificar-aspnet-rotas-local-20261025.mjs' > '../../outputs/aspnet-rotas-referencias-http-corrigido-20261025.log' 2>&1 }
        'compilacao' { npm run build > '../../outputs/csharp-jornadas-build-20261025.log' 2>&1 }
        'navegador' { node '../../outputs/verificar-sql-local.mjs' './playwright-csharp-jornadas-20261025.config.mjs' > '../../outputs/csharp-jornadas-navegador-20261025.log' 2>&1 }
    }
    $codigoSaida=$LASTEXITCODE
}
finally {
    [void][AtividadeAspnet]::Definir([uint32]($anterior -bor 2147483648))
    Write-Output 'Solicitação temporária de atividade liberada.'
}
exit $codigoSaida


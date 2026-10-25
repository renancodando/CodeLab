param([Parameter(Mandatory=$true)][ValidateSet('compilacao','navegador')][string]$Etapa)
$ErrorActionPreference='Stop'
if ((Get-PSDrive -Name C).Free -lt 300MB) { throw 'Espaço abaixo da margem para validar acessibilidade ASP.NET.' }
Add-Type -TypeDefinition @"
using System.Runtime.InteropServices;
public static class AtividadeAcessibilidade {
    [DllImport("kernel32.dll", EntryPoint="SetThreadExecutionState", SetLastError=true)]
    public static extern uint Definir(uint estado);
}
"@
$anterior=[AtividadeAcessibilidade]::Definir([uint32]2147483649)
if ($anterior -eq 0) { throw 'Não foi possível solicitar atividade temporária.' }
$codigoSaida=1
try {
    switch ($Etapa) {
        'compilacao' { npm run build > '../../outputs/aspnet-acessibilidade-build-20261025.log' 2>&1 }
        'navegador' { node '../../outputs/verificar-sql-local.mjs' './playwright-aspnet-acessibilidade-20261025.config.mjs' > '../../outputs/aspnet-acessibilidade-navegador-20261025.log' 2>&1 }
    }
    $codigoSaida=$LASTEXITCODE
}
finally {
    [void][AtividadeAcessibilidade]::Definir([uint32]($anterior -bor 2147483648))
    Write-Output 'Solicitação temporária de atividade liberada.'
}
exit $codigoSaida
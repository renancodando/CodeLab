param([Parameter(Mandatory=$true)][ValidateSet('especificos','referencias','compilacao','navegador')][string]$Etapa)
$ErrorActionPreference='Stop'
$espacoLivre=(Get-PSDrive -Name C -ErrorAction Stop).Free
if ($null -eq $espacoLivre) { throw 'Não foi possível medir o espaço livre no C:.' }
if ($espacoLivre -lt 300MB) { throw "Espaço livre no C: $espacoLivre bytes, abaixo da margem de 314572800 bytes." }
Write-Output "Espaço livre no C: $espacoLivre bytes."
Add-Type -TypeDefinition @"
using System.Runtime.InteropServices;
public static class AtividadeEscopos {
    [DllImport("kernel32.dll", EntryPoint="SetThreadExecutionState", SetLastError=true)]
    public static extern uint Definir(uint estado);
}
"@
$anterior=[AtividadeEscopos]::Definir([uint32]2147483649)
if ($anterior -eq 0) { throw 'Não foi possível solicitar atividade temporária.' }
$codigoSaida=1
try {
    switch ($Etapa) {
        'especificos' { npx vitest run --configLoader runner tests/unit/aspnet-escopos.test.ts tests/unit/aspnet-rotas.test.ts tests/unit/csharp-excecoes.test.ts > '../../outputs/aspnet-escopos-especificos-final-20261025.log' 2>&1 }
        'referencias' { node '../../outputs/verificar-aspnet-escopos-local-20261025.mjs' > '../../outputs/aspnet-escopos-referencias-http-instrumentado-20261026.log' 2>&1 }
        'compilacao' { npm run build > '../../outputs/aspnet-escopos-build-20261026.log' 2>&1 }
        'navegador' { node '../../outputs/verificar-sql-local.mjs' './playwright-aspnet-escopos-20261025.config.mjs' > '../../outputs/aspnet-escopos-navegador-20261026.log' 2>&1 }
    }
    $codigoSaida=$LASTEXITCODE
}
finally {
    [void][AtividadeEscopos]::Definir([uint32]($anterior -bor 2147483648))
    Write-Output 'Solicitação temporária de atividade liberada.'
}
exit $codigoSaida
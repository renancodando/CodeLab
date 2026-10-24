param([Parameter(Mandatory=$true)][ValidateSet('especificos','referencias','compilacao','navegador')][string]$Etapa)
$ErrorActionPreference='Stop'
if ((Get-PSDrive -Name C).Free -lt 300MB) { throw 'Espaço abaixo da margem para validar coleções.' }
Add-Type -TypeDefinition @'
using System.Runtime.InteropServices;
public static class AtividadeColecoes {
    [DllImport("kernel32.dll", EntryPoint="SetThreadExecutionState", SetLastError=true)]
    public static extern uint Definir(uint estado);
}
'@
$anterior=[AtividadeColecoes]::Definir([uint32]2147483649)
if ($anterior -eq 0) { throw 'Não foi possível solicitar atividade temporária.' }
$codigoSaida=1
try {
    switch ($Etapa) {
        'especificos' { npx vitest run --configLoader runner tests/unit/csharp-colecoes.test.ts tests/unit/csharp-objetos.test.ts > '../../outputs/csharp-colecoes-especificos-ativo-20261024.log' 2>&1 }
        'referencias' { node '../../outputs/verificar-csharp-colecoes-local-20261024.mjs' > '../../outputs/csharp-colecoes-referencias-final-20261024.log' 2>&1 }
        'compilacao' { npm run build > '../../outputs/csharp-colecoes-build-final-20261024.log' 2>&1 }
        'navegador' { node '../../outputs/verificar-sql-local.mjs' './playwright-csharp-colecoes-final-20261024.config.mjs' > '../../outputs/csharp-colecoes-navegador-final-20261024.log' 2>&1 }
    }
    $codigoSaida=$LASTEXITCODE
}
finally {
    [void][AtividadeColecoes]::Definir([uint32]($anterior -bor 2147483648))
    Write-Output 'Solicitação temporária de atividade liberada.'
}
exit $codigoSaida

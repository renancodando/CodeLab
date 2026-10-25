param([Parameter(Mandatory=$true)][ValidateSet('especificos','referencias','compilacao','navegador')][string]$Etapa)
$ErrorActionPreference='Stop'
if ((Get-PSDrive -Name C).Free -lt 300MB) { throw 'Espaço abaixo da margem para validar exceções.' }
Add-Type -TypeDefinition @'
using System.Runtime.InteropServices;
public static class AtividadeExcecoes {
    [DllImport("kernel32.dll", EntryPoint="SetThreadExecutionState", SetLastError=true)]
    public static extern uint Definir(uint estado);
}
'@
$anterior=[AtividadeExcecoes]::Definir([uint32]2147483649)
if ($anterior -eq 0) { throw 'Não foi possível solicitar atividade temporária.' }
$codigoSaida=1
try {
    switch ($Etapa) {
        'especificos' { npx vitest run --configLoader runner tests/unit/csharp-excecoes.test.ts tests/unit/csharp-colecoes.test.ts > '../../outputs/csharp-excecoes-especificos-ativo-20261025.log' 2>&1 }
        'referencias' { node '../../outputs/verificar-csharp-excecoes-local-20261025.mjs' > '../../outputs/csharp-excecoes-referencias-final-20261025.log' 2>&1 }
        'compilacao' { npm run build > '../../outputs/csharp-excecoes-build-final-20261025.log' 2>&1 }
        'navegador' { node '../../outputs/verificar-sql-local.mjs' './playwright-csharp-excecoes-corrigido-20261025.config.mjs' > '../../outputs/csharp-excecoes-navegador-corrigido-20261025.log' 2>&1 }
    }
    $codigoSaida=$LASTEXITCODE
}
finally {
    [void][AtividadeExcecoes]::Definir([uint32]($anterior -bor 2147483648))
    Write-Output 'Solicitação temporária de atividade liberada.'
}
exit $codigoSaida

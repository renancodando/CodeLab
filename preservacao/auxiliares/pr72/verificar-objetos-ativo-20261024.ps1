$ErrorActionPreference='Stop'
if ((Get-PSDrive -Name C).Free -lt 300MB) { throw 'Espaço abaixo da margem para os testes locais.' }
Add-Type -TypeDefinition @'
using System.Runtime.InteropServices;
public static class AtividadeVerificacao {
    [DllImport("kernel32.dll", EntryPoint="SetThreadExecutionState", SetLastError=true)]
    public static extern uint Definir(uint estado);
}
'@
$anterior=[AtividadeVerificacao]::Definir([uint32]2147483649)
if ($anterior -eq 0) { throw 'Não foi possível solicitar atividade temporária durante os testes.' }
$codigoSaida=1
try {
    node '../../outputs/verificar-sql-local.mjs' './playwright-csharp-objetos-local-20261024-ativo.config.mjs' > '../../outputs/csharp-objetos-navegador-local-ativo-20261024.log' 2>&1
    $codigoSaida=$LASTEXITCODE
}
finally {
    [void][AtividadeVerificacao]::Definir([uint32]($anterior -bor 2147483648))
    Write-Output 'Solicitação temporária de atividade liberada.'
}
exit $codigoSaida

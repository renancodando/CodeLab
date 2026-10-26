param([Parameter(Mandatory=$true)][ValidateSet('compilacao','navegador')][string]$Etapa)
$ErrorActionPreference='Stop'
$espacoLivre=(Get-PSDrive -Name C -ErrorAction Stop).Free
if ($null -eq $espacoLivre) { throw 'Não foi possível medir o espaço livre no C:.' }
if ($espacoLivre -lt 300MB) { throw "Espaço livre no C: $espacoLivre bytes, abaixo da margem de 314572800 bytes." }
Write-Output "Espaço livre no C: $espacoLivre bytes."
Add-Type -TypeDefinition @"
using System.Runtime.InteropServices;
public static class AtividadeBackupNovoProcesso {
    [DllImport("kernel32.dll", EntryPoint="SetThreadExecutionState", SetLastError=true)]
    public static extern uint Definir(uint estado);
}
"@
$anterior=[AtividadeBackupNovoProcesso]::Definir([uint32]2147483649)
if ($anterior -eq 0) { throw 'Não foi possível solicitar atividade temporária.' }
$codigoSaida=1
try {
 if ($Etapa -eq 'compilacao') { npm run build > '../../outputs/backup-csharp-build-20261026.log' 2>&1 }
 else { node '../../outputs/verificar-sql-local.mjs' './playwright-backup-csharp-novo-processo-20261026.config.mjs' > '../../outputs/backup-csharp-navegador-novo-processo-20261026.log' 2>&1 }
 $codigoSaida=$LASTEXITCODE
} finally {
 [void][AtividadeBackupNovoProcesso]::Definir([uint32]($anterior -bor 2147483648))
 Write-Output 'Solicitação temporária de atividade liberada.'
}
exit $codigoSaida
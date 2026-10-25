# Retomada das jornadas C# — 25/10/2026

Fonte enviada: branch testes/csharp-excecoes-jornadas, commit 8a4518ffe6c70bbbe3168ba4ddc52a1da208c885, PR https://github.com/renancodando/CodeLab/pull/76. Alterações de código/documentação locais foram commitadas e o SHA remoto foi conferido. Sem alterações pendentes no checkout no momento do push.

A PR 75 foi integrada em c5ed32b74e977fa48b8f86f8c2c8b853492e2352; CI de entrada 40211323079 e pós-merge 40213038781 completos e aprovados: 1.500 testes, 194 exemplos externos, 15 cenários ASP.NET e 307 fluxos. Deployment READY/SHA/alias confirmados. A conferência pública 40213353142 falhou no Edge (9/10), na jornada antiga de exceções; Chromium 10/10 e os cinco novos fluxos ASP.NET passaram em ambos. A causa da lentidão não foi comprovada. Falha/trace preservados; não declarar conferência pública integral aprovada.

PR 76 separa previsão/leitura e diagnóstico, conserva as 35 asserções por conferência da sintaxe, timeout 60 s e retries zero. Build concluído (157 páginas e offline 38+6); onze fluxos locais no Edge passaram em 4,9 min, incluindo axe, 220–4000 px, assistência, offline e backup. Nenhum produto/corretor/métrica alterado.

CI da PR 76: 40215361917. Revisão automática disparada ao marcar draft pronto, vinculada ao head 8a4518f. Conferência pública pré-merge 40215475529 usa testes desse head sobre o produto c5ed32b, ainda no domínio público. Branch verificacao/publicacao-pr76 e preservacao/retomada-cloud-20261015 NÃO devem ser integradas.

Continuar: conferir CI integral e revisão do verdadeiro head; resolver qualquer falha sem retirar asserts ou ampliar limites. Conferir main/árvore/pais, integrar somente o head aprovado, aguardar deployment READY/SHA/alias, fixar os testes públicos no SHA integrado e rodar onze fluxos por navegador (Chromium e Edge). Confirmar CI pós-merge e alias após os fluxos. Registrar resultado final aqui. Só então encerrar a correção e seguir para aspnet-di. Mapa atual: 137 aulas, 213 atividades, 99 com pausas e 38 sem; presença de pausa não significa profundidade concluída.

Resultados e auxiliares necessários em preservacao/atualizacoes/pr75, preservacao/atualizacoes/pr76 e preservacao/auxiliares/pr76. JSON privado do provedor, URLs assinadas e trace bruto não foram enviados ao repositório.

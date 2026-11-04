# L03 — PR #94 em validação

Branch: conteudo/projetos-api-entrega-20261104
Head enviado e conferido: 0885ac029735b5b460370724d06c0d5f479b12e6
Commits: 880d045600bab6733c0a1c3ef7dad1fb46a8fbd6 e 0885ac029735b5b460370724d06c0d5f479b12e6.
Base/main: af7e318eea3636b9de799009f9f938b109967e91
PR: https://github.com/renancodando/CodeLab/pull/94

L01 (#92) e L02 (#93) estão publicados e conferidos. L03 acrescenta cinco atividades em projeto-api e projeto-entrega. Não reiniciar doze lotes. Após L03, aproximadamente nove restantes, L04 em seguida conforme docs/etapas-restantes.md. Não abrir outro lote antes de concluir este.

Local: 41 testes específicos/seletor aprovados, um cenário repetido após revisão pedagógica e aprovado; 26 verificações .NET 10/SQLite aprovadas, catálogo/métricas e tipos aprovados. Duas novas jornadas preparadas, não executadas localmente: CI é responsável por navegador/build/contratos gerais para evitar repetição. C# do aluno é conceitual; referências nativas não equivalem a API HTTP real. JavaScript de resumo roda no isolamento existente e usa registros fictícios, não comprova CI ou deployment.

NU1903 da biblioteca transitiva antiga foi corrigido na fixture temporária: Microsoft.Data.Sqlite 10.0.10 + SQLitePCLRaw.lib.e_sqlite3 3.53.3, versão carregada conferida, auditoria e avisos como erro mantidos. Nenhuma dependência nova na aplicação.

Checkout: 137 aulas, 278 atividades, 122 com pausas, 15 sem. Publicação confirmada ainda em 273/120/17 na PR #93; não declarar os novos números publicados antes dos gates próprios. CI/revisão do head acima pendentes. Verificar árvore e base antes do merge, pós-merge dois smokes, deployment READY/SHA/projeto/alias e três contratos públicos distintos. Sem regressões conhecidas novas no checkout; aguardar evidência do CI/revisão.

Todos os arquivos relevantes estão nos dois commits enviados. Documentos de continuidade/escopo/produção e métricas sincronizados. Plano proporcional em docs/estrategia-validacao.md. Não repetir suítes integrais nem runtimes alheios por rotina. Preserve identidade, mundo/clima, editor, sandbox, limites, lazy loading, local-first sem contas, offline e backups.

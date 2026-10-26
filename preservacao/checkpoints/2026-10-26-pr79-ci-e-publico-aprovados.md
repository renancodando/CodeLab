# CodeLab: validação da correção de backup aprovada, revisão pendente

Estado conferido em 26/10/2026:
- Main e produto: `5a66c2d00f2cb4febe488ff130fd142a04e4bcab` (PR #78).
- CI de entrada 40320647497 e pós-merge 40323073312 completos: 1528 testes/85 arquivos, 194 exemplos, 16 cenários de escopos e 314 fluxos. Árvore/pais e revisão do head b1a4813 conferidos.
- A primeira rodada pública 40323519196 passou 17/17 no Chromium e 16/17 no Edge, com timeout no backup C#. Falha/trace preservados; não chamar essa rodada de aprovada.
- Correção em https://github.com/renancodando/CodeLab/pull/79, branch `testes/backup-csharp-jornadas`, head `7fcf9be684f7b8728581522ad7c0b04b23e7c4e1`, árvore `7073fd3cf063f3c31608845ce4121edadb17cb76`. Só teste e continuidade mudam; produto/métricas não mudam.
- Comparação AST: 34 asserções anteriores preservadas, mais arquivo exportado não vazio. Exportação/restauração são testes seriais ligados ao arquivo real; outro contexto confirma jornada vazia antes de restaurar. Limite 60s e retries zero mantidos.
- Build local passou, 157 páginas, offline38+6, versão f16693eaed96298b9bc8.
- Rodada local inicial: 17/18; worker nativo encerrou com código3221226505 antes do teste de axe (0ms). Causa não comprovada, log preservado. Em processo novo, mesma fonte e limites: 18/18 em4.7min, incluindo axe,220–4000px, offline, assistência, backup.
- CI 40326734056 concluído SUCCESS nos10jobs: 1528/85,194exemplos,16escopos,315fluxos,auditoriazero.
- Público ANTES do merge 40327303081 SUCCESS: Chromium18/18 em1.9min, Edge18/18 em7.9min. TESTES7fcf9be, PRODUTO5a66c2d. Workflow45971f972e74c7f9f11bdbd34b919ff6de1d981b na branch verificacao/publicacao-pr79. READY/SHA/projeto/alias conferidos antes e depois.
- PR79 marcada pronta. A revisão do head7fcf9be estava RUNNING em13:30UTC; findings ainda null, threads vazias. NÃO considerar isso aprovação e NÃO reutilizar revisão de b1a4813.
- Próximo: aguardar revisão completed do head exato; resolver apontamentos se houver. Conferir main/head/tree/statuses de novo. Merge esperado deve usar7fcf9be. Confirmar árvore7073 e pais5a66+7fcf. Conferir implantação READY/SHA/projeto/alias novo. Atualizar o workflow de verificação fixando o SHA integrado e rodar18fluxos por navegador após merge; conferir também CI pós-merge. Só então encerrar esta entrega.
- Estado/código/auxiliares e evidências foram enviados ao GitHub; verificar git status antes de nova alteração. Último checkpoint local tem apenas fontes de teste/documentação já enviadas. Auxiliares em preservacao/auxiliares/pr79/; provas em preservacao/atualizacoes/pr79/.
- Branches de preservação e verificação NÃO devem ser integradas. Não publicar payloads privados de hospedagem/URLs assinadas.

Catálogo permanece137aulas,216atividades,100aulas com pausas e37sem. Edição curricular não concluída. Depois de finalizar a entrega, seguir docs/aulas-sem-pratica.md, sem criar novas aulas. Primeiro grupo restante inclui aspnet-dto/pipeline/protecao e fundamentos SQL. Não reabrir expansão meteorológica.

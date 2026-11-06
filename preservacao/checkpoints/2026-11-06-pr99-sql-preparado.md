# L08 preparado — PR #99

Sete de aproximadamente doze lotes publicados (#92–#98); L08–L12 (~5) restantes. Não reiniciar a contagem.

Main verificado 3e0f0e01e755658833aaba8a62cf7dd29d856ef7, pós-merge 42246454485 aprovado. PR https://github.com/renancodando/CodeLab/pull/99, branch conteudo/sql-avancado-20261106, fonte remota 8b4ed3f5482a780f770f3d83fd034e2e03a4818c. Quatro commits coerentes: janelas/NULL, índices/intervalos, recursão/JSONB, referências PostgreSQL/navegador. Push conferido por leitura da branch. Falha inicial de DNS resolvida repetindo apenas o push. A limitação anterior da revisão automática cessou; nenhuma revisão foi burlada.

Nove pausas nas três aulas SQL avançadas. Local: 13 contratos de janelas/preparação, 11 de índices, 12 de esquema e um caso do seletor aprovados em recortes específicos. Tipos/catálogo e lista dos três fluxos aprovados. Sem suíte completa ou navegador local repetido. PostgreSQL 18 ausente do PATH local: 24 referências preparadas, ainda dependem do CI; as bases SQL dos gabaritos têm família própria. Três consultas realmente executadas em SQLite, 19 bases. JSONB/EXPLAIN/escolha de índice são conceituais para o aluno, sem falsa execução PostgreSQL.

Catálogo preparado: 137 aulas, 322 atividades, 137 aulas com pausa e zero sem pausa. Presença não comprova profundidade ou conclusão. Revisão do head, CI, merge e deployment desta PR ainda pendentes; não declarar publicado. Produção permanece na PR #98 até evidência nova.

Retomada: conferir CI/revisão do SHA verdadeiro e threads; corrigir só cenários afetados. Merge apenas com árvore verificada; pós-merge build/dois smokes; deployment READY/SHA/projeto/alias antes/depois dos três contratos públicos distintos. Usar diretório novo de artefatos para preservar falhas anteriores. Depois L09 percursos algoritmos/estruturas/testes; L10 redes/Git/arquitetura; L11 projetos/corretores/resíduos; L12 fechamento amplo e instabilidades públicas históricas.

L11: inspecionar tokens na normalização TypeScript e ordem externa das consultas com janela sem confundir ordenação incidental com garantia SQL. Limites do Worker preservados; não rodar UNION ALL cíclico no SQL.js síncrono Node. Nenhuma expansão meteorológica, visual ou de aulas.

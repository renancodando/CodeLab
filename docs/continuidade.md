# Continuidade do CODELAB

## Estado em 6 de outubro de 2026

- PR #1 integrada: valores interativos, progresso v2, verificação QuickJS e revisões locais.
- PR #2 integrada: 108 aulas em 20 trilhas. Código validado em `9791412e301fa5075b46ad40dfe412cf975007f6`; 125 testes de unidade, 27 E2E e 48 exemplos externos aprovados.
- Entrega em elaboração na branch `conteudo/fundamentos-pratica-independente`: 20 aulas novas com 17 capítulos e dois problemas independentes por aula; catálogo proposto de 128 aulas. Leia a PR dessa branch e os resultados mais recentes antes de iniciar outra entrega.
- A fonte de verdade são as definições em src/content/deep. Índice e matriz são derivados por content:generate. A proposta tem 574 entradas, sendo 106 com prática vinculada a atividades específicas e 468 introduzidas.

## Critério de integração

A entrega só pode ser integrada após CI verde no head atual: testes de unidade, compilação strict dos trechos TypeScript, execução de 112 exemplos externos, build frontend e API, 36 E2E e geração de 134 páginas. Conferir revisão da PR, achados e correspondência da árvore integrada à testada. Esses números descrevem os gates previstos até a validação terminar; não são resultados já aprovados.

## Próximas entregas de conteúdo

Seguir os aprofundamentos em docs/curriculo-completo.md. Priorizar aulas próprias sobre coleções/funções, semântica de objetos, protocolos, assíncrono e engenharia de cada linguagem. Manter mecanismos explicados, dois problemas, casos de transferência, depuração e soluções verificáveis. Não marcar o currículo inteiro como concluído enquanto o mapa tiver aprofundamentos pendentes.

- Achado de revisão corrigido: gabaritos independentes recolhidos em details na leitura interativa e estática; o E2E verifica ocultação inicial e abertura sem JavaScript.

## Preparação de produção

A aprovação do CI valida esta versão do repositório, não uma implantação externa. O CODELAB preserva progresso local sem conta; os executores externos dependem do ambiente configurado. Conferir os critérios em docs/prontidao-producao.md e registrar evidências reais para cada entrega. Prosseguir com a migração gradual de leitura para passos interativos depois das prioridades de conteúdo.

## Restrições e execução

Preservar aparência, mundo, clima, áudio, editor e armazenamento local. Não alterar CSS do produto para expandir conteúdo. TypeScript tem compilação real; SQL destas trilhas declara PostgreSQL.

O preview automático da Vercel foi identificado pelo bot da PR, mas a leitura pelo conector retornou 403 de acesso ao escopo renancodandos-projects. Não marcar a implantação como verificada com base no status Ready. O CLI também não pode ser usado enquanto o executor local estiver indisponível.

O executor local tem falha de ACL antes de iniciar processos. Não alterar ACLs do sistema nem sobrescrever clones locais. As mudanças são publicadas pelo GitHub e verificadas no Actions. Quando o executor voltar, inspecionar alterações e arquivos não rastreados antes de sincronizar.

## Retomada

A automação continuar-melhorias-do-codelab está ativa neste chat a cada quatro horas. Ela deve conferir main, este checkpoint e PRs abertas, evitar entregas duplicadas e comunicar somente progresso relevante, falha ou ação necessária. Se o limite interromper a execução, preservar o head da branch e o último gate conhecido.

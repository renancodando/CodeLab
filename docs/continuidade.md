# Continuidade do CODELAB

## Estado em 6 de outubro de 2026

- PR #1 integrada em main: aula Valores com 25 passos, progresso v2, verificação QuickJS, domínio por capacidade e revisões locais.
- Última validação anterior: 105 testes de unidade, 20 E2E, build frontend e .NET aprovados.
- PR #2 integrada em main: 108 aulas em 20 trilhas. Commit de integração: `9bce5c7534bf5b019921c1effc3246fefda6e763`.
- Head de código validado: `9791412e301fa5075b46ad40dfe412cf975007f6`. CI [37491953326](https://github.com/renancodando/CodeLab/actions/runs/37491953326): **125 testes de unidade, 27 E2E, 48 exemplos externos, build frontend e .NET aprovados**. 114 páginas educacionais geradas. Revisão automática concluída sem comentários de achados; a árvore integrada corresponde à validada.
- Oito novos percursos escritos: HTML, CSS, JavaScript, TypeScript, Python, C#, C++ e PostgreSQL. 48 aulas de 13 capítulos, com 414 entradas de cobertura introduzidas. Leia `docs/curriculo-completo.md` e a matriz JSON para distinguir introdução e prática independente.

## Próximo passo imediato

Iniciar uma nova entrega de aprofundamento a partir do main atual. Desdobrar conceitos agrupados em aulas próprias, começando pelos fundamentos que precisam de mais exemplos e prática independente em cada linguagem. Ler o mapa editorial, atualizar definições e executar `npm run content:generate`; revisar contagens e mapa sem reduzir os critérios de profundidade. Uma entrega deve incluir mecanismo explicado, pelo menos dois problemas de aplicação e casos de transferência, além de erro, solução e projeto. Validar e integrar em uma nova PR; não republicar a expansão da PR #2.

## Depois da integração

Aprofundar os temas agrupados em aulas próprias, seguindo as prioridades editoriais do mapa de currículo. Acrescentar problemas, explicações do mecanismo, depuração e exercícios verificáveis; não publicar apenas títulos. Retomar a migração gradual para passos interativos depois das prioridades de conteúdo. Preservar leitura extensa e progresso local, sem conta ou backend de progresso.

## Restrições e execução

O executor local foi conferido novamente depois da integração e continua falhando por ACL antes de iniciar processos. Não alterar ACLs do sistema nem sobrescrever clones locais. As mudanças atuais são feitas pelo conector autenticado do GitHub e verificadas por GitHub Actions. Quando o executor local voltar, inspecionar alterações e arquivos não rastreados antes de sincronizar.

Não alterar aparência, mundo, clima, áudio ou CSS durante esta expansão. TypeScript é conferido por tsc strict. Exemplos SQL desta trilha são PostgreSQL e têm ambiente explícito. Exemplos externos são validados em recursos temporários no CI.

## Retomada automática

A automação `continuar-melhorias-do-codelab` está ACTIVE, ligada a este chat, com execução a cada quatro horas. O prompt prioriza o currículo aprofundado e mantém notificações para progresso relevante, falha ou ação necessária. Se o limite impedir trabalho, preservar este checkpoint e retomar quando houver disponibilidade; o agendamento não garante retorno no segundo exato de um reset.

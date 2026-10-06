# Continuidade do CODELAB

## Estado em 6 de outubro de 2026

- PR #1 integrada em main: aula Valores com 25 passos, progresso v2, verificação QuickJS, domínio por capacidade e revisões locais.
- Última validação anterior: 105 testes de unidade, 20 E2E, build frontend e .NET aprovados.
- PR #2: `conteudo/curriculo-do-zero-ao-avancado`, expansão para 108 aulas em 20 trilhas. Consulte o estado da PR e o CI para confirmar integração e o head validado.
- Oito novos percursos escritos: HTML, CSS, JavaScript, TypeScript, Python, C#, C++ e PostgreSQL. 48 aulas de 13 capítulos, com 414 entradas de cobertura introduzidas. Leia `docs/curriculo-completo.md` e a matriz JSON para distinguir introdução e prática independente.

## Próximo passo imediato

Se a PR #2 ainda estiver aberta, verificar o head e concluir a validação antes de integrar. Os 125 testes de unidade, 48 exemplos externos e builds já passaram em um head anterior desta expansão; a validação do head final precisa ser conferida na PR. Se já estiver integrada, prosseguir com os aprofundamentos abaixo, sem repetir a publicação desta expansão.

## Depois da integração

Aprofundar os temas agrupados em aulas próprias, seguindo as prioridades editoriais do mapa de currículo. Acrescentar problemas, explicações do mecanismo, depuração e exercícios verificáveis; não publicar apenas títulos. Retomar a migração gradual para passos interativos depois das prioridades de conteúdo. Preservar leitura extensa e progresso local, sem conta ou backend de progresso.

## Restrições e execução

O executor local continua falhando por ACL antes de iniciar processos. Não alterar ACLs do sistema nem sobrescrever clones locais. As mudanças atuais são feitas pelo conector autenticado do GitHub e verificadas por GitHub Actions. Quando o executor local voltar, inspecionar alterações e arquivos não rastreados antes de sincronizar.

Não alterar aparência, mundo, clima, áudio ou CSS durante esta expansão. TypeScript é conferido por tsc strict. Exemplos SQL desta trilha são PostgreSQL e têm ambiente explícito. Exemplos externos são validados em recursos temporários no CI.

## Retomada automática

A automação `continuar-melhorias-do-codelab` está ACTIVE, ligada a este chat, com execução a cada quatro horas. O prompt prioriza o currículo aprofundado e mantém notificações para progresso relevante, falha ou ação necessária. Se o limite impedir trabalho, preservar este checkpoint e retomar quando houver disponibilidade; o agendamento não garante retorno no segundo exato de um reset.

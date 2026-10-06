# Continuidade do CODELAB

## Estado em 6 de outubro de 2026

- PR #1 integrada em main: aula Valores com 25 passos, progresso v2, verificação QuickJS, domínio por capacidade e revisões locais.
- Última validação anterior: 105 testes de unidade, 20 E2E, build frontend e .NET aprovados.
- PR #2: `conteudo/curriculo-do-zero-ao-avancado`, expansão para 108 aulas em 20 trilhas. Ainda em validação: confira o head e o CI antes de integrar.
- Oito novos percursos escritos: HTML, CSS, JavaScript, TypeScript, Python, C#, C++ e PostgreSQL. 48 aulas de 13 capítulos, com 414 entradas de cobertura introduzidas. Leia `docs/curriculo-completo.md` e a matriz JSON para distinguir introdução e prática independente.

## Próximo passo imediato

Validar o head atual da PR #2. Corrigir qualquer falha nos exemplos, na pré-renderização e no fluxo de produção. Tornar a PR pronta para revisão, resolver achados sustentados por evidência e integrar somente o conteúdo verificado. Atualizar este checkpoint com o resultado do CI e a integração.

## Depois da integração

Aprofundar os temas agrupados em aulas próprias, seguindo as prioridades editoriais do mapa de currículo. Acrescentar problemas, explicações do mecanismo, depuração e exercícios verificáveis; não publicar apenas títulos. Retomar a migração gradual para passos interativos depois das prioridades de conteúdo. Preservar leitura extensa e progresso local, sem conta ou backend de progresso.

## Restrições e execução

O executor local continua falhando por ACL antes de iniciar processos. Não alterar ACLs do sistema nem sobrescrever clones locais. As mudanças atuais são feitas pelo conector autenticado do GitHub e verificadas por GitHub Actions. Quando o executor local voltar, inspecionar alterações e arquivos não rastreados antes de sincronizar.

Não alterar aparência, mundo, clima, áudio ou CSS durante esta expansão. TypeScript é conferido por tsc strict. Exemplos SQL desta trilha são PostgreSQL e têm ambiente explícito. Exemplos externos são validados em recursos temporários no CI.

## Retomada automática

A automação `continuar-melhorias-do-codelab` está ACTIVE, ligada a este chat, com execução a cada quatro horas. O prompt prioriza o currículo aprofundado e mantém notificações para progresso relevante, falha ou ação necessária. Se o limite impedir trabalho, preservar este checkpoint e retomar quando houver disponibilidade; o agendamento não garante retorno no segundo exato de um reset.

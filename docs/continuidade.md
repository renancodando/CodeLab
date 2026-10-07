# Continuidade do CODELAB

## Estado em 7 de outubro de 2026

- PR #1 e PR #2 integradas. Main conferida em `8943ee6011ae30e5590e3c2035ba097aa2f5ade3`: 108 aulas e 20 trilhas.
- PR #3: 20 aulas aprofundadas e 40 problemas; propõe 128 aulas. Head `d978b46cba7b6825d93d222b243ed77e79564688`, run [37564135454](https://github.com/renancodando/CodeLab/actions/runs/37564135454).
- Nesse head, instalação, auditoria sem vulnerabilidades, unidade, 112 exemplos e builds já passaram; os 48 testes de navegador ainda precisam concluir. Revisão automática concluída para `d978b46`, sem novos achados. Conferir o resultado final e resolver a thread anterior de gabaritos somente após os testes de ocultação e abertura passarem.
- Entrega seguinte preparada na branch `conteudo/dialogos-grid-iteradores-isolamento`: quatro aulas próprias de HTML, CSS, C# e PostgreSQL, oito problemas, mantendo as aulas anteriores.
- Catálogo proposto: 132 aulas, 20 trilhas, 72 módulos adicionais; 24 aulas têm prática independente. Matriz: 606 entradas, 134 vinculadas a atividades específicas, 472 introduzidas. Esses números descrevem o conteúdo e não esgotamento das especializações.

## Verificação da entrega seguinte

O head novo precisa passar em instalação e auditoria, 136 testes de unidade, 118 programas externos, três cronogramas PostgreSQL com conexões distintas, build frontend/API, 59 testes de navegador e geração de 138 páginas. Nenhum resultado esperado deve ser apresentado como aprovado antes do CI. Conferir revisão e árvore integrada igual à testada.

Os gabaritos SQL que exigem conexões distintas possuem postgresScenario na definição. O verificador comum não os concatena numa conexão; verify-sql-concurrency usa os comandos por sessão, exige os SQLSTATE esperados e encerra os processos antes da limpeza. Os cenários são da autoria do repositório, não código de usuário.

## Critério de integração

Integre PR #3 somente com todos os gates verdes no head atual. A entrega seguinte parte desse head e deve ser integrada depois. Confira main e PRs abertas antes de editar para evitar duplicação. Se main mudar enquanto o CI executa, confira a comparação e a árvore resultante; não ignore uma mudança material no código testado.

## Conteúdo e próximas entregas

Leia docs/curriculo-completo.md e mantenha a matriz honesta. Permanecem aprofundamentos de biblioteca padrão, protocolos, ecossistemas, testes, concorrência, diagnósticos, projetos maiores e especializações por linguagem. A próxima entrega deve transformar esses mecanismos em aulas próprias com casos de transferência; títulos e listas não promovem cobertura para prática independente.

Prosseguir com passos interativos depois das prioridades editoriais, preservando leitura extensa e progresso local sem conta.

## Preservação e ambiente

Preservar aparência, mundo, clima, áudio, editor e armazenamento local. Os novos estilos pertencem apenas aos códigos didáticos; CSS do produto não é alterado. TypeScript usa compilação real; SQL desta expansão declara PostgreSQL.

O conector da Vercel recusou leitura do projeto code-lab no escopo renancodandos-projects com 403. Preview Ready não comprova funcionamento. A ampliação de acesso já foi solicitada ao usuário; aguardar resposta e conferir o endereço real quando estiver disponível.

O executor local falha na preparação de ACL antes de iniciar processos. Não alterar ACLs do sistema nem sobrescrever clones ou arquivos não rastreados. Publicação pelo GitHub e testes pelo Actions; inspecionar alterações locais antes de sincronizar quando o executor voltar.

## Retomada

A automação continuar-melhorias-do-codelab deve conferir este checkpoint, main e PRs abertas, retomar o head existente e avisar somente sobre progresso relevante, falha ou ação necessária. Não declarar o pedido inteiro concluído enquanto os aprofundamentos ou a verificação da implantação permanecerem pendentes.

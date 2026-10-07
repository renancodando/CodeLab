# Continuidade do CODELAB

## Estado em 7 de outubro de 2026

- PR #1, #2 e #3 integradas. Main conferida em `42abffdaf236b13f66e0dbf50d43240f877a6a05`: 128 aulas e 20 trilhas.
- PR #3 validada no head `d978b46cba7b6825d93d222b243ed77e79564688`, run [37564135454](https://github.com/renancodando/CodeLab/actions/runs/37564135454): 136 testes de unidade, 112 exemplos externos, 48 E2E, builds e 134 páginas. Auditoria sem vulnerabilidades.
- Árvore integrada idêntica à testada: `24db0d534c7d3d9be39b21ea16b551966d2f5c80`. Revisão atual concluída sem novos achados e thread anterior dos gabaritos resolvida após os testes passarem.
- PR #4 na branch `conteudo/dialogos-grid-iteradores-isolamento`: quatro aulas próprias e oito problemas, catálogo proposto de 132 aulas e 20 trilhas.
- O head inicial `eaac3db2711864cf43341982f61dcf070e8dc29e` passou em unidade, exemplos, três cronogramas entre sessões, builds e auditoria; o navegador ainda estava em execução quando a revisão apontou uma condição de corrida no leitor de stderr.
- Correção: verificador espera o evento close do processo para validar o SQLSTATE, com streams drenados. A aula diferencia psql interativo (retorna ao prompt e exige ROLLBACK) de entrada não interativa (encerra por ON_ERROR_STOP). Conferir o novo head e não integrar com base no CI anterior.
- Catálogo proposto: 72 módulos adicionais, 24 aulas com prática independente, 606 entradas de cobertura, 134 vinculadas a atividades e 472 introduzidas. As especializações restantes seguem no mapa.

## Verificação da entrega seguinte

O head novo precisa passar em instalação e auditoria, 136 testes de unidade, 118 programas externos, três cronogramas PostgreSQL com conexões distintas, build frontend/API, 59 testes de navegador e geração de 138 páginas. Nenhum resultado esperado deve ser apresentado como aprovado antes do CI. Conferir revisão e árvore integrada igual à testada.

Os gabaritos SQL que exigem conexões distintas possuem postgresScenario na definição. O verificador comum não os concatena numa conexão; verify-sql-concurrency usa os comandos por sessão, exige os SQLSTATE esperados e encerra os processos antes da limpeza. Os cenários são da autoria do repositório, não código de usuário.

## Critério de integração

PR #3 já está integrada. Integre PR #4 somente após CI verde no head atual e a resolução dos achados. Confira main e PRs abertas antes de editar para evitar duplicação. Se main mudar enquanto o CI executa, confira a comparação e a árvore resultante; não ignore uma mudança material no código testado.

## Conteúdo e próximas entregas

Leia docs/curriculo-completo.md e mantenha a matriz honesta. Permanecem aprofundamentos de biblioteca padrão, protocolos, ecossistemas, testes, concorrência, diagnósticos, projetos maiores e especializações por linguagem. A próxima entrega deve transformar esses mecanismos em aulas próprias com casos de transferência; títulos e listas não promovem cobertura para prática independente.

Prosseguir com passos interativos depois das prioridades editoriais, preservando leitura extensa e progresso local sem conta.

## Preservação e ambiente

Preservar aparência, mundo, clima, áudio, editor e armazenamento local. Os novos estilos pertencem apenas aos códigos didáticos; CSS do produto não é alterado. TypeScript usa compilação real; SQL desta expansão declara PostgreSQL.

O conector da Vercel recusou leitura do projeto code-lab no escopo renancodandos-projects com 403. Preview Ready não comprova funcionamento. A ampliação de acesso já foi solicitada ao usuário; aguardar resposta e conferir o endereço real quando estiver disponível.

O executor local falha na preparação de ACL antes de iniciar processos. Não alterar ACLs do sistema nem sobrescrever clones ou arquivos não rastreados. Publicação pelo GitHub e testes pelo Actions; inspecionar alterações locais antes de sincronizar quando o executor voltar.

## Retomada

A automação continuar-melhorias-do-codelab deve conferir este checkpoint, main e PRs abertas, retomar o head existente e avisar somente sobre progresso relevante, falha ou ação necessária. Não declarar o pedido inteiro concluído enquanto os aprofundamentos ou a verificação da implantação permanecerem pendentes.

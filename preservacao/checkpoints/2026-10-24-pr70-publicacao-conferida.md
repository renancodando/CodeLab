# PR #70: conferência concluída em Chromium e limites preservados

## Estado salvo

- Main local e remoto: 714991c0f7e066ab5a92a3ee40e48f0568375e3f — integra prática de tipos e dependências em .NET.
- Checkout local em main, limpo e sem código somente local. Commits da entrega e testes estão no GitHub.
- PR #70 integrada: https://github.com/renancodando/CodeLab/pull/70
- Head revisado: a933b85cf96568e834a462a2b434b9d386f2080e.
- Árvore: 814a590eba89eee98619e73e3ac4de31d2b0bb33, igual ao head aprovado e à integração virtual. Pais/base conferidos.
- Revisão do head verdadeiro concluída sem apontamentos ou discussões pendentes.
- Preservar branches existentes; não integrar preservacao/retomada-cloud-20261015 ou verificacao/publicacao-pr70 em main.

## Evidência atual

- CI de entrada 40042896202 e pós-merge 40097101648 integralmente aprovados nos dez jobs: 1.359 testes/79 arquivos, 282 testes de navegador, 194 exemplos externos, 36 cenários .NET 10 e auditoria zerada.
- Verificação local suplementar: nove fluxos completos aprovados em 4,4 min no head a933b85.
- Deployment observado READY/production no projeto esperado, SHA real 714991c e domínio code-lab-omega.vercel.app conferidos antes e depois das verificações públicas. Metadados internos do provedor permanecem locais.
- Conferência pública independente: https://github.com/renancodando/CodeLab/actions/runs/40098887331, nove testes Chromium aprovados em 4,3 min, sem retries e com 60 segundos por teste.
- O workflow de conferência tem commit 080bfc28e6c13b5f068211cacb440018ca2c605e e somente um arquivo novo em sua branch de verificação. Faz checkout fixo e confere o SHA testado 714991c antes de executar os testes contra o domínio real; não modifica fontes da aplicação ou produção.
- Provas públicas selecionadas e comparadas remotamente: preservacao/atualizacoes/pr70/ci-integral-a933b85.json, ci-pos-merge-714991c.json e publico-714991c-chromium.json.

## Falhas que continuam registradas

- CI inicial 40030039182 em 2ba089d falhou no orçamento global de Git. As verificações de larguras foram separadas do fluxo de recuperação, preservando limites e todas as afirmações. O CI do novo head passou, inclusive Git.
- A execução local de 23/10 interrompida após dois testes nunca foi considerada aprovada.
- A tentativa pública local de Edge terminou com cinco testes passando e quatro timeouts globais. O trace de restauração .NET não comprova conclusão da restauração ou perda de dados. As falhas e os traces locais foram preservados.
- A inspeção Chronos observou pressão pelo limiar de disco e helper saudável, com responsividade não medida. Isso não prova a causa dos timeouts. Não apagar dados, alterar o sandbox ou aumentar limites como remediação.
- O resultado público em Chromium não confirma recuperação do Edge nem apaga a tentativa anterior. Investigar eventual reprodução em ambiente local estável; não afirmar causa ou resolução sem evidência.

## Continuação curricular

Catálogo integrado: 137 aulas, 198 atividades, 94 aulas com pausas e 43 sem. A contagem não conclui aula, linguagem ou edição. As pausas dotnet são conceituais offline; referências/diagnósticos reais são compilados em .NET 10 e o projeto continua construído pelo aluno, com revisão manual.

A fila gerada em docs/aulas-sem-pratica.md começa agora em csharp-controle, seguida de csharp-objetos, csharp-colecoes e csharp-async. Conferir main, PRs, CI, domínio e as evidências reais antes do próximo lote. Preservar identidade, mundo/clima, isolamento, carregamento sob demanda, progresso local e conteúdo avançado. Não iniciar auditoria final ou declarar a edição pronta: ainda há lacunas de prática e critérios de conclusão a cumprir.

Relatórios locais com metadados privados e traces não foram publicados no código. O código, os testes, o workflow de conferência e os checkpoints necessários à retomada estão remotos.

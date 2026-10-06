# Continuidade do CODELAB

## Restrições que permanecem

Preservar a aparência e a identidade visual. Trabalhar no repositório renancodando/CodeLab em pequenos commits. Preservar as 60 aulas profundas. A experiência deve permanecer local, sem login, conta ou armazenamento remoto de jornada.

## Trabalho desta etapa

- Auditoria arquitetural publicada em main.
- Validação de produção com Playwright no CI; corrigido o formato do relatório específico do CI.
- Aula modelo valores em 25 passos e motor reutilizável no PR #1, branch melhoria/aula-pratica-valores.
- Migração de progresso v1 para v2, retomada, indicadores por capacidade e revisão local.
- Backup validado antes de substituir jornada; dados maiores que os limites são recusados explicitamente.
- Testes unitários e de navegador para a aula completa.

## Retomada

1. Conferir o último commit do PR #1 e os resultados do GitHub Actions; as correções incluem impedir resultados fixos na transferência, invalidar o resumo de conclusão e reagendar revisão após nova conclusão. Integrar apenas após validação.
2. Conferir navegação, retomada, execução real, descarte de recursos e apresentação com os estilos existentes.
3. Criar uma aula avançada com autoria própria e validar a extensão do motor antes de migrar as demais aulas.
4. Evoluir revisão com desafios novos, IndexedDB e projetos com vários arquivos.
5. Migrar runtimes gradualmente; remover dependências de backend somente depois de substituição e validação.

## Limitações desta sessão

O executor local falhou antes de iniciar comandos com erro de aplicação de ACLs, mesmo após autorização de acesso. A implementação desta etapa foi feita pelo conector GitHub, com validação pelo CI; não declarar testes locais dela.

A primeira solicitação de automação foi rejeitada pela política de aprovação. Após a atualização do ambiente em 6 de outubro de 2026, foi criada e ativada a automação continuar-melhorias-do-codelab, vinculada a este chat, a cada quatro horas. Ela verifica limites de uso e retoma a partir deste registro, sem notificações repetidas para estado inalterado. A retomada ocorre em execuções agendadas; não há garantia de execução no instante exato do reset.


## 6 de outubro: expansão de conteúdo solicitada

Prioridade: currículo aprofundado de HTML, CSS, JavaScript, TypeScript, Python, C#, C++ e SQL. Branch: `conteudo/curriculo-do-zero-ao-avancado`. Leia `docs/curriculo-completo.md` e inspecione o catálogo antes de continuar. O pacote Python e a arquitetura de conteúdo carregado por linguagem são o primeiro checkpoint; a expansão está em produção e não deve ser descrita como concluída antes de todos os pacotes e gates passarem.

A automação existente continua ativa a cada quatro horas, agora com a prioridade de conteúdo. A limitação de ACL do executor local permanece; alterações são feitas pelo conector GitHub e verificadas pelo CI. Não sobrescreva clones locais sem inspecionar alterações quando o executor voltar.

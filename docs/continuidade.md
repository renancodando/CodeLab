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

1. Conferir o último commit do PR #1 e os resultados do GitHub Actions; corrigir falhas antes de integrar.
2. Conferir navegação, retomada, execução real, descarte de recursos e apresentação com os estilos existentes.
3. Criar uma aula avançada com autoria própria e validar a extensão do motor antes de migrar as demais aulas.
4. Evoluir revisão com desafios novos, IndexedDB e projetos com vários arquivos.
5. Migrar runtimes gradualmente; remover dependências de backend somente depois de substituição e validação.

## Limitações desta sessão

O executor local falhou antes de iniciar comandos com erro de aplicação de ACLs, mesmo após autorização de acesso. A implementação desta etapa foi feita pelo conector GitHub, com validação pelo CI; não declarar testes locais dela.

A solicitação de automação periódica foi rejeitada pela política de aprovação do ambiente. A retomada automática não está ativa. Configurá-la quando a ferramenta permitir, respeitando limites de uso e sem notificações repetidas para estado inalterado.

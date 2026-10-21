# Retomada: HTTP integrado, atualização Vite em validação

- Main: 4b1c41b8a7d6b27d9730e5847fbd1f6f31d984e4, PR #64 integrada com árvore/pais conferidos e revisão correta do head 775cb4d.
- Deployment dpl_J9ZhVCYYRcCFnsEVFVwKwC6kygnq READY/production nesse SHA; alias code-lab-omega.vercel.app antes/depois e 22/22 fluxos públicos em 6,3 min.
- CI de entrada 39499191771 integral aprovado; CI pós-merge 39667263317 terminou com cinco jobs aprovados e auditoria falha por Vite 7.3.6. Não chamar esse run de verde.

## Correção atual

Branch correcao/vite-auditoria, head 60f2d32b6e01f46673d34824abccc4ec2f6ce358, enviado e comparado com o remoto. PR #65: https://github.com/renancodando/CodeLab/pull/65. Quatro arquivos: manifesto/lock atualizam somente Vite 7.3.6 para 7.3.7 e dois documentos registram a falha. Workflow, testes, currículo, sandbox e limites não foram alterados. Auditoria local zero vulnerabilidades; CI 39669655167 tem auditoria e testes/compilação aprovados (1.225/75,194 exemplos); quatro parcelas de navegador em andamento. Revisão do head correto concluída sem pendências, threads vazias.

Build local aprovado: Vite 4m20,157 páginas,38 recursos essenciais/6 opcionais,offline579cf92d59ff04b9318f, igual ao build local anterior.

## Falhas locais preservadas

O lote unitário completo local teve1222/1225; três timeouts em memória25s, backup10s e geração de métricas10s. A repetição dos três arquivos e a comparação em threads também falharam. Não aprovar esses lotes nem ampliar seus limites. Probe nativo QuickJS sem Vite atingiu out of memory com4MB após21,5s; limpeza4,3s, total26s. Demonstra custo fora do Vite, sem estabelecer causa dos demais timeouts.

O cenário adicional do navegador com o mesmo vetor passou e executou acender depois:1/1 em30,5s. O teste existente de cancelamento/memória inicialmente não foi selecionado por grep ancorado (No tests found; não aprovado). Nova configuração sem âncoras listou exatamente o cenário pretendido. Ele e os22fluxos HTTP/armazenamento estão em execução, logs próprios com nomes revisão.

A inspeção Chronos encontrou2,3GB livres emC e sinalizou limiar de disco; latência/impacto não medidos. Nenhuma limpeza, encerramento de processos do usuário ou alteração de configuração foi feita. Não atribuir os timeouts ao disco sem comprovação.

## Próximos gates

Concluir navegador local eCI/revisão do head60f2d32, avaliar explicitamente a limitação dos três unitários locais, conferir árvore/pais/base antes de integrar. Depois deployment READY/SHA/alias e fluxos públicos próprios, CI pós-merge completo. Não reutilizar revisão/CI de775cb4d nem converter o run pós64 em aprovado.

Evidências remotas: preservacao/atualizacoes/pr64 contém integração,22fluxos públicos e CI pós-merge com a falha; preservacao/atualizacoes/pr65/verificacoes-intermediarias-60f2d32.sanitizado.json preserva auditoria/instalação, três lotes unitários falhos, probe nativo e fontes de configuração, lidos de volta e comparados. Artefatos brutos privados e builds/dependências continuam locais; fonte necessária para Cloud está remota.

Catálogo mantém137aulas,186atividades,90aulas com pausas e47sem. Próxima aula:fetch-estados depois da estabilização. Edição não concluída. Preservar identidade, modelo sem contas/progresso local, isolamento e escopo finito. Branch de preservação não é para merge emmain.

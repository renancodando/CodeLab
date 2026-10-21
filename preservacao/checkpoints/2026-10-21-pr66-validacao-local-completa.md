# Retomada: limites e métricas com validação local completa

## Fonte remota

- Main: bcdf68ab81aab7dfdd3555983a38870cfac813f7, PR #65.
- Branch atual: testes/limites-e-metricas.
- Head: 9299b5898936b580589ab94b502adaf174f9683c.
- Árvore local: 4aed722782d309827502ea7b589dd369efc86fd1.
- PR: https://github.com/renancodando/CodeLab/pull/66.
- Quatro commits enviados e head comparado com o remoto; checkout limpo na última inspeção.

A PR #64 publicou seis pausas em duas aulas existentes. A PR #65 corrigiu Vite para 7.3.7: CI de entrada 39669655167 e pós-merge 39674011779 integralmente aprovados, revisão correta e árvore/pais conferidos. Deployment dpl_FzodUy7rAm33bZBBqNF7UQ4mpcEs READY/production no SHA bcdf68a; alias antes/depois de 24 cenários públicos aprovados. Evidências sanitizadas e CI final estão em preservacao/atualizacoes/pr65.

## PR #66

O teste unitário de memória exige OOM específico e recuperação; o vetor original permanece no navegador, além da sequência de strings e cancelamento. A montagem do backup mantém a mesma massa e afirmações, evitando serializar tudo a cada ajuste e conferindo o tamanho contra JSON completo. O gerador tem entrada real gerarMetricas com diretório explícito, declaração de tipos e CLI preservada; contratos de geração/conferência/rejeição continuam com arquivos reais e cobertura da CLI. Não muda process.cwd, timeouts, limites do executor, workflow, aplicação ou catálogo.

23 específicos passaram inicialmente. O primeiro lote completo teve 1.225/1.227: dois casos do gerador ainda excediam 10 s. Esse lote não é aprovado. Depois da entrada reutilizável, os 23 específicos passaram em 26,15 s e a nova suíte completa passou: 1.227/75 em 318,55 s. Os casos de geração levaram 4.110/2.643/3.956 ms nesse lote. Build passou: Vite 3m09, 157 páginas, 38 recursos essenciais/6 opcionais, offline 579cf92d59ff04b9318f. O cenário ampliado do navegador passou em 52,6 s (corpo 34,2 s), com os limites originais.

CI atual: 39678278152 no head 9299b58; auditoria e testes/compilação aprovados, parcelas de navegador ainda precisam da conferência final. Revisão desse SHA concluída sem pendências. Não usar o recibo/CI do head anterior 362cc66 (run 39676676652) para autorizar o atual.

## Próximos gates

Conferir CI completo e revisão do SHA verdadeiro, main/base, árvore do merge virtual e pais; integrar somente com expected_head_sha. Depois conferir merge real, deployment READY, projeto, SHA e alias e executar 22 fluxos HTTP/armazenamento mais o cenário ampliado de executor; reconfirmar alias depois. Acompanhar CI pós-merge próprio. Só então seguir à aula fetch-estados. Não declarar a edição finalizada.

Os artefatos intermediários e a validação local atual estão em preservacao/atualizacoes/pr66; arquivos lidos de volta e comparados. O log unitário verboso integral e traces privados permanecem locais; resumo e hash do original estão remotos. Fonte necessária para retomar está no GitHub. A branch de preservação não deve ser integrada em main. Uma tarefa Cloud pode partir da branch/head indicados; heartbeat local depende do PC ligado.

Catálogo permanece com 137 aulas, 186 atividades, 90 aulas com pausas e 47 sem. Ter uma pausa não conclui a aula. A intermitência antiga de inicialização do executor continua registrada; aprovações recentes não são alegação de sua correção. Nenhum arquivo do usuário foi apagado nem houve mudança de configuração do computador.

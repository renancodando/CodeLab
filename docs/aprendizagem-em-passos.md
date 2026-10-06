# Aprendizagem em passos

A aula modelo `valores` tem 25 passos originais: explicação, reconhecimento, previsão, alteração, produção, depuração e aplicação. A rota `#/aula/valores` usa os componentes visuais existentes; a leitura profunda continua em `#/leitura/valores`. As outras 59 aulas continuam com o comportamento anterior.

## Execução e retomada

Cada passo avaliado libera o próximo somente após uma resposta correta. Código é executado no QuickJS em Worker com os limites existentes; expressões de verificação pertencem ao conteúdo confiável do CODELAB. O projeto final testa entradas diferentes e quantidade zero. Consultar solução não aprova a resposta. Alterar uma resposta aprovada exige nova verificação.

A sessão guarda passo atual, código/resposta, tentativas, pistas e consulta à solução no navegador. Cada troca de passo descarta editor/modelo e cancela execução pendente. Importação aceita versões 1 e 2; leitura tenta a chave v2 primeiro e recupera v1 quando necessário. A chave antiga não é apagada.

## Evidências de domínio

As seis capacidades são reconhecimento, leitura, alteração, produção, depuração e aplicação. Uma capacidade sem tentativa aparece como não praticada. Para cada passo: falha vale 0; acerto após solução consultada vale 20; acerto independente na primeira tentativa vale 100; outros acertos valem max(30, 80 − 15 × pistas). O indicador é a média dos passos tentados da capacidade. Ele orienta estudo, sem pretensão de diagnóstico científico.

A conclusão agenda revisão local após sete dias se todas as capacidades atingirem 80, ou após um dia quando há necessidade de reforço. O perfil mostra quando revisar. Recomeçar prática limpa a sessão dessa aula e permite refazê-la; a próxima conclusão agenda nova revisão.

## Validação e próximos passos

Testes unitários cobrem bloqueio de avanço, feedback, pistas, importação/migração, execução real das soluções e rejeição de resultado fixo no projeto. Testes de navegador percorrem os 25 passos, recarregam a página, conferem retomada, recursos descartados, acesso à leitura e ausência de chamadas de conta/progresso/execução remota.

Antes de migrar as demais aulas: verificar a aula modelo, autoria de uma aula avançada e extensão da revisão com desafios próprios. IndexedDB, projetos com vários arquivos e novos runtimes são etapas posteriores. Nenhum backend é removido nesta etapa.

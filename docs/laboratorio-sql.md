# Laboratório SQL local

## O que executa

O laboratório usa SQLite real por [sql.js](https://sql.js.org/documentation/Database.html), versão fixada em 1.14.2, com licença MIT. Criação de tabelas, inserção, consultas, joins, agregações, alterações, exclusões e transações são executadas pelo mecanismo. Não é interpretação de texto nem PostgreSQL simulado. SQL PostgreSQL, JSONB, roles, MVCC entre sessões, funções específicas e administração continuam no ambiente indicado pela aula e nos testes PostgreSQL do CI.

Cada clique cria um Worker de módulo, carrega o WASM local, abre um banco vazio, executa o script e descarta banco e Worker. Inclua CREATE e INSERT junto da consulta. Use BEGIN/COMMIT/ROLLBACK dentro do mesmo script; não há sessão entre cliques. Um erro interrompe o script e mostra o diagnóstico SQLite. Resultados parciais não aparecem como execução concluída. Não atribui domínio por executar uma consulta.

O código continua nos rascunhos, projetos independentes, exportação .sql e backup JSON existentes. Resultados e arquivo de banco não são persistidos. Fechar a tela ou trocar linguagem cancela o Worker, conserva o rascunho e impede uma resposta antiga de substituir a tela atual.

## Limites e isolamento

- 30.000 caracteres de entrada e 100 comandos por execução.
- Até dez tabelas de resultado, 40 colunas, 100 linhas por tabela e 1.000 células no total. Exceder informa erro, sem apresentar truncamento como resultado completo.
- Até 2.000 caracteres por texto e 200.000 caracteres somados no resultado, incluindo cabeçalhos.
- Carregamento do módulo, Worker e WASM compartilham um prazo total de 20 segundos; execução limitada a oito segundos depois de o mecanismo iniciar. Parar interrompe a espera e encerra um Worker já criado. Uma importação tardia não inicia execução após o prazo ou cancelamento.
- Limite de 8 MiB no alocador SQLite por hard_heap_limit e limite inicial de 256 páginas. Não é limite da memória total do navegador ou do WASM. O aluno pode reduzir o teto do alocador, mas SQLite não permite aumentá-lo por esse PRAGMA; a próxima execução usa outro Worker.
- Foreign keys habilitadas inicialmente. PRAGMAs fazem parte do SQL real: o aluno pode alterar configurações de seu banco descartável.
- Sem executor remoto, credenciais ou acesso a arquivos do computador. load_extension, readfile e writefile não estão disponíveis no mecanismo distribuído. SQL não expõe fetch, DOM ou APIs JavaScript ao aluno. As únicas requisições do runtime são seus recursos estáticos na mesma origem.

Inteiros de 64 bits chegam como BigInt, sem arredondamento para Number. Valores reais continuam Number; NULL difere do texto 'NULL'. BLOB aparece somente com tamanho em bytes, evitando transferir conteúdo binário grande. A interface monta cabeçalhos/células por textContent; HTML em um valor não é executado. Tabelas têm legenda, cabeçalhos e regiões roláveis acessíveis por teclado.

## Carregamento e offline

Carregador, Worker e WASM são recursos opcionais, fora do precache. Abrir a home ou selecionar SQL não os baixa. Executar com conexão carrega apenas os recursos da mesma origem; o service worker tenta guardar respostas válidas. Falha de quota não impede a consulta online, mas não garante execução offline. Antes do primeiro carregamento, a falta de conexão explica a limitação e conserva o código para exportar.

O cache essencial continua com instalação atômica. A versão considera também os opcionais, e a ativação remove caches antigos; uma atualização pode exigir o primeiro carregamento novamente. Nenhum recurso de API, outra origem ou POST é armazenado por esse caminho.

No primeiro build: WASM 658,41 kB (322,99 kB gzip), Worker 41,89 kB, carregador 0,94 kB (0,58 kB gzip). Bundle inicial 195,43 kB gzip, mundo 135,94 kB gzip; três opcionais fora dos 34 recursos essenciais. Esses números descrevem esse build, não uma promessa de tamanho constante ou FPS em celular físico.

## Evidências e pendências

Os 21 testes com SQLite real passaram localmente: joins, escrita, commit/rollback, banco novo, resultados vazios, tipos, triggers, sintaxe, constraints, APIs de arquivo ausentes, limites, OOM e recuperação. Cinco testes do service worker gerado passaram, incluindo quota e falha de instalação. Strict/build passaram e npm audit não encontrou vulnerabilidades.

Três fluxos Edge passaram contra o build terminado: consulta e backup/importação, execução offline após carregar, banco descartável, cabeçalhos vazios, inteiros, texto seguro, teclado e 220/4000 px; cancelamento/CPU/OOM/troca de linguagem e tela; primeiro uso offline com código exportável. A primeira tentativa usou o build anterior durante a compilação e não é aprovação. O cenário ampliado também passou (31,3 s), cancelando um Worker já criado. Exigir CI completo no head publicado, revisão, árvore e verificação do domínio antes de declarar entrega de produção.

Referências: [PRAGMA hard_heap_limit](https://www.sqlite.org/pragma.html#pragma_hard_heap_limit), [transações SQLite](https://www.sqlite.org/lang_transaction.html), [API e BigInt de sql.js](https://github.com/sql-js/sql.js). O aprofundamento do currículo e o laboratório TypeScript permanecem no mapa de trabalho.

## Revisão do prazo de carregamento

A revisão da PR #32 encontrou a importação dinâmica fora do temporizador. O carregador agora inclui essa fase no orçamento total de 20 segundos, libera a espera em Parar/troca de tela e ignora resultado tardio. Um teste de navegador retém a requisição do módulo, avança o relógio além do prazo, confere o código exportável e libera a resposta para tentar novamente. Exigir esse cenário e o CI do novo head; o run do head anterior não valida esta correção. A suíte unitária completa local terminou em 578/586, com seis timeouts de compilação TypeScript, um de memória e um de métricas. O CI 38144061861 aprovou 586 unidades em 38 arquivos e o job comum; não registrar os timeouts locais como aprovação.

O novo cenário reproduziu a falha no build anterior: mesmo após avançar 20 segundos, permanecia Executando. Após corrigir e recompilar, os seis fluxos locais SQL/HTML passaram (3,9 min), incluindo prazo, cancelamento durante importação retida, resposta tardia e nova execução. A verificação ampliada do CacheStorage real passou isoladamente (1,4 min): nenhum dos três recursos SQL estava no cache inicial e a consulta posterior continuou funcionando offline. Os limites não foram ampliados.

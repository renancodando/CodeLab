# Edição curricular 2026.11: contrato e limites

O fechamento consolida o catálogo existente, os seis percursos de engenharia e os oito projetos de conclusão. As contagens atuais vêm das [métricas geradas](metricas-catalogo.md), e a distribuição das pausas está na [fila gerada](aulas-sem-pratica.md). Uma pausa presente não comprova profundidade, execução nem domínio. O agrupamento L01–L12 encerra esta edição; não cria uma meta de cobrir tudo que existe em programação.

## O que a pessoa pode demonstrar

As aulas combinam explicação, exemplos, previsão, diagnóstico, reconstrução e produção conforme a habilidade. Os corretores confrontam entradas independentes e bordas; quando o contrato permite, aceitam soluções equivalentes. Uma resposta pode continuar errada depois de passar no exemplo visível. Leitura e execução livre não geram domínio; consultar solução registra assistência, e repetir o mesmo problema não cria evidências independentes.

Os marcos dos projetos apontam para aulas do próprio catálogo e pedem aplicação, decisões, diagnóstico e evidências sobre a versão dos arquivos. Os arquivos iniciais não são projetos prontos. A rubrica é manual e não se transforma em aprovação automática por marcar itens ou executar o teste inicial. No projeto Python, o unittest inicial confere somente disponibilidade/limite; CLI completo, SQLite, transações, importação e restauração são construídos e revisados depois.

## Execução com escopo explícito

| Atividade ou ambiente | Evidência que pode oferecer |
| --- | --- |
| Resposta conceitual | Previsão, relação entre tipos, diagnóstico ou decisão; não é compilação. |
| JavaScript no isolamento | Execução dos casos disponíveis, com Workers, cancelamento e limites. |
| Bancada TypeScript | Diagnósticos do compilador, JavaScript emitido e execução; os exercícios conceituais não herdam essa prova. |
| SQL local | Consulta em SQLite descartável; não prova MVCC, JSONB, isolamento ou planos de PostgreSQL. |
| Referências nos verificadores | Python, C++20, .NET 10, TypeScript e PostgreSQL reais nas famílias correspondentes; não são a submissão do aluno. |
| Projeto aberto | Arquivos e decisões construídos pela pessoa, com revisão manual e logs das execuções efetivamente realizadas. |

As interfaces distinguem execução local, atividade conceitual e recurso que depende de executor/ambiente disponível. Não há promessa de que um compilador remoto esteja configurado no domínio. A integração HTTP de referência usa os processos e respostas descritos por seu teste; um transporte simulado não vira HTTP real nem durabilidade.

## Dados locais, acesso e desempenho

A edição preserva progresso sem login, rascunhos, projetos, exportação/importação, recuperação e preparação offline. O preparo inicial exige rede para os recursos indicados; offline não significa que qualquer recurso externo esteja disponível. Falha real de persistência e falha injetada em uma atividade são verificações diferentes. Os testes próprios de armazenamento continuam na suíte.

O editor, runtimes e ferramentas pesadas continuam sob demanda. Sandbox, CSP, Workers e limites de execução não são relaxados. Teclado, foco, acessibilidade, reduced motion e conteúdo em 220–4000 px fazem parte das verificações. O mundo e a identidade visual permanecem; as [limitações das fontes meteorológicas](meteorologia.md) continuam explícitas, sem transformar previsão em observação pontual.

## Como conferir o fechamento

A [estratégia proporcional](estrategia-validacao.md) reserva a suíte ampliada, todos os runtimes e o segundo navegador para este fechamento. O workflow manual é `Validação final da edição`. PR, pós-merge e produção mantêm responsabilidades próprias; um job pendente, cancelado ou uma revisão de outro SHA não é aprovação.

Os resultados definitivos, árvores, SHAs, revisões, deployment READY, projeto, alias e fluxos públicos ficam nos [recibos remotos](https://github.com/renancodando/CodeLab/tree/preservacao/retomada-cloud-20261015/preservacao/checkpoints). O [registro de continuidade](continuidade.md) preserva a investigação e as limitações. CI verde e preview não confirmam produção sozinhos.

O trace público da PR #101 registrou navegação até load de cerca de 57 s antes do timeout reportado no axe. O smoke passou a aguardar DOM e o controle necessário, sem resolver de novo a ordenação já coberta pelo cenário próprio de teclado. Axe, programas completos, larguras e limites foram conservados. Isso trata a preparação redundante; não estabelece a causa de todas as intermitências históricas ou uma garantia de tempo em qualquer computador.

Esta é uma edição coerente dentro do escopo definido, com limites pedagógicos e técnicos declarados. Não é currículo exaustivo, diagnóstico científico de domínio ou comprovação automática dos projetos do aluno.

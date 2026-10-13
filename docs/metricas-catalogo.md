# Métricas do catálogo

Gerado por `npm run content:generate` a partir das definições e da matriz do currículo. O build rejeita divergências. A interface usa o mesmo resumo JSON, sem carregar capítulos adicionais.

O catálogo tem **137 aulas em 20 trilhas**, **58 problemas independentes** e **123 atividades corrigíveis**. As pausas dessas atividades estão ligadas a **67 aulas**. Há **6 percursos de engenharia com 18 etapas** e **8 projetos de conclusão com 57 marcos e 171 critérios manuais**.

| Medida | Quantidade |
| --- | ---: |
| Aulas originais | 60 |
| Aulas nos percursos aprofundados | 77 |
| Linguagens com atividades | 8 |
| Entradas de tópicos na matriz | 654 |
| Entradas ligadas a problemas específicos | 162 |
| Entradas introduzidas | 492 |

## Atividades por linguagem

| Linguagem | Atividades corrigíveis |
| --- | ---: |
| C++ | 12 |
| C# | 12 |
| CSS | 9 |
| HTML | 9 |
| JavaScript | 43 |
| Python | 21 |
| SQL/PostgreSQL | 8 |
| TypeScript | 9 |

## Cobertura das aulas

| Linguagem | Aulas | Com pausas | Sem pausas |
| --- | ---: | ---: | ---: |
| C++ | 10 | 8 | 2 |
| C# | 14 | 6 | 8 |
| CSS | 15 | 7 | 8 |
| HTML | 19 | 5 | 14 |
| JavaScript | 30 | 18 | 12 |
| Python | 10 | 10 | 0 |
| SQL/PostgreSQL | 14 | 6 | 8 |
| Integração (transversal) | 15 | 0 | 15 |
| TypeScript | 10 | 7 | 3 |

Restam 70 aulas sem pausas deste catálogo. A [fila pedagógica gerada](aulas-sem-pratica.md) lista cada uma e se atualiza junto das métricas.

A aula de valores também possui um percurso próprio passo a passo, preservado separadamente da leitura completa. A contagem de pausas não inclui as etapas desse percurso, missões ou experiências dos percursos de engenharia. Contagem não mede domínio nem esgota os ecossistemas. Um tópico pode aparecer em mais de um contexto; entradas da matriz não são conceitos únicos. Problemas independentes têm critérios e soluções, mas não recebem correção automática universal. Atividades conceituais não comprovam compilação; projetos abertos usam revisão manual. Consulte [o mapa de cobertura](curriculo-completo.md) e [as etapas restantes](etapas-restantes.md).

# Métricas do catálogo

Gerado por `npm run content:generate` a partir das definições e da matriz do currículo. O build rejeita divergências. A interface usa o mesmo resumo JSON, sem carregar capítulos adicionais.

O catálogo tem **137 aulas em 20 trilhas**, **58 problemas independentes** e **234 atividades corrigíveis**. As pausas dessas atividades estão ligadas a **106 aulas**. Há **6 percursos de engenharia com 18 etapas** e **8 projetos de conclusão com 57 marcos e 171 critérios manuais**.

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
| C# | 42 |
| CSS | 23 |
| HTML | 34 |
| JavaScript | 76 |
| Python | 21 |
| SQL/PostgreSQL | 17 |
| TypeScript | 9 |

## Cobertura das aulas

| Linguagem | Aulas | Com pausas | Sem pausas |
| --- | ---: | ---: | ---: |
| C++ | 10 | 8 | 2 |
| C# | 14 | 11 | 3 |
| CSS | 15 | 13 | 2 |
| HTML | 19 | 15 | 4 |
| JavaScript | 30 | 28 | 2 |
| Python | 10 | 10 | 0 |
| SQL/PostgreSQL | 14 | 9 | 5 |
| Integração (transversal) | 15 | 5 | 10 |
| TypeScript | 10 | 7 | 3 |

Restam 31 aulas sem pausas deste catálogo. A [fila pedagógica gerada](aulas-sem-pratica.md) lista cada uma e se atualiza junto das métricas.

A aula de valores também possui um percurso próprio passo a passo, preservado separadamente da leitura completa. A contagem de pausas não inclui as etapas desse percurso, missões ou experiências dos percursos de engenharia. Contagem não mede domínio nem esgota os ecossistemas. Um tópico pode aparecer em mais de um contexto; entradas da matriz não são conceitos únicos. Problemas independentes têm critérios e soluções, mas não recebem correção automática universal. Atividades conceituais não comprovam compilação; projetos abertos usam revisão manual. Consulte [o mapa de cobertura](curriculo-completo.md) e [as etapas restantes](etapas-restantes.md).

# Publicação conferida — PRs #81 e #82

Esta branch é de preservação. Não integrar em main. Este recibo substitui o estado pendente de 2026-10-28-modelagem-em-validacao.md e dos trechos de preparação em docs/continuidade.md.

## Fonte e integração

- Main: 5724081ec4c266eadd6cdf06f6be3cec496a8d3b.
- PR #81: https://github.com/renancodando/CodeLab/pull/81, head f648534c50d87e88be5c9ffdbd484cb5da20b6bf, merge d9dd6fc7f7defa78bfffaa48477e600197225cf8. Árvore ff662d0fb8744388036e56811f4235235d932372 igual ao head; pais 8f13fda/f648534. Revisão retomada marcando pronta após ficar running; concluiu no próprio head sem apontamentos, nenhuma thread pendente.
- PR #82: https://github.com/renancodando/CodeLab/pull/82, head 64de718a87a98afcf9722e80086a4fc19cd2c421, merge 5724081ec4c266eadd6cdf06f6be3cec496a8d3b. Árvore d99570666c951c806b7e3174479692b144a30ee7 igual ao head; pais d9dd6fc/64de718. Revisão desse head concluída sem apontamentos e nenhuma thread pendente.
- SQL incorporou main com merge normal, sem rebase ou force push. Conflitos combinados preservando as duas aulas e corretores; métricas regeneradas. Branches de conteúdo preservadas. Checkout local main limpo e sincronizado.

## Entregas e limites

Seis novas pausas nas duas aulas existentes aspnet-protecao e sql-modelagem: política/autoria/concorrência; integridade/cardinalidade/dependências. Exemplos e exercícios originais mantidos e projetos com revisão manual mais concreta. Não criou aulas, login, runtime ou visual novo. Pausas são conceituais e não executam código livre do aluno. Referências ASP.NET usam .NET 10/HTTP no loopback com identidades sintéticas, sem validar JWT/cookies; referências de modelagem usam SQLite real via sql.js, sem alegar semântica PostgreSQL. Sem mudanças no mundo/clima, sandbox, progresso ou arquitetura local-first.

Métricas geradas da versão publicada: 137 aulas, 20 trilhas, 58 problemas, 228 atividades, 104 aulas com pausas e 33 sem; seis percursos de engenharia e oito projetos. Presença de uma pausa não conclui profundidade, projeto ou edição.

## Validação proporcional

- #81: CI 40581912211 do f648534 aprovado em 4 min 56 s, 143 testes de quatro arquivos, sete fluxos Chromium, 24 referências .NET e build/API. Pós-merge 40771735474 aprovado.
- #82: primeiro CI 40688034647 parou em uma suposição do teste de migração. Cenário passou a isolar sua própria preparação, conservando todas as asserções; modelagem exige a primeira posição na sessão SQL. Dois cenários repetidos e aprovados. CI 40688521337 do e72acee aprovado em 2 min 04 s; sua revisão não foi usada para outro head.
- Integração: 157 testes locais de quatro arquivos afetados aprovados. CI 40772139051 do 64de718 aprovado em 2 min 12 s: 151 testes de cinco arquivos, um fluxo Chromium e build. Nenhum outro runtime ou suíte integral por rotina.
- Pós-merge final 40772556253 aprovado: build e somente dois contratos de artefato/isolamento, ambos passaram em 40,9 s. Sem repetir a bateria da PR.

## Produção

Deployment dpl_59L17yxxj1mS9yC3UNy9YD2uqYPB, READY/production. SHA 5724081ec4c266eadd6cdf06f6be3cec496a8d3b, projeto prj_XgncY54wYGiSgPH0n1JOol3UFWCn e alias code-lab-omega.vercel.app conferidos antes e depois dos testes. Sem promover preview ou alterar ambiente.

Os três fluxos públicos do conjunto passaram em 56,2 s, usando o canal local Edge/Chromium instalado, sem repetir outros navegadores:

```text
axe e programas completos de 220 a 4000 px — 18,4 s
Python, C# e C++ offline após preparação, sem submissões externas — 11,7 s
exportação e importação preservam jornada local — 12,7 s
3 passed (56.2s)
```

Log local: outputs/pr82-publico-20261028.log; recibos filtrados de alias antes/depois no mesmo diretório. Este arquivo preserva remotamente os resultados públicos; logs completos do CI permanecem nos runs indicados. Dados privados do provedor não foram publicados.

## Retomada

Começar pela fila gerada docs/aulas-sem-pratica.md: próxima aula sql-crud, depois sql-join, sql-transacao e sql-indices. Na próxima entrega, atualizar o topo de docs/continuidade.md com este recibo e o estado vivo de main/PRs/checks antes de editar. Não repetir a bateria das duas entregas já verificadas. Manter escopo finito, exemplos reais somente das áreas afetadas, feedback/assistência, projetos manuais e distinção conceitual/execução. Suíte completa e segundo navegador amplo somente no fechamento ou impacto comprovadamente amplo. Não reabrir expansão meteorológica.

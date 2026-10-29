# Validação proporcional ao impacto

A orientação humana de 26/10/2026 substitui a exigência histórica de repetir a suíte completa por entrega. A prioridade é concluir a edição curricular existente. Os registros anteriores de CI integral são evidências históricas, não um roteiro obrigatório para cada commit.

| Momento | Verificação |
| --- | --- |
| Desenvolvimento local | Testes específicos da alteração e suas dependências; repetir primeiro só o cenário que falhou. |
| PR | Plano por arquivos/IDs alterados, catálogo/tipos quando pertinentes, unitários selecionados, referências das famílias afetadas e navegador das áreas alteradas. |
| Após merge | Build e dois contratos de artefato/isolamento no Chromium. Sem repetir unitários, exemplos de todas as linguagens ou a bateria da PR. |
| Produção | Conferir SHA/projeto/alias, backup, offline e axe/responsividade: três fluxos diferentes dos dois anteriores. Não repetir a matriz local e da PR. |
| Fechamento da edição | Workflow manual `Validação final da edição`: suíte completa preservada, exemplos de todas as linguagens, PostgreSQL, API e oito parcelas de navegador. Edge confere os contratos críticos quando solicitado. |

## Seleção e execução

```sh
node scripts/impacto-validacao.mjs <SHA_BASE>
npm run test:impacto
node scripts/validar-alteracoes.mjs exemplos
npm run test:impacto:e2e
```

O primeiro comando registra arquivos, IDs, grupos e motivos em `plano-validacao.json`, que não é versionado. Não execute todas as etapas por hábito: use só as selecionadas. Arquivos de teste alterados entram diretamente; atividades em arquivos centrais usam IDs publicados para localizar seus testes. Imports diretos selecionam também contratos cujo nome difere do módulo. Missões e gabaritos SQL recebem verificações comportamentais próprias; mudanças no backend meteorológico preservam seus testes .NET de cache/fallback e alterações da concorrência SQL recebem conexões PostgreSQL distintas. Mudanças compartilhadas mantêm contratos de execução, progresso e backup. Teoria estática recebe catálogo/tipos e dispensa navegador e compiladores. Novas referências precisam ter sua família registrada no seletor e no verificador; família desconhecida é erro, nunca aprovação silenciosa.

Exemplo: a alteração original do backup C# seleciona somente `csharp-excecoes.spec.ts`, sem PostgreSQL, compilação C++/Python/C# ou os demais testes de aulas. Um acréscimo nas pausas de escopos seleciona o corretor comum, os testes dessa aula e suas referências .NET; não seleciona as outras sete linguagens.

O Chromium é o navegador frequente. Alterações de CSS/ambiente recebem também Edge no mesmo sistema; o fechamento da edição reserva a cobertura ampliada. O navegador só inicia a API ou o servidor de desenvolvimento quando o arquivo selecionado usa esses serviços. A aplicação compilada é compartilhada pelo job de navegador.

## Cobertura que permanece

O conjunto compartilhado reutiliza seis cenários existentes: WebAssembly/CSP, cancelamento e recuperação do executor, backup/importação de progresso, isolamento da prévia HTML, estudo offline e axe com conteúdo visível em 220/4000 px. O pós-merge usa os dois de artefato/isolamento; `CODELAB_FASE=publico` seleciona backup, offline e axe/responsividade. A suíte completa mantém os outros cenários de responsividade, acessibilidade, armazenamento, API, clima, laboratórios e aulas. Nenhuma asserção foi retirada para obter verde.

Documentação Markdown que não participa do produto dispensa workflows de aplicação. JSON usado na geração do catálogo continua validado. Runs substituídos por commits novos são cancelados pela concorrência da branch/PR. Um cancelamento não vira aprovação.

Não aumentar timeout/retries. Falhas intermitentes independentes devem ser registradas com evidência e tratadas separadamente; não prender indefinidamente uma entrega sem relação. Não reutilizar revisão de outro SHA nem declarar produção pelo verde do CI. Revisões externas pendentes continuam pendentes, com checkpoint para retomada.

## Medição

Referência anterior comparável: PR #79, run 40326734056, de 12:58:53 a 13:17:18 UTC em 26/10/2026: **18 min 25 s**, 1.528 unitários, 315 fluxos e todas as referências externas. A redução de tempo só deve ser anunciada depois de medir uma execução da estratégia nova. Selecionar sete fluxos do arquivo de backup em vez de 315 reduz 97,8% das execuções de navegador nesse recorte, mas essa proporção não é uma medição de tempo.

Rodada proporcional aprovada: run 40421319701 no head a459cb61b8d650a845609552a1d60773aacba586, de 23:40:16 a 23:46:57 UTC em 26/10/2026: **6 min 41 s**, 198 unitários, 14 fluxos Chromium e 21 cenários .NET das famílias afetadas, com build e API. Frente aos 18 min 25 s anteriores, a diferença observada é de **11 min 44 s (63,7%)**. São duas rodadas da mesma PR na infraestrutura GitHub Actions, com escopos diferentes: a nova inclui o lote DTO e a estratégia de validação. É uma medição pontual de CI, não promessa de duração nem validação do tempo total de entrega. As correções posteriores de seleção exigem seus próprios checks e revisão; este resultado não aprova outro head.


A rodada JOIN da PR #84 (run 40959815984, 29/10/2026, 21:40:51–21:49:24 UTC) terminou em **8 min 33 s**, com 262 unitários, 18 bases PostgreSQL e 34 fluxos Chromium. O seletor antigo usava substring: `sql-join` também encontrava `sql-joins-cardinalidade` e incluía os 29 cenários de `independent-practice.spec.ts` sem alteração dessa aula. A comparação passa a respeitar os limites dos IDs, preservando referências em rotas, seletores e IDs próprios das atividades. Nenhum teste é removido da suíte.

Recalculando esse mesmo lote, permanecem `api.spec.ts`, `sql-join.spec.ts` e `sql-pratica.spec.ts`: **34 → 5 fluxos**, 85,3% menos cenários selecionados nesse recorte. As referências SQL, o PostgreSQL e a API continuam necessários. Os 20 testes específicos do seletor passaram localmente. Isso mede a seleção, não uma redução de tempo já observada numa rodada equivalente com o seletor novo. Mudanças no seletor ainda recebem seus próprios gates antes da integração.

A seleção continua conservadora para extensões por hífen: alterar `sql-join` também seleciona um teste que mencione apenas `sql-join-depurar-titulos`. A correção bloqueia a continuação da palavra em `sql-joins-cardinalidade`, sem perder esse vínculo entre aula e atividade. Esse caso faz parte dos testes do novo head.

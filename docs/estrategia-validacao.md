# Validação proporcional ao impacto

A orientação humana de 26/10/2026 substitui a exigência histórica de repetir a suíte completa por entrega. A prioridade é concluir a edição curricular existente. Os registros anteriores de CI integral são evidências históricas, não um roteiro obrigatório para cada commit.

| Momento | Verificação |
| --- | --- |
| Desenvolvimento local | Testes específicos da alteração e suas dependências; repetir primeiro só o cenário que falhou. |
| PR | Plano por arquivos/IDs alterados, catálogo/tipos quando pertinentes, unitários selecionados, referências das famílias afetadas, navegador das áreas alteradas e contrato compartilhado de cancelamento/memória. |
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

O primeiro comando registra arquivos, IDs, grupos e motivos em `plano-validacao.json`, que não é versionado. Não execute todas as etapas por hábito: use só as selecionadas. Arquivos de teste alterados entram diretamente; atividades em arquivos centrais usam IDs publicados para localizar seus testes. Imports diretos selecionam também contratos cujo nome difere do módulo. Missões e gabaritos SQL recebem verificações comportamentais próprias; mudanças no backend meteorológico preservam seus testes .NET de cache/fallback e alterações da concorrência SQL recebem conexões PostgreSQL distintas. Mudanças compartilhadas mantêm contratos de execução, progresso e backup. Teoria estática recebe catálogo/tipos e dispensa navegador e compiladores. Novas referências precisam ter sua família registrada no seletor e no verificador; família desconhecida é erro, nunca aprovação silenciosa. Uma família explícita encontrada nas alterações também evita acrescentar a família de referência usada como fallback do verificador comum. Quando somente esse script muda, o fallback conservador permanece. A família `cpp-texto` usa C++20 e preserva os checks compartilhados quando a seleção do pipeline é alterada.

Exemplo: a alteração original do backup C# seleciona somente `csharp-excecoes.spec.ts`, sem PostgreSQL, compilação C++/Python/C# ou os demais testes de aulas. Um acréscimo nas pausas de escopos seleciona o corretor comum, os testes dessa aula e suas referências .NET; não seleciona as outras sete linguagens.

O Chromium é o navegador frequente. Alterações de CSS/ambiente recebem também Edge no mesmo sistema; o fechamento da edição reserva a cobertura ampliada. O navegador só inicia a API ou o servidor de desenvolvimento quando o arquivo selecionado usa esses serviços. A aplicação compilada é compartilhada pelo job de navegador.

Alterações no catálogo de habilidades, planejamento adaptativo e árvore usam os contratos próprios de adaptive, hub-catalog, catalogo-linguagens, ordem-diaria e learning-hub, além dos essenciais de execução/progresso/backup/corretores. Imports do helper idPreparacao em testes de conteúdo não exigem recompilar programas nativos que permaneceram iguais. Testes/fixtures ou exemplos efetivamente alterados continuam selecionados e preservam seus runtimes; a suíte completa mantém todos os cenários. A mudança da PR #93 foi o caso concreto: o plano anterior puxava seis famílias nativas por dependências de preparação sem modificação dos programas. Essa comparação mede seleção; não é uma redução de tempo já observada em execuções equivalentes.

## Cobertura que permanece

Os seis cenários compartilhados permanecem na suíte e são distribuídos entre fases: PR confere cancelamento/limite de memória/recuperação; pós-merge confere WebAssembly/CSP e isolamento HTML; produção confere backup/importação, offline e axe/programas visíveis em 220/4000 px. A descoberta real do Playwright confirmou grupos 1/2/3 sem sobreposição. As áreas afetadas mantêm seus cenários próprios, e a validação final preserva a suíte completa. A preparação do smoke de axe não repete a resolução por teclado já verificada no cenário específico; mantém todas as verificações de axe, conteúdo e layout. Nenhum timeout ou retry foi aumentado.

Documentação Markdown que não participa do produto dispensa workflows de aplicação. JSON usado na geração do catálogo continua validado. Runs substituídos por commits novos são cancelados pela concorrência da branch/PR. Um cancelamento não vira aprovação.

Não aumentar timeout/retries. Falhas intermitentes independentes devem ser registradas com evidência e tratadas separadamente; não prender indefinidamente uma entrega sem relação. Não reutilizar revisão de outro SHA nem declarar produção pelo verde do CI. Revisões externas pendentes continuam pendentes, com checkpoint para retomada.

## Medição

Referência anterior comparável: PR #79, run 40326734056, de 12:58:53 a 13:17:18 UTC em 26/10/2026: **18 min 25 s**, 1.528 unitários, 315 fluxos e todas as referências externas. A redução de tempo só deve ser anunciada depois de medir uma execução da estratégia nova. Selecionar sete fluxos do arquivo de backup em vez de 315 reduz 97,8% das execuções de navegador nesse recorte, mas essa proporção não é uma medição de tempo.

Rodada proporcional aprovada: run 40421319701 no head a459cb61b8d650a845609552a1d60773aacba586, de 23:40:16 a 23:46:57 UTC em 26/10/2026: **6 min 41 s**, 198 unitários, 14 fluxos Chromium e 21 cenários .NET das famílias afetadas, com build e API. Frente aos 18 min 25 s anteriores, a diferença observada é de **11 min 44 s (63,7%)**. São duas rodadas da mesma PR na infraestrutura GitHub Actions, com escopos diferentes: a nova inclui o lote DTO e a estratégia de validação. É uma medição pontual de CI, não promessa de duração nem validação do tempo total de entrega. As correções posteriores de seleção exigem seus próprios checks e revisão; este resultado não aprova outro head.


A rodada JOIN da PR #84 (run 40959815984, 29/10/2026, 21:40:51–21:49:24 UTC) terminou em **8 min 33 s**, com 262 unitários, 18 bases PostgreSQL e 34 fluxos Chromium. O seletor antigo usava substring: `sql-join` também encontrava `sql-joins-cardinalidade` e incluía os 29 cenários de `independent-practice.spec.ts` sem alteração dessa aula. A comparação passa a respeitar os limites dos IDs, preservando referências em rotas, seletores e IDs próprios das atividades. Nenhum teste é removido da suíte.

Recalculando esse mesmo lote, permanecem `api.spec.ts`, `sql-join.spec.ts` e `sql-pratica.spec.ts`: **34 → 5 fluxos**, 85,3% menos cenários selecionados nesse recorte. As referências SQL, o PostgreSQL e a API continuam necessários. Os 20 testes específicos do seletor passaram localmente. Isso mede a seleção, não uma redução de tempo já observada numa rodada equivalente com o seletor novo. Mudanças no seletor ainda recebem seus próprios gates antes da integração.

A seleção continua conservadora para extensões por hífen: alterar `sql-join` também seleciona um teste que mencione apenas `sql-join-depurar-titulos`. A correção bloqueia a continuação da palavra em `sql-joins-cardinalidade`, sem perder esse vínculo entre aula e atividade. Esse caso faz parte dos testes do novo head.

Nos módulos de dados HTML/CSS, a seleção compara objetos de aulas por AST nas versões base e atual. Uma edição apenas dentro das aulas seleciona seus IDs, os contratos gerais de catálogo/correção e testes que citam essas aulas. Imports do arquivo inteiro em testes de outra aula não ampliam o recorte. Mudanças fora dos objetos de aulas, falha de leitura ou estrutura diferente conservam a seleção ampla anterior. Esse recorte não se aplica aos módulos nativos. A suíte completa mantém todos os cenários. Na preparação de L04, o plano inicial puxava 18 arquivos unitários e oito de navegador, incluindo práticas independentes sem mudança; conferir o plano do commit novo para medir a seleção final, sem prometer redução de tempo antes do CI.

A família `typescript-genericos` confere as novas referências de inferência, constraints, ausência e correlação: programas strict positivos, diagnósticos semânticos esperados, ausência de emissão em erro e comportamento do JavaScript emitido. Não exige as referências de outras linguagens. Os testes conceituais distinguem essa evidência de executar a resposta do aluno.


A família csharp-avancado usa uma compilação C# 14/.NET 10 para as referências das três aulas, com cópias, eventos, buffers, somas, relógio e oráculos. Um console próprio também é publicado e executado fora do workspace. Alterações nessa família não selecionam PostgreSQL ou runtimes de outras linguagens. Respostas conceituais do aluno não são executadas por esse verificador.


A família cpp-concorrencia usa C++20 e programas definidos para junção e operações atômicas; também compila e liga arquivos separados e exige diagnósticos de ligação nos casos negativos. CMake e sanitizers não são presumidos por esses resultados. O seletor específico não acrescenta famílias nativas de outras linguagens; contratos críticos do pipeline continuam preservados.

A família `sql-avancado` verifica referências e exemplos originais das três aulas SQL em PostgreSQL 18. Planos conferem execução e cardinalidade, sem impor tempo, custo ou estratégia do otimizador. A família `sql-pratica` preserva as bases dos corretores em conexões temporárias; as atividades do aluno que executam SQLite não passam a ser execução PostgreSQL.

A família project-archive liga alterações de projetos à conferência de interoperabilidade ZIP com a biblioteca padrão Python. É uma verificação estreita do formato exportado; não compila projetos das oito linguagens nem executa código do aluno. Alterações compartilhadas continuam com seus smokes de isolamento, dados e API.

A família git-percursos executa somente os três gabaritos Bash publicados no percurso Git, em pastas temporárias novas, e confere o estado com Git real. A seleção local pode repetir uma etapa conhecida; IDs inválidos são erro. O modelo visual de trabalho/index/HEAD e seus testes próprios permanecem separados. Não executa comandos em repositórios do usuário.


A família projetos-python executa apenas os arquivos iniciais da biblioteca: unittest, mutante and/or, importação silenciosa, CLI inicial e CSV. Usa pasta temporária própria e não executa código recebido do estudante. Não exige .NET/PostgreSQL nem equivale a executar o projeto completo. O L11 repete primeiro os cenários que falharam; catálogo/tipos e contratos gerais ficam no CI do lote.

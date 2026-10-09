# Continuidade do CODELAB

## Estado em 8 de outubro de 2026

Prioridade humana mais recente: concluir primeiro a reestruturação meteorológica, depois retomar aprendizagem ativa e aprofundamentos. A branch de clima preserva o catálogo; veja [o contrato e limitações](meteorologia.md). Não confundir previsão Open-Meteo com observação atual nem ativar chuva local por código WMO.

Main anterior `22e02d7cf9325f0c2e04e5ea4ca6a77505119562`: runs 37802151482, 37802009510 e 37801960626 concluídos com sucesso, incluindo as integrações #9/#10. O CI da nova branch precisa concluir antes da integração.

Clima em revisão na [PR #11](https://github.com/renancodando/CodeLab/pull/11), branch `clima/motor-atmosferico-continuo`. O head inicial `16ad5388dc805b11ce3859ce58d130794daf4f8d` passou o run 37816072375. Antes de integrar, verificar o head posterior: corrige qcField não booleano, precipitação sólida e cadência do modelo durante falha, além de névoa na água. Não usar o sucesso do head inicial como gate das correções.

Retomada: 354 testes unitários passaram, incluindo 19 casos da nova rota Vercel/Node.js; sete testes de navegador meteorológicos passaram após as correções, com 13 cenários visuais em desktop e viewport móvel. O adaptador local recebeu boletim NOAA real HTTP 200. Vercel CLI autenticada como renancodando acessa o preview protegido; a rota no preview anterior e no domínio retorna 404. Publicar o próximo head, aguardar CI completo e testar a função no preview antes de integrar; conferir o domínio depois. As três threads de revisão ainda precisam ser resolvidas após a verificação.

O preview de `1b2ab89` instalou a função, mas retornou 500 por import ESM sem extensão. A correção usa `.js` na entrada TypeScript; o build agora executa o JavaScript emitido em um processo Node separado, com 30 consultas concorrentes e fonte simulada. Conferir o preview do head corrigido: build Ready isoladamente não comprovou o funcionamento.

- PRs #1 a #10 integradas. Catálogo: 136 aulas em 20 trilhas; Python, TypeScript, C++ e JavaScript têm dez aulas, outras quatro linguagens nove.
- 60 aulas originais, 48 módulos panorâmicos de 13 capítulos e 28 aulas próprias de 17 capítulos, com 56 problemas independentes.
- Matriz: 646 entradas, 155 vinculadas a atividades específicas e 491 introduzidas. Os conceitos podem reaparecer em contextos diferentes; não são contagem de especializações completas.
- 37 atividades corrigíveis: cinco programas JS e 32 atividades conceituais. Doze pausas novas distribuídas em Python, TypeScript, C++ e JavaScript exigem preparação do conceito na sessão diária.
- Pedido integral em andamento: [17 frentes restantes](etapas-restantes.md). Não há contagem finita auditada de aulas que esgote todos os ecossistemas.

## Evidências da entrega curricular anterior

- Código validado no head `9cd2122d36b8a6c9d025c7f993812045536220e0`.
- Run [37566327714](https://github.com/renancodando/CodeLab/actions/runs/37566327714): 136 testes de unidade, 118 programas externos, três cronogramas PostgreSQL com conexões distintas, 59 testes de navegador, builds frontend/API e 138 páginas.
- Auditoria npm sem vulnerabilidades. A correção de source-map-js 1.2.2 permanece no lockfile.
- Revisão concluída para esse head sem novos achados; a thread P2 do stderr foi resolvida após a correção e a execução dos cenários.
- Integração em `1ba1ae70ed6953124c419f06c94078bf87481b02`; árvore `7ffa35ce37a96aeb762c3782c5fdf2e3a7777b1f`, igual à testada.
- Heap no ciclo medido: 12.860.480 para 15.156.564 bytes, crescimento 2.296.084; zero editores visíveis restantes e 114 geometrias. É evidência deste cenário.
- A PR #3 também teve CI aprovado após sua integração em main, no run 37565921506.

Os dados acima descrevem a entrega curricular da PR #4. A expansão de aprendizagem da PR #5 está registrada abaixo; confira o CI atual de main antes de ampliar código.

## Aprendizagem com prática e projetos integrada

A [PR #5](https://github.com/renancodando/CodeLab/pull/5) foi integrada em 53715e9b01993f0a5594030f1f7db04408bdf9b7. O head testado foi 35c2163b507c6f15c465aac940faac102c092b55; a árvore integrada 845ff30b1e94dc2381ef8c153ca962f9dbb16352 é idêntica à testada.

Disponível em main: 25 atividades distribuídas nas oito linguagens (quatro programas JS quebrados); pausas corrigíveis nos capítulos ligados a essas atividades; domínio por habilidade com evidência distinta e assistência; revisão 1/3/7/14/30/60 por calendário local; sessão diária limitada; seis percursos com 18 etapas; oito projetos de conclusão com 57 marcos e 171 critérios manuais; vários arquivos, exportação ZIP e backup integrado; cache versionado da aplicação e módulos para estudo offline após preparação; adaptação de 220 a 4000 px.

O catálogo principal permanece com 132 aulas. As 18 etapas dos percursos são novas unidades separadas, não aulas de 17 capítulos. A correção de respostas conceituais não comprova compilação; projetos abertos têm rubrica manual. Os casos reservados ficam fora da tela durante a tentativa e são inspecionáveis no pacote local. Não declarar autocorreção universal.

O [run 37641654276](https://github.com/renancodando/CodeLab/actions/runs/37641654276) aprovou 248 testes de unidade, 124 exemplos externos, três cenários Git, três cronogramas PostgreSQL em conexões distintas, ZIP interoperável, 79 testes de navegador, builds frontend/API e 152 páginas. npm audit informou zero vulnerabilidades. As oito larguras de 220 a 4000 px passaram nos fluxos testados.

As duas sugestões de revisão foram corrigidas, verificadas e resolvidas: revelar solução após tentativa atualiza imediatamente o agendamento; a linguagem fica fixa depois de iniciar o plano do dia. A suíte também conferiu falha na instalação de cache, quota indisponível com exportação dos arquivos em memória, backup válido acima de 2 MB e restauração que conserva a jornada anterior quando a gravação falha. O limite de importação agora é 16 MB.

Os runs de main 37675611114 e 37676345090 aprovaram a integração da PR #5 e o checkpoint anterior. A PR #6 também teve main aprovado no run 37680250543. Confira o CI do checkpoint atual na próxima retomada; uma falha real exige investigação. A sincronização local foi concluída; a verificação pública passou no fluxo Python e continua parcial, conforme descrito abaixo.

## Próxima ação editorial

Leia docs/curriculo-completo.md. As aulas de iteradores Python, variância TypeScript e invalidação C++ foram integradas. Propriedades, descritores e receptores JavaScript foram integrados pela PR #10. Priorize biblioteca padrão Python por domínio, módulos TypeScript por ambiente e templates/algoritmos C++ com contratos próprios; prossiga também com internacionalização, workers e cancelamento JavaScript. Continue a aprofundar as oito linguagens, projetos maiores, ecossistemas e diagnóstico. Não marque temas apenas listados como prática pronta.

O diálogo modal, Grid com trilhas automáticas, iteradores C# e snapshots/conflito PostgreSQL já possuem aulas e verificações próprias. Ampliar esses assuntos com novas atividades exige mecanismos adicionais, evitando repetir o que já foi entregue.

Depois das prioridades editoriais, prossiga com a migração gradual para passos interativos, mantendo a leitura extensa e o progresso local sem contas.

## Manutenção e critério de integração

As definições em src/content/deep são a fonte de verdade; content:generate deriva índice e matriz. Os gabaritos SQL que exigem conexões distintas usam postgresScenario e verify-sql-concurrency. O verificador espera close para capturar streams completos; em psql interativo a pessoa deve executar ROLLBACK após o erro.

Antes de editar, confira main, PRs abertas e este checkpoint. Preserve critérios de profundidade, execute os exemplos e o fluxo completo no CI, revise achados e integre somente código verificado. Confira se a árvore integrada corresponde à testada. Revise contagens ao acrescentar aulas.

## Preservação do produto

Preservar aparência, mundo, clima, áudio, editor e armazenamento local. A expansão editorial utiliza as superfícies existentes; as adaptações responsivas da PR #5 têm verificação própria. A bancada orienta o dialeto da aula: PostgreSQL na expansão e SQLite nos exemplos originais correspondentes. Não acrescentar login, contas ou progresso remoto.

## Verificação da implantação e execução local

As tentativas anteriores pelo conector Vercel retornaram 403 e a ferramenta pública não abriu o endereço. Nesta retomada, uma consulta HTTP retornou 200 em https://code-lab-omega.vercel.app e um navegador Edge isolado verificou o fluxo Python: abrir py-iteracao-recursos com 17 capítulos e três pausas, conferir a previsão, salvar estado, retomar a resposta após recarregar e repetir a retomada offline depois da preparação do cache. Não houve pageerror nem requestfailed nesse cenário. A captura está em outputs/verificacao-publica-python.png e o script em outputs/verify-production.mjs.

Essa evidência cobre esse fluxo publicado; não substitui a verificação dos demais fluxos, falhas de armazenamento e configuração da execução externa no endereço público. O preview Ready continua insuficiente sozinho. A leitura de logs/configuração pelo conector continua sem acesso confirmado.

O executor padrão e o kernel Node ainda falham na preparação de ACLs. A execução autorizada fora do sandbox recuperou a leitura e a sincronização local, sem alterar ACLs do sistema. Os dois commits antigos foram preservados na branch local local-preservado-20261007 (head 80be23d); três arquivos não rastreados foram guardados em outputs/preservado-local-20261007, com hashes conferidos e manifest.json. A main local foi criada a partir da origem atual e está limpa. Conferir novamente Git antes de atualizar; não sobrescrever alterações futuras.

## Retomada

A automação continuar-melhorias-do-codelab permanece configurada neste chat. Confira gates de main e PRs abertas, retome o estado existente e comunique somente progresso significativo, falha ou ação necessária. Se um limite impedir publicação, registre o head e o último gate conhecido; retome quando houver disponibilidade. O pedido integral ainda está em andamento enquanto os aprofundamentos e a verificação da implantação estiverem pendentes.


## Python integrado e verificado

Branch: `curriculo-python-iteracao-recursos`, a partir do checkpoint integrado da PR #5. A entrega acrescenta `py-iteracao-recursos`, 17 capítulos, dois problemas independentes e três pausas offline. O catálogo desta branch é 133 aulas/20 trilhas (Python 10, outras linguagens 9), 25 aulas próprias/50 problemas e 616 entradas (139 vinculadas, 477 introduzidas), com 28 atividades corrigíveis.

Os gabaritos incluem bordas de consumo, fonte infinita, limite zero, esgotamento, validação antes da fábrica e fechamento após erro. O verificador inclui quatro programas da aula e três fixtures das pausas. Há navegação dinâmica e estática nos testes e um fluxo novo de pausas offline com persistência e conclusão.

A expansão conserva os 40 ids de conceitos da PR #5 para não invalidar planos iniciados nem conceitos lidos. O head 9525287e92e7584d2599a1dd3f9e5c3b445e489a foi aprovado no run 37677492690: 252 unidade, 131 programas externos, 81 navegador, builds/API, 153 páginas e auditoria sem vulnerabilidades. Integração 8b87854b93ca34e3fda16fb6cc08a87df74c6af9 com árvore 4c6b09542936e9d32ca118b983c4f0d5ea83bb16 idêntica à testada. As contagens descrevem essa entrega, sem currículo exaustivo.


## TypeScript integrado e verificado

Branch `curriculo-typescript-variancia-contratos` parte do head da PR #6 de Python. A dependência Python foi integrada antes. O novo módulo `ts-variancia-contratos` oferece 17 capítulos, quatro programas com saídas esperadas, duas práticas independentes e três pausas offline. Na branch: 134 aulas/20 trilhas, Python e TypeScript 10, demais linguagens 9; 26 aulas próprias/52 problemas; 626 entradas (144 vinculadas/482 introduzidas); 31 atividades corrigíveis.

Testar strict com casos negativos, execução real, diferença método/propriedade, callbacks vazios e erro propagado, restauração offline e páginas estáticas. O head final 0d98f529c39c28dddddc5fb96d352da104d1d9f6 teve 259 testes de unidade, 135 programas externos, 83 testes de navegador, builds/API, 154 páginas e auditoria sem vulnerabilidades no run 37680909578. Integração 7f27f1759c610edbf86d9d61fe1a589b307cc07e, árvore 0547361ce77cf3af0281b1f5379b5cbd886f7c67 idêntica à testada. Não promover readonly, in/out ou todo o ecossistema TypeScript como especialização completa apenas por ter introdução no módulo.

A revisão TypeScript restringiu a substituição de ler/usar via readonly e acrescentou testes negativos dessa permissão. As novas atividades avançadas têm requiredConcepts no catálogo diário para conservar a primeira sessão nos fundamentos; o conceito pode precedê-las no mesmo plano, sem criar domínio pela leitura. Os testes de catálogo e início da sessão foram aprovados no head final.

A correção de sequência diária também cobre as três atividades de iteradores Python publicadas na PR #6; seu desafio de fechamento não deve substituir o desafio de fundamentos na primeira sessão Python. O teste verifica preparação de conceito e plano novo nas duas linguagens.

## Iteradores C++ integrados e verificados

Branch `curriculo-cpp-iteradores-invalidacao`, a partir da integração TypeScript `7f27f1759c610edbf86d9d61fe1a589b307cc07e`. A PR #7 teve 259 testes de unidade, 135 programas externos e 83 testes de navegador aprovados no run 37680909578; sua árvore integrada é a testada `0547361ce77cf3af0281b1f5379b5cbd886f7c67`.

A expansão C++ define 135 aulas/20 trilhas, 27 aulas próprias/54 problemas, 636 entradas (149 vinculadas, 487 introduzidas) e 34 atividades. Python, TypeScript e C++ têm dez aulas; as outras linguagens têm nove. A [PR #8](https://github.com/renancodando/CodeLab/pull/8) foi integrada em `b217be7e63bf0225808117739de2e2011e0831d5`. Head aprovado: `3ecd7fdd147bc9e15057a211f54eb1aee370e57d`; árvore `d35985c0b81b8b28947e2aa23e604b9a0a6f0ad2`, idêntica à testada. O [run 37701742395](https://github.com/renancodando/CodeLab/actions/runs/37701742395) aprovou 263 testes de unidade em 15 arquivos, 142 programas externos, três cenários Git, três cronogramas PostgreSQL, ZIP interoperável, 85 testes de navegador, builds frontend/API e 155 páginas. Auditoria sem vulnerabilidades. Revisão manual concluída, sem threads abertas.

Os resultados cobrem os quatro programas, três fixtures e fluxo offline com reconstrução, persistência e conclusão. Projetos têm rubrica manual; span/views e identidade estável permanecem introduzidos. Esta entrega não conclui o currículo integral.


O CI de main após a PR #7 também foi aprovado no run 37700233574. O checkpoint final tem seu próprio run e deve ser conferido quando concluir.

## Correção Windows em revisão

O build local após sincronização encontrou um falso desatualizado no índice: o checkout usa CRLF, enquanto o gerador produz LF. A branch `fix/indice-crlf-windows` normaliza apenas CRLF na comparação --check, preservando diferenças de conteúdo, formato e contagens. Dois testes executam o gerador em fixtures LF/CRLF e exigem falha em metadados e matriz realmente divergentes. Ambos passaram no Windows; o build local ultrapassou índice/matriz e TypeScript, e está concluindo a geração dos assets.

Conferir a PR de portabilidade e seu CI completo antes de integrar. O catálogo permanece com 135 aulas e 34 atividades; esta correção não amplia cobertura curricular nem comprova implantação integral.

## Propriedades JavaScript em preparação

Branch `curriculo-javascript-propriedades-descritores`, a partir da correção Windows `bc291e4bba41c06637d714d5925e1dc9ba784381` (PR #9). Integrar primeiro essa dependência após CI completo. Novo módulo `js-propriedades-prototipos`: 17 capítulos, quatro programas com asserts e saídas, dois problemas independentes, previsão, escolha e debugging executado.

Na branch: 136 aulas/20 trilhas, 28 aulas próprias/56 problemas, 646 entradas (155 vinculadas, 491 introduzidas), 37 atividades (cinco JS executadas, 32 conceituais). Python, TypeScript, C++ e JavaScript têm dez aulas; as outras quatro linguagens têm nove. Quatro programas passaram em Node.js durante autoria; validar também QuickJS, casos específicos e fluxo offline/persistência no CI antes de integrar.

A pré-condição dos exemplos exclui Proxy e não é detectada pelo validador. Não declarar sanitização genérica, freeze profundo ou projetos automaticamente aprovados. A verificação pública C++ passou após a PR #8 (17 capítulos, três pausas, correção e persistência, sem pageerror/requestfailed nesse cenário). O fluxo Python público também passou offline. Os demais fluxos de produção continuam no mapa de 17 frentes.


## Integrações verificadas em 8 de outubro

PR #9 integrada em ee5436648f8f878200220912003023619ec20ede, com árvore f50f3635f6878c94ad705eb9885c95fe3b814265 idêntica ao head bc291e4bba41c06637d714d5925e1dc9ba784381. Run [37705378788](https://github.com/renancodando/CodeLab/actions/runs/37705378788): 265 testes unitários, 142 exemplos externos, 85 fluxos de navegador, builds/API e auditoria aprovados. O build local Windows também concluiu as 155 páginas.

PR #10 integrada em e04b385c18ac60b1d119670edb19c0ab73d2d01e, com árvore 5b3f2918d52f4f701e85675ede23b26b15318752 idêntica ao head baa3a7759095d646c5b57339d81a7ea7094bf29d. Run [37707217346](https://github.com/renancodando/CodeLab/actions/runs/37707217346): 275 testes unitários em 16 arquivos, 142 exemplos externos, três cenários Git, três cronogramas PostgreSQL, ZIP, 87 fluxos de navegador, 156 páginas, builds/API e auditoria aprovados. O fluxo novo verifica erro, feedback específico sem solução automática, correção executada no QuickJS, retomada offline e conclusão persistida. Nenhuma thread de revisão aberta na integração.

O checkpoint anterior de main, run 37704436528, falhou por timeout de 180 segundos no fluxo interativo de 25 passos, com 84/85 testes aprovados. As duas suítes completas posteriores passaram esse fluxo sem ampliar o timeout. Registrar qualquer recorrência e investigar o trace; não apresentar aquele run como aprovado. Os CIs disparados pelas integrações #9/#10 e por este checkpoint devem ser conferidos na próxima retomada.

As seções “em revisão” e “em preparação” acima registram a sequência histórica; as integrações desta seção são o estado atual. Continuam 17 frentes amplas abertas, sem contagem finita auditada das aulas futuras. A implantação pública segue parcialmente verificada.

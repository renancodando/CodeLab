# Prontidão de produção

## Como avaliar uma entrega

O escopo de uma versão precisa estar explícito. Uma entrega editorial pode estar validada para integração sem que todas as especializações solicitadas estejam concluídas. Não use uma quantidade de aulas, uma página de títulos ou o sucesso do build como prova de cobertura exaustiva.

## Gates do repositório

| Área | Evidência exigida | Gate |
| --- | --- | --- |
| Conteúdo | Texto próprio, exemplos completos, erro, exercício, solução e projeto | Testes de profundidade e revisão editorial |
| Prática independente | Atividade identificada, solução explicada, critérios e execução do mecanismo | Matriz ligada à definição, saídas reais e navegador |
| TypeScript | Verificação semântica strict; expectativas negativas úteis; comportamento após apagamento | Testes de tipos e execução Node.js |
| Python, C++, C# | Compilação/execução de exemplos e soluções em recursos temporários | verify-content-examples |
| PostgreSQL | Dados de estudo, respostas por passo, conflitos e resultado confirmado | Serviço descartável e conexões psql distintas no CI |
| Navegação e leitura | Carregamento, falha e repetição, saída durante download, busca e páginas sem scripts | Playwright em build de produção |
| Progresso | Persistência local, importação validada e compatibilidade com versão anterior | Unidade e E2E existentes |
| Editor e mundo | Descarte de modelos, cancelamento, heap, workers e geometria estável | Ciclos medidos no navegador |
| Dependências | Lockfile instalável e ausência de alertas altos ou críticos | npm ci e npm audit obrigatório |
| Integração | Head atual aprovado e árvore integrada igual à testada | Actions e verificação Git |

## Dependências de uma implantação real

- Endereço público definido pelo ambiente e disponibilidade dos recursos estáticos e rotas.
- Execução externa configurada quando o produto oferecer Python, C# ou C++; conferir indisponibilidade e erros no ambiente publicado.
- Os exemplos TypeScript e PostgreSQL não são apresentados como execução nativa do laboratório atual.
- Backup do progresso é local e depende da exportação pelo estudante. Não prometer sincronização entre dispositivos sem uma funcionalidade que a implemente.
- Uma implantação deve ser verificada no próprio endereço. O CI usa o build real e a API local, mas não comprova configuração de domínio ou hospedagem não informada.

## Pendências editoriais

O mapa de currículo mantém as especializações ainda por aprofundar. Nesta edição, os oito percursos têm cobertura principal e aulas independentes iniciais; biblioteca padrão por domínio, concorrência avançada, ecossistemas, projetos maiores e outros aprofundamentos continuam previstos. Cada nova entrega deve ampliar a evidência de aprendizagem, sem reduzir a profundidade existente.

## Preservação do produto

A expansão de leitura utiliza os componentes existentes. Os arquivos de aparência, mundo e editor não precisam mudar para acrescentar aulas. Alterações futuras nessas áreas exigem verificação do comportamento que afetarem. A migração interativa deve continuar gradual e preservar o acesso à leitura extensa.

## Verificação da hospedagem nesta entrega

O bot da Vercel registra um preview Ready para a PR #3. A leitura pelo conector retornou 403 por falta de acesso ao escopo renancodandos-projects; o executor local também impediu usar o CLI. Esses resultados não comprovam o funcionamento do endereço publicado. Os gates de build e navegador do Actions continuam sendo a evidência verificável do repositório até haver acesso à implantação.

## Dependência corrigida nesta entrega

A auditoria da PR #3 identificou `source-map-js@1.2.1`, dependência transitiva de desenvolvimento usada pelo PostCSS. O [aviso GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) informa correção na versão `1.2.2`. O lockfile foi atualizado somente nesse pacote com os metadados e a integridade publicados no npm. O CI deve comprovar instalação, auditoria e compatibilidade dos builds antes da integração. A presença no build não comprova exposição do site publicado ao ataque descrito no aviso.

## Conexões e recursos desta entrega

Os novos casos de navegador verificam diálogo por teclado, retorno de foco, validade do formulário e geometria de Grid. Os programas C# verificam execução adiada e descarte antecipado. Os cronogramas PostgreSQL usam conexões diferentes e exigem o SQLSTATE esperado, evitando aceitar uma falha genérica como demonstração de concorrência. Os gates devem concluir no head específico antes da integração.

## Evidência do código integrado

O run [37566327714](https://github.com/renancodando/CodeLab/actions/runs/37566327714) aprovou 136 testes de unidade, 118 exemplos externos, três cronogramas PostgreSQL, 59 testes de navegador e os builds. O código foi integrado em 1ba1ae70ed6953124c419f06c94078bf87481b02 com a mesma árvore testada. A revisão da condição de corrida do stderr foi resolvida aguardando close; consulte a [documentação de ChildProcess](https://nodejs.org/api/child_process.html#event-close). O roteiro manual segue o comportamento de [ON_ERROR_STOP no psql](https://www.postgresql.org/docs/current/app-psql.html): a interação retorna ao prompt e exige encerrar a transação em erro.

Essas evidências validam o código desta entrega. A implantação continua pendente: as ferramentas de leitura pública e o navegador local também falharam ao acessar/iniciar a verificação, além da falta de escopo no conector. Esses erros não comprovam indisponibilidade do site.

## Entrega de aprendizagem da PR #5

O [run 37641654276](https://github.com/renancodando/CodeLab/actions/runs/37641654276) aprovou o head 35c2163b507c6f15c465aac940faac102c092b55: 248 testes de unidade, 124 exemplos externos, três cenários Git, três cronogramas PostgreSQL, 79 testes de navegador e builds. O build gerou 152 páginas; npm audit informou zero vulnerabilidades. A integração 53715e9b01993f0a5594030f1f7db04408bdf9b7 conserva a árvore testada 845ff30b1e94dc2381ef8c153ca962f9dbb16352.

Foram verificados depuração com casos de borda, assistência após resposta, domínio por habilidade, sessão diária estável, revisão por calendário local, estudo offline preparado e falha de instalação do cache. Projetos com vários arquivos retomam e exportam ZIP; alterações invalidam evidências anteriores. O navegador também conferiu quota indisponível com recuperação por exportação, backup válido acima de 2 MB e falha de restauração que preserva a jornada anterior. O limite de importação é 16 MB. As oito larguras de 220 a 4000 px passaram nos fluxos cobertos.

A rubrica dos projetos é manual. As atividades conceituais não certificam compilação; os casos do executor local são inspecionáveis. A migração interativa é parcial e o aprofundamento editorial continua. O preview da PR #5 foi informado como Ready pela Vercel, mas a ferramenta pública não conseguiu abri-lo; a implantação continua sem verificação do fluxo publicado. O executor local ainda falha na preparação de ACL e a cópia local permanece sem sincronização.

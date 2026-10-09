# Etapas restantes e critério de conclusão

## Como ler a contagem

Há **17 frentes abertas** no pedido integral: oito linguagens, seis percursos de engenharia, interatividade, correção automática, e implantação. A sincronização local foi concluída nesta entrega. Uma frente pode exigir várias aulas, problemas e entregas. Esta contagem não é uma estimativa de horas nem de aulas restantes; entradas introduzidas da matriz também não representam assuntos únicos.

A edição atual já entrega conteúdo e mecanismos funcionais. Para declarar uma próxima edição pronta, delimite sua cobertura, transforme os mecanismos em aulas e prática próprias, execute os gabaritos e fluxos, revise os resultados e confira a integração. O pedido de todos os ecossistemas e especializações ainda não tem uma lista finita auditada que permita afirmar "faltam exatamente N aulas".

## Mapa de trabalho

| # | Frente aberta | Próximo aprofundamento | Evidência para encerrar uma entrega |
| --- | --- | --- | --- |
| 1 | HTML | Arquivos e legendas reais; componentes acessíveis além do diálogo; integração de formulários. | Aulas próprias com documentos, testes de teclado/validade e exercícios aplicados. |
| 2 | CSS | Consultas de estilo e scroll-state; contenção intrínseca; outros eixos de escrita; compatibilidade e layouts complexos. | Consultas de tamanho foram integradas e verificadas no domínio. Ampliar medidas computadas, navegação e práticas próprias por mecanismo. |
| 3 | JavaScript | Descritores e protótipos; internacionalização; workers/cancelamento; módulos por host. | Programas executados, bordas e erros reais, depuração específica e projetos progressivos. |
| 4 | TypeScript | Ampliar módulos para CommonJS, pacotes/exports e outros hosts; bibliotecas reais; tipos aninhados e contratos avançados. | Node ESM/extensões/alias/import type já têm prática e artefatos conferidos. Ampliar strict, casos negativos e consumidores reais. |
| 5 | Python | Biblioteca padrão por domínio; descritores; typing; processos com falhas; distribuição. | Programas reais com limites, exceções, recursos e projetos; manter prática offline honesta. |
| 6 | C# | Frameworks de testes; ASP.NET por fluxo; EF Core com provedor; generators/AOT. | Compilação .NET e cenários reais de dados, concorrência, erros e diagnóstico. |
| 7 | C++ | Templates/concepts; allocators; corrotinas; atomics; builds com várias unidades. | C++20 e versões explicitadas; comportamento definido, bordas e medições com escopo. |
| 8 | SQL | Deadlocks; Serializable; repetição idempotente; planos realistas; migrations/restauração. | Conexões distintas, SQLSTATE específico, dados e restauração efetivamente conferidos. |
| 9 | Algoritmos | Expandir as três etapas iniciais para busca, ordenação, análise e estratégias. | Mais de um problema por família, complexidade justificada e casos de transferência. |
| 10 | Estruturas de dados | Ampliar estruturas, invariantes e custo das operações. | Implementação, uso aplicado, casos vazios/degenerados e escolha entre estruturas. |
| 11 | Redes | Protocolos, HTTP, falhas, latência e comunicação entre processos. | Experimentos reproduzíveis, diagnóstico e testes de condições adversas. |
| 12 | Git | Conflitos, histórico, colaboração, recuperação e automação. | Repositórios descartáveis, comandos conferidos e exercícios de recuperação. |
| 13 | Testes | Unidade, integração, navegador, dublês e testes de propriedades. | Suítes que detectem falhas reais e documentem limites, sem espelhar a implementação. |
| 14 | Arquitetura | Limites, dependências, mudanças, decisões e evolução dos projetos. | Projeto maior revisado por rubrica, fluxo integrado e justificativas verificáveis. |
| 15 | Interatividade | Migrar progressivamente aulas que ainda não têm pausas ligadas à teoria. | Atividades a cada poucos blocos, persistência, offline e pré-requisitos pedagógicos em todo o catálogo; a entrega atual prepara apenas as novas pausas avançadas. |
| 16 | Correção automática | Ampliar verificadores específicos para práticas abertas e diagnósticos. | Casos comuns e de borda, erros úteis sem resposta imediata e rejeição de soluções frágeis. |
| 17 | Implantação | Conferir o fluxo no endereço público e configuração da hospedagem. | Rotas, recursos, offline, progresso e indisponibilidade do executor no ambiente publicado. |

## Ordem imediata

1. Conferir o CI do checkpoint e a main atual antes de editar.
2. Priorizar o motor meteorológico solicitado: evidência, continuidade, fontes viáveis, testes e verificação publicada. Esta frente ambiental é adicional às 17 frentes curriculares/de implantação acima; seus limites estão em docs/meteorologia.md.
3. As expansões CSV, módulos TypeScript, conceitos C++ e closures foram integradas e verificadas publicamente até a PR #22. Concluir os gates da prática SQL de ausência/contratos e das novas pausas HTML de imagens; resolver o download PostgreSQL no CI e integrar somente os heads aprovados. As demais especializações continuam abertas; três pausas não encerram uma linguagem.
4. Evoluir laboratório TypeScript/SQL, simulações didáticas Git/HTTP, diagnóstico e projetos conforme o pedido mais recente, sem tratar lista de temas como aulas completas.

## Limites que continuam explícitos

Projetos abertos têm revisão manual. Exercícios conceituais offline não comprovam execução ou compilação. O CI valida o repositório e o build que testa; ele não comprova sozinho a implantação pública. Falhas das ferramentas de acesso não demonstram que o site esteja fora do ar. O armazenamento é local, sem contas nem sincronização remota.

A revisão espaçada, sessão diária, domínio por habilidade, projetos progressivos e responsividade já possuem implementação e evidências no CI; permanecem sujeitos a regressões e novos cenários. Não devem reaparecer como funcionalidades completamente ausentes na retomada.

## Frente encerrada nesta retomada: sincronização local

O checkout `work/CodeLab` foi sincronizado com main, mantendo os dois commits anteriores na branch local `local-preservado-20261007`. Os três arquivos não rastreados foram preservados em `outputs/preservado-local-20261007`, com SHA256 no manifest.json. A falha anterior de preparação de ACLs foi contornada sem alterar ACLs do sistema; nesta retomada, leituras/edições no workspace funcionaram no executor padrão, e a publicação usou a autorização de rede necessária. Conferir o estado Git antes das próximas atualizações.

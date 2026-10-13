# Etapas restantes e critério de conclusão

## Como ler a contagem

A edição a concluir usa o catálogo existente, os seis percursos de engenharia e os oito projetos. A orientação de 12 de outubro substitui a expansão sem limite: aprofundar aprendizagem, prática, correção e estabilidade sem aumentar aulas por quantidade. A [fila gerada de aulas sem pausas](aulas-sem-pratica.md) identifica cada lacuna e sua prioridade; as [métricas geradas](metricas-catalogo.md) são a fonte das contagens atuais.

Encerrar uma lacuna exige habilidade concreta, teoria que prepare a tentativa, previsão/diagnóstico/alteração quando adequados, casos de borda, feedback, assistência, revisão e aplicação. Ter uma pausa não encerra uma aula. Concluir esta edição exige cobertura ativa próxima de completa, fundamentos densos, projetos utilizáveis e percursos consistentes, exemplos comprovados, nenhuma inconsistência grave conhecida, documentação sincronizada e validação de CI, produção, offline, dados locais, acessibilidade e responsividade. A auditoria final acontece depois da implementação; não há meta de cobrir tudo que existe em programação.

## Mapa de trabalho

| # | Área da edição | Aprofundamento nas aulas existentes | Evidência para encerrar uma entrega |
| --- | --- | --- | --- |
| 1 | HTML | Arquivos e legendas reais; componentes acessíveis além do diálogo; integração de formulários. | Aulas existentes aprofundadas com documentos, testes de teclado/validade e exercícios aplicados. |
| 2 | CSS | Consultas de estilo e scroll-state; contenção intrínseca; outros eixos de escrita; compatibilidade e layouts complexos. | Consultas de tamanho foram integradas e verificadas no domínio. Ampliar medidas computadas, navegação e práticas próprias por mecanismo. |
| 3 | JavaScript | Descritores e protótipos; internacionalização; workers/cancelamento; módulos por host. | Programas executados, bordas e erros reais, depuração específica e projetos progressivos. |
| 4 | TypeScript | Ampliar módulos para CommonJS, pacotes/exports e outros hosts; bibliotecas reais; tipos aninhados e contratos avançados. | Node ESM/extensões/alias/import type já têm prática e artefatos conferidos. Ampliar strict, casos negativos e consumidores reais; a bancada local foi integrada na PR #34 e verificada no domínio; projetos de múltiplos arquivos continuam abertos. |
| 5 | Python | Biblioteca padrão por domínio; descritores; typing; processos com falhas; distribuição. | Programas reais com limites, exceções, recursos e projetos; manter prática offline honesta. |
| 6 | C# | Frameworks de testes; ASP.NET por fluxo; EF Core com provedor; generators/AOT. | Compilação .NET e cenários reais de dados, concorrência, erros e diagnóstico. |
| 7 | C++ | Templates/concepts; allocators; corrotinas; atomics; builds com várias unidades. | C++20 e versões explicitadas; comportamento definido, bordas e medições com escopo. |
| 8 | SQL | Deadlocks; Serializable; repetição idempotente; planos realistas; migrations/restauração. | Conexões distintas, SQLSTATE específico, dados e restauração efetivamente conferidos. |
| 9 | Algoritmos | Expandir as três etapas iniciais para busca, ordenação, análise e estratégias. | Mais de um problema por família, complexidade justificada e casos de transferência. |
| 10 | Estruturas de dados | Ampliar estruturas, invariantes e custo das operações. | Implementação, uso aplicado, casos vazios/degenerados e escolha entre estruturas. |
| 11 | Redes | Protocolos, HTTP, falhas, latência e comunicação entre processos. | Experimentos reproduzíveis, diagnóstico e testes de condições adversas. |
| 12 | Git | Ampliar o modelo interativo de preparação para conflitos, branches, colaboração e recuperação. | A bancada inicial compara trabalho/preparação/HEAD e é conferida contra Git real; demais operações continuam com experimentos externos. Exigir repositórios descartáveis e recuperação efetiva. |
| 13 | Testes | Unidade, integração, navegador, dublês e testes de propriedades. | Suítes que detectem falhas reais e documentem limites, sem espelhar a implementação. |
| 14 | Arquitetura | Limites, dependências, mudanças, decisões e evolução dos projetos. | Projeto maior revisado por rubrica, fluxo integrado e justificativas verificáveis. |
| 15 | Interatividade | Migrar progressivamente aulas que ainda não têm pausas ligadas à teoria. | Atividades a cada poucos blocos, persistência, offline e pré-requisitos pedagógicos em todo o catálogo; a distribuição corrente é gerada em [métricas do catálogo](metricas-catalogo.md), e as verificações publicadas estão em [continuidade](continuidade.md). A contagem exclui os 25 passos do percurso próprio de valores e outros mecanismos. |
| 16 | Correção automática | Ampliar verificadores específicos para práticas abertas e diagnósticos. | Casos comuns e de borda, erros úteis sem resposta imediata e rejeição de soluções frágeis. |
| 17 | Implantação | Conferir o fluxo no endereço público e configuração da hospedagem. | Rotas, recursos, offline, progresso e indisponibilidade do executor no ambiente publicado. |

## Ordem imediata

1. Conferir main, PRs, revisões, workflows e deployment reais antes de editar. Resolver entregas pendentes pelo head atual; manter testes e limites.
2. Integrar somente árvore verificada, confirmar deployment READY, SHA e alias e executar os fluxos públicos relevantes. O CI não substitui essa conferência.
3. Seguir a fila gerada: fundamentos comuns, fundamentos/aplicações de cada linguagem, consolidação e engenharia/especialização. Agrupar por aula ou assunto; preferir previsão, diagnóstico e produção sem forçar perguntas superficiais.
4. Fortalecer os corretores e as referências executadas dentro de cada grupo. Preservar as bancadas TypeScript, SQLite, Git e HTTP já entregues; desenvolver os percursos e projetos existentes quando a aplicação das aulas exigir.
5. Manter clima e mundo funcionais, corrigindo regressões concretas. A expansão ambiental deixa de ser a prioridade de conclusão; as limitações honestas das fontes continuam em meteorologia.md.
6. Depois da cobertura e das validações incrementais, realizar a auditoria final pelos critérios desta edição. Histórico de integrações, falhas e evidências permanece em continuidade.md e no Git.

## Limites que continuam explícitos

Projetos abertos têm revisão manual. Exercícios conceituais offline não comprovam execução ou compilação. O CI valida o repositório e o build que testa; ele não comprova sozinho a implantação pública. Falhas das ferramentas de acesso não demonstram que o site esteja fora do ar. O armazenamento é local, sem contas nem sincronização remota.

A revisão espaçada, sessão diária, domínio por habilidade, projetos progressivos e responsividade já possuem implementação e evidências no CI; permanecem sujeitos a regressões e novos cenários. Não devem reaparecer como funcionalidades completamente ausentes na retomada.

## Frente encerrada nesta retomada: sincronização local

O checkout `work/CodeLab` foi sincronizado com main, mantendo os dois commits anteriores na branch local `local-preservado-20261007`. Os três arquivos não rastreados foram preservados em `outputs/preservado-local-20261007`, com SHA256 no manifest.json. A falha anterior de preparação de ACLs foi contornada sem alterar ACLs do sistema; nesta retomada, leituras/edições no workspace funcionaram no executor padrão, e a publicação usou a autorização de rede necessária. Conferir o estado Git antes das próximas atualizações.

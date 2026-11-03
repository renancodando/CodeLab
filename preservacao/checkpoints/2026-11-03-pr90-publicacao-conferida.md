# PR #90: publicação conferida — 03/11/2026

PR https://github.com/renancodando/CodeLab/pull/90
Head verificado fa13ceac0db38f40626afe4b3b9b0e248f90c7a6
Main/merge a2dacf91f0da2128fe9072fb82b92b0d46d07723
Árvore do merge igual à do head: 31d1523fb9b7c87fa4db19219909e2629413ace5
Pais: 5ab7a7d8a9c57d9c89cbcd126845cb35b281f10f e fa13ceac0db38f40626afe4b3b9b0e248f90c7a6

Revisão code_review concluída no próprio fa13cea, sem apontamentos ou threads pendentes. O parecer antigo b4c027a não foi reutilizado; novo evento ready_for_review solicitou revisão após o push. security_review não executada.

CI 41637900287 success, 12:41:55–12:49:00 UTC (7 min 5 s): 124 testes em três arquivos, build/157 páginas e 31 fluxos Chromium (5,2 min). Cenário offline corrigido passou em 18,8 s. O arquivo compartilhado foi validado porque duas referências foram movidas integralmente para a família da aula; não houve exclusão de cenários/assertivas. Sem famílias de compiladores de exemplos ou PostgreSQL. Servidor .NET compilado apenas para as referências já existentes sem JavaScript.

Falha anterior 41505001844: leitura imediata de scrollWidth durante redimensionamento. Trace e reconstrução estática documentados no checkpoint 2026-11-03-pr90-sincronizacao-em-validacao.md. Correção somente no teste: dois frames de layout após setViewportSize, com <=1 px, 220/4000 e visibilidade preservados. Sem alterar CSS, esconder conteúdo, elevar timeout/retries ou alegar defeito persistente sem reprodução. Dois ensaios locais do único cenário chegaram ao limite de 60 s e não foram aprovados; a validação concluída vem do CI do head novo e dos contratos públicos. Não repetir a investigação antiga. Build redundante/prévias locais encerradas e artefatos do CI reutilizados.

Pós-merge 41639014301 success: build e somente dois smokes (45,9 s). Deployment dpl_4A8snDbY2UQTUWiVrFZQYPxugqqK READY/production; SHA igual ao merge, projeto prj_XgncY54wYGiSgPH0n1JOol3UFWCn e alias code-lab-omega.vercel.app conferidos antes e depois de três contratos públicos aprovados (2,6 min): axe/220–4000 (55,3 s), offline Python/C#/C++ sem submissões (45,5 s), exportação/importação de progresso (42,5 s). Não é publicação inferida por CI ou preview.

Publicado: 137 aulas, 246 atividades, 111 aulas com pausas e 26 sem. html-arvore-semantica recebe duas pausas distintas: HTML normal/void e destino/foco/Tab. Respostas do aluno conceituais offline; referências realmente interpretadas pelo navegador. Teoria, exemplo, solução, dois problemas abertos e projeto originais preservados. Projeto continua produção independente/revisão manual, não aprovação automática. Presença de pausa não conclui linguagem ou edição.

Checkout main limpo e sincronizado; não há PR aberta nem fonte apenas local. Logs/artefatos diagnósticos permanecem em outputs, fora do produto, e não são trabalho-fonte pendente. Próxima lacuna gerada: html-texto-links. Além da fila, continuar profundidade/prática independente, projetos e critérios de conclusão do escopo finito. Não expandir clima, catálogo ou recursos. Usar validação proporcional de 26/10. Esta branch de preservação não deve ser integrada.

Este recibo substitui as pendências dos checkpoints 2026-11-02-html-arvore-em-validacao.md e 2026-11-03-pr90-sincronizacao-em-validacao.md e o estado de preparação registrado em docs/continuidade.md no commit da entrega. A edição ainda não está finalizada.

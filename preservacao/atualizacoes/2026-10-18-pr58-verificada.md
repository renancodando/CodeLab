# PR #58 integrada e implantação conferida — 18 de outubro de 2026

## Retomada atual pelo GitHub

Main: fa94605b500a26298c5ce42080a24417ac50cc7c. Checkout sincronizado por fast-forward, sem alterações nem commits somente locais. As branches anteriores permanecem preservadas. A PR #58 é https://github.com/renancodando/CodeLab/pull/58.

Head aprovado e77fee8ba4109076f8b501894373c0b16308e7d9; árvore ac6bba7e5c42a1dd439d4e9ad1c299a4aab1ebb4 igual ao merge real e à integração virtual. Pais conferidos: 46947703b5442a8ecf77be8ab64db276e7ec2445 e e77fee8ba4109076f8b501894373c0b16308e7d9. Revisões sem tópicos pendentes no momento da integração.

## Problema corrigido

O pós-merge anterior, run 39152421764 do SHA 4694770, falhou em três tentativas antes dos testes por Data limit exceeded no espelho ECR. Ele permanece falho no histórico; não foi tratado como verde.

O preparador agora tenta duas fontes oficiais da imagem PostgreSQL 18, exige prontidão TCP e confirmação SQL da versão antes dos testes e falha se as fontes ou o banco não atenderem ao contrato. Limpa o contêiner/volume descartáveis ao terminar. Nenhum teste, conexão real, exemplo ou parcela foi removido; prazos de 40/35 min mantidos. O helper não faz parte do runtime do produto.

Oito testes locais com executor controlado passaram em 2,63 s, sem Docker real neste PC. O log está preservado também no lote textual pr57/postgres-ci-especificos-final-20261018.log; esses oito testes pertencem à correção da PR #58, não ao head curricular da PR #57.

## Evidência real no CI

CI 39153840827, primeira tentativa: seis jobs aprovados no head e77fee8ba4109076f8b501894373c0b16308e7d9. Foram 1120 unitários, 194 exemplos externos compilados/executados, três cronogramas PostgreSQL com conexões distintas e 209 cenários de navegador em 54/58/49/48. Parcela mais longa: 25,5 min dentro dos 35 existentes.

Nessa execução o ECR recusou o pull, a imagem oficial postgres:18 do Docker Hub foi realmente usada, a versão foi confirmada por SQL, e o banco executou os verificadores. A etapa de limpeza terminou com sucesso. Isso exercitou a alternativa real, além dos testes controlados; não garante que fontes externas nunca terão quotas.

Pós-merge atual 39156279465, SHA fa94605b500a26298c5ce42080a24417ac50cc7c: preparação do PostgreSQL passou na primeira tentativa a partir do ECR. Testes/compilação e auditoria concluídos, com 1120 unitários, 194 exemplos externos e três cronogramas reais aprovados. Quatro parcelas de navegador ainda em execução na última conferência; confirmar o estado final antes de declarar esse pós-merge integralmente verde.

## Implantação e fluxos públicos

Deployment dpl_8argu5aCdnEThry4xzfdiKCJAeHz READY/production, projeto prj_XgncY54wYGiSgPH0n1JOol3UFWCn, gitSource.sha fa94605b500a26298c5ce42080a24417ac50cc7c. O alias code-lab-omega.vercel.app resolve para o mesmo deployment e SHA.

Não há mudanças em src, dependências, runtime ou bundle nesta correção. O CI preservou index-Jq7BArVK e world-Cra_f0Wo, 247,20/135,93 kB gzip. Quatro fluxos públicos relevantes passaram em 1,0 min: ambas as aulas com assistência/revisão, axe e 220/4000 px, exportação/exclusão/restauração do backup e retomada offline. O lote curricular anterior já foi conferido com vinte fluxos públicos em 4,7 min; seus resultados e falhas locais anteriores estão preservados.

Log desta conferência: pr58/ci-registros-publico-58.log, SHA256 b086640af3ff50a076661d3aed455dcf65db54c4cd640514c51ec752b7457574, objeto Git aacdb94806e4feac3b3f498b2ce85a86a89b13e7. Os arquivos foram copiados sem alterar seus bytes. Credenciais e artefatos regeneráveis continuam fora do arquivo textual.

## Próxima etapa

Publicado: 137 aulas preservadas, 167 atividades, 83 aulas com pausas e 54 sem. Ter uma pausa não encerra profundidade curricular; a edição não está finalizada.

Conferir o pós-merge atual e então reaproveitar as branches remotas pratica/dom-selecao e pratica/dom-eventos contra a nova main, sem duplicar conteúdo. Continuar seleção/eventos e depois estado de formulário pela fila gerada. Manter os projetos, práticas de produção, correção, exemplos executados e distinção entre conceito e execução.

Fonte desta retomada: main no GitHub, docs/continuidade.md, docs/aulas-sem-pratica.md e os checkpoints remotos pr57/pr58. Não reaplicar scripts de arquivo antigos nem integrar a branch de preservação ao produto.

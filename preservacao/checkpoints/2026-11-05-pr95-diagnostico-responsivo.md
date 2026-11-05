# PR #95 — diagnóstico pendente, sem merge

Branch conteudo/html-css-plataforma-20261104; head remoto conferido 414a14b338d1456b7f223773cf6748dfc255884c.
Main permanece 8bf105b652cd7271427f35cb5a8b1292ae918893 (L03/PR #94 publicada). Três lotes entregues, L04 em andamento; não contar a PR #95 como entregue nem reiniciar doze.

CI inicial 42022357890 no head 5779a43: 205 testes, tipos/catálogo/build aprovados. Vinte de 21 fluxos aprovados, incluindo cinco referências nativas DOM/CSS e as jornadas CSS. A jornada html-plataforma encontrou overflow de 436 px no teste de 220 px. Causa ainda não comprovada; não afirmar falha independente nem correção.

Artefatos baixados do GitHub e hashes conferidos: browser 78cfea55fb9548fd93891caa870c147f98e7d500ed6eaf6237c95bfe3ea70ffd, compilado dcd54d59a4def5df5a7a36e83dbe04797633a788d8e5783821355b7fadb0448a. Preview Vercel protegido, sem desativar proteção ou criar segredo. O artefato foi servido numa porta isolada, sem substituir dist nem fazer outro build.

Diagnósticos locais no Edge com largura inicial pequena, redimensionamento e estado retomado/axe não reproduziram o excesso. A jornada completa isolada no artefato ultrapassou 60 s no redimensionamento depois das asserções de persistência/assistência. Não é aprovação. Timeout e asserção mantidos. Primeiro comando de filtro com âncora não descobriu teste; o filtro pelo título executou somente um cenário, sem repetir os demais.

Head 414a14b acrescenta registro das caixas fora da viewport apenas se houver excesso. Nenhuma asserção foi removida. Nova revisão do próprio head solicitada por draft/ready; CI próprio em andamento. Conferir logs se repetir, identificar a causa e corrigir, repetir primeiro o cenário afetado e então gates proporcionais. Não integrar antes disso.

Fonte, testes e documentação estão commitados/enviados. A publicação continua com 137 aulas, 278 atividades, 122 com pausas e 15 sem. O checkout L04 contém 287/125/12, ainda não publicado. Após concluir L04, seguir L05–L12. Checkpoint anterior de preparação preservacao/checkpoints/2026-11-05-pr95-preparacao.md contém os detalhes das nove atividades e do seletor AST.

Apenas o preview local do artefato na porta 5175 foi mantido para diagnóstico nesta execução; servidor dev 5174 encerrado. Evidências auxiliares estão em outputs/pr95-artefatos-20261105 e l04-*; o código relevante está no GitHub. Preserve aparência, clima, sandbox, Workers, limites, local-first/offline e backups. Não ampliar escopo para contornar esta falha.

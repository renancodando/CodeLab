# L04 em validação — PR #95

PR https://github.com/renancodando/CodeLab/pull/95
Branch conteudo/html-css-plataforma-20261104
Head remoto conferido 5779a43e2829a3b11afa992566b2e194045e2e51
Base/main 8bf105b652cd7271427f35cb5a8b1292ae918893.
Três commits pequenos: 81cbb94 (nove pausas/teoria/testes/métricas), 852886b (continuidade) e 5779a43 (recorte de validação). Todos enviados; checkout limpo.

L01 #92, L02 #93 e L03 #94 publicados: três de aproximadamente doze lotes, sem reiniciar contagem. Recibo mais recente de publicação: preservacao/checkpoints/2026-11-04-pr94-publicacao-conferida.md, commit 2afcfb581cd0416795a82e2b873d45ccda63a877, conteúdo conferido.

L04 trabalha html-plataforma, css-visual-movimento e css-arquitetura. Fragmentos, callbacks/listeners, texto seguro, fases de animação, composição, camadas, subgrid e revert-layer. Respostas são conceituais; referências no navegador não equivalem a executar o código do estudante. Projetos abertos mantêm produção e revisão manual. Aparência e isolamento preservados.

Local: 12 testes próprios e o cenário adicional de equivalência numérica aprovados; 27 testes do seletor e o caso refinado de CRLF aprovados. Tipos passaram após o campo accepted obrigatório ter sido acrescentado na reconstrução. Catálogo/métricas gerados; oito novos cenários descobertos. Não repetir build/navegador local: CI do próprio head é o gate.

O seletor compara objetos de aula HTML/CSS por AST. Alteração fora dos objetos ou leitura impossível mantém o recorte amplo. Plano atual: seis arquivos unitários, dois de navegador + seis contratos compartilhados; nenhum compilador nativo alheio. Plano inicial era 18/8 por imports do módulo inteiro. Isso mede seleção, não tempo comparável de CI ainda.

Checkout gerado: 137 aulas, 287 atividades, 125 aulas com pausas, 12 sem. Publicado permanece 278/122/15 na PR #94 até gates próprios. CI/revisão de #95 pendentes, nunca considerados aprovação. Depois de gates: conferir base/árvore, integrar head exato, pós-merge dois smokes, deployment READY/SHA/projeto/alias e três contratos públicos distintos, conferir alias depois e registrar recibo.

Após L04 entregue, restam aproximadamente oito lotes, L05 próximo (duas aulas assíncronas JS e três de genéricos/tipos TS). A edição não está finalizada pela presença de pausas. Não criar aulas/funcionalidades para inflar números, não reabrir meteorologia e não repetir baterias integrais por rotina. Documentos de continuidade/fila/etapas/estratégia sincronizados.

# PR #95 — head com geometria separada

Branch conteudo/html-css-plataforma-20261104; head remoto b8a511aa4d0400d2c96cd6ce0887152070fbc0a2.
Main continua 8bf105b652cd7271427f35cb5a8b1292ae918893 (L03 publicada). Três de aproximadamente doze lotes entregues; L04 aguarda gates próprios. Sem reiniciar a contagem.

CI de diagnóstico 42026474945 no head 414a14b: 205 testes, tipos/build e 21/21 fluxos aprovados (5,2 min de navegador); revisão desse head sem achados. Não aprova b8a511a. O primeiro CI 42022357890 falhou uma medição imediata de overflow, 436 px em 220; aplicação não mudou entre essas duas rodadas. A causa exata ainda não foi comprovada; não alegar correção de defeito da aplicação ou independência da instabilidade.

O head b8a511a separa geometria/acessibilidade da jornada completa offline/persistência, sem retirar asserções. O cenário de layout usa um estado retomado controlado, conserva solução visível e seis linhas, controla largura 220/4000 após dois quadros e mantém overflow global ≤1 px e axe em main. São nove cenários próprios, antes oito; timeout 60 s intacto. Repetição local somente desse cenário no artefato do CI excedeu 60 s e não é aprovação. Não repetir toda a suíte local para isso.

Nova revisão do head solicitada por draft/ready, CI próprio em andamento. Fonte/documentação enviadas, checkout limpo. PR descreve o histórico e os limites reais. Artefatos anteriores e hashes estão no checkpoint pr95-diagnostico-responsivo.md, commit bf910e300422032f44dcdd4ff94be6d0658df43b. Preview local 5175 encerrado, dev 5174 encerrado; nenhum helper necessário foi deixado rodando.

Aguardar/checkar CI/revisão do head exato, resolver falhas reais, conferir árvore/base antes do merge e então deployment READY/SHA/projeto/alias e os contratos públicos distintos. Não considerar a PR publicada pelo verde anterior. Aplicação publicada permanece 278 atividades/122 aulas com pausas/15 sem. L04 preparado tem 287/125/12, mantendo 137 aulas, visual, mundo/clima, isolamento e progresso local. Após entregar L04, aproximadamente oito lotes restantes, L05 próximo.

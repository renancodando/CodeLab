# PR #92: recusa sem mutação corrigida

Head atual enviado `9f2e7eac0626d27e24fa132df4a9db60e71013ac`, branch `conteudo/fullstack-pratica-20261103`. A revisão do head anterior `6b4ab0d` encontrou um P2 real: entradas inválidas de prepararCadastro não eram comparadas depois de TypeError.

Corrigidos os dois grupos de recusa, com fotografia antes/depois. Dois mutantes novos alteram título/formato antes de lançar. Dez cenários de cadastro passaram em 3,63 s, repetindo somente o contrato afetado; a suíte específica passa a ter 59 casos no total, para conferência consolidada no CI. Thread antiga resolvida após o push. PR foi marcada rascunho/pronta uma vez para obter revisão do novo SHA, não reaproveitar a anterior.

CI novo `41686225948` pendente quando registrado; CI antigo `41685722109` foi substituído e não deve ser usado como aprovação deste head. Conferir novo CI, revisão/threads e base atual antes de merge. Mantêm-se as métricas da branch 137/264/117/20 e produção anterior 249/112/25. L01 ainda não publicado. Não repetir navegador/build local.

Retomada: aguardar gates atuais; conferir árvore, integrar, conferir pós-merge, deployment real e três contratos públicos proporcionais. Depois registrar L01 entregue e seguir L02 do plano de aproximadamente 12 lotes contado da PR #91. Não reiniciar a contagem.

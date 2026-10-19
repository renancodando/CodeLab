# PR #60 em validação, ainda não integrar

Branch pratica/formulario-estado, commit 058c8ebc177beaa346e26620e0065b7c12f3b5d1, baseado em main 541b97a84edb21c5a4156b3ec76fa916306abcfe. A PR está anexada ao chat. A implementação da aula, corretor executado e seis cenários de navegador estão commitados e enviados. Métricas da branch: 137 aulas, 174 atividades, 86 com pausas, 51 sem; ainda não publicadas.

Passaram 55 testes específicos, incluindo soluções equivalentes/mutantes JavaScript reais e regressões adaptativas/DOM. O primeiro teste da aula demonstrou exclusão do desafio JS pela preferência HTML; a correção provisória cobre apenas a preparação apresentada naquele plano. Os logs da falha e da correção e os dois arquivos de configuração de navegador estão preservados em preservacao/atualizacoes/pr60.

A revisão Codex do head 058c8eb encontrou um caso restante correto: depois de marcar a preparação HTML como vista, se o desafio JavaScript ficou sem tentativa até o dia seguinte, ele não reaparece, pois a exceção depende do conceito atual. Tópico PRRT_kwDOUi7gEc6t8guQ, adaptive.ts:229. Não resolver o tópico nem integrar antes de corrigir e comprovar um novo head.

Próxima ação: manter elegíveis as atividades ainda não aprovadas vinculadas a uma preparação já vista e compatível com o idioma preferido. Conservar os filtros de pré-requisitos e assunto, sem liberar desafios de preparações desconhecidas ou alheias à preferência. Acrescentar teste do dia seguinte e exclusão de idioma alheio. A suíte integral e build locais do head 058c8eb ainda estão em execução serial; não editar durante essa validação nem chamar seu resultado de aprovação do futuro head corrigido. Novo head exige seus testes específicos, build, navegador, CI completo e revisão própria.

CI atual 39262827796 do head antigo em execução. A PR #59 já tem CI/pós-merge completos, deployment READY/SHA/alias e verificações públicas registradas em 2026-10-19-pr59-publicada.md. A aula de formulário só será publicada depois dos próprios gates. Próxima lacuna depois dela: componentes.

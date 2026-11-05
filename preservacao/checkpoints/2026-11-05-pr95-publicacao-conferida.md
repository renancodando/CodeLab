# L04 publicado — PR #95

PR https://github.com/renancodando/CodeLab/pull/95 integrada.
Head revisado b8a511aa4d0400d2c96cd6ce0887152070fbc0a2.
Main/merge ef6ad8ca634aed3ea3738715fc53b90016d6d1d0.
Árvore dd0a007e28594a0f6325e7c5373e95024f66be8f, igual ao head; pais 8bf105b652cd7271427f35cb5a8b1292ae918893 e b8a511aa4d0400d2c96cd6ce0887152070fbc0a2.
Checkout sincronizado por fast-forward e limpo. Todos os commits enviados.

Revisão do head exato concluída sem achados ou threads pendentes. CI 42028558651 aprovado, 12:36:20–12:40:48 UTC: 205 contratos/tipos/catálogo/build e 22 fluxos Chromium em 2,5 min. Nove cenários próprios, incluindo referências DOM/CSS e layout separado (4,5 s). Plano recortado de 18 para seis arquivos unitários e de oito para dois de navegador, com contratos gerais distintos preservados e seleção ampla quando a estrutura do módulo muda. Não é uma medição comparável de ganho de tempo.

Pós-merge 42029356375 aprovado no SHA exato; jobs 127251519697,127251631432,127252053092. Dois smokes aprovados em 30,5 s: HTML isolado 18,2 s e WASM/CSP 10 s. Sem repetir unitários ou referências.

Deployment dpl_9Whcdj3fv81ZBv6pZNF9B9wM6frC conferido antes/depois dos contratos públicos: READY, production, SHA ef6ad8ca634aed3ea3738715fc53b90016d6d1d0, projeto prj_XgncY54wYGiSgPH0n1JOol3UFWCn, alias code-lab-omega.vercel.app.
Primeira rodada pública: offline e backup/importação aprovados; acessibilidade/responsividade excedeu 60 s. Não foi tratada como aprovação. Repetição somente desse cenário, sem alterar timeout/assertivas: aprovado em 38,3 s, processo encerrado zero (rodada 58,7 s). Os outros dois não foram repetidos. Assim os três contratos públicos distintos foram verificados no mesmo deployment, confirmado novamente depois. Chronos foi consultado como diagnóstico local; inspeção não concluiu e foi encerrada, sem atribuir causa ao computador nem mudar configurações.

Publicado: 137 aulas, 287 atividades, 125 aulas com pausas, 12 sem. Nove novas pausas em html-plataforma, css-visual-movimento e css-arquitetura. São respostas conceituais; referências executadas no navegador não equivalem a executar o código do estudante. Exercícios e projetos abertos mantêm produção manual e rubricas. Identidade, mundo/clima, editor, sandbox/Workers, limites, lazy loading e progresso local preservados.

Histórico que deve permanecer visível em L12: o CI inicial 42022357890 teve uma leitura imediata de overflow de 436 px em 220 px. O head de diagnóstico seguinte 414a14b passou 21/21 sem alteração da aplicação. A causa exata não foi comprovada. O teste final separa geometria da jornada, usa estado retomado controlado, aguarda dois quadros de renderização, conserva overflow global ≤1 px, solução/controles/conteúdo e axe em main. Não alegar correção de um defeito da aplicação sem evidência. Reproduções locais que excederam 60 s não foram contadas como aprovação. Nenhuma asserção foi retirada e nenhum limite aumentado.

L01 #92, L02 #93, L03 #94 e L04 #95 entregues: quatro dos aproximadamente doze lotes da orientação de 03/11. Restam aproximadamente oito, L05–L12. Próximo L05: js-assincrono, js-promessas-contratos, ts-genericos, ts-genericos-relacoes, ts-tipos-avancados. Não reiniciar doze, não criar aulas por quantidade. Cobertura de pausas não encerra profundidade, projetos, percursos ou validação final.

Servidores locais de diagnóstico 5174/5175 e inspeção encerrados. Artefatos originais estão no GitHub Actions com hashes registrados nos checkpoints anteriores; outputs locais são auxiliares. O trabalho relevante e o recibo estão remotos para retomada sem este PC. Continuar pela documentação/fila geradas, mantendo validação proporcional.

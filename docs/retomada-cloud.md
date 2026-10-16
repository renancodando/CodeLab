# Retomada do CodeLab pelo GitHub

Checkpoint de preservação solicitado em 15 de outubro de 2026, horário de São Paulo. Este documento permite retomar sem os arquivos deste PC.

## Onde continuar

- Repositório: https://github.com/renancodando/CodeLab
- Branch de trabalho: `pratica/css-flex-grid`.
- PR atual: https://github.com/renancodando/CodeLab/pull/56
- Cópia dos arquivos auxiliares e do checkpoint externo: branch `preservacao/retomada-cloud-20261015`, diretório `preservacao/local/` e seu manifesto com SHA256.
- Os dois commits antigos da branch local preservada estão em `preservacao/local-anterior-20261007`, head `80be23df03897f55be5122b27cf36fa9006e3ab2`.
- Três revisões históricas que só estavam no reflog foram preservadas em `preservacao/historico-e1aaefa`, `preservacao/historico-7d491d3` e `preservacao/historico-69a20c2`. São cópias históricas, não sugestões de integração.

## Estado funcional

Main e produção conferidos em `e344e8a0b7806689d4a36df2e25f43c780a86376`, entrega da PR #55. Deployment `dpl_HGgGXDb9zaX3LPFPr98NNHcedhHu`, READY/production, domínio https://code-lab-omega.vercel.app. Dez fluxos públicos Edge passaram em 3,6 min. CI pós-merge `38772197361` aprovado integralmente. A nova prática Flexbox/Grid ainda não foi integrada nem verificada em produção.

O código da PR #56 foi enviado no commit `2c545be952327d8f3294358bcc2a93ade975f31c`. Cinco atividades nas aulas originais flex-position e grid-responsivo preservam os doze capítulos e projetos: eixos, bloco de referência, quebra, trilhas vazias e consulta pelo ancestral. As respostas são conceituais; referências CSS nativas são medidas no navegador. Não há execução de CSS livre do aluno.

Validações desse código:

- 34 testes específicos; 1106 unitários em 66 arquivos, 78,49 s.
- Strict/build aprovado: 157 páginas, inicial 244,49 kB gzip, mundo 135,93 kB; 38 recursos essenciais e seis opcionais; offline `233f97b71530d81e18df`.
- Onze fluxos Edge locais em 50,2 s: medidas reais com alternativas defeituosas, teclado, aulas, assistência, revisão, axe, 220/4000 px e offline, com regressões de cascata/unidades.
- CI `38835917513` completo aprovado no head `2c545be952327d8f3294358bcc2a93ade975f31c`: seis jobs, 194 exemplos externos compilados/executados, PostgreSQL em conexões distintas e 200 cenários de navegador em 52/51/49/48. Os prazos e todos os cenários foram preservados; a matriz tem quatro parcelas.
- A primeira execução unitária local foi interrompida; seus logs e expirações de memória/backup/gerador foram preservados. A retomada passou sem mudar limites.

Este commit acrescenta documentação de retomada. O CI do head anterior não aprova automaticamente o novo head: conferir a execução gerada após este checkpoint antes de qualquer merge.

## Próxima ação concreta

1. Conferir main, o head real da PR #56, seu CI completo e as revisões atuais.
2. Resolver falhas ou revisões; comparar árvore e pais, integrar apenas o head verificado.
3. Confirmar deployment READY, SHA real e alias, e executar os onze fluxos relevantes no domínio. Só então declarar a prática publicada.
4. Seguir `docs/aulas-sem-pratica.md`: primeiro animacoes, depois fundamentos DOM conforme dependências. Não aumentar aulas por quantidade.

A branch contém 137 aulas, 163 atividades e 81 aulas com pausas; 56 ainda sem pausas. Produção conferida tem 158 atividades, 79 aulas com pausas e 58 sem. As contagens vêm do catálogo gerado; uma pausa não encerra a profundidade da aula.

## Regras que continuam valendo

Finalizar a edição curricular existente com aprendizagem ativa, exemplos executados quando possível, diagnóstico, casos de borda, feedback, assistência e revisão. Preserve os seis percursos, oito projetos, identidade visual, mundo/clima, sandbox, Workers, lazy loading, offline, acessibilidade, responsividade 220–4000 px, progresso e backups locais sem login. Leitura não gera domínio; atividades conceituais não comprovam compilação; projetos abertos têm rubrica manual. Código e commits autorais em português. Não reduzir testes, aumentar prazos para obter verde, reaproveitar aprovação antiga nem declarar produção pelo build.

Leia `docs/continuidade.md`, `docs/curriculo-completo.md`, `docs/aprendizagem-com-pratica.md`, `docs/prontidao-producao.md`, `docs/etapas-restantes.md` e a fila gerada. Referências externas e exemplos já existentes devem ser mantidos. Sem expansão meteorológica, login ou novas frentes aleatórias.

## Arquivos locais e ambiente

O arquivo de preservação remoto guarda cópias exatas dos auxiliares textuais, protótipos, rascunhos, logs relevantes e dos três fontes antigos preservados fora do checkout. O manifesto permite conferir os bytes. Não reaplicar scripts históricos automaticamente: alguns registram alterações já incorporadas ou hipóteses superadas.

Credenciais `.env.local` e metadados locais da hospedagem ficam fora do GitHub. Dependências instaladas, builds, caches e relatórios/traces binários regeneráveis também ficam fora do arquivo textual. Nenhum desses itens substitui código-fonte ou o checkpoint. Não apagar as cópias deste PC.

O frontend e a prática local não exigem credenciais privadas. Para repetir toda a suíte, preparar Node 24, .NET 10, Python, C++20, PostgreSQL 18 e navegador conforme `.github/workflows/validacao.yml`; usar banco descartável. Publicação/inspeção da hospedagem exige acesso autorizado no ambiente que executar essa etapa. Não copiar segredos para o repositório. O progresso pessoal dos alunos permanece no armazenamento de seus navegadores, fora do Git.

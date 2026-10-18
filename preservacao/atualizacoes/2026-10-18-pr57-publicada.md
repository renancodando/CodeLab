# PR #57 publicada e conferida — 18 de outubro de 2026

## Estado para retomar sem este PC

- Main atual conferida: 46947703b5442a8ecf77be8ab64db276e7ec2445.
- PR #57: https://github.com/renancodando/CodeLab/pull/57, integrada.
- Head aprovado: d3085bf50f98a57538620ec85c991bc78ab9fe89.
- Árvore do head, integração virtual e merge real: 93e1ac0aad77f3fa8c72118ac69e6f22bef5ff2d.
- Pais do merge: 917e9d11fd2aeca579ef4370817b0c01cbcf0862 e d3085bf50f98a57538620ec85c991bc78ab9fe89.
- Checkout local sincronizado por fast-forward, sem alterações de código ou commits apenas locais; branches anteriores preservadas.

## Entrega

Reaproveitada a branch remota pratica/css-animacoes-fluxo, com a prática de movimento reduzido de f63ed91 preservada. Quatro pausas em animacoes e css-caixas: interpolação, preferência de movimento, margens e empilhamento. Capítulos, teoria, exemplos, exercícios e projetos permanecem. A produção independente continua nos projetos. As respostas são conceituais; documentos de referência são executados no navegador, sem executar CSS livre do estudante.

Métricas publicadas e geradas: 137 aulas, 167 atividades corrigíveis, 83 aulas com pausas, 54 sem. Isso não encerra a profundidade curricular. Não aumentar aulas por quantidade. Prosseguir pela fila gerada, conferindo as branches DOM já preservadas antes de duplicar trabalho.

## Gates que autorizaram a integração

CI 39149674756, tentativa 2, seis jobs aprovados no head d3085bf50f98a57538620ec85c991bc78ab9fe89: 1112 unitários em 68 arquivos, 194 exemplos externos compilados/executados, PostgreSQL real e 209 cenários de navegador (54/58/49/48). Revisões sem tópicos pendentes; árvore e pais conferidos. A tentativa 1 falhou antes dos testes por Data limit exceeded no download PostgreSQL; repetição no mesmo SHA sem modificar workflow, prazos ou testes.

O pós-merge anterior da PR #56, run 38897974575, também concluiu seus seis jobs com sucesso na tentativa 2. A produção anterior foi reconferida antes desta edição.

## Validação local desta retomada

- Suíte completa: 1105/1112 aprovados em 68 arquivos, 599,21 s; sete expirações nos limites originais em quatro referências TypeScript, memória, tamanho de backup e gerador.
- Reprodução delimitada: 47/51 aprovados em 305,65 s; quatro expirações restantes em uma referência TypeScript, memória, backup e gerador. Práticas CSS novas aprovadas. Não declarar a suíte local completa verde.
- Strict/build aprovado: Vite em 7 min 40 s; 157 páginas, inicial 247,20 kB gzip, mundo 135,93 kB, 38 recursos essenciais/seis opcionais; offline e64e89c0f9ef8a9554f4.
- Vinte fluxos Edge: 19 aprovados em 7,9 min. Cascata antiga expirou no redimensionamento final após axe; o mesmo teste passou isoladamente em 33,0 s, 45,4 s total, sem alterar prazo ou asserções. Falha e trace preservados. A repetição não identifica por si a causa da lentidão.

Os logs textuais desta validação são preservados junto deste registro. Dependências, builds, credenciais e traces binários regeneráveis continuam fora do arquivo textual, conforme o checkpoint original.

## Produção confirmada

Deployment dpl_2WpzRNZNFSg4qq8oTy6TE2c98HjN, READY/production, projeto prj_XgncY54wYGiSgPH0n1JOol3UFWCn e gitSource.sha 46947703b5442a8ecf77be8ab64db276e7ec2445. A resolução do alias code-lab-omega.vercel.app confirmou o mesmo deployment e SHA.

Vinte fluxos públicos Edge aprovados em 4,7 min: referências nativas, nove cenários novos, regressões de cascata/unidades e Flexbox/Grid, ambas as aulas, preferência de movimento antes e durante uso, teclado, assistência/revisão, axe, 220/4000 px, offline e exportação/exclusão/restauração das novas habilidades.

## Pendência de infraestrutura após a integração

Run pós-merge 39152421764: tentativas 1 e 2 falharam antes dos testes no pull public.ecr.aws/docker/library/postgres:18 com toomanyrequests: Data limit exceeded; auditoria aprovada e navegador não executado. Não são CI aprovado.

A tentativa 3 foi solicitada no mesmo SHA após alguns minutos, mantendo todos os gates. Na gravação deste checkpoint, estado completed, conclusão failure, tentativa 3. Conferir o resultado real. Se a falha de registro persistir, corrigir a obtenção da imagem PostgreSQL sem remover testes nem aumentar os prazos; não iniciar outro lote curricular fingindo pós-merge verde.

## Próxima frente preservada

As branches pratica/dom-selecao (1457130) e pratica/dom-eventos (423f06a) já estão no GitHub; não foram editadas nesta execução. Conferir seus heads, dependências e diferenças contra a main publicada antes de continuar seleção e eventos. As branches antigas de animações e o arquivo de preservação também permanecem; não reaplicar scripts históricos nem integrar o arquivo auxiliar ao produto.

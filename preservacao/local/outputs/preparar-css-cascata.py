from pathlib import Path

atividades = r''' {
  id:'css-prever-seletores', language:'css', lessonIds:['cascata'],
  skillIds:['css.cascata.seletores'], afterBlock:3, kind:'predict', capability:'leitura', requiresConcept:true,
  title:'A última regra vence os dois parágrafos?',
  prompt:'Todas as declarações são normais, da mesma origem, sem camadas, animação ou estilo inline. Escreva o font-size computado de cada parágrafo, na ordem do documento, com a unidade px. Previsão conceitual; a referência é conferida no navegador.',
  code:'<style>\n#aviso { font-size: 18px; }\n.aviso { font-size: 22px; }\n.aviso { font-size: 24px; }\n</style>\n<p id="aviso" class="aviso">Primeiro</p>\n<p class="aviso">Segundo</p>',
  hint:'Compare os seletores que realmente correspondem a cada elemento. A ordem desempata candidatas de mesma prioridade; não elimina a especificidade do ID.', minutes:3
 },
 {
  id:'css-diagnosticar-token', language:'css', lessonIds:['cascata'],
  skillIds:['css.cascata.tokens'], afterBlock:6, kind:'choice', capability:'depuracao', requiresConcept:true,
  title:'O fallback não corrigiu o token de espaço',
  prompt:'Sem @property nem outras regras, o cartão fica sem padding em vez dos 12px esperados. --espaco existe, mas contém red. Qual alteração corrige esse token para os quatro lados? Escolha conceitual; não executa CSS livre do aluno.',
  code:'<style>\n:root { --espaco: red; }\n.cartao { padding: var(--espaco, 12px); }\n</style>\n<section class="cartao">Conteúdo</section>',
  options:[
   {id:'comprimento',text:'Trocar a definição --espaco: red por --espaco: 12px.'},
   {id:'fallback',text:'Trocar somente o fallback 12px por 20px, mantendo --espaco: red.'},
   {id:'anterior',text:'Adicionar padding: 12px antes da declaração com var, mantendo o token red.'}
  ],
  hint:'Um token presente pode ser inválido para a propriedade que o recebe. O fallback de var não é uma segunda tentativa para qualquer valor de padding inválido.', minutes:4
 },
 {
  id:'css-prever-unidades', language:'css', lessonIds:['box-model'],
  skillIds:['css.unidades.referencia'], afterBlock:3, kind:'predict', capability:'leitura', requiresConcept:true,
  title:'Dois tamanhos iguais no código, referências diferentes',
  prompt:'A raiz tem font-size de 20px. As duas caixas têm font-size de 30px, sem padding nem borda. Escreva as larguras computadas, em px, primeiro de .raiz e depois de .local. Esta é uma previsão conceitual.',
  code:'<style>\nhtml { font-size: 20px; }\n.caixa { font-size: 30px; }\n.raiz { width: 2rem; }\n.local { width: 2em; }\n</style>\n<div class="caixa raiz">Raiz</div>\n<div class="caixa local">Local</div>',
  hint:'Para width, rem consulta a fonte da raiz e em consulta a fonte da própria caixa. Não use o tamanho padrão do navegador quando a raiz foi definida.', minutes:3
 },
 {
  id:'css-diagnosticar-entrelinha', language:'css', lessonIds:['box-model'],
  skillIds:['css.tipografia.entrelinha'], afterBlock:6, kind:'choice', capability:'depuracao', requiresConcept:true,
  title:'A fonte cresceu, mas a entrelinha herdada ficou curta',
  prompt:'O título tem fonte de 32px e deve usar entrelinha igual a 1,5 vezes sua própria fonte, inclusive se ela mudar. O pai tem fonte de 16px. Qual mudança mantém essa proporção herdada? Decisão conceitual; não impõe uma medida universal de acessibilidade.',
  code:'<style>\n.painel { font-size: 16px; line-height: 1.5em; }\n.titulo { font-size: 32px; }\n</style>\n<section class="painel"><h2 class="titulo">Um título maior</h2></section>',
  options:[
   {id:'fator',text:'Usar line-height: 1.5 no painel, herdando o fator sem unidade.'},
   {id:'percentual',text:'Usar line-height: 150% no painel, mantendo o cálculo pela fonte do pai.'},
   {id:'fixar',text:'Usar line-height: 24px no painel para fixar a medida atual.'}
  ],
  hint:'Compare herdar um fator com herdar um comprimento já calculado. O título deve recalcular a entrelinha quando sua fonte mudar.', minutes:4
 },
 {
  id:'css-herdar-caixa', language:'css', lessonIds:['box-model'],
  skillIds:['css.caixas.heranca'], afterBlock:8, kind:'fill', capability:'alteracao', requiresConcept:true,
  title:'Conserve a exceção local também nos descendentes',
  prompt:'Complete somente a palavra-chave CSS. A raiz usa border-box, mas .painel escolhe content-box. A regra universal deve fazer filhos e pseudoelementos acompanharem o box-sizing do respectivo pai, inclusive quando a escolha do painel mudar. Uma decisão conceitual sobre um valor delimitado; não valida folhas CSS livres.',
  code:'<style>\nhtml { box-sizing: border-box; }\n*, *::before, *::after { box-sizing: ____; }\n.painel { box-sizing: content-box; }\n.caixa, .painel::before { width: 100px; padding: 10px; border: 2px solid; }\n.painel::before { content: ""; display: block; }\n</style>\n<div class="painel"><div class="caixa">Conteúdo</div></div>',
  hint:'box-sizing não é herdado automaticamente. Fixar um modo em todos os elementos elimina a exceção; procure a palavra-chave que pede o valor do pai.', minutes:4
 },
'''
p=Path('src/content/practice.ts')
s=p.read_text(encoding='utf-8')
assert "id:'css-prever-seletores'" not in s
p.write_text(s.replace('export const practiceActivities:PracticeActivity[]=[\n','export const practiceActivities:PracticeActivity[]=[\n'+atividades),encoding='utf-8')

conceitos=r''' 'css-prever-seletores':{accepted:['18px\n24px'],failure:'O ID corresponde somente ao primeiro parágrafo e tem maior especificidade neste mesmo nível da cascata. No segundo, as duas classes empatam e a última fornece o tamanho.',solution:'18px\n24px'},
 'css-diagnosticar-token':{accepted:['comprimento'],failure:'O token red está presente; ele é substituído antes de padding ficar inválido. Trocar o fallback ou adicionar uma declaração anterior não transforma esse token em comprimento.',solution:'<style>\n:root { --espaco: 12px; }\n.cartao { padding: var(--espaco, 12px); }\n</style>\n<section class="cartao">Conteúdo</section>'},
 'css-prever-unidades':{accepted:['40px\n60px'],failure:'A raiz e a caixa têm fontes diferentes. Multiplique cada largura pela referência de sua unidade; em numa largura não consulta a mesma fonte que rem.',solution:'40px\n60px'},
 'css-diagnosticar-entrelinha':{accepted:['fator'],failure:'em e percentual no pai produzem um comprimento calculado que o título herda. Fixar esse comprimento também não acompanha a fonte do título; diferencie medida e fator herdado.',solution:'<style>\n.painel { font-size: 16px; line-height: 1.5; }\n.titulo { font-size: 32px; }\n</style>\n<section class="painel"><h2 class="titulo">Um título maior</h2></section>'},
 'css-herdar-caixa':{accepted:['inherit'],failure:'Fixar border-box ou content-box não acompanha mudanças do pai. initial e unset também não pedem herança explícita de uma propriedade que normalmente não é herdada.',solution:'inherit'},
'''
p=Path('src/learning/practice.ts');s=p.read_text(encoding='utf-8')
s=s.replace('const concepts:Record<string,ConceptSpec>={\n','const concepts:Record<string,ConceptSpec>={\n'+conceitos)
s=s.replace("  else if(id==='sql-correlacionar-ausentes')", "  else if(id==='css-herdar-caixa')passed=typeof answer==='string'&&/^inherit$/i.test(normalized(answer));\n  else if(id==='sql-correlacionar-ausentes')")
p.write_text(s,encoding='utf-8')

p=Path('src/content/explicacoes.ts');s=p.read_text(encoding='utf-8')
s=s.replace('O navegador compara a prioridade de cada candidata e somente depois aplica herança e valores iniciais quando necessário.', 'O navegador compara a prioridade de cada candidata e somente depois aplica herança e valores iniciais quando necessário. Nas primeiras pausas, as declarações são normais, da mesma origem e sem camadas: um ID tem maior especificidade que uma classe; a ordem desempata as regras de mesma prioridade que correspondem ao elemento. Essa simplificação não substitui origem, importância e camadas nos outros casos. Custom properties sem registro por @property aceitam sequências como red; isso não garante que sejam válidas numa propriedade que espera comprimento. var usa seu fallback quando a variável está ausente ou tem um valor garantidamente inválido, não quando qualquer substituição torna padding inválido. Nesse último caso, a declaração já venceu a cascata e não recupera simplesmente o padding anterior. Confira o token no componente e o valor computado no DevTools. O projeto aplica essas decisões a tokens de espaço, fonte e superfície em outros componentes.')
s=s.replace('Unidades relativas conectam essa caixa ao contexto em vez de fixá-la cegamente.', 'Unidades relativas conectam essa caixa ao contexto em vez de fixá-la cegamente. Numa largura, rem usa a fonte da raiz e em usa a fonte do próprio elemento; em numa declaração de font-size tem outra referência, a fonte herdada. Sempre identifique qual propriedade está sendo calculada. line-height sem unidade herda um fator, recalculado pela fonte de cada descendente. Um comprimento em em ou um percentual declarado no pai é calculado ali e herdado como comprimento, podendo ficar curto num título com fonte maior. Escolher um fator não encerra a revisão visual: confira quebra de linhas, zoom e fontes reais. box-sizing não é herdado automaticamente. Uma regra universal com inherit, incluindo ::before e ::after, permite que o padrão border-box da raiz e exceções locais se propaguem. A borda inclui padding e border; margin fica fora dessa medida. As pausas diferenciam referências, entrelinha e herança, enquanto o projeto ainda exige construir e testar o cartão editorial com conteúdo imprevisível.')
p.write_text(s,encoding='utf-8')
p=Path('src/learning/hub-catalog.ts');s=p.read_text(encoding='utf-8').replace("const terms:Record<string,string>={", "const terms:Record<string,string>={seletores:'Seletores',tokens:'Tokens',referencia:'Referência das unidades',tipografia:'Tipografia',entrelinha:'Entrelinha',heranca:'Herança',")
p.write_text(s,encoding='utf-8')

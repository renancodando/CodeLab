# Aprendizagem com prática, revisão e projetos

## Mecanismos nesta expansão

- 25 atividades próprias em HTML, CSS, JavaScript, TypeScript, Python, C#, C++ e SQL. Quatro desafios JS começam quebrados e são conferidos com casos distintos, entradas vazias, negativos, não mutação e limites.
- Metadados de apresentação não incluem soluções ou verificações. Consultar solução é explícito e registrado como assistência. Os verificadores locais são inspecionáveis; não se promete sigilo nem integridade contra edição do armazenamento.
- Pausas por afterBlock 1, 3 e 5 são inseridas somente nas aulas referenciadas. As demais aulas continuam com leitura completa e suas práticas existentes; a migração geral permanece trabalho futuro.
- Evidência de domínio usa avaliações distintas por habilidade, tentativas, pistas e assistência. Repetir o mesmo problema não aumenta a quantidade praticada. Percentual é resumo de evidências, não certificação.
- Revisão por dias locais: 1, 3, 7, 14, 30, 60. Errar reduz dois estágios; assistência agenda um dia. Somente revisão vencida independente amplia o intervalo. Revelar a solução após uma tentativa registra assistência imediatamente, inclusive depois de acertar uma revisão.
- A sessão diária contém até 2 revisões antigas, 1 conceito novo, 2 práticas e 1 desafio. A preferência de linguagem afeta conteúdo novo; revisões antigas continuam globais. O plano do dia é retomável e não repete atividades. A linguagem fica fixa depois de iniciar o plano; consulte outras atividades pelo catálogo e ajuste a preferência no próximo dia.
- Seis percursos próprios: algoritmos, estruturas, redes, Git, testes, arquitetura. São 18 etapas com teoria original, exemplo, falha, exercício, solução, três critérios e decisão conceitual.
- Oito projetos de conclusão: 57 marcos e 171 critérios. Código em vários arquivos, notas de evidência, invalidação após editar, ZIP e backup da jornada. A rubrica é manual e os projetos não são aprovados automaticamente. Se o navegador recusar a gravação, a interface informa alterações em memória e permite exportar arquivos e jornada antes de sair. A importação aceita arquivos de até 16 MB e preserva a jornada anterior se a gravação da restauração falhar.

## Uso offline

O build gera um service worker que prepara index, módulos, estilos, WASM e recursos locais. Após a mensagem de preparação concluída, a aplicação e as atividades conceituais podem ser reabertas sem conexão. JS usa QuickJS no navegador; Python/C#/C++ conceituais não usam Judge0. A execução completa dessas linguagens continua opcional e exige o executor configurado ou ferramentas locais nos arquivos exportados.

Fontes externas, clima, chamadas de API e execução remota não ficam disponíveis offline. Páginas estáticas de leitura possuem endereços próprios; o cache garante o aplicativo no endereço principal, não todas essas páginas independentes. Atualizações aguardam fechar as abas para trocar a versão consistente; não recarregam automaticamente nem apagam progresso.

Referências de implementação: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries), [ZIP](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT).

## Verificação requerida

Executar toda a suíte de unidade, exemplos externos, cronogramas SQL, builds e navegador. Novos fluxos cobrem depuração, bordas, assistência, habilidades, leitura sem crédito, sessão retomável, offline após preparação, projeto com vários arquivos, exportação/backup, invalidação de evidência e telas entre 220 e 4000 px. Registrar os resultados reais da versão integrada; não substituir evidência por contagens planejadas.


## Pausas Python e continuidade do catálogo

A aula `py-iteracao-recursos` acrescenta `py-prever-esgotamento`, `py-ordenar-lote` e `py-fechar-consumo`. O total passa de 25 para 28 atividades. Elas funcionam nas pausas da aula, no catálogo e na revisão por habilidade. Seus gabaritos são executados com Python no CI; a resposta da pessoa continua avaliada conceitualmente no navegador.

As habilidades novas são Python → Iteradores → Consumo/Lotes/Recursos. Os ids das 40 entradas de conceito da PR #5 são preservados em `legacy-concept-ids.ts`. Novos conceitos usam rank e id da aula, sem posição do catálogo. Um teste restaura o plano iniciado com ids antigos e conserva os conceitos lidos no dia seguinte.


## Pausas de contratos TypeScript

`ts-variancia-contratos` acrescenta `ts-fonte-covariancia`, `ts-callback-entrada` e `ts-propriedade-funcao`. O catálogo passa a 31 atividades; as habilidades novas são TypeScript → Variância → Resultados/Parâmetros/Métodos. A conferência de uma escolha é conceitual: os testes do gabarito em strict e em execução não devem ser apresentados como execução de código do aluno.

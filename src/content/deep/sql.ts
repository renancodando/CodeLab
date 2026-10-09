import type {DeepCourse} from './types';
export default {
  "id": "sql-completo",
  "title": "SQL · do zero ao avançado",
  "description": "Modelagem relacional, consultas, janelas, transações, índices e engenharia com PostgreSQL.",
  "icon": "database",
  "language": "sql",
  "environment": "postgresql",
  "source": "https://www.postgresql.org/docs/current/",
  "lessons": [
    {
      "id": "sql-modelagem-completa",
      "title": "SQL: modelo relacional, tipos e integridade",
      "level": "Fundamentos",
      "summary": "Modele dados antes de escrever consultas, distinguindo entidades, relações, chaves e restrições. Aprenda DDL, tipos, NULL e normalização com exemplos PostgreSQL, definindo regras de integridade no banco em vez de depender somente da aplicação para evitar estados inválidos.",
      "topics": [
        "relations rows columns keys",
        "CREATE ALTER DROP schema",
        "primary foreign unique keys",
        "NOT NULL CHECK DEFAULT",
        "NULL three-valued logic",
        "numeric text boolean dates",
        "normalization dependencies",
        "INSERT UPDATE DELETE RETURNING",
        "PostgreSQL dialect"
      ],
      "sections": [
        {
          "title": "Relações e identidade",
          "text": [
            "Uma tabela representa dados com colunas e regras, mas as linhas não têm uma ordem garantida sem uma consulta ordenada. Defina uma chave que identifica cada registro e diferencie identidade técnica de um atributo de negócio que pode mudar.",
            "Uma chave estrangeira relaciona valores ao registro correspondente, e não à posição visual de uma linha. Cardinalidade e opcionalidade devem ser modeladas explicitamente. Uma relação muitos para muitos normalmente pede uma tabela de associação."
          ]
        },
        {
          "title": "Tipos de domínio",
          "text": [
            "integer e bigint têm intervalos finitos; numeric representa decimais com política de precisão e escala. text, boolean, date e tipos de timestamp atendem contratos diferentes. Escolha o tipo pela informação, não por como o formulário a apresenta.",
            "Em PostgreSQL, timestamp with time zone representa um instante com conversões de apresentação, sem guardar necessariamente o nome original do fuso. Uma data local e um instante UTC têm significados diferentes e não devem ser intercambiados sem uma regra."
          ]
        },
        {
          "title": "Restrições e valores ausentes",
          "text": [
            "NOT NULL rejeita ausência; CHECK verifica uma expressão; UNIQUE impõe uma política de duplicação conforme suas regras, inclusive para NULL. Um CHECK que resulta em unknown pode permitir a linha, portanto combine NOT NULL quando a presença for obrigatória.",
            "NULL representa informação ausente ou desconhecida no contrato. Comparações comuns com NULL produzem unknown e WHERE conserva apenas true. Use IS NULL e IS NOT NULL; não escreva coluna = NULL para testar ausência."
          ]
        },
        {
          "title": "Chaves e ações de referência",
          "text": [
            "PRIMARY KEY identifica linhas e impõe requisitos de unicidade e presença. FOREIGN KEY conserva integridade referencial. Ações como CASCADE e RESTRICT devem corresponder ao ciclo de vida do domínio, pois apagar um registro pode afetar outros.",
            "Índices e restrições têm relações, mas não são conceitos idênticos. Uma chave estrangeira não implica automaticamente todo índice necessário para consultas do lado referenciador. Primeiro modele a regra, depois investigue acesso e custo."
          ]
        },
        {
          "title": "Normalização e dependências",
          "text": [
            "Separar dados conforme dependências reduz atualizações contraditórias. Se o nome do curso depende do curso, repeti-lo em toda matrícula exige uma política para manter todas as cópias iguais. Normalização organiza essas dependências.",
            "Desnormalizar pode ser válido para um caso medido, mas exige definir fonte de verdade, atualização e recuperação. Não copie campos só porque um SELECT com JOIN parece mais longo. A representação deve conservar a regra do produto."
          ]
        },
        {
          "title": "Modificar dados com contrato",
          "text": [
            "INSERT cria linhas, UPDATE altera as que satisfazem sua condição e DELETE remove. RETURNING em PostgreSQL permite observar valores afetados. Uma cláusula WHERE ausente em UPDATE ou DELETE pode atingir toda a tabela.",
            "DEFAULT fornece um valor quando apropriado, mas não substitui validar a entrada. Antes de uma operação destrutiva, confira a seleção e execute com uma estratégia transacional. Migrations precisam considerar dados existentes e compatibilidade dos consumidores."
          ]
        }
      ],
      "code": "BEGIN;\nCREATE TEMP TABLE cursos (id integer PRIMARY KEY, nome text NOT NULL UNIQUE);\nCREATE TEMP TABLE alunos (id integer PRIMARY KEY, nome text NOT NULL CHECK (length(trim(nome)) > 0));\nCREATE TEMP TABLE matriculas (aluno_id integer REFERENCES alunos(id), curso_id integer REFERENCES cursos(id), PRIMARY KEY(aluno_id, curso_id));\nINSERT INTO cursos VALUES (1, 'SQL');\nINSERT INTO alunos VALUES (1, 'Lia');\nINSERT INTO matriculas VALUES (1, 1);\nSELECT a.nome, c.nome AS curso FROM matriculas m JOIN alunos a ON a.id=m.aluno_id JOIN cursos c ON c.id=m.curso_id;\nROLLBACK;",
      "output": "A consulta produz Lia e SQL. Chaves impedem matrículas duplicadas e referências a registros inexistentes; ROLLBACK descarta as tabelas temporárias criadas nessa transação.",
      "trace": [
        "O modelo separa alunos, cursos e a associação.",
        "A chave composta identifica uma matrícula.",
        "O JOIN segue as chaves e não depende da ordem de inserção."
      ],
      "exercise": "Crie uma tabela temporária tarefas com id como chave, titulo obrigatório não vazio e minutos inteiros não negativos. Insira dois registros e consulte somente tarefas com minutos maiores que zero.",
      "solution": "BEGIN;\nCREATE TEMP TABLE tarefas(id integer PRIMARY KEY,titulo text NOT NULL CHECK(length(trim(titulo))>0),minutos integer NOT NULL CHECK(minutos>=0));\nINSERT INTO tarefas VALUES(1,'Ler',0),(2,'Praticar',30);\nSELECT titulo,minutos FROM tarefas WHERE minutos>0 ORDER BY id;\nDO $$ BEGIN IF (SELECT count(*) FROM tarefas WHERE minutos>0)<>1 THEN RAISE EXCEPTION 'resultado incorreto'; END IF; END $$;\nROLLBACK;",
      "bug": "Uma comparação = NULL não identifica linhas ausentes porque seu resultado é unknown, e não true. O filtro pode devolver zero linhas mesmo quando há NULL.",
      "bugCode": "SELECT * FROM alunos WHERE apelido = NULL;",
      "repair": "Use apelido IS NULL e defina se a ausência é permitida. Quando a regra exige presença e intervalo, combine NOT NULL e CHECK.",
      "checks": [
        "Chaves e restrições expressam regras do domínio.",
        "NULL é tratado com sua lógica própria.",
        "Modificações têm seleção e estratégia de confirmação explícitas."
      ],
      "project": "Modele um planejador com pessoas, temas e sessões de estudo. Defina chaves, cardinalidades e regras de ausência, depois teste tentativas de duplicação e referências inexistentes.",
      "question": "WHERE coluna = NULL seleciona corretamente valores ausentes?",
      "answer": "Não; use IS NULL, pois a comparação comum resulta em unknown.",
      "distractors": [
        "Sim; NULL equivale a zero para toda comparação.",
        "Sim; mas somente quando há ORDER BY."
      ]
    },
    {
      "id": "sql-null-logica",
      "title": "SQL: NULL, lógica de três valores e dados ausentes",
      "level": "Fundamentos",
      "summary": "Escreva consultas que distinguem valor zero, valor ausente e comparação desconhecida. Esta aula usa PostgreSQL para explicar WHERE, CHECK, IS NULL, IS DISTINCT FROM, agregações e o risco de NOT IN com NULL. Todos os exemplos criam dados temporários e desfazem a transação, com verificações executadas sobre o resultado real.",
      "source": "https://www.postgresql.org/docs/current/functions-comparison.html",
      "topics": [
        "NULL como ausência de valor",
        "comparação com resultado unknown",
        "WHERE aceita apenas true",
        "IS NULL e IS NOT NULL",
        "IS DISTINCT FROM",
        "CHECK e NOT NULL",
        "count estrela versus count coluna",
        "NOT IN com NULL e NOT EXISTS"
      ],
      "sections": [
        {
          "title": "Ausência não é zero nem texto vazio",
          "text": [
            "NULL representa ausência de um valor no modelo SQL. Um saldo zero informa um valor conhecido; um saldo NULL pode indicar que ele ainda não foi apurado. Uma string vazia também é um valor textual conhecido. A escolha de permitir NULL deve ser documentada no esquema e no domínio, porque consultas e restrições terão de lidar com essa possibilidade em vez de substituir tudo por um valor padrão.",
            "Não use NULL para armazenar vários significados incompatíveis sem um campo que os diferencie. Desconhecido, não aplicável e removido podem exigir estados separados no produto. A aula usa saldo ausente apenas como ainda não informado. Isso permite estudar as regras da linguagem sem fingir que uma marca única resolve todas as necessidades de um modelo real."
          ]
        },
        {
          "title": "Comparações comuns podem produzir unknown",
          "text": [
            "Comparar um valor com NULL usando = ou <> normalmente produz o estado lógico desconhecido, inclusive NULL = NULL. Esse resultado não é true nem false. WHERE mantém linhas em que a condição é true; false e unknown ficam fora do resultado. Assim WHERE saldo <> 0 não seleciona automaticamente linhas com saldo ausente, mesmo que a pessoa imagine ausente como diferente de zero.",
            "As operações AND, OR e NOT têm regras para três valores. false AND unknown é false, enquanto true AND unknown é unknown; true OR unknown é true. NOT unknown continua unknown. Para entender uma consulta, escreva a tabela lógica dos estados relevantes e não aplique cegamente as regras de um booleano de duas possibilidades. Isso é especialmente útil quando uma condição combina comparação e campo opcional.",
            "Na pausa seguinte, a consulta exibe a comparação em vez de filtrá-la. No PostgreSQL, ::text apresenta um booleano conhecido como true ou false; COALESCE escolhe o texto unknown somente se esse resultado estiver ausente. Essa apresentação não altera o saldo original. Preveja as linhas na ordem dos ids e depois explique por que negar a comparação ainda não faria o saldo NULL passar em WHERE."
          ]
        },
        {
          "title": "Testes de ausência e igualdade nula são explícitos",
          "text": [
            "IS NULL e IS NOT NULL verificam ausência de forma direta. IS DISTINCT FROM permite comparar valores tratando NULL como comparável para decidir diferença: dois NULL não são distintos; NULL e zero são distintos. IS NOT DISTINCT FROM expressa a relação inversa. Escolha a operação pelo significado: uma busca por campos não preenchidos deve usar IS NULL, sem fabricar um valor mágico que represente todos os dados ausentes.",
            "COALESCE escolhe a primeira expressão não NULL, mas não transforma a origem em um dado conhecido. Ele pode servir para apresentação ou para uma regra explícita de cálculo. Se um saldo não informado deve ficar destacado, COALESCE(saldo, 0) pode esconder a falta do dado. No exemplo, CASE produz uma classificação descritiva e preserva a diferença entre desconhecido, zero e positivo."
          ]
        },
        {
          "title": "Restrições têm sua própria regra de aceitação",
          "text": [
            "No PostgreSQL, uma restrição CHECK é satisfeita quando a expressão resulta em true ou NULL. Portanto CHECK (saldo >= 0) não rejeita sozinho um saldo NULL. Se o campo é obrigatório, combine NOT NULL com a restrição de faixa. A regra de aceitação de CHECK difere da seleção de WHERE, que mantém apenas true. Esse detalhe precisa ser explicado antes de usar um check como prova de presença.",
            "Restrições protegem a integridade na base e devem refletir regras que valem para todos os caminhos de escrita. Validar só em um formulário não cobre importações e outras aplicações. Na atividade, usamos tabelas temporárias e uma transação para observar uma violação controlada sem modificar dados permanentes. Em migrações reais, analise os dados existentes e como a nova regra será validada.",
            "Teste presença e faixa separadamente: zero e cinco devem entrar, NULL deve violar NOT NULL e menos um deve violar CHECK. COALESCE dentro do CHECK pode fazer uma ausência parecer zero para a condição, mantendo a coluna ausente. NOT NULL sozinho também não impede valores negativos. Capture apenas a violação esperada no teste; capturar qualquer exceção esconderia erros do próprio programa de verificação."
          ]
        },
        {
          "title": "Agregações e exclusões exigem atenção à ausência",
          "text": [
            "count(*) conta linhas; count(coluna) conta valores não NULL nessa coluna. sum ignora valores NULL e pode retornar NULL quando não há valores para somar. Escolha se esse resultado representa ausência adequada ou se uma regra explícita autoriza transformá-lo em zero. Uma média calculada com linhas e valores ausentes também precisa de um denominador coerente com o domínio.",
            "NOT IN pode produzir unknown quando a lista ou subconsulta contém NULL e nenhuma igualdade verdadeira resolve a comparação. Isso faz uma exclusão retornar menos linhas que o esperado. NOT EXISTS com uma correlação explícita frequentemente expressa melhor a pergunta não existe registro correspondente, mas ainda exige definir como chaves NULL devem se relacionar. Evitar um operador sem entender o contrato de correspondência não é suficiente.",
            "Se a regra escolhida mandar excluir uma chave ausente quando o bloqueio também tiver ausência, use IS NOT DISTINCT FROM na correlação: duas ausências correspondem; ausência e zero não. Com =, a comparação de dois NULL continua unknown e não encontra o bloqueio. Com COALESCE(chave, 0), um zero legítimo pode ser excluído indevidamente. Não deduza identidade de pessoas por esse predicado; a política pertence ao domínio e precisa estar explícita. Bloqueios duplicados não multiplicam as linhas de uma consulta NOT EXISTS."
          ]
        },
        {
          "title": "Verifique consultas com dados que exponham os estados",
          "text": [
            "Um conjunto mínimo útil tem uma linha NULL, uma linha zero e uma linha positiva. Adicione uma lista de exclusão com NULL e um valor conhecido. Compare os resultados de IS NULL, <> 0, IS DISTINCT FROM 0 e NOT EXISTS. Esses dados pequenos permitem prever todas as linhas e detectar uma expectativa errada antes de testar em milhares de registros.",
            "Os programas da aula têm BEGIN, objetos temporários, verificações em DO e ROLLBACK. Se um resultado divergir, RAISE EXCEPTION faz o CI falhar. O rollback mantém o exercício sem efeitos permanentes, mas a prática precisa ocorrer em uma base de estudo. Transfira a modelagem para um relatório de avaliação: destaque notas ainda não lançadas em vez de convertê-las silenciosamente em nota zero."
          ]
        }
      ],
      "code": "BEGIN;\nCREATE TEMP TABLE leitura_null(id integer PRIMARY KEY, saldo numeric CHECK(saldo >= 0));\nINSERT INTO leitura_null VALUES (1,NULL),(2,0),(3,12);\nCREATE TEMP VIEW classificacao_null AS\nSELECT id, CASE WHEN saldo IS NULL THEN 'desconhecido'\n                WHEN saldo = 0 THEN 'zero' ELSE 'positivo' END AS estado\nFROM leitura_null;\nDO $$\nBEGIN\n IF (SELECT count(*) FROM leitura_null WHERE saldo <> 0) <> 1 THEN RAISE EXCEPTION 'WHERE'; END IF;\n IF (SELECT count(saldo) FROM leitura_null) <> 2 THEN RAISE EXCEPTION 'count'; END IF;\n IF (SELECT count(*) FROM leitura_null WHERE saldo IS DISTINCT FROM 0) <> 2 THEN RAISE EXCEPTION 'distinct'; END IF;\nEND $$;\nSELECT id,estado FROM classificacao_null ORDER BY id;\nROLLBACK;",
      "expectedOutput": [
        "1|desconhecido",
        "2|zero",
        "3|positivo"
      ],
      "output": "As linhas classificadas são 1|desconhecido, 2|zero e 3|positivo. saldo <> 0 seleciona somente a terceira; count(saldo) conta duas.",
      "trace": [
        "CHECK de faixa aceita o NULL porque não está combinado com NOT NULL.",
        "CASE testa ausência antes de igualdade com zero.",
        "As verificações distinguem a aceitação de CHECK, a seleção de WHERE e a contagem de valores."
      ],
      "exercise": "Crie uma tabela temporária com valores NULL, 0 e 5. Retorne os ids de valores ausentes ou positivos sem incluir zero. Verifique que count(*) é 3 e count(valor) é 2.",
      "solution": "BEGIN;\nCREATE TEMP TABLE atividade_null(id integer PRIMARY KEY, valor integer);\nINSERT INTO atividade_null VALUES (1,NULL),(2,0),(3,5);\nDO $$\nBEGIN\n IF (SELECT count(*) FROM atividade_null) <> 3 OR (SELECT count(valor) FROM atividade_null) <> 2\n THEN RAISE EXCEPTION 'contagens'; END IF;\n IF (SELECT array_agg(id ORDER BY id) FROM atividade_null WHERE valor IS NULL OR valor > 0)\n IS DISTINCT FROM ARRAY[1,3] THEN RAISE EXCEPTION 'resultado'; END IF;\nEND $$;\nSELECT id FROM atividade_null WHERE valor IS NULL OR valor > 0 ORDER BY id;\nROLLBACK;",
      "solutionOutput": [
        "1",
        "3"
      ],
      "bug": "A consulta tenta localizar dados ausentes com valor = NULL. A comparação não produz true para a linha NULL, então nenhuma linha satisfaz essa condição em WHERE.",
      "bugCode": "SELECT id FROM dados WHERE valor = NULL;",
      "repair": "Use valor IS NULL. Se a pergunta for igualdade entre duas colunas que podem ser NULL, considere IS NOT DISTINCT FROM conforme o contrato; não generalize IS NULL para qualquer comparação.",
      "checks": [
        "Ausência, zero e positivo têm resultados diferentes.",
        "As contagens de linhas e valores conhecidos são distintas.",
        "Explique por que CHECK de faixa não prova obrigatoriedade."
      ],
      "project": "Modele avaliações ainda não lançadas, notas zero e notas positivas. Escreva contagens e médias com denominadores documentados, destaque ausência no relatório e combine NOT NULL apenas nos estados em que o dado é realmente obrigatório.",
      "question": "Por que CHECK (saldo >= 0) permite saldo NULL no PostgreSQL?",
      "answer": "CHECK aceita a condição verdadeira ou desconhecida; NOT NULL é uma restrição separada.",
      "distractors": [
        "NULL sempre é convertido para zero antes de avaliar a restrição.",
        "CHECK nunca valida números e só examina o nome da coluna."
      ],
      "practices": [
        {
          "id": "exclusao",
          "title": "Problema 1: exclusão com uma chave ausente",
          "topics": [
            "NOT IN com NULL e NOT EXISTS",
            "WHERE aceita apenas true",
            "comparação com resultado unknown"
          ],
          "prompt": "Crie ids 1, 2 e 3 e uma lista de bloqueio com 2 e NULL. Mostre que NOT IN não retorna nenhum id nesse caso e que NOT EXISTS com igualdade retorna 1 e 3. As chaves externas da lista principal são não nulas.",
          "solution": "BEGIN;\nCREATE TEMP TABLE candidatos_null(id integer PRIMARY KEY);\nCREATE TEMP TABLE bloqueios_null(id integer);\nINSERT INTO candidatos_null VALUES(1),(2),(3);\nINSERT INTO bloqueios_null VALUES(2),(NULL);\nDO $$\nBEGIN\n IF (SELECT count(*) FROM candidatos_null WHERE id NOT IN (SELECT id FROM bloqueios_null)) <> 0\n THEN RAISE EXCEPTION 'NOT IN'; END IF;\n IF (SELECT array_agg(c.id ORDER BY c.id) FROM candidatos_null c\n     WHERE NOT EXISTS(SELECT 1 FROM bloqueios_null b WHERE b.id=c.id))\n IS DISTINCT FROM ARRAY[1,3] THEN RAISE EXCEPTION 'NOT EXISTS'; END IF;\nEND $$;\nSELECT c.id FROM candidatos_null c WHERE NOT EXISTS(SELECT 1 FROM bloqueios_null b WHERE b.id=c.id) ORDER BY c.id;\nROLLBACK;",
          "expectedOutput": [
            "1",
            "3"
          ],
          "explanation": [
            "Para 1 e 3, a presença de NULL deixa NOT IN desconhecido; para 2, a igualdade conhecida exclui a linha. WHERE não mantém nenhuma delas.",
            "A correlação de NOT EXISTS procura uma igualdade verdadeira com a chave candidata, que nesta tabela é não nula. Se as chaves candidatas também pudessem ser NULL, a política de correspondência teria de ser discutida explicitamente."
          ],
          "checks": [
            "NOT IN retorna zero linhas.",
            "NOT EXISTS retorna exatamente 1 e 3.",
            "Explique a hipótese de chave candidata não nula."
          ]
        },
        {
          "id": "obrigatorio",
          "title": "Problema 2: campo obrigatório e faixa válida",
          "topics": [
            "CHECK e NOT NULL",
            "NULL como ausência de valor",
            "IS NULL e IS NOT NULL"
          ],
          "prompt": "Crie um campo obrigatório inteiro não negativo, aceite zero e detecte rejeição de NULL e -1. Capture somente as violações esperadas dentro de DO e verifique que as inserções rejeitadas não deixaram linhas.",
          "solution": "BEGIN;\nCREATE TEMP TABLE quantidades_null(valor integer NOT NULL CHECK(valor >= 0));\nINSERT INTO quantidades_null VALUES(0);\nDO $$\nBEGIN\n BEGIN\n  INSERT INTO quantidades_null VALUES(NULL);\n  RAISE EXCEPTION 'NULL foi aceito';\n EXCEPTION WHEN not_null_violation THEN NULL;\n END;\n BEGIN\n  INSERT INTO quantidades_null VALUES(-1);\n  RAISE EXCEPTION 'negativo foi aceito';\n EXCEPTION WHEN check_violation THEN NULL;\n END;\n IF (SELECT count(*) FROM quantidades_null) <> 1 THEN RAISE EXCEPTION 'linhas'; END IF;\nEND $$;\nSELECT valor FROM quantidades_null;\nROLLBACK;",
          "expectedOutput": [
            "0"
          ],
          "explanation": [
            "NOT NULL estabelece presença e CHECK estabelece a faixa. Zero satisfaz as duas regras e continua diferente de dado ausente.",
            "Cada bloco captura somente a classe de violação que a atividade espera. Uma exceção que diz que o valor inválido foi aceito não é capturada como sucesso, então uma restrição faltando fará o teste falhar."
          ],
          "checks": [
            "Zero é inserido.",
            "NULL e -1 produzem violações específicas.",
            "A tabela final tem apenas a linha válida."
          ]
        }
      ]
    },
    {
      "id": "sql-consultas-joins",
      "title": "SQL: consultas, joins e composição",
      "level": "Intermediário",
      "summary": "Construa consultas entendendo cardinalidade, filtros e a ordem lógica das operações. Estude joins internos e externos, subconsultas, EXISTS, operações de conjunto, CTEs e paginação, evitando duplicações acidentais e o erro de transformar um LEFT JOIN em INNER JOIN por um filtro mal colocado.",
      "topics": [
        "SELECT FROM WHERE order logic",
        "INNER LEFT RIGHT FULL CROSS JOIN",
        "join cardinality aliases",
        "EXISTS NOT EXISTS correlated",
        "UNION ALL INTERSECT EXCEPT",
        "CTEs composition",
        "ORDER BY LIMIT keyset pagination",
        "LATERAL",
        "parameterized queries"
      ],
      "sections": [
        {
          "title": "Consulta e ordem lógica",
          "text": [
            "A escrita de SELECT não corresponde simplesmente à ordem de execução física. Conceitualmente, origem e relações formam dados, filtros selecionam, projeções e agregações produzem resultados e ordenação define apresentação.",
            "O otimizador pode escolher outra estratégia física preservando a semântica. Um alias pode não estar disponível em toda cláusula; compreenda o escopo em vez de mover expressões aleatoriamente até o banco aceitar."
          ]
        },
        {
          "title": "Cardinalidade de joins",
          "text": [
            "Um JOIN pode multiplicar linhas quando há várias correspondências. Se um aluno tem três sessões, a junção produz três combinações antes de uma agregação. DISTINCT pode esconder duplicação sem corrigir o modelo da consulta.",
            "INNER conserva combinações correspondentes; LEFT também preserva linhas da esquerda sem correspondência, preenchendo a parte direita com NULL. CROSS gera combinações de ambas as origens e pode crescer rapidamente."
          ]
        },
        {
          "title": "Filtros de um join externo",
          "text": [
            "Uma condição em ON determina quais pares correspondem. Uma condição em WHERE filtra o resultado formado. Filtrar uma coluna da direita por um valor que rejeita NULL pode remover justamente as linhas sem correspondência de um LEFT JOIN.",
            "Escolha onde aplicar a condição conforme a pergunta: listar todos os alunos com suas sessões válidas difere de listar somente alunos que têm sessão válida. Escreva casos com uma, várias e nenhuma correspondência."
          ]
        },
        {
          "title": "Existência e subconsultas",
          "text": [
            "EXISTS pergunta se uma subconsulta encontra alguma linha e é adequado para selecionar registros que têm uma relação sem projetar todas as combinações. NOT EXISTS expressa ausência sem algumas armadilhas de NULL em NOT IN.",
            "Uma subconsulta correlacionada referencia o contexto externo. LATERAL permite que uma origem de FROM use dados anteriores de maneira explícita. Avalie o plano quando isso afeta grande volume e mantenha a regra de cardinalidade clara."
          ]
        },
        {
          "title": "Conjuntos e CTEs",
          "text": [
            "UNION elimina duplicatas e UNION ALL conserva todas as linhas, com custos e significados diferentes. INTERSECT e EXCEPT representam relações de conjunto conforme o dialeto. As colunas precisam ter formatos compatíveis.",
            "CTEs nomeiam partes da consulta e ajudam legibilidade, mas não são automaticamente uma otimização nem sempre uma tabela materializada. O comportamento de planejamento depende da versão, uso e opções. Escolha pela clareza e confira o plano."
          ]
        },
        {
          "title": "Ordenação e paginação",
          "text": [
            "Sem ORDER BY não existe garantia de ordem. Um desempate por chave única torna páginas determinísticas. OFFSET grande pode custar trabalho e mudanças concorrentes podem causar repetição ou omissão conforme a estratégia.",
            "Paginação por chave usa o último valor ordenado como fronteira e precisa tratar empate e direção. Queries com dados externos devem usar parâmetros do driver; concatenar texto recebido cria uma fronteira de injeção."
          ]
        }
      ],
      "code": "BEGIN;\nCREATE TEMP TABLE alunos(id integer PRIMARY KEY,nome text);\nCREATE TEMP TABLE sessoes(id integer PRIMARY KEY,aluno_id integer,minutos integer);\nINSERT INTO alunos VALUES(1,'Lia'),(2,'Ana');\nINSERT INTO sessoes VALUES(1,1,30),(2,1,0);\nSELECT a.nome,s.minutos FROM alunos a LEFT JOIN sessoes s ON s.aluno_id=a.id AND s.minutos>0 ORDER BY a.id,s.id;\nROLLBACK;",
      "output": "O resultado tem Lia com 30 e Ana com NULL. O filtro no ON preserva Ana, que não tem sessão positiva; mover esse filtro para WHERE mudaria a pergunta.",
      "trace": [
        "O LEFT JOIN conserva cada aluno.",
        "Somente sessões positivas correspondem ao lado direito.",
        "A ordem inclui chaves para tornar a apresentação previsível."
      ],
      "exercise": "Com alunos e sessoes, consulte somente alunos sem nenhuma sessão usando NOT EXISTS. Insira um aluno com duas sessões e outro sem sessões para verificar que não há duplicação.",
      "solution": "BEGIN;\nCREATE TEMP TABLE alunos(id integer PRIMARY KEY,nome text);\nCREATE TEMP TABLE sessoes(id integer PRIMARY KEY,aluno_id integer REFERENCES alunos(id));\nINSERT INTO alunos VALUES(1,'Lia'),(2,'Ana');\nINSERT INTO sessoes VALUES(1,1),(2,1);\nSELECT a.nome FROM alunos a WHERE NOT EXISTS(SELECT 1 FROM sessoes s WHERE s.aluno_id=a.id) ORDER BY a.id;\nDO $$ BEGIN IF (SELECT count(*) FROM alunos a WHERE NOT EXISTS(SELECT 1 FROM sessoes s WHERE s.aluno_id=a.id))<>1 THEN RAISE EXCEPTION 'resultado incorreto'; END IF; END $$;\nROLLBACK;",
      "bug": "Um filtro no WHERE que exige uma coluna da direita não nula pode retirar as linhas sem correspondência de um LEFT JOIN.",
      "bugCode": "SELECT a.nome,s.minutos FROM alunos a LEFT JOIN sessoes s ON s.aluno_id=a.id WHERE s.minutos>0;",
      "repair": "Se a intenção é conservar todos os alunos com sessões positivas quando existirem, coloque a condição de correspondência em ON. Se a intenção exige sessão, um INNER JOIN ou EXISTS pode comunicar melhor a regra.",
      "checks": [
        "Resultados têm a cardinalidade esperada em zero, uma e várias correspondências.",
        "A ordenação tem desempate determinístico.",
        "Entradas externas usam parâmetros, e não concatenação SQL."
      ],
      "project": "Crie consultas de um relatório com todos os alunos, alunos ativos e alunos sem sessões. Documente cardinalidade e teste uma paginação com empates.",
      "question": "Mover um filtro de ON para WHERE em LEFT JOIN sempre preserva o resultado?",
      "answer": "Não; pode remover as linhas sem correspondência e mudar a pergunta.",
      "distractors": [
        "Sim; as cláusulas são sempre equivalentes.",
        "Sim; LEFT JOIN nunca produz NULL."
      ]
    },
    {
      "id": "sql-joins-cardinalidade",
      "title": "SQL: cardinalidade de joins e agregação sem duplicar totais",
      "level": "Intermediário",
      "summary": "Preveja quantas linhas uma junção pode produzir e escolha a granularidade do resultado antes de somar. Esta aula investiga LEFT JOIN, filtros em ON ou WHERE, count em linhas estendidas e multiplicação de relações um-para-muitos. Os problemas usam dados temporários com clientes sem pedido e pedidos com vários itens e pagamentos.",
      "source": "https://www.postgresql.org/docs/current/queries-table-expressions.html",
      "topics": [
        "granularidade antes da consulta",
        "cardinalidade um para muitos",
        "LEFT JOIN e linha estendida",
        "filtro em ON versus WHERE",
        "count da chave relacionada",
        "agregação antes do join",
        "fanout entre duas coleções",
        "EXISTS para testar presença"
      ],
      "sections": [
        {
          "title": "Escolha o que uma linha do resultado representa",
          "text": [
            "Antes de escrever SELECT, diga se cada linha representa um cliente, um pedido ou um item. Essa granularidade determina as chaves e as agregações necessárias. Uma junção de cliente com pedidos produz uma linha por combinação correspondente, não uma linha por cliente automaticamente. Se um cliente tem três pedidos, seus dados aparecem em três linhas. Essa repetição é uma propriedade esperada da relação, e não um bug do banco.",
            "A cardinalidade indica quantos registros de um lado podem se relacionar com cada registro do outro. Uma chave estrangeira válida protege a referência, mas não limita sozinha quantos pedidos um cliente pode ter. Uma restrição UNIQUE na chave relacionada pode estabelecer uma relação de no máximo um. Consulte as restrições do esquema antes de supor que um join preservará a quantidade de linhas."
          ]
        },
        {
          "title": "LEFT JOIN mantém linhas sem correspondência",
          "text": [
            "Um LEFT JOIN preserva as linhas da esquerda e acrescenta colunas NULL quando não existe correspondência da direita. Essa linha estendida permite apresentar clientes sem pedido. Ela não significa que foi criado um pedido com id NULL no armazenamento; é uma representação do resultado da consulta. A distinção afeta contagens e filtros depois da junção.",
            "Count(*) conta a linha estendida de um cliente sem pedidos, enquanto count(p.id) conta apenas ids não nulos dos pedidos relacionados. Se o relatório pede quantidade de pedidos, use a chave do registro relacionado, cuja não nulidade é garantida pela primary key. Um valor opcional de outra coluna poderia ter NULL mesmo num pedido existente e produzir uma contagem incorreta."
          ]
        },
        {
          "title": "A posição do filtro muda a preservação",
          "text": [
            "Um filtro na condição ON participa da decisão sobre quais registros da direita se relacionam à esquerda. Um filtro em WHERE é aplicado ao resultado da junção e pode remover a linha estendida. Assim LEFT JOIN pedidos p ON p.cliente_id=c.id AND p.status='pago' preserva clientes sem pedido pago. Mover status='pago' para WHERE normalmente exclui esses clientes porque a comparação com o NULL estendido não é true.",
            "Não memorize sempre coloque tudo em ON. Um filtro de cliente pode pertencer a WHERE, e uma pergunta que exige somente clientes com pedido pago pode usar um join ou EXISTS apropriado. A escolha depende do conjunto que o relatório deve manter. Escreva a regra em palavras e teste um cliente sem pedido, um com pedido não pago e um com pedido pago para diferenciar as consultas."
          ]
        },
        {
          "title": "Duas coleções podem multiplicar combinações",
          "text": [
            "Um pedido com dois itens e dois pagamentos gera quatro combinações se você juntar as duas coleções diretamente pela mesma chave do pedido. Somar valores dos itens nesse resultado repete cada item para cada pagamento; somar pagamentos repete cada pagamento para cada item. O join pode estar sintaticamente correto e respeitar todas as chaves estrangeiras, mas a agregação não corresponde à granularidade pretendida.",
            "SUM(DISTINCT valor) não é uma correção geral. Itens diferentes podem ter valores iguais e a remoção de duplicatas por valor apagaria contribuições legítimas. Agregue cada coleção na chave do pedido antes de juntar os resumos, ou use subconsultas correlacionadas adequadas. O resultado intermediário precisa ter no máximo uma linha por chave na etapa que o relatório espera."
          ]
        },
        {
          "title": "Presença e dados detalhados são perguntas diferentes",
          "text": [
            "Se você só quer saber quais clientes têm pelo menos um pedido, EXISTS expressa a presença sem multiplicar linhas de clientes para cada pedido. Uma junção seguida de DISTINCT pode produzir o mesmo conjunto em certos casos, mas exige compreender quais colunas participam da deduplicação. Escolha a forma que deixa clara a pergunta e confira a cardinalidade observável.",
            "Para retornar detalhes de pedidos, o join continua adequado. Para contagem por cliente, a agregação precisa conservar a chave e tratar a linha sem correspondência. A consulta pode combinar várias etapas com CTEs, cada uma com sua granularidade descrita. Nomear uma etapa como totais_por_pedido ajuda a revisar a promessa de uma linha por pedido antes da junção seguinte."
          ]
        },
        {
          "title": "Dados pequenos devem incluir as combinações difíceis",
          "text": [
            "Use um cliente sem pedidos, um com dois pedidos, dois itens com o mesmo valor e mais de um pagamento no mesmo pedido. Esses registros expõem falhas que uma base com uma linha por tabela esconderia. Preveja a quantidade de combinações antes de somar e compare o resultado com os totais calculados separadamente. Uma contagem correta é parte da prova do relatório.",
            "Nos exercícios, tabelas e views são temporárias e as verificações SQL lançam exceção se a expectativa falhar. Os valores são numéricos decimais e a apresentação usa uma escala explícita. Transfira o raciocínio para relatórios de faturamento: documente a granularidade de cada etapa, o conjunto preservado e a regra de ausência antes de otimizar o plano. Um índice não corrige uma soma duplicada."
          ]
        }
      ],
      "code": "BEGIN;\nCREATE TEMP TABLE clientes_card(id integer PRIMARY KEY);\nCREATE TEMP TABLE pedidos_card(id integer PRIMARY KEY, cliente_id integer REFERENCES clientes_card, total numeric(10,2) NOT NULL);\nINSERT INTO clientes_card VALUES(1),(2),(3);\nINSERT INTO pedidos_card VALUES(10,1,20),(11,1,30),(12,3,15);\nCREATE TEMP VIEW resumo_card AS\nSELECT c.id,count(p.id) AS pedidos,coalesce(sum(p.total),0)::numeric(10,2) AS total\nFROM clientes_card c LEFT JOIN pedidos_card p ON p.cliente_id=c.id\nGROUP BY c.id;\nDO $$\nBEGIN\n IF (SELECT count(*) FROM resumo_card) <> 3 THEN RAISE EXCEPTION 'clientes'; END IF;\n IF (SELECT pedidos FROM resumo_card WHERE id=2) <> 0 THEN RAISE EXCEPTION 'sem pedidos'; END IF;\n IF (SELECT total FROM resumo_card WHERE id=1) <> 50 THEN RAISE EXCEPTION 'total'; END IF;\nEND $$;\nSELECT id,pedidos,total FROM resumo_card ORDER BY id;\nROLLBACK;",
      "expectedOutput": [
        "1|2|50.00",
        "2|0|0.00",
        "3|1|15.00"
      ],
      "output": "São três clientes no resumo: 1 tem dois pedidos e total 50.00; 2 tem zero e 0.00; 3 tem um e 15.00.",
      "trace": [
        "O join produz duas combinações para cliente 1 e uma linha estendida para cliente 2.",
        "count(p.id) não conta a linha estendida como pedido.",
        "GROUP BY volta à granularidade de cliente e a escala numérica torna a saída explícita."
      ],
      "exercise": "Crie clientes 1, 2 e 3 e pedidos apenas para 1 e 3. Retorne clientes que têm pelo menos um pedido com EXISTS, mantendo uma linha por cliente mesmo se 1 tiver dois pedidos.",
      "solution": "BEGIN;\nCREATE TEMP TABLE clientes_presenca(id integer PRIMARY KEY);\nCREATE TEMP TABLE pedidos_presenca(id integer PRIMARY KEY,cliente_id integer REFERENCES clientes_presenca);\nINSERT INTO clientes_presenca VALUES(1),(2),(3);\nINSERT INTO pedidos_presenca VALUES(10,1),(11,1),(12,3);\nDO $$\nBEGIN\n IF (SELECT array_agg(c.id ORDER BY c.id) FROM clientes_presenca c\n     WHERE EXISTS(SELECT 1 FROM pedidos_presenca p WHERE p.cliente_id=c.id))\n IS DISTINCT FROM ARRAY[1,3] THEN RAISE EXCEPTION 'presença'; END IF;\nEND $$;\nSELECT c.id FROM clientes_presenca c WHERE EXISTS(SELECT 1 FROM pedidos_presenca p WHERE p.cliente_id=c.id) ORDER BY c.id;\nROLLBACK;",
      "solutionOutput": [
        "1",
        "3"
      ],
      "bug": "O relatório usa count(*) após LEFT JOIN e informa um pedido para o cliente sem correspondência. Ele conta a linha estendida de cliente, não um registro real de pedido.",
      "bugCode": "SELECT c.id,count(*) AS pedidos\nFROM clientes c LEFT JOIN pedidos p ON p.cliente_id=c.id\nGROUP BY c.id;",
      "repair": "Use count(p.id), com p.id não nulo no esquema, quando a pergunta é quantidade de pedidos. Se a granularidade pretendida for outra, revise o agrupamento e as chaves antes de trocar a função.",
      "checks": [
        "Clientes sem pedidos permanecem e têm contagem zero.",
        "A granularidade de cada etapa é explicitada.",
        "Duas relações um-para-muitos não duplicam valores no resumo final."
      ],
      "project": "Crie um relatório por pedido com total de itens, pagamentos e saldo. Inclua pedidos sem pagamentos, itens com valores iguais e múltiplos pagamentos. Compare os totais por coleção e explique por que a junção dos resumos não cria fanout.",
      "question": "Por que somar itens depois de juntar dois itens e dois pagamentos pode dobrar o total dos itens?",
      "answer": "A junção gera quatro combinações e repete cada item para cada pagamento.",
      "distractors": [
        "SUM sempre duplica valores numéricos por definição.",
        "Primary keys impedem qualquer repetição nas linhas de resultado, então essa duplicação é impossível."
      ],
      "practices": [
        {
          "id": "filtro",
          "title": "Problema 1: preservar clientes sem pedido pago",
          "topics": [
            "filtro em ON versus WHERE",
            "LEFT JOIN e linha estendida",
            "count da chave relacionada"
          ],
          "prompt": "Crie clientes 1, 2 e 3; 1 tem um pedido pago e um aberto, 2 só aberto e 3 nenhum. Conte pedidos pagos preservando todos os clientes. Confira que o filtro em ON produz contagens 1, 0 e 0.",
          "solution": "BEGIN;\nCREATE TEMP TABLE clientes_filtro(id integer PRIMARY KEY);\nCREATE TEMP TABLE pedidos_filtro(id integer PRIMARY KEY,cliente_id integer REFERENCES clientes_filtro,status text NOT NULL);\nINSERT INTO clientes_filtro VALUES(1),(2),(3);\nINSERT INTO pedidos_filtro VALUES(10,1,'pago'),(11,1,'aberto'),(12,2,'aberto');\nCREATE TEMP VIEW pagos_filtro AS\nSELECT c.id,count(p.id) AS pagos FROM clientes_filtro c\nLEFT JOIN pedidos_filtro p ON p.cliente_id=c.id AND p.status='pago' GROUP BY c.id;\nDO $$\nBEGIN\n IF (SELECT array_agg(pagos ORDER BY id) FROM pagos_filtro) IS DISTINCT FROM ARRAY[1,0,0]::bigint[]\n THEN RAISE EXCEPTION 'preservação'; END IF;\nEND $$;\nSELECT id,pagos FROM pagos_filtro ORDER BY id;\nROLLBACK;",
          "expectedOutput": [
            "1|1",
            "2|0",
            "3|0"
          ],
          "explanation": [
            "ON decide quais pedidos podem corresponder sem remover a linha de cliente. Quando nenhum pago existe, a linha estendida preserva o cliente e count da chave resulta em zero.",
            "Mover o filtro para WHERE muda a pergunta e elimina clientes 2 e 3. Compare os conjuntos antes de considerar equivalentes as duas versões."
          ],
          "checks": [
            "Os três clientes são preservados.",
            "Só o pedido pago entra na contagem.",
            "Explique o resultado que surgiria com o filtro em WHERE."
          ]
        },
        {
          "id": "fanout",
          "title": "Problema 2: somar coleções antes de combinar",
          "topics": [
            "agregação antes do join",
            "fanout entre duas coleções",
            "granularidade antes da consulta",
            "cardinalidade um para muitos"
          ],
          "prompt": "Um pedido tem dois itens de 10 cada e pagamentos de 5 e 7. Produza total de itens 20 e total de pagamentos 12. Agregue por pedido antes do join; não use SUM(DISTINCT valor), pois os itens iguais são legítimos.",
          "solution": "BEGIN;\nCREATE TEMP TABLE itens_fanout(pedido_id integer,valor numeric NOT NULL);\nCREATE TEMP TABLE pagamentos_fanout(pedido_id integer,valor numeric NOT NULL);\nINSERT INTO itens_fanout VALUES(7,10),(7,10);\nINSERT INTO pagamentos_fanout VALUES(7,5),(7,7);\nCREATE TEMP VIEW totais_fanout AS\nWITH itens AS (SELECT pedido_id,sum(valor) AS total FROM itens_fanout GROUP BY pedido_id),\npagamentos AS (SELECT pedido_id,sum(valor) AS total FROM pagamentos_fanout GROUP BY pedido_id)\nSELECT i.pedido_id,i.total AS itens,p.total AS pagamentos FROM itens i JOIN pagamentos p USING(pedido_id);\nDO $$\nBEGIN\n IF (SELECT count(*) FROM totais_fanout) <> 1 OR\n    (SELECT itens FROM totais_fanout) <> 20 OR (SELECT pagamentos FROM totais_fanout) <> 12\n THEN RAISE EXCEPTION 'fanout'; END IF;\nEND $$;\nSELECT pedido_id,itens,pagamentos FROM totais_fanout;\nROLLBACK;",
          "expectedOutput": [
            "7|20|12"
          ],
          "explanation": [
            "Cada CTE reduz sua coleção a uma linha por pedido. A junção combina dois resumos nessa mesma granularidade e não multiplica itens por pagamentos.",
            "Dois itens de dez somam vinte e não podem ser deduplicados por valor. Para preservar pedidos sem uma das coleções, inclua uma tabela de pedidos e faça LEFT JOIN dos resumos, aplicando a regra de ausência adequada."
          ],
          "checks": [
            "Os totais são 20 e 12 em uma única linha.",
            "Itens iguais continuam contando duas vezes.",
            "Descreva como preservar pedidos sem pagamentos."
          ]
        }
      ]
    },
    {
      "id": "sql-agregacoes-janelas",
      "title": "SQL: agregações, janelas e análise",
      "level": "Avançado",
      "summary": "Produza relatórios com agregação e funções de janela sem perder a granularidade necessária. Estude GROUP BY, HAVING, COUNT, FILTER, ranking, acumulados, LAG, LEAD e frames, distinguindo agrupamento de análise por linha e explicando o efeito de empates e valores ausentes.",
      "topics": [
        "GROUP BY HAVING",
        "count sum avg NULL",
        "aggregate FILTER distinct",
        "window PARTITION ORDER",
        "row_number rank dense_rank",
        "lag lead",
        "ROWS RANGE frames",
        "running totals",
        "grouping sets rollup"
      ],
      "sections": [
        {
          "title": "Granularidade antes da fórmula",
          "text": [
            "Defina o que representa uma linha do resultado: aluno, dia ou sessão. GROUP BY reúne linhas em grupos e reduz a granularidade. Somar depois de um JOIN que multiplica sessões pode contar o mesmo dado várias vezes.",
            "Colunas não agregadas precisam atender às regras de agrupamento do dialeto. Não escolha arbitrariamente um nome enquanto agrega registros sem uma relação que o justifique. Crie a origem com a cardinalidade correta antes de calcular."
          ]
        },
        {
          "title": "Agregações e ausência",
          "text": [
            "COUNT(*) conta linhas; COUNT(coluna) conta valores não nulos. SUM e AVG normalmente ignoram NULL, e agregações sobre conjunto vazio podem devolver NULL em vez de zero. COALESCE pode fornecer um padrão quando essa é a regra do relatório.",
            "AVG de médias de grupos não é necessariamente a média global; pesos importam. numeric e tipos integrais têm regras próprias de retorno e limites. Documente unidade e arredondamento do resultado apresentado."
          ]
        },
        {
          "title": "Filtros por grupo",
          "text": [
            "WHERE filtra antes do agrupamento; HAVING filtra grupos após calcular suas agregações. FILTER em uma agregação permite selecionar quais linhas alimentam aquele cálculo sem eliminar dados de outras métricas.",
            "DISTINCT dentro de uma agregação altera os valores contados. Não use como correção automática de duplicação criada por joins: valores iguais podem representar ocorrências legitimamente distintas."
          ]
        },
        {
          "title": "Funções de janela",
          "text": [
            "Uma janela calcula sobre um conjunto relacionado a cada linha sem reduzi-la a uma única linha por grupo. PARTITION BY divide conjuntos e ORDER BY define uma sequência para as operações que dependem dela.",
            "row_number numera posições; rank deixa lacunas após empates e dense_rank não. Uma ordenação com desempate adequado torna a numeração determinística. A ordem da janela não garante a ordem final do SELECT."
          ]
        },
        {
          "title": "Frames e acumulados",
          "text": [
            "O frame define quais linhas de uma partição entram no cálculo atual. ROWS trata posições físicas na sequência; RANGE tem relações com valores e empates. Defaults podem incluir pares de mesma chave e surpreender um acumulado.",
            "Para um acumulado por sessão em ordem única, declare ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW e um desempate. LAG e LEAD acessam posições anteriores e seguintes conforme a ordem, e ausência precisa de uma política."
          ]
        },
        {
          "title": "Totais em vários níveis",
          "text": [
            "GROUPING SETS e ROLLUP produzem combinações de agrupamento numa consulta. Linhas de total podem usar NULL em colunas agrupadas, e GROUPING ajuda a distingui-las de valores NULL do dado original.",
            "Relatórios precisam verificar totais globais contra subtotais e casos vazios. Uma janela extensa pode usar ordenação e memória relevantes; observe o plano e volume antes de transformar cada relatório em uma consulta universal."
          ]
        }
      ],
      "code": "BEGIN;\nCREATE TEMP TABLE sessoes(id integer PRIMARY KEY,aluno text,minutos integer);\nINSERT INTO sessoes VALUES(1,'Lia',20),(2,'Lia',30),(3,'Ana',15);\nSELECT aluno,id,minutos,sum(minutos) OVER(PARTITION BY aluno ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS acumulado FROM sessoes ORDER BY aluno,id;\nSELECT aluno,count(*) AS sessoes,sum(minutos) AS total FROM sessoes GROUP BY aluno ORDER BY aluno;\nROLLBACK;",
      "output": "As linhas de Lia têm acumulados 20 e 50; Ana tem 15. A segunda consulta produz uma linha por aluno, com contagem e soma, enquanto a janela preserva as sessões.",
      "trace": [
        "PARTITION BY reinicia o acumulado para cada aluno.",
        "O frame inclui do início até a linha atual.",
        "GROUP BY reduz a saída para a granularidade de aluno."
      ],
      "exercise": "Crie um ranking de totais por aluno usando uma CTE e dense_rank. Dois alunos com o mesmo total devem receber a mesma posição, e a apresentação deve ter desempate por nome.",
      "solution": "BEGIN;\nCREATE TEMP TABLE sessoes(aluno text,minutos integer);\nINSERT INTO sessoes VALUES('Lia',20),('Lia',30),('Ana',50),('Bia',10);\nWITH totais AS(SELECT aluno,sum(minutos) AS total FROM sessoes GROUP BY aluno)\nSELECT aluno,total,dense_rank() OVER(ORDER BY total DESC) AS posicao FROM totais ORDER BY total DESC,aluno;\nDO $$ BEGIN IF (SELECT sum(minutos) FROM sessoes)<>110 THEN RAISE EXCEPTION 'total incorreto'; END IF; END $$;\nROLLBACK;",
      "bug": "COUNT(coluna) não conta linhas cujo valor é NULL. Usá-lo como sinônimo de COUNT(*) pode produzir uma contagem menor que a quantidade de registros.",
      "bugCode": "SELECT count(apelido) AS alunos FROM alunos;",
      "repair": "Use COUNT(*) para contar linhas e COUNT(apelido) quando a pergunta é quantos apelidos estão presentes. Nomeie cada métrica conforme sua definição.",
      "checks": [
        "O relatório define a granularidade de cada saída.",
        "Empates, NULL e conjunto vazio têm resultados previstos.",
        "O frame e a ordem final são declarados conforme o contrato."
      ],
      "project": "Monte um relatório de sessões com totais, ranking, diferença para a sessão anterior e acumulado. Confira os cálculos manualmente para um conjunto pequeno antes de usar dados grandes.",
      "question": "Qual é a diferença central entre GROUP BY e uma função de janela?",
      "answer": "GROUP BY reduz grupos a linhas; a janela pode conservar cada linha e calcular sobre seu contexto.",
      "distractors": [
        "Não há diferença; ambos sempre produzem a mesma quantidade de linhas.",
        "A janela ordena permanentemente a tabela armazenada."
      ]
    },
    {
      "id": "sql-transacoes",
      "title": "SQL: transações, MVCC e concorrência",
      "level": "Avançado",
      "summary": "Defina operações atômicas e compreenda o que outras sessões podem observar durante uma transação. Estude commit, rollback, savepoints, MVCC, isolamento, locks, deadlocks e repetição de falhas, evitando tratar uma sequência de consultas independentes como uma operação indivisível.",
      "topics": [
        "ACID BEGIN COMMIT ROLLBACK",
        "savepoints",
        "MVCC snapshots",
        "read committed repeatable read serializable",
        "lost updates write skew",
        "SELECT FOR UPDATE",
        "deadlocks ordering",
        "retry idempotency",
        "constraints concurrency"
      ],
      "sections": [
        {
          "title": "Uma unidade de confirmação",
          "text": [
            "Uma transação reúne mudanças que devem confirmar ou falhar como unidade conforme o contrato do banco. BEGIN inicia, COMMIT confirma e ROLLBACK descarta alterações não confirmadas. Atomicidade não significa que qualquer efeito fora do banco será desfeito.",
            "Uma transferência exige debitar e creditar dentro da mesma transação e preservar suas regras. Executar duas consultas com autocommit separado permite um estado parcial se a segunda falhar. Valide também montantes e integridade do saldo."
          ]
        },
        {
          "title": "Savepoints e estado de falha",
          "text": [
            "SAVEPOINT marca um ponto interno para rollback parcial. Em PostgreSQL, um erro pode deixar a transação sem aceitar novas operações até recuperação adequada; capturar a mensagem no cliente não restaura automaticamente o estado transacional.",
            "Use savepoints quando a regra permite continuar após uma falha localizada. Não os transforme em uma forma de ignorar dados inválidos sem uma política. O resultado final deve informar quais ações foram confirmadas."
          ]
        },
        {
          "title": "MVCC e snapshots",
          "text": [
            "MVCC permite que consultas observem versões apropriadas dos dados sem equivaler sempre a bloquear toda leitura contra toda escrita. O snapshot disponível depende do isolamento e do momento da operação.",
            "Em read committed, comandos sucessivos podem observar confirmações diferentes. Repeatable read conserva um snapshot de transação com regras próprias e não resolve todo padrão de anomalia. Leia o contrato do PostgreSQL em vez de aplicar uma definição genérica de outro banco."
          ]
        },
        {
          "title": "Isolamento e invariantes",
          "text": [
            "Serializable busca um comportamento equivalente a uma ordem serial de transações e pode exigir repetir uma transação que falhou por conflito. Repetição precisa refazer a unidade inteira e preservar idempotência de efeitos externos.",
            "Uma regra envolvendo várias linhas pode falhar sob concorrência mesmo quando cada UPDATE é válido. Modele restrições no banco e escolha locks ou isolamento adequados ao padrão. Teste duas sessões e a sequência que produz o conflito."
          ]
        },
        {
          "title": "Locks e deadlocks",
          "text": [
            "SELECT FOR UPDATE pode bloquear linhas relevantes antes de uma decisão de alteração. O conjunto bloqueado e o momento importam; ler um valor sem proteção e atualizar depois pode usar uma hipótese desatualizada.",
            "Duas transações que adquirem recursos em ordens opostas podem gerar deadlock. Uma ordem consistente reduz certos padrões e o cliente precisa tratar a falha que o banco retorna. Não mantenha uma transação aberta durante interação humana longa."
          ]
        },
        {
          "title": "Recuperação e efeitos externos",
          "text": [
            "Um timeout do cliente não prova que a transação foi descartada: a confirmação pode ter ocorrido e a resposta se perdido. Defina identificadores idempotentes e uma forma de conferir estado antes de repetir uma operação com efeito.",
            "Mensagens e serviços externos não participam automaticamente da transação SQL. Padrões como outbox podem ligar confirmação de dados a publicação posterior com regras explícitas. Documente os limites de consistência do fluxo completo."
          ]
        }
      ],
      "code": "BEGIN;\nCREATE TEMP TABLE contas(id integer PRIMARY KEY,saldo integer NOT NULL CHECK(saldo>=0));\nINSERT INTO contas VALUES(1,100),(2,50);\nSAVEPOINT antes_da_transferencia;\nUPDATE contas SET saldo=saldo-20 WHERE id=1;\nUPDATE contas SET saldo=saldo+20 WHERE id=2;\nSELECT * FROM contas ORDER BY id;\nROLLBACK TO SAVEPOINT antes_da_transferencia;\nSELECT * FROM contas ORDER BY id;\nROLLBACK;",
      "output": "Antes do rollback parcial, os saldos são 80 e 70. Depois, voltam a 100 e 50. O exemplo demonstra savepoint numa sessão e não prova comportamento concorrente entre várias sessões.",
      "trace": [
        "As duas mudanças pertencem à mesma transação.",
        "O savepoint foi criado antes da transferência.",
        "Rollback parcial restaura esse ponto; rollback final descarta o cenário temporário."
      ],
      "exercise": "Crie duas contas temporárias e transfira 30 preservando a soma. Use uma transação e uma verificação que falha se a soma final mudar; documente que produção exige política concorrente e identificação idempotente.",
      "solution": "BEGIN;\nCREATE TEMP TABLE contas(id integer PRIMARY KEY,saldo integer NOT NULL CHECK(saldo>=0));\nINSERT INTO contas VALUES(1,100),(2,50);\nUPDATE contas SET saldo=saldo-30 WHERE id=1;\nUPDATE contas SET saldo=saldo+30 WHERE id=2;\nDO $$ BEGIN IF (SELECT sum(saldo) FROM contas)<>150 THEN RAISE EXCEPTION 'soma violada'; END IF; END $$;\nSELECT * FROM contas ORDER BY id;\nROLLBACK;",
      "bug": "Debitar em uma transação e creditar em outra permite confirmar apenas metade de uma transferência. Uma falha intermediária viola o contrato mesmo que cada comando isolado esteja correto.",
      "bugCode": "BEGIN;\nUPDATE contas SET saldo=saldo-30 WHERE id=1;\nCOMMIT;\n-- Uma falha aqui pode impedir o crédito seguinte.\nUPDATE contas SET saldo=saldo+30 WHERE id=2;",
      "repair": "Coloque a unidade lógica numa transação e analise concorrência, saldo suficiente e existência das contas. Um exemplo de uma sessão não é uma validação de isolamento entre clientes.",
      "checks": [
        "A operação confirma como unidade e conserva suas invariantes.",
        "Falhas transacionais são recuperadas ou repetidas com política explícita.",
        "Testes concorrentes usam duas sessões quando a regra depende de concorrência."
      ],
      "project": "Descreva e execute um cenário de duas sessões que disputam um saldo. Compare uma leitura sem proteção com uma estratégia adequada e registre ordem, bloqueios e tratamento de falha.",
      "question": "Um COMMIT SQL desfaz automaticamente uma mensagem enviada a um serviço externo quando algo depois falha?",
      "answer": "Não; efeitos externos exigem um contrato próprio de consistência e recuperação.",
      "distractors": [
        "Sim; todo efeito do processo entra automaticamente na transação.",
        "Sim; qualquer timeout garante rollback do banco."
      ]
    },
    {
      "id": "sql-isolamento-sessoes",
      "title": "PostgreSQL: transações, snapshots e conflitos entre sessões",
      "level": "Avançado",
      "summary": "Observe o mesmo dado por conexões diferentes e explique o que cada transação pode enxergar. Compare Read Committed e Repeatable Read com um cronograma explícito, reproduza SQLSTATE 40001 e reinicie a transação inteira com dados atuais. Separe atomicidade, restrições e isolamento, sem tratar uma sequência executada em uma única conexão como prova de concorrência.",
      "source": "https://www.postgresql.org/docs/current/transaction-iso.html",
      "topics": [
        "atomicidade BEGIN COMMIT ROLLBACK",
        "Read Committed e snapshot por comando",
        "Repeatable Read e snapshot da transação",
        "sessões separadas e cronograma observável",
        "atualização concorrente e SQLSTATE 40001",
        "repetição da transação inteira",
        "conexão encerrada e rollback pendente",
        "restrições de dados e isolamento"
      ],
      "sections": [
        {
          "title": "Uma transação delimita um resultado que pode ser confirmado",
          "text": [
            "BEGIN inicia uma transação explícita, COMMIT confirma suas alterações e ROLLBACK abandona o que ainda não foi confirmado. Uma transferência entre contas precisa tratar as duas atualizações como parte da mesma unidade de trabalho. Se só a retirada for confirmada, o contrato da operação foi quebrado. Atomicidade estabelece a unidade confirmada ou abandonada; ela não diz por si só quais versões dos dados outras transações podem observar durante essa operação.",
            "Trabalhe numa base descartável e defina os dados iniciais antes de executar. Um rollback não desfaz uma transação que outra conexão já confirmou. Cada sessão tem seu próprio estado transacional, então o cronograma deve mostrar qual conexão executa cada comando. Nas atividades, o CI cria um esquema exclusivo, abre processos psql separados e remove os objetos ao terminar. Não reutilize os nomes de estudo sobre tabelas reais de produção.",
            "Para o roteiro manual, abra cada sessão com psql -X -q -A -t -v ON_ERROR_STOP=1 -v VERBOSITY=verbose, conectadas à mesma base descartável. As opções tornam o erro visível. No uso interativo, ON_ERROR_STOP retorna ao prompt; após o erro, execute ROLLBACK na sessão falha antes de seguir. O verificador usa entrada não interativa e confere o encerramento do processo."
          ]
        },
        {
          "title": "Read Committed enxerga uma versão para cada comando",
          "text": [
            "No PostgreSQL, Read Committed é o nível padrão de isolamento. Uma consulta comum observa um snapshot dos dados confirmados relevante ao início daquele comando; ela não lê automaticamente as mudanças ainda não confirmadas de outra sessão. Uma segunda consulta na mesma transação pode observar uma confirmação que aconteceu entre os dois comandos. A transação continua aberta, mas a visão de leitura não é congelada para todo seu percurso nesse nível.",
            "No cronograma de referência, A lê 10. B altera para 20 e confirma. A lê de novo e obtém 20 antes de confirmar sua própria transação. Esse resultado não prova que A viu a escrita enquanto B ainda a realizava: a ordem explicita o COMMIT de B antes da segunda leitura. Para investigar um comportamento concorrente, registre comandos e confirmações. Dois SELECT consecutivos numa só conexão, sem uma escrita externa entre eles, não distinguem os níveis ensinados."
          ],
          "code": "-- Abra cada sessão com: psql -X -q -A -t -v ON_ERROR_STOP=1 -v VERBOSITY=verbose\n-- Em uma base de estudo, execute a preparação uma vez.\nCREATE SCHEMA estudo_isolamento;\nCREATE TABLE estudo_isolamento.saldo(id integer PRIMARY KEY, valor integer NOT NULL CHECK(valor >= 0));\nINSERT INTO estudo_isolamento.saldo VALUES(1,10);\n\n-- Passo 1: sessão A; saída: 10\nBEGIN ISOLATION LEVEL READ COMMITTED;\nSELECT valor FROM estudo_isolamento.saldo WHERE id=1;\n\n-- Passo 2: sessão B; saída: sem linhas\nBEGIN;\nUPDATE estudo_isolamento.saldo SET valor=20 WHERE id=1;\nCOMMIT;\n\n-- Passo 3: sessão A; saída: 20\nSELECT valor FROM estudo_isolamento.saldo WHERE id=1;\n\n-- Passo 4: sessão A; saída: sem linhas\nCOMMIT;\n\n-- Depois de encerrar todas as transações, confira em outra sessão.\nSELECT valor FROM estudo_isolamento.saldo WHERE id=1;\n-- Resultado final: 20\nDROP SCHEMA estudo_isolamento CASCADE;"
        },
        {
          "title": "Repeatable Read conserva um snapshot da transação",
          "text": [
            "Repeatable Read conserva uma visão de leitura baseada no snapshot estabelecido para a transação. A pode ler 10, esperar B confirmar 20 e continuar lendo 10 dentro desse mesmo percurso. Após A terminar, uma nova leitura em outra transação pode ver 20. O snapshot não significa que a atualização de B foi perdida nem que o valor físico continua sendo 10. Ele determina qual versão a leitura de A pode observar.",
            "Essa estabilidade é útil quando várias consultas precisam trabalhar sobre a mesma visão, mas não equivale a serialização completa de qualquer regra de negócio. Uma leitura consistente e a autorização para escrever depois são questões diferentes. Uma transação longa também mantém necessidades de versões antigas e merece análise operacional. Evite deixar sessões esquecidas com BEGIN aberto enquanto interpreta o exercício; termine cada trajetória e confirme o estado final por uma leitura nova."
          ]
        },
        {
          "title": "Uma visão antiga pode entrar em conflito com uma escrita",
          "text": [
            "Na segunda atividade, A e B estabelecem suas visões sobre o valor 10. A incrementa e confirma 20. Quando B tenta atualizar essa mesma linha no seu percurso Repeatable Read, sua tentativa encontra uma mudança concorrente incompatível com aquela visão e recebe SQLSTATE 40001. Trate o código de estado como categoria da falha, em vez de depender do texto da mensagem, que pode variar com versão ou idioma do servidor.",
            "A falha não autoriza continuar o mesmo roteiro como se o incremento tivesse acontecido. Uma transação em erro precisa ser encerrada; os comandos e decisões que dependeram de suas leituras devem ser refeitos numa nova transação. No verificador, o psql recebe entrada não interativa com ON_ERROR_STOP: a sessão B termina e suas alterações pendentes não são confirmadas. Ao digitar interativamente, o psql retorna ao prompt; execute ROLLBACK antes de reutilizar B. Aplicações com conexões persistentes precisam executar o rollback apropriado antes de reutilizar a conexão e seguir o contrato de seu driver."
          ]
        },
        {
          "title": "Repetir a unidade inteira exige preservar a intenção",
          "text": [
            "A intenção do exemplo é acrescentar dez, e não fixar sempre o saldo no valor calculado a partir de uma leitura antiga. A nova sessão C lê 20 e repete a unidade de trabalho, confirmando 30. Essa repetição mostra a leitura atual e a atualização relativa; copiar um valor absoluto calculado em B poderia sobrescrever uma contribuição válida. Documente a operação que pode ser repetida e quais decisões precisam ser recalculadas.",
            "Em um sistema real, limite tentativas e trate esgotamento de repetição como resultado possível. Efeitos externos, como enviar e-mail ou cobrar um serviço, não são desfeitos pelo rollback do banco e não devem ser repetidos sem uma estratégia de idempotência. O exercício contém somente efeitos no banco para isolar o mecanismo. Aumentar o nível para Serializable pode detectar outras anomalias e também exigir repetição; não apresente um nível de isolamento como substituto de um contrato de falhas."
          ]
        },
        {
          "title": "Restrições e isolamento respondem a perguntas diferentes",
          "text": [
            "NOT NULL, CHECK, PRIMARY KEY e outras restrições protegem propriedades dos dados segundo suas regras. O isolamento organiza a interação entre transações. Uma tabela pode impedir saldo negativo e ainda permitir um roteiro de leitura e escrita que não corresponde à intenção do negócio. No exercício de transferência, verificamos a soma e os saldos individuais; nas atividades entre sessões, verificamos as versões observadas, o estado de erro específico e o resultado confirmado.",
            "Os cronogramas publicados são executados por um verificador com conexões distintas e prazos finitos. A sequência de passos oferece sincronização observável, sem usar uma pausa arbitrária como prova de que outra transação terminou. Os exemplos desta aula não pretendem cobrir todos os padrões de locks, deadlocks ou recuperação operacional. Para avançar, reproduza um lock numa terceira sessão observadora, documente o recurso esperado e acrescente uma política de tempo e de recuperação adequada ao caso."
          ]
        }
      ],
      "postgresScenario": {
        "id": "read-committed",
        "setup": "CREATE TABLE {{schema}}.saldo(id integer PRIMARY KEY, valor integer NOT NULL CHECK(valor >= 0));\nINSERT INTO {{schema}}.saldo VALUES(1,10);",
        "steps": [
          {
            "session": "A",
            "sql": "BEGIN ISOLATION LEVEL READ COMMITTED;\nSELECT valor FROM {{schema}}.saldo WHERE id=1;",
            "expectedOutput": [
              "10"
            ]
          },
          {
            "session": "B",
            "sql": "BEGIN;\nUPDATE {{schema}}.saldo SET valor=20 WHERE id=1;\nCOMMIT;",
            "expectedOutput": []
          },
          {
            "session": "A",
            "sql": "SELECT valor FROM {{schema}}.saldo WHERE id=1;",
            "expectedOutput": [
              "20"
            ]
          },
          {
            "session": "A",
            "sql": "COMMIT;",
            "expectedOutput": []
          }
        ],
        "finalSql": "SELECT valor FROM {{schema}}.saldo WHERE id=1;",
        "finalOutput": [
          "20"
        ]
      },
      "code": "BEGIN;\nCREATE TEMP TABLE unidade_tx(id integer PRIMARY KEY, valor integer NOT NULL CHECK(valor >= 0));\nINSERT INTO unidade_tx VALUES(1,10);\nSAVEPOINT antes;\nUPDATE unidade_tx SET valor=20 WHERE id=1;\nROLLBACK TO SAVEPOINT antes;\nDO $$\nBEGIN\n IF (SELECT valor FROM unidade_tx WHERE id=1) <> 10 THEN RAISE EXCEPTION 'savepoint'; END IF;\nEND $$;\nSELECT valor FROM unidade_tx WHERE id=1;\nROLLBACK;",
      "expectedOutput": [
        "10"
      ],
      "output": "O programa de uma sessão retorna 10 após desfazer a atualização até o savepoint. O cronograma abaixo é outro experimento, com sessões diferentes: em Read Committed a sessão A observa 10 e depois 20.",
      "trace": [
        "Savepoint registra uma posição dentro da transação; rollback até ele desfaz a atualização posterior.",
        "A tabela temporária permite conferir o exemplo sem alterar dados permanentes.",
        "O teste de isolamento usa conexões diferentes e só passa à segunda leitura após o COMMIT externo."
      ],
      "exercise": "Implemente uma transferência de 20 entre duas contas temporárias, inicialmente com 100 e 50. Exija saldo não negativo, execute débito e crédito na mesma transação e confira saldo final 80 e 70, soma 150. Esse exemplo prova a unidade de trabalho local; não o apresente como uma demonstração de conflitos entre clientes.",
      "checks": [
        "As duas alterações pertencem à mesma transação.",
        "Os saldos finais são 80 e 70 e a soma conserva 150.",
        "O estudo não deixa objetos permanentes no banco."
      ],
      "solution": "BEGIN;\nCREATE TEMP TABLE contas_tx(id integer PRIMARY KEY, saldo integer NOT NULL CHECK(saldo >= 0));\nINSERT INTO contas_tx VALUES(1,100),(2,50);\nUPDATE contas_tx SET saldo=saldo-20 WHERE id=1;\nUPDATE contas_tx SET saldo=saldo+20 WHERE id=2;\nDO $$\nBEGIN\n IF (SELECT saldo FROM contas_tx WHERE id=1) <> 80 OR\n    (SELECT saldo FROM contas_tx WHERE id=2) <> 70 OR\n    (SELECT sum(saldo) FROM contas_tx) <> 150\n THEN RAISE EXCEPTION 'transferência'; END IF;\nEND $$;\nSELECT id,saldo FROM contas_tx ORDER BY id;\nROLLBACK;",
      "solutionOutput": [
        "1|80",
        "2|70"
      ],
      "bug": "O código tenta repetir somente a atualização que falhou, dentro da mesma transação em erro. Isso conserva decisões da visão anterior e não reinicia a unidade de trabalho.",
      "bugCode": "-- Sessão B, após receber SQLSTATE 40001:\n-- A transação está em erro; esta atualização não reinicia suas leituras.\nUPDATE estudo_isolamento.saldo SET valor=valor+10 WHERE id=1;\nCOMMIT;",
      "repair": "Encerre o percurso falho, abra uma nova transação, releia os dados e repita as decisões e operações da unidade. A atividade usa uma nova sessão C após o término de B pelo ON_ERROR_STOP em modo não interativo; um cliente persistente deve tratar rollback e reutilização de conexão conforme seu driver.",
      "project": "Construa um roteiro de reserva de uma quantidade em estoque com dois clientes. Descreva saldo inicial, ordem dos comandos, nível de isolamento, operação relativa ou pré-condição e categoria de falha. Primeiro reproduza um conflito deterministicamente, depois implemente uma repetição limitada que refaz a leitura. Teste ausência de saldo suficiente e evite efeitos externos no trecho repetível. Registre o resultado confirmado em uma terceira consulta, depois encerre todas as sessões.",
      "question": "Depois de SQLSTATE 40001, qual é a unidade adequada para repetir o trabalho do exemplo?",
      "answer": "Uma nova transação que refaz as leituras e decisões da operação inteira, após encerrar a tentativa falha.",
      "distractors": [
        "Somente o último UPDATE, mantendo a mesma transação em erro e todos os valores antigos.",
        "Todo efeito externo já realizado, porque rollback do banco também desfaz e-mails e cobranças."
      ],
      "practices": [
        {
          "id": "snapshot",
          "title": "Problema 1: comparar a leitura antiga com uma leitura nova",
          "topics": [
            "Repeatable Read e snapshot da transação",
            "sessões separadas e cronograma observável"
          ],
          "prompt": "Use conexões A e B numa base de estudo. A inicia Repeatable Read e lê 10; B confirma 20; A precisa continuar lendo 10 até encerrar. Depois de COMMIT, uma leitura nova de A deve retornar 20. Execute cada bloco apenas na sessão indicada e compare com o cronograma Read Committed da teoria.",
          "solution": "-- Abra cada sessão com: psql -X -q -A -t -v ON_ERROR_STOP=1 -v VERBOSITY=verbose\n-- Em uma base de estudo, execute a preparação uma vez.\nCREATE SCHEMA estudo_isolamento;\nCREATE TABLE estudo_isolamento.saldo(id integer PRIMARY KEY, valor integer NOT NULL CHECK(valor >= 0));\nINSERT INTO estudo_isolamento.saldo VALUES(1,10);\n\n-- Passo 1: sessão A; saída: 10\nBEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT valor FROM estudo_isolamento.saldo WHERE id=1;\n\n-- Passo 2: sessão B; saída: sem linhas\nBEGIN;\nUPDATE estudo_isolamento.saldo SET valor=20 WHERE id=1;\nCOMMIT;\n\n-- Passo 3: sessão A; saída: 10\nSELECT valor FROM estudo_isolamento.saldo WHERE id=1;\n\n-- Passo 4: sessão A; saída: sem linhas\nCOMMIT;\n\n-- Passo 5: sessão A; saída: 20\nSELECT valor FROM estudo_isolamento.saldo WHERE id=1;\n\n-- Depois de encerrar todas as transações, confira em outra sessão.\nSELECT valor FROM estudo_isolamento.saldo WHERE id=1;\n-- Resultado final: 20\nDROP SCHEMA estudo_isolamento CASCADE;",
          "postgresScenario": {
            "id": "repeatable-read",
            "setup": "CREATE TABLE {{schema}}.saldo(id integer PRIMARY KEY, valor integer NOT NULL CHECK(valor >= 0));\nINSERT INTO {{schema}}.saldo VALUES(1,10);",
            "steps": [
              {
                "session": "A",
                "sql": "BEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT valor FROM {{schema}}.saldo WHERE id=1;",
                "expectedOutput": [
                  "10"
                ]
              },
              {
                "session": "B",
                "sql": "BEGIN;\nUPDATE {{schema}}.saldo SET valor=20 WHERE id=1;\nCOMMIT;",
                "expectedOutput": []
              },
              {
                "session": "A",
                "sql": "SELECT valor FROM {{schema}}.saldo WHERE id=1;",
                "expectedOutput": [
                  "10"
                ]
              },
              {
                "session": "A",
                "sql": "COMMIT;",
                "expectedOutput": []
              },
              {
                "session": "A",
                "sql": "SELECT valor FROM {{schema}}.saldo WHERE id=1;",
                "expectedOutput": [
                  "20"
                ]
              }
            ],
            "finalSql": "SELECT valor FROM {{schema}}.saldo WHERE id=1;",
            "finalOutput": [
              "20"
            ]
          },
          "explanation": [
            "A primeira leitura de A estabelece a visão que a transação Repeatable Read conserva. O COMMIT de B torna 20 disponível para transações apropriadas, mas não troca o snapshot que A já utiliza. Por isso a segunda leitura de A ainda devolve 10.",
            "Depois do COMMIT de A, a leitura seguinte ocorre em outra transação e observa 20. O verificador mantém processos psql distintos para A e B e compara cada resposta na ordem indicada. Concatenar todos os blocos numa única conexão mudaria o experimento e não provaria o mecanismo solicitado."
          ],
          "checks": [
            "A observa 10 duas vezes dentro do percurso Repeatable Read.",
            "B confirma a atualização antes da segunda leitura de A.",
            "Uma leitura nova após o COMMIT de A observa 20."
          ]
        },
        {
          "id": "conflito",
          "title": "Problema 2: repetir depois de um conflito de atualização",
          "topics": [
            "atualização concorrente e SQLSTATE 40001",
            "repetição da transação inteira",
            "conexão encerrada e rollback pendente",
            "sessões separadas e cronograma observável"
          ],
          "prompt": "A e B iniciam Repeatable Read e leem 10. A incrementa dez e confirma. B tenta o mesmo incremento e deve receber SQLSTATE 40001. Encerre a tentativa falha; uma nova sessão C relê 20, repete a operação e confirma 30. Não substitua a verificação do código de erro por qualquer falha genérica.",
          "solution": "-- Abra cada sessão com: psql -X -q -A -t -v ON_ERROR_STOP=1 -v VERBOSITY=verbose\n-- Em uma base de estudo, execute a preparação uma vez.\nCREATE SCHEMA estudo_isolamento;\nCREATE TABLE estudo_isolamento.saldo(id integer PRIMARY KEY, valor integer NOT NULL CHECK(valor >= 0));\nINSERT INTO estudo_isolamento.saldo VALUES(1,10);\n\n-- Passo 1: sessão A; saída: 10\nBEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT valor FROM estudo_isolamento.saldo WHERE id=1;\n\n-- Passo 2: sessão B; saída: 10\nBEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT valor FROM estudo_isolamento.saldo WHERE id=1;\n\n-- Passo 3: sessão A; saída: sem linhas\nUPDATE estudo_isolamento.saldo SET valor=valor+10 WHERE id=1;\nCOMMIT;\n\n-- Passo 4: sessão B, erro SQLSTATE 40001\nUPDATE estudo_isolamento.saldo SET valor=valor+10 WHERE id=1;\n\n-- Após o erro 40001, no psql interativo execute ROLLBACK; na sessão B.\n-- O verificador não interativo encerra B automaticamente e aguarda seus streams.\n\n-- Passo 5: sessão C; saída: 20\nBEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT valor FROM estudo_isolamento.saldo WHERE id=1;\n\n-- Passo 6: sessão C; saída: sem linhas\nUPDATE estudo_isolamento.saldo SET valor=valor+10 WHERE id=1;\nCOMMIT;\n\n-- Depois de encerrar todas as transações, confira em outra sessão.\nSELECT valor FROM estudo_isolamento.saldo WHERE id=1;\n-- Resultado final: 30\nDROP SCHEMA estudo_isolamento CASCADE;",
          "postgresScenario": {
            "id": "conflict-retry",
            "setup": "CREATE TABLE {{schema}}.saldo(id integer PRIMARY KEY, valor integer NOT NULL CHECK(valor >= 0));\nINSERT INTO {{schema}}.saldo VALUES(1,10);",
            "steps": [
              {
                "session": "A",
                "sql": "BEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT valor FROM {{schema}}.saldo WHERE id=1;",
                "expectedOutput": [
                  "10"
                ]
              },
              {
                "session": "B",
                "sql": "BEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT valor FROM {{schema}}.saldo WHERE id=1;",
                "expectedOutput": [
                  "10"
                ]
              },
              {
                "session": "A",
                "sql": "UPDATE {{schema}}.saldo SET valor=valor+10 WHERE id=1;\nCOMMIT;",
                "expectedOutput": []
              },
              {
                "session": "B",
                "sql": "UPDATE {{schema}}.saldo SET valor=valor+10 WHERE id=1;",
                "expectedError": "40001"
              },
              {
                "session": "C",
                "sql": "BEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT valor FROM {{schema}}.saldo WHERE id=1;",
                "expectedOutput": [
                  "20"
                ]
              },
              {
                "session": "C",
                "sql": "UPDATE {{schema}}.saldo SET valor=valor+10 WHERE id=1;\nCOMMIT;",
                "expectedOutput": []
              }
            ],
            "finalSql": "SELECT valor FROM {{schema}}.saldo WHERE id=1;",
            "finalOutput": [
              "30"
            ]
          },
          "explanation": [
            "A confirmação de A muda a linha que B tentava atualizar a partir de sua visão anterior. O experimento exige especificamente 40001; uma falha de conexão ou um erro de sintaxe não contam como demonstração de conflito. No verificador não interativo, ON_ERROR_STOP encerra o processo psql de B e a transação pendente não é confirmada. No prompt interativo, execute ROLLBACK em B; o retorno ao prompt não confirma o encerramento da transação.",
            "C representa uma nova tentativa, com nova leitura e atualização relativa. Seu valor final 30 conserva os dois incrementos pretendidos. Num cliente persistente, a aplicação precisa encerrar explicitamente a transação em erro e definir limite de repetição; efeitos fora do banco exigem um contrato adicional."
          ],
          "checks": [
            "B termina com o SQLSTATE esperado 40001.",
            "C começa uma nova transação e observa 20 antes de alterar.",
            "O resultado confirmado final é 30, com cada tentativa encerrada."
          ]
        }
      ]
    },
    {
      "id": "sql-indices-planos",
      "title": "SQL: índices, planos e otimização",
      "level": "Especialização",
      "summary": "Aprenda a investigar consultas com EXPLAIN e dados representativos, escolhendo índices pelo padrão de acesso. Estude B-tree, índices compostos, parciais e de expressão, estatísticas, scans, joins físicos e custos de escrita, evitando otimizações que apenas funcionam em uma tabela minúscula.",
      "topics": [
        "EXPLAIN ANALYZE BUFFERS",
        "statistics ANALYZE estimates",
        "B-tree composite order",
        "partial expression covering indexes",
        "GIN GiST BRIN",
        "sequential index bitmap scans",
        "join strategies",
        "sargability",
        "write costs maintenance"
      ],
      "sections": [
        {
          "title": "O plano é uma hipótese de trabalho",
          "text": [
            "EXPLAIN mostra a estratégia planejada; ANALYZE executa e mede. Estimativas e valores reais podem divergir por estatísticas, distribuição ou parâmetros. BUFFERS ajuda a observar acesso a páginas, com interpretação adequada.",
            "EXPLAIN ANALYZE de um comando com efeito executa esse efeito. Use um cenário controlado e uma estratégia transacional quando precisar inspecioná-lo. Não trate o comando como uma leitura inofensiva universal."
          ]
        },
        {
          "title": "Estatísticas e distribuição",
          "text": [
            "O otimizador depende de estimativas de cardinalidade e custo. ANALYZE atualiza estatísticas; dados enviesados e relações entre colunas podem exigir atenção adicional. Uma tabela pequena pode justificar scan sequencial mesmo com um índice disponível.",
            "Teste com volume e distribuição parecidos com o uso real. Repetir uma consulta em cache difere da primeira leitura. Não force um tipo de scan para provar que o índice é bom sem compreender o custo total."
          ]
        },
        {
          "title": "B-tree e chaves compostas",
          "text": [
            "B-tree atende vários padrões de igualdade, faixa e ordenação. Em índices compostos, a ordem das colunas influencia como predicados e ordenação podem ser usados, com nuances do planejador e da versão.",
            "Escolha um índice a partir de consultas frequentes e seletividade. Índice sobre cada coluna isolada não equivale sempre a um composto. A ordem desejada e os limites da consulta podem importar tanto quanto o filtro."
          ]
        },
        {
          "title": "Índices especializados",
          "text": [
            "Índice parcial cobre linhas que satisfazem um predicado; a consulta precisa permitir ao planejador relacionar seu filtro à condição. Índice de expressão atende uma expressão específica e tem custo de manutenção.",
            "GIN, GiST e BRIN atendem padrões distintos, como certas buscas estruturadas, espaciais ou dados correlacionados com posição física. Não escolha o nome mais avançado: verifique operadores, distribuição e workload que ele atende."
          ]
        },
        {
          "title": "Acesso e joins físicos",
          "text": [
            "Scan sequencial, index scan e bitmap scan têm custos diferentes conforme quantidade de linhas e páginas. Index-only scan depende de condições além de ter as colunas no índice, como informação de visibilidade disponível.",
            "Nested loop, hash join e merge join são estratégias físicas, não mudanças da pergunta SQL. Um plano ruim pode começar numa cardinalidade errada em uma origem. Reduza dados cedo quando a semântica permitir e confira a causa das estimativas."
          ]
        },
        {
          "title": "Custo completo",
          "text": [
            "Índices usam espaço e tornam inserções, alterações e manutenção mais caras. A otimização deve medir leitura e escrita, não só uma consulta favorita. Uma lista crescente de índices redundantes aumenta custo operacional.",
            "Prefira consultas que permitem usar o padrão de acesso sem uma função desnecessária sobre cada valor filtrado, ou um índice de expressão apropriado. Conserve resultados e ordenação; performance não justifica omitir registros corretos."
          ]
        }
      ],
      "code": "BEGIN;\nCREATE TEMP TABLE sessoes(id integer PRIMARY KEY,aluno_id integer,minutos integer);\nINSERT INTO sessoes SELECT g,(g%100),g%60 FROM generate_series(1,10000) AS g;\nCREATE INDEX sessoes_aluno_id_idx ON sessoes(aluno_id,id);\nANALYZE sessoes;\nEXPLAIN (ANALYZE,BUFFERS) SELECT id,minutos FROM sessoes WHERE aluno_id=7 ORDER BY id LIMIT 10;\nROLLBACK;",
      "output": "O plano e os tempos variam por ambiente. A consulta procura um aluno, ordena por id e limita dez linhas; o índice composto é uma hipótese a avaliar, não uma promessa de um nó exato no plano.",
      "trace": [
        "generate_series cria um volume e distribuição conhecidos.",
        "ANALYZE oferece estatísticas da tabela.",
        "EXPLAIN ANALYZE executa o SELECT e mostra estimativas e medições."
      ],
      "exercise": "Crie um conjunto de 10000 sessões e compare a mesma consulta antes e depois de um índice composto, conferindo que os resultados são iguais. Registre plano, linhas e buffers em vez de exigir um tempo fixo.",
      "solution": "BEGIN;\nCREATE TEMP TABLE sessoes(id integer PRIMARY KEY,aluno_id integer,minutos integer);\nINSERT INTO sessoes SELECT g,g%100,g%60 FROM generate_series(1,10000) AS g;\nANALYZE sessoes;\nCREATE TEMP TABLE antes AS SELECT id,minutos FROM sessoes WHERE aluno_id=7 ORDER BY id LIMIT 10;\nEXPLAIN(ANALYZE,BUFFERS) SELECT id,minutos FROM sessoes WHERE aluno_id=7 ORDER BY id LIMIT 10;\nCREATE INDEX ON sessoes(aluno_id,id);\nANALYZE sessoes;\nEXPLAIN(ANALYZE,BUFFERS) SELECT id,minutos FROM sessoes WHERE aluno_id=7 ORDER BY id LIMIT 10;\nDO $$ BEGIN IF EXISTS(SELECT 1 FROM ((TABLE antes EXCEPT (SELECT id,minutos FROM sessoes WHERE aluno_id=7 ORDER BY id LIMIT 10)) UNION ALL ((SELECT id,minutos FROM sessoes WHERE aluno_id=7 ORDER BY id LIMIT 10) EXCEPT TABLE antes)) AS diferenca) THEN RAISE EXCEPTION 'resultado mudou'; END IF; END $$;\nROLLBACK;",
      "bug": "Medir uma tabela de três linhas e concluir que um índice nunca serve ignora tamanho, distribuição e custo de acesso. Um scan sequencial pode ser a melhor escolha nesse pequeno cenário.",
      "bugCode": "-- Três linhas não representam necessariamente o workload real.\nEXPLAIN ANALYZE SELECT * FROM sessoes WHERE aluno_id=7;",
      "repair": "Use carga representativa e compare resultados e custos. Não exija que o planejador use um índice quando sua estimativa aponta outra estratégia mais barata.",
      "checks": [
        "Resultados são preservados antes e depois da otimização.",
        "O workload e a distribuição estão documentados.",
        "São considerados custos de escrita, espaço e manutenção."
      ],
      "project": "Selecione três consultas de um relatório e registre seus planos com dados representativos. Proponha o menor conjunto de índices útil e explique uma consulta que deve continuar com scan sequencial.",
      "question": "EXPLAIN ANALYZE apenas descreve um comando sem executá-lo?",
      "answer": "Não; ele executa o comando para medir seu comportamento.",
      "distractors": [
        "Sim; nunca produz efeitos.",
        "Sim; apenas consulta o nome dos índices."
      ]
    },
    {
      "id": "sql-esquema-avancado",
      "title": "SQL: views, recursão, JSON e evolução",
      "level": "Especialização",
      "summary": "Componha estruturas e rotinas avançadas sem perder integridade ou compatibilidade. Estude views, materialização, CTEs recursivas, JSONB, funções, triggers, particionamento, permissões e migrations, definindo fontes de verdade e estratégias de atualização para cada recurso.",
      "topics": [
        "views materialized refresh",
        "recursive CTE termination cycles",
        "JSONB operators indexes",
        "functions procedures triggers",
        "generated identity columns",
        "partitioning pruning",
        "roles grants least privilege",
        "schema migrations compatibility",
        "backup restore verification"
      ],
      "sections": [
        {
          "title": "Views e resultados materializados",
          "text": [
            "Uma view nomeia uma consulta e não é automaticamente uma cópia armazenada de seus resultados. Materialized view guarda resultados e precisa de uma política de refresh. Defina atraso aceitável e efeito de atualização sobre consumidores.",
            "Uma view pode formar uma API de dados, mas alteração de colunas e permissões ainda exige compatibilidade. Não use view como garantia universal de autorização sem compreender regras do banco e contexto de execução."
          ]
        },
        {
          "title": "Recursão e hierarquias",
          "text": [
            "Uma CTE recursiva combina um caso inicial e um passo que produz novas linhas. O passo precisa progredir e ter uma política de término. Dados com ciclos podem exigir identificação de caminhos ou mecanismos de detecção.",
            "UNION ALL conserva repetições e pode continuar expandindo num ciclo; UNION elimina duplicações segundo todas as colunas e não é uma solução universal para todo caminho. Teste raiz, folha, ausência e ciclo no modelo escolhido."
          ]
        },
        {
          "title": "JSON sem abandonar contratos",
          "text": [
            "JSONB guarda dados estruturados com operações e índices específicos no PostgreSQL. Extração de texto e extração de JSON têm resultados diferentes; campos ausentes e valores null precisam de interpretação.",
            "Use colunas e restrições para invariantes centrais quando isso facilita integridade e consultas. Um documento flexível não deve virar depósito de formatos incompatíveis sem versão e validação. Escolha índices conforme os operadores realmente usados."
          ]
        },
        {
          "title": "Rotinas e efeitos",
          "text": [
            "Funções, procedimentos e triggers têm contratos distintos e restrições do contexto. Um trigger pode preservar uma regra ou manter dados derivados, mas acrescenta comportamento que não aparece diretamente na consulta do cliente.",
            "Documente ordem, falhas e custo; teste alterações em lote e rollback. Rotinas que executam com privilégios elevados exigem cuidado com nomes de objetos, parâmetros e ambiente. Não construa SQL dinâmico com concatenação de dados externos."
          ]
        },
        {
          "title": "Partições e evolução",
          "text": [
            "Particionamento organiza dados por uma regra e pode permitir pruning quando a consulta restringe a chave adequada. Não cria velocidade automática para toda consulta e afeta operações e restrições suportadas.",
            "Uma migration precisa de estratégia para dados existentes, duração de locks e clientes antigos. Em mudanças incompatíveis, uma sequência expandir, migrar e contrair pode conservar disponibilidade. Teste ida e recuperação no cenário permitido pelo projeto."
          ]
        },
        {
          "title": "Permissões e recuperação",
          "text": [
            "Roles e GRANT devem limitar operações ao necessário. Um cliente que só consulta não precisa poder alterar esquema. Parâmetros de query evitam tratar dados como código, mas não substituem autorização.",
            "Backup precisa de teste de restauração e verificação de integridade. Um arquivo criado não prova que o sistema pode ser recuperado. Documente versão, extensões, sequência e critérios de aceitação de uma restauração."
          ]
        }
      ],
      "code": "BEGIN;\nCREATE TEMP TABLE temas(id integer PRIMARY KEY,pai_id integer REFERENCES temas(id),nome text NOT NULL);\nINSERT INTO temas VALUES(1,NULL,'Programação'),(2,1,'Web'),(3,2,'HTML');\nWITH RECURSIVE percurso AS(\n  SELECT id,pai_id,nome,0 AS nivel,ARRAY[id] AS caminho FROM temas WHERE pai_id IS NULL\n  UNION ALL\n  SELECT t.id,t.pai_id,t.nome,p.nivel+1,p.caminho||t.id FROM temas t JOIN percurso p ON t.pai_id=p.id WHERE NOT t.id=ANY(p.caminho)\n)\nSELECT nome,nivel FROM percurso ORDER BY caminho;\nROLLBACK;",
      "output": "O percurso apresenta Programação no nível 0, Web no 1 e HTML no 2. O caminho impede repetir um id já visitado naquele ramo, e o caso inicial escolhe as raízes.",
      "trace": [
        "O caso inicial identifica temas sem pai.",
        "O passo conecta filhos ao id da linha anterior.",
        "A guarda de caminho limita repetição em dados cíclicos alcançáveis."
      ],
      "exercise": "Crie uma tabela temporária com id e JSONB de preferências. Insira duas linhas, consulte somente quem habilitou revisão e apresente o nome como texto. Defina como tratar campo ausente.",
      "solution": "BEGIN;\nCREATE TEMP TABLE preferencias(id integer PRIMARY KEY,dados jsonb NOT NULL CHECK(jsonb_typeof(dados)='object'));\nINSERT INTO preferencias VALUES(1,'{\"nome\":\"Lia\",\"revisar\":true}'),(2,'{\"nome\":\"Ana\"}');\nSELECT id,dados->>'nome' AS nome FROM preferencias WHERE dados @> '{\"revisar\":true}'::jsonb ORDER BY id;\nDO $$ BEGIN IF (SELECT count(*) FROM preferencias WHERE dados @> '{\"revisar\":true}'::jsonb)<>1 THEN RAISE EXCEPTION 'resultado incorreto'; END IF; END $$;\nROLLBACK;",
      "bug": "Uma CTE recursiva sem progresso ou guarda pode expandir indefinidamente quando os dados têm um ciclo. LIMIT externo não é uma estratégia universal de segurança para todas as formas de consulta.",
      "bugCode": "WITH RECURSIVE repeticao(n) AS(SELECT 1 UNION ALL SELECT n FROM repeticao) SELECT * FROM repeticao;",
      "repair": "Defina um passo que progride, um limite de domínio e uma estratégia de detecção de ciclo quando apropriado. Configure limites operacionais como proteção adicional, preservando a lógica correta.",
      "checks": [
        "Recursão tem término e política de ciclos.",
        "JSON tem versão e contrato, inclusive para ausência.",
        "Migrations, permissões e restauração são verificadas no ambiente de destino."
      ],
      "project": "Modele uma hierarquia de temas com preferências versionadas e uma view de leitura. Escreva uma migration compatível e um roteiro de backup e restauração testado em uma base descartável.",
      "question": "Uma materialized view mantém seus resultados automaticamente atualizados por qualquer mudança nas tabelas?",
      "answer": "Não; precisa de uma política de atualização apropriada.",
      "distractors": [
        "Sim; é idêntica a uma view comum em todo comportamento.",
        "Sim; elimina qualquer necessidade de transações."
      ]
    }
  ]
} satisfies DeepCourse;

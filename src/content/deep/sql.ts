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

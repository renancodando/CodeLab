export const solucoesSql:Record<string,string>={
 "sql-crud-depurar-pendencias": "SELECT id,titulo FROM tarefas WHERE concluida=0 ORDER BY id;",
 "sql-depurar-clientes-pagos": "SELECT c.id AS cliente_id, count(p.id) AS pagos\nFROM clientes c LEFT JOIN pedidos p ON p.cliente_id=c.id AND p.status='pago'\nGROUP BY c.id ORDER BY c.id;",
 "sql-depurar-totais-colecoes": "WITH totais_itens AS (SELECT pedido_id,sum(centavos) AS total FROM itens GROUP BY pedido_id),\ntotais_pagamentos AS (SELECT pedido_id,sum(centavos) AS total FROM pagamentos GROUP BY pedido_id)\nSELECT p.id AS pedido_id,coalesce(i.total,0) AS itens,coalesce(pg.total,0) AS pagamentos\nFROM pedidos p LEFT JOIN totais_itens i ON i.pedido_id=p.id\nLEFT JOIN totais_pagamentos pg ON pg.pedido_id=p.id ORDER BY p.id;"
};

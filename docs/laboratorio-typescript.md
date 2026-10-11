# TypeScript local no laboratório

## Fluxo

A opção TypeScript compila um script único usando o compilador oficial 5.9.3 fixado e bibliotecas de tipos ES2022 locais. A compilação usa strict e noEmitOnError. Interfaces, generics, narrowing e outros contratos são realmente conferidos; não é apenas coloração de JavaScript.

Executar mostra os diagnósticos oficiais, com código, linha e coluna, e marca as posições no Monaco. Uma compilação sem erros exibe o JavaScript emitido em uma seção expansível. Só depois esse JavaScript segue para o Worker QuickJS já existente. O compilador não executa o programa do aluno. Mensagens oficiais do TypeScript continuam no idioma fornecido pelo pacote.

A edição durante uma compilação ou execução cancela a tarefa; resultados de uma versão anterior não substituem a bancada atual. Parar, trocar linguagem e sair também encerram os Workers. Consultar ou executar livremente não atribui domínio por habilidade.

## Contrato do ambiente

É um script isolado de até 30.000 caracteres, com console.log. Imports, exports externos e pacotes dependem do ambiente indicado na aula; a bancada explica isso e permite exportar o .ts. Não representa um projeto Node, navegador com DOM, bundler ou servidor. Não há acesso a DOM, rede, arquivos, temporizadores ou APIs remotas de execução pelo código TypeScript.

Os tipos não são validação de dados em runtime. any, assertions e declarações podem esconder problemas; o JavaScript resultante ainda pode falhar. As bibliotecas ES2022 descrevem tipos de linguagem, não garantem todos os recursos opcionais de qualquer host no QuickJS. Verifique o ambiente real e os erros de execução quando uma API não estiver disponível. Não se promete equivalência completa com Node ou um navegador.

## Limites

- Importação do carregador e carga do Worker compartilham 20 segundos.
- Depois de pronto, o compilador tem até oito segundos; mensagens duplicadas de pronto não renovam esse prazo.
- São exibidos até 50 diagnósticos, cada um com até 1.000 caracteres.
- JavaScript emitido acima de 30.000 caracteres é recusado; não há truncamento executável.
- A execução mantém os limites existentes do QuickJS: 4 MiB do interpretador, pilha de 256 KiB, interrupção por CPU, prazo externo de oito segundos e limites de saída.

Os 4 MiB não limitam o heap do compilador JavaScript do navegador. O compilador pode consumir mais memória, especialmente com tipos complexos; vive em Worker descartável e possui prazo, mas isso não é um limite absoluto de memória do processo. FPS e memória em celular físico ainda não foram medidos. Nenhum limite do executor anterior foi ampliado.

## Carregamento e offline

O compilador não entra no bundle inicial nem no precache essencial. Selecionar a linguagem não o baixa; Executar carrega o módulo e o Worker. Ambos são opcionais do cache na mesma origem. O primeiro uso exige conexão, e uma atualização ou quota pode exigir novo carregamento. Falha de cache não bloqueia a resposta online.

Rascunho, projetos e backup conservam o TypeScript original, inclusive arquivo vazio; JavaScript emitido e diagnósticos não substituem a fonte. Exportar produz projeto.ts. O banco SQL continua descartável, com os três recursos opcionais anteriores, e os projetos JavaScript mantêm rascunhos independentes.

## Verificação

O protótipo externo foi medido antes da integração: Worker de 4.063.109 bytes, 1.079.874 gzip, quatro casos reais no Edge sob CSP sem unsafe-eval. O caso válido compilou e emitiu em 406 ms, 902 ms incluindo a carga local; são medidas de desktop, não uma previsão de desempenho em celular ou rede lenta.

A implementação tem testes com compilador e bibliotecas reais, casos vazios/mistos executados no QuickJS, erros semânticos com posição, strict, sintaxe, APIs ausentes, módulos, referências externas, limites e any sem acesso a rede. Os testes de ciclo de vida verificam prazo, cancelamento, resposta tardia e descarte; jornada/cache têm testes próprios. Exigir os fluxos reais de navegador, CI completo do head, revisão, árvore e deployment/SHA antes de declarar produção. A entrega foi integrada pela PR #34 e verificada no domínio; TypeScript e os projetos de múltiplos arquivos continuam abertos. Os registros locais seguintes preservam a sequência de validação.

Referências oficiais: [Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API), [strict](https://www.typescriptlang.org/tsconfig/strict.html), [noEmitOnError](https://www.typescriptlang.org/tsconfig/noEmitOnError.html), [modelos de módulos e hosts](https://www.typescriptlang.org/docs/handbook/modules/theory.html).


Na integração final, strict/build passaram e 34 testes específicos passaram (21 compilador/execução, cinco de ciclo de vida, dois de jornada e seis de cache). O build teve inicial 197,63 kB gzip e mundo 135,94 kB; o Worker TypeScript ficou com 4.066,93 kB, separado dos 35 recursos essenciais, com cinco opcionais incluindo os três SQL. A duração local desse build foi 7 min 27 s; builds anteriores ficaram em 49/66 s. Não se usa essa variação como medição de FPS.

O lote local de 13 fluxos aprovou 12 e excedeu a espera antiga de cinco segundos na abertura do editor SQL; o caso restante passou isoladamente (51,3 s), sem ampliar seu prazo. Os quatro fluxos TypeScript desse lote passaram. A ampliação de memória está em repetição final. A suíte completa anterior terminou 621/629 com os mesmos oito timeouts herdados de TypeScript de conteúdo, memória e geração de métricas; não é aprovação. A origem de diagnóstico foi ampliada depois, com os 34 específicos aprovados. A espera do teste novo TypeScript foi alinhada a 36 segundos, o orçamento de 20 para carregar + oito para compilar + oito para executar; os limites da aplicação não foram ampliados.


A abertura do Monaco também passa a ter prazo de 20 segundos. Enquanto carrega ou após uma falha, Exportar usa a fonte preservada, mesmo sem editor montado. Uma resposta tardia não cria o editor depois de expirar; recarregar permite tentar novamente. Ao trocar linguagem, os marcadores TypeScript são removidos. A validação de navegador foi dividida em seis histórias, incluindo falha real de carregamento, cancelamento, limite de memória e recuperação. Os resultados finais ainda precisam ser registrados.


A validação final contra o build concluído aprovou as seis histórias TypeScript em 5,3 min: diagnósticos/emit/isolamento; projetos/backup/offline/220–4000 px; cancelamento/CPU/memória/edição/saída; primeiro uso offline; prazo do módulo; e prazo do editor com exportação sem Monaco e recuperação após reload. A compilação TypeScript e a execução QuickJS foram reais. Esta prova local não substitui CI completo, revisão, árvore e conferência do domínio.


A revisão da PR #34 encontrou recusa indevida de export dentro de namespace. Dois testes reproduziram a falha com o compilador real, incluindo membro com tipo incorreto. A detecção passa a usar isExternalModule do TypeScript e conserva a recusa de import externo, import de tipo e import dinâmico. Namespaces internos, inclusive aninhados, mesclados e aliases internos, continuam sendo scripts isolados; seus tipos são conferidos normalmente. Os novos testes e o CI do head corrigido precisam passar antes da integração. A regressão adicional SQL aprovou os quatro fluxos locais (2,9 min).

Os 36 testes específicos do head corrigido passaram: 23 compilador/execução, cinco de ciclo de vida, dois de jornada e seis de cache. Os dois casos de namespace falharam antes da correção e passaram depois, com JavaScript real executado no QuickJS. O CI anterior aprovou 630 unidades e build, mas não valida esta correção posterior; exigir o novo run completo.

O run 38155371592 aprovou 632 unidades, compiladores/build/API/cache/auditoria e uma parcela completa de navegador; a outra teve 70/71, pois o teste editava depois que o programa já havia terminado. O teste agora retém somente a mensagem desse caso antes de entregá-la ao Worker real, edita, confirma descarte e libera a mensagem tardia. A repetição local passou (33,4 s). Nenhum prazo de execução foi ampliado; exigir novo CI completo do head do teste corrigido.


## Integração e produção verificadas

As PRs #34/#35 foram integradas com árvores iguais aos heads aprovados. TypeScript: run 38163020418, 632 unidades e 142 fluxos; merge 147658af86c04c94a1a894e8aa04bc024d237835, deployment dpl_3c5ETa3xqZdb54aXPe7phvhz4PfG READY/production com esse SHA e seis fluxos públicos aprovados em 4,6 min. Importação JavaScript: run 38163600601, 644 unidades e 144 fluxos; merge e0e15e5d18e405cf8f5ab1f6376d36720022a548, deployment dpl_9S2Jqs52jZS4wCNuCZuemiYqfHwE READY/production com esse SHA e dois fluxos públicos aprovados em 1,3 min. Revisões resolvidas. Incluem compiladores, PostgreSQL, API/cache e auditoria; não encerram currículo, módulos TypeScript ou medição em celular físico.

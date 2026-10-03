# Auditoria inicial da arquitetura

Estado observado em 03/10/2026, no commit `8c2dd2f`. Este documento registra o ponto de partida da migração local, sem alterar o conteúdo nem a aparência da aplicação.

## O que já funciona

- O projeto é uma SPA Vite em TypeScript. O build gera páginas estáticas para as 60 aulas e os conceitos, além de `robots.txt` e `sitemap.xml` condicionados a uma origem HTTPS real.
- As 12 trilhas reúnem 60 aulas com 12 capítulos profundos cada. A busca inclui esse conteúdo. Há oito missões JavaScript com casos de avaliação e feedback.
- O progresso, os rascunhos, até 12 projetos de arquivo único, as tentativas e as pistas são salvos no navegador. Há exportação e importação JSON da jornada, sem conta.
- O laboratório usa Monaco sob demanda. HTML roda em `iframe` com sandbox e CSP; JavaScript roda em QuickJS/WebAssembly dentro de um Worker descartável, com limites de tempo, memória do interpretador e saída.
- O mundo 3D, a simulação de clima, o áudio opcional, o cache da Open-Meteo e o modo de movimento reduzido já existem. O mundo, o editor e o executor têm rotinas de descarte.
- Há testes unitários, testes Playwright e uma workflow de CI para `npm ci`, testes unitários, build e build .NET.

## O que está parcial

- O fluxo principal das aulas ainda é uma leitura longa seguida de uma única pergunta. Os capítulos servem como bom material de aprofundamento, mas não registram etapas, respostas, domínio por capacidade ou revisão espaçada.
- O perfil chama de domínio um estado derivado de conclusão e pistas das missões; não mede reconhecimento, produção, depuração e aplicação separadamente.
- Projetos usam um único campo `code` no `localStorage`. Não há arquivos, pastas, abas, histórico durável nem IndexedDB.
- O backup tem `version: 1`, mas a importação aceita só essa versão e a normalização corta entradas acima dos limites. Dados maiores podem ser perdidos na restauração sem uma comparação explícita.
- A execução SQL na bancada apenas exporta `.sql`. Os testes de exemplos SQL usam SQLite do Node, que não integra a aplicação no navegador.
- Python, C# e C++ na bancada dependem de `/api/executions` e de Judge0 configurado. Sem isso, recebem erro. As aulas, a edição e a exportação continuam disponíveis.
- O preview HTML não impõe limite de CPU a scripts arbitrários. O botão Parar recria o documento, mas um loop infinito pode travar a aba.
- A workflow ainda não instala Chromium nem executa Playwright. O Playwright local depende do servidor .NET para testes de API e páginas estáticas servidas pela API.

## Dependências do backend e sequência segura

O frontend consulta a API própria somente para a execução remota de Python, C# e C++ na bancada. As rotas de catálogo do servidor duplicam o currículo que já está no frontend e não são usadas pela SPA. O build também grava `server/Content/curriculum.json` para essas rotas. O proxy `/api` do Vite serve à execução remota. Portanto, remover `server/` agora interromperia essas três opções e os testes E2E que usam a API.

1. Criar uma aula modelo de etapas com persistência, correção e execução local, preservando os capítulos como aprofundamento.
2. Consolidar o armazenamento, migrar dados antigos sem perda silenciosa e incluir projetos multiarquivo no IndexedDB.
3. Integrar SQL e Python no navegador sob demanda, com Workers e cancelamento onde viável. Medir o custo antes de escolher qualquer runtime para C# ou C++.
4. Atualizar a bancada e os testes para não requisitar `/api`; só então remover o proxy, a geração de catálogo para o servidor, o Judge0, a API e os testes correspondentes.
5. Executar Playwright no CI e validar as rotas estáticas em um servidor de arquivos estáticos.

## Evidência de base

Nesta máquina, `npm ci` instalou 57 pacotes sem vulnerabilidades reportadas. TypeScript e o build Vite passaram; o bundle inicial tem cerca de 246 KB de JavaScript (87 KB gzip), o mundo 516 KB (133 KB gzip), Monaco 2,28 MB (589 KB gzip) e QuickJS WASM 519 KB (243 KB gzip). Nos testes unitários, 81 de 82 passaram; o teste de alocação de memória do QuickJS excedeu o limite de dez segundos. O Playwright ainda não iniciou porque o carregador padrão de configuração do Vite tentou ler um diretório fora do sandbox desta máquina. O carregador `runner` compilou o frontend aqui. Essas observações não comprovam o comportamento em outros dispositivos.

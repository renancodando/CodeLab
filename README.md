# CODELAB

Versão inicial de uma plataforma para aprender programação com missões, editor e um ambiente visual. **O projeto ainda está em desenvolvimento; o fluxo completo de missão no navegador tem uma falha pendente de diagnóstico.**

## Rodar localmente

Requisitos: Node.js 22 ou superior, npm e SDK .NET 10.

```sh
npm ci
npm run build
dotnet run --project server/CodeLab.Api.csproj
```

Em outro terminal, na mesma pasta:

```sh
npm run dev
```

Abra **http://127.0.0.1:5173/**. A API fica em `http://127.0.0.1:5080` e o Vite encaminha `/api` para ela. Use esse endereço exato: o perfil de desenvolvimento configura essa origem para cadastro e gravação de progresso.

O build gera o catálogo usado pela API e as páginas educacionais públicas. O servidor cria o banco SQLite em `server/App_Data/`. Dependências, banco e arquivos gerados não fazem parte do repositório.

## Implementado

- Interface em TypeScript/Vite, casa ilustrada e exterior procedural Three.js.
- Oito missões de fundamentos com Monaco, pistas, histórico e resultados visuais.
- Executor JavaScript QuickJS/WebAssembly em Worker, com limites de tempo e memória.
- Progresso local e exportação/importação da jornada.
- Laboratório HTML/CSS/JavaScript com preview isolado e exportação de arquivo.
- Biblioteca e seis páginas educacionais pré-renderizadas.
- API ASP.NET Core 10: cadastro, login, logout e salvamento/restauração de progresso em SQLite.
- Integração optativa com Open-Meteo e cálculo solar/lunar com SunCalc.
- Adaptador Judge0 para execução remota, dependente de configuração externa.

## Validação e pendências

A compilação TypeScript/Vite e a geração das seis páginas públicas passaram nesta revisão. O executor passou em **16 de 17 testes locais**: o teste de alocação excessiva de memória excedeu o limite de 10 segundos, inclusive na repetição sem compilação concorrente. As soluções das oito missões, o isolamento e a interrupção de loop infinito passaram. A integração de contas e persistência passou na verificação anterior. **Esses resultados não comprovam o fluxo completo da interface.**

Os testes e suas ferramentas foram mantidos fora deste envio para deixar no repositório apenas os arquivos necessários à execução e compilação.

Pendências conhecidas:

1. **Execução da missão no navegador:** o teste escreveu `acender();` e clicou Executar, mas não encontrou a mensagem de sucesso. É necessário diagnosticar a ligação entre editor, Worker e resultado e repetir o fluxo completo.
   **Estresse de memória:** investigar também o timeout de alocação excessiva. O encerramento pelo Worker tem limite próprio de oito segundos, mas essa proteção ainda precisa ser verificada no fluxo completo do navegador.
2. **Python, C# e C++:** configurar uma instância Judge0, credenciais e IDs de linguagens; a execução remota não foi validada.
3. **Currículo:** faltam as trilhas completas de C#, SQL, APIs, backend e full stack. A edição atual cobre fundamentos.
4. **Projetos:** as duas propostas compartilham uma bancada local; faltam múltiplos projetos persistentes, múltiplos arquivos, GitHub e publicação de aplicações.
5. **Qualidade final:** testes de acessibilidade, responsividade, clima, laboratório e desempenho ainda não foram concluídos.
6. **Ambiente visual:** o interior é uma imagem com janelas transparentes; o exterior é 3D estilizado. Faltam efeitos avançados de chuva, tempestade, superfícies molhadas e áudio ambiental completo.
7. **Infraestrutura de produção:** faltam implantação, HTTPS, recuperação de senha, confirmação de e-mail, persistência das chaves de sessão, revisão de segurança e adaptação para SQL Server.

O preview HTML usa sandbox e CSP para isolar o documento pai, mas não tem o limite de CPU do QuickJS. Antes de disponibilizá-lo publicamente, tratar scripts infinitos com uma estratégia adicional de isolamento. O progresso calculado no cliente não deve fundamentar certificações ou rankings sem validação confiável no servidor.

## Configuração opcional

`.env.example` lista os nomes das configurações, sem credenciais. As configurações .NET devem ser definidas como variáveis de ambiente; o servidor não carrega esse arquivo automaticamente.

- `Judge0__Url`, `Judge0__Token` e `Judge0__Languages__python`, `Judge0__Languages__csharp`, `Judge0__Languages__cpp`: usar os IDs da instalação escolhida.
- `Frontend__Origin` e `AllowedHosts`: ajustar para o domínio real.
- `CODELAB_PUBLIC_URL`: definir a origem HTTPS real no ambiente antes de executar o build. Sem ela, a indexação das páginas públicas fica desativada.

A fila Judge0 é local e volátil. Cancelamento interrompe a espera do CODELAB; execuções já enviadas continuam sujeitas aos limites do serviço remoto.

## Código e recursos

`src/` contém interface, conteúdo, execução e ambiente; `server/` contém a API; `scripts/prerender.mjs` gera as páginas públicas e o catálogo da API. `public/assets/casa.png` é a arte do interior gerada a partir da referência fornecida, com transparência nas janelas. A paisagem externa é renderizada separadamente.

Referências: [QuickJS Emscripten](https://github.com/justjake/quickjs-emscripten), [SunCalc](https://github.com/mourner/suncalc), [Open-Meteo](https://open-meteo.com/en/docs), [Judge0](https://ce.judge0.com/) e [MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript). Fontes visuais são carregadas do Google Fonts.

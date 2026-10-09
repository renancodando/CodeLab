# Meteorologia e atmosfera

## Contrato do mundo

O mundo é uma representação procedural orientada por dados, sem precisão meteorológica física ou localização de células em metros. Previsão não confirma chuva local. O campo `current` da Open-Meteo vem de modelos; somente evidência observacional recente e próxima pode alimentar precipitação local.

`meteorologia/modelo.ts` descreve leituras com tipo, captura, recebimento, validade, distância, qualidade e cobertura. `normalizacao.ts` conserva ausência como null e converte acumulados por intervalo para taxa. `confianca.ts` combina variáveis, direção circular do vento, frescor, distância e divergência. Leituras duplicadas não aumentam evidência.

Radar recente no ponto e pluviômetro concordante podem produzir “Chuva observada na região”. Estação próxima com chuva recente pode produzir observação regional; evidência menos forte produz “Chuva provável”. Uma célula fora do ponto produz “Chuva nas proximidades”, sem molhar o solo local. Modelo isolado produz “Possibilidade de chuva” ou “Condição estimada”. Fontes discordantes indicam variação local. Nenhuma leitura válida produz “Dados temporariamente insuficientes”.

Esses limiares são escolhas conservadoras do produto, não probabilidades calibradas. Valores de confiança ficam internos. Ausência de leitura não equivale a ausência de chuva. Um pluviômetro precisa informar taxa referente ao período conhecido; acumulado histórico não deve ser enviado como chuva instantânea.

## Fontes verificadas em 8 de outubro de 2026

| Fonte | Situação | Contrato e limites |
| --- | --- | --- |
| [Open-Meteo](https://open-meteo.com/en/docs) | Integrada como modelo | API JSON respondeu 200 e CORS *. Sem chave no uso gratuito elegível. Consulta do modelo a cada 30 min; validade interna de 2 h. Temperatura, umidade, orvalho, camadas de nuvens, vento, rajada, visibilidade e radiação são estimativas. |
| [NOAA/AWC METAR](https://aviationweather.gov/data/api/) | Integrada por rota na mesma origem | JSON oficial de aeroportos, sem CORS e sem chave. A API informa limite de 100 requisições/minuto; boletins geralmente horários. Backend .NET e função Vercel consultam somente sete códigos permitidos, com cache/backoff de 10 min por estação, deduplicação, timeout de 6 s e resposta limitada a 100 kB. |
| [CPTEC/INPE](https://servicos.cptec.inpe.br/XML/) | Não ativada | Serviço oficial documenta XML de previsão/estações, mas o endpoint de condição da estação SBSP retornou 403 na consulta. Disponibilidade, CORS, limites e permissão de reutilização ainda precisam ser confirmados para o contrato escolhido. Sem scraping. |
| [Cemaden PED](https://sws.cemaden.gov.br/PED/api/ui/swagger.json) | Não ativada | A especificação oficial acessível exige token JWT nos endpoints de acumulados. Precisa de acesso autorizado no backend e confirmação de termos, limites, período e latência. Nenhuma chave no navegador. |
| [RainViewer](https://www.rainviewer.com/api/transition-faq.html) | Não ativada como evidência | Nowcasting e satélite IR foram descontinuados em janeiro de 2026. Histórico raster tem restrições de uso e não foi convertido em detecção quantitativa no ponto: cobertura, ausência de dados e cores não podem ser confundidas com ausência de chuva. |

Os [termos Open-Meteo](https://open-meteo.com/en/terms) limitam a API gratuita a usos elegíveis não comerciais, com limites de chamadas e atribuição CC BY 4.0. Uma implantação comercial deve escolher o plano apropriado. Os [termos do NWS](https://www.weather.gov/disclaimer) tratam informação pública, atribuição, ausência de endosso e limitações de atualização; material de terceiros pode ter direitos próprios. A interface mantém atribuição às fontes integradas.

Os conectores adicionais usam `FonteComplementar`: cada um define consulta, intervalo e leituras normalizadas de observação, radar ou pluviômetro. O agendador, cache, expiração e testes já aceitam esses tipos. Não há conectores vivos CPTEC/Cemaden/radar escondidos ou alegação de cobertura nacional.

## Localização, rede e hospedagem

A escolha é optativa. Latitude/longitude são arredondadas para duas casas decimais antes da consulta Open-Meteo e ficam apenas em memória. A estação é escolhida localmente entre SBSP, SBRJ, SBCT, SBPA, SBRF, SBEG e LPPT, até 50 km. O backend recebe somente o código público. Uma estação a mais de 5 km não confirma precipitação no ponto; qualidade diminui com a distância. Não há registro autoral de coordenadas, rastreamento ou analytics.

`GET /api/meteorologia/observacao?estacao=SBSP` possui duas entradas compatíveis: servidor .NET e função Node.js `api/meteorologia/observacao.ts` na Vercel, com o mesmo contrato `{recebidoEm,dados}`. A função usa Request/Response nativos, não acrescenta dependências ao cliente e rejeita métodos de escrita, códigos fora da lista, parâmetros extras e repetidos. Só consulta a URL oficial fixa, sem encaminhar cookies ou seguir redirecionamentos. Não se usa proxy público de terceiros.

Na Vercel, a resposta pública por estação recebe `s-maxage=600`; erros sem boletim não são armazenados no CDN. Cache, deduplicação e backoff em memória duram apenas enquanto a instância existir. O CDN reduz chamadas entre instâncias, mas esse desenho não garante um limite global de 100 requisições/minuto durante expansão ou múltiplas regiões. Medir consumo antes de ampliar cobertura/tráfego; se necessário, acrescentar coordenação compartilhada no servidor. Não persistir coordenadas para isso.

Hospedagem sem essa rota pode retornar 404 ou HTML; o cliente mantém modelo/últimas leituras e expira confiança. Antes da atualização, o domínio público e o preview autenticado retornaram 404. A consulta real pelo novo adaptador local recebeu JSON HTTP 200 da NOAA. Isso ainda não comprova implantação: conferir novamente o preview e o domínio no commit publicado.

Modelo e fontes complementares possuem cadências independentes. Cache do modelo limita quatro locais; complementares limitam 16 entradas. Fontes lentas expiram em 8 s. Troca de local cancela consultas anteriores, e revisão da seleção impede resposta atrasada de alterar o mundo. Falhas mantêm a última captura/recepção sem rejuvenescimento. Depois de três validades a leitura deixa de contribuir; a precipitação local deixa de ser sustentada antes disso, ao sair da janela recente. A interface recalcula idade e resumo a cada minuto, e o mundo a cada segundo. Renderização e astronomia continuam locais.

## Continuidade visual

- A simulação interpola cobertura, camadas, vento, direção pelo menor arco, chuva, visibilidade, neblina e condensação em tempos próprios. Não recria céu a cada consulta.
- O pool persistente possui 42 massas com sementes, alturas, dimensões, densidade, idade e vida próprias. Camadas baixas, médias e altas têm espessuras, velocidades e atenuação diferentes. Massas crescem e dissipam antes de renovar a forma. Sobreposição representa massas parcialmente fundidas; não é classificação meteorológica.
- Quatro células visuais acompanham massas baixas. Chuva distante fica no horizonte; densidade, comprimento, velocidade, inclinação e opacidade das gotas respondem continuamente à intensidade. São regiões ilustrativas, sem posição real de radar.
- METAR informa fenômenos e intensidade qualitativa, não mm/h medidos. Seu valor indicativo é usado somente na escala visual. Dados quantitativos de radar/pluviômetro precisam conservar unidade e intervalo.
- METAR distingue líquido, neve/gelo, granizo, mistura e fase desconhecida; neve ou granizo puros não fabricam chuva líquida nem trovoada. Fenômenos VC ficam próximos e neve levantada pelo vento não vira precipitação nova. PWINO retira evidência do sensor de tempo presente sem descartar temperatura e vento.
- O esquema público consultado não define uma tabela de bits de qcField para invalidar METAR. O valor bruto fica no diagnóstico, sem regra “diferente de zero = inválido”. Captura, distância, campos finitos, fenômenos e indisponibilidade explícita do sensor regulam uso dos dados. Não foram inventadas máscaras de bits.
- Vento médio e pulsos de rajada são compartilhados por nuvens, chuva, névoa, vegetação, folhas, água e áudio, com inércias distintas.
- Sol, Lua e fase lunar continuam no SunCalc. Camadas, radiação e máscara espacial de massas modulam luz direta e noturna. Estrelas recebem máscara por região; nuvem alta fina atenua menos. Sombras acompanham luz quando o nível de qualidade permite.
- Visibilidade, diferença temperatura/orvalho, umidade, vento, luz e umidade do solo contribuem para névoa contínua. Umidade alta isolada não obriga neblina.
- Solo mantém água acumulada, umidade visual, precipitação recente e tempo desde chuva. Temperatura, Sol, vento e umidade regulam secagem aproximada. Poças, material escuro, brilho, escoamento e som residual diminuem gradualmente.
- Condensação modifica acabamento e brilho das janelas 3D existentes. O interior continua uma imagem com transparências: não há máscara de embaçamento independente dos vidros dessa imagem.
- Trovões exigem evidência observacional convectiva; previsão de trovoada ou chuva comum não basta. Clarões permanecem optativos e desligados com movimento reduzido. Distância/posição do evento são simuladas.

O shader de nuvens usa duas ou três escalas de ruído conforme qualidade; névoa usa duas a quatro faixas. Pools de partículas e geometrias são reaproveitados. A qualidade adapta resolução, sombras e quantidade de detalhes, preservando o estado meteorológico. Não foram acrescentados runtimes ou dependências ao carregamento inicial; Three.js permanece sob demanda.

A água também recebe a atenuação de neblina do terreno; visibilidade modula luz direta. Tentativas do modelo possuem relógio próprio por local, incluindo falhas sem cache: atualizar METAR a cada 10 min não multiplica tentativas Open-Meteo dentro dos 30 min. Nenhuma falha rejuvenesce a captura.

## Diagnóstico e validação

Em desenvolvimento, abrir `/?diagnostico-clima` acrescenta um painel discreto com fontes, idade, qualidade, variáveis, situação, intensidade visual, vento e memória do solo. Os cenários são sintéticos, seguem transições e não são apresentados como dados reais. Sol e Lua seguem o relógio; pós-chuva é reproduzido aplicando chuva e depois céu limpo.

Os testes determinísticos cobrem modelo molhado com radar/pluviômetro secos, concordância observacional, célula próxima, horários ausentes/futuros/antigos, divergência, distância, cache, cancelamento, falta de rede, cadências, timeout, normalização, vento circular, rajadas, memória/evaporação, nuvens persistentes e máscaras. O verificador .NET testa cache concorrente, expiração, falha sem rejuvenescimento, estações permitidas e cancelamento sem chamadas externas. A função Node tem testes de 30 consultas concorrentes, sete estações, expiração/backoff, falhas HTTP/JSON, corpo excessivo sem Content-Length, timeout, validação de entrada e contrato completo até o normalizador e a fusão usados pelo cliente.

Uma fixture exclusiva dos testes renderiza 13 cenários em desktop e viewport móvel: limpo, parcial, encoberto, chuvas fraca/moderada/forte, pós-chuva, neblina, vento, rajada, noites nublada/parcial e tempestade. Ela verifica estado, erros WebGL/shader e estabilidade de geometrias; capturas não são comparadas a pixels frágeis. Emulação móvel não comprova FPS em aparelho físico. O CI completo e a implantação precisam ser conferidos no head específico.

## Aprofundamentos restantes

Concluir acesso sustentável a radar/pluviômetros regionais, ampliar estações sem prometer chuva pontual de observações distantes, verificar a rota de observação no domínio publicado, medir em celulares físicos e avaliar uma máscara própria dos vidros do interior. Não substituir essas lacunas por previsão apresentada como observação.

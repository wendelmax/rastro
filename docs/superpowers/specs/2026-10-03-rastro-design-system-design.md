# Rastro — Design system e documentação como código

## Contexto

O Rastro já possui um MVP funcional em Expo/React Native, com rotas para
exploração, detalhe de trilha, planejamento, rastreamento, contribuição,
perfil e autenticação. A implementação atual repete `StyleSheet`, cores,
tipografia e padrões de botão em cada feature. Isso torna a evolução visual
mais lenta e dificulta que novos desenvolvedores entendam a intenção do
produto.

Este trabalho cria uma camada visual versionada no próprio código e uma
documentação operacional que explique produto, arquitetura, fluxos, decisões e
limites conhecidos.

## Objetivos

- Criar um design system pequeno, explícito e adequado a uso ao ar livre.
- Substituir estilos duplicados nas telas principais por tokens e componentes
  compartilhados.
- Preservar Expo/React Native, navegação existente, contratos de domínio e
  composição AWS/offline-first.
- Documentar onboarding, arquitetura, fluxos e decisões técnicas com arquivos
  que possam ser revisados em Pull Requests.
- Usar Mermaid para diagramas de contexto, containers, dados e fluxos.
- Tornar o visual acessível em telas pequenas, com toque confortável, contraste
  e estados claros de rede/GPS.

## Fora do escopo

- Trocar a biblioteca de mapas.
- Introduzir uma biblioteca visual externa completa.
- Reescrever regras de domínio, API ou infraestrutura AWS.
- Criar dashboard web administrativo nesta etapa.
- Definir identidade final de marketing, logo vetorial ou fonte proprietária.

## Direção visual: Rastro Terra

O visual deve parecer confiável em uma estrada de terra, não um painel
corporativo. A interface prioriza leitura rápida, contexto de segurança e
ações grandes para uso com atenção dividida.

### Tokens iniciais

| Grupo | Token | Valor | Uso |
| --- | --- | --- | --- |
| Cor | `background` | `#F6F2E9` | fundo principal claro |
| Cor | `surface` | `#FFFCF5` | cards e folhas |
| Cor | `ink` | `#17231F` | texto principal |
| Cor | `muted` | `#66736B` | texto auxiliar |
| Cor | `forest` | `#175C45` | ação principal e navegação |
| Cor | `forestStrong` | `#0F3F31` | ação pressionada/destaque |
| Cor | `clay` | `#C96A2B` | marca, CTA de aventura e atenção |
| Cor | `water` | `#197A8A` | água, mapas e navegação |
| Cor | `success` | `#2F7D4A` | trilha aberta/sincronizada |
| Cor | `warning` | `#A86516` | condição incerta/pendência |
| Cor | `danger` | `#B64A3B` | risco, bloqueio e erro |
| Espaço | `xs`–`xxl` | `4, 8, 12, 16, 24, 32` | escala de layout |
| Raio | `sm`–`pill` | `8, 12, 18, 999` | controles, cards e badges |
| Elevação | `card` | sombra baixa | separar superfície do fundo |

Tipografia usa as famílias nativas do sistema para não adicionar dependência
de fonte no MVP. A escala tem `caption`, `body`, `bodyLarge`, `title` e
`display`; títulos são fortes e curtos, enquanto metadados usam contraste
secundário sem depender apenas de cor.

### Regras de interação

- Área mínima de toque: 44 × 44 pt.
- CTA principal sempre aparece como botão preenchido.
- Ações secundárias usam contorno ou superfície, nunca competem com o CTA.
- Status de trilha combina cor, texto e, quando necessário, ícone.
- Erros de rede explicam se os dados foram salvos localmente.
- Mapas e fotos são conteúdo de apoio; dificuldade, condição e segurança vêm
  antes da ação de iniciar.
- Evitar gradientes, glassmorphism e animações decorativas que prejudiquem a
  leitura em campo.

## Arquitetura do design as code

```text
src/design/
├── tokens.ts                 # valores visuais sem dependência de feature
├── theme.ts                  # tema e helpers de composição
├── components/
│   ├── RastroScreen.tsx
│   ├── RastroText.tsx
│   ├── RastroButton.tsx
│   ├── RastroCard.tsx
│   ├── RastroBadge.tsx
│   ├── RastroSection.tsx
│   ├── TrailCard.tsx
│   └── index.ts
└── components.test.tsx       # contratos visuais e de acessibilidade
```

Os componentes são deliberadamente pequenos. Eles recebem dados e estados,
mas não conhecem repositórios, Cognito, SQLite ou navegação. Features continuam
responsáveis por buscar dados e decidir ações; o design system apenas renderiza
hierarquia e estado.

### Primitivas obrigatórias

- `RastroScreen`: fundo, safe area, scroll e espaçamento horizontal padrão.
- `RastroText`: variantes de texto e semântica acessível.
- `RastroButton`: `primary`, `secondary`, `quiet`, `danger`, `disabled` e
  `loading`.
- `RastroCard`: superfície com variantes `default`, `dark` e `outlined`.
- `RastroBadge`: dificuldade, condição, sincronização e tipo de ponto.
- `RastroSection`: título, subtítulo e ação opcional.
- `TrailCard`: resumo consistente da trilha com duração, dificuldade, status e
  adequação ao veículo.

## Composição das telas

### Explorar

Cabeçalho com saudação curta, busca/filtros de veículo, trilha em destaque e
lista de cards. Cada card apresenta região, dificuldade, duração, condição e
última atualização antes de abrir o detalhe.

### Detalhe da trilha

Mapa e resumo operacional no topo; depois metadados, pontos úteis, avaliações,
relatos recentes e ações Waze/Google Maps/Apple Maps. O botão de contribuição
fica associado à atividade, não misturado com navegação.

### Planejamento

Resumo de distância/duração, seleção de paradas, dicas e confirmação do
roteiro. O plano salvo precisa ser compreensível offline.

### Rastreamento

Tela escura de alta legibilidade durante a aventura. Estado do GPS, distância,
tempo, pontos coletados, pausa/retomada e finalização ficam sempre visíveis.
O aviso de sincronização informa que a atividade está segura localmente.

### Contribuição

Formulário curto para título, condição, água, obstáculos e dicas. O usuário
escolhe publicar relato ou criar fork. Feedback de sucesso/erro é explícito e
não promete publicação se a sincronização estiver pendente.

### Perfil

Identidade, veículos, atividades e contribuições em blocos escaneáveis. O
perfil também será o lugar para preferências, privacidade e estado de
sincronização em uma etapa posterior.

## Acessibilidade e estados

- Textos de status nunca dependem apenas da cor.
- Inputs exibem label/placeholder e mensagem de erro próxima ao campo.
- Botões desabilitados mantêm contraste suficiente e explicam o motivo quando
  necessário.
- Listas possuem estado vazio útil, não apenas uma frase genérica.
- Loading, erro, offline e sincronizado são estados de primeira classe.
- Testes de tela devem validar texto acessível e ações principais, além de
  snapshots quando a estrutura visual for relevante.

## Documentação a ser criada

| Arquivo | Conteúdo |
| --- | --- |
| `docs/design-system.md` | tokens, componentes, regras, exemplos e checklist visual |
| `docs/architecture.md` | contexto, containers, módulos, dados e limites |
| `docs/onboarding.md` | setup, comandos, ambiente, testes e fluxo de PR |
| `docs/flows/explore-trail.md` | descoberta, detalhe, mapa e planejamento |
| `docs/flows/record-and-contribute.md` | GPS offline, sync, relato e fork |
| `docs/decisions/ADR-001-mobile-first-offline.md` | decisão de produto/arquitetura |
| `docs/decisions/ADR-002-aws-native-backend.md` | decisão de infraestrutura |
| `docs/decisions/ADR-003-design-as-code.md` | decisão de UI versionada |
| `docs/diagrams/*.mermaid` | fontes dos desenhos de arquitetura e fluxos |
| `.superdesign/init/*` | contexto do código para futuras explorações visuais |

## Critérios de aceite

- Todas as telas principais usam tokens, sem novas cores hexadecimais locais.
- Pelo menos seis primitivas visuais reutilizáveis possuem testes.
- Existe documentação suficiente para um novo dev executar, testar e localizar
  as fronteiras mobile/domínio/AWS.
- Diagramas Mermaid renderizam a partir dos arquivos versionados.
- Testes existentes, TypeScript e lint continuam passando.
- O README aponta para o design system e para a documentação de arquitetura.

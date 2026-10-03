# Design system Rastro Terra

O Rastro Terra é o sistema visual do app mobile. Ele traduz o contexto de
trilhas off-road em uma interface legível, confiável e confortável para uso em
campo.

## Fonte de verdade

Os valores visuais vivem em:

- `src/design/tokens.ts`: cores, espaçamento, raios, tipografia e elevação.
- `src/design/theme.ts`: agrupamento público dos tokens.
- `src/design/components/`: primitivas sem regra de negócio.

Features podem compor esses componentes, mas não devem criar uma segunda
paleta local nem importar AWS, Cognito, SQLite ou repositórios a partir de
`src/design`.

## Paleta

| Token | Valor | Intenção |
| --- | --- | --- |
| `background` | `#F6F2E9` | areia do fundo principal |
| `surface` | `#FFFCF5` | cartão e folha de conteúdo |
| `ink` | `#17231F` | texto principal |
| `muted` | `#66736B` | texto auxiliar |
| `forest` | `#175C45` | ação principal |
| `forestStrong` | `#0F3F31` | ênfase e estado pressionado |
| `clay` | `#C96A2B` | marca e ação de aventura |
| `water` | `#197A8A` | água, mapa e navegação |
| `success` | `#2F7D4A` | aberto, salvo e sincronizado |
| `warning` | `#A86516` | condição incerta e pendência |
| `danger` | `#B64A3B` | bloqueio, risco e erro |
| `successSurface` | `#DCEEDB` | fundo de badge positivo |
| `warningSurface` | `#F8E8C8` | fundo de badge de atenção |
| `dangerSurface` | `#F4D8D2` | fundo de badge de risco |
| `waterSurface` | `#D8EFF0` | fundo de badge de água/mapa |
| `claySurface` | `#F5DFCF` | fundo de badge de dificuldade |

## Escalas

- Espaçamento: `xs=4`, `sm=8`, `md=12`, `lg=16`, `xl=24`, `xxl=32`.
- Raios: `sm=8`, `md=12`, `lg=18`, `pill=999`.
- Tipografia: `caption`, `body`, `bodyLarge`, `title`, `display`.
- Toque: controles interativos têm pelo menos 44 × 44 pt.

## Primitivas

### `RastroScreen`

Shell com `SafeAreaView`, fundo Rastro e padding padrão. Use `scroll` quando a
tela for um formulário ou detalhe longo. Para listas grandes, mantenha a lista
como filha do shell e use `FlatList` para preservar virtualização.

### `RastroText`

Use `variant="display"` para título de tela, `title` para seção, `bodyLarge`
para uma informação importante, `body` para texto corrente e `caption` para
metadados. Passe `color` somente quando o estado exigir contraste diferente.

### `RastroButton`

Variantes: `primary`, `secondary`, `quiet` e `danger`. `loading` desabilita a
ação e mostra indicador; `disabled` deve ser usado quando a ação não está
disponível. O componente já define role de botão e área mínima de toque.

### `RastroCard`

Variantes: `default`, `dark` e `outlined`. Cards agrupam informação relacionada;
não use card para cada linha de texto sem necessidade.

### `RastroBadge`

Variantes de estado: `neutral`, `success`, `warning`, `danger`, `water` e
`clay`. O label deve ser suficiente para entender o estado sem depender da cor.

### `RastroSection`

Agrupa título, descrição, conteúdo e uma ação opcional. Use em listas de
pontos, atividades, contribuições e planejamento.

### `TrailCard`

Componente de produto que apresenta nome, condição, dificuldade, duração e
região. É o resumo operacional mínimo para decidir se vale abrir uma trilha.

## Regras de conteúdo

- Use frases curtas e verbos de ação.
- Mostre condição e dificuldade antes do CTA de iniciar.
- Diga quando algo foi salvo localmente e ainda aguarda sincronização.
- Evite “sucesso” genérico; informe qual ação foi concluída.
- Erros devem sugerir o próximo passo.

## Checklist visual de Pull Request

- [ ] A tela usa `RastroScreen` ou explica por que não usa.
- [ ] Não há cor hexadecimal nova fora de `src/design/tokens.ts`.
- [ ] Botões têm role, label e área de toque adequada.
- [ ] Loading, vazio, erro e offline têm apresentação explícita.
- [ ] Texto de estado não depende apenas de cor.
- [ ] A tela continua legível em um development build pequeno.

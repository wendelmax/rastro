# Rastro Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar o design system Rastro Terra no app Expo/React Native, refatorar as telas principais para usá-lo e deixar documentação arquitetural e de onboarding versionada.

**Architecture:** Os tokens ficarão em `src/design/tokens.ts` e serão consumidos por primitivas pequenas em `src/design/components/`. As features continuarão responsáveis por dados, estado e navegação; componentes visuais não importarão repositórios, Cognito, SQLite ou AWS. A documentação usará Markdown e Mermaid no diretório `docs/`.

**Tech Stack:** Expo 53, React Native, TypeScript strict, React Native Testing Library/Jest, StyleSheet, Mermaid em Markdown, AWS/CDK já existente.

**Spec:** `docs/superpowers/specs/2026-10-03-rastro-design-system-design.md`

## Global Constraints

- Nenhuma regra de domínio ou integração AWS será movida para `src/design`.
- Todas as telas principais devem consumir tokens, sem novos hexadecimais locais.
- Área mínima de toque: 44 × 44 pt.
- Status combina texto e cor; cor sozinha não comunica estado.
- O design system não adiciona uma biblioteca visual externa ou fonte proprietária.
- O rastreamento continua offline-first e a navegação Waze/Google/Apple permanece intacta.
- Testes existentes, TypeScript e lint devem continuar passando.

## Review Focus

- Variante de botão inválida ou estado `loading`: deve cair em uma apresentação segura e não permitir ação duplicada; cobrir em `RastroButton.test.tsx`.
- Texto longo, título vazio e conteúdo em português: deve manter quebra e hierarquia sem overflow; cobrir em `RastroText.test.tsx` e no snapshot de `TrailCard`.
- Contraste dos estados `success`, `warning` e `danger`: deve incluir rótulo textual e estilo legível; cobrir em `RastroBadge.test.tsx`.
- Lista vazia e carregamento: devem usar o shell visual sem perder contexto; cobrir na refatoração de `ExploreScreen.test.tsx`.
- Uso de tela escura no rastreamento: deve preservar contraste e ações grandes; cobrir em `TrackingScreen.test.tsx`.

---

### Task 1: Tokens e tema Rastro Terra

**Files:**
- Create: `src/design/tokens.ts`
- Create: `src/design/theme.ts`
- Create: `src/design/tokens.test.ts`
- Modify: `README.md`

**Interfaces:**
- Produces `rastroColors`, `rastroSpacing`, `rastroRadii`, `rastroTypography`, `rastroElevation` e `rastroTheme` como exports constantes readonly.
- `rastroTheme` expõe `colors`, `spacing`, `radii`, `typography` e `elevation` sem depender de React Native ou de uma feature.

- [ ] **Step 1: Write the failing test** — verificar que os tokens públicos existem com os valores da especificação (`background #F6F2E9`, `forest #175C45`, `clay #C96A2B`, espaçamentos `4/8/12/16/24/32`, raios `8/12/18/999`) e que a escala tipográfica contém `caption`, `body`, `bodyLarge`, `title` e `display`.
- [ ] **Step 2: Run test to verify it fails** — `npm test -- src/design/tokens.test.ts --runInBand`; esperado: falha porque `src/design` ainda não existe.
- [ ] **Step 3: Implement tokens and theme** — criar constantes tipadas, sem lógica de negócio e sem valores alternativos fora da paleta definida.
- [ ] **Step 4: Run test to verify it passes** — `npm test -- src/design/tokens.test.ts --runInBand`; esperado: PASS.
- [ ] **Step 5: Document usage** — adicionar ao README um link para `docs/design-system.md`, que será criado na Task 5.
- [ ] **Step 6: Commit** — `git commit -m "feat: add Rastro Terra design tokens"`.

### Task 2: Primitivas visuais reutilizáveis

**Files:**
- Create: `src/design/components/RastroScreen.tsx`
- Create: `src/design/components/RastroText.tsx`
- Create: `src/design/components/RastroButton.tsx`
- Create: `src/design/components/RastroCard.tsx`
- Create: `src/design/components/RastroBadge.tsx`
- Create: `src/design/components/RastroSection.tsx`
- Create: `src/design/components/index.ts`
- Create: `src/design/components/components.test.tsx`

**Interfaces:**
- `RastroScreen({ children, dark?, scroll?, contentContainerStyle? })` cria `SafeAreaView` ou `ScrollView` com fundo e padding do tema.
- `RastroText({ variant, children, color?, style?, numberOfLines? })` aceita `caption | body | bodyLarge | title | display`.
- `RastroButton({ label, variant?, loading?, disabled?, onPress, accessibilityLabel? })` aceita `primary | secondary | quiet | danger`.
- `RastroCard({ children, variant?, style? })` aceita `default | dark | outlined`.
- `RastroBadge({ label, tone? })` aceita `neutral | success | warning | danger | water | clay`.
- `RastroSection({ title, description?, actionLabel?, onAction?, children })` renderiza hierarquia e ação opcional.

- [ ] **Step 1: Write the failing tests** — renderizar cada primitiva, verificar texto/roles acessíveis, variantes, área mínima do botão e que `loading` desabilita o botão.
- [ ] **Step 2: Run tests to verify they fail** — `npm test -- src/design/components/components.test.tsx --runInBand`; esperado: falha por módulos ausentes.
- [ ] **Step 3: Implement primitives** — usar `StyleSheet.create`, tokens importados de `../tokens`/`../theme`, `Pressable` para ações e `ActivityIndicator` somente no estado `loading`.
- [ ] **Step 4: Run tests to verify they pass** — `npm test -- src/design/components/components.test.tsx --runInBand`; esperado: PASS.
- [ ] **Step 5: Run static checks** — `npx tsc --noEmit` e `npm run lint`; esperado: ambos PASS.
- [ ] **Step 6: Commit** — `git commit -m "feat: add reusable Rastro UI primitives"`.

### Task 3: Cards e telas de descoberta

**Files:**
- Create: `src/design/components/TrailCard.tsx`
- Modify: `src/features/discovery/TrailCard.tsx`
- Modify: `src/features/discovery/TrailFilters.tsx`
- Modify: `src/features/discovery/ExploreScreen.tsx`
- Modify: `src/features/discovery/TrailDetailScreen.tsx`
- Modify: `src/features/maps/TrailMap.tsx` somente quando necessário para encaixe visual
- Modify: `src/features/discovery/ExploreScreen.test.tsx`
- Modify: `src/features/discovery/TrailDetailScreen.test.tsx`

**Interfaces:**
- `TrailCard` recebe `trail: TrailVersion` e `onPress?: () => void`, mantendo o contrato de seleção existente.
- `ExploreScreen` continua recebendo `trailRepository` e `onSelectTrail`; não acessará tokens diretamente além do shell/primitivas.
- `TrailDetailScreen` preserva `trailRepository`, `pointRepository`, `trailId` e `onReport`.

- [ ] **Step 1: Write failing tests** — atualizar expectativas para o texto e papéis acessíveis do card, filtro, estado vazio e CTA do detalhe; adicionar caso para status `closed`/`partially_blocked` com badge textual.
- [ ] **Step 2: Run focused tests** — `npm test -- src/features/discovery/ExploreScreen.test.tsx src/features/discovery/TrailDetailScreen.test.tsx --runInBand`; esperado: falha em estilos/estrutura nova antes da implementação.
- [ ] **Step 3: Implement `TrailCard` e refatorar discovery** — usar `RastroScreen`, `RastroText`, `RastroCard`, `RastroBadge` e `RastroSection`; manter a busca de dados e links de mapas intactos.
- [ ] **Step 4: Run focused tests** — mesmo comando; esperado: PASS.
- [ ] **Step 5: Run typecheck and lint** — `npx tsc --noEmit` e `npm run lint`; esperado: PASS.
- [ ] **Step 6: Commit** — `git commit -m "feat: apply Rastro design to trail discovery"`.

### Task 4: Rastreamento, contribuição, perfil e shell de navegação

**Files:**
- Modify: `src/features/tracking/TrackingScreen.tsx`
- Modify: `src/features/contributions/ContributeScreen.tsx`
- Modify: `src/features/profile/ProfileScreen.tsx`
- Modify: `src/features/auth/AuthScreen.tsx`
- Modify: `app/(tabs)/_layout.tsx`
- Modify: `app/(tabs)/explore.tsx` apenas se o shell exigir props novas
- Modify: `src/features/tracking/TrackingScreen.test.tsx`
- Modify: `src/features/profile/ProfileScreen.test.tsx`
- Modify: `src/features/planning/TripPlanForm.tsx`, `src/features/planning/TripSummary.tsx` e testes quando compartilharem os mesmos padrões

**Interfaces:**
- Fluxos e props de negócio permanecem inalterados; a mudança é visual e de acessibilidade.
- `TrackingScreen` mantém `session`, `onStart` e `onFinished` e preserva a tela escura de alto contraste.
- `ContributeScreen` mantém `activityId`, `service` e `authorId`, mas usa campos e botões do design system.

- [ ] **Step 1: Write failing tests** — cobrir rastreamento escuro com ações acessíveis, contribuição com campos rotulados e perfil com estado vazio/card reutilizável.
- [ ] **Step 2: Run focused tests** — `npm test -- src/features/tracking/TrackingScreen.test.tsx src/features/profile/ProfileScreen.test.tsx --runInBand`; esperado: falha nas novas expectativas.
- [ ] **Step 3: Implement refactor** — aplicar primitivas sem alterar chamadas de domínio, persistência, GPS ou publicação; usar `RastroCard`/`RastroBadge` nos estados de atividade e sincronização.
- [ ] **Step 4: Run focused tests** — mesmo comando; esperado: PASS.
- [ ] **Step 5: Run full verification** — `npm test -- --runInBand`, `npx tsc --noEmit`, `npm run lint`; esperado: PASS.
- [ ] **Step 6: Commit** — `git commit -m "feat: apply Rastro design across core flows"`.

### Task 5: Documentação, diagramas e contexto visual

**Files:**
- Create: `docs/design-system.md`
- Create: `docs/architecture.md`
- Create: `docs/onboarding.md`
- Create: `docs/flows/explore-trail.md`
- Create: `docs/flows/record-and-contribute.md`
- Create: `docs/decisions/ADR-001-mobile-first-offline.md`
- Create: `docs/decisions/ADR-002-aws-native-backend.md`
- Create: `docs/decisions/ADR-003-design-as-code.md`
- Create: `docs/diagrams/system-context.mermaid`
- Create: `docs/diagrams/runtime-architecture.mermaid`
- Create: `docs/diagrams/contribution-flow.mermaid`
- Create: `.superdesign/init/components.md`
- Create: `.superdesign/init/layouts.md`
- Create: `.superdesign/init/routes.md`
- Create: `.superdesign/init/theme.md`
- Create: `.superdesign/init/pages.md`
- Create: `.superdesign/init/extractable-components.md`
- Modify: `README.md`

**Interfaces:**
- Documentação aponta para arquivos reais e comandos executáveis.
- Diagramas usam Mermaid válido e não incluem segredos, IDs temporários ou claims não implementados.
- `.superdesign/init` descreve código real do repositório para futuras explorações visuais.

- [ ] **Step 1: Write documentation checks** — criar um teste ou script simples que confirme a existência dos documentos, dos três diagramas e dos seis arquivos de contexto Superdesign; validar links locais principais.
- [ ] **Step 2: Run checks to verify they fail** — executar o check; esperado: falha porque os arquivos ainda não existem.
- [ ] **Step 3: Write documentation** — explicar tokens, componentes, decisões, arquitetura AWS/mobile, fluxos offline e como executar/testar; incluir diagramas de contexto, runtime e contribuição.
- [ ] **Step 4: Generate Superdesign init context** — analisar package/config/routes/componentes reais e preencher os seis arquivos `.superdesign/init`, incluindo código fonte dos componentes compartilhados.
- [ ] **Step 5: Update README** — adicionar índice de documentação, link da especificação, comando de testes, orientação para novos devs e referência aos diagramas.
- [ ] **Step 6: Run documentation and repository checks** — confirmar links/arquivos, `git diff --check`, `npx tsc --noEmit`, `npm run lint` e `npm test -- --runInBand`; esperado: PASS.
- [ ] **Step 7: Commit** — `git commit -m "docs: document Rastro design and architecture"`.

### Task 6: Revisão final e handoff

- [ ] **Step 1: Review the complete diff** — confirmar que nenhuma feature importa infraestrutura dentro de `src/design` e que não há novos hexadecimais fora dos tokens.
- [ ] **Step 2: Run final verification** — `npm test -- --runInBand`, `npx tsc --noEmit`, `npm run lint`, `npx expo config --type public` e `git diff --check`; esperado: todos PASS.
- [ ] **Step 3: Review documentation coverage** — conferir que um novo dev consegue instalar, configurar, rodar testes, entender o fluxo mobile/AWS e localizar cada decisão.
- [ ] **Step 4: Commit any final correction** — somente se necessário, com mensagem específica e testes correspondentes.
- [ ] **Step 5: Handoff** — informar arquivos, comandos, commits e eventuais limitações visuais restantes.

## Self-review

- Cobertura da especificação: tokens/tema na Task 1; primitivas e acessibilidade na Task 2; descoberta na Task 3; telas restantes na Task 4; documentação e Mermaid na Task 5; verificação na Task 6.
- Interfaces consistentes: os componentes recebem props visuais e callbacks simples; features mantêm seus contratos atuais.
- O plano não cria API, banco ou dependência visual externa.
- O risco de regressão é coberto por testes focados por tela e suíte completa ao final das Tasks 4–6.

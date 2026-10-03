# Rastro MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir uma fatia vertical mobile funcional do Rastro para descobrir uma trilha, consultar pontos de interesse, planejar uma saída, registrar uma atividade offline e publicar uma atualização versionada.

**Architecture:** O app será local-first: regras de domínio puras e repositórios tipados ficam independentes da UI e da rede; SQLite mantém gravações e pacotes essenciais offline; Supabase será um adaptador remoto com Auth, Postgres/PostGIS, Storage e RLS. A UI Expo/React Native consome casos de uso, nunca acessa o cliente Supabase diretamente.

**Tech Stack:** React Native, Expo, TypeScript strict, Expo Router, `react-native-maps`, `expo-location`, `expo-task-manager`, `expo-sqlite`, Supabase JS/Auth/Postgres/Storage, Jest com `jest-expo`, React Native Testing Library e ESLint/Prettier.

**Spec:** `docs/superpowers/specs/2026-10-03-offroad-trails-platform-design.md`

## Global Constraints

- O nome de produto usado na interface será `Rastro`.
- O código de produção usará TypeScript com `strict: true`.
- Regras de domínio não podem depender de React Native, Expo, Supabase ou APIs de mapa.
- Localização precisa e atividades serão privadas por padrão.
- O pacote offline do MVP conterá geometria, pontos, metadados e relatos essenciais; mapas cartográficos offline não serão prometidos.
- Integrações com Waze, Google Maps e Apple Maps serão links externos auxiliares, não fontes do domínio.
- Toda nova função de domínio deverá ter um teste que falhe antes da implementação.
- Toda mudança significativa será entregue em commit pequeno e temático.

## Review Focus

- Roteiro sem geometria ou com geometria inválida deve ser rejeitado pelo domínio; cobrir em `src/domain/trails.test.ts`.
- Planejamento com paradas fora da rota deve preservar a ordem e sinalizar distância inválida; cobrir em `src/domain/planning.test.ts`.
- Gravação interrompida por perda de conexão deve preservar pontos já capturados; cobrir em `src/domain/tracking.test.ts`.
- Conteúdo privado não deve aparecer na consulta pública; cobrir em `src/data/repositories.test.ts` e na migration de RLS.
- Coordenadas podem atravessar a linha internacional ou conter precisão excessiva; normalização e privacidade devem ser cobertas em `src/domain/geo.test.ts`.

---

### Task 1: Scaffolding do aplicativo e qualidade mínima

**Files:**
- Create: `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`, `jest.config.js`
- Create: `app/_layout.tsx`, `app/index.tsx`
- Create: `src/lib/config.ts`, `src/lib/test-utils.ts`
- Create: `src/lib/config.test.ts`
- Create: `.env.example`, `.gitignore`, `README.md`

**Interfaces:**
- Produces: comando `npm test`, comando `npm run lint`, configuração TypeScript strict e shell Expo Router renderizável.

- [ ] **Step 1: Escrever o teste de configuração que falha**

Criar `src/lib/config.test.ts` verificando que `getAppConfig()` retorna `{ appName: 'Rastro', environment: 'test' }` no ambiente de teste e rejeita configuração sem URL válida quando o ambiente exigir backend.

- [ ] **Step 2: Rodar o teste para confirmar a falha**

Run: `npm test -- src/lib/config.test.ts --runInBand`  
Expected: FAIL porque o projeto e `getAppConfig` ainda não existem.

- [ ] **Step 3: Criar o shell Expo mínimo e a configuração**

Inicializar o template Expo TypeScript, habilitar `strict`, configurar Jest/`jest-expo`, ESLint e Prettier, e implementar `getAppConfig()` em `src/lib/config.ts` sem iniciar conexão remota durante testes.

- [ ] **Step 4: Rodar o teste e as verificações**

Run: `npm test -- src/lib/config.test.ts --runInBand`  
Run: `npm run lint`  
Expected: PASS e lint sem erros.

- [ ] **Step 5: Commitar**

```bash
git add package.json app.json tsconfig.json babel.config.js jest.config.js app src .env.example .gitignore README.md
git commit -m "chore: scaffold rastro mobile app"
```

### Task 2: Domínio de roteiros, pontos e dificuldade

**Files:**
- Create: `src/domain/geo.ts`, `src/domain/geo.test.ts`
- Create: `src/domain/trails.ts`, `src/domain/trails.test.ts`
- Create: `src/domain/ratings.ts`, `src/domain/ratings.test.ts`

**Interfaces:**
- Produces: `TrailVersion`, `PointOfInterest`, `VehicleType`, `TrailDifficulty`, `TrailStatus`, `validateTrail()`, `calculateTrailSummary()` e `createFork()`.
- `calculateTrailSummary(points: GeoPoint[]): { distanceKm: number; boundingBox: BoundingBox }`.
- `createFork(source: TrailVersion, patch: TrailPatch, authorId: string): TrailVersion`.

- [ ] **Step 1: Escrever testes de geometria, validação e fork**

Cobrir distância entre pontos, rejeição de geometria vazia, status válido, rating por veículo, criação de fork com `parentVersionId`, autor novo e preservação do original.

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/domain/geo.test.ts src/domain/trails.test.ts src/domain/ratings.test.ts --runInBand`  
Expected: FAIL porque os tipos e funções ainda não existem.

- [ ] **Step 3: Implementar o domínio mínimo**

Criar tipos imutáveis, validação de latitude/longitude, cálculo Haversine em quilômetros e fork por cópia explícita, sem dependências de UI ou backend.

- [ ] **Step 4: Rodar os testes de domínio e lint**

Run: `npm test -- src/domain --runInBand`  
Run: `npm run lint`  
Expected: PASS.

- [ ] **Step 5: Commitar**

```bash
git add src/domain
git commit -m "feat: add trail domain and versioning rules"
```

### Task 3: Armazenamento local e dados de demonstração

**Files:**
- Create: `src/data/repositories.ts`, `src/data/repositories.test.ts`
- Create: `src/data/local/schema.ts`, `src/data/local/sqlite-repository.ts`
- Create: `src/data/demo/demo-trails.ts`
- Create: `src/application/trails/list-public-trails.ts`, `src/application/trails/get-trail.ts`

**Interfaces:**
- `TrailRepository.listPublic(filters: TrailFilters): Promise<TrailVersion[]>`.
- `TrailRepository.getById(id: string): Promise<TrailVersion | null>`.
- `TrailRepository.save(trail: TrailVersion): Promise<void>`.
- `PointRepository.listForTrail(trailId: string): Promise<PointOfInterest[]>`.

- [ ] **Step 1: Escrever testes para consulta pública, isolamento privado e seed**

Verificar filtros por modalidade/dificuldade, exclusão de roteiro privado, leitura por id e presença de pelo menos três roteiros demo com pontos de parada, água e foto.

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/data/repositories.test.ts --runInBand`  
Expected: FAIL por ausência dos repositórios.

- [ ] **Step 3: Implementar interfaces e repositório local**

Definir portas de repositório, criar schema SQLite para roteiros, pontos e pacotes offline, e fornecer um repositório local com seed determinístico para o app rodar sem Supabase configurado.

- [ ] **Step 4: Rodar testes e verificar inicialização offline**

Run: `npm test -- src/data/repositories.test.ts --runInBand`  
Expected: PASS; o seed deve ser idempotente.

- [ ] **Step 5: Commitar**

```bash
git add src/data src/application/trails
git commit -m "feat: add local trail repository and demo catalog"
```

### Task 4: Descoberta, mapa e detalhe do roteiro

**Files:**
- Create: `app/(tabs)/explore.tsx`, `app/trails/[trailId].tsx`
- Create: `src/features/discovery/TrailCard.tsx`, `src/features/discovery/TrailFilters.tsx`
- Create: `src/features/maps/TrailMap.tsx`, `src/features/maps/map-links.ts`
- Create: `src/features/discovery/ExploreScreen.test.tsx`, `src/features/discovery/TrailDetailScreen.test.tsx`

**Interfaces:**
- `TrailMap` recebe `geometry`, `points`, `userLocation?` e `onPointPress`.
- `buildExternalNavigationUrl(provider: 'waze' | 'google' | 'apple', coordinate: GeoPoint): string`.

- [ ] **Step 1: Escrever testes de tela e links externos**

Testar renderização de roteiro demo, filtro por veículo, presença de tempo/dificuldade/pontos e geração de URLs para Waze, Google Maps e Apple Maps.

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/features/discovery --runInBand`  
Expected: FAIL porque as telas e componentes ainda não existem.

- [ ] **Step 3: Implementar exploração e detalhe**

Criar tabs com Explorar como entrada, lista filtrável, cartão de roteiro, detalhe com mapa, resumo, pontos de interesse e ação para abrir um destino em app externo. O adaptador de mapa deve permitir substituir o provedor sem alterar o domínio.

- [ ] **Step 4: Rodar testes e lint**

Run: `npm test -- src/features/discovery --runInBand`  
Run: `npm run lint`  
Expected: PASS.

- [ ] **Step 5: Commitar**

```bash
git add app src/features/discovery src/features/maps
git commit -m "feat: add public trail discovery and map details"
```

### Task 5: Planejamento de uma saída

**Files:**
- Create: `src/domain/planning.ts`, `src/domain/planning.test.ts`
- Create: `src/application/planning/build-trip-plan.ts`, `src/application/planning/build-trip-plan.test.ts`
- Create: `app/trails/[trailId]/plan.tsx`, `src/features/planning/TripPlanForm.tsx`, `src/features/planning/TripSummary.tsx`

**Interfaces:**
- `TripPlanInput { trail: TrailVersion; selectedPointIds: string[]; departureAt: string; stopMinutesByPointId: Record<string, number>; returnBufferMinutes?: number }`.
- `buildTripPlan(input: TripPlanInput): TripPlanSummary`.
- `TripPlanSummary { movingTimeMinutes: number; stopTimeMinutes: number; finishAt: string; returnAt?: string; warnings: string[] }`.

- [ ] **Step 1: Escrever testes para duração e paradas inválidas**

Cobrir faixa de tempo sem parada, acréscimo de paradas, ordem dos pontos, saída em ISO válido, retorno opcional e aviso quando ponto não pertence ao roteiro.

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/domain/planning.test.ts src/application/planning/build-trip-plan.test.ts --runInBand`  
Expected: FAIL.

- [ ] **Step 3: Implementar cálculo puro e tela de planejamento**

Usar a faixa de duração do roteiro como base, permitir selecionar pontos e duração de cada parada, calcular `finishAt` e só calcular `returnAt` quando houver margem de retorno informada. Não introduzir planejamento multi-trilha.

- [ ] **Step 4: Rodar testes e fluxo de tela**

Run: `npm test -- src/domain/planning.test.ts src/application/planning/build-trip-plan.test.ts --runInBand`  
Expected: PASS.

- [ ] **Step 5: Commitar**

```bash
git add src/domain/planning.ts src/application/planning app/trails src/features/planning
git commit -m "feat: add single-trail trip planning"
```

### Task 6: Rastreamento local-first e atividade offline

**Files:**
- Create: `src/domain/tracking.ts`, `src/domain/tracking.test.ts`
- Create: `src/data/local/activity-repository.ts`, `src/data/local/activity-repository.test.ts`
- Create: `src/application/tracking/record-activity.ts`, `src/application/tracking/record-activity.test.ts`
- Create: `src/features/tracking/TrackingScreen.tsx`, `app/track.tsx`
- Create: `src/features/tracking/location-adapter.ts`, `src/features/tracking/background-task.ts`

**Interfaces:**
- `TrackingSession.start(trailId?: string): Promise<void>`.
- `TrackingSession.pause(): Promise<void>`.
- `TrackingSession.resume(): Promise<void>`.
- `TrackingSession.appendLocation(sample: LocationSample): Promise<ActivitySnapshot>`.
- `TrackingSession.finish(): Promise<Activity>`.

- [ ] **Step 1: Escrever testes da máquina de estados e persistência**

Cobrir `idle -> recording -> paused -> recording -> finished`, impedir amostra após finalização, preservar amostras quando o armazenamento remoto está indisponível e calcular distância/tempo total.

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/domain/tracking.test.ts src/data/local/activity-repository.test.ts src/application/tracking/record-activity.test.ts --runInBand`  
Expected: FAIL.

- [ ] **Step 3: Implementar domínio, SQLite e adaptador de localização**

Persistir cada amostra localmente antes de qualquer sincronização. Encapsular permissões e eventos do Expo em `location-adapter.ts`; a máquina de estados não conhecerá APIs da plataforma.

- [ ] **Step 4: Rodar testes e validar compilação**

Run: `npm test -- src/domain/tracking.test.ts src/data/local/activity-repository.test.ts src/application/tracking/record-activity.test.ts --runInBand`  
Run: `npx tsc --noEmit`  
Expected: PASS; a tarefa de background ficará marcada como compatível com development build, não como dependência do Expo Go.

- [ ] **Step 5: Commitar**

```bash
git add src/domain/tracking.ts src/data/local src/application/tracking src/features/tracking app/track.tsx
git commit -m "feat: add offline activity tracking"
```

### Task 7: Autenticação, publicação e fork

**Files:**
- Create: `supabase/migrations/001_rastro_schema.sql`, `supabase/seed.sql`
- Create: `src/data/remote/supabase-client.ts`, `src/data/remote/supabase-trail-repository.ts`
- Create: `src/application/auth/auth-service.ts`, `src/application/auth/auth-service.test.ts`
- Create: `src/application/contributions/publish-activity.ts`, `src/application/contributions/publish-activity.test.ts`
- Create: `app/auth.tsx`, `app/contribute/[activityId].tsx`

**Interfaces:**
- `AuthService.signIn(email: string, password: string): Promise<Session>`.
- `AuthService.signUp(email: string, password: string): Promise<Session | EmailVerificationRequired>`.
- `publishActivity(activityId: string, input: PublishActivityInput): Promise<TrailVersion | ActivityReport>`.
- RLS must expose public rows to anonymous reads and restrict writes to the authenticated owner.

- [ ] **Step 1: Escrever testes de autenticação, privacidade e fork**

Cobrir validação de credenciais, atividade privada até publicação, publicação vinculada ao autor, criação de versão-pai e rejeição de alteração por usuário que não é dono.

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/application/auth src/application/contributions --runInBand`  
Expected: FAIL.

- [ ] **Step 3: Implementar schema, RLS, adaptadores e fluxo de publicação**

Criar tabelas para usuários, veículos, versões, pontos, atividades, relatos e planos; usar geometria PostGIS; manter o repositório local como fallback quando as variáveis Supabase estiverem ausentes; criar telas mínimas de login e publicação.

- [ ] **Step 4: Rodar testes e revisar políticas**

Run: `npm test -- src/application/auth src/application/contributions --runInBand`  
Run: `npx tsc --noEmit`  
Expected: PASS; revisar manualmente que nenhum campo de localização privada é retornado na consulta pública.

- [ ] **Step 5: Commitar**

```bash
git add supabase src/data/remote src/application/auth src/application/contributions app/auth.tsx app/contribute
git commit -m "feat: add auth publishing and trail forks"
```

### Task 8: Integração do fluxo vertical e verificação do MVP

**Files:**
- Modify: `app/_layout.tsx`, `app/index.tsx`
- Create: `src/features/profile/ProfileScreen.tsx`, `app/(tabs)/profile.tsx`
- Create: `src/features/quality/ReportContentSheet.tsx`
- Create: `tests/mvp-vertical-flow.test.tsx`
- Modify: `README.md`

**Interfaces:**
- O fluxo completo deverá ser navegável: Explorar → Detalhe → Planejar ou Rastrear → Finalizar → Publicar/Fork.
- A tela de perfil deve listar atividades e contribuições do usuário autenticado.

- [ ] **Step 1: Escrever o teste do fluxo vertical**

Testar, com repositório local, descoberta de roteiro demo, abertura do detalhe, criação de plano com três pontos, gravação de amostras, finalização e publicação de relato.

- [ ] **Step 2: Rodar o teste para confirmar a falha**

Run: `npm test -- tests/mvp-vertical-flow.test.tsx --runInBand`  
Expected: FAIL até as telas e providers estarem conectados.

- [ ] **Step 3: Conectar providers, tabs, perfil e denúncia**

Configurar injeção do repositório local/remoto, estados de sessão e navegação. Adicionar ação de denúncia para conteúdo desatualizado, perigoso ou indevido.

- [ ] **Step 4: Rodar a suíte completa e build de desenvolvimento**

Run: `npm test -- --runInBand`  
Run: `npm run lint`  
Run: `npx tsc --noEmit`  
Run: `npx expo config --type public`  
Run: `npx expo-doctor`  
Expected: todos os testes, lint, TypeScript, configuração Expo e diagnóstico passam sem erros; limitações de GPS em web ficam documentadas.

- [ ] **Step 5: Atualizar documentação e commitar**

Documentar setup local, variáveis Supabase, permissões de localização, development build para background tracking e seed demo.

```bash
git add app src tests README.md
git commit -m "feat: connect rastro MVP vertical flow"
```


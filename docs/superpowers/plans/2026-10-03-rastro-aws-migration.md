# Rastro AWS Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Substituir o backend remoto Supabase por uma base AWS nativa, mantendo o app mobile offline-first e documentando o produto com imagens ilustrativas.

**Architecture:** O app falará com Cognito para identidade e com uma HTTP API no API Gateway para operações remotas. Lambdas TypeScript aplicarão autorização e regras de negócio, Aurora PostgreSQL Serverless v2 com PostGIS será o banco, S3/CloudFront cuidarão de mídia e CDK definirá ambientes e permissões. O SQLite e as portas de domínio existentes continuam independentes da infraestrutura.

**Tech Stack:** Expo/React Native, TypeScript strict, Amazon Cognito, API Gateway HTTP, AWS Lambda, Aurora PostgreSQL Serverless v2/PostGIS, RDS Data API, S3, CloudFront, AWS CDK, `amazon-cognito-identity-js`, `@aws-sdk/client-rds-data`, `@aws-sdk/client-s3`, Jest e ESLint.

**Spec:** `docs/superpowers/specs/2026-10-03-rastro-aws-migration-design.md`

## Global Constraints

- Nenhuma chave secreta AWS pode chegar ao bundle mobile.
- O app permanece local-first; falha de rede não pode apagar atividade ou amostra GPS local.
- Nenhum tipo de domínio importa AWS SDK, React Native, Cognito ou Postgres.
- O backend deriva `authorId` do `sub` do JWT Cognito para operações autenticadas.
- S3 permanece privado e uploads usam URLs pré-assinadas.
- Waze, Google Maps e Apple Maps continuam funcionando sem alteração.
- Membership e permissões completas de grupos ficam fora deste ciclo.
- Ambientes `dev`, `staging` e `prod` devem ter configurações separadas.

## Review Focus

- Token ausente ou expirado: API deve devolver 401 e nunca aceitar `authorId` arbitrário; cobrir no teste do authorizer/handler.
- Atividade repetida: sincronização com o mesmo id deve ser idempotente; cobrir no handler de atividades.
- Falha de rede no mobile: atividade continua disponível no SQLite e a fila permanece pendente; cobrir no gateway/sync service.
- Upload inválido: API deve rejeitar tipo/tamanho fora da política antes de emitir URL; cobrir no handler de mídia.
- Trilhas privadas: listagem pública nunca deve retornar conteúdo privado; cobrir no repositório/handler de trilhas.

---

### Task 1: Contratos e configuração AWS no mobile

**Files:**
- Modify: `src/lib/config.ts`, `src/lib/config.test.ts`
- Create: `src/application/auth/auth-gateway.ts`
- Create: `src/data/remote/aws/aws-config.ts`, `src/data/remote/aws/api-client.ts`
- Modify: `package.json`, `package-lock.json`
- Test: `src/data/remote/aws/api-client.test.ts`

**Interfaces:**
- Produces `AwsConfig { region, apiUrl, userPoolId, userPoolClientId }`.
- Produces `ApiClient.request<T>(path, init?): Promise<T>` with optional bearer token.
- Produces `AuthGateway` methods for sign-in, sign-up, session restore and sign-out.

- [ ] Write failing tests for AWS env parsing, malformed API URL and 401 response handling.
- [ ] Run the focused tests and verify they fail because AWS config/client are absent.
- [ ] Add AWS environment variables and the generic auth gateway boundary without importing AWS SDK into domain code.
- [ ] Add only the mobile dependencies needed for Cognito and API calls.
- [ ] Run focused tests, TypeScript and lint; commit `feat: add AWS mobile contracts`.

### Task 2: Cognito authentication adapter

**Files:**
- Create: `src/data/remote/aws/cognito-auth-service.ts`
- Modify: `src/application/auth/auth-service.ts`, `src/features/auth/AuthScreen.tsx`, `app/auth.tsx`
- Test: `src/data/remote/aws/cognito-auth-service.test.ts`

**Interfaces:**
- `CognitoAuthService implements AuthGateway` and returns the existing `AppSession` shape.
- Session restore uses Cognito current-user/session APIs and returns `null` when no session exists.

- [ ] Write failing tests for sign-in mapping, sign-up verification-required result, session restore and sign-out.
- [ ] Run the focused tests and verify the adapter behavior is missing.
- [ ] Implement the Cognito adapter with the public app client id only; persist tokens using the library's supported mobile storage.
- [ ] Update the auth route to use Cognito when AWS config exists and show a useful setup message otherwise.
- [ ] Run auth tests, full TypeScript and lint; commit `feat: integrate Cognito authentication`.

### Task 3: AWS trail, point and activity gateways

**Files:**
- Create: `src/data/remote/aws/aws-trail-repository.ts`
- Create: `src/data/remote/aws/aws-point-repository.ts`
- Create: `src/data/remote/aws/aws-activity-gateway.ts`
- Create: `src/application/sync/sync-activities.ts`
- Test: `src/data/remote/aws/aws-trail-repository.test.ts`, `src/application/sync/sync-activities.test.ts`

**Interfaces:**
- AWS repositories implement existing `TrailRepository` and `PointRepository`.
- `ActivityGateway.push(activity: Activity): Promise<{ status: 'synced' | 'pending' }>` is idempotent by activity id.
- `syncPendingActivities(repository, gateway)` retries pending local activities without deleting them on failure.

- [ ] Write failing tests for public trail mapping, private trail exclusion, activity payload and retry behavior.
- [ ] Run focused tests and verify they fail.
- [ ] Implement fetch-based gateways through `ApiClient`, mapping snake_case API payloads to domain types.
- [ ] Add sync service over the existing local activity repository with safe retry semantics.
- [ ] Run focused tests and commit `feat: add AWS data gateways`.

### Task 4: AWS API Lambda handlers

**Files:**
- Create: `backend/package.json`, `backend/tsconfig.json`
- Create: `backend/src/shared/auth.ts`, `backend/src/shared/http.ts`, `backend/src/shared/db.ts`
- Create: `backend/src/handlers/trails.ts`, `backend/src/handlers/points.ts`, `backend/src/handlers/activities.ts`, `backend/src/handlers/media.ts`
- Test: `backend/src/handlers/handlers.test.ts`

**Interfaces:**
- Handlers accept API Gateway HTTP API v2 events and return `{ statusCode, headers, body }`.
- `requireUserId(event): string` reads `requestContext.authorizer.jwt.claims.sub` or throws an unauthorized error.
- Trail list/get endpoints permit public data; writes and activity upload require the JWT authorizer.
- Media handler emits a short-lived S3 presigned PUT URL only for allowed image types and sizes.

- [ ] Write handler tests for 401, public/private filtering, author binding, idempotent activity upsert and media validation.
- [ ] Run backend tests and verify the handlers are absent.
- [ ] Implement parameterized SQL through the RDS Data API and shared HTTP/error mapping.
- [ ] Keep `authorId` derived from the JWT and never trust body ownership fields.
- [ ] Run backend tests and TypeScript; commit `feat: add AWS API handlers`.

### Task 5: AWS database migration and CDK infrastructure

**Files:**
- Create: `infra/package.json`, `infra/tsconfig.json`, `infra/cdk.json`
- Create: `infra/lib/rastro-stack.ts`, `infra/bin/rastro.ts`
- Create: `infra/db/001_rastro_schema.sql`, `infra/db/seed.sql`
- Modify: `.gitignore`, `README.md`
- Test: `infra/test/rastro-stack.test.ts`

**Interfaces:**
- `RastroStack` defines Cognito, API Gateway HTTP API, Lambda integrations, Aurora PostgreSQL Serverless v2/PostGIS, private S3, CloudFront, Secrets Manager/SSM and CloudWatch permissions.
- CDK outputs API URL, Cognito public identifiers and bucket/distribution identifiers; no secret values are outputs.
- SQL replaces Supabase auth references with `author_id` UUID/text values validated by the API.

- [ ] Write a CDK assertion test for required resources, private S3, Cognito and API authorizer.
- [ ] Run the test and verify the stack is absent.
- [ ] Implement the CDK stack and AWS schema/seed with environment-aware sizing and removal policies.
- [ ] Run CDK synth and stack assertions; commit `feat: define Rastro AWS infrastructure`.

### Task 6: Switch the mobile composition root to AWS with local fallback

**Files:**
- Modify: `src/application/mvp/mobile-services.ts`, `src/application/mvp/create-mvp-services.ts`
- Create: `src/application/mvp/aws-services.ts`
- Modify: `app/(tabs)/explore.tsx`, `app/trails/[trailId].tsx`, `app/contribute/[activityId].tsx`
- Test: `tests/aws-composition.test.tsx`

**Interfaces:**
- `createMobileServices()` returns AWS gateways when all public AWS env values exist and local/demo services otherwise.
- Local SQLite activity recording remains active in both modes.
- AWS contribution flow sends activity through `ActivityGateway` after local save.

- [ ] Write a failing composition test for AWS-configured and no-config fallback modes.
- [ ] Implement one composition root so routes do not instantiate Supabase or in-memory repositories independently.
- [ ] Preserve the existing map navigation links and contribution UI.
- [ ] Run vertical-flow, AWS composition, full tests, TypeScript and lint; commit `feat: switch app composition to AWS`.

### Task 7: Generated design assets and documentation

**Files:**
- Create: `docs/assets/rastro-trail-hero.png`, `docs/assets/rastro-aws-flow.png`
- Modify: `README.md`, `.gitignore`

**Interfaces:**
- README explains the product design, user pain points, architecture, AWS setup, local development and physical-device GPS validation.
- Images are project-local and referenced with relative Markdown links; they contain no credentials or misleading production claims.

- [ ] Generate a product hero illustration and an AWS/off-road workflow illustration using the built-in image generation skill.
- [ ] Inspect both images and copy final assets into `docs/assets/`.
- [ ] Update README with product vision, design links, architecture diagram text, image captions and AWS bootstrap/deploy commands.
- [ ] Run Markdown/path checks, full tests, TypeScript, lint and `git diff --check`; commit `docs: document Rastro AWS design`.

### Task 8: Final verification and handoff

- [ ] Run `npm test -- --runInBand`, `npm run lint`, `npx tsc --noEmit`, `npx expo config --type public`, `npx cdk synth` from `infra` and backend tests.
- [ ] Confirm no credentials are tracked with `rg` and `git diff --check`.
- [ ] Review the final diff, note any deferred group/migration work, and commit only verified changes.

## Self-review

- Spec coverage: identity, API authorization, PostGIS schema, S3 media,
  offline synchronization, maps, CDK environments, rollout and acceptance
  criteria each have an owning task.
- Type consistency: mobile gateways consume the existing `TrailRepository`,
  `PointRepository` and `Activity` contracts; backend handlers expose HTTP
  responses and do not leak infrastructure types into the domain.
- Review focus: all five high-risk input classes are pinned to Tasks 3–5.
- Scope: group membership, historic data import, admin UI and map-provider
  replacement are explicitly deferred.

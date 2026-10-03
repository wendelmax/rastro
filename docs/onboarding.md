# Onboarding de desenvolvimento

## Pré-requisitos

- Node.js compatível com o projeto.
- npm.
- Expo CLI via dependência do projeto.
- AWS CLI/CDK apenas para trabalhar na infraestrutura.
- Android Studio ou Xcode para development build e GPS em segundo plano.

## Instalação

```bash
npm install
```

Para desenvolvimento local sem AWS, o catálogo demo é suficiente. Para AWS,
copie `.env.example` para `.env` e preencha os valores públicos emitidos pela
stack CDK.

## Comandos de verificação

```bash
npm test -- --runInBand
npm run lint
npx tsc --noEmit
npx expo config --type public
npm --prefix backend run build
npx cdk synth -c environmentName=dev
```

## Executar o app

```bash
npm start
```

Para validar rastreamento em segundo plano, use um development build. Expo Go
não representa todas as permissões e tarefas nativas usadas pelo Rastro.

## Infraestrutura AWS

```bash
npm --prefix backend run build
npx cdk bootstrap
npx cdk deploy -c environmentName=dev
```

Revise custos e políticas antes de criar `staging` ou `prod`. Aurora e os
recursos de mídia possuem custo real. Os outputs da stack fornecem API URL,
User Pool, client e domínio CloudFront.

## Estrutura para uma mudança

1. Leia a issue e os documentos em `docs/` relacionados.
2. Preserve a fronteira: regra de negócio em `src/domain`/`src/application`,
   infraestrutura em `src/data`, apresentação em `src/features` e tokens em
   `src/design`.
3. Escreva o teste que falha antes da implementação.
4. Execute o teste focado e depois a suíte completa.
5. Rode TypeScript e lint.
6. Atualize ADR/fluxo quando a decisão mudar a arquitetura.
7. Abra Pull Request; a `main` exige PR e uma aprovação.

## Convenções

- Nomes e mensagens visíveis ao usuário ficam em português.
- Código e nomes de arquivos seguem inglês, alinhados às interfaces existentes.
- Não adicionar segredo, `.env`, token ou dump de banco ao Git.
- Não importar AWS SDK ou React Native dentro do domínio.
- Não criar cor visual nova fora de `src/design/tokens.ts`.
- Toda ação de usuário deve ter estado de loading, erro ou confirmação quando
  fizer operação remota.

## Diagnóstico rápido

| Sintoma | Onde olhar |
| --- | --- |
| App mostra catálogo demo | `.env` sem todos os valores AWS públicos |
| API retorna 401 | Cognito token, authorizer ou relógio do dispositivo |
| Atividade não aparece na nuvem | SQLite pendente e `ActivityGateway` |
| Mídia não sobe | `POST /v1/media/presign`, tipo/tamanho e CORS S3 |
| GPS para com a tela bloqueada | development build, permissões nativas e task Expo |
| UI fora da identidade | `src/design/tokens.ts` e `docs/design-system.md` |

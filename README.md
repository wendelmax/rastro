# Rastro

Aplicativo mobile para descobrir, planejar, registrar e atualizar trilhas off-road de 4x4 e quadriciclos.

## Rodar localmente

```bash
npm install
npm test -- --runInBand
npm run lint
npx tsc --noEmit
npm start
```

O catálogo demo funciona sem credenciais. Para ativar autenticação e persistência remota, copie `.env.example` para `.env` e configure `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

## Fluxo atual

- Explorar roteiros públicos e filtrar por veículo;
- consultar mapa, duração, dificuldade e pontos de interesse;
- planejar uma saída com paradas;
- iniciar uma atividade local-first;
- publicar um relato ou criar uma nova versão da trilha;
- acessar o perfil e a estrutura de denúncia de conteúdo.

O rastreamento em segundo plano exige um development build nativo; o Expo Go não representa esse comportamento completamente.

## Backend

A migration inicial está em `supabase/migrations/001_rastro_schema.sql`. Ela cria tabelas para perfis, roteiros versionados, pontos, atividades e relatos, com RLS para leitura pública e escrita autenticada.

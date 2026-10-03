# ADR-002: backend nativo AWS

- Status: aceito
- Data: 2026-10-03

## Decisão

O backend remoto usa Cognito, API Gateway HTTP, Lambda TypeScript, Aurora
PostgreSQL Serverless v2 com PostGIS, S3 privado, CloudFront e CDK.

## Motivo

O produto precisa de identidade, geometrias, mídia e escalabilidade sem colocar
segredos no mobile. A composição por gateways mantém o domínio independente da
AWS e permite fallback demo/local.

## Consequências

- O deploy exige conta AWS, bootstrap CDK e operação de migrações SQL.
- Aurora, CloudFront e S3 geram custo real.
- RDS Data API simplifica handlers, mas exige revisão de latência e limites.
- A migração histórica do backend anterior é uma etapa separada.

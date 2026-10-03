# Rastro — AWS Migration Design

## Contexto e objetivo

O Rastro é um app mobile local-first para descobrir, planejar, registrar,
avaliar e compartilhar trilhas off-road. O MVP atual usa Supabase como
adaptador remoto. Esta mudança substitui o backend remoto por serviços AWS,
preservando o domínio, as interfaces de repositório, o armazenamento local
SQLite e a experiência mobile.

O sucesso da migração é o mesmo fluxo vertical funcionando com AWS:
autenticar, listar e abrir trilhas públicas, publicar uma atividade/trilha,
salvar pontos úteis e sincronizar dados capturados offline. Nenhuma chave
secreta AWS será distribuída no aplicativo.

## Decisões arquiteturais

### Identidade

O Amazon Cognito User Pool será a fonte de identidade. O app usa o SDK de
autenticação para registrar e autenticar usuários, mantendo na aplicação
apenas `userId` e token de acesso. A API valida o JWT do Cognito no API
Gateway; o backend deriva o autor do token em vez de confiar em um `authorId`
enviado pelo cliente.

### API e regras de negócio

Uma HTTP API no Amazon API Gateway expõe endpoints versionados para trilhas,
pontos de interesse, atividades, avaliações, denúncias e planos. Funções AWS
Lambda em TypeScript implementam os casos de uso e reutilizam as interfaces
de domínio existentes. A UI não acessa Aurora ou S3 diretamente, exceto por
URLs pré-assinadas emitidas pela API para upload/download de mídia.

### Dados geoespaciais

Amazon Aurora PostgreSQL Serverless v2 será o banco transacional. A extensão
PostGIS armazena a geometria das trilhas em SRID 4326 e permite consultas
geográficas futuras. O schema AWS mantém as entidades do MVP — perfis,
versões de trilha, pontos, atividades e relatos — mas remove dependências de
`auth.users`, RLS do Supabase e tipos específicos do cliente Supabase.

As regras de autorização serão explícitas na API: conteúdo público pode ser
lido anonimamente; conteúdo privado só pode ser lido pelo autor; operações de
criação/alteração exigem usuário autenticado e correspondência entre o autor
do recurso e o `sub` do JWT. Visibilidade de grupo permanece modelada, mas
membership/políticas de grupo ficam fora desta migração.

### Mídia

Amazon S3 armazena fotos e demais anexos. A API retorna URLs pré-assinadas
com validade curta e valida tipo/tamanho antes de criar o objeto. CloudFront
será preparado para distribuição pública de mídia publicada, sem expor o
bucket diretamente.

### Offline e sincronização

SQLite continua sendo a fonte local durante a captura GPS e mantém atividades
pendentes de sincronização. A API recebe operações idempotentes usando o id
gerado no dispositivo. Falhas de rede deixam a atividade local intacta e uma
fila de sincronização tenta novamente; conflitos de trilhas usam versão/`updatedAt`
e nunca sobrescrevem silenciosamente uma edição mais nova.

### Mapas e navegação

`react-native-maps` continua exibindo o mapa nativo. Links para Waze, Google
Maps e Apple Maps permanecem como integrações de navegação. Amazon Location
Service não será obrigatório na primeira migração; poderá ser adicionado
depois para geocodificação, busca e cálculo de rotas sem alterar o contrato
do domínio.

### Infraestrutura e ambientes

AWS CDK em TypeScript define Cognito, API Gateway, Lambdas, Aurora, S3,
CloudFront, Secrets Manager/SSM, CloudWatch e permissões IAM. Ambientes
`dev`, `staging` e `prod` usam recursos e configurações separados. A chave
do banco fica no Secrets Manager; o app recebe apenas região, URL da API e
identificadores públicos do Cognito.

## Contratos principais

O cliente remoto será abstraído por portas próprias do Rastro:

- `AuthGateway`: `signIn`, `signUp`, restauração de sessão e logout.
- `TrailRepository`: listagem pública, consulta, criação e atualização de
  versões.
- `PointRepository`: listagem e criação de pontos vinculados à trilha.
- `ActivityGateway`: envio idempotente de atividades e consulta do status de
  sincronização.
- `MediaGateway`: criação de upload e leitura de URL de mídia.

Implementações AWS ficam em `src/data/remote/aws` no app e em um pacote
backend separado dentro do mesmo repositório. Nenhum tipo de domínio importa
AWS SDK, React Native, Cognito ou Postgres.

## Segurança e operação

- JWT Cognito validado no API Gateway/Lambda.
- IAM com menor privilégio entre Lambdas, S3, Aurora e Secrets Manager.
- Bucket S3 privado, bloqueio de acesso público e URLs pré-assinadas.
- Validação de payload, limites de tamanho, paginação e rate limiting na API.
- Logs estruturados e métricas de autenticação, sincronização, erros e
  duração das Lambdas no CloudWatch.
- Backup e retenção do Aurora definidos por ambiente.
- Dados de localização publicados pelo usuário recebem a mesma política de
  visibilidade da atividade/trilha; o app não publica localização em tempo
  real sem ação explícita.

## Fora de escopo desta migração

- Implementar membership e permissões completas de grupos.
- Trocar os provedores de mapa externos.
- Construir um painel administrativo completo.
- Migrar histórico real de um projeto Supabase existente; a base AWS será
  criada com schema e seed compatíveis, e uma importação posterior poderá ser
  executada como tarefa separada.

## Estratégia de rollout

1. Criar infraestrutura dev e schema AWS sem remover o adaptador Supabase.
2. Implementar gateways AWS atrás das interfaces existentes e cobrir os
   contratos com testes unitários/integrados.
3. Trocar a configuração mobile para AWS em dev, mantendo fallback local.
4. Validar autenticação, leitura pública, publicação, mídia e sincronização
   com um dispositivo físico.
5. Promover para staging/prod após observabilidade e políticas de segurança
   verificadas.

## Critérios de aceite

- O app autentica via Cognito e mantém a sessão com segurança.
- Uma trilha pública pode ser listada e aberta via API AWS.
- Uma atividade capturada offline pode ser sincronizada de forma idempotente.
- Uma trilha/atividade publicada respeita o autor do JWT e a visibilidade.
- Fotos usam S3 com bucket privado e URL pré-assinada.
- Waze, Google Maps e Apple Maps continuam funcionando.
- `npm test`, TypeScript e lint permanecem verdes.
- A infraestrutura pode ser criada em um ambiente novo usando CDK, sem
  credenciais hard-coded.

# Plataforma Aberta de Trilhas Off-road — Especificação de Produto e Arquitetura

**Data:** 2026-10-03  
**Status:** proposta para revisão do usuário

## Objetivo

Construir um aplicativo mobile aberto para praticantes de 4x4 e quadriciclos descobrirem, planejarem, executarem e melhorarem roteiros off-road com informações verificáveis da comunidade.

O produto deve responder a quatro perguntas antes e durante uma aventura:

1. Esta trilha é adequada para meu veículo e minha experiência?
2. Quanto tempo devo reservar e onde posso parar?
3. Como está a condição atual do trajeto?
4. Como registro o que encontrei para ajudar o próximo usuário?

## Problema e proposta de valor

Informações de trilhas estão espalhadas em grupos, vídeos e publicações antigas. A distância, sozinha, não informa se um roteiro é praticável: veículo, clima, erosão, lama, travessias, porteiras e experiência mudam a decisão.

A proposta é combinar:

- catálogo público de roteiros;
- avaliação específica por tipo de veículo;
- pontos de interesse operacionais;
- relatos datados e fotos recentes;
- planejamento com paradas e tempo estimado;
- rastreamento offline;
- evolução controlada por versões e forks.

O diferencial do produto é a confiabilidade contextual da informação, não apenas a existência de um mapa.

## Público inicial

- Motoristas de veículos 4x4;
- praticantes de quadriciclo;
- grupos e clubes que organizam saídas;
- criadores locais de roteiros e guias experientes.

A plataforma será aberta para descoberta pública. Login será obrigatório para rastrear uma atividade, criar ou editar conteúdo, fazer fork, avaliar, comentar, participar de um planejamento ou seguir usuários.

## Escopo do MVP

### 1. Conta e perfil

- Cadastro e login por e-mail;
- perfil público com nome, foto opcional, biografia e veículos/modalidades;
- histórico das contribuições publicadas;
- reputação baseada em contribuições confirmadas e denúncias válidas.

### 2. Roteiros

Um roteiro é uma entidade versionada contendo:

- nome, descrição e região;
- traçado GPS;
- distância, ganho de elevação quando disponível e tempo estimado;
- nível geral de dificuldade;
- compatibilidade com 4x4 e quadriciclo;
- época recomendada e condição de acesso;
- visibilidade pública, privada ou restrita a grupo;
- autor, data de criação, data da última atualização e versão-pai;
- fotos e vídeos;
- status operacional: `desconhecido`, `aberto`, `parcialmente bloqueado`, `fechado`.

O tempo de deslocamento será mostrado como faixa, por exemplo `3h30–5h sem paradas`, e não como falsa precisão. A faixa poderá ser ajustada por dificuldade, distância, relevo e relatos recentes.

### 3. Pontos de interesse

Um ponto pode pertencer a um roteiro ou ser descoberto no mapa. Tipos iniciais:

- parada;
- mirante/foto;
- água;
- combustível;
- alimentação;
- camping;
- banheiro;
- obstáculo;
- travessia;
- porteira/acesso;
- ponto de apoio/resgate.

Cada ponto terá descrição, coordenada aproximada ou exata conforme a política de privacidade, fotos, autor, data da última confirmação e indicação de condições sazonais.

### 4. Atividade rastreada

- iniciar, pausar, continuar e finalizar gravação GPS;
- continuar registrando sem conexão;
- mostrar posição, distância, tempo em movimento e tempo total;
- ao finalizar, sugerir publicação como relato de atividade;
- anexar fotos e observações a trechos ou pontos;
- manter a atividade privada até o usuário escolher publicar.

### 5. Fork e atualização

- duplicar um roteiro público para criar uma nova versão;
- alterar traçado, pontos, descrição e condições;
- preservar o roteiro original;
- exibir a relação entre original e fork;
- permitir marcar um roteiro como substituído ou desatualizado;
- mostrar a data e o autor da versão mais recente.

### 6. Planejamento de uma saída

- escolher um roteiro;
- adicionar, remover e ordenar pontos de parada;
- informar horário de saída e duração das paradas;
- calcular horário estimado de chegada e retorno;
- convidar participantes por link ou grupo;
- compartilhar um resumo do plano;
- baixar roteiro, pontos e dados essenciais para uso offline.

No MVP, o planejamento será de uma saída baseada em um roteiro principal. Expedições com várias trilhas ou vários dias ficam fora do primeiro corte.

### 7. Mapas e navegação externa

- mapa dentro do app para exploração e rastreamento;
- abstração de provedor de mapas para evitar acoplamento do domínio;
- botão para abrir o início, fim ou ponto selecionado no Waze, Google Maps ou Apple Maps quando houver destino compatível;
- o app permanece como fonte oficial do roteiro, da atividade, dos relatos e das versões;
- navegação turn-by-turn própria e integração profunda com mapas externos não fazem parte do MVP.

## Confiança, segurança e moderação

- Toda avaliação deve registrar o tipo de veículo e a data da experiência;
- dificuldade exibida como combinação de classificação do autor e relatos da comunidade;
- selo de confirmação recente para roteiro ou ponto confirmado nos últimos 90 dias;
- denúncia de conteúdo, acesso incorreto, propriedade privada, risco ou informação desatualizada;
- fila administrativa para remover conteúdo perigoso, ilegal ou abusivo;
- atividades e localização precisa privadas por padrão;
- opção de ocultar o ponto exato de entrada, residência ou propriedade sensível;
- aviso de que informações comunitárias não substituem avaliação local, regras de acesso ou condições meteorológicas.

## Modelo de domínio inicial

```text
User 1---N Vehicle
User 1---N TrailVersion
TrailVersion 1---N PointOfInterest
TrailVersion 1---N ActivityReport
User 1---N Activity
Activity N---1 TrailVersion (opcional)
TrailVersion 1---N TrailVersion (forks)
TripPlan N---1 TrailVersion
TripPlan N---N User (participants)
```

O domínio deve separar a geometria publicada (`TrailVersion`) da execução real (`Activity`). Assim, uma atividade pode registrar que o roteiro estava diferente do esperado sem sobrescrever o histórico do roteiro.

## Arquitetura proposta

### Aplicativo

- React Native com Expo e TypeScript;
- Expo Router para navegação;
- camada de domínio independente da UI;
- armazenamento local para sessões, gravações em andamento e pacotes offline;
- localização com suporte a execução em segundo plano conforme permissões da plataforma;
- componentes de mapa encapsulados em um adaptador.

### Backend

- Supabase Auth para identidade;
- PostgreSQL com PostGIS para geometrias e consultas por proximidade;
- Storage para fotos e vídeos;
- Row Level Security para separar conteúdo público, privado e de grupos;
- camada de repositórios no app para permitir testes sem rede e futura troca de backend.

### Integrações

- links externos para Waze, Google Maps e Apple Maps;
- importação/exportação GPX como extensão posterior, não necessária para o primeiro fluxo;
- mapas offline limitados ao pacote do roteiro no MVP; cache cartográfico completo depende do provedor escolhido.

## Fora do MVP

- marketplace de guias, oficinas ou hospedagem;
- monetização por assinatura;
- live tracking contínuo para terceiros;
- SOS ou serviço de emergência próprio;
- ranking competitivo;
- expedições multi-etapas e multi-dias;
- turn-by-turn próprio;
- integração profunda com APIs internas do Waze, Google Maps ou Apple Maps;
- painel empresarial para clubes.

## Critérios de sucesso do primeiro piloto

- Um usuário consegue encontrar um roteiro e decidir se ele serve para seu veículo;
- consegue planejar uma saída com pelo menos três pontos de interesse;
- consegue iniciar e finalizar uma gravação sem conexão;
- consegue publicar um relato com condição, data e evidência;
- outro usuário consegue encontrar a atualização e distinguir a versão mais recente;
- a turma inicial consegue cadastrar pelo menos 20 roteiros reais e 50 pontos de interesse;
- pelo menos 70% dos roteiros publicados têm uma confirmação ou relato recente.

## Decisões assumidas para a implementação

- O primeiro lançamento será focado em uma região de teste, mesmo que o catálogo seja público;
- o MVP começa com uma trilha por planejamento;
- o acesso público à leitura não exige login;
- conteúdo criado por usuários exige autenticação;
- mapas externos são auxiliares, não a fonte do domínio;
- a primeira entrega deve ser uma fatia vertical funcional, com dados de demonstração e interfaces prontas para backend real.


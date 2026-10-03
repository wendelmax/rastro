# Fluxo: descobrir e planejar uma trilha

```mermaid
sequenceDiagram
  actor Pessoa
  participant Explore as ExploreScreen
  participant Repo as TrailRepository
  participant Detail as TrailDetailScreen
  participant Plan as TripPlanScreen
  participant Maps as App de mapas

  Pessoa->>Explore: escolhe veículo
  Explore->>Repo: listPublic({ vehicleType })
  Repo-->>Explore: versões públicas
  Pessoa->>Explore: abre um roteiro
  Explore->>Detail: trailId
  Detail->>Repo: getById + listForTrail
  Repo-->>Detail: trilha, pontos e condição
  Pessoa->>Detail: seleciona paradas
  Detail->>Plan: abre planejamento
  Plan-->>Pessoa: duração, paradas, alertas e retorno
  Pessoa->>Detail: abre destino
  Detail->>Maps: deep link Waze/Google/Apple
```

## Regras do fluxo

- A listagem pública nunca inclui conteúdo privado.
- Dificuldade, duração e condição aparecem antes da navegação externa.
- Pontos como água, foto, combustível e obstáculo são contexto operacional.
- O plano calcula parada e retorno sem alterar a geometria da trilha.
- Links externos são uma escolha do usuário e não substituem o mapa interno.

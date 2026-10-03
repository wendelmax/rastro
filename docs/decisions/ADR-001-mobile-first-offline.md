# ADR-001: mobile-first offline-first

- Status: aceito
- Data: 2026-10-03

## Decisão

O Rastro prioriza mobile e grava atividades/GPS localmente antes de sincronizar
com a nuvem.

## Motivo

Trilhas têm cobertura instável, bateria limitada e uso em movimento. Perder um
registro por falha de rede destrói confiança no produto.

## Consequências

- SQLite faz parte do fluxo principal, não apenas de cache.
- Sincronização precisa ser idempotente e observável.
- O usuário deve ver estados pendente/sincronizado.
- Features não podem depender de uma resposta online para salvar a atividade.

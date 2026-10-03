# ADR-003: design system como código

- Status: aceito
- Data: 2026-10-03

## Decisão

Tokens e primitivas visuais são TypeScript versionado em `src/design`, e a
documentação usa Markdown/Mermaid no mesmo repositório.

## Motivo

O app é mobile e já usa TypeScript/StyleSheet. Um sistema pequeno, local e
testável reduz dependências e permite que toda alteração visual passe pelo
mesmo Pull Request que muda a feature.

## Consequências

- O design system deve permanecer sem regra de negócio.
- A paleta tem uma fonte de verdade única.
- Testes de componente protegem acessibilidade e estados.
- Diagramas e decisões podem ficar sincronizados com o código.
- Um futuro web/admin pode reutilizar princípios, mas não deve importar os
  componentes React Native diretamente.

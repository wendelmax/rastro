# Route map

The project uses Expo Router. Route files are the source of truth; feature
components receive repositories/services through route composition.

| Route | File | Main feature |
| --- | --- | --- |
| `/` | `app/index.tsx` | entry/redirect |
| `/auth` | `app/auth.tsx` | Cognito or fallback auth |
| `/(tabs)/explore` | `app/(tabs)/explore.tsx` | public trail discovery |
| `/(tabs)/profile` | `app/(tabs)/profile.tsx` | activities/contributions |
| `/trails/:trailId` | `app/trails/[trailId].tsx` | trail detail and maps |
| `/trails/:trailId/plan` | `app/trails/[trailId]/plan.tsx` | route planning |
| `/track` | `app/track.tsx` | background GPS tracking |
| `/contribute/:activityId` | `app/contribute/[activityId].tsx` | report or fork |

## Route responsibilities

- `app/` wires navigation and dependencies; it should not contain domain rules.
- `src/features/` renders flows and owns local screen state.
- `src/application/` executes use cases.
- `src/data/` supplies local/demo/AWS adapters.

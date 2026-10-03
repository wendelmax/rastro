# Page dependency trees

## `/(tabs)/explore`

Entry: `app/(tabs)/explore.tsx`

- `src/features/discovery/ExploreScreen.tsx`
  - `src/design/components/RastroScreen.tsx`
  - `src/design/components/RastroSection.tsx`
  - `src/design/components/RastroText.tsx`
  - `src/features/discovery/TrailFilters.tsx`
    - `src/design/components/RastroButton.tsx`
  - `src/features/discovery/TrailCard.tsx`
    - `src/design/components/TrailCard.tsx`
      - `RastroCard`, `RastroBadge`, `RastroText`
  - `src/application/mvp/mobile-services.ts`

## `/trails/:trailId`

Entry: `app/trails/[trailId].tsx`

- `src/features/discovery/TrailDetailScreen.tsx`
  - `src/design/components/RastroScreen.tsx`
  - `src/design/components/RastroSection.tsx`
  - `src/design/components/RastroCard.tsx`
  - `src/design/components/RastroBadge.tsx`
  - `src/design/components/RastroButton.tsx`
  - `src/features/maps/TrailMap.tsx`
  - `src/features/quality/ReportContentSheet.tsx`
  - `src/features/maps/map-links.ts`

## `/track`

Entry: `app/track.tsx`

- `src/features/tracking/TrackingScreen.tsx`
  - `RastroScreen`, `RastroCard`, `RastroBadge`, `RastroButton`, `RastroText`
  - `src/domain/tracking.ts`
  - `src/application/tracking/record-activity.ts`
  - `src/features/tracking/location-adapter.ts`

## `/contribute/:activityId`

Entry: `app/contribute/[activityId].tsx`

- `src/features/contributions/ContributeScreen.tsx`
  - `RastroScreen`, `RastroButton`, `RastroText`
  - `src/application/contributions/publish-activity.ts`
  - `src/data/local/activity-repository.ts`

## `/auth`

Entry: `app/auth.tsx`

- `src/features/auth/AuthScreen.tsx`
  - `RastroScreen`, `RastroButton`, `RastroText`
  - `src/data/remote/aws/cognito-auth-service.ts`
  - `src/data/remote/aws/secure-auth-session-store.ts`

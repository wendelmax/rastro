import type { TripPlanSummary } from '../../domain/planning';
import { RastroBadge, RastroCard, RastroText } from '../../design/components';
import { rastroTheme } from '../../design/theme';

interface TripSummaryProps {
  summary: TripPlanSummary;
}

export function TripSummary({ summary }: TripSummaryProps) {
  return (
    <RastroCard>
      <RastroText color={rastroTheme.colors.forestStrong} variant="title">Plano da saída</RastroText>
      <RastroText color={rastroTheme.colors.forestStrong}>Deslocamento: {summary.movingTimeMinutes} min</RastroText>
      <RastroText color={rastroTheme.colors.forestStrong}>Paradas: {summary.stopTimeMinutes} min</RastroText>
      <RastroText color={rastroTheme.colors.forestStrong}>Término estimado: {formatDate(summary.finishAt)}</RastroText>
      {summary.returnAt ? <RastroText color={rastroTheme.colors.forestStrong}>Retorno estimado: {formatDate(summary.returnAt)}</RastroText> : null}
      {summary.warnings.map((warning) => <RastroBadge key={warning} label={warning} tone="warning" />)}
    </RastroCard>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

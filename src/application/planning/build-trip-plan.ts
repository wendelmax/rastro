import { buildTripPlan as buildDomainTripPlan, type TripPlanInput, type TripPlanSummary } from '../../domain/planning';

export function buildTripPlan(input: TripPlanInput): TripPlanSummary {
  return buildDomainTripPlan(input);
}

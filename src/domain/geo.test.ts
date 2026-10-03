import { calculateTrailSummary, type GeoPoint } from './geo';

describe('calculateTrailSummary', () => {
  it('calculates distance and bounding box for a trail geometry', () => {
    const points: GeoPoint[] = [
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 0.001 },
      { latitude: 0.001, longitude: 0.001 },
    ];

    const summary = calculateTrailSummary(points);

    expect(summary.distanceKm).toBeCloseTo(0.222, 2);
    expect(summary.boundingBox).toEqual({
      minLatitude: 0,
      maxLatitude: 0.001,
      minLongitude: 0,
      maxLongitude: 0.001,
    });
  });

  it('rejects an empty geometry', () => {
    expect(() => calculateTrailSummary([])).toThrow('geometry must contain at least two points');
  });
});

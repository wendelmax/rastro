export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
}

export interface TrailSummary {
  distanceKm: number;
  boundingBox: BoundingBox;
}

export function calculateTrailSummary(points: GeoPoint[]): TrailSummary {
  if (points.length < 2) {
    throw new Error('geometry must contain at least two points');
  }

  for (const point of points) {
    validateGeoPoint(point);
  }

  let distanceKm = 0;
  for (let index = 1; index < points.length; index += 1) {
    distanceKm += haversineDistanceKm(points[index - 1]!, points[index]!);
  }

  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);

  return {
    distanceKm,
    boundingBox: {
      minLatitude: Math.min(...latitudes),
      maxLatitude: Math.max(...latitudes),
      minLongitude: Math.min(...longitudes),
      maxLongitude: Math.max(...longitudes),
    },
  };
}

export function validateGeoPoint(point: GeoPoint): void {
  if (point.latitude < -90 || point.latitude > 90) {
    throw new Error('latitude must be between -90 and 90');
  }
  if (point.longitude < -180 || point.longitude > 180) {
    throw new Error('longitude must be between -180 and 180');
  }
}

function haversineDistanceKm(first: GeoPoint, second: GeoPoint): number {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(second.latitude - first.latitude);
  const longitudeDelta = toRadians(second.longitude - first.longitude);
  const firstLatitude = toRadians(first.latitude);
  const secondLatitude = toRadians(second.latitude);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value: number): number {
  return value * (Math.PI / 180);
}

import type { GeoPoint } from '../../domain/geo';

export type MapProvider = 'waze' | 'google' | 'apple';

export function buildExternalNavigationUrl(provider: MapProvider, coordinate: GeoPoint): string {
  const destination = `${coordinate.latitude},${coordinate.longitude}`;
  const encodedDestination = encodeURIComponent(destination);

  switch (provider) {
    case 'waze':
      return `https://waze.com/ul?ll=${encodedDestination}&navigate=yes`;
    case 'google':
      return `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;
    case 'apple':
      return `https://maps.apple.com/?daddr=${encodedDestination}`;
  }
}

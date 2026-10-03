import { buildExternalNavigationUrl } from './map-links';

describe('buildExternalNavigationUrl', () => {
  const coordinate = { latitude: -23.55, longitude: -46.63 };

  it('builds Waze, Google Maps and Apple Maps destination links', () => {
    expect(buildExternalNavigationUrl('waze', coordinate)).toBe(
      'https://waze.com/ul?ll=-23.55%2C-46.63&navigate=yes',
    );
    expect(buildExternalNavigationUrl('google', coordinate)).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=-23.55%2C-46.63',
    );
    expect(buildExternalNavigationUrl('apple', coordinate)).toBe(
      'https://maps.apple.com/?daddr=-23.55%2C-46.63',
    );
  });
});

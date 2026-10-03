jest.mock('react-native-maps', () => ({
  __esModule: true,
  default: 'MapView',
  Marker: 'Marker',
  Polyline: 'Polyline',
}));

import { render, waitFor } from '@testing-library/react-native';
import { createDemoRepository } from '../../data/demo/demo-trails';
import { TrailDetailScreen } from './TrailDetailScreen';

describe('TrailDetailScreen', () => {
  it('shows duration, difficulty and operational points', async () => {
    const { trailRepository, pointRepository } = createDemoRepository();
    const screen = render(
      <TrailDetailScreen
        trailId="trail-serra-azul"
        trailRepository={trailRepository}
        pointRepository={pointRepository}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText('Serra Azul').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('2h30–4h')).toBeTruthy();
    expect(screen.getByText('Moderada')).toBeTruthy();
    expect(screen.getByText('Fonte de água')).toBeTruthy();
    expect(screen.getByText('Mirante para fotos')).toBeTruthy();
  });
});

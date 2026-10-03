import { fireEvent, render } from '@testing-library/react-native';
import type { TrailVersion } from '../../domain/trails';
import { TrailCard } from './TrailCard';

const trail: TrailVersion = {
  id: 'trail-test',
  authorId: 'user-1',
  name: 'Serra de Teste',
  description: 'Uma trilha com informação suficiente para planejar a saída.',
  region: 'Serra',
  visibility: 'public',
  geometry: [
    { latitude: -23.5, longitude: -46.6 },
    { latitude: -23.51, longitude: -46.61 },
  ],
  estimatedDurationMinutes: { min: 150, max: 240 },
  generalDifficulty: 'difficult',
  vehicleRatings: [],
  status: 'partially_blocked',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

describe('TrailCard design component', () => {
  it('summarizes operational metadata with a textual condition badge', () => {
    const onPress = jest.fn();
    const screen = render(<TrailCard trail={trail} onPress={onPress} />);

    expect(screen.getByRole('button', { name: 'Serra de Teste' })).toBeTruthy();
    expect(screen.getByText('Parcialmente bloqueada')).toBeTruthy();
    expect(screen.getByText('Difícil')).toBeTruthy();
    expect(screen.getByText('2h30–4h')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Serra de Teste' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

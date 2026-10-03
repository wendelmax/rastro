import { render } from '@testing-library/react-native';
import { ProfileScreen } from './ProfileScreen';

describe('ProfileScreen', () => {
  it('shows user identity, vehicle and contribution history', () => {
    const screen = render(
      <ProfileScreen
        profile={{ name: 'Rastro Pilot', vehicles: ['4x4'] }}
        activities={[{ id: 'a1', title: 'Serra Azul', distanceKm: 12.4 }]}
        contributions={[{ id: 'c1', title: 'Desvio da ponte', type: 'Fork' }]}
      />,
    );

    expect(screen.getByText('Rastro Pilot')).toBeTruthy();
    expect(screen.getByText('4x4')).toBeTruthy();
    expect(screen.getByText('Serra Azul')).toBeTruthy();
    expect(screen.getByText('Desvio da ponte')).toBeTruthy();
  });
});

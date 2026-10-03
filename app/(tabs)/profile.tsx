import { ProfileScreen } from '../../src/features/profile/ProfileScreen';

export default function ProfileRoute() {
  return (
    <ProfileScreen
      profile={{ name: 'Visitante Rastro', vehicles: ['4x4', 'Quadriciclo'] }}
      activities={[]}
      contributions={[]}
    />
  );
}

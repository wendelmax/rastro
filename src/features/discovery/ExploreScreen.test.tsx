import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { createDemoRepository } from '../../data/demo/demo-trails';
import { ExploreScreen } from './ExploreScreen';

describe('ExploreScreen', () => {
  it('renders public demo trails and filters by vehicle', async () => {
    const { trailRepository } = createDemoRepository();
    const screen = render(<ExploreScreen trailRepository={trailRepository} />);

    await waitFor(() => {
      expect(screen.getAllByText('Serra Azul').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('Cachoeira do Lobo')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Quadriciclo' }));

    await waitFor(() => {
      expect(screen.getByText('Pedra Bruta')).toBeTruthy();
    });
  });
});

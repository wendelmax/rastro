import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { createDemoRepository } from '../../data/demo/demo-trails';
import type { TrailRepository } from '../../data/repositories';
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

  it('shows loading before the trail repository resolves', () => {
    const repository = {
      listPublic: jest.fn(() => new Promise<never>(() => undefined)),
    } as unknown as TrailRepository;
    const screen = render(<ExploreScreen trailRepository={repository} />);

    expect(screen.getByText('Carregando trilhas...')).toBeTruthy();
  });

  it('shows an error and retries the trail listing', async () => {
    const { trailRepository } = createDemoRepository();
    const listPublic = jest.spyOn(trailRepository, 'listPublic')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce([]);
    const screen = render(<ExploreScreen trailRepository={trailRepository} />);

    expect(await screen.findByText('Não foi possível carregar as trilhas.')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));

    await waitFor(() => expect(listPublic).toHaveBeenCalledTimes(2));
    expect(screen.getByText('Nenhuma trilha encontrada.')).toBeTruthy();
  });
});

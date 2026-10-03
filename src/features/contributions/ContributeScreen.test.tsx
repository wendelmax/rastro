import { fireEvent, render, waitFor } from '@testing-library/react-native';
import type { PublishActivityService } from '../../application/contributions/publish-activity';
import { ContributeScreen } from './ContributeScreen';

describe('ContributeScreen', () => {
  it('offers accessible actions for a report and a trail fork', async () => {
    const service = { publishActivity: jest.fn().mockResolvedValue({ id: 'report-1', status: 'published' }) } as unknown as PublishActivityService;
    const screen = render(<ContributeScreen activityId="activity-1" authorId="user-1" service={service} />);

    fireEvent.press(screen.getByRole('button', { name: 'Publicar relato' }));
    await waitFor(() => expect(screen.getByText('Relato publicado.')).toBeTruthy());
    expect(screen.getByRole('button', { name: 'Publicar como nova versão' })).toBeTruthy();
  });
});

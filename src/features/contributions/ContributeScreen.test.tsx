import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { PublishActivityService } from '../../application/contributions/publish-activity';
import { rastroTheme } from '../../design/theme';
import { ContributeScreen } from './ContributeScreen';

describe('ContributeScreen', () => {
  it('offers accessible actions for a report and a trail fork', async () => {
    const service = { publishActivity: jest.fn().mockResolvedValue({ id: 'report-1', status: 'published' }) } as unknown as PublishActivityService;
    const screen = render(<ContributeScreen activityId="activity-1" authorId="user-1" service={service} />);

    fireEvent.press(screen.getByRole('button', { name: 'Publicar relato' }));
    await waitFor(() => expect(screen.getByText('Relato publicado.')).toBeTruthy());
    expect(screen.getByRole('button', { name: 'Publicar como nova versão' })).toBeTruthy();
  });

  it('blocks duplicate publication while the request is pending', async () => {
    let resolve: (value: unknown) => void = () => undefined;
    const service = {
      publishActivity: jest.fn(() => new Promise((resolvePromise) => {
        resolve = resolvePromise;
      })),
    } as unknown as PublishActivityService;
    const screen = render(<ContributeScreen activityId="activity-1" authorId="user-1" service={service} />);
    const button = screen.getByRole('button', { name: 'Publicar relato' });

    fireEvent.press(button);
    fireEvent.press(button);

    expect(service.publishActivity).toHaveBeenCalledTimes(1);
    expect(button.props.accessibilityState).toEqual(expect.objectContaining({ busy: true, disabled: true }));

    resolve({ id: 'report-1', status: 'published' });
    await waitFor(() => expect(screen.getByText('Relato publicado.')).toBeTruthy());
  });

  it('renders publication errors with the danger tone', async () => {
    const service = {
      publishActivity: jest.fn().mockRejectedValue(new Error('offline')),
    } as unknown as PublishActivityService;
    const screen = render(<ContributeScreen activityId="activity-1" authorId="user-1" service={service} />);

    fireEvent.press(screen.getByRole('button', { name: 'Publicar relato' }));

    const message = await screen.findByText('Não foi possível publicar esta contribuição.');
    expect(StyleSheet.flatten(message.props.style)).toEqual(
      expect.objectContaining({ color: rastroTheme.colors.danger }),
    );
  });
});

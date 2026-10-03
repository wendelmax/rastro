import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { InMemoryActivityRepository } from '../../data/local/activity-repository';
import { recordActivity } from '../../application/tracking/record-activity';
import { TrackingScreen } from './TrackingScreen';

describe('TrackingScreen', () => {
  it('starts and displays an offline tracking session', async () => {
    const session = recordActivity(new InMemoryActivityRepository(), () => 'activity-screen');
    const screen = render(<TrackingScreen session={session} />);

    fireEvent.press(screen.getByText('Iniciar rastreamento'));

    expect(await screen.findByText('Rastreando')).toBeTruthy();
    expect(screen.getByText('0 pontos')).toBeTruthy();
  });

  it('passes the finished activity to the next contribution step', async () => {
    const session = recordActivity(new InMemoryActivityRepository(), () => 'activity-finished');
    const onFinished = jest.fn();
    const screen = render(<TrackingScreen session={session} onFinished={onFinished} />);

    fireEvent.press(screen.getByText('Iniciar rastreamento'));
    fireEvent.press(await screen.findByText('Finalizar e salvar'));

    await waitFor(() => expect(onFinished).toHaveBeenCalledWith(expect.objectContaining({
      id: 'activity-finished',
      status: 'finished',
    })));
  });
});

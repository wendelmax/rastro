import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { InMemoryActivityRepository } from '../../data/local/activity-repository';
import { recordActivity } from '../../application/tracking/record-activity';
import type { TrackingSession } from '../../domain/tracking';
import { TrackingScreen } from './TrackingScreen';

describe('TrackingScreen', () => {
  it('starts and displays an offline tracking session', async () => {
    const session = recordActivity(new InMemoryActivityRepository(), () => 'activity-screen');
    const screen = render(<TrackingScreen session={session} />);

    fireEvent.press(screen.getByRole('button', { name: 'Iniciar rastreamento' }));

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

  it('blocks duplicate tracking actions while the session is pending', async () => {
    let resolveStart: () => void = () => undefined;
    const session = {
      status: 'idle',
      start: jest.fn(() => new Promise<void>((resolve) => {
        resolveStart = resolve;
      })),
      pause: jest.fn(),
      resume: jest.fn(),
      finish: jest.fn(),
    } as unknown as TrackingSession;
    const screen = render(<TrackingScreen session={session} />);
    const button = screen.getByRole('button', { name: 'Iniciar rastreamento' });

    fireEvent.press(button);
    fireEvent.press(button);

    expect(session.start).toHaveBeenCalledTimes(1);
    expect(button.props.accessibilityState).toEqual(expect.objectContaining({ busy: true, disabled: true }));

    resolveStart();
    await waitFor(() => expect(session.start).toHaveBeenCalledTimes(1));
  });
});

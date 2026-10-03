import { fireEvent, render } from '@testing-library/react-native';
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
});

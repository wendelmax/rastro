import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { rastroTheme } from '../../design/theme';
import { AuthScreen } from './AuthScreen';

describe('AuthScreen', () => {
  it('exposes labeled credentials and an accessible sign-in action', () => {
    const authService = { signIn: jest.fn().mockResolvedValue({ userId: 'user-1', accessToken: 'token' }) };
    const screen = render(<AuthScreen authService={authService} />);

    expect(screen.getByLabelText('E-mail')).toBeTruthy();
    expect(screen.getByLabelText('Senha')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
    return waitFor(() => expect(authService.signIn).toHaveBeenCalled());
  });

  it('blocks duplicate sign-in while the request is pending', async () => {
    let resolve: (value: { userId: string; accessToken: string }) => void = () => undefined;
    const authService = {
      signIn: jest.fn(() => new Promise<{ userId: string; accessToken: string }>((resolvePromise) => {
        resolve = resolvePromise;
      })),
    };
    const screen = render(<AuthScreen authService={authService} />);
    const button = screen.getByRole('button', { name: 'Entrar' });

    fireEvent.press(button);
    fireEvent.press(button);

    expect(authService.signIn).toHaveBeenCalledTimes(1);
    expect(button.props.accessibilityState).toEqual(expect.objectContaining({ busy: true, disabled: true }));

    resolve({ userId: 'user-1', accessToken: 'token' });
    await waitFor(() => expect(screen.getByText('Login realizado.')).toBeTruthy());
  });

  it('renders sign-in errors with the danger tone', async () => {
    const authService = { signIn: jest.fn().mockRejectedValue(new Error('offline')) };
    const screen = render(<AuthScreen authService={authService} />);

    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    const message = await screen.findByText('Não foi possível entrar. Confira seus dados.');
    expect(StyleSheet.flatten(message.props.style)).toEqual(
      expect.objectContaining({ color: rastroTheme.colors.danger }),
    );
  });
});

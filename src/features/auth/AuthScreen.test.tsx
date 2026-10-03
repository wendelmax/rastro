import { fireEvent, render, waitFor } from '@testing-library/react-native';
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
});

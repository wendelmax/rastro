import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import {
  RastroBadge,
  RastroButton,
  RastroCard,
  RastroScreen,
  RastroSection,
  RastroText,
} from './index';
import { rastroTheme } from '../theme';

describe('Rastro design primitives', () => {
  it('renders text variants inside a themed screen and card', () => {
    const screen = render(
      <RastroScreen>
        <RastroCard>
          <RastroText variant="display">Encontrar trilha</RastroText>
          <RastroText variant="body">Texto de apoio para planejar.</RastroText>
        </RastroCard>
      </RastroScreen>,
    );

    expect(screen.getByText('Encontrar trilha')).toBeTruthy();
    expect(screen.getByText('Texto de apoio para planejar.')).toBeTruthy();
    expect(StyleSheet.flatten(screen.getByText('Encontrar trilha').props.style)).toEqual(expect.objectContaining({ fontSize: 32 }));
  });

  it('keeps primary buttons touchable and disables them while loading', () => {
    const onPress = jest.fn();
    const screen = render(<RastroButton label="Salvar trilha" onPress={onPress} loading />);
    const button = screen.getByRole('button');
    const style = StyleSheet.flatten(button.props.style);

    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
    expect(button.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true, busy: true }));
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('falls back to the primary button style for an invalid runtime variant', () => {
    const screen = render(
      <RastroButton label="Ação segura" onPress={jest.fn()} variant={'invalid' as never} />,
    );

    expect(StyleSheet.flatten(screen.getByRole('button').props.style)).toEqual(
      expect.objectContaining({ backgroundColor: rastroTheme.colors.forest }),
    );
  });

  it('renders badge states with text labels instead of color-only meaning', () => {
    const screen = render(<RastroBadge label="Parcialmente bloqueada" tone="warning" />);
    expect(screen.getByText('Parcialmente bloqueada')).toBeTruthy();
  });

  it('uses dark readable text on pale semantic badge surfaces', () => {
    const warning = render(<RastroBadge label="Atenção" tone="warning" />);
    const danger = render(<RastroBadge label="Risco" tone="danger" />);

    expect(StyleSheet.flatten(warning.getByText('Atenção').props.style)).toEqual(
      expect.objectContaining({ color: rastroTheme.colors.ink }),
    );
    expect(StyleSheet.flatten(danger.getByText('Risco').props.style)).toEqual(
      expect.objectContaining({ color: rastroTheme.colors.ink }),
    );
  });

  it('renders an optional section action with an accessible label', () => {
    const onAction = jest.fn();
    const screen = render(
      <RastroSection title="Pontos úteis" description="Paradas do roteiro" actionLabel="Ver todos" onAction={onAction}>
        <RastroText>Água no km 12</RastroText>
      </RastroSection>,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Ver todos' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

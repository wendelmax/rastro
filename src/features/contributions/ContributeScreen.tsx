import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import type { PublishActivityService } from '../../application/contributions/publish-activity';
import { RastroButton, RastroScreen, RastroText } from '../../design/components';
import { rastroTheme } from '../../design/theme';

interface ContributeScreenProps {
  activityId: string;
  service: PublishActivityService;
  authorId: string;
}

export function ContributeScreen({ activityId, service, authorId }: ContributeScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string>();

  async function publish(createTrailFork: boolean) {
    try {
      await service.publishActivity(activityId, {
        authorId,
        title,
        description,
        createTrailFork,
        visibility: 'public',
      });
      setMessage(createTrailFork ? 'Nova versão da trilha publicada.' : 'Relato publicado.');
    } catch {
      setMessage('Não foi possível publicar esta contribuição.');
    }
  }

  return (
    <RastroScreen contentContainerStyle={styles.container} scroll>
      <RastroText variant="display">Compartilhe o que encontrou</RastroText>
      <RastroText color={rastroTheme.colors.muted}>Ajude outras pessoas a sair preparadas.</RastroText>
      <TextInput
        accessibilityLabel="Título da atualização"
        onChangeText={setTitle}
        placeholder="Título da atualização"
        placeholderTextColor={rastroTheme.colors.muted}
        style={styles.input}
        value={title}
      />
      <TextInput
        accessibilityLabel="Condição da trilha, água, obstáculos e dicas"
        multiline
        onChangeText={setDescription}
        placeholder="Condição da trilha, água, obstáculos e dicas"
        placeholderTextColor={rastroTheme.colors.muted}
        style={[styles.input, styles.textArea]}
        value={description}
      />
      <RastroButton label="Publicar relato" onPress={() => void publish(false)} variant="secondary" />
      <RastroButton label="Publicar como nova versão" onPress={() => void publish(true)} />
      {message ? <RastroText color={rastroTheme.colors.success} style={styles.message}>{message}</RastroText> : null}
    </RastroScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: rastroTheme.spacing.xxl,
  },
  input: {
    backgroundColor: rastroTheme.colors.surface,
    borderColor: rastroTheme.colors.border,
    borderRadius: rastroTheme.radii.md,
    borderWidth: 1,
    color: rastroTheme.colors.ink,
    minHeight: 48,
    padding: rastroTheme.spacing.md,
  },
  message: {
    textAlign: 'center',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
});

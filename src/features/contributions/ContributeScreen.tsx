import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { PublishActivityService } from '../../application/contributions/publish-activity';

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
    <View style={styles.container}>
      <Text style={styles.title}>Compartilhe o que encontrou</Text>
      <TextInput onChangeText={setTitle} placeholder="Título da atualização" style={styles.input} value={title} />
      <TextInput
        multiline
        onChangeText={setDescription}
        placeholder="Condição da trilha, água, obstáculos e dicas"
        style={[styles.input, styles.textArea]}
        value={description}
      />
      <Pressable onPress={() => void publish(false)} style={styles.secondaryButton}>
        <Text style={styles.secondaryText}>Publicar relato</Text>
      </Pressable>
      <Pressable onPress={() => void publish(true)} style={styles.primaryButton}>
        <Text style={styles.primaryText}>Publicar como nova versão</Text>
      </Pressable>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    gap: 12,
    padding: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1,
    padding: 13,
  },
  message: {
    color: '#0F766E',
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#F97316',
    borderRadius: 14,
    padding: 15,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 14,
    padding: 15,
  },
  secondaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
});

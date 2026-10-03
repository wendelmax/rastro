import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { RastroButton, RastroText } from '../../design/components';
import { rastroTheme } from '../../design/theme';

interface ReportContentSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const reasons = [
  'Informação desatualizada',
  'Acesso proibido ou propriedade privada',
  'Risco ou conteúdo perigoso',
  'Outro problema',
];

export function ReportContentSheet({ visible, onClose, onSubmit }: ReportContentSheetProps) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <RastroText variant="title">Sinalizar conteúdo</RastroText>
          {reasons.map((reason) => (
            <Pressable accessibilityLabel={reason} accessibilityRole="button" key={reason} onPress={() => onSubmit(reason)} style={styles.reason}>
              <RastroText>{reason}</RastroText>
            </Pressable>
          ))}
          <RastroButton label="Cancelar" onPress={onClose} variant="quiet" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: rastroTheme.colors.backdrop,
    flex: 1,
    justifyContent: 'flex-end',
  },
  reason: {
    borderBottomColor: rastroTheme.colors.border,
    borderBottomWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingVertical: rastroTheme.spacing.md,
  },
  sheet: {
    backgroundColor: rastroTheme.colors.surface,
    borderTopLeftRadius: rastroTheme.radii.lg,
    borderTopRightRadius: rastroTheme.radii.lg,
    gap: rastroTheme.spacing.sm,
    padding: rastroTheme.spacing.xl,
  },
});

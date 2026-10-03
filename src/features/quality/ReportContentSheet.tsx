import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

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
          <Text style={styles.title}>Sinalizar conteúdo</Text>
          {reasons.map((reason) => (
            <Pressable key={reason} onPress={() => onSubmit(reason)} style={styles.reason}>
              <Text style={styles.reasonText}>{reason}</Text>
            </Pressable>
          ))}
          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  close: {
    alignItems: 'center',
    padding: 14,
  },
  closeText: {
    color: '#64748B',
    fontWeight: '700',
  },
  reason: {
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  reasonText: {
    color: '#334155',
    fontSize: 15,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  title: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
});

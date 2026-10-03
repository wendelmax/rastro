import { StyleSheet, Text, View } from 'react-native';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rastro</Text>
      <Text style={styles.subtitle}>Trilhas reais, aventuras melhores.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#0F172A',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 42,
    fontWeight: '800',
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 16,
    marginTop: 8,
  },
});

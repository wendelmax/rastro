import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { VehicleType } from '../../domain/ratings';

interface TrailFiltersProps {
  vehicleType?: VehicleType;
  onVehicleTypeChange: (vehicleType?: VehicleType) => void;
}

export function TrailFilters({ vehicleType, onVehicleTypeChange }: TrailFiltersProps) {
  return (
    <View style={styles.container}>
      <FilterButton active={!vehicleType} label="Todos" onPress={() => onVehicleTypeChange(undefined)} />
      <FilterButton
        active={vehicleType === '4x4'}
        label="4x4"
        onPress={() => onVehicleTypeChange('4x4')}
      />
      <FilterButton
        active={vehicleType === 'quadricycle'}
        label="Quadriciclo"
        onPress={() => onVehicleTypeChange('quadricycle')}
      />
    </View>
  );
}

function FilterButton({ active, label, onPress }: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.button, active && styles.activeButton]}>
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activeButton: {
    backgroundColor: '#0F766E',
  },
  activeLabel: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
});

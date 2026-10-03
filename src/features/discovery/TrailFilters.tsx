import { StyleSheet, View } from 'react-native';
import type { VehicleType } from '../../domain/ratings';
import { RastroButton } from '../../design/components';

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
    <RastroButton label={label} onPress={onPress} variant={active ? 'primary' : 'quiet'} />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
});

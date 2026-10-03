import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import type { GeoPoint } from '../../domain/geo';
import type { PointOfInterest } from '../../domain/trails';
import { rastroTheme } from '../../design/theme';

interface TrailMapProps {
  geometry: GeoPoint[];
  points: PointOfInterest[];
  userLocation?: GeoPoint;
  onPointPress?: (point: PointOfInterest) => void;
}

export function TrailMap({ geometry, points, userLocation, onPointPress }: TrailMapProps) {
  const center = geometry[0] ?? { latitude: 0, longitude: 0 };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...center,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
      >
        <Polyline coordinates={geometry} strokeColor={rastroTheme.colors.clay} strokeWidth={4} />
        {points.map((point) => (
          <Marker
            key={point.id}
            coordinate={point.coordinate}
            title={point.name}
            description={point.description}
            onPress={() => onPointPress?.(point)}
          />
        ))}
        {userLocation ? <Marker coordinate={userLocation} title="Você está aqui" /> : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: rastroTheme.radii.lg,
    height: 240,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});

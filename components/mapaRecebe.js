import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function Mapa({ latitude, longitude }) {
  if (!latitude || !longitude) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <MapView
      style={styles.mapa}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      <Marker coordinate={{ latitude, longitude }} title="Local do Check-in" />
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapa: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

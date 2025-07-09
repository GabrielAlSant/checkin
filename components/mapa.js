import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function Mapa({ coordenadas }) {
  const [localizacao, setLocalizacao] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permissão de localização negada');
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = pos.coords;
      setLocalizacao({ latitude, longitude });

      if (coordenadas) {
        coordenadas(latitude, longitude);
      }
    })();
  }, []);

  if (!localizacao) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <MapView
      style={styles.mapa}
      initialRegion={{
        latitude: localizacao.latitude,
        longitude: localizacao.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      <Marker coordinate={localizacao} title="Você está aqui" />
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

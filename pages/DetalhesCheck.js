import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCheckinDetalhado } from '../lib/database';
import Mapa from '../components/mapaRecebe';

export default function DetalhesCheckin() {
  const [detalhes, setDetalhes] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    const carregarDetalhes = async () => {
      const dados = await getCheckinDetalhado(id);
      setDetalhes(dados);
    };

    carregarDetalhes();
  }, [id]);

  if (!detalhes) {
    return <Text style={styles.loading}>Carregando...</Text>;
  }

  const data = new Date(detalhes.data_hora_checkin).toLocaleString();

  return (
    <View style={styles.container}>
      <Button title="⬅ Voltar" onPress={() => navigation.goBack()} />
      <Text style={styles.title}>Detalhes do Registro</Text>
      <Text style={styles.info}>Atividade: {detalhes.apelido || detalhes.nome}</Text>
      <Text style={styles.info}>Data/Hora: {data}</Text>

      <Mapa
        latitude={detalhes.latitude}
        longitude={detalhes.longitude}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 16 },
  info: { fontSize: 16, marginBottom: 8 },
  loading: { padding: 20, textAlign: 'center' },
});

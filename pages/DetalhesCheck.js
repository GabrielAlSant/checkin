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
   
      <Text style={styles.title}>Detalhes do Check</Text>
      <Text style={styles.info}>Apelido da Atividade (Aparece aqui também rs): {detalhes.apelido}</Text>
      <Text style={styles.info}>Regitrado em: {data}</Text>
      <Mapa
        latitude={detalhes.latitude}
        longitude={detalhes.longitude}
      />
      <Text />
        <Button title="Voltar" onPress={() => navigation.goBack()} color="green" />
    </View>
  );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#121212",
    color: "green",
  },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 16, color: "white" },
  info: { fontSize: 16, marginBottom: 8, color: "white" },
  loading: { padding: 20, textAlign: 'center' },
});

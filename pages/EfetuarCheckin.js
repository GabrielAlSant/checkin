import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  getAtividadePorId,
  verificarStatusAtividade,
  registrarCheckInOuOutComLocal
} from '../lib/database';
import OneCheckin from '../components/renderCheckIn';
import RelogioAtual from '../components/relogio';
import Mapa from '../components/mapa';

export default function EfetuarCheckin({ route }) {
  const { id } = route.params;
  const [atividade, setAtividade] = useState(null);
  const [status, setStatus] = useState(null);
  const [coordenadas, setCoordenadas] = useState({ latitude: null, longitude: null });

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        const dados = await getAtividadePorId(id);
        setAtividade(dados);

        const s = await verificarStatusAtividade(id);
        setStatus(s);
      };

      carregar();
    }, [id])
  );

  const realizarAcao = async () => {
    try {
      const { latitude, longitude } = coordenadas;

      const result = await registrarCheckInOuOutComLocal(id, latitude, longitude);
      Alert.alert('Sucesso', `Registrado ${result.toUpperCase()} com sucesso!`);

      if (atividade.tipo === 'unica' && result === 'checkout') {
        navigation.goBack();
      } else {
        const novo = await verificarStatusAtividade(id);
        setStatus(novo);
      }
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  if (!atividade) return <Text style={styles.loading}>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Button title="⬅ Voltar" onPress={() => navigation.goBack()} />
      <OneCheckin atividade={atividade} />

      <RelogioAtual />

      <Text style={{ marginBottom: 5 }}>Sua localização atual:</Text>
      <Mapa coordenadas={(lat, long) => setCoordenadas({ latitude: lat, longitude: long })} />

      <View style={styles.botaoContainer}>
        <Button
          title={status === 'checkin' ? 'Fazer Check-in' : 'Fazer Check-out'}
          onPress={realizarAcao}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  loading: { padding: 20, textAlign: 'center' },
  botaoContainer: { marginTop: 30 }
});

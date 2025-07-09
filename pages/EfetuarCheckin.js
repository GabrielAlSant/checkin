import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAtividadePorId, registrarCheckInOuOut, verificarStatusAtividade } from '../lib/database';
import OneCheckin from '../components/renderCheckIn';

export default function EfetuarCheckin({ route }) {
  const { id } = route.params;
  const [atividade, setAtividade] = useState(null);
  const [status, setStatus] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const carregarAtividade = async () => {
        const dados = await getAtividadePorId(id);
        setAtividade(dados);

        const statusAtual = await verificarStatusAtividade(id);
        setStatus(statusAtual);
      };

      carregarAtividade();
    }, [id])
  );

  const realizarAcao = async () => {
    try {
      const result = await registrarCheckInOuOut(id);
      Alert.alert('Sucesso', `Registrado ${result.toUpperCase()} com sucesso!`);

      // Se for única e já deu checkout, volta
      if (atividade.tipo === 'unica' && result === 'checkout') {
        navigation.goBack();
      } else {
        const novoStatus = await verificarStatusAtividade(id);
        setStatus(novoStatus);
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  if (!atividade) {
    return <Text style={styles.loading}>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="⬅ Voltar" onPress={() => navigation.goBack()} />
      <OneCheckin atividade={atividade} />

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

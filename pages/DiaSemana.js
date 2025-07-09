import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { CheckinsGerencial } from '../components/renderCheckIn';
import { getAtividadesPorDia } from '../lib/database';

export default function DiaSemana({ route }) {
  const [atividades, setAtividades] = useState([]);
  const { dia } = route.params;
  const navigation = useNavigation();

  const carregarAtividades = useCallback(() => {
    getAtividadesPorDia(dia, setAtividades);
  }, [dia]);

  useFocusEffect(carregarAtividades);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-in para {dia}</Text>
      <Button
        title="Cadastrar Atividade"
        onPress={() => navigation.navigate('CriarAtividade', { dia })}
      />

      {atividades.length > 0
        ? <CheckinsGerencial atividades={atividades} onDelete={carregarAtividades} />
        : <Text>Não há nada para este dia</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }
});

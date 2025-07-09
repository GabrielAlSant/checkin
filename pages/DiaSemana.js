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
      
      <Button
        color='green'
        title="Cadastrar Atividade"
        onPress={() => navigation.navigate('CriarAtividade', { dia })}
      />

      <Text style={styles.title}>Atividades para {dia}</Text>
      {atividades.length > 0
        ? <CheckinsGerencial atividades={atividades} onDelete={carregarAtividades} styles={styles}/>
        : <Text>Não há nada para este dia</Text>}
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "white" },
  semAtividades: { fontSize: 16, color: "gray" },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,   
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: "#282828",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    marginLeft:10
  },
});

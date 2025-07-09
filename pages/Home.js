import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Button, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  createTables,
  getAtividadesPorDia,
  verificarStatusAtividade,
  registrarCheckInOuOut
} from '../lib/database';

export default function Home() {
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const hoje = new Date();
  const diaSemana = dias[hoje.getDay()];

  const [atividades, setAtividades] = useState([]);
  const [statusAtividades, setStatusAtividades] = useState({});
  const navigation = useNavigation();

  const carregarAtividades = async () => {
    await createTables();
    await getAtividadesPorDia(diaSemana, async (res) => {
      setAtividades(res);
      const statusObj = {};
      for (const atividade of res) {
        const status = await verificarStatusAtividade(atividade.id);
        statusObj[atividade.id] = status;
      }
      setStatusAtividades(statusObj);
    });
  };

  useFocusEffect(
    useCallback(() => {
      carregarAtividades();
    }, [diaSemana])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoje é {diaSemana}</Text>

      {atividades.length === 0 ? (
        <Text style={styles.semAtividades}>Nenhuma atividade para hoje</Text>
      ) : (
        <FlatList
          data={atividades}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const status = statusAtividades[item.id] || 'checkin';
            return (
              <View style={styles.itemContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemText}>{item.apelido || item.nome}</Text>
                </View>
  <Button
  title={`Fazer ${status}`}
  onPress={() => navigation.navigate('EfetuarCheckin', { id: item.id })}
/>


              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  semAtividades: { fontSize: 16, color: 'gray' },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500'
  },
  statusText: {
    fontSize: 14,
    color: '#555'
  }
});

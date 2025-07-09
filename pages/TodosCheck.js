import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getTodosCheckinsComAtividade } from '../lib/database';
import { useNavigation } from '@react-navigation/native';

export default function TodosCheckins() {
  const [checkins, setCheckins] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const carregarCheckins = async () => {
      const dados = await getTodosCheckinsComAtividade();
      setCheckins(dados);
    };

    carregarCheckins();
  }, []);

  const renderItem = ({ item }) => {
    const dataHora = new Date(item.data_hora_checkin).toLocaleString();
    const tipo = item.id % 2 === 1 ? 'Check-in' : 'Check-out';

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetalhesCheckin', { id: item.id })}
        style={styles.itemContainer}
      >
        <Text style={styles.nome}>{item.apelido || item.nome}</Text>
        <Text style={styles.info}>{tipo} em {dataHora}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todos os Registros</Text>
      {checkins.length === 0 ? (
        <Text style={styles.semDados}>Nenhum registro encontrado.</Text>
      ) : (
        <FlatList
          data={checkins}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  semDados: { textAlign: 'center', color: 'gray', marginTop: 20 },
  itemContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  nome: { fontSize: 16, fontWeight: 'bold' },
  info: { fontSize: 14, color: '#555' },
});

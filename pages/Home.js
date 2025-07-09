import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Button,TouchableOpacity  } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  createTables,
  getAtividadesPorDia,
  verificarStatusAtividade,
  getHistoricoRecentes
} from '../lib/database';

export default function Home() {
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const hoje = new Date();
  const diaSemana = dias[hoje.getDay()];

  const [atividades, setAtividades] = useState([]);
  const [statusAtividades, setStatusAtividades] = useState({});
  const [historico, setHistorico] = useState([]);
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

    const ultimos = await getHistoricoRecentes(10);
    setHistorico(ultimos);
  };

  useFocusEffect(
    useCallback(() => {
      carregarAtividades();
    }, [diaSemana])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoje é {diaSemana}</Text>

      {historico.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.subTitle}>Últimos registros</Text>
          <FlatList
            data={historico}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const data = new Date(item.data_hora_checkin);
              const hora = data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
              <TouchableOpacity onPress={() => navigation.navigate('DetalhesCheckin', { id: item.id })}>
  <View style={styles.historicoItem}>
    <Text style={styles.historicoHora}>{hora}</Text>
    <Text style={styles.historicoNome}>{item.apelido || item.nome}</Text>
    <Text style={styles.historicoTipo}>
      {(item.id % 2 === 1) ? 'Check-in' : 'Check-out'}
    </Text>
  </View>
</TouchableOpacity>

              );
            }}
          />
        </View>
      )}

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
  subTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
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
  historicoItem: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    width: 120
  },
  historicoHora: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  historicoNome: {
    fontSize: 14,
    marginTop: 4
  },
  historicoTipo: {
    fontSize: 13,
    color: '#555',
    marginTop: 2
  }
});

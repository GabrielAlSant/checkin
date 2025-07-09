import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db } from '../lib/database';

export default function EfetuarCheckin({ route }) {
  const { id } = route.params;
  const [atividade, setAtividade] = useState(null);

  useEffect(() => {
    const fetchAtividade = async () => {
      const result = await db.getFirstAsync(
        `SELECT A.*, D.nome as dia_nome
         FROM Atividades A
         JOIN DiasDaSemana D ON A.dia_da_semana_id = D.id
         WHERE A.id = ?`, [id]
      );
      setAtividade(result);
    };

    fetchAtividade();
  }, [id]);

  if (!atividade) {
    return <Text style={styles.loading}>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Atividade</Text>
      <Text><Text style={styles.label}>Nome:</Text> {atividade.nome}</Text>
      <Text><Text style={styles.label}>Apelido:</Text> {atividade.apelido}</Text>
      <Text><Text style={styles.label}>Descrição:</Text> {atividade.descricao}</Text>
      <Text><Text style={styles.label}>Tipo:</Text> {atividade.tipo}</Text>
      <Text><Text style={styles.label}>Dia da Semana:</Text> {atividade.dia_nome}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: 'bold' },
  loading: { padding: 20, textAlign: 'center' }
});

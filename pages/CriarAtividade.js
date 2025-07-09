import React, { useState } from 'react';
import {
  View, Text, Button, StyleSheet,
  TextInput, Alert, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { criarAtividade } from '../lib/database'; 

export default function CriarAtividade({ route }) {
  const { dia } = route.params;
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('unica');

  const handleSalvar = async () => {
    try {
      await criarAtividade({ nome, apelido, descricao, tipo, dia_nome: dia });
      Alert.alert("Sucesso", "Atividade criada com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao salvar.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="⬅ Voltar" onPress={() => navigation.goBack()} />
      <Text style={styles.title}>Criando atividade para {dia}</Text>

      <Text>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome da atividade"
      />

      <Text>Apelido (até 4 letras):</Text>
      <TextInput
        style={styles.input}
        value={apelido}
        onChangeText={setApelido}
        placeholder="Ex: ABCD"
        maxLength={4}
      />

      <Text>Descrição:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Descreva a atividade"
        multiline
      />

      <Text>Tipo:</Text>
      <Picker
        selectedValue={tipo}
        style={styles.input}
        onValueChange={(itemValue) => setTipo(itemValue)}
      >
        <Picker.Item label="Única" value="unica" />
        <Picker.Item label="Semanal" value="semanal" />
      </Picker>

      <Button title="Salvar Atividade" onPress={handleSalvar} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
});

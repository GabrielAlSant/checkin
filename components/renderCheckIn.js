import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import { excluirAtividade } from '../lib/database';


export function Checkins({ atividades }) {
  const navigation = useNavigation();

  return (
    <View>
      <FlatList
        data={atividades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.apelido || item.nome}</Text>
            <Button
              title="Ver detalhes"
              onPress={() =>
                navigation.navigate('DetalhesAtividade', { id: item.id })
              }
            />
          </View>
        )}
      />
    </View>
  );
}

export function CheckinsGerencial({ atividades, onDelete }) {
  const confirmarExclusao = (id, nome) => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja excluir a atividade "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await excluirAtividade(id);
            if (onDelete) onDelete(); // recarrega a lista
          }
        }
      ]
    );
  };

  return (
    <View>
      <FlatList
        data={atividades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.apelido || item.nome}</Text>
            <Button
              title="Excluir"
              color="red"
              onPress={() => confirmarExclusao(item.id, item.nome)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 10
  },
  itemText: {
    flex: 1,
    fontSize: 16
  }
});


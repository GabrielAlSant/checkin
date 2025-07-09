import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import { excluirAtividade } from '../lib/database';


export function Checkins({ atividades, statusAtividades, styles }) {
  const navigation = useNavigation();

  return (
    <View>
     {atividades.length === 0 ? (
            <Text style={styles.semAtividades}>Nenhuma atividade para hoje</Text>
          ) : (
            <FlatList
              data={atividades}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const status = statusAtividades[item.id] || "checkin";
                return (
                  <View style={styles.itemContainer}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemText}>
                        {item.apelido || item.nome}
                      </Text>
                    </View>
                 {status == 'checkin' ? <Button
                      color="green"
                      title={status}
                      style={{ padding: 10 }}
                      onPress={() =>
                        navigation.navigate("EfetuarCheckin", { id: item.id })
                      }
                    />:
                       <Button
                      color="red"
                      title={status}
                      style={{ padding: 10 }}
                      onPress={() =>
                        navigation.navigate("EfetuarCheckin", { id: item.id })
                      }
                    />}
                  </View>
                );
              }}
            />
          )}
    </View>
  );
}

export function CheckinsGerencial({ atividades, onDelete, styles }) {
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
            if (onDelete) onDelete();
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


export default function OneCheckin({atividade}){
  return (
         <View>
           <Text style={styles.title}>Detalhes da Atividade</Text>
          <Text><Text style={styles.label}>Nome:</Text> {atividade.nome}</Text>
          <Text><Text style={styles.label}>Apelido:</Text> {atividade.apelido}</Text>
          <Text><Text style={styles.label}>Descrição:</Text> {atividade.descricao}</Text>
          <Text><Text style={styles.label}>Tipo:</Text> {atividade.tipo}</Text>
          <Text><Text style={styles.label}>Dia da Semana:</Text> {atividade.dia_nome}</Text>
         </View>
  )
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
  },
   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: 'bold' },
  loading: { padding: 20, textAlign: 'center' }
});


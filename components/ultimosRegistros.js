import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import { styles } from "../pages/Home";


export default function UltimosRegistros({historico, navigation}){
    return(
        <View>
            {historico.length > 0 && (
                    <View style={{ marginBottom: 20 }}>
                      <Text style={styles.ultRegistros}>Últimos registros</Text>
                      <FlatList
                        data={historico}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                          const data = new Date(item.data_hora_checkin);
                          const hora = data.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
            
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("DetalhesCheckin", { id: item.id })
                              }
                            >
                              <View style={styles.historicoItem}>
                                <Text style={styles.historicoHora}>{hora}</Text>
                                <Text style={styles.historicoNome}>
                                  {item.apelido || item.nome}
                                </Text>
                                {item.id % 2 === 1 ? (
                                  <Text style={styles.historicoIn}>Check-in</Text>
                                ) : (
                                  <Text style={styles.historicoOut}>Check-out</Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  )}
        </View>
    )
}
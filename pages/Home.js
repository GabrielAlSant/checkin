import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  createTables,
  getAtividadesPorDia,
  verificarStatusAtividade,
  getHistoricoRecentes,
} from "../lib/database";
import UltimosRegistros from "../components/ultimosRegistros";
import { Checkins } from "../components/renderCheckIn";

export default function Home() {
  const dias = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
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
      <UltimosRegistros historico={historico} navigation={navigation}/>

    <Text style={styles.title}>Atividades para {diaSemana}</Text>

     <Checkins atividades={atividades} statusAtividades={statusAtividades} styles={styles}/>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#121212",
    color: "green",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "white" },
  ultRegistros: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
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
  historicoItem: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
    width: 120,
  },
  historicoHora: {
    fontSize: 16,
    fontWeight: "bold",
  },
  historicoNome: {
    fontSize: 14,
    marginTop: 4,
  },
  historicoIn: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
    color:"green"
  },
   historicoOut: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
    color:"red"
  }
});

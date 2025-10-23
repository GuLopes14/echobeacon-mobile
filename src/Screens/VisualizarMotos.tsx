import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState, useContext } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";
import { RootStackParamList } from "../types/navigation";
import { Moto } from "../types";
import { MqttContext } from "../mqtt/Context/MqttContext";

export default function VisualizarMotosScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [motoSelecionada, setMotoSelecionada] = useState<Moto | undefined>(
    undefined
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "motos"),
      (querySnapshot) => {
        const motosData: Moto[] = [];
        querySnapshot.forEach((doc) => {
          motosData.push({
            id: doc.id,
            ...doc.data(),
          } as Moto);
        });
        setMotos(motosData);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao buscar motos:", error);
        Alert.alert(
          "Erro",
          "Não foi possível carregar as motos. Tente novamente mais tarde."
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const abrirModal = (moto: Moto) => {
    setMotoSelecionada(moto);
    setModalVisivel(true);
  };

  const editarMoto = (moto: Moto) => {
    navigation.navigate("EditarMoto", { moto });
  };

  const removerMoto = async (moto: Moto) => {
    Alert.alert(
      "Confirmar Remoção",
      `Tem certeza que deseja remover a moto ${moto.modelo} (${moto.placa})?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              if (moto.echoBeaconId) {
                await updateDoc(doc(db, "echobeacons", moto.echoBeaconId), {
                  disponivel: true,
                  motoId: deleteField(),
                });
              }
              await deleteDoc(doc(db, "motos", moto.id));
              Alert.alert("Sucesso", "Moto removida com sucesso!");
            } catch (error) {
              console.error("Erro ao remover moto:", error);
              Alert.alert(
                "Erro",
                "Não foi possível remover a moto. Tente novamente."
              );
            }
          },
        },
      ]
    );
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setMotoSelecionada(undefined);
  };

  const { publish } = useContext(MqttContext);

  const localizarMoto = (moto?: Moto) => {
    if (!moto) return;
    // preferir o código/numero de identificação do EchoBeacon vinculado à moto
    // quando a moto foi vinculada pelo fluxo `EchoBeacon.tsx` o campo salvo é `echoBeaconCodigo`
    const numeroIdentificacao =
      // @ts-ignore - o tipo Moto nem sempre tem echoBeaconCodigo declarado, então fazemos fallback
      (moto as any).echoBeaconCodigo || (moto as any).echoBeaconId || "";

    if (!numeroIdentificacao) {
      Alert.alert(
        "Erro",
        "Esta moto não possui número de identificação do EchoBeacon vinculado."
      );
      fecharModal();
      return;
    }

    const payload = {
      comando: "ativar",
      numero_identificacao: numeroIdentificacao.toString(),
    };

    try {
      // publicar como string — o firmware/wokwi deve validar numero_identificacao
      publish("fiap/iot/echobeacon/comando", JSON.stringify(payload));
      Alert.alert(
        "Comando enviado",
        `Solicitação de localização enviada (id: ${numeroIdentificacao})`
      );
    } catch (error) {
      console.error("Erro ao publicar comando MQTT:", error);
      Alert.alert("Erro", "Não foi possível enviar o comando de localização.");
    }

    fecharModal();
  };

  const renderMoto = (moto: Moto) => (
    <View key={moto.id} style={styles.cartao}>
      <View style={styles.infoMoto}>
        <Text style={styles.modelo}>{moto.modelo}</Text>
        <Text style={styles.info}>Placa: {moto.placa}</Text>
        <Text style={styles.info}>Chassi: {moto.chassi}</Text>
        <Text style={styles.info}>Problema: {moto.problema}</Text>
      </View>

      <View style={styles.acoesMoto}>
        {moto.status === "recepcao" ? (
          <TouchableOpacity onPress={() => editarMoto(moto)}>
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.acoesContainer}>
            <TouchableOpacity onPress={() => abrirModal(moto)}>
              <Ionicons name="location" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removerMoto(moto)}>
              <Ionicons name="exit-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Lista de Motos</Text>
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => navigation.navigate("CadastroMoto")}
        >
          <Ionicons name="add" size={24} color="#000" />
          <Text style={styles.textoBotaoAdicionar}>Adicionar Moto</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.subtitulo}>Na recepção</Text>
        <FlatList
          data={motos.filter((m) => m.status === "recepcao")}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderMoto(item)}
          ListEmptyComponent={
            <Text style={styles.textoVazio}>Nenhuma moto na recepção.</Text>
          }
          scrollEnabled={false}
        />

        <Text style={styles.subtitulo}>No pátio</Text>
        <FlatList
          data={motos.filter((m) => m.status === "patio")}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderMoto(item)}
          ListEmptyComponent={
            <Text style={styles.textoVazio}>Nenhuma moto no pátio.</Text>
          }
          scrollEnabled={false}
        />
      </ScrollView>

      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.sobreposicaoModal}>
          <View style={styles.caixaModal}>
            <Text style={styles.textoModal}>
              {motoSelecionada
                ? `Deseja localizar a moto ${motoSelecionada.modelo} (${motoSelecionada.placa})?`
                : "Deseja localizar esta moto?"}
            </Text>
            <View style={styles.botoesModal}>
              <TouchableOpacity style={styles.botaoSim} onPress={() => localizarMoto(motoSelecionada)}>
                <Text style={styles.textoBotao}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={fecharModal}
              >
                <Text style={styles.textoBotao}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  botaoAdicionar: {
    backgroundColor: "#00FF00",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  textoBotaoAdicionar: {
    color: "#000",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  subtitulo: {
    backgroundColor: "#3a3735",
    color: "#fff",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    fontWeight: "bold",
  },
  cartao: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoMoto: {
    flex: 1,
  },
  acoesMoto: {
    marginLeft: 15,
  },
  acoesContainer: {
    gap: 8,
  },
  modelo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  info: {
    color: "#aaa",
    fontSize: 13,
  },
  textoVazio: {
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  sobreposicaoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  caixaModal: {
    backgroundColor: "#3a3735",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  textoModal: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
  },
  botoesModal: {
    flexDirection: "row",
    gap: 15,
  },
  botaoSim: {
    backgroundColor: "#00cc00",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  botaoVoltar: {
    backgroundColor: "#cc0000",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
});

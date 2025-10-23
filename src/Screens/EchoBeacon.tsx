import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../firebaseConfig";
import { RootStackParamList } from "../types/navigation";
import { Moto } from "../types";

interface EchoBeacon {
  id: string;
  codigo: string;
  disponivel: boolean;
}

export default function EchoBeaconLink() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [motosDisponiveis, setMotosDisponiveis] = useState<Moto[]>([]);
  const [echoBeaconsDisponiveis, setEchoBeaconsDisponiveis] = useState<
    EchoBeacon[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [motoSelecionada, setMotoSelecionada] = useState<Moto | null>(null);
  const [echoBeaconSelecionado, setEchoBeaconSelecionado] =
    useState<EchoBeacon | null>(null);
  const [modalMotosVisiveis, setmodalMotosVisiveis] = useState(false);
  const [modalEchoBeaconsVisiveis, setModalEchoBeaconsVisiveis] = useState(false);

  useEffect(() => {
    const motosQuery = query(
      collection(db, "motos"),
      where("status", "==", "recepcao")
    );
    const echoBeaconsQuery = query(
      collection(db, "echobeacons"),
      where("disponivel", "==", true)
    );

    const unsubscribeMotos = onSnapshot(motosQuery, (snapshot) => {
      const motosAtualizadas = snapshot.docs.map((motoDoc) => ({
        id: motoDoc.id,
        ...motoDoc.data(),
      })) as Moto[];

      setMotosDisponiveis(motosAtualizadas);
      if (
        motoSelecionada &&
        !motosAtualizadas.some((m) => m.id === motoSelecionada.id)
      ) {
        setMotoSelecionada(null);
      }
      setLoading(false);
    });

    const unsubscribeEchoBeacons = onSnapshot(echoBeaconsQuery, (snapshot) => {
      const echoBeaconsAtualizados = snapshot.docs.map((ebDoc) => ({
        id: ebDoc.id,
        ...ebDoc.data(),
      })) as EchoBeacon[];

      setEchoBeaconsDisponiveis(echoBeaconsAtualizados);
      if (
        echoBeaconSelecionado &&
        !echoBeaconsAtualizados.some((eb) => eb.id === echoBeaconSelecionado.id)
      ) {
        setEchoBeaconSelecionado(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeMotos();
      unsubscribeEchoBeacons();
    };
  }, [motoSelecionada, echoBeaconSelecionado]);

  const vincularEchoBeacon = async () => {
    if (!motoSelecionada) {
      Alert.alert("Atenção", "Selecione uma moto");
      return;
    }

    if (!echoBeaconSelecionado) {
      Alert.alert("Atenção", "Selecione um EchoBeacon");
      return;
    }

    try {
      await updateDoc(doc(db, "motos", motoSelecionada.id), {
        status: "patio",
        echoBeaconId: echoBeaconSelecionado.id,
        echoBeaconCodigo: echoBeaconSelecionado.codigo,
      });

      await updateDoc(doc(db, "echobeacons", echoBeaconSelecionado.id), {
        disponivel: false,
        motoId: motoSelecionada.id,
      });

      Alert.alert(
        "Sucesso",
        `EchoBeacon ${echoBeaconSelecionado.codigo} vinculado à moto ${motoSelecionada.modelo} (${motoSelecionada.placa}) com sucesso!`,
        [
         {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
        ]
      );
    } catch (error) {
      Alert.alert("Erro", "Erro ao vincular EchoBeacon. Tente novamente.");
      console.error("Erro ao vincular:", error);
    }
  };

  const adicionarEchoBeacon = () => {
    navigation.navigate("CadastroEchoBeacon");
  };

  const selecionarMoto = (moto: Moto) => {
    setMotoSelecionada(moto);
    setmodalMotosVisiveis(false);
  };

  const selecionarEchoBeacon = (echoBeacon: EchoBeacon) => {
    setEchoBeaconSelecionado(echoBeacon);
    setModalEchoBeaconsVisiveis(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Vincular EchoBeacon à Moto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.rotulo}>Moto</Text>
        <TouchableOpacity
          style={styles.seletor}
          onPress={() => setmodalMotosVisiveis(true)}
        >
          <Text
            style={[
              styles.textoSeletor,
              !motoSelecionada && styles.placeholder,
            ]}
          >
            {motoSelecionada
              ? `${motoSelecionada.placa} - ${motoSelecionada.modelo}`
              : motosDisponiveis.length > 0
              ? "Selecione uma moto"
              : "Nenhuma moto disponível para vincular"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={motosDisponiveis.length > 0 ? "#fff" : "#666"}
          />
        </TouchableOpacity>

        <Text style={styles.rotulo}>EchoBeacon</Text>
        <TouchableOpacity
          style={styles.seletor}
          onPress={() =>
            echoBeaconsDisponiveis.length > 0 &&
            setModalEchoBeaconsVisiveis(true)
          }
        >
          <Text
            style={[
              styles.textoSeletor,
              !echoBeaconSelecionado && styles.placeholder,
            ]}
          >
            {echoBeaconSelecionado
              ? echoBeaconSelecionado.codigo
              : echoBeaconsDisponiveis.length > 0
              ? "Selecione um EchoBeacon"
              : "Nenhum EchoBeacon disponível para vincular"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={echoBeaconsDisponiveis.length > 0 ? "#fff" : "#666"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoVincular,
            (!motoSelecionada || !echoBeaconSelecionado) &&
              styles.botaoDesabilitado,
          ]}
          onPress={vincularEchoBeacon}
          disabled={!motoSelecionada || !echoBeaconSelecionado}
        >
          <Text style={styles.textoBotaoVincular}>Vincular</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={adicionarEchoBeacon}
        >
          <Text style={styles.textoBotaoAdicionar}>Adicionar EchoBeacon</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para selecionar Moto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalMotosVisiveis}
        onRequestClose={() => setmodalMotosVisiveis(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Selecionar Moto</Text>
              <TouchableOpacity onPress={() => setmodalMotosVisiveis(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {motosDisponiveis.length > 0 ? (
              <FlatList
                data={motosDisponiveis}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.itemLista}
                    onPress={() => selecionarMoto(item)}
                  >
                    <Text style={styles.textoItem}>
                      {item.placa} - {item.modelo}
                    </Text>
                    <Text style={styles.subtextoItem}>
                      Chassi: {item.chassi}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.textoVazio}>Nenhuma moto disponível</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal para selecionar EchoBeacon */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEchoBeaconsVisiveis}
        onRequestClose={() => setModalEchoBeaconsVisiveis(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Selecionar EchoBeacon</Text>
              <TouchableOpacity
                onPress={() => setModalEchoBeaconsVisiveis(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {echoBeaconsDisponiveis.length > 0 ? (
              <FlatList
                data={echoBeaconsDisponiveis}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.itemLista}
                    onPress={() => selecionarEchoBeacon(item)}
                  >
                    <Text style={styles.textoItem}>
                      EchoBeacon {item.codigo}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.textoVazio}>
                Nenhum EchoBeacon disponível
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
  },
  rotulo: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 20,
  },
  seletor: {
    backgroundColor: "#3a3735",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
  },
  textoSeletor: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  placeholder: {
    color: "#aaa",
  },
  campoContainer: {
    backgroundColor: "#3a3735",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  campo: {
    color: "#fff",
    fontSize: 16,
    minHeight: 20,
  },
  botaoVincular: {
    backgroundColor: "#00FF00",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 40,
  },
  botaoDesabilitado: {
    backgroundColor: "#666",
  },
  textoBotaoVincular: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoAdicionar: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#00FF00",
    borderRadius: 25,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 15,
  },
  textoBotaoAdicionar: {
    color: "#00FF00",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Estilos dos Modais
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#121212",
    margin: 20,
    borderRadius: 10,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3735",
  },
  modalTitulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  itemLista: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3735",
  },
  textoItem: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  subtextoItem: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 4,
  },
  textoVazio: {
    color: "#aaa",
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
});

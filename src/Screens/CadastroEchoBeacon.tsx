import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../../firebaseConfig";
import { RootStackParamList } from "../types/navigation";

export default function CadastroEchoBeacon() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [numeroIdentificacao, setNumeroIdentificacao] = useState("");
  const [loading, setLoading] = useState(false);

  const cadastrarEchoBeacon = async () => {
    if (!numeroIdentificacao.trim()) {
      Alert.alert("Atenção", "Digite o número de identificação");
      return;
    }

    setLoading(true);

    try {
      // Verificar se já existe um EchoBeacon com o mesmo código
      const codigoTrimmed = numeroIdentificacao.trim();
      const echoBeaconsQuery = query(
        collection(db, "echobeacons"),
        where("codigo", "==", codigoTrimmed)
      );
      const existingDocs = await getDocs(echoBeaconsQuery);

      if (!existingDocs.empty) {
        Alert.alert(
          "Atenção",
          `Já existe um EchoBeacon cadastrado com o número de identificação "${codigoTrimmed}".`
        );
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "echobeacons"), {
        codigo: codigoTrimmed,
        disponivel: true,
      });

      Alert.alert("Sucesso", "EchoBeacon cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao cadastrar EchoBeacon:", error);
      Alert.alert("Erro", "Erro ao cadastrar EchoBeacon. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Cadastro de EchoBeacon</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.rotulo}>Número de Identificação</Text>
        <TextInput
          style={styles.campo}
          placeholder="4"
          placeholderTextColor="#999"
          value={numeroIdentificacao}
          onChangeText={setNumeroIdentificacao}
          keyboardType="numeric"
          maxLength={10}
        />

        <TouchableOpacity
          style={[styles.botaoCadastrar, loading && styles.botaoDesabilitado]}
          onPress={cadastrarEchoBeacon}
          disabled={loading}
        >
          <Text style={styles.textoBotaoCadastrar}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
  campo: {
    backgroundColor: "#3a3735",
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 6,
    minHeight: 48,
  },
  botaoCadastrar: {
    backgroundColor: "#00FF00",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 40,
  },
  botaoDesabilitado: {
    backgroundColor: "#666",
  },
  textoBotaoCadastrar: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

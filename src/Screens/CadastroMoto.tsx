import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../../firebaseConfig";
import { RootStackParamList } from "../types/navigation";

export default function CadastroMoto() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [placa, setPlaca] = useState("");
  const [chassi, setChassi] = useState("");
  const [modelo, setModelo] = useState("");
  const [problema, setProblema] = useState("");
  const [loading, setLoading] = useState(false);

  const cadastrarMoto = async () => {
    if (!placa.trim() || !chassi.trim() || !modelo.trim() || !problema.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const placaTrimmed = placa.trim();
      const motosQuery = query(
        collection(db, "motos"),
        where("placa", "==", placaTrimmed)
      );
      const existingDocs = await getDocs(motosQuery);

      if (!existingDocs.empty) {
        Alert.alert(
          "Atenção",
          `Já existe uma moto cadastrada com a placa "${placaTrimmed}".`
        );
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "motos"), {
        placa: placaTrimmed,
        chassi: chassi.trim(),
        modelo: modelo.trim(),
        problema: problema.trim(),
        status: "recepcao",
        createdAt: new Date(),
      });

      Alert.alert("Sucesso", "Moto cadastrada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Erro ao cadastrar moto. Tente novamente.");
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
        <Text style={styles.titulo}>Cadastro de Moto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.rotulo}>Placa</Text>
        <TextInput
          style={styles.campo}
          placeholder="FFF1314"
          placeholderTextColor="#999"
          value={placa}
          onChangeText={setPlaca}
          autoCapitalize="characters"
          maxLength={8}
        />

        <Text style={styles.rotulo}>Chassi</Text>
        <TextInput
          style={styles.campo}
          placeholder="Chassi"
          placeholderTextColor="#999"
          value={chassi}
          onChangeText={setChassi}
          autoCapitalize="characters"
        />

        <Text style={styles.rotulo}>Modelo</Text>
        <TextInput
          style={styles.campo}
          placeholder="MOTTU_POP"
          placeholderTextColor="#999"
          value={modelo}
          onChangeText={setModelo}
          autoCapitalize="words"
        />

        <Text style={styles.rotulo}>Problema</Text>
        <TextInput
          style={[styles.campo, styles.campoProblema]}
          placeholder="Descreva o problema"
          placeholderTextColor="#999"
          value={problema}
          onChangeText={setProblema}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.botaoCadastrar, loading && styles.botaoDesabilitado]}
          onPress={cadastrarMoto}
          disabled={loading}
        >
          <Text style={styles.textoBotaoCadastrar}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  campoProblema: {
    minHeight: 100,
    paddingTop: 12,
  },
  botaoCadastrar: {
    backgroundColor: "#00FF00",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
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

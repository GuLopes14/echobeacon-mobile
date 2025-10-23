import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../../firebaseConfig";
import { RootStackParamList } from "../types/navigation";
import Select from "../Components/Select";

type EditarMotoRouteProp = RouteProp<RootStackParamList, "EditarMoto">;

export default function MotoForm() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<EditarMotoRouteProp>();
  const { moto } = route.params;

  const [modelo, setModelo] = useState(moto.modelo);
  const [placa, setPlaca] = useState(moto.placa);
  const [chassi, setChassi] = useState(moto.chassi);
  const [problema, setProblema] = useState(moto.problema);
  const [carregando, setCarregando] = useState(false);

  const validarCampos = () => {
    if (!modelo.trim()) {
      Alert.alert("Erro", "O modelo é obrigatório.");
      return false;
    }
    if (!placa.trim()) {
      Alert.alert("Erro", "A placa é obrigatória.");
      return false;
    }
    if (!chassi.trim()) {
      Alert.alert("Erro", "O chassi é obrigatório.");
      return false;
    }
    if (!problema.trim()) {
      Alert.alert("Erro", "O problema é obrigatório.");
      return false;
    }
    return true;
  };

  const salvarMoto = async () => {
    if (!validarCampos()) return;

    setCarregando(true);
    try {
      const placaTrimmed = placa.trim().toUpperCase();
      const placaOriginal = moto.placa.toUpperCase();

      if (placaTrimmed !== placaOriginal) {
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
          setCarregando(false);
          return;
        }
      }

      const motoRef = doc(db, "motos", moto.id);
      await updateDoc(motoRef, {
        modelo: modelo.trim(),
        placa: placaTrimmed,
        chassi: chassi.trim(),
        problema: problema.trim(),
      });

      Alert.alert("Sucesso", "Moto atualizada com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Erro ao atualizar moto:", error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar a moto. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Editar Moto</Text>
      </View>

      <ScrollView style={styles.formulario}>
        <View style={styles.campo}>
          <Text style={styles.label}>Modelo</Text>
          <Select
            options={["MOTTU E", "MOTTU POP", "MOTTU SPORT"]}
            selected={modelo}
            onSelect={setModelo}
            placeholder="Selecione o modelo"
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Placa</Text>
          <TextInput
            style={styles.input}
            value={placa}
            onChangeText={setPlaca}
            placeholder="ABC-1234"
            placeholderTextColor="#666"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Chassi</Text>
          <TextInput
            style={styles.input}
            value={chassi}
            onChangeText={setChassi}
            placeholder="9BWHE21JX24060831"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Problema</Text>
          <TextInput
            style={[styles.input, styles.inputProblema]}
            value={problema}
            onChangeText={setProblema}
            placeholder="Descreva o problema da motocicleta"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={salvarMoto}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.textoBotao}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: "center",
    marginBottom: 30,
  },
  titulo: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 20,
  },
  formulario: {
    flex: 1,
  },
  campo: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  inputProblema: {
    height: 100,
    textAlignVertical: "top",
  },
  botao: {
    backgroundColor: "#00FF00",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  botaoDesabilitado: {
    backgroundColor: "#666",
  },
  textoBotao: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

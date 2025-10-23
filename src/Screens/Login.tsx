import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Form from "../Components/Forms";
import { useAuth } from "../Contexts/AuthContext";
import { RootStackParamList } from "../types/navigation";
import { UserForm } from "../types";

export default function Login() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, login } = useAuth();

  const [userForm, setUserForm] = useState<UserForm>();

  useEffect(() => {
    if (user) {
      navigation.navigate("Tabs");
    }
  }, [user, navigation]);

  const fazerLogin = async () => {
    if (!userForm?.email || !userForm?.password) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }

    try {
      await login(userForm.email, userForm.password);
      Alert.alert("Login", "Login feito com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", "Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.titulo}>ECHOBEACON</Text>
      <Text style={styles.subtitulo}>Entre para continuar</Text>

      <Form onUserChanged={setUserForm} />

      <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={() => navigation.navigate("Cadastro")}
      >
        <Text style={styles.textoBotaoSecundario}>Não tenho conta</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  titulo: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  rotulo: {
    color: "#fff",
    marginBottom: 4,
    marginTop: 10,
  },
  campo: {
    backgroundColor: "#3a3735",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
  },
  botao: {
    backgroundColor: "#00FF00",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 30,
  },
  textoBotao: {
    color: "#000",
    fontWeight: "bold",
  },
  botaoSecundario: {
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00FF00",
    paddingVertical: 8,
    borderRadius: 25,
  },
  textoBotaoSecundario: {
    color: "#00FF00",
    fontSize: 12,
  },
});

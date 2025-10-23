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

export default function Register() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, createAccount } = useAuth();

  const [userForm, setUserForm] = useState<UserForm>();

  useEffect(() => {
    if (user) {
      navigation.navigate("Tabs");
    }
  }, [user, navigation]);

  const criarConta = async () => {
    if (!userForm?.email || !userForm?.password) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }

    try {
      await createAccount(userForm.email, userForm.password);
      Alert.alert("Sucesso", "Conta criada com sucesso!");
    } catch (error: any) {
      let errorMessage = "Erro ao criar conta. Tente novamente.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido.";
      }

      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.titulo}>ECHOBEACON</Text>
      <Text style={styles.subtitulo}>Crie sua conta</Text>

      <Form onUserChanged={setUserForm} />

      <TouchableOpacity style={styles.botao} onPress={criarConta}>
        <Text style={styles.textoBotao}>Criar Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.textoBotaoSecundario}>Já tenho conta</Text>
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

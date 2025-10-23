import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../Contexts/AuthContext";
import { useProfile } from "../Contexts/ProfileContext";
import { RootStackParamList } from "../types/navigation";

export default function PerfilUsuario() {
  const { user, logout } = useAuth();
  const { updatePassword } = useProfile();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [modalSenhaVisible, setModalSenhaVisible] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleLogout = async () => {
    Alert.alert("Logout", "Deseja realmente sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            navigation.navigate("Login");
          } catch (error) {
            Alert.alert("Erro", "Erro ao fazer logout. Tente novamente.");
            console.error("Erro no logout:", error);
          }
        },
      },
    ]);
  };

  const handleUpdatePassword = async () => {
    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "A confirmação de senha não confere");
      return;
    }

    try {
      await updatePassword(senhaAtual, novaSenha);
      Alert.alert("Sucesso", "Senha atualizada com sucesso!");
      fecharModalSenha();
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const fecharModalSenha = () => {
    setModalSenhaVisible(false);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>MINHA CONTA</Text>

      <Text style={styles.rotulo}>Email</Text>
      <View style={styles.campoVisual}>
        <Text style={styles.textoCampo}>{user?.email || "Não informado"}</Text>
      </View>

      <Text style={styles.rotulo}>Senha</Text>
      <View style={styles.campoVisual}>
        <Text style={styles.textoCampo}>{"*".repeat(8)}</Text>
        <TouchableOpacity onPress={() => setModalSenhaVisible(true)}>
          <Ionicons name="pencil" size={16} color="#00FF00" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ff4444" />
        <Text style={styles.textoBotaoLogout}>Sair da Conta</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSenhaVisible}
        onRequestClose={fecharModalSenha}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Alterar Senha</Text>

            <Text style={styles.modalRotulo}>Senha Atual</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Digite sua senha atual"
              placeholderTextColor="#aaa"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              secureTextEntry
            />

            <Text style={styles.modalRotulo}>Nova Senha</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Digite a nova senha"
              placeholderTextColor="#aaa"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry
            />

            <Text style={styles.modalRotulo}>Confirmar Nova Senha</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Confirme a nova senha"
              placeholderTextColor="#aaa"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={fecharModalSenha}
              >
                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoSalvar}
                onPress={handleUpdatePassword}
              >
                <Text style={styles.textoBotaoSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  titulo: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  rotulo: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
    marginTop: 10,
  },
  campoVisual: {
    backgroundColor: "#3a3735",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textoCampo: {
    color: "#fff",
    fontSize: 14,
  },
  botaoLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#ff4444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 40,
  },
  textoBotaoLogout: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#121212",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
  },
  modalTitulo: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalRotulo: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: "#3a3735",
    color: "#fff",
    padding: 12,
    borderRadius: 6,
    fontSize: 14,
  },
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  botaoCancelar: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    paddingVertical: 12,
    borderRadius: 6,
    marginRight: 10,
    alignItems: "center",
  },
  textoBotaoCancelar: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "600",
  },
  botaoSalvar: {
    flex: 1,
    backgroundColor: "#00FF00",
    paddingVertical: 12,
    borderRadius: 6,
    marginLeft: 10,
    alignItems: "center",
  },
  textoBotaoSalvar: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
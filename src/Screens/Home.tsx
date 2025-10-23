import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>ECHOBEACON</Text>
      <Text style={styles.tempo}>10:31 AM</Text>

      <TouchableOpacity style={styles.botao}>
        <Text style={styles.botaoTexto}>Visualizar Motos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  tempo: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 40,
  },
  botao: {
    backgroundColor: "#00FF00",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
  },
  botaoTexto: {
    color: "#000",
    fontWeight: "bold",
  },
});

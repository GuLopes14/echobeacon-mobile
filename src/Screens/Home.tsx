import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000); // atualiza a cada segundo. Use 60000 para atualizar a cada minuto.

    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>ECHOBEACON</Text>
      <Text style={styles.tempo}>{time}</Text>

      <TouchableOpacity style={styles.botao}>
        <Text style={styles.botaoTexto}>Visualizar Motos</Text>
      </TouchableOpacity>
    </View>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
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

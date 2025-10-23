import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

type SelectProps = {
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
};

export default function Select({ options, selected, onSelect, placeholder }: SelectProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
        <Text style={selected ? styles.text : styles.placeholder}>
          {selected || placeholder || "Selecione..."}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Escolha uma opção</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.cancel} onPress={() => setVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#3a3735",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 6,
    minHeight: 48,
    justifyContent: "center",
  },
  placeholder: { color: "#999" },
  text: { color: "#fff" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: "50%",
  },
  sheetTitle: { color: "#fff", fontSize: 16, marginBottom: 10 },
  option: { paddingVertical: 12 },
  optionText: { color: "#fff" },
  cancel: { marginTop: 10, alignItems: "center" },
  cancelText: { color: "#00FF00" },
});

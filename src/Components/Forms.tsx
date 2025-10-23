import { useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { UserForm } from "../types";

type FormProps = {
  onUserChanged: (user: UserForm) => void;
};

const Form = ({ onUserChanged }: FormProps) => {
  const [user, setUser] = useState<UserForm>();

  const onHandleInput = (field: keyof UserForm) => {
    return (value: string) => {
      const updatedUser = { ...user!, [field]: value };
      setUser(updatedUser);
      onUserChanged(updatedUser);
    };
  };

  return (
    <>
      <Text style={styles.rotulo}>Email</Text>
      <TextInput
        style={styles.campo}
        placeholder="email@email.com"
        placeholderTextColor="#aaa"
        value={user?.email}
        onChangeText={onHandleInput("email")}
        keyboardType="email-address"
      />

      <Text style={styles.rotulo}>Senha</Text>
      <TextInput
        style={styles.campo}
        placeholder="Digite sua senha"
        placeholderTextColor="#aaa"
        value={user?.password}
        onChangeText={onHandleInput("password")}
        secureTextEntry
      />
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default Form;

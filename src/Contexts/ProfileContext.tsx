import * as firebase from "firebase/auth";
import { createContext, PropsWithChildren, useContext } from "react";
import { useAuth } from "./AuthContext";

type ProfileContextProps = {
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextProps>(
  {} as ProfileContextProps
);

const ProfileProvider = ({ children }: PropsWithChildren) => {
  const { user: currentUser } = useAuth();

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      throw new Error("Preencha todos os campos");
    }

    if (newPassword.length < 6) {
      throw new Error("A nova senha deve ter pelo menos 6 caracteres");
    }

    try {
      if (!currentUser || !currentUser.email) {
        throw new Error("Usuário não autenticado");
      }

      const credential = firebase.EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await firebase.reauthenticateWithCredential(currentUser, credential);

      await firebase.updatePassword(currentUser, newPassword);
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);

      switch (error.code) {
        case "auth/wrong-password":
          throw new Error("Senha atual incorreta.");
        case "auth/weak-password":
          throw new Error("A nova senha é muito fraca.");
        case "auth/requires-recent-login":
          throw new Error("Reautenticação requerida. Faça login novamente.");
        default:
          throw new Error("Erro ao atualizar senha. Tente novamente.");
      }
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        updatePassword,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile deve ser usado dentro de um ProfileProvider");
  }
  return context;
};

export { ProfileProvider, useProfile };

import * as firebase from "firebase/auth";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../../firebaseConfig";

type AuthContextProps = {
  createAccount: (username: string, password: string) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
  user?: firebase.User;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<firebase.User>();

  const createAccount = async (username: string, password: string) => {
    await firebase.createUserWithEmailAndPassword(auth, username, password);
  };

  const login = async (username: string, password: string) => {
    await firebase.signInWithEmailAndPassword(auth, username, password);
  };

  const logout = async () => {
    await firebase.signOut(auth);
  };

  useEffect(() => {
    const subscriber = firebase.onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    });
    return subscriber;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        createAccount,
        login,
        logout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };

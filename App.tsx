import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { AuthContext, AuthProvider } from "./src/Contexts/AuthContext";
import TabNavigator from "./src/Navigation/TabNavigator";
import Login from "./src/Screens/Login";
import Register from "./src/Screens/Register";
import CadastrarEchoBeacon from "./src/Screens/EchoBeacon";
import CadastroMoto from "./src/Screens/CadastroMoto";
import CadastroEchoBeacon from "./src/Screens/CadastroEchoBeacon";
import EditarMoto from "./src/Screens/EditarMoto";
import { ProfileProvider } from "./src/Contexts/ProfileContext";
import { MqttProvider } from "./src/mqtt/Context/MqttContext";

const Stack = createNativeStackNavigator();

function AppContent() {
  const { user } = useContext(AuthContext);

  const AuthStack = (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Register} />
    </Stack.Navigator>
  );

  const AppStack = (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="CadastrarEchoBeacon" component={CadastrarEchoBeacon} />
      <Stack.Screen name="CadastroMoto" component={CadastroMoto} />
      <Stack.Screen name="CadastroEchoBeacon" component={CadastroEchoBeacon} />
      <Stack.Screen name="EditarMoto" component={EditarMoto} />
    </Stack.Navigator>
  );

  return (
    <ProfileProvider>
      <MqttProvider>
        <NavigationContainer>
          {user ? AppStack : AuthStack}
        </NavigationContainer>
      </MqttProvider>
    </ProfileProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

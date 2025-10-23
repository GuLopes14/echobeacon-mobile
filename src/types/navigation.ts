import { Moto } from "./types";

export type RootStackParamList = {
  Login: undefined;
  Início: undefined;
  Cadastro: undefined;
  CadastrarEchoBeacon: undefined;
  CadastroMoto: undefined;
  CadastroEchoBeacon: undefined;
  EditarMoto: { moto: Moto };
  Tabs: undefined;
};

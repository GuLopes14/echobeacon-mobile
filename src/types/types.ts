type Moto = {
  id: string;
  modelo: string;
  placa: string;
  chassi: string;
  problema: string;
  status: "recepcao" | "patio";
  echoBeaconId?: string;
  echoBeaconCodigo?: string;
};

type User = {
  email: string;
};

type UserForm = {
  email: string;
  password: string;
};

export type { Moto, User, UserForm };

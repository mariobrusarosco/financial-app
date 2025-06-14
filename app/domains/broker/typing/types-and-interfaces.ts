export interface I_Broker {
  id: string;
  name: string;
  description: string;
  colors: string[];
  logo: string;
}

export interface I_Create_BrokerForm {
  name: string;
  description: string;
  colors: string[];
  logo: string;
}

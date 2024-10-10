import { Role } from "./role";

export interface User {
  id: number;
  name: string;
  email: string;
  cellPhone: string;
  password: string;
  birth: Date | null;
  countryCode: string; // Adiciona a propriedade countryCode
  roles: Role[]; // Adiciona a propriedade roles para incluir as funções associadas
}



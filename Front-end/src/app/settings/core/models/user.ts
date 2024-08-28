export interface User {
  id: number;
  name: string;
  email: string;
  cellPhone: string;
  password: string;
  birth: Date | null;
  countryCode: string; // Adiciona a propriedade countryCode
}

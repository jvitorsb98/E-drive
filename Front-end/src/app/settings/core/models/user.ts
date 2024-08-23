export class User {
  id!: number;
  name!: string;
  email!: string;
  cellPhone!: string;
  password!: string;
  birth: Date | null = null;
  countryCode!: string; // Adiciona a propriedade countryCode
}

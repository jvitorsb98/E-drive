export class User {
  id!: number;
  name!: string;
  email!: string;
  cellPhone!: string;
  password!: string;
  birth: Date | null = null;
}
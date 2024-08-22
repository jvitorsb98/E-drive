import { Brand } from "./brand";

export class Model {
  id!: number
  name!: string;
  brand!: Brand;
  activated!: boolean;
}
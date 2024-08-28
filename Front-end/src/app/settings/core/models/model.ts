import { Brand } from "./brand";

export interface Model {
  id: number
  name: string;
  brand: Brand;
  activated: boolean;
}
import { Category } from './category';
import { Autonomy } from "./autonomy";
import { Model } from "./model";
import { Propulsion } from "./propulsion";
import { VehicleType } from "./vehicle-type";

export class Vehicle {
  id!: number;
  motor!: string;
  version!: string;
  model!: Model;
  category!: Category;
  vehicleType!: VehicleType;
  propulsion!: Propulsion;
  autonomy!: Autonomy;
  activated!: boolean;
  year!: number;
}
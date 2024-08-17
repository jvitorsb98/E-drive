import { Category } from './Category';
import { Autonomy } from "./Autonomy";
import { Model } from "./Model";
import { Propulsion } from "./Propulsion";
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
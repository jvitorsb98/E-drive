import { Autonomy } from './Autonomy';
import { Category } from './Category';
import { Model } from "./Model";
import { Propulsion } from "./Propulsion";
import { VehicleType } from "./vehicle-type";

export class Vehicle {
  id!: number;
  motor!: string;
  version!: string;
  model!: Model;
  category!: Category;
  type!: VehicleType;
  propulsion!: Propulsion;
  autonomy!: Autonomy;
  activated!: boolean;
  year!: number;
}

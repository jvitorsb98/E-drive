import { Autonomy } from "./Autonomy";
import { Brand } from "./Brand";
import { Category } from "./Category";
import { Model } from "./Model";
import { Propulsion } from "./Propulsion";
import { VehicleType } from "./VehicleType";

export class Vehicle{
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
import { Autonomy, IAutonomyRequest } from './autonomy';
import { Category } from './category';
import { Model } from "./model";
import { Propulsion } from "./propulsion";
import { VehicleType } from "./vehicle-type";
export interface Vehicle {
  id: number;
  motor: string;
  version: string;
  model: Model;
  category: Category;
  type: VehicleType;
  propulsion: Propulsion;
  autonomy: Autonomy;
  activated: boolean;
  year: number;
}

export interface IVehicleRequest {
  motor: string;
  version: string;
  model: Model;
  category: Category;
  type: VehicleType;
  propulsion: Propulsion;
  autonomy: IAutonomyRequest;
  // activated: boolean;
  year: number;
}

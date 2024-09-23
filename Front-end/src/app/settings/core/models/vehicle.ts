import { IAutonomyRequest } from './autonomy';
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
  autonomy: IAutonomyRequest;
  activated: boolean;
  year: number;
}

export interface IVehicleRequest {
  motor: string;
  version: string;
  modelId: Number;
  categoryId: Number;
  typeId: Number;
  propulsionId: Number;
  year: number;
  dataRegisterAutonomy: IAutonomyRequest;
}

// Como tem que chegar no backend:
/*
{
  "motor": "Motor 1.6 Turbo",
  "version": "Sport",
  "modelId": 12345,
  "categoryId": 54321,
  "typeId": 9876,
  "propulsionId": 6789,
  "year": 2023,
  "dataRegisterAutonomy": {
    "mileagePerLiterRoad": 15.5,
    "mileagePerLiterCity": 12.0,
    "consumptionEnergetic": 7.8,
    "autonomyElectricMode": 100.0
  }
}
*/

import { UserVehicle } from "./user-vehicle";

export interface IVehicleDetails {
  vehicleModel: string;  // Modelo do veículo
  vehicleVersion: string; // Versão do veículo
  vehicleBrand: string;   // Marca do veículo
  userVehicle: UserVehicle; 
}

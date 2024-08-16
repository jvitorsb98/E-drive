import { User } from "./User";
import { Vehicle } from "./Vehicle";

export class UserVehicle {
  id!: number;
  userId!: number;
  vehicleId!: number;
  mileagePerLiterRoad!: number;
  mileagePerLiterCity!: number;
  consumptionEnergetic!: number;
  autonomyElectricMode!: number;
  activated!: boolean;
}
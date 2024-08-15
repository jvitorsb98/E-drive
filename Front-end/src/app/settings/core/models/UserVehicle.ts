import { User } from "./User";
import { Vehicle } from "./Vehicle";

export class UserVehicle {
  id!: number;
  user!: User;
  vehicle!: Vehicle;
  mileagePerLiterRoad!: number;
  mileagePerLiterCity!: number;
  consumptionEnergetic!: number;
  autonomyElectricMode!: number;
  activated!: boolean;
}
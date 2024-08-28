import { Vehicle } from './vehicle';
import { UserVehicle } from './user-vehicle';

export interface IVehicleWithUserVehicle extends Vehicle {
  userVehicle: UserVehicle;
}

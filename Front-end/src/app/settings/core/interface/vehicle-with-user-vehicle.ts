import { Vehicle } from '../models/vehicle';
import { UserVehicle } from '../models/user-vehicle';

export interface IVehicleWithUserVehicle extends Vehicle {
  userVehicle: UserVehicle;
}

import { Vehicle } from './vehicle';
import { UserVehicle } from './user-vehicle';

/**
 * Interface que representa um veículo associado a um usuário.
 * Extende a interface Vehicle e adiciona informações sobre a associação do usuário.
 */
export interface IVehicleWithUserVehicle extends Vehicle {
  /**
   * Associação do veículo com o usuário.
   * @type {UserVehicle}
   */
  userVehicle: UserVehicle;
}

/**
 * Interface que representa a associação entre um usuário e um veículo.
 */
export interface UserVehicle {
  /**
   * Identificador único da associação usuário-veículo.
   * @type {number}
   */
  id: number;

  /**
   * Identificador do usuário associado ao veículo.
   * @type {number}
   */
  userId: number;

  /**
   * Identificador do veículo associado ao usuário.
   * @type {number}
   */
  vehicleId: number;

  /**
   * Quilometragem por litro em estrada.
   * @type {number}
   */
  mileagePerLiterRoad: number;

  /**
   * Quilometragem por litro na cidade.
   * @type {number}
   */
  mileagePerLiterCity: number;

  /**
   * Consumo energético do veículo.
   * @type {number}
   */
  consumptionEnergetic: number;

  /**
   * Autonomia em modo elétrico.
   * @type {number}
   */
  autonomyElectricMode: number;

  /**
   * Capacidade da bateria do veículo em kWh.
   * @type {number}
   */
  batteryCapacity: number;

  /**
   * Indica se a associação usuário-veículo está ativada.
   * @type {boolean}
   */
  activated: boolean;
}

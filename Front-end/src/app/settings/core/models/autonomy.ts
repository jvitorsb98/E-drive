/**
 * Interface que representa a autonomia de um veículo.
 */
export interface Autonomy {
  /**
   * Identificador único da autonomia.
   * @type {number}
   */
  id: number;

  /**
   * Consumo de combustível em quilômetros por litro em estrada.
   * @type {number}
   */
  mileagePerLiterRoad: number;

  /**
   * Consumo de combustível em quilômetros por litro na cidade.
   * @type {number}
   */
  mileagePerLiterCity: number;

  /**
   * Consumo energético em unidades apropriadas (ex: kWh).
   * @type {number}
   */
  consumptionEnergetic: number;

  /**
   * Autonomia em modo elétrico, em quilômetros.
   * @type {number}
   */
  autonomyElectricMode: number;
}

/**
 * Interface que representa os dados de requisição para criação ou atualização da autonomia de um veículo.
 */
export interface IAutonomyRequest {
  /**
   * Consumo de combustível em quilômetros por litro em estrada.
   * @type {number}
   */
  mileagePerLiterRoad: number;

  /**
   * Consumo de combustível em quilômetros por litro na cidade.
   * @type {number}
   */
  mileagePerLiterCity: number;

  /**
   * Consumo energético em unidades apropriadas (ex: kWh).
   * @type {number}
   */
  consumptionEnergetic: number;

  /**
   * Autonomia em modo elétrico, em quilômetros.
   * @type {number}
   */
  autonomyElectricMode: number;
}

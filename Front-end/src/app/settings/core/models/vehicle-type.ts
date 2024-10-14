/**
 * Interface que representa um tipo de veículo.
 */
export interface VehicleType {
  /**
   * Identificador único do tipo de veículo.
   * @type {number}
   */
  id: number;

  /**
   * Nome do tipo de veículo.
   * @type {string}
   */
  name: string;

  /**
   * Indica se o tipo de veículo está ativado.
   * @type {boolean}
   */
  activated: boolean;
}

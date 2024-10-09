/**
 * Interface que representa uma propulsão de veículo.
 */
export interface Propulsion {
  /**
   * Identificador único da propulsão.
   * @type {number}
   */
  id: number;

  /**
   * Nome da propulsão.
   * @type {string}
   */
  name: string;

  /**
   * Indica se a propulsão está ativada.
   * @type {boolean}
   */
  activated: boolean;
}

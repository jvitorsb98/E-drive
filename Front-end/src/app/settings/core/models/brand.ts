/**
 * Interface que representa uma marca de veículo.
 */
export interface Brand {
  /**
   * Identificador único da marca.
   * @type {number}
   */
  id: number;

  /**
   * Nome da marca.
   * @type {string}
   */
  name: string;

  /**
   * Indica se a marca está ativada ou desativada.
   * @type {boolean}
   */
  activated: boolean;
}

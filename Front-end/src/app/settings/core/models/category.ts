/**
 * Interface que representa uma categoria de veículo.
 */
export interface Category {
  /**
   * Identificador único da categoria.
   * @type {number}
   */
  id: number;

  /**
   * Nome da categoria.
   * @type {string}
   */
  name: string;

  /**
   * Indica se a categoria está ativada ou desativada.
   * @type {boolean}
   */
  activated: boolean;
}

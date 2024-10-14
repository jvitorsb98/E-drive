import { Brand } from "./brand";

/**
 * Interface que representa um modelo de veículo.
 */
export interface Model {
  /**
   * Identificador único do modelo.
   * @type {number}
   */
  id: number;

  /**
   * Nome do modelo de veículo.
   * @type {string}
   */
  name: string;

  /**
   * Marca associada ao modelo.
   * @type {Brand}
   */
  brand: Brand;

  /**
   * Indica se o modelo está ativado ou desativado.
   * @type {boolean}
   */
  activated: boolean;
}

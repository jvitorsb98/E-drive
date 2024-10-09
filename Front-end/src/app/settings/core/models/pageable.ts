/**
 * Interface que representa informações de paginação.
 */
export interface IPageable {
  /**
   * Número da página atual.
   * @type {number}
   */
  pageNumber: number;

  /**
   * Tamanho da página, ou seja, o número de itens por página.
   * @type {number}
   */
  pageSize: number;

  /**
   * Informações sobre a ordenação dos itens na página.
   * @type {{ empty: boolean; sorted: boolean; unsorted: boolean; }}
   */
  sort: {
    /**
     * Indica se a ordenação está vazia.
     * @type {boolean}
     */
    empty: boolean;

    /**
     * Indica se os itens estão ordenados.
     * @type {boolean}
     */
    sorted: boolean;

    /**
     * Indica se os itens não estão ordenados.
     * @type {boolean}
     */
    unsorted: boolean;
  };

  /**
   * O deslocamento (offset) dos itens da página atual em relação ao conjunto total.
   * @type {number}
   */
  offset: number;

  /**
   * Indica se a paginação está habilitada.
   * @type {boolean}
   */
  paged: boolean;

  /**
   * Indica se a paginação está desabilitada.
   * @type {boolean}
   */
  unpaged: boolean;
}



import { IPageable } from "./pageable";

/**
 * Interface que representa a estrutura de uma resposta da API.
 *
 * @template T - O tipo do conteúdo retornado pela API.
 */
export interface IApiResponse<T> {
  /**
   * O conteúdo da resposta da API.
   * 
   * **Nota:** deve ser do tipo T e não T[].
   */
  content: T; 
  
  /**
   * Informações de paginação da resposta.
   */
  pageable: IPageable;
  
  /**
   * Indica se esta é a última página de resultados.
   * @type {boolean}
   */
  last: boolean;
  
  /**
   * O número total de páginas disponíveis.
   * @type {number}
   */
  totalPages: number;
  
  /**
   * O número total de elementos na resposta.
   * @type {number}
   */
  totalElements: number;
  
  /**
   * O número da página atual.
   * @type {number}
   */
  number: number;
  
  /**
   * O número de elementos na página atual.
   * @type {number}
   */
  numberOfElements: number;
  
  /**
   * O tamanho da página, ou seja, o número máximo de elementos que podem ser retornados.
   * @type {number}
   */
  size: number;
  
  /**
   * Informações sobre a ordenação dos elementos.
   */
  sort: {
    /**
     * Indica se a ordenação está vazia.
     * @type {boolean}
     */
    empty: boolean;

    /**
     * Indica se os elementos estão ordenados.
     * @type {boolean}
     */
    sorted: boolean;

    /**
     * Indica se a ordenação não foi aplicada.
     * @type {boolean}
     */
    unsorted: boolean;
  };
  
  /**
   * Indica se esta é a primeira página de resultados.
   * @type {boolean}
   */
  first: boolean;
  
  /**
   * Indica se a resposta contém elementos.
   * @type {boolean}
   */
  empty: boolean;
}

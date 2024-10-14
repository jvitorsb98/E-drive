import { Sort } from "@angular/material/sort";
import { IPageable } from "./pageable";

/**
 * Interface que representa uma resposta paginada de uma coleção de dados.
 * 
 * @template T - O tipo dos elementos contidos na resposta paginada.
 */
export interface PaginatedResponse<T> {
  /**
   * Conteúdo da resposta, representando os itens da página atual.
   * @type {T[]}
   */
  content: T[];

  /**
   * Informações de paginação associadas à resposta.
   * @type {IPageable}
   */
  pageable: IPageable;

  /**
   * Indica se esta é a última página.
   * @type {boolean}
   */
  last: boolean;

  /**
   * Total de páginas disponíveis na coleção.
   * @type {number}
   */
  totalPages: number;

  /**
   * Total de elementos disponíveis na coleção.
   * @type {number}
   */
  totalElements: number;

  /**
   * Indica se esta é a primeira página.
   * @type {boolean}
   */
  first: boolean;

  /**
   * Número de itens por página.
   * @type {number}
   */
  size: number;

  /**
   * Número da página atual.
   * @type {number}
   */
  number: number;

  /**
   * Informações sobre a ordenação dos itens na resposta.
   * @type {Sort}
   */
  sort: Sort;

  /**
   * Número de elementos na página atual.
   * @type {number}
   */
  numberOfElements: number;

  /**
   * Indica se a página está vazia.
   * @type {boolean}
   */
  empty: boolean;
}

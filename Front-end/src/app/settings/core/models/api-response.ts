import { IPageable } from "./pageable";

export interface IApiResponse<T> {
  content: T; // Nota: deve ser T e não T[]
  pageable: IPageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  number: number;
  numberOfElements: number;
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  empty: boolean;
}
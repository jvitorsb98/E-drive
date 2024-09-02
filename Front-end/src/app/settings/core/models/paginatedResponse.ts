import { Sort } from "@angular/material/sort";
import { IPageable } from "./pageable";

export interface PaginatedResponse<T> {
  content: T[];
  pageable: IPageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}
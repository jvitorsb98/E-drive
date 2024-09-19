import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Category } from '../../models/category';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categoryUrl!: string;

  constructor(private http: HttpClient) {
    this.categoryUrl = `${environment.apiUrl}/api/v1/categories`;
  }

  getAll(): Observable<PaginatedResponse<Category>> {
    return this.http.get<PaginatedResponse<Category>>(this.categoryUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Ocorreu um erro ao buscar as categorias. Por favor, tente novamente mais tarde.'));
    // pt-br msg: 'Ocorreu um erro ao buscar as categorias. Por favor, tente novamente mais tarde.'
    // en-us msg: 'An error occurred while fetching categories. Please try again later.'
  }
}

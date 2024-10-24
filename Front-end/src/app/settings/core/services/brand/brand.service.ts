import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Brand } from '../../models/brand';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private brandUrl: string;

  constructor(private http: HttpClient) {
    this.brandUrl = `${environment.apiUrl}/api/v1/brands`;
  }

  getAll(page: number, size: number): Observable<PaginatedResponse<Brand>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'name,asc'); // Ordenação pelo nome em ordem ascendente

    return this.http.get<PaginatedResponse<Brand>>(this.brandUrl, { params }).pipe(
      catchError(() => throwError(() => new Error('Failed to load brands')))
    );
  }

  // Método para obter detalhes de uma marca específica
  getBrandDetails(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.brandUrl}/${id}`);
  }

  register(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(this.brandUrl, brand).pipe(
      map(response => {
        console.log(response + 'O')
        return response;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  update(brand: Brand): Observable<Brand> {
    // Verifica se a brand possui um ID e outros campos obrigatórios antes de fazer a requisição
    if (!brand.id || !brand.name) {
      return throwError(() => new Error('Dados da marca são insuficientes para atualização.'));
    }

    return this.http.put<Brand>(`${this.brandUrl}/${brand.id}`, brand).pipe(
      map(response => {
        return response;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.brandUrl}/${id}`);
  }

  activated(id: number): Observable<void> {
    return this.http.put<void>(`${this.brandUrl}/${id}/activate`, null).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

}

import { HttpClient } from '@angular/common/http';
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

  // Método para obter todas as marcas
  getAllBrands(): Observable<PaginatedResponse<Brand>> {
    return this.http.get<PaginatedResponse<Brand>>(this.brandUrl);
  }

  getAll(): Observable<PaginatedResponse<Brand>> {
    return this.http.get<PaginatedResponse<Brand>>(`${this.brandUrl}?size=1000`);
  }

  // Método para obter detalhes de uma marca específica
  getBrandDetails(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.brandUrl}/${id}`);
  }

  registerBrand(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(this.brandUrl, brand).pipe(
      map(response => {
        return response;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  updateBrand(brand: Brand): Observable<Brand> {
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

  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.brandUrl}/${id}`);
  }
}

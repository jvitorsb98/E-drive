import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Brand } from '../../models/brand';
import { AuthService } from '../../security/services/auth/auth.service';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private brandUrl: string;

  private authToken: string | null;


  constructor(private http: HttpClient, private authService: AuthService) {
    this.brandUrl = `${environment.apiUrl}/api/v1/brands`;

    this.authToken = this.authService.getToken();
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
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}` // Utilize o token mockado ou real
    });

    return this.http.get<Brand>(`${this.brandUrl}/${id}`, { headers });
  }

  registerBrand(brand: Brand): Observable<Brand> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<Brand>(this.brandUrl, brand, { headers }).pipe(
      map(response => {
        console.log('Brand cadastrada com sucesso:', response);
        return response;
      }),
      catchError(e => {
        console.error('Erro ao cadastrar brand:', e.error ? e.error : e.message);
        return throwError(() => e);
      })
    );
  }

  updateBrand(brand: Brand): Observable<Brand> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });
    console.log("Brand no service:", brand);
    // Verifica se a brand possui um ID e outros campos obrigatórios antes de fazer a requisição
    if (!brand.id || !brand.name) {
      return throwError(() => new Error('Dados da marca são insuficientes para atualização.'));
    }

    return this.http.put<Brand>(`${this.brandUrl}/${brand.id}`, brand, { headers }).pipe(
      map(response => {
        console.log("Dados da marca atualizada:", response);
        return response;
      }),
      catchError(e => {
        console.error('Erro ao atualizar a marca:', e.error ? e.error : e.message);
        return throwError(() => e);
      })
    );
  }

  deleteBrand(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<void>(`${this.brandUrl}/${id}`, { headers });
  }
}

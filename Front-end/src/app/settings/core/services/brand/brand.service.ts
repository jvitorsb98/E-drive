import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Brand } from '../../models/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private brandUrl: string;

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzI0MTg0MTEwLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.7wXWwVViNPcDHAfn0HAT5i0cHXwM-N_Q_szZfVVofOE';

  constructor(private http: HttpClient) {
    this.brandUrl = `${environment.apiUrl}/api/v1/brands`; 
  }

  // Método para obter todas as marcas
  getAllBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.brandUrl);
  }

  // Método para obter detalhes de uma marca específica
  getBrandDetails(id: number): Observable<Brand> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}` // Utilize o token mockado ou real
    });

    return this.http.get<Brand>(`${this.brandUrl}/${id}`, { headers });
  }
}

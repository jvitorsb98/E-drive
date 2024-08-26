import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Model } from '../../models/model';
import { AuthService } from '../../security/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private modelUrl: string;

  authToken: string | null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.modelUrl = `${environment.apiUrl}/api/v1/models`;

    this.authToken = this.authService.getToken();
  }

  getModelsByBrandId(brandId: number): Observable<Model[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
    todo: // Trocar por um interceptor para adicionar o token ao cabecalho
    return this.http.get<Model[]>(`${this.modelUrl}/brand/${brandId}`, { headers });
  }
}
